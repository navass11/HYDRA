import numpy as np
import pandas as pd
import tqdm
import re
import os
from pandas.plotting import register_matplotlib_converters
from datetime import datetime
from pydsstools.heclib.dss import HecDss
from pydsstools.core import TimeSeriesContainer,UNDEFINED
register_matplotlib_converters()
from pathlib import Path
import datetime
import warnings
warnings.filterwarnings('ignore')

def read_gages(Path_model, file_gage):
    
    """ Esta función lee el archivo .gage del HEC-HMS, y extrae los nombres de los pluviómetros que han sido creados previamente en el modelo.
        
    Input:
    -------------------------------------------------------------------------------------------
    Path_model:    Str. Se introduce la ruta en donde está el fichero .gage.
    file_gage:     Str. Se introduce el nombre del fichero .gage.
    
    Output:
    -------------------------------------------------------------------------------------------
    names_stations:  Str. Vector que contiene los nombres de los pluvios creados en el modelo"""
    
    with open(Path_model+file_gage,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_stations=[]
    #Busqueda por atributos
    for title in re.findall('Gage: [\w\d]*(?=\s)',txt):
        #Se almacenan los atributos encontrados en un vector
        names_stations.append(re.split("[\[ ]",title)[1]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_stations)


def read_met(Path_model, file_hms):
    
    """ Esta función lee el fichero .hms y extrae los nombres de los modelos meteorológicos que han sido creados previamente en el modelo.
        
    Input:
    -------------------------------------------------------------------------------------------
    Path_model:    Str. Se introduce la ruta en donde está almacenado el fichero .hms del modelo.
    file_hms:      Str. Se introduce el nombre del fichero .hms.
    
    Output:
    -------------------------------------------------------------------------------------------
    names_met:  Str. Vector que contiene los nombres del modelo meteorológico"""
    
    with open(Path_model+file_hms,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_met=[]
    #Busqueda por atributos
    for title in re.findall('[\w]*\.met',txt):
        #Se almacenan los atributos encontrados en un vector
        names_met.append(re.split("[\[.]",title)[0]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_met)


def read_basin(Path_model, file_basin):
    
    """ Esta función lee el archivo .basin y extrae los nombres de las cuencas que han sido creadas previamente en el modelo.
        
    Input:
    -------------------------------------------------------------------------------------------   
    Path_model:    Str. Se introduce la ruta en donde está almacenado el fichero .basin.
    file_basin:    Str. Se introduce el nombre del fichero .basin.
    
    Output:
    -------------------------------------------------------------------------------------------
    names_basin:  Str. Vector que contiene los nombres de las cuencas"""
    
    with open(Path_model+file_basin,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_basin=[]
    #Busqueda por atributos
    for title in re.findall('Basin: [-\w]*',txt):
        #Se almacenan los atributos encontrados en un vector
        names_basin.append(re.split("[\[ ]",title)[1]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_basin)

def read_subbasin(Path_model, file_basin):
    
    """ Esta función lee el archivo .basin del HEC-HMS, y extrae los nombres de las subcuencas que han sido creados previamente en el modelo.
        
    Input:
    -------------------------------------------------------------------------------------------   
    Path_model:    Str. Se introduce la ruta en donde está almacenado el fichero .basin.
    file_basin:    Str. Se introduce el nombre del fichero .basin.
    
    Output:
    -------------------------------------------------------------------------------------------
    names_sbasin:  Str. Vector que contiene los nombres de las subcuencas"""
    
    with open(Path_model+file_basin,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_sbasin=[]
    #Busqueda por atributos
    for title in re.findall('Subbasin: [-\w]*',txt):
        #Se almacenan los atributos encontrados en un vector
        names_sbasin.append(re.split("[\[ ]",title)[1]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_sbasin)

def read_control(Path_model, file_hms):
    
    """ Esta función lee el archivo .hms del HEC-HMS, y extrae los nombres de los controles que han sido creados previamente en el modelo.
        
    Input:
    ------
    Path_model:      Str. Se introduce la ruta en donde está el fichero .hms del modelo.
    file_hms:        Str. Se introduce el nombre del fichero .hms.
    
    Output:
    -------
    names_control:  Str. Vector que contiene los nombres de los controles"""
    
    with open(Path_model+file_hms,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_control=[]
    #Busqueda por atributos
    for title in re.findall('[\w]*\.control',txt):
        #Se almacenan los atributos encontrados en un vector
        names_control.append(re.split("[\[.]",title)[0]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_control)

def Read_run(Path_model, file_run):
    
    """ Esta función lee el archivo .run del HEC-HMS, y extrae los nombres de las corridas que han sido creados previamente en el modelo.
        
    Input:
    ------
    Path_model:   Str. Se introduce la ruta en donde está el fichero .run del modelo.
    file_run:     Str. Se introduce el nombre del fichero .run.
    
    Output:
    -------
    names_run:  Str. Vector que contiene los nombres de las corridas que tenga el modelo"""
    
    with open(Path_model+file_run,'r') as file:
        # leer el fichero texto
        txt=file.read()
    #Crear una lista vacia para almacenar los datos
    names_run=[]
    #Busqueda por atributos
    for title in re.findall('Run:[ \w]*',txt):
        #Se almacenan los atributos encontrados en un vector
        names_run.append(re.split('[:]\s',title)[1]) # [1] devuelve la parte derecha - [0] devuelve la parte izquierda
        
    return (names_run)


def generate_gage(name_model, names_stations, Time_interval, Path_model, Start_Time, End_Time, file_dss,exists_gage = False):
    
    """ Esta función modifica el fichero .gage con el fin de incluir los datos de lluvia en el intervalo de tiempo definido.

    Input:
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    name_model:        Str. Se introduce el nombre del fichero .hms del proyecto HEC-HMS.
    names_stations:    Str. Se introduce un vector que contenga los nombres de las estaciones medidoras de precipitación, en este caso se pueden utilizar los nombres de las estaciones existentes ( extraidos mediante
                            la función read_gages) y adjuntar nuevos pluviometros, los cuales se pueden incluir dentro de la tupla. 
    Time_interval:     Str. Se introduce el intervalo de tiempo con el que quiero ingresar mis datos, diario, horario o minutal, siguiendo el formato #(1MIN, 2MIN, 3MIN,4MIN,5MIN,6MIN,10MIN,...,1HOUR,....1DAY).
    Path_model:        Str. Se introduce la ruta en donde está almacenado el fichero .gage del modelo HEC-HMS.
    Start_Time:        Str. Se introduce la fecha inicial y hora en donde inicia la lluvia.
    End_Time:          Str. Se introduce la fecha final y hora en donde termina la lluvia.
    file_dss:          Str. Se introduce el nombre del archivo .dss que se encuentra en la carpeta del proyecto, como pueden existir varios archivos de extensión dss, se puede abrir en un block de notas el archivo .gage y ver en la casilla 'DSS File Name' para ver en que fichero .dss se estan guardando las lluvias. 
    exists_gage:       True or False. Si existe previamente un fichero gage con estaciones.
    
    Output:
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    fichero_gage:      Str. Regresera el fichero .gage creando los módulos de lluvias del programa HEC-HMS"""
    
    if exists_gage == False:
        # se crea una lista en blanco
        lines_new  = list()
        #-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        ### se crean los datos que serán almacenaran en la lista anterior, esta opción se activa en caso de generar un fichero totalmente nuevo
        lines_new.append('Gage Manager:'+name_model+'\n')
        lines_new.append('     Version: 4.9'+'\n')
        lines_new.append('     Filepath Separator: '+str('/')+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')
        ### Se recorre el vector con el nombre de las estaciones existentes sobreescribir los módulos, en caso de querer añadir nuevos pluvios, se puede añadir atributos al names_stations.
        #-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        for i, ii in enumerate (names_stations):

            lines_new.append('Gage:'+' '+ii+'\n')
            lines_new.append('     Description: Series de precipitacion estacion:'+ii+'\n')
            lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
            lines_new.append('     Last Modified Time: 09:21:23'+'\n')
            lines_new.append('     Reference Height Units: Meters'+'\n')
            lines_new.append('     Reference Height: 10.0'+'\n')
            lines_new.append('     Gage Type: Precipitation'+'\n')
            lines_new.append('     Precipitation Type: Incremental'+'\n')
            lines_new.append('     Units: MM'+'\n')
            lines_new.append('     Data Type: PER-CUM'+'\n')
            lines_new.append('     Data Source Type: External DSS'+'\n')
            lines_new.append('     Variant: Variant-1'+'\n')
            lines_new.append('       Last Variant Modified Date: 13 November 2020'+'\n')
            lines_new.append('       Last Variant Modified Time: 09:07:39'+'\n')
            lines_new.append('       Default Variant: Yes'+'\n')
            lines_new.append('       DSS File Name: '+file_dss+'\n')
            lines_new.append('       DSS Pathname: //'+ii+'/PRECIP-INC//'+Time_interval+'/GAGE/'+'\n')
            lines_new.append('       Start Time: '+Start_Time+'\n') 
            lines_new.append('       End Time: '+End_Time+'\n') 
            lines_new.append('     End Variant: Variant-1'+'\n')
            lines_new.append('End:'+'\n')
            lines_new.append('\n')
        
        with open(Path_model+name_model+'.gage', "w") as fh:
            for line in (lines_new):
                fh.write(line)
        
    else:
        lines_new  = list()
        
        for i, ii in enumerate (names_stations):

            lines_new.append('Gage:'+' '+ii+'\n')
            lines_new.append('     Description: Series de precipitacion estacion:'+ii+'\n')
            lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
            lines_new.append('     Last Modified Time: 09:21:23'+'\n')
            lines_new.append('     Reference Height Units: Meters'+'\n')
            lines_new.append('     Reference Height: 10.0'+'\n')
            lines_new.append('     Gage Type: Precipitation'+'\n')
            lines_new.append('     Precipitation Type: Incremental'+'\n')
            lines_new.append('     Units: MM'+'\n')
            lines_new.append('     Data Type: PER-CUM'+'\n')
            lines_new.append('     Data Source Type: External DSS'+'\n')
            lines_new.append('     Variant: Variant-1'+'\n')
            lines_new.append('       Last Variant Modified Date: 13 November 2020'+'\n')
            lines_new.append('       Last Variant Modified Time: 09:07:39'+'\n')
            lines_new.append('       Default Variant: Yes'+'\n')
            lines_new.append('       DSS File Name: '+file_dss+'\n')
            lines_new.append('       DSS Pathname: //'+ii+'/PRECIP-INC//'+Time_interval+'/GAGE/'+'\n')
            lines_new.append('       Start Time: '+Start_Time+'\n') 
            lines_new.append('       End Time: '+End_Time+'\n') 
            lines_new.append('     End Variant: Variant-1'+'\n')
            lines_new.append('End:'+'\n')
            lines_new.append('\n')
        
        ### Se sobreescribe el fichero con extensión .gage que se encuentra en la carpeta del modelo HEC-HMS.       
        with open(Path_model+name_model+'.gage', "r+") as out_file:
            lines = out_file.readlines()
            out_file.close()
            
        with open(Path_model+name_model+'.gage', "w") as fh:
            for line in (lines+lines_new):
                fh.write(line)
            
    
    
    return print('################### El fichero .gage fue modificado satisfactoriamente ###################')

def fill_gage(names_stations, path_rain, Time_interval, Path_model, file_dss, Start_Time, End_Time):
    
    """ Esta función llena los datos de lluvia del fichero .dss, para cada uno de los modulos de lluvias almacenados en el fichero .gage. Puede llenar los pluvios existentes o los construidos a partir de la función 
        generate_gage. 

    Input:
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    names_stations:    Str. Se introduce un vector que contenga los nombres de las estaciones medidoras de precipitación, deben corresponder con las lluvias que se quieren simular.
    path_rain:         Str. Se introduce la ruta en donde está almacenado el ficheros .csv,txt,...xlx, etc. que contienen los datos de las lluvias.
    Time_interval:     Str. Str. Se introduce el intervalo de tiempo con el que quiero ingresar mis datos, diario, horario o minutal, siguiendo el formato #(1MIN, 2MIN, 3MIN,4MIN,5MIN,6MIN,10MIN,...,1HOUR,....1DAY).
    Path_model:        Str. Se introduce la ruta en donde está el fichero .dss del modelo HEC-HMS.
    file_dss:          Str. Se introduce el nombre del fichero .dss, en donde se quieren almacenar los datos de lluvias.
    Start_Time:        Str. Se introduce la fecha de inicio de las lluvias, se debe tener en cuenta que deben coincidir con las fechas de lluvias creadas en el módulo .gagee y debe tener el formato 1 January 2011, 00:00, aunque en general recibe otros formatos.
    End_Time:          Str. Se introduce la fecha de fin de las lluvias, se debe tener en cuenta que deben coincidir con las fechas de lluvias creadas en el módulo .gagee y debe tener el formato 1 January 2011, 00:00, aunque en general recibe otros formatos.
                            
    Output:
    -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    fichero_met:       Str. Fichero modficado .dss incluyendo los datos de las lluvias"""
    
    ### Se recorre el vector con el nombre de las estaciones para generar las lluvias por estación.
    Rain = pd.read_csv(path_rain,index_col=0,parse_dates=True)
    date_start_time_obj = datetime.datetime.strptime(Start_Time, '%d %B %Y, %H:%M')
    date_end_time_obj = datetime.datetime.strptime(End_Time, '%d %B %Y, %H:%M')
    for i, ii in enumerate (tqdm.tqdm(names_stations)): 
        dss_file = Path_model+file_dss
        pathname = '//'+ii+'/PRECIP-INC/'+Start_Time+'/'+Time_interval+'/GAGE/'
        tsc = TimeSeriesContainer()
        tsc.pathname = pathname
        tsc.startDateTime = Start_Time
        tsc.numberValues = len(Rain.loc[date_start_time_obj:date_end_time_obj,ii].values)
        tsc.values = Rain.loc[date_start_time_obj:date_end_time_obj,ii].values
        tsc.units = "MM"
        tsc.type = "PER-CUM"
        tsc.interval = 1
        fid = HecDss.Open(dss_file,version=6)
        fid.deletePathname(tsc.pathname)
        fid.put_ts(tsc)
        ts = fid.read_ts(pathname)
        fid.close()
                
    return print('################### Se ha modificado el fichero .dss satisfactoriamente y se han llenado los datos de lluvia ###############################')

def generate_met(name_met, names_sbasin,names_gage,Path_model, name_basin, Evapotranspiration=False, **kwargs):
    
    """ Esta función modifica el fichero con extensión .met en el caso de que se quieran crear o incluir nuevos modulos en el meteorologic model. En caso de que ya estén creados los modulos, no hay necesidad de usar
        esta función.
        
    Input:
    ----------------
    name_met:        Str. Se introduce el nombre del fichero .met que se desea crear.
    names_sbasin:      Str. Se introduce una tupla que contenga los nombres de las subcuencas.
    names_gage:        Str. Nombre de los gages qeu se han introducido.
    Path_model         Str. Se introduce la ruta en donde está el fichero .met a modificar dentro del modelo HEC-HMS.
    name_basin:        Str. Se introduce el nombre del Basin el cual se puede ver en el módulo cuando se abre el programa.
    names_sbasin:      Str. Se introduce el nombre de las subcuencas del modelo.
    Evapotranspiration: True or False: Si el modelo se contempla la Evapotranspiración mensual poner True y además es necesario incluir la tabla como argumento ET_Table
    
    Output:
    ---------------
    fichero_met:      Str. Fichero modificado .met del programa HEC HMS"""
    
    ET_Table = kwargs.get('ET_Table', None)
    
    lines_new  = list()  
    lines_new.append('Meteorology: '+name_met.replace("_", " ")+'\n')
    lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
    lines_new.append('     Last Modified Time: 11:16:56'+'\n')
    lines_new.append('     Version: 4.9'+'\n')
    lines_new.append('     Unit System: Metric'+'\n')
    lines_new.append('     Set Missing Data to Default: Yes'+'\n')
    lines_new.append('     Precipitation Method: Specified Average'+'\n')
    lines_new.append('     Short-Wave Radiation Method: None'+'\n')
    lines_new.append('     Long-Wave Radiation Method: None'+'\n')
    lines_new.append('     Snowmelt Method: None'+'\n')
    if Evapotranspiration ==True:
        lines_new.append('     Evapotranspiration Method: Monthly Evaporation'+'\n')
        lines_new.append('     Use Basin Model: '+name_basin+'\n')                 
        lines_new.append('End:'+'\n')            
        lines_new.append('\n')    
        lines_new.append('Precip Method Parameters: Specified Average'+'\n')
        lines_new.append('     Last Modified Date: 6 August 2020'+'\n')
        lines_new.append('     Last Modified Time: 08:05:04'+'\n')
        lines_new.append('     Allow Depth Override: No'+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')
        lines_new.append('Evapotranspiration Method Parameters: Monthly Evaporation'+'\n')
        lines_new.append('     Last Modified Date: 18 December 2020'+'\n')
        lines_new.append('     Last Modified Time: 13:11:43'+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')

        for g, b in enumerate(names_sbasin):
            lines_new.append('Subbasin: '+b+'\n')
            lines_new.append('     Last Modified Date: 8 February 2021'+'\n')
            lines_new.append('     Last Modified Time: 17:43:40'+'\n')
            lines_new.append('     Gage: '+names_gage[g]+'\n')
            lines_new.append('\n')
            lines_new.append('     Begin Et:'+'\n')
            for m in range(1,13):
                 lines_new.append('     Pan Evaporation: '+str(ET_Table.loc[b,str(m)])+'\n')
            for m in range(1,13):
                 lines_new.append('     Evapotranspiration Coefficient: '+str(ET_Table.loc[b,'Factor_'+str(m)])+'\n')
            lines_new.append('     End Et:'+'\n')
            lines_new.append('End:'+'\n')
            lines_new.append('\n')
    else:    
        lines_new.append('     Evapotranspiration Method: No Evapotranspiration'+'\n')
        lines_new.append('     Use Basin Model: '+name_basin+'\n')                 
        lines_new.append('End:'+'\n')            
        lines_new.append('\n')    
        lines_new.append('Precip Method Parameters: Specified Average'+'\n')
        lines_new.append('     Last Modified Date: 6 August 2020'+'\n')
        lines_new.append('     Last Modified Time: 08:05:04'+'\n')
        lines_new.append('     Allow Depth Override: No'+'\n')
        lines_new.append('End:'+'\n')            
        lines_new.append('\n')
        for i, ii in enumerate (names_sbasin):

            lines_new.append('Subbasin: '+ii+'\n')
            lines_new.append('     Last Modified Date: 27 August 2020'+'\n')
            lines_new.append('     Last Modified Time: 10:54:49'+'\n')
            lines_new.append('     Gage: '+names_gage[i]+'\n') 
            lines_new.append('End:'+'\n')
            lines_new.append('\n')

                

    ### Genera un fichero con extensión .met donde se encuentra la carpeta del modelo HEC-HMS, rellenando los datos de evapotranspiración.
    with open(Path_model+name_met+'.met', "w") as fh:
        for line in (lines_new):
            fh.write(line)
                
    return print('################### Los ficheros .met fueron creados en la carpeta del proyecto satisfactoriamente ###############################')

def generate_hms(name_model, Path_model, names_met, file_dss, names_basin, names_control):
    
    """ Esta función sobrescribe el fichero .hms para el modelo hidrológico HEC-HMS incluyendo los modelos meteorológicos (como por ejemplo los que se han creado previamente), con el fin 
        que el programa los pueda leer correctamente. 
        
    Input:
    ------
    name_model:      Str. Se introduce el nombre del modelo HEC HMS.
    Path_model       Str. Se introduce la ruta en donde está el fichero .hms a modificar dentro del modelo HEC-HMS.
    names_met:       Str. Se introduce una tupla que contenga los nombres de los modelos meteorológicos (Se extraen del modelo existente con la función read_met).
    file_dss:        Str. Nombre del fichero .dss en donde están almacenadas las lluvias. 
    names_basin:     Str. Se introduce una tupla que contenga los nombres de las cuencas que contiene el modelo (Se extraen del modelo existente con la función read_basin).
    names_control:   Str. Se introduce una tupla que contenga los nombres de los controles (Se extraen del modelo existente con la función read_control).
   
    Output:
    -------
    fichero_hms:      Str. Regresará el fichero sobre escrito .hms del programa HEC HMS """


    lines_new  = list()
    
    lines_new.append('Project: '+name_model+'\n')
    lines_new.append('     Description: '+name_model+'\n')
    lines_new.append('     Version: 4.9'+'\n')
    lines_new.append('     Filepath Separator: '+'\ \n')# OJO CON EL SIGNO
    lines_new.append('     DSS File Name: '+file_dss+'\n')
    lines_new.append('     Time Zone ID: Europe/Paris'+'\n')
    lines_new.append('End:'+'\n')
    lines_new.append('\n')
    
    for i,ii in enumerate (names_met):
        
        lines_new.append('Precipitation: '+ii.replace("_", " ")+'\n')
        lines_new.append('     Filename: '+ii+'.met'+'\n')
        lines_new.append('     Description: HMS generated met file for '+name_model+'\n')
        lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
        lines_new.append('     Last Modified Time: 11:18:28'+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')
    
    for n,nn in enumerate (names_basin):
        lines_new.append('Basin: '+nn+'\n')
        lines_new.append('     Filename: '+nn+'.basin'+'\n')
        lines_new.append('     Description: HMS generated basin file for '+name_model+'\n')
        lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
        lines_new.append('     Last Modified Time: 11:18:28'+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')
        
    for l,ll in enumerate (names_control):
        lines_new.append('Control: '+ll.replace("_", " ")+'\n')
        lines_new.append('     FileName: '+ll+'.control'+'\n')
        lines_new.append('     Description: HMS generated control file for '+name_model+'\n')
        lines_new.append('End:'+'\n')
        lines_new.append('\n')

    ### modifica el fichero con extensión .hms que se encuentra la carpeta del modelo HEC-HMS, incluyendo los nuevos archivos .met generados previamente.
    with open(Path_model+name_model+'.hms', "r+") as out_file:
            lines = out_file.readlines()
            out_file.close()

    with open(Path_model+name_model+'.hms', "w") as fh:
            #for line in (lines[0:k]+lines_new+lines[k:]):
            for line in (lines_new):
                fh.write(line)

    return print('################### El fichero .hms fue modificado satisfactoriamente ###############################')

def generate_control(name_model, Path_model, name_control, Start_Time_c, End_Time_c, Time_interval_c):  
    
    """ Esta función crea el fichero .control que contiene datos relevantes para la simulación y a su vez modifica el fichero .hms requerido para que el programa lea bien el fichero .control. 
        Los datos de entrada y salida corresponden a:
                
    Input:
    ------
    name_model:        Str. Se introduce el nombre del modelo HEC HMS.
    Path_model:        Str. Se introduce la ruta en donde está el fichero .hms a modificar dentro del modelo HEC-HMS.
    name_control:      Str. Se introduce el nombre que se le quiere poner al nuevo control.
    Start_Time_c:      Str. Se incluye la fecha de inicio del control, que debe coincidir con la fecha de inicio de la lluvia.
    End_Time_c:        Str. Se incluye la fecha de culminación del control, que debe coincidir con la fecha de fin de la lluvia.
    Time_interval_c:        Se ingresa el intervalo de tiempo en minutos por ejemplo si los datos de lluvia son horarios se coloca '1440' (un dia =60*24 = 1440)
   
    Output:
    -------
    fichero_hms:      Str. Regresará el fichero sobre escrito .hms del programa HEC HMS """
    
    #Se generan el fichero con los datos del control
    lines_new  = list()

    lines_new.append('Control: '+name_control.replace("_", " ")+'\n')  
    lines_new.append('     Description: Control Model'+'\n')
    lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
    lines_new.append('     Last Modified Time: 11:18:20'+'\n')                                 
    lines_new.append('     Version: 4.9'+'\n')                             
    lines_new.append('     Time Zone ID: Europe/Paris'+'\n')
    lines_new.append('     Time Zone GMT Offset: 3600000'+'\n')
    lines_new.append('     Start Date: '+Start_Time_c+'\n')       
    lines_new.append('     Start Time: 24:00'+'\n')        
    lines_new.append('     End Date: '+End_Time_c+'\n')
    lines_new.append('     End Time: 24:00'+'\n')
    lines_new.append('     Time Interval: '+Time_interval_c+'\n')
    lines_new.append('     Grid Write Interval: 1440'+'\n') # siempre se mantiene en 1440 minutos aunque cambie el time interval, esta no varia 
    lines_new.append('     Grid Write Time Shift: 0'+'\n')
    lines_new.append('End:'+'\n')
    lines_new.append('\n')
    
    with open(Path_model+name_control+'.control', "w") as fh:
        for line in (lines_new):
            fh.write(line)
        fh.close()
            
    #Se modifica el fichero Hms para incluir el control creado previamente
    lines_new_1  = list()
   
    lines_new_1.append('Control: '+name_control.replace("_", " ")+'\n')
    lines_new_1.append('     Filename: '+name_control+'.control'+'\n')
    lines_new_1.append('     Description: Control'+'\n')
    lines_new_1.append('End:'+'\n')
    lines_new_1.append('\n')

    ### modifica el fichero con extensión .hms que se encuentra la carpeta del modelo HEC-HMS, incluyendo los nuevos archivos .met generados previamente.
    with open(Path_model+name_model+'.hms', "r+") as out_file:
        lines = out_file.readlines()
        out_file.close()

    with open(Path_model+name_model+'.hms', "a") as file:
            for line1 in (lines_new_1):
                file.write(line1)
                        
    return print('################### El fichero .control fue creado satisfactoriamente ###############################')

def generate_run(Path_model, name_model, Name_run,name_met, name_basin, name_control, exists_run =True):
    
    """ Esta función sobreescribe el fichero .run del modelo hidrológico HEC-HMS, incluyendo los escenarios que se quieren correr en el programa, y respetando los datos que contenga el 
        modelo inicial, es decir, que no borra los datos de las corridas anteriores, solamente incluye los datos de nuevas simulaciones que se quieran introducir en el programa.
        
    Input:
    ------
    Path_model:        Str. Se introduce la ruta en donde está el fichero .run a modificar dentro del modelo HEC-HMS.
    name_model:        Str. Se introduce el nombre del modelo HEC HMS.
    Name_Run:          Str. Nombre que se le quiere colocar a la nueva corrida.
    name_control:      Str. Se coloca el nombre del control.
    name_met:          Str. Nombre del módulo meteorológico
    name_control:      Str. Se coloca el nombre del control nuevo que se quiere crear.
    name_basin:        Str. Se introduce la ruta del modulo basin de la cuenca, para ello se debe abrir el modelo y verificar el nombre del Basin.
    
    Output:
    -------
    fichero_hms:      Str. Regresera el fichero sobre escrito .run del programa HEC HMS, incluyendo los nuevos datos de las simulaciones que se quieran hacer"""
    
    if exists_run==False:
        #Crea un fichero en blanco con extención .log necesario para realizar la corrida
        lines_new  = list()
        with open(Path_model+name_model+'.run', "w") as fh:
            for line in (lines_new):
                fh.write(line)
                
        # Genera las lineas de código necesarias para ser almacenadas en el fichero .run
        lines_new_1  = list()
        lines_new_1.append('Run: '+Name_run.replace("_", " ")+'\n')  
        lines_new_1.append('     Default Description: Yes'+'\n')
        lines_new_1.append('     Log File: '+Name_run+'.log'+'\n')
        lines_new_1.append('     DSS File: '+Name_run+'.dss'+'\n')
        lines_new_1.append('     Is Save Spatial Results: No'+'\n')  
        lines_new_1.append('     Last Modified Date: 17 November 2020'+'\n')                             
        lines_new_1.append('     Last Modified Time: 09:31:48'+'\n')
        lines_new_1.append('     Basin: '+name_basin+'\n')
        lines_new_1.append('     Precip: '+name_met.replace("_", " ")+'\n')       
        lines_new_1.append('     Control: '+name_control.replace("_", " ")+'\n')        
        lines_new_1.append('     Save State Type: None'+'\n') 
        lines_new_1.append('     Time-Series Output: Save All'+'\n')
        lines_new_1.append('End:'+'\n')
        lines_new_1.append('\n')    
    else:
        # Genera las lineas de código necesarias para ser almacenadas en el fichero .run
        lines_new_1  = list()
        lines_new_1.append('Run: '+Name_run.replace("_", " ")+'\n')  
        lines_new_1.append('     Default Description: Yes'+'\n')
        lines_new_1.append('     Log File: '+Name_run+'.log'+'\n')
        lines_new_1.append('     DSS File: '+Name_run+'.dss'+'\n')
        lines_new_1.append('     Is Save Spatial Results: No'+'\n')  
        lines_new_1.append('     Last Modified Date: 17 November 2020'+'\n')                             
        lines_new_1.append('     Last Modified Time: 09:31:48'+'\n')
        lines_new_1.append('     Basin: '+name_basin+'\n')
        lines_new_1.append('     Precip: '+name_met.replace("_", " ")+'\n')       
        lines_new_1.append('     Control: '+name_control.replace("_", " ")+'\n')        
        #lines_new_1.append('     Save State Type: None'+'\n') 
        lines_new_1.append('     Time-Series Output: Save All'+'\n')
        lines_new_1.append('End:'+'\n')
        lines_new_1.append('\n')      
    
    # Crea un fichero en blanco con extención .log necesario para realizar la corrida
    lines_new_2  = list()
    with open(Path_model+Name_run+'.log', "w") as fh:
         for line in (lines_new_2):
                fh.write(line)

    #  Crea un fichero en blanco con extención necesario para realizar la corrida 
    fid2 = HecDss.Open(Path_model+Name_run+'.dss',version=6)
    fid2.close()


    ### sobreescribe el fichero con extensión .run donde se encuentra la carpeta del modelo HEC-HMS, rellenando los datos de corrida del modelo.
    with open(Path_model+name_model+'.run', "r+") as out_file:
            lines = out_file.readlines()
            out_file.close()

    with open(Path_model+name_model+'.run', "w") as fh:
        #for line in (lines[0:k]+lines_new_1+lines[k:]):
        for line in (lines+lines_new_1):
            fh.write(line)      
            
    return print('################### El fichero .run fue creado satisfactoriamente ###############################')   


def Generate_py(Path_model, name_model, names_run):
    
    """ Esta función genera el fichero .py necesario para utilizar el modulo de corrida del programa desde python, este fichero contiene los datos necesarios para poner en marcha el modelo.
        
    Input:
    ------
    Path_model:    Srt. Se introduce la ruta de la carpeta en donde está almacenado el modelo.
    name_model:    Str. Se introduce el nombre del modelo HEC HMS.
    Name_run:      Str. Se introducen los nombres de los ficheros .run, si son varios se debe correr un bucle dejando cada plan por renglon.
                                
    Output:
    -------
    fichero_py:    Str. Crea una carpeta llamada scripts en la ruta en donde esta almacenado el proyecto y genera el fichero compute_current.py del programa HEC HMS, incluyendo los nuevos datos de las simulaciones"""
    
    #crear carpeta scripts dentro del folder del modelo
    os.makedirs(Path_model+'scripts', exist_ok=True)
    
    # Crea un fichero en blanco con extención .py en donde se van a guardar los datos
    lines_new  = list()
    with open(Path_model+'scripts/compute_current'+'.py', "w") as fh:
        for line in (lines_new):
            fh.write(line)
            
    #crea una lista vacia en donde se van a almacenar las lineas
    lines_new_1  = list()
    # Genera las lineas de código necesarias para crear los ficheros
    lines_new_1.append('from hms.model import Project'+'\n')  
    lines_new_1.append('from hms import Hms'+'\n')
    lines_new_1.append('\n')
    lines_new_1.append('myProject = Project.open('+"'"+Path_model+name_model+'.hms'+"'"+')'+'\n')
    
    for i, ii in enumerate(names_run):
    
        lines_new_1.append('myProject.computeRun('+"'"+ii+"'"+')'+'\n') 
        
    lines_new_1.append('myProject.close()'+'\n') 
    lines_new_1.append('\n')
    lines_new_1.append('Hms.shutdownEngine()'+'\n')             
    ### sobreescribe el fichero con extensión .py donde se encuentra la carpeta scripts, rellenando los datos de corrida del modelo.
    with open(Path_model+'scripts/compute_current'+'.py', "r+") as out_file:
            lines = out_file.readlines()
            out_file.close()

    with open(Path_model+'scripts/compute_current'+'.py', "w") as fh:
        #for line in (lines[0:k]+lines_new_1+lines[k:]):
        for line in (lines_new_1):
            fh.write(line) 

    return print('################### El fichero .py fue creado satisfactoriamente ###############################')  


def generate_flow(pathname, path_dss, dss_name, startDate, endDate, Path_o, name_file_output):
    
    """ Esta función exporta los datos de caudal para el modelo histórico del programa HEC HMS a formato excel.
        
    Input:
    ------
    pathname:          Str. Se introduce la ruta que muestra el modelo HEC DSS, de los datos de caudal que quieren ser extraidos.
    path_dss:          Str. Se introduce la ruta en donde esta el fichero .dss, como existen varios, se debe verificar en el programa en cual de los dss se esta almacenando la información
                            histórica.
    path_name:         Str. Se introduce el nombre del fichero dss, donde estan los caudales que quiero extraer.
    startDate:         Str. Fecha de inicio de la simulación, es decir a partir de que fecha quiero extraer los datos de caudal generados por HEC HMS.
    endDate:           Str. Fecha de fin de la simulación, es decir hasta que fecha quiero extraer los datos de caudal generados por HEC HMS.
    Path_o:            Str. Ruta en donde quiero guardar mis ficheros de Excel, con los datos de caudal.
    name_file_output:  Str. Nombre del fichero que se desear dar a los resultados
                                
    Output:
    -------
    Q:                 Serie. Regresará los datos de caudal en formato excel"""
    
    pn = pathname
    fid = HecDss.Open(path_dss+dss_name)
    ts = fid.read_ts(pn,window=(startDate,endDate))
    values = pd.DataFrame(ts.values)
    rng = pd.date_range(start=startDate , end= endDate)
    Q = pd.DataFrame(index= rng, columns = ['flow'])
    Q.loc[:,'flow'] = values.iloc[:,0].values
    Q.to_csv(Path_o+name_file_output+'.csv')
    fid.close()

    return print('################### Se han creado los ficheros en excel con los datos de caudal historico se han creado satisfactoriamente ###############################')  

def generate_met_freq_storn(name_met, names_sbasin, Path_model,IDF, name_basin):
    
    """ Esta función modifica el fichero con extensión .met en el caso de que se quieran crear o incluir nuevos modulos en el meteorologic model. En caso de que ya estén creados los modulos, no hay necesidad de usar esta función.
        
    Input:
    ----------------
    name_met:        Str. Se introduce el nombre del fichero .met que se desea crear.
    names_sbasin:      Str. Se introduce una tupla que contenga los nombres de las subcuencas.
    Path_model         Str. Se introduce la ruta en donde está el fichero .met a modificar dentro del modelo HEC-HMS.
    name_basin:        Str. Se introduce el nombre del Basin el cual se puede ver en el módulo cuando se abre el programa.
    names_sbasin:      Str. Se introduce el nombre de las subcuencas del modelo.
    Evapotranspiration: True or False: Si el modelo se contempla la Evapotranspiración mensual poner True y además es necesario incluir la tabla como argumento ET_Table
    
    Output:
    ---------------
    fichero_met:      Str. Fichero modificado .met del programa HEC HMS"""
        
    Q_mean_Basin = np.mean(IDF,axis=1)
        
    lines_new  = list()     
    lines_new.append('Meteorology: '+name_met.replace("_", " ")+'\n')
    lines_new.append('     Last Modified Date: 13 November 2020'+'\n')
    lines_new.append('     Last Modified Time: 11:16:56'+'\n')
    lines_new.append('     Version: 4.9'+'\n')
    lines_new.append('     Unit System: Metric'+'\n')
    lines_new.append('     Set Missing Data to Default: No'+'\n')
    lines_new.append('     Precipitation Method: Frequency Based Hypothetical'+'\n')
    lines_new.append('     Short-Wave Radiation Method: None'+'\n')
    lines_new.append('     Long-Wave Radiation Method: None'+'\n')
    lines_new.append('     Snowmelt Method: None'+'\n')
    lines_new.append('     Evapotranspiration Method: No Evapotranspiration'+'\n')
    lines_new.append('     Use Basin Model: '+name_basin+'\n')                 
    lines_new.append('End:'+'\n') 
    lines_new.append('\n')
    
    lines_new.append('Precip Method Parameters: Frequency Based Hypothetical'+'\n'
     '     Last Modified Date: 19 February 2021'+'\n'
     '     Last Modified Time: 12:22:43'+'\n'
     '     Storm Type: Hydro-35/TP-40/TP-49'+'\n'
     '     Single Hypothetical Storm Size: Yes'+'\n'
     '     Convert From Annual Series: Yes'+'\n'
     '     Convert to Annual Series: Yes'+'\n'
     '     Uniform Depth Duration Curve: No'+'\n'
     '     Storm Size:'+'\n'
     '     Total Duration: 1440'+'\n'
     '     Time Interval: 5'+'\n'
     '     Percent of Duration Before Peak Rainfall: 50'+'\n'
     '     Depth-Area Reduction Method: No Reduction'+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[0])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[1])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[2])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[3])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[4])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[5])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[6])+'\n'
     '     Depth: '+str(Q_mean_Basin.iloc[7])+'\n'
     '     Depth:'+'\n'
     '     Depth:'+'\n' 
     '     Depth:'+'\n'
     '     Depth:'+'\n' 
     'End:'+'\n')
    lines_new.append('\n')


    for b in names_sbasin:
        lines_new.append('Subbasin: '+b+'\n')
        lines_new.append('     Last Modified Date: 8 February 2021'+'\n')
        lines_new.append('     Last Modified Time: 17:43:40'+'\n')
        lines_new.append('     Depth: '+str(IDF.loc[:,b].iloc[0])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[1])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[2])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[3])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[4])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[5])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[6])+'\n'
                         '     Depth: '+str(IDF.loc[:,b].iloc[7])+'\n'
                         '     Depth:'+'\n'
                         '     Depth:'+'\n' 
                         '     Depth:'+'\n'
                         '     Depth:'+'\n'
                         'End:'+'\n' )
        lines_new.append('\n')
    ### Genera un fichero con extensión .met donde se encuentra la carpeta del modelo HEC-HMS, rellenando los datos de evapotranspiración.
    with open(Path_model+name_met+'.met', "w") as fh:
        for line in (lines_new):
            fh.write(line)
                
    return print('################### Los ficheros .met fueron creados en la carpeta del proyecto satisfactoriamente ###############################')

    