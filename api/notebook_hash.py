"""Fingerprint of a notebook's authored content (outputs and metadata ignored)."""

from __future__ import annotations

import hashlib


def notebook_hash(nb: dict) -> str:
    """Hash the code and markdown sources of *nb*.

    Running a notebook only changes outputs, execution counts and metadata, so
    a session copy that was executed but not edited keeps the hash of the
    version it was copied from.
    """
    h = hashlib.sha256()
    for cell in nb.get("cells", []):
        if cell.get("cell_type") not in ("code", "markdown"):
            continue
        source = cell.get("source", "")
        text = "".join(source) if isinstance(source, list) else str(source)
        h.update(cell["cell_type"].encode() + b"\0" + text.encode("utf-8") + b"\0\0")
    return h.hexdigest()[:20]
