import io
import os
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from scipy import stats

router = APIRouter()


def _demo_series() -> pd.Series:
    """50 years of annual precipitation with a slight positive trend (+1 mm/year)."""
    rng = np.random.default_rng(99)
    years = np.arange(1974, 2024)
    # Base signal: 600 mm/yr + trend + noise
    values = 600.0 + 1.2 * (years - years[0]) + rng.normal(0, 45, len(years))
    # Add a step change around year 25 to make Pettitt detectable
    values[25:] += 30.0
    return pd.Series(values, index=pd.Index(years, name="year"), name="precipitation")


async def _load_series_async(file: UploadFile | None, use_demo: bool) -> pd.Series:
    if use_demo:
        return _demo_series()
    if file is None or not hasattr(file, "read"):
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        if df.shape[1] < 2:
            raise HTTPException(status_code=400, detail="El CSV debe tener al menos 2 columnas (fecha/año, valor).")
        values = pd.to_numeric(df.iloc[:, 1], errors="coerce").dropna()
        index_raw = df.iloc[:, 0].iloc[values.index]
        # Try year parsing
        try:
            index_vals = pd.to_datetime(index_raw).dt.year
        except Exception:
            index_vals = pd.to_numeric(index_raw, errors="coerce")
        return pd.Series(values.values, index=index_vals.values, name="value").sort_index()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")


def _mann_kendall(x: np.ndarray) -> dict:
    """Mann-Kendall test using scipy.stats.kendalltau."""
    n = len(x)
    t = np.arange(n)
    tau, p_value = stats.kendalltau(t, x)
    if p_value < 0.01:
        trend = "increasing" if tau > 0 else "decreasing"
    elif p_value < 0.05:
        trend = "increasing" if tau > 0 else "decreasing"
    else:
        trend = "no trend"
    return {
        "tau": round(float(tau), 4),
        "p_value": round(float(p_value), 4),
        "trend": trend,
        "significant": bool(p_value < 0.05),
    }


def _pettitt(x: np.ndarray) -> dict:
    """Pettitt change-point test (rank-based, approximate p-value)."""
    n = len(x)
    r = stats.rankdata(x)
    # U_t = 2 * sum_{j=1}^{t} r_j - t*(n+1)
    U = np.zeros(n)
    for t in range(1, n):
        U[t] = 2 * r[:t].sum() - t * (n + 1)
    K = np.max(np.abs(U))
    cp_idx = int(np.argmax(np.abs(U)))
    # Approximate p-value: p ≈ 2 * exp(-6K² / (n³+n²))
    p_approx = float(2.0 * np.exp(-6.0 * K**2 / (n**3 + n**2)))
    p_approx = min(p_approx, 1.0)
    return {
        "change_point_index": int(cp_idx),
        "p_value": round(p_approx, 4),
        "significant": bool(p_approx < 0.05),
    }


def _safe(x) -> float | None:
    if x is None:
        return None
    v = float(x)
    return None if not np.isfinite(v) else round(v, 4)


@router.post("/analyze")
async def trend_analyze(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    variable: str = Form("precipitation"),
    aggregation: str = Form("annual"),
):
    use_demo = demo.lower() in ("true", "1", "yes")

    series = await _load_series_async(file, use_demo)

    if len(series) < 10:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 10 valores para el análisis de tendencia.")

    x = series.values.astype(float)
    t = np.arange(len(x))
    index_values = list(series.index)

    # Mann-Kendall
    mk = _mann_kendall(x)

    # Pettitt
    pett = _pettitt(x)
    cp_idx = pett["change_point_index"]
    # Map index to actual year/date label
    change_year = index_values[cp_idx] if 0 < cp_idx < len(index_values) else None
    pett["change_year"] = str(change_year) if change_year is not None else None

    # Sen's slope
    sen = stats.theilslopes(x, t, alpha=0.90)
    sen_result = {
        "slope":          _safe(sen.slope),
        "intercept":      _safe(sen.intercept),
        "slope_ci_low":   _safe(sen.low_slope),
        "slope_ci_high":  _safe(sen.high_slope),
    }

    # Linear regression
    lin = stats.linregress(t, x)
    lin_result = {
        "slope":     _safe(lin.slope),
        "intercept": _safe(lin.intercept),
        "r2":        _safe(lin.rvalue ** 2),
    }

    # Series payload (limit to 200 points max)
    step = max(1, len(series) // 200)
    series_payload = [
        {"date": str(index_values[i]), "value": _safe(x[i])}
        for i in range(0, len(x), step)
    ]

    # Sen's slope line endpoints
    sen_line = [
        {"date": str(index_values[0]),       "value": _safe(sen_result["intercept"])},
        {"date": str(index_values[-1]),       "value": _safe(sen_result["intercept"] + sen_result["slope"] * (len(x) - 1))},
    ]

    return {
        "summary": {
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
            "variable": variable,
            "aggregation": aggregation,
            "n_values": int(len(series)),
            "start": str(index_values[0]),
            "end": str(index_values[-1]),
        },
        "series": series_payload,
        "sen_line": sen_line,
        "mann_kendall": mk,
        "pettitt": pett,
        "sens_slope": sen_result,
        "linear": lin_result,
    }
