"""
Threshold-based event extraction for discharge and precipitation time series.

Provides standalone functions extracted from the discretization workflow:
- extract_discharge_events(): inflection-point method (generalised from generacion_eventos_sinteticos)
- extract_precipitation_events(): consecutive wet-spell method
"""

import numpy as np
import pandas as pd


# ---------------------------------------------------------------------------
# Discharge events
# ---------------------------------------------------------------------------

def extract_discharge_events(series, threshold, threshold2=None, plot=False):
    """
    Identify flood events in a discharge series using an inflection-point method.

    Events begin just before the rising limb crosses `threshold` and end when
    the falling limb drops back below it.  Only events whose peak exceeds
    `threshold2` are retained.

    Args:
        series: pd.Series of discharge values with a DatetimeIndex (or any
                monotonic index).  Values must be non-negative.
        threshold: Minimum discharge (same units as series) to define an event.
        threshold2: Minimum peak discharge to retain an event.  Defaults to
                    `threshold`.
        plot: If True, plot the largest event with start/end markers.

    Returns:
        Tuple (stats, bounds):
            stats  – DataFrame with columns [peak, mean, duration, volume, date_peak]
            bounds – DataFrame with columns [start, end] (positional integer indices)
    """
    if threshold2 is None:
        threshold2 = threshold

    values = np.asarray(series.values, dtype=float)
    n = len(values)
    x = np.arange(n)

    # ── slope sign series ──────────────────────────────────────────────────
    slope = np.sign(np.diff(values))  # +1 rising, -1 falling, 0 flat

    # ── find rising crossings (x_start) and falling crossings (x_end) ──────
    x_start, x_end = [], []
    for i in range(n - 1):
        m = values[i + 1] - values[i]
        if m > 0 and values[i] <= threshold < values[i + 1]:
            x_start.append(i)
        if m < 0 and values[i] >= threshold > values[i + 1]:
            x_end.append(i + 1)

    if not x_start or not x_end:
        return pd.DataFrame(columns=["peak", "mean", "duration", "volume", "date_peak"]), \
               pd.DataFrame(columns=["start", "end"])

    x_end_arr = np.array(x_end)

    # For each rising crossing, find the first falling crossing that comes AFTER it.
    # This matches the original eventos_caudal() pairing logic.
    x_end_paired = []
    valid_starts = []
    for xs in x_start:
        after = x_end_arr[x_end_arr > xs]
        if len(after) == 0:
            continue
        x_end_paired.append(int(after[0]))
        valid_starts.append(xs)
    x_start = valid_starts

    if not x_start:
        return pd.DataFrame(columns=["peak", "mean", "duration", "volume", "date_peak"]), \
               pd.DataFrame(columns=["start", "end"])

    # ── find inflection points (local minima) for event boundaries ──────────
    # slope changes from -1 → +1 mark the foot of recessions (local minima)
    diff_slope = np.diff(slope)
    inflex_min_idx = np.where(diff_slope == 2)[0] + 1  # indices in `values`

    def _nearest_inflex_before(xref):
        """Last local minimum at or before xref."""
        candidates = inflex_min_idx[inflex_min_idx <= xref]
        return int(candidates[-1]) if len(candidates) else max(0, xref - 1)

    def _nearest_inflex_after(xref):
        """First local minimum at or after xref."""
        candidates = inflex_min_idx[inflex_min_idx >= xref]
        return int(candidates[0]) if len(candidates) else min(n - 1, xref + 1)

    # ── collect event windows aligned to inflection points ─────────────────
    peaks, means, durations, volumes, date_peaks = [], [], [], [], []
    starts_out, ends_out = [], []

    index = series.index
    for xs, xe in zip(x_start, x_end_paired):
        evt_start = _nearest_inflex_before(xs)
        evt_end = _nearest_inflex_after(xe)

        segment = values[evt_start:evt_end + 1]
        if len(segment) == 0 or segment.max() < threshold2:
            continue

        peaks.append(float(segment.max()))
        means.append(float(segment.mean()))
        durations.append(evt_end - evt_start)
        volumes.append(float(segment.sum()))
        date_peaks.append(index[evt_start + int(np.argmax(segment))])
        starts_out.append(evt_start)
        ends_out.append(evt_end)

    stats = pd.DataFrame({
        "peak": peaks,
        "mean": means,
        "duration": durations,
        "volume": volumes,
        "date_peak": date_peaks,
    })
    bounds = pd.DataFrame({"start": starts_out, "end": ends_out})

    if plot and len(peaks):
        import matplotlib.pyplot as plt
        pos_max = int(np.argmax(peaks))
        s0, s1 = starts_out[pos_max], ends_out[pos_max]
        margin = max(30, (s1 - s0) // 2)
        fig, ax = plt.subplots(figsize=(14, 5))
        ax.plot(x, values, "--k", linewidth=1.5, label="Discharge")
        ax.axhline(threshold, linestyle="--", color="orange", label=f"Threshold = {threshold}")
        ax.axvline(s0, color="green", linewidth=1, label="Event start")
        ax.axvline(s1, color="red", linewidth=1, label="Event end")
        ax.set_xlim(max(0, s0 - margin), min(n - 1, s1 + margin))
        ax.set_ylim(0, max(peaks) * 1.1)
        ax.set_xlabel("Time step"); ax.set_ylabel("Discharge")
        ax.legend(); ax.grid(True)
        plt.tight_layout()

    return stats, bounds


# ---------------------------------------------------------------------------
# Precipitation events
# ---------------------------------------------------------------------------

def extract_precipitation_events(series, threshold=0.0, min_duration=1, min_gap=1):
    """
    Extract wet spells from a precipitation series.

    Consecutive time steps with precipitation > `threshold` form an event.
    Gaps shorter than `min_gap` steps are bridged (events merged).
    Events shorter than `min_duration` steps after merging are discarded.

    Args:
        series: pd.Series of precipitation values with a DatetimeIndex.
        threshold: Minimum precipitation to consider a step wet (default 0).
        min_duration: Minimum event length in time steps (default 1).
        min_gap: Dry steps between two wet periods that are bridged into one
                 event (default 1, i.e. single dry days are bridged).

    Returns:
        Tuple (stats, bounds):
            stats  – DataFrame with [peak, total, duration, mean_intensity, date_start]
            bounds – DataFrame with [start, end] (positional integer indices)
    """
    values = np.asarray(series.values, dtype=float)
    wet = (values > threshold).astype(int)
    n = len(wet)

    # ── find raw wet runs ──────────────────────────────────────────────────
    changes = np.diff(np.concatenate([[0], wet, [0]]))
    run_starts = np.where(changes == 1)[0]
    run_ends = np.where(changes == -1)[0] - 1

    if len(run_starts) == 0:
        return (
            pd.DataFrame(columns=["peak", "total", "duration", "mean_intensity", "date_start"]),
            pd.DataFrame(columns=["start", "end"]),
        )

    # ── merge runs separated by short dry gaps ─────────────────────────────
    merged_starts = [run_starts[0]]
    merged_ends = [run_ends[0]]
    for rs, re in zip(run_starts[1:], run_ends[1:]):
        if rs - merged_ends[-1] - 1 <= min_gap:
            merged_ends[-1] = re
        else:
            merged_starts.append(rs)
            merged_ends.append(re)

    # ── compute event statistics ───────────────────────────────────────────
    index = series.index
    peaks, totals, durations, intensities, date_starts = [], [], [], [], []
    starts_out, ends_out = [], []

    for s0, s1 in zip(merged_starts, merged_ends):
        dur = s1 - s0 + 1
        if dur < min_duration:
            continue
        segment = values[s0:s1 + 1]
        peaks.append(float(segment.max()))
        totals.append(float(segment.sum()))
        durations.append(dur)
        intensities.append(float(segment[segment > threshold].mean()) if (segment > threshold).any() else 0.0)
        date_starts.append(index[s0])
        starts_out.append(s0)
        ends_out.append(s1)

    stats = pd.DataFrame({
        "peak": peaks,
        "total": totals,
        "duration": durations,
        "mean_intensity": intensities,
        "date_start": date_starts,
    })
    bounds = pd.DataFrame({"start": starts_out, "end": ends_out})
    return stats, bounds


# ---------------------------------------------------------------------------
# Convenience wrapper
# ---------------------------------------------------------------------------

def extract_events(series, threshold, variable="discharge", threshold2=None,
                   min_duration=1, min_gap=1, plot=False):
    """
    Unified entry point for event extraction.

    Args:
        series: pd.Series with a time index.
        threshold: Event detection threshold.
        variable: 'discharge' (inflection-point method) or 'precipitation'
                  (wet-spell method).
        threshold2: For discharge only — minimum peak to retain an event.
        min_duration: For precipitation only — minimum event length.
        min_gap: For precipitation only — dry steps to bridge between events.
        plot: For discharge only — plot the largest event.

    Returns:
        Tuple (stats, bounds) — see the specific functions for column details.
    """
    if variable == "discharge":
        return extract_discharge_events(series, threshold, threshold2=threshold2, plot=plot)
    elif variable == "precipitation":
        return extract_precipitation_events(series, threshold=threshold,
                                            min_duration=min_duration, min_gap=min_gap)
    else:
        raise ValueError(f"Unknown variable '{variable}'. Use 'discharge' or 'precipitation'.")
