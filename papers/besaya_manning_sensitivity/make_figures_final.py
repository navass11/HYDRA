"""
Regenerate two figures that had layout problems:

1. fig_copula_analysis.pdf  — single wide 3-panel figure (textwidth),
   panel (c) with two non-overlapping legends.

2. fig03_intramodel_sensitivity.pdf — 2x2 scatter, bigger figure,
   more spacing, legends moved to lower-right in HEC-RAS panels.
"""
import sys
sys.path.insert(0, "/Users/salvadornavasfernandez/Desktop/Github/HYDRA")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
from matplotlib.lines import Line2D
from scipy import stats
from scipy.stats import pearsonr, linregress
from sklearn.mixture import GaussianMixture

from pyhydra.modeling.hydraulic.sensitivity import (
    generate_manning_combinations_correlated,
    _best_distribution,
)

BASE     = Path("/Volumes/My Passport 2/OneDrive/Scripts_Python/Paper_Rugosidades")
DIST_CSV = BASE / "manning_roughness_coefficients_dist.csv"
REF_CSV  = BASE / "combinaciones_rugosidad.csv"
NB_DIR   = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/notebooks/modeling/hydraulic/manning_sensitivity")
RES_CSV  = NB_DIR / "comparison_sfincs_hecras_clean.csv"
FIG_DIR  = Path("/Users/salvadornavasfernandez/Desktop/Github/HYDRA"
                "/papers/besaya_manning_sensitivity/figures")

AREAS_HA = {"Trees":25.2,"Dense vegetation":49.9,"Urban vegetation":123.4,
            "Infrastructure":43.0,"Sparse vegetation":473.0,"Residential":199.8,
            "Industrial":120.1,"River":25.5,"Brushland":25.7}
TOT = sum(AREAS_HA.values())
W   = {k: v/TOT for k, v in AREAS_HA.items()}
COLORS     = ["#1f77b4","#ff7f0e","#2ca02c"]
RHO_LABELS = [r"$\rho=0$", r"$\rho=0.5$", r"$\rho=1$"]
LS_STYLES  = [(0,(5,2)), (0,(3,1,1,1)), (0,(2,1))]


def cv(x): return 100*x.std()/x.mean()

def pval_str(p):
    return r"$p < 0.001$" if p < 0.001 else fr"$p = {p:.3f}$"

def save(fig, name):
    for ext in ["pdf","png"]:
        fig.savefig(FIG_DIR/f"{name}.{ext}", dpi=180, bbox_inches="tight")
    print(f"  saved {name}")
    plt.close(fig)


# ─────────────────────────────────────────────────────────────────────────────
# Shared data
# ─────────────────────────────────────────────────────────────────────────────
df_ref  = pd.read_csv(REF_CSV)
df_rho0 = generate_manning_combinations_correlated(str(DIST_CSV),1000,rho=0.0,seed=42)
df_rho5 = generate_manning_combinations_correlated(str(DIST_CSV),1000,rho=0.5,seed=42)
df_rho1 = generate_manning_combinations_correlated(str(DIST_CSV),1000,rho=1.0,seed=42)

def wmean(df):
    cols=[c for c in W if c in df.columns]; w=np.array([W[c] for c in cols]); w/=w.sum()
    return df[cols].values @ w

nbar_ref = wmean(df_ref)
ARRS     = [wmean(df_rho0), wmean(df_rho5), wmean(df_rho1)]
cv_ref   = cv(nbar_ref)

# Theoretical CV
df_dist = pd.read_csv(DIST_CSV, index_col=0)
csig, cmu = {}, {}
for _, row in df_dist.iterrows():
    if str(row["N"])=="-999": continue
    vals=np.array([float(v) for v in str(row["N"]).split(",")])
    dn,params=_best_distribution(vals); d=getattr(stats,dn)
    mu,var=d.stats(*params[:-2],loc=params[-2],scale=params[-1],moments="mv")
    desc=row[u"Descripción"]
    cmu[desc]=float(mu); csig[desc]=float(np.sqrt(var))
wa  = np.array([W[k] for k in csig if k in W])
sa  = np.array([csig[k] for k in csig if k in W])
mub = (wa*np.array([cmu[k] for k in csig if k in W])).sum()
rv  = np.linspace(0,1,200)
vi  = (wa**2*sa**2).sum(); cr=(wa@sa)**2-vi
cv_th = 100*np.sqrt(vi+rv*cr)/mub

# Flood results
df_res = pd.read_csv(RES_CSV, index_col=0)
area   = df_res["hecras_area_km2"].values
gmm    = GaussianMixture(n_components=2,random_state=42,n_init=10)
lab    = gmm.fit_predict(area.reshape(-1,1))
if gmm.means_.flatten()[0]>gmm.means_.flatten()[1]: lab=1-lab
lm,hm  = lab==0, lab==1
nb_sim = df_res["hecras_manning_mean"].values
r_all, p_all = pearsonr(nb_sim, area)
print(f"Regimes low={lm.sum()} high={hm.sum()}  r={r_all:.3f} p={p_all:.3f}")


# =============================================================================
# FIGURE 1 — fig_copula_analysis  (full textwidth, 3 panels)
# =============================================================================
fig = plt.figure(figsize=(12, 4.0))
gs  = gridspec.GridSpec(1,3,figure=fig,wspace=0.38,
                        left=0.06,right=0.98,top=0.90,bottom=0.14)

# ── (a) CV amplification ────────────────────────────────────────────────────
ax_a = fig.add_subplot(gs[0])
ax_a.plot(rv, cv_th, "k-", lw=2.0, label="Theory")
ax_a.axhline(cv_ref, color="k", ls=":", lw=1.3, alpha=0.7,
             label=f"Current MC ({cv_ref:.1f}%)")
for rn,lbl,col,arr in zip([0.0,0.5,1.0],RHO_LABELS,COLORS,ARRS):
    ax_a.scatter(rn, cv(arr), color=col, s=90, zorder=5,
                 label=f"{lbl}  ({cv(arr):.1f}%)",
                 edgecolors="k", linewidths=0.5)
ax_a.set_xlabel(r"Inter-class correlation $\rho$", fontsize=9)
ax_a.set_ylabel(r"CV$(\bar{n})$ [%]", fontsize=9)
ax_a.set_title(r"(a) CV amplification of $\bar{n}$", fontsize=9, fontweight="bold")
ax_a.set_xlim(-0.05,1.05)
ax_a.legend(fontsize=7.5, loc="upper left", framealpha=0.92)
ax_a.grid(True, alpha=0.35)

# ── (b) Distributions ───────────────────────────────────────────────────────
ax_b = fig.add_subplot(gs[1])
bins = np.linspace(0.015,0.095,36)
for arr,lbl,col in zip(ARRS,RHO_LABELS,COLORS):
    ax_b.hist(arr, bins=bins, histtype="step", lw=1.8,
              density=True, color=col, label=lbl, alpha=0.95)
ax_b.axvline(np.mean([a.mean() for a in ARRS]),
             color="k", ls="--", lw=1.2, alpha=0.8, label=r"Mean $\bar{n}$")
ax_b.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=9)
ax_b.set_ylabel("Density", fontsize=9)
ax_b.set_title(r"(b) Distribution of $\bar{n}$ by scenario", fontsize=9, fontweight="bold")
ax_b.legend(fontsize=7.5, loc="upper right", framealpha=0.92)
ax_b.grid(True, alpha=0.35)

# ── (c) Scatter ─────────────────────────────────────────────────────────────
ax_c = fig.add_subplot(gs[2])
ax_c.scatter(nb_sim[hm], area[hm], s=10, alpha=0.35, color="#e07070",
             linewidths=0, zorder=2, rasterized=True)
ax_c.scatter(nb_sim[lm], area[lm], s=18, alpha=0.80, color="#2060b8",
             linewidths=0.3, edgecolors="#1040a0", zorder=3)
m,b_i,*_ = linregress(nb_sim, area)
xl = np.array([nb_sim.min(), nb_sim.max()])
ax_c.plot(xl, m*xl+b_i, "k--", lw=1.4, zorder=4)
ax_c.set_ylim(0.485, 0.905)
ax_c.set_xlim(nb_sim.min()-0.003, nb_sim.max()+0.003)

# Copula range lines — upper-left legend
rh = []
for arr,lbl,col,ls in zip(ARRS,RHO_LABELS,COLORS,LS_STYLES):
    p5,p95 = np.percentile(arr,[5,95])
    ax_c.axvline(p5,  color=col, ls=ls, lw=1.2, alpha=0.9, zorder=5)
    ax_c.axvline(p95, color=col, ls=ls, lw=1.2, alpha=0.9, zorder=5)
    rh.append(Line2D([0],[0],color=col,ls=ls,lw=1.4,label=f"{lbl} P5–P95"))
leg1 = ax_c.legend(handles=rh, fontsize=7, loc="upper left", framealpha=0.92,
                   title="Copula range", title_fontsize=6.5,
                   borderpad=0.4, labelspacing=0.2)
ax_c.add_artist(leg1)

# Regime + regression — lower-right legend
lh = [
    mpatches.Patch(color="#e07070", alpha=0.6, label=f"High regime (N={hm.sum()})"),
    mpatches.Patch(color="#2060b8",            label=f"Low regime (N={lm.sum()})"),
    Line2D([0],[0],color="k",ls="--",lw=1.4,
           label=f"All: $r={r_all:.3f}$, $p={p_all:.2f}$"),
]
ax_c.legend(handles=lh, fontsize=7, loc="lower right", framealpha=0.92)
ax_c.set_xlabel(r"Area-weighted mean Manning $\bar{n}$", fontsize=9)
ax_c.set_ylabel(r"HEC-RAS flooded area (km²)", fontsize=9)
ax_c.set_title(r"(c) $\bar{n}$ vs flood output (995 runs)", fontsize=9, fontweight="bold")
ax_c.grid(True, alpha=0.35)

fig.suptitle("Effect of inter-class Manning correlation on spatial-mean roughness "
             "and flood outputs", fontsize=10, fontweight="bold")
save(fig, "fig_copula_analysis")


# =============================================================================
# FIGURE 2 — fig03_intramodel_sensitivity  (2×2 scatter)
# =============================================================================
sf = df_res.copy()
sf["manning_mean"] = df_res["sfincs_manning_mean"]
# Rebuild sf/hr from the raw results
sf_full = pd.read_csv(RES_CSV, index_col=0)
hr_full = sf_full.copy()

# SFINCS columns
sf_data = sf_full.rename(columns={
    "sfincs_depth_mean":  "depth_mean",
    "sfincs_area_km2":    "flooded_area_km2",
    "sfincs_manning_mean":"manning_mean",
})
# HEC-RAS columns
hr_data = sf_full.rename(columns={
    "hecras_depth_mean":  "depth_mean",
    "hecras_area_km2":    "flooded_area_km2",
    "hecras_manning_mean":"manning_mean",
})

# Regime split for HEC-RAS
r0 = hr_data[lm]
r1 = hr_data[hm]

C_LOW  = "#4878d0"
C_HIGH = "#c44e52"
C_SF   = "#6acc65"

fig3, axes = plt.subplots(2, 2, figsize=(10.5, 8.5))

# SFINCS panels
for col, ylabel, ax in [
    ("depth_mean",    "Mean water depth (m)", axes[0,0]),
    ("flooded_area_km2", "Flooded area (km²)", axes[0,1]),
]:
    x = sf_data["manning_mean"]; y = sf_data[col]
    sl,inter,r,p,_ = stats.linregress(x,y)
    xx = np.linspace(x.min(),x.max(),100)
    ax.scatter(x, y, s=6, alpha=0.4, color=C_SF, linewidths=0)
    ax.plot(xx, sl*xx+inter, color="darkgreen", lw=1.5,
            label=fr"$r = {r:.2f}$, {pval_str(p)}")
    ax.set_xlabel("Mean Manning $n$ (wetted cells)", fontsize=9, labelpad=2)
    ax.set_ylabel(ylabel, fontsize=9, labelpad=2)
    ax.set_title(f"SFINCS — CV={cv(y):.1f}%  (unimodal)", fontweight="bold", fontsize=9)
    ax.legend(loc="lower right", handlelength=1, fontsize=8.5)
    ax.grid(True, alpha=0.35)

# HEC-RAS panels
for col, ylabel, ax in [
    ("depth_mean",    "Mean water depth (m)", axes[1,0]),
    ("flooded_area_km2", "Flooded area (km²)", axes[1,1]),
]:
    x_all = hr_data["manning_mean"]; y_all = hr_data[col]
    sl,inter,r,p,_ = stats.linregress(x_all,y_all)
    xx = np.linspace(x_all.min(),x_all.max(),100)

    ax.scatter(r0["manning_mean"], r0[col], s=6,  alpha=0.6,
               color=C_LOW,  linewidths=0, label=f"Low regime (N={len(r0)})")
    ax.scatter(r1["manning_mean"], r1[col], s=5,  alpha=0.25,
               color=C_HIGH, linewidths=0, label=f"High regime (N={len(r1)})")
    ax.plot(xx, sl*xx+inter, color="black", lw=1.5, ls="--",
            label=fr"$r = {r:.2f}$, {pval_str(p)}")

    # mean level annotations (right side, outside legend)
    for regime, color, lbl in [(r0,C_LOW,"Low"),(r1,C_HIGH,"High")]:
        level = regime[col].mean()
        ax.axhline(level, color=color, lw=0.9, ls=":", alpha=0.8)
        ax.annotate(f"{lbl}: {level:.3f}",
                    xy=(x_all.max()*0.99, level),
                    fontsize=7.5, color=color, ha="right", va="bottom",
                    bbox=dict(boxstyle="round,pad=0.15", fc="white", ec="none", alpha=0.85))

    ax.set_xlabel("Mean Manning $n$ (wetted cells)", fontsize=9, labelpad=2)
    ax.set_ylabel(ylabel, fontsize=9, labelpad=2)
    ax.set_title(f"HEC-RAS — CV={cv(y_all):.1f}%  (bimodal: two bands)",
                 fontweight="bold", fontsize=9)
    # legend at lower right — no data there
    ax.legend(loc="lower right", handlelength=1, markerscale=2.5,
              fontsize=8, framealpha=0.92)
    ax.grid(True, alpha=0.35)

# Panel labels — inside title bbox to avoid conflict with legends
for ax, lbl in zip(axes.flatten(), ["(a)","(b)","(c)","(d)"]):
    ax.annotate(lbl, xy=(0.02, 0.97), xycoords="axes fraction",
                fontsize=11, fontweight="bold", va="top",
                bbox=dict(boxstyle="round,pad=0.15", fc="white", alpha=0.7, lw=0))

fig3.suptitle(
    "Sensitivity of flood outputs to Manning roughness — "
    "HEC-RAS scatter coloured by inundation regime (blue = low, red = high)",
    fontsize=10, fontweight="bold"
)
plt.tight_layout(pad=1.4, h_pad=2.5, w_pad=1.5)
save(fig3, "fig03_intramodel_sensitivity")

print("All done.")
