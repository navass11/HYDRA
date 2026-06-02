# Extremes — Análisis de Valores Extremos

## Contenido: notebooks de análisis de precipitaciones extremas

Notebooks de análisis de valores extremos puntual y regional aplicados a la red de estaciones del entorno de Valencia (España), con análisis específico del impacto del evento DANA de octubre de 2024.

### Notebooks

| Fichero | Descripción |
|---|---|
| `Analisis_Previo.ipynb` | Análisis exploratorio completo: selección de estaciones, GEV puntual, RFA |
| `Análisis Final Paper.ipynb` | Versión para publicación con figuras comparativas (11 estaciones) |
| `Análisis Final Paper_Grande.ipynb` | Igual con conjunto ampliado de estaciones |

**Nota**: el contenido de los notebooks de esta carpeta es análogo al de `Spatial_Analysis/RFA/`. Una vez que se reorganice el código, los análisis de frecuencia regional se moverán a `RFA/` y aquí quedará únicamente el análisis puntual de extremos.

---

### Datos de entrada

- `data/Estaciones_Conjuntas.csv` — coordenadas y metadatos de las estaciones
- `data/Daily_series_conjuntas.csv` — series diarias de precipitación

Las estaciones principales del estudio son `8337X` y `V103` en la zona Turís–Chiva, y se trabaja con un total de 11 estaciones de AEMET y SAIH València.

---

### Funciones de análisis

#### `filtrar_estaciones(df, min_years, max_gap_percentage)`
Filtra el catálogo de estaciones por longitud mínima de registro y máximo porcentaje de huecos.

#### `adjust_values_bayes_mle(data, nsim=1000)`
Ajusta simultáneamente el modelo GEV por MLE (scipy) y por inferencia bayesiana (Stan). Devuelve las distribuciones de cuantiles por ambos métodos.

#### `adjust_values_bayes_mle_REGIONAL(data, nsim=1000)`
Igual pero sobre la serie normalizada regional (índice de avenida).

#### `calculate_return_period(theta_mle, fit_bayes, value)`
Calcula el período de retorno de un valor específico según MLE y Bayesiano.

#### `calculate_value_asociate_RP(theta_mle, theta_lm, theta_sim, fit, T)`
Cuantil para el período de retorno T según MLE, L-momentos y Bayesiano.

---

### Figuras de análisis comparativo

- **Figura 1**: distribuciones de cuantiles Bayesiano vs MLE, con y sin DANA
- **Figura 2**: comparación de cuantiles puntual vs regional (normalizado)
- **Figura 3**: niveles de retorno con intervalos de confianza (Bayesiano regional)
- **Figura 4**: curvas T–retorno con y sin DANA (ambos métodos)
- **Figura 5**: comparación regional–puntual para múltiples períodos de retorno

---

### Comparación de escenarios

Para cada estación se compara:
1. **Sin DANA** (hasta 2023): distribución pre-evento
2. **Con DANA** (hasta 2024): impacto del evento extremo en los cuantiles

El evento DANA supone en 8337X una precipitación máxima en 1 día de ~710 mm, cuyo período de retorno según el ajuste GEV MLE previo era de varios siglos.

---

## Dependencias

```
numpy
scipy
pandas
stan (pystan)
lmoments3
matplotlib
seaborn
cartopy
geopandas
sklearn
arviz
```
