"""
Multivariate copula fitting — synthetic event sampling and return period analysis.

Two complementary tools
-----------------------
1. **FloodEventCopula** (openturns)
   Gaussian copula for synthetic flood event generation.  Fits BIC-selected
   marginals and a Normal copula, then samples arbitrary synthetic catalogues.

2. **BivariateCopula / TrivariateCopula** (scipy only)
   Archimedean copulas (Gumbel, Clayton, Frank) for compound-flood return
   period analysis.  Computes AND / OR iso-return-period contours in physical
   variable space — the standard output for bivariate frequency analysis.

   Typical application:
     River discharge Q + storm surge SL + catchment rainfall P
     → joint return periods for coastal compound flooding events.

   Reference:
     Salvadori et al. (2016) Multivariate return periods in hydrology.
     Serinaldi (2015) Dismissing return periods.
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def _require_ot():
    try:
        import openturns as ot
        return ot
    except ImportError as exc:
        raise ImportError(
            "openturns is required for copula fitting.\n"
            "Install it with: conda install -c conda-forge openturns"
        ) from exc


# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------

def fit_marginal(data, variable_name=""):
    """
    Select the best-fitting univariate distribution for *data* by BIC.

    Args:
        data:          1-D array-like of observed values.
        variable_name: Label used in printed output (optional).

    Returns:
        dist:   Fitted openturns distribution object.
        sample: openturns Sample of the input data.
    """
    ot = _require_ot()
    sample = ot.Sample([[float(v)] for v in data])
    factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
    dist, _ = ot.FittingTest.BestModelBIC(sample, factories)
    label = f" [{variable_name}]" if variable_name else ""
    print(f"Best marginal{label}: {dist}")
    return dist, sample


def fit_discrete_marginal(data):
    """
    Fit a discrete (empirical) distribution to integer-valued *data*.

    Used for variables such as hydrograph shape type.

    Returns:
        dist:   openturns UserDefined distribution.
        sample: openturns Sample.
    """
    ot = _require_ot()
    sample = ot.Sample([[float(v)] for v in data])
    dist = ot.UserDefinedFactory().build(sample)
    return dist, sample


# ---------------------------------------------------------------------------
# Public class
# ---------------------------------------------------------------------------

class FloodEventCopula:
    """
    Multivariate Normal copula for synthetic flood event generation.

    Fits marginal distributions to each variable of the observed flood event
    table and a Normal copula to their joint dependence. Once fitted, an
    arbitrary number of synthetic events can be sampled.

    Parameters
    ----------
    continuous_vars : list of str
        Names of continuous variables (e.g. ``['Qmax', 'Qmed', 'Duracion']``).
        Each gets an automatic BIC-selected marginal distribution.
    discrete_vars : list of str
        Names of discrete / categorical variables (e.g. ``['shape_type']``).
        Each gets an empirical discrete marginal.

    Examples
    --------
    >>> copula = FloodEventCopula(
    ...     continuous_vars=['Qmax', 'Qmed', 'Duracion'],
    ...     discrete_vars=['shape_type'],
    ... )
    >>> copula.fit(classified_events_df)
    >>> synthetic = copula.sample(5000)
    """

    def __init__(
        self,
        continuous_vars=("Qmax", "Qmed", "Duracion"),
        discrete_vars=("shape_type",),
    ):
        self.continuous_vars = list(continuous_vars)
        self.discrete_vars = list(discrete_vars)
        self._marginals = {}   # {var: (dist, sample)}
        self._copula = None
        self._all_vars = self.continuous_vars + self.discrete_vars

    # ------------------------------------------------------------------
    # Fitting
    # ------------------------------------------------------------------

    def fit(self, data):
        """
        Fit marginal distributions and the Normal copula to *data*.

        Args:
            data: pd.DataFrame with one column per variable in
                  ``continuous_vars`` + ``discrete_vars``.

        Returns:
            self (for chaining).
        """
        ot = _require_ot()

        # 1. Fit marginals and transform to uniform space
        u_cols = []
        for var in self.continuous_vars:
            dist, sample = fit_marginal(data[var].values, variable_name=var)
            self._marginals[var] = (dist, sample)
            u_cols.append(np.array(dist.computeCDF(sample)).flatten())

        for var in self.discrete_vars:
            dist, sample = fit_discrete_marginal(data[var].values)
            self._marginals[var] = (dist, sample)
            u_cols.append(np.array(dist.computeCDF(sample)).flatten())

        # 2. Fit Normal copula to joint uniform margins
        U = np.vstack(u_cols).T          # (n_obs, n_vars)
        U = np.clip(U, 1e-6, 1 - 1e-6)  # numerical stability
        ot_U = ot.Sample(U.tolist())
        self._copula = ot.NormalCopulaFactory().build(ot_U)
        print(f"Fitted copula: {self._copula}")
        return self

    # ------------------------------------------------------------------
    # Sampling
    # ------------------------------------------------------------------

    def sample(self, n_samples):
        """
        Draw *n_samples* synthetic events from the fitted copula model.

        Args:
            n_samples: Number of synthetic events to generate.

        Returns:
            pd.DataFrame with the same column names as the fitted data.
        """
        if self._copula is None:
            raise RuntimeError("Call fit() before sample().")

        ot = _require_ot()
        u_synth = np.array(self._copula.getSample(n_samples))  # (n, n_vars)

        result = {}
        for k, var in enumerate(self._all_vars):
            dist, _ = self._marginals[var]
            result[var] = np.array([
                float(dist.computeQuantile(float(v))[0])
                for v in u_synth[:, k]
            ])

        return pd.DataFrame(result)

    # ------------------------------------------------------------------
    # Diagnostics
    # ------------------------------------------------------------------

    def plot_marginals(self):
        """Plot ECDF vs fitted CDF for every variable."""
        try:
            import openturns.viewer as otv
            import openturns as ot
        except ImportError:
            raise ImportError("openturns is required for plotting.")

        for var, (dist, sample) in self._marginals.items():
            g = ot.UserDefined(sample).drawCDF()
            cdf = dist.drawCDF()
            cdf.setColors(["steelblue"])
            g.add(cdf)
            g.setTitle(f"Marginal fit — {var}")
            g.setLegends(["ECDF", dist.getName()])
            g.setXTitle(var)
            otv.View(g)

    def plot_dependence(self, observed, synthetic):
        """
        Scatter plots comparing observed vs synthetic event pairs.

        Args:
            observed:  pd.DataFrame of observed events.
            synthetic: pd.DataFrame returned by :meth:`sample`.
        """
        import matplotlib.pyplot as plt

        pairs = [
            (self.continuous_vars[i], self.continuous_vars[j])
            for i in range(len(self.continuous_vars))
            for j in range(i + 1, len(self.continuous_vars))
        ]
        if not pairs:
            return

        fig, axes = plt.subplots(1, len(pairs), figsize=(6 * len(pairs), 5))
        if len(pairs) == 1:
            axes = [axes]

        for ax, (xv, yv) in zip(axes, pairs):
            ax.scatter(synthetic[xv], synthetic[yv], s=8, alpha=0.3,
                       color="steelblue", label="Synthetic")
            ax.scatter(observed[xv], observed[yv], s=30, alpha=0.8,
                       color="orange", label="Observed")
            ax.set_xlabel(xv)
            ax.set_ylabel(yv)
            ax.grid(alpha=0.3)

        axes[0].legend()
        fig.suptitle("Observed vs Synthetic — dependence structure", fontsize=13)
        fig.tight_layout()
        plt.show()


# ============================================================================
# Bivariate & Trivariate return period analysis (Archimedean copulas)
# ============================================================================

# ── Copula CDFs ──────────────────────────────────────────────────────────────

def _eps(u):
    return np.clip(u, 1e-10, 1 - 1e-10)


def _gumbel_cdf(u, v, theta):
    """Gumbel–Hougaard copula (upper tail dependence, θ ≥ 1)."""
    u, v = _eps(u), _eps(v)
    return np.exp(-((-np.log(u)) ** theta + (-np.log(v)) ** theta) ** (1.0 / theta))


def _gumbel_cdf_3d(u, v, w, theta):
    u, v, w = _eps(u), _eps(v), _eps(w)
    return np.exp(-((-np.log(u)) ** theta + (-np.log(v)) ** theta + (-np.log(w)) ** theta) ** (1.0 / theta))


def _clayton_cdf(u, v, theta):
    """Clayton copula (lower tail dependence, θ > 0)."""
    u, v = _eps(u), _eps(v)
    return np.maximum(u ** (-theta) + v ** (-theta) - 1.0, 0.0) ** (-1.0 / theta)


def _clayton_cdf_3d(u, v, w, theta):
    u, v, w = _eps(u), _eps(v), _eps(w)
    return np.maximum(u ** (-theta) + v ** (-theta) + w ** (-theta) - 2.0, 0.0) ** (-1.0 / theta)


def _frank_cdf(u, v, theta):
    """Frank copula (symmetric, no tail dependence, θ ≠ 0)."""
    u, v = _eps(u), _eps(v)
    if abs(theta) < 1e-8:
        return u * v
    num = (np.exp(-theta * u) - 1.0) * (np.exp(-theta * v) - 1.0)
    den = np.exp(-theta) - 1.0
    return -1.0 / theta * np.log(1.0 + num / den)


def _frank_cdf_3d(u, v, w, theta):
    u, v, w = _eps(u), _eps(v), _eps(w)
    if abs(theta) < 1e-8:
        return u * v * w
    e0 = np.exp(-theta) - 1.0
    num = (np.exp(-theta * u) - 1.0) * (np.exp(-theta * v) - 1.0) * (np.exp(-theta * w) - 1.0)
    return -1.0 / theta * np.log(1.0 + num / e0 ** 2)


_COPULA_CDF = {
    "gumbel":  _gumbel_cdf,
    "clayton": _clayton_cdf,
    "frank":   _frank_cdf,
}
_COPULA_CDF_3D = {
    "gumbel":  _gumbel_cdf_3d,
    "clayton": _clayton_cdf_3d,
    "frank":   _frank_cdf_3d,
}


# ── Parameter estimation via Kendall's τ ─────────────────────────────────────

def _kendall_tau(x, y):
    """Kendall's rank correlation τ."""
    from scipy.stats import kendalltau
    return kendalltau(x, y).statistic


def _tau_to_theta(tau, family):
    """Convert Kendall τ to Archimedean copula parameter θ."""
    from scipy.optimize import brentq

    if family == "gumbel":
        return max(1.0 / (1.0 - tau), 1.001)  # θ = 1/(1-τ), θ ≥ 1

    if family == "clayton":
        return max(2.0 * tau / (1.0 - tau), 1e-4)  # θ = 2τ/(1-τ)

    if family == "frank":
        # τ = 1 - 4/θ * (1 - 1/θ * ∫₀^θ t/(e^t-1) dt)
        # Solve numerically via Debye function approximation
        def _frank_tau(theta):
            if abs(theta) < 1e-8:
                return 0.0
            from scipy.integrate import quad
            D1 = quad(lambda t: t / (np.exp(t) - 1.0), 0, theta)[0] / theta
            return 1.0 - 4.0 / theta * (1.0 - D1)
        try:
            return brentq(lambda t: _frank_tau(t) - tau, 1e-4, 50.0)
        except ValueError:
            return 5.0  # fallback

    raise ValueError(f"Unknown copula family: {family!r}")


# ── Marginal fitting (scipy, no extra deps) ──────────────────────────────────

def _fit_marginal_scipy(data, families=("gev", "lognorm", "gamma")):
    """Fit univariate distributions to *data* and return the best by AIC."""
    from scipy import stats

    _SCIPY_DISTS = {
        "gev":     stats.genextreme,
        "gumbel":  stats.gumbel_r,
        "lognorm": stats.lognorm,
        "gamma":   stats.gamma,
        "expon":   stats.expon,
        "norm":    stats.norm,
    }
    best, best_aic = None, np.inf
    for name in families:
        dist = _SCIPY_DISTS[name]
        try:
            params = dist.fit(data)
            logL   = dist.logpdf(data, *params).sum()
            aic    = 2 * len(params) - 2 * logL
            if aic < best_aic:
                best_aic = aic
                best = (dist, params, name)
        except Exception:
            continue
    if best is None:
        d, p = stats.lognorm, stats.lognorm.fit(data)
        best = (d, p, "lognorm")
    print(f"  Best marginal: {best[2]}  (AIC={best_aic:.1f})")
    return best[0], best[1], best[2], best_aic   # (dist, params, name, aic)


# ── BivariateCopula ───────────────────────────────────────────────────────────

class BivariateCopula:
    """
    Bivariate Archimedean copula for compound-flood return period analysis.

    Fits univariate marginals (GEV / lognormal / gamma via AIC) and a
    parametric copula (Gumbel, Clayton or Frank) calibrated by Kendall's τ.

    Computes AND and OR iso-return-period contours in the original variable
    space — the standard plot in bivariate flood frequency analysis.

    Args:
        family: ``'gumbel'`` | ``'clayton'`` | ``'frank'``.
        marginal_families: Tuple of candidate distribution names passed to
            each marginal fit (``'gev'``, ``'gumbel'``, ``'lognorm'``,
            ``'gamma'``, ``'expon'``).

    Example::

        cop = BivariateCopula(family='gumbel')
        cop.fit(Q_annual_max, SL_annual_max,
                labels=('Peak discharge Q (m³/s)', 'Storm surge SL (m)'))
        cop.plot_contours([2, 5, 10, 25, 50, 100], scenario='both')
    """

    def __init__(self, family="gumbel",
                 marginal_families=("gev", "lognorm", "gamma")):
        self.family           = family
        self.marginal_families = marginal_families
        self._cdf_fn          = _COPULA_CDF[family]
        self._theta           = None
        self._mx = self._my  = None   # (scipy_dist, params)
        self._labels          = ("X", "Y")
        self._x = self._y    = None   # raw data

    # ------------------------------------------------------------------
    def fit(self, x, y, labels=("X", "Y")):
        """
        Fit marginals and copula parameter to observed paired data.

        Args:
            x, y:   1-D array-like of paired observations (same length).
            labels: Variable labels for plotting.

        Returns:
            self
        """
        x, y           = np.asarray(x, float), np.asarray(y, float)
        self._x, self._y = x, y
        self._labels   = labels

        print(f"Fitting BivariateCopula [{self.family}]  n={len(x)}")
        print(f"  Marginal X ({labels[0]}):")
        self._mx = _fit_marginal_scipy(x, self.marginal_families)
        print(f"  Marginal Y ({labels[1]}):")
        self._my = _fit_marginal_scipy(y, self.marginal_families)

        tau          = _kendall_tau(x, y)
        self._tau    = tau
        self._theta  = _tau_to_theta(tau, self.family)
        self._family_x, self._aic_x = self._mx[2], self._mx[3]
        self._family_y, self._aic_y = self._my[2], self._my[3]
        print(f"  Kendall τ = {tau:.3f}  →  θ = {self._theta:.3f}")
        return self

    # ------------------------------------------------------------------
    def _u(self, x):
        d, p = self._mx[0], self._mx[1]
        return np.clip(d.cdf(x, *p), 1e-10, 1 - 1e-10)

    def _v(self, y):
        d, p = self._my[0], self._my[1]
        return np.clip(d.cdf(y, *p), 1e-10, 1 - 1e-10)

    def _x_ppf(self, u):
        d, p = self._mx[0], self._mx[1]
        return d.ppf(u, *p)

    def _y_ppf(self, v):
        d, p = self._my[0], self._my[1]
        return d.ppf(v, *p)

    def cdf(self, u, v):
        """Copula CDF at uniform margins u, v."""
        return self._cdf_fn(u, v, self._theta)

    def joint_exceedance(self, x0, y0, scenario="OR"):
        """P(X > x0 AND/OR Y > y0)."""
        u, v = self._u(x0), self._v(y0)
        if scenario == "OR":
            return 1.0 - self.cdf(u, v)
        if scenario == "AND":
            return 1.0 - u - v + self.cdf(u, v)
        raise ValueError("scenario must be 'OR' or 'AND'")

    def return_period(self, x0, y0, scenario="OR"):
        """T = 1 / P(exceedance)."""
        p = self.joint_exceedance(x0, y0, scenario)
        return 1.0 / np.maximum(p, 1e-12)

    # ------------------------------------------------------------------
    def return_period_contour(self, T, scenario="OR", n_pts=300):
        """
        Iso-return-period curve in physical (x, y) space.

        For OR:  C(u,v) = 1 − 1/T
        For AND: 1 − u − v + C(u,v) = 1/T

        Returns:
            x_curve, y_curve: arrays of physical coordinates.
        """
        from scipy.optimize import brentq

        target = 1.0 / T

        x_out, y_out = [], []
        for u in np.linspace(1e-4, 1 - 1e-4, n_pts):
            try:
                if scenario == "OR":
                    level = 1.0 - target
                    if self._cdf_fn(u, 1 - 1e-10, self._theta) < level:
                        continue
                    if self._cdf_fn(u, 1e-10, self._theta) > level:
                        continue
                    v = brentq(
                        lambda vv: self._cdf_fn(u, vv, self._theta) - level,
                        1e-10, 1 - 1e-10, xtol=1e-8,
                    )
                else:  # AND
                    if (1 - u - 1e-10 + self._cdf_fn(u, 1e-10, self._theta)) < target:
                        continue
                    if (1 - u - (1-1e-10) + self._cdf_fn(u, 1-1e-10, self._theta)) > target:
                        continue
                    v = brentq(
                        lambda vv: 1.0 - u - vv + self._cdf_fn(u, vv, self._theta) - target,
                        1e-10, 1 - 1e-10, xtol=1e-8,
                    )
                x_out.append(self._x_ppf(u))
                y_out.append(self._y_ppf(v))
            except Exception:
                continue

        return np.array(x_out), np.array(y_out)

    # ------------------------------------------------------------------
    def plot_contours(self, T_list=(2, 5, 10, 25, 50, 100),
                      scenario="both", data=True, ax=None, figsize=(13, 5)):
        """
        Standard bivariate return period plot.

        Args:
            T_list:   Return periods to draw.
            scenario: ``'OR'``, ``'AND'``, or ``'both'`` (side-by-side).
            data:     If True, scatter the fitted observations.
            ax:       Existing Axes (only used when scenario != 'both').
        """
        import matplotlib.pyplot as plt
        import matplotlib.cm as cm

        scenarios = ["OR", "AND"] if scenario == "both" else [scenario]
        if scenario == "both":
            fig, axes = plt.subplots(1, 2, figsize=figsize, sharey=True)
        else:
            if ax is None:
                fig, axes = plt.subplots(figsize=(6, 5))
            else:
                axes = ax
            axes = [axes]

        colors = cm.plasma_r(np.linspace(0.15, 0.9, len(T_list)))

        for ax_, scen in zip(axes, scenarios):
            for col, T in zip(colors, T_list):
                xc, yc = self.return_period_contour(T, scenario=scen)
                if len(xc):
                    ax_.plot(xc, yc, color=col, lw=1.8, label=f"T={T} yr")

            if data and self._x is not None:
                ax_.scatter(self._x, self._y, s=18, alpha=0.5,
                            color="steelblue", zorder=5, label="Observed")

            lbl = "OR  [P(X>x ∪ Y>y) = 1/T]" if scen == "OR" \
                else "AND  [P(X>x ∩ Y>y) = 1/T]"
            ax_.set_title(lbl, fontsize=11)
            ax_.set_xlabel(self._labels[0])
            ax_.set_ylabel(self._labels[1])
            ax_.legend(fontsize=8, loc="upper left")
            ax_.grid(alpha=0.3)

        title = (f"Bivariate return periods — {self.family.capitalize()} copula"
                 f"  (τ={_kendall_tau(self._x, self._y):.2f}, θ={self._theta:.2f})")
        if scenario == "both":
            fig.suptitle(title, fontsize=12, fontweight="bold")
            fig.tight_layout()
            return fig, axes
        else:
            ax_.set_title(f"{lbl}\n{title}", fontsize=10)
            return fig, axes[0]


# ── TrivariateCopula ──────────────────────────────────────────────────────────

class TrivariateCopula:
    """
    Trivariate Archimedean copula for compound-flood return period analysis.

    Fits three marginals and a single copula parameter (exchangeable
    Archimedean family: Gumbel, Clayton or Frank) via the average of the
    three pairwise Kendall τ values.

    Typical application:
        X = peak river discharge Q  (m³/s)
        Y = storm surge / sea level SL  (m)
        Z = catchment rainfall P  (mm)

    The key outputs are:
    * ``joint_exceedance(x0, y0, z0, scenario)`` — scalar probability.
    * ``conditional_contours(z_quantile, T_list)`` — 2-D iso-return-period
      curves in the (X, Y) plane conditional on Z exceeding its α-quantile.
    * ``plot(T_list, z_quantiles)`` — standard trivariate plot grid.

    Args:
        family: ``'gumbel'`` | ``'clayton'`` | ``'frank'``.
    """

    def __init__(self, family="gumbel",
                 marginal_families=("gev", "lognorm", "gamma")):
        self.family            = family
        self.marginal_families = marginal_families
        self._cdf_fn           = _COPULA_CDF[family]
        self._cdf_3d           = _COPULA_CDF_3D[family]
        self._theta            = None
        self._mx = self._my = self._mz = None
        self._labels = ("X", "Y", "Z")
        self._x = self._y = self._z = None

    # ------------------------------------------------------------------
    def fit(self, x, y, z, labels=("X", "Y", "Z")):
        """
        Fit marginals and trivariate copula parameter.

        The copula parameter θ is estimated from the mean pairwise Kendall τ
        (exchangeable copula assumption).

        Returns:
            self
        """
        x, y, z = (np.asarray(a, float) for a in (x, y, z))
        self._x, self._y, self._z = x, y, z
        self._labels = labels

        print(f"Fitting TrivariateCopula [{self.family}]  n={len(x)}")
        for lbl, arr, attr in zip(labels, (x, y, z), ("_mx", "_my", "_mz")):
            print(f"  Marginal {lbl}:")
            setattr(self, attr, _fit_marginal_scipy(arr, self.marginal_families))

        tau_xy = _kendall_tau(x, y)
        tau_xz = _kendall_tau(x, z)
        tau_yz = _kendall_tau(y, z)
        tau_mean = (tau_xy + tau_xz + tau_yz) / 3.0
        self._tau = tau_mean
        self._tau_pairs = {
            f"{labels[0]}–{labels[1]}": tau_xy,
            f"{labels[0]}–{labels[2]}": tau_xz,
            f"{labels[1]}–{labels[2]}": tau_yz,
        }
        self._theta = _tau_to_theta(tau_mean, self.family)
        print(f"  Pairwise τ: XY={tau_xy:.3f}  XZ={tau_xz:.3f}  YZ={tau_yz:.3f}")
        print(f"  Mean τ = {tau_mean:.3f}  →  θ = {self._theta:.3f}")
        return self

    # ------------------------------------------------------------------
    def _u(self, x): d, p = self._mx[0], self._mx[1]; return np.clip(d.cdf(x, *p), 1e-10, 1-1e-10)
    def _v(self, y): d, p = self._my[0], self._my[1]; return np.clip(d.cdf(y, *p), 1e-10, 1-1e-10)
    def _w(self, z): d, p = self._mz[0], self._mz[1]; return np.clip(d.cdf(z, *p), 1e-10, 1-1e-10)
    def _x_ppf(self, u): d, p = self._mx[0], self._mx[1]; return d.ppf(u, *p)
    def _y_ppf(self, v): d, p = self._my[0], self._my[1]; return d.ppf(v, *p)
    def _z_ppf(self, w): d, p = self._mz[0], self._mz[1]; return d.ppf(w, *p)

    def joint_exceedance(self, x0, y0, z0, scenario="OR"):
        """
        P(X>x0, Y>y0, Z>z0) for OR or AND scenarios.

        OR:  P = 1 − C₃(u,v,w)
        AND: P = 1 − u − v − w + C(u,v) + C(u,w) + C(v,w) − C₃(u,v,w)
             (Fréchet–Hoeffding inclusion–exclusion)
        """
        u, v, w = self._u(x0), self._v(y0), self._w(z0)
        c3 = self._cdf_3d(u, v, w, self._theta)
        if scenario == "OR":
            return 1.0 - c3
        if scenario == "AND":
            cxy = self._cdf_fn(u, v, self._theta)
            cxz = self._cdf_fn(u, w, self._theta)
            cyz = self._cdf_fn(v, w, self._theta)
            return np.maximum(1.0 - u - v - w + cxy + cxz + cyz - c3, 0.0)
        raise ValueError("scenario must be 'OR' or 'AND'")

    def return_period(self, x0, y0, z0, scenario="OR"):
        """T = 1 / P(exceedance)."""
        return 1.0 / np.maximum(self.joint_exceedance(x0, y0, z0, scenario), 1e-12)

    # ------------------------------------------------------------------
    def conditional_contours(self, z_quantile, T_list, scenario="AND",
                              n_pts=250):
        """
        2-D iso-return-period curves in (X, Y) space, with Z fixed at its
        *z_quantile* exceedance level (i.e. z₀ = F_Z^{-1}(z_quantile)).

        P(X>x AND Y>y AND Z>z₀) = 1/T  →  sweep x, solve for y.

        Returns:
            dict {T: (x_curve, y_curve)}
        """
        from scipy.optimize import brentq

        z0 = self._z_ppf(z_quantile)
        w0 = self._w(z0)

        contours = {}
        for T in T_list:
            target  = 1.0 / T
            xc, yc  = [], []
            for u in np.linspace(1e-4, 1 - 1e-4, n_pts):
                def _residual(vv):
                    c3  = self._cdf_3d(u, vv, w0, self._theta)
                    if scenario == "AND":
                        cxy = self._cdf_fn(u, vv, self._theta)
                        cxz = self._cdf_fn(u, w0, self._theta)
                        cyz = self._cdf_fn(vv, w0, self._theta)
                        return (1.0 - u - vv - w0 + cxy + cxz + cyz - c3) - target
                    return (1.0 - c3) - target   # OR

                try:
                    lo_val = _residual(1e-10)
                    hi_val = _residual(1 - 1e-10)
                    if lo_val * hi_val > 0:
                        continue
                    vv = brentq(_residual, 1e-10, 1 - 1e-10, xtol=1e-8)
                    xc.append(self._x_ppf(u))
                    yc.append(self._y_ppf(vv))
                except Exception:
                    continue
            contours[T] = (np.array(xc), np.array(yc))
        return contours

    # ------------------------------------------------------------------
    def plot(self, T_list=(2, 10, 50, 100),
             z_quantiles=(0.5, 0.8, 0.95),
             scenario="AND",
             figsize=None):
        """
        Grid of 2-D conditional return period contours.

        Rows: different z₀ levels (Z fixed at its α-quantile).
        Columns: AND and OR scenarios side-by-side.

        Each panel shows iso-return-period curves in the (X, Y) plane
        conditional on Z ≥ z₀, plus the observed scatter.
        """
        import matplotlib.pyplot as plt
        import matplotlib.cm as cm

        scenarios = ["AND", "OR"]
        n_q       = len(z_quantiles)
        if figsize is None:
            figsize = (7 * len(scenarios), 5 * n_q)

        fig, axes = plt.subplots(n_q, len(scenarios), figsize=figsize,
                                 sharex=True, sharey=True, squeeze=False)
        colors = cm.plasma_r(np.linspace(0.15, 0.9, len(T_list)))

        for row, alpha in enumerate(z_quantiles):
            z0_val = self._z_ppf(alpha)
            z_lbl  = f"{self._labels[2]} ≥ {z0_val:.1f}  (α={alpha:.0%})"

            for col, scen in enumerate(scenarios):
                ax   = axes[row][col]
                ctrs = self.conditional_contours(alpha, T_list, scenario=scen)

                for col_c, T in zip(colors, T_list):
                    xc, yc = ctrs[T]
                    if len(xc):
                        ax.plot(xc, yc, color=col_c, lw=1.8, label=f"T={T} yr")

                # Observed scatter — filter to Z ≥ z₀
                if self._x is not None:
                    mask = self._z >= z0_val
                    ax.scatter(self._x[mask], self._y[mask],
                               s=18, alpha=0.6, color="steelblue", zorder=5)
                    ax.scatter(self._x[~mask], self._y[~mask],
                               s=10, alpha=0.15, color="grey", zorder=4)

                ax.set_xlabel(self._labels[0])
                ax.set_ylabel(self._labels[1])
                ax.set_title(f"{scen} | {z_lbl}", fontsize=10)
                ax.grid(alpha=0.3)
                if row == 0 and col == 0:
                    ax.legend(fontsize=8)

        fig.suptitle(
            f"Trivariate compound flood return periods\n"
            f"{self.family.capitalize()} copula  (θ={self._theta:.2f})  —  "
            f"{self._labels[0]} × {self._labels[1]} | {self._labels[2]}",
            fontsize=12, fontweight="bold",
        )
        fig.tight_layout()
        return fig, axes
