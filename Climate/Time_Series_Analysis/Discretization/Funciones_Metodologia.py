import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import LocallyLinearEmbedding
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.linear_model import LogisticRegression
from sklearn.metrics.pairwise import pairwise_distances
from sklearn import metrics
import scipy.stats as st
import os
import matplotlib.pyplot as plt
import time
from osgeo import gdal
import tqdm
from osgeo.gdalnumeric import *
from osgeo.gdalconst import *
import dask.array as da
from dask.distributed import Client, progress
import openturns as ot
import openturns.viewer as otv

def block_array(data,ncols,nrows):
    array =list()
    for i in np.array_split(data, ncols):
        A = np.array_split(i, nrows,axis=1)
        for j in A:
            array.append(j)
    return  np.array(array).reshape((nrows,ncols))

def compute_D4(i, j):
    return [(i-1, j), (i+1, j), (i, j-1), (i, j+1)]

def compute_D8(i,j):
    return [(i-1, j-1), (i, j-1), (i+1, j-1), (i-1, j), (i+1, j), (i-1, j+1), (i, j+1), (i+1, j+1)]

class sweepMatrixNeighbors(object):
    def __init__(self, N, M, neighbors="D4"):
        self.n = N
        self.m = M
        if neighbors == "D4":
            self.f = compute_D4
        elif neighbors == "D8":
            self.f = compute_D8
        else:
            raise Exception("Metodo de Vecinos no conocido")
        
    def __call__(self, i, j):
        posibles = self.f(i, j) 
        reales = []
        for ii, jj in posibles:
            if (0 <= ii < self.n) and (0 <= jj < self.m):
                reales.append((ii, jj))
        return reales
    
def precomputa_Distancias(matriz):
    (elems, components) = matriz.shape
    distancias = np.zeros((elems, elems))
    for row in range(elems):
        for col in range(row, elems):
            distancias[row, col] = np.sqrt(np.sum((matriz[row, :] - matriz[col, :])**2))
    distancias += distancias.T
    return distancias
    
def compute_mindist_permutation(n, m, mapas, method="D8"):
    bestDist = np.inf
    bestIter = []
    visitador = sweepMatrixNeighbors(n, m, neighbors=method)
    #dist_mat = precomputa_Distancias(mapas)
    dist_mat = np.sqrt(pairwise_distances(mapas, metric="correlation")**2 
                       + pairwise_distances(mapas, metric="euclidean")**2)
    for permu in permutations(np.arange(m*n)):
        D = 0
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = permu[ind_matriz]
                mapa_destino = permu[nn[0]*m+nn[1]]
                D += dist_mat[mapa_origen, mapa_destino]
        if D < bestDist:
            bestDist = D
            bestIter = list(permu)
    return bestIter

def compute_mindist_permutation_random(n, m, mapas, iters=100000, method="D8", best=None):
    visitador = sweepMatrixNeighbors(n, m, neighbors=method)
    dist_mat = np.sqrt(pairwise_distances(mapas, metric="correlation")**2 
                       + pairwise_distances(mapas, metric="euclidean")**2)
    if not best:
        bestDist = np.inf
        bestIter = []
    else:
        bestIter = best
        bestDist = 0.
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = best[ind_matriz]
                mapa_destino = best[nn[0]*m+nn[1]]
                bestDist += dist_mat[mapa_origen, mapa_destino]
    
    for i in range(iters):
        permu = np.random.permutation(np.arange(n*m))
        D = 0
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = permu[ind_matriz]
                mapa_destino = permu[nn[0]*m+nn[1]]
                D += dist_mat[mapa_origen, mapa_destino]
        if D < bestDist:
            bestDist = D
            bestIter = list(permu)
    return bestIter


## PCA

def compute_D4(i, j):
    return [(i-1, j), (i+1, j), (i, j-1), (i, j+1)]

def compute_D8(i,j):
    return [(i-1, j-1), (i, j-1), (i+1, j-1), (i-1, j), (i+1, j), (i-1, j+1), (i, j+1), (i+1, j+1)]

class sweepMatrixNeighbors(object):
    def __init__(self, N, M, neighbors="D4"):
        self.n = N
        self.m = M
        if neighbors == "D4":
            self.f = compute_D4
        elif neighbors == "D8":
            self.f = compute_D8
        else:
            raise Exception("Metodo de Vecinos no conocido")
        
    def __call__(self, i, j):
        posibles = self.f(i, j) 
        reales = []
        for ii, jj in posibles:
            if (0 <= ii < self.n) and (0 <= jj < self.m):
                reales.append((ii, jj))
        return reales
    
def precomputa_Distancias(matriz):
    (elems, components) = matriz.shape
    distancias = np.zeros((elems, elems))
    for row in range(elems):
        for col in range(row, elems):
            distancias[row, col] = np.sqrt(np.sum((matriz[row, :] - matriz[col, :])**2))
    distancias += distancias.T
    return distancias
    
def compute_mindist_permutation(n, m, mapas, method="D8"):
    bestDist = np.inf
    bestIter = []
    visitador = sweepMatrixNeighbors(n, m, neighbors=method)
    #dist_mat = precomputa_Distancias(mapas)
    dist_mat = np.sqrt(pairwise_distances(mapas, metric="correlation")**2 
                       + pairwise_distances(mapas, metric="euclidean")**2)
    for permu in permutations(np.arange(m*n)):
        D = 0
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = permu[ind_matriz]
                mapa_destino = permu[nn[0]*m+nn[1]]
                D += dist_mat[mapa_origen, mapa_destino]
        if D < bestDist:
            bestDist = D
            bestIter = list(permu)
    return bestIter

def compute_mindist_permutation_random(n, m, mapas, iters=100000, method="D8", best=None):
    visitador = sweepMatrixNeighbors(n, m, neighbors=method)
    dist_mat = np.sqrt(pairwise_distances(mapas, metric="correlation")**2 
                       + pairwise_distances(mapas, metric="euclidean")**2)
    if not best:
        bestDist = np.inf
        bestIter = []
    else:
        bestIter = best
        bestDist = 0.
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = best[ind_matriz]
                mapa_destino = best[nn[0]*m+nn[1]]
                bestDist += dist_mat[mapa_origen, mapa_destino]
    
    for i in range(iters):
        permu = np.random.permutation(np.arange(n*m))
        D = 0
        for ind_matriz in range(n*m):
            jj = ind_matriz % m
            ii = ind_matriz // m
            for nn in visitador(ii, jj):
                mapa_origen = permu[ind_matriz]
                mapa_destino = permu[nn[0]*m+nn[1]]
                D += dist_mat[mapa_origen, mapa_destino]
        if D < bestDist:
            bestDist = D
            bestIter = list(permu)
    return bestIter


# Max Diss

def distancia(datos, s, k, aux_d2):
    'Returns nearest centroid to sample points'

# Scalar
    dis = datos[s, :]-datos[:]

# Directional
    disci_1 = np.absolute(dis[:, k:])
    disci_2 = aux_d2 - disci_1
    dis[:, k:] = np.minimum(disci_1, disci_2)/math.pi

# Total distance
    return np.sum(dis ** 2, axis=1)


def cluster_cercano(c, xx_2, tam, k, d, aux_d2):
    'Returns nearest cluster to sample points'

# Scalar
    dis = xx_2 - c

# Directional
    disci_1 = np.absolute(dis[:, k:])
    disci_2 = aux_d2 - disci_1
    dis[:, k:] = np.minimum(disci_1, disci_2) / math.pi

# Total distance
    dis_t = np.sum(dis ** 2, axis=1)
    return dis_t.argmin()


def clentroide_medio(ix, k, d, dim):
    
    #Funcion con la que a partir de los puntos de cada cluster se obtiene el nuevo centoide medio para cada iteracion
   

    #Escalares

    c=np.mean(ix, axis=0)

    #Direccionales

    for i in range(k, dim):
        c[i] = media_angulos(ix[:, i])
    return c

def cercanos(centroides_f, datos_n, num_centros, escalar, direccional):
#Busqueda del centroide mas cercano a cada punto de origen, usar una vez encontrados los centroides finales

# Obtencion de datos auxuliares para calcular distancias

    N = len(datos_n[:, 0])
    dim = len(datos_n[0, :])
    k = len(escalar)
    d = len(direccional)
    aux_d2 = 2 * math.pi * np.ones((num_centros, d))

#Calculo de centroide cercano

    cercano = np.zeros(N)
    xx_2 = np.zeros((num_centros, dim))
    for i in range(0, N):
        xx_2[:] = datos_n[i, :]  # relleno con puntos iguales para luego restar
        cercano[i] = cluster_cercano(centroides_f, xx_2, num_centros, k, d, aux_d2)  # cluster mas cercano a cada punto

    return cercano

def NormalizeMatrix(np_matrix, scalar_list, directional_list):

#Normalize entire numpy matrix. Scalar and directional are lists containing index for scalar columns and directional colums
   

    np_matrix_norm = np.ones(np_matrix.shape)

    for c in scalar_list:
        np_matrix_norm[:, c] = Normalize(np_matrix[:, c], 'scalar')

    for c in directional_list:
        np_matrix_norm[:, c] = Normalize(np_matrix[:, c], 'directional')

    return np_matrix_norm


def DeNormalizeMatrix(np_matrix_norm_ord, source_data, scalar_list, directional_list):

    list = scalar_list + directional_list

    np_matrix_norm = np_matrix_norm_ord[:, list]

    np_matrix = np.ones(np_matrix_norm.shape)

    for c in scalar_list:
        np_matrix[:, c] = Denormalize(np_matrix_norm[:, c], np_array=source_data[:, c], a_type='scalar')

    for c in directional_list:
        np_matrix[:, c] = Denormalize(np_matrix_norm[:, c], a_type='directional')

    return np_matrix

def cluster_cercano(c, xx_2, tam, k, d, aux_d2):
    'Returns nearest cluster to sample points'

# Scalar
    dis = xx_2 - c

# Directional
    disci_1 = np.absolute(dis[:, k:])
    disci_2 = aux_d2 - disci_1
    dis[:, k:] = np.minimum(disci_1, disci_2) / math.pi

# Total distance
    dis_t = np.sum(dis ** 2, axis=1)
    return dis_t.argmin()

import numpy as np
import math
#from statistical.lib_statistical import distancia, cluster_cercano, clentroide_medio, NormalizeMatrix, DeNormalizeMatrix, cercanos

def MaxDiss(datos, num, scalar,pos_Qmax_tipo):
#MaxDiss sin umbral con algoritmo MaxMin Comienza con el máximo de la primera columna'''
# Matrices auxiliares para calcular distancias

    print('Solving MaxDiss ... ')

    nx, ny = datos.shape
    k = len(scalar)
    aux_d2 = 2 * math.pi * np.ones((nx, ny-k))

# Busqueda de la poscion de la altura de ola maxima (punto de inicio maxdiss)
    semilla = np.argmax(datos[:, 0])

## Algoritmo MaxDiss
    filas_total = datos.shape[1]
    subset = np.zeros((num, filas_total))
    subset[0, :] = datos[semilla, :]
    selc_pos = []
    selc_pos.append(semilla)

# Para el primer punto
    xx = np.zeros((len(datos[:, 0]), len(datos[0, :])))
    Dis_ultima = distancia(datos, semilla, k, aux_d2)
    pos_max = Dis_ultima.argmax()
    subset[1, :] = datos[pos_max, :]
    Dis_ultima[pos_max] = 0.0
    Dis_ultima[semilla] = 0.0
    selc_pos.append(pos_max)

# Para los siguinetes puntos
    for n_centros in range(2, num):
        if n_centros<27:
            selc_pos.append(pos_Qmax_tipo[n_centros-2])
        else:       
            xx[:] = subset[n_centros-1, :]
            Dis_anterior = distancia(datos, pos_max, k, aux_d2)
            Dis_ultima = np.minimum(Dis_anterior, Dis_ultima)
            pos_max = Dis_ultima.argmax()
            subset[n_centros, :] = datos[pos_max, :]
            Dis_ultima[pos_max] = 0.0
            selc_pos.append(pos_max)
    print('Done.')
    return subset, selc_pos

class generacion_eventos_sinteticos(object):
    def __init__(self,caudal, umbral, umbral2, n_tipos, path_results,path_script_matlab,plot):
        self.caudal             = caudal
        self.umbral             = umbral
        self.umbral2            = umbral2
        self.n_tipos            = n_tipos
        self.path_results       = path_results
        self.path_script_matlab = path_script_matlab
        self.plot               = plot
        
        return
    
    def eventos_caudal(self):
        datos=pd.DataFrame(index=self.caudal.index)
        datos['Y']=self.caudal.values
        datos['X']=np.arange(0, len(self.caudal))
        
        
        x_inicial=list(); y_inicial=list()
        x_final=list(); y_final=list()
        pendiente=list()
        for i, ii in enumerate(datos['X'].values[0:-1]):
            y1=datos['Y'][i]; y2=datos['Y'][i+1]
            x1=ii; x2=x1+1
            m=(y2-y1)/(x2-x1); pendiente.append(m)
            pp=np.array(pendiente); pp[pp>=0]=1; pp[pp<0]=-1
            diff_pp=np.diff(pp)
        time=datos.index[1:len(diff_pp)+1]
        datf=pd.DataFrame(index=time)
        datf['Y']=diff_pp
        datf['X']=np.arange(1, len(diff_pp)+1)
        datf['YY']=datos['Y']
        datf['XX']=datos['X']
        for i, ii in enumerate(datos['X'].values[0:-1]):
            y1=datos['Y'][i]; y2=datos['Y'][i+1]
            x1=ii; x2=x1+1
            m=(y2-y1)/(x2-x1)
            if m>0 and y1<=self.umbral and y2>self.umbral:
                x_inicial.append(x1)
                y_inicial.append(y1)

            if m<0 and y1>=self.umbral and y2<self.umbral:
                x_final.append(x2)
                y_final.append(y2)
        x_final_2=list()
        y_final_2=list()
        for i, ii in enumerate(x_inicial):
            aux=ii-x_final
            aux[aux>=0]=-1000
            x_final_2.append(x_final[np.argmax(aux)])
            y_final_2.append(y_final[np.argmax(aux)])
        x_final=x_final_2
        y_final=y_final_2
        diff_pp
        time=datos.index[1:len(diff_pp)+1]
        datf=pd.DataFrame(index=time)
        datf['Punt_inflex']=diff_pp
        datf['X']=np.arange(1, len(diff_pp)+1)
        datf['Y']=datos['Y']
        datf['X']=datos['X']
        datf_1=datf[datf['Punt_inflex']==2]
        datf_2=datf[datf['Punt_inflex']==(-2)]
        x_inicial_dataframe=pd.DataFrame(index=datos.index[x_inicial])
        x_inicial_dataframe['Y']=y_inicial
        x_final_dataframe=pd.DataFrame(index=datos.index[x_final])
        x_final_dataframe['Y']=y_final
        p1_x=list(); p1_y=list(); p1_time=list()
        p2_x=list(); p2_y=list(); p2_time=list()
        for i in range(len(x_inicial)):
            resta=x_inicial[i]-datf_1['X']
            resta[resta<0]=1000
            posi=resta.index[np.argmin(resta)]
            aux_p1_x=datos[datos.index==posi]['X'].values;  p1_x.append(aux_p1_x[0])
            aux_p1_y=datos[datos.index==posi]['Y'].values;  p1_y.append(aux_p1_y[0])
            aux_p1_time=datos[datos.index==posi].index; p1_time.append(aux_p1_time[0])

        for i in range(len(x_final)):
            resta=-datf_1['X']+x_final[i]
            resta[resta>0]=-1000
            posi=resta.index[np.argmax(resta)]
            if np.sum(resta.values==-1000)==len(resta):
                p1_x=p1_x[0:-1]
                p1_y=p1_y[0:-1]
                p1_time=p1_time[0:-1]
            else:
                aux_p2_x=datos[datos.index==posi]['X'].values;  p2_x.append(aux_p2_x[0])
                aux_p2_y=datos[datos.index==posi]['Y'].values;  p2_y.append(aux_p2_y[0])
                aux_p2_time=datos[datos.index==posi].index; p2_time.append(aux_p2_time[0])
        date_p1=pd.DataFrame(index=np.array(p1_time))
        date_p1['X']=np.array(p1_x)
        date_p1['Y']=np.array(p1_y)
        date_p2=pd.DataFrame(index=np.array(p2_time))
        date_p2['X']=np.array(p2_x)
        date_p2['Y']=np.array(p2_y)
        date_p2=date_p2[date_p2['Y']<self.umbral]
        Resultados=pd.DataFrame()
        Resultados['Inicio_evento']=p1_x
        Resultados['Fin_evento']=p2_x
        Resultados_clasificacion=pd.DataFrame()
        Q_max=list()
        Q_med=list()
        Duracion=list()
        ini=list()
        fin=list()
        for i, ii in enumerate(np.unique(Resultados.index)):
            datos1=pd.DataFrame()
            datos1=datos[datos['X']>=(Resultados['Inicio_evento'][i])]
            datos1=datos1[datos1['X']<=(Resultados['Fin_evento'][i])]
            if max(datos1.Y)>=self.umbral2:
                Q_max.append(max(datos1.Y))
                Q_med.append(np.mean(datos1.Y))
                Duracion.append(Resultados['Fin_evento'][i]-Resultados['Inicio_evento'][i])
                ini.append(Resultados['Inicio_evento'][i])
                fin.append(Resultados['Fin_evento'][i])
        del Resultados
        Resultados=pd.DataFrame()
        Resultados['Inicio_evento']=ini
        Resultados['Fin_evento']=fin
        Resultados_clasificacion['Qmax']=Q_max
        Resultados_clasificacion['Qmed']=Q_med
        Resultados_clasificacion['Duracion']=Duracion
        
        if self.plot==True:
            pos_max = np.argmax(Resultados_clasificacion.loc[:,'Qmax'].values)
            max_value = np.max(Resultados_clasificacion.loc[:,'Qmax'].values)
            x_min = Resultados.loc[:,'Inicio_evento'].values[pos_max]-30
            x_max = Resultados.loc[:,'Fin_evento'].values[pos_max]+30
            fig, ax = plt.subplots(figsize=(15,8))
            plt.plot(datos['X'], datos['Y'], '--k', linewidth=2.5, label='Serie de Caudales')
            plt.plot(date_p1['X'], date_p1['Y'], '.r', markersize=20,  label='Punto Inicial')
            plt.plot(date_p2['X'], date_p2['Y'], '.b', markersize=20,  label='Punto final')
            plt.axhline(self.umbral, linestyle='--', linewidth=2.5,  label='Umbral')
            plt.xlim(x_min,x_max)
            plt.ylim(0,max_value)
            plt.ylabel('Q(m3/s)', fontsize=20)
            plt.xlabel('T (días)', fontsize=20)
            plt.grid(True)
            plt.tick_params(labelsize=20)
            plt.legend(fontsize=20)

        return Resultados_clasificacion, Resultados
    
    def clacificacion_PCA(self):
        datos=pd.DataFrame(index=self.caudal.index)
        datos['Y']=self.caudal.values
        datos['X']=np.arange(0, len(self.caudal))
        [Resultados_clasificacion, Resultados] = self.eventos_caudal()
        self.Resultados_clasificacion_0 = Resultados_clasificacion
        self.Resultados_0 = Resultados
        numero_puntos=100
        Hidrogramas=pd.DataFrame()
        Hidrogramas_interpol=pd.DataFrame()
        M=np.zeros((len(Resultados), numero_puntos))
        clasificacion=pd.DataFrame(M, index=np.arange(0,len(Resultados)))
        time2=list()
        time1=list()
        for n in range(len(Resultados)):
            aux1=Resultados['Inicio_evento'][n]
            aux2=Resultados['Fin_evento'][n]
            Hidrogramas=datos[datos['X']>=aux1]
            Hidrogramas=Hidrogramas[Hidrogramas['X']<=aux2]
            Hidrogramas.index=np.arange(0,len(Hidrogramas))
            time1=np.linspace(0,1,num=(len(Hidrogramas)))
            time2=np.linspace(0,1,num=numero_puntos)
            X2=(Hidrogramas['Y'].values/max(Hidrogramas['Y'].values))
            Hidrogramas_interpol['X']=time2
            Hidrogramas_interpol['Y']=np.interp(time2, time1, X2)
            for j,jj in enumerate(Hidrogramas_interpol.Y):
                clasificacion[j][n]=jj
        
        eof = PCA(n_components=0.95)
        eof.fit(clasificacion)
        eofGEO = eof.transform(clasificacion)
        print(eof.n_components_)
        print(np.sum(eof.explained_variance_ratio_))
        explained_variance = eof.explained_variance_ratio_.copy()
        explained_variance = np.vstack([explained_variance, np.cumsum(eof.explained_variance_ratio_)]).T##Nos da la varianza explicada y 
        np.shape(eofGEO) 
        ddatos = eofGEO
        matriz=eof.inverse_transform(ddatos)
        
        return ddatos
    
    def K_means(self):
        ddatos   = self.clacificacion_PCA()
        Resultados_clasificacion = self.Resultados_clasificacion_0
        (NK, MK) = (int(self.n_tipos**(1/2)), int(self.n_tipos**(1/2)))
        km       = KMeans(n_clusters=NK*MK)
        km.fit(ddatos)
        
        klus = km
        
        bI = compute_mindist_permutation_random(NK, MK, klus.cluster_centers_, method="D8", iters=200000)
        print(bI)
        centros_ordenados = klus.cluster_centers_[bI, :]
        Tipos_bmus = km.predict(ddatos)
        Resultados_clasificacion['Tipo_hidro']=(Tipos_bmus)
        return Resultados_clasificacion

    def run_copulas(self):      
        
        Resultados_clasificacion = self.K_means()
        Tipos_bmus = Resultados_clasificacion.loc[:,'Tipo_hidro'].values
        Probabilidad=pd.DataFrame(index=np.arange(0,self.n_tipos))
        Probabilidad['P']=0
        prob=list()
        new_Bmus=list()

        for i in range(0,self.n_tipos):
            posi=np.where(Tipos_bmus==i)
            prob.append((len(posi[0])/len(Tipos_bmus)))
        Probabilidad['P']=prob
        Probabilidad['Tipo_Bmus']=np.arange(0,self.n_tipos)
        
        xk=np.arange(0,self.n_tipos)
        pk=Probabilidad['P'].values
        rv = st.rv_discrete(xk[0], xk[-1], values=(xk, pk))
        f_distr=rv.cdf(Tipos_bmus) 
        Resultados_clasificacion['Prob_CDF']=f_distr
        
        sample1 = ot.Sample([[p] for p in Resultados_clasificacion['Qmax']]) # data reshaping
        tested_factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
        Fqmax, best_bic = ot.FittingTest.BestModelBIC(sample1,
                                                           tested_factories)
        print("Best=",Fqmax)
        
        sample2 = ot.Sample([[p] for p in Resultados_clasificacion['Qmed']]) # data reshaping
        tested_factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
        Fqmed, best_bic = ot.FittingTest.BestModelBIC(sample2,
                                                           tested_factories)
        print("Best=",Fqmed)
        
        sample3 = ot.Sample([[p] for p in Resultados_clasificacion['Duracion']]) # data reshaping
        tested_factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
        Fdur, best_bic = ot.FittingTest.BestModelBIC(sample3,
                                                           tested_factories)
        print("Best=",Fdur)
        
        sample4 = ot.Sample([[p] for p in Resultados_clasificacion['Tipo_hidro']]) # data reshaping
        factory = ot.UserDefinedFactory()
        Ftipo = factory.build(sample4)
        
        Pqmax = Fqmax.computeCDF(sample1)
        Pqmed = Fqmed.computeCDF(sample2)
        Pdur  = Fdur.computeCDF(sample3)
        Ptipo = Ftipo.computeCDF(sample4)
        
        Prob = np.vstack((Pqmax,Pqmed,Pdur,Ptipo)).reshape(4,-1).T
        dist = ot.NormalCopulaFactory().build(Prob)
        eventos_sint_prob = np.array(dist.getSample(4943))
        
        qmax_sint = Fqmax.computeQuantile(eventos_sint_prob[:,0])
        qmed_sint = Fqmed.computeQuantile(eventos_sint_prob[:,1])
        dur_sint  = Fdur.computeQuantile(eventos_sint_prob[:,2])
        tipo_sint = Ftipo.computeQuantile(eventos_sint_prob[:,3])
        Matriz_sintetica = pd.DataFrame(np.vstack((qmax_sint,qmed_sint,dur_sint,tipo_sint)).reshape(4,-1).T,columns= ['Qmax','Qmed','Duracion','Tipo_Hidro'])

#         with open(self.path_script_matlab+'/Simulacion_Copula.m', "r") as out_file:
#             lines = out_file.readlines()
#             out_file.close()

#         lines[6] = "pathr='" + self.path_results+"';\n"   
#         lines[8] = "path2='" + self.path_results+"';\n"

#         with open(self.path_script_matlab+'/Simulacion_Copula.m', "w") as fh:
#             for line in lines:
#                 fh.write(line) 

#         np.savetxt(self.path_results+"Eventos_PCA.dat", Resultados_clasificacion)
#         os.system('matlab -nosplash -nodesktop -minimize -r "run '+self.path_script_matlab+'Simulacion_Copula.m;exit"')
#         time.sleep(40)
#         Matriz_sintetica=pd.read_csv(self.path_results+'matriz_sintetica.csv',header=None,skiprows=1)
#         Matriz_sintetica.columns = ['Qmax','Qmed','Duracion','Tipo_Hidro']
#         Matriz_sintetica.loc[:,'Tipo_Hidro'] = rv.ppf(Matriz_sintetica.loc[:,'Tipo_Hidro'].values)
        
        if self.plot==True:
            
            #### Ajuste Qmax
            graph = ot.UserDefined(sample1).drawCDF()
            bestCDF = Fqmax.drawCDF()
            bestCDF.setColors(["blue"])
            graph.add(bestCDF)
            graph.setTitle("Best BIC fit")
            name =Fqmax.getName()
            graph.setLegends(["ECDF",name])
            graph.setXTitle("Qmax")
            otv.View(graph)
            
            graph = ot.HistogramFactory().build(sample1).drawPDF()
            bestPDF = Fqmax.drawPDF()
            bestPDF.setColors(["blue"])
            graph.add(bestPDF)
            graph.setTitle("Best BIC fit")
            name =Fqmax.getName()
            graph.setLegends(["Histogram",name])
            graph.setXTitle("Qmax")
            otv.View(graph)
            
            #### Ajuste Qmed
            
            graph = ot.UserDefined(sample2).drawCDF()
            bestCDF = Fqmed.drawCDF()
            bestCDF.setColors(["blue"])
            graph.add(bestCDF)
            graph.setTitle("Best BIC fit")
            name =Fqmed.getName()
            graph.setLegends(["Histogram",name])
            graph.setXTitle("Qmed")
            otv.View(graph)
            
            graph = ot.HistogramFactory().build(sample2).drawPDF()
            bestPDF = Fqmed.drawPDF()
            bestPDF.setColors(["blue"])
            graph.add(bestPDF)
            graph.setTitle("Best BIC fit")
            name = Fqmed.getName()
            graph.setLegends(["Histogram",name])
            graph.setXTitle("Qmed")
            otv.View(graph)
            
            #### Ajuste Dur
            graph = ot.UserDefined(sample3).drawCDF()
            bestCDF = Fdur.drawCDF()
            bestCDF.setColors(["blue"])
            graph.add(bestCDF)
            graph.setTitle("Best BIC fit")
            name =Fdur.getName()
            graph.setLegends(["Histogram",name])
            graph.setXTitle("Duration")
            otv.View(graph)
            
            graph = ot.HistogramFactory().build(sample3).drawPDF()
            bestPDF = Fdur.drawPDF()
            bestPDF.setColors(["blue"])
            graph.add(bestPDF)
            graph.setTitle("Best BIC fit")
            name = Fdur.getName()
            graph.setLegends(["Histogram",name])
            graph.setXTitle("Duration")
            otv.View(graph)
            
            fig, axarr = plt.subplots(1, 3, figsize=(15,5))
            axarr[0].scatter(Matriz_sintetica['Qmax'], Matriz_sintetica['Qmed'], marker='o', cmap="jet",label = 'Synthetic events')
            axarr[0].scatter(Resultados_clasificacion['Qmax'],Resultados_clasificacion['Qmed'], marker='o', color='orange', cmap="jet",label = 'Real events')
            axarr[0].set_xlabel('Qmax',fontsize=12)
            axarr[0].set_ylabel('Qmed',fontsize=12)
            axarr[0].grid(True)
            axarr[1].scatter(Matriz_sintetica['Qmax'], Matriz_sintetica['Duracion'], marker='o', cmap="jet")
            axarr[1].scatter(Resultados_clasificacion['Qmax'],Resultados_clasificacion['Duracion'], marker='o', color='orange', cmap="jet")
            axarr[1].set_xlabel('Qmax',fontsize=12)
            axarr[1].set_ylabel('Duration',fontsize=12)
            axarr[1].grid(True)
            axarr[2].grid(True)
            axarr[2].scatter(Matriz_sintetica['Qmed'], Matriz_sintetica['Duracion'], marker='o', cmap="jet")
            axarr[2].scatter(Resultados_clasificacion['Qmed'],Resultados_clasificacion['Duracion'], marker='o', color='orange', cmap="jet")
            axarr[2].set_xlabel('Qmed',fontsize=12)
            axarr[2].set_ylabel('Duration',fontsize=12)

            lines = []
            labels = []
            for i,ax in enumerate(fig.axes):
                axLine, axLabel = ax.get_legend_handles_labels()
                lines.extend(axLine)
                labels.extend(axLabel)
            fig.legend(lines, labels,           
                       loc = 8,ncol=3, prop={'size': 12})
            fig.tight_layout(pad=3.5)
            
        Matriz_sintetica.to_csv(self.path_results+'matriz_sintetica.csv')
        
        return Matriz_sintetica, Resultados_clasificacion, self.Resultados_0 


class reconstruccion_eventos_sinteticos(object):
    def __init__(self,caudal,Matriz_sintetica, n_tipos,Resultados_clasificacion,Resultados,path_results,path_output,plot):
        self.caudal                   = caudal
        self.Matriz_sintetica         = Matriz_sintetica
        self.n_tipos                  = n_tipos
        self.path_output              = path_output
        self.path_results             = path_results
        self.Resultados_clasificacion = Resultados_clasificacion
        self.Resultados               = Resultados
        self.plot                     = plot
    
    def seleccion_eventos_sinteticos(self):
        Matriz_sintetica = self.Matriz_sintetica.copy()
        Resultados_Normalizados=pd.DataFrame()
        Qmax_N=list()
        Qmed_N=list()
        d_N=list()
        for i,ii in enumerate(self.Matriz_sintetica.index):
            Qmax_N.append(((self.Matriz_sintetica['Qmax'][i]-np.mean(self.Matriz_sintetica['Qmax']))/
                                              np.std(self.Matriz_sintetica['Qmax'])))
            Qmed_N.append(((self.Matriz_sintetica['Qmed'][i]-np.mean(self.Matriz_sintetica['Qmed']))/
                                              np.std(self.Matriz_sintetica['Qmed'])))
            d_N.append(((self.Matriz_sintetica['Duracion'][i]-np.mean(self.Matriz_sintetica['Duracion']))/
                                              np.std(self.Matriz_sintetica['Duracion'])))
        Resultados_Normalizados['Qmax']=Qmax_N
        Resultados_Normalizados['Qmed']=Qmed_N
        Resultados_Normalizados['Duracion']=d_N
        
        
        posi_max_tipo=list()
        Qmax_Tipo=list()
        for t in range (0,self.n_tipos):
            Q_tipo_max=max(self.Matriz_sintetica[self.Matriz_sintetica['Tipo_Hidro']==t]['Qmax'])
            Qmax_Tipo.append(Q_tipo_max)
            poss=(np.where(self.Matriz_sintetica['Qmax']==Q_tipo_max))
            poss=poss[0]
            posi_max_tipo.append(poss[0])
            
        (NK, MK) = (20, 20)
        num=NK*MK
        #scalar=[0, 1, 2]
        scalar=np.arange(Resultados_Normalizados.shape[1])
        direct=[]
        Resultados_Normalizados_2=Resultados_Normalizados.values
        #MaxDiss algorithm
        classif = MaxDiss(Resultados_Normalizados_2, num, scalar, posi_max_tipo)

        print('MaxDiss classification')
        Mklus=classif[0]
        
        centroides_N=pd.DataFrame()
        mas_cercano_N=pd.DataFrame()
        centroides=pd.DataFrame(index=np.arange(0,len(Mklus[:,0])+self.n_tipos),columns=['Qmax','Qmed','Duracion'])
        ini=list()
        fin=list()
        Tipos_Bmus=list()
        centroides_N['Qmax']=Mklus[:,0]
        centroides_N['Qmed']=Mklus[:,1]
        centroides_N['Duracion']=Mklus[:,2]

        ######Desnormalizamos#######
        Qmax=list()
        Qmed=list()
        d=list()
        for i,ii in enumerate(centroides_N.index):
            Qmax.append(centroides_N['Qmax'][i]*np.std(Matriz_sintetica['Qmax'])+np.mean(Matriz_sintetica['Qmax']))                                
            Qmed.append(centroides_N['Qmed'][i]*np.std(Matriz_sintetica['Qmed'])+np.mean(Matriz_sintetica['Qmed']))
            d.append(centroides_N['Duracion'][i]*np.std(Matriz_sintetica['Duracion'])+np.mean(Matriz_sintetica['Duracion']))
            

        centroides.loc[self.n_tipos:,'Qmax']=Qmax
        centroides.loc[self.n_tipos:,'Qmed']=Qmed
        centroides.loc[self.n_tipos:,'Duracion']=d

        #####Introducimos los valores maximos de cada tipo####
        for k in range(0,self.n_tipos):
            centroides.loc[k,'Qmax']     =Matriz_sintetica['Qmax'][posi_max_tipo[k]]
            centroides.loc[k,'Qmed']     =Matriz_sintetica['Qmed'][posi_max_tipo[k]]
            centroides.loc[k,'Duracion'] =Matriz_sintetica['Duracion'][posi_max_tipo[k]]
        ######################################################################
        for i in range(len(Resultados_Normalizados)):
            dist=((centroides_N['Qmax']-Resultados_Normalizados['Qmax'][i])**2+(centroides_N['Qmed']-Resultados_Normalizados['Qmed'][i])**2+ (centroides_N['Duracion']-Resultados_Normalizados['Duracion'][i])**2)**(1/2)
            Tipos_Bmus.append(np.argmin(dist))
        Matriz_sintetica['Tipos_bmus']=Tipos_Bmus
        
        tipo_hidro=list()
        centroides['Tipo_Hidro']=0
        for x,xx in enumerate(classif[1]):
            tipo_hidro=(Matriz_sintetica['Tipo_Hidro'][xx])
            centroides['Tipo_Hidro'][x+self.n_tipos]=tipo_hidro
        
        centroides.loc[0:self.n_tipos-1,'Tipo_Hidro'] = np.arange(0,self.n_tipos)
            
        self.Matriz_sintetica = Matriz_sintetica
        self.centroides       = centroides
        
        if self.plot==True:
            fig, axarr = plt.subplots(1, 3, figsize=(15,5))
            axarr[2].scatter(Matriz_sintetica['Qmax'], Matriz_sintetica['Qmed'], marker='o',c='b',s=15, cmap="jet")
            axarr[2].scatter(Qmax,Qmed, marker='x', c='r', cmap="jet",  alpha=0.75)
            axarr[2].set_xlabel('Qmax',fontsize=12)
            axarr[2].set_ylabel('Qmed',fontsize=12)
            axarr[2].grid(True)
            axarr[1].scatter(Matriz_sintetica['Qmax'], Matriz_sintetica['Duracion'], marker='o', c='b',s=15,cmap="jet")
            axarr[1].scatter(Qmax,d, marker='x', c='r', cmap="jet", alpha=0.75)
            axarr[1].set_xlabel('Qmax',fontsize=12)
            axarr[1].set_ylabel('Duration',fontsize=12)
            axarr[1].grid(True)
            axarr[0].grid(True)
            axarr[0].scatter(Matriz_sintetica['Qmed'], Matriz_sintetica['Duracion'], marker='o', c='b',s=15,cmap="jet",label='Synthetic events')
            axarr[0].scatter(Qmed,d, marker='x', c='r', cmap="jet", alpha=0.75, label='Selected events')
            axarr[0].set_xlabel('Qmed',fontsize=12)
            axarr[0].set_ylabel('Duration',fontsize=12)
            
            lines = []
            labels = []
            for i,ax in enumerate(fig.axes):
                axLine, axLabel = ax.get_legend_handles_labels()
                lines.extend(axLine)
                labels.extend(axLabel)
            fig.legend(lines, labels,           
                       loc = 8,ncol=3, prop={'size': 12})
            fig.tight_layout(pad=3.5)
        
    
    def generacion_hidrogramas_sinteticos(self):
        event_sint = self.seleccion_eventos_sinteticos()
        datos=pd.DataFrame(index=self.caudal.index)
        datos['Y']=self.caudal.values
        datos['X']=np.arange(0, len(self.caudal))
        
        Hidrogramas=pd.DataFrame()
        if self.plot == True:
            fig, ax=plt.subplots(np.int(self.n_tipos**(1/2)), np.int(self.n_tipos**(1/2)), figsize=(24, 24))
        new_posiciones=list()
        for j,jj in enumerate(self.centroides.Tipo_Hidro):
            maximo=np.max(self.Resultados_clasificacion[self.Resultados_clasificacion['Tipo_hidro']==jj]['Qmax'])
            posi=np.where(self.Resultados_clasificacion['Qmax']==maximo);
            posi_ale=posi[0]
            posi_ale=posi_ale[0]
            aux1=self.Resultados[self.Resultados.index==posi_ale]['Inicio_evento'].values
            aux2=self.Resultados[self.Resultados.index==posi_ale]['Fin_evento'].values
            Hidrogramas=datos[datos['X']>=aux1[0]]
            Hidrogramas=Hidrogramas[Hidrogramas['X']<=aux2[0]]
            Hidrogramas.index=range(0,len(Hidrogramas))
            Hidrogramas['X']=range(0,len(Hidrogramas))
            Qsintetico=list()
            tsintetico=list()
            Qmax=list()
            Duracion=list()
            Hidrograma_sintetico_tipo_=pd.DataFrame(index=np.linspace(0, len(Hidrogramas.Y)-1, len(Hidrogramas.Y)*24))
            time1=Hidrogramas['X']
            X2=Hidrogramas['Y']
            time2=np.linspace(Hidrogramas.X[0], Hidrogramas.X[len(Hidrogramas)-1], len(Hidrogramas)*24)
            Y2 = np.interp(time2, time1, X2)
            a=(((len(Y2)*self.centroides['Qmed'][j]*max(Y2)-self.centroides['Qmax'][j]*sum(Y2))/(((sum(Y2**2)))*max(Y2)-(max(Y2)**2)*sum(Y2)))) 
            b=((self.centroides['Qmax'][j]-a*max(Y2)**2)/(max(Y2)))
            Qmax.append(self.centroides['Qmax'][j])
            Duracion.append(self.centroides['Duracion'][j])
            b_i=((Qmax[0]-a*max(Y2)**2)/(max(Y2)))
            Qsintetico=(a*Y2**2+b_i*Y2)
            time_0=np.linspace(0, len(Hidrogramas.Y)-1, len(Hidrogramas.Y))
            time_0_1=np.linspace(0, len(Hidrogramas.Y)-1, len(Hidrogramas.Y)*24)

            col = jj % 5
            row = jj // 5
            x=time_0_1
            for e, ee in enumerate(Qsintetico):
                if Qsintetico[e]<0:
                        Qsintetico[e]=0
            yi=Qsintetico
            y=Y2
            Hidrograma_sintetico_tipo_.index=(time_0_1/(max(time_0))*(Duracion[0]))*24*3600
            Hidrograma_sintetico_tipo_['Q_m3/s']=Qsintetico
            xi=(time_0_1/(max(time_0))*(Duracion[0]))
            Hidrograma_sintetico_tipo_.to_csv(self.path_output + 'Hidrograma_'+str(j)+'.csv')
            
            if self.plot==True:
                ax[row, col].plot(xi,yi,'b-',alpha=0.4)
                ax[row, col].plot(x,y,'r-',alpha=0.4)
                
        #self.Matriz_sintetica.to_csv('../data/matriz_sintetica.csv') 
        self.centroides.to_csv(self.path_results+'evets_selected.csv')  
        
            
        return self.centroides, self.Matriz_sintetica


class recontruccion_manchas(object):
    
    def __init__(self,numero_de_centroides_cercanos,simulaciones_realizadas,Matriz_sintetica,centroides,landa,path_manchas_simul,path_output):
        self.numero_de_centroides_cercanos   = numero_de_centroides_cercanos
        self.simulaciones_realizadas         = simulaciones_realizadas
        self.Matriz_sintetica                = Matriz_sintetica
        self.path_manchas_simul              = path_manchas_simul
        self.centroides                      = centroides
        self.landa                           = landa
        self.path_output                     = path_output
        

            
    def generate_flood_T(self,fileMDT, data, file_name):
        mdt_file = gdal.Open(fileMDT, gdal.GA_ReadOnly)
        band1 = mdt_file.GetRasterBand(1)
        mdt = BandReadAsArray(band1)

        #Write the out file
        driver = gdal.GetDriverByName("GTiff")
        dsOut = driver.Create(self.path_output+file_name+'.tif'
                              , mdt_file.RasterXSize, mdt_file.RasterYSize, 1, band1.DataType)
        CopyDatasetInfo(mdt_file,dsOut)
        bandOut=dsOut.GetRasterBand(1)
        bandOut.Fill(0)
        bandOut.SetNoDataValue(0)
        BandWriteArray(bandOut,data)

        #Close the datasets
        band1 = None
        band2 = None
        mdt_file = None
        bandOut = None
        dsOut = None
            
    def statistic_recontru(self):
        ds = gdal.Open(self.path_manchas_simul + 'Simul_'+str(0) +'.tif')
        datos = np.array(ds.GetRasterBand(1).ReadAsArray()).astype("float")
        nrows = datos.shape[0]
        ncols = datos.shape[1]

        centroides_simulados=self.centroides[self.centroides.index<self.simulaciones_realizadas]
        posiciones=np.ones((len(self.Matriz_sintetica),self.numero_de_centroides_cercanos))
        distancias=np.ones((len(self.Matriz_sintetica),self.numero_de_centroides_cercanos))
        for i in range(len(self.Matriz_sintetica)):
                dist=((centroides_simulados['Qmax']-self.Matriz_sintetica['Qmax'][i])**2+
                      (centroides_simulados['Qmed']-self.Matriz_sintetica['Qmed'][i])**2+ 
                      (centroides_simulados['Duracion']-self.Matriz_sintetica['Duracion'][i])**2)**(1/2)

                posiciones[i,:] = np.argpartition(dist, self.numero_de_centroides_cercanos).values[:self.numero_de_centroides_cercanos]
                distancias[i,:] = sorted(dist)[:self.numero_de_centroides_cercanos]

        self.Calado_5=np.zeros((nrows,ncols),dtype='float')
        self.Calado_10=np.zeros((nrows,ncols),dtype='float')
        self.Calado_25=np.zeros((nrows,ncols),dtype='float')
        self.Calado_50=np.zeros((nrows,ncols),dtype='float')
        self.Calado_100=np.zeros((nrows,ncols),dtype='float')
        self.Calado_200=np.zeros((nrows,ncols),dtype='float')
        self.Calado_500=np.zeros((nrows,ncols),dtype='float')
        self.Calado_1000=np.zeros((nrows,ncols),dtype='float')

        nrows_b_2 = 0
        it = 0
        for row in tqdm.tqdm(range(20)):
            ncols_b_2 = 0
            for col in range(20):
                [nrows_b, ncols_b] = block_array(datos,20,20)[row,col].shape
                hiper_flood=np.ones((nrows_b,ncols_b,self.simulaciones_realizadas),dtype='float64')*np.nan
                for j in range(0,self.simulaciones_realizadas):
                    ds = gdal.Open(self.path_manchas_simul + 'Simul' +'_'+str(j) +'.tif')
                    datos = np.array(ds.GetRasterBand(1).ReadAsArray())
                    datos[datos==-9999] = 0
                    hiper_flood[:,:,j] = block_array(datos,20,20)[row,col]

                Events_sintetic = np.zeros((nrows_b,ncols_b,len(posiciones)),dtype='float64')
                for i, ii in enumerate(posiciones):
                    Events_sintetic[:,:,i] = (hiper_flood[:,:,posiciones[i,:].astype(int)]*distancias[i,:]/sum(distancias[i,:])).sum(axis=2)

                Events_sintetic.sort(axis=2)


                self.Calado_5[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/5/(self.landa)))-1]
                self.Calado_10[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/10/(self.landa)))-1]
                self.Calado_25[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/25/(self.landa)))-1]
                self.Calado_50[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/50/(self.landa)))-1]
                self.Calado_100[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/100/(self.landa)))-1]
                self.Calado_200[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/200/(self.landa)))-1]
                self.Calado_500[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/500/(self.landa)))-1]
                self.Calado_1000[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/1000/(self.landa)))-1]

                ncols_b_2  = ncols_b_2+ncols_b
            nrows_b_2 = nrows_b_2+nrows_b
        
    
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_5, 'Calado_T5.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_10, 'Calado_T10.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_25, 'Calado_T25.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_50, 'Calado_T50.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_100, 'Calado_T100.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_200, 'Calado_T200.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_500, 'Calado_T500.tif')
        self.generate_flood_T(self.path_manchas_simul + 'Simul' +'_'+str(0) +'.tif', self.Calado_1000, 'Calado_T1000.tif')


class recontruccion_manchas_CC(object):
    
    def __init__(self,numero_de_centroides_cercanos,simulaciones_realizadas_hist,simulaciones_realizadas_CC,Matriz_sintetica,centroides,landa,path_manchas_simul_hist,path_manchas_simul_CC,path_output):
        self.numero_de_centroides_cercanos   = numero_de_centroides_cercanos
        self.simulaciones_realizadas_hist    = simulaciones_realizadas_hist
        self.simulaciones_realizadas_CC      = simulaciones_realizadas_CC
        self.Matriz_sintetica                = Matriz_sintetica
        self.path_manchas_simul_hist         = path_manchas_simul_hist
        self.path_manchas_simul_CC           = path_manchas_simul_CC
        self.centroides                      = centroides
        self.landa                           = landa
        self.path_output                     = path_output
        

            
    def generate_flood_T(self,fileMDT, data, file_name):
        mdt_file = gdal.Open(fileMDT, gdal.GA_ReadOnly)
        band1 = mdt_file.GetRasterBand(1)
        mdt = BandReadAsArray(band1)

        #Write the out file
        driver = gdal.GetDriverByName("GTiff")
        dsOut = driver.Create(self.path_output+file_name+'.tif'
                              , mdt_file.RasterXSize, mdt_file.RasterYSize, 1, band1.DataType)
        CopyDatasetInfo(mdt_file,dsOut)
        bandOut=dsOut.GetRasterBand(1)
        bandOut.Fill(0)
        bandOut.SetNoDataValue(0)
        BandWriteArray(bandOut,data)

        #Close the datasets
        band1 = None
        band2 = None
        mdt_file = None
        bandOut = None
        dsOut = None
            
    def statistic_recontru(self):
        ds = gdal.Open(self.path_manchas_simul_hist + 'Simul_'+str(0) +'.tif')
        datos = np.array(ds.GetRasterBand(1).ReadAsArray()).astype("float")
        nrows = datos.shape[0]
        ncols = datos.shape[1]

        centroides_simulados=self.centroides[self.centroides.index<(self.simulaciones_realizadas_hist+self.simulaciones_realizadas_CC)]
        posiciones=np.ones((len(self.Matriz_sintetica),self.numero_de_centroides_cercanos))
        distancias=np.ones((len(self.Matriz_sintetica),self.numero_de_centroides_cercanos))
        for i in range(len(self.Matriz_sintetica)):
                dist=((centroides_simulados['Qmax']-self.Matriz_sintetica['Qmax'][i])**2+
                      (centroides_simulados['Qmed']-self.Matriz_sintetica['Qmed'][i])**2+ 
                      (centroides_simulados['Duracion']-self.Matriz_sintetica['Duracion'][i])**2)**(1/2)

                posiciones[i,:] = np.argpartition(dist, self.numero_de_centroides_cercanos).values[:self.numero_de_centroides_cercanos]
                distancias[i,:] = sorted(dist)[:self.numero_de_centroides_cercanos]

        self.Calado_5=np.zeros((nrows,ncols),dtype='float')
        self.Calado_10=np.zeros((nrows,ncols),dtype='float')
        self.Calado_25=np.zeros((nrows,ncols),dtype='float')
        self.Calado_50=np.zeros((nrows,ncols),dtype='float')
        self.Calado_100=np.zeros((nrows,ncols),dtype='float')
        self.Calado_200=np.zeros((nrows,ncols),dtype='float')
        self.Calado_500=np.zeros((nrows,ncols),dtype='float')
        self.Calado_1000=np.zeros((nrows,ncols),dtype='float')

        nrows_b_2 = 0
        it = 0
        for row in tqdm.tqdm(range(20)):
            ncols_b_2 = 0
            for col in range(20):
                [nrows_b, ncols_b] = block_array(datos,20,20)[row,col].shape
                hiper_flood=np.ones((nrows_b,ncols_b,self.simulaciones_realizadas_hist+self.simulaciones_realizadas_CC),dtype='float64')*np.nan
                for j in range(0,self.simulaciones_realizadas_hist):
                    ds = gdal.Open(self.path_manchas_simul_hist + 'Simul' +'_'+str(j) +'.tif')
                    datos = np.array(ds.GetRasterBand(1).ReadAsArray())
                    datos[datos==-9999] = 0
                    hiper_flood[:,:,j] = block_array(datos,20,20)[row,col]
                    
                for k in range(0,self.simulaciones_realizadas_CC):
                    ds = gdal.Open(self.path_manchas_simul_CC + 'Simul' +'_'+str(k) +'.tif')
                    datos = np.array(ds.GetRasterBand(1).ReadAsArray())
                    datos[datos==-9999] = 0
                    hiper_flood[:,:,j+k] = block_array(datos,20,20)[row,col]

                Events_sintetic = np.zeros((nrows_b,ncols_b,len(posiciones)),dtype='float64')
                for i, ii in enumerate(posiciones):
                    Events_sintetic[:,:,i] = (hiper_flood[:,:,posiciones[i,:].astype(int)]*distancias[i,:]/sum(distancias[i,:])).sum(axis=2)

                Events_sintetic.sort(axis=2)


                self.Calado_5[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/5/(self.landa)))-1]
                self.Calado_10[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/10/(self.landa)))-1]
                self.Calado_25[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/25/(self.landa)))-1]
                self.Calado_50[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/50/(self.landa)))-1]
                self.Calado_100[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/100/(self.landa)))-1]
                self.Calado_200[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/200/(self.landa)))-1]
                self.Calado_500[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/500/(self.landa)))-1]
                self.Calado_1000[nrows_b_2:nrows_b_2+nrows_b,ncols_b_2:ncols_b_2+ncols_b] = Events_sintetic[:,:,round(Events_sintetic.shape[2]*(1-1/1000/(self.landa)))-1]

                ncols_b_2  = ncols_b_2+ncols_b
            nrows_b_2 = nrows_b_2+nrows_b
        
    
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_5, 'Calado_T5.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_10, 'Calado_T10.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_25, 'Calado_T25.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_50, 'Calado_T50.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_100, 'Calado_T100.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_200, 'Calado_T200.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_500, 'Calado_T500.tif')
        self.generate_flood_T(self.path_manchas_simul_CC + 'Simul' +'_'+str(0) +'.tif', self.Calado_1000, 'Calado_T1000.tif')




