"""Regenerate fig03b_besaya_flooded_area.pdf.

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

import matplotlib
matplotlib.rcParams["pdf.fonttype"] = 42
matplotlib.rcParams["ps.fonttype"] = 42
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

CSV = Path(os.environ.get("ZENODO_DIR", ".")) / "data" / "comparison_clean_995.csv"
areas = pd.read_csv(CSV)["sfincs_area_km2"].to_numpy()
assert areas.size == 995, areas.size

fig, ax = plt.subplots(figsize=(6.6, 4.4))
ax.hist(areas, bins=30, color="#2a78d6", edgecolor="#0b0b0b", alpha=0.8, linewidth=0.5)
ax.axvline(np.median(areas), color="#0b0b0b", linewidth=1.6, linestyle="--",
           label=f"median = {np.median(areas):.3f} km$^2$")
ax.set_xlabel("Flooded area (km$^2$)", fontsize=11)
ax.set_ylabel("Simulations", fontsize=11)
ax.tick_params(labelsize=10)
ax.legend(frameon=False, loc="upper right", fontsize=10)
ax.grid(axis="y", linestyle=":", alpha=0.4)
fig.tight_layout()
fig.savefig("fig03b_besaya_flooded_area.pdf")
print("saved fig03b_besaya_flooded_area.pdf")
