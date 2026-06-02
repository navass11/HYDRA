import hydromt
from hydromt_sfincs import SfincsModel, utils
import matplotlib.pyplot as plt
import geopandas as gpd
import pandas as pd
import xarray as xr
from hydromt_sfincs import *
import numpy as np
from osgeo import gdal
from geopandas import GeoDataFrame
import os
import sys
import subprocess

import xarray as xr
import rioxarray
import numpy as np
from dask.distributed import Client
from rasterio.warp import Resampling  # Importar correctamente Resampling

def extract_result_hmax(raster_original, netcf_result, raster_result):
    # Iniciar un cliente de Dask para ejecutar cálculos en paralelo
    client = Client()

    # Cargar el dataset NetCDF con xarray usando chunks
    ds = xr.open_mfdataset(netcf_result, chunks={'time': -1, 'x': 50, 'y': 50})
    
    # Seleccionar la variable 'h' y calcular el valor máximo a lo largo del tiempo
    h_max = ds['h'].max(dim='time')

    # Convertir valores menores a 0.05 en NaN
    h_max = h_max.where(h_max >= 0.05, np.nan)

    # Aplanar las coordenadas 'x' e 'y', tomando solo una fila para 'x' y una columna para 'y'
    x_coords = ds['x'][0, :]
    y_coords = ds['y'][:, 0]

    # Asignar las nuevas coordenadas y establecer dimensiones correctas
    h_max = h_max.assign_coords({'x': x_coords, 'y': y_coords})
    h_max = h_max.rename({'n': 'y', 'm': 'x'})  # Renombrar las dimensiones 'n' y 'm' a 'x' e 'y'

    # Reordenar las dimensiones para que estén en el orden ('y', 'x')
    # h_max = h_max.transpose('y', 'x')
    h_max = h_max.rio.write_crs("EPSG:32617")  # Cambia al CRS correcto de tu NetCDF si es diferente

    # Cargar el raster original para obtener las propiedades
    with rioxarray.open_rasterio(raster_original) as ref_raster:
        # Obtener CRS y la transformación del raster original
        original_crs = ref_raster.rio.crs
        original_transform = ref_raster.rio.transform()

        # Escribir el CRS en el DataArray 'h_max'
        h_max = h_max.rio.write_crs("EPSG:32617")  # Cambia al CRS correcto de tu NetCDF si es diferente

        # Reproyectar el DataArray al CRS del raster de referencia
        h_max_reprojected = h_max.rio.reproject(
            dst_crs=original_crs,  # CRS del raster original
            transform=original_transform,
            shape=ref_raster.shape[1:],  # Mantener la misma forma del raster original
            resampling=Resampling.nearest  # Método de resampling correcto
        )

        # Guardar el DataArray reproyectado como un GeoTIFF
        h_max_reprojected.rio.to_raster(raster_result)

    # Cerrar el dataset NetCDF y Dask client
    ds.close()
    client.close()
    return h_max_reprojected


import os

def convert_eol_to_linux(directory):
    # Recorrer todos los archivos en el directorio
    for root, _, files in os.walk(directory):
        for file in files:
            # Verificar que el archivo tenga la extensión .dis o .inp
            if file.endswith('.dis') or file.endswith('.inp'):
                file_path = os.path.join(root, file)
                
                # Abrir el archivo y leer su contenido
                with open(file_path, 'r', newline='') as f:
                    content = f.read()
                
                # Reemplazar todas las terminaciones de línea con LF (\n)
                content = content.replace('\r\n', '\n').replace('\r', '\n')
                
                # Guardar el archivo nuevamente con la codificación correcta de fin de línea
                with open(file_path, 'w', newline='\n') as f:
                    f.write(content)

                print(f"Convertido EOL a Linux en: {file_path}")


def extract_result_speed(raster_original, netcf_result, raster_result):
    # Iniciar un cliente de Dask para ejecutar cálculos en paralelo
    client = Client()

    # Cargar el dataset NetCDF con xarray usando chunks
    ds = xr.open_mfdataset(netcf_result, chunks={'time': -1, 'x': 50, 'y': 50})
    hmin = 0.05

    hmax = ds['h'].max(dim='time')
    
    speed     = np.sqrt(ds.results['u']**2+ds.results['v']**2)
    speed_max = speed.max(dim='time').fillna(value=-9999)
    speed_max = speed_max.where(hmax > hmin)

    # Aplanar las coordenadas 'x' e 'y', tomando solo una fila para 'x' y una columna para 'y'
    x_coords = ds['x'][0, :]
    y_coords = ds['y'][:, 0]

    # Asignar las nuevas coordenadas y establecer dimensiones correctas
    speed_max = speed_max.assign_coords({'x': x_coords, 'y': y_coords})
    speed_max = speed_max.rename({'n': 'y', 'm': 'x'})  # Renombrar las dimensiones 'n' y 'm' a 'x' e 'y'

    # Reordenar las dimensiones para que estén en el orden ('y', 'x')
    # h_max = h_max.transpose('y', 'x')
    speed_max = speed_max.rio.write_crs("EPSG:32617")  # Cambia al CRS correcto de tu NetCDF si es diferente

    # Cargar el raster original para obtener las propiedades
    with rioxarray.open_rasterio(raster_original) as ref_raster:
        # Obtener CRS y la transformación del raster original
        original_crs = ref_raster.rio.crs
        original_transform = ref_raster.rio.transform()

        # Escribir el CRS en el DataArray 'h_max'
        speed_max = speed_max.rio.write_crs("EPSG:32617")  # Cambia al CRS correcto de tu NetCDF si es diferente

        # Reproyectar el DataArray al CRS del raster de referencia
        speed_max_reprojected = speed_max.rio.reproject(
            dst_crs=original_crs,  # CRS del raster original
            transform=original_transform,
            shape=ref_raster.shape[1:],  # Mantener la misma forma del raster original
            resampling=Resampling.nearest  # Método de resampling correcto
        )

        # Guardar el DataArray reproyectado como un GeoTIFF
        speed_max_reprojected.rio.to_raster(raster_result)

    # Cerrar el dataset NetCDF y Dask client
    ds.close()
    client.close()
    return speed_max_reprojected


def ejecution_SFINCS(basins,points,caudal,dem,manning,path_output,exe_sfincs,bas):
    # try:
        sel_basin = GeoDataFrame(basins.iloc[bas])
        mod = SfincsModel(root=path_output+T+'/Basin_'+str(basins.loc[bas].Cod_Cuen_H)+"/", mode='w+')

        basins[basins.index==bas].to_file(mod.root+"/gis/"+'file.shp', driver='ESRI Shapefile')
        points_within = gpd.sjoin(points, sel_basin.T, how='inner', predicate='within')
        points.loc[points_within.index].to_file(mod.root+'/gis/src.shp', driver='ESRI Shapefile')
        src = points_within
        OutTile = gdal.Warp(mod.root+"/gis/cut.tif", 
                            dem, 
                            cutlineDSName=mod.root+'/gis/file.shp',
                            cropToCutline=True,
                            dstNodata = np.nan)

        OutTile = None 


        # Note this is still an empty model with no maps
        mod.setup_grid_from_region(
            region = {'geom': mod.root+'/gis/file.shp'},
            res= 30.83207822,
            crs=32617
        )

        # the input file is automatically updated. Uncomment to displayed below:
        datasets_dep = [{"elevtn":mod.root+'/gis/cut.tif',"zmin": -5}] 
        dep = mod.setup_dep(datasets_dep=datasets_dep, interp_method =False)
        mod.setup_mask_active(include_mask=mod.root+'/gis/file.shp')
        mod.setup_mask_bounds(btype="outflow", zmin=-5, reset_bounds=True)
        datasets_rgh = [{"manning":manning}] 
        mod.setup_manning_roughness(datasets_rgh=datasets_rgh)

        src = gpd.read_file(mod.root+'/gis/src.shp')
        src.index =  src.Id
        flow = caudal.loc[:,src.index]

        # setup discharge timeseries
        mod.set_config("tref", "20231003 000000")
        mod.set_config("tstart", "20231003 000000")
        mod.set_config("tstop", "20231015 000000")
        mod.set_config('dtmax',10)
        # mod.set_config('storevelmax',1)
        mod.set_config('storevel',1)

        time = pd.date_range(
            start=utils.parse_datetime(mod.config["tstart"]),
            periods=len(flow),
            freq='1800s',
        )
        ts = pd.DataFrame(
            index=time, columns=src.index, data=flow.values
        )

        # update forcing in model
        mod.setup_discharge_forcing(timeseries=ts, locations=src)
        mod.write()
        convert_eol_to_linux(mod.root)

        os.chdir(mod.root)

        # comando = 'call '+exe_sfincs+'>sfincs_log.txt'
        import subprocess
        os.chdir(mod.root)
        #comando = r'call "C:\Users\navass\Desktop\SFINCS_2023_release_Q2\SFINCS_v2.0.2_Blockhaus_release_exe\sfincs.exe">sfincs_log.txt'
        comando = 'docker run --rm -it --gpus all -v %cd%:/data navass11/sfincs-gpu:v-2.0.0>sfincs_log.txt'

        # Ejecutar el comando en el shell de Windows
        subprocess.call(comando, shell=True) #

        h_max = extract_result_hmax(f'{mod.root}/gis/dep.tif',
                f'{mod.root}/sfincs_map.nc',
                f'{mod.root}/gis/hmax.tif')
        
        speed_max = extract_result_speed(f'{mod.root}/gis/dep.tif',
                f'{mod.root}/sfincs_map.nc',
                f'{mod.root}/gis/speed.tif')


    #except:
    #     print('Error en la cuenca '+'ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].Cod_Cuen_H))
        
        
if __name__ == "__main__":
    
    path_basins  = 'H:/N4C_24062024/Cuencas_simulacion_inundacion_N4C.shp'
    path_points  = 'H:/N4C_24062024/Inflows_N4C_v2.shp'
    path_caudal  = ['H:/N4C_24062024/Inflows_situacion_actual_N4C_v2.xlsx',
					'H:/N4C_24062024/Inflows_SSP585_2030_N4C_v2.xlsx',
					'H:/N4C_24062024/Inflows_SSP585_2050_N4C_v2.xlsx']
    path_caudal  = ['H:/N4C_24062024/Inflows_situacion_actual_N4C_v2.xlsx']
					
    manning      = 'P:/99_BID_ATLAS_PANAMA/INUNDACION/Raster_Rugosidad_STRM30m.tif'
    path_output  = 'E:/N4C_24062024/Resultados/'
    #exe_sfincs   = r"C:\Users\navass\Desktop\SFINCS_2023_release_Q4\SFINCS_v2.0.3_Cauberg_release_exe\sfincs.exe" ### Las barras en sentido contrario a los demás
    
    
    basins = gpd.read_file(path_basins)
    points = gpd.read_file(path_points)
    
    
    for p, per in enumerate(path_caudal):
        if p==0:
            period = 'historical'
        elif p==1:
            period = '2030'
        else:
            period = '2050'
        os.makedirs(path_output+period+'/',exist_ok=True)
        path_output_p = path_output+period+'/'
        for T in ['Q100']: # 'Q10','Q50','Q100'
            caudal = pd.read_excel(per,index_col=0,sheet_name=T)
            #for bas in basins.index:
            bas = 108
            print('ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].Cod_Cuen_H))
            #dem = 'E:/N4C_24062024/dem_30_fill_v5_N4C.tif'
            dem = 'P:/99_BID_ATLAS_PANAMA/Capas_GIS/INUDACION/dem_30_fill_v5.tif'
            if os.path.exists(path_output_p+T+'/'+'Basin_'+str(basins.loc[bas].Cod_Cuen_H)+'/gis/hmax.tif'):
                continue
            else:
                try:
                    ejecution_SFINCS(basins,points,caudal,dem,manning,path_output_p,exe_sfincs,bas)
                except:
                    print('################# Error en la cuenca '+'ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].Cod_Cuen_H)+' #######################')    
                        
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    