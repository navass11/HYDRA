# Spatial Analysis

Módulo para el análisis estadístico espacial de variables climáticas. Permite regionalizar, interpolar y modelizar la estructura espacial de la precipitación y otros campos climáticos.

## Submódulos

| Carpeta | Descripción | Estado |
|---|---|---|
| `RFA/` | Regional Frequency Analysis por L-moments | Activo |
| `Bayes_Hierarchical/` | Modelos jerárquicos bayesianos espacio-temporales | Activo |
| `Interpolation/` | Kriging, IDW y métodos geoestadísticos | Activo |
| `Copulas/` | Modelos de dependencia multivariante | En desarrollo |

## Flujo de trabajo

```
Estaciones/Grid  →  RFA (regionalización)  →  Distribución regional
                 →  Interpolation          →  Campo espacial continuo
                 →  Bayes Hierarchical     →  Incertidumbre espacial
                 →  Copulas               →  Dependencia entre sitios
```

## Dependencias

```
numpy
scipy
pandas
geopandas
pyproj
pykrige
pymc
arviz
```
