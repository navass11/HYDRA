# Hybrid Downscaling — Downscaling Estadístico Híbrido

Módulo para el aumento de resolución espacial de variables climáticas combinando métodos estadísticos e información de alta resolución auxiliar.

## Submódulos

| Carpeta | Descripción |
|---|---|
| `Interpolation/` | Downscaling por interpolación espacial con covariables |
| `Pixel_Based_Return_Period/` | Estimación de períodos de retorno a resolución de píxel |

## Concepto

El downscaling híbrido combina:
1. La señal climática de baja resolución del GCM/RCM (patrón de gran escala)
2. Información de alta resolución derivada de observaciones históricas (climatología local)
3. Covariables físicas (altitud, orientación, distancia al mar) para capturar efectos orográficos

## Flujo de trabajo típico

```
GCM/RCM (~25 km)  →  Bias Correction  →  Distribución corregida
Observaciones      →  Interpolation   →  Climatología local HR
                    ↓
            Hybrid Downscaling  →  Campo HR (~1 km) con señal GCM
```

## Aplicaciones

- Generación de escenarios de precipitación a escala de cuenca
- Entrada para modelos hidrológicos a alta resolución
- Mapas de inundación bajo cambio climático

## Dependencias

```
xarray
rioxarray
scipy
sklearn
pykrige
```
