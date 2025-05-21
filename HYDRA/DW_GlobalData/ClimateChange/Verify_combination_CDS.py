from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time

# Configuración del controlador de Selenium
driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

# URL de la página de Copernicus
url = 'https://cds.climate.copernicus.eu/datasets/projections-cmip6?tab=download'

# Variables y escenarios a iterar
experiments = ['historical','ssp1_1_9','ssp1_2_6','ssp4_3_4', 'ssp2_4_5', 'ssp4_6_0','ssp3_7_0','ssp5_8_5']
variables = ['precipitation', 'daily_maximum_near_surface_air_temperature', 'daily_minimum_near_surface_air_temperature',
             'near_surface_air_temperature','near_surface_wind_speed','sea_level_pressure','near_surface_specific_humidity']
models = [
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

# Lista para guardar combinaciones válidas
combinaciones_validas = []

temporal_resolution = 'monthly' #'daily, monthly'

# Función para hacer clic en un elemento con scroll adicional y reintentos
def scroll_and_click(element, retries=10):
    for attempt in range(retries):
        try:
            driver.execute_script("arguments[0].scrollIntoView(true);", element)
            wait.until(EC.element_to_be_clickable((By.ID, element.get_attribute('id')))).click()
            return  # Salir de la función si el clic fue exitoso
        except Exception as e:
            if attempt < retries - 1:
                print(f"Reintentando clic en elemento {element.get_attribute('id')} (intento {attempt + 1})")
                time.sleep(10)
            else:
                print(f"No se pudo hacer clic en el elemento {element.get_attribute('id')} después de {retries} intentos. Error: {e}")

# Iterar sobre cada experimento
for experiment in experiments:
    # Cargar la página inicial para cada experimento
    driver.get(url)
    time.sleep(10)

    # Aceptar cookies si el popup aparece
    try:
        accept_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Accept all']")))
        accept_button.click()
    except:
        pass  # Si no aparece la ventana de cookies, continuar

    # Seleccionar la resolución temporal y el experimento actual con reintento
    try:
        scroll_and_click(driver.find_element(By.ID, temporal_resolution))
        time.sleep(10)
        experiment_button = wait.until(EC.presence_of_element_located((By.ID, experiment)))
        scroll_and_click(experiment_button)
        time.sleep(10)
    except Exception as e:
        print(f"No se pudo seleccionar el experimento {experiment}. Error: {e}")
        continue  # Ir al siguiente experimento si ocurre un error

    # Iterar sobre cada variable dentro del experimento seleccionado
    for variable in variables:
        try:
            # Seleccionar la variable actual con reintento
            variable_button = wait.until(EC.presence_of_element_located((By.ID, variable)))
            scroll_and_click(variable_button)
            time.sleep(10)
        except Exception as e:
            print(f"No se pudo seleccionar la variable {variable}. Error: {e}")
            continue  # Ir a la siguiente variable si ocurre un error

        # Revisar modelos habilitados para la combinación actual de experimento y variable
        for model in models:
            try:
                model_button = driver.find_element(By.ID, model)
                if model_button.is_enabled():
                    combinaciones_validas.append({"experiment": experiment, "variable": variable, "model": model})
                    print(f"Combinación válida: {experiment}, {variable}, {model}")
                else:
                    print(f"Combinación NO válida: {experiment}, {variable}, {model}")
            except Exception as e:
                print(f"Error al verificar el modelo {model}: {e}")
            time.sleep(1)

# Cerrar el navegador
driver.quit()

# Guardar las combinaciones válidas en un archivo CSV
df_combinaciones = pd.DataFrame(combinaciones_validas)
df_combinaciones.to_csv(f"combinaciones_validas_{temporal_resolution}.csv", index=False)
print("Combinaciones válidas guardadas en combinaciones_validas.csv")
