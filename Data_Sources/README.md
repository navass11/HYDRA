# Data Sources

Módulo de descarga, preprocesado y estandarización de datos climáticos e hidrológicos de diferentes fuentes.

## Submódulos

| Carpeta | Fuente | Estado |
|---|---|---|
| `Climate_Change/` | Proyecciones climáticas (COPERNICUS, ESGF) | Activo |
| `Rainfall/` | Precipitación observada y reanálisis (GPM, PERSSIAN, ERA-5) | Activo |
| `River_Discharge/` | Datos de caudal fluvial | En desarrollo |
| `Soils/` | Propiedades físicas del suelo | En desarrollo |

## Convenciones

- Los datos descargados se almacenan en formato **NetCDF** (`.nc`) o **GeoTIFF** (`.tif`) según la fuente.
- Las coordenadas usan el sistema de referencia **WGS84 (EPSG:4326)** salvo indicación contraria.
- Las series temporales siguen el estándar **CF Conventions** para metadatos.

## Dependencias comunes

```
cdsapi
xarray
netCDF4
rioxarray
geopandas
```
