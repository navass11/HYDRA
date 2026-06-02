# Data Sources — Rainfall

Scripts para la descarga y preprocesado de datos de precipitación procedentes de satélite, reanálisis y redes de observación.

## Submódulos

| Fuente | Tipo | Resolución espacial | Cobertura |
|---|---|---|---|
| `GPM/` | Satélite NASA/JAXA (IMERG) | 0.1° (~11 km) | Global 60°S–60°N, 2000–presente |
| `PERSSIAN/` | Satélite UCI (PERSIANN-CCS) | 0.04° (~4 km) | Global 60°S–60°N, 2003–presente |
| `ERA-5/` | Reanálisis ECMWF | 0.25° (~31 km) | Global, 1940–presente |
| `AEMET/` | Estaciones terrestres España | Puntual | Red AEMET, 2000–presente |
| `OGIMET/` | Estaciones SYNOP globales | Puntual | Red OMM global |

## Notas generales

- GPM, PERSSIAN y ERA-5 producen salida en formato **NetCDF4**
- AEMET y OGIMET producen salida en **CSV** por estación
- Todos los módulos incluyen descarga paralela con reintentos automáticos
- AEMET y OGIMET tienen interfaz interactiva basada en **ipyleaflet** para selección de estaciones en un mapa
