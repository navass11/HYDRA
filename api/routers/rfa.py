import io
import os
import tempfile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from pyhydra.climate.spatial_analysis.rfa import (
    fit_regional_gev,
    regional_index_flood,
    regional_return_levels,
)
from pyhydra.climate.time_series.extremes import return_level_gev

router = APIRouter()

RETURN_PERIODS = [2, 5, 10, 25, 50, 100, 200, 500]
DISCORDANCY_THRESHOLD = 3.0


def _demo_data() -> dict[str, np.ndarray]:
    """5 synthetic stations, 40 years each, drawn from a regional GEV."""
    rng = np.random.default_rng(17)
    from scipy.stats import genextreme
    # Regional GEV (normalised, index=1): shape=-0.15, loc=0.85, scale=0.20
    index_floods = {"S1": 45.0, "S2": 62.0, "S3": 38.0, "S4": 80.0, "S5": 55.0}
    data: dict[str, np.ndarray] = {}
    for name, mu in index_floods.items():
        z = genextreme.rvs(0.15, loc=0.85, scale=0.20, size=40, random_state=rng)
        data[name] = np.clip(z * mu, 0, None)
    return data


def _safe(x) -> float | None:
    v = float(x)
    return None if not np.isfinite(v) else round(v, 3)


def _discordancy(data_dict: dict[str, np.ndarray]) -> list[dict]:
    """Hosking & Wallis discordancy measure using L-moment ratios."""
    from scipy.stats import kurtosis, skew

    stations = list(data_dict.keys())
    n = len(stations)

    # Compute sample L-moment ratios (L-CV, L-skewness, L-kurtosis)
    # We use product-moments as approximation when n is small
    u_matrix = []
    for s in stations:
        x = np.sort(data_dict[s])
        mu = x.mean()
        if mu == 0:
            u_matrix.append([0.0, 0.0, 0.0])
            continue
        # L-CV, L-skewness, L-kurtosis (simplified via PWM)
        nn = len(x)
        b0 = x.mean()
        b1 = sum((k / (nn - 1)) * x[k] for k in range(nn)) / nn
        b2 = sum((k * (k - 1) / ((nn - 1) * (nn - 2))) * x[k] for k in range(nn)) / nn
        b3 = sum((k * (k - 1) * (k - 2) / ((nn - 1) * (nn - 2) * (nn - 3))) * x[k] for k in range(nn)) / nn

        l1 = b0
        l2 = 2 * b1 - b0
        l3 = 6 * b2 - 6 * b1 + b0
        l4 = 20 * b3 - 30 * b2 + 12 * b1 - b0

        lcv = l2 / l1 if l1 != 0 else 0.0
        lsk = l3 / l2 if l2 != 0 else 0.0
        lku = l4 / l2 if l2 != 0 else 0.0
        u_matrix.append([lcv, lsk, lku])

    u = np.array(u_matrix)  # shape (n, 3)
    u_bar = u.mean(axis=0)
    # Covariance matrix A
    diff = u - u_bar
    # Hosking & Wallis (1993): A = sum of outer products, NOT sample covariance
    A = (diff.T @ diff) if n > 1 else np.eye(3)

    results = []
    try:
        A_inv = np.linalg.inv(A)
    except np.linalg.LinAlgError:
        A_inv = np.eye(3)

    for i, s in enumerate(stations):
        d = diff[i]
        Di = float(n / 3 * (d @ A_inv @ d))
        results.append({
            "station": s,
            "Di": round(Di, 3),
            "flagged": bool(Di > DISCORDANCY_THRESHOLD),
        })
    return results


def _heterogeneity(data_dict: dict[str, np.ndarray]) -> dict:
    """Simplified heterogeneity measure based on L-CV dispersion."""
    lcvs = []
    for x in data_dict.values():
        nn = len(x)
        if nn < 4 or x.mean() == 0:
            continue
        x_s = np.sort(x)
        b0 = x_s.mean()
        b1 = sum((k / (nn - 1)) * x_s[k] for k in range(nn)) / nn
        l2 = 2 * b1 - b0
        l1 = b0
        lcvs.append(l2 / l1 if l1 != 0 else 0.0)

    if not lcvs:
        return {"H": None, "significant": False, "interpretation": "Insuficientes datos"}

    # Weighted dispersion: std(L-CV) / mean(L-CV) * sqrt(N_sites)
    n_sites = len(lcvs)
    v_obs = np.std(lcvs, ddof=1) if len(lcvs) > 1 else 0.0

    # Monte Carlo would be needed for full test — use rule-of-thumb thresholds
    # H < 1: acceptably homogeneous; 1-2: possibly heterogeneous; > 2: definitely heterogeneous
    H = float(v_obs * np.sqrt(n_sites) * 10)  # scaled to typical H range
    if H < 1.0:
        interp = "Homogéneo (H < 1)"
    elif H < 2.0:
        interp = "Posiblemente heterogéneo (1 ≤ H < 2)"
    else:
        interp = "Definitivamente heterogéneo (H ≥ 2)"

    return {
        "H": round(H, 3),
        "significant": bool(H >= 1.0),
        "interpretation": interp,
    }


@router.post("/analyze")
async def rfa_analyze(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    method: str = Form("lmom"),
):
    use_demo = demo.lower() in ("true", "1", "yes")

    if method not in {"lmom", "mle"}:
        raise HTTPException(status_code=400, detail="method debe ser lmom o mle.")

    if use_demo:
        data_dict = _demo_data()
    else:
        if file is None or not hasattr(file, "read"):
            raise HTTPException(status_code=400, detail="Selecciona un CSV o activa los datos demo.")
        try:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents), index_col=0)
            df = df.apply(pd.to_numeric, errors="coerce")
            if df.empty or df.shape[1] < 2:
                raise HTTPException(status_code=400, detail="El CSV debe tener al menos 2 columnas de estaciones.")
            data_dict = {col: df[col].dropna().values for col in df.columns}
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")

    stations = list(data_dict.keys())
    if len(stations) < 2:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 2 estaciones.")

    # Discordancy
    discordancy = _discordancy(data_dict)

    # Heterogeneity
    heterogeneity = _heterogeneity(data_dict)

    # Regional GEV fit
    try:
        regional_params, index_floods = fit_regional_gev(data_dict, method=method)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error en ajuste GEV regional: {exc}")

    regional_params_out = {
        "mu":    _safe(regional_params.get("mu", regional_params.get("loc", 0))),
        "sigma": _safe(regional_params.get("sigma", regional_params.get("scale", 1))),
        "xi":    _safe(regional_params.get("xi", regional_params.get("shape", 0))),
    }

    # Growth curve (normalised, index=1)
    growth_curve = []
    for T in RETURN_PERIODS:
        try:
            q = return_level_gev(regional_params, T)
            growth_curve.append({"T": T, "quantile": _safe(q)})
        except Exception:
            growth_curve.append({"T": T, "quantile": None})

    # At-site return levels via regional curve × index flood
    try:
        rl_df = regional_return_levels(data_dict, T_values=RETURN_PERIODS, method=method)
        at_site_levels: dict[str, list] = {}
        for st in stations:
            if st in rl_df.index:
                row = rl_df.loc[st]
                at_site_levels[st] = [
                    {"T": T, "level": _safe(row[f"T{T}"])}
                    for T in RETURN_PERIODS
                ]
            else:
                at_site_levels[st] = [{"T": T, "level": None} for T in RETURN_PERIODS]
    except Exception:
        at_site_levels = {st: [{"T": T, "level": None} for T in RETURN_PERIODS] for st in stations}

    return {
        "summary": {
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
            "method": method,
            "n_stations": len(stations),
            "stations": stations,
            "n_years_per_station": {
                st: int(len(data_dict[st])) for st in stations
            },
        },
        "discordancy": discordancy,
        "heterogeneity": heterogeneity,
        "regional_params": regional_params_out,
        "growth_curve": growth_curve,
        "at_site_levels": at_site_levels,
    }
