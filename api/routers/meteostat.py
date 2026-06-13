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
    _METEOSTAT_OK = True
except ImportError:
    _METEOSTAT_OK = False


def _check_meteostat():
    if not _METEOSTAT_OK:
        raise HTTPException(status_code=500, detail="meteostat no está instalado en este entorno.")


@router.get("/stations")
def search_stations(
    lat: float = Query(..., description="Latitud del punto de búsqueda"),
    lon: float = Query(..., description="Longitud del punto de búsqueda"),
    radius: float = Query(500.0, description="Radio de búsqueda en km"),
    country: str = Query("", description="Código ISO-2 de país (opcional)"),
    limit: int = Query(50, ge=1, le=200),
):
    _check_meteostat()
    try:
        stations = Stations()
        stations = stations.nearby(lat, lon, radius * 1000)
        if country:
            stations = stations.region(country.upper())
        df = stations.fetch(limit)
        if df.empty:
            return {"stations": []}
        df = df.reset_index()
        df = df.rename(columns={"id": "wmo"})
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
        if freq == "monthly":
            data = Monthly(station, start_dt, end_dt)
        else:
            data = Daily(station, start_dt, end_dt)
        df = data.fetch()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error descargando datos: {exc}")

    if df.empty:
        raise HTTPException(status_code=404, detail="No hay datos para esta estación y periodo.")

    df = df.reset_index()
    df = df.rename(columns={"time": "date"})
    df["date"] = df["date"].dt.strftime("%Y-%m-%d")

    rename_map = {
        "prcp": "precip_mm",
        "tavg": "temp_mean_C",
        "tmin": "temp_min_C",
        "tmax": "temp_max_C",
        "wspd": "wind_mean_kmh",
        "wpgt": "wind_peak_kmh",
        "pres": "pressure_hPa",
        "tsun": "sunshine_min",
        "snow": "snow_mm",
        "wdir": "wind_dir_deg",
    }
    df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})

    for col in df.select_dtypes("float64").columns:
        df[col] = df[col].round(2)

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
    preview = df.head(500)
    columns = list(preview.columns)
    rows = preview.to_dict(orient="records")

    return {
        "station": station,
        "freq": freq,
        "start": start,
        "end": end,
        "n_rows": n_total,
        "columns": columns,
        "preview": rows,
    }
