"""
Author: Salvador Navas
Date: 2025-06-27
"""

import pandas as pd
import numpy as np
def delta_method(serie_raw, serie_hist, serie_mod, var, stat):
    serie_modify = serie_raw.copy()  # Copia la serie original para no modificarla
    dif_year = serie_mod.index.year[0] - serie_raw.index.year[0]  # Calcula la diferencia de años entre la serie futura y la serie original

    # Resample y agrupación de las series históricas y futuras por mes, tomando la media
    if var == 'pr':
        serie_hist_month = serie_hist.resample('ME').sum().dropna()
        serie_mod_month = serie_mod.resample('ME').sum().dropna()
    else:
        serie_hist_month = serie_hist.resample('ME').mean().dropna()
        serie_mod_month = serie_mod.resample('ME').mean().dropna()

    # Cálculo de los cambios delta para cada mes
    if var == 'pr':
        Delta_models_month = serie_mod_month.groupby(by=serie_mod_month.index.month).mean() / \
                             serie_hist_month.groupby(by=serie_hist_month.index.month).mean()
    else:
        Delta_models_month = serie_mod_month.groupby(by=serie_mod_month.index.month).mean() - \
                             serie_hist_month.groupby(by=serie_hist_month.index.month).mean()

    # Cálculo del cambio medio o mediano
    if stat == 'mean':
        Delta_models_month = Delta_models_month.mean(axis=1)
    elif stat == 'median':
        Delta_models_month = Delta_models_month.median(axis=1)

    # Aplicación de los cambios delta a la serie original para cada mes
    for i in range(1, 13):
        if var == 'pr':
            serie_modify[serie_modify.index.month == i] = (serie_raw[serie_raw.index.month == i].values *
                                                           Delta_models_month.loc[i])
        else:
            serie_modify[serie_modify.index.month == i] = (serie_raw[serie_raw.index.month == i].values +
                                                           Delta_models_month.loc[i])

    # Ajuste del índice de la serie modificada según la diferencia de años
    serie_modify.index = serie_modify.index + pd.DateOffset(years=dif_year)

    return serie_modify