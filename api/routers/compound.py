import io
import os
import tempfile

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from scipy import stats

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

router = APIRouter()

COPULAS = ["gaussian", "gumbel", "clayton", "frank"]


def _demo_events() -> pd.DataFrame:
    rng = np.random.default_rng(42)
    n = 120
    cov = np.array([[1.0, 0.72], [0.72, 1.0]])
    z = rng.multivariate_normal([0, 0], cov, size=n)
    qmax = np.exp(5.8 + 0.55 * z[:, 0])
    precip = np.exp(3.6 + 0.45 * z[:, 1])
    return pd.DataFrame({"Qmax_m3s": np.round(qmax, 2), "Precip_mm": np.round(precip, 2)})


def _plotting_positions(n: int, a: float = 0.44) -> np.ndarray:
    ranks = np.arange(1, n + 1, dtype=float)
    return (ranks - a) / (n + 1 - 2 * a)


def _empirical_cdf(values: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    sorted_idx = np.argsort(values)
    sorted_vals = values[sorted_idx]
    pp = _plotting_positions(len(values))
    cdf = np.empty(len(values), dtype=float)
    cdf[sorted_idx] = pp  # reorder: cdf[i] = F(values[i])
    return sorted_vals, cdf


def _kendall_tau(u: np.ndarray, v: np.ndarray) -> float:
    tau, _ = stats.kendalltau(u, v)
    return float(tau)


def _fit_gaussian_copula(u: np.ndarray, v: np.ndarray) -> float:
    """Return Pearson rho from normal scores."""
    from scipy.special import ndtri
    eps = 1e-6
    u_c = np.clip(u, eps, 1 - eps)
    v_c = np.clip(v, eps, 1 - eps)
    z1 = ndtri(u_c)
    z2 = ndtri(v_c)
    rho = float(np.corrcoef(z1, z2)[0, 1])
    return rho


def _gaussian_copula_cdf(u: np.ndarray, v: np.ndarray, rho: float) -> np.ndarray:
    from scipy.special import ndtri
    from scipy.stats import multivariate_normal
    eps = 1e-6
    u_c = np.clip(u, eps, 1 - eps)
    v_c = np.clip(v, eps, 1 - eps)
    z1 = ndtri(u_c)
    z2 = ndtri(v_c)
    cov = [[1.0, rho], [rho, 1.0]]
    points = np.column_stack([z1, z2])
    return np.atleast_1d(multivariate_normal.cdf(points, mean=[0, 0], cov=cov))


def _gumbel_copula_cdf(u: np.ndarray, v: np.ndarray, theta: float) -> np.ndarray:
    eps = 1e-10
    u_c = np.clip(u, eps, 1 - eps)
    v_c = np.clip(v, eps, 1 - eps)
    a = (-np.log(u_c)) ** theta + (-np.log(v_c)) ** theta
    return np.exp(-a ** (1.0 / theta))


def _clayton_copula_cdf(u: np.ndarray, v: np.ndarray, theta: float) -> np.ndarray:
    eps = 1e-10
    u_c = np.clip(u, eps, 1 - eps)
    v_c = np.clip(v, eps, 1 - eps)
    inner = (u_c ** (-theta) + v_c ** (-theta) - 1)
    inner = np.maximum(inner, eps)
    return inner ** (-1.0 / theta)


def _frank_copula_cdf(u: np.ndarray, v: np.ndarray, theta: float) -> np.ndarray:
    if abs(theta) < 1e-8:
        return u * v
    eps = 1e-10
    u_c = np.clip(u, eps, 1 - eps)
    v_c = np.clip(v, eps, 1 - eps)
    ea = np.exp(-theta * u_c) - 1
    eb = np.exp(-theta * v_c) - 1
    ec = np.exp(-theta) - 1
    denom = np.log1p(ea * eb / ec)
    return -denom / theta


def _tau_to_theta(tau: float, family: str) -> float:
    if family == "gaussian":
        return np.sin(np.pi / 2 * tau)
    if family == "gumbel":
        return max(1.0 / (1 - tau), 1.001)
    if family == "clayton":
        return max(2 * tau / (1 - tau), 0.001)
    if family == "frank":
        return 8 * tau
    return tau


def _isocurves(
    family: str, theta: float, n_points: int = 80
) -> dict[int, list[dict]]:
    T_values = [2, 5, 10, 25, 50, 100, 200, 500]
    u = np.linspace(0.005, 0.995, n_points)
    curves: dict[int, list[dict]] = {}
    for T in T_values:
        p_or = 1.0 / T
        target_c = 1 - p_or
        v_curve = []
        for ui in u:
            lo, hi = 1e-6, 1 - 1e-6
            for _ in range(60):
                mid = (lo + hi) / 2
                arr_u = np.array([ui])
                arr_v = np.array([mid])
                if family == "gaussian":
                    c = float(_gaussian_copula_cdf(arr_u, arr_v, theta)[0])
                elif family == "gumbel":
                    c = float(_gumbel_copula_cdf(arr_u, arr_v, theta)[0])
                elif family == "clayton":
                    c = float(_clayton_copula_cdf(arr_u, arr_v, theta)[0])
                else:
                    c = float(_frank_copula_cdf(arr_u, arr_v, theta)[0])
                if c < target_c:
                    lo = mid
                else:
                    hi = mid
            v_curve.append(round((lo + hi) / 2, 5))
        curves[T] = [{"u": round(float(u[i]), 5), "v": round(v_curve[i], 5)} for i in range(n_points)]
    return curves


def _compute_joint_rp_grid(
    x_obs: np.ndarray, y_obs: np.ndarray, u_all: np.ndarray, v_all: np.ndarray,
    family: str, theta: float
) -> list[dict]:
    arr_u = np.array(u_all)
    arr_v = np.array(v_all)
    if family == "gaussian":
        c = _gaussian_copula_cdf(arr_u, arr_v, theta)
    elif family == "gumbel":
        c = _gumbel_copula_cdf(arr_u, arr_v, theta)
    elif family == "clayton":
        c = _clayton_copula_cdf(arr_u, arr_v, theta)
    else:
        c = _frank_copula_cdf(arr_u, arr_v, theta)
    p_or = 1 - c
    p_or = np.maximum(p_or, 1e-6)
    T_or = 1.0 / p_or
    return [{"x": round(float(x_obs[i]), 3), "y": round(float(y_obs[i]), 3),
              "u": round(float(arr_u[i]), 4), "v": round(float(arr_v[i]), 4),
              "T_or": round(float(T_or[i]), 1)} for i in range(len(x_obs))]


@router.post("/fit")
async def fit_compound(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    var1: str = Form("Qmax_m3s"),
    var2: str = Form("Precip_mm"),
    family: str = Form("gaussian"),
):
    family = family.lower()
    if family not in COPULAS:
        raise HTTPException(status_code=400, detail=f"Familia no válida. Opciones: {COPULAS}")

    use_demo = demo.lower() in ("true", "1", "yes")
    if use_demo:
        df = _demo_events()
        col1, col2 = list(df.columns)[:2]
    else:
        if file is None:
            raise HTTPException(status_code=400, detail="Sube un CSV o activa los datos demo.")
        try:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents))
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Error leyendo CSV: {exc}")
        col1, col2 = var1.strip(), var2.strip()

    missing = [c for c in [col1, col2] if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Columnas no encontradas: {missing}. Disponibles: {list(df.columns)}")

    sub = df[[col1, col2]].copy()
    sub[col1] = pd.to_numeric(sub[col1], errors="coerce")
    sub[col2] = pd.to_numeric(sub[col2], errors="coerce")
    sub = sub.dropna()
    sub = sub[(sub[col1] > 0) & (sub[col2] > 0)]

    if len(sub) < 10:
        raise HTTPException(status_code=400, detail="Se necesitan al menos 10 pares de datos válidos.")

    x = sub[col1].values
    y = sub[col2].values
    n = len(x)

    _, u_obs = _empirical_cdf(x)
    _, v_obs = _empirical_cdf(y)

    tau = _kendall_tau(x, y)
    rho_spearman, _ = stats.spearmanr(x, y)
    theta = _tau_to_theta(tau, family)

    isocurves = _isocurves(family, theta)
    obs_points = _compute_joint_rp_grid(x, y, u_obs, v_obs, family, theta)

    return {
        "summary": {
            "n": n,
            "var1": col1,
            "var2": col2,
            "family": family,
            "theta": round(theta, 4),
            "kendall_tau": round(tau, 4),
            "spearman_rho": round(float(rho_spearman), 4),
            "source": "demo" if use_demo else (file.filename if hasattr(file, "filename") else "csv"),
        },
        "marginals": {
            col1: {
                "mean": round(float(x.mean()), 3),
                "std": round(float(x.std()), 3),
                "min": round(float(x.min()), 3),
                "max": round(float(x.max()), 3),
            },
            col2: {
                "mean": round(float(y.mean()), 3),
                "std": round(float(y.std()), 3),
                "min": round(float(y.min()), 3),
                "max": round(float(y.max()), 3),
            },
        },
        "scatter": obs_points,
        "isocurves": {str(k): v for k, v in isocurves.items()},
    }
