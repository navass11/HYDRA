# RFA — Regional Frequency Analysis

## Contenido: notebooks de análisis de extremos + RFA

Los notebooks de esta carpeta implementan el análisis de frecuencia puntual y regional aplicado a precipitaciones máximas diarias en el entorno de Valencia, con especial atención al impacto del evento DANA de octubre de 2024.

### Notebooks

| Fichero | Descripción |
|---|---|
| `Analisis_Previo.ipynb` | Análisis completo puntual + RFA, borrador de trabajo |
| `Análisis Final Paper.ipynb` | Versión limpia orientada a publicación (11 estaciones) |
| `Análisis Final Paper_Grande.ipynb` | Igual con un conjunto ampliado de estaciones |

---

### Datos de entrada

- `data/Estaciones_Conjuntas.csv` — metadatos de estaciones (coordenadas, fuente)
- `data/Daily_series_conjuntas.csv` — series diarias de precipitación

**Selección de estaciones**: `find_high_coincidence_group()` detecta el mayor grupo de estaciones con al menos un umbral mínimo de coincidencia temporal (p. ej. ≥20% de días con datos simultáneos). Estaciones principales del estudio: `8337X` y `V103` (zona Turís–Chiva).

---

### Análisis puntual

Para cada estación se realizan dos análisis: **sin** el dato de la DANA de 2024 y **con** ese dato, y se comparan los cuantiles resultantes.

#### Ajuste GEV máximo-verosímil (MLE)
```python
shape, loc, scale = genextreme.fit(data)
return_level_T = genextreme.ppf(1 - 1/T, shape, loc=loc, scale=scale)
```

#### Ajuste por L-momentos
```python
lmoments = lm.lmom_ratios(data)
gev_params = lmd.gev.lmom_fit(data)
```

#### Ajuste bayesiano (Stan)
Modelo GEV implementado directamente en Stan con priors débilmente informativos:
```
mu    ~ Normal(0, 100)
sigma ~ Cauchy(0, 5)
xi    ~ Normal(0, 5)
```
Se estiman los parámetros `mu`, `sigma`, `xi` mediante MCMC. Las funciones `plot_prior_posterior()` y `compare_return_periods()` permiten comparar visualmente MLE, L-momentos y Bayesiano.

---

### Análisis de Frecuencia Regional (RFA)

Implementación de RFA normalizando las series de todas las estaciones con `StandardScaler` (índice de avenida = media de la estación) y ajustando un modelo GEV bayesiano regional sobre la serie normalizada conjunta.

```python
scaler = StandardScaler()
data_standardized = pd.DataFrame(
    scaler.fit_transform(data_year_max),
    ...
)
regional_normalized = data_standardized.apply(...)
```

El cuantil de cada estación se recupera desnormalizando:
```
Q_T(estación) = quantile_regional * scaler.mean_[i] + scaler.scale_[i]
```

La función `compare_return_periods_MANU()` compara en la misma figura los períodos de retorno obtenidos por MLE, L-momentos y RFA bayesiano regional.

**Resultados exportados** a `Resultados_RP/Puntual/`:
- `Analisis_Puntual_RP_8337X_SIN_DANA.csv`
- `Analisis_Puntual_RP_8337X_CON_DANA.csv`
- `Analisis_Puntual_RP_Regional_Frecuency_8337X_*.csv`

---

## Dependencias

```
numpy
scipy
pandas
stan (pystan)
lmoments3
matplotlib
cartopy
geopandas
sklearn
networkx
statsmodels
```
