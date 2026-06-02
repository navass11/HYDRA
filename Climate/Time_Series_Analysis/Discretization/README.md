# Discretization

Funciones extraídas de la librería `flood_methodology` para la separación de eventos de caudal y la generación de eventos sintéticos mediante cópulas.

## Contenido: `Funciones_Metodologia.py`

El archivo contiene cuatro clases principales que implementan una metodología completa de caracterización probabilística de inundaciones:

### `generacion_eventos_sinteticos`

**`eventos_caudal()`** — Separación de eventos de crecida a partir de una serie temporal de caudal:
- Detecta cruces del umbral para identificar inicio y fin de cada evento
- Usa puntos de inflexión (cambios de signo en la pendiente) para delimitar los hidrogramas
- Filtra por un segundo umbral (`umbral2`) para retener solo eventos significativos
- Devuelve tabla con Qmax, Qmed y duración de cada evento

**`clacificacion_PCA()`** — Clasificación de la forma de los hidrogramas por PCA:
- Normaliza cada hidrograma a [0,1] e interpola a 100 puntos de resolución fija
- Aplica PCA conservando el 95% de la varianza

**`K_means()`** — Agrupación de eventos en tipos de hidrograma:
- K-means en el espacio PCA
- Reordena los centroides en una malla 2D minimizando la distancia entre vecinos (`compute_mindist_permutation_random`)

**`run_copulas()`** — Generación de eventos sintéticos mediante cópulas:
- Ajusta la distribución univariante óptima (selección por BIC) a Qmax, Qmed, Duración y Tipo usando `openturns`
- Ajusta una cópula Normal para modelizar la dependencia conjunta
- Genera una muestra sintética de eventos y la guarda en `matriz_sintetica.csv`

### `reconstruccion_eventos_sinteticos`

Reconstruye hidrogramas sintéticos completos a partir de la matriz sintética:
- Selecciona los eventos reales más representativos con el algoritmo **MaxDiss**
- Escala la forma del hidrograma tipo para que coincida con el Qmax y Qmed sintéticos
- Exporta cada hidrograma sintético como `.csv`

### `recontruccion_manchas` / `recontruccion_manchas_CC`

Reconstruye mapas estadísticos de inundación (calado) para diferentes períodos de retorno (T = 5, 10, 25, 50, 100, 200, 500, 1000 años) a partir de simulaciones hidráulicas previas:
- Asocia cada evento sintético a los centroides simulados más cercanos por distancia Euclídea en el espacio (Qmax, Qmed, Duración)
- Interpola las manchas simuladas ponderando por la distancia a cada centroide
- Versión `_CC` añade soporte para combinar simulaciones históricas y de cambio climático
- Exporta mapas de calado como GeoTIFF usando GDAL

### Funciones auxiliares

- `MaxDiss`: selección de N eventos representativos maximizando la disimilitud (algoritmo MaxMin), iniciando desde el evento de mayor Qmax
- `sweepMatrixNeighbors`: recorre vecinos D4/D8 en una malla 2D de centroides
- `block_array`: divide un array 2D en bloques para procesado eficiente (dask)

## Dependencias

```
pandas
numpy
scipy
scikit-learn
openturns
gdal (osgeo)
dask
tqdm
matplotlib
```

## Nota

Parte de este código (cópulas, clasificación) está conceptualmente relacionado con los módulos `Spatial_Analysis/Copulas/` y `Modeling/Hydraulic/`. La separación en módulos independientes está pendiente.
