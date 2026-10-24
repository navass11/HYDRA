"""Session notebooks: unmodified older releases are refreshed, user edits are kept."""

import asyncio
import copy
import json
from pathlib import Path

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")

from api.notebook_hash import notebook_hash
from api.routers import notebooks as nbr

REL = Path("pilot_cases/valencia_dana/03_real_regional_study_pyhydra.ipynb")
ROOT = Path(__file__).resolve().parents[1]


def _template():
    return json.loads((nbr.NOTEBOOK_TEMPLATES_DIR / REL).read_bytes())


def _refresh(monkeypatch, session_nb):
    uploads = []

    async def get(client, dest):
        return session_nb

    async def put(client, dest, src):
        uploads.append(dest)

    monkeypatch.setattr(nbr, "_jupyter_get_notebook", get)
    monkeypatch.setattr(nbr, "_jupyter_upload_notebook", put)
    asyncio.run(nbr._refresh_requested_notebook_if_stale(None, "s" * 32, REL))
    return uploads


def _with_source(nb, text):
    nb = copy.deepcopy(nb)
    cell = next(c for c in nb["cells"] if c["cell_type"] == "code")
    cell["source"] = text
    return nb


def test_hash_ignores_outputs():
    nb = _template()
    ran = copy.deepcopy(nb)
    for cell in ran["cells"]:
        if cell["cell_type"] == "code":
            cell["outputs"] = [{"output_type": "stream", "name": "stdout", "text": "x"}]
            cell["execution_count"] = 7
    assert notebook_hash(ran) == notebook_hash(nb)
    assert notebook_hash(_with_source(nb, "x = 1")) != notebook_hash(nb)


def test_history_lists_every_current_notebook():
    history = json.loads((ROOT / "api" / "notebook_history.json").read_text())
    for path in (ROOT / "notebooks").rglob("*.ipynb"):
        if ".ipynb_checkpoints" in path.parts:
            continue
        rel = path.relative_to(ROOT / "notebooks").as_posix()
        h = notebook_hash(json.loads(path.read_bytes()))
        assert h in history.get(rel, []), f"{rel}: run scripts/gen_notebook_history.py"


def test_current_copy_is_left_alone(monkeypatch):
    assert _refresh(monkeypatch, _template()) == []


def test_old_release_is_replaced(monkeypatch):
    old = _with_source(_template(), "ax.boxplot(box_data, labels=names)")
    monkeypatch.setattr(nbr, "_released_hashes", lambda rel: {notebook_hash(old)})
    assert len(_refresh(monkeypatch, old)) == 1


def test_user_edit_is_kept(monkeypatch):
    edited = _with_source(_template(), "my_own_analysis()")
    assert _refresh(monkeypatch, edited) == []
