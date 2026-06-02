import io
import os
import tempfile
import warnings

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from scipy.stats import norm as _norm

from pyhydra.climate.stochastic_generation import analyze_ts, report_ts

router = APIRouter()


def _demo_series() -> pd.Series:
    """Synthetic 30-year daily discharge with seasonal mean and AR(1) noise."""
    rng = np.random.default_rng(42)
    dates = pd.date_range("1990-01-01", "2019-12-31", freq="D")
    doy = np.asarray(dates.dayofyear, dtype=float)
    seasonal_mean = 30 + 20 * np.sin(2 * np.pi * (doy / 365 - 0.3))
    rho = 0.7
    eps = rng.normal(0, 8 * np.sqrt(1 - rho**2), len(dates))
    noise = np.zeros(len(dates))
    for t in range(1, len(dates)):
        noise[t] = rho * noise[t - 1] + eps[t]
    Q = np.maximum(0.1, seasonal_mean + noise)
    return pd.Series(Q, index=dates, name="discharge")


def _fast_simulate(
    ts_stats: dict,
    sim_year: int,
    n_sims: int,
    seed: int | None = None,
) -> tuple[np.ndarray, pd.DatetimeIndex]:
    """
    Seasonal AR(1) CoSMoS simulation, vectorised across n_sims.
    Always returns exactly 365 days (Feb 29 excluded for leap years).
    """
    from cosmos_py.timeseries.analyze import _ppf

    dist = ts_stats["dist"]
    dfits = ts_stats["dfits"]
    afits = ts_stats["afits"]

    stats_df = report_ts(ts_stats)
    p0_list = stats_df["p0"].values

    # Always 365 days — drop Feb 29 from leap years for consistent comparison
    all_dates = pd.date_range(f"{sim_year}-01-01", f"{sim_year}-12-31", freq="D")
    sim_dates = all_dates[~((all_dates.month == 2) & (all_dates.day == 29))]
    months_arr = sim_dates.month.to_numpy()
    n = len(sim_dates)  # always 365

    # Lag-1 Weibull ACS per month: ρ(1) = exp(-(1/scale)^shape)
    rho1 = np.array([
        float(np.exp(-(1.0 / afits[m]["params"]["scale"]) ** afits[m]["params"]["shape"]))
        for m in range(12)
    ])
    rho1 = np.clip(rho1, -0.99, 0.99)

    # Vectorised seasonal AR(1) — shape (n_sims, 365)
    rng = np.random.default_rng(seed)
    G = np.empty((n_sims, n))
    prev = rng.normal(0.0, 1.0, n_sims)

    for t in range(n):
        r = rho1[months_arr[t] - 1]
        eps = rng.normal(0.0, np.sqrt(max(1.0 - r * r, 1e-10)), n_sims)
        G[:, t] = r * prev + eps
        prev = G[:, t]

    # Quantile transform: Gaussian → marginal distribution, month by month
    sim_arr = np.empty((n_sims, n))

    for m_idx in range(12):
        mask = months_arr == (m_idx + 1)
        p0 = float(p0_list[m_idx])
        params = dfits[m_idx]["params_dict"]

        u = _norm.cdf(G[:, mask])
        raw = (u - p0) / (1.0 - p0)
        nz = raw > 0.0
        u_clip = np.clip(raw, 1e-10, 1.0 - 1e-10)

        vals = _ppf(dist, params, u_clip)
        vals[~nz] = 0.0
        sim_arr[:, mask] = np.maximum(vals, 0.1)

    return sim_arr, sim_dates


def _sim_monthly_stats(sim_arr: np.ndarray, months_arr: np.ndarray) -> dict:
    """Compute mean, std and ACF1 from the actual ensemble, per calendar month."""
    means, stds, acf1s = [], [], []
    for m in range(1, 13):
        mask = months_arr == m
        v = sim_arr[:, mask]                    # (n_sims, n_days_in_month)

        means.append(round(float(v.mean()), 2))
        stds.append(round(float(v.std(ddof=1)), 2))

        # Vectorised within-month ACF1 across all sims
        v1, v2 = v[:, :-1], v[:, 1:]
        c1 = v1 - v1.mean(axis=1, keepdims=True)
        c2 = v2 - v2.mean(axis=1, keepdims=True)
        num  = (c1 * c2).sum(axis=1)
        denom = np.sqrt((c1**2).sum(axis=1) * (c2**2).sum(axis=1))
        acf1 = num / np.where(denom > 1e-10, denom, np.nan)
        acf1s.append(round(float(np.nanmean(acf1)), 3))

    return {"mean": means, "std": stds, "acf1": acf1s}


@router.post("/generate")
async def generate(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    dist: str = Form("gengamma"),
    n_sims: int = Form(30),
    sim_year: int = Form(2025),
    seed: int | None = Form(42),
):
    """
    Fit a seasonal stochastic model (CoSMoS) and return a simulation ensemble.
    """
    use_demo = demo.lower() in ("true", "1", "yes")
    uploaded_file = file if hasattr(file, "read") else None
    allowed_dist = {"gengamma", "lnorm", "paretoII", "gev", "burrXII", "burrIII"}

    if dist not in allowed_dist:
        raise HTTPException(status_code=400, detail=f"Distribución no soportada: {dist}")
    if not 1 <= n_sims <= 300:
        raise HTTPException(status_code=400, detail="n_sims debe estar entre 1 y 300.")
    if not 1900 <= sim_year <= 2200:
        raise HTTPException(status_code=400, detail="sim_year debe estar entre 1900 y 2200.")

    # ── 1. Load series ───────────────────────────────────────────────────────
    if use_demo:
        series = _demo_series()
    elif uploaded_file is None:
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    else:
        try:
            contents = await uploaded_file.read()
            df = pd.read_csv(io.BytesIO(contents), parse_dates=[0], index_col=0)
            series = df.iloc[:, 0].dropna()
            series.index = pd.DatetimeIndex(series.index)
            series = pd.to_numeric(series, errors="coerce").dropna().sort_index()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")

    if len(series) < 365:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 365 días de datos.")
    if not series.index.is_monotonic_increasing:
        series = series.sort_index()
    if series.index.year.nunique() < 2:
        raise HTTPException(status_code=400, detail="La serie debe cubrir al menos dos años calendario.")

    # ── 2. Fit seasonal model ────────────────────────────────────────────────
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        ts_stats = analyze_ts(series, dist=dist, acs_id="weibull")

    months = list(range(1, 13))
    obs_mean = [round(float(series[series.index.month == m].mean()), 2) for m in months]
    obs_std  = [round(float(series[series.index.month == m].std(ddof=1)), 2) for m in months]
    obs_acf1 = [round(float(series[series.index.month == m].autocorr(lag=1)), 3) for m in months]

    # ── 3. Simulate ensemble ─────────────────────────────────────────────────
    sim_arr, sim_dates = _fast_simulate(ts_stats, sim_year, n_sims, seed=seed)
    sim_stats = _sim_monthly_stats(sim_arr, sim_dates.month.to_numpy())

    # ── 4. Observed reference year (first full year in the series) ───────────
    first_year = int(series.index.year[0])
    obs_yr = series[series.index.year == first_year]
    # Drop Feb 29 from observed if present, to keep 365 days
    obs_yr = obs_yr[~((obs_yr.index.month == 2) & (obs_yr.index.day == 29))]

    return {
        "observed": {
            "dates":  obs_yr.index.strftime("%Y-%m-%d").tolist(),
            "values": [round(float(v), 3) for v in obs_yr.values],
            "year":   first_year,
        },
        "ensemble": {
            "dates": sim_dates.strftime("%Y-%m-%d").tolist(),
            "p10":   np.percentile(sim_arr, 10, axis=0).round(3).tolist(),
            "p25":   np.percentile(sim_arr, 25, axis=0).round(3).tolist(),
            "p50":   np.percentile(sim_arr, 50, axis=0).round(3).tolist(),
            "p75":   np.percentile(sim_arr, 75, axis=0).round(3).tolist(),
            "p90":   np.percentile(sim_arr, 90, axis=0).round(3).tolist(),
            "year":  sim_year,
        },
        "monthly": {
            "obs_mean": obs_mean,
            "sim_mean": sim_stats["mean"],
            "obs_std":  obs_std,
            "sim_std":  sim_stats["std"],
            "obs_acf1": obs_acf1,
            "sim_acf1": sim_stats["acf1"],
        },
        "summary": {
            "obs_mean": round(float(series.mean()), 2),
            "obs_std":  round(float(series.std()),  2),
            "sim_mean": round(float(sim_arr.mean()), 2),
            "sim_std":  round(float(sim_arr.std()),  2),
            "n_years":  int(series.index.year.nunique()),
            "n_sims":   n_sims,
            "dist":     dist,
            "seed":     seed,
        },
    }
