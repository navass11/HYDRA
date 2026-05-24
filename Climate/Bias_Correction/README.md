# Bias Correction — Corrección de Sesgo

Métodos para corregir los sesgos sistemáticos presentes en las salidas de modelos climáticos (GCMs/RCMs) respecto a las observaciones.

## Submódulos

| Método | Carpeta | Complejidad | Preserva cambio de señal |
|---|---|---|---|
| Delta | `Delta/` | Baja | Sí |
| Quantile-Quantile Mapping | `QQ_Mapping/` | Media | Parcialmente |

## Concepto general

Los modelos climáticos presentan sesgos sistemáticos en media, varianza y distribución de frecuencias que deben corregirse antes de usar sus salidas en modelización hidrológica. Los métodos de corrección de sesgo se calibran comparando el período histórico del modelo con las observaciones y aplican la corrección a las proyecciones futuras.

## Consideraciones

- La corrección de sesgo **no mejora la habilidad dinámica** del modelo; sólo corrige errores estadísticos.
- Aplicar corrección de sesgo a percentiles extremos requiere registros históricos suficientemente largos.
- Se recomienda validar la estacionariedad del sesgo antes de aplicar a escenarios futuros.

## Dependencias

```
numpy
scipy
xarray
xclim   # librería especializada en corrección de sesgo climático
ibicus  # bias adjustment and downscaling
```
