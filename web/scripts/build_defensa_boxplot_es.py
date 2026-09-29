from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "notebooks/modeling/hydraulic/manning_sensitivity/data/combinaciones_rugosidad.csv"
OUT = ROOT / "web/public/defensa/figures/besaya_fig02_mc_boxplots_es.png"

columns = [
    "Trees", "Dense vegetation", "Urban vegetation", "Infrastructure",
    "Sparse vegetation", "Residential", "Industrial", "River", "Brushland",
]
labels = [
    "Arbolado", "Vegetación\ndensa", "Vegetación\nurbana", "Infraestructura",
    "Vegetación\ndispersa", "Residencial", "Industrial", "Río", "Matorral",
]

data = pd.read_csv(DATA)
fig, ax = plt.subplots(figsize=(13.2, 6.6), facecolor="#07111f")
ax.set_facecolor("#0b1728")
box = ax.boxplot(
    [data[col].dropna().values for col in columns],
    patch_artist=True,
    widths=0.58,
    medianprops={"color": "#fb7185", "linewidth": 2.8},
    boxprops={"color": "#93c5fd", "linewidth": 1.4},
    whiskerprops={"color": "#cbd5e1", "linewidth": 1.3},
    capprops={"color": "#cbd5e1", "linewidth": 1.3},
    flierprops={"marker": "o", "markersize": 3, "markerfacecolor": "#94a3b8", "markeredgecolor": "none", "alpha": .65},
)
for patch in box["boxes"]:
    patch.set_facecolor("#3b82f6")
    patch.set_alpha(.58)

ax.set_title("Ensemble Monte Carlo: 1.000 combinaciones de rugosidad de Manning",
             color="#f8fafc", fontsize=22, fontweight="bold", pad=20)
ax.text(.5, 1.01, "Nueve clases de uso del suelo · la incertidumbre se propaga al modelo hidráulico",
        transform=ax.transAxes, ha="center", va="bottom", color="#94a3b8", fontsize=14)
ax.set_ylabel(r"Coeficiente de Manning, $n$ (m$^{-1/3}$ s)", color="#e2e8f0", fontsize=16, labelpad=12)
ax.set_xlabel("Clase de uso del suelo", color="#e2e8f0", fontsize=16, labelpad=14)
ax.set_xticks(range(1, len(labels) + 1), labels, fontsize=12, color="#cbd5e1")
ax.tick_params(axis="y", labelsize=12, colors="#cbd5e1")
ax.grid(axis="y", color="#334155", alpha=.45, linewidth=.8)
for spine in ax.spines.values():
    spine.set_color("#334155")
fig.tight_layout(pad=1.8)
fig.savefig(OUT, dpi=180, facecolor=fig.get_facecolor(), bbox_inches="tight")
print(OUT)
