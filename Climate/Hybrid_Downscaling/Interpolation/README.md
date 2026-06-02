# Hybrid Downscaling — Interpolation

Downscaling de campos climáticos de baja resolución a alta resolución mediante técnicas de interpolación espacio-temporal con covariables físicas.

## Métodos

### Regression-Kriging espacio-temporal
Combina una regresión sobre covariables (altitud, latitud, distancia al mar) con kriging de los residuos para generar campos espacialmente continuos a la resolución objetivo.

### Disaggregation con conservación de masa
Desagrega el total de precipitación del píxel de baja resolución en sub-píxeles manteniendo el volumen total:

```
P_subpixel = P_coarse × (climatology_subpixel / mean(climatology_in_coarse_pixel))
```

### BCSD (Bias Correction and Spatial Disaggregation)
Método híbrido estándar:
1. Corrección de sesgo del modelo en baja resolución (QQ Mapping)
2. Interpolación del campo corregido a la resolución objetivo
3. Escalado multiplicativo para preservar la climatología local

## Ejemplo de uso

```python
from hydra.climate.downscaling.interpolation import BCSDDownscaler

bcsd = BCSDDownscaler(
    target_resolution=0.01,   # ~1 km
    method="bilinear",
    climatology_dataset=chirps_monthly_climatology
)

high_res = bcsd.downscale(
    coarse_field=gcm_monthly_precip,
    dem=digital_elevation_model
)
```

## Dependencias

```
xarray
rioxarray
rasterio
scipy
```

## Referencias

- Wood, A.W. et al. (2002). Long-Range Experimental Hydrologic Forecasting for the Eastern United States. *J. Geophys. Res.*, 107(D20).
