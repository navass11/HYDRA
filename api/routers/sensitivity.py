import io
from pathlib import Path

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()

REPO_ROOT = Path(__file__).resolve().parents[2]
DEMO_CSV = REPO_ROOT / "notebooks/modeling/hydraulic/manning_sensitivity/hecras_sensitivity_results.csv"

REQUIRED_COLUMNS = {
    "simulation",
    "manning_mean",
    "manning_median",
    "depth_mean",
    "depth_median",
    "flooded_area_km2",
}


def _clean_results(df: pd.DataFrame) -> pd.DataFrame:
    missing = sorted(REQUIRED_COLUMNS - set(df.columns))
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan columnas requeridas: {', '.join(missing)}",
        )

    cleaned = df[list(REQUIRED_COLUMNS)].copy()
    for col in REQUIRED_COLUMNS:
        cleaned[col] = pd.to_numeric(cleaned[col], errors="coerce")
    cleaned = cleaned.dropna().sort_values("simulation")

    if len(cleaned) < 5:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 5 simulaciones validas.")

    return cleaned


def _linear_fit(x: pd.Series, y: pd.Series) -> dict:
    slope, intercept = np.polyfit(x.to_numpy(), y.to_numpy(), 1)
    pred = slope * x + intercept
    ss_res = float(((y - pred) ** 2).sum())
    ss_tot = float(((y - y.mean()) ** 2).sum())
    r2 = 1.0 - ss_res / ss_tot if ss_tot > 0 else np.nan
    corr = float(x.corr(y))
    return {
        "slope": round(float(slope), 5),
        "intercept": round(float(intercept), 5),
        "r2": round(float(r2), 4),
        "corr": round(corr, 4),
    }


def _payload(df: pd.DataFrame, source: str) -> dict:
    metrics = ["manning_mean", "manning_median", "depth_mean", "depth_median", "flooded_area_km2"]
    corr = df[metrics].corr().round(4)
    regressions = {
        "depth_mean": _linear_fit(df["manning_mean"], df["depth_mean"]),
        "depth_median": _linear_fit(df["manning_median"], df["depth_median"]),
        "flooded_area_km2": _linear_fit(df["manning_mean"], df["flooded_area_km2"]),
    }

    summary = {
        "source": source,
        "n_sims": int(len(df)),
        "manning_mean_min": round(float(df["manning_mean"].min()), 4),
        "manning_mean_max": round(float(df["manning_mean"].max()), 4),
        "depth_mean_avg": round(float(df["depth_mean"].mean()), 3),
        "depth_mean_max": round(float(df["depth_mean"].max()), 3),
        "flooded_area_avg": round(float(df["flooded_area_km2"].mean()), 3),
        "flooded_area_max": round(float(df["flooded_area_km2"].max()), 3),
    }

    return {
        "summary": summary,
        "correlations": {
            row: {col: float(corr.loc[row, col]) for col in metrics}
            for row in metrics
        },
        "regressions": regressions,
        "records": df.round(6).to_dict(orient="records"),
    }


@router.post("/manning")
async def manning_sensitivity(file: UploadFile | None = File(None)):
    uploaded_file = file if hasattr(file, "read") else None

    if uploaded_file is None:
        if not DEMO_CSV.exists():
            raise HTTPException(status_code=404, detail="No se encuentra el CSV demo de sensibilidad.")
        df = pd.read_csv(DEMO_CSV)
        return _payload(_clean_results(df), "demo")

    try:
        contents = await uploaded_file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")

    return _payload(_clean_results(df), uploaded_file.filename or "csv")
