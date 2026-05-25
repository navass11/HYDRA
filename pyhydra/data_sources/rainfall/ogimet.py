"""
OGIMET SYNOP downloader and Jupyter widget interface.

Downloads daily meteorological observations from global SYNOP stations via ogimet.com.
"""

import os
import re
import threading
import time
import unicodedata
from datetime import datetime, timedelta
from io import StringIO

import pandas as pd
import requests
from bs4 import BeautifulSoup


def normalize_filename(name):
    """Normalize a station name to a safe ASCII filename."""
    name = unicodedata.normalize("NFKD", str(name)).encode("ascii", "ignore").decode("utf-8")
    name = re.sub(r"[^a-zA-Z0-9]", "_", name)
    name = re.sub(r"_+", "_", name).strip("_")
    return name


def download_synop(station_id, start_date, end_date, progress=None, cancel_flag=None):
    """
    Download SYNOP daily data for a single station from ogimet.com.

    Args:
        station_id: Numeric SYNOP station code
        start_date: Start date (str or datetime)
        end_date: End date (str or datetime)
        progress: Optional ipywidgets IntProgress for Jupyter display
        cancel_flag: Optional dict with key 'parar' to interrupt download

    Returns:
        DataFrame with multi-index columns, or None on failure
    """
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)
    date = end_date
    all_data = []

    while date >= start_date:
        if cancel_flag and cancel_flag.get("parar", False):
            print(f"Canceled while downloading {station_id}")
            return None

        ndays = min(30, (date - start_date).days + 1)
        url = (
            f"https://www.ogimet.com/cgi-bin/gsynres?"
            f"ind={station_id}&ndays={ndays}&ano={date.year}&mes={date.month}"
            f"&day={date.day}&hora=0&ord=REV&enviar=Ver"
        )

        try:
            r = requests.get(url, timeout=30)
            soup = BeautifulSoup(r.content, "html.parser")
            tables = pd.read_html(StringIO(str(soup)))
            if len(tables) > 2:
                df = tables[2]
                date_col = next((c for c in df.columns if "Fecha" in str(c)), None)
                if date_col:
                    df[date_col] = (df[date_col].astype(str).str.strip() + f"/{date.year}")
                    df[date_col] = pd.to_datetime(df[date_col], format="%d/%m/%Y", errors="coerce")
                    df = df.sort_values(by=date_col)
                    all_data.append(df)
        except Exception as exc:
            print(f"Error downloading {station_id}: {exc}")

        date -= pd.Timedelta(days=ndays)
        time.sleep(0.5)
        if progress:
            progress.value += 1

    return pd.concat(all_data, ignore_index=True) if all_data else None


def process_all_meteorological_variables(df):
    """
    Process a raw OGIMET DataFrame into a clean daily time series.

    Converts wind directions to degrees, handles trace precipitation ('ip'),
    and aggregates 3-hourly observations to daily values.

    Args:
        df: Raw DataFrame with MultiIndex columns from download_synop()

    Returns:
        DataFrame with clean column names and one row per day
    """
    if not isinstance(df.columns, pd.MultiIndex):
        raise ValueError("Expected a DataFrame with MultiIndex columns.")

    df = df[[c for c in df.columns if c[0] != "Diario meteorológico"]].copy()
    date_col = next(c for c in df.columns if "Fecha" in c[0])
    df.loc[:, date_col] = pd.to_datetime(df[date_col], errors="coerce")

    direction_to_degrees = {
        "N": 0.0, "NNE": 22.5, "NE": 45.0, "ENE": 67.5,
        "E": 90.0, "ESE": 112.5, "SE": 135.0, "SSE": 157.5,
        "S": 180.0, "SSW": 202.5, "SW": 225.0, "WSW": 247.5,
        "W": 270.0, "WNW": 292.5, "NW": 315.0, "NNW": 337.5,
    }

    numeric_cols = [c for c in df.columns if c != date_col]
    for col in numeric_cols:
        if "viento" in col[0].lower() and "dir" in col[1].lower():
            df.loc[:, col] = df[col].map(lambda x: direction_to_degrees.get(str(x).strip().upper()))
        elif "prec" in col[0].lower() or "prec" in col[1].lower():
            df.loc[:, col] = df[col].apply(
                lambda x: 0.1 if isinstance(x, str) and x.strip().lower() == "ip" else x
            )
            df.loc[:, col] = pd.to_numeric(df[col], errors="coerce")
        else:
            df.loc[:, col] = pd.to_numeric(df[col], errors="coerce")

    agg_dict = {
        col: (lambda x: x.sum(min_count=1)) if ("prec" in col[0].lower() or "prec" in col[1].lower()) else "mean"
        for col in numeric_cols
    }
    grouped = df.groupby(df[date_col].dt.date).agg(agg_dict)

    def _clean_name(col):
        parts = [
            p.strip().lower().replace(" ", "_").replace(".", "").replace("%", "pct")
            .replace("(", "").replace(")", "").replace("-", "_").replace("/", "_")
            for p in filter(None, map(str, col))
        ]
        unique = []
        for p in parts:
            if p not in unique:
                unique.append(p)
        return "_".join(unique)

    grouped.columns = [_clean_name(c) for c in grouped.columns]
    grouped = grouped.reset_index()
    grouped.rename(columns={grouped.columns[0]: "date"}, inplace=True)

    rename_map = {
        "temperatura_c_max": "tmax_celsius",
        "temperatura_c_min": "tmin_celsius",
        "temperatura_c_med": "tmed_celsius",
        "td_med_c_td_med_c": "dewpoint_mean_celsius",
        "hr_med_pct_hr_med_pct": "humidity_mean_percent",
        "viento_kmh_dir": "wind_direction_deg",
        "viento_kmh_vel": "wind_speed_kmh",
        "pres_n_mar_hp_pres_n_mar_hp": "pressure_msl_hpa",
        "prec_mm_prec_mm": "precipitation_mm",
        "nub_tot_oct_nub_tot_oct": "cloud_total_oktas",
        "nub_baj_oct_nub_baj_oct": "cloud_low_oktas",
        "sol_d_1_h_sol_d_1_h": "sun_hours_day_before",
        "vis_km_vis_km": "visibility_km",
    }
    grouped.rename(columns={k: v for k, v in rename_map.items() if k in grouped.columns}, inplace=True)
    return grouped


def OGIMETDownloader(stations_csv, zoom=5, center=(40.0, -3.5), max_markers=None):
    """
    Interactive Jupyter widget for selecting and downloading OGIMET station series.

    Requires: ipyleaflet, ipywidgets, ipyfilechooser, beautifulsoup4 (Jupyter environment).

    Args:
        stations_csv: Path to CSV with OGIMET station metadata
                      (columns: Nombre, WIGOS ID, OACI, Latitud_decimal, Longitud_decimal, Altitud, Estado)
        zoom: Initial map zoom level
        center: Initial map center (lat, lon)
        max_markers: Limit number of markers shown (for performance; None = all)
    """
    from tqdm.auto import tqdm as _tqdm
    from IPython.display import display
    from ipyfilechooser import FileChooser
    from ipyleaflet import DrawControl, LayersControl, Map, Marker, MarkerCluster, Popup
    from ipywidgets import Button, DatePicker, HBox, HTML, IntProgress, Output, VBox

    stations_df = pd.read_csv(stations_csv)
    stations_df = stations_df[~stations_df["WIGOS ID"].str.contains("MISSING", case=False, na=False)]
    if max_markers:
        stations_df = stations_df.sample(max_markers, random_state=0)

    output = Output()
    m = Map(center=center, zoom=zoom, scroll_wheel_zoom=True)
    selected = set()
    cancel_flag = {"parar": False}

    start_picker = DatePicker(description="Start Date", value=pd.Timestamp("2020-01-01"))
    end_picker = DatePicker(description="End Date", value=pd.Timestamp("2020-12-31"))
    folder_chooser = FileChooser(".", title="Select output folder", select_dirs=True)
    cancel_button = Button(description="Cancel Download", button_style="danger")
    cancel_button.on_click(lambda _: cancel_flag.update({"parar": True}))

    markers = []
    for _, row in _tqdm(stations_df.iterrows(), total=len(stations_df), desc="Loading stations"):
        marker = Marker(location=(row["Latitud_decimal"], row["Longitud_decimal"]), draggable=False)

        def on_click(marker=marker, row=row, **kwargs):
            if marker.popup:
                return
            info = HTML(value=(
                f"<b>{row['Nombre']}</b><br>"
                f"WIGOS: {row['WIGOS ID']}<br>ICAO: {row['OACI']}<br>"
                f"Lat/Lon: {row['Latitud_decimal']}, {row['Longitud_decimal']}"
            ))
            btn = Button(description="Download", button_style="info", layout={"width": "auto"})

            def download_single(_, row=row):
                folder = folder_chooser.selected_path
                if not folder:
                    return
                base = normalize_filename(row["Nombre"])
                parts = str(row["WIGOS ID"]).split("-")
                code = parts[-1].strip() if len(parts) >= 4 and parts[-1].strip().isdigit() else None
                if not code:
                    return
                total_days = (pd.to_datetime(end_picker.value) - pd.to_datetime(start_picker.value)).days + 1
                prog = IntProgress(value=0, min=0, max=(total_days + 29) // 30, description="Download:")
                display(VBox([prog]))
                df_raw = download_synop(code, start_picker.value, end_picker.value,
                                        progress=prog, cancel_flag=cancel_flag)
                if df_raw is not None:
                    try:
                        df_proc = process_all_meteorological_variables(df_raw)
                        df_proc.to_csv(os.path.join(folder, f"series_{base}.csv"), index=False)
                        pd.DataFrame([row]).to_csv(os.path.join(folder, f"station_{base}.csv"), index=False)
                    except Exception as exc:
                        with output:
                            print(f"Error processing {base}: {exc}")

            btn.on_click(download_single)
            marker.popup = Popup(location=marker.location, child=VBox([info, btn]),
                                 close_button=True, auto_close=False)

        marker.on_click(on_click)
        markers.append(marker)

    m.add_layer(MarkerCluster(markers=markers))
    m.add_control(LayersControl())

    draw_control = DrawControl(circle={}, polygon={}, polyline={}, circlemarker={})
    draw_control.rectangle = {"shapeOptions": {"color": "#6bc2e5", "fillOpacity": 0.3}}
    m.add_control(draw_control)

    download_area_btn = Button(description="Download Selected Area", button_style="success")
    download_thread = None

    def start_download(_):
        nonlocal download_thread
        if download_thread and download_thread.is_alive():
            return
        folder = folder_chooser.selected_path
        if not folder or not selected:
            return
        cancel_flag["parar"] = False
        selected_df = stations_df[stations_df["Nombre"].isin(selected)]
        selected_df.to_csv(os.path.join(folder, "selected_stations.csv"), index=False)

        prog_total = IntProgress(value=0, min=0, max=len(selected_df), description="Total:")
        prog_station = IntProgress(value=0, min=0, max=1, description="Station:")
        prog_label = HTML(value="Starting download...")
        display(VBox([prog_label, prog_total, prog_station, cancel_button]))

        def _run():
            for i, (_, row) in enumerate(selected_df.iterrows(), 1):
                if cancel_flag["parar"]:
                    break
                prog_label.value = f"<b>Station {i}/{len(selected_df)}: {row['Nombre']}</b>"
                base = normalize_filename(row["Nombre"])
                parts = str(row["WIGOS ID"]).split("-")
                code = parts[-1].strip() if len(parts) >= 4 and parts[-1].strip().isdigit() else None
                if not code:
                    prog_total.value = i
                    continue
                total_days = (pd.to_datetime(end_picker.value) - pd.to_datetime(start_picker.value)).days + 1
                prog_station.max = (total_days + 29) // 30
                prog_station.value = 0
                df_raw = download_synop(code, start_picker.value, end_picker.value,
                                        progress=prog_station, cancel_flag=cancel_flag)
                if df_raw is not None:
                    try:
                        df_proc = process_all_meteorological_variables(df_raw)
                        df_proc.to_csv(os.path.join(folder, f"series_{base}.csv"), index=False)
                        pd.DataFrame([row]).to_csv(os.path.join(folder, f"station_{base}.csv"), index=False)
                    except Exception as exc:
                        with output:
                            print(f"Error {base}: {exc}")
                prog_total.value = i

        download_thread = threading.Thread(target=_run)
        download_thread.start()

    download_area_btn.on_click(start_download)
    display(VBox([m, HBox([start_picker, end_picker]), folder_chooser, download_area_btn, output]))


class OgimetCSVLoader:
    """Load and quality-check OGIMET series downloaded with OGIMETDownloader."""

    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.station_df = None
        self.series_df = None

    def load_station_data(self):
        """Load all station metadata CSVs into a single DataFrame."""
        files = [f for f in os.listdir(self.folder_path) if f.startswith("station_") and f.endswith(".csv")]
        dfs = []
        for f in files:
            try:
                dfs.append(pd.read_csv(os.path.join(self.folder_path, f)))
            except Exception as exc:
                print(f"Error reading {f}: {exc}")
        self.station_df = pd.concat(dfs, ignore_index=True) if dfs else pd.DataFrame()
        return self.station_df

    def load_series_data(self, variable):
        """
        Load a specific variable from all series_*.csv files.

        Args:
            variable: Column name to extract (e.g. 'precipitation_mm')
        """
        if variable is None:
            raise ValueError("Specify a variable to load.")
        files = [f for f in os.listdir(self.folder_path) if f.startswith("series_") and f.endswith(".csv")]
        dfs = []
        for f in files:
            path = os.path.join(self.folder_path, f)
            try:
                df = pd.read_csv(path, parse_dates=["date"])
                sid = f.replace("series_", "").replace(".csv", "")
                if variable in df.columns:
                    dfs.append(df[["date", variable]].rename(columns={variable: sid}).set_index("date"))
            except Exception as exc:
                print(f"Error reading {f}: {exc}")
        self.series_df = pd.concat(dfs, axis=1).sort_index() if dfs else pd.DataFrame()
        return self.series_df

    def analyze_series_quality(self):
        """Return a DataFrame with data quality metrics per station."""
        if self.series_df is None or self.series_df.empty:
            raise ValueError("Load data first with load_series_data().")
        rows = []
        for station in self.series_df.columns:
            s = self.series_df[station]
            total = len(s)
            missing_pct = 100 * (1 - s.notna().sum() / total) if total > 0 else 100.0
            try:
                full_years = sum(len(g) >= 365 for _, g in s.dropna().groupby(s.dropna().index.year))
                full_months = sum(len(g) >= 28 for _, g in s.dropna().groupby(s.dropna().index.to_period("M")))
            except Exception:
                full_years = full_months = 0
            rows.append({
                "station_id": station,
                "start_year": s.index.year.min(),
                "end_year": s.index.year.max(),
                "missing_percent": round(missing_pct, 2),
                "full_years": full_years,
                "full_months": full_months,
                "min_value": s.min(skipna=True),
                "max_value": s.max(skipna=True),
            })
        return pd.DataFrame(rows)
