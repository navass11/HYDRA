"""Regenerate fig03_besaya_ensemble.pdf.

(a) Input: the 1,000-combination Manning-roughness Monte Carlo ensemble
generated live by pyhydra's `generate_manning_combinations` (seed=42),
grouped by land-cover type (water/built-impervious/vegetated) using the
first three slots of the validated categorical palette from this
repository's `dataviz` skill (`references/palette.md`) -- CVD-safe for all
pairwise comparisons, not just adjacent ones. Deliberately distinct in
orientation and colour encoding from the similar Manning-ensemble figure in
the companion `papers/besaya_manning_sensitivity` manuscript, which plots
the same underlying ensemble as a single-colour vertical boxplot.

(b) Output: the flooded-area distribution across the matching 1,000-run
SFINCS ensemble, computed with pyhydra's `load_flood_ensemble` and
`flooded_area` from the archived simulation outputs. Single engine only --
the two-engine SFINCS/HEC-RAS comparison is out of scope for this paper.

Requires the `manning_rugosidades` pilot-case dataset:

    pyhydra-get-data manning_rugosidades --dest <dest>
    HYDRA_DATA_DIR=<dest> python make_fig03_besaya_ensemble.py

Loading and aggregating the 1,000 SFINCS rasters takes ~1-2 minutes.
"""

import os
from pathlib import Path

import matplotlib
matplotlib.rcParams["pdf.fonttype"] = 42
matplotlib.rcParams["ps.fonttype"] = 42
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch

from pyhydra.modeling.hydraulic.sensitivity import (
    flooded_area,
    generate_manning_combinations,
    load_flood_ensemble,
)

DATA_DIR = Path(os.environ.get("HYDRA_DATA_DIR", "./data")) / "pilot_cases" / "manning_rugosidades"
MANNING_DIST_CSV = DATA_DIR / "data" / "manning_roughness_coefficients_dist.csv"
SFINCS_DIR = DATA_DIR / "sfincs_results"

combinaciones_df = generate_manning_combinations(
    manning_dist_csv=str(MANNING_DIST_CSV),
    n_samples=1000,
    mc_size=10_000,
    seed=42,
)

flood = load_flood_ensemble(results_dir=str(SFINCS_DIR), pattern="hamax_sim_*.tif", threshold=0.05)
areas_km2 = flooded_area(flood, cell_area_m2=25.0, threshold=0.05) * 1e-6

# Group classes by land-cover type (validated 3-slot categorical palette,
# all-pairs CVD-safe): water / built-impervious / vegetated.
GROUP_COLOR = {
    "River": "#2a78d6",
    "Infrastructure": "#eb6834", "Residential": "#eb6834", "Industrial": "#eb6834",
    "Trees": "#1baf7a", "Dense vegetation": "#1baf7a", "Urban vegetation": "#1baf7a",
    "Sparse vegetation": "#1baf7a", "Brushland": "#1baf7a",
}

# Order classes by group, then by median, for a readable horizontal layout.
medians = combinaciones_df.median()
order = sorted(combinaciones_df.columns, key=lambda c: (GROUP_COLOR[c], medians[c]))

fig, axes = plt.subplots(1, 2, figsize=(13, 4.8))

ax = axes[0]
data = [combinaciones_df[c].values for c in order]
colors = [GROUP_COLOR[c] for c in order]
bp = ax.boxplot(
    data, vert=False, patch_artist=True, labels=order,
    medianprops=dict(color="#0b0b0b", linewidth=1.6),
    flierprops=dict(marker="o", markersize=3, markerfacecolor="0.5", markeredgecolor="none", alpha=0.6),
    widths=0.6,
)
for patch, color in zip(bp["boxes"], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.75)
    patch.set_edgecolor("#0b0b0b")
    patch.set_linewidth(0.8)
for whisker, cap in zip(bp["whiskers"], bp["caps"]):
    whisker.set_color("#52514e")
    cap.set_color("#52514e")

legend_handles = [
    Patch(facecolor=hexc, edgecolor="#0b0b0b", alpha=0.75, label=lbl)
    for hexc, lbl in [("#2a78d6", "Water"), ("#eb6834", "Built / impervious"), ("#1baf7a", "Vegetated")]
]
ax.legend(handles=legend_handles, loc="lower right", frameon=False, fontsize=9)
ax.set_xlabel("Manning's n")
ax.set_title("(a) Input: Monte Carlo Manning ensemble\nby land-cover group (n=1,000)")
ax.grid(axis="x", linestyle=":", alpha=0.4)

ax2 = axes[1]
ax2.hist(areas_km2, bins=30, color="#2a78d6", edgecolor="#0b0b0b", alpha=0.8, linewidth=0.5)
ax2.axvline(np.median(areas_km2), color="#0b0b0b", linewidth=1.6, linestyle="--",
            label=f"median = {np.median(areas_km2):.3f} km$^2$")
ax2.set_xlabel("Flooded area (km$^2$)")
ax2.set_ylabel("Simulations")
ax2.set_title("(b) Output: SFINCS flooded-area distribution\nacross the 1,000-run ensemble")
ax2.legend(frameon=False, loc="upper right", fontsize=9)
ax2.grid(axis="y", linestyle=":", alpha=0.4)

fig.tight_layout()
fig.savefig("fig03_besaya_ensemble.pdf")
print("saved fig03_besaya_ensemble.pdf")
