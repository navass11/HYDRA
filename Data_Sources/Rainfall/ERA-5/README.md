# ERA-5 — ECMWF Reanalysis v5

Función para la descarga paralela de datos ERA5 desde el Copernicus CDS, con soporte para resolución horaria y mensual.

## Contenido: `ERA5.py` — función `download_era5()`

Descarga datos ERA5 `single-levels` en paralelo usando `ThreadPoolExecutor`. Por cada combinación (año, mes, día) o (año, mes):

1. Construye la petición a la API CDS (`reanalysis-era5-single-levels` o `reanalysis-era5-single-levels-monthly-means`)
2. Descarga el resultado como `.zip`
3. Descomprime, carga todos los NetCDF resultantes con xarray, los fusiona en un único dataset (`xr.merge`) y guarda como `_combined.nc`
4. Limpia el directorio temporal
5. Registra errores en `download_errors.log`

Omite automáticamente los últimos 10 días (datos aún no consolidados en CDS).

## Parámetros principales

| Parámetro | Descripción |
|---|---|
| `folder_out` | Carpeta de salida |
| `api_key` / `url` | Credenciales Copernicus |
| `area` | Bounding box [N, W, S, E] |
| `variables_list` | Lista de variables CDS |
| `years` / `months` | Período de descarga |
| `frequency` | `'hourly'` o `'monthly'` |
| `max_workers` | Hilos paralelos (por defecto 5) |

## Uso básico

```python
from ERA5 import download_era5

download_era5(
    folder_out="./data/ERA5/",
    api_key="<UID>:<API-KEY>",
    url="https://cds.climate.copernicus.eu/api",
    area=[15, -80, -5, -65],   # N, W, S, E
    variables_list=["total_precipitation", "2m_temperature"],
    years=range(1990, 2024),
    frequency="hourly",
    max_workers=5
)
```

## Dependencias

```
cdsapi
xarray
zipfile (stdlib)
concurrent.futures (stdlib)
```
