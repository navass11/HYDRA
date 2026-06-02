# Copulas — Modelos de Dependencia Multivariante

Lo que tengo es el uso de la librería openturns que sustituía lo que hacía con matlab.

## Contenido: `HybridDownscalling.ipynb`

Notebook que aplica un flujo completo de generación de eventos sintéticos de caudal mediante cópulas, y reconstruye manchas de inundación para distintos períodos de retorno. Usa las funciones de `flood_methodology` (ver `Time_Series_Analysis/Discretization/`).

---

### Flujo de trabajo

#### 1. Ajuste de distribuciones marginales con `openturns`

Para cada característica de los eventos reales (Qmax, Qmed, Duración, Tipo de hidrograma) se selecciona automáticamente la mejor distribución por BIC:

```python
tested_factories = ot.DistributionFactory.GetContinuousUniVariateFactories()
Fqmax, best_bic = ot.FittingTest.BestModelBIC(sample1, tested_factories)
```

#### 2. Cómputo de probabilidades uniformes

Se transforma cada muestra al espacio uniforme [0,1] evaluando su CDF marginal:
```python
Pqmax = Fqmax.computeCDF(sample1)
Pqmed = Fqmed.computeCDF(sample2)
Pdur  = Fdur.computeCDF(sample3)
Ptipo = Ftipo.computeCDF(sample4)
Prob  = np.vstack((Pqmax, Pqmed, Pdur, Ptipo)).reshape(4,-1).T
```

#### 3. Ajuste de la cópula Normal multivariante

```python
dist = ot.NormalCopulaFactory().build(Prob)
eventos_sint_prob = np.array(dist.getSample(n_events))
```

La cópula Normal captura la estructura de dependencia entre las cuatro variables. Se generan tantos eventos sintéticos como sea necesario.

#### 4. Transformación inversa a espacio físico

```python
qmax_sint = Fqmax.computeQuantile(eventos_sint_prob[:,0])
qmed_sint = Fqmed.computeQuantile(eventos_sint_prob[:,1])
dur_sint  = Fdur.computeQuantile(eventos_sint_prob[:,2])
tipo_sint = Ftipo.computeQuantile(eventos_sint_prob[:,3])
```

---

### Cambio climático

Para cada escenario RCP (rcp45, rcp85) y período futuro (2011–2040, 2041–2070, 2071–2100) se repite el flujo usando las series de caudal corregidas por sesgo de cada modelo climático.

---

### Reconstrucción de manchas de inundación por período de retorno

A partir de los eventos sintéticos clasificados y reconstruidos (ver `Discretization/`), se calculan las manchas de inundación para T = 2, 5, 10, 25, 50, 100, 200, 500 años mediante interpolación ponderada de los calados simulados por el modelo hidráulico, tanto en período histórico como en cambio climático.

---

## Relación con otros módulos

- La separación de eventos, clasificación PCA, K-means y generación copula ya están implementados en `Funciones_Metodologia.py` del módulo `Discretization/` (librería `flood_methodology`).
- La CDF de cópulas vine 5D tiene su emulador GP en `Interpolation/Gaussian Processes.ipynb`.

---

## Dependencias

```
openturns
numpy
pandas
matplotlib
flood_methodology (Funciones_Metodologia.py)
```
