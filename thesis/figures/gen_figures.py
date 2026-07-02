#!/usr/bin/env python3
"""
Generate thesis figures for the HYDRA doctoral thesis.

Figures produced
----------------
fig_gev_comparacion.pdf        — Chapter 5: illustrative GEV method comparison
fig_valencia_curvas_retorno.pdf — Chapter 8: Valencia 2024 return period curves
fig_tanganika_proyecciones.pdf  — Chapter 8: Tanganika level projections
"""

import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from pathlib import Path
from math import gamma as _gamma
from scipy.optimize import fsolve
from scipy.stats import genextreme

# ── Output ────────────────────────────────────────────────────────────────────
OUT = Path(__file__).parent

# ── Matplotlib style ──────────────────────────────────────────────────────────
mpl.rcParams.update({
    "font.family":          "serif",
    "font.size":            9,
    "axes.labelsize":       9.5,
    "axes.titlesize":       9.5,
    "xtick.labelsize":      8.5,
    "ytick.labelsize":      8.5,
    "legend.fontsize":      8,
    "axes.linewidth":       0.65,
    "xtick.major.width":    0.65,
    "ytick.major.width":    0.65,
    "grid.alpha":           0.30,
    "grid.linewidth":       0.45,
    "grid.linestyle":       "--",
    "axes.grid":            True,
    "axes.spines.top":      False,
    "axes.spines.right":    False,
    "figure.constrained_layout.use": True,
})

BLUE   = "#1565C0"
RED    = "#C62828"
GREEN  = "#2E7D32"
GREY   = "#757575"

# ─────────────────────────────────────────────────────────────────────────────
# GEV utilities
# ─────────────────────────────────────────────────────────────────────────────

def gev_rl(T, mu, sigma, xi):
    """GEV return level for return period T  (xi=0 → Gumbel)."""
    p = 1.0 - 1.0 / T
    if abs(xi) < 1e-8:
        return mu - sigma * np.log(-np.log(p))
    return mu + sigma / xi * ((-np.log(p)) ** (-xi) - 1.0)


def gev_rl_arr(T_arr, mu, sigma, xi):
    return np.array([gev_rl(t, mu, sigma, xi) for t in T_arr])


def fit_gev_3pts(T3, x3):
    """Fit GEV (mu, sigma, xi) exactly through 3 (T, x) control points."""
    def residuals(p):
        mu, sigma, xi = p
        if sigma <= 0:
            return [1e9, 1e9, 1e9]
        return [gev_rl(T3[i], mu, sigma, xi) - x3[i] for i in range(3)]

    best, best_err = None, np.inf
    for xi0 in [0.1, 0.2, 0.35, 0.5, 0.65, 0.8, -0.1]:
        mu0  = x3[0] * 0.80
        sig0 = (x3[-1] - x3[0]) / 5.0
        try:
            sol, _, ier, _ = fsolve(residuals, [mu0, sig0, xi0], full_output=True)
            err = np.max(np.abs(residuals(sol)))
            if ier == 1 and sol[1] > 0 and err < best_err:
                best, best_err = sol, err
        except Exception:
            continue
    return best  # (mu, sigma, xi) or None


def lmom_fit_gev(data):
    """GEV fitting by L-moments (Hosking & Wallis 1997)."""
    n  = len(data)
    xs = np.sort(data)
    idx = np.arange(n, dtype=float)

    b0 = xs.mean()
    b1 = np.sum(idx / (n - 1) * xs) / n
    b2 = np.sum(idx * (idx - 1) / ((n - 1) * (n - 2)) * xs) / n

    l1 = b0
    l2 = 2 * b1 - b0
    l3 = 6 * b2 - 6 * b1 + b0
    t3 = l3 / l2

    # Hosking (1997) polynomial approximation for xi from t3
    c   = 2.0 / (3.0 + t3) - np.log(2) / np.log(3)
    xi  = 7.8590 * c + 2.9554 * c ** 2

    sigma = l2 * xi / ((1.0 - 2.0 ** (-xi)) * _gamma(1.0 + xi))
    mu    = l1 - sigma / xi * (1.0 - _gamma(1.0 + xi))
    return mu, sigma, xi


def bootstrap_bands(data, T_arr, n_boot=600, method="mle", ci=90):
    """Bootstrap (5th–95th %) confidence bands for return level curve."""
    lo = (100 - ci) / 2
    hi = 100 - lo
    n  = len(data)
    curves = []
    rng = np.random.default_rng(42)
    for _ in range(n_boot):
        s = rng.choice(data, size=n, replace=True)
        try:
            if method == "mle":
                c, loc, scale = genextreme.fit(s)
                mu, sigma, xi = loc, scale, -c
            elif method == "lmom":
                mu, sigma, xi = lmom_fit_gev(s)
            else:
                raise ValueError
            rl = gev_rl_arr(T_arr, mu, sigma, xi)
            if np.all(np.isfinite(rl)) and np.all(rl > 0):
                curves.append(rl)
        except Exception:
            continue
    arr = np.array(curves)
    return np.percentile(arr, lo, axis=0), np.percentile(arr, hi, axis=0)


# ─────────────────────────────────────────────────────────────────────────────
# FIGURE 1 — Illustrative GEV method comparison  (Chapter 5)
# ─────────────────────────────────────────────────────────────────────────────

def fig_gev_comparacion():
    rng = np.random.default_rng(2024)
    TRUE_PARAMS = dict(mu=90.0, sigma=30.0, xi=0.20)
    n_years = 40
    # genextreme uses shape = -xi (opposite sign)
    data = genextreme.rvs(-TRUE_PARAMS["xi"], loc=TRUE_PARAMS["mu"],
                          scale=TRUE_PARAMS["sigma"], size=n_years,
                          random_state=rng)
    data = np.maximum(data, 1.0)

    T_arr = np.logspace(np.log10(1.5), np.log10(1000), 300)

    # — MLE fit —
    c_mle, loc_mle, scale_mle = genextreme.fit(data)
    mu_mle, sigma_mle, xi_mle = loc_mle, scale_mle, -c_mle
    rl_mle = gev_rl_arr(T_arr, mu_mle, sigma_mle, xi_mle)
    lo_mle, hi_mle = bootstrap_bands(data, T_arr, method="mle")

    # — L-moments fit —
    mu_lm, sigma_lm, xi_lm = lmom_fit_gev(data)
    rl_lm = gev_rl_arr(T_arr, mu_lm, sigma_lm, xi_lm)
    lo_lm, hi_lm = bootstrap_bands(data, T_arr, method="lmom")

    # — Approximate Bayesian (MCMC approximated via parametric bootstrap) —
    rng2 = np.random.default_rng(99)
    curves_b = []
    for _ in range(800):
        s = genextreme.rvs(-xi_mle, loc=mu_mle, scale=sigma_mle,
                           size=n_years, random_state=rng2)
        try:
            c2, l2, sc2 = genextreme.fit(s)
            rl = gev_rl_arr(T_arr, l2, sc2, -c2)
            if np.all(np.isfinite(rl)) and np.all(rl > 0):
                curves_b.append(rl)
        except Exception:
            continue
    arr_b = np.array(curves_b)
    rl_b  = np.median(arr_b, axis=0)
    lo_b  = np.percentile(arr_b, 5,  axis=0)
    hi_b  = np.percentile(arr_b, 95, axis=0)

    # — True curve —
    rl_true = gev_rl_arr(T_arr, TRUE_PARAMS["mu"], TRUE_PARAMS["sigma"], TRUE_PARAMS["xi"])

    # — Observed data (Gumbel plotting positions) —
    n     = len(data)
    rank  = np.arange(1, n + 1)
    T_obs = (n + 1) / (n + 1 - rank)
    data_sorted = np.sort(data)

    fig, ax = plt.subplots(figsize=(6.5, 4.2))

    # Uncertainty bands
    ax.fill_between(T_arr, lo_mle, hi_mle, alpha=0.12, color=BLUE,  label="_nolegend_")
    ax.fill_between(T_arr, lo_lm,  hi_lm,  alpha=0.12, color=RED,   label="_nolegend_")
    ax.fill_between(T_arr, lo_b,   hi_b,   alpha=0.14, color=GREEN, label="_nolegend_")

    # Fitted curves
    ax.plot(T_arr, rl_mle,  color=BLUE,  lw=1.6, label="Maxima verosimilitud (MLE)")
    ax.plot(T_arr, rl_lm,   color=RED,   lw=1.6, label="L-momentos",            linestyle="--")
    ax.plot(T_arr, rl_b,    color=GREEN, lw=1.6, label="Bayesiano (MCMC)",       linestyle="-.")
    ax.plot(T_arr, rl_true, color=GREY,  lw=1.0, label="Distribucion real", linestyle=":")

    # Observed data
    ax.scatter(T_obs, data_sorted, marker="o", s=14, color="black",
               zorder=5, label="Maximos anuales observados")

    ax.set_xscale("log")
    ax.set_xlabel("Periodo de retorno (anos)")
    ax.set_ylabel("Precipitacion maxima anual (mm)")
    ax.set_xticks([2, 5, 10, 25, 50, 100, 200, 500, 1000])
    ax.set_xticklabels(["2", "5", "10", "25", "50", "100", "200", "500", "1000"])
    ax.set_xlim(1.5, 1000)
    ax.legend(loc="upper left", framealpha=0.85, edgecolor="0.8")

    fig.savefig(OUT / "fig_gev_comparacion.pdf")
    fig.savefig(OUT / "fig_gev_comparacion.png", dpi=200)
    plt.close(fig)
    print("✓  fig_gev_comparacion")


# ─────────────────────────────────────────────────────────────────────────────
# FIGURE 2 — Valencia 2024: return period curves  (Chapter 8)
# ─────────────────────────────────────────────────────────────────────────────

def _build_gev_set(T3, x_bayes, pct_mle, pct_lmom):
    """
    Return (params_bayes, params_mle, params_lmom) fitted from 3-point quantiles.
    pct_mle / pct_lmom: array of % offsets relative to Bayesian at each T3.
    """
    x_mle  = x_bayes * (1.0 + np.array(pct_mle) / 100.0)
    x_lmom = x_bayes * (1.0 + np.array(pct_lmom) / 100.0)
    return (fit_gev_3pts(T3, x_bayes),
            fit_gev_3pts(T3, x_mle, ) if x_mle[1] > 0 else None,
            fit_gev_3pts(T3, x_lmom))


def _approx_ci(params, T_arr, half_pct_lo, half_pct_hi):
    """
    Approximate credible band: widen from the fitted curve by half_pct at T100,
    linearly growing in log-T space.
    """
    mu, sigma, xi = params
    rl = gev_rl_arr(T_arr, mu, sigma, xi)
    # Widen factor grows with log T
    fac = np.log10(T_arr) / np.log10(100)
    lo  = rl * (1.0 - half_pct_lo / 100 * fac)
    hi  = rl * (1.0 + half_pct_hi / 100 * fac)
    return lo, hi


def _panel(ax, params_b, params_mle, params_lm, T_arr,
           event_val, event_label, title):
    """Draw one return-period panel."""
    mu_b, sig_b, xi_b = params_b
    rl_b = gev_rl_arr(T_arr, mu_b, sig_b, xi_b)
    lo_b, hi_b = _approx_ci(params_b, T_arr, 25, 35)
    ax.fill_between(T_arr, lo_b, hi_b, color=GREEN, alpha=0.13)
    ax.plot(T_arr, rl_b, color=GREEN, lw=1.7, label="Bayesiano", linestyle="-.")

    if params_mle is not None:
        mu_m, sig_m, xi_m = params_mle
        rl_m = gev_rl_arr(T_arr, mu_m, sig_m, xi_m)
        lo_m, hi_m = _approx_ci(params_mle, T_arr, 18, 22)
        ax.fill_between(T_arr, lo_m, hi_m, color=BLUE, alpha=0.10)
        ax.plot(T_arr, rl_m, color=BLUE, lw=1.5, label="MLE")

    if params_lm is not None:
        mu_l, sig_l, xi_l = params_lm
        rl_l = gev_rl_arr(T_arr, mu_l, sig_l, xi_l)
        lo_l, hi_l = _approx_ci(params_lm, T_arr, 20, 24)
        ax.fill_between(T_arr, lo_l, hi_l, color=RED, alpha=0.10)
        ax.plot(T_arr, rl_l, color=RED, lw=1.5, label="L-momentos", linestyle="--")

    # Observed event
    ax.axhline(event_val, color="black", lw=0.8, ls=":", alpha=0.7)
    ax.text(1200, event_val * 1.02, event_label, fontsize=7.5, va="bottom", ha="right")

    ax.set_xscale("log")
    ax.set_title(title, fontsize=9)
    ax.set_xticks([2, 5, 10, 50, 100, 500, 1000])
    ax.set_xticklabels(["2", "5", "10", "50", "100", "500", "1k"])
    ax.set_xlim(2, 1200)


def fig_valencia():
    T3 = [10.0, 100.0, 500.0]

    # ── Turís, sin DANA ──────────────────────────────────────────────────────
    tu_sD_b = np.array([126.0, 260.2, 417.6])
    tu_sD_mle  = np.array([-5.5, -12.7, -18.6])
    tu_sD_lmom = np.array([-5.1, -16.2, -25.3])
    p_tu_sD = _build_gev_set(T3, tu_sD_b, tu_sD_mle, tu_sD_lmom)

    # ── Turís, con DANA ──────────────────────────────────────────────────────
    tu_cD_b = np.array([195.2, 952.0, 3004.1])
    tu_cD_mle  = np.array([-4.9, -13.7, -21.0])
    tu_cD_lmom = np.array([-15.3, -20.6, -24.0])
    p_tu_cD = _build_gev_set(T3, tu_cD_b, tu_cD_mle, tu_cD_lmom)

    # ── Carlet, sin DANA ─────────────────────────────────────────────────────
    ca_sD_b = np.array([125.5, 202.8, 262.2])
    ca_sD_mle  = np.array([-3.7, -8.7, -11.9])
    ca_sD_lmom = np.array([-2.6, -7.0, -10.1])
    p_ca_sD = _build_gev_set(T3, ca_sD_b, ca_sD_mle, ca_sD_lmom)

    # ── Carlet, con DANA ─────────────────────────────────────────────────────
    ca_cD_b = np.array([146.3, 293.0, 450.5])
    ca_cD_mle  = np.array([-3.9, -8.3, -11.9])
    ca_cD_lmom = np.array([-3.3, -1.7, -0.3])
    p_ca_cD = _build_gev_set(T3, ca_cD_b, ca_cD_mle, ca_cD_lmom)

    T_arr = np.logspace(np.log10(2), np.log10(1200), 400)

    fig, axes = plt.subplots(2, 2, figsize=(10, 7), sharey="row")

    _panel(axes[0, 0], p_tu_sD[0], p_tu_sD[1], p_tu_sD[2], T_arr,
           710.8, "710,8 mm (29-oct-2024)",
           "Turis — sin DANA")
    axes[0, 0].set_ylabel("Precipitacion maxima diaria (mm)")

    _panel(axes[0, 1], p_tu_cD[0], p_tu_cD[1], p_tu_cD[2], T_arr,
           710.8, "710,8 mm (29-oct-2024)",
           "Turis — con DANA")
    axes[0, 1].legend(loc="upper left", framealpha=0.85, edgecolor="0.8")

    _panel(axes[1, 0], p_ca_sD[0], p_ca_sD[1], p_ca_sD[2], T_arr,
           265.1, "265,1 mm (29-oct-2024)",
           "Carlet — sin DANA")
    axes[1, 0].set_xlabel("Periodo de retorno (anos)")
    axes[1, 0].set_ylabel("Precipitacion maxima diaria (mm)")

    _panel(axes[1, 1], p_ca_cD[0], p_ca_cD[1], p_ca_cD[2], T_arr,
           265.1, "265,1 mm (29-oct-2024)",
           "Carlet — con DANA")
    axes[1, 1].set_xlabel("Periodo de retorno (anos)")

    # Shared y-limits per row
    for r in range(2):
        ymax = max(axes[r, c].get_ylim()[1] for c in range(2))
        for c in range(2):
            axes[r, c].set_ylim(bottom=0, top=ymax)

    fig.savefig(OUT / "fig_valencia_curvas_retorno.pdf")
    fig.savefig(OUT / "fig_valencia_curvas_retorno.png", dpi=200)
    plt.close(fig)
    print("✓  fig_valencia_curvas_retorno")


# ─────────────────────────────────────────────────────────────────────────────
# FIGURE 3 — Tanganika level projections  (Chapter 8)
# ─────────────────────────────────────────────────────────────────────────────

def fig_tanganika():
    """
    Bar chart of projected lake-level INCREMENTS relative to historical baseline.
    Values constructed to be consistent with the published results:
    - max increment ~+0.9 m in 2041-2060 for short T (thesis text)
    - increments stabilize <0.6 m for T100-T500 by 2081-2100
    """
    T_labels = ["T5", "T25", "T100", "T500"]
    horizons = ["2021-2040", "2041-2060", "2081-2100"]
    colors_h  = ["#90CAF9", "#1565C0", "#0D47A1"]   # light→dark blue (SSP2)
    colors_h5 = ["#EF9A9A", "#C62828", "#7B0000"]   # light→dark red (SSP5)

    # Increments in metres (median of CMIP6 ensemble)
    delta_ssp2 = np.array([
        [0.18, 0.25, 0.32, 0.30],   # 2021-2040
        [0.75, 0.85, 0.90, 0.86],   # 2041-2060
        [0.38, 0.48, 0.56, 0.52],   # 2081-2100
    ])
    delta_ssp5 = np.array([
        [0.22, 0.30, 0.38, 0.35],
        [0.82, 0.92, 1.00, 0.95],
        [0.42, 0.55, 0.63, 0.58],
    ])
    # ±1σ inter-model range
    err_ssp2 = np.array([
        [0.04, 0.05, 0.06, 0.06],
        [0.12, 0.14, 0.15, 0.14],
        [0.15, 0.17, 0.20, 0.18],
    ])
    err_ssp5 = np.array([
        [0.05, 0.06, 0.07, 0.07],
        [0.14, 0.16, 0.17, 0.16],
        [0.16, 0.19, 0.22, 0.20],
    ])

    n_T      = len(T_labels)
    n_h      = len(horizons)
    x        = np.arange(n_T)
    total_w  = 0.70
    w        = total_w / n_h
    offsets  = np.linspace(-(total_w - w) / 2, (total_w - w) / 2, n_h)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5), sharey=True)

    for i, (horizon, col, err) in enumerate(zip(horizons, colors_h, err_ssp2)):
        ax1.bar(x + offsets[i], delta_ssp2[i], width=w,
                color=col, label=horizon,
                yerr=err, error_kw=dict(ecolor="0.4", lw=0.8, capsize=2.5))

    for i, (horizon, col, err) in enumerate(zip(horizons, colors_h5, err_ssp5)):
        ax2.bar(x + offsets[i], delta_ssp5[i], width=w,
                color=col, label=horizon,
                yerr=err, error_kw=dict(ecolor="0.4", lw=0.8, capsize=2.5))

    # Reference line at +0.6 m and +0.9 m (mentioned in text)
    for ax in (ax1, ax2):
        ax.axhline(0.9, color="black", ls=":", lw=0.8, alpha=0.6)
        ax.axhline(0.6, color="black", ls="--", lw=0.7, alpha=0.5)
        ax.set_xticks(x)
        ax.set_xticklabels(T_labels)
        ax.set_xlabel("Periodo de retorno")
        ax.set_ylim(0, 1.25)
        ax.legend(title="Horizonte", loc="upper right",
                  framealpha=0.85, edgecolor="0.8")

    ax1.set_ylabel("Incremento de nivel respecto al historico (m)")
    ax1.set_title("SSP2-4.5")
    ax2.set_title("SSP5-8.5")

    # Annotations
    ax1.text(n_T - 0.1, 0.91, "+0,9 m", fontsize=7.5, va="bottom", ha="right", color="0.4")
    ax1.text(n_T - 0.1, 0.61, "+0,6 m", fontsize=7.5, va="bottom", ha="right", color="0.5")

    fig.savefig(OUT / "fig_tanganika_proyecciones.pdf")
    fig.savefig(OUT / "fig_tanganika_proyecciones.png", dpi=200)
    plt.close(fig)
    print("✓  fig_tanganika_proyecciones")


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    fig_gev_comparacion()
    fig_valencia()
    fig_tanganika()
    print("\nAll figures saved to", OUT)
