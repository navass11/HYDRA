#!/bin/bash
#SBATCH -J Resultados_SWAT
#SBATCH --time=24:00:00 # Walltime
#SBATCH --mem-per-cpu=32Gb # memory/cpu 
#SBATCH --ntasks=1      # MPI processes
#SBATCH -A cuencasresilientes

echo "Ejecutando"
ml Python
source /home/users/navass/SWAT/bin/activate
cd /home/projects/cuencasresilientes/03_INUNDACION/SWAT/
python Leer_Resultados_Cluster.py
