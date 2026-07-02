"""
Supplementary figure: copula robustness via importance sampling.
Two panels:
  (a) Weighted KDE of SFINCS flooded area for rho = 0, 0.3, 0.5
  (b) Bar chart: high-regime fraction vs rho
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
from sklearn.mixture import GaussianMixture

COMB_CSV = Path("/Volumes/My Passport 2/OneDrive/Scripts_Python/Paper_Rugosidades/combinaciones_rugosidad.csv")
RES_CSV  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/notebooks/modeling/hydraulic/manning_sensitivity"
                "/comparison_sfincs_hecras_clean.csv")
FIG_DIR  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/papers/besaya_manning_sensitivity/figures")

# ── Load & align ──────────────────────────────────────────────────────────────
comb = pd.read_csv(COMB_CSV)
res  = pd.read_csv(RES_CSV, index_col=0)
comb_aligned = comb.loc[res.index].values   # (995, 9)
N, p = comb_aligned.shape

# ── GMM regime labels (HEC-RAS area, matching paper) ─────────────────────────
area_hr = res["hecras_area_km2"].values
gmm = GaussianMixture(n_components=2, random_state=42, n_init=10)
lab = gmm.fit_predict(area_hr.reshape(-1, 1))
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    lab = 1 - lab

# HEC-RAS area used for KDE — bimodal distribution that the paper reports
area_hr_km2 = res["hecras_area_km2"].values

# ── PIT + standard normal transform ──────────────────────────────────────────
U = np.column_stack([rankdata(comb_aligned[:, j]) / (N + 1) for j in range(p)])
Z = np.clip(stats.norm.ppf(U), -4, 4)

# ── Importance weights ────────────────────────────────────────────────────────
def importance_weights(Z, rho):
    p   = Z.shape[1]
    a   = 1.0 / (1 - rho)
    b   = rho / ((1 - rho) * (1 + (p - 1) * rho))
    zz  = np.sum(Z ** 2, axis=1)
    zs  = np.sum(Z, axis=1) ** 2
    lw  = -0.5 * ((a - 1) * zz - b * zs) \
          - 0.5 * ((p - 1) * np.log(1 - rho) + np.log(1 + (p - 1) * rho))
    lw -= lw.max()
    w   = np.exp(lw)
    return w / w.sum()

rhos       = [0.0, 0.3, 0.5]
colors     = ["#4878d0", "#e28743", "#c44e52"]
labels     = [r"$\rho = 0$ (independent, $N=995$)",
              r"$\rho = 0.3$ ($N_\mathrm{eff}=271$)",
              r"$\rho = 0.5$ ($N_\mathrm{eff}=85$)"]
high_fracs = []

for rho in rhos:
    if rho == 0.0:
        w = np.ones(N) / N
    else:
        w = importance_weights(Z, rho)
    eff_n  = 1.0 / np.sum(w ** 2)
    w_high = w[lab == 1].sum() * 100
    high_fracs.append(w_high)

# ── Figure ────────────────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(11, 4.2))

# ── (a) Weighted KDE ─────────────────────────────────────────────────────────
ax = axes[0]
xx = np.linspace(area_hr_km2.min() * 0.93, area_hr_km2.max() * 1.05, 500)

for rho, col, lbl in zip(rhos, colors, labels):
    if rho == 0.0:
        w = np.ones(N) / N
    else:
        w = importance_weights(Z, rho)

    # Weighted KDE using resampling (draw ~5000 samples with replacement)
    rng = np.random.default_rng(42)
    idx = rng.choice(N, size=5000, p=w)
    kde = gaussian_kde(area_hr_km2[idx], bw_method=0.15)
    lw  = 2.2 if rho == 0.0 else 1.6
    ls  = "-" if rho == 0.0 else ("--" if rho == 0.3 else ":")
    ax.plot(xx, kde(xx), color=col, lw=lw, ls=ls, label=lbl, zorder=3 - rhos.index(rho))

ax.set_xlabel("HEC-RAS flooded area (km²)", fontsize=10)
ax.set_ylabel("Kernel density", fontsize=10)
ax.set_title("(a) Flooded-area distribution under correlated Manning sampling",
             fontweight="bold", fontsize=9)
ax.legend(fontsize=8.5, framealpha=0.92)
ax.grid(True, alpha=0.3)
ax.text(0.97, 0.95, "Bimodal structure\npersists for all ρ",
        transform=ax.transAxes, fontsize=8, color="gray",
        ha="right", va="top",
        bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="lightgray", alpha=0.8))

# ── (b) High-regime fraction vs rho ──────────────────────────────────────────
ax = axes[1]
x_pos = np.arange(len(rhos))
bars = ax.bar(x_pos, high_fracs, color=colors, width=0.55, edgecolor="white", linewidth=0.8)
ax.axhline(high_fracs[0], color="gray", lw=1.0, ls="--", alpha=0.7, label="Independent baseline")
for bar, frac in zip(bars, high_fracs):
    ax.text(bar.get_x() + bar.get_width() / 2, frac + 0.8,
            f"{frac:.1f}%", ha="center", va="bottom", fontsize=9.5, fontweight="bold")
ax.set_xticks(x_pos)
ax.set_xticklabels([r"$\rho=0$" + "\n(independent)",
                    r"$\rho=0.3$" + r" ($N_\mathrm{eff}=271$)",
                    r"$\rho=0.5$" + r" ($N_\mathrm{eff}=85$)"], fontsize=9)
ax.set_ylabel("High-inundation regime (%)", fontsize=10)
ax.set_ylim(0, 105)
ax.set_title("(b) High-regime fraction under inter-class roughness correlation",
             fontweight="bold", fontsize=9)
ax.legend(fontsize=8.5, framealpha=0.92)
ax.grid(True, alpha=0.3, axis="y")

plt.tight_layout(pad=1.5)
for ext in ["pdf", "png"]:
    fig.savefig(FIG_DIR / f"fig_copula_is.{ext}", dpi=180, bbox_inches="tight")
    print(f"Saved fig_copula_is.{ext}")
plt.close(fig)
