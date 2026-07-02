# HYDRA

**HYDRA** is the integration platform for **pyhydra**: a modular Python library for hydrological and climate analysis (data download, extreme-value statistics, stochastic generation, bias correction, hybrid downscaling, and automation of hydrological/hydraulic models). This repository adds the execution, API, web, and reproducible-documentation layers on top of pyhydra.

- 🌐 **Live demo:** [hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io](https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/) — a demo instance deployed on Azure Container Apps. This is an ephemeral endpoint for operational validation, not a durable reference (to cite the software, use the Zenodo DOIs below).
- 📦 **Python core:** [github.com/navass11/pyhydra](https://github.com/navass11/pyhydra) — installable with `pip install -e .`
- 📖 **Documentation:** built with MkDocs and published to GitHub Pages from `docs/` (workflow `.github/workflows/docs.yml`)

## Repository structure

```
HYDRA/
├── pyhydra/          # Working copy of the Python core (canonical repo: navass11/pyhydra)
├── api/               # FastAPI backend: serves the web app, proxies JupyterLab, notebooks
├── web/               # Astro frontend (hydra-web)
├── notebooks/         # Example notebooks and reproducible pilot cases
├── docker/            # Dockerfiles and docker-compose for jupyter/api/web
├── deploy/, infra/    # Azure Container Apps deployment
├── docs/              # Documentation source (MkDocs → GitHub Pages)
├── examples/          # Minimal example scripts per module
├── tests/             # pyhydra test suite
└── scripts/           # Notebook execution utilities, smoke tests, etc.
```

The canonical source for `pyhydra/` lives in its own repository ([navass11/pyhydra](https://github.com/navass11/pyhydra)); the copy here is the one consumed by HYDRA's Docker/Azure image.

## Running with Docker

```bash
git clone https://github.com/navass11/HYDRA.git
cd HYDRA

# Starts jupyter + api + web
docker compose -f docker/docker-compose.yml up --build
```

- JupyterLab: `http://localhost:8888`
- Web: see the port exposed by the `web` service in `docker/docker-compose.yml`

To stop:

```bash
docker compose -f docker/docker-compose.yml down
```

## Deployment

The `.github/workflows/azure.yml` workflow builds and publishes the `jupyter`, `api`, and `web` images to Azure Container Registry; deployment to Azure Container Apps is triggered manually with `az containerapp update` (see the workflow comments).

## Citing this work

- Python core (pyhydra): Navas Fernández, S. (2026). *pyhydra: a modular Python library for hydrological and climate analysis* (v0.1.0). Zenodo. https://doi.org/10.5281/zenodo.20932555
- This repository (HYDRA): archival on Zenodo is in progress — until then, cite the GitHub repository: https://github.com/navass11/HYDRA

## Related branches

- [`thesis`](https://github.com/navass11/HYDRA/tree/thesis) — LaTeX sources of the doctoral thesis (kept as a separate worktree: `HYDRA-thesis`).
- [`paper`](https://github.com/navass11/HYDRA/tree/paper) — LaTeX sources of the Besaya Manning-sensitivity paper.
