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


def ejecution_SFINCS(basins,points,caudal,dem,manning,path_output,exe_sfincs,bas):
    # try:
        sel_basin = GeoDataFrame(basins.iloc[bas])
        mod = SfincsModel(root=path_output+T+'/Basin_'+str(basins.loc[bas].ID_CUENCA)+"/", mode='w+')




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
        mod.set_config("tstop", "20231013 000000")
        mod.set_config('dtmax',10)
        # mod.set_config('dtout',21600)
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

        # os.remove('cut.tif'); os.remove('file.shp'); os.remove('file.dbf')


        os.chdir(mod.root)


        with open(mod.root+'/sfincs.inp') as f:  # default is 'rt' read text mode.
            data = f.read()

        with open(mod.root+'/sfincs.inp', 'w', newline='\n') as f: # write with Unix new lines.
            f.write(data)
            
        # comando = 'call '+exe_sfincs+'>sfincs_log.txt'
        comando = 'docker run --rm -it --gpus all -v '+path_output+T+'/Basin_'+str(basins.loc[bas].ID_CUENCA)+':/data navass11/sfincs-gpu'

        # Ejecutar el comando en el shell de Windows
        subprocess.call(comando, shell=True)#


        sfincs_root = path_output+T+'/Basin_'+str(basins.loc[bas].ID_CUENCA)+"/" # (relative) path to sfincs root
        mod = SfincsModel(sfincs_root, mode="r")


        # write hmax to <mod.root>/gis/hmax.tif
        #mod.write_raster("results.hmax", compress="LZW")
        hmin = 0.05  # minimum flood depth [m] to plot
        hmax = mod.results['h'].max(dim='time').fillna(value=-9999)
        hmax = hmax.where(hmax > hmin)
        #hmax = mod.results['hmax']
        hmax = hmax.reindex(y=list(reversed(hmax['y'].values))) # change orientation to N -> S
        hmax.raster.to_raster(mod.root+'/gis/'+'hmax.tif', compress='LZW',nodata=np.nan)
        
        speed     = np.sqrt(mod.results['u']**2+mod.results['v']**2)
        speed_max = speed.max(dim='time').fillna(value=-9999)
        speed_max = speed_max.where(hmax > hmin)
        speed_max = speed_max.reindex(y=list(reversed(speed_max['y'].values))) # change orientation to N -> S
        speed_max.raster.to_raster(mod.root+'/gis/'+'speed.tif', compress='LZW',nodata=np.nan)
    #except:
    #     print('Error en la cuenca '+'ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].ID_CUENCA))
        
        
if __name__ == "__main__":
    
    path_basins  = 'P:/99_BID_ATLAS_PANAMA/Capas_GIS/INUDACION/Cuencas_simulacion.shp'
    path_points  = 'P:/99_BID_ATLAS_PANAMA/Capas_GIS/INUDACION/Inflows_v11102023_red.shp'
    path_caudal  = 'E:/ATLAS_PANAMA/01_DATA/07_INUNDACION/hidrogramas_inflows_Panama_islas.xlsx'
    manning      = 'P:/99_BID_ATLAS_PANAMA/Capas_GIS/INUDACION/Raster_Rugosidad_STRM30m.tif'
    path_output  = 'E:/ATLAS_PANAMA/01_DATA/07_INUNDACION/'
    exe_sfincs   = r"C:\Users\navass\Desktop\SFINCS_2023_release_Q2\SFINCS_v2.0.2_Blockhaus_release_exe\sfincs.exe" ### Las barras en sentido contrario a los demás
    dem_ALOS     = 'E:/ATLAS_PANAMA/02_GIS/ALOS_MDT_FILL.tif'
    
    
    basins = gpd.read_file(path_basins)
    points = gpd.read_file(path_points)
    
    
    
    for T in ['Q10','Q50','Q100']: #,'Q50','Q100'
        caudal = pd.read_excel(path_caudal,index_col=0,sheet_name=T)
        for bas in basins.index:
            print('ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].ID_CUENCA))
            if bas==21 or bas==22:
                dem = dem_ALOS
            else:
                dem = 'P:/99_BID_ATLAS_PANAMA/Capas_GIS/INUDACION/fill.tif'
            if os.path.exists(path_output+T+'/'+'Basin_'+str(basins.loc[bas].ID_CUENCA)+'/gis/hmax.tif'):
                continue
            else:
                try:
                    ejecution_SFINCS(basins,points,caudal,dem,manning,path_output,exe_sfincs,bas)
                except:
                    print('################# Error en la cuenca '+'ID: '+str(bas)+' BASIN_ID '+str(basins.loc[bas].ID_CUENCA)+' #######################')    
                        
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    