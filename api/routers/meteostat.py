import io
import os
import tempfile
from datetime import date, datetime

import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "hydra-matplotlib"))

router = APIRouter()

try:
    from meteostat import Daily, Hourly, Monthly, Point, Stations
    _METEOSTAT_API = "classes"
    _METEOSTAT_OK = True
except ImportError:
    try:
        from meteostat import Point, daily, hourly, monthly, stations
        _METEOSTAT_API = "functions"
        _METEOSTAT_OK = True
    except ImportError:
        _METEOSTAT_API = ""
        _METEOSTAT_OK = False


def _check_meteostat():
    if not _METEOSTAT_OK:
        raise HTTPException(status_code=500, detail="meteostat no está instalado en este entorno.")


@router.get("/stations")
def search_stations(
    lat: float | None = Query(None, description="Latitud del punto central (modo radio)"),
    lon: float | None = Query(None, description="Longitud del punto central (modo radio)"),
    radius: float = Query(500.0, description="Radio de búsqueda en km"),
    lat_min: float | None = Query(None, description="Latitud sur del bbox"),
    lat_max: float | None = Query(None, description="Latitud norte del bbox"),
    lon_min: float | None = Query(None, description="Longitud oeste del bbox"),
    lon_max: float | None = Query(None, description="Longitud este del bbox"),
    country: str = Query("", description="Código ISO-2 de país (opcional)"),
    limit: int = Query(50, ge=1, le=200),
):
    _check_meteostat()
    bbox_mode = all(v is not None for v in [lat_min, lat_max, lon_min, lon_max])
    nearby_mode = lat is not None and lon is not None
    if not bbox_mode and not nearby_mode:
        raise HTTPException(status_code=400, detail="Proporciona lat/lon o lat_min/lat_max/lon_min/lon_max.")
    try:
        country_code = country.upper() if isinstance(country, str) and country else ""
        if _METEOSTAT_API == "classes":
            station_query = Stations()
            if bbox_mode:
                station_query = station_query.bounds(lat_min, lon_min, lat_max, lon_max)
            else:
                station_query = station_query.nearby(lat, lon, radius * 1000)
            if country_code:
                station_query = station_query.region(country_code)
            df = station_query.fetch(limit)
        else:
            if bbox_mode:
                df = stations.nearby(Point((lat_min + lat_max) / 2, (lon_min + lon_max) / 2),
                                     radius=int(max(lat_max - lat_min, lon_max - lon_min) * 111000),
                                     limit=limit)
                if not df.empty:
                    df = df[(df["latitude"] >= lat_min) & (df["latitude"] <= lat_max) &
                            (df["longitude"] >= lon_min) & (df["longitude"] <= lon_max)]
            else:
                df = stations.nearby(Point(lat, lon), radius=int(radius * 1000), limit=limit)
            if country_code and not df.empty and "country" in df.columns:
                df = df[df["country"].str.upper() == country_code].head(limit)
        if df.empty:
            return {"stations": []}
        df = df.reset_index()
        id_col = df.columns[0]
        df = df.rename(columns={"id": "wmo", id_col: "wmo"})
        for col in ["latitude", "longitude", "elevation"]:
            if col in df.columns:
                df[col] = df[col].round(4)
        records = []
        for _, row in df.iterrows():
            records.append({
                "wmo": str(row.get("wmo", "")),
                "name": str(row.get("name", "")),
                "country": str(row.get("country", "")),
                "region": str(row.get("region", "")),
                "latitude": float(row.get("latitude", 0)),
                "longitude": float(row.get("longitude", 0)),
                "elevation": float(row.get("elevation", 0)) if pd.notna(row.get("elevation")) else None,
                "icao": str(row.get("icao", "")),
            })
        return {"stations": records}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error buscando estaciones: {exc}")


@router.get("/data")
def get_station_data(
    station: str = Query(..., description="WMO ID de la estación Meteostat"),
    start: str = Query(..., description="Fecha inicio YYYY-MM-DD"),
    end: str = Query(..., description="Fecha fin YYYY-MM-DD"),
    freq: str = Query("daily", description="Frecuencia: daily | monthly"),
    download: bool = Query(False, description="Si True devuelve CSV para descarga"),
):
    _check_meteostat()
    try:
        start_dt = datetime.strptime(start, "%Y-%m-%d")
        end_dt = datetime.strptime(end, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Usa YYYY-MM-DD.")

    if (end_dt - start_dt).days > 366 * 50:
        raise HTTPException(status_code=400, detail="El rango máximo es 50 años.")

    try:
        if _METEOSTAT_API == "classes":
            if freq == "monthly":
                data = Monthly(station, start_dt, end_dt)
            else:
                data = Daily(station, start_dt, end_dt)
            df = data.fetch()
        else:
            data = monthly(station, start_dt, end_dt) if freq == "monthly" else daily(station, start_dt, end_dt)
            df = data.fetch() if hasattr(data, "fetch") else data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error descargando datos: {exc}")

    if df.empty:
        raise HTTPException(status_code=404, detail="No hay datos para esta estación y periodo.")

    df = df.reset_index()
    # meteostat ≥2.1 uses Parameter enum objects as column names → normalize to str
    df.columns = [c.value if hasattr(c, "value") else str(c) for c in df.columns]
    df = df.rename(columns={"time": "date"})
    if "date" in df.columns:
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")

    rename_map = {
        "prcp": "precip_mm",
        "tavg": "temp_mean_C",
        "temp": "temp_mean_C",
        "tmin": "temp_min_C",
        "tmax": "temp_max_C",
        "wspd": "wind_mean_kmh",
        "wpgt": "wind_peak_kmh",
        "pres": "pressure_hPa",
        "tsun": "sunshine_min",
        "snwd": "snow_depth_mm",
        "rhum": "humidity_pct",
        "cldc": "cloud_cover_pct",
        "wdir": "wind_dir_deg",
    }
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})

    for col in df.select_dtypes("float64").columns:
        df[col] = df[col].round(2)
    # astype(object) then where() → NaN becomes Python None (float NaN is not JSON-serializable)
    df = df.astype(object).where(df.notna(), other=None)

    if download:
        csv_buf = io.StringIO()
        df.to_csv(csv_buf, index=False)
        csv_buf.seek(0)
        filename = f"meteostat_{station}_{start}_{end}_{freq}.csv"
        return StreamingResponse(
            io.BytesIO(csv_buf.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    cols_keep = ["date"] + [c for c in df.columns if c != "date"]
    df = df[cols_keep]

    n_total = len(df)
    columns = list(df.columns)
    rows = df.to_dict(orient="records")

    return {
        "station": station,
        "freq": freq,
        "start": start,
        "end": end,
        "n_rows": n_total,
        "columns": columns,
        "preview": rows,
    }
