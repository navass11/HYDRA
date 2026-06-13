#!/usr/bin/env python3
"""
Batch download OGIMET SYNOP data for the 20 nearest stations to Los Corrales de Buelna.
Period: 1970-01-01 to 2024-12-31.
Output: data/ogimet/  (station_*.csv  +  series_*.csv per station)
"""

import sys
import time
from pathlib import Path
from datetime import datetime

# Resolve repo root
REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))

import pandas as pd
from pyhydra.data_sources.rainfall.ogimet import (
    download_synop,
    process_all_meteorological_variables,
    normalize_filename,
)

# ── 20 nearest SYNOP stations to Los Corrales de Buelna ──────────────────────
STATIONS = [
    {"IIiii": "08021", "Nombre": "Santander / Parayas",   "dist_km": 26.6},
    {"IIiii": "08032", "Nombre": "Nestares",               "dist_km": 30.1},
    {"IIiii": "08017", "Nombre": "San Vicente - Faro",     "dist_km": 31.9},
    {"IIiii": "08023", "Nombre": "Santander",              "dist_km": 33.5},
    {"IIiii": "08061", "Nombre": "Alto Campoo",            "dist_km": 35.4},
    {"IIiii": "08033", "Nombre": "Polientes-Casyc",        "dist_km": 50.2},
    {"IIiii": "08058", "Nombre": "Cervera De Pisuerga",    "dist_km": 56.9},
    {"IIiii": "08063", "Nombre": "Medina De Pomar",        "dist_km": 58.9},
    {"IIiii": "08016", "Nombre": "Llanes",                 "dist_km": 59.5},
    {"IIiii": "08020", "Nombre": "Castro Urdiales",        "dist_km": 68.0},
    {"IIiii": "08035", "Nombre": "Güeñes",                 "dist_km": 76.8},
    {"IIiii": "08059", "Nombre": "Punta Galea",            "dist_km": 84.4},
    {"IIiii": "08025", "Nombre": "Bilbao / Sondica",       "dist_km": 92.8},
    {"IIiii": "08081", "Nombre": "Bakio",                  "dist_km": 99.2},
    {"IIiii": "08075", "Nombre": "Burgos / Villafría",     "dist_km": 105.4},
    {"IIiii": "08057", "Nombre": "Puerto De San Isidro",   "dist_km": 109.6},
    {"IIiii": "08068", "Nombre": "Carrion De Los Conde",   "dist_km": 110.2},
    {"IIiii": "08080", "Nombre": "Vitoria",                "dist_km": 114.9},
    {"IIiii": "08077", "Nombre": "Belorado",               "dist_km": 116.8},
    {"IIiii": "08024", "Nombre": "Lekeitio - faro",        "dist_km": 125.4},
]

START_DATE = "1970-01-01"
END_DATE   = "2024-12-31"
OUTPUT_DIR = REPO / "data" / "ogimet"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

LOG_FILE = OUTPUT_DIR / "download_log.txt"


def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


log(f"=== OGIMET batch download started ===")
log(f"Stations: {len(STATIONS)}")
log(f"Period: {START_DATE} → {END_DATE}")
log(f"Output: {OUTPUT_DIR}")

for i, st in enumerate(STATIONS, 1):
    sid    = st["IIiii"]
    nombre = st["Nombre"]
    safe   = normalize_filename(nombre)

    series_path  = OUTPUT_DIR / f"series_{sid}.csv"
    station_path = OUTPUT_DIR / f"station_{sid}.csv"

    if series_path.exists():
        log(f"[{i}/{len(STATIONS)}] {sid} {nombre} — ya existe, saltando")
        continue

    log(f"[{i}/{len(STATIONS)}] Descargando {sid} {nombre} ({st['dist_km']:.1f} km)...")

    try:
        raw = download_synop(sid, START_DATE, END_DATE)
        if raw is None or raw.empty:
            log(f"  → Sin datos")
            continue

        # Process all meteorological variables
        processed = process_all_meteorological_variables(raw)
        processed.to_csv(series_path)
        log(f"  → {len(processed)} filas guardadas en {series_path.name}")

        # Save station metadata
        meta = pd.DataFrame([{
            "station_id":  sid,
            "name":        nombre,
            "dist_km":     st["dist_km"],
            "start_date":  START_DATE,
            "end_date":    END_DATE,
            "n_rows":      len(processed),
        }])
        meta.to_csv(station_path, index=False)

    except Exception as exc:
        log(f"  → ERROR: {exc}")

    time.sleep(2)  # extra delay between stations

log("=== Descarga completada ===")
