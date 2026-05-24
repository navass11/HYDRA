# Pixel-Based Return Period

Estimación de períodos de retorno de precipitación a resolución de píxel combinando el análisis de frecuencia regional con el campo de climatología de alta resolución.

## Descripción

Este módulo transfiere los cuantiles de precipitación extrema estimados por el RFA (a escala de estaciones de aforo) al espacio continuo de alta resolución, usando la climatología media como índice espacial de referencia (índice de crecida).

## Metodología

1. **RFA** (ver `Spatial_Analysis/RFA/`) → curva de crecimiento regional Q(T)/Q̄
2. **Interpolación** del índice de crecida Q̄ → campo continuo de precipitación media anual
3. **Producto** → cuantil espacial a resolución de píxel:

```
P(T, pixel) = Q̄(pixel) × growth_curve(T)
```

## Ventajas

- Aprovecha toda la red de estaciones mediante RFA
- Conserva la variabilidad espacial de la climatología a alta resolución
- Coherente con el análisis de frecuencia a escala puntual

## Ejemplo de uso

```python
from hydra.climate.downscaling.pixel_return_period import PixelReturnPeriod

prt = PixelReturnPeriod(
    rfa_quantiles=rfa_results,          # GeoDataFrame con cuantiles por estación
    climatology_raster=mean_annual_precip_hr,
    return_periods=[10, 25, 50, 100, 200, 500]
)

maps = prt.compute()   # dict {T: xr.DataArray}
```

## Aplicaciones

- Mapas de peligrosidad por precipitación extrema bajo clima presente
- Entrada para modelos hidráulicos (SFINCS, HEC-RAS) en estudios de inundación
- Evaluación del cambio en frecuencia de extremos bajo escenarios SSP

## Referencias

- Kjeldsen, T.R. et al. (2014). Operational adjustment of extreme rainfall and flood frequency. *NERC/CEH*.
