# Data Sources — Climate Change

Scripts para la descarga de proyecciones de cambio climático CMIP6 desde el CDS de Copernicus y desde ESGF, y utilidades de preprocesado.

## Contenido

| Archivo / Carpeta | Descripción |
|---|---|
| `COPERNICUS/` | Descarga CMIP6 via CDS API + verificación de combinaciones válidas |
| `ESGF/` | Búsqueda y descarga CMIP6 via nodos ESGF (OPeNDAP / HTTP) |
| `utils.py` | Funciones auxiliares compartidas |

## `utils.py`

Contiene dos utilidades:

**`dividir_periodo_anual(start_date, end_date)`** — Divide un rango de fechas en bloques anuales devolviendo una lista de pares `[inicio, fin]`. Se usa para iterar las descargas año a año.

**`bias_correction`** — Clase con métodos de corrección de sesgo aplicables sobre los datos descargados del modelo:
- `quantile_mapping()`: corrección aditiva por mapeo de cuantiles empíricos
- `quantile_deltamapping()`: corrección multiplicativa por cuantiles (para precipitación)
- `scaled_distribution_mapping(variable)`: SDM con distribución Gamma (precipitación) o Normal (temperatura); equivalente a `Climate/Bias_Correction/QQ_Mapping/QM.py`

## Variables habituales (CMIP6)

| Variable CDS | Descripción |
|---|---|
| `precipitation` | Precipitación diaria/mensual |
| `daily_maximum_near_surface_air_temperature` | Temperatura máxima |
| `daily_minimum_near_surface_air_temperature` | Temperatura mínima |
| `near_surface_wind_speed` | Velocidad del viento |
| `near_surface_specific_humidity` | Humedad específica |

## Escenarios disponibles

`historical`, `ssp126`, `ssp245`, `ssp370`, `ssp585`
