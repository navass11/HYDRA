"""
Regional Frequency Analysis (RFA) of extreme events.

Three fitting approaches for GEV (Generalized Extreme Value) distributions,
applicable to annual maxima of precipitation, discharge, or any hydro-
meteorological variable:

- **MLE**   — Maximum Likelihood Estimation via scipy.
- **L-moments** — Method of L-moments via lmoments3.
- **Bayesian** — MCMC via pystan (weakly informative priors).

Regional analysis normalises each station's series by its index flood
(mean annual maximum) before fitting a single regional GEV, then
re-scales the regional quantiles back to each station.

Dependencies
------------
- scipy (always available)
- lmoments3: ``pip install lmoments3``
- pystan: ``pip install pystan``  (Stan 2.x)
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from scipy.stats import genextreme


# ---------------------------------------------------------------------------
# Dependency guards
# ---------------------------------------------------------------------------

def _require_lmoments():
    try:
        import lmoments3 as lm
        import lmoments3.distr as lmd
        return lm, lmd
    except ImportError as exc:
        raise ImportError(
            "lmoments3 is required for L-moment fitting.\n"
            "Install it with: pip install lmoments3"
        ) from exc


def _require_stan():
    try:
        import stan
        return stan
    except ImportError as exc:
        raise ImportError(
            "pystan is required for Bayesian GEV fitting.\n"
            "Install it with: pip install pystan"
        ) from exc


# ---------------------------------------------------------------------------
# Point frequency analysis
# ---------------------------------------------------------------------------

def fit_gev_mle(data):
    """
    Fit a GEV distribution by Maximum Likelihood Estimation.

    Args:
        data: 1-D array of annual maxima.

    Returns:
        dict with keys ``shape``, ``loc``, ``scale``.
    """
    shape, loc, scale = genextreme.fit(np.asarray(data))
    return {"shape": shape, "loc": loc, "scale": scale}


def fit_gev_lmom(data):
    """
    Fit a GEV distribution by the method of L-moments.

    Args:
        data: 1-D array of annual maxima.

    Returns:
        dict with keys ``shape``, ``loc``, ``scale``.
    """
    lm, lmd = _require_lmoments()
    ratios = lm.lmom_ratios(list(data), nmom=4)
    params = lmd.gev.lmom_fit(list(data), lmom_ratios=ratios)
    return {
        "shape": params.get("c", params.get("shape", 0.0)),
        "loc":   params.get("loc", 0.0),
        "scale": params.get("scale", 1.0),
    }


def return_level(params, T):
    """
    Compute the T-year return level from GEV parameters.

    Args:
        params: dict with ``shape``, ``loc``, ``scale`` (from fit_gev_mle
                or fit_gev_lmom).
        T:      Return period in years (scalar or array).

    Returns:
        Return level(s) — same shape as T.
    """
    return genextreme.ppf(1 - 1 / np.asarray(T),
                          params["shape"],
                          loc=params["loc"],
                          scale=params["scale"])


_BAYES_GEV_CODE = """
data {
    int<lower=1> N;
    vector[N] y;
}
parameters {
    real mu;
    real<lower=0> sigma;
    real xi;
}
model {
    mu    ~ normal(0, 100);
    sigma ~ cauchy(0, 5);
    xi    ~ normal(0, 5);
    for (n in 1:N)
        target += gev_lpdf(y[n] | mu, sigma, xi);
}
"""


def fit_gev_bayes(data, n_chains=4, n_samples=1000):
    """
    Fit a GEV distribution by Bayesian MCMC (Stan).

    Args:
        data:      1-D array of annual maxima.
        n_chains:  Number of MCMC chains.
        n_samples: Samples per chain.

    Returns:
        pd.DataFrame of posterior samples with columns ``mu``, ``sigma``, ``xi``.
    """
    stan = _require_stan()
    model = stan.build(
        _BAYES_GEV_CODE,
        data={"N": len(data), "y": list(map(float, data))},
    )
    fit = model.sample(num_chains=n_chains, num_samples=n_samples)
    return pd.DataFrame({
        "mu":    fit["mu"].flatten(),
        "sigma": fit["sigma"].flatten(),
        "xi":    fit["xi"].flatten(),
    })


def return_level_bayes(posterior, T, credible=0.95):
    """
    Compute return-level posterior distribution from MCMC samples.

    Args:
        posterior: pd.DataFrame from :func:`fit_gev_bayes`.
        T:         Return period (scalar).
        credible:  Credible interval width (default 0.95).

    Returns:
        dict with keys ``median``, ``lower``, ``upper``.
    """
    alpha = (1 - credible) / 2
    levels = genextreme.ppf(
        1 - 1 / T,
        posterior["xi"].values,
        loc=posterior["mu"].values,
        scale=posterior["sigma"].values,
    )
    return {
        "median": float(np.median(levels)),
        "lower":  float(np.quantile(levels, alpha)),
        "upper":  float(np.quantile(levels, 1 - alpha)),
    }


# ---------------------------------------------------------------------------
# Regional frequency analysis
# ---------------------------------------------------------------------------

def regional_index_flood(data_dict):
    """
    Normalise each station's series by its index flood (mean annual maximum).

    Args:
        data_dict: dict mapping station name → 1-D array of annual maxima.

    Returns:
        normalised: dict mapping station name → normalised series.
        index_floods: pd.Series mapping station name → mean annual maximum.
    """
    index_floods = {k: np.mean(v) for k, v in data_dict.items()}
    normalised = {k: np.asarray(v) / index_floods[k] for k, v in data_dict.items()}
    return normalised, pd.Series(index_floods, name="index_flood")


def fit_regional_gev(data_dict, method="lmom"):
    """
    Fit a regional GEV to normalised pooled data from multiple stations.

    Args:
        data_dict: dict mapping station name → 1-D array of annual maxima.
        method:    ``'mle'`` or ``'lmom'`` (default ``'lmom'``).

    Returns:
        regional_params: dict with ``shape``, ``loc``, ``scale`` (for index=1).
        index_floods:    pd.Series with each station's index flood.
    """
    normalised, index_floods = regional_index_flood(data_dict)
    pooled = np.concatenate(list(normalised.values()))

    if method == "lmom":
        regional_params = fit_gev_lmom(pooled)
    elif method == "mle":
        regional_params = fit_gev_mle(pooled)
    else:
        raise ValueError(f"Unknown method '{method}'. Use 'mle' or 'lmom'.")

    return regional_params, index_floods


def regional_return_levels(data_dict, T_values=(2, 5, 10, 20, 50, 100),
                           method="lmom"):
    """
    Compute T-year return levels for each station via regional GEV.

    Args:
        data_dict: dict mapping station name → 1-D array of annual maxima.
        T_values:  Iterable of return periods in years.
        method:    ``'mle'`` or ``'lmom'``.

    Returns:
        pd.DataFrame (stations × T values) with return levels.
    """
    regional_params, index_floods = fit_regional_gev(data_dict, method=method)
    T_arr = np.asarray(T_values)

    rows = {}
    for station, mu in index_floods.items():
        regional_q = return_level(regional_params, T_arr)
        rows[station] = regional_q * mu

    return pd.DataFrame(rows, index=T_arr).T
