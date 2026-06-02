# HEC-HMS — Hydrologic Engineering Center Hydrologic Modeling System

Hay diferente código, uno para generar los parámetros y otro para poder ejecutar.
Algunas funciones ya fueron creadas y están en este repo https://github.com/navass11/HEC-HMS/tree/master.

## Contenido

| Fichero | Descripción |
|---|---|
| `funciones_HMS.py` | Librería principal de funciones de automatización |
| `HMS.ipynb` | Flujo completo: configuración, ejecución y extracción de resultados |
| `HMS_Embalse.ipynb` | Igual con embalse (reservorio) en el modelo |
| `HMS-Cambio Climatico.ipynb` | Ejecución del modelo con precipitación de escenarios climáticos |
| `HMS-Cambio Climatico_EMBALSE.ipynb` | Igual con embalse |
| `Calibracion_HMS.ipynb` | Calibración manual y automática de parámetros |
| `Parametros_HMS.ipynb` | Cálculo del número de curva y parámetros iniciales |

Aplicación principal: cuenca Oued Mellah (Túnez) para análisis hidrológico y de sedimentos.

---

## `funciones_HMS.py` — funciones de automatización

### Lectura de archivos del proyecto

| Función | Descripción |
|---|---|
| `read_gages(path, file)` | Lee el `.gage` y devuelve lista de nombres de estaciones de precipitación |
| `read_met(path, file)` | Lee el `.met` y devuelve los nombres de los módulos meteorológicos |
| `read_basin(path, file)` | Lee el `.basin` y devuelve los nombres de las cuencas |
| `read_subbasin(path, file)` | Lee el `.basin` y devuelve los nombres de las subcuencas |
| `read_control(path, file)` | Lee el `.hms` y devuelve los controles de tiempo |
| `Read_run(path, file)` | Lee el `.run` y devuelve los nombres de las corridas |

### Creación de archivos de entrada

#### `generate_gage(name_model, names_stations, time_interval, path, start, end, file_dss)`
Crea o actualiza el archivo `.gage` con los pathnames DSS de precipitación para cada estación.

#### `fill_gage(names_stations, path_rain, time_interval, path, file_dss, start, end)`
Escribe los datos de precipitación en el `.dss` usando `pydsstools.TimeSeriesContainer`. Carga los CSV de lluvia de cada estación y los almacena en el DSS con el pathname correspondiente.

#### `generate_met(name_met, names_sbasin, names_stations, path, name_basin, Evapotranspiration=False, ET_Table=None)`
Genera el archivo `.met` con el módulo meteorológico "Specified Average". Si `Evapotranspiration=True`, añade una tabla mensual de ETP (Priestley-Taylor) por subcuenca.

#### `generate_met_freq_storm(name_met, names_sbasin, T, IDF, path, name_basin)`
Genera el `.met` con tormenta sintética basada en curvas IDF para el período de retorno `T`. Usa la metodología "Frequency Based Hypothetical Precipitation".

#### `generate_hms(name_model, path, names_met, file_dss, names_basin, names_control)`
Reescribe el archivo de proyecto `.hms` con todos los módulos meteorológicos disponibles.

#### `generate_control(name_model, path, name_control, start, end, time_interval)`
Crea el `.control` con los tiempos de inicio y fin de simulación y el intervalo de cálculo.

#### `generate_run(path, name_model, name_run, name_met, name_basin, name_control)`
Crea el archivo `.run` que asocia módulo meteorológico, cuenca y control en una corrida.

#### `Generate_py(path, name_model, list_runs)`
Genera el script Python `compute_current.py` para ejecución headless de HMS desde línea de comandos.

#### `generate_flow(path, name_run, ...)`
Lee el caudal simulado del `.dss` de resultados y lo exporta a CSV por subcuenca/junction.

---

## `HMS.ipynb` — flujo de trabajo principal

1. Lee configuración del modelo (gages, subcuencas, controles)
2. Genera el gage DSS con precipitaciones históricas (`fill_gage`)
3. Genera módulo meteorológico con ETP mensual (`generate_met`)
4. Regenera el `.hms` con todos los .met disponibles
5. Crea control y corrida para el período histórico
6. Genera el script de ejecución headless (`Generate_py`)
7. Ejecuta HMS: `os.system('HEC-HMS.cmd -script .../compute_current.py')`
8. **Régimen extremal**: crea un `.met` por período de retorno (T=2,5,10,20,50,100,500) con curvas IDF por subcuenca, ejecuta HMS para cada T y exporta hidrogramas de diseño a CSV/DSS

---

## `Calibracion_HMS.ipynb` — calibración

- Clase `hms_model`: modifica parámetros HMS (CN, tiempo de concentración, coeficiente de almacenamiento, ...) y ejecuta la simulación
- `findBestSim(dbPath, OF)`: carga los resultados de SCEUA de múltiples ejecuciones y selecciona la mejor según función objetivo (`bias`, `NSE`, `KGE`)
- Flujo SCE-UA: genera poblaciones de parámetros, ejecuta HMS para cada individuo y extrae métricas

---

## `Parametros_HMS.ipynb` — parametrización inicial

- Cálculo del Número de Curva (CN) a partir de texturas de suelo (SoilGrids → USDA) y uso del suelo
- Extracción de parámetros morfométricos de subcuencas (área, pendiente, longitud del cauce)
- Tablas de resumen exportadas para introducción manual en HMS

---

## `HMS-Cambio Climatico.ipynb` — cambio climático

- Importa `funciones_cambio_climatico` (funciones de bias correction y procesado de ensembles CMIP5)
- Para cada modelo climático (6 modelos regionales EURO-CORDEX) genera el `.gage` DSS con la precipitación corregida por sesgo
- Ejecuta HMS para cada modelo y período futuro
- Exporta caudales simulados por cuenca para análisis estadístico posterior

---

## Dependencias

```
pydsstools
pandas
numpy
gdal (osgeo)
matplotlib
scipy
```
