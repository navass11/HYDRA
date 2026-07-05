"""
Regenerate fig04 and fig07 with fixed legend placement and larger figure sizes.

fig04: inter-model SFINCS vs HEC-RAS comparison (scatter + KDE)
fig07: alternative metrics (median depth, inundation volume)
"""
import sys
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy import stats
from scipy.stats import gaussian_kde
from sklearn.mixture import GaussianMixture

HERE = Path(__file__).resolve().parent
RES_CSV = HERE / "zenodo_upload" / "data" / "comparison_clean_995.csv"
FIG_DIR = HERE / "figures"

C_LOW  = "#4878d0"
C_HIGH = "#c44e52"
C_SF   = "#6acc65"


def save(fig, name):
    for ext in ["pdf", "png"]:
        fig.savefig(FIG_DIR / f"{name}.{ext}", dpi=180, bbox_inches="tight")
    print(f"  saved {name}")
    plt.close(fig)


def cv(s): return s.std() / s.mean() * 100


# ── Load data ────────────────────────────────────────────────────────────────
df = pd.read_csv(RES_CSV, index_col=0)

# Regime classification via GMM on HEC-RAS flooded area
area = df["hecras_area_km2"].values
gmm = GaussianMixture(n_components=2, random_state=42, n_init=10)
lab = gmm.fit_predict(area.reshape(-1, 1))
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    lab = 1 - lab
low_mask  = lab == 0
high_mask = lab == 1
print(f"Regimes — low: {low_mask.sum()}, high: {high_mask.sum()}")

# Convenience subsets
df_low  = df[low_mask]
df_high = df[high_mask]

# Computed columns
df["sfincs_volume_m3"] = df["sfincs_depth_mean"] * df["sfincs_area_km2"] * 1e6
df["hecras_volume_m3"] = df["hecras_depth_mean"] * df["hecras_area_km2"] * 1e6


# =============================================================================
# FIGURE 4 — inter-model comparison
# =============================================================================
fig4, axes = plt.subplots(2, 2, figsize=(10.5, 8.5))

# ── (a) 1:1 depth scatter ────────────────────────────────────────────────────
ax = axes[0, 0]
r_d, p_d = stats.pearsonr(df["sfincs_depth_mean"], df["hecras_depth_mean"])
bias_d   = (df["hecras_depth_mean"] - df["sfincs_depth_mean"]).mean()
ax.scatter(df.loc[low_mask,  "sfincs_depth_mean"],
           df.loc[low_mask,  "hecras_depth_mean"],
           s=8, alpha=0.65, color=C_LOW, linewidths=0, label="Low regime",  zorder=3)
ax.scatter(df.loc[high_mask, "sfincs_depth_mean"],
           df.loc[high_mask, "hecras_depth_mean"],
           s=5, alpha=0.20, color=C_HIGH, linewidths=0, label="High regime", zorder=2)
lim = [df[["sfincs_depth_mean","hecras_depth_mean"]].min().min()*0.97,
       df[["sfincs_depth_mean","hecras_depth_mean"]].max().max()*1.03]
ax.plot(lim, lim, "k--", lw=0.9, label="1:1", zorder=4)
ax.set_xlim(lim); ax.set_ylim(lim)
ax.set_xlabel("SFINCS mean depth (m)", fontsize=9)
ax.set_ylabel("HEC-RAS mean depth (m)", fontsize=9)
ax.set_title(f"(a) Depth:  $r$={r_d:.3f},  bias={bias_d:+.3f} m",
             fontweight="bold", fontsize=9)
# Legend at lower right — data clusters along 1:1 diagonal, lower-right is empty
ax.legend(handlelength=1, markerscale=2.5, fontsize=8, loc="lower right",
          framealpha=0.92)
ax.grid(True, alpha=0.3)

# ── (b) 1:1 area scatter ─────────────────────────────────────────────────────
ax = axes[0, 1]
r_a, p_a = stats.pearsonr(df["sfincs_area_km2"], df["hecras_area_km2"])
bias_a   = (df["hecras_area_km2"] - df["sfincs_area_km2"]).mean()
ax.scatter(df.loc[low_mask,  "sfincs_area_km2"],
           df.loc[low_mask,  "hecras_area_km2"],
           s=8, alpha=0.65, color=C_LOW, linewidths=0, label="Low regime",  zorder=3)
ax.scatter(df.loc[high_mask, "sfincs_area_km2"],
           df.loc[high_mask, "hecras_area_km2"],
           s=5, alpha=0.20, color=C_HIGH, linewidths=0, label="High regime", zorder=2)
lim2 = [df[["sfincs_area_km2","hecras_area_km2"]].min().min()*0.95,
        df[["sfincs_area_km2","hecras_area_km2"]].max().max()*1.05]
ax.plot(lim2, lim2, "k--", lw=0.9, label="1:1", zorder=4)
ax.axhline(df_low["hecras_area_km2"].mean(),  color=C_LOW,  lw=1.0, ls=":",
           label=f"Low mean={df_low['hecras_area_km2'].mean():.3f}")
ax.axhline(df_high["hecras_area_km2"].mean(), color=C_HIGH, lw=1.0, ls=":",
           label=f"High mean={df_high['hecras_area_km2'].mean():.3f}")
ax.set_xlim(lim2); ax.set_ylim(lim2)
ax.set_xlabel("SFINCS flooded area (km²)", fontsize=9)
ax.set_ylabel("HEC-RAS flooded area (km²)", fontsize=9)
ax.set_title(f"(b) Area:  $r$={r_a:.3f},  bias={bias_a:+.3f} km²",
             fontweight="bold", fontsize=9)
# Legend at lower right — bimodal HEC-RAS bands leave the lower-right open
ax.legend(handlelength=1, markerscale=2.5, fontsize=7.5, loc="lower right",
          framealpha=0.92)
ax.grid(True, alpha=0.3)

# ── (c) KDE depth ────────────────────────────────────────────────────────────
ax = axes[1, 0]
for data, lbl, col in [(df["sfincs_depth_mean"], "SFINCS", C_SF),
                        (df["hecras_depth_mean"], "HEC-RAS", "#c44e52")]:
    kde = gaussian_kde(data, bw_method=0.3)
    xx  = np.linspace(data.min() * 0.95, data.max() * 1.05, 300)
    ax.fill_between(xx, kde(xx), alpha=0.35, color=col)
    ax.plot(xx, kde(xx), color=col, lw=1.6,
            label=f"{lbl} (CV={cv(data):.1f}%)")
ax.set_xlabel("Mean water depth (m)", fontsize=9)
ax.set_ylabel("Kernel density", fontsize=9)
ax.set_title("(c) Depth distributions across 995 simulations",
             fontweight="bold", fontsize=9)
ax.legend(fontsize=8.5, loc="upper right", framealpha=0.92)
ax.grid(True, alpha=0.3)

# ── (d) KDE area ─────────────────────────────────────────────────────────────
ax = axes[1, 1]
for data, lbl, col in [(df["sfincs_area_km2"], "SFINCS", C_SF),
                        (df["hecras_area_km2"], "HEC-RAS", "#c44e52")]:
    kde = gaussian_kde(data, bw_method=0.15)
    xx  = np.linspace(data.min() * 0.93, data.max() * 1.05, 400)
    ax.fill_between(xx, kde(xx), alpha=0.35, color=col)
    ax.plot(xx, kde(xx), color=col, lw=1.6,
            label=f"{lbl} (CV={cv(data):.1f}%)")
ymax = ax.get_ylim()[1]
for level, col, name in [
    (df_low["hecras_area_km2"].mean(),  C_LOW,  "Low"),
    (df_high["hecras_area_km2"].mean(), C_HIGH, "High"),
]:
    ax.axvline(level, color=col, lw=1.2, ls="--")
    ax.text(level, ymax * 0.50, f"{name}\n{level:.3f} km²",
            ha="center", va="bottom", fontsize=7.5, color=col,
            bbox=dict(boxstyle="round,pad=0.2", fc="white", ec="none", alpha=0.85))
ax.set_xlabel("Flooded area (km²)", fontsize=9)
ax.set_ylabel("Kernel density", fontsize=9)
ax.set_title("(d) Area distributions — HEC-RAS bimodal, SFINCS unimodal",
             fontweight="bold", fontsize=9)
ax.legend(fontsize=8.5, loc="upper right", framealpha=0.92)
ax.grid(True, alpha=0.3)

fig4.suptitle("Inter-model comparison: SFINCS vs HEC-RAS (N=995 simulations)",
              fontsize=10, fontweight="bold")
plt.tight_layout(pad=1.4, h_pad=2.5, w_pad=1.5)
save(fig4, "fig04_intermodel_comparison")


# =============================================================================
# FIGURE 7 — alternative metrics (median depth, inundation volume)
# =============================================================================
fig7, axes = plt.subplots(2, 2, figsize=(10.5, 8.5))

METRICS = [
    ("sfincs_depth_median", "hecras_depth_median",
     r"Median water depth (m)",          "median depth",       False),
    ("sfincs_volume_m3",    "hecras_volume_m3",
     "Inundation volume (×10⁶ m³)", "inundation volume", True),
]

def pval_str(p):
    return r"$p < 0.001$" if p < 0.001 else fr"$p = {p:.3f}$"

for col_idx, (sf_col, hr_col, ylabel, display_label, is_vol) in enumerate(METRICS):
    scale = 1e-6 if is_vol else 1.0

    # ── SFINCS ──────────────────────────────────────────────────────────────
    ax = axes[0, col_idx]
    x = df["sfincs_manning_mean"];  y = df[sf_col] * scale
    sl, inter, r, p, _ = stats.linregress(x, y)
    xx = np.linspace(x.min(), x.max(), 100)
    ax.scatter(x, y, s=6, alpha=0.4, color=C_SF, linewidths=0)
    ax.plot(xx, sl*xx+inter, color="darkgreen", lw=1.6,
            label=fr"$r = {r:.2f}$, {pval_str(p)}")
    ax.set_xlabel("Mean Manning $n$ (wetted cells)", fontsize=9, labelpad=2)
    ax.set_ylabel(ylabel, fontsize=9, labelpad=2)
    ax.set_title(f"SFINCS — {display_label} (CV={cv(y):.1f}%)",
                 fontweight="bold", fontsize=9)
    ax.legend(loc="lower right", handlelength=1, fontsize=8.5, framealpha=0.92)
    ax.grid(True, alpha=0.3)

    # ── HEC-RAS ─────────────────────────────────────────────────────────────
    ax = axes[1, col_idx]
    x_all = df["hecras_manning_mean"];  y_all = df[hr_col] * scale
    sl, inter, r, p, _ = stats.linregress(x_all, y_all)
    xx = np.linspace(x_all.min(), x_all.max(), 100)

    ax.scatter(df.loc[low_mask,  "hecras_manning_mean"],
               df.loc[low_mask,  hr_col] * scale,
               s=8, alpha=0.55, color=C_LOW,  linewidths=0,
               label=f"Low regime (N={low_mask.sum()})",  zorder=3)
    ax.scatter(df.loc[high_mask, "hecras_manning_mean"],
               df.loc[high_mask, hr_col] * scale,
               s=5, alpha=0.22, color=C_HIGH, linewidths=0,
               label=f"High regime (N={high_mask.sum()})", zorder=2)
    ax.plot(xx, sl*xx+inter, color="black", lw=1.6, ls="--",
            label=fr"$r = {r:.2f}$, {pval_str(p)}",
            zorder=4)

    # Band means — show values in a clean in-panel box instead of over the data.
    mean_lines = []
    for mask, color, name in [(low_mask, C_LOW, "Low"), (high_mask, C_HIGH, "High")]:
        lv = (df.loc[mask, hr_col] * scale).mean()
        ax.axhline(lv, color=color, lw=0.9, ls=":", alpha=0.8)
        mean_lines.append(f"{name} mean = {lv:.3f}")
    ax.text(
        0.98, 0.93, "\n".join(mean_lines),
        transform=ax.transAxes,
        fontsize=8.0,
        color="0.15",
        ha="right",
        va="top",
        bbox=dict(boxstyle="round,pad=0.28", fc="white", ec="0.75", alpha=0.93),
        zorder=6,
    )

    ax.set_xlabel("Mean Manning $n$ (wetted cells)", fontsize=9, labelpad=2)
    ax.set_ylabel(ylabel, fontsize=9, labelpad=2)
    ax.set_title(f"HEC-RAS — {display_label} (CV={cv(y_all):.1f}%)",
                 fontweight="bold", fontsize=9)
    # Legend at lower right — high regime data is sparse there
    ax.grid(True, alpha=0.3)

# Panel labels
for ax, lbl in zip(axes.flatten(), ["(a)", "(b)", "(c)", "(d)"]):
    ax.annotate(lbl, xy=(0.02, 0.97), xycoords="axes fraction",
                fontsize=11, fontweight="bold", va="top",
                bbox=dict(boxstyle="round,pad=0.15", fc="white", alpha=0.7, lw=0))

fig7.suptitle(
    "Alternative metrics: median depth and inundation volume\n"
    "Less sensitive to discrete wet-cell threshold crossings",
    fontsize=10, fontweight="bold"
)
handles, labels = axes[1, 0].get_legend_handles_labels()
fig7.legend(
    handles, labels,
    loc="lower center", ncol=3, fontsize=8.3,
    handlelength=1.2, markerscale=2.5, framealpha=0.92,
    bbox_to_anchor=(0.5, 0.015),
)
plt.tight_layout(pad=1.4, h_pad=2.5, w_pad=1.5, rect=[0, 0.08, 1, 0.95])
save(fig7, "fig07_alternative_metrics")

print("All done.")
