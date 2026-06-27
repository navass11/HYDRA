import numpy as np
from scipy.ndimage import gaussian_filter
from scipy.optimize import brentq
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()


class HydraulicRequest(BaseModel):
    Q: float = Field(80.0, ge=0.1, le=5000.0)
    b: float = Field(8.0, ge=0.5, le=100.0)
    m: float = Field(1.5, ge=0.0, le=5.0)
    H: float = Field(2.5, ge=0.2, le=20.0)
    w_l: float = Field(40.0, ge=0.0, le=500.0)
    w_r: float = Field(40.0, ge=0.0, le=500.0)
    n1: float = Field(0.035, ge=0.005, le=0.2)
    n2: float = Field(0.08, ge=0.005, le=0.4)
    S: float = Field(0.001, ge=1e-5, le=0.05)
    L: float = Field(1000.0, ge=100.0, le=10000.0)
    bc_type: str = Field("normal", pattern="^(normal|critical|tailwater)$")
    y_ds: Optional[float] = Field(None, ge=0.01, le=50.0)


# ── Section geometry helpers ──────────────────────────────────────────────────

def _total_area(y: float, b: float, m: float, H: float,
                w_l: float, w_r: float) -> float:
    y = max(float(y), 1e-9)
    if y <= H:
        return (b + m * y) * y
    B_top = b + 2.0 * m * H
    return (b + m * H) * H + (B_top + w_l + w_r) * (y - H)


def _top_width(y: float, b: float, m: float, H: float,
               w_l: float, w_r: float) -> float:
    if y <= H:
        return b + 2.0 * m * y
    return b + 2.0 * m * H + w_l + w_r


def _conveyance(y: float, b: float, m: float, H: float,
                w_l: float, w_r: float, n1: float, n2: float) -> float:
    """Section conveyance K = Q / S^0.5, divided channel method."""
    y = max(float(y), 1e-9)
    sqrt1pm2 = float(np.sqrt(1.0 + m * m))
    B_top = b + 2.0 * m * H

    if y <= H:
        A = (b + m * y) * y
        P = b + 2.0 * y * sqrt1pm2
        return A * (A / P) ** (2.0 / 3.0) / n1 if P > 0 else 0.0

    y_fp = y - H
    A_mc = (b + m * H) * H + B_top * y_fp
    P_mc = b + 2.0 * H * sqrt1pm2
    K_mc = A_mc * (A_mc / P_mc) ** (2.0 / 3.0) / n1 if P_mc > 0 else 0.0

    K_l = 0.0
    if w_l > 0 and y_fp > 0:
        A_l = w_l * y_fp
        P_l = w_l + y_fp
        K_l = A_l * (A_l / P_l) ** (2.0 / 3.0) / n2

    K_r = 0.0
    if w_r > 0 and y_fp > 0:
        A_r = w_r * y_fp
        P_r = w_r + y_fp
        K_r = A_r * (A_r / P_r) ** (2.0 / 3.0) / n2

    return K_mc + K_l + K_r


def _spec_energy(y: float, Q: float, b: float, m: float,
                 H: float, w_l: float, w_r: float) -> float:
    A = _total_area(y, b, m, H, w_l, w_r)
    V = Q / A if A > 0 else 0.0
    return y + V ** 2 / (2.0 * 9.81)


def _friction_slope(y: float, Q: float, b: float, m: float, H: float,
                    w_l: float, w_r: float, n1: float, n2: float) -> float:
    K = _conveyance(y, b, m, H, w_l, w_r, n1, n2)
    return Q ** 2 / K ** 2 if K > 1e-12 else 1.0


# ── Normal and critical depth ─────────────────────────────────────────────────

def _normal_depth(Q, b, m, H, w_l, w_r, n1, n2, S) -> float:
    def f(y):
        K = _conveyance(y, b, m, H, w_l, w_r, n1, n2)
        return K * S ** 0.5 - Q

    y_hi = max(H * 0.1, 0.01)
    while _conveyance(y_hi, b, m, H, w_l, w_r, n1, n2) * S ** 0.5 < Q:
        y_hi *= 2.0
        if y_hi > 300.0:
            return 300.0
    return float(brentq(f, 1e-6, y_hi, xtol=1e-5))


def _critical_depth(Q, b, m, H, w_l, w_r) -> float:
    g = 9.81

    def crit(y):
        A = _total_area(y, b, m, H, w_l, w_r)
        T = _top_width(y, b, m, H, w_l, w_r)
        if A <= 0 or T <= 0:
            return -1.0
        return Q ** 2 * T / (g * A ** 3) - 1.0

    y_hi = max(H * 0.1, 0.01)
    while True:
        y_hi = min(y_hi * 2.0, 300.0)
        if crit(y_hi) < 0 or y_hi >= 300.0:
            break
    try:
        return float(brentq(crit, 1e-6, y_hi, xtol=1e-5))
    except ValueError:
        return H


# ── Gradually-varied flow profile (Direct Step Method) ───────────────────────

def _gvf_profile(Q, b, m, H, w_l, w_r, n1, n2, S0, L, yn, yc,
                 bc_type='normal', y_ds=None, nx=60):
    """
    Water surface profile via Direct Step Method (prismatic compound section).
    Returns (x_grid [0..L], y_profile) arrays.
    """
    g = 9.81

    def E(y):
        return _spec_energy(y, Q, b, m, H, w_l, w_r)

    def Sf(y):
        return _friction_slope(y, Q, b, m, H, w_l, w_r, n1, n2)

    # Uniform flow — trivial
    if bc_type == 'normal':
        x_grid = np.linspace(0.0, L, nx)
        return x_grid.tolist(), [float(yn)] * nx, 'uniforme'

    # Boundary condition depth at downstream end (x = L)
    if bc_type == 'critical':
        y_bc = float(yc)
    elif bc_type == 'tailwater' and y_ds is not None:
        y_bc = max(float(y_ds), float(yc) * 1.001)  # must stay above critical
    else:
        x_grid = np.linspace(0.0, L, nx)
        return x_grid.tolist(), [float(yn)] * nx, 'uniforme'

    # Close to normal? Skip profile
    if abs(y_bc - yn) / max(yn, 0.001) < 0.002:
        x_grid = np.linspace(0.0, L, nx)
        return x_grid.tolist(), [float(yn)] * nx, 'uniforme'

    subcritical = float(yn) > float(yc)

    if not subcritical:
        # Supercritical: downstream BC doesn't propagate upstream → uniform
        x_grid = np.linspace(0.0, L, nx)
        return x_grid.tolist(), [float(yn)] * nx, 'S2 (flujo rápido)'

    # Determine profile type
    if y_bc > yn:
        profile_type = 'M1 (remanso)'   # backwater
    else:
        profile_type = 'M2 (depresión)' # drawdown

    # Direct Step: integrate upstream from x=L (downstream BC) toward x=0
    # Generate y sequence from y_bc toward yn (stop slightly before to avoid singularity)
    n_steps = 500
    y_end = float(yn) * 0.9998 + float(y_bc) * 0.0002
    y_seq = np.linspace(float(y_bc), y_end, n_steps)

    x_curr = float(L)
    xs = [x_curr]
    ys = [float(y_bc)]

    for i in range(1, n_steps):
        y1 = y_seq[i - 1]
        y2 = y_seq[i]

        E1, E2 = E(y1), E(y2)
        Sf1, Sf2 = Sf(y1), Sf(y2)
        Sf_avg = (Sf1 + Sf2) * 0.5

        S_eff = S0 - Sf_avg
        if abs(S_eff) < 1e-14:
            continue

        dx = (E2 - E1) / S_eff   # negative → going upstream
        x_next = x_curr + dx
        xs.append(x_next)
        ys.append(y2)
        x_curr = x_next

        if x_next <= 0.0:
            break

    xs_arr = np.array(xs)
    ys_arr = np.array(ys)

    # Sort by x ascending
    idx = np.argsort(xs_arr)
    xs_arr, ys_arr = xs_arr[idx], ys_arr[idx]

    # Interpolate onto regular grid; upstream of backwater extent → normal depth
    x_grid = np.linspace(0.0, float(L), nx)
    y_grid = np.interp(x_grid, xs_arr, ys_arr,
                       left=float(yn), right=float(y_bc))

    return x_grid.tolist(), [float(v) for v in y_grid], profile_type


# ── Cross-section ─────────────────────────────────────────────────────────────

def _dem_profile(xt: np.ndarray, b: float, m: float, H: float) -> np.ndarray:
    ax = np.abs(xt)
    half_b = b / 2.0
    half_Btop = half_b + m * H
    m_safe = max(m, 1e-9)
    z = np.where(
        ax <= half_b, 0.0,
        np.where(ax <= half_Btop, (ax - half_b) / m_safe, H)
    )
    return np.minimum(z, H)


def _cross_section(yn: float, b: float, m: float, H: float,
                   w_l: float, w_r: float, n_pts: int = 200) -> dict:
    B_top = b + 2.0 * m * H
    xt = np.linspace(-(w_l + B_top / 2.0), B_top / 2.0 + w_r, n_pts)
    z_dem = _dem_profile(xt, b, m, H)
    return {
        "xt": [round(float(x), 2) for x in xt],
        "z_dem": [round(float(z), 4) for z in z_dem],
        "yn": round(float(yn), 4),
    }


# ── 2D flood map ──────────────────────────────────────────────────────────────

def _build_flood_map(y_profile: list, b: float, m: float, H: float,
                     w_l: float, w_r: float, L: float,
                     ny: int = 80, nx: int = 60) -> dict:
    B_top = b + 2.0 * m * H
    xt = np.linspace(-(w_l + B_top / 2.0), B_top / 2.0 + w_r, ny)
    xl = np.linspace(0.0, L, nx)

    z_base = _dem_profile(xt, b, m, H)  # (ny,)

    # Deterministic micro-topography on floodplain
    rng = np.random.default_rng(42)
    noise = rng.normal(0.0, H * 0.06, (ny, nx))
    noise = gaussian_filter(noise, sigma=3.0)

    fp_mask = (z_base >= H * 0.88)[:, np.newaxis]
    z_2d = np.tile(z_base[:, np.newaxis], (1, nx))
    z_2d = np.where(fp_mask, np.maximum(z_2d + noise, H * 0.7), z_2d)

    # Apply GVF profile: y varies along x
    y_arr = np.array(y_profile, dtype=float)  # (nx,)
    depths_2d = np.maximum(0.0, y_arr[np.newaxis, :] - z_2d)

    return {
        "xt": [round(float(x), 2) for x in xt],
        "xl": [round(float(x), 1) for x in xl],
        "z_dem": [[round(float(z), 3) for z in row] for row in z_2d],
        "depths": [[round(float(d), 3) for d in row] for row in depths_2d],
        "max_depth": round(float(depths_2d.max()), 3),
    }


# ── Section params ────────────────────────────────────────────────────────────

def _section_params(yn: float, Q: float, b: float, m: float, H: float,
                    w_l: float, w_r: float, n1: float, n2: float, S: float) -> dict:
    g = 9.81
    sqrt1pm2 = float(np.sqrt(1.0 + m * m))
    B_top = b + 2.0 * m * H

    if yn <= H:
        A_c = (b + m * yn) * yn
        P_c = b + 2.0 * yn * sqrt1pm2
        A_fp = 0.0
        Q_c = Q
        T = b + 2.0 * m * yn
        A_total = A_c
    else:
        y_fp = yn - H
        A_c = (b + m * H) * H + B_top * y_fp
        P_c = b + 2.0 * H * sqrt1pm2
        A_l = w_l * y_fp if w_l > 0 else 0.0
        A_r = w_r * y_fp if w_r > 0 else 0.0
        A_fp = A_l + A_r
        R_c = A_c / P_c if P_c > 0 else 0.0
        Q_c = (1.0 / n1) * A_c * R_c ** (2.0 / 3.0) * S ** 0.5
        T = B_top + w_l + w_r
        A_total = A_c + A_fp

    R = A_c / P_c if P_c > 0 else 0.0
    V = Q / A_total if A_total > 0 else 0.0
    D = A_total / T if T > 0 else yn
    Fr = V / float(np.sqrt(g * D)) if D > 0 else 0.0

    return {
        "yn": round(float(yn), 3),
        "A_channel": round(float(A_c), 2),
        "A_floodplain": round(float(A_fp), 2),
        "A_total": round(float(A_total), 2),
        "P": round(float(P_c), 3),
        "R": round(float(R), 3),
        "T": round(float(T), 2),
        "V": round(float(V), 3),
        "Fr": round(float(Fr), 4),
        "Q_channel": round(float(Q_c), 2),
        "Q_floodplain": round(float(max(0.0, Q - Q_c)), 2),
        "overbank": bool(yn > H),
        "regime": "supercrítico" if Fr > 1 else "subcrítico",
    }


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/compute")
def compute(p: HydraulicRequest):
    try:
        yn = _normal_depth(p.Q, p.b, p.m, p.H, p.w_l, p.w_r, p.n1, p.n2, p.S)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error calculando profundidad normal: {exc}")

    try:
        yc = _critical_depth(p.Q, p.b, p.m, p.H, p.w_l, p.w_r)
    except Exception:
        yc = None

    params = _section_params(yn, p.Q, p.b, p.m, p.H, p.w_l, p.w_r, p.n1, p.n2, p.S)
    if yc is not None:
        params["yc"] = round(float(yc), 3)
    K_bf = _conveyance(p.H, p.b, p.m, p.H, p.w_l, p.w_r, p.n1, p.n2)
    params["Q_bankfull"] = round(K_bf * p.S ** 0.5, 1)

    # GVF longitudinal profile
    x_profile, y_profile, profile_type = _gvf_profile(
        p.Q, p.b, p.m, p.H, p.w_l, p.w_r, p.n1, p.n2, p.S, p.L,
        yn, yc if yc is not None else yn,
        bc_type=p.bc_type, y_ds=p.y_ds, nx=60,
    )

    # Longitudinal profile: bed and WSE elevations (datum = downstream bed)
    S0 = p.S
    L = p.L
    z_bed = [round(S0 * (L - x), 4) for x in x_profile]
    z_wse = [round(zb + yp, 4) for zb, yp in zip(z_bed, y_profile)]
    z_yn = [round(zb + float(yn), 4) for zb in z_bed]
    z_yc = [round(zb + float(yc if yc else yn), 4) for zb in z_bed]

    B_top = p.b + 2.0 * p.m * p.H

    return {
        "params": params,
        "profile_type": profile_type,
        "cross_section": _cross_section(yn, p.b, p.m, p.H, p.w_l, p.w_r),
        "flood_map": _build_flood_map(y_profile, p.b, p.m, p.H, p.w_l, p.w_r, p.L),
        "longitudinal_profile": {
            "x": [round(float(v), 1) for v in x_profile],
            "z_bed": z_bed,
            "z_wse": z_wse,
            "z_yn": z_yn,
            "z_yc": z_yc,
        },
        "geometry": {
            "B_top": round(float(B_top), 2),
            "total_width": round(float(p.w_l + B_top + p.w_r), 2),
            "H": p.H,
            "w_l": p.w_l,
            "w_r": p.w_r,
            "b": p.b,
        },
    }
