"""Regenerate fig05_valencia_return_levels.pdf (Figure 4 of the article).

T = 100-year return levels at station 8337X (Turis), extracted from a live,
end-to-end re-execution of the two archived notebooks of the Valencia DANA
example:

    pyhydra/notebooks/pilot_cases/valencia_dana/01_data_exploration.ipynb
    pyhydra/notebooks/pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb

(data via `pyhydra-get-data valencia_dana`). Only single-station and
pooled-regional (RFA) fits are shown, because those are the only ones the two
archived notebooks compute. This script only re-plots values already
extracted, it does not re-run pyhydra. Without/with are independent point
estimates, not an interval; the label gives their ratio.
"""
import matplotlib.pyplot as plt

from figstyle import BLUE, VERMILION

methods = ["Bayesian", "L-moments", "MLE", "L-moments", "MLE"]
without_dana = [258.5, 218.0, 227.0, 252.1, 271.3]
with_dana = [932.6, 755.6, 821.8, 1012.3, 1241.3]
x = [0, 1, 2, 3.6, 4.6]          # gap between single-station and pooled fits

fig, ax = plt.subplots(figsize=(5.4, 3.9))
ax.scatter(x, without_dana, s=55, marker="o", color=BLUE, zorder=3,
           label="Without DANA")
ax.scatter(x, with_dana, s=55, marker="s", color=VERMILION, zorder=3,
           label="With DANA")
for xi, lo, hi in zip(x, without_dana, with_dana):
    ax.annotate(f"$\\times${hi / lo:.1f}", (xi, hi), xytext=(0, 8),
                textcoords="offset points", ha="center", fontsize=10)
ax.axvline(2.8, color="0.6", linewidth=0.8, linestyle=(0, (4, 3)))
ax.text(1, 1385, "Single station", ha="center", va="bottom", fontsize=10.5)
ax.text(4.1, 1385, "Pooled regional", ha="center", va="bottom", fontsize=10.5)
ax.set_xticks(x)
ax.set_xticklabels(methods)
ax.set_xlim(-0.6, 5.2)
ax.set_ylim(0, 1380)
ax.set_ylabel("$T = 100$-year return level (mm)")
ax.grid(axis="x", visible=False)
ax.legend(loc="center right", bbox_to_anchor=(1.0, 0.47), handletextpad=0.3)
fig.savefig("fig05_valencia_return_levels.pdf")
print("saved fig05_valencia_return_levels.pdf")
