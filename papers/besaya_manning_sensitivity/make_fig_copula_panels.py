"""
Generate 3 independent copula panel PDFs:
  fig_copula_a.pdf  -- CV amplification curve
  fig_copula_b.pdf  -- n-bar distribution histograms
  fig_copula_c.pdf  -- n-bar vs flood output scatter
Each panel has two non-overlapping legends.
"""
import sys
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.lines import Line2D
from scipy import stats
from scipy.stats import pearsonr, linregress
from sklearn.mixture import GaussianMixture

from pyhydra.modeling.hydraulic.sensitivity import (
    generate_manning_combinations_correlated,
    _best_distribution,
)

# ---- Paths ------------------------------------------------------------------
BASE     = Path("/Volumes/My Passport 2/OneDrive/Scripts_Python/Paper_Rugosidades")
DIST_CSV = BASE / "manning_roughness_coefficients_dist.csv"
REF_CSV  = BASE / "combinaciones_rugosidad.csv"
RES_CSV  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/notebooks/modeling/hydraulic/manning_sensitivity"
                "/comparison_sfincs_hecras_clean.csv")
FIG_DIR  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/papers/besaya_manning_sensitivity/figures")

LANDUSE_AREAS_HA = {
    "Trees": 25.2, "Dense vegetation": 49.9, "Urban vegetation": 123.4,
    "Infrastructure": 43.0, "Sparse vegetation": 473.0, "Residential": 199.8,
    "Industrial": 120.1, "River": 25.5, "Brushland": 25.7,
}
TOTAL_HA = sum(LANDUSE_AREAS_HA.values())
WEIGHTS  = {k: v / TOTAL_HA for k, v in LANDUSE_AREAS_HA.items()}
SEED, N  = 42, 1000

COLORS     = ["#1f77b4", "#ff7f0e", "#2ca02c"]
RHO_LABELS = [r"$\rho=0$", r"$\rho=0.5$", r"$\rho=1$"]
LS_STYLES  = [(0, (5, 2)), (0, (3, 1, 1, 1)), (0, (2, 1))]

# ---- Generate correlated samples --------------------------------------------
df_ref  = pd.read_csv(REF_CSV)
df_rho0 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=0.0, seed=SEED)
df_rho5 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=0.5, seed=SEED)
df_rho1 = generate_manning_combinations_correlated(str(DIST_CSV), N, rho=1.0, seed=SEED)


def weighted_mean(df):
    cols = [c for c in WEIGHTS if c in df.columns]
    w    = np.array([WEIGHTS[c] for c in cols]); w /= w.sum()
    return df[cols].values @ w


nbar_ref = weighted_mean(df_ref)
RHO_ARRS = [weighted_mean(df_rho0), weighted_mean(df_rho5), weighted_mean(df_rho1)]
cv_ref   = 100 * nbar_ref.std() / nbar_ref.mean()

# ---- Theoretical CV curve ---------------------------------------------------
df_dist = pd.read_csv(DIST_CSV, index_col=0)
class_sigmas, class_means = {}, {}
for _, row in df_dist.iterrows():
    if str(row["N"]) == "-999":
        continue
    vals = np.array([float(v) for v in str(row["N"]).split(",")])
    dn, params = _best_distribution(vals)
    d = getattr(stats, dn)
    mu, var = d.stats(*params[:-2], loc=params[-2], scale=params[-1], moments="mv")
    class_means[row[u"Descripción"]]  = float(mu)
    class_sigmas[row[u"Descripción"]] = float(np.sqrt(var))

w_arr     = np.array([WEIGHTS[k] for k in class_sigmas if k in WEIGHTS])
sig_arr   = np.array([class_sigmas[k] for k in class_sigmas if k in WEIGHTS])
mu_nbar   = (w_arr * np.array([class_means[k] for k in class_sigmas if k in WEIGHTS])).sum()
rho_vals  = np.linspace(0, 1, 200)
var_ind   = (w_arr**2 * sig_arr**2).sum()
cross     = (w_arr @ sig_arr)**2 - var_ind
cv_theory = 100 * np.sqrt(var_ind + rho_vals * cross) / mu_nbar

# ---- Flood results + GMM regime ---------------------------------------------
df_res   = pd.read_csv(RES_CSV, index_col=0)
area     = df_res["hecras_area_km2"].values
gmm      = GaussianMixture(n_components=2, random_state=42, n_init=10)
labels   = gmm.fit_predict(area.reshape(-1, 1))
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    labels = 1 - labels
low_mask  = labels == 0
high_mask = labels == 1
nbar_sim  = df_res["hecras_manning_mean"].values
r_all, p_all = pearsonr(nbar_sim, area)
print(f"Regimes -- low: {low_mask.sum()}, high: {high_mask.sum()}")
print(f"Regression: r={r_all:.3f}, p={p_all:.3f}")


def save(fig, name):
    for ext in ["pdf", "png"]:
        fig.savefig(FIG_DIR / f"{name}.{ext}", dpi=180, bbox_inches="tight")
    print(f"  saved {name}")
    plt.close(fig)


# =============================================================================
# PANEL (a) -- CV amplification
# =============================================================================
fig_a, ax_a = plt.subplots(figsize=(4.2, 3.8))

ax_a.plot(rho_vals, cv_theory, "k-", lw=2.2, label="Theory")
ax_a.axhline(cv_ref, color="k", ls=":", lw=1.4, alpha=0.7,
             label=f"Current MC ({cv_ref:.1f}%)")
for rho_num, lbl, col, arr in zip([0.0, 0.5, 1.0], RHO_LABELS, COLORS, RHO_ARRS):
    cv_emp = 100 * arr.std() / arr.mean()
    ax_a.scatter(rho_num, cv_emp, color=col, s=100, zorder=5,
                 label=f"{lbl}  ({cv_emp:.1f}%)",
                 edgecolors="k", linewidths=0.6)

ax_a.set_xlabel("Inter-class correlation " + r"$\rho$", fontsize=10)
ax_a.set_ylabel(r"CV$(\bar{n})$  [%]", fontsize=10)
ax_a.set_title(r"(a) CV amplification of $\bar{n}$", fontsize=9, fontweight="bold")
ax_a.set_xlim(-0.05, 1.05)
ax_a.legend(fontsize=8.5, loc="upper left", framealpha=0.92)
ax_a.grid(True, alpha=0.35)
fig_a.tight_layout()
save(fig_a, "fig_copula_a")


# =============================================================================
# PANEL (b) -- Distribution of n-bar
# =============================================================================
fig_b, ax_b = plt.subplots(figsize=(4.5, 3.8))

bins = np.linspace(0.015, 0.095, 36)
for arr, lbl, col in zip(RHO_ARRS, RHO_LABELS, COLORS):
    ax_b.hist(arr, bins=bins, histtype="step", linewidth=2.0,
              density=True, color=col, label=lbl, alpha=0.95)
mean_nbar = np.mean([a.mean() for a in RHO_ARRS])
ax_b.axvline(mean_nbar, color="k", ls="--", lw=1.3, alpha=0.8,
             label=r"Mean $\bar{n}$")

ax_b.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=10)
ax_b.set_ylabel("Density", fontsize=10)
ax_b.set_title(r"(b) Distribution of $\bar{n}$ by scenario", fontsize=9, fontweight="bold")
ax_b.legend(fontsize=8.5, loc="upper right", framealpha=0.92)
ax_b.grid(True, alpha=0.35)
fig_b.tight_layout()
save(fig_b, "fig_copula_b")


# =============================================================================
# PANEL (c) -- Scatter n-bar vs flood output
# =============================================================================
fig_c, ax_c = plt.subplots(figsize=(4.8, 4.2))

ax_c.scatter(nbar_sim[high_mask], area[high_mask],
             s=20, alpha=0.4, color="#e07070", linewidths=0,
             zorder=2, rasterized=True)
ax_c.scatter(nbar_sim[low_mask], area[low_mask],
             s=32, alpha=0.82, color="#2060b8",
             linewidths=0.4, edgecolors="#1040a0", zorder=3)

m, b_int, *_ = linregress(nbar_sim, area)
x_line = np.array([nbar_sim.min(), nbar_sim.max()])
ax_c.plot(x_line, m * x_line + b_int, "k--", lw=1.6, zorder=4)

ax_c.set_ylim(0.485, 0.905)
ax_c.set_xlim(nbar_sim.min() - 0.003, nbar_sim.max() + 0.003)

# -- Copula range lines with their own small legend (upper left) ---------------
range_handles = []
for arr, lbl, col, ls in zip(RHO_ARRS, RHO_LABELS, COLORS, LS_STYLES):
    p5, p95 = np.percentile(arr, [5, 95])
    ax_c.axvline(p5,  color=col, ls=ls, lw=1.3, alpha=0.9, zorder=5)
    ax_c.axvline(p95, color=col, ls=ls, lw=1.3, alpha=0.9, zorder=5)
    range_handles.append(
        Line2D([0], [0], color=col, ls=ls, lw=1.5,
               label=f"{lbl} – P5/P95")
    )

leg1 = ax_c.legend(handles=range_handles, fontsize=7.5,
                   loc="upper left", framealpha=0.92,
                   title="Copula range", title_fontsize=7,
                   borderpad=0.5, labelspacing=0.22)
ax_c.add_artist(leg1)   # keep leg1 after adding leg2

# -- Regime + regression legend (lower right) ----------------------------------
leg2_handles = [
    mpatches.Patch(color="#e07070", alpha=0.6,
                   label=f"High regime  (n = {high_mask.sum()})"),
    mpatches.Patch(color="#2060b8",
                   label=f"Low regime  (n = {low_mask.sum()})"),
    Line2D([0], [0], color="k", ls="--", lw=1.6,
           label=f"All:  $r={r_all:.3f}$,  $p={p_all:.2f}$"),
]
ax_c.legend(handles=leg2_handles, fontsize=8, loc="lower right", framealpha=0.92)

ax_c.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=10)
ax_c.set_ylabel(r"HEC-RAS flooded area (km$^2$)", fontsize=10)
ax_c.set_title(r"(c) $\bar{n}$ vs flood output (995 runs)", fontsize=9, fontweight="bold")
ax_c.grid(True, alpha=0.35)
fig_c.tight_layout()
save(fig_c, "fig_copula_c")

print("Done.")
