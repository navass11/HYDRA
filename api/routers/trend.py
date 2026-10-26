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
    """Monthly synthetic rain; annual sums retain the original demo signal."""
    rng = np.random.default_rng(99)
    years = np.arange(1974, 2024)
    annual = 600.0 + 1.2 * (years - years[0]) + rng.normal(0, 45, len(years))
    annual[25:] += 30.0
    seasonal_weights = np.array([1.4, 1.2, 1.1, 1.0, 0.9, 0.7, 0.5, 0.6, 0.9, 1.2, 1.3, 1.4])
    weights = seasonal_weights * rng.lognormal(0, 0.25, (len(years), 12))
    weights /= weights.sum(axis=1, keepdims=True)
    return pd.Series(
        (annual[:, None] * weights).ravel(),
        index=pd.date_range("1974-01-01", periods=len(years) * 12, freq="MS"),
        name="precipitation",
    )


async def _load_series_async(file: UploadFile | None, use_demo: bool) -> pd.Series:
    if use_demo:
        return _demo_series()
    if file is None or not hasattr(file, "read"):
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    try:
        df = pd.read_csv(io.BytesIO(await file.read()))
        if df.shape[1] < 2:
            raise HTTPException(status_code=400, detail="El CSV debe tener al menos 2 columnas (fecha/año, valor).")
        raw_dates = df.iloc[:, 0].astype(str).str.strip()
        numeric_years = raw_dates.str.fullmatch(r"\d{4}(?:\.0)?").all()
        if numeric_years:
            dates = pd.to_datetime(raw_dates.str.replace(r"\.0$", "", regex=True), format="%Y", errors="coerce")
        else:
            dates = pd.to_datetime(raw_dates, format="mixed", errors="coerce")
        values = pd.to_numeric(df.iloc[:, 1], errors="coerce")
        valid = dates.notna() & values.notna() & np.isfinite(values)
        if not valid.any():
            raise HTTPException(status_code=400, detail="No hay fechas y valores válidos. Usa años YYYY o fechas ISO YYYY-MM-DD.")
        series = pd.Series(values[valid].to_numpy(dtype=float), index=pd.DatetimeIndex(dates[valid]), name="value").sort_index()
        series.attrs["annual_input"] = bool(numeric_years or (
            len(series) > 1 and not series.index.year.duplicated().any()
            and series.index.month.nunique() == 1
        ))
        return series
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")


def _aggregate_series(series: pd.Series, aggregation: str, variable: str) -> pd.Series:
    if aggregation not in ("annual", "monthly"):
        raise HTTPException(status_code=400, detail="La agregación debe ser anual o mensual.")
    if variable not in ("precipitation", "temperature", "discharge", "other"):
        raise HTTPException(status_code=400, detail="Variable no válida.")
    if aggregation == "monthly" and series.attrs.get("annual_input"):
        raise HTTPException(status_code=400, detail="El CSV contiene valores anuales. Para el análisis mensual necesitas datos con resolución mensual o más frecuente; no se pueden desagregar valores anuales.")
    freq = "YS" if aggregation == "annual" else "MS"
    grouped = series.resample(freq)
    # Rainfall is accumulated; temperature, discharge and other values are averaged.
    result = grouped.sum(min_count=1) if variable == "precipitation" else grouped.mean()
    # Drop periods with <80% of the expected observations: partial first/last years
    # or gaps would otherwise bias sums (and seasonal means) and distort the tests.
    if len(series) > 1:
        step = series.index.to_series().diff().dropna().median()
        if step > pd.Timedelta(0):
            period_len = pd.Series(result.index, index=result.index).pipe(
                lambda s: (s + pd.tseries.frequencies.to_offset(freq)) - s
            )
            expected = (period_len / step).clip(lower=1.0)
            result = result[(grouped.count() / expected) >= 0.8]
    result = result.dropna()
    result.attrs["n_incomplete_dropped"] = int(grouped.count().gt(0).sum() - len(result))
    return result


def _mann_kendall(x: np.ndarray) -> dict:
    """Mann-Kendall test using scipy.stats.kendalltau."""
    n = len(x)
    t = np.arange(n)
    tau, p_value = (0.0, 1.0) if np.ptp(x) == 0 else stats.kendalltau(t, x)
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

    if use_demo and variable != "precipitation":
        raise HTTPException(status_code=400, detail="La demo representa precipitación. Para otra variable, sube un CSV.")
    series = _aggregate_series(await _load_series_async(file, use_demo), aggregation, variable)

    if len(series) < 10:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 10 valores para el análisis de tendencia.")

    x = series.values.astype(float)
    periods = series.index.to_period("Y" if aggregation == "annual" else "M")
    t = (periods.asi8 - periods.asi8[0]).astype(float)
    if aggregation == "monthly":
        t /= 12.0
    index_values = [str(period) for period in periods]

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

    # Plot at most 1000 evenly spaced points, retaining the last observation.
    step = max(1, int(np.ceil(len(series) / 1000)))
    plot_indices = sorted(set(range(0, len(x), step)) | {len(x) - 1})
    series_payload = [
        {"date": str(index_values[i]), "value": _safe(x[i])}
        for i in plot_indices
    ]

    # Sen's slope line endpoints
    sen_line = [
        {"date": str(index_values[0]),       "value": _safe(sen.intercept)},
        {"date": str(index_values[-1]),       "value": _safe(sen.intercept + sen.slope * t[-1])},
    ]

    return {
        "summary": {
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
            "variable": variable,
            "aggregation": aggregation,
            "n_values": int(len(series)),
            "n_displayed": len(series_payload),
            "n_incomplete_dropped": series.attrs.get("n_incomplete_dropped", 0),
            "aggregation_method": "sum" if variable == "precipitation" else "mean",
            "slope_time_unit": "year",
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
