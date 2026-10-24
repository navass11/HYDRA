"""Regenerate fig03a_besaya_manning_input.pdf (Figure 5 of the article).

Input of the SFINCS--HEC-RAS demonstration case: the 1,000-combination
Manning-roughness matrix (nine land-use classes) that drove the production
simulations, as archived in the open Zenodo dataset
10.5281/zenodo.23104366 (``data/monte_carlo_combinations.csv``). Classes are
grouped by land-cover type (water / built-impervious / vegetated).

    ZENODO_DIR=<unzipped dataset> python make_fig03a_besaya_manning_input.py
"""
import os
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from matplotlib.patches import Patch

from figstyle import BLACK, GREEN, ORANGE, SKY

CSV = Path(os.environ.get("ZENODO_DIR", ".")) / "data" / "monte_carlo_combinations.csv"
df = pd.read_csv(CSV)
assert df.shape == (1000, 9), df.shape

GROUP = {
    "River": ("Water", SKY),
    "Infrastructure": ("Built / impervious", ORANGE), "Residential": ("Built / impervious", ORANGE),
    "Industrial": ("Built / impervious", ORANGE),
    "Trees": ("Vegetated", GREEN), "Dense vegetation": ("Vegetated", GREEN),
    "Urban vegetation": ("Vegetated", GREEN), "Sparse vegetation": ("Vegetated", GREEN),
    "Brushland": ("Vegetated", GREEN),
}
rank = {"Water": 0, "Built / impervious": 1, "Vegetated": 2}
medians = df.median()
order = sorted(df.columns, key=lambda c: (rank[GROUP[c][0]], medians[c]))

fig, ax = plt.subplots(figsize=(5.4, 3.9))
bp = ax.boxplot(
    [df[c].values for c in order], orientation="horizontal", patch_artist=True,
    tick_labels=order, widths=0.62,
    medianprops=dict(color=BLACK, linewidth=1.6),
    whiskerprops=dict(color="0.25", linewidth=0.9), capprops=dict(color="0.25", linewidth=0.9),
    flierprops=dict(marker="o", markersize=2.5, markerfacecolor="0.45",
                    markeredgecolor="none", alpha=0.6),
)
for patch, c in zip(bp["boxes"], order):
    patch.set_facecolor(GROUP[c][1]); patch.set_edgecolor("0.2"); patch.set_linewidth(0.8)
ax.set_xlabel("Manning's roughness $n$ (s m$^{-1/3}$)")
ax.grid(axis="y", visible=False)
ax.legend(handles=[Patch(facecolor=col, edgecolor="0.2", label=lab)
                   for lab, col in [("Water", SKY), ("Built / impervious", ORANGE), ("Vegetated", GREEN)]],
          loc="lower right")
fig.savefig("fig03a_besaya_manning_input.pdf")
print("saved fig03a_besaya_manning_input.pdf")
