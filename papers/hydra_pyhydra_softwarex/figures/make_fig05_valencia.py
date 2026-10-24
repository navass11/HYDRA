"""Regenerate fig05_valencia_return_levels.pdf (Figure 4 of the article).

Station 8337X (Turis), Valencia DANA example. It repeats the single-station
analysis of notebook ``valencia_dana/02_extreme_value_analysis.ipynb`` with
pyhydra: GEV return-level curves fitted by maximum likelihood without
(2008-2023) and with the 29 October 2024 event, 95 % band from Fisher samples,
and the empirical (Gringorten) positions. One panel only: the journal asks for
one graph per file. The T = 100-year values printed are those of Table 4.

    HYDRA_DATA_DIR=<dir with pilot_cases/valencia_dana> python make_fig05_valencia.py
"""
import os
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy.stats import genextreme

from pyhydra.climate.time_series import fit_gev, fit_gev_fisher, return_level_gev

from figstyle import BLUE, VERMILION

STATION = "8337X"
DATA = Path(os.environ.get("HYDRA_DATA_DIR", "data")) / "pilot_cases" / "valencia_dana"
ams = pd.read_csv(DATA / "annual_maxima.csv", index_col=0)
ams.index = ams.index.astype(int)
series = ams[STATION].dropna()
without = series[series.index < 2024]
with_ = series
np.random.seed(0)


def curve(values, T):
    params = fit_gev(values, method="mle")
    samples = fit_gev_fisher(values, n_samples=2000)
    rl = return_level_gev  # noqa: F841 (kept for the printed check below)
    level = genextreme.ppf(1 - 1 / T, -params["xi"], loc=params["mu"], scale=params["sigma"])
    q = genextreme.ppf(1 - 1 / T, -samples["xi"].values[:, None],
                       loc=samples["mu"].values[:, None], scale=samples["sigma"].values[:, None])
    return params, level, np.nanquantile(q, 0.025, axis=0), np.nanquantile(q, 0.975, axis=0)


def empirical(values):
    v = np.sort(values)
    p = (np.arange(1, v.size + 1) - 0.44) / (v.size + 0.12)
    return 1 / (1 - p), v


T = np.geomspace(1.5, 1000, 250)
fig, ax = plt.subplots(figsize=(5.4, 3.7))

for values, color, label in [(without.values.astype(float), BLUE, "Without DANA (2008–2023)"),
                             (with_.values.astype(float), VERMILION, "With DANA (2008–2024)")]:
    params, level, lo, hi = curve(values, T)
    ax.plot(T, level, color=color, linewidth=1.8, label=label)
    ax.fill_between(T, lo, hi, color=color, alpha=0.15, linewidth=0)
    t100 = float(return_level_gev(params, 100))
    ax.scatter([100], [t100], s=36, color=color, zorder=5, edgecolor="white", linewidth=0.6)
    ax.annotate(f"{t100:.0f} mm", (100, t100), xytext=(8, -3 if color == BLUE else 3),
                textcoords="offset points", ha="left", va="top" if color == BLUE else "bottom",
                fontsize=10, color=color)
    print(f"{label}: n={values.size}, xi={params['xi']:.2f}, T100={t100:.1f} mm")
Te, ve = empirical(without.values.astype(float))
ax.scatter(Te, ve, s=16, color=BLUE, zorder=4, label="Observed annual maxima")
Te2, ve2 = empirical(with_.values.astype(float))
ax.scatter(Te2[-1:], ve2[-1:], s=44, marker="s", color=VERMILION, zorder=5,
           label="29 Oct 2024 (710.8 mm)")
ax.axvline(100, color="0.55", linewidth=0.8, linestyle=(0, (4, 3)))
ax.set_xscale("log")
ax.set_xlim(1.2, 1200)
ax.set_ylim(0, 1500)
ax.set_xlabel("Return period (years)")
ax.set_ylabel("Annual maximum daily rainfall (mm)")
ax.legend(loc="upper left")
fig.savefig("fig05_valencia_return_levels.pdf")
print("saved fig05_valencia_return_levels.pdf")
