# OGIMET — Red global de estaciones meteorológicas SYNOP

Scripts para la descarga de observaciones SYNOP históricas desde el portal **Ogimet** ([ogimet.com](https://www.ogimet.com)), con interfaz interactiva en Jupyter.

## Contenido: `data/OGIMET.py`

### `download_synop(station_id, start_date, end_date)`
Descarga datos SYNOP de una estación meteorológica específica desde Ogimet en bloques de 30 días. Parsea la tabla HTML de la página de resultados (`gsynres`) usando `BeautifulSoup` + `pandas.read_html`. Incluye pausa de 0.5 s entre peticiones para no saturar el servidor y un flag de cancelación.

### `process_all_meteorological_variables(df)`
Procesa el DataFrame bruto con MultiIndex de columnas que devuelve Ogimet:
- Convierte direcciones de viento (N, NNE, NE, …) a grados
- Trata valores de precipitación inapreciable (`ip`) como 0.1 mm
- Agrega a resolución diaria (suma para precipitación, media para el resto)
- Renombra columnas a nombres estándar (`tmax_celsius`, `precipitation_mm`, `wind_speed_kmh`, …)

### `OGIMETDownloader(zoom, center, max_markers)`
Widget interactivo para Jupyter Notebook con mapa `ipyleaflet`:
- Carga el catálogo de estaciones desde `estaciones_ogimet_all.csv`
- Filtra estaciones sin código WIGOS válido
- Permite seleccionar estaciones por clic (popup con metadatos) o por rectángulo dibujado
- Descarga y procesa la serie de cada estación seleccionada, guardando:
  - `station_{nombre}.csv` — metadatos de la estación
  - `series_{nombre}.csv` — serie temporal procesada
- Incluye descarga en hilo secundario con cancelación y barra de progreso

### `OgimetCSVLoader`
Clase para cargar y analizar los CSV generados:
- `load_station_data()`: carga todos los CSV de metadatos de estación
- `load_series_data(variable)`: carga y combina la columna de la variable indicada de todas las series en un DataFrame temporal
- `analyze_series_quality()`: calcula % de datos faltantes, años y meses completos, min/max por estación

## Datos auxiliares

- `data/estaciones_ogimet_all.csv` — catálogo de estaciones disponibles en Ogimet (nombre, coordenadas, código WIGOS/OACI, altitud, estado)

## Uso básico

```python
from OGIMET import OGIMETDownloader, OgimetCSVLoader

# Widget interactivo (en Jupyter)
OGIMETDownloader(zoom=5, center=(40.0, -3.5))

# Cargar resultados
loader = OgimetCSVLoader("./data/ogimet/")
loader.load_series_data(variable="precipitation_mm")
print(loader.analyze_series_quality())
```

## Dependencias

```
requests
beautifulsoup4
pandas
ipyleaflet
ipywidgets
ipyfilechooser
tqdm
```
