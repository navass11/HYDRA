"""Regenerate fig05_valencia_return_levels.png.

T=100yr return levels at station 8337X (Turis), extracted from a live,
end-to-end re-execution of the two archived notebooks referenced in the
paper's Valencia DANA example:

    pyhydra/notebooks/pilot_cases/valencia_dana/01_data_exploration.ipynb
    pyhydra/notebooks/pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb

(data via `pyhydra-get-data valencia_dana`). Only single-station (Point) and
pooled-regional (RFA) scales are shown, because those are the only ones the
two archived notebooks compute; there is no global/local RFA split here
(that would require a notebook not yet part of a tagged pyhydra release --
see the Valencia paragraph in main.tex and the README in this directory).

Re-run the two notebooks and update `without_dana`/`with_dana` below if the
underlying data or fitting code changes; this script only re-plots values
already extracted, it does not re-run pyhydra itself.
"""

import matplotlib
matplotlib.rcParams["pdf.fonttype"] = 42
matplotlib.rcParams.update({"font.size": 9, "axes.labelsize": 9.5, "xtick.labelsize": 9, "ytick.labelsize": 9, "legend.fontsize": 9})
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

categories = [
    "Bayes",
    "L-Moments",
    "L-Moments -\nRegional (RFA)",
    "MLE",
    "MLE -\nRegional (RFA)",
]
without_dana = [258.5, 218.0, 252.1, 227.0, 271.3]
with_dana = [932.6, 755.6, 1012.3, 821.8, 1241.3]
colors = ["#4c72b0", "#dd8452", "#8fce8f", "#c4c4c4", "#8ecae6"]

fig, ax = plt.subplots(figsize=(5.4, 4.2))

for i, (cat, lo, hi, color) in enumerate(zip(categories, without_dana, with_dana, colors)):
    ax.plot([i, i], [lo, hi], color=color, linewidth=3, solid_capstyle="round", zorder=2)
    ax.scatter([i], [lo], s=70, facecolor=color, edgecolor="white", linewidth=1.0,
               marker="o", zorder=3)
    ax.scatter([i], [hi], s=70, facecolor=color, edgecolor="white", linewidth=1.0,
               marker="s", zorder=3)

ax.set_xticks(range(len(categories)))
ax.set_xticklabels(categories, rotation=30, ha="right", fontsize=9)
ax.set_ylabel("Return level (mm), T = 100 years", fontsize=9.5)
ax.grid(axis="y", linestyle="--", alpha=0.5)
ax.set_ylim(150, 1300)

legend_elems = [
    Line2D([0], [0], marker="o", color="w", markerfacecolor="0.4", markeredgecolor="0.4",
           markersize=8, label="Without DANA"),
    Line2D([0], [0], marker="s", color="w", markerfacecolor="0.4", markeredgecolor="0.4",
           markersize=8, label="With DANA"),
]
ax.legend(handles=legend_elems, loc="upper left", frameon=True)

fig.tight_layout()
fig.savefig("fig05_valencia_return_levels.pdf")
print("saved fig05_valencia_return_levels.pdf")
