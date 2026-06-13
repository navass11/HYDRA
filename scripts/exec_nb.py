#!/usr/bin/env python3
"""
Execute a Jupyter notebook cell by cell using exec() — no kernel needed.
Writes captured stdout/stderr back into cell outputs so the notebook reflects
the actual run. Cells tagged 'skip' or starting with %% magic are skipped.

Usage:
    python exec_nb.py <notebook.ipynb> [--timeout 300]

Exit codes:
    0  all cells OK (warnings allowed)
    1  at least one cell raised an exception
"""

import argparse
import io
import json
import math
import os
import sys
import traceback
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path


class _CaptureIO(io.StringIO):
    """StringIO that delegates fileno/isatty so rich/hydromt don't crash."""
    def __init__(self, original=None):
        super().__init__()
        self._original = original

    def fileno(self):
        if self._original is not None:
            try:
                return self._original.fileno()
            except (io.UnsupportedOperation, AttributeError):
                pass
        return 1

    def isatty(self):
        return False


def _strip_magic(src):
    """Remove IPython magic lines that plain Python can't exec."""
    lines = []
    for line in src.splitlines(keepends=True):
        stripped = line.lstrip()
        if stripped.startswith('%') or stripped.startswith('!'):
            lines.append('# [magic skipped] ' + line)
        else:
            lines.append(line)
    return ''.join(lines)


def _json_safe(obj):
    """Replace non-standard JSON floats so executed notebooks stay parseable."""
    if isinstance(obj, float):
        return None if not math.isfinite(obj) else obj
    if isinstance(obj, list):
        return [_json_safe(item) for item in obj]
    if isinstance(obj, dict):
        return {key: _json_safe(value) for key, value in obj.items()}
    return obj


def run_notebook(nb_path, timeout=300):
    nb_path = Path(nb_path).resolve()
    nb = json.loads(nb_path.read_text())

    # Mirror Jupyter: run the notebook with CWD = notebook's directory
    original_dir = os.getcwd()
    os.chdir(nb_path.parent)

    # Pre-populate namespace with common Jupyter builtins
    try:
        from IPython.display import display
    except ImportError:
        display = print
    ns = {'__name__': '__main__', 'display': display}
    errors = []
    cell_idx = 0

    for cell in nb['cells']:
        if cell['cell_type'] != 'code':
            continue
        src = ''.join(cell['source'])
        if not src.strip():
            cell['outputs'] = []
            continue

        tags = cell.get('metadata', {}).get('tags', [])
        if 'skip' in tags:
            cell['outputs'] = [{'output_type': 'stream', 'name': 'stdout',
                                 'text': '[cell skipped by tag]\n'}]
            cell_idx += 1
            continue

        src_exec = _strip_magic(src)
        cell_idx += 1
        cell['execution_count'] = cell_idx

        stdout_buf = _CaptureIO(sys.__stdout__)
        stderr_buf = _CaptureIO(sys.__stderr__)
        outputs = []

        try:
            with redirect_stdout(stdout_buf), redirect_stderr(stderr_buf):
                exec(compile(src_exec, f'<cell {cell_idx}>', 'exec'), ns)
            ok = True
        except Exception:
            ok = False
            tb = traceback.format_exc()
            stderr_buf.write(tb)
            errors.append((cell_idx, tb.strip().splitlines()[-1]))

        out = stdout_buf.getvalue()
        err = stderr_buf.getvalue()

        if out:
            outputs.append({'output_type': 'stream', 'name': 'stdout', 'text': out})
        if err:
            outputs.append({'output_type': 'stream', 'name': 'stderr', 'text': err})
        if not ok:
            outputs.append({
                'output_type': 'error',
                'ename': 'ExecutionError',
                'evalue': errors[-1][1],
                'traceback': [],
            })

        cell['outputs'] = outputs

        # Status line
        first_line = src.splitlines()[0][:60] if src.strip() else ''
        status = 'OK ' if ok else 'ERR'
        print(f'  [{status}] cell {cell_idx:3d}: {first_line}', flush=True)

    nb_path.write_text(json.dumps(_json_safe(nb), ensure_ascii=False, indent=1, allow_nan=False))
    os.chdir(original_dir)

    if errors:
        print(f'\n  {len(errors)} error(s):', file=sys.stderr)
        for idx, msg in errors:
            print(f'    cell {idx}: {msg}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('notebook')
    parser.add_argument('--timeout', type=int, default=300)
    args = parser.parse_args()

    sys.exit(run_notebook(args.notebook, timeout=args.timeout))
