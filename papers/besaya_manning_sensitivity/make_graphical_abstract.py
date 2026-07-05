from pathlib import Path
import os

os.environ.setdefault("MPLCONFIGDIR", "/private/tmp/mpl_hydra_paper")
os.environ.setdefault("LOKY_MAX_CPU_COUNT", "8")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import FancyArrowPatch
from sklearn.mixture import GaussianMixture


ROOT = Path(__file__).resolve().parent
DATA_CSV = ROOT / "zenodo_upload" / "data" / "comparison_clean_995.csv"
OUT = ROOT / "graphical_abstract.png"
OUT_TIFF = ROOT / "graphical_abstract.tif"

C_SFINCS = "#2f9e44"
C_LOW = "#3b6fb6"
C_HIGH = "#c44e52"
C_TEXT = "#202124"
C_MUTED = "#5f6368"


def classify_regimes(data):
    gmm = GaussianMixture(n_components=2, random_state=42, n_init=10)
    labels = gmm.fit_predict(data["hecras_area_km2"].to_numpy().reshape(-1, 1))
    if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
        labels = 1 - labels
    return labels


def arrow(ax, xy0, xy1, color="#6b7280", lw=2.0, scale=17):
    ax.add_patch(
        FancyArrowPatch(
            xy0,
            xy1,
            arrowstyle="-|>",
            mutation_scale=scale,
            linewidth=lw,
            color=color,
            shrinkA=0,
            shrinkB=0,
        )
    )


def draw_input_panel(ax):
    ax.set_axis_off()
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    ax.text(
        0.05,
        0.90,
        "Same roughness\nensemble",
        ha="left",
        va="top",
        fontsize=15.5,
        fontweight="bold",
        color=C_TEXT,
    )
    ax.text(
        0.05,
        0.66,
        "Paired Manning\nsamples",
        ha="left",
        va="top",
        fontsize=12.5,
        color=C_MUTED,
    )

    rng = np.random.default_rng(9)
    classes = np.arange(9)
    base = np.linspace(0.02, 0.16, 9)
    for i, b in enumerate(base):
        y = b + rng.normal(0, 0.007, 40)
        x = rng.normal(classes[i], 0.09, 40)
        ax.scatter(x / 10 + 0.05, y * 2.2 + 0.08, s=10, color="#8d99ae", alpha=0.42)
        ax.plot([i / 10 + 0.02, i / 10 + 0.08], [b * 2.2 + 0.08] * 2, color="#394867", lw=2)

    ax.text(0.05, 0.055, "Land-use roughness ranges", fontsize=10, color=C_MUTED)
    arrow(ax, (0.78, 0.45), (0.97, 0.45), color="#4b5563", lw=2.5)


def draw_distribution_panel(ax, data, labels):
    low = labels == 0
    high = labels == 1

    bins = np.linspace(0.50, 0.82, 42)
    ax.hist(
        data["sfincs_area_km2"],
        bins=np.linspace(0.50, 0.58, 28),
        color=C_SFINCS,
        alpha=0.82,
        label="SFINCS",
    )
    ax.hist(
        data.loc[low, "hecras_area_km2"],
        bins=bins,
        color=C_LOW,
        alpha=0.88,
        label="HEC-RAS low regime",
    )
    ax.hist(
        data.loc[high, "hecras_area_km2"],
        bins=bins,
        color=C_HIGH,
        alpha=0.62,
        label="HEC-RAS high regime",
    )
    ax.axvline(data.loc[low, "hecras_area_km2"].mean(), color=C_LOW, lw=2.0, ls=":")
    ax.axvline(data.loc[high, "hecras_area_km2"].mean(), color=C_HIGH, lw=2.0, ls=":")

    ax.set_title("Same inputs, different probability structure", fontsize=14, fontweight="bold", pad=8)
    ax.set_xlabel("Flooded area (km²)", fontsize=11)
    ax.set_ylabel("Simulation count", fontsize=11)
    ax.set_ylim(0, 265)
    ax.tick_params(labelsize=9)
    ax.grid(True, alpha=0.18, axis="y")
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(loc="upper left", fontsize=8.7, frameon=False)


def draw_threshold_panel(ax):
    ax.set_axis_off()
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    x = np.linspace(0.07, 0.93, 300)
    terrain = 0.20 + 0.12 * np.sin(2.7 * np.pi * x) + 0.42 * np.exp(-((x - 0.55) / 0.105) ** 2)
    water_low = 0.53
    water_high = 0.66

    ax.fill_between(x, 0.08, terrain, color="#d7d2c8", alpha=1.0)
    ax.plot(x, terrain, color="#6f6658", lw=2.0)
    ax.fill_between(x, terrain, water_low, where=water_low > terrain, color=C_LOW, alpha=0.35)
    ax.fill_between(x, terrain, water_high, where=water_high > terrain, color=C_HIGH, alpha=0.25)
    ax.hlines(water_low, 0.07, 0.49, colors=C_LOW, linestyles="-", lw=2.5)
    ax.hlines(water_high, 0.07, 0.93, colors=C_HIGH, linestyles="-", lw=2.5)
    ax.vlines(0.55, 0.08, terrain[np.argmin(np.abs(x - 0.55))], color="#111827", linestyles="--", lw=1.5)

    ax.text(0.05, 0.93, "Topographic threshold", fontsize=14, fontweight="bold", color=C_TEXT)
    label_box = {"facecolor": "white", "edgecolor": "none", "alpha": 0.88, "pad": 2.2}
    ax.text(
        0.55,
        0.75,
        "60.1 m\nsaddle",
        ha="center",
        va="bottom",
        fontsize=12,
        fontweight="bold",
        bbox=label_box,
    )
    ax.text(
        0.73,
        0.84,
        "high-regime\nconnection",
        color=C_HIGH,
        fontsize=11,
        fontweight="bold",
        ha="left",
        bbox=label_box,
    )
    ax.text(0.07, 0.05, "Main floodplain", fontsize=10, color=C_MUTED)
    ax.text(0.94, 0.05, "Secondary\ncompartment", fontsize=10, color=C_MUTED, ha="right")
    arrow(ax, (0.60, 0.65), (0.80, 0.65), color=C_HIGH, lw=2.2, scale=15)


def main():
    data = pd.read_csv(DATA_CSV, index_col=0)
    labels = classify_regimes(data)

    fig = plt.figure(figsize=(13.28, 5.31), dpi=100, facecolor="white")
    gs = fig.add_gridspec(
        1,
        3,
        width_ratios=[0.82, 1.38, 1.10],
        left=0.035,
        right=0.985,
        bottom=0.23,
        top=0.79,
        wspace=0.30,
    )

    ax0 = fig.add_subplot(gs[0, 0])
    ax1 = fig.add_subplot(gs[0, 1])
    ax2 = fig.add_subplot(gs[0, 2])

    draw_input_panel(ax0)
    draw_distribution_panel(ax1, data, labels)
    draw_threshold_panel(ax2)

    fig.text(
        0.5,
        0.94,
        "Roughness uncertainty can reveal model-structure effects in flood hazard estimates",
        ha="center",
        va="top",
        fontsize=18,
        fontweight="bold",
        color=C_TEXT,
    )
    fig.text(
        0.5,
        0.04,
        "HEC-RAS activates a threshold-controlled secondary compartment while SFINCS remains unimodal.",
        ha="center",
        va="bottom",
        fontsize=12,
        color=C_MUTED,
    )
    fig.savefig(OUT, dpi=100)
    fig.savefig(OUT_TIFF, dpi=100)
    plt.close(fig)


if __name__ == "__main__":
    main()
