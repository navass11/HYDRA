import io
import os
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from pyhydra.climate.time_series.events import (
    extract_discharge_events,
    extract_precipitation_events_pot,
)
from pyhydra.climate.time_series.extremes import (
    extract_block_maxima,
    fit_gev_fisher,
    fit_gev_map,
    return_level_gev,
)

router = APIRouter()


def _demo_precipitation() -> pd.Series:
    """Synthetic daily precipitation with seasonality and clustered extremes."""
    rng = np.random.default_rng(123)
    dates = pd.date_range("1980-01-01", "2024-12-31", freq="D")
    doy = dates.dayofyear.to_numpy()
    wet_prob = 0.16 + 0.12 * (1 + np.sin(2 * np.pi * (doy / 365 - 0.18))) / 2
    wet = rng.random(len(dates)) < wet_prob
    intensity = rng.gamma(shape=1.25, scale=10.0, size=len(dates))
    values = np.where(wet, intensity, 0.0)

    # Add a few coherent extreme clusters so event selection has visible structure.
    for year in range(1982, 2025, 3):
        center = pd.Timestamp(f"{year}-{rng.integers(9, 12):02d}-{rng.integers(3, 25):02d}")
        if center in dates:
            pos = dates.get_loc(center)
            width = rng.integers(2, 5)
            boost = rng.gamma(shape=2.2, scale=28.0, size=2 * width + 1)
            i0, i1 = max(0, pos - width), min(len(values), pos + width + 1)
            values[i0:i1] += boost[: i1 - i0]

    return pd.Series(values, index=dates, name="precipitation")


def _load_series(file: UploadFile | None, use_demo: bool) -> pd.Series:
    uploaded_file = file if hasattr(file, "read") else None
    if use_demo:
        return _demo_precipitation()
    if uploaded_file is None:
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    raise RuntimeError("_load_series must be called through _load_series_async for uploads")


async def _load_series_async(file: UploadFile | None, use_demo: bool) -> pd.Series:
    uploaded_file = file if hasattr(file, "read") else None
    if use_demo:
        return _demo_precipitation()
    if uploaded_file is None:
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    try:
        contents = await uploaded_file.read()
        df = pd.read_csv(io.BytesIO(contents), parse_dates=[0], index_col=0)
        series = pd.to_numeric(df.iloc[:, 0], errors="coerce").dropna()
        series.index = pd.DatetimeIndex(series.index)
        return series.sort_index()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")


def _event_payload(stats: pd.DataFrame, bounds: pd.DataFrame, value_col: str) -> list[dict]:
    rows = []
    for pos, (_, row) in enumerate(stats.head(80).iterrows()):
        b = bounds.iloc[pos] if pos < len(bounds) else None
        rows.append({
            "start": pd.Timestamp(b["start"]).strftime("%Y-%m-%d") if b is not None else None,
            "end": pd.Timestamp(b["end"]).strftime("%Y-%m-%d") if b is not None else None,
            "peak_date": pd.Timestamp(row.get("date_peak", row.get("date_start"))).strftime("%Y-%m-%d"),
            "peak": round(float(row["peak"]), 3),
            "total_or_volume": round(float(row.get("total", row.get("volume", np.nan))), 3),
            "duration": int(row["duration"]),
            "value": round(float(row[value_col]), 3),
        })
    return rows


def _fit_payload(maxima: pd.Series, n_samples: int, return_periods: list[float]) -> dict:
    if len(maxima) < 8:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 8 máximos anuales para ajustar la GEV.")

    map_params = fit_gev_map(maxima)
    point_levels = {str(int(t)): round(float(return_level_gev(map_params, t)), 3) for t in return_periods}

    bands = {}
    posterior_summary = None
    try:
        samples = fit_gev_fisher(maxima, n_samples=n_samples)
        posterior_summary = {
            col: {
                "mean": round(float(samples[col].mean()), 4),
                "q05": round(float(samples[col].quantile(0.05)), 4),
                "q50": round(float(samples[col].quantile(0.50)), 4),
                "q95": round(float(samples[col].quantile(0.95)), 4),
            }
            for col in ["mu", "sigma", "xi"]
        }
        for t in return_periods:
            vals = []
            for _, row in samples.iterrows():
                try:
                    vals.append(return_level_gev(row.to_dict(), t))
                except Exception:
                    continue
            arr = np.asarray(vals, dtype=float)
            arr = arr[np.isfinite(arr)]
            bands[str(int(t))] = {
                "q05": round(float(np.quantile(arr, 0.05)), 3) if len(arr) else np.nan,
                "q50": round(float(np.quantile(arr, 0.50)), 3) if len(arr) else np.nan,
                "q95": round(float(np.quantile(arr, 0.95)), 3) if len(arr) else np.nan,
            }
    except Exception:
        bands = {str(int(t)): {"q05": np.nan, "q50": point_levels[str(int(t))], "q95": np.nan} for t in return_periods}

    return {
        "params_map": {
            "mu": round(float(map_params["mu"]), 4),
            "sigma": round(float(map_params["sigma"]), 4),
            "xi": round(float(map_params["xi"]), 4),
            "map_logpost": round(float(map_params["map_logpost"]), 3),
        },
        "posterior_summary": posterior_summary,
        "return_levels": point_levels,
        "return_level_bands": bands,
    }


@router.post("/events-gev")
async def events_gev(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    variable: str = Form("precipitation"),
    threshold: float | None = Form(None),
    threshold_quantile: float = Form(0.95),
    min_sep: int = Form(5),
    n_samples: int = Form(1500),
):
    use_demo = demo.lower() in ("true", "1", "yes")
    if variable not in {"precipitation", "discharge"}:
        raise HTTPException(status_code=400, detail="variable debe ser precipitation o discharge.")
    if not 0.5 <= threshold_quantile <= 0.995:
        raise HTTPException(status_code=400, detail="threshold_quantile debe estar entre 0.5 y 0.995.")
    if not 1 <= min_sep <= 60:
        raise HTTPException(status_code=400, detail="min_sep debe estar entre 1 y 60.")
    if not 200 <= n_samples <= 10000:
        raise HTTPException(status_code=400, detail="n_samples debe estar entre 200 y 10000.")

    series = await _load_series_async(file, use_demo)
    if len(series) < 365 * 8:
        raise HTTPException(status_code=400, detail="La serie debe cubrir al menos 8 años diarios.")

    if threshold is None:
        positive = series[series > 0] if variable == "precipitation" else series
        threshold = float(positive.quantile(threshold_quantile))

    if variable == "precipitation":
        stats, bounds = extract_precipitation_events_pot(series, threshold=threshold, min_sep=min_sep)
        event_value_col = "total"
    else:
        stats, bounds = extract_discharge_events(series, threshold=threshold, threshold2=threshold)
        event_value_col = "volume"

    maxima = extract_block_maxima(series, freq="YE")
    return_periods = [2, 5, 10, 25, 50, 100]
    fit = _fit_payload(maxima, n_samples=n_samples, return_periods=return_periods)
    order = stats.sort_values("peak", ascending=False).index
    stats_ranked = stats.loc[order].reset_index(drop=True)
    bounds_ranked = bounds.loc[order].reset_index(drop=True)

    return {
        "summary": {
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
            "variable": variable,
            "start": series.index.min().strftime("%Y-%m-%d"),
            "end": series.index.max().strftime("%Y-%m-%d"),
            "n_days": int(len(series)),
            "n_years": int(series.index.year.nunique()),
            "threshold": round(float(threshold), 3),
            "threshold_quantile": threshold_quantile,
            "min_sep": min_sep,
            "n_events": int(len(stats)),
            "n_maxima": int(len(maxima)),
        },
        "events": _event_payload(stats_ranked, bounds_ranked, event_value_col),
        "maxima": [
            {"date": idx.strftime("%Y-%m-%d"), "year": int(idx.year), "value": round(float(v), 3)}
            for idx, v in maxima.items()
        ],
        **fit,
    }
