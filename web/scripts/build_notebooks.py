#!/usr/bin/env python3
"""
Generate notebooks.json and static notebook HTML for the Astro landing page.

In Docker   (DEPLOY_TARGET=docker)   : links open notebooks in the embedded JupyterLab.
In GH Pages (DEPLOY_TARGET=gh-pages) : links open notebooks on nbviewer.
Local dev   (default)                : links open JupyterLab through the Docker nginx proxy.
"""

import json
import os
import shutil
import subprocess
from pathlib import Path

WEB_DIR = Path(__file__).resolve().parent.parent
_nb_docker = WEB_DIR / "notebooks"
NOTEBOOKS_DIR = _nb_docker if _nb_docker.exists() else WEB_DIR.parent / "notebooks"
META_FILE = WEB_DIR / "src" / "data" / "notebooks.json"
STATIC_NOTEBOOKS_DIR = WEB_DIR / "public" / "notebooks"

DEPLOY_TARGET = os.environ.get("DEPLOY_TARGET", "")
JUPYTER_PUBLIC_URL = os.environ.get("JUPYTER_PUBLIC_URL", "http://localhost/jupyter").rstrip("/")

CATEGORIES = {
    "climate/bias_correction":                    ("Clima",         "⚖️"),
    "climate/event_extraction":                   ("Clima",         "🌊"),
    "climate/extreme_value_analysis":             ("Clima",         "📈"),
    "climate/stochastic_generation":              ("Clima",         "🎲"),
    "climate/spatial_field_generation":           ("Clima",         "🗺️"),
    "climate/spatial_analysis/regional_frequency_analysis": ("Análisis esp.", "📉"),
    "climate/spatial_analysis/copulas":           ("Análisis esp.", "🔗"),
    "climate/spatial_analysis/interpolation":     ("Análisis esp.", "📍"),
    "climate/spatial_analysis/bayes_hierarchical":("Análisis esp.", "🧮"),
    "data_sources/rainfall/AEMET_download":       ("Datos",         "🌦️"),
    "data_sources/rainfall/ERA5_download":        ("Datos",         "🌍"),
    "data_sources/rainfall/GPM_download":         ("Datos",         "🛰️"),
    "data_sources/rainfall/Meteostat_download":   ("Datos",         "🌤️"),
    "data_sources/rainfall/OGIMET_download":      ("Datos",         "📡"),
    "data_sources/rainfall/PERSSIAN_download":    ("Datos",         "🌂"),
    "data_sources/river_discharge/GloFAS_download":("Datos",        "🏞️"),
    "data_sources/river_discharge/GRDC_download": ("Datos",         "🌊"),
    "data_sources/river_discharge/USGS_download": ("Datos",         "💧"),
    "data_sources/climate_change/CDS_download":   ("Datos",         "☁️"),
    "data_sources/climate_change/ESGF_download":  ("Datos",         "🌡️"),
    "data_sources/soils/SoilGrids_download":      ("Datos",         "🪨"),
    "modeling/hydrology/HEC_HMS":                 ("Modelización",  "🏔️"),
    "modeling/hydrology/SWAT":                    ("Modelización",  "🌿"),
    "modeling/hydraulic/HEC_RAS":                 ("Modelización",  "🌊"),
    "modeling/hydraulic/SFINCS":                  ("Modelización",  "🌀"),
    "climate/spatial_analysis/compound_flooding":                        ("Análisis esp.", "🌊"),
    "pilot_cases/los_corrales_buelna/01_data_acquisition":               ("Caso piloto", "①"),
    "pilot_cases/los_corrales_buelna/02_spatial_interpolation":          ("Caso piloto", "②"),
    "pilot_cases/los_corrales_buelna/03_extreme_value_analysis":         ("Caso piloto", "③"),
    "pilot_cases/los_corrales_buelna/04_design_storm_hms":               ("Caso piloto", "④"),
    "pilot_cases/los_corrales_buelna/05_continuous_simulation":          ("Caso piloto", "⑤"),
    "pilot_cases/los_corrales_buelna/06_hybrid_event_reconstruction":    ("Caso piloto", "⑥"),
    "pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics":             ("Caso piloto", "⑦"),
    "pilot_cases/los_corrales_buelna/08_hybrid_return_periods":          ("Caso piloto", "⑧"),
    "pilot_cases/valencia_dana/01_data_exploration":                     ("Caso piloto", "①"),
    "pilot_cases/valencia_dana/02_extreme_value_analysis":               ("Caso piloto", "②"),
    "pilot_cases/manning_rugosidades/01_monte_carlo_rugosidades":        ("Caso piloto", "①"),
    "pilot_cases/manning_rugosidades/02_analisis_sfincs":                ("Caso piloto", "②"),
    "pilot_cases/manning_rugosidades/03_analisis_hecras":                ("Caso piloto", "③"),
    "pilot_cases/manning_rugosidades/04_comparacion_modelos":            ("Caso piloto", "④"),
    "pilot_cases/manning_rugosidades/05_analisis_regimenes":             ("Caso piloto", "⑤"),
    "pilot_cases/manning_rugosidades/06_figuras_paper":                  ("Caso piloto", "⑥"),
    "pilot_cases/manning_rugosidades/07_correlated_manning":             ("Caso piloto", "⑦"),
    "pilot_cases/m30_manzanares/01_rain_data":                           ("Caso piloto", "①"),
    "pilot_cases/m30_manzanares/02_classification":                      ("Caso piloto", "②"),
    "pilot_cases/m30_manzanares/03_copula_generation":                   ("Caso piloto", "③"),
    "pilot_cases/m30_manzanares/04_maxdiss_selection":                   ("Caso piloto", "④"),
    "pilot_cases/m30_manzanares/05_hms_ras_simulation":                  ("Caso piloto", "⑤"),
    "pilot_cases/m30_manzanares/06_knn_return_periods":                  ("Caso piloto", "⑥"),
}

TITLES = {
    "climate/bias_correction":                    "Corrección de sesgo",
    "climate/event_extraction":                   "Extracción de eventos",
    "climate/extreme_value_analysis":             "Análisis de extremos",
    "climate/stochastic_generation":              "Generación estocástica",
    "climate/spatial_field_generation":           "Campos espaciales",
    "climate/spatial_analysis/regional_frequency_analysis": "Frecuencia regional",
    "climate/spatial_analysis/copulas":           "Cópulas",
    "climate/spatial_analysis/interpolation":     "Interpolación",
    "climate/spatial_analysis/bayes_hierarchical":"Bayes jerárquico",
    "data_sources/rainfall/AEMET_download":       "AEMET",
    "data_sources/rainfall/ERA5_download":        "ERA5",
    "data_sources/rainfall/GPM_download":         "GPM / IMERG",
    "data_sources/rainfall/Meteostat_download":   "Meteostat",
    "data_sources/rainfall/OGIMET_download":      "OGIMET SYNOP",
    "data_sources/rainfall/PERSSIAN_download":    "PERSIANN",
    "data_sources/river_discharge/GloFAS_download":"GloFAS",
    "data_sources/river_discharge/GRDC_download": "GRDC",
    "data_sources/river_discharge/USGS_download": "USGS",
    "data_sources/climate_change/CDS_download":   "CDS / Copernicus",
    "data_sources/climate_change/ESGF_download":  "ESGF / CMIP6",
    "data_sources/soils/SoilGrids_download":      "SoilGrids",
    "modeling/hydrology/HEC_HMS":                 "HEC-HMS",
    "modeling/hydrology/SWAT":                    "SWAT+",
    "modeling/hydraulic/HEC_RAS":                 "HEC-RAS",
    "modeling/hydraulic/SFINCS":                  "SFINCS",
    "climate/spatial_analysis/compound_flooding":                        "Compound Flooding",
    "pilot_cases/los_corrales_buelna/01_data_acquisition":               "Besaya 01 · Data",
    "pilot_cases/los_corrales_buelna/02_spatial_interpolation":          "Besaya 02 · Interpolation",
    "pilot_cases/los_corrales_buelna/03_extreme_value_analysis":         "Besaya 03 · Extremes",
    "pilot_cases/los_corrales_buelna/04_design_storm_hms":               "Besaya 04 · HEC-HMS design",
    "pilot_cases/los_corrales_buelna/05_continuous_simulation":          "Besaya 05 · Continuous simulation",
    "pilot_cases/los_corrales_buelna/06_hybrid_event_reconstruction":    "Besaya 06 · Copulas",
    "pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics":             "Besaya 07 · 2D hydraulics",
    "pilot_cases/los_corrales_buelna/08_hybrid_return_periods":          "Besaya 08 · Risk",
    "pilot_cases/valencia_dana/01_data_exploration":                     "DANA 01 · Data",
    "pilot_cases/valencia_dana/02_extreme_value_analysis":               "DANA 02 · Extremes",
    "pilot_cases/manning_rugosidades/01_monte_carlo_rugosidades":        "Manning 01 · Monte Carlo",
    "pilot_cases/manning_rugosidades/02_analisis_sfincs":                "Manning 02 · SFINCS",
    "pilot_cases/manning_rugosidades/03_analisis_hecras":                "Manning 03 · HEC-RAS",
    "pilot_cases/manning_rugosidades/04_comparacion_modelos":            "Manning 04 · Comparison",
    "pilot_cases/manning_rugosidades/05_analisis_regimenes":             "Manning 05 · Regimes",
    "pilot_cases/manning_rugosidades/06_figuras_paper":                  "Manning 06 · Figures",
    "pilot_cases/manning_rugosidades/07_correlated_manning":             "Manning 07 · Correlated",
    "pilot_cases/m30_manzanares/01_rain_data":                           "M30 01 · Rain data",
    "pilot_cases/m30_manzanares/02_classification":                      "M30 02 · Classification",
    "pilot_cases/m30_manzanares/03_copula_generation":                   "M30 03 · Copula",
    "pilot_cases/m30_manzanares/04_maxdiss_selection":                   "M30 04 · MaxDiss",
    "pilot_cases/m30_manzanares/05_hms_ras_simulation":                  "M30 05 · HMS+RAS",
    "pilot_cases/m30_manzanares/06_knn_return_periods":                  "M30 06 · kNN return periods",
}

GITHUB_RAW = "https://nbviewer.org/github/navass11/HYDRA/blob/main/notebooks"


def notebook_slug(rel: str) -> str:
    return rel.replace("/", "--")


def static_notebook_path(rel: str) -> Path:
    return STATIC_NOTEBOOKS_DIR / f"{notebook_slug(rel)}.html"


def render_static_notebook(nb: Path, rel: str) -> None:
    html_path = static_notebook_path(rel)
    if html_path.exists() and html_path.stat().st_mtime >= nb.stat().st_mtime:
        return

    STATIC_NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    jupyter_cmd = shutil.which("jupyter")
    if not jupyter_cmd:
        print(f"⚠ no jupyter executable found; falling back to nbviewer for {rel}")
        return

    subprocess.run(
        [
            jupyter_cmd,
            "nbconvert",
            "--to",
            "html",
            "--no-input",
            "--output",
            notebook_slug(rel),
            "--output-dir",
            str(STATIC_NOTEBOOKS_DIR),
            str(nb),
        ],
        check=True,
    )


def notebook_href(rel: str) -> str:
    nb_path = f"{rel}.ipynb"
    if DEPLOY_TARGET == "docker":
        return f"/jupyter/lab/tree/{nb_path}"
    if DEPLOY_TARGET == "gh-pages":
        return f"{GITHUB_RAW}/{nb_path}"
    if DEPLOY_TARGET == "static":
        if static_notebook_path(rel).exists():
            return f"notebooks/{notebook_slug(rel)}.html"
        return f"{GITHUB_RAW}/{nb_path}"
    return f"{JUPYTER_PUBLIC_URL}/lab/tree/{nb_path}"


def main():
    notebooks = sorted(NOTEBOOKS_DIR.rglob("*.ipynb"))
    meta = []

    for nb in notebooks:
        rel = str(nb.relative_to(NOTEBOOKS_DIR).with_suffix(""))
        if rel not in CATEGORIES:
            continue  # only publish notebooks explicitly listed in CATEGORIES
        if DEPLOY_TARGET == "static":
            render_static_notebook(nb, rel)
        title = TITLES.get(rel, nb.stem.replace("_", " ").title())
        cat, icon = CATEGORIES[rel]

        meta.append({
            "slug":     notebook_slug(rel),
            "title":    title,
            "category": cat,
            "icon":     icon,
            "href":     notebook_href(rel),
        })

    META_FILE.parent.mkdir(parents=True, exist_ok=True)
    META_FILE.write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    print(f"✓ {len(meta)} notebooks → src/data/notebooks.json  [target={DEPLOY_TARGET or 'local'}]")


if __name__ == "__main__":
    main()
