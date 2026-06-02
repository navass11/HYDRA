# Bayes Hierarchical — Modelos Jerárquicos Bayesianos

## Estado

El código de RFA y del modelo jerárquico bayesiano existe pero está mezclado actualmente. La tarea pendiente es extraerlo y separarlo en:
- `Spatial_Analysis/RFA/` — la parte de análisis de frecuencia regional
- `Spatial_Analysis/Bayes_Hierarchical/` — la parte del modelo jerárquico

Aquí también está RFA que habrá que sacar del código para llevarlo a su módulo, lo mismo que el jerárquico.

## Contenido: notebooks de modelo jerárquico GEV

Tres notebooks que implementan el mismo modelo jerárquico, aplicado a diferentes conjuntos de estaciones.

| Fichero | Estaciones | Datos |
|---|---|---|
| `Gev_hicherical.ipynb` | Conjunto estándar | `Daily_series_conjuntas.csv` |
| `Gev_hicherical_Pequeño.ipynb` | Subconjunto reducido | `Daily_series_conjuntas.csv` |
| `Gev_hicherical_Grande.ipynb` | Conjunto ampliado | `Daily_series_conjuntas_V2.csv` |

Todos analizan el episodio DANA de Valencia 2024 en dos versiones: **con** y **sin** el dato extremo.

---

### Modelo jerárquico GEV en Stan

#### `hierarchical_gev_model` — modelo Stan

El modelo comparte los parámetros GEV entre estaciones a través de una distribución poblacional:

```stan
parameters {
   real mu_pop;
   real<lower=0> sigma_pop;
   real xi_pop;

   vector[S] mu_station;      // parámetros por estación
   vector<lower=0>[S] sigma_station;
   vector[S] xi_station;
}
model {
   mu_station    ~ normal(mu_pop, sigma_pop);
   xi_station    ~ normal(xi_pop, 0.5);
   // likelihood GEV por estación
}
generated quantities {
   matrix[S, T_count] return_levels;   // T=2,5,10,20,50,100 años
}
```

La información se comparte entre estaciones: las que tienen series cortas se benefician de la información regional.

#### `fit_gev_hierarchical(data)` — función de ajuste

Prepara el diccionario Stan con los datos de todas las estaciones (máximos anuales), ejecuta el muestreo MCMC y devuelve las muestras posteriores como DataFrame (`mu_pop`, `sigma_pop`, `xi_pop`, `mu_station[i]`, ..., `return_levels[i,j]`).

---

### Estructura del análisis

1. **Análisis exploratorio**: `plot_station_timeseries()` — scatter plots de series de máximos por estación
2. **Modelo con DANA**: ajusta el jerárquico incluyendo el dato de 2024
3. **Modelo sin DANA**: ajusta excluyendo el dato de 2024 (`Station_filter.loc[:'2023']`)
4. **Análisis comparativo**:
   - `plot_population_parameters_comparison()` — comparación de parámetros poblacionales con/sin DANA
   - `plot_return_levels_comparison()` — niveles de retorno T=100 por estación
   - `plot_uncertainty_comparison()` — intervalos de credibilidad al 95%
   - `compare_gev_approaches()` — jerárquico vs GEV individual paramétrico

---

## Dependencias

```
pystan (stan)
numpy
scipy
pandas
matplotlib
arviz
```
