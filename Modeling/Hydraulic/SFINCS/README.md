# SFINCS — Super-Fast Inundation of CoastS

Scripts para la configuración, ejecución y postprocesado del modelo hidráulico **SFINCS** (Deltares) aplicados al Atlas de Inundación de Panamá.

## Contenido

| Script | Entorno | Descripción |
|---|---|---|
| `SFINCS_PANAMA.py` | Windows GPU | Versión principal, Docker GPU (`navass11/sfincs-gpu`) |
| `SFINCS_PANAMA_GPU_WIN.py` | Windows GPU | Variante N4C con CRS y gestión de errores mejorada |
| `SFINCS_PANAMA_CPU_WIN.py` | Windows CPU | Igual pero con ejecución Docker comentada (solo setup) |
| `Ejecucion_Cluster.py` | Linux cluster | Ejecución en cluster HPC con Docker GPU Deltares |

---

## Funciones comunes

### `ejecution_SFINCS(basins, points, caudal, dem, manning, path_output, bas)`

Configura y ejecuta SFINCS para una cuenca individual:

1. Crea el modelo con `SfincsModel(root=..., mode='w+')`
2. Recorta el DEM a la cuenca con `gdal.Warp()`
3. Configura la malla: `setup_grid_from_region()` a **30.83 m de resolución** en EPSG:32617
4. Configura batimetría: `setup_dep()`, máscara activa: `setup_mask_active()`, condición de contorno de salida: `setup_mask_bounds(btype="outflow", zmin=-5)`
5. Asigna rugosidad Manning: `setup_manning_roughness()`
6. Asigna hidrogramas de caudal a los puntos de entrada (`setup_discharge_forcing()`), con paso de tiempo de 1800 s
7. Escribe el modelo con `mod.write()` y corrige fin de línea con `convert_eol_to_linux()`
8. Ejecuta SFINCS vía Docker GPU:
   ```bash
   docker run --rm -it --gpus all -v %cd%:/data navass11/sfincs-gpu:v-2.0.0 > sfincs_log.txt
   ```
9. Extrae resultados con `extract_result_hmax()` y `extract_result_speed()`

### `extract_result_hmax(raster_original, netcdf_result, raster_result)`

Lee el NetCDF de salida (`sfincs_map.nc`) con **Dask** en paralelo, calcula el calado máximo `h.max(dim='time')`, filtra valores < 0.05 m, reproyecta al CRS del DEM original y guarda como GeoTIFF.

### `extract_result_speed(raster_original, netcdf_result, raster_result)`

Igual para la velocidad máxima: `speed_max = sqrt(u² + v²).max(dim='time')`, enmascarada donde `hmax < 0.05 m`.

### `convert_eol_to_linux(directory)`

Convierte los finales de línea de los archivos `.dis` e `.inp` de Windows (`\r\n`) a Linux (`\n`), necesario para ejecutar SFINCS en Docker.

---

## Aplicación: Atlas de Inundación de Panamá (N4C)

El bucle principal itera sobre:
- **Períodos**: histórico (`Inflows_situacion_actual`), 2030 (SSP585), 2050 (SSP585)
- **Caudales de diseño**: Q10, Q50, Q100
- **Cuencas**: todas las cuencas del shapefile `Cuencas_simulacion_inundacion_N4C.shp`

Resultados en `gis/hmax.tif` y `gis/speed.tif` por cuenca y período de retorno.

---

## Ejecución en cluster (`Ejecucion_Cluster.py`)

Versión Linux para ejecutar SFINCS en HPC:
```bash
docker run --gpus all -v $(pwd):/data deltares/sfincs-gpu > sfincs_log.txt
```
Itera sobre las mismas combinaciones de período y caudal, usando las rutas del almacenamiento del cluster (`/Storage/it/CuencasResilientes/N4C/`).

---

## Dependencias

```
hydromt-sfincs
xarray
rioxarray
geopandas
dask
rasterio
numpy
pandas
gdal (osgeo)
```
