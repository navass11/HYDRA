"""
Author: Salvador Navas
Date: 2025-06-27
"""

from concurrent.futures import ThreadPoolExecutor, as_completed, Future
import os
import time
import pandas as pd
import cdsapi
import sys

def descargar_periodo(c, model, per, variable, experiment, temporal_resolution, area, download_dir, max_retries=3):
    """
    Descarga datos para un periodo específico de un modelo.
    Reintenta la descarga si ocurre algún error y detiene el proceso ante un error crítico como RoocsValueError.
    """
    download_path = os.path.join(download_dir, f'{model}_{variable}_{experiment}_{temporal_resolution}_{per.year}.zip')

    # Verificar si el archivo ya existe
    if os.path.exists(download_path):
        print(f"Archivo ya existe: {download_path}. No se descarga nuevamente.")
        return True  # No cuenta como fallo

    # Intentar la descarga varias veces en caso de error
    for attempt in range(max_retries):
        try:
            request = {
                'temporal_resolution': temporal_resolution,
                'experiment': experiment,
                'variable': variable,
                'model': model,
                'year': [f'{per.year}'],
                'month': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                'day': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13',
                        '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
                        '27', '28', '29', '30', '31'],
                'area': area
            }

            print(f"Descargando {model} - {variable} - {experiment} para el año {per.year} (intento {attempt + 1})...")
            c.retrieve('projections-cmip6', request, download_path)
            print(f"Descarga completada: {download_path}")
            return True  # Descarga exitosa

        except Exception as e:
            # Manejar específicamente RoocsValueError
            if "RoocsValueError" in str(e):
                print(f"Error crítico detectado (RoocsValueError) para {model} en el año {per.year}.")
                raise RuntimeError("Error crítico: RoocsValueError detectado")  # Propagar error crítico
            else:
                print(f"Error al descargar {model} para el año {per.year} en el intento {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    wait_time = 5 * (attempt + 1)
                    print(f"Reintentando en {wait_time} segundos...")
                    time.sleep(wait_time)

    print(f"Fallo definitivo en la descarga de {model} para el año {per.year} después de {max_retries} intentos.")
    return False  # Descarga fallida


def cancelar_tareas_pendientes(tareas):
    """
    Cancela todas las tareas pendientes.
    """
    for future in tareas:
        if not future.done():
            future.cancel()
            print("Tarea cancelada.")


def descargar_modelo(c, combinaciones, periodos, temporal_resolution, area, download_dir, max_workers=5, max_retries=3):
    """
    Descarga datos para un modelo en paralelo por periodo (año).
    Cancela todas las tareas pendientes si ocurre un error crítico.
    """
    for _, fila in combinaciones.iterrows():
        model, variable, experiment = fila['model'], fila['variable'], fila['experiment']
        fallos_consecutivos = 0  # Contador de fallos consecutivos por modelo
        tareas = []
        error_critico = False  # Bandera para errores críticos

        try:
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                # Programar tareas para todos los periodos
                for per in periodos:
                    if error_critico:
                        break  # Detener programación si hay un error crítico
                    tareas.append(executor.submit(
                        descargar_periodo,
                        c, model, per, variable, experiment, temporal_resolution, area, download_dir, max_retries
                    ))

                # Procesar resultados conforme finalizan
                for tarea in as_completed(tareas):
                    try:
                        resultado = tarea.result()
                        if not resultado:  # Si la descarga falló por otros motivos
                            fallos_consecutivos += 1
                            print(f"{model}: Fallo consecutivo {fallos_consecutivos}.")
                            if fallos_consecutivos > 2:
                                print(f"Modelo {model} detenido debido a más de 2 fallos consecutivos.")
                                cancelar_tareas_pendientes(tareas)
                                break
                        else:  # Si tiene éxito
                            fallos_consecutivos = 0  # Reiniciar el contador de fallos
                    except RuntimeError as e:
                        if "RoocsValueError" in str(e):
                            print(f"Descarga del modelo {model} detenida debido a un error crítico: {e}")
                            error_critico = True  # Detener procesamiento de este modelo
                            cancelar_tareas_pendientes(tareas)
                            break
                        else:
                            raise e  # Propagar otros errores no críticos
        except Exception as e:
            print(f"Error inesperado al descargar {model}: {e}")


def download_CDS_CMIP6(url, api_key, start_date, end_date, temporal_resolution, model, experiments, variables, download_base_dir, area, max_workers=5, max_retries=3):
    """
    Función principal para filtrar combinaciones válidas y descargar los datos.
    """
    c = cdsapi.Client(url=url, key=api_key)

    # Leer combinaciones válidas desde el archivo CSV
    if temporal_resolution == 'daily':
        combinaciones_validas = pd.read_csv('../HYDRA/data/ClimateChange/combinaciones_validas_daily.csv')
    elif temporal_resolution == 'monthly':
        combinaciones_validas = pd.read_csv('../HYDRA/data/ClimateChange/combinaciones_validas_monthly.csv')
    else:
        raise ValueError("La resolución temporal debe ser 'daily' o 'monthly'.")

    # Filtrar combinaciones según las variables y escenarios especificados por el usuario
    combinaciones_filtradas = combinaciones_validas[
        combinaciones_validas['experiment'].isin(experiments) &
        combinaciones_validas['variable'].isin(variables)
    ]

    if model != 'All':
        combinaciones_filtradas = combinaciones_filtradas[combinaciones_filtradas['model'] == model]

    if combinaciones_filtradas.empty:
        print("No se encontraron combinaciones válidas para los parámetros seleccionados.")
        return

    # Crear periodos anuales
    periodos = pd.date_range(start=start_date, end=end_date, freq='Y')

    # Descargar datos
    descargar_modelo(
        c,
        combinaciones_filtradas,
        periodos,
        temporal_resolution,
        area,
        download_base_dir,
        max_workers,
        max_retries
    )
