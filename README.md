# HYDRA

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![HYDRA DOI](https://zenodo.org/badge/doi/10.5281/zenodo.21138151.svg)](https://doi.org/10.5281/zenodo.21138151)
[![pyhydra DOI](https://zenodo.org/badge/doi/10.5281/zenodo.20932555.svg)](https://doi.org/10.5281/zenodo.20932555)

**HYDRA** is the web, API, notebook and deployment environment built around
[`pyhydra`](https://github.com/navass11/pyhydra), a modular Python library for
hydrological and climate analysis. The repository provides the operational layer
used to expose pyhydra workflows through a browser, run reproducible notebooks
and deploy the platform as a multi-container service.

The live Azure endpoint is a demonstration deployment:

<https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/>

This URL is useful for validation and demonstrations, but it is not intended as a
permanent scholarly reference. For citation, use the Zenodo records listed below.

## What This Repository Contains

HYDRA combines four layers:

| Layer | Contents |
| --- | --- |
| Python core | Local working copy of `pyhydra`, consumed by the API and notebook images. The canonical source is [`navass11/pyhydra`](https://github.com/navass11/pyhydra). |
| API | FastAPI backend for interactive tools, notebook sessions and selected pyhydra operations. |
| Web interface | Astro/nginx frontend for module pages, pilot cases, notebook access and browser-based tools. |
| Execution environment | Docker, Azure Container Apps configuration, notebooks, data workspace conventions and deployment documentation. |

## Repository Layout

```text
HYDRA/
|-- api/                 FastAPI application and tool routers
|-- web/                 Astro frontend and nginx-served static build
|-- pyhydra/             Working copy used by the HYDRA containers
|-- notebooks/           Tutorials, module notebooks and pilot cases
|-- data/                Local data workspace mounted into containers
|-- docker/              Dockerfiles, docker-compose and nginx configuration
|-- deploy/azure/        Azure deployment notes and Container Apps manifests
|-- infra/               Infrastructure support files
|-- docs/                MkDocs documentation source
|-- examples/            Minimal pyhydra usage examples
|-- tests/               Python test suite for the bundled pyhydra copy
|-- scripts/             Utility scripts for notebooks and reproducibility
|-- papers/              Research-paper support material
`-- thesis/              Thesis-specific material kept outside the runtime path
```

The `main` branch is kept focused on the web/API/notebook deployment. Thesis and
paper material should remain isolated in their corresponding branches when it is
not needed by the deployed platform.

## Local Execution

The recommended way to run the full platform locally is Docker Compose:

```bash
git clone https://github.com/navass11/HYDRA.git
cd HYDRA
docker compose -f docker/docker-compose.yml up --build
```

Services:

| Service | Purpose | Local URL |
| --- | --- | --- |
| `web` | Astro frontend served by nginx and reverse proxy | <http://localhost/> |
| `api` | FastAPI backend | internal service at `http://api:8000` |
| `jupyter` | JupyterLab notebook runtime | proxied under <http://localhost/jupyter/> |

Stop the stack with:

```bash
docker compose -f docker/docker-compose.yml down
```

To use an external data workspace instead of `data/`:

```bash
HYDRA_DATA_PATH=/path/to/hydra-data docker compose -f docker/docker-compose.yml up --build
```

## Data Workspace

The containers mount the data workspace at `/workspace/data`. The expected
layout is documented in [`data/README.md`](data/README.md) and includes folders
for HEC-HMS, HEC-RAS, SWAT+, SFINCS, climate data, rainfall products and pilot
case inputs.

Large downloaded or generated products should live in the data workspace, not in
the Git repository. The notebooks and web application assume stable relative
paths below `/workspace/data`.

## Development Notes

Install and run the web app directly:

```bash
cd web
npm install
npm run dev
```

Run the API directly:

```bash
pip install -r api/requirements.txt
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

When running outside Docker, make sure `pyhydra/` is importable, for example:

```bash
export PYTHONPATH="$PWD"
```

## Deployment

The GitHub Actions workflow `.github/workflows/azure.yml` builds three images:

- `hydra-web`
- `hydra-api`
- `hydra-jupyter`

Images are pushed to Azure Container Registry. The workflow prints the
`az containerapp update` commands needed to update the Azure Container Apps
deployment manually. Full operational notes are kept in
[`deploy/azure/README.md`](deploy/azure/README.md).

The current Azure deployment is tied to the available Azure account and should be
treated as ephemeral. The durable research artefacts are the Git repositories and
the Zenodo releases.

## Relationship With pyhydra

`pyhydra` is the installable Python package. HYDRA is the platform that exposes
selected pyhydra capabilities through notebooks, API endpoints and a web
interface.

Use the standalone pyhydra repository when you need the Python library as a
dependency:

```bash
pip install git+https://github.com/navass11/pyhydra.git
```

Use this repository when you need the complete browser/API/Jupyter deployment.

## Citation

If you use the Python package, cite:

```bibtex
@software{navas2026pyhydra,
  author    = {Navas Fernández, Salvador},
  title     = {pyhydra: a modular Python library for hydrological and climate analysis},
  year      = {2026},
  version   = {0.1.0},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.20932555},
  url       = {https://github.com/navass11/pyhydra}
}
```

If you use the HYDRA platform, cite:

```bibtex
@software{navas2026hydra,
  author    = {Navas Fernández, Salvador},
  title     = {HYDRA: web platform, notebooks and deployment environment for pyhydra},
  year      = {2026},
  version   = {0.1.0},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.21138151},
  url       = {https://github.com/navass11/HYDRA}
}
```

## License

MIT. See [`LICENSE`](LICENSE).
