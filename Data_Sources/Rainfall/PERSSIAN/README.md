# PERSIANN-CCS — Precipitation Estimation from Remotely Sensed Information using Artificial Neural Networks

Clase para la descarga y preprocesado de datos del producto **PERSIANN-CCS** del CHRS (University of California, Irvine).

## Contenido: `PERSSIAN.py` — clase `PERSSIANDownloader`

### `__init__(lon, lat, lon_min, lon_max, lat_min, lat_max, path_output, max_workers)`
Configura la región de descarga: por puntos específicos (lista o valor único) o por bounding box. Prepara la grilla del producto PERSIANN-CCS (9000 × 3000 píxeles, resolución 0.04°, cobertura 60°S–60°N).

### `download_daily(start_date, end_date)` / `download_hourly(start_date, end_date)`
- **Modo bounding box**: descarga los archivos binarios `.bin.gz` del servidor FTP del CHRS, los descomprime, parsea y guarda como NetCDF (un fichero por paso temporal)
- **Modo puntos**: extrae directamente el valor más cercano para cada punto y devuelve un DataFrame temporal (CSV)

Ambos modos usan descarga paralela (`ThreadPoolExecutor`) con reintentos exponenciales (hasta 5 intentos).

### `_parse_binary(BinaryFile, time_step)`
Lee el archivo binario en formato big-endian float (diario) o unsigned int16 (horario), reconstruye la matriz lat/lon y convierte la longitud de [0°, 360°] a [-180°, 180°]. Marca como NaN los valores inválidos (< 0, código 555.37). Los datos horarios se dividen entre 100 para obtener mm.

### `_create_netcdf(data_array, time, time_step)`
Recorta al bounding box, añade metadatos CF y guarda como NetCDF4.

### `create_animation(data_dir, start_date, end_date, time_resolution)`
Genera una animación (GIF o MP4) de la evolución temporal de la precipitación sobre el dominio.

## Uso básico

```python
from PERSSIAN import PERSSIANDownloader

# Bounding box
dl = PERSSIANDownloader(lon_min=-80, lon_max=-65, lat_min=-5, lat_max=15, path_output="./data/PERSIANN/")
dl.download_daily("2020-01-01", "2020-12-31")

# Puntos específicos
dl = PERSSIANDownloader(lon=[-74.0, -76.5], lat=[4.5, 6.2], path_output="./data/PERSIANN/")
series = dl.download_hourly("2020-06-01", "2020-06-30")
```

## Dependencias

```
xarray
numpy
urllib (stdlib)
gzip (stdlib)
concurrent.futures (stdlib)
tqdm
matplotlib
cartopy
```
