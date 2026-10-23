"""Regenerate fig03a_besaya_manning_input.pdf.

Input of the SFINCS--HEC-RAS demonstration case: the 1,000-combination
Manning-roughness matrix (nine land-use classes) that drove the production
simulations, as archived in the open Zenodo dataset
10.5281/zenodo.23104366 (``data/monte_carlo_combinations.csv``). Classes
are grouped by land-cover type (water / built-impervious / vegetated) with
the first three slots of a colour-vision-deficiency-safe categorical palette.

    ZENODO_DIR=<unzipped dataset> python make_fig03a_besaya_manning_input.py
"""
import os
from pathlib import Path

import matplotlib
matplotlib.rcParams["pdf.fonttype"] = 42
matplotlib.rcParams["ps.fonttype"] = 42
matplotlib.rcParams.update({"font.size": 9, "axes.labelsize": 9.5, "xtick.labelsize": 9, "ytick.labelsize": 9, "legend.fontsize": 9})
import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.patches import Patch

CSV = Path(os.environ.get("ZENODO_DIR", ".")) / "data" / "monte_carlo_combinations.csv"
df = pd.read_csv(CSV)
assert df.shape == (1000, 9), df.shape

GROUP_COLOR = {
    "River": "#2a78d6",
    "Infrastructure": "#eb6834", "Residential": "#eb6834", "Industrial": "#eb6834",
    "Trees": "#1baf7a", "Dense vegetation": "#1baf7a", "Urban vegetation": "#1baf7a",
    "Sparse vegetation": "#1baf7a", "Brushland": "#1baf7a",
}
medians = df.median()
order = sorted(df.columns, key=lambda c: (GROUP_COLOR[c], medians[c]))

fig, ax = plt.subplots(figsize=(5.4, 3.7))
bp = ax.boxplot(
    [df[c].values for c in order], vert=False, patch_artist=True, tick_labels=order,
    medianprops=dict(color="#0b0b0b", linewidth=1.6),
    flierprops=dict(marker="o", markersize=3, markerfacecolor="0.5", markeredgecolor="none", alpha=0.6),
    widths=0.6,
)
for patch, c in zip(bp["boxes"], order):
    patch.set_facecolor(GROUP_COLOR[c]); patch.set_alpha(0.75)
    patch.set_edgecolor("#0b0b0b"); patch.set_linewidth(0.8)
for w, cap in zip(bp["whiskers"], bp["caps"]):
    w.set_color("#52514e"); cap.set_color("#52514e")
ax.legend(handles=[Patch(facecolor=h, edgecolor="#0b0b0b", alpha=0.75, label=l)
                   for h, l in [("#2a78d6", "Water"), ("#eb6834", "Built / impervious"), ("#1baf7a", "Vegetated")]],
          loc="lower right", frameon=False, fontsize=9)
ax.set_xlabel("Manning's n")
ax.tick_params(labelsize=9)
ax.grid(axis="x", linestyle=":", alpha=0.4)
fig.tight_layout()
fig.savefig("fig03a_besaya_manning_input.pdf")
print("saved fig03a_besaya_manning_input.pdf")
