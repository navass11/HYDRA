import os
import xarray as xr
import numpy as np
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import urllib.request
import gzip
import shutil
import concurrent.futures
import tqdm
import pandas as pd
from datetime import datetime
import logging
from matplotlib.animation import FuncAnimation
from IPython.display import HTML
import threading
import time

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

class PERSSIANDownloader:
    def __init__(self, lon=None, lat=None, lon_min=None, lon_max=None, lat_min=None, lat_max=None, path_output="output", max_workers=5):
        self.is_point = False
        self.max_workers = max_workers
        if lon is not None and lat is not None:
            if isinstance(lon, list) and isinstance(lat, list):
                self.points = list(zip(lon, lat))
                self.lon_point = lon
                self.lat_point = lat
                self.is_point = True
            else:
                buffer = 0.1
                self.lon_min = lon - buffer
                self.lon_max = lon + buffer
                self.lat_min = lat - buffer
                self.lat_max = lat + buffer
                self.lon_point = lon
                self.lat_point = lat
                self.points = [(lon, lat)]
                self.is_point = True
        elif None not in (lon_min, lon_max, lat_min, lat_max):
            self.lon_min = lon_min
            self.lon_max = lon_max
            self.lat_min = lat_min
            self.lat_max = lat_max
        else:
            raise ValueError("You must provide either (lon, lat) or (lon_min, lon_max, lat_min, lat_max)")

        self.path_output = path_output
        os.makedirs(path_output, exist_ok=True)

        self.grid_x = 9000
        self.grid_y = 3000
        origin_lat = 59.98
        origin_lon = -179.98
        self.pixel_size = 0.04

    def download_daily(self, start_date, end_date):
        dates = pd.date_range(f'{start_date} 00:00', f'{end_date} 23:00', freq='1d')
        if self.is_point:
            series = self._download_point_series(dates, '1d')
            series.to_csv(os.path.join(self.path_output, 'point_timeseries_daily.csv'))
            return series
        else:
            self._parallel_download(dates, '1d', 'daily')

    def download_hourly(self, start_date, end_date):
        dates = pd.date_range(f'{start_date} 00:00', f'{end_date} 23:00', freq='1h')
        if self.is_point:
            series = self._download_point_series(dates, '1h')
            series.to_csv(os.path.join(self.path_output, 'point_timeseries_hourly.csv'))
            return series
        else:
            self._parallel_download(dates, '1h', 'hrly')

    def _download_point_series(self, dates, time_step):
        def fetch_point_series(dt):
            doy = dt.dayofyear
            year_short = str(dt.year)[2:]
            if time_step == '1d':
                url = f'ftp://persiann.eng.uci.edu/CHRSdata/PERSIANN-CCS/daily/rgccs{time_step}{year_short}{doy:03d}.bin.gz'
            else:
                url = f'ftp://persiann.eng.uci.edu/CHRSdata/PERSIANN-CCS/hrly/{dt.year}/rgccs{time_step}{year_short}{doy:03d}{dt.hour:02d}.bin.gz'

            retries = 5
            for attempt in range(retries):
                temp_path = os.path.join(self.path_output, f'temp_{threading.get_ident()}.bin')
                try:
                    with urllib.request.urlopen(url) as response:
                        with gzip.GzipFile(fileobj=response) as f_in:
                            bin_data = f_in.read()
                            with open(temp_path, 'wb') as f_out:
                                f_out.write(bin_data)
                    da = self._parse_binary(temp_path, time_step)
                    os.remove(temp_path)
                    if da.size == 0 or np.all(np.isnan(da)):
                        logging.error(f"⚠️ Empty or invalid data extracted from {temp_path}")
                        raise ValueError("Empty or invalid data")
                    values = {}
                    for lon_pt, lat_pt in self.points:
                        key = f'({lon_pt},{lat_pt})'
                        try:
                            val = da.sel(lon=lon_pt, lat=lat_pt, method='nearest').values.item()
                        except:
                            val = np.nan
                        values[key] = val
                    return dt, values
                except Exception as e:
                    logging.warning(f"⚠️ Attempt {attempt+1}/{retries} failed for {dt}: {e}")
                    time.sleep(2 ** attempt)
                    try:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                    except:
                        pass
                    if attempt + 1 == retries:
                        logging.error(f"⚠️ Failed to process {dt} after {retries} attempts.")
                        return dt, {f'({lon},{lat})': np.nan for lon, lat in self.points}

        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(tqdm.tqdm(executor.map(fetch_point_series, dates), total=len(dates), desc="🔄 Overall progress"))

        times, values_dicts = zip(*results)
        df = pd.DataFrame(values_dicts, index=pd.to_datetime(times))
        return df

    def _parallel_download(self, dates, time_step, path_type):
        def task(dt):
            doy = dt.dayofyear
            year_short = str(dt.year)[2:]
            date_str = dt.strftime('%Y-%m-%d %H:%M:%S')
            if time_step == '1d':
                filename = f'rgccs_1d_{dt.year}_{dt.month:02d}_{dt.day:02d}_00h'
                url = f'ftp://persiann.eng.uci.edu/CHRSdata/PERSIANN-CCS/{path_type}/rgccs{time_step}{year_short}{doy:03d}.bin.gz'
            else:
                filename = f'rgccs_1h_{dt.year}_{dt.month:02d}_{dt.day:02d}_{dt.hour:02d}h'
                url = f'ftp://persiann.eng.uci.edu/CHRSdata/PERSIANN-CCS/{path_type}/{dt.year}/rgccs{time_step}{year_short}{doy:03d}{dt.hour:02d}.bin.gz'
            output_path = os.path.join(self.path_output, filename)
            if not os.path.exists(output_path + '.nc'):
                self._download_and_process(url, output_path, date_str, time_step)

        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            list(tqdm.tqdm(executor.map(task, dates), total=len(dates),desc="🔄 Overall progress"))

    def _download_and_process(self, url, output_path, date_str, time_step):
        retries = 5
        for attempt in range(retries):
            try:
                gzip_file = f'{output_path}.bin.gz'
                bin_file = f'{output_path}.bin'
                urllib.request.urlretrieve(url, gzip_file)
                with gzip.open(gzip_file, 'rb') as f_in, open(bin_file, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
                os.remove(gzip_file)
                data_array = self._parse_binary(bin_file, time_step)
                if data_array.size == 0 or np.all(np.isnan(data_array)):
                    logging.error(f"Empty or invalid data extracted from {bin_file}")
                    raise ValueError("Invalid extraction or empty data array")
                self._create_netcdf(data_array, date_str, time_step)
                os.remove(bin_file)
                return
            except Exception as e:
                logging.warning(f"⚠️ [{attempt + 1}/{retries}] Error downloading or processing {url}: {e}")
                time.sleep(2 ** attempt)
                try:
                    if os.path.exists(gzip_file):
                        os.remove(gzip_file)
                    if os.path.exists(bin_file):
                        os.remove(bin_file)
                except:
                    pass
                if attempt + 1 == retries:
                    logging.error(f"⚠️ Failed to download and process {url} after {retries} attempts.")

    def _parse_binary(self, BinaryFile, time_step):
        dtype = '>f' if time_step == '1d' else '>H'
        with open(BinaryFile, "rb") as fid:
            data = np.fromfile(fid, dtype=dtype)

        matriz = np.transpose(data.reshape((self.grid_x, self.grid_y), order="F"))
        # myarr = np.flipud(matriz).astype(float)
        myarr = matriz.copy().astype(float)

        # CHRS grid: lon 0.02–359.98 → convert to -179.98–180 range
        xx_raw = np.linspace(0.02, 359.98, self.grid_x)
        yy = np.linspace(59.98, -59.98, self.grid_y)

        # Convert longitude to -180 to 180
        xx = (xx_raw + 180) % 360 - 180
        sort_idx = np.argsort(xx)
        xx = xx[sort_idx]
        myarr = myarr[:, sort_idx]

        # Validate shapes
        if myarr.shape != (len(yy), len(xx)):
            logging.error("Mismatch between array shape and coordinate lengths.")
            raise ValueError("Dimension mismatch in parsed binary data")

        myarr[myarr < 0] = np.nan
        myarr[myarr == 555.37] = np.nan

        if time_step == '1h':
            myarr /= 100

        return xr.DataArray(
            myarr,
            coords={'lat': yy, 'lon': xx},
            dims=['lat', 'lon'],
            name='prcp'
        )

    def _create_netcdf(self, data_array, time, time_step):
        timestamp = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
        time_str = timestamp.strftime('%Y_%m_%d_%Hh')
        filename = os.path.join(self.path_output, f'rgccs_{time_step}_{time_str}.nc')
        data_array = data_array.sel(lon=slice(self.lon_min, self.lon_max), lat=slice(self.lat_max,self.lat_min))
        data_array.attrs.update({
            'description': 'Contains PERSIANN precipitation data',
            'units': 'mm',
            'missing_value': -9999,
            'long_name': 'Daily precipitation' if time_step == '1d' else 'Hourly precipitation'
        })
        data_array['lat'].attrs.update({'units': 'degrees_north', 'long_name': 'latitude coordinate'})
        data_array['lon'].attrs.update({'units': 'degrees_east', 'long_name': 'longitude coordinate'})
        data_array = data_array.expand_dims(time=[timestamp])
        try:
            data_array.to_netcdf(filename, format="NETCDF4")
            logging.info(f'✅ File saved: {filename}')
        except Exception as e:
            logging.error(f'⚠️ Error saving NetCDF {filename}: {e}')


    def plot_extent(self):
        fig, ax = plt.subplots(figsize=(10, 5), subplot_kw={'projection': ccrs.PlateCarree()})
        ax.set_extent([self.lon_min, self.lon_max, self.lat_min, self.lat_max])
        ax.add_feature(cfeature.COASTLINE)
        ax.add_feature(cfeature.BORDERS, linestyle=':')
        ax.add_feature(cfeature.LAND, edgecolor='black')
        ax.add_feature(cfeature.OCEAN)
        ax.add_feature(cfeature.LAKES, edgecolor='black')
        ax.add_feature(cfeature.RIVERS)
        ax.gridlines(draw_labels=True)
        ax.set_title('Download extent for PERSIANN')
        plt.show()

    def create_animation(self, data_dir, start_date, end_date, time_resolution, save_path=None):
        start_date = pd.to_datetime(start_date)
        end_date = pd.to_datetime(end_date)

        file_paths = [os.path.join(data_dir, f) for f in os.listdir(data_dir) if f.startswith(f'rgccs_{time_resolution}')]
        filtered_files = [f for f in file_paths if start_date <= self._extract_date(f) <= end_date]
        filtered_files.sort()

        fig, ax = plt.subplots(figsize=(12, 6), subplot_kw={'projection': ccrs.PlateCarree()})
        fig.subplots_adjust(left=0.01, right=0.99, top=0.92, bottom=0.08)

        ds = xr.open_dataset(filtered_files[0])
        prcp = ds['prcp'].squeeze()

        ax.set_facecolor('lightgray')
        ax.coastlines()
        ax.add_feature(cfeature.BORDERS, linestyle=':')
        ax.add_feature(cfeature.LAND, facecolor='lightgray', edgecolor='black')
        ax.add_feature(cfeature.OCEAN, facecolor='lightblue')
        ax.add_feature(cfeature.LAKES, facecolor='lightblue', edgecolor='black')
        ax.add_feature(cfeature.RIVERS)
        ax.gridlines(draw_labels=True)

        lon = prcp['lon'].values
        lat = prcp['lat'].values
        Lon, Lat = np.meshgrid(lon, lat)
        im = ax.pcolormesh(Lon, Lat, prcp.values, cmap='jet', shading='auto', transform=ccrs.PlateCarree())
        cbar = fig.colorbar(im, ax=ax, orientation='horizontal', pad=0.05, shrink=0.8)
        cbar.set_label('Precipitation (mm)')

        def animate(frame):
            ds = xr.open_dataset(filtered_files[frame])
            prcp = ds['prcp'].squeeze().where(lambda x: x > 0.1)
            im.set_array(prcp.values.ravel())
            vmax = np.nanmax(prcp.values)
            im.set_clim(vmin=0, vmax=vmax if not np.isnan(vmax) else 1)
            time_val = prcp.coords['time'].values
            if np.isscalar(time_val):
                label = pd.to_datetime(time_val).strftime('%Y-%m-%d %H:%M')
            else:
                label = pd.to_datetime(time_val[0]).strftime('%Y-%m-%d %H:%M')
            ax.set_title(f'Precipitation - {label}')

        anim = FuncAnimation(fig, animate, frames=len(filtered_files), interval=1000)

        if save_path:
            from matplotlib.animation import PillowWriter, FFMpegWriter
            import shutil
            ext = os.path.splitext(save_path)[1].lower()
            if ext not in ['.gif', '.mp4']:
                raise ValueError("Invalid or missing file extension. Use '.gif' or '.mp4'.")
            if ext == '.mp4' and not shutil.which("ffmpeg"):
                raise EnvironmentError("FFmpeg is required for saving .mp4 animations. Install and add it to PATH.")
            writer = PillowWriter(fps=1) if ext == '.gif' else FFMpegWriter(fps=1)
            anim.save(save_path, writer=writer)
            plt.close(fig)
            return HTML(anim.to_jshtml())
        else:
            plt.close(fig)
            return HTML(anim.to_jshtml())


    def _extract_date(self, filepath):
        parts = os.path.basename(filepath).split('_')
        return pd.to_datetime(f"{parts[2]}_{parts[3]}_{parts[4][:2]}", format='%Y_%m_%d')