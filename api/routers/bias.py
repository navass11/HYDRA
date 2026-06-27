import base64
import io
import os
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from pyhydra.climate.bias_correction.quantile import BiasCorrection

router = APIRouter()

N_QUANTILES = 100  # resolution for QQ plots


def _demo_data() -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """30 years historical + 30 years future with wet bias in model."""
    rng = np.random.default_rng(42)
    n_hist = 365 * 30
    n_future = 365 * 30

    # Observed: realistic daily precip (gamma + zero inflation)
    wet_hist = rng.random(n_hist) < 0.20
    obs_hist = np.where(wet_hist, rng.gamma(0.8, 8.0, n_hist), 0.0)

    # Model historical: biased (scale * 1.4 + additive noise)
    mod_hist = obs_hist * 1.4 + rng.normal(0, 2.0, n_hist)
    mod_hist = np.clip(mod_hist, 0, None)

    # Model future: slightly warmer, keep same bias structure
    wet_fut = rng.random(n_future) < 0.22
    mod_future = np.where(wet_fut, rng.gamma(0.85, 9.5, n_future), 0.0)
    mod_future = mod_future * 1.4 + rng.normal(0, 2.0, n_future)
    mod_future = np.clip(mod_future, 0, None)

    return obs_hist, mod_hist, mod_future


async def _read_1d_series(file: UploadFile) -> np.ndarray:
    """Read a single-column (or 2-col date+value) CSV and return a float array."""
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    if df.shape[1] >= 2:
        col = pd.to_numeric(df.iloc[:, 1], errors="coerce").dropna().values
    else:
        col = pd.to_numeric(df.iloc[:, 0], errors="coerce").dropna().values
    return col.astype(float)


def _safe(x) -> float | None:
    v = float(x)
    return None if not np.isfinite(v) else round(v, 4)


def _qq_data(a: np.ndarray, b: np.ndarray, n: int = N_QUANTILES) -> list[dict]:
    qs = np.linspace(1, 99, n)
    qa = np.percentile(a, qs)
    qb = np.percentile(b, qs)
    return [{"obs": _safe(x), "mod": _safe(y)} for x, y in zip(qa, qb)]


def _monthly_means(obs: np.ndarray, mod_raw: np.ndarray, mod_corr: np.ndarray) -> list[dict]:
    """Approximate monthly means assuming daily data starting Jan 1."""
    def _monthly(arr: np.ndarray) -> list[float]:
        # Group by month assuming data starts Jan 1, cycling annually (non-leap years)
        days_per_month = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])
        # Build one-year template of month indices (1-12)
        year_template = np.repeat(np.arange(1, 13), days_per_month)  # length 365
        n = len(arr)
        reps = n // 365 + 1
        month_arr = np.tile(year_template, reps)[:n]
        return [float(arr[month_arr == m].mean()) for m in range(1, 13)]

    mo = _monthly(obs)
    mr = _monthly(mod_raw)
    mc = _monthly(mod_corr)
    return [
        {"month": i + 1, "obs": _safe(mo[i]), "mod_raw": _safe(mr[i]), "mod_corrected": _safe(mc[i])}
        for i in range(12)
    ]


def _stats(arr: np.ndarray) -> dict:
    pos = arr[arr > 0] if len(arr) > 0 else arr
    return {
        "mean":  _safe(arr.mean()),
        "std":   _safe(arr.std()),
        "p90":   _safe(np.percentile(arr, 90)),
        "max":   _safe(arr.max()),
        "wet_fraction": _safe(float((arr > 0).mean())),
    }


@router.post("/correct")
async def bias_correct(
    file_obs: UploadFile | None = File(None),
    file_mod_hist: UploadFile | None = File(None),
    file_mod_future: UploadFile | None = File(None),
    demo: str = Form("true"),
    method: str = Form("quantile_mapping"),
    variable: str = Form("precipitation"),
):
    use_demo = demo.lower() in ("true", "1", "yes")

    if method not in {"quantile_mapping", "quantile_deltamapping", "scaled_distribution_mapping"}:
        raise HTTPException(status_code=400, detail="method no válido.")

    if use_demo:
        obs_hist, mod_hist, mod_future = _demo_data()
    else:
        if file_obs is None or file_mod_hist is None:
            raise HTTPException(status_code=400, detail="Se necesitan al menos file_obs y file_mod_hist.")
        try:
            obs_hist = await _read_1d_series(file_obs)
            mod_hist = await _read_1d_series(file_mod_hist)
            if file_mod_future is not None and hasattr(file_mod_future, "read"):
                mod_future = await _read_1d_series(file_mod_future)
            else:
                mod_future = mod_hist.copy()
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")

    # Apply bias correction
    try:
        bc = BiasCorrection(obs=obs_hist, mod=mod_hist, sce=mod_future)
        if method == "quantile_mapping":
            corrected = bc.quantile_mapping()
        elif method == "quantile_deltamapping":
            corrected = bc.quantile_deltamapping()
        else:
            corrected = bc.scaled_distribution_mapping(variable=variable)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error en corrección de sesgo: {exc}")

    # Build outputs
    qq_before = _qq_data(obs_hist, mod_future)
    qq_after = _qq_data(obs_hist, corrected)
    monthly = _monthly_means(obs_hist, mod_future, corrected)

    # Corrected series as CSV (base64)
    corr_df = pd.DataFrame({"corrected": corrected})
    csv_bytes = corr_df.to_csv(index=False).encode()
    corrected_csv_b64 = base64.b64encode(csv_bytes).decode()

    return {
        "summary": {
            "source": "demo" if use_demo else "upload",
            "method": method,
            "variable": variable,
            "n_obs_hist": int(len(obs_hist)),
            "n_mod_future": int(len(mod_future)),
        },
        "qq_before": qq_before,
        "qq_after": qq_after,
        "monthly_means": monthly,
        "stats": {
            "obs": _stats(obs_hist),
            "before": _stats(mod_future),
            "after": _stats(corrected),
        },
        "corrected_csv_b64": corrected_csv_b64,
    }
