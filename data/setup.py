#!/usr/bin/env python3
"""
Download all publicly available example model data for the HYDRA modeling notebooks.

Usage (inside Docker or locally):
    python data/setup.py

What gets downloaded:
  data/swat/lrew/          SWAT+ Little River Experimental Watershed (Georgia, USA)
                            Source: github.com/chrisschuerz/SWATdata
  data/sfincs/             SFINCS test case (Zenodo record 13691724, Deltares)
  data/hms/                (no public standalone download — see README.md)
  data/hec_ras/            (no public standalone download — see README.md)
"""

import os
import sys
import zipfile
import shutil
import urllib.request
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent


def step(msg):
    print(f"\n{'='*60}")
    print(f"  {msg}")
    print('='*60)


# ─────────────────────────────────────────────────────────────────────────────
# SWAT+ — Little River Experimental Watershed (LREW)
# ─────────────────────────────────────────────────────────────────────────────
def download_swat_lrew():
    step("SWAT+ — Little River Experimental Watershed (LREW)")

    try:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "SWATdata"])
        from SWATdata import load_demo
        lrew_path = load_demo(dataset="LREW", project=True)
        dest = DATA_DIR / "swat" / "lrew"
        if dest.exists():
            shutil.rmtree(dest)
        shutil.copytree(lrew_path, dest)
        print(f"✓  LREW copied to {dest}")
        return True
    except Exception as e:
        print(f"⚠  SWATdata method failed ({e}), trying direct GitHub download…")

    # Fallback: download from GitHub releases
    url  = "https://github.com/chrisschuerz/SWATdata/archive/refs/heads/main.zip"
    dest = DATA_DIR / "swat" / "lrew"
    dest.mkdir(parents=True, exist_ok=True)
    tmp_zip = DATA_DIR / "swat" / "lrew_tmp.zip"

    try:
        print(f"  Downloading {url} …")
        urllib.request.urlretrieve(url, tmp_zip)
        with zipfile.ZipFile(tmp_zip) as z:
            # Extract only the LREW TxtInOut folder
            lrew_members = [m for m in z.namelist() if "LREW" in m]
            z.extractall(DATA_DIR / "swat" / "_tmp", members=lrew_members)
        # Move to final location
        extracted_root = next((DATA_DIR / "swat" / "_tmp").iterdir())
        lrew_src = next((p for p in extracted_root.rglob("TxtInOut") if "LREW" in str(p)), None)
        if lrew_src:
            if dest.exists():
                shutil.rmtree(dest)
            shutil.copytree(lrew_src.parent, dest)
            print(f"✓  LREW extracted to {dest}")
        shutil.rmtree(DATA_DIR / "swat" / "_tmp", ignore_errors=True)
        tmp_zip.unlink(missing_ok=True)
        return True
    except Exception as e:
        print(f"✗  Could not download LREW: {e}")
        return False


# ─────────────────────────────────────────────────────────────────────────────
# SFINCS — Deltares test case (Zenodo 13691724)
# ─────────────────────────────────────────────────────────────────────────────
def download_sfincs():
    step("SFINCS — Deltares test case (Zenodo)")

    dest    = DATA_DIR / "sfincs"
    dest.mkdir(parents=True, exist_ok=True)
    tmp_zip = dest / "sfincs_testcase.zip"

    # Zenodo record: https://zenodo.org/records/13691724
    url = "https://zenodo.org/records/13691724/files/sfincs_testcase.zip?download=1"

    try:
        print(f"  Downloading SFINCS test case from Zenodo…")
        urllib.request.urlretrieve(url, tmp_zip)
        with zipfile.ZipFile(tmp_zip) as z:
            z.extractall(dest)
        tmp_zip.unlink(missing_ok=True)
        print(f"✓  SFINCS test case extracted to {dest}")
        return True
    except Exception as e:
        print(f"⚠  Zenodo download failed ({e}), trying hydromt_sfincs example…")

    # Fallback: use hydromt_sfincs to build a minimal example from public data
    try:
        from hydromt_sfincs import SfincsModel
        model_dir = str(dest / "hydromt_example")
        sf = SfincsModel(data_libs=["deltares_data"], root=model_dir, mode="w")
        sf.setup_grid(
            x0=0, y0=0, dx=50, dy=50, nmax=100, mmax=100,
            rotation=0, epsg=32636,
        )
        sf.write()
        print(f"✓  Minimal SFINCS model built at {model_dir}")
        return True
    except Exception as e:
        print(f"✗  Could not set up SFINCS example: {e}")
        return False


# ─────────────────────────────────────────────────────────────────────────────
# HEC-HMS / HEC-RAS — create placeholder folder with README
# ─────────────────────────────────────────────────────────────────────────────
def create_hms_placeholder():
    step("HEC-HMS — placeholder (Windows-only software)")
    dest = DATA_DIR / "hms" / "Punxsutawney"
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "README.txt").write_text(
        "Place your HEC-HMS Punxsutawney project files here.\n"
        "Source: HEC-HMS → Help → Sample Projects → Punxsutawney\n"
        "Note: HEC-HMS execution requires Windows. The pyhydra functions\n"
        "for reading and generating input files work on any OS.\n"
    )
    print(f"✓  Placeholder created at {dest}")


def create_ras_placeholder():
    step("HEC-RAS — placeholder (Windows-only software)")
    dest = DATA_DIR / "hec_ras" / "Muncie"
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "README.txt").write_text(
        "Place your HEC-RAS Muncie 2D project files here.\n"
        "Source: HEC-RAS → Help → Example Data Sets → 2D Unsteady → Muncie_2D\n"
        "Note: HEC-RAS execution requires Windows.\n"
    )
    print(f"✓  Placeholder created at {dest}")


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("HYDRA — model example data setup")
    print(f"Data directory: {DATA_DIR}\n")

    results = {
        "SWAT+ LREW"    : download_swat_lrew(),
        "SFINCS"        : download_sfincs(),
    }
    create_hms_placeholder()
    create_ras_placeholder()

    print("\n" + "="*60)
    print("  Summary")
    print("="*60)
    for name, ok in results.items():
        print(f"  {'✓' if ok else '✗'}  {name}")
    print("\nAdd this step to your Docker build or run it once inside the container:")
    print("  docker compose exec jupyter python /workspace/data/setup.py")
