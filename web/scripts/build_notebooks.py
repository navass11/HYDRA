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
