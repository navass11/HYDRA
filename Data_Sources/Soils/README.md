# Data Sources — Soils

Scripts para la descarga y preprocesado de datos de textura de suelo de **SoilGrids** (ISRIC, versión 2017-03-10) y su conversión a clase USDA para uso en modelos hidrológicos.

## Contenido

### `1_download_soilgrids_sandSiltClay.py`
Descarga los GeoTIFFs de contenido de arena (`SNDPPT`), limo (`SLTPPT`) y arcilla (`CLYPPT`) en las 7 profundidades de suelo que proporciona SoilGrids (sl1–sl7, resolución 250 m). Usa `requests` con lógica de reintento automático (hasta 10 intentos por archivo). Los archivos se descargan directamente del servidor ISRIC.

### `2_convert_sandSiltClay_to_soilclass.py`
Lee los GeoTIFFs descargados y clasifica cada píxel en una de las **12 clases de suelo USDA** usando el triángulo de texturas (Benham et al., 2009). Para cada profundidad genera un nuevo GeoTIFF con la clase resultante. Las clases van de 1 (clay) a 12 (loamy sand).

### `3_extract_soilclass_mode.py`
Apila los GeoTIFFs de clase de suelo de las 7 profundidades y calcula la **moda estadística** por píxel (`scipy.stats.mode`), obteniendo la clase de suelo dominante en la columna de suelo. El resultado se guarda como un único GeoTIFF.

### `Parametros_suelo.csv`
Tabla de parámetros hidráulicos por clase de suelo USDA para usar como entrada en modelos hidrológicos. Incluye: conductividad hidráulica saturada (mm/d), capacidad de campo, punto de marchitez, porosidad, densidad aparente, presión de burbuja y grupo hidrológico (A/B/C/D).

## Flujo de trabajo

```
SoilGrids (ISRIC)
      ↓
1_download_soilgrids_sandSiltClay.py   →  SNDPPT/SLTPPT/CLYPPT_sl1..sl7.tif
      ↓
2_convert_sandSiltClay_to_soilclass.py →  usda_soilclass_sl1..sl7.tif
      ↓
3_extract_soilclass_mode.py            →  usda_mode_soilclass.tif
      ↓
Parametros_suelo.csv                   →  parámetros hidráulicos por clase
```

## Dependencias

```
requests
numpy
scipy
gdal (osgeo)
```

## Referencias

- Hengl T. et al. (2017). SoilGrids250m: Global gridded soil information based on machine learning. *PLoS ONE* 12(2): e0169748.
- Benham, E. et al. (2009). Clarification of Soil Texture Class Boundaries. USDA-NRCS.
