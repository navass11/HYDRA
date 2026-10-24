"""Common journal style for the data figures (Figures 4-6).

Serif text (STIX, close to the article's typeface), 10.5 pt at the printed
size (figures are drawn at the printed width, 5.4 in, and not rescaled),
colour-vision-deficiency-safe Okabe-Ito colours, open axes (no top/right
spines), inward ticks and a light grid.
"""
import matplotlib

matplotlib.rcParams.update({
    "pdf.fonttype": 42, "ps.fonttype": 42,
    "font.family": "serif", "font.serif": ["STIXGeneral"],
    "mathtext.fontset": "stix",
    "font.size": 10.5, "axes.labelsize": 10.5, "axes.titlesize": 10.5,
    "xtick.labelsize": 10, "ytick.labelsize": 10, "legend.fontsize": 10,
    "axes.linewidth": 0.8, "axes.spines.top": False, "axes.spines.right": False,
    "xtick.direction": "in", "ytick.direction": "in",
    "xtick.major.width": 0.8, "ytick.major.width": 0.8,
    "xtick.major.size": 3.5, "ytick.major.size": 3.5,
    "axes.grid": True, "grid.color": "0.85", "grid.linewidth": 0.6,
    "axes.axisbelow": True, "legend.frameon": False,
    "savefig.bbox": "tight", "savefig.pad_inches": 0.03,
})

# Okabe-Ito palette
BLUE, VERMILION, GREEN, ORANGE, SKY, PURPLE, BLACK = (
    "#0072B2", "#D55E00", "#009E73", "#E69F00", "#56B4E9", "#CC79A7", "#000000")
