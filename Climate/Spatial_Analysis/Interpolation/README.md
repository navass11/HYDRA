# Interpolation — Interpolación Espacial

## Código de referencia

Trabajo previo con **Gaussian Processes** para interpolación espacial en la rama `gaup` de NEOPRENE:
[github.com/IHCantabria/NEOPRENE/tree/gaup](https://github.com/IHCantabria/NEOPRENE/tree/gaup)

El código de esa rama es el punto de partida para los métodos de interpolación con procesos gaussianos de este módulo.

## Contenido: `Gaussian Processes.ipynb`

Notebook que desarrolla dos aplicaciones de procesos gaussianos:

### 1. Interpolación espacial de precipitación media anual — Atlas Panamá

Interpolación espacial de la precipitación media anual en Panamá a partir de datos de estaciones terrestres (coordenadas UTM), usando `GaussianProcessRegressor` de scikit-learn con kernel `RationalQuadratic`.

**Variables explicativas (covariables)**:
- Elevación (DEM)
- Longitud y latitud
- Precipitación media TRMM (como proxy satelital)

**Flujo de trabajo**:
1. Carga estaciones con coordenadas UTM + precipitación media
2. Entrena GP con 80% de datos; valida con 20% (cross-validation)
3. Predice sobre la malla del dominio
4. Reconstrucción temporal: aplica el campo espacial escalado a 15.341 días para generar series diarias en cada celda

### 2. Emulador GP para CDF de cópula vine 5D

Funciones para aproximar la función de distribución acumulada (CDF) de una cópula vine multivariante (5D) mediante un GP emulador:

#### `CDF_simulate_5D(vine_copula_model, n_samples=1_000_000)`
Calcula la CDF de la cópula vine en 5 dimensiones mediante integración Monte Carlo (1M muestras). Entrena un `GaussianProcessRegressor` sobre esas muestras para obtener un emulador rápido, y predice la CDF en lotes.

#### `Train_gpr_model_5D(X_train, y_train)`
Entrena el modelo GP con kernel `RationalQuadratic` sobre las muestras de la cópula. Devuelve el modelo entrenado que luego se usa como sustituto (surrogate) para evaluar la CDF sin recalcular Monte Carlo.

## Dependencias

```
scikit-learn
gstools
pykrige
numpy
pandas
xarray
```
