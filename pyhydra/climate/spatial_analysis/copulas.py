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
        # τ = 1 - 4/θ * (1 - 1/θ * ∫₀^θ t/(e^t-1) dt)  (Debye function relation)
        def _frank_tau(theta):
            if abs(theta) < 1e-8:
                return 0.0
            from scipy.integrate import quad
            D1 = quad(lambda t: t / (np.exp(t) - 1.0), 0, theta)[0] / theta
            return 1.0 - 4.0 / theta * (1.0 - D1)
        if abs(tau) < 1e-6:
            return 1e-4
        lo, hi = (1e-4, 50.0) if tau > 0 else (-50.0, -1e-4)
        try:
            return brentq(lambda t: _frank_tau(t) - tau, lo, hi)
        except ValueError:
            return np.sign(tau) * 5.0

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

        For OR:  C(u,v) = 1 − 1/T   → solutions exist for u ∈ (1−1/T, 1)
        For AND: 1 − u − v + C(u,v) = 1/T  → solutions exist for u ∈ (0, 1−1/T)

        Returns:
            x_curve, y_curve: arrays of physical coordinates.
        """
        from scipy.optimize import brentq

        target = 1.0 / T

        # Adaptive u-sweep: concentrate points in the region where solutions exist.
        if scenario == "OR":
            level = 1.0 - target
            u_arr = np.linspace(level + 1e-4, 1.0 - 1e-4, n_pts)
        else:  # AND
            u_arr = np.linspace(1e-4, max(1.0 - target - 1e-4, 2e-4), n_pts)

        x_out, y_out = [], []
        for u in u_arr:
            try:
                if scenario == "OR":
                    if self._cdf_fn(u, 1 - 1e-10, self._theta) < level:
                        continue
                    v = brentq(
                        lambda vv: self._cdf_fn(u, vv, self._theta) - level,
                        1e-10, 1 - 1e-10, xtol=1e-8,
                    )
                else:  # AND
                    lo_val = 1.0 - u - 1e-10 + self._cdf_fn(u, 1e-10, self._theta)
                    hi_val = 1.0 - u - (1 - 1e-10) + self._cdf_fn(u, 1 - 1e-10, self._theta)
                    if lo_val < target or hi_val > target:
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
    def most_probable_event(self, T, scenario="OR", n_pts=500):
        """
        Most Probable Design Event (MPDE) on the T-year iso-return-period contour.

        Among all (x, y) combinations on the iso-contour, returns the one that
        maximises the joint density f(x,y) = c(F_X(x), F_Y(y))·f_X(x)·f_Y(y).

        Args:
            T:        Return period (years).
            scenario: ``'OR'`` or ``'AND'``.
            n_pts:    Contour resolution (higher → more precise MPDE location).

        Returns:
            (x_mpde, y_mpde) as floats, or (None, None) if the contour is empty.
        """
        xc, yc = self.return_period_contour(T, scenario=scenario, n_pts=n_pts)
        if len(xc) == 0:
            return None, None

        u = self._u(xc)
        v = self._v(yc)

        # Copula density via central finite differences
        eps = 1e-5
        u_lo, u_hi = np.maximum(u - eps, eps), np.minimum(u + eps, 1 - eps)
        v_lo, v_hi = np.maximum(v - eps, eps), np.minimum(v + eps, 1 - eps)
        c_uv = (self._cdf_fn(u_hi, v_hi, self._theta)
                - self._cdf_fn(u_hi, v_lo, self._theta)
                - self._cdf_fn(u_lo, v_hi, self._theta)
                + self._cdf_fn(u_lo, v_lo, self._theta)) / (4 * eps ** 2)
        c_uv = np.maximum(c_uv, 0.0)

        # Marginal PDFs
        fx = self._mx[0].pdf(xc, *self._mx[1])
        fy = self._my[0].pdf(yc, *self._my[1])

        idx = int(np.argmax(c_uv * fx * fy))
        return float(xc[idx]), float(yc[idx])

    # ------------------------------------------------------------------
    def sample(self, n, random_state=None):
        """
        Draw *n* synthetic paired samples from the fitted bivariate copula.

        Uses family-specific exact algorithms (Marshall–Olkin for Gumbel,
        Gamma-frailty for Clayton, conditional inversion for Frank).

        Returns:
            (x_synth, y_synth): two 1-D arrays of length *n* in physical space.
        """
        rng   = np.random.default_rng(random_state)
        theta = self._theta

        if self.family == "gumbel":
            alpha = 1.0 / theta
            U  = rng.uniform(0.0, np.pi, n)
            E  = rng.exponential(1.0, n)
            V  = ((np.sin(alpha * U) / np.sin(U))
                  * (np.sin((1 - alpha) * U) / (E * np.sin(U))) ** ((1 - alpha) / alpha))
            e1 = rng.exponential(1.0, n)
            e2 = rng.exponential(1.0, n)
            u1 = np.exp(-(e1 / V) ** (1.0 / theta))
            u2 = np.exp(-(e2 / V) ** (1.0 / theta))

        elif self.family == "clayton":
            V  = rng.gamma(1.0 / theta, 1.0, n)
            e1 = rng.exponential(1.0, n)
            e2 = rng.exponential(1.0, n)
            u1 = (1.0 + e1 / V) ** (-1.0 / theta)
            u2 = (1.0 + e2 / V) ** (-1.0 / theta)

        elif self.family == "frank":
            # Analytical conditional inversion: set h(v|u) = t and solve for v.
            # Result: ev = [eu*(1-t) + t*e0] / [eu*(1-t) + t]  where
            # e0 = exp(-θ), eu = exp(-θu), ev = exp(-θv); then v = -log(ev)/θ.
            u1 = rng.uniform(0.0, 1.0, n)
            t  = np.clip(rng.uniform(0.0, 1.0, n), 1e-9, 1 - 1e-9)
            e0 = np.exp(-theta)
            eu = np.exp(-theta * u1)
            ev = (eu * (1.0 - t) + t * e0) / np.maximum(eu * (1.0 - t) + t, 1e-15)
            u2 = np.clip(-np.log(np.maximum(ev, 1e-15)) / theta, 1e-10, 1 - 1e-10)

        else:
            raise ValueError(f"Unknown family: {self.family!r}")

        u1 = np.clip(u1, 1e-10, 1 - 1e-10)
        u2 = np.clip(u2, 1e-10, 1 - 1e-10)
        return self._x_ppf(u1), self._y_ppf(u2)

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
                fig = ax.figure
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

    # ------------------------------------------------------------------
    def plot_joint(self, T_list=(2, 10, 50, 100, 500),
                   n_synthetic=2000, figsize=(6, 6),
                   colors=("indianred", "b"),
                   n_grid=200):
        """
        Composite joint plot — GridSpec(4, 4) layout matching the reference style.

        * **Main panel** (top-right 3×3): grey synthetic scatter, black observed
          scatter, AND (*colors[0]*) and OR (*colors[1]*) iso-return-period
          contours on the same axes, points coloured by joint PDF density,
          MaxProb 'x' markers per contour level.
        * **Bottom panel** (xMarg): marginal PDF of X (olive fill, y-axis
          inverted so it grows upward toward main), T-year quantile annotations.
        * **Left panel** (yMarg): marginal PDF of Y (horizontal, x-axis
          inverted so it grows rightward), T-year quantile annotations.
        * **Legend**: placed in a separate axes to the right of the figure.

        Args:
            T_list:      Return periods to draw.
            n_synthetic: Synthetic copula samples for background scatter (0 to skip).
            figsize:     Figure size.
            colors:      ``(and_color, or_color)`` for base contour lines.
            n_grid:      Contour grid resolution.

        Returns:
            ``(fig, (main_ax, xMarg_ax, yMarg_ax))``
        """
        import matplotlib.pyplot as plt

        Ts = np.asarray(sorted(T_list), dtype=float)

        # --- Physical-space extent from data ---
        if self._x is not None:
            dx = (self._x.max() - self._x.min()) * 0.15
            dy = (self._y.max() - self._y.min()) * 0.15
            extent = [self._x.min() - dx, self._x.max() + dx,
                      self._y.min() - dy, self._y.max() + dy]
        else:
            u_e = np.linspace(1e-3, 1 - 1e-3, n_grid)
            extent = [float(self._x_ppf(u_e).min()), float(self._x_ppf(u_e).max()),
                      float(self._y_ppf(u_e).min()), float(self._y_ppf(u_e).max())]

        # --- Return-period grids ---
        u_lin = np.linspace(1e-3, 1 - 1e-3, n_grid)
        UU, VV = np.meshgrid(u_lin, u_lin)
        C     = self._cdf_fn(UU, VV, self._theta)
        T_or  = 1.0 / np.maximum(1.0 - C, 1e-12)
        T_and = 1.0 / np.maximum(1.0 - UU - VV + C, 1e-12)
        XX = self._x_ppf(UU)
        YY = self._y_ppf(VV)

        # --- Layout: GridSpec(4, 4) identical to reference ---
        fig  = plt.figure(figsize=figsize)
        grid = plt.GridSpec(4, 4, hspace=0.2, wspace=0.2, figure=fig)
        main  = fig.add_subplot(grid[:-1, 1:])
        yMarg = fig.add_subplot(grid[:-1, 0])
        xMarg = fig.add_subplot(grid[-1,  1:])
        main.set_xlim(extent[:2])
        main.set_ylim(extent[2:])

        # --- Synthetic scatter (grey, small) ---
        if n_synthetic > 0:
            xs, ys = self.sample(n_synthetic)
            main.scatter(xs, ys, marker='.', c='grey', s=1, alpha=0.5,
                         rasterized=True, zorder=2, label='aleatorios')

        # --- Observed scatter (black) ---
        if self._x is not None:
            main.scatter(self._x, self._y, marker='.', c='k', s=12,
                         zorder=3, label='observados')

        # --- Base contour lines ---
        cs_and = main.contour(XX, YY, T_and, levels=Ts.tolist(),
                              colors=colors[0], linewidths=0.8, alpha=0.3, zorder=4)
        cs_or  = main.contour(XX, YY, T_or,  levels=Ts.tolist(),
                              colors=colors[1], linewidths=0.8, alpha=0.3, zorder=4)
        main.clabel(cs_and, fmt='%g', fontsize=8, inline=True)
        main.clabel(cs_or,  fmt='%g', fontsize=8, inline=True)

        # --- Colour contour points by joint PDF + MaxProb 'x' markers ---
        eps = 1e-5
        c_and, c_or = colors[0], colors[1]
        for scn, cs, cmap, c_mpde in zip(
                ['AND', 'OR'], [cs_and, cs_or],
                ['Reds', 'Blues'], [c_and, c_or]):
            try:
                level_paths = [col.get_paths() for col in cs.collections]
            except AttributeError:
                level_paths = [[p] for p in cs.get_paths()]

            for i, T in enumerate(Ts):
                paths = level_paths[i] if i < len(level_paths) else []
                if not paths:
                    continue
                pts = max(paths, key=lambda p: len(p.vertices)).vertices
                mask = ((pts[:, 0] >= extent[0]) & (pts[:, 0] <= extent[1]) &
                        (pts[:, 1] >= extent[2]) & (pts[:, 1] <= extent[3]))
                pts = pts[mask]
                if len(pts) < 2:
                    continue
                u   = self._u(pts[:, 0])
                v   = self._v(pts[:, 1])
                u_lo = np.clip(u - eps, 1e-10, 1 - 1e-10)
                u_hi = np.clip(u + eps, 1e-10, 1 - 1e-10)
                v_lo = np.clip(v - eps, 1e-10, 1 - 1e-10)
                v_hi = np.clip(v + eps, 1e-10, 1 - 1e-10)
                c_uv = (self._cdf_fn(u_hi, v_hi, self._theta)
                        - self._cdf_fn(u_hi, v_lo, self._theta)
                        - self._cdf_fn(u_lo, v_hi, self._theta)
                        + self._cdf_fn(u_lo, v_lo, self._theta)) / (4 * eps ** 2)
                pdf  = np.clip(c_uv
                               * self._mx[0].pdf(pts[:, 0], *self._mx[1])
                               * self._my[0].pdf(pts[:, 1], *self._my[1]), 0, None)
                main.scatter(pts[:, 0], pts[:, 1], c=pdf, cmap=cmap,
                             s=0.25, zorder=5)
                mp = pts[int(np.argmax(pdf))]
                main.scatter(mp[0], mp[1], marker='x', color=c_mpde,
                             s=80, linewidths=1.5, zorder=7)

            # Off-screen proxy artists for legend
            main.plot([-1e9], [-1e9], c=c_mpde, label=scn)
            main.scatter([-1e9], [-1e9], marker='x', c=c_mpde,
                         s=80, linewidths=1.5, label=f'MaxProb {scn}')

        main.set(xlim=extent[:2], ylim=extent[2:])
        main.set_xticklabels([])
        main.set_yticklabels([])

        # --- X marginal (bottom): PDF, y-axis inverted ---
        v0     = np.linspace(extent[0], extent[1], 400)
        pdf_x  = self._mx[0].pdf(v0, *self._mx[1])
        ymax_x = float(np.nanmax(pdf_x))
        if ymax_x > 0:
            xMarg.fill_between(v0, pdf_x, color='olive', alpha=0.25)
            xMarg.set(xlim=(extent[0], extent[1]), ylim=(ymax_x, 0))
            ppfs_x = np.clip(self._mx[0].ppf(1 - 1 / Ts, *self._mx[1]),
                             extent[0], extent[1])
            for T, ppf in zip(Ts, ppfs_x):
                xMarg.annotate(f'T{int(T)}',
                               xy=(ppf, 0), xytext=(ppf, ymax_x / 3),
                               color='olive', fontsize=11,
                               ha='center', va='top', rotation=90,
                               arrowprops=dict(arrowstyle='->', color='olive', lw=1))
            xMarg.set_xlabel(self._labels[0], fontsize=13)
            yticks = np.round(np.linspace(0, ymax_x, 3), 2)
            xMarg.set_yticks(yticks)
            xMarg.set_yticklabels(yticks)

        # --- Y marginal (left): PDF horizontal, x-axis inverted ---
        v1     = np.linspace(extent[2], extent[3], 400)
        pdf_y  = self._my[0].pdf(v1, *self._my[1])
        xmax_y = float(np.nanmax(pdf_y))
        if xmax_y > 0:
            yMarg.fill_between(pdf_y, v1, color='olive', alpha=0.25,
                               label='Distribución (PDF)')
            yMarg.set(xlim=(xmax_y, 0), ylim=(extent[2], extent[3]))
            ppfs_y = np.clip(self._my[0].ppf(1 - 1 / Ts, *self._my[1]),
                             extent[2], extent[3])
            for T, ppf in zip(Ts, ppfs_y):
                yMarg.annotate(f'T{int(T)}',
                               xy=(0, ppf), xytext=(xmax_y / 3, ppf),
                               color='olive', fontsize=11,
                               ha='right', va='center',
                               arrowprops=dict(arrowstyle='->', color='olive', lw=1))
            yMarg.set_ylabel(self._labels[1], fontsize=13)
            xticks = np.round(np.linspace(0, xmax_y, 3), 2)
            yMarg.set_xticks(xticks)
            yMarg.set_xticklabels(xticks)

        # --- Legend: outside to the right (reference style) ---
        lgnd_ax = fig.add_axes([0.97, 0.3, 0.08, 0.4])
        lgnd_ax.axis('off')
        # Handles from main: [0]=aleatorios [1]=observados [2]=AND [3]=MaxProbAND
        #                    [4]=OR [5]=MaxProbOR  → reorder [2,3,0,4,1,5]
        hndls, lbls = main.get_legend_handles_labels()
        if len(hndls) >= 6:
            order = [2, 3, 0, 4, 1, 5]
            hndls = [hndls[i] for i in order]
            lbls  = [lbls[i]  for i in order]
        hndls1, lbls1 = yMarg.get_legend_handles_labels()
        lgnd_ax.legend(hndls + hndls1, lbls + lbls1,
                       ncol=1, loc='center left', fontsize=9)

        return fig, (main, xMarg, yMarg)


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
            target = 1.0 / T
            # Adaptive u-sweep: OR solutions for u > 1-1/T, AND for u < 1-1/T
            if scenario == "AND":
                u_arr = np.linspace(1e-4, max(1.0 - target - 1e-4, 2e-4), n_pts)
            else:
                level = 1.0 - target
                u_arr = np.linspace(level + 1e-4, 1.0 - 1e-4, n_pts)

            xc, yc = [], []
            for u in u_arr:
                def _residual(vv, _u=u):
                    c3  = self._cdf_3d(_u, vv, w0, self._theta)
                    if scenario == "AND":
                        cxy = self._cdf_fn(_u, vv, self._theta)
                        cxz = self._cdf_fn(_u, w0, self._theta)
                        cyz = self._cdf_fn(vv, w0, self._theta)
                        return (1.0 - _u - vv - w0 + cxy + cxz + cyz - c3) - target
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
