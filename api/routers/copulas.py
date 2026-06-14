import io
import os
import tempfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

from pyhydra.climate.spatial_analysis.copulas import BivariateCopula, FloodEventCopula

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


def _demo_compound() -> pd.DataFrame:
    """Synthetic dataset: river peak flow (m³/s) vs sea level (m) — compound flood."""
    rng = np.random.default_rng(42)
    n = 120
    cov = np.array([[1.0, 0.72], [0.72, 1.0]])
    z = rng.multivariate_normal([0, 0], cov, size=n)
    qmax = np.exp(5.8 + 0.55 * z[:, 0])          # ~300 m³/s median
    sea_level = 0.45 + 0.28 * z[:, 1] + 0.05 * rng.standard_normal(n)
    sea_level = np.clip(sea_level, 0.01, None)
    return pd.DataFrame({"Qmax_m3s": qmax, "SL_m": sea_level})


async def _load_events(
    file: UploadFile | None, use_demo: bool, demo_type: str = "flood"
) -> pd.DataFrame:
    uploaded_file = file if hasattr(file, "read") else None
    if use_demo:
        return _demo_compound() if demo_type == "compound" else _demo_events()
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
    observed = _clean_events(await _load_events(file, use_demo, "flood"), cont, disc)

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


# ── Helpers for joint-plot ────────────────────────────────────────────────────

def _extract_isoline_paths(cs, extent, n_pts=120):
    """Extract the longest contour path per level, clipped to extent."""
    paths_by_level = {}
    try:
        level_paths = [col.get_paths() for col in cs.collections]
    except AttributeError:
        level_paths = [[p] for p in cs.get_paths()]

    for i, level in enumerate(cs.levels):
        paths = level_paths[i] if i < len(level_paths) else []
        if not paths:
            continue
        pts = max(paths, key=lambda p: len(p.vertices)).vertices
        mask = (
            (pts[:, 0] >= extent[0]) & (pts[:, 0] <= extent[1]) &
            (pts[:, 1] >= extent[2]) & (pts[:, 1] <= extent[3])
        )
        pts = pts[mask]
        if len(pts) < 2:
            continue
        # Downsample to n_pts
        idx = np.round(np.linspace(0, len(pts) - 1, min(n_pts, len(pts)))).astype(int)
        pts = pts[idx]
        paths_by_level[int(level)] = {"x": pts[:, 0].tolist(), "y": pts[:, 1].tolist()}
    return paths_by_level


def _maxprob(copula: BivariateCopula, pts_x: list, pts_y: list) -> tuple[float, float]:
    """Maximum Probability Design Event on an isoline."""
    px = np.asarray(pts_x)
    py = np.asarray(pts_y)
    eps = 1e-5
    u = copula.marginal_cdf_x(px)
    v = copula.marginal_cdf_y(py)
    u_lo = np.clip(u - eps, 1e-10, 1 - 1e-10)
    u_hi = np.clip(u + eps, 1e-10, 1 - 1e-10)
    v_lo = np.clip(v - eps, 1e-10, 1 - 1e-10)
    v_hi = np.clip(v + eps, 1e-10, 1 - 1e-10)
    c_uv = (
        copula.cdf(u_hi, v_hi) - copula.cdf(u_hi, v_lo)
        - copula.cdf(u_lo, v_hi) + copula.cdf(u_lo, v_lo)
    ) / (4 * eps ** 2)
    pdf = np.clip(
        c_uv
        * copula._mx[0].pdf(px, *copula._mx[1])
        * copula._my[0].pdf(py, *copula._my[1]),
        0, None,
    )
    idx = int(np.argmax(pdf))
    return float(px[idx]), float(py[idx])


@router.post("/joint-plot")
async def joint_plot(
    file: UploadFile | None = File(None),
    demo: str = Form("true"),
    demo_type: str = Form("compound"),
    x_var: str = Form("Qmax_m3s"),
    y_var: str = Form("SL_m"),
    family: str = Form("gumbel"),
    n_synthetic: int = Form(2000),
    t_list: str = Form("2,10,50,100,500"),
):
    """
    Fit a BivariateCopula and return data for a Plotly joint return-period plot
    (AND/OR isolines + MaxProb markers + marginal PDFs).
    """
    T_vals = sorted({int(t.strip()) for t in t_list.split(",") if t.strip().isdigit()})
    if not T_vals:
        raise HTTPException(status_code=400, detail="t_list must contain integer return periods.")
    if family not in ("gumbel", "clayton", "frank"):
        raise HTTPException(status_code=400, detail="family must be gumbel, clayton or frank.")

    observed = await _load_events(file, demo.lower() in ("true", "1", "yes"), demo_type)
    for col in (x_var, y_var):
        if col not in observed.columns:
            raise HTTPException(status_code=400, detail=f"Column '{col}' not found.")

    x = pd.to_numeric(observed[x_var], errors="coerce").dropna().values
    y = pd.to_numeric(observed[y_var], errors="coerce").dropna().values
    n = min(len(x), len(y))
    x, y = x[:n], y[:n]
    if n < 10:
        raise HTTPException(status_code=400, detail="Need at least 10 paired observations.")

    try:
        copula = BivariateCopula(family=family)
        copula.fit(x, y, labels=(x_var, y_var))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Copula fitting failed: {exc}")

    # ── Extent ────────────────────────────────────────────────────────────────
    dx = (x.max() - x.min()) * 0.15
    dy = (y.max() - y.min()) * 0.15
    extent = [float(x.min() - dx), float(x.max() + dx),
              float(y.min() - dy), float(y.max() + dy)]

    # ── Grid for contour computation ─────────────────────────────────────────
    n_grid = 120
    u_lin = np.linspace(1e-3, 1 - 1e-3, n_grid)
    UU, VV = np.meshgrid(u_lin, u_lin)
    C = copula.cdf(UU, VV)
    T_or  = 1.0 / np.maximum(1.0 - C, 1e-12)
    T_and = 1.0 / np.maximum(1.0 - UU - VV + C, 1e-12)
    XX = copula.marginal_ppf_x(UU)
    YY = copula.marginal_ppf_y(VV)

    # ── Isolines via matplotlib Agg (not displayed) ──────────────────────────
    fig_mpl, ax_mpl = plt.subplots()
    cs_or  = ax_mpl.contour(XX, YY, T_or,  levels=T_vals)
    cs_and = ax_mpl.contour(XX, YY, T_and, levels=T_vals)
    plt.close(fig_mpl)

    isolines_or  = _extract_isoline_paths(cs_or,  extent)
    isolines_and = _extract_isoline_paths(cs_and, extent)

    # ── MaxProb per T ─────────────────────────────────────────────────────────
    maxprob_or  = {}
    maxprob_and = {}
    for T_key, iso in isolines_or.items():
        try:
            mx, my = _maxprob(copula, iso["x"], iso["y"])
            maxprob_or[T_key] = {"x": mx, "y": my}
        except Exception:
            pass
    for T_key, iso in isolines_and.items():
        try:
            mx, my = _maxprob(copula, iso["x"], iso["y"])
            maxprob_and[T_key] = {"x": mx, "y": my}
        except Exception:
            pass

    # ── Marginal PDFs ─────────────────────────────────────────────────────────
    pdf_x_vals = np.linspace(extent[0], extent[1], 300)
    pdf_y_vals = np.linspace(extent[2], extent[3], 300)
    pdf_x = copula._mx[0].pdf(pdf_x_vals, *copula._mx[1])
    pdf_y = copula._my[0].pdf(pdf_y_vals, *copula._my[1])

    # T-year marginal quantiles
    T_arr = np.asarray(T_vals, dtype=float)
    qx = np.clip(copula._mx[0].ppf(1 - 1 / T_arr, *copula._mx[1]), extent[0], extent[1])
    qy = np.clip(copula._my[0].ppf(1 - 1 / T_arr, *copula._my[1]), extent[2], extent[3])
    marginal_quantiles_x = {int(T): float(q) for T, q in zip(T_vals, qx)}
    marginal_quantiles_y = {int(T): float(q) for T, q in zip(T_vals, qy)}

    # ── Synthetic samples ─────────────────────────────────────────────────────
    syn_x, syn_y = copula.sample(min(n_synthetic, 3000))

    # T_OR for each observed event (using parametric marginals)
    u_obs = copula.marginal_cdf_x(x)
    v_obs = copula.marginal_cdf_y(y)
    C_obs = copula.cdf(u_obs, v_obs)
    T_or_obs = 1.0 / np.maximum(1.0 - C_obs, 1e-12)
    T_and_obs = 1.0 / np.maximum(1.0 - u_obs - v_obs + C_obs, 1e-12)
    observed_rp = [
        {
            "x": round(float(x[i]), 3),
            "y": round(float(y[i]), 3),
            "u": round(float(u_obs[i]), 4),
            "v": round(float(v_obs[i]), 4),
            "T_or":  round(float(T_or_obs[i]), 1),
            "T_and": round(float(T_and_obs[i]), 1),
        }
        for i in range(n)
    ]

    from scipy.stats import spearmanr
    rho_s, _ = spearmanr(x, y)

    return {
        "x_var": x_var,
        "y_var": y_var,
        "family": family,
        "n_obs": int(n),
        "kendall_tau":   round(float(copula._tau), 4),
        "spearman_rho":  round(float(rho_s), 4),
        "marginal_x_family": copula._mx[2],
        "marginal_y_family": copula._my[2],
        "extent": extent,
        "observed": {"x": x.tolist(), "y": y.tolist()},
        "observed_rp": observed_rp,
        "synthetic": {"x": [round(float(v), 4) for v in syn_x],
                      "y": [round(float(v), 4) for v in syn_y]},
        "isolines_or":  isolines_or,
        "isolines_and": isolines_and,
        "maxprob_or":   maxprob_or,
        "maxprob_and":  maxprob_and,
        "marginal_x": {
            "vals": [round(float(v), 4) for v in pdf_x_vals],
            "pdf":  [round(float(v), 6) for v in pdf_x],
            "quantiles": marginal_quantiles_x,
            "family": copula._mx[2],
        },
        "marginal_y": {
            "vals": [round(float(v), 4) for v in pdf_y_vals],
            "pdf":  [round(float(v), 6) for v in pdf_y],
            "quantiles": marginal_quantiles_y,
            "family": copula._my[2],
        },
    }
