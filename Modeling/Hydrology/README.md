# Hydrology — Modelos Hidrológicos

Herramientas para la configuración, ejecución y postprocesado de modelos hidrológicos cuenca-escorrentía.

## Modelos soportados

| Modelo | Carpeta | Tipo | Escala |
|---|---|---|---|
| SWAT / SWAT+ | `SWAT/` | Semidistribuido, continuo | Cuenca media-grande |
| HEC-HMS | `HEC-HMS/` | Semidistribuido, eventos o continuo | Cuenca pequeña-media |

## Datos de entrada comunes

| Variable | Fuente en HYDRA |
|---|---|
| Precipitación | `Data_Sources/Rainfall/` o `Climate/` (bias-corrected) |
| Temperatura | `Data_Sources/Climate_Change/` |
| Evapotranspiración | Calculada internamente o ERA-5 |
| DEM | SRTM / Copernicus DEM (30 m) |
| Usos del suelo | Copernicus Land Service, CORINE |
| Suelos | `Data_Sources/Soils/` |

## Salidas principales

- Caudal en sección de cierre (m³/s)
- Escorrentía directa, flujo base, evapotranspiración real
- Humedad del suelo en cada unidad de respuesta hidrológica (HRU)
