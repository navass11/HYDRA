"""
KNN distance-weighted flood map interpolation (Hybrid Downscaling).

Reconstructs flood depth maps for every synthetic event in the ensemble from
a small set of hydraulic model simulations, using K-Nearest Neighbours in the
(Qmax, Qmed, Duration) feature space.

Workflow
--------
1. For each synthetic event, find the k nearest simulated centroids.
2. Weight each neighbour by the inverse of its distance.
3. Compute the weighted average of the k simulated flood maps → reconstructed map.
4. Sort the full ensemble pixel-by-pixel → derive T-year return-period maps.

Two variants are provided:
- ``FloodMapInterpolator``   — historical period only.
- ``FloodMapInterpolatorCC`` — combines historical + climate-change simulations.
"""

from pathlib import Path

import numpy as np
import pandas as pd
import tqdm

from pyhydra.climate.hybrid_downscaling.return_period import (
    DEFAULT_RETURN_PERIODS,
    pixel_return_period,
    save_return_period_geotiffs,
)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _open_tif_array(path):
    """Read a GeoTIFF band as a float array; replace -9999 with 0."""
    from osgeo import gdal

    ds = gdal.Open(str(path), gdal.GA_ReadOnly)
    arr = ds.GetRasterBand(1).ReadAsArray().astype(float)
    arr[arr == -9999] = 0.0
    return arr


def _block_split(data, n_blocks_row, n_blocks_col):
    """Split a 2-D array into a (n_blocks_row × n_blocks_col) grid of sub-arrays."""
    row_splits = np.array_split(data, n_blocks_row, axis=0)
    blocks = []
    for row in row_splits:
        col_splits = np.array_split(row, n_blocks_col, axis=1)
        blocks.append(col_splits)
    return blocks  # list of lists: blocks[r][c] → 2-D array


def _knn_weights(synthetic_matrix, centroids_sim, k):
    """
    Compute KNN indices and distance weights for every synthetic event.

    Args:
        synthetic_matrix: DataFrame with columns Qmax, Qmed, Duracion.
        centroids_sim:    DataFrame (subset of centroids) that correspond to
                          available hydraulic simulations.
        k:                Number of nearest neighbours.

    Returns:
        positions: ndarray (n_synthetic, k) — row indices into centroids_sim.
        weights:   ndarray (n_synthetic, k) — inverse-distance weights (sum to 1).
    """
    cols = ["Qmax", "Qmed", "Duracion"]
    n = len(synthetic_matrix)
    positions = np.empty((n, k), dtype=int)
    weights = np.empty((n, k))

    cs = centroids_sim[cols].values.astype(float)
    ms = synthetic_matrix[cols].values.astype(float)

    for i in range(n):
        d = np.sqrt(((cs - ms[i]) ** 2).sum(axis=1))
        idx = np.argpartition(d, k)[:k]
        d_k = d[idx]
        # avoid division by zero when an event matches a centroid exactly
        d_k = np.where(d_k == 0, 1e-12, d_k)
        w = 1.0 / d_k
        positions[i] = idx
        weights[i] = w / w.sum()

    return positions, weights


# ---------------------------------------------------------------------------
# Public classes
# ---------------------------------------------------------------------------

class FloodMapInterpolator:
    """
    KNN reconstruction of flood maps for all synthetic events.

    Parameters
    ----------
    synthetic_matrix : pd.DataFrame
        One row per synthetic event; must contain columns
        ``Qmax``, ``Qmed``, ``Duracion``.
    centroids : pd.DataFrame
        Representative events selected by MaxDiss / K-means. The first
        ``n_simulations`` rows correspond to simulated centroids.
    simulations_dir : str or Path
        Directory containing ``Simul_0.tif``, ``Simul_1.tif``, …
    n_simulations : int
        Number of available hydraulic simulation results.
    k_neighbors : int
        Number of nearest neighbours used in the weighted average (default 6).
    landa : float
        Annual event rate (events/year) from the historical record.
    output_dir : str or Path or None
        Where to write the return-period GeoTIFFs. If None, maps are returned
        but not saved.
    """

    def __init__(
        self,
        synthetic_matrix,
        centroids,
        simulations_dir,
        n_simulations,
        k_neighbors=6,
        landa=4.943,
        output_dir=None,
    ):
        self.synthetic_matrix = synthetic_matrix.reset_index(drop=True)
        self.centroids = centroids
        self.simulations_dir = Path(simulations_dir)
        self.n_simulations = n_simulations
        self.k = k_neighbors
        self.landa = landa
        self.output_dir = Path(output_dir) if output_dir else None

    def _centroids_sim(self):
        return self.centroids[self.centroids.index < self.n_simulations]

    def _sim_path(self, j):
        return self.simulations_dir / f"Simul_{j}.tif"

    def _template_tif(self):
        return self._sim_path(0)

    def compute_return_period_maps(
        self,
        return_periods=DEFAULT_RETURN_PERIODS,
        n_blocks=20,
    ):
        """
        Interpolate all synthetic events and compute pixel-based return-period maps.

        The raster is processed in ``n_blocks × n_blocks`` tiles to keep memory
        usage bounded.

        Args:
            return_periods: Iterable of T values in years.
            n_blocks:       Number of blocks per spatial dimension (default 20).

        Returns:
            calados: dict {T: ndarray(nrows, ncols)} — flood depth per return period.
            paths:   list of Path objects (written GeoTIFFs) or empty list if
                     ``output_dir`` is None.
        """
        try:
            from osgeo import gdal  # noqa: F401
        except ImportError as exc:
            raise ImportError(
                "FloodMapInterpolator requires GDAL. "
                "Install it with: conda install gdal"
            ) from exc

        positions, weights = _knn_weights(
            self.synthetic_matrix, self._centroids_sim(), self.k
        )

        ref = _open_tif_array(self._template_tif())
        nrows, ncols = ref.shape
        calados = {T: np.zeros((nrows, ncols)) for T in return_periods}

        row_blocks = _block_split(ref, n_blocks, n_blocks)
        nr2 = 0

        for r in tqdm.tqdm(range(n_blocks), desc="Processing blocks"):
            nc2 = 0
            for c in range(n_blocks):
                block_ref = row_blocks[r][c]
                nb_r, nb_c = block_ref.shape

                # Load all simulated maps for this block
                hiper = np.full((nb_r, nb_c, self.n_simulations), np.nan)
                for j in range(self.n_simulations):
                    full = _open_tif_array(self._sim_path(j))
                    hiper[:, :, j] = _block_split(full, n_blocks, n_blocks)[r][c]

                # Reconstruct all synthetic events via weighted KNN
                n_events = len(self.synthetic_matrix)
                events = np.zeros((nb_r, nb_c, n_events))
                for i in range(n_events):
                    events[:, :, i] = (hiper[:, :, positions[i]] * weights[i]).sum(axis=2)

                events.sort(axis=2)
                rp = pixel_return_period(events, self.landa, return_periods)
                for T in return_periods:
                    calados[T][nr2: nr2 + nb_r, nc2: nc2 + nb_c] = rp[T]

                nc2 += nb_c
            nr2 += nb_r

        paths = []
        if self.output_dir is not None:
            paths = save_return_period_geotiffs(
                calados, self._template_tif(), self.output_dir
            )

        return calados, paths


class FloodMapInterpolatorCC(FloodMapInterpolator):
    """
    KNN flood map reconstruction combining historical and climate-change simulations.

    Extends :class:`FloodMapInterpolator` to merge two pools of hydraulic
    simulations — historical (baseline) and future (climate change) — when
    deriving return-period maps for a given climate scenario.

    Parameters
    ----------
    simulations_dir_hist : str or Path
        Directory with historical simulation GeoTIFFs.
    simulations_dir_cc : str or Path
        Directory with climate-change simulation GeoTIFFs.
    n_simulations_hist : int
        Number of available historical simulations.
    n_simulations_cc : int
        Number of available climate-change simulations.

    All other parameters are inherited from :class:`FloodMapInterpolator`.
    """

    def __init__(
        self,
        synthetic_matrix,
        centroids,
        simulations_dir_hist,
        simulations_dir_cc,
        n_simulations_hist,
        n_simulations_cc,
        k_neighbors=6,
        landa=4.943,
        output_dir=None,
    ):
        self.path_hist = Path(simulations_dir_hist)
        self.path_cc = Path(simulations_dir_cc)
        self.n_sim_hist = n_simulations_hist
        self.n_sim_cc = n_simulations_cc

        super().__init__(
            synthetic_matrix=synthetic_matrix,
            centroids=centroids,
            simulations_dir=simulations_dir_cc,   # template taken from CC dir
            n_simulations=n_simulations_hist + n_simulations_cc,
            k_neighbors=k_neighbors,
            landa=landa,
            output_dir=output_dir,
        )

    def _sim_path(self, j):
        if j < self.n_sim_hist:
            return self.path_hist / f"Simul_{j}.tif"
        return self.path_cc / f"Simul_{j - self.n_sim_hist}.tif"

    def _template_tif(self):
        return self.path_hist / "Simul_0.tif"
