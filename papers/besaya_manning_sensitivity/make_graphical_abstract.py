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
MANNING_CSV = ROOT / "zenodo_upload" / "data" / "monte_carlo_combinations.csv"
OUT = ROOT / "graphical_abstract.png"
OUT_TIFF = ROOT / "graphical_abstract.tif"

C_SFINCS = "#2f9e44"
C_LOW = "#3b6fb6"
C_HIGH = "#E69F00"
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


def draw_input_panel(ax, manning):
    ax.set_axis_off()
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    ax.text(
        0.05,
        0.97,
        "Same roughness\nensemble",
        ha="left",
        va="top",
        fontsize=14.5,
        fontweight="bold",
        color=C_TEXT,
    )
    ax.text(
        0.05,
        0.80,
        "9 land-use classes,\neach with its own\nManning-$n$ range",
        ha="left",
        va="top",
        fontsize=10,
        color=C_MUTED,
    )

    classes = list(manning.columns)
    n = len(classes)
    rng = np.random.default_rng(9)
    plot_bottom, plot_top = 0.12, 0.44
    xs = np.linspace(0.10, 0.90, n)

    ax.hlines(plot_bottom - 0.03, 0.04, 0.96, color="#c7cad1", lw=1.2)

    for xi, cls in zip(xs, classes):
        vals = manning[cls].to_numpy()
        sample = rng.choice(vals, size=min(14, len(vals)), replace=False)
        norm = (sample - vals.min()) / (vals.max() - vals.min() + 1e-12)
        y = plot_bottom + norm * (plot_top - plot_bottom)
        jitter = rng.normal(0, 0.016, size=len(sample))
        ax.scatter(xi + jitter, y, s=26, color="#6b7ea3", alpha=0.75, linewidths=0, zorder=2)
        med = plot_bottom + np.median(norm) * (plot_top - plot_bottom)
        ax.plot([xi - 0.045, xi + 0.045], [med, med], color="#243352", lw=3.2,
                 solid_capstyle="round", zorder=3)

    ax.text(0.5, 0.065, "same combination", fontsize=8.5, color=C_MUTED, ha="center", va="top")
    ax.text(0.5, 0.025, "→ paired into both models", fontsize=8.5, color=C_MUTED, ha="center", va="top")


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
    ax.legend(
        loc="upper center",
        bbox_to_anchor=(0.5, -0.20),
        ncol=3,
        fontsize=8.7,
        frameon=False,
        handlelength=1.3,
        columnspacing=1.1,
    )


def draw_threshold_panel(ax):
    ax.set_axis_off()
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    ax.text(0.05, 0.95, "Topographic threshold", fontsize=14, fontweight="bold", color=C_TEXT, va="top")

    x = np.linspace(0.05, 0.95, 300)
    terrain = 0.30 + 0.10 * np.sin(2.7 * np.pi * x) + 0.42 * np.exp(-((x - 0.55) / 0.105) ** 2)
    floor = 0.08
    water_low = 0.52
    water_high = 0.72

    ax.fill_between(x, floor, terrain, color="#d7d2c8", alpha=1.0)
    ax.plot(x, terrain, color="#6f6658", lw=2.2)
    ax.fill_between(x, terrain, water_low, where=water_low > terrain, color=C_LOW, alpha=0.35)
    ax.fill_between(x, terrain, water_high, where=water_high > terrain, color=C_HIGH, alpha=0.25)
    ax.hlines(water_low, 0.05, 0.55, colors=C_LOW, linestyles="-", lw=3.0)
    ax.hlines(water_low, 0.55, 0.95, colors=C_LOW, linestyles=(0, (1, 1.4)), lw=1.6, alpha=0.55)
    ax.hlines(water_high, 0.05, 0.95, colors=C_HIGH, linestyles="-", lw=3.0)
    ax.vlines(0.55, floor, terrain[np.argmin(np.abs(x - 0.55))], color="#111827", linestyles="--", lw=1.5)

    label_box = {"facecolor": "white", "edgecolor": "none", "alpha": 0.92, "pad": 2.5}
    ax.text(
        0.55,
        0.755,
        "60.1 m saddle",
        ha="center",
        va="bottom",
        fontsize=13,
        fontweight="bold",
        bbox=label_box,
    )
    ax.text(0.06, water_low, "Low regime", color=C_LOW, fontsize=10.5, fontweight="bold",
            ha="left", va="bottom")
    ax.text(0.06, water_high, "High regime", color=C_HIGH, fontsize=10.5, fontweight="bold",
            ha="left", va="bottom")


def main():
    data = pd.read_csv(DATA_CSV, index_col=0)
    labels = classify_regimes(data)
    manning = pd.read_csv(MANNING_CSV)

    fig = plt.figure(figsize=(13.28, 5.31), dpi=100, facecolor="white")
    gs = fig.add_gridspec(
        1,
        3,
        width_ratios=[0.78, 1.30, 1.22],
        left=0.035,
        right=0.985,
        bottom=0.30,
        top=0.79,
        wspace=0.30,
    )

    ax0 = fig.add_subplot(gs[0, 0])
    ax1 = fig.add_subplot(gs[0, 1])
    ax2 = fig.add_subplot(gs[0, 2])

    draw_input_panel(ax0, manning)
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
