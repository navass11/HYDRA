# AEMET — Agencia Estatal de Meteorología

Scripts para la descarga de datos climáticos diarios de la red de estaciones de AEMET mediante la API OpenData, con interfaz interactiva en Jupyter.

## Contenido: `AEMET.py`

El archivo contiene tres componentes:

### `download_aemet_daily_data(path_output, api_key, start_date_str, end_date_str, interval_days=15)`
Descarga datos diarios de **todas las estaciones AEMET** en bloques de 15 días usando la API REST de AEMET OpenData. Para cada bloque:
- Realiza la petición a `/valores/climatologicos/diarios/datos/fechaini/.../fechafin/.../todasestaciones`
- Sigue la URL de datos (`datos`) en la respuesta
- Convierte los registros a xarray Dataset con coordenadas de estación (lon, lat, alt, nombre, provincia)
- Guarda como NetCDF

Variables descargadas: precipitación, temperatura (máx/mín/media), viento (dirección/velocidad/racha), presión, humedad, insolación.

### `AEMETDownloader(netcdf_folder)`
Widget interactivo para Jupyter Notebook con mapa `ipyleaflet`:
- Muestra las estaciones AEMET del shapefile `Estaciones_Auto_AEMET_IHC.shp` como marcadores agrupados
- Permite seleccionar estaciones individualmente (clic) o por área dibujada (polígono)
- Descarga y extrae series temporales de la variable/es seleccionadas de los NetCDF ya descargados
- Guarda una serie por estación como CSV (`AEMET_{id}_series.csv`)
- Incluye botón de cancelación y barra de progreso

### `AemetCSVLoader`
Clase para cargar y analizar los CSV generados por `AEMETDownloader`:
- `load_station_data()`: carga el CSV de metadatos de estaciones seleccionadas
- `load_series_data(variable)`: carga y combina todas las series de una variable en un DataFrame temporal
- `analyze_series_quality()`: calcula para cada estación: años completos, meses completos, % datos faltantes, valor mínimo/máximo

## Datos auxiliares

- `data/Estaciones_Auto_AEMET_IHC.shp` — shapefile con la localización de estaciones automáticas de AEMET (sistema de referencia EPSG:4326)

## Uso básico

```python
from AEMET import download_aemet_daily_data, AEMETDownloader, AemetCSVLoader

# Paso 1: Descarga masiva de datos
download_aemet_daily_data(
    path_output="./data/netcdf/",
    api_key="<API_KEY>",
    start_date_str="2000-01-01T00:00:00UTC",
    end_date_str="2023-12-31T00:00:00UTC"
)

# Paso 2: Widget interactivo (en Jupyter)
AEMETDownloader(netcdf_folder="./data/netcdf/")

# Paso 3: Análisis de calidad
loader = AemetCSVLoader("./data/series/")
loader.load_series_data(variable="prec")
print(loader.analyze_series_quality())
```

## Dependencias

```
requests
pandas
numpy
xarray
geopandas
ipyleaflet
ipywidgets
ipyfilechooser
shapely
```
