import io
import os
import re
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from pyhydra.climate.time_series.extremes import fit_gev_map, return_level_gev

router = APIRouter()

# Canonical duration labels and their minutes
_DURATION_MINUTES: dict[str, int] = {
    "10min": 10, "15min": 15, "30min": 30,
    "1h": 60, "2h": 120, "3h": 180, "6h": 360,
    "12h": 720, "24h": 1440, "48h": 2880,
}

_DEFAULT_DURATIONS = ["10min", "30min", "1h", "2h", "6h", "12h", "24h"]

RETURN_PERIODS = [2, 5, 10, 25, 50, 100]


def _parse_duration_minutes(label: str) -> int | None:
    """Convert a column name like '10min', '1h', '24h' to minutes."""
    label = label.strip().lower()
    if label in _DURATION_MINUTES:
        return _DURATION_MINUTES[label]
    m = re.fullmatch(r"(\d+)h(?:our)?s?", label)
    if m:
        return int(m.group(1)) * 60
    m = re.fullmatch(r"(\d+)\s*min(?:ute)?s?", label)
    if m:
        return int(m.group(1))
    return None


def _demo_idf() -> pd.DataFrame:
    """Synthetic annual maxima by duration (mm/h) with realistic IDF parameters."""
    rng = np.random.default_rng(7)
    n_years = 40
    # Reference GEV params at each duration (mu in mm/h, sigma, xi)
    ref_params = {
        "10min": (90.0, 22.0, 0.10),
        "30min": (50.0, 13.0, 0.10),
        "1h":    (32.0,  8.5, 0.12),
        "2h":    (20.0,  5.5, 0.12),
        "6h":    (10.0,  2.8, 0.10),
        "12h":    (6.5,  1.8, 0.10),
        "24h":    (4.0,  1.1, 0.08),
    }
    from scipy.stats import genextreme
    data: dict[str, np.ndarray] = {}
    for dur, (mu, sigma, xi) in ref_params.items():
        # scipy GEV: shape=-xi, loc=mu, scale=sigma
        data[dur] = genextreme.rvs(-xi, loc=mu, scale=sigma, size=n_years, random_state=rng)
    return pd.DataFrame(data)


def _safe(x) -> float | None:
    v = float(x)
    return None if not np.isfinite(v) else round(v, 3)


@router.post("/compute")
async def idf_compute(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
):
    use_demo = demo.lower() in ("true", "1", "yes")

    if use_demo:
        df = _demo_idf()
        duration_labels = list(df.columns)
    else:
        if file is None or not hasattr(file, "read"):
            raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
        try:
            contents = await file.read()
            df_raw = pd.read_csv(io.BytesIO(contents))
            if df_raw.shape[1] < 2:
                raise HTTPException(status_code=400, detail="El CSV debe tener al menos 2 columnas.")
            # Try to parse durations from remaining columns (skip first which is year/date)
            remaining_cols = list(df_raw.columns[1:])
            parsed = [_parse_duration_minutes(c) for c in remaining_cols]
            if all(p is not None for p in parsed):
                duration_labels = remaining_cols
                df = df_raw[remaining_cols].apply(pd.to_numeric, errors="coerce")
            else:
                data_cols = list(df_raw.columns[1:])
                df = df_raw[data_cols].apply(pd.to_numeric, errors="coerce")
                duration_labels = _DEFAULT_DURATIONS[: len(data_cols)]
                df.columns = duration_labels
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")

    # Fit GEV to each duration
    params_out: dict[str, dict] = {}
    idf_table: dict[str, list] = {str(t): [] for t in RETURN_PERIODS}

    for dur in duration_labels:
        col = df[dur].dropna()
        if len(col) < 5:
            for t in RETURN_PERIODS:
                idf_table[str(t)].append(None)
            params_out[dur] = {"mu": None, "sigma": None, "xi": None}
            continue
        try:
            p = fit_gev_map(col)
            params_out[dur] = {
                "mu":    _safe(p["mu"]),
                "sigma": _safe(p["sigma"]),
                "xi":    _safe(p["xi"]),
            }
            for t in RETURN_PERIODS:
                rl = return_level_gev(p, t)
                idf_table[str(t)].append(_safe(rl))
        except Exception:
            for t in RETURN_PERIODS:
                idf_table[str(t)].append(None)
            params_out[dur] = {"mu": None, "sigma": None, "xi": None}

    # Duration in minutes for each label
    duration_minutes = []
    for d in duration_labels:
        mins = _parse_duration_minutes(d)
        duration_minutes.append(mins if mins is not None else (len(duration_minutes) + 1) * 60)

    return {
        "summary": {
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
            "n_years": int(len(df)),
            "n_durations": int(len(duration_labels)),
        },
        "durations": duration_labels,
        "duration_minutes": duration_minutes,
        "return_periods": RETURN_PERIODS,
        "idf_table": idf_table,
        "params": params_out,
    }
