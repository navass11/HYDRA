"""
Hierarchical Bayesian GEV model for regional frequency analysis (Stan).

Shares GEV parameters across stations through a population distribution,
so stations with short records borrow strength from the regional signal.
The model is estimated by MCMC via pystan.

Stan model (non-centered parameterization)
------------------------------------------
Each station has its own (mu, sigma, xi) derived from population hyperparameters
using a non-centered parameterization for better MCMC mixing:

    mu_pop    ~ Normal(y_mean, y_sd)
    sigma_pop ~ LogNormal(log(y_sd), 1)
    xi_pop    ~ Normal(0, 0.5)

    tau_mu    ~ Exponential(1)
    tau_sigma ~ Exponential(2)
    tau_xi    ~ Exponential(4)

    mu_station[s]    = mu_pop + tau_mu * mu_raw[s]
    sigma_station[s] = sigma_pop * exp(tau_sigma * sigma_raw[s])
    xi_station[s]    = xi_pop + tau_xi * xi_raw[s]

    y[n, s] ~ GEV(mu_station[s], sigma_station[s], xi_station[s])
              (NaN entries skipped; explicit GEV log-likelihood for stability)

Return levels for configurable T values are computed in the
``generated quantities`` block.

Dependency: ``pip install pystan``  (Stan 3.x / ``stan`` package)
"""

from __future__ import annotations

import numpy as np
import pandas as pd


def _require_stan():
    try:
        import stan
        # nest_asyncio allows stan.build() inside a running event loop (Jupyter)
        try:
            import nest_asyncio
            nest_asyncio.apply()
        except ImportError:
            pass
        return stan
    except ImportError as exc:
        raise ImportError(
            "pystan is required for hierarchical Bayesian GEV fitting.\n"
            "Install it with: pip install pystan"
        ) from exc


# ---------------------------------------------------------------------------
# Stan model code — non-centered parameterization, NaN-aware likelihood
# ---------------------------------------------------------------------------

_HIERARCHICAL_GEV_CODE = """
data {
    int<lower=1> N_stations;
    int<lower=1> N_years;
    matrix[N_years, N_stations] y;
    real y_mean;
    real<lower=0> y_sd;
    int<lower=1> T_count;
    vector[T_count] T_values;
}
parameters {
    real mu_pop;
    real<lower=0> sigma_pop;
    real<lower=-1, upper=1> xi_pop;

    vector[N_stations] mu_raw;
    vector[N_stations] sigma_raw;
    vector[N_stations] xi_raw;

    real<lower=0> tau_mu;
    real<lower=0> tau_sigma;
    real<lower=0> tau_xi;
}
transformed parameters {
    vector[N_stations] mu_station;
    vector<lower=0>[N_stations] sigma_station;
    vector<lower=-1, upper=1>[N_stations] xi_station;

    mu_station    = mu_pop + tau_mu * mu_raw;
    sigma_station = sigma_pop * exp(tau_sigma * sigma_raw);
    xi_station    = xi_pop + tau_xi * xi_raw;
}
model {
    mu_pop    ~ normal(y_mean, y_sd);
    sigma_pop ~ lognormal(log(y_sd), 1);
    xi_pop    ~ normal(0, 0.5);

    mu_raw    ~ normal(0, 1);
    sigma_raw ~ normal(0, 1);
    xi_raw    ~ normal(0, 1);

    tau_mu    ~ exponential(1);
    tau_sigma ~ exponential(2);
    tau_xi    ~ exponential(4);

    for (s in 1:N_stations) {
        for (n in 1:N_years) {
            if (is_nan(y[n, s])) continue;
            if (abs(xi_station[s]) > 1e-6) {
                real z = (y[n, s] - mu_station[s]) / sigma_station[s];
                if (1 + xi_station[s] * z > 0) {
                    target += -log(sigma_station[s])
                             - (1 + 1.0 / xi_station[s]) * log1p(xi_station[s] * z)
                             - pow(1 + xi_station[s] * z, -1.0 / xi_station[s]);
                } else {
                    target += negative_infinity();
                }
            } else {
                real z = (y[n, s] - mu_station[s]) / sigma_station[s];
                target += -log(sigma_station[s]) - z - exp(-z);
            }
        }
    }
}
generated quantities {
    matrix[N_stations, T_count] return_levels;
    for (s in 1:N_stations) {
        for (t in 1:T_count) {
            real p = 1.0 - 1.0 / T_values[t];
            if (abs(xi_station[s]) > 1e-6) {
                return_levels[s, t] = mu_station[s]
                    + (sigma_station[s] / xi_station[s])
                    * (pow(-log(p), -xi_station[s]) - 1.0);
            } else {
                return_levels[s, t] = mu_station[s]
                    - sigma_station[s] * log(-log(p));
            }
        }
    }
}
"""


# ---------------------------------------------------------------------------
# Public class
# ---------------------------------------------------------------------------

class HierarchicalGEV:
    """
    Hierarchical Bayesian GEV model estimated by MCMC (Stan).

    Uses a non-centered parameterization (mu_station = mu_pop + tau_mu * mu_raw)
    for better MCMC mixing when station records are short or heterogeneous.
    Missing values (NaN) in the annual-maxima matrix are skipped in the
    likelihood loop.

    Parameters
    ----------
    T_values : list of float
        Return periods (years) for return-level estimation (default: 2, 10, 50, 100).
    n_chains : int
        Number of MCMC chains (default 4).
    n_samples : int
        Posterior samples per chain after warm-up (default 1000).
    warmup : int
        Warm-up samples per chain (default 1000).
    adapt_delta : float
        Target acceptance rate for NUTS (default 0.99).

    Examples
    --------
    >>> model = HierarchicalGEV()
    >>> posterior = model.fit({'StationA': am_a, 'StationB': am_b})
    >>> summary = model.posterior_summary()
    >>> rl = model.return_levels()
    """

    def __init__(
        self,
        T_values=(2, 10, 50, 100),
        n_chains=4,
        n_samples=1000,
        warmup=1000,
        adapt_delta=0.99,
    ):
        self.T_values = list(T_values)
        self.n_chains = n_chains
        self.n_samples = n_samples
        self.warmup = warmup
        self.adapt_delta = adapt_delta
        self._fit = None
        self._stations = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _build_matrix(data_dict, stations):
        """Pad ragged station arrays into a (N_years, N_stations) matrix with NaN."""
        max_len = max(len(v) for v in data_dict.values())
        mat = np.full((max_len, len(stations)), np.nan)
        for s, name in enumerate(stations):
            vals = np.asarray(data_dict[name], dtype=float)
            mat[: len(vals), s] = vals
        return mat

    @staticmethod
    def _initial_values(data_dict, stations):
        all_vals = np.concatenate([
            np.asarray(v, dtype=float) for v in data_dict.values()
        ])
        all_vals = all_vals[np.isfinite(all_vals)]
        return {
            "mu_pop":    float(np.mean(all_vals)),
            "sigma_pop": float(np.std(all_vals)),
            "xi_pop":    0.1,
            "mu_raw":    [0.0] * len(stations),
            "sigma_raw": [0.0] * len(stations),
            "xi_raw":    [0.0] * len(stations),
            "tau_mu":    1.0,
            "tau_sigma": 0.5,
            "tau_xi":    0.25,
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def fit(self, data_dict):
        """
        Fit the hierarchical model to annual maxima from multiple stations.

        Args:
            data_dict: dict mapping station name → 1-D array-like of annual maxima.
                       Arrays may have different lengths; missing years should be NaN.

        Returns:
            self (for chaining).
        """
        stan = _require_stan()
        self._stations = list(data_dict.keys())
        S = len(self._stations)

        y_mat = self._build_matrix(data_dict, self._stations)
        all_vals = y_mat[np.isfinite(y_mat)]

        stan_data = {
            "N_stations": S,
            "N_years":    y_mat.shape[0],
            "y":          y_mat.tolist(),
            "y_mean":     float(np.mean(all_vals)),
            "y_sd":       float(np.std(all_vals)),
            "T_count":    len(self.T_values),
            "T_values":   [float(t) for t in self.T_values],
        }

        init = [self._initial_values(data_dict, self._stations)
                for _ in range(self.n_chains)]

        model = stan.build(_HIERARCHICAL_GEV_CODE, data=stan_data)
        self._fit = model.sample(
            num_chains=self.n_chains,
            num_samples=self.n_samples,
            num_warmup=self.warmup,
            init=init,
        )
        return self

    def posterior_summary(self):
        """
        Summarise the posterior of population, tau, and station-level parameters.

        Returns:
            pd.DataFrame with mean, std, and 95 % credible intervals.
        """
        if self._fit is None:
            raise RuntimeError("Call fit() first.")

        rows = {}

        # Population and tau parameters
        scalar_params = [
            "mu_pop", "sigma_pop", "xi_pop",
            "tau_mu", "tau_sigma", "tau_xi",
        ]
        for param in scalar_params:
            samples = np.asarray(self._fit[param]).flatten()
            rows[param] = {
                "mean":  float(np.mean(samples)),
                "std":   float(np.std(samples)),
                "q2.5":  float(np.quantile(samples, 0.025)),
                "q97.5": float(np.quantile(samples, 0.975)),
            }

        # Station-level parameters
        for s, name in enumerate(self._stations):
            for param_base in ["mu_station", "sigma_station", "xi_station"]:
                key = f"{param_base}[{name}]"
                raw = np.asarray(self._fit[param_base])
                # shape may be (S, n_samples*n_chains) or (n_samples*n_chains, S)
                samples = raw[s].flatten() if raw.shape[0] == len(self._stations) else raw[:, s].flatten()
                rows[key] = {
                    "mean":  float(np.mean(samples)),
                    "std":   float(np.std(samples)),
                    "q2.5":  float(np.quantile(samples, 0.025)),
                    "q97.5": float(np.quantile(samples, 0.975)),
                }

        return pd.DataFrame(rows).T

    def return_levels(self, credible=0.95):
        """
        Return-level posterior summaries for each station and return period.

        Returns:
            pd.DataFrame indexed by station with columns T{T}_median, T{T}_lower,
            T{T}_upper for each configured return period T.
        """
        if self._fit is None:
            raise RuntimeError("Call fit() first.")

        alpha = (1 - credible) / 2
        rl_raw = np.asarray(self._fit["return_levels"])
        # rl_raw shape: (S, T_count, total_samples) or similar

        records = {}
        for s, name in enumerate(self._stations):
            row = {}
            for t_idx, T in enumerate(self.T_values):
                if rl_raw.ndim == 3:
                    samples = rl_raw[s, t_idx].flatten()
                else:
                    samples = rl_raw[:, s, t_idx].flatten()
                row[f"T{int(T)}_median"] = float(np.median(samples))
                row[f"T{int(T)}_lower"]  = float(np.quantile(samples, alpha))
                row[f"T{int(T)}_upper"]  = float(np.quantile(samples, 1 - alpha))
            records[name] = row

        return pd.DataFrame(records).T
