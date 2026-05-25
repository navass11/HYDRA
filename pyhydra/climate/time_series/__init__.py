"""
Time Series Analysis — event discretization and extremes.

Per PDF schema: Time Series Analysis → Extremes + Discretization.
Stochastic generation is in pyhydra.climate.stochastic_generation.
"""

from pyhydra.climate.time_series import synthetic_events, events
from pyhydra.climate.time_series.events import (
    extract_events,
    extract_discharge_events,
    extract_precipitation_events,
)

__all__ = [
    "discretization",
    "events",
    "extract_events",
    "extract_discharge_events",
    "extract_precipitation_events",
]
