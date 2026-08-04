# Paper - pyhydra (SoftwareX)

LaTeX source for an Original Software Publication (OSP) targeting
**SoftwareX** (Elsevier), presenting the software itself rather than a
scientific finding:

> **pyhydra: an open, modular Python library for reproducible hydroclimatic modelling and probabilistic flood-risk analysis**
> Salvador Navas, Manuel del Jesus

Built against the SoftwareX article template v6 (March 2026): five mandatory
sections (Motivation and significance; Software description; Illustrative
examples; Impact; Conclusions), a Code metadata table (C1-C8), and a
mandatory GitHub repository link in the metadata table.

pyhydra (the installable scientific core) is the software under the code
metadata table (C2). The companion platform HYDRA (web/API/Jupyter/Docker
deployment layer, used to run the browser-accessible illustrative examples)
is described in the article and cited separately, but is not itself the
repository referenced by the metadata table -- see "Why pyhydra, not HYDRA"
below.

- **Code described (metadata repository, C2):** [github.com/navass11/pyhydra](https://github.com/navass11/pyhydra), tag [`v0.2.0`](https://github.com/navass11/pyhydra/tree/v0.2.0)
- **Companion deployment platform (cited, not metadata subject):** [github.com/navass11/HYDRA](https://github.com/navass11/HYDRA), tag [`v0.1.2`](https://github.com/navass11/HYDRA/tree/v0.1.2)
- **Zenodo archives:** pyhydra v0.2.0 [10.5281/zenodo.21790226](https://doi.org/10.5281/zenodo.21790226) (concept DOI [10.5281/zenodo.20932554](https://doi.org/10.5281/zenodo.20932554)) · HYDRA v0.1.2 [10.5281/zenodo.21705293](https://doi.org/10.5281/zenodo.21705293) (concept DOI [10.5281/zenodo.21138150](https://doi.org/10.5281/zenodo.21138150))

## Why pyhydra, not HYDRA, as the metadata repository

SoftwareX's Guide for Authors requires the repository linked in the code
metadata table (C2) to have its source code under a `repo/src` directory.
pyhydra is a single installable Python package and follows this layout
(`pyhydra/src/pyhydra/`). HYDRA is a multi-service deployment (FastAPI
backend, Astro/nginx web frontend, Docker/Azure configuration, notebooks)
with no single "source" tree to move under `src/` without touching build
contexts, CI and a live Azure Container Apps deployment. Making pyhydra the
metadata subject avoids that mismatch entirely, while HYDRA is still fully
described and cited in Software description (\S2.1) and Impact (\S4) as the
platform that runs the illustrative examples.

## Repository structure

```
papers/hydra_pyhydra_softwarex/
├── main.tex                # Manuscript source (elsarticle, \journal{SoftwareX})
├── references.bib          # Bibliography
├── highlights.txt          # Five editable highlights (<=85 characters each)
├── SUBMISSION_AUDIT.md      # Requirement-by-requirement compliance audit
├── figures/                 # Illustrative-example figures + generation scripts
└── README.md
```

`main.tex` uses the standard `elsarticle` class and `elsarticle-num` bibliography
style, both shipped with any current TeX Live/MacTeX distribution -- no local
class files are vendored here (unlike `papers/besaya_manning_sensitivity`,
which targets a different journal on the Elsevier CAS template).

## Build

```bash
cd papers/hydra_pyhydra_softwarex
latexmk -pdf -interaction=nonstopmode figures/fig01_architecture.tex
latexmk -pdf -interaction=nonstopmode figures/fig02_reproducibility.tex
latexmk -pdf -interaction=nonstopmode figures/fig04_m30_pipeline.tex
latexmk -pdf -interaction=nonstopmode main.tex
```

## Figure preparation

The manuscript embeds five figures. Three (`fig01_architecture`,
`fig02_reproducibility`, `fig04_m30_pipeline`) are self-contained TikZ
standalone sources compiled to vector PDF, kept alongside their `.tex`
source in this directory.

The remaining two are matplotlib figures generated directly from pyhydra's
own APIs against real pilot-case data (not hand-drawn approximations), with
their generation scripts kept alongside them for reproducibility:

- `fig03_besaya_ensemble.pdf` / `make_fig03_besaya_ensemble.py`: input
  Manning-roughness ensemble (`generate_manning_combinations`, seed 42) and
  output flooded-area distribution (`load_flood_ensemble` +
  `flooded_area`) for the SFINCS run archived in the `manning_rugosidades`
  pilot-case dataset (`pyhydra-get-data manning_rugosidades`). Colour groups
  land-use classes by land-cover type (water/built/vegetated) using the
  validated categorical palette in `references/palette.md` of this
  repository's `dataviz` skill, deliberately distinct in encoding and
  orientation from the similar Manning-ensemble figure in the companion
  `papers/besaya_manning_sensitivity` manuscript, since both draw on the
  same underlying ensemble.
- `fig05_valencia_return_levels.png` / `make_fig05_valencia.py`: T=100yr
  return-level comparison at station 8337X (Turís), computed by re-executing
  `pyhydra/notebooks/pilot_cases/valencia_dana/01_data_exploration.ipynb`
  and `02_extreme_value_analysis.ipynb` end to end (`pyhydra-get-data
  valencia_dana`) and reading the single-station (MLE/L-moments/Bayesian-MCMC)
  and pooled-regional-RFA (MLE/L-moments) results directly from their
  output. Earlier drafts of this figure included a global/local regional
  split that neither archived notebook actually computes; the current
  version only shows what those two notebooks reproduce end to end.

A sixth figure (a case-coverage matrix) was removed during an earlier major
revision because several of the cases it listed had no citable published
evidence; see `SUBMISSION_AUDIT.md` for the rationale.

## Status

The manuscript has been through several rounds of simulated editorial
review (see `SUBMISSION_AUDIT.md`), each addressing the previous round's
findings: version/citation coherence of the archived release, a
reproducible CI-verified test suite (Python 3.9-3.12), an accurate
description of pip extras, and figures that are reproducible end to end
from the archived pyhydra tag. Remaining actions before submission require
author input, not further technical changes: final approval of the
funding/competing-interest/CRediT statements, the corresponding author's
telephone number for Editorial Manager, and completion of Elsevier's
declarations-tool upload.
