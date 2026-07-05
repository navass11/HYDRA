"""
Regenerate fig05b_bifurcation_distributions as a standalone, readable panel.

The earlier split version had a very shallow bounding box, which made the
distributional evidence appear too small when included at text width.
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.mixture import GaussianMixture


HERE = Path(__file__).resolve().parent
DATA_CSV = HERE / "zenodo_upload" / "data" / "comparison_clean_995.csv"
FIG_DIR = HERE / "figures"

C_LOW = "#4878d0"
C_HIGH = "#c44e52"
C_SF = "#6acc65"


def main():
    comp = pd.read_csv(DATA_CSV, index_col=0)

    gmm = GaussianMixture(n_components=2, random_state=42, n_init=10)
    labels = gmm.fit_predict(comp["hecras_area_km2"].to_numpy().reshape(-1, 1))
    if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
        labels = 1 - labels

    low = labels == 0
    high = labels == 1
    r0 = comp.loc[low]
    r1 = comp.loc[high]

    fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.6))

    ax = axes[0]
    bins_all = np.linspace(0.50, 0.82, 32)
    ax.hist(
        comp["sfincs_area_km2"],
        bins=np.linspace(0.50, 0.58, 22),
        color=C_SF,
        alpha=0.70,
        label="SFINCS",
    )
    ax.hist(
        r0["hecras_area_km2"],
        bins=bins_all,
        color=C_LOW,
        alpha=0.82,
        label=f"HEC-RAS low (N={low.sum()})",
    )
    ax.hist(
        r1["hecras_area_km2"],
        bins=bins_all,
        color=C_HIGH,
        alpha=0.55,
        label=f"HEC-RAS high (N={high.sum()})",
    )
    ax.axvline(r0["hecras_area_km2"].mean(), color=C_LOW, lw=1.2, ls=":")
    ax.axvline(r1["hecras_area_km2"].mean(), color=C_HIGH, lw=1.2, ls=":")
    ax.set_xlabel("Flooded area (km²)", fontsize=8)
    ax.set_ylabel("Count", fontsize=8)
    ax.set_title("(a) Area distributions by model and regime", fontsize=8.5, fontweight="bold")
    ax.tick_params(labelsize=7)
    ax.grid(True, alpha=0.28, axis="y")

    ax = axes[1]
    ax.scatter(
        comp.loc[high, "sfincs_area_km2"],
        comp.loc[high, "hecras_area_km2"],
        s=9,
        alpha=0.20,
        color=C_HIGH,
        linewidths=0,
        label=f"High (N={high.sum()})",
    )
    ax.scatter(
        comp.loc[low, "sfincs_area_km2"],
        comp.loc[low, "hecras_area_km2"],
        s=16,
        alpha=0.72,
        color=C_LOW,
        linewidths=0,
        label=f"Low (N={low.sum()})",
    )
    rho, pval = stats.spearmanr(comp["sfincs_area_km2"], labels)
    ax.text(
        0.04,
        0.96,
        fr"$\rho_s={rho:.2f}$, $p<10^{{-31}}$",
        transform=ax.transAxes,
        fontsize=7.5,
        va="top",
        ha="left",
        bbox=dict(boxstyle="round,pad=0.22", fc="white", ec="0.8", alpha=0.90),
    )
    ax.set_xlabel("SFINCS flooded area (km²)", fontsize=8)
    ax.set_ylabel("HEC-RAS flooded area (km²)", fontsize=8)
    ax.set_title("(b) SFINCS area as regime predictor", fontsize=8.5, fontweight="bold")
    ax.tick_params(labelsize=7)
    ax.grid(True, alpha=0.28)

    handles, labels_text = [], []
    for axis in axes:
        h, l = axis.get_legend_handles_labels()
        handles.extend(h)
        labels_text.extend(l)
    fig.legend(
        handles,
        labels_text,
        loc="lower center",
        ncol=5,
        fontsize=7.4,
        handlelength=1.2,
        markerscale=1.8,
        framealpha=0.92,
        bbox_to_anchor=(0.5, 0.02),
    )

    fig.tight_layout(pad=1.2, w_pad=1.6, rect=[0, 0.13, 1, 1])
    for ext in ("pdf", "png"):
        fig.savefig(FIG_DIR / f"fig05b_bifurcation_distributions.{ext}", dpi=300, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    main()
