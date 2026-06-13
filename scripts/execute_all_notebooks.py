#!/usr/bin/env python3
"""Execute HYDRA notebooks for release images.

This script is intentionally batch-oriented: it executes notebooks one by one,
records a JSON report, and returns a non-zero exit code if any notebook fails or
times out. It uses scripts/exec_nb.py so it does not start a Jupyter server or
leave interactive kernels behind.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import time
from pathlib import Path


DEFAULT_EXCLUDES: set[str] = set()
    # Notebooks that require external proprietary/large model software or
    # credentials should be made self-contained before enabling in release.


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--timeout", type=int, default=900, help="Seconds per notebook")
    parser.add_argument(
        "--report",
        default="notebooks/execution_report.json",
        help="JSON report path, relative to root unless absolute",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help="Notebook path to exclude, relative to root. Can be repeated.",
    )
    parser.add_argument(
        "--start-at",
        default="",
        help="Start execution at this notebook path, relative to root.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    report_path = Path(args.report)
    if not report_path.is_absolute():
        report_path = root / report_path

    excludes = DEFAULT_EXCLUDES | set(args.exclude)
    notebooks = [
        p for p in sorted((root / "notebooks").rglob("*.ipynb"))
        if str(p.relative_to(root)) not in excludes
    ]
    if args.start_at:
        try:
            start_index = [str(p.relative_to(root)) for p in notebooks].index(args.start_at)
        except ValueError as exc:
            raise SystemExit(f"--start-at notebook not found: {args.start_at}") from exc
        notebooks = notebooks[start_index:]

    results = []
    started = time.time()
    print(f"Executing {len(notebooks)} notebooks", flush=True)

    for nb in notebooks:
        rel = str(nb.relative_to(root))
        t0 = time.time()
        print(f"RUN {rel}", flush=True)
        try:
            cp = subprocess.run(
                ["python", "scripts/exec_nb.py", rel, "--timeout", str(args.timeout)],
                cwd=root,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                timeout=args.timeout,
            )
            output = cp.stdout
            status = "ok" if cp.returncode == 0 else "failed"
        except subprocess.TimeoutExpired as exc:
            partial = exc.stdout or ""
            if isinstance(partial, bytes):
                partial = partial.decode("utf-8", errors="replace")
            output = partial + "\n[TIMEOUT]\n"
            status = "timeout"

        seconds = round(time.time() - t0, 1)
        results.append({
            "notebook": rel,
            "status": status,
            "seconds": seconds,
            "output_tail": output[-4000:],
        })
        print(f"{status.upper()} {seconds}s {rel}", flush=True)

    report = {
        "total": len(results),
        "ok": sum(r["status"] == "ok" for r in results),
        "failed": sum(r["status"] == "failed" for r in results),
        "timeout": sum(r["status"] == "timeout" for r in results),
        "seconds": round(time.time() - started, 1),
        "results": results,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({k: report[k] for k in ("total", "ok", "failed", "timeout", "seconds")}, indent=2))
    return 0 if report["failed"] == 0 and report["timeout"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
