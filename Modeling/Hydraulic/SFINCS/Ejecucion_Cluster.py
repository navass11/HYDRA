import os

path_caudal = [
    'H:/N4C_24062024/Inflows_situacion_actual_N4C_v2.xlsx',
    'H:/N4C_24062024/Inflows_SSP585_2030_N4C_v2.xlsx',
    'H:/N4C_24062024/Inflows_SSP585_2050_N4C_v2.xlsx'
]

path_output = '/Storage/it/CuencasResilientes/N4C/'

for p, per in enumerate(path_caudal):
    if p == 0:
        period = 'historical'
    elif p == 1:
        period = '2030'
    else:
        period = '2050'
    
    for T in ['Q10', 'Q50', 'Q100']:
        ruta_carpeta = '{}{}/{}/Basin_108/'.format(path_output, period, T)
        # Cambia al directorio de la carpeta
        os.chdir(ruta_carpeta)
        
        # Ejecuta el archivo generado con sbatch usando os.system desde dentro de la carpeta
        comando_sbatch = "docker run --gpus all -v$(pwd):/data deltares/sfincs-gpu > sfincs_log.txt"
        os.system(comando_sbatch)
