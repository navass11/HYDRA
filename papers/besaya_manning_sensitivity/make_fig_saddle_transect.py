"""
Figure for peer-review Comment 4 (revised):
Hydraulic evidence for threshold-controlled regime separation at the saddle.

Two panels:
  (a) Inundation extents: low-regime (sim 41) vs high-only additional area
      (sim 132) with Ω_secondary boundary and saddle marker.
  (b) WSE ensemble at the saddle pixel for all 995 simulations, split by
      GMM-identified regime. Shows that the two regimes have systematically
      different water-surface elevations at the critical saddle location.

Outputs: figures/fig_saddle_transect.{pdf,png}
"""

import sys
import math
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import matplotlib.patches as mpatches
import matplotlib.lines as mlines
import matplotlib.ticker as mticker
from matplotlib.colors import LightSource
from scipy import ndimage, stats
from sklearn.mixture import GaussianMixture
import rioxarray as rxr
import xarray as xr
import rasterio

# ── Paths ─────────────────────────────────────────────────────────────────────
HERE       = Path(__file__).resolve().parent
ZENODO_DIR = HERE / "zenodo_upload"
HECRAS_DIR = ZENODO_DIR / "simulations" / "HEC-RAS"
DEM_ASC    = ZENODO_DIR / "models" / "HEC-RAS" / "Terrain" / "Terrain (1).dep.tif"
RES_CSV    = ZENODO_DIR / "data" / "comparison_clean_995.csv"
FIG_DIR    = HERE / "figures"
CRS  = "EPSG:25830"
THR  = 0.05

C_LOW  = "#1f77b4"
C_HIGH = "#d62728"

# ── Regime classification ─────────────────────────────────────────────────────
comp = pd.read_csv(RES_CSV, index_col=0)
gmm  = GaussianMixture(n_components=2, random_state=42, n_init=10)
lab  = gmm.fit_predict(comp["hecras_area_km2"].values.reshape(-1, 1))
if gmm.means_.flatten()[0] > gmm.means_.flatten()[1]:
    lab = 1 - lab
r0 = comp[lab == 0]; r1 = comp[lab == 1]
r0_idx = r0.index.tolist(); r1_idx = r1.index.tolist()
print(f"Regimes — low: {len(r0_idx)}, high: {len(r1_idx)}")

rep_low  = int(r0["hecras_area_km2"].sub(r0["hecras_area_km2"].mean()).abs().idxmin())
rep_high = int(r1["hecras_area_km2"].sub(r1["hecras_area_km2"].mean()).abs().idxmin())
print(f"Representative: low={rep_low} ({r0.loc[rep_low,'hecras_area_km2']:.4f} km²), "
      f"high={rep_high} ({r1.loc[rep_high,'hecras_area_km2']:.4f} km²)")

# ── Raster setup ─────────────────────────────────────────────────────────────
ref      = rxr.open_rasterio(HECRAS_DIR / f"hamax_sim_{r0_idx[0]}.tif",
                              masked=True).squeeze("band", drop=True).rio.write_crs(CRS)
dem      = rxr.open_rasterio(str(DEM_ASC), masked=True).squeeze().rio.write_crs(CRS)
dem_repr = dem.rio.reproject_match(ref)
dem_np   = np.where(dem_repr.values < -1000, np.nan, dem_repr.values)
x_vals   = dem_repr.x.values
y_vals   = dem_repr.y.values

# ── Load representative hamax ─────────────────────────────────────────────────
def load_depth(sim_id):
    with rasterio.open(HECRAS_DIR / f"hamax_sim_{sim_id}.tif") as src:
        depth = src.read(1).astype(float); nd = src.nodata
    return np.where(depth == nd, np.nan, depth)

depth_low  = load_depth(rep_low)
depth_high = load_depth(rep_high)

# ── Frequency maps → Ω_secondary ─────────────────────────────────────────────
def build_freq(sims, n=None, seed=0):
    rng    = np.random.default_rng(seed)
    sample = rng.choice(sims, min(n or len(sims), len(sims)), replace=False)
    acc    = xr.zeros_like(ref, dtype=float)
    for s in sorted(sample):
        f = HECRAS_DIR / f"hamax_sim_{s}.tif"
        if f.exists():
            da = rxr.open_rasterio(f, masked=True).squeeze("band", drop=True).rio.write_crs(CRS)
            acc += (da >= THR).fillna(0).astype(float)
    return acc / len(sample)

print("Building frequency maps...")
freq0     = build_freq(r0_idx)
freq1     = build_freq(r1_idx, n=80)
omega_sec = (freq1 > 0.6) & (freq0 < 0.2)

# ── Always-wet zone and saddle ────────────────────────────────────────────────
always_np = np.ones(dem_np.shape, dtype=bool)
for s in r0_idx:
    f = HECRAS_DIR / f"hamax_sim_{s}.tif"
    if f.exists():
        with rasterio.open(f) as src:
            d = src.read(1).astype(float); nd = src.nodata
        always_np &= (d >= THR) & (d != nd)

thresh_np  = omega_sec.values.astype(bool)
dil_t      = ndimage.binary_dilation(thresh_np, iterations=5)
dil_a      = ndimage.binary_dilation(always_np, iterations=5)
corridor   = dil_t & dil_a & (~always_np) & (~thresh_np)
c_rows, c_cols = np.where(corridor)
min_idx    = int(np.nanargmin(dem_np[corridor]))
saddle_row = c_rows[min_idx]; saddle_col = c_cols[min_idx]
SADDLE_X   = float(x_vals[saddle_col])
SADDLE_Y   = float(y_vals[saddle_row])
SADDLE_Z   = float(dem_np[saddle_row, saddle_col])
SADDLE_Z_DISPLAY = math.ceil(SADDLE_Z * 10) / 10  # ceil to nearest 0.1: 60.05 → 60.1
print(f"Saddle: X={SADDLE_X:.0f}  Y={SADDLE_Y:.0f}  z={SADDLE_Z:.2f} m  (display: {SADDLE_Z_DISPLAY:.1f} m)")

# ── Extract WSE at saddle pixel for ALL ensemble simulations ──────────────────
print("Extracting WSE at saddle pixel for all sims...")
all_sims = sorted(set(r0_idx + r1_idx))
wse_saddle = {}
for s in all_sims:
    f = HECRAS_DIR / f"hamax_sim_{s}.tif"
    if f.exists():
        with rasterio.open(f) as src:
            d = src.read(1)[saddle_row, saddle_col].astype(float)
            nd = src.nodata
        d = np.nan if (d == nd or d < THR) else d
        wse_saddle[s] = d + SADDLE_Z if not np.isnan(d) else np.nan

wse_low_arr  = np.array([wse_saddle.get(s, np.nan) for s in r0_idx])
wse_high_arr = np.array([wse_saddle.get(s, np.nan) for s in r1_idx])

# Representative WSE values (rep sims)
wse_rep_low  = wse_saddle.get(rep_low, np.nan)
wse_rep_high = wse_saddle.get(rep_high, np.nan)
print(f"Representative WSE at saddle: low={wse_rep_low:.2f} m, high={wse_rep_high:.2f} m")
print(f"Low  regime WSE at saddle: median={np.nanmedian(wse_low_arr):.2f}, "
      f"IQR=[{np.nanpercentile(wse_low_arr,25):.2f}, {np.nanpercentile(wse_low_arr,75):.2f}]")
print(f"High regime WSE at saddle: median={np.nanmedian(wse_high_arr):.2f}, "
      f"IQR=[{np.nanpercentile(wse_high_arr,25):.2f}, {np.nanpercentile(wse_high_arr,75):.2f}]")

# ── Map extent: fixed window centred on the saddle ────────────────────────────
# Use only nearby thresh_np cells (within 1500m of saddle) to avoid scattered
# outlier cells inflating the bounding box.
sec_r_all, sec_c_all = np.where(thresh_np)
if len(sec_r_all):
    dists_sec = np.sqrt((x_vals[sec_c_all] - SADDLE_X)**2 +
                        (y_vals[sec_r_all] - SADDLE_Y)**2)
    nearby    = dists_sec < 1500
    sec_r_use = sec_r_all[nearby]; sec_c_use = sec_c_all[nearby]
else:
    sec_r_use = np.array([]); sec_c_use = np.array([])

if len(sec_r_use):
    sec_cx = float(x_vals[sec_c_use].mean())
    sec_cy = float(y_vals[sec_r_use].mean())
else:
    sec_cx, sec_cy = SADDLE_X, SADDLE_Y - 500

# Build a window that contains both the saddle and the nearby secondary zone
cx = (SADDLE_X + sec_cx) / 2
cy = (SADDLE_Y + sec_cy) / 2
half_w = max(abs(SADDLE_X - sec_cx) / 2 + 700, 800)
half_h = max(abs(SADDLE_Y - sec_cy) / 2 + 800, 900)
xmin_m = cx - half_w
xmax_m = cx + half_w
ymin_m = cy - half_h
ymax_m = cy + half_h
print(f"Map window: dx={xmax_m-xmin_m:.0f} m, dy={ymax_m-ymin_m:.0f} m "
      f"| Saddle offset: ({SADDLE_X-cx:.0f}, {SADDLE_Y-cy:.0f}) m"
      f" | Sec offset: ({sec_cx-cx:.0f}, {sec_cy-cy:.0f}) m")

# ── Helper: numpy clip to map window ─────────────────────────────────────────
def np_clip_window(arr2d, xs, ys, xmin, xmax, ymin, ymax):
    """Return clipped 2-D array and the corresponding 1-D x/y coordinate arrays.
    ys is assumed DECREASING (standard raster: row 0 = north)."""
    ci = np.where((xs >= xmin) & (xs <= xmax))[0]
    ri = np.where((ys >= ymin) & (ys <= ymax))[0]
    if len(ci) == 0 or len(ri) == 0:
        return arr2d, xs, ys
    r0, r1 = ri[0], ri[-1] + 1
    c0, c1 = ci[0], ci[-1] + 1
    return arr2d[r0:r1, c0:c1], xs[c0:c1], ys[r0:r1]

dem_safe = np.where(np.isnan(dem_np),
                    float(np.nanmean(dem_np[~np.isnan(dem_np)])), dem_np)
ls_obj   = LightSource(azdeg=315, altdeg=45)
hs_arr   = ls_obj.hillshade(dem_safe, vert_exag=2, dx=5, dy=5)

wet_l     = (depth_low  >= THR)
wet_h     = (depth_high >= THR)
high_only = wet_h.astype(bool) & ~wet_l.astype(bool)

hs_c,   xs_c, ys_c = np_clip_window(hs_arr,                                    x_vals, y_vals, xmin_m, xmax_m, ymin_m, ymax_m)
wl_c,   _,    _    = np_clip_window(np.where(wet_l,     1.0, np.nan),           x_vals, y_vals, xmin_m, xmax_m, ymin_m, ymax_m)
wh_c,   _,    _    = np_clip_window(np.where(high_only, 1.0, np.nan),           x_vals, y_vals, xmin_m, xmax_m, ymin_m, ymax_m)
om_c,   _,    _    = np_clip_window(thresh_np.astype(float),                    x_vals, y_vals, xmin_m, xmax_m, ymin_m, ymax_m)
omega_sm_c          = ndimage.gaussian_filter(om_c, sigma=1)

# Image extent for imshow: [left, right, bottom, top]
img_ext = [xs_c[0] - 2.5, xs_c[-1] + 2.5, ys_c[-1] - 2.5, ys_c[0] + 2.5]

# Compute figure size so map panel maintains equal spatial aspect ratio
dx = xmax_m - xmin_m
dy = ymax_m - ymin_m
fig_w   = 8.2
# Width ratio [1.0, 1.2] → map gets 1/2.2 of total width
map_win = fig_w * (1.0 / 2.2)     # inches available for map panel
fig_h   = map_win * (dy / dx) + 1.45  # + margins for title/xlabel and external legend
fig_h   = min(max(fig_h, 4.5), 7.0)   # clamp between 4.5 and 7.0 inches
print(f"Window: dx={dx:.0f} m, dy={dy:.0f} m  →  figsize=({fig_w:.1f}, {fig_h:.1f})")

fig, (ax_map, ax_vio) = plt.subplots(
    1, 2, figsize=(fig_w, fig_h),
    gridspec_kw={"wspace": 0.45, "width_ratios": [1.0, 1.2]})

# ── Panel (a): map using imshow — NO aspect="equal" to avoid figure distortion
from matplotlib.colors import Normalize
import matplotlib.cm as mcm

ax_map.imshow(hs_c, cmap="Greys_r", vmin=0, vmax=1, alpha=0.40,
              extent=img_ext, origin="upper", aspect="auto", zorder=0)

wl_rgba = mcm.Blues(Normalize(vmin=0.3, vmax=1)(np.where(np.isnan(wl_c), 0, wl_c)))
wl_rgba[..., 3] = np.where(np.isnan(wl_c), 0.0, 0.65)
ax_map.imshow(wl_rgba, extent=img_ext, origin="upper", aspect="auto", zorder=2)

wh_rgba = mcm.Reds(Normalize(vmin=0.3, vmax=1)(np.where(np.isnan(wh_c), 0, wh_c)))
wh_rgba[..., 3] = np.where(np.isnan(wh_c), 0.0, 0.90)
ax_map.imshow(wh_rgba, extent=img_ext, origin="upper", aspect="auto", zorder=3)

# Ω_secondary boundary: double contour
y2d_c, x2d_c = np.meshgrid(ys_c, xs_c, indexing="ij")
ax_map.contour(x2d_c, y2d_c, omega_sm_c, levels=[0.5],
               colors="white", linewidths=3.5, zorder=6)
ax_map.contour(x2d_c, y2d_c, omega_sm_c, levels=[0.5],
               colors="black", linewidths=1.5, linestyles="--", zorder=7)

# Saddle marker
ax_map.plot(SADDLE_X, SADDLE_Y, marker="^", color="#ee1111", ms=9, zorder=9,
            markeredgecolor="white", markeredgewidth=0.8)
ax_map.annotate(f" {SADDLE_Z_DISPLAY:.1f} m", xy=(SADDLE_X, SADDLE_Y),
                xytext=(SADDLE_X + 80, SADDLE_Y + 80),
                fontsize=6.5, color="#ee1111", fontweight="bold",
                arrowprops=dict(arrowstyle="-", color="#ee1111", lw=0.7))

ax_map.set_xlim(xmin_m, xmax_m)
ax_map.set_ylim(ymin_m, ymax_m)
ax_map.set_title("(a) Inundation extents — representative simulations",
                 pad=3, fontsize=8.0, fontweight="bold")
ax_map.set_xlabel("Easting (m)", labelpad=4, fontsize=7)
ax_map.set_ylabel("Northing (m)", labelpad=2, fontsize=7)
ax_map.tick_params(labelsize=5.5)
ax_map.yaxis.set_major_formatter(
    mticker.FuncFormatter(lambda v, _: f"{int(v):,}".replace(",", " ")))

# Legend inside map (upper-left, over dry terrain)
handles_map = [
    mpatches.Patch(facecolor=C_LOW,  alpha=0.70,
                   label=f"Low-regime extent\n"
                         f"sim {rep_low}  ($A$={r0.loc[rep_low,'hecras_area_km2']:.3f} km²)"),
    mpatches.Patch(facecolor=C_HIGH, alpha=0.90,
                   label=f"High-regime only\n"
                         f"sim {rep_high}  ($A$={r1.loc[rep_high,'hecras_area_km2']:.3f} km²)"),
    mlines.Line2D([], [], color="black", ls="--", lw=1.5,
                  label=r"$\Omega_{\mathrm{secondary}}$ boundary"),
    mlines.Line2D([], [], marker="^", color="#ee1111", ms=7, ls="none",
                  markeredgecolor="white", markeredgewidth=0.6,
                  label=f"Saddle  {SADDLE_Z_DISPLAY:.1f} m a.s.l."),
]
ax_map.legend(handles=handles_map, fontsize=5.8, loc="lower left",
              framealpha=0.88, edgecolor="0.6", borderpad=0.6,
              handlelength=1.3, handletextpad=0.5, labelspacing=0.5)

# ── Panel (b): WSE ensemble at saddle ─────────────────────────────────────────
rng_jitter = np.random.default_rng(7)

def violin_kde(ax, data, x_pos, color, half_w=0.35):
    d = data[~np.isnan(data)]
    if len(d) == 0:
        return
    kde    = stats.gaussian_kde(d, bw_method="scott")
    yg     = np.linspace(d.min() - 0.2, d.max() + 0.2, 300)
    dens   = kde(yg); dens /= dens.max()
    ax.fill_betweenx(yg, x_pos - dens * half_w, x_pos + dens * half_w,
                     alpha=0.55, color=color, zorder=2)

violin_kde(ax_vio, wse_low_arr,  1, C_LOW)
violin_kde(ax_vio, wse_high_arr, 2, C_HIGH)

# Jittered points
jit_l = rng_jitter.uniform(-0.10, 0.10, len(wse_low_arr))
ax_vio.scatter(1 + jit_l, wse_low_arr, s=4, color=C_LOW,
               alpha=0.55, linewidths=0, zorder=3)
n_sub   = min(250, len(wse_high_arr))
idx_sub = rng_jitter.choice(len(wse_high_arr), n_sub, replace=False)
jit_h   = rng_jitter.uniform(-0.10, 0.10, n_sub)
ax_vio.scatter(2 + jit_h, wse_high_arr[idx_sub], s=2, color=C_HIGH,
               alpha=0.30, linewidths=0, zorder=3)

# Set axes limits FIRST so all text positions are calculated within bounds
ylo = min(np.nanmin(wse_low_arr), np.nanmin(wse_high_arr)) - 0.4
yhi = max(np.nanmax(wse_low_arr), np.nanmax(wse_high_arr)) + 0.6
ax_vio.set_xlim(0.45, 2.55)   # slight padding on each side
ax_vio.set_ylim(ylo, yhi)

# IQR box + median — label INSIDE the violin body, centered
for x_pos, data, color in [(1, wse_low_arr, C_LOW), (2, wse_high_arr, C_HIGH)]:
    d = data[~np.isnan(data)]
    q1, med, q3 = np.nanpercentile(d, [25, 50, 75])
    ax_vio.vlines(x_pos, q1, q3, color="white", lw=5.0, zorder=4)
    ax_vio.vlines(x_pos, q1, q3, color="0.2",  lw=1.6, zorder=4.5)
    ax_vio.plot([x_pos - 0.13, x_pos + 0.13], [med, med],
                color="white", lw=2.2, zorder=5)
    # Median label centered above the median mark, inside the violin
    ax_vio.text(x_pos, med + 0.07, f"{med:.2f} m",
                fontsize=6.0, va="bottom", ha="center",
                color="white", fontweight="bold", zorder=6,
                bbox=dict(boxstyle="round,pad=0.1", fc=color, ec="none", alpha=0.75))

# Representative simulations — labels offset outside the violin bodies.
ax_vio.scatter([1], [wse_rep_low],  s=55, color="white",
               edgecolors=C_LOW,  lw=1.8, zorder=7)
ax_vio.scatter([2], [wse_rep_high], s=55, color="white",
               edgecolors=C_HIGH, lw=1.8, zorder=7)
ax_vio.annotate(
    f"sim {rep_low}\n{wse_rep_low:.2f} m",
    xy=(1, wse_rep_low), xycoords="data",
    xytext=(0.72, wse_rep_low - 0.10), textcoords="data",
    fontsize=5.8, color=C_LOW, va="top", ha="right", zorder=8,
    arrowprops=dict(arrowstyle="-", color=C_LOW, lw=0.7, shrinkA=1, shrinkB=4),
)
ax_vio.annotate(
    f"sim {rep_high}\n{wse_rep_high:.2f} m",
    xy=(2, wse_rep_high), xycoords="data",
    xytext=(2.28, wse_rep_high + 0.10), textcoords="data",
    fontsize=5.8, color=C_HIGH, va="bottom", ha="left", zorder=8,
    arrowprops=dict(arrowstyle="-", color=C_HIGH, lw=0.7, shrinkA=1, shrinkB=4),
)

# Saddle terrain note at bottom inside axes (axes-fraction coords — always inside)
ax_vio.text(1.5, ylo + 0.05,
            f"Saddle terrain {SADDLE_Z_DISPLAY:.1f} m a.s.l. — both regimes submerge it by >2 m",
            fontsize=5.5, color="0.45", ha="center", va="bottom")

# X-axis labels: regime name + sim count on second line
ax_vio.set_xticks([1, 2])
ax_vio.set_xticklabels(
    [f"Low regime\n(97 simulations)", f"High regime\n(898 simulations)"],
    fontsize=8.5)

ax_vio.set_ylabel("Max. WSE at saddle pixel (m a.s.l.)", labelpad=2, fontsize=7)
ax_vio.set_title("(b) WSE at the morphological saddle — full ensemble",
                 pad=3, fontsize=8.0, fontweight="bold")
ax_vio.tick_params(axis="y", labelsize=6.5)
ax_vio.tick_params(axis="x", length=0)

# Legend inside panel (b), placed in the empty upper-right area.
handles_vio = [
    mpatches.Patch(facecolor=C_LOW,  alpha=0.60, label="Low-regime WSE distribution"),
    mpatches.Patch(facecolor=C_HIGH, alpha=0.60, label="High-regime WSE distribution"),
    mlines.Line2D([], [], marker="o", ls="none", ms=6, color="white",
                  markeredgecolor="0.3", markeredgewidth=1.5,
                  label="Representative simulation (open circle)"),
]
ax_vio.legend(handles=handles_vio, fontsize=5.8, loc="upper right",
              framealpha=0.90, edgecolor="0.7", borderpad=0.6,
              handlelength=1.4, handletextpad=0.5, labelspacing=0.4)

fig.subplots_adjust(left=0.10, right=0.97, bottom=0.10, top=0.93)
for ext in ["pdf", "png"]:
    out = FIG_DIR / f"fig_saddle_transect.{ext}"
    fig.savefig(out, dpi=300)
    print(f"Saved {out}")
plt.close(fig)
