import os

modelos_comunes = ['miroc_es2l', 'cnrm_cm6_1', 'miroc6', 'inm_cm5_0', 
                   'mri_esm2_0', 'inm_cm4_8', 'kace_1_0_g', 
                   'access_cm2', 'mpi_esm1_2_lr', 'noresm2_mm', 'cnrm_esm2_1', 
                   'cmcc_esm2', 'nesm3', 'ec_earth3_cc', 'ec_earth3_veg_lr']

for nmodel in modelos_comunes:
    for ssp in ['SSP245','SSP585']:
        nombre_proyecto = f'Model_{nmodel}_{ssp}'

        contenido = f"""#!/bin/bash
#SBATCH -J {nombre_proyecto}
#SBATCH --time=24:00:00 # Walltime
#SBATCH --mem-per-cpu=8Gb # memory/cpu 
#SBATCH --ntasks=1      # MPI processes
#SBATCH -A cuencasresilientes

echo "Ejecutando"
ml SWAT/SWAT-61.0.1
cd /home/projects/cuencasresilientes/03_INUNDACION/SWAT/Escudo_Malla_25m/Scenarios/{nombre_proyecto}/TxtInOut/
rm -f simulation.out
rm -f success.fin
swat
"""
        ruta_fichero = f"/home/projects/cuencasresilientes/03_INUNDACION/SWAT/job_cluster.sl"
        with open(ruta_fichero, 'w') as f:
            f.write(contenido)
        print(f"Archivo generado: {ruta_fichero}")

        os.chdir('/home/projects/cuencasresilientes/03_INUNDACION/SWAT/')

        # Ejecuta el archivo generado con sbatch usando os.system desde dentro de la carpeta
        comando_sbatch = f"sbatch job_cluster.sl"
        os.system(comando_sbatch)

        print(f"Simulación {nombre_proyecto} Ejecutada.")

