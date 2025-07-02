"""
Author: Salvador Navas
Date: 2025-06-27
"""

import requests
import pandas as pd
from itertools import product
import sys
import tqdm
import os
import requests
import xarray as xr
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import re
import gc
import time


# === SERVIDORES ESGF ===
ESGF_NODES = [
    "https://esgf.nci.org.au/esg-search/search"
    "https://esgf-ui.ceda.ac.uk/esg-search/search"
    "https://esgf-node.llnl.gov/esg-search/search",
    "https://esgf-data.dkrz.de/esg-search/search",
    "https://esgf-node.ipsl.upmc.fr/esg-search/search",
    "https://esgf-node.ornl.gov/esg-search/search"
]

# === FUNCIONES BASE ===

def try_esgf_request(payload):
    headers = {"Accept": "application/solr+json"}
    for server in ESGF_NODES:
        try:
            r = requests.get(server, params=payload, headers=headers, timeout=30)
            r.raise_for_status()
            return r.json()["response"]["docs"]
        except requests.RequestException:
            continue
    raise RuntimeError("❌ No se pudo contactar con ningún nodo ESGF válido.")

def get_dataset_metadata(filters, limit=5000):
    payload = {
        "type": "Dataset",
        "format": "application/solr+json",
        "distrib": "true",
        "limit": 1000,
    }

    for key, val in filters.items():
        payload[key] = val if isinstance(val, list) else [val]

    all_datasets = []
    offset = 0
    total = 1

    while offset < total and len(all_datasets) < limit:
        payload["offset"] = offset
        docs = try_esgf_request(payload)
        offset += len(docs)
        total = offset + 1 if len(docs) == 1000 else offset

        for d in docs:
            if "id" not in d:
                continue
            all_datasets.append({
                "dataset_id": d["id"].split("|")[0],
                "model": d.get("source_id", [""])[0],
                "experiment": d.get("experiment_id", [""])[0],
                "variable": d.get("variable_id", [""])[0],
                "variant": d.get("variant_label", [""])[0],
                "table": d.get("table_id", [""])[0],
                "start": d.get("time_coverage_start", ""),
                "end": d.get("time_coverage_end", ""),
                "version": d.get("version", [""]),
            })
    if not all_datasets:
        return pd.DataFrame(columns=["dataset_id", "model", "experiment", "variable", "variant", "table", "start", "end"])
    return pd.DataFrame(all_datasets)

def get_all_urls(dataset_id):
    """
    Devuelve una lista de URLs válidas para OPeNDAP y fileServer del dataset exacto.
    Valida coincidencia estricta con dataset_id y la variable contenida en el nombre del archivo.
    Añade filtros detallados al payload: variable_id, source_id, experiment_id, variant_label y table_id.
    """
    urls = []

    try:
        # Extraer componentes desde el dataset_id
        parts = dataset_id.split(".")
        if len(parts) < 8:
            print(f"⚠️ Dataset ID inválido: {dataset_id}")
            return urls

        _, _, _, model_expected, experiment_expected, variant_expected, table_expected, variable_expected = parts[:8]

        # Construcción del payload con filtros detallados
        payload = {
            "type": "File",
            "format": "application/solr+json",
            "limit": 500,
            "variable_id": variable_expected,
            "source_id": model_expected,
            "experiment_id": experiment_expected,
            "variant_label": variant_expected,
            "table_id": table_expected
        }

        docs = try_esgf_request(payload)
        if not docs:
            print(f"⚠️ No hay archivos para: {dataset_id}")
            return urls

        for f in docs:
            file_dataset_id = f.get("dataset_id", "").split("|")[0]
            if file_dataset_id != dataset_id:
                continue

            filename = f.get("title", "")
            if variable_expected not in filename:
                continue

            for u in f.get("url", []):
                parts = u.split("|")

                if len(parts) == 3:
                    url, _, url_type = parts
                elif len(parts) == 2:
                    url, url_type = parts
                else:
                    continue  # formato inesperado

                url = url.strip()
                url_type = url_type.strip().upper()

                if url_type == "OPENDAP":
                    url = url.replace(".html", "")

                urls.append({
                    "url": url,
                    "url_type": url_type
                })

    except Exception as e:
        print(f"❌ Error obteniendo URLs para dataset {dataset_id}: {e}")

    return urls


def get_combination_if_complete(model, experiment, variant, variables):
    filters = {
        "project": "CMIP6",
        "table_id": "day",
        "source_id": model,
        "experiment_id": experiment,
        "variant_label": variant,
    }

    df = get_dataset_metadata(filters, limit=200)
    df = df[df["variable"].isin(variables)]

    if df.empty:
        return []

    found_vars = df["variable"].unique().tolist()
    if all(v in found_vars for v in variables):
        # Para cada variable pedida, coge el primer dataset que la tenga
        selected = []
        for var in variables:
            match = df[df["variable"] == var]
            if not match.empty:
                selected.append(match.iloc[0])
        return selected

    return []

# === FUNCIONES AUXILIARES ===
def extract_years(name):
    match = re.search(r'(\d{4})\d{4}-(\d{4})\d{4}', name)
    if match:
        return int(match.group(1)), int(match.group(2))
    match = re.search(r'(\d{4})-(\d{4})', name)
    if match:
        return int(match.group(1)), int(match.group(2))
    return None, None

def is_valid_year_range(scenario, year_ini, year_fin):
    required_ranges = {
        'historical': (1950, 2014),  # <-- aquí defines tu rango mínimo aceptable
        'ssp126': (2015, 2100),
        'ssp245': (2015, 2100),
        'ssp370': (2015, 2100),
        'ssp585': (2015, 2100),
    }

    if scenario not in required_ranges:
        return True

    required_start, required_end = required_ranges[scenario]

    # ✅ El fichero debe cubrir *al menos* el rango necesario
    return not (year_fin < required_start or year_ini > required_end)

def map_scenario_name(original):
    mapping = {
        'ssp245': 'ssp2_4_5',
        'ssp585': 'ssp5_8_5',
        'ssp126': 'ssp1_2_6',
        'ssp370': 'ssp3_7_0',
        'historical': 'historical'
    }
    return mapping.get(original, original)


def download_file(url, local_path, chunk_size=1024*1024, max_retries=3):
    """
    Descarga un archivo con opción de reintentos y chunk_size configurable.
    
    Parámetros:
    - url: URL del archivo a descargar.
    - local_path: ruta de destino local.
    - chunk_size: tamaño de los bloques en bytes (por defecto 1 MB).
    - max_retries: número máximo de reintentos ante fallo.

    Devuelve:
    - True si la descarga fue exitosa, False en caso contrario.
    """
    for attempt in range(max_retries):
        try:
            with requests.get(url, stream=True, timeout=120) as r:
                r.raise_for_status()

                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                with open(local_path, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)

            print(f"[OK] Descargado: {os.path.basename(local_path)}")
            return True

        except Exception as e:
            wait = 2 ** attempt
            print(f"[RETRY {attempt+1}/{max_retries}] {url} → {e} (esperando {wait}s)")
            time.sleep(wait)

    print(f"[DOWNLOAD FAIL] {url} → agotados {max_retries} intentos")
    return False

import os
import requests
from tqdm.auto import tqdm  # auto-detecta entorno notebook o terminal
import time

def download_file_indeterminate(url, path_output, chunk_size=4 * 1024 * 1024, max_retries=3):
    for attempt in range(max_retries):
        try:
            with requests.get(url, stream=True, timeout=120) as r:
                r.raise_for_status()
                total_size = int(r.headers.get('Content-Length', 0)) or None

                os.makedirs(os.path.dirname(path_output), exist_ok=True)

                with open(path_output, 'wb') as f:
                    with tqdm(
                        total=total_size,
                        unit='B',
                        unit_scale=True,
                        desc=os.path.basename(path_output),
                        dynamic_ncols=True
                    ) as pbar:
                        for chunk in r.iter_content(chunk_size=chunk_size):
                            if chunk:
                                f.write(chunk)
                                pbar.update(len(chunk))
                        f.flush()
                    f.close()

            print(f"[✅ OK] Descargado: {os.path.basename(path_output)}")
            return True

        except Exception as e:
            wait = 2 ** attempt
            print(f"[RETRY {attempt+1}/{max_retries}] {url} → {e} (esperando {wait}s)")
            time.sleep(wait)

    print(f"[❌ ERROR] Fallo tras {max_retries} intentos: {url}")
    return False

def process_file(url, path_output, lat_min, lat_max, lon_min, lon_max, url_type="OPENDAP"):
    
    name = url.split('/')[-1]
    year_ini, year_fin = extract_years(name)
    if year_ini is None or year_fin is None:
        return f"[SKIPPED] Nombre inesperado: {name}"

    try:
        scenario_raw = name.split('_')[-4]
    except IndexError:
        return f"[SKIPPED] No se pudo extraer escenario: {name}"

    if not is_valid_year_range(scenario_raw, year_ini, year_fin):
        return f"[SKIPPED] Rango inválido para {scenario_raw}: {year_ini}-{year_fin} → {name}"

    scenario = map_scenario_name(scenario_raw)
    variable = url.split('/')[-4]
    output_dir = os.path.join(path_output, variable, scenario)
    output_file = os.path.join(output_dir, name)
    os.makedirs(output_dir, exist_ok=True)

    if os.path.exists(output_file):
        return f"[SKIPPED] Ya existe: {output_file}"

    temp_file = None

    try:
        if url_type == "HTTPSERVER":
            print(url)
            temp_file = os.path.join(output_dir, f"__temp__{name}")
            if not download_file_indeterminate(url, temp_file):
                return f"[FAIL] No se pudo descargar: {url}"
            open_path = temp_file
        else:
            open_path = url

        with xr.open_dataset(open_path, decode_times=False) as ds:
            ds = ds.assign_coords(lon=(((ds.lon + 180) % 360) - 180)).sortby('lon')
            ds_sel = ds.sel(lat=slice(lat_min, lat_max), lon=slice(lon_min, lon_max))

            if all(v.count().item() == 0 for v in ds_sel.data_vars.values()):
                if url_type == "HTTPSERVER" and os.path.exists(temp_file):
                    try:
                        time.sleep(1)
                        gc.collect()
                        os.remove(temp_file)
                    except PermissionError:
                        print(f"⚠️ No se pudo borrar (en uso): {temp_file}")
                return f"[SKIPPED] No datos en dominio: {name}"
            
            ds_sel['lat'].attrs.update({
                "units": "degrees_north",
                "standard_name": "latitude",
                "long_name": "Latitude",
                "axis": "Y"
            })
            ds_sel['lon'].attrs.update({
                "units": "degrees_east",
                "standard_name": "longitude",
                "long_name": "Longitude",
                "axis": "X"
            })

            ds_sel.to_netcdf(output_file)

        if url_type == "HTTPSERVER" and os.path.exists(temp_file):
            try:
                time.sleep(1)
                gc.collect()
                os.remove(temp_file)
                print("🗑️ Borrado fichero temporal")
            except PermissionError:
                print(f"⚠️ No se pudo borrar (en uso): {temp_file}")

        return f"[OK] Guardado: {name}"

    except Exception as e:
        if url_type == "HTTPSERVER" and temp_file and os.path.exists(temp_file):
            try:
                time.sleep(1)
                gc.collect()
                os.remove(temp_file)
            except PermissionError:
                print(f"⚠️ No se pudo borrar tras error: {temp_file}")
        return f"❌ Error {name}: {e}"
