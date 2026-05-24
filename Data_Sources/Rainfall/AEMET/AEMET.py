"""
Author: Salvador Navas
Date: 2025-06-27
"""

import requests
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import os
import time
import xarray as xr
import geopandas as gpd
import xarray as xr
import pandas as pd
import os
from datetime import datetime
from ipyleaflet import Map, Marker, MarkerCluster, Popup, LayersControl
from ipywidgets import Output, VBox, HBox, Button, DatePicker, HTML, IntProgress
from ipyfilechooser import FileChooser
from shapely.geometry import Point
from functools import partial
from IPython.display import display

def download_aemet_daily_data(path_output: str, api_key: str, start_date_str: str, end_date_str: str, interval_days: int = 15):
    # Convert date strings
    start_date = datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S%Z')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M:%S%Z')
    interval = timedelta(days=interval_days)
    
    base_url = 'https://opendata.aemet.es/opendata/api/valores/climatologicos/diarios/datos'
    date_ranges = [start_date + i * interval for i in range((end_date - start_date) // interval + 1)]

    def convert_to_float(value):
        try:
            return float(value.replace(",", "."))
        except (ValueError, AttributeError):
            return np.nan

    station_metadata = {}

    for current_start in date_ranges:
        current_end = min(current_start + interval, end_date)
        current_start_str = current_start.strftime('%Y-%m-%dT%H:%M:%SUTC')
        current_end_str = current_end.strftime('%Y-%m-%dT%H:%M:%SUTC')
        filename = f"{path_output}observations_{current_start.strftime('%Y-%m-%d')}_to_{current_end.strftime('%Y-%m-%d')}.nc"
        
        if os.path.exists(filename):
            print(f"File {filename} already exists. Skipping to next interval.")
            continue

        request_url = f"{base_url}/fechaini/{current_start_str}/fechafin/{current_end_str}/todasestaciones?api_key={api_key}"
        print(request_url)

        max_retries = 3
        attempt = 0
        successful_download = False

        while attempt < max_retries and not successful_download:
            attempt += 1
            try:
                response = requests.get(request_url)
                if response.status_code == 200:
                    initial_data = response.json()
                    data_url = initial_data.get("datos")
                    
                    if data_url:
                        data_response = requests.get(data_url)
                        if data_response.status_code == 200:
                            records = data_response.json()
                            
                            if isinstance(records, list):
                                successful_download = True
                                print(f"Data successfully downloaded for interval {current_start_str} to {current_end_str}.")
                            else:
                                print("Unexpected data format in response.")
                                break
                        else:
                            print(f"Error downloading from 'datos' URL: {data_response.status_code}")
                    else:
                        print("Missing 'datos' key in initial response.")
                        break
                else:
                    print(f"Download error (attempt {attempt}/{max_retries}): {response.status_code}")
                    time.sleep(20)
            except requests.RequestException as e:
                print(f"Exception during download (attempt {attempt}/{max_retries}): {e}")
                time.sleep(20)

        if not successful_download:
            print(f"Failed to download interval {current_start_str} to {current_end_str} after {max_retries} attempts.")
            continue

        times, idemas = [], []
        fields = {
            "prec": [], "tmed": [], "tmin": [], "tmax": [], "horatmin": [], "horatmax": [], "dir": [], 
            "velmedia": [], "racha": [], "horaracha": [], "presMax": [], "horaPresMax": [], "presMin": [], 
            "horaPresMin": [], "hrMedia": [], "hrMax": [], "horaHrMax": [], "hrMin": [], "horaHrMin": [],
            "sol": []
        }

        for record in records:
            idema = record.get("indicativo")
            if idema not in station_metadata:
                station_metadata[idema] = {
                    "lon": convert_to_float(record.get("lon")),
                    "lat": convert_to_float(record.get("lat")),
                    "alt": convert_to_float(record.get("alt")),
                    "ubi": record.get("nombre", np.nan),
                    "provincia": record.get("provincia", np.nan)
                }

            times.append(pd.to_datetime(record["fecha"], format='%Y-%m-%d').to_datetime64())
            idemas.append(idema)

            for key in fields.keys():
                fields[key].append(convert_to_float(record.get(key, np.nan)))

        df = pd.DataFrame({"time": times, "idema": idemas, **fields})
        df.sort_values(by="time", inplace=True)
        ds = df.set_index(["time", "idema"]).to_xarray()

        ds.coords["lon"] = ("idema", [station_metadata[id]["lon"] for id in ds["idema"].values])
        ds.coords["lat"] = ("idema", [station_metadata[id]["lat"] for id in ds["idema"].values])
        ds.coords["alt"] = ("idema", [station_metadata[id]["alt"] for id in ds["idema"].values])
        ds.coords["ubi"] = ("idema", [station_metadata[id]["ubi"] for id in ds["idema"].values])
        ds.coords["provincia"] = ("idema", [station_metadata[id]["provincia"] for id in ds["idema"].values])

        ds.to_netcdf(filename)
        print(f"NetCDF file saved as {filename}")

import geopandas as gpd
import pandas as pd
import xarray as xr
import os
from datetime import datetime
from ipyleaflet import Map, Marker, MarkerCluster, Popup, LayersControl, DrawControl
from ipywidgets import Output, VBox, HBox, Button, DatePicker, HTML, SelectMultiple
from ipyfilechooser import FileChooser
from shapely.geometry import Polygon
from IPython.display import display, clear_output

def AEMETDownloader(netcdf_folder='../HYDRA/data/netcdf/'):
    import geopandas as gpd
    import os
    import xarray as xr
    import pandas as pd
    import threading
    from datetime import datetime
    from shapely.geometry import Polygon
    from ipywidgets import Button, VBox, HBox, Output, IntProgress, DatePicker, HTML, SelectMultiple
    from ipyfilechooser import FileChooser
    from ipyleaflet import Map, Marker, Popup, MarkerCluster, LayersControl, DrawControl

    zoom=5
    center=(40.0, -3.5)

    gdf = gpd.read_file('../HYDRA/data/Estaciones_Auto_AEMET_IHC.shp').to_crs('EPSG:4326')
    output = Output()
    cancel_flag = {'stop': False}
    selected_ids = set()

    start_picker = DatePicker(description="Start", value=pd.Timestamp("2012-01-01"))
    end_picker = DatePicker(description="End", value=pd.Timestamp(datetime.today()))
    folder_chooser = FileChooser('.', title='Output folder', select_dirs=True)
    cancel_button = Button(description="❌ Cancel Download", button_style='danger')

    def cancel_download(_):
        cancel_flag['stop'] = True
        with output:
            output.clear_output()
            print("🛑 Download canceled by user.")

    cancel_button.on_click(cancel_download)

    # Get variables from one NetCDF
    try:
        sample_nc = sorted([f for f in os.listdir(netcdf_folder) if f.endswith('.nc')])[0]
        ds = xr.open_dataset(os.path.join(netcdf_folder, sample_nc))
        variable_selector = SelectMultiple(options=list(ds.data_vars), description="Variables")
    except Exception as e:
        with output:
            print(f"❌ Error opening NetCDF sample: {e}")
        return

    def extract_series_bulk(station_ids, variables, out_folder, netcdf_folder, start, end, prog_total, prog_station, prog_label):
        files = sorted([f for f in os.listdir(netcdf_folder) if f.endswith('.nc')])
        all_series = {}

        for i, station_id in enumerate(station_ids, 1):
            if cancel_flag['stop']:
                with output:
                    output.clear_output()
                    print("🛑 Download canceled.")
                break

            prog_label.value = f"<b>📡 Processing {station_id} ({i}/{len(station_ids)})</b>"
            prog_total.value = i
            all_series.clear()

            for var in variables:
                chunks = 0
                for f in files:
                    ds = xr.open_dataset(os.path.join(netcdf_folder, f))
                    ds = ds.sel(time=slice(start, end))
                    prog_station.max = len(files)
                    prog_station.value = chunks
                    chunks += 1
                    if station_id not in ds['idema'].values:
                        continue
                    try:
                        series = ds[var].sel(idema=station_id).to_dataframe().reset_index()
                        series = series[['time', var]].set_index('time').rename(columns={var: f"{station_id}_{var}"})
                        if (station_id, var) in all_series:
                            all_series[(station_id, var)] = pd.concat([all_series[(station_id, var)], series])
                        else:
                            all_series[(station_id, var)] = series
                    except Exception as e:
                        with output:
                            print(f"⚠️ Error: {station_id}, {var}, {f}: {e}")

            if all_series:
                df = pd.concat([dfv for (_, _), dfv in all_series.items()], axis=1)
                os.makedirs(out_folder, exist_ok=True)
                df.to_csv(os.path.join(out_folder, f"AEMET_{station_id}_series.csv"))
                with output:
                    print(f"✅ Saved AEMET_{station_id}_series.csv")

    def create_popup(station_id, station_name):
        html = HTML(value=f"<b>{station_id}</b><br>{station_name}")
        btn = Button(description="⬇ Download", button_style="info", layout={'width': 'auto'})
        box = VBox([html, btn])

        def on_click(_):
            folder = folder_chooser.selected_path
            if not folder:
                with output:
                    print("⚠️ Select an output folder.")
                return
            if not variable_selector.value:
                with output:
                    print("⚠️ Select at least one variable.")
                return
            cancel_flag['stop'] = False
            prog_station = IntProgress(value=0, min=0, max=1, description='Chunks:', bar_style='info')
            prog_label = HTML(value="Starting...")
            display(VBox([prog_label, prog_station, cancel_button]))
            extract_series_bulk([station_id], variable_selector.value, folder, netcdf_folder,
                                start_picker.value, end_picker.value, IntProgress(min=0, max=1), prog_station, prog_label)

        btn.on_click(on_click)
        return box

    # Create map
    markers = []
    for _, row in gdf.iterrows():
        marker = Marker(location=(row.geometry.y, row.geometry.x))
        popup = create_popup(row['idema'], row['NOMBRE'])
        marker.popup = Popup(location=marker.location, child=popup, close_button=False, auto_close=False)
        markers.append(marker)

    cluster = MarkerCluster(markers=markers)
    m = Map(center=center, zoom=zoom, scroll_wheel_zoom=True)
    m.add_layer(cluster)
    m.add_control(LayersControl())

    draw_control = DrawControl(circlemarker={}, marker={})
    def on_draw(self, action, geo_json):
        if geo_json['geometry']['type'] == 'Polygon':
            poly = Polygon(geo_json['geometry']['coordinates'][0])
            selected = gdf[gdf.geometry.within(poly)]
            new = 0
            for _, row in selected.iterrows():
                if row['idema'] not in selected_ids:
                    selected_ids.add(row['idema'])
                    new += 1
            with output:
                print(f"📦 Selected {new} new stations (total: {len(selected_ids)})")
    draw_control.on_draw(on_draw)
    m.add_control(draw_control)

    # Mass download
    download_btn = Button(description="⬇ Download Selected Area", button_style='success')
    download_thread = None

    def start_download(_):
        nonlocal download_thread
        if download_thread and download_thread.is_alive():
            with output:
                print("⏳ Already downloading.")
            return
        if not selected_ids:
            with output:
                print("⚠️ No stations selected.")
            return
        if not variable_selector.value:
            with output:
                print("⚠️ Select variables.")
            return
        if not folder_chooser.selected_path:
            with output:
                print("⚠️ Select output folder.")
            return

        folder = folder_chooser.selected_path
        start = start_picker.value
        end = end_picker.value
        cancel_flag['stop'] = False
        pd.DataFrame(gdf[gdf['idema'].isin(selected_ids)]).to_csv(f'{folder}/selected_stations.csv', index=False)

        prog_total = IntProgress(value=0, min=0, max=len(selected_ids), description='Total:', bar_style='info')
        prog_station = IntProgress(value=0, min=0, max=1, description='Chunks:', bar_style='info')
        prog_label = HTML(value="Starting download...")
        display(VBox([prog_label, prog_total, prog_station, cancel_button]))

        def run():
            extract_series_bulk(list(selected_ids), variable_selector.value, folder,
                                netcdf_folder, start, end, prog_total, prog_station, prog_label)

        download_thread = threading.Thread(target=run)
        download_thread.start()

    download_btn.on_click(start_download)

    from IPython.display import clear_output, display
    clear_output()
    display(VBox([
        m,
        HBox([start_picker, end_picker]),
        variable_selector,
        folder_chooser,
        download_btn,
        output
    ]))


class AemetCSVLoader:
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.station_df = None
        self.series_df = None

    def load_station_data(self):
        # En AEMETDownloader se guarda un único archivo con todas las estaciones seleccionadas
        file_path = os.path.join(self.folder_path, "selected_stations.csv")
        if os.path.exists(file_path):
            try:
                self.station_df = pd.read_csv(file_path)
            except Exception as e:
                print(f"❌ Error reading station data: {e}")
                self.station_df = pd.DataFrame()
        else:
            print(f"⚠️ File {file_path} not found.")
            self.station_df = pd.DataFrame()

        return self.station_df

    def load_series_data(self, variable):
        if variable is None:
            raise ValueError("You must specify a variable to load (e.g., 'precip').")

        series_files = [f for f in os.listdir(self.folder_path) if f.startswith("AEMET_") and f.endswith("_series.csv")]
        dfs = []

        for file in series_files:
            path = os.path.join(self.folder_path, file)
            try:
                df = pd.read_csv(path, parse_dates=['time'])
                station_id = file.replace("AEMET_", "").replace("_series.csv", "")
                col_name = f"{station_id}_{variable}"
                if col_name in df.columns:
                    df = df[['time', col_name]].drop_duplicates(subset='time')  # <-- Aquí
                    df = df.rename(columns={col_name: station_id}).set_index('time')
                    dfs.append(df)
                else:
                    print(f"⚠️ Variable '{variable}' not found in {file}. Skipping.")
            except Exception as e:
                print(f"❌ Error reading {file}: {e}")

        if dfs:
            combined = pd.concat(dfs, axis=1)
            combined.index = pd.to_datetime(combined.index)
            combined.sort_index(inplace=True)
            self.series_df = combined
        else:
            self.series_df = pd.DataFrame()

        return self.series_df

    def analyze_series_quality(self):
        if self.series_df is None or self.series_df.empty:
            raise ValueError("No series data available. Please load data first.")

        summary_list = []
        for station in self.series_df.columns:
            series = self.series_df[station]
            valid = series.notna()
            total = len(series)
            missing_pct = 100 * (1 - valid.sum() / total) if total > 0 else 100.0

            full_years = 0
            full_months = 0
            try:
                grouped_years = series.dropna().groupby(series.dropna().index.year)
                full_years = sum(len(g) >= 365 for _, g in grouped_years)

                grouped_months = series.dropna().groupby(series.dropna().index.to_period('M'))
                full_months = sum(len(g) >= 28 for _, g in grouped_months)
            except Exception as e:
                print(f"⚠️ Error in grouping series for station {station}: {e}")

            summary_list.append({
                'station_id': station,
                'start_year': series.index.year.min(),
                'end_year': series.index.year.max(),
                'missing_percent': round(missing_pct, 2),
                'full_years': full_years,
                'full_months': full_months,
                'min_value': series.min(skipna=True),
                'max_value': series.max(skipna=True),
            })

        return pd.DataFrame(summary_list)

    def summary(self):
        print(f"📂 Folder: {self.folder_path}")
        print(f"📊 Stations: {len(self.station_df) if self.station_df is not None else 'Not loaded'} rows")
        print(f"📈 Series: {self.series_df.shape if self.series_df is not None else 'Not loaded'}")

