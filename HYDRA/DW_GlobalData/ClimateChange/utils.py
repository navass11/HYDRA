from datetime import datetime, timedelta

def dividir_periodo_anual(start_date, end_date):
    """
    Función para dividir un periodo de tiempo en bloques anuales y devolverlos en el formato 'start_date/end_date'.
    
    :param start_date: Fecha de inicio (str) en formato 'YYYY-MM-DD'.
    :param end_date: Fecha de fin (str) en formato 'YYYY-MM-DD'.
    :return: Lista de cadenas en formato 'start_date/end_date' para cada año.
    """
    # Convertir las fechas en objetos datetime
    start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
    end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')

    # Lista para almacenar los periodos anuales
    annual_periods = []

    # Generar los periodos anuales
    current_start_date = start_date_dt
    while current_start_date <= end_date_dt:
        current_end_date = current_start_date.replace(year=current_start_date.year + 1) - timedelta(days=1)
        if current_end_date > end_date_dt:
            current_end_date = end_date_dt
        
        # Formato 'start_date/end_date'
        #date_range = f'{current_start_date.strftime("%Y-%m-%d")}/{current_end_date.strftime("%Y-%m-%d")}'
        annual_periods.append([current_start_date.strftime("%Y-%m-%d"),current_end_date.strftime("%Y-%m-%d")])
        
        # Actualizar la fecha de inicio para el próximo año
        current_start_date = current_start_date.replace(year=current_start_date.year + 1)

    return annual_periods


import numpy as np
import xarray as xr
import dask.array as da


class bias_correction(object):
    """
    Apply bias correction to all scenario series assuming two possible methods:
    quantile_mapping or scaled_distribution_mapping

    Args:
    * obs (vector): the observational data
    * mod (vector): the model data at the reference period
    * sce (vector): the scenario data that shall be corrected
    """
    
    def __init__(self, obs, mod, sce):
        self.obs = obs
        self.mod = mod
        self.sce = sce

    def quantile_mapping(self):
        from statsmodels.distributions.empirical_distribution import ECDF

        obs_data = self.obs.copy()
        mod_data = self.mod.copy()
        sce_data = self.sce.copy()

        # Calcular el ECDF del modelo histórico
        mod_ecdf = ECDF(mod_data)

        # Calcular los percentiles del escenario según el ECDF
        p = mod_ecdf(sce_data).flatten() * 100
        corr = np.percentile(obs_data, p) - np.percentile(mod_data, p)
        sce_data += corr
        sce_data[sce_data < 0] = 0
        return sce_data

    def quantile_deltamapping(self):
        from statsmodels.distributions.empirical_distribution import ECDF

        obs_data = self.obs.copy()
        mod_data = self.mod.copy()
        sce_data = self.sce.copy()

        # Calcular el ECDF del modelo histórico
        mod_ecdf = ECDF(mod_data)

        # Calcular los percentiles del escenario según el ECDF
        p = mod_ecdf(sce_data).flatten() * 100
        corr = np.percentile(obs_data, p) / np.percentile(mod_data, p)
        sce_data = sce_data * corr
        sce_data[sce_data < 0] = 0
        return sce_data

    def scaled_distribution_mapping(self, variable, *args, **kwargs):
        """
        Scaled Distribution Mapping
        This method adapts differently based on the meteorological parameter:
        * air_temperature -> absolute_sdm (using normal distribution)
        * precipitation -> relative_sdm (using gamma distribution)
        """
        
        # Función para corrección usando la distribución Gamma (precipitación)
        def relative_sdm(obs_c, mod_c, sce_c, *args, **kwargs):
            from scipy.stats import gamma

            lower_limit = kwargs.get('lower_limit', 0.1)
            cdf_threshold = kwargs.get('cdf_threshold', 0.99999999)
            min_samplesize = kwargs.get('min_samplesize', 10)

            obs_raindays = obs_c[obs_c >= lower_limit]
            mod_raindays = mod_c[mod_c >= lower_limit]

            obs_frequency = len(obs_raindays) / len(obs_c)
            mod_frequency = len(mod_raindays) / len(mod_c)

            # Ajustar la distribución Gamma
            obs_gamma = gamma.fit(obs_raindays, floc=0)
            mod_gamma = gamma.fit(mod_raindays, floc=0)

            obs_cdf = gamma.cdf(np.sort(obs_raindays), *obs_gamma)
            mod_cdf = gamma.cdf(np.sort(mod_raindays), *mod_gamma)

            obs_cdf[obs_cdf > cdf_threshold] = cdf_threshold
            mod_cdf[mod_cdf > cdf_threshold] = cdf_threshold

            sce_raindays = sce_c[sce_c >= lower_limit]
            sce_argsort = np.argsort(sce_c.values)  # Convertir a NumPy para aplanar correctamente
            sce_gamma = gamma.fit(sce_raindays, floc=0)

            expected_sce_raindays = int(min(
                np.round(len(sce_c) * obs_frequency * len(sce_raindays) / mod_frequency),
                len(sce_c)
            ))

            sce_cdf = gamma.cdf(np.sort(sce_raindays), *sce_gamma)
            sce_cdf[sce_cdf > cdf_threshold] = cdf_threshold

            # Interpolación de los valores de CDF
            obs_cdf_resampled = np.interp(
                np.linspace(0, 1, len(sce_raindays)),
                np.linspace(0, 1, len(obs_raindays)),
                obs_cdf
            )
            mod_cdf_resampled = np.interp(
                np.linspace(0, 1, len(sce_raindays)),
                np.linspace(0, 1, len(mod_raindays)),
                mod_cdf
            )

            obs_inverse = 1. / (1 - obs_cdf_resampled)
            mod_inverse = 1. / (1 - mod_cdf_resampled)
            sce_inverse = 1. / (1 - sce_cdf)

            adapted_cdf = 1 - 1. / (obs_inverse * sce_inverse / mod_inverse)
            adapted_cdf[adapted_cdf < 0.] = 0.

            xvals = gamma.ppf(np.sort(adapted_cdf), *obs_gamma) * \
                    gamma.ppf(np.sort(sce_cdf), *sce_gamma) / \
                    gamma.ppf(np.sort(sce_cdf), *mod_gamma)

            correction = np.zeros(len(sce_c))
            if len(sce_raindays) > expected_sce_raindays:
                xvals = np.interp(
                    np.linspace(1, len(sce_raindays), expected_sce_raindays),
                    np.linspace(1, len(sce_raindays), len(sce_raindays)),
                    xvals
                )
            else:
                xvals = np.hstack((np.zeros(expected_sce_raindays - len(sce_raindays)), xvals))

            correction[sce_argsort[-expected_sce_raindays:].flatten()] = xvals
            return correction

        # Función para corrección usando la distribución Normal (temperatura)
        def absolute_sdm(obs_c, mod_c, sce_c, *args, **kwargs):
            from scipy.stats import norm
            from scipy.signal import detrend

            cdf_threshold = kwargs.get('cdf_threshold', 0.99999)

            obs_detrended = detrend(obs_c)
            mod_detrended = detrend(mod_c)
            sce_detrended = detrend(sce_c)

            obs_norm = norm.fit(obs_detrended)
            mod_norm = norm.fit(mod_detrended)

            obs_cdf = norm.cdf(np.sort(obs_detrended), *obs_norm)
            mod_cdf = norm.cdf(np.sort(mod_detrended), *mod_norm)

            obs_cdf_resampled = np.interp(
                np.linspace(0, 1, len(sce_detrended)),
                np.linspace(0, 1, len(obs_detrended)),
                obs_cdf
            )
            mod_cdf_resampled = np.interp(
                np.linspace(0, 1, len(sce_detrended)),
                np.linspace(0, 1, len(mod_detrended)),
                mod_cdf
            )

            correction = np.zeros(len(sce_c))
            correction[np.argsort(sce_detrended)] = norm.ppf(
                np.sort(obs_cdf_resampled), *obs_norm
            ) + obs_norm[-1] / mod_norm[-1] * (
                norm.ppf(np.sort(sce_detrended), *norm.fit(sce_detrended)) -
                norm.ppf(np.sort(mod_cdf_resampled), *mod_norm)
            )

            return correction

        # Mapear las variables a los métodos
        implemented_parameters = {
            'temperature': absolute_sdm,
            'precipitation': relative_sdm,
        }

        try:
            return implemented_parameters[variable](self.obs, self.mod, self.sce, *args, **kwargs)
        except KeyError:
            print(f'SDM not implemented for {variable}')




# Función para asegurar que las columnas tengan nombres únicos
def make_unique(columns):
    seen = {}
    unique_columns = []
    for col in columns:
        if col in seen:
            seen[col] += 1
            unique_columns.append(f"{col}_{seen[col]}")  # Añadir sufijo si el nombre ya existe
        else:
            seen[col] = 0
            unique_columns.append(col)
    return unique_columns
