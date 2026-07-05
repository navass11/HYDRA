"""
Regenerate fig05_hydraulic_bifurcation with two visual fixes:
  1. Panel (c): tighter x-axis — no excessive whitespace to the west
  2. All map panels: UTM northing shown as full integers (no 1e6 offset notation)
"""
import sys
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
matplotlib.rcParams["pdf.compression"] = 9
import matplotlib.pyplot as plt
import matplotlib.lines as mlines
import matplotlib.gridspec as gridspec
import matplotlib.ticker as mticker
from matplotlib.colors import LightSource
from scipy import stats, ndimage
from scipy.stats import gaussian_kde
from sklearn.mixture import GaussianMixture
import rioxarray as rxr
import xarray as xr

HERE       = Path(__file__).resolve().parent
ZENODO_DIR = HERE / "zenodo_upload"
HECRAS_DIR = ZENODO_DIR / "simulations" / "HEC-RAS"
DEM_PATH   = ZENODO_DIR / "models" / "HEC-RAS" / "Terrain" / "Terrain (1).dep.tif"
RES_CSV    = ZENODO_DIR / "data" / "comparison_clean_995.csv"
FIG_DIR    = HERE / "figures"

CRS = "EPSG:25830"
THR = 0.05

C_LOW  = "#4878d0"
C_HIGH = "#c44e52"
C_SF   = "#6acc65"

# ── Data ─────────────────────────────────────────────────────────────────────
comp = pd.read_csv(RES_CSV, index_col=0)
gmm  = GaussianMixture(n_components=2, random_state=42, n_init=10)
lab  = gmm.fit_predict(comp["hecras_area_km2"].values.reshape(-1, 1))
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    lab = 1 - lab
r0 = comp[lab == 0]; r1 = comp[lab == 1]
r0_idx = r0.index.tolist(); r1_idx = r1.index.tolist()
print(f"Regimes — low: {len(r0_idx)}, high: {len(r1_idx)}")

# ── Raster setup ─────────────────────────────────────────────────────────────
ref      = rxr.open_rasterio(HECRAS_DIR / f"hamax_sim_{r0_idx[0]}.tif",
                              masked=True).squeeze("band", drop=True).rio.write_crs(CRS)
dem      = rxr.open_rasterio(str(DEM_PATH), masked=True).squeeze().rio.write_crs(CRS)
dem_repr = dem.rio.reproject_match(ref)
dem_np   = np.where(dem_repr.values < -1000, np.nan, dem_repr.values)

def build_freq(sims, n=60, seed=0):
    rng    = np.random.default_rng(seed)
    sample = rng.choice(sims, min(n, len(sims)), replace=False)
    acc    = xr.zeros_like(ref, dtype=float)
    for s in sorted(sample):
        f = HECRAS_DIR / f"hamax_sim_{s}.tif"
        if f.exists():
            da = rxr.open_rasterio(f, masked=True).squeeze("band", drop=True).rio.write_crs(CRS)
            acc += (da >= THR).fillna(0).astype(float)
    return acc / min(n, len(sims))

print("Building frequency maps…")
freq0 = build_freq(r0_idx, n=len(r0_idx))
freq1 = build_freq(r1_idx, n=80)
thresh_zone = (freq1 > 0.6) & (freq0 < 0.2)
freq_diff   = freq1 - freq0

# ── Saddle ───────────────────────────────────────────────────────────────────
always_bajo = xr.ones_like(ref, dtype=float)
for s in r0_idx:
    f = HECRAS_DIR / f"hamax_sim_{s}.tif"
    if f.exists():
        da = rxr.open_rasterio(f, masked=True).squeeze("band", drop=True).rio.write_crs(CRS)
        always_bajo *= (da >= THR).fillna(0).astype(float)
always_np = always_bajo.values > 0
thresh_np = thresh_zone.values.astype(bool)
dil_t = ndimage.binary_dilation(thresh_np, iterations=5)
dil_a = ndimage.binary_dilation(always_np, iterations=5)
corridor  = dil_t & dil_a & (~always_np) & (~thresh_np)
c_rows, c_cols = np.where(corridor)
min_idx   = np.nanargmin(dem_np[corridor])
SADDLE_X  = float(dem_repr.x.values[c_cols[min_idx]])
SADDLE_Y  = float(dem_repr.y.values[c_rows[min_idx]])
SADDLE_Z  = float(dem_np[c_rows[min_idx], c_cols[min_idx]])
print(f"Saddle: X={SADDLE_X:.0f}  Y={SADDLE_Y:.0f}  z={SADDLE_Z:.2f} m")

# ── Extent ───────────────────────────────────────────────────────────────────
ys, xs = np.where((freq1 > 0.05).values & (dem_np < 85))
xlim  = [dem_repr.x.values[xs].min() - 200, dem_repr.x.values[xs].max() + 200]
ylim  = [dem_repr.y.values[ys].min() - 200, dem_repr.y.values[ys].max() + 200]
# Wider x extent for panel (c): covers saddle + secondary zone and fills the panel
xlim_c = [SADDLE_X - 1600, xlim[1] + 500]
y2d, x2d = np.meshgrid(freq0.y.values, freq0.x.values, indexing="ij")

# ── Figure helpers ────────────────────────────────────────────────────────────
dem_np_safe = np.where(np.isnan(dem_np), np.nanmean(dem_np[~np.isnan(dem_np)]), dem_np)
ls_obj  = LightSource(azdeg=315, altdeg=45)
hs_arr  = ls_obj.hillshade(dem_np_safe, vert_exag=2, dx=5, dy=5)
hs_da   = dem_repr.copy(data=hs_arr)


def add_background(ax):
    hs_da.plot(ax=ax, cmap="Greys_r", vmin=0, vmax=1,
               add_colorbar=False, alpha=0.30, zorder=0,
               rasterized=True)


def add_zone_contour(ax, lw=1.0):
    sr = int(np.argmin(np.abs(dem_repr.y.values - SADDLE_Y)))
    sc = int(np.argmin(np.abs(dem_repr.x.values - SADDLE_X)))
    rows, cols = np.ogrid[0:thresh_zone.shape[0], 0:thresh_zone.shape[1]]
    dist_cells = np.sqrt((rows - sr)**2 + (cols - sc)**2)
    local_zone = (thresh_zone.values > 0) & (dist_cells < 100)
    closed = ndimage.binary_closing(local_zone, iterations=5).astype(float)
    smooth = ndimage.gaussian_filter(closed, sigma=3)
    ax.contour(x2d, y2d, smooth, levels=[0.5],
               colors="black", linewidths=lw, linestyles="--", zorder=3)


def fix_northing(ax):
    """Show full UTM northing integers, no 1e6 offset notation."""
    ax.yaxis.set_major_formatter(
        mticker.FuncFormatter(lambda x, _: f"{int(x):,}".replace(",", " "))
    )
    ax.tick_params(axis="y", labelsize=5.5)


def map_panel(ax, freq, title, cmap, cbar_label, tight_x=False):
    add_background(ax)
    freq.where(freq > 0.05).plot(
        ax=ax, cmap=cmap, alpha=0.85, vmin=0, vmax=1, zorder=2,
        rasterized=True,
        cbar_kwargs={"label": cbar_label, "shrink": 0.72,
                     "pad": 0.02, "aspect": 20,
                     "ticks": [0, 0.25, 0.5, 0.75, 1]})
    add_zone_contour(ax)
    ax.plot(SADDLE_X, SADDLE_Y, marker="^", color="#ee1111", ms=8, zorder=9,
            markeredgecolor="white", markeredgewidth=0.8)
    ax.set_aspect("equal", adjustable="box")
    ax.set_xlim(xlim_c if tight_x else xlim)
    ax.set_ylim(ylim)
    ax.set_title(title, pad=3, fontsize=8, fontweight="bold")
    ax.set_xlabel("Easting (m)", labelpad=2, fontsize=7)
    ax.set_ylabel("Northing (m)", labelpad=2, fontsize=7)
    ax.tick_params(axis="x", labelsize=6)
    fix_northing(ax)
    pass  # legend added once at figure level


# ── Standalone figures used in the manuscript ────────────────────────────────
def save_figure(fig, name, dpi=200):
    for ext in ["pdf", "png"]:
        fig.savefig(FIG_DIR / f"{name}.{ext}", bbox_inches="tight", dpi=dpi)
        print(f"Saved {name}.{ext}")
    plt.close(fig)


# Figure 6: low/high regime frequency maps as a genuine standalone figure.
fig_maps, (ax_m0, ax_m1) = plt.subplots(1, 2, figsize=(7.2, 3.35))
map_panel(
    ax_m0, freq0,
    f"(a) Low regime  $N$={len(r0_idx)},  "
    f"$\\bar{{A}}$={r0['hecras_area_km2'].mean():.3f} km²",
    "Blues", "Inundation frequency",
)
map_panel(
    ax_m1, freq1,
    f"(b) High regime  $N$={len(r1_idx)},  "
    f"$\\bar{{A}}$={r1['hecras_area_km2'].mean():.3f} km²",
    "Reds", "Inundation frequency",
)
ax_m1.set_ylabel("")
_saddle_h = mlines.Line2D([], [], marker="^", color="#ee1111", ms=7,
                          ls="none", markeredgecolor="white",
                          markeredgewidth=0.7, label="Saddle z=60.1 m a.s.l.")
_zone_h   = mlines.Line2D([], [], color="black", ls="--", lw=1.2,
                          label="Secondary zone (~7.4 ha)")
fig_maps.legend(
    handles=[_saddle_h, _zone_h],
    loc="lower center", ncol=2, fontsize=7.2, framealpha=0.0,
    bbox_to_anchor=(0.5, 0.01), handlelength=1.8,
)
fig_maps.tight_layout(pad=1.0, w_pad=1.0, rect=[0, 0.09, 1, 1])
save_figure(fig_maps, "fig05a_bifurcation_maps")


# Figure 7: frequency-difference map as a separate generated figure.
diff_mask = (np.abs(freq_diff.values) > 0.03) & (dem_np < 85)
d_rows, d_cols = np.where(diff_mask)
if len(d_rows):
    xlim_diff = [
        min(float(dem_repr.x.values[d_cols].min()), SADDLE_X) - 350,
        max(float(dem_repr.x.values[d_cols].max()), SADDLE_X) + 350,
    ]
    ylim_diff = [
        min(float(dem_repr.y.values[d_rows].min()), SADDLE_Y) - 350,
        max(float(dem_repr.y.values[d_rows].max()), SADDLE_Y) + 350,
    ]
else:
    xlim_diff = xlim_c
    ylim_diff = ylim

fig_diff, ax_diff = plt.subplots(figsize=(7.2, 4.0))
add_background(ax_diff)
vmax_ = float(abs(freq_diff).quantile(0.995))
freq_diff.where(abs(freq_diff) > 0.03).plot(
    ax=ax_diff, cmap="RdBu_r", vmin=-vmax_, vmax=vmax_, alpha=0.82, zorder=2,
    rasterized=True,
    cbar_kwargs={"label": "Δ inundation frequency (High − Low)",
                 "shrink": 0.72, "pad": 0.02,
                 "ticks": [-0.5, 0, 0.5]},
)
add_zone_contour(ax_diff, lw=1.0)
ax_diff.plot(SADDLE_X, SADDLE_Y, marker="^", color="#ee1111", ms=8, zorder=9,
             markeredgecolor="white", markeredgewidth=0.8)
ax_diff.set_aspect("equal", adjustable="box")
ax_diff.set_xlim(xlim_diff)
ax_diff.set_ylim(ylim_diff)
ax_diff.set_title(
    "Frequency difference — red: cells exclusive to high regime",
    pad=3, fontsize=8.5, fontweight="bold",
)
ax_diff.set_xlabel("Easting (m)", labelpad=2, fontsize=7.5)
ax_diff.set_ylabel("Northing (m)", labelpad=2, fontsize=7.5)
ax_diff.tick_params(axis="x", labelsize=6.5)
fix_northing(ax_diff)
fig_diff.tight_layout(pad=1.0)
save_figure(fig_diff, "fig05c_bifurcation_difference")


# ── Figure ────────────────────────────────────────────────────────────────────
# 4 rows: [maps a/b] [legend strip] [map c centered] [stats d/e]
fig = plt.figure(figsize=(7.2, 8.3))
gs  = gridspec.GridSpec(4, 2, figure=fig, hspace=0.55, wspace=0.42,
                        height_ratios=[5.5, 0.18, 5.0, 1.8])

# ── Row 0: panels (a) and (b) ─────────────────────────────────────────────────
ax0 = fig.add_subplot(gs[0, 0])
map_panel(ax0, freq0,
    f"(a) Low regime  $N$={len(r0_idx)},  "
    f"$\\bar{{A}}$={r0['hecras_area_km2'].mean():.3f} km²",
    "Blues", "Inundation frequency")

ax1 = fig.add_subplot(gs[0, 1])
map_panel(ax1, freq1,
    f"(b) High regime  $N$={len(r1_idx)},  "
    f"$\\bar{{A}}$={r1['hecras_area_km2'].mean():.3f} km²",
    "Reds", "Inundation frequency")
ax1.set_ylabel("")

# ── Row 1: dedicated legend strip ─────────────────────────────────────────────
ax_leg = fig.add_subplot(gs[1, :])
ax_leg.axis("off")
_saddle_h = mlines.Line2D([], [], marker="^", color="#ee1111", ms=7,
                          ls="none", markeredgecolor="white",
                          markeredgewidth=0.7, label="Saddle z=60.1 m a.s.l.")
_zone_h   = mlines.Line2D([], [], color="black", ls="--", lw=1.2,
                          label="Secondary zone (~7.4 ha)")
ax_leg.legend(handles=[_saddle_h, _zone_h], fontsize=7, ncol=2,
              handlelength=1.8, borderpad=0.5, framealpha=0.0,
              edgecolor="none", loc="center")

# ── Row 2: panel (c) centred ──────────────────────────────────────────────────
_cgs = gridspec.GridSpecFromSubplotSpec(1, 3, subplot_spec=gs[2, :],
                                        width_ratios=[1, 3, 1], wspace=0.0)
ax2 = fig.add_subplot(_cgs[0, 1])
add_background(ax2)
vmax_ = float(abs(freq_diff).quantile(0.995))
freq_diff.where(abs(freq_diff) > 0.03).plot(
    ax=ax2, cmap="RdBu_r", vmin=-vmax_, vmax=vmax_, alpha=0.82, zorder=2,
    cbar_kwargs={"label": "Δ frequency", "shrink": 0.45, "pad": 0.02})
add_zone_contour(ax2, lw=0.9)
ax2.plot(SADDLE_X, SADDLE_Y, marker="^", color="#ee1111", ms=8, zorder=9,
         markeredgecolor="white", markeredgewidth=0.8)
ax2.set_aspect("equal", adjustable="box")
ax2.set_xlim(xlim_c)
ax2.set_ylim(ylim)
ax2.set_title("(c) Frequency difference (High − Low)", pad=3, fontsize=8, fontweight="bold")
ax2.set_xlabel("Easting (m)", labelpad=2, fontsize=7)
ax2.set_ylabel("Northing (m)", labelpad=2, fontsize=7)
ax2.tick_params(axis="x", labelsize=6)
fix_northing(ax2)
# Shift panel (c) up ~4 mm
pos = ax2.get_position()
ax2.set_position([pos.x0, pos.y0 + 0.025, pos.width, pos.height])

# ── Row 3: panels (d) and (e) ─────────────────────────────────────────────────
ax3 = fig.add_subplot(gs[3, 0])
ax3.hist(comp["sfincs_area_km2"], bins=30, color=C_SF, alpha=0.65, label="SFINCS")
ax3.hist(r0["hecras_area_km2"],  bins=15, color=C_LOW,  alpha=0.85,
         label=f"HEC-RAS low ($N$={len(r0_idx)})")
ax3.hist(r1["hecras_area_km2"],  bins=30, color=C_HIGH, alpha=0.55,
         label=f"HEC-RAS high ($N$={len(r1_idx)})")
ax3.set_xlabel("Flooded area (km²)", labelpad=2, fontsize=7)
ax3.set_ylabel("Count", labelpad=2, fontsize=7)
ax3.set_title("(d) Area distributions by model and regime", pad=3, fontsize=8, fontweight="bold")
# Legend outside axes (below x-axis) — avoids all bar overlap
ax3.legend(handlelength=1, fontsize=6.5, ncol=3,
           loc="upper center", bbox_to_anchor=(0.5, -0.45), framealpha=0.9)
ax3.tick_params(labelsize=6)

ax4 = fig.add_subplot(gs[3, 1])
ax4.scatter(comp.loc[r1_idx, "sfincs_area_km2"], r1["hecras_area_km2"],
            s=4, alpha=0.20, color=C_HIGH, linewidths=0,
            label=f"High ($N$={len(r1_idx)})")
ax4.scatter(comp.loc[r0_idx, "sfincs_area_km2"], r0["hecras_area_km2"],
            s=10, alpha=0.70, color=C_LOW, linewidths=0,
            label=f"Low ($N$={len(r0_idx)})")
rho_v, _ = stats.spearmanr(comp["sfincs_area_km2"], lab)
ax4.set_xlabel("SFINCS flooded area (km²)", labelpad=2, fontsize=7)
ax4.set_ylabel("HEC-RAS flooded area (km²)", labelpad=2, fontsize=7)
ax4.set_title("(e) SFINCS area as regime predictor", pad=3, fontsize=8, fontweight="bold")
ax4.annotate(fr"$\rho_s = {rho_v:.2f}$",
             xy=(0.05, 0.95), xycoords="axes fraction",
             fontsize=7.5, va="top", ha="left",
             bbox=dict(boxstyle="round,pad=0.2", fc="white", alpha=0.8, lw=0))
ax4.legend(handlelength=1, markerscale=2, fontsize=6.5, ncol=2,
           loc="upper center", bbox_to_anchor=(0.5, -0.45), framealpha=0.9)
ax4.tick_params(labelsize=6)

# suptitle omitted — description goes in the LaTeX caption
for ext in ["pdf", "png"]:
    fig.savefig(FIG_DIR / f"fig05_hydraulic_bifurcation.{ext}",
                bbox_inches="tight", dpi=300)
    print(f"Saved fig05_hydraulic_bifurcation.{ext}")
plt.close(fig)
