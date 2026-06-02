# GPM — Global Precipitation Measurement

Clase para la descarga y preprocesado del producto IMERG de la misión GPM (NASA/JAXA) mediante la librería `earthaccess`.

## Contenido: `GPM.py` — clase `GPMDownloader`

### `__init__()`
Autentica con NASA Earthdata usando `earthaccess.login()`. Permite definir la región de descarga por puntos específicos o por bounding box.

### `set_region(points, lat_bounds, lon_bounds)`
Define la región espacial de interés. Si se pasan puntos, calcula automáticamente un bounding box con un buffer de 0.05°.

### `search(start_date, end_date, resolution)`
Busca los granulos IMERG disponibles para el periodo y resolución indicados (`'hourly'`, `'daily'`, `'monthly'`). Mapea a los productos:
- `GPM_3IMERGHH` — IMERG Final half-hourly
- `GPM_3IMERGDF` — IMERG Final daily
- `GPM_3IMERGM` — IMERG Final monthly

### `open_dataset(results, variable, ...)`
Descarga los granulos en lotes (`chunk_size=48`), los abre con xarray leyendo el grupo `/Grid`, y:
- Si se especifican `lat_bounds`/`lon_bounds`: recorta y guarda cada granulo como NetCDF individual
- Si se especifican `points`: extrae el valor más cercano para cada punto y agrega todo en un único CSV (`variable_points.csv`)

Incluye reintentos automáticos (`max_retries=3`) y limpieza del directorio temporal.

## Uso básico

```python
from GPM import GPMDownloader

gpm = GPMDownloader()
gpm.set_region(lat_bounds=(-5, 15), lon_bounds=(-80, -65))

results = gpm.search("2020-01-01", "2020-12-31", resolution="daily")
gpm.open_dataset(results, variable="precipitation", output_folder="./data/GPM/")
```

## Dependencias

```
earthaccess
xarray
numpy
pandas
tqdm
```
