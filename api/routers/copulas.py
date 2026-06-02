import io
import os
import tempfile

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

from pyhydra.climate.spatial_analysis.copulas import FloodEventCopula

router = APIRouter()

DEFAULT_CONTINUOUS = ["Qmax", "volume", "duration"]
DEFAULT_DISCRETE = ["season"]


def _demo_events() -> pd.DataFrame:
    rng = np.random.default_rng(0)
    n = 80
    cov = np.array([[1.0, 0.85], [0.85, 1.0]])
    z = rng.multivariate_normal([0, 0], cov, size=n)
    qmax = np.exp(6.5 + 0.6 * z[:, 0])
    volume = np.exp(3.2 + 0.5 * z[:, 1])
    duration = np.clip(volume / 4 + rng.exponential(2, n), 0.5, None)
    season = rng.choice([1, 2, 3, 4], size=n, p=[0.45, 0.25, 0.20, 0.10])
    return pd.DataFrame({
        "Qmax": qmax,
        "volume": volume,
        "duration": duration,
        "season": season,
    })


async def _load_events(file: UploadFile | None, use_demo: bool) -> pd.DataFrame:
    uploaded_file = file if hasattr(file, "read") else None
    if use_demo:
        return _demo_events()
    if uploaded_file is None:
        raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
    try:
        contents = await uploaded_file.read()
        return pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")


def _parse_vars(value: str, default: list[str]) -> list[str]:
    parsed = [v.strip() for v in value.split(",") if v.strip()]
    return parsed or default


def _clean_events(df: pd.DataFrame, continuous_vars: list[str], discrete_vars: list[str]) -> pd.DataFrame:
    required = continuous_vars + discrete_vars
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Faltan columnas requeridas: {', '.join(missing)}")

    clean = df[required].copy()
    for col in required:
        clean[col] = pd.to_numeric(clean[col], errors="coerce")
    clean = clean.dropna()
    for col in continuous_vars:
        clean = clean[clean[col] > 0]
    if len(clean) < 15:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 15 eventos validos.")
    return clean.reset_index(drop=True)


def _corr_payload(df: pd.DataFrame, variables: list[str]) -> dict:
    corr = df[variables].corr().round(4)
    return {row: {col: float(corr.loc[row, col]) for col in variables} for row in variables}


@router.post("/fit-sample")
async def fit_sample(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    continuous_vars: str = Form(",".join(DEFAULT_CONTINUOUS)),
    discrete_vars: str = Form(",".join(DEFAULT_DISCRETE)),
    n_samples: int = Form(1000),
):
    if not 50 <= n_samples <= 20000:
        raise HTTPException(status_code=400, detail="n_samples debe estar entre 50 y 20000.")

    cont = _parse_vars(continuous_vars, DEFAULT_CONTINUOUS)
    disc = _parse_vars(discrete_vars, DEFAULT_DISCRETE)
    use_demo = demo.lower() in ("true", "1", "yes")
    observed = _clean_events(await _load_events(file, use_demo), cont, disc)

    try:
        model = FloodEventCopula(continuous_vars=cont, discrete_vars=disc)
        model.fit(observed)
        synthetic = model.sample(n_samples)
    except ImportError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error ajustando copula: {exc}")

    variables = cont + disc
    summary = {
        "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
        "n_observed": int(len(observed)),
        "n_synthetic": int(len(synthetic)),
        "continuous_vars": cont,
        "discrete_vars": disc,
    }
    for col in cont:
        summary[f"{col}_obs_mean"] = round(float(observed[col].mean()), 3)
        summary[f"{col}_syn_mean"] = round(float(synthetic[col].mean()), 3)

    return {
        "summary": summary,
        "observed_corr": _corr_payload(observed, variables),
        "synthetic_corr": _corr_payload(synthetic, variables),
        "observed": observed.head(250).round(4).to_dict(orient="records"),
        "synthetic": synthetic.head(1000).round(4).to_dict(orient="records"),
    }
