# Paper - Roughness uncertainty in 2D flood inundation models (Besaya)

LaTeX source files for the manuscript:

> **From roughness uncertainty to model-structure effects in 2D flood inundation models: a Monte Carlo comparison of SFINCS and HEC-RAS**
> Salvador Navas, Alvaro Galan, Manuel del Jesus

This repository contains the manuscript sources, figures, supplementary
material, and reproducibility package for a Monte Carlo sensitivity analysis of
Manning roughness in the Besaya River floodplain (Los Corrales de Buelna,
Cantabria, Spain). The study compares the response of two 2D hydraulic models,
SFINCS and HEC-RAS, and forms part of the validation case studies for the
**HYDRA** platform.

- **Code and tools used:** [github.com/navass11/HYDRA](https://github.com/navass11/HYDRA) (`main` branch) and [github.com/navass11/pyhydra](https://github.com/navass11/pyhydra)
- **Live HYDRA demo:** [hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io](https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/)
- **pyhydra on Zenodo:** https://doi.org/10.5281/zenodo.20932555

## Repository structure

```
papers/besaya_manning_sensitivity/
├── main_AG.tex                    # Active manuscript source
├── main_AG.pdf                    # Compiled manuscript PDF
├── supplementary_material.tex     # Supplementary material source
├── supplementary_material.pdf     # Compiled supplementary material PDF
├── figures/                       # Publication figures
├── make_fig*.py                   # Python scripts used to generate figures
├── references.bib                 # Bibliography
├── zenodo_upload/                 # Data/code package prepared for Zenodo
└── cas-*.{cls,sty,bst}            # Elsevier CAS template files
```

## Build

```bash
cd papers/besaya_manning_sensitivity
latexmk -pdf -interaction=nonstopmode main_AG.tex
latexmk -pdf -interaction=nonstopmode supplementary_material.tex
```
