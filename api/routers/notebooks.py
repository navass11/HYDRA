from __future__ import annotations

import asyncio
import base64
import json
import os
import re
import uuid
from pathlib import Path

import httpx
from fastapi import APIRouter, BackgroundTasks, Cookie, HTTPException, Query
from fastapi.responses import RedirectResponse

router = APIRouter()

REPO_ROOT = Path(__file__).resolve().parents[2]
NOTEBOOK_TEMPLATES_DIR = Path(os.environ.get("HYDRA_NOTEBOOK_TEMPLATES", REPO_ROOT / "notebooks"))
JUPYTER_SESSIONS_PATH = os.environ.get("HYDRA_JUPYTER_SESSIONS_PATH", "data/jupyter_sessions").strip("/")
COOKIE_NAME = "hydra_jupyter_session"
SESSION_RE = re.compile(r"^[a-zA-Z0-9_-]{12,80}$")

# In Azure Container Apps all sidecars share the same network namespace, so
# Jupyter is reachable on localhost.  Override with JUPYTER_INTERNAL_URL for
# Docker Compose (http://jupyter:8888) or other environments.
JUPYTER_INTERNAL_URL = os.environ.get("JUPYTER_INTERNAL_URL", "http://127.0.0.1:8888").rstrip("/")

_SKIP_NAMES = {".ipynb_checkpoints", "__pycache__", "build", "dist"}
# Strips accidental session-prefixed paths such as:
#   data/jupyter_sessions/<id>/notebooks/path.ipynb
#   <id>/notebooks/path.ipynb   (legacy)
_SESSION_PREFIX_RE = re.compile(
    r"^(?:data/jupyter_sessions/)?[0-9a-f]{32}/notebooks/"
)


def _safe_relative_notebook(path: str) -> Path:
    path = _SESSION_PREFIX_RE.sub("", path)
    path = path.removeprefix("notebooks/")
    relative = Path(path)
    if relative.is_absolute() or ".." in relative.parts or not str(relative).endswith(".ipynb"):
        raise HTTPException(status_code=400, detail="Invalid notebook path")

    template_path = (NOTEBOOK_TEMPLATES_DIR / relative).resolve()
    try:
        template_path.relative_to(NOTEBOOK_TEMPLATES_DIR.resolve())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid notebook path") from exc

    if not template_path.exists():
        raise HTTPException(status_code=404, detail=f"Notebook not found: {path}")
    return relative


def _new_session_id() -> str:
    return uuid.uuid4().hex


def _valid_or_new_session(session_id: str | None, force_new: bool) -> str:
    if force_new or not session_id or not SESSION_RE.match(session_id):
        return _new_session_id()
    return session_id


def _contents_url(path: str) -> str:
    return f"{JUPYTER_INTERNAL_URL}/jupyter/api/contents/{path}"


def _session_root(session_id: str) -> str:
    if not JUPYTER_SESSIONS_PATH:
        return session_id
    return f"{JUPYTER_SESSIONS_PATH}/{session_id}"


async def _jupyter_mkdir(client: httpx.AsyncClient, path: str) -> None:
    if not path:
        return

    existing = await client.get(_contents_url(path))
    if existing.status_code == 200:
        return

    resp = await client.put(_contents_url(path), json={"type": "directory"})
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Jupyter mkdir failed for '{path}': {resp.status_code} {resp.text[:200]}",
        )


async def _jupyter_upload_notebook(client: httpx.AsyncClient, dest_path: str, src: Path) -> None:
    content = json.loads(src.read_bytes())
    resp = await client.put(
        _contents_url(dest_path),
        json={"type": "notebook", "format": "json", "content": content},
    )
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Jupyter upload failed for '{dest_path}': {resp.status_code} {resp.text[:200]}",
        )


async def _jupyter_get_notebook(client: httpx.AsyncClient, dest_path: str) -> dict | None:
    resp = await client.get(_contents_url(dest_path))
    if resp.status_code == 404:
        return None
    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Jupyter read failed for '{dest_path}': {resp.status_code} {resp.text[:200]}",
        )
    payload = resp.json()
    content = payload.get("content")
    return content if isinstance(content, dict) else None


def _notebook_source_text(nb: dict) -> str:
    chunks: list[str] = []
    for cell in nb.get("cells", []):
        source = cell.get("source", "")
        chunks.append("".join(source) if isinstance(source, list) else str(source))
    return "\n".join(chunks)


async def _refresh_requested_notebook_if_stale(
    client: httpx.AsyncClient,
    session_id: str,
    relative: Path,
) -> None:
    """Refresh known stale session notebooks without wiping user sessions."""
    dest = f"{_session_root(session_id)}/notebooks/{relative.as_posix()}"
    current = await _jupyter_get_notebook(client, dest)
    if current is None:
        await _bootstrap_session(client, session_id, relative)
        return

    # Migration for the HMS notebook fixed after sessions already existed:
    # old copies write into /workspace/data/hms/Tifton, now read-only in Azure,
    # or report hard-coded calibration metrics that were later removed.
    if relative.as_posix() == "modeling/hydrology/HEC_HMS.ipynb":
        current_text = _notebook_source_text(current)
        template = json.loads((NOTEBOOK_TEMPLATES_DIR / relative).read_bytes())
        template_text = _notebook_source_text(template)
        stale_markers = [
            "PATH_MODEL    = '/workspace/data/hms/Tifton/'",
            "Evaluate final calibrated parameter set",
            "Calibration performance summary",
            "Reference performance (LREW 74006",
            "Cal (Jan-Apr 1970)",
            "CN_mult",
            "Ia_mult",
            "spotpy_setup_cn",
            "RUN:CAL",
        ]
        template_is_current = (
            "SOURCE_MODEL = Path('/workspace/data/hms/Tifton')" in template_text
            and "No calibrated parameter set is reported." in template_text
            and "CalibratableHMSModel" in template_text
        )
        if template_is_current and any(marker in current_text for marker in stale_markers):
            await _jupyter_upload_notebook(client, dest, NOTEBOOK_TEMPLATES_DIR / relative)

    # Migration for Notebook 08 after Azure data was mounted read-only:
    # old session copies tried to save generated outputs and temporary flood-map
    # simulations under /workspace/data/pilot_cases/.../processed.
    if relative.as_posix() == "pilot_cases/los_corrales_buelna/08_hybrid_return_periods.ipynb":
        current_text = _notebook_source_text(current)
        template = json.loads((NOTEBOOK_TEMPLATES_DIR / relative).read_bytes())
        template_text = _notebook_source_text(template)
        current_markers = [
            "SHARED_OUT_DIR = PROC_DIR / 'cc_scenarios'",
            "SIMUL_DIR     = OUT_DIR / 'flood_maps' / 'simulations'",
            "Do not copy them",
            "ignore=shutil.ignore_patterns('*.hdf'",
            "RUN_GIS_PLOTS",
        ]
        template_is_current = all(marker in template_text for marker in current_markers)
        session_is_stale = any(marker not in current_text for marker in current_markers)
        if template_is_current and session_is_stale:
            await _jupyter_upload_notebook(client, dest, NOTEBOOK_TEMPLATES_DIR / relative)

    # Migration for Besaya pilot-case notebooks after shared data became
    # read-only in Azure. Generated CSV/PNG/TIF outputs belong in the isolated
    # Jupyter session copy, while /workspace/data remains the shared input tree.
    besaya_session_output_notebooks = {
        "pilot_cases/los_corrales_buelna/01_data_acquisition.ipynb",
        "pilot_cases/los_corrales_buelna/02_spatial_interpolation.ipynb",
        "pilot_cases/los_corrales_buelna/03_extreme_value_analysis.ipynb",
        "pilot_cases/los_corrales_buelna/04_design_storm_hms.ipynb",
        "pilot_cases/los_corrales_buelna/05_continuous_simulation.ipynb",
        "pilot_cases/los_corrales_buelna/06_hybrid_event_reconstruction.ipynb",
        "pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics.ipynb",
        "pilot_cases/los_corrales_buelna/08_hybrid_return_periods.ipynb",
    }
    if relative.as_posix() in besaya_session_output_notebooks:
        current_text = _notebook_source_text(current)
        template = json.loads((NOTEBOOK_TEMPLATES_DIR / relative).read_bytes())
        template_text = _notebook_source_text(template)
        current_markers = [
            "SESSION_DATA_ROOT = SESSION_ROOT / 'data' / 'pilot_cases' / 'los_corrales_buelna'",
        ]
        extra_markers = {
            "pilot_cases/los_corrales_buelna/05_continuous_simulation.ipynb": [
                "HEC-HMS continuous setup skipped",
            ],
            "pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics.ipynb": [
                "RUN_HEC_RAS",
                "HEC-RAS no ejecutado en modo publico",
            ],
        }
        current_markers.extend(extra_markers.get(relative.as_posix(), []))
        template_is_current = all(marker in template_text for marker in current_markers)
        session_is_stale = any(marker not in current_text for marker in current_markers)
        if template_is_current and session_is_stale:
            await _jupyter_upload_notebook(client, dest, NOTEBOOK_TEMPLATES_DIR / relative)

    # Same isolation rule for the Valencia DANA pilot notebooks: derived CSVs
    # are session artifacts, not writes to the shared input data volume.
    valencia_session_output_notebooks = {
        "pilot_cases/valencia_dana/01_data_exploration.ipynb",
        "pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb",
    }
    if relative.as_posix() in valencia_session_output_notebooks:
        current_text = _notebook_source_text(current)
        template = json.loads((NOTEBOOK_TEMPLATES_DIR / relative).read_bytes())
        template_text = _notebook_source_text(template)
        current_markers = [
            "SESSION_DATA_ROOT = SESSION_ROOT / 'data' / 'pilot_cases' / 'valencia_dana'",
            "Valencia session output guard",
        ]
        template_is_current = all(marker in template_text for marker in current_markers)
        session_is_stale = any(marker not in current_text for marker in current_markers)
        if template_is_current and session_is_stale:
            await _jupyter_upload_notebook(client, dest, NOTEBOOK_TEMPLATES_DIR / relative)

    # Public data-source notebooks must not launch remote downloads or write to
    # shared data by default. Refresh older session copies that predate the
    # HYDRA_RUN_DOWNLOADS guards.
    guarded_download_notebooks = {
        "data_sources/climate_change/CDS_download.ipynb",
        "data_sources/climate_change/ESGF_download.ipynb",
        "data_sources/rainfall/AEMET_download.ipynb",
        "data_sources/rainfall/GPM_download.ipynb",
        "data_sources/rainfall/Meteostat_download.ipynb",
        "data_sources/rainfall/PERSSIAN_download.ipynb",
        "data_sources/river_discharge/GloFAS_download.ipynb",
        "data_sources/river_discharge/USGS_download.ipynb",
    }
    if relative.as_posix() in guarded_download_notebooks:
        current_text = _notebook_source_text(current)
        template = json.loads((NOTEBOOK_TEMPLATES_DIR / relative).read_bytes())
        template_text = _notebook_source_text(template)
        current_markers = [
            "HYDRA_RUN_DOWNLOADS",
            "public mode",
        ]
        template_is_current = all(marker in template_text for marker in current_markers)
        session_is_stale = any(marker not in current_text for marker in current_markers)
        if template_is_current and session_is_stale:
            await _jupyter_upload_notebook(client, dest, NOTEBOOK_TEMPLATES_DIR / relative)


async def _jupyter_upload_file(client: httpx.AsyncClient, dest_path: str, src: Path) -> None:
    encoded = base64.b64encode(src.read_bytes()).decode()
    resp = await client.put(
        _contents_url(dest_path),
        json={"type": "file", "format": "base64", "content": encoded},
    )
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Jupyter upload failed for '{dest_path}': {resp.status_code} {resp.text[:200]}",
        )


async def _session_exists(client: httpx.AsyncClient, session_id: str) -> bool:
    resp = await client.get(_contents_url(f"{_session_root(session_id)}/ready.txt"))
    return resp.status_code == 200


async def _prepare_session(client: httpx.AsyncClient, session_id: str) -> None:
    """
    Mirror the full notebooks tree into the session via Jupyter's Contents API.
    Writes ready.txt last; absence of the sentinel causes a full retry.
    Called in a background task so it never blocks the HTTP response.
    """
    if await _session_exists(client, session_id):
        return

    session_root = _session_root(session_id)
    notebooks_base = f"{session_root}/notebooks"

    await _jupyter_mkdir(client, JUPYTER_SESSIONS_PATH)
    await _jupyter_mkdir(client, session_root)
    await _jupyter_mkdir(client, notebooks_base)
    await _jupyter_mkdir(client, f"{session_root}/data")

    created_dirs: set[str] = {notebooks_base}

    for src in sorted(NOTEBOOK_TEMPLATES_DIR.rglob("*")):
        if src.is_dir():
            continue
        if any(part in _SKIP_NAMES for part in src.parts):
            continue
        if src.suffix in {".pyc", ".pyo"}:
            continue

        rel = src.relative_to(NOTEBOOK_TEMPLATES_DIR)
        dest = f"{notebooks_base}/{rel.as_posix()}"

        parts = rel.parts[:-1]
        for i in range(len(parts)):
            dir_path = f"{notebooks_base}/{'/'.join(parts[:i+1])}"
            if dir_path not in created_dirs:
                await _jupyter_mkdir(client, dir_path)
                created_dirs.add(dir_path)

        if src.suffix == ".ipynb":
            await _jupyter_upload_notebook(client, dest, src)
        else:
            await _jupyter_upload_file(client, dest, src)

    resp = await client.put(
        _contents_url(f"{session_root}/ready.txt"),
        json={"type": "file", "format": "base64", "content": ""},
    )
    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail="Jupyter session sentinel write failed")


async def _bootstrap_session(client: httpx.AsyncClient, session_id: str, relative: Path) -> None:
    """
    Fast path: create the session skeleton and upload only the one requested
    notebook so the redirect target exists immediately.  The full tree is
    copied by _fill_session_background after the response is returned.
    """
    session_root = _session_root(session_id)
    notebooks_base = f"{session_root}/notebooks"

    await _jupyter_mkdir(client, JUPYTER_SESSIONS_PATH)
    await _jupyter_mkdir(client, session_root)
    await _jupyter_mkdir(client, notebooks_base)
    await _jupyter_mkdir(client, f"{session_root}/data")

    # Create subdirectory chain for the requested notebook.
    parts = relative.parts[:-1]
    created: set[str] = {notebooks_base}
    for i in range(len(parts)):
        d = f"{notebooks_base}/{'/'.join(parts[:i+1])}"
        if d not in created:
            await _jupyter_mkdir(client, d)
            created.add(d)

    src = NOTEBOOK_TEMPLATES_DIR / relative
    await _jupyter_upload_notebook(client, f"{notebooks_base}/{relative.as_posix()}", src)
    # ready.txt is NOT written here; _fill_session_background does it once
    # the full tree is in place.


async def _fill_session_background(session_id: str) -> None:
    """Background task: copy all remaining notebooks and write the sentinel."""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            await _prepare_session(client, session_id)
    except Exception:
        pass  # Background failures are non-fatal; next request will retry.


@router.get("/session")
async def open_notebook_session(
    path: str = Query(..., description="Notebook path relative to the HYDRA notebooks directory"),
    new: bool = Query(False, description="Create a new clean anonymous workspace"),
    hydra_jupyter_session: str | None = Cookie(default=None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):
    relative = _safe_relative_notebook(path)
    session_id = _valid_or_new_session(hydra_jupyter_session, new)

    async with httpx.AsyncClient(timeout=30.0) as client:
        if await _session_exists(client, session_id):
            # Session already fully populated — redirect immediately.
            await _refresh_requested_notebook_if_stale(client, session_id, relative)
        else:
            # Upload just the requested notebook so the redirect target exists,
            # then finish copying the rest after the response is sent.
            await _bootstrap_session(client, session_id, relative)
            background_tasks.add_task(_fill_session_background, session_id)

    target = f"/jupyter/lab/tree/{_session_root(session_id)}/notebooks/{relative.as_posix()}"
    response = RedirectResponse(url=target, status_code=303)
    response.set_cookie(
        COOKIE_NAME,
        session_id,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
    )
    return response
