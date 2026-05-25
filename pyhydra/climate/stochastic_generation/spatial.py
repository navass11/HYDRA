"""
Spatial stochastic generation — multi-site models.

Backend: NEOPRENE STNSRP (Space-Time Neyman-Scott Rectangular Pulses).
Generates spatially-coherent precipitation at multiple gauging sites,
preserving both point statistics and spatial cross-correlations.

Install NEOPRENE with: pip install NEOPRENE
Source: https://github.com/IHCantabria/NEOPRENE
"""

from __future__ import annotations

import os
import tempfile

import pandas as pd

from pyhydra.climate.stochastic_generation.point import (
    _build_calibration_yaml,
    _build_simulation_yaml,
    _default_model_bounds,
    _default_statistics,
    _default_weights,
    _require_neoprene,
    _write_yaml,
)


class STNSRPModel:
    """
    Multi-site spatio-temporal stochastic rainfall generator (STNSRP).

    Preserves both point statistics and spatial cross-correlations between
    gauging stations.

    Typical usage::

        attrs = pd.DataFrame({
            'ID':        ['S1',  'S2',  'S3'],
            'Lon':       [-3.7, -3.8, -3.6],
            'Lat':       [43.3, 43.4, 43.2],
            'elevation': [10,   20,   15],
        })
        model = STNSRPModel(temporal_resolution='d', seasonality='monthly')
        model.fit(multisite_df, attributes=attrs)
        synthetic = model.simulate(2000, 2050, attributes=attrs)

    Args:
        temporal_resolution: Time step — 'd' (daily) or 'h' (hourly).
        seasonality: Seasonal grouping — 'annual', 'seasonal', 'monthly'
                     (default), or 'user_defined'.
        process: STNSRP variant — 'normal' (default) or 'storms'.
        statistics: List of statistics to match during calibration
                    (must include 'crosscorr_h' for spatial fitting).
        weights: Dict mapping statistic → optimisation weight (default 1.0).
        n_iterations: PSO iterations (default 100).
        n_bees: PSO swarm size (default 20).
        n_initializations: Independent PSO runs (default 1).
        model_bounds: NSRP parameter search bounds dict.
        seasonality_user: Season labels when seasonality='user_defined'.
        coordinates: Coordinate system of gauge locations —
                     'geographical' (lat/lon, default) or 'UTM'.
        cell_radius: Search radius for spatial cell assignment (km, default 25).
        calibration_yaml: Path to existing NEOPRENE STNSRP calibration YAML.
    """

    def __init__(self, temporal_resolution="d", seasonality="monthly",
                 process="normal", statistics=None, weights=None,
                 n_iterations=100, n_bees=20, n_initializations=1,
                 model_bounds=None, seasonality_user=None,
                 coordinates="geographical", cell_radius=25.0,
                 calibration_yaml=None):
        self.temporal_resolution = temporal_resolution
        self.seasonality = seasonality
        self.process = process
        self.statistics_name = statistics or _default_statistics()
        self.weights = weights or _default_weights(self.statistics_name)
        self.n_iterations = n_iterations
        self.n_bees = n_bees
        self.n_initializations = n_initializations
        self.model_bounds = model_bounds or _default_model_bounds()
        self.seasonality_user = seasonality_user
        self.coordinates = coordinates
        self.cell_radius = cell_radius
        self._calibration_yaml = calibration_yaml

        self._cal_hiperparams = None
        self._statistics = None
        self._calibration_result = None
        self._series = None

    def _get_cal_hiperparams(self):
        _require_neoprene()
        from NEOPRENE.STNSRP.HiperParams import Calibration as HpCal
        if self._calibration_yaml:
            return HpCal(self._calibration_yaml)
        cfg = _build_calibration_yaml(
            self.temporal_resolution, self.seasonality, self.process,
            self.statistics_name, self.weights, self.n_iterations,
            self.n_bees, self.n_initializations, self.model_bounds,
            self.seasonality_user,
        )
        cfg["coordinates"] = self.coordinates
        cfg["cell_radius"] = self.cell_radius
        with tempfile.NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
            tmp = f.name
        _write_yaml(cfg, tmp)
        try:
            return HpCal(tmp)
        finally:
            os.unlink(tmp)

    def compute_statistics(self, series, attributes):
        """
        Compute point statistics and spatial cross-correlations.

        Args:
            series: pd.DataFrame with DatetimeIndex and one column per gauge.
                    Column names must match the 'ID' column in attributes.
            attributes: pd.DataFrame with columns ['ID', 'Lon', 'Lat'] and
                        optionally 'elevation'.

        Returns:
            NEOPRENE STNSRP Statistics object.
        """
        _require_neoprene()
        from NEOPRENE.STNSRP.Statistics import Statistics
        hp = self._get_cal_hiperparams()
        self._cal_hiperparams = hp
        self._statistics = Statistics(hp, time_series=series, attributes=attributes)
        return self._statistics

    def calibrate(self, series_or_stats=None, attributes=None, verbose=False):
        """
        Calibrate STNSRP via PSO, including spatial cross-correlations.

        Args:
            series_or_stats: pd.DataFrame of observed rainfall OR a NEOPRENE
                             STNSRP Statistics object from compute_statistics().
            attributes: Required when series_or_stats is a DataFrame.
            verbose: Print PSO progress.

        Returns:
            NEOPRENE STNSRP Calibration result object.
        """
        if series_or_stats is not None and isinstance(series_or_stats, pd.DataFrame):
            if attributes is None:
                raise ValueError("attributes must be provided when passing a DataFrame.")
            self.compute_statistics(series_or_stats, attributes)
            self._series = series_or_stats
        elif series_or_stats is not None:
            self._statistics = series_or_stats

        if self._statistics is None:
            raise RuntimeError("Call compute_statistics() or pass data before calibrate().")

        _require_neoprene()
        from NEOPRENE.STNSRP.Calibration import Calibration
        if self._cal_hiperparams is None:
            self._cal_hiperparams = self._get_cal_hiperparams()
        cal = Calibration(self._cal_hiperparams)
        self._calibration_result = cal(
            self._statistics,
            self._series,
            verbose=verbose,
        )
        return self._calibration_result

    def fit(self, series, attributes, verbose=False):
        """Compute statistics and calibrate in one step."""
        self._series = series
        self.compute_statistics(series, attributes)
        return self.calibrate(verbose=verbose)

    def simulate(self, year_ini, year_fin, attributes, simulation_yaml=None):
        """
        Generate spatially-coherent synthetic rainfall at all gauging sites.

        Args:
            year_ini: First year of the simulation.
            year_fin: Last year of the simulation.
            attributes: pd.DataFrame with gauge metadata
                        (['ID', 'Lon', 'Lat', 'elevation'] or ['ID', 'X', 'Y']).
            simulation_yaml: Optional path to NEOPRENE STNSRP simulation YAML.

        Returns:
            NEOPRENE STNSRP Simulation result object.
        """
        if self._calibration_result is None:
            raise RuntimeError("Call fit() or calibrate() before simulate().")

        _require_neoprene()
        from NEOPRENE.STNSRP.HiperParams import Simulation as HpSim
        from NEOPRENE.STNSRP.Simulation import Simulation

        if simulation_yaml:
            hp_sim = HpSim(simulation_yaml)
        else:
            cfg = _build_simulation_yaml(
                self.temporal_resolution, self.seasonality, self.process,
                self.statistics_name, year_ini, year_fin, self.seasonality_user,
            )
            cfg["coordinates"] = self.coordinates
            with tempfile.NamedTemporaryFile(mode="w", suffix=".yml", delete=False) as f:
                tmp = f.name
            _write_yaml(cfg, tmp)
            try:
                hp_sim = HpSim(tmp)
            finally:
                os.unlink(tmp)

        return Simulation(hp_sim)(self._calibration_result, attributes)

    def summary(self):
        """Return DataFrame comparing observed vs fitted statistics, or None."""
        if self._calibration_result is None:
            return None
        obs = getattr(self._calibration_result, "statististics_Real", None)
        fit = getattr(self._calibration_result, "statististics_Fit", None)
        if obs is None or fit is None:
            return None
        return pd.concat([obs.rename("observed"), fit.rename("fitted")], axis=1)
