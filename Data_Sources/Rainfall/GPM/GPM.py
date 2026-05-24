"""
Author: Salvador Navas
Date: 2025-06-27
"""

import xarray as xr
import earthaccess
from datetime import datetime, timedelta
from pathlib import Path
import numpy as np
import tempfile
import shutil
import time
import pandas as pd
from tqdm import tqdm

class GPMDownloader:
    def __init__(self):
        """
        Authenticate with NASA Earthdata and initialize region settings.
        """
        self.auth = earthaccess.login()
        self.points = None
        self.lat_bounds = None
        self.lon_bounds = None

    def set_region(self, points=None, lat_bounds=None, lon_bounds=None):
        """
        Define spatial region to extract data.

        Parameters:
        - points: list of (lat, lon) tuples if extracting specific points.
        - lat_bounds: (min_lat, max_lat) for rectangular region.
        - lon_bounds: (min_lon, max_lon) for rectangular region.
        """
        self.points = points
        self.lat_bounds = lat_bounds
        self.lon_bounds = lon_bounds

    def _parse_date(self, date):
        return datetime.strptime(date, "%Y-%m-%d") if isinstance(date, str) else date

    def _get_short_name(self, resolution='hourly'):
        PRODUCT_MAP = {
            'hourly': 'GPM_3IMERGHH',
            'daily': 'GPM_3IMERGDF',
            'monthly': 'GPM_3IMERGM'
        }
        if resolution not in PRODUCT_MAP:
            raise ValueError("Invalid resolution: must be 'hourly', 'daily', or 'monthly'.")
        return PRODUCT_MAP[resolution]

    def search(self, start_date, end_date, resolution='hourly',
               points=None, lat_bounds=None, lon_bounds=None):
        """
        Search for available granules based on time and location.

        Parameters:
        - start_date: start of the date range (YYYY-MM-DD or datetime).
        - end_date: end of the date range (YYYY-MM-DD or datetime).
        - resolution: 'hourly', 'daily', or 'monthly'.
        - points: optional, list of (lat, lon) for spatial filter.
        - lat_bounds, lon_bounds: optional bounding box (min, max).

        Returns: list of matching granules.
        """
        start_date = self._parse_date(start_date)
        end_date = self._parse_date(end_date)

        now = datetime.utcnow()
        if end_date > now:
            print("⚠️ The requested range includes future dates. Adjusting to current UTC date.")
            end_date = now

        short_name = self._get_short_name(resolution)

        points = points or self.points
        lat_bounds = lat_bounds or self.lat_bounds
        lon_bounds = lon_bounds or self.lon_bounds

        if points and (lat_bounds is None or lon_bounds is None):
            lats, lons = zip(*points)
            lat_bounds = (min(lats) - 0.05, max(lats) + 0.05)
            lon_bounds = (min(lons) - 0.05, max(lons) + 0.05)

        if lat_bounds is None or lon_bounds is None:
            raise ValueError("⚠️ Please define a region using 'set_region()' or pass 'points' or 'lat/lon_bounds' explicitly to 'search()'.")

        bbox = (lon_bounds[0], lat_bounds[0], lon_bounds[1], lat_bounds[1])

        return earthaccess.search_data(
            short_name=short_name,
            version='07',
            temporal=(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')),
            bounding_box=bbox
        )

    def open_dataset(self, results, variable='precipitation',
                     points=None, lat_bounds=None, lon_bounds=None,
                     chunk_size=48, flip_lat=True,
                     max_retries=3, retry_delay=5,
                     output_folder="outputs"):
        """
        Download, process, and save GPM granules.

        Parameters:
        - results: list of granules (from search).
        - variable: variable to extract (default: 'precipitation').
        - points: list of (lat, lon) for point extraction.
        - lat_bounds/lon_bounds: bounding box for spatial subset.
        - chunk_size: number of granules per download batch.
        - flip_lat: whether to sort latitude ascending.
        - max_retries: number of retries on download failure.
        - retry_delay: seconds to wait between retries.
        - output_folder: directory to save output files.
        """
        points = points or self.points
        lat_bounds = lat_bounds or self.lat_bounds
        lon_bounds = lon_bounds or self.lon_bounds

        if points is None and (lat_bounds is None or lon_bounds is None):
            raise ValueError("⚠️ You must call 'set_region()' or pass 'points' or 'lat/lon_bounds' explicitly before using 'open_dataset()'.")

        tempdir = Path(tempfile.mkdtemp())
        output_path = Path(output_folder)
        output_path.mkdir(parents=True, exist_ok=True)
        aggregated_dfs = []

        all_files = list(range(0, len(results), chunk_size))
        for idx in tqdm(all_files, desc="🔄 Overall progress"):
            batch = results[idx:idx + chunk_size]
            try:
                if not batch:
                    continue

                attempt = 0
                files = []
                while attempt < max_retries:
                    try:
                        files = earthaccess.download(batch, local_path=tempdir, pqdm_kwargs={"disable": True})
                        if files:
                            break
                    except Exception as e:
                        print(f"⏳ Retry {attempt+1}/{max_retries} due to download error: {e}")
                        time.sleep(retry_delay)
                        attempt += 1

                if not files:
                    print(f"⚠️ No valid files could be downloaded for batch {idx}-{idx + chunk_size}")
                    continue

                for file in files:
                    try:
                        ds = xr.open_dataset(file, group='/Grid')
                        var = ds[variable] if variable in ds else list(ds.data_vars.values())[0]

                        if lat_bounds and lon_bounds:
                            var = var.sel(lat=slice(*lat_bounds), lon=slice(*lon_bounds))
                            var['time'] = pd.to_datetime([x.strftime('%Y-%m-%d %H:%M:%S') for x in var['time'].values])

                        if points:
                            stacked = []
                            for lat, lon in points:
                                sel = var.sel(lat=lat, lon=lon, method='nearest')
                                sel = sel.expand_dims(dim={"point": [f"({lat:.2f},{lon:.2f})"]})
                                stacked.append(sel)
                            var = xr.concat(stacked, dim="point")
                            var['time'] = pd.to_datetime([x.strftime('%Y-%m-%d %H:%M:%S') for x in var['time'].values])

                        if flip_lat and "lat" in var.coords and var.lat.size > 1 and var.lat[0] > var.lat[-1]:
                            var = var.sortby('lat')

                        if 'point' in var.dims:
                            df = var.to_dataframe(name=variable).reset_index()
                            df = df.pivot(index="time", columns="point", values=variable)
                            aggregated_dfs.append(df)
                        else:
                            timestamp = var.time.values[0].strftime("%Y%m%dT%H%M%S")
                            save_file = output_path / f"{variable}_{timestamp}.nc"
                            var.to_netcdf(save_file)
                            print(f"✅ Saved: {save_file}")
                        ds.close()
                    except Exception as e:
                        print(f"⚠️ Error processing file {file}: {e}")

            except Exception as e:
                print(f"⚠️ Error while processing batch {idx}-{idx + chunk_size}: {e}")
            finally:
                try:
                    shutil.rmtree(tempdir, ignore_errors=True)
                except Exception as cleanup_error:
                    print(f"⚠️ Warning: failed to delete temporary directory {tempdir}: {cleanup_error}")

        # Save combined CSV if extracting points
        if aggregated_dfs:
            final_df = pd.concat(aggregated_dfs).sort_index()
            final_df.to_csv(output_path / f"{variable}_points.csv")
            print(f"✅ Saved combined CSV: {output_path / f'{variable}_points.csv'}")
        return final_df
    
    
