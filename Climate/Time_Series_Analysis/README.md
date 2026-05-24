# Time Series Analysis

Herramientas para el análisis estadístico de series temporales de variables climáticas, con énfasis en la identificación y caracterización de eventos extremos.

## Submódulos

### Extremes
Análisis de valores extremos (EVA) a escala de punto. Incluye ajuste de distribuciones de valores extremos (GEV, GP, Gumbel), estimación de períodos de retorno y análisis de tendencias.

### Discretization
> **Estado: en desarrollo**

Métodos de discretización temporal de series continuas (e.g., separación de eventos de lluvia, umbralización para modelos de pulsos).

## Aplicaciones

- Estimación de precipitación máxima para distintos períodos de retorno
- Detección de tendencias en extremos climáticos (Mann-Kendall, Sen's slope)
- Análisis de frecuencia de eventos de caudal punta
- Homogeneización de series históricas

## Dependencias

```
numpy
scipy
pandas
lmoments3
pymannkendall
```
