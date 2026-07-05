"""
Regenerate fig00_location_map.pdf.

Fixes vs previous version:
- Figure wider (10×4.8") so Spain panel is readable
- Panel (a): zoomed to Iberian Peninsula + France coast; scale bar instead
  of axis tick labels to avoid overlap
- Panel (b): scale bar, no axis labels
- Panel (c): land use map with legend to the RIGHT of the map (not overlapping)
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker as mticker
from matplotlib.gridspec import GridSpec
from matplotlib.colors import ListedColormap, BoundaryNorm
import urllib.request

HERE = Path(__file__).resolve().parent
FIG_DIR = HERE / "figures"
LC_PATH = HERE / "zenodo_upload" / "models" / "HEC-RAS" / "LandCover.tif"

# ── Natural Earth ─────────────────────────────────────────────────────────────
import geopandas as gpd
_ne_zip = Path("/tmp/ne_countries.zip")
if not _ne_zip.exists():
    urllib.request.urlretrieve(
        "https://naciscdn.org/naturalearth/110m/cultural/ne_110m_admin_0_countries.zip",
        _ne_zip)
world = gpd.read_file(f"zip://{_ne_zip}")
world = world.rename(columns={"SOVEREIGNT": "name"})
spain    = world[world["name"] == "Spain"]
portugal = world[world["name"] == "Portugal"]
france   = world[world["name"] == "France"]

SITE_LON, SITE_LAT = -4.052, 43.238

# ── Land cover ────────────────────────────────────────────────────────────────
import rasterio
from rasterio.warp import transform_bounds

LC_CLASSES = {
    1:  ("Trees",             "#2d8653"),
    2:  ("Dense vegetation",  "#6abf69"),
    4:  ("Urban vegetation",  "#b8d96b"),
    5:  ("Infrastructure",    "#aaaaaa"),
    6:  ("Sparse vegetation", "#e6c86e"),
    7:  ("Residential",       "#d9534f"),
    8:  ("Industrial",        "#9467bd"),
    9:  ("River",             "#4292c6"),
    10: ("Brushland",         "#c9a035"),
}
LC_AREAS_HA = {1:25.2, 2:49.9, 4:123.4, 5:43.0, 6:473.0,
               7:199.8, 8:120.1, 9:25.5, 10:25.7}

with rasterio.open(LC_PATH) as src:
    lc_data = src.read(1).astype(float)
    lc_data[lc_data == 0] = np.nan
    lc_bounds = src.bounds

b4326 = transform_bounds("EPSG:25830", "EPSG:4326",
                         lc_bounds.left, lc_bounds.bottom,
                         lc_bounds.right, lc_bounds.top)

# ── Satellite tile ────────────────────────────────────────────────────────────
import contextily as cx
from rasterio.warp import transform_bounds as tb

b3857 = transform_bounds("EPSG:25830", "EPSG:3857",
                         lc_bounds.left, lc_bounds.bottom,
                         lc_bounds.right, lc_bounds.top)
mx = (b3857[2]-b3857[0]) * 0.18
my = (b3857[3]-b3857[1]) * 0.18
b3857_m = (b3857[0]-mx, b3857[1]-my, b3857[2]+mx, b3857[3]+my)
sat_img, sat_ext = cx.bounds2img(*b3857_m, ll=False,
                                  source=cx.providers.Esri.WorldImagery, zoom=15)

# ── Figure layout ─────────────────────────────────────────────────────────────
# 3 panels: Spain context | satellite | land use+legend
# Land use panel is wider to accommodate the legend on the right side
fig = plt.figure(figsize=(11, 4.5))
gs  = GridSpec(1, 3, figure=fig,
               width_ratios=[1.6, 1.6, 2.8],
               wspace=0.38, left=0.04, right=0.98,
               top=0.88, bottom=0.08)

# ─────────────────────────────────────────────────────────────────────────────
# Panel (a) — Iberian Peninsula context
# ─────────────────────────────────────────────────────────────────────────────
ax1 = fig.add_subplot(gs[0])

# Background countries
world.plot(ax=ax1, color="#f0f0f0", edgecolor="#cccccc", linewidth=0.3)
france.plot(ax=ax1,   color="#e8e8d8", edgecolor="#999999", linewidth=0.4)
portugal.plot(ax=ax1, color="#dce8f0", edgecolor="#888888", linewidth=0.4)
spain.plot(ax=ax1,    color="#c5ddf5", edgecolor="#555555", linewidth=0.6)

# Cantabria region
cant_lon = [-4.85, -3.05, -3.05, -4.85, -4.85]
cant_lat = [42.98, 42.98, 43.51, 43.51, 42.98]
ax1.fill(cant_lon, cant_lat, color="#3060c0", alpha=0.45, zorder=4)
ax1.plot(cant_lon, cant_lat, color="#3060c0", lw=1.0, zorder=5)

# Study site
ax1.plot(SITE_LON, SITE_LAT, marker="*", ms=12, color="#c44e52",
         zorder=8, markeredgecolor="white", markeredgewidth=0.8)
ax1.annotate("Corrales\nde Buelna",
             xy=(SITE_LON, SITE_LAT),
             xytext=(SITE_LON + 1.3, SITE_LAT - 0.9),
             fontsize=7, color="#c44e52", ha="left",
             arrowprops=dict(arrowstyle="-", color="#c44e52", lw=0.8))

# Bay of Biscay label
ax1.text(-3.5, 43.8, "Bay of\nBiscay", fontsize=6.5, color="#3070a0",
         ha="center", style="italic", zorder=6)

# Clean axes — no tick labels, just border
ax1.set_xlim(-9.5, 4.2)
ax1.set_ylim(35.5, 44.5)
ax1.set_xticks([])
ax1.set_yticks([])
ax1.set_title("(a) Study location", fontsize=9, fontweight="bold", pad=5)

# Manual scale bar: ~200 km at lat 40° → 200/111 ≈ 1.8° lon
sb_x0, sb_y0 = -9.0, 36.2
sb_len = 2.0  # degrees longitude ≈ ~155 km at lat 40
ax1.plot([sb_x0, sb_x0+sb_len], [sb_y0, sb_y0], "k-", lw=2, zorder=7)
ax1.text(sb_x0 + sb_len/2, sb_y0 + 0.25, "~200 km",
         ha="center", fontsize=6.5, zorder=7)

# Legend
ax1.legend(handles=[
    mpatches.Patch(color="#c5ddf5", edgecolor="#555", label="Spain"),
    mpatches.Patch(color="#3060c0", alpha=0.6, label="Cantabria"),
    plt.Line2D([],[],marker="*", color="#c44e52", ms=9, ls="none",
               markeredgecolor="white", markeredgewidth=0.5, label="Study site"),
], fontsize=7, loc="lower right", framealpha=0.9, handlelength=1,
   borderpad=0.5, labelspacing=0.3)

# ─────────────────────────────────────────────────────────────────────────────
# Panel (b) — Satellite orthoimage
# ─────────────────────────────────────────────────────────────────────────────
ax2 = fig.add_subplot(gs[1])
ax2.imshow(sat_img, extent=sat_ext, origin="upper", interpolation="bilinear")

# Domain boundary
rect = plt.Rectangle((b3857[0], b3857[1]),
                      b3857[2]-b3857[0], b3857[3]-b3857[1],
                      lw=1.8, edgecolor="yellow", facecolor="none", zorder=5)
ax2.add_patch(rect)

# No axis labels — use scale bar only
ax2.set_xticks([]); ax2.set_yticks([])
ax2.set_xlim(sat_ext[0], sat_ext[1])
ax2.set_ylim(sat_ext[2], sat_ext[3])
ax2.set_title("(b) Simulation domain", fontsize=9, fontweight="bold", pad=5)

# Scale bar: 500 m in EPSG:3857 at this latitude ≈ 500 m
scale_m = 500  # metres
x_sb  = sat_ext[0] + (sat_ext[1]-sat_ext[0]) * 0.05
y_sb  = sat_ext[2] + (sat_ext[3]-sat_ext[2]) * 0.06
ax2.plot([x_sb, x_sb+scale_m], [y_sb, y_sb], "w-", lw=3, zorder=6,
         solid_capstyle="butt")
ax2.text(x_sb + scale_m/2, y_sb + (sat_ext[3]-sat_ext[2])*0.03,
         "500 m", color="white", fontsize=7, ha="center", zorder=6,
         fontweight="bold")

ax2.legend(handles=[mpatches.Patch(edgecolor="yellow", facecolor="none",
                                    lw=1.5, label="Model domain")],
           fontsize=7.5, loc="upper right", framealpha=0.85, borderpad=0.4)

# ─────────────────────────────────────────────────────────────────────────────
# Panel (c) — Land use classification (map + external legend)
# ─────────────────────────────────────────────────────────────────────────────
# Use nested GridSpec to put map left + legend right within the third column
from matplotlib.gridspec import GridSpecFromSubplotSpec
gs_c = GridSpecFromSubplotSpec(1, 2,
                                subplot_spec=gs[2],
                                width_ratios=[2.0, 1.0],
                                wspace=0.05)
ax3  = fig.add_subplot(gs_c[0])
ax3l = fig.add_subplot(gs_c[1])   # legend-only axes

ext_25830 = (lc_bounds.left, lc_bounds.right,
             lc_bounds.bottom, lc_bounds.top)

class_codes  = sorted(LC_CLASSES.keys())
colors_list  = [LC_CLASSES[c][1] for c in class_codes]
cmap_lc      = ListedColormap(colors_list)
bounds_lc    = [c - 0.5 for c in class_codes] + [class_codes[-1] + 0.5]
norm_lc      = BoundaryNorm(bounds_lc, cmap_lc.N)

ax3.imshow(lc_data, extent=ext_25830, origin="upper",
           cmap=cmap_lc, norm=norm_lc, interpolation="nearest")
ax3.set_aspect("equal", adjustable="datalim")
ax3.set_xticks([]); ax3.set_yticks([])
ax3.set_title("(c) Land use classification", fontsize=9, fontweight="bold", pad=5)

# Scale bar in UTM metres
x0_lc = lc_bounds.left  + (lc_bounds.right - lc_bounds.left) * 0.05
y0_lc = lc_bounds.bottom + (lc_bounds.top - lc_bounds.bottom) * 0.05
ax3.plot([x0_lc, x0_lc+500], [y0_lc, y0_lc], "k-", lw=3, zorder=6,
         solid_capstyle="butt")
ax3.text(x0_lc + 250, y0_lc + (lc_bounds.top-lc_bounds.bottom)*0.02,
         "500 m", fontsize=7, ha="center", zorder=6)

# ── Legend axes (right side) ─────────────────────────────────────────────────
ax3l.axis("off")
patches = [mpatches.Patch(color=LC_CLASSES[c][1],
                           label=f"{LC_CLASSES[c][0]}  ({LC_AREAS_HA[c]:.0f} ha)")
           for c in class_codes]
ax3l.legend(handles=patches, fontsize=7.5, loc="center left",
            handlelength=1.2, handleheight=1.1,
            borderpad=0.6, labelspacing=0.35, frameon=True,
            framealpha=0.95, title="Land use class", title_fontsize=8)

# ── Suptitle ─────────────────────────────────────────────────────────────────
fig.suptitle("Río Besaya at Corrales de Buelna, Cantabria (Spain) — study domain",
             fontsize=10, fontweight="bold", y=0.97)

for ext in ["pdf", "png"]:
    fig.savefig(FIG_DIR / f"fig00_location_map.{ext}",
                dpi=200, bbox_inches="tight")
    print(f"Saved fig00_location_map.{ext}")

plt.close(fig)
