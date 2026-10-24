"""Regenerate api/notebook_history.json.

For every notebook under notebooks/ it lists the content hashes of all the
versions that were ever committed, plus the working-tree version.  The API uses
it to tell a session copy that is an unmodified older release (safe to refresh)
from one the user edited (left alone).

Run it before each release, with the full git history available:

    python scripts/gen_notebook_history.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from api.notebook_hash import notebook_hash  # noqa: E402

OUT = ROOT / "api" / "notebook_history.json"


def _git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, check=True, capture_output=True,
                          text=True).stdout


def main() -> None:
    paths = sorted(set(_git("log", "--all", "--name-only", "--format=", "--",
                            "notebooks/*.ipynb").split()))
    history: dict[str, list[str]] = {}
    for path in paths:
        if not path.endswith(".ipynb"):
            continue
        hashes: list[str] = []
        for commit in _git("log", "--all", "--format=%H", "--", path).split():
            blob = subprocess.run(["git", "show", f"{commit}:{path}"], cwd=ROOT,
                                  capture_output=True)
            if blob.returncode != 0:
                continue
            try:
                h = notebook_hash(json.loads(blob.stdout))
            except ValueError:
                continue
            if h not in hashes:
                hashes.append(h)
        current = ROOT / path
        if current.exists():
            h = notebook_hash(json.loads(current.read_bytes()))
            if h not in hashes:
                hashes.append(h)
        if hashes:
            history[path.removeprefix("notebooks/")] = hashes
    OUT.write_text(json.dumps(history, indent=0, sort_keys=True) + "\n")
    print(f"{len(history)} notebooks, {sum(map(len, history.values()))} versions -> {OUT}")


if __name__ == "__main__":
    main()
