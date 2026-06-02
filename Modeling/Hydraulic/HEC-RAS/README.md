# HEC-RAS — Hydrologic Engineering Center River Analysis System

Scripts para la automatización de **HEC-RAS** desde Python, aplicados a proyectos de rotura de presa (Surinam) y análisis de cambio climático (Los Corrales de Buelna).

## Contenido: `8_HecRAS_v2.ipynb`

Notebook con funciones de automatización del modelo HEC-RAS y bucles de ejecución para múltiples hidrogramas de entrada.

---

## Funciones implementadas

### Modificación de archivos de entrada

#### `Modificar_U(path_project, name_project, Fichero, rainfall_plan_name)`
Modifica el archivo de condiciones de contorno no permanente (`.u01`, `.u02`, ...) de HEC-RAS con nuevas series de lluvia. Copia el fichero de lluvias actualizado y actualiza el plan.

#### `modificar_p(path_project, name_project, number_sim_plan, rainfall_plan_name)`
Modifica el archivo de plan (`.pNN`) para apuntar al nuevo fichero de condiciones de contorno.

#### `modificar_prj(path_project, name_project, number_sim_plan, rainfall_plan_name)`
Actualiza el archivo de proyecto (`.prj`) para incluir el nuevo plan de simulación.

#### `obtener_diccionario_lineas(file_path, search_words)`
Parsea un archivo `.u01` y devuelve un diccionario con el número de fila de cada BC Line (condición de contorno de flujo).

#### `buscar_indice(subcadena, lines_filter)`
Detecta el índice actualizado de una BC Line tras cada modificación del archivo, ya que las filas cambian posición en cada escritura.

#### `create_series(df)`
Convierte un DataFrame de pandas con series temporales de caudal al formato de texto que lee HEC-RAS en las BC Lines.

### Exportación de resultados

#### `generate_flow(path_project, name_project, path_save, name_file)`
Exporta los caudales simulados del DSS de resultados de HEC-RAS a CSV (upstream).

#### `generate_flow_down(path_project, name_project, path_save, name_file, pathname)`
Igual para los caudales aguas abajo. Permite especificar el pathname DSS del que extraer la serie.

### Utilidades

#### `suavizar_serie_temporal(df, columna_temporal, ventana=5)`
Suaviza una serie temporal mediante media móvil de ventana configurable.

#### `suavizar_serie_temporal_maximo(df, columna_temporal, ventana=5)`
Suaviza con el máximo móvil en lugar de la media.

#### `crear_nueva_carpeta(directorio, nombre_carpeta)`
Crea un directorio de salida si no existe.

---

## Ejecución controlada desde Python

Usa `rascontrol` para abrir el proyecto, ejecutar el plan actual y cerrar sin intervención manual:

```python
from rascontrol import RasController

rc = RasController(version='641')
rc.open_project(path_project + name_river + '.prj')
rc.run_current_plan()
rc.close()
```

#### `Execute_Hec_RAS(config)`
Función que encapsula el flujo completo: modifica condiciones de contorno, ejecuta el plan y extrae resultados.

---

## Aplicaciones en el notebook

### Proyecto Surinam (rotura de presa)

- Hidrogramas de entrada aguas arriba (T=5,10,100,500,1000,5000,10000 años; intensidades I1–I4)
- Condiciones de contorno en múltiples BC Lines aguas abajo (23 secciones)
- Dos escenarios: compuertas abiertas / compuertas cerradas
- Extracción de caudales y calados en cada BC Line por período de retorno

### Proyecto Los Corrales de Buelna (cambio climático)

- Bucle sobre RCP45/RCP85 × 3 períodos futuros (2011–2040, 2041–2070, 2071–2100) × 8 períodos de retorno
- Hidrogramas reconstruidos mediante cópulas (ver `Copulas/`)
- Generación de manchas de inundación para cada escenario

---

## Dependencias

```
rascontrol
pydsstools
pandas
numpy
matplotlib
yaml
tqdm
geopandas
```
