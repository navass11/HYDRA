from pyhydra.climate.stochastic_generation import point, spatial
from pyhydra.climate.stochastic_generation.point import (
    NSRPModel,
    analyze_ts,
    simulate_ts,
    generate_ts,
    fit_distribution,
    fit_acs,
    report_ts,
    _build_calibration_yaml,
    _build_simulation_yaml,
    _default_model_bounds,
    _default_statistics,
    _default_weights,
)
from pyhydra.climate.stochastic_generation.spatial import STNSRPModel

__all__ = [
    "point",
    "spatial",
    # precipitation (NEOPRENE NSRP)
    "NSRPModel",
    "_build_calibration_yaml",
    "_build_simulation_yaml",
    "_default_model_bounds",
    "_default_statistics",
    "_default_weights",
    # general series (CoSMoS_py)
    "analyze_ts",
    "simulate_ts",
    "generate_ts",
    "fit_distribution",
    "fit_acs",
    "report_ts",
    # multi-site (NEOPRENE STNSRP)
    "STNSRPModel",
]
