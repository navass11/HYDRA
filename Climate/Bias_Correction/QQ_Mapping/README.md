# QQ Mapping — Corrección de Sesgo por Mapeo de Cuantiles

## Contenido: `QM.py` — clase `bias_correction`

Clase con tres métodos de corrección de sesgo por mapeo cuantil-cuantil.

### `quantile_mapping()`
**Corrección aditiva empírica.** Calcula el ECDF del modelo histórico, determina el percentil de cada valor del escenario según ese ECDF y aplica una corrección aditiva:
```
correction = percentile(obs, p) - percentile(mod, p)
sce_corrected = sce + correction
```
Fuerza a cero los valores negativos resultantes.

### `quantile_deltamapping()`
**Corrección multiplicativa empírica.** Igual que `quantile_mapping` pero con corrección multiplicativa (adecuada para precipitación):
```
correction = percentile(obs, p) / percentile(mod, p)
sce_corrected = sce * correction
```

### `scaled_distribution_mapping(variable)`
**SDM paramétrico.** Método de dos variantes según la variable:

- `variable='precipitation'` → **`relative_sdm`**: ajusta distribuciones Gamma a días de lluvia (obs, mod, sce); calcula las CDFs; ajusta la frecuencia de días lluviosos; combina las CDFs para obtener una distribución adaptada que preserva la señal de cambio
- `variable='temperature'` → **`absolute_sdm`**: ajusta distribuciones Normales a las series detendenciadas; aplica corrección análoga para temperatura

### Uso básico

```python
from QM import bias_correction

bc = bias_correction(obs=obs_daily, mod=model_hist, sce=model_future)

# Mapeo cuantil empírico multiplicativo
sce_corrected = bc.quantile_deltamapping()

# SDM para precipitación
sce_sdm = bc.scaled_distribution_mapping(variable='precipitation', lower_limit=0.1)
```

## Dependencias

```
numpy
scipy
statsmodels
```

## Nota

La misma clase `bias_correction` también existe en `Data_Sources/Climate_Change/utils.py` para aplicar corrección de sesgo durante el preprocesado de los datos de modelo descargados.
