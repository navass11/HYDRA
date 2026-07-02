"""
Regenerate fig01_manning_distributions with per-panel distribution name annotation.
Fix: legend says 'Fitted PDF' (generic); each subplot has a small annotation
     with the actual distribution used (Normal / Log-normal / Gamma).
"""
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy import stats as sc_stats

NB_DIR   = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/notebooks/modeling/hydraulic/manning_sensitivity")
FIG_DIR  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/papers/besaya_manning_sensitivity/figures")

DIST_CSV = NB_DIR / "data/manning_roughness_coefficients_dist.csv"
COMB_CSV = NB_DIR / "data/combinaciones_rugosidad.csv"

REMOVE = [29, 295, 633, 724, 755]

LAND_USES    = ["Trees", "Dense vegetation", "Urban vegetation", "Infrastructure",
                "Sparse vegetation", "Residential", "Industrial", "River", "Brushland"]
LABELS_SHORT = ["Trees", "Dense veg.", "Urban veg.", "Infrastr.", "Sparse veg.",
                "Residential", "Industrial", "River", "Brushland"]

CANDIDATES   = ["norm", "lognorm", "gamma"]
DIST_DISPLAY = {"norm": "Normal", "lognorm": "Log-normal", "gamma": "Gamma"}


def best_dist(values):
    best_name, best_p, best_par = None, -1, None
    for d in CANDIDATES:
        par = getattr(sc_stats, d).fit(values)
        _, p = sc_stats.kstest(values, d, args=par)
        if p > best_p:
            best_name, best_p, best_par = d, p, par
    return best_name, best_par


comb    = pd.read_csv(COMB_CSV).drop(index=REMOVE, errors="ignore").reset_index(drop=True)
dist_df = pd.read_csv(DIST_CSV, index_col=0)

fig, axes = plt.subplots(3, 3, figsize=(6.8, 5.5))
axes = axes.flatten()

for idx, (col, lbl) in enumerate(zip(LAND_USES, LABELS_SHORT)):
    row  = dist_df[dist_df["Descripción"] == col].iloc[0]
    vals = np.array([float(v) for v in str(row["N"]).split(",")])
    mc   = comb[col].values
    name, par = best_dist(vals)
    dist_obj  = getattr(sc_stats, name)

    ax = axes[idx]
    ax.hist(mc,   bins=40, density=True, alpha=0.55, color="#4878d0",
            label="MC sample", linewidth=0)
    ax.hist(vals, density=True, alpha=0.85, color="#ee854a",
            label="Literature", linewidth=0.5, edgecolor="white")
    x   = np.linspace(mc.min(), mc.max(), 300)
    pdf = dist_obj.pdf(x, *par[:-2], loc=par[-2], scale=par[-1])
    ax.plot(x, pdf, "k-", lw=1.4, label="Fitted PDF")

    # distribution name annotation inside each panel — white bbox prevents overlap with bars
    ax.text(0.97, 0.95, DIST_DISPLAY[name],
            transform=ax.transAxes, fontsize=6, ha="right", va="top",
            style="italic", color="#333333",
            bbox=dict(boxstyle="round,pad=0.2", fc="white", ec="none", alpha=0.85))

    ax.set_title(lbl, pad=3, fontsize=9, fontweight="bold")
    ax.set_xlabel(r"$n$ (m$^{-1/3}$s)", labelpad=1)
    if idx % 3 == 0:
        ax.set_ylabel("Density", labelpad=2)
    if idx == 0:
        ax.legend(fontsize=6.5, loc="upper left", handlelength=1)

plt.suptitle("Manning roughness coefficient distributions by land use", y=1.01, fontsize=10, fontweight="bold")
plt.tight_layout(pad=0.5)
for ext in ["pdf", "png"]:
    fig.savefig(FIG_DIR / f"fig01_manning_distributions.{ext}", bbox_inches="tight")
    print(f"Saved fig01_manning_distributions.{ext}")
plt.close(fig)
