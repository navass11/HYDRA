# Moved to pyhydra.climate.stochastic_generation
# This file is kept only for backward compatibility.
from pyhydra.climate.stochastic_generation.point import (  # noqa: F401
    NSRPModel,
    _build_calibration_yaml,
    _build_simulation_yaml,
    _default_model_bounds,
    _default_statistics,
    _default_weights,
)
from pyhydra.climate.stochastic_generation.spatial import STNSRPModel  # noqa: F401
