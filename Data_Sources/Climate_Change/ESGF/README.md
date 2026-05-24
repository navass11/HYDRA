# ESGF — Earth System Grid Federation

Script para la búsqueda y descarga de datos CMIP6 desde los nodos de la **Earth System Grid Federation**.

## Contenido: `ESGF.py`

Módulo con funciones para buscar y descargar ficheros NetCDF de modelos CMIP6 directamente desde los nodos ESGF, con soporte para OPeNDAP (subconjunto remoto sin descarga completa) y HTTP.

### Funciones principales

**`get_dataset_metadata(filters)`** — Busca datasets CMIP6 en los nodos ESGF usando la API Solr. Itera sobre múltiples nodos (`llnl.gov`, `dkrz.de`, `ipsl.upmc.fr`, `ornl.gov`…) hasta obtener respuesta. Soporta paginación automática para listados grandes. Devuelve un DataFrame con metadatos (modelo, experimento, variable, variante, periodo…).

**`get_all_urls(dataset_id)`** — Devuelve las URLs disponibles (OPeNDAP y/o HTTPSERVER) para un dataset específico, validando que el archivo corresponda exactamente al dataset ID y la variable esperada.

**`process_file(url, path_output, lat_min, lat_max, lon_min, lon_max)`** — Descarga o accede vía OPeNDAP al fichero, lo recorta al bounding box definido, corrige la longitud a rango [-180, 180], añade atributos CF estándar y guarda como NetCDF. Organiza la salida en carpetas por variable y escenario.

**`download_file()` / `download_file_indeterminate()`** — Descarga HTTP con reintentos exponenciales y barra de progreso (tqdm).

**`get_combination_if_complete(model, experiment, variant, variables)`** — Verifica si un modelo/experimento/variante tiene disponibles **todas** las variables requeridas antes de descargar.

**`is_valid_year_range(scenario, year_ini, year_fin)`** — Filtra archivos cuyo periodo temporal no cubre el rango mínimo necesario (historical: 1950–2014, SSPs: 2015–2100).

### Uso básico

```python
from ESGF import get_dataset_metadata, get_all_urls, process_file
from concurrent.futures import ThreadPoolExecutor, as_completed

filters = {
    "project": "CMIP6",
    "source_id": "MPI-ESM1-2-LR",
    "experiment_id": ["ssp245", "historical"],
    "variable_id": "pr",
    "table_id": "day"
}

datasets = get_dataset_metadata(filters)

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = []
    for _, row in datasets.iterrows():
        urls = get_all_urls(row["dataset_id"])
        for u in urls:
            futures.append(executor.submit(
                process_file, u["url"], "./data/ESGF/",
                -5, 15, -80, -65, u["url_type"]
            ))
    for f in as_completed(futures):
        print(f.result())
```

## Dependencias

```
requests
xarray
pandas
tqdm
concurrent.futures (stdlib)
```
