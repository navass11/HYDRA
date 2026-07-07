# Data and code for: "From roughness uncertainty to model-structure effects in 2D flood inundation models: a Monte Carlo comparison of SFINCS and HEC-RAS"

**Authors:** Salvador Navas, Álvaro Galán, Manuel del Jesus  
**Journal:** Environmental Modelling & Software (under review)  
**DOI (this dataset):** https://doi.org/10.5281/zenodo.20672450 *(concept DOI, always resolves to the latest version; openly available)*  
**Code repository:** https://github.com/navass11/pyhydra

---

## Overview

This dataset contains the model setups, raw simulation outputs, tabular data and
analysis code required to reproduce the results of the above paper. One thousand
Monte Carlo hydraulic simulations were performed with each model — 1 000 with
SFINCS and 1 000 with HEC-RAS — using stochastic Manning roughness coefficient
combinations for 9 land-use classes in the Besaya River floodplain at Corrales de
Buelna, Cantabria, Spain (T = 500-year flood event). Five simulations (0.5%)
identified as numerical non-convergences were removed, leaving 995 valid
simulation pairs for analysis.

Raw maximum-depth GeoTIFF rasters from both models (~290 MB total) are included
in `simulations/`. Model setup files for both SFINCS and HEC-RAS are included in
`models/`. The tabular derived statistics in `data/` are sufficient to reproduce
all tables and figures without rerunning the hydraulic simulations.

---

## Repository structure

```
zenodo_upload/
├── README.md                        ← this file
├── data/                            ← tabular inputs and outputs
│   ├── manning_roughness_coefficients.csv   input: bibliographic n values + fitted distributions (9 classes)
│   ├── manning_mapping.csv                  input: land-use code → class/description lookup (used to build per-simulation Manning rasters)
│   ├── monte_carlo_combinations.csv         input: 1000 × 9 Manning combination matrix
│   ├── inlet_hydrograph_T500.csv            input: T=500 inflow hydrograph (1-h time step)
│   ├── sfincs_sensitivity_results.csv       output: SFINCS per-simulation statistics (1000 sims)
│   ├── hecras_sensitivity_results.csv       output: HEC-RAS per-simulation statistics (1000 sims)
│   ├── comparison_clean_995.csv             output: matched SFINCS–HEC-RAS pairs (995 valid)
│   └── anomalous_simulations.csv            output: 5 removed simulations with robust z-scores
├── models/                          ← hydraulic model setup files
│   ├── HEC-RAS/                     HEC-RAS 6.6 project (geometry, terrain, land cover, boundary conditions) ~1.4 GB
│   └── SFINCS/                      SFINCS v2 model (sfincs.inp, .dep, .man, .msk, .dis, .src, gis/) ~7 MB
├── simulations/                     ← raw maximum-depth rasters (~290 MB total)
│   ├── HEC-RAS/                     hamax_sim_0.tif … hamax_sim_999.tif  (1000 GeoTIFFs, ~182 MB)
│   └── SFINCS/                      hamax_sim_0.tif … hamax_sim_999.tif  (1000 GeoTIFFs, ~103 MB)
├── notebooks/                       ← analysis notebooks (Jupyter)
│   ├── 01_monte_carlo_sampling.ipynb        Monte Carlo sampling + distribution fitting
│   ├── 02_sfincs_sensitivity_analysis.ipynb SFINCS post-processing + spatial statistics
│   ├── 03_hecras_sensitivity_analysis.ipynb HEC-RAS post-processing + spatial statistics
│   ├── 04_model_comparison.ipynb            Inter-model comparison + anomaly removal
│   ├── 05_regime_analysis.ipynb             GMM regime classification + bifurcation analysis
│   ├── 06_paper_figures.ipynb               Main figures (requires simulations/)
│   └── 07_correlated_manning.ipynb          Gaussian copula sensitivity (Supplementary S1–S4)
├── scripts/                         ← standalone figure generation scripts
│   ├── make_figures_copula_intramodel.py    Generates fig_copula_analysis + fig03
│   └── make_figures_intermodel_metrics.py   Generates fig04 + fig07_alternative_metrics
└── figures/                         ← all publication figures (PDF)
    ├── fig00_location_map.pdf               Figure 1 — study area and domain
    ├── fig01_manning_distributions.pdf      Figure 2 — Manning distributions by land use
    ├── fig02_mc_boxplots.pdf                Figure 3 — ensemble boxplots
    ├── fig03_intramodel_sensitivity.pdf     Figure 4 — intra-model sensitivity scatter
    ├── fig04_intermodel_comparison.pdf      Figure 5 — inter-model comparison
    ├── fig05a_bifurcation_maps.pdf          Figure 6 — low/high regime frequency maps
    ├── fig05c_bifurcation_difference.pdf    Figure 7 — regime frequency-difference map
    ├── fig05b_bifurcation_distributions.pdf Figure 8 — regime distributional evidence
    ├── fig_saddle_transect.pdf              Figure 9 — saddle transect and WSE distributions
    ├── fig07_alternative_metrics.pdf        Figure 10 — alternative metrics (volume, median depth)
    ├── fig05_hydraulic_bifurcation.pdf      legacy combined bifurcation figure
    ├── fig_copula_analysis.pdf              Supplementary Figure S1 — copula CV amplification
    ├── fig_copula_scatter.pdf               Supplementary Figure S2 — copula scatter
    ├── fig_copula_is.pdf                    Supplementary Figure S3 — importance-sampling HEC-RAS
    └── fig_copula_is_sfincs.pdf             Supplementary Figure S4 — importance-sampling SFINCS
```

---

## Data file descriptions

### `data/manning_roughness_coefficients.csv`
Bibliographic Manning *n* values per land-use class (9 classes, 7 values each)
together with the preferred parametric distribution selected by KS test
(normal, log-normal, or gamma) and its fitted parameters.
Used as input to the Monte Carlo sampler.

### `data/manning_mapping.csv`
Lookup table mapping each of the 9 land-use codes (as they appear in
`models/HEC-RAS/LandCover.tif`) to its class description. Used by
`notebooks/01_monte_carlo_sampling.ipynb` to build the per-simulation Manning
CSVs (`generated/nsim_rugos/combinacion_N.csv`) that `build_manning_ensemble`
reads to reclassify the land-use raster for each Monte Carlo draw.

### `data/monte_carlo_combinations.csv`
1000 × 9 matrix of Manning coefficient combinations drawn by independent
Monte Carlo sampling from the fitted distributions in `manning_roughness_coefficients.csv`.
Rows = simulations; columns = land-use classes.

### `data/inlet_hydrograph_T500.csv`
Inflow hydrograph for the T = 500-year event at the upstream boundary.
Time step: 1 hour. Units: m³/s.

### `data/sfincs_sensitivity_results.csv`
Per-simulation summary statistics extracted from SFINCS output rasters:
mean water depth, median water depth, flooded area (km²), mean Manning *n* (wetted cells only).
1000 rows (includes the 5 anomalous simulations).

### `data/hecras_sensitivity_results.csv`
Same as above for HEC-RAS. 1000 rows.

### `data/comparison_clean_995.csv`
Matched SFINCS–HEC-RAS output pairs after removal of 5 anomalous simulations.
995 rows. Contains both model outputs side by side for direct comparison.

### `data/anomalous_simulations.csv`
Diagnostics for the 5 removed simulations: simulation index, flagged model,
flagged metric, value, and robust MAD-normalised z-score.

---

## Model files

### `models/HEC-RAS/`
HEC-RAS 6.6 project for the Besaya River reach at Corrales de Buelna.
Contains the project file (`.prj`), geometry and mesh (`.g01.hdf`, `.g04.hdf`,
`.g05.hdf`), terrain data (`Terrain/`), land-cover and Manning rasters
(`LandCover.hdf`, `LandCover.tif`, `Mannings_n.hdf`, `Mannings_n.tif`),
plan files (`.p01`–`.p07`), unsteady flow files (`.u01`–`.u04`), and
boundary condition files (`.b01`–`.b07`). Large plan output HDF files
(plan run history) are not included.

### `models/SFINCS/`
SFINCS v2 model setup for the same domain. Contains the input parameter file
(`sfincs.inp`), bathymetry/terrain (`sfincs.dep`), Manning raster (`sfincs.man`),
computational mask (`sfincs.msk`), discharge boundary (`sfincs.dis`), source
point (`sfincs.src`), index file (`sfincs.ind`), and GIS support files (`gis/`).

---

## Simulation outputs

### `simulations/HEC-RAS/` and `simulations/SFINCS/`
Maximum-over-time water-depth rasters (`hamax_sim_0.tif` … `hamax_sim_999.tif`)
for all 1 000 simulations from each model. Files are GeoTIFF at 5 m resolution,
EPSG:25830, with NoData = NaN for dry cells. Simulations 29, 295, 633, 724 and
755 are present but flagged as anomalous in `data/anomalous_simulations.csv`.

---

## Software requirements

| Package | Version tested | Purpose |
|---------|---------------|---------|
| Python  | 3.10+         | runtime |
| pyhydra | latest        | Manning sampling, ensemble loading, sensitivity analysis |
| numpy   | ≥1.24         | numerical arrays |
| pandas  | ≥2.0          | data handling |
| scipy   | ≥1.11         | distribution fitting, statistics |
| sklearn | ≥1.3          | GMM regime classification |
| matplotlib | ≥3.7       | figures |
| xarray  | ≥2023.6       | raster ensemble handling |
| rioxarray | ≥0.15       | GeoTIFF I/O |
| geopandas | ≥0.14       | spatial operations |

Install the `pyhydra` package (contains all hydraulic sensitivity functions):

```bash
pip install git+https://github.com/navass11/pyhydra.git
```

---

## Reproducing the analysis

The two standalone scripts in `scripts/` use only relative paths inside this
archive and can be run directly from `zenodo_upload/` once the Python
requirements are installed. They regenerate the tabular-data figures used for
the inter-model, alternative-metric and copula analyses.

The notebooks are included as analysis provenance and have all been verified to
run end-to-end from a clean copy of this archive (paths are relative to
`notebooks/`, no manual editing required). Notebooks 01–04 and 07 are based
primarily on the tabular data in `data/`; notebooks 05 and 06 additionally use
the GeoTIFF outputs in `simulations/` and model rasters in `models/`.

Notebook 01 must be run once before notebooks 02–04, since it writes the
per-simulation Manning CSVs (`generated/nsim_rugos/combinacion_N.csv`) that
`build_manning_ensemble` reads to reclassify the land-use raster
(`models/HEC-RAS/LandCover.tif`) for every Monte Carlo draw. Notebooks 05 and
06 use `models/SFINCS/gis/dep.tif` as the terrain model for the topographic
saddle analysis, reprojected to match the HEC-RAS simulation grid.

Recommended execution order:
```
01 → 02 → 03 → 04 → 05 → 06 → 07
```

---

## Citation

If you use this dataset, please cite:

> Navas, S., Galán, Á., & del Jesus, M. (2026). From roughness uncertainty to
> model-structure effects in 2D flood inundation models: a Monte Carlo comparison
> of SFINCS and HEC-RAS. *Environmental Modelling & Software* (under review).
> Dataset: Zenodo. https://doi.org/10.5281/zenodo.20672450

---

## Licence

Data and code are released under the **Creative Commons Attribution 4.0
International (CC BY 4.0)** licence.
You are free to share and adapt the material for any purpose, provided
appropriate credit is given.
