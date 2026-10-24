"""Regenerate fig03b_besaya_flooded_area.pdf (Figure 6 of the article).

Output of the SFINCS--HEC-RAS demonstration case, single engine: the
distribution of flooded area (km^2) across the SFINCS runs, from the open
Zenodo dataset 10.5281/zenodo.23104366 (``data/comparison_clean_995.csv``,
column ``sfincs_area_km2``; 995 valid runs after removing five numerically
non-converged simulations). The flooded area is the per-run quantity that
pyhydra's ``load_flood_ensemble`` and ``flooded_area`` compute from the
raster outputs.

    ZENODO_DIR=<unzipped dataset> python make_fig03b_besaya_flooded_area.py
"""
import os
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from figstyle import BLACK, BLUE

CSV = Path(os.environ.get("ZENODO_DIR", ".")) / "data" / "comparison_clean_995.csv"
areas = pd.read_csv(CSV)["sfincs_area_km2"].to_numpy()
assert areas.size == 995, areas.size

fig, ax = plt.subplots(figsize=(5.4, 3.6))
ax.hist(areas, bins=30, color=BLUE, edgecolor="white", linewidth=0.5)
ax.axvline(np.median(areas), color=BLACK, linewidth=1.5, linestyle="--",
           label=f"Median = {np.median(areas):.3f} km$^2$")
ax.set_xlabel("Flooded area (km$^2$)")
ax.set_ylabel(f"Number of simulations ($N$ = {areas.size})")
ax.grid(axis="x", visible=False)
ax.legend(loc="upper right")
fig.savefig("fig03b_besaya_flooded_area.pdf")
print("saved fig03b_besaya_flooded_area.pdf")
