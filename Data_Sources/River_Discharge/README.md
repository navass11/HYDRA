# Data Sources — River Discharge

Scripts y notebooks para la descarga y preprocesado de datos de caudal fluvial procedentes de bases de datos globales.

## Contenido

### `Download_glofas.ipynb`
Automatiza la descarga de datos históricos de caudal simulado de **GloFAS** (Global Flood Awareness System, Copernicus EWDS) usando **Selenium** para controlar el navegador. El script itera año a año desde 1979 hasta el año actual y descarga los datos en formato NetCDF para una caja geográfica definida (actualmente configurada para Centroamérica/norte de Sudamérica: 15°N–5°S, 80°W–65°W). Descarga el producto `cems-glofas-historical`, versión 4.0, modelo LISFLOOD, tipo "Consolidated".

> **Nota:** La descarga es a través del formulario web del CDS, no por API directa, porque el dataset requiere aceptar términos de licencia en el navegador.

### `Global River Discharge, 1807-1991 (RivDIS) y NCAR.ipynb`
Carga y procesa datos de caudal mensual de dos fuentes históricas:
- **RivDIS** (1807–1991): lee el Excel de datos y genera un archivo `.xls` independiente por estación con serie temporal mensual en m³/s.
- **NCAR** ([rda.ucar.edu/datasets/ds552.0](https://rda.ucar.edu/datasets/ds552.0/)): lee el fichero `.dat` en formato espacio-delimitado y genera igualmente un archivo por estación. Incluye resumen de metadatos de la red (periodo de registro, meses incompletos, localización).

El notebook también visualiza la localización de las tres redes de estaciones sobre un mapa con `cartopy`.

## Dependencias

```
selenium
requests
numpy
pandas
netCDF4
cartopy
```
