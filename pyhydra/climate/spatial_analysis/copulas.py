"""
Multivariate copula fitting and synthetic event sampling (openturns).

Workflow
--------
1. Fit the best marginal distribution to each variable by BIC selection.
2. Transform each sample to the uniform [0, 1] space via its fitted CDF.
3. Fit a Normal (Gaussian) copula to capture the joint dependence structure.
4. Sample N synthetic events from the copula and back-transform to physical space.

Typical use: generate a large ensemble of synthetic flood events
(Qmax, Qmed, Duration, shape_type) from a small observed record, preserving
both marginal distributions and inter-variable correlations.

Dependency: ``pip install openturns``
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
            ot_u = ot.Sample([[float(v)] for v in u_synth[:, k]])
            result[var] = np.array(dist.computeQuantile(ot_u)).flatten()

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
