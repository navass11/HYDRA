import os
import cdsapi
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import time

def descargar_periodo(c, model, per, variable, experiment, temporal_resolution, area, download_dir, max_retries=3):
    """
    Función para descargar los datos para un periodo específico de un modelo.
    Reintenta la descarga si ocurre algún error y verifica si el archivo ya existe.
    """
    download_path = os.path.join(download_dir, f'{model}_{variable}_{experiment}_{per.year}.zip')

    # Verificar si el archivo ya existe
    if os.path.exists(download_path):
        print(f"Archivo ya existe: {download_path}. No se descarga nuevamente.")
        return

    # Intentar la descarga varias veces en caso de error
    for attempt in range(max_retries):
        try:
            if temporal_resolution == 'monthly':
                request = {
                    'temporal_resolution': temporal_resolution,
                    'experiment': experiment,
                    'variable': variable,
                    'model': model,
                    'year': [f'{per.year}'],
                    'month': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                    'area': area
                }
            else:
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

            print(f"Descargando {model} para el año {per.year} (intento {attempt + 1})...")
            c.retrieve('projections-cmip6', request, download_path)
            print(f"Descarga completada: {download_path}")
            break  # Si la descarga es exitosa, salir del ciclo de reintento

        except Exception as e:
            print(f"Error al descargar {model} para el año {per.year} en el intento {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                wait_time = 5 * (attempt + 1)  # Incrementar el tiempo de espera entre intentos
                print(f"Reintentando en {wait_time} segundos...")
                time.sleep(wait_time)
            else:
                print(f"Fallo definitivo en la descarga de {model} para el año {per.year} después de {max_retries} intentos.")

def descargar_modelo(c, model, periodos, variable, experiment, temporal_resolution, area, download_dir, max_workers=5, max_retries=3):
    """
    Función para descargar los datos para un modelo en particular en paralelo por periodo (año).
    """
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(descargar_periodo, c, model, per, variable, experiment, temporal_resolution, area, download_dir, max_retries)
                   for per in periodos]
        
        # Esperar a que todas las descargas terminen
        for future in futures:
            future.result()

def download_CDS_CMIP6(url, api_key, start_date, end_date, temporal_resolution, variable, model, experiment, area, download_dir, max_workers=5, max_retries=3):
    c = cdsapi.Client(url=url, key=api_key)

    # Lista de modelos
    modelos_cds = [
        'access_cm2', 'access_esm1_5', 'awi_cm_1_1_mr', 'awi_esm_1_1_lr',
        'bcc_csm2_mr', 'bcc_esm1', 'cams_csm1_0', 'canesm5', 'canesm5_canoe',
        'cesm2', 'cesm2_fv2', 'cesm2_waccm', 'cesm2_waccm_fv2', 'ciesm',
        'cmcc_cm2_hr4', 'cmcc_cm2_sr5', 'cmcc_esm2', 'cnrm_cm6_1', 'cnrm_cm6_1_hr',
        'cnrm_esm2_1', 'e3sm_1_0', 'e3sm_1_1', 'e3sm_1_1_eca', 'ec_earth3',
        'ec_earth3_aerchem', 'ec_earth3_cc', 'ec_earth3_veg', 'ec_earth3_veg_lr',
        'fgoals_f3_l', 'fgoals_g3', 'fio_esm_2_0', 'gfdl_esm4', 'giss_e2_1_g',
        'giss_e2_1_h', 'hadgem3_gc31_ll', 'hadgem3_gc31_mm', 'iitm_esm', 'inm_cm4_8',
        'inm_cm5_0', 'ipsl_cm5a2_inca', 'ipsl_cm6a_lr', 'kace_1_0_g', 'kiost_esm',
        'mcm_ua_1_0', 'miroc6', 'miroc_es2h', 'miroc_es2l', 'mpi_esm_1_2_ham',
        'mpi_esm1_2_hr', 'mpi_esm1_2_lr', 'mri_esm2_0', 'nesm3', 'norcpm1',
        'noresm2_lm', 'noresm2_mm', 'sam0_unicon', 'taiesm1', 'ukesm1_0_ll'
    ]

    # Crear periodos anuales
    periodos = pd.date_range(start=start_date, end=end_date, freq='YE')

    # Usar un ThreadPoolExecutor para paralelizar las descargas
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        if model == 'All':
            # Descargar para todos los modelos en paralelo
            futures = [executor.submit(descargar_modelo, c, nmodel, periodos, variable, experiment, temporal_resolution, area, download_dir, max_workers, max_retries)
                       for nmodel in modelos_cds]
        else:
            # Descargar solo para un modelo específico
            futures = [executor.submit(descargar_modelo, c, model, periodos, variable, experiment, temporal_resolution, area, download_dir, max_workers, max_retries)]
        
        # Esperar a que todas las tareas terminen
        for future in futures:
            future.result()