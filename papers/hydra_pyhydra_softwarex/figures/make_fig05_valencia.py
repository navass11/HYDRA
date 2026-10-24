"""Regenerate fig05_valencia_return_levels.pdf (Figure 4 of the article).

Station 8337X (Turis), Valencia DANA example. It repeats the single-station
analysis of notebook ``valencia_dana/02_extreme_value_analysis.ipynb`` with
pyhydra (GEV fitted by maximum likelihood; 95 % band from Fisher samples):

  (a) annual maximum daily precipitation, 2008-2024;
  (b) GEV return-level curves fitted without (2008-2023) and with the 29
      October 2024 event, with the empirical (Gringorten) positions.

The T = 100-year values printed at the end are those of Table 4.

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
fig, (ax_a, ax_b) = plt.subplots(1, 2, figsize=(5.8, 3.3), gridspec_kw={"width_ratios": [1, 1.25]})

# (a) annual maxima
colors = [VERMILION if y == 2024 else BLUE for y in series.index]
ax_a.bar(series.index, series.values, color=colors, width=0.75)
ax_a.set_xlabel("Year")
ax_a.set_ylabel("Annual maximum daily rainfall (mm)")
ax_a.set_xticks([2008, 2012, 2016, 2020, 2024])
ax_a.grid(axis="x", visible=False)
ax_a.annotate("29 Oct 2024\n710.8 mm", (2024, series.loc[2024]), xytext=(-4, -4),
              textcoords="offset points", ha="right", va="top", fontsize=9.5)
ax_a.set_title("(a)", loc="left", fontsize=10.5)

# (b) return-level curves
for values, color, label in [(without.values.astype(float), BLUE, "Without DANA (2008–2023)"),
                             (with_.values.astype(float), VERMILION, "With DANA (2008–2024)")]:
    params, level, lo, hi = curve(values, T)
    ax_b.plot(T, level, color=color, linewidth=1.8, label=label)
    ax_b.fill_between(T, lo, hi, color=color, alpha=0.15, linewidth=0)
    print(f"{label}: n={values.size}, xi={params['xi']:.2f}, "
          f"T100={return_level_gev(params, 100):.1f} mm")
Te, ve = empirical(without.values.astype(float))
ax_b.scatter(Te, ve, s=14, color=BLUE, zorder=4)
Te2, ve2 = empirical(with_.values.astype(float))
ax_b.scatter(Te2[-1:], ve2[-1:], s=40, marker="s", color=VERMILION, zorder=5,
             label="2024 event")
ax_b.axvline(100, color="0.55", linewidth=0.8, linestyle=(0, (4, 3)))
ax_b.set_xscale("log")
ax_b.set_ylim(0, 1500)
ax_b.set_xlabel("Return period (years)")
ax_b.set_ylabel("Return level (mm)")
ax_b.legend(loc="upper left", fontsize=9.5)
ax_b.set_title("(b)", loc="left", fontsize=10.5)

fig.tight_layout(w_pad=1.2)
fig.savefig("fig05_valencia_return_levels.pdf")
print("saved fig05_valencia_return_levels.pdf")
