# Modeling

Módulo de interfaz con modelos hidrológicos e hidráulicos. Proporciona herramientas para la preparación de datos de entrada, automatización de simulaciones y postprocesado de resultados.

## Submódulos

| Carpeta | Tipo | Modelos |
|---|---|---|
| `Hydrology/` | Modelos hidrológicos cuenca-escorrentía | SWAT, HEC-HMS |
| `Hydraulic/` | Modelos hidráulicos de inundación | SFINCS, HEC-RAS |

## Flujo de trabajo general

```
Climate/ (precipitación, temperatura, ET)
        ↓
Hydrology/ (caudales en puntos de control)
        ↓
Hydraulic/ (lámina de inundación, velocidades)
```

## Convenciones

- Los archivos de entrada y salida se almacenan junto a cada modelo en sus subcarpetas.
- Las simulaciones de conjunto (ensemble) se numeran con índice secuencial: `sim_001`, `sim_002`, …
- Los resultados postprocesados se exportan en formato NetCDF o GeoTIFF para compatibilidad con el resto de módulos.
