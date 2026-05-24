# Delta Method — Corrección de Sesgo por Factor Delta

## Contenido: `Delta.py` — función `delta_method()`

Implementación del método Delta para corrección de sesgo de modelos climáticos sobre series de observaciones.

### Funcionamiento

1. Calcula el **delta mensual** entre el modelo futuro y el histórico:
   - **Precipitación** (`var='pr'`): ratio mensual → `Delta = mean(mod_future_month) / mean(mod_hist_month)`
   - **Temperatura y otras** variables: diferencia mensual → `Delta = mean(mod_future_month) - mean(mod_hist_month)`

2. Promedia los deltas de todos los modelos del ensemble (`stat='mean'` o `stat='median'`)

3. Aplica el delta mes a mes sobre la serie observada, desplazando además el índice temporal para que corresponda al periodo futuro

### Parámetros

| Parámetro | Descripción |
|---|---|
| `serie_raw` | Serie observada (pandas Series con DatetimeIndex) |
| `serie_hist` | Salida del modelo en período histórico |
| `serie_mod` | Salida del modelo en período futuro |
| `var` | `'pr'` (precipitación) o cualquier otra variable |
| `stat` | `'mean'` o `'median'` para agregar el ensemble |

### Uso básico

```python
from Delta import delta_method

corrected = delta_method(
    serie_raw=obs_daily,        # observaciones históricas
    serie_hist=model_hist,      # modelo 1981-2010
    serie_mod=model_ssp245,     # modelo 2041-2070
    var='pr',
    stat='mean'
)
```

## Dependencias

```
pandas
numpy
```
