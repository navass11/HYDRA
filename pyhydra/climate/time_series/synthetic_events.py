"""
Synthetic flood event generation and hydrograph reconstruction.

Workflow
--------
1. ``generacion_eventos_sinteticos``
   Extract events from a discharge series (inflection-point method), reduce
   dimensionality with PCA, classify shapes with K-means, and sample a
   synthetic ensemble via a Gaussian copula (requires openturns).

2. ``reconstruccion_eventos_sinteticos``
   Select the most-dissimilar representative events (MaxDiss algorithm) and
   reconstruct scaled synthetic hydrographs for each centroid.

Flood map reconstruction from hydraulic simulations lives in
``pyhydra.climate.hybrid_downscaling.interpolation``.
"""

import math
from itertools import permutations

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy.stats as st
import tqdm
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import pairwise_distances


# ---------------------------------------------------------------------------
# Spatial neighbour helpers
# ---------------------------------------------------------------------------

def _d4(i, j):
    return [(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)]


def _d8(i, j):
    return [
        (i - 1, j - 1), (i, j - 1), (i + 1, j - 1),
        (i - 1, j),                  (i + 1, j),
        (i - 1, j + 1), (i, j + 1), (i + 1, j + 1),
    ]


class sweepMatrixNeighbors:
    def __init__(self, N, M, neighbors="D4"):
        self.n = N
        self.m = M
        self.f = _d4 if neighbors == "D4" else _d8 if neighbors == "D8" else None
        if self.f is None:
            raise ValueError(f"Unknown neighbor method: {neighbors}")

    def __call__(self, i, j):
        return [(ii, jj) for ii, jj in self.f(i, j) if 0 <= ii < self.n and 0 <= jj < self.m]


# ---------------------------------------------------------------------------
# Distance / permutation utilities
# ---------------------------------------------------------------------------

def _combined_distance(mapas):
    return np.sqrt(
        pairwise_distances(mapas, metric="correlation") ** 2
        + pairwise_distances(mapas, metric="euclidean") ** 2
    )


def compute_mindist_permutation(n, m, mapas, method="D8"):
    """Exhaustive minimum-distance permutation (only feasible for small n*m)."""
    best_dist = np.inf
    best_iter = []
    visitor = sweepMatrixNeighbors(n, m, neighbors=method)
    dist_mat = _combined_distance(mapas)

    for permu in permutations(np.arange(m * n)):
        D = 0
        for idx in range(n * m):
            jj, ii = idx % m, idx // m
            for nn in visitor(ii, jj):
                D += dist_mat[permu[idx], permu[nn[0] * m + nn[1]]]
        if D < best_dist:
            best_dist = D
            best_iter = list(permu)
    return best_iter


def compute_mindist_permutation_random(n, m, mapas, iters=100_000, method="D8", best=None):
    """Randomised minimum-distance permutation search."""
    visitor = sweepMatrixNeighbors(n, m, neighbors=method)
    dist_mat = _combined_distance(mapas)

    if best is None:
        best_dist = np.inf
        best_iter = []
    else:
        best_iter = best
        best_dist = 0.0
        for idx in range(n * m):
            jj, ii = idx % m, idx // m
            for nn in visitor(ii, jj):
                best_dist += dist_mat[best[idx], best[nn[0] * m + nn[1]]]

    for _ in range(iters):
        permu = np.random.permutation(n * m)
        D = 0
        for idx in range(n * m):
            jj, ii = idx % m, idx // m
            for nn in visitor(ii, jj):
                D += dist_mat[permu[idx], permu[nn[0] * m + nn[1]]]
        if D < best_dist:
            best_dist = D
            best_iter = list(permu)
    return best_iter


def _distancia(datos, s, k, aux_d2):
    """Distance from sample s to all points, mixing scalar and directional components."""
    dis = datos[s, :] - datos[:]
    disci_1 = np.absolute(dis[:, k:])
    disci_2 = aux_d2 - disci_1
    dis[:, k:] = np.minimum(disci_1, disci_2) / math.pi
    return np.sum(dis ** 2, axis=1)


def _nearest_cluster(c, xx_2, k, aux_d2):
    dis = xx_2 - c
    disci_1 = np.absolute(dis[:, k:])
    disci_2 = aux_d2 - disci_1
    dis[:, k:] = np.minimum(disci_1, disci_2) / math.pi
    return np.sum(dis ** 2, axis=1).argmin()


# ---------------------------------------------------------------------------
# MaxDiss algorithm
# ---------------------------------------------------------------------------

def _block_array(data, ncols, nrows):
    arr = []
    for i in np.array_split(data, ncols):
        for j in np.array_split(i, nrows, axis=1):
            arr.append(j)
    return np.array(arr).reshape((nrows, ncols))


def MaxDiss(datos, num, scalar, pos_Qmax_tipo):
    """
    MaxDiss subset-selection algorithm (MaxMin initialisation, max dissimilarity iteration).

    Args:
        datos: Input data matrix (n_samples × n_features)
        num: Number of representative cases to select
        scalar: List of column indices treated as scalar features
        pos_Qmax_tipo: Predefined seed positions for the first n_tipos iterations

    Returns:
        (subset, selected_positions): selected rows and their indices in datos
    """
    print("Solving MaxDiss ...")

    nx, ny = datos.shape
    k = len(scalar)
    aux_d2 = 2 * math.pi * np.ones((nx, ny - k))

    semilla = np.argmax(datos[:, 0])
    subset = np.zeros((num, ny))
    subset[0, :] = datos[semilla, :]
    selc_pos = [semilla]

    Dis_ultima = _distancia(datos, semilla, k, aux_d2)
    pos_max = Dis_ultima.argmax()
    subset[1, :] = datos[pos_max, :]
    Dis_ultima[pos_max] = 0.0
    Dis_ultima[semilla] = 0.0
    selc_pos.append(pos_max)

    for n_centros in range(2, num):
        if n_centros < 27:
            selc_pos.append(pos_Qmax_tipo[n_centros - 2])
        else:
            Dis_anterior = _distancia(datos, pos_max, k, aux_d2)
            Dis_ultima = np.minimum(Dis_anterior, Dis_ultima)
            pos_max = Dis_ultima.argmax()
            subset[n_centros, :] = datos[pos_max, :]
            Dis_ultima[pos_max] = 0.0
            selc_pos.append(pos_max)

    print("Done.")
    return subset, selc_pos


# ---------------------------------------------------------------------------
# Main classes
# ---------------------------------------------------------------------------

class generacion_eventos_sinteticos:
    """
    Identify, classify, and generate synthetic flood events from a discharge series.

    Workflow: event extraction → PCA reduction → K-means clustering → copula sampling.
    """

    def __init__(self, caudal, umbral, umbral2, n_tipos, path_results, path_script_matlab, plot):
        self.caudal = caudal
        self.umbral = umbral
        self.umbral2 = umbral2
        self.n_tipos = n_tipos
        self.path_results = path_results
        self.path_script_matlab = path_script_matlab
        self.plot = plot

    def eventos_caudal(self):
        datos = pd.DataFrame({"Y": self.caudal.values, "X": np.arange(len(self.caudal))},
                             index=self.caudal.index)

        pendiente = []
        for i in range(len(datos) - 1):
            y1, y2 = datos["Y"].iloc[i], datos["Y"].iloc[i + 1]
            m = y2 - y1
            pendiente.append(m)

        pp = np.array(pendiente)
        pp[pp >= 0] = 1
        pp[pp < 0] = -1
        diff_pp = np.diff(pp)

        time = datos.index[1:len(diff_pp) + 1]
        datf = pd.DataFrame({"Punt_inflex": diff_pp, "X": datos["X"].values[1:len(diff_pp) + 1],
                             "Y": datos["Y"].values[1:len(diff_pp) + 1]}, index=time)

        x_inicial, y_inicial, x_final, y_final = [], [], [], []
        for i in range(len(datos) - 1):
            y1, y2 = datos["Y"].iloc[i], datos["Y"].iloc[i + 1]
            x1, x2 = datos["X"].iloc[i], datos["X"].iloc[i + 1]
            m = y2 - y1
            if m > 0 and y1 <= self.umbral and y2 > self.umbral:
                x_inicial.append(x1); y_inicial.append(y1)
            if m < 0 and y1 >= self.umbral and y2 < self.umbral:
                x_final.append(x2); y_final.append(y2)

        x_final_2, y_final_2 = [], []
        x_final_arr = np.array(x_final)
        for xi in x_inicial:
            aux = xi - x_final_arr
            aux[aux >= 0] = -1000
            idx = np.argmax(aux)
            x_final_2.append(x_final_arr[idx])
            y_final_2.append(y_final[idx])
        x_final, y_final = x_final_2, y_final_2

        datf_1 = datf[datf["Punt_inflex"] == 2]
        p1_x, p1_y, p1_time = [], [], []
        p2_x, p2_y, p2_time = [], [], []

        for xi in x_inicial:
            resta = xi - datf_1["X"]
            resta[resta < 0] = 1000
            posi = resta.index[np.argmin(resta)]
            p1_x.append(datos.loc[posi, "X"]); p1_y.append(datos.loc[posi, "Y"]); p1_time.append(posi)

        for i, xf in enumerate(x_final):
            resta = -datf_1["X"] + xf
            resta[resta > 0] = -1000
            if (resta.values == -1000).all():
                p1_x.pop(); p1_y.pop(); p1_time.pop()
            else:
                posi = resta.index[np.argmax(resta)]
                p2_x.append(datos.loc[posi, "X"]); p2_y.append(datos.loc[posi, "Y"]); p2_time.append(posi)

        date_p1 = pd.DataFrame({"X": p1_x, "Y": p1_y}, index=p1_time)
        date_p2 = pd.DataFrame({"X": p2_x, "Y": p2_y}, index=p2_time)
        date_p2 = date_p2[date_p2["Y"] < self.umbral]

        Resultados = pd.DataFrame({"Inicio_evento": p1_x, "Fin_evento": p2_x})
        Q_max, Q_med, Duracion, ini, fin = [], [], [], [], []

        for i in range(len(Resultados)):
            sub = datos[(datos["X"] >= Resultados["Inicio_evento"][i]) &
                        (datos["X"] <= Resultados["Fin_evento"][i])]
            if sub["Y"].max() >= self.umbral2:
                Q_max.append(sub["Y"].max())
                Q_med.append(sub["Y"].mean())
                Duracion.append(Resultados["Fin_evento"][i] - Resultados["Inicio_evento"][i])
                ini.append(Resultados["Inicio_evento"][i])
                fin.append(Resultados["Fin_evento"][i])

        Resultados = pd.DataFrame({"Inicio_evento": ini, "Fin_evento": fin})
        Resultados_clasificacion = pd.DataFrame({"Qmax": Q_max, "Qmed": Q_med, "Duracion": Duracion})

        if self.plot:
            pos_max = np.argmax(Q_max)
            fig, ax = plt.subplots(figsize=(15, 8))
            plt.plot(datos["X"], datos["Y"], "--k", linewidth=2.5, label="Caudales")
            plt.plot(date_p1["X"], date_p1["Y"], ".r", markersize=20, label="Punto Inicial")
            plt.plot(date_p2["X"], date_p2["Y"], ".b", markersize=20, label="Punto final")
            plt.axhline(self.umbral, linestyle="--", linewidth=2.5, label="Umbral")
            plt.xlim(Resultados["Inicio_evento"][pos_max] - 30, Resultados["Fin_evento"][pos_max] + 30)
            plt.ylim(0, max(Q_max))
            plt.ylabel("Q (m³/s)", fontsize=20); plt.xlabel("T (días)", fontsize=20)
            plt.grid(True); plt.tick_params(labelsize=20); plt.legend(fontsize=20)

        return Resultados_clasificacion, Resultados

    def clacificacion_PCA(self):
        datos = pd.DataFrame({"Y": self.caudal.values, "X": np.arange(len(self.caudal))},
                             index=self.caudal.index)
        Resultados_clasificacion, Resultados = self.eventos_caudal()
        self.Resultados_clasificacion_0 = Resultados_clasificacion
        self.Resultados_0 = Resultados

        numero_puntos = 100
        M = np.zeros((len(Resultados), numero_puntos))
        clasificacion = pd.DataFrame(M)

        for n in range(len(Resultados)):
            x1, x2 = Resultados["Inicio_evento"][n], Resultados["Fin_evento"][n]
            hidro = datos[(datos["X"] >= x1) & (datos["X"] <= x2)].copy()
            hidro.index = np.arange(len(hidro))
            t1 = np.linspace(0, 1, len(hidro))
            t2 = np.linspace(0, 1, numero_puntos)
            X2 = hidro["Y"].values / hidro["Y"].max()
            clasificacion.iloc[n] = np.interp(t2, t1, X2)

        eof = PCA(n_components=0.95)
        eof.fit(clasificacion)
        return eof.transform(clasificacion)

    def K_means(self):
        ddatos = self.clacificacion_PCA()
        Resultados_clasificacion = self.Resultados_clasificacion_0
        NK = MK = int(self.n_tipos ** 0.5)
        km = KMeans(n_clusters=NK * MK)
        km.fit(ddatos)

        bI = compute_mindist_permutation_random(NK, MK, km.cluster_centers_, method="D8", iters=200_000)
        Tipos_bmus = km.predict(ddatos)
        Resultados_clasificacion["Tipo_hidro"] = Tipos_bmus
        return Resultados_clasificacion

    def run_copulas(self):
        import openturns as ot

        Resultados_clasificacion = self.K_means()
        Tipos_bmus = Resultados_clasificacion["Tipo_hidro"].values

        prob = [
            len(np.where(Tipos_bmus == i)[0]) / len(Tipos_bmus)
            for i in range(self.n_tipos)
        ]
        Probabilidad = pd.DataFrame({"P": prob, "Tipo_Bmus": np.arange(self.n_tipos)})
        rv = st.rv_discrete(values=(np.arange(self.n_tipos), np.array(prob)))
        Resultados_clasificacion["Prob_CDF"] = rv.cdf(Tipos_bmus)

        def _best_fit(data):
            sample = ot.Sample([[v] for v in data])
            factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
            dist, _ = ot.FittingTest.BestModelBIC(sample, factories)
            print(f"Best fit: {dist}")
            return dist, sample

        Fqmax, s1 = _best_fit(Resultados_clasificacion["Qmax"])
        Fqmed, s2 = _best_fit(Resultados_clasificacion["Qmed"])
        Fdur, s3 = _best_fit(Resultados_clasificacion["Duracion"])

        s4 = ot.Sample([[v] for v in Resultados_clasificacion["Tipo_hidro"]])
        Ftipo = ot.UserDefinedFactory().build(s4)

        Prob = np.vstack([
            Fqmax.computeCDF(s1), Fqmed.computeCDF(s2),
            Fdur.computeCDF(s3), Ftipo.computeCDF(s4),
        ]).reshape(4, -1).T

        dist = ot.NormalCopulaFactory().build(Prob)
        eventos_sint_prob = np.array(dist.getSample(4943))

        Matriz_sintetica = pd.DataFrame({
            "Qmax": np.array(Fqmax.computeQuantile(eventos_sint_prob[:, 0])).flatten(),
            "Qmed": np.array(Fqmed.computeQuantile(eventos_sint_prob[:, 1])).flatten(),
            "Duracion": np.array(Fdur.computeQuantile(eventos_sint_prob[:, 2])).flatten(),
            "Tipo_Hidro": np.array(Ftipo.computeQuantile(eventos_sint_prob[:, 3])).flatten(),
        })

        if self.plot:
            self._plot_copula_fit(Fqmax, Fqmed, Fdur, s1, s2, s3, Matriz_sintetica, Resultados_clasificacion)

        Matriz_sintetica.to_csv(self.path_results + "matriz_sintetica.csv")
        return Matriz_sintetica, Resultados_clasificacion, self.Resultados_0

    def _plot_copula_fit(self, Fqmax, Fqmed, Fdur, s1, s2, s3, Msintetica, Rclasif):
        import openturns as ot
        import openturns.viewer as otv

        for F, sample, xlabel in [(Fqmax, s1, "Qmax"), (Fqmed, s2, "Qmed"), (Fdur, s3, "Duration")]:
            g = ot.UserDefined(sample).drawCDF()
            cdf = F.drawCDF(); cdf.setColors(["blue"])
            g.add(cdf); g.setTitle("Best BIC fit"); g.setXTitle(xlabel)
            g.setLegends(["ECDF", F.getName()]); otv.View(g)

        fig, axarr = plt.subplots(1, 3, figsize=(15, 5))
        for ax, (xc, yc, xl, yl) in zip(axarr, [
            ("Qmax", "Qmed", "Qmax", "Qmed"),
            ("Qmax", "Duracion", "Qmax", "Duration"),
            ("Qmed", "Duracion", "Qmed", "Duration"),
        ]):
            ax.scatter(Msintetica[xc], Msintetica[yc], marker="o", label="Synthetic")
            ax.scatter(Rclasif[xc], Rclasif[yc], marker="o", color="orange", label="Real")
            ax.set_xlabel(xl, fontsize=12); ax.set_ylabel(yl, fontsize=12); ax.grid(True)
        handles, labels = axarr[0].get_legend_handles_labels()
        fig.legend(handles, labels, loc=8, ncol=2, prop={"size": 12})
        fig.tight_layout(pad=3.5)


class reconstruccion_eventos_sinteticos:
    """Select representative synthetic events and build scaled hydrographs."""

    def __init__(self, caudal, Matriz_sintetica, n_tipos, Resultados_clasificacion,
                 Resultados, path_results, path_output, plot):
        self.caudal = caudal
        self.Matriz_sintetica = Matriz_sintetica
        self.n_tipos = n_tipos
        self.path_output = path_output
        self.path_results = path_results
        self.Resultados_clasificacion = Resultados_clasificacion
        self.Resultados = Resultados
        self.plot = plot

    def seleccion_eventos_sinteticos(self):
        Matriz = self.Matriz_sintetica.copy()

        cols = ["Qmax", "Qmed", "Duracion"]
        norm = (Matriz[cols] - Matriz[cols].mean()) / Matriz[cols].std()

        posi_max_tipo, Qmax_Tipo = [], []
        for t in range(self.n_tipos):
            Q = Matriz[Matriz["Tipo_Hidro"] == t]["Qmax"].max()
            Qmax_Tipo.append(Q)
            posi_max_tipo.append(np.where(Matriz["Qmax"] == Q)[0][0])

        NK = MK = 20
        scalar = np.arange(norm.shape[1])
        classif = MaxDiss(norm.values, NK * MK, scalar, posi_max_tipo)
        Mklus = classif[0]

        centroides_N = pd.DataFrame(Mklus, columns=cols)
        centroides = pd.DataFrame(index=np.arange(len(Mklus) + self.n_tipos), columns=cols + ["Tipo_Hidro"])

        denorm = centroides_N * Matriz[cols].std().values + Matriz[cols].mean().values
        centroides.loc[self.n_tipos:, cols] = denorm.values

        for k in range(self.n_tipos):
            centroides.loc[k, "Qmax"] = Matriz.loc[posi_max_tipo[k], "Qmax"]
            centroides.loc[k, "Qmed"] = Matriz.loc[posi_max_tipo[k], "Qmed"]
            centroides.loc[k, "Duracion"] = Matriz.loc[posi_max_tipo[k], "Duracion"]

        Tipos_Bmus = []
        for i in range(len(norm)):
            dist = ((centroides_N["Qmax"] - norm["Qmax"].iloc[i]) ** 2 +
                    (centroides_N["Qmed"] - norm["Qmed"].iloc[i]) ** 2 +
                    (centroides_N["Duracion"] - norm["Duracion"].iloc[i]) ** 2) ** 0.5
            Tipos_Bmus.append(np.argmin(dist))
        Matriz["Tipos_bmus"] = Tipos_Bmus

        centroides["Tipo_Hidro"] = 0
        for x, xx in enumerate(classif[1]):
            centroides.loc[x + self.n_tipos, "Tipo_Hidro"] = Matriz.loc[xx, "Tipo_Hidro"]
        centroides.loc[:self.n_tipos - 1, "Tipo_Hidro"] = np.arange(self.n_tipos)

        self.Matriz_sintetica = Matriz
        self.centroides = centroides

    def generacion_hidrogramas_sinteticos(self):
        self.seleccion_eventos_sinteticos()
        datos = pd.DataFrame({"Y": self.caudal.values, "X": np.arange(len(self.caudal))},
                             index=self.caudal.index)

        if self.plot:
            side = int(self.n_tipos ** 0.5)
            fig, ax = plt.subplots(side, side, figsize=(24, 24))

        for j, tipo in enumerate(self.centroides["Tipo_Hidro"]):
            maximo = self.Resultados_clasificacion[
                self.Resultados_clasificacion["Tipo_hidro"] == tipo
            ]["Qmax"].max()
            posi = np.where(self.Resultados_clasificacion["Qmax"] == maximo)[0][0]
            x1 = self.Resultados.loc[posi, "Inicio_evento"]
            x2 = self.Resultados.loc[posi, "Fin_evento"]

            hidro = datos[(datos["X"] >= x1) & (datos["X"] <= x2)].copy()
            hidro.index = range(len(hidro))
            hidro["X"] = range(len(hidro))

            Qmax_j = float(self.centroides.loc[j, "Qmax"])
            Qmed_j = float(self.centroides.loc[j, "Qmed"])
            Dur_j = float(self.centroides.loc[j, "Duracion"])

            t1 = hidro["X"].values
            Y2 = hidro["Y"].values
            t2 = np.linspace(t1[0], t1[-1], len(t1) * 24)
            Y2_interp = np.interp(t2, t1, Y2)

            a = (len(Y2_interp) * Qmed_j * Y2_interp.max() - Qmax_j * Y2_interp.sum()) / (
                Y2_interp.sum() ** 2 * Y2_interp.max() - Y2_interp.max() ** 2 * Y2_interp.sum()
            ) if (Y2_interp.sum() ** 2 * Y2_interp.max() - Y2_interp.max() ** 2 * Y2_interp.sum()) != 0 else 0
            b = (Qmax_j - a * Y2_interp.max() ** 2) / Y2_interp.max()

            Qsintetico = np.maximum(a * Y2_interp ** 2 + b * Y2_interp, 0)
            xi = t2 / t2.max() * Dur_j

            out = pd.DataFrame({"Q_m3/s": Qsintetico}, index=xi * 24 * 3600)
            out.to_csv(self.path_output + f"Hidrograma_{j}.csv")

            if self.plot:
                row, col = int(tipo) // int(self.n_tipos ** 0.5), int(tipo) % int(self.n_tipos ** 0.5)
                ax[row, col].plot(xi, Qsintetico, "b-", alpha=0.4)
                ax[row, col].plot(t2, Y2_interp, "r-", alpha=0.4)

        self.centroides.to_csv(self.path_results + "evets_selected.csv")
        return self.centroides, self.Matriz_sintetica


class recontruccion_manchas:
    """
    .. deprecated::
        Use ``pyhydra.climate.hybrid_downscaling.FloodMapInterpolator`` instead.

    Statistical flood map reconstruction from hydraulic simulation results.
    Kept for backward compatibility.
    """

    def __init__(self, numero_de_centroides_cercanos, simulaciones_realizadas,
                 Matriz_sintetica, centroides, landa, path_manchas_simul, path_output):
        self.k_near = numero_de_centroides_cercanos
        self.n_sim = simulaciones_realizadas
        self.Matriz_sintetica = Matriz_sintetica
        self.centroides = centroides
        self.landa = landa
        self.path_sim = path_manchas_simul
        self.path_output = path_output

    def generate_flood_T(self, fileMDT, data, file_name):
        from osgeo import gdal
        from osgeo.gdalnumeric import BandReadAsArray, BandWriteArray, CopyDatasetInfo

        mdt_file = gdal.Open(fileMDT, gdal.GA_ReadOnly)
        band1 = mdt_file.GetRasterBand(1)
        driver = gdal.GetDriverByName("GTiff")
        dsOut = driver.Create(
            self.path_output + file_name + ".tif",
            mdt_file.RasterXSize, mdt_file.RasterYSize, 1, band1.DataType,
        )
        CopyDatasetInfo(mdt_file, dsOut)
        bandOut = dsOut.GetRasterBand(1)
        bandOut.Fill(0); bandOut.SetNoDataValue(0)
        BandWriteArray(bandOut, data)

    def statistic_recontru(self):
        from osgeo import gdal

        def _open(path):
            ds = gdal.Open(path)
            arr = np.array(ds.GetRasterBand(1).ReadAsArray()).astype("float")
            arr[arr == -9999] = 0
            return arr

        ref = _open(self.path_sim + "Simul_0.tif")
        nrows, ncols = ref.shape

        centroides_sim = self.centroides[self.centroides.index < self.n_sim]
        posiciones = np.ones((len(self.Matriz_sintetica), self.k_near))
        distancias = np.ones((len(self.Matriz_sintetica), self.k_near))

        for i in range(len(self.Matriz_sintetica)):
            dist = (
                (centroides_sim["Qmax"] - self.Matriz_sintetica["Qmax"][i]) ** 2 +
                (centroides_sim["Qmed"] - self.Matriz_sintetica["Qmed"][i]) ** 2 +
                (centroides_sim["Duracion"] - self.Matriz_sintetica["Duracion"][i]) ** 2
            ) ** 0.5
            posiciones[i, :] = np.argpartition(dist, self.k_near).values[:self.k_near]
            distancias[i, :] = sorted(dist)[:self.k_near]

        return_periods = [5, 10, 25, 50, 100, 200, 500, 1000]
        calados = {T: np.zeros((nrows, ncols), dtype="float") for T in return_periods}

        nr2 = 0
        for row in tqdm.tqdm(range(20)):
            nc2 = 0
            for col in range(20):
                block_ref = _block_array(ref, 20, 20)[row, col]
                nb_r, nb_c = block_ref.shape
                hiper = np.full((nb_r, nb_c, self.n_sim), np.nan)
                for j in range(self.n_sim):
                    hiper[:, :, j] = _block_array(_open(self.path_sim + f"Simul_{j}.tif"), 20, 20)[row, col]

                events = np.zeros((nb_r, nb_c, len(posiciones)))
                for i, ii in enumerate(posiciones):
                    w = distancias[i, :] / distancias[i, :].sum()
                    events[:, :, i] = (hiper[:, :, ii.astype(int)] * w).sum(axis=2)
                events.sort(axis=2)

                for T in return_periods:
                    idx = round(events.shape[2] * (1 - 1 / T / self.landa)) - 1
                    calados[T][nr2:nr2 + nb_r, nc2:nc2 + nb_c] = events[:, :, idx]
                nc2 += nb_c
            nr2 += nb_r

        template = self.path_sim + "Simul_0.tif"
        for T in return_periods:
            self.generate_flood_T(template, calados[T], f"Calado_T{T}")


class recontruccion_manchas_CC(recontruccion_manchas):
    """
    Flood map reconstruction combining historical and climate-change simulations.

    Extends recontruccion_manchas to merge two sets of hydraulic simulations
    (historical + CC) when computing return-period flood maps.
    """

    def __init__(self, numero_de_centroides_cercanos, simulaciones_realizadas_hist,
                 simulaciones_realizadas_CC, Matriz_sintetica, centroides, landa,
                 path_manchas_simul_hist, path_manchas_simul_CC, path_output):
        self.k_near = numero_de_centroides_cercanos
        self.n_sim_hist = simulaciones_realizadas_hist
        self.n_sim_cc = simulaciones_realizadas_CC
        self.Matriz_sintetica = Matriz_sintetica
        self.centroides = centroides
        self.landa = landa
        self.path_hist = path_manchas_simul_hist
        self.path_cc = path_manchas_simul_CC
        self.path_output = path_output
        self.path_sim = path_manchas_simul_CC  # for generate_flood_T template
        self.n_sim = simulaciones_realizadas_hist + simulaciones_realizadas_CC

    def statistic_recontru(self):
        from osgeo import gdal

        def _open(path):
            ds = gdal.Open(path)
            arr = np.array(ds.GetRasterBand(1).ReadAsArray()).astype("float")
            arr[arr == -9999] = 0
            return arr

        ref = _open(self.path_hist + "Simul_0.tif")
        nrows, ncols = ref.shape

        centroides_sim = self.centroides[self.centroides.index < self.n_sim]
        posiciones = np.ones((len(self.Matriz_sintetica), self.k_near))
        distancias = np.ones((len(self.Matriz_sintetica), self.k_near))

        for i in range(len(self.Matriz_sintetica)):
            dist = (
                (centroides_sim["Qmax"] - self.Matriz_sintetica["Qmax"][i]) ** 2 +
                (centroides_sim["Qmed"] - self.Matriz_sintetica["Qmed"][i]) ** 2 +
                (centroides_sim["Duracion"] - self.Matriz_sintetica["Duracion"][i]) ** 2
            ) ** 0.5
            posiciones[i, :] = np.argpartition(dist, self.k_near).values[:self.k_near]
            distancias[i, :] = sorted(dist)[:self.k_near]

        return_periods = [5, 10, 25, 50, 100, 200, 500, 1000]
        calados = {T: np.zeros((nrows, ncols), dtype="float") for T in return_periods}

        nr2 = 0
        for row in tqdm.tqdm(range(20)):
            nc2 = 0
            for col in range(20):
                nb_r, nb_c = _block_array(ref, 20, 20)[row, col].shape
                total = self.n_sim_hist + self.n_sim_cc
                hiper = np.full((nb_r, nb_c, total), np.nan)

                for j in range(self.n_sim_hist):
                    hiper[:, :, j] = _block_array(_open(self.path_hist + f"Simul_{j}.tif"), 20, 20)[row, col]
                for k in range(self.n_sim_cc):
                    hiper[:, :, self.n_sim_hist + k] = _block_array(
                        _open(self.path_cc + f"Simul_{k}.tif"), 20, 20
                    )[row, col]

                events = np.zeros((nb_r, nb_c, len(posiciones)))
                for i, ii in enumerate(posiciones):
                    w = distancias[i, :] / distancias[i, :].sum()
                    events[:, :, i] = (hiper[:, :, ii.astype(int)] * w).sum(axis=2)
                events.sort(axis=2)

                for T in return_periods:
                    idx = round(events.shape[2] * (1 - 1 / T / self.landa)) - 1
                    calados[T][nr2:nr2 + nb_r, nc2:nc2 + nb_c] = events[:, :, idx]
                nc2 += nb_c
            nr2 += nb_r

        template = self.path_cc + "Simul_0.tif"
        for T in return_periods:
            self.generate_flood_T(template, calados[T], f"Calado_T{T}")
