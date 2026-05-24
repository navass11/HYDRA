# SWAT — Soil and Water Assessment Tool

Scripts para la preparación de entradas climáticas, ejecución automatizada y lanzamiento en cluster HPC del modelo hidrológico **SWAT**.

## Contenido

| Fichero | Descripción |
|---|---|
| `Clima_SWAT.ipynb` | Genera ficheros de clima SWAT desde series bias-corregidas de CMIP6 |
| `Ejecucion_CC_Cluster.py` | Lanza simulaciones SWAT en HPC vía SLURM para 15 modelos × 2 SSPs |
| `job_results.sl` | Script SLURM de ejemplo |

Aplicaciones: cuenca Escudo (España, proyecto IBERDROLA) y proyecto Swat_SPAIN.

---

## `Clima_SWAT.ipynb` — preparación de entradas climáticas

### Funciones implementadas

#### `generar_fichero_prec(df_coords, df_series, output_file)`
Genera el fichero de precipitación en formato SWAT (`.pcp`): cabecera con metadatos de estaciones (ID, nombre, latitud, longitud, elevación) seguida de las series diarias con formato fijo.

#### `escribir_serie_temporal(df, nombre_archivo)`
Escribe una serie temporal de una variable (precipitación u otra) al formato de texto SWAT con fecha en formato `YYJJJ`.

#### `escribir_serie_temporal_dos_columnas(df, nombre_archivo)`
Igual pero para temperatura (escribe tmax y tmin en dos columnas en el mismo fichero `.tmp`).

#### `editar_file_cio(ruta_archivo, año_inicio, año_final)`
Edita el archivo `file.cio` (archivo maestro de SWAT) para actualizar el año de inicio (`IYR`) y el número de años a simular (`NBYR`).

#### `ejecutar_swat(carpeta_escenario, swat_exe_path)`
Ejecuta el binario de SWAT dentro del directorio del escenario mediante `subprocess`.

#### `copiar_escenario(input_dir, output_dir, escenario_name, exclude_extensions)`
Copia la estructura del directorio base del modelo SWAT a un nuevo directorio de escenario, excluyendo opcionalmente ciertos tipos de archivo.

---

### Flujo de trabajo del notebook

1. **Carga datos climáticos futuros**: series de precipitación (CMIP6) y temperatura máxima/mínima corregidas por sesgo (SSP245 y SSP585)
2. **Normaliza los índices temporales** (convierte `cftime` a `datetime`)
3. **Genera ficheros de precipitación** por estación para SSP245 y SSP585 (`stpcp.txt` + series `.txt`)
4. **Genera ficheros de temperatura** por estación (tmax + tmin en el mismo archivo)
5. **Edita `file.cio`** para los años del período futuro (2039–2060)
6. **Copia la estructura del modelo** base a un nuevo directorio por modelo climático y SSP
7. **Ejecuta SWAT** para cada escenario (`ejecutar_swat`)

---

## `Ejecucion_CC_Cluster.py` — lanzamiento HPC con SLURM

Automatiza el envío de simulaciones SWAT a un cluster HPC (IH Cantabria) usando SLURM. Para cada combinación de modelo climático (15 modelos CMIP6) y escenario (SSP245, SSP585):

1. Genera dinámicamente un script SLURM (`job_cluster.sl`) con:
   ```bash
   #!/bin/bash
   #SBATCH -J Model_miroc6_SSP245
   #SBATCH --time=24:00:00
   #SBATCH --mem-per-cpu=8Gb
   ml SWAT/SWAT-61.0.1
   cd /home/projects/cuencasresilientes/.../TxtInOut/
   swat
   ```
2. Escribe el script al disco
3. Envía con `sbatch job_cluster.sl`

**Modelos CMIP6 usados**: miroc_es2l, cnrm_cm6_1, miroc6, inm_cm5_0, mri_esm2_0, inm_cm4_8, kace_1_0_g, access_cm2, mpi_esm1_2_lr, noresm2_mm, cnrm_esm2_1, cmcc_esm2, nesm3, ec_earth3_cc, ec_earth3_veg_lr

---

## Dependencias

```
pandas
numpy
xarray
cftime
subprocess
os
```
