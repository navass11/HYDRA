"""
Regenerate fig_copula_analysis.pdf — 3-panel copula analysis figure.

Fixes vs previous version:
- Panel (c): legend moved outside plot (below axes), points larger and more opaque
- Panel (b): cleaner step histograms with better color/alpha
- Panel (a): empirical markers clearly visible
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from scipy import stats, special
from scipy.stats import norm, pearsonr

from sklearn.mixture import GaussianMixture
from pyhydra.modeling.hydraulic.sensitivity import (
    generate_manning_combinations_correlated,
    best_distribution,
)

# ── Paths ────────────────────────────────────────────────────────────────────
HERE = Path(__file__).resolve().parent
DATA_DIR = HERE / "zenodo_upload" / "data"
DIST_CSV = DATA_DIR / "manning_roughness_coefficients.csv"
REF_CSV = DATA_DIR / "monte_carlo_combinations.csv"
RESULTS_CSV = DATA_DIR / "comparison_clean_995.csv"
OUT_DIR = HERE / "figures"

# REMOVE already applied in the clean CSV — do not drop again

LANDUSE_AREAS_HA = {
    "Trees": 25.2, "Dense vegetation": 49.9, "Urban vegetation": 123.4,
    "Infrastructure": 43.0, "Sparse vegetation": 473.0, "Residential": 199.8,
    "Industrial": 120.1, "River": 25.5, "Brushland": 25.7,
}
TOTAL_HA = sum(LANDUSE_AREAS_HA.values())
WEIGHTS  = {k: v / TOTAL_HA for k, v in LANDUSE_AREAS_HA.items()}
SEED     = 42
N        = 1000

# ── Generate correlated samples ──────────────────────────────────────────────
df_ref  = pd.read_csv(REF_CSV)
df_rho0 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=0.0, seed=SEED)
df_rho5 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=0.5, seed=SEED)
df_rho1 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=1.0, seed=SEED)

def weighted_mean(df):
    # align columns to weight dict (reference CSV may have different order)
    cols = [c for c in WEIGHTS if c in df.columns]
    w    = np.array([WEIGHTS[c] for c in cols]) / sum(WEIGHTS[c] for c in cols)
    return df[cols].values @ w

nbar = {
    r"$\rho=0$":   weighted_mean(df_rho0),
    r"$\rho=0.5$": weighted_mean(df_rho5),
    r"$\rho=1$":   weighted_mean(df_rho1),
}

# ── Theoretical CV curve ─────────────────────────────────────────────────────
df_dist = pd.read_csv(DIST_CSV, index_col=0)
class_sigmas, class_means = {}, {}
for _, row in df_dist.iterrows():
    if str(row["N"]) == "-999":
        continue
    values = np.array([float(v) for v in str(row["N"]).split(",")])
    dist_name, params = best_distribution(values)
    dist = getattr(stats, dist_name)
    mu, sigma = dist.stats(*params[:-2], loc=params[-2], scale=params[-1], moments="mv")
    class_means[row["Descripción"]]  = float(mu)
    class_sigmas[row["Descripción"]] = float(np.sqrt(sigma))

w_arr   = np.array([WEIGHTS[k]       for k in class_sigmas])
sig_arr = np.array([class_sigmas[k]  for k in class_sigmas])
mu_nbar = (w_arr * np.array([class_means[k] for k in class_sigmas])).sum()

rho_vals  = np.linspace(0, 1, 200)
var_indep = (w_arr**2 * sig_arr**2).sum()
cross     = (w_arr @ sig_arr)**2 - var_indep
cv_theory = 100 * np.sqrt(var_indep + rho_vals * cross) / mu_nbar

# CV of original reference (ρ=0, independent)
nbar_ref = weighted_mean(df_ref)
cv_ref   = 100 * nbar_ref.std() / nbar_ref.mean()

# ── Flood results ─────────────────────────────────────────────────────────────
df_res = pd.read_csv(RESULTS_CSV, index_col=0)   # already clean (995 rows)

# Regime classification: GMM on HEC-RAS area (consistent with notebook 05)
area = df_res["hecras_area_km2"].values
gmm = GaussianMixture(n_components=2, random_state=42, n_init=10)
labels = gmm.fit_predict(area.reshape(-1, 1))
# label 0 = low-area regime
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    labels = 1 - labels
low_mask  = labels == 0
high_mask = labels == 1

nbar_sim = df_res["hecras_manning_mean"].values   # area-weighted mean from actual simulations
r_all, p_all = pearsonr(nbar_sim, area)

# ── Figure ───────────────────────────────────────────────────────────────────
COLORS = ["#1f77b4", "#ff7f0e", "#2ca02c"]   # blue, orange, green  (rho=0,0.5,1)
RHO_LABELS = [r"$\rho=0$", r"$\rho=0.5$", r"$\rho=1$"]

fig = plt.figure(figsize=(11, 4.55))
gs  = gridspec.GridSpec(1, 3, figure=fig, wspace=0.42, left=0.07, right=0.97,
                        top=0.86, bottom=0.39)

# ── (a) CV amplification ──────────────────────────────────────────────────────
ax_a = fig.add_subplot(gs[0])
ax_a.plot(rho_vals, cv_theory, "k-", lw=2.2, label="Theory")
ax_a.axhline(cv_ref, color="k", ls=":", lw=1.4, alpha=0.7,
             label=f"Current MC ({cv_ref:.1f}%)")
emp_rhos = [0, 0.5, 1.0]
for rho_num, lbl, col, arr in zip(emp_rhos, RHO_LABELS, COLORS,
                                   [nbar[r"$\rho=0$"], nbar[r"$\rho=0.5$"], nbar[r"$\rho=1$"]]):
    cv_emp = 100 * arr.std() / arr.mean()
    ax_a.scatter(rho_num, cv_emp, color=col, s=90, zorder=5,
                 label=f"{lbl}  ({cv_emp:.1f}%)", edgecolors="k", linewidths=0.6)
ax_a.set_xlabel("Inter-class correlation " + r"$\rho$", fontsize=9)
ax_a.set_ylabel(r"CV$(\bar{n})$  [%]", fontsize=9)
ax_a.set_title(r"(a) CV amplification of $\bar{n}$", fontsize=9, fontweight="bold")
ax_a.legend(fontsize=6.9, framealpha=0.9, loc="upper center",
            bbox_to_anchor=(0.5, -0.30), ncol=3,
            borderpad=0.55, columnspacing=0.75, handlelength=1.45)
ax_a.set_xlim(-0.05, 1.05)
ax_a.grid(True, alpha=0.35)

# ── (b) Distribution of n̄ ─────────────────────────────────────────────────────
ax_b = fig.add_subplot(gs[1])
bins = np.linspace(0.015, 0.095, 35)
for arr, lbl, col in zip([nbar[k] for k in RHO_LABELS], RHO_LABELS, COLORS):
    ax_b.hist(arr, bins=bins, histtype="step", linewidth=1.8,
              density=True, color=col, label=lbl, alpha=0.95)
ax_b.axvline(np.mean([nbar[k].mean() for k in RHO_LABELS]),
             color="k", ls="--", lw=1.2, alpha=0.7, label=r"Mean $\bar{n}$")
ax_b.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=9)
ax_b.set_ylabel("Density", fontsize=9)
ax_b.set_title(r"(b) Distribution of $\bar{n}$ by scenario", fontsize=9, fontweight="bold")
ax_b.legend(fontsize=6.9, framealpha=0.9, loc="upper center",
            bbox_to_anchor=(0.5, -0.30), ncol=3,
            borderpad=0.55, columnspacing=0.75, handlelength=1.45)
ax_b.grid(True, alpha=0.35)

# ── (c) n̄ vs flood output ────────────────────────────────────────────────────
ax_c = fig.add_subplot(gs[2])

# High-regime: salmon/pink, bigger marker, semi-transparent
ax_c.scatter(nbar_sim[high_mask], area[high_mask],
             s=18, alpha=0.45, color="#e07070", linewidths=0,
             label=f"High regime ($N={high_mask.sum()}$)", zorder=2, rasterized=True)
# Low-regime: solid blue, more visible
ax_c.scatter(nbar_sim[low_mask], area[low_mask],
             s=28, alpha=0.80, color="#2060b8", linewidths=0.3, edgecolors="#1040a0",
             label=f"Low regime ($N={low_mask.sum()}$)", zorder=3)

# Regression line (all points)
m, b, *_ = stats.linregress(nbar_sim, area)
x_line = np.array([nbar_sim.min(), nbar_sim.max()])
ax_c.plot(x_line, m * x_line + b, "k--", lw=1.5,
          label=f"All: $r={r_all:.3f}$, $p={p_all:.2f}$", zorder=4)

# Percentile bands for each copula scenario
pct = [5, 95]
ls_styles = [(0, (5, 2)), (0, (3, 1, 1, 1)), (0, (2, 1))]
for arr, lbl, col, ls in zip([nbar[k] for k in RHO_LABELS], RHO_LABELS, COLORS, ls_styles):
    p5, p95 = np.percentile(arr, pct)
    ax_c.axvline(p5,  color=col, ls=ls, lw=1.3, alpha=0.85)
    ax_c.axvline(p95, color=col, ls=ls, lw=1.3, alpha=0.85, label=f"{lbl} range")

ax_c.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=9)
ax_c.set_ylabel(r"HEC-RAS flooded area (km²)", fontsize=9)
ax_c.set_title(r"(c) $\bar{n}$ vs flood output (995 runs)", fontsize=9, fontweight="bold")
ax_c.grid(True, alpha=0.35)

# Legend below the axes to avoid overlap
ax_c.legend(fontsize=7, loc="upper center",
            bbox_to_anchor=(0.5, -0.30), ncol=3,
            framealpha=0.9, borderpad=0.55, columnspacing=0.65,
            handlelength=1.45)

# ── Suptitle ──────────────────────────────────────────────────────────────────
fig.suptitle("Effect of inter-class Manning correlation on spatial-mean roughness "
             "and flood outputs", fontsize=10, fontweight="bold", y=0.98)

for ext in ["pdf", "png"]:
    out = OUT_DIR / f"fig_copula_analysis.{ext}"
    fig.savefig(out, dpi=180, bbox_inches="tight")
    print(f"Saved: {out}")

plt.close(fig)
