"""
Author: Salvador Navas
Date: 2025-06-27
"""

import numpy as np
import xarray as xr
import dask.array as da


class bias_correction(object):
    """
    Apply bias correction to all scenario series assuming three possible methods:
    quantile_mapping, quantile_deltamapping, or scaled_distribution_mapping.

    Args:
    * obs (vector): observational data
    * mod (vector): model data for the reference period
    * sce (vector): scenario data to be corrected
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

        # Calculate ECDF of historical model data
        mod_ecdf = ECDF(mod_data)

        # Calculate scenario percentiles according to model ECDF
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

        # Calculate ECDF of historical model data
        mod_ecdf = ECDF(mod_data)

        # Calculate scenario percentiles according to model ECDF
        p = mod_ecdf(sce_data).flatten() * 100
        corr = np.percentile(obs_data, p) / np.percentile(mod_data, p)
        sce_data *= corr
        sce_data[sce_data < 0] = 0
        return sce_data

    def scaled_distribution_mapping(self, variable, *args, **kwargs):
        """
        Scaled Distribution Mapping (SDM)
        Adapts differently depending on the meteorological parameter:
        * temperature -> absolute_sdm (normal distribution)
        * precipitation -> relative_sdm (gamma distribution)
        """
        
        def relative_sdm(obs_c, mod_c, sce_c, *args, **kwargs):
            from scipy.stats import gamma

            lower_limit = kwargs.get('lower_limit', 0.1)
            cdf_threshold = kwargs.get('cdf_threshold', 0.99999999)

            obs_raindays = obs_c[obs_c >= lower_limit]
            mod_raindays = mod_c[mod_c >= lower_limit]

            # Validate minimum sample size to avoid fit errors
            if len(obs_raindays) < 10 or len(mod_raindays) < 10:
                raise ValueError("Insufficient rainy days for gamma fit in obs or mod data.")

            obs_frequency = len(obs_raindays) / len(obs_c)
            mod_frequency = len(mod_raindays) / len(mod_c)

            # Fit gamma distributions
            obs_gamma = gamma.fit(obs_raindays, floc=0)
            mod_gamma = gamma.fit(mod_raindays, floc=0)

            obs_cdf = gamma.cdf(np.sort(obs_raindays), *obs_gamma)
            mod_cdf = gamma.cdf(np.sort(mod_raindays), *mod_gamma)

            obs_cdf[obs_cdf > cdf_threshold] = cdf_threshold
            mod_cdf[mod_cdf > cdf_threshold] = cdf_threshold

            sce_raindays = sce_c[sce_c >= lower_limit]
            if len(sce_raindays) < 10:
                raise ValueError("Insufficient rainy days for gamma fit in scenario data.")

            sce_argsort = np.argsort(sce_c)  # Removed .values, as sce_c is already a numpy array
            sce_gamma = gamma.fit(sce_raindays, floc=0)

            expected_sce_raindays = int(min(
                np.round(len(sce_c) * obs_frequency * len(sce_raindays) / mod_frequency),
                len(sce_c)
            ))

            sce_cdf = gamma.cdf(np.sort(sce_raindays), *sce_gamma)
            sce_cdf[sce_cdf > cdf_threshold] = cdf_threshold

            # Interpolation of CDF values
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

        implemented_parameters = {
            'temperature': absolute_sdm,
            'precipitation': relative_sdm,
        }

        try:
            return implemented_parameters[variable](self.obs, self.mod, self.sce, *args, **kwargs)
        except KeyError:
            raise NotImplementedError(f"SDM not implemented for variable '{variable}'.")

# Utility function to ensure unique column names
def make_unique(columns):
    seen = {}
    unique_columns = []
    for col in columns:
        if col in seen:
            seen[col] += 1
            unique_columns.append(f"{col}_{seen[col]}")  # Add suffix if name already exists
        else:
            seen[col] = 0
            unique_columns.append(col)
    return unique_columns
