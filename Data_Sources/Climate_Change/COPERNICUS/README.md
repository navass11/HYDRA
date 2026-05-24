# COPERNICUS — Copernicus Climate Data Store

Scripts para la descarga de proyecciones CMIP6 desde el **Copernicus Climate Data Store (CDS)** mediante la API oficial `cdsapi`.

## Contenido

### `Verify_combination_CDS.py`
Usa **Selenium** para navegar automáticamente el formulario web del CDS e identificar qué combinaciones de modelo/variable/escenario están disponibles para una resolución temporal dada (diaria o mensual). Itera sobre todos los experimentos (historical, ssp126, ssp245, ssp370, ssp585…), variables (precipitación, temperatura, viento…) y ~57 modelos CMIP6. Guarda el resultado en los archivos CSV de combinaciones válidas.

> Este script se ejecuta una vez para generar los CSVs; no necesita repetirse a menos que el catálogo del CDS cambie.

### `Copernicus.py` — `download_CDS_CMIP6()`
Descarga datos CMIP6 del CDS en **paralelo por año** usando `ThreadPoolExecutor`. Lee las combinaciones válidas de `combinaciones_validas_daily.csv` o `combinaciones_validas_monthly.csv` y filtra por los modelos, variables y escenarios especificados. Incluye lógica de reintento (hasta 3 intentos) y detención automática ante errores críticos de servidor (`RoocsValueError`). Los archivos se descargan en formato `.zip` uno por año y modelo.

### `combinaciones_validas_daily.csv` / `combinaciones_validas_monthly.csv`
Tablas de combinaciones válidas (modelo, variable, experimento) generadas por `Verify_combination_CDS.py`. Son la entrada de `Copernicus.py` para saber qué descargas son posibles.

## Uso básico

```python
from Copernicus import download_CDS_CMIP6

download_CDS_CMIP6(
    url="https://cds.climate.copernicus.eu/api",
    api_key="<UID>:<API-KEY>",
    start_date="2015-01-01",
    end_date="2100-12-31",
    temporal_resolution="daily",
    model="All",                          # o un modelo específico
    experiments=["ssp2_4_5", "ssp5_8_5"],
    variables=["precipitation"],
    download_base_dir="./data/CMIP6/",
    area=[44, -10, 35, 5],               # N, W, S, E
    max_workers=5
)
```

## Dependencias

```
cdsapi
pandas
selenium
concurrent.futures (stdlib)
```
