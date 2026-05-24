# Hydraulic — Modelos Hidráulicos

Herramientas para la configuración, ejecución y postprocesado de modelos hidráulicos de inundación 1D/2D.

## Modelos soportados

| Modelo | Carpeta | Tipo | Escala típica |
|---|---|---|---|
| SFINCS | `SFINCS/` | 2D, simplificado, GPU | Regional / costera |
| HEC-RAS | `HEC-RAS/` | 1D/2D, completo | Local / cuenca |

## Datos de entrada comunes

| Dato | Descripción | Resolución típica |
|---|---|---|
| DEM / Bathymetry | Modelo digital de elevación (terreno + batimetría) | 1–5 m |
| Caudal de entrada | Hidrograma de avenida (salida de `Hydrology/`) | — |
| Manning's n | Rugosidad hidráulica por uso de suelo | — |
| Nivel mar / marea | Condición de contorno aguas abajo | Horaria |

## Salidas principales

- Lámina de agua máxima (m)
- Calado máximo (m)
- Velocidad máxima (m/s)
- Extensión de la zona inundada (shapefile / raster)
- Tiempo de llegada de la inundación

## Dependencias comunes

```
rasterio
geopandas
xarray
netCDF4
```
