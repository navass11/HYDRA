"""Regenerate fig03b_besaya_flooded_area.pdf (Figure 6 of the article).

Output of the SFINCS--HEC-RAS demonstration case, single engine: flooded area
of each of the 995 valid SFINCS runs (``data/comparison_clean_995.csv``, column
``sfincs_area_km2``; five numerically non-converged runs removed) against the
Manning roughness of the river class used in that run
(``data/monte_carlo_combinations.csv``), both from the open Zenodo dataset
10.5281/zenodo.23104366. The flooded area is the per-run quantity that
pyhydra's ``load_flood_ensemble`` and ``flooded_area`` compute from the raster
outputs. The standardised coefficients quoted in the caption come from an
ordinary least-squares regression of the standardised flooded area on the
nine standardised class roughness values.

    ZENODO_DIR=<unzipped dataset> python make_fig03b_besaya_flooded_area.py
"""
import os
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from figstyle import BLACK, BLUE

ROOT = Path(os.environ.get("ZENODO_DIR", ".")) / "data"
runs = pd.read_csv(ROOT / "comparison_clean_995.csv")
combos = pd.read_csv(ROOT / "monte_carlo_combinations.csv")
assert runs.shape[0] == 995 and combos.shape == (1000, 9)

X = combos.loc[runs["simulation"].to_numpy()]
area = runs["sfincs_area_km2"].to_numpy()

Xs = ((X - X.mean()) / X.std()).to_numpy()
ys = (area - area.mean()) / area.std()
A = np.c_[np.ones(len(Xs)), Xs]
beta = np.linalg.lstsq(A, ys, rcond=None)[0]
r2 = 1 - ((ys - A @ beta) ** 2).sum() / ((ys - ys.mean()) ** 2).sum()
b = dict(zip(X.columns, beta[1:]))
others = max(abs(v) for k, v in b.items() if k != "River")
print(f"R2 = {r2:.2f}; beta_River = {b['River']:.2f}; max |beta| other = {others:.2f}")

river = X["River"].to_numpy()
slope, intercept = np.polyfit(river, area, 1)

fig, ax = plt.subplots(figsize=(5.4, 3.7))
ax.scatter(river, area, s=9, color=BLUE, alpha=0.55, edgecolor="none")
xs = np.linspace(river.min(), river.max(), 50)
ax.plot(xs, intercept + slope * xs, color=BLACK, linewidth=1.5)
ax.set_xlabel("Manning's $n$ of the river class (s m$^{-1/3}$)")
ax.set_ylabel("Flooded area (km$^2$)")
ax.text(0.04, 0.95, f"$N$ = {area.size}\nMedian = {np.median(area):.3f} km$^2$\n"
        f"$\\beta_{{\\mathrm{{river}}}}$ = {b['River']:.2f}",
        transform=ax.transAxes, ha="left", va="top", fontsize=10)
fig.savefig("fig03b_besaya_flooded_area.pdf")
print("saved fig03b_besaya_flooded_area.pdf")
