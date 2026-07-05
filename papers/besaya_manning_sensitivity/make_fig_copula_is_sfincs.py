"""
Supplementary figure S4: importance-sampling robustness check — SFINCS.
Mirrors fig_copula_is.py (HEC-RAS / S3) but for SFINCS flooded area.
SFINCS shows a unimodal, stable response across all rho values.

Two panels:
  (a) Weighted KDE of SFINCS flooded area for rho = 0, 0.3, 0.5
  (b) Weighted mean ± 1 std of SFINCS flooded area vs rho
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
from scipy.stats import rankdata, gaussian_kde

DATA_DIR = Path(__file__).resolve().parent / "zenodo_upload" / "data"
COMB_CSV = DATA_DIR / "monte_carlo_combinations.csv"
RES_CSV  = DATA_DIR / "comparison_clean_995.csv"
FIG_DIR = Path(__file__).resolve().parent / "figures"

# ── Load & align ──────────────────────────────────────────────────────────────
comb = pd.read_csv(COMB_CSV)
res  = pd.read_csv(RES_CSV, index_col=0)
comb_aligned = comb.loc[res.index].values   # (995, 9)
N, p = comb_aligned.shape

area_sf = res["sfincs_area_km2"].values

# ── PIT + standard normal transform ──────────────────────────────────────────
U = np.column_stack([rankdata(comb_aligned[:, j]) / (N + 1) for j in range(p)])
Z = np.clip(stats.norm.ppf(U), -4, 4)

# ── Importance weights ────────────────────────────────────────────────────────
def importance_weights(Z, rho):
    p_  = Z.shape[1]
    a   = 1.0 / (1 - rho)
    b   = rho / ((1 - rho) * (1 + (p_ - 1) * rho))
    zz  = np.sum(Z ** 2, axis=1)
    zs  = np.sum(Z, axis=1) ** 2
    lw  = -0.5 * ((a - 1) * zz - b * zs) \
          - 0.5 * ((p_ - 1) * np.log(1 - rho) + np.log(1 + (p_ - 1) * rho))
    lw -= lw.max()
    w   = np.exp(lw)
    return w / w.sum()

rhos   = [0.0, 0.3, 0.5]
colors = ["#4878d0", "#e28743", "#c44e52"]
labels = [r"$\rho = 0$ (independent, $N=995$)",
          r"$\rho = 0.3$ ($N_\mathrm{eff}=271$)",
          r"$\rho = 0.5$ ($N_\mathrm{eff}=85$)"]

w_all   = []
means   = []
stds    = []

for rho in rhos:
    w = np.ones(N) / N if rho == 0.0 else importance_weights(Z, rho)
    w_all.append(w)
    means.append(np.sum(w * area_sf))
    stds.append(np.sqrt(np.sum(w * (area_sf - means[-1]) ** 2)))

# ── Figure ────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(11, 4.8))

# ── (a) Weighted KDE ─────────────────────────────────────────────────────────
ax = axes[0]
xx = np.linspace(area_sf.min() * 0.96, area_sf.max() * 1.04, 500)
rng = np.random.default_rng(42)

for rho, col, lbl, w in zip(rhos, colors, labels, w_all):
    idx = rng.choice(N, size=5000, p=w)
    kde = gaussian_kde(area_sf[idx], bw_method=0.20)
    lw  = 2.2 if rho == 0.0 else 1.6
    ls  = "-" if rho == 0.0 else ("--" if rho == 0.3 else ":")
    ax.plot(xx, kde(xx), color=col, lw=lw, ls=ls, label=lbl,
            zorder=3 - rhos.index(rho))

ax.set_xlabel("SFINCS flooded area (km²)", fontsize=10)
ax.set_ylabel("Kernel density", fontsize=10)
ax.set_title("(a) SFINCS flooded-area distribution under correlated Manning sampling",
             fontweight="bold", fontsize=9)
ax.grid(True, alpha=0.3)
ax.text(0.97, 0.95, "Unimodal structure\nstable for all ρ",
        transform=ax.transAxes, fontsize=8, color="gray",
        ha="right", va="top",
        bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="lightgray", alpha=0.8))

# ── (b) Weighted mean ± 1σ vs rho ────────────────────────────────────────────
ax = axes[1]
x_pos = np.arange(len(rhos))
bars = ax.bar(x_pos, means, color=colors, width=0.55,
              edgecolor="white", linewidth=0.8)
ax.errorbar(x_pos, means, yerr=stds, fmt="none",
            ecolor="black", elinewidth=1.5, capsize=5, capthick=1.5, zorder=5)
ax.axhline(means[0], color="gray", lw=1.0, ls="--", alpha=0.7,
           label="Independent baseline")

for bar, m, s in zip(bars, means, stds):
    ax.text(bar.get_x() + bar.get_width() / 2, m + s + 0.001,
            f"{m:.4f}", ha="center", va="bottom", fontsize=9.5, fontweight="bold")

ax.set_xticks(x_pos)
ax.set_xticklabels([r"$\rho=0$" + "\n(independent)",
                    r"$\rho=0.3$" + r" ($N_\mathrm{eff}=271$)",
                    r"$\rho=0.5$" + r" ($N_\mathrm{eff}=85$)"], fontsize=9)
ax.set_ylabel("Weighted mean SFINCS flooded area (km²)", fontsize=10)
ax.set_ylim(0, means[0] * 1.12)
ax.set_title("(b) Weighted mean ± 1σ of SFINCS flooded area vs correlation",
             fontweight="bold", fontsize=9)
ax.grid(True, alpha=0.3, axis="y")

handles_a, labels_a = axes[0].get_legend_handles_labels()
handles_b, labels_b = axes[1].get_legend_handles_labels()
fig.legend(
    handles_a + handles_b, labels_a + labels_b,
    loc="lower center", ncol=4, fontsize=8.2,
    framealpha=0.92, bbox_to_anchor=(0.5, 0.02),
)

plt.tight_layout(pad=1.5, rect=[0, 0.13, 1, 1])
for ext in ["pdf", "png"]:
    fig.savefig(FIG_DIR / f"fig_copula_is_sfincs.{ext}", dpi=180, bbox_inches="tight")
    print(f"Saved fig_copula_is_sfincs.{ext}")
plt.close(fig)

# Print summary for text
print(f"\nSFINCS weighted means: {[f'{m:.4f}' for m in means]}")
print(f"SFINCS weighted stds:  {[f'{s:.4f}' for s in stds]}")
pct_change = (means[-1] - means[0]) / means[0] * 100
print(f"Change from rho=0 to rho=0.5: {pct_change:+.2f}%")
