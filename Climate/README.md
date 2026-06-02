# Climate

Módulo de análisis estadístico del clima. Agrupa herramientas para el análisis de series temporales, análisis espacial, generación estocástica, corrección de sesgo y downscaling estadístico de variables climáticas.

## Submódulos

| Carpeta | Descripción | Estado |
|---|---|---|
| `Time_Series_Analysis/` | Análisis de extremos y discretización temporal | Activo |
| `Spatial_Analysis/` | RFA, modelos bayesianos, interpolación, cópulas | Activo |
| `Stochastic_Generation/` | Generadores de clima puntual y espacial | En desarrollo |
| `Bias_Correction/` | Corrección de sesgo de modelos climáticos | Activo |
| `Hybrid_Downscaling/` | Downscaling estadístico híbrido | Activo |

## Flujo de trabajo típico

```
Datos brutos (Data_Sources/)
        ↓
Time_Series_Analysis  →  detección de extremos, homogeneización
        ↓
Spatial_Analysis      →  regionalización, interpolación
        ↓
Bias_Correction       →  corrección de sesgo en proyecciones
        ↓
Hybrid_Downscaling    →  aumento de resolución espacial
        ↓
Stochastic_Generation →  series sintéticas para modelización
```

## Dependencias comunes

```
numpy
scipy
pandas
xarray
statsmodels
scikit-learn
```
