import io
import os
import tempfile

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from scipy.interpolate import RBFInterpolator
from scipy.spatial import cKDTree

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

router = APIRouter()

METHODS = ["idw", "kriging_ordinary", "rbf_linear", "rbf_thin_plate", "nearest"]


def _demo_stations() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    stations = pd.DataFrame({
        "lon": [-3.70, -3.56, -3.85, -4.10, -3.30, -2.90, -4.50, -3.95],
        "lat": [43.37, 43.46, 43.28, 43.41, 43.55, 43.20, 43.10, 43.63],
    })
    values = pd.DataFrame({
        "precip_mm": [42.3, 38.1, 55.7, 60.2, 31.5, 28.8, 70.1, 25.4],
    })
    targets = pd.DataFrame({
        "lon": [-3.75, -3.60, -4.00, -3.45, -3.20],
        "lat": [43.40, 43.35, 43.50, 43.30, 43.48],
    })
    return stations, values, targets


def _parse_csv(upload: UploadFile | None, name: str) -> pd.DataFrame:
    if upload is None:
        raise HTTPException(status_code=400, detail=f"Falta el CSV de {name}.")
    try:
        contents = upload.file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error leyendo {name}: {exc}")
    return df


def _get_coords(df: pd.DataFrame, lon_col: str, lat_col: str) -> np.ndarray:
    missing = [c for c in [lon_col, lat_col] if c not in df.columns]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Columnas de coordenadas no encontradas: {missing}. Disponibles: {list(df.columns)}"
        )
    return df[[lat_col, lon_col]].values.astype(float)


def _idw(
    src_coords: np.ndarray, src_vals: np.ndarray, tgt_coords: np.ndarray, power: float = 2.0
) -> np.ndarray:
    out = np.empty(len(tgt_coords))
    for i, pt in enumerate(tgt_coords):
        dists = np.sqrt(np.sum((src_coords - pt) ** 2, axis=1))
        if np.any(dists == 0):
            out[i] = src_vals[dists == 0][0]
        else:
            w = 1.0 / (dists ** power)
            out[i] = np.sum(w * src_vals) / np.sum(w)
    return out


def _nearest(src_coords: np.ndarray, src_vals: np.ndarray, tgt_coords: np.ndarray) -> np.ndarray:
    tree = cKDTree(src_coords)
    _, idx = tree.query(tgt_coords)
    return src_vals[idx]


def _kriging_ordinary(
    src_coords: np.ndarray, src_vals: np.ndarray, tgt_coords: np.ndarray
) -> np.ndarray:
    try:
        from pykrige.ok import OrdinaryKriging
        lat = src_coords[:, 0]
        lon = src_coords[:, 1]
        tgt_lat = tgt_coords[:, 0]
        tgt_lon = tgt_coords[:, 1]
        ok = OrdinaryKriging(lon, lat, src_vals, variogram_model="spherical", verbose=False, enable_plotting=False)
        z, _ = ok.execute("points", tgt_lon, tgt_lat)
        return np.array(z)
    except ImportError:
        raise HTTPException(status_code=500, detail="pykrige no está instalado en este entorno.")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error en Kriging Ordinario: {exc}")


def _rbf(
    src_coords: np.ndarray, src_vals: np.ndarray, tgt_coords: np.ndarray, kernel: str
) -> np.ndarray:
    try:
        rbf = RBFInterpolator(src_coords, src_vals, kernel=kernel, smoothing=0)
        return rbf(tgt_coords)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error en RBF ({kernel}): {exc}")


def _loocv_rmse(
    src_coords: np.ndarray, src_vals: np.ndarray, method: str, power: float = 2.0
) -> float:
    n = len(src_vals)
    errors = []
    for i in range(n):
        mask = np.ones(n, dtype=bool)
        mask[i] = False
        train_coords = src_coords[mask]
        train_vals = src_vals[mask]
        tgt = src_coords[i:i+1]
        try:
            if method == "idw":
                pred = _idw(train_coords, train_vals, tgt, power)[0]
            elif method == "nearest":
                pred = _nearest(train_coords, train_vals, tgt)[0]
            elif method == "rbf_linear":
                pred = _rbf(train_coords, train_vals, tgt, "linear")[0]
            elif method == "rbf_thin_plate":
                pred = _rbf(train_coords, train_vals, tgt, "thin_plate_spline")[0]
            elif method == "kriging_ordinary":
                pred = _kriging_ordinary(train_coords, train_vals, tgt)[0]
            else:
                continue
            errors.append((pred - src_vals[i]) ** 2)
        except Exception:
            pass
    if not errors:
        return float("nan")
    return float(np.sqrt(np.mean(errors)))


@router.post("/compare")
async def compare_interpolation(
    stations_csv: UploadFile | None = File(None),
    values_csv: UploadFile | None = File(None),
    targets_csv: UploadFile | None = File(None),
    demo: str = Form("true"),
    lon_col: str = Form("lon"),
    lat_col: str = Form("lat"),
    value_col: str = Form(""),
    methods: str = Form("idw,kriging_ordinary,rbf_thin_plate,nearest"),
    idw_power: float = Form(2.0),
    run_loocv: str = Form("true"),
):
    use_demo = demo.lower() in ("true", "1", "yes")

    if use_demo:
        df_stations, df_values, df_targets = _demo_stations()
        lon_c, lat_c = "lon", "lat"
        val_c = "precip_mm"
    else:
        df_stations = _parse_csv(stations_csv, "coordenadas de estaciones")
        df_values = _parse_csv(values_csv, "valores en estaciones")
        df_targets = _parse_csv(targets_csv, "puntos de interpolación")
        lon_c, lat_c = lon_col.strip(), lat_col.strip()
        val_c = value_col.strip()

    if len(df_stations) != len(df_values):
        raise HTTPException(
            status_code=400,
            detail=f"El CSV de coordenadas ({len(df_stations)} filas) y el de valores ({len(df_values)} filas) deben tener el mismo número de filas."
        )

    src_coords = _get_coords(df_stations, lon_c, lat_c)
    tgt_coords = _get_coords(df_targets, lon_c, lat_c)

    if not val_c or val_c not in df_values.columns:
        numeric_cols = df_values.select_dtypes(include="number").columns.tolist()
        if not numeric_cols:
            raise HTTPException(status_code=400, detail="No se encontraron columnas numéricas en el CSV de valores.")
        val_c = numeric_cols[0]

    src_vals = pd.to_numeric(df_values[val_c], errors="coerce").values
    valid_mask = ~np.isnan(src_vals)
    if valid_mask.sum() < 3:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 3 estaciones con datos válidos.")

    src_coords = src_coords[valid_mask]
    src_vals = src_vals[valid_mask]

    requested_methods = [m.strip() for m in methods.split(",") if m.strip() in METHODS]
    if not requested_methods:
        requested_methods = ["idw"]

    results: dict[str, list[float | None]] = {}
    for m in requested_methods:
        try:
            if m == "idw":
                vals = _idw(src_coords, src_vals, tgt_coords, idw_power)
            elif m == "nearest":
                vals = _nearest(src_coords, src_vals, tgt_coords)
            elif m == "rbf_linear":
                vals = _rbf(src_coords, src_vals, tgt_coords, "linear")
            elif m == "rbf_thin_plate":
                vals = _rbf(src_coords, src_vals, tgt_coords, "thin_plate_spline")
            elif m == "kriging_ordinary":
                vals = _kriging_ordinary(src_coords, src_vals, tgt_coords)
            else:
                continue
            results[m] = [round(float(v), 4) if np.isfinite(v) else None for v in vals]
        except HTTPException:
            raise
        except Exception as exc:
            results[m] = [None] * len(tgt_coords)

    loocv: dict[str, float | None] = {}
    do_loocv = run_loocv.lower() in ("true", "1", "yes") and len(src_vals) >= 5
    if do_loocv:
        for m in requested_methods:
            try:
                rmse = _loocv_rmse(src_coords, src_vals, m, idw_power)
                loocv[m] = round(rmse, 4) if np.isfinite(rmse) else None
            except Exception:
                loocv[m] = None

    tgt_lat = tgt_coords[:, 0].tolist()
    tgt_lon = tgt_coords[:, 1].tolist()
    target_rows = [
        {"lat": round(tgt_lat[i], 5), "lon": round(tgt_lon[i], 5)} | {m: results[m][i] for m in requested_methods}
        for i in range(len(tgt_coords))
    ]

    station_rows = [
        {
            "lat": round(float(src_coords[i, 0]), 5),
            "lon": round(float(src_coords[i, 1]), 5),
            "observed": round(float(src_vals[i]), 4),
        }
        for i in range(len(src_vals))
    ]

    return {
        "summary": {
            "n_stations": int(len(src_vals)),
            "n_targets": int(len(tgt_coords)),
            "variable": val_c,
            "methods": requested_methods,
            "loocv_rmse": loocv,
            "source": "demo" if use_demo else "csv",
        },
        "stations": station_rows,
        "targets": target_rows,
    }
