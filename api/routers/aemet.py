import io
from datetime import datetime

import requests as _requests
import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

router = APIRouter()

AEMET_BASE = "https://opendata.aemet.es/opendata/api"


def _parse_dms(s: str) -> float:
    """Parse AEMET DMS coordinate string (e.g. '402939N', '034406W') to decimal degrees."""
    s = (s or "").strip()
    if not s:
        return 0.0
    hemi = s[-1].upper()
    digits = s[:-1]
    try:
        if len(digits) == 7:   # longitude: DDDMMSS
            deg, mn, sec = int(digits[:3]), int(digits[3:5]), int(digits[5:7])
        else:                   # latitude: DDMMSS
            deg, mn, sec = int(digits[:2]), int(digits[2:4]), int(digits[4:6])
        val = deg + mn / 60.0 + sec / 3600.0
        if hemi in ("S", "W"):
            val = -val
        return round(val, 5)
    except Exception:
        return 0.0


def _to_float(v) -> float | None:
    if v is None:
        return None
    s = str(v).strip()
    if s in ("", "Ip", "Acum", "--", "---", "N.A."):
        return None
    try:
        return float(s.replace(",", "."))
    except Exception:
        return None


def _aemet_fetch(endpoint: str, api_key: str) -> list | dict:
    """2-step AEMET fetch: metadata → datos URL → actual data.

    The api_key is sent both as a query parameter and as an HTTP header
    to maximise compatibility across AEMET API versions.
    Dates in path segments are passed raw (colons are valid in URL paths
    per RFC 3986) to avoid double-encoding issues with requests.
    """
    # Strip trailing slash before appending ?api_key (matches pyhydra convention)
    url1 = f"{AEMET_BASE}{endpoint.rstrip('/')}?api_key={api_key}"

    try:
        r1 = _requests.get(url1, timeout=30)
    except _requests.RequestException as exc:
        raise HTTPException(502, f"Error conectando con AEMET: {exc}")

    # Detect HTML error pages (web-server 404/500) before JSON parsing
    ctype = r1.headers.get("Content-Type", "")
    if "html" in ctype.lower() or r1.text.lstrip().startswith("<"):
        raise HTTPException(
            502,
            f"AEMET devolvió una página HTML en lugar de JSON (HTTP {r1.status_code}). "
            "Comprueba que la API key es válida y que el endpoint existe.",
        )

    if r1.status_code == 401:
        raise HTTPException(401, "API key de AEMET inválida o expirada.")
    if r1.status_code == 429:
        raise HTTPException(429, "Límite de peticiones AEMET excedido (429). Espera un minuto antes de reintentar.")
    if r1.status_code not in (200, 404):
        raise HTTPException(r1.status_code, f"AEMET error {r1.status_code}: {r1.text[:300]}")

    try:
        meta = r1.json()
    except Exception:
        raise HTTPException(502, f"AEMET: respuesta no-JSON inesperada: {r1.text[:200]}")

    estado = int(meta.get("estado", 0))
    if estado == 401:
        raise HTTPException(401, "API key de AEMET inválida.")
    if estado == 404:
        raise HTTPException(404, meta.get("descripcion", "No hay datos para el periodo o estación solicitada."))
    if estado == 429:
        raise HTTPException(429, meta.get("descripcion", "Límite de peticiones AEMET excedido. Espera un minuto antes de reintentar."))
    if estado != 200:
        raise HTTPException(400, meta.get("descripcion", f"AEMET error estado {estado}"))

    datos_url = meta.get("datos")
    if not datos_url:
        raise HTTPException(502, "AEMET no devolvió URL de datos.")

    try:
        r2 = _requests.get(datos_url, timeout=60)
    except _requests.RequestException as exc:
        raise HTTPException(502, f"Error descargando datos de AEMET: {exc}")

    if r2.status_code != 200:
        raise HTTPException(r2.status_code, f"Error descargando datos AEMET ({r2.status_code}).")

    try:
        return r2.json()
    except Exception:
        raise HTTPException(502, f"AEMET datos: respuesta no-JSON ({r2.text[:200]})")


@router.get("/stations")
def get_stations(api_key: str = Query(..., description="API key de AEMET OpenData")):
    raw = _aemet_fetch("/valores/climatologicos/inventarioestaciones/todasestaciones/", api_key)
    stations = []
    for s in (raw if isinstance(raw, list) else []):
        lat = _parse_dms(s.get("latitud", ""))
        lon = _parse_dms(s.get("longitud", ""))
        if lat == 0.0 and lon == 0.0:
            continue
        stations.append({
            "indicativo": s.get("indicativo", ""),
            "nombre":     s.get("nombre", ""),
            "provincia":  s.get("provincia", ""),
            "altitud":    _to_float(s.get("altitud")),
            "latitude":   lat,
            "longitude":  lon,
        })
    return {"stations": stations, "total": len(stations)}


@router.get("/data")
def get_data(
    station:  str  = Query(..., description="Indicativo AEMET de la estación"),
    start:    str  = Query(..., description="Fecha inicio YYYY-MM-DD"),
    end:      str  = Query(..., description="Fecha fin YYYY-MM-DD"),
    freq:     str  = Query("daily", description="Frecuencia: daily | hourly"),
    api_key:  str  = Query(..., description="API key de AEMET OpenData"),
    download: bool = Query(False),
):
    try:
        start_dt = datetime.strptime(start, "%Y-%m-%d")
        end_dt   = datetime.strptime(end,   "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, "Formato de fecha inválido. Usa YYYY-MM-DD.")
    if end_dt < start_dt:
        raise HTTPException(400, "La fecha de fin debe ser posterior a la de inicio.")

    # Colons are valid in URL path segments (RFC 3986 §3.3) — no quoting needed.
    fi = start_dt.strftime("%Y-%m-%dT00:00:00UTC")
    ff = end_dt.strftime("%Y-%m-%dT23:59:59UTC")

    if freq == "hourly":
        endpoint = f"/valores/climatologicos/horarios/datos/fechaini/{fi}/fechafin/{ff}/estacion/{station}/"
    else:
        endpoint = f"/valores/climatologicos/diarios/datos/fechaini/{fi}/fechafin/{ff}/estacion/{station}/"

    raw = _aemet_fetch(endpoint, api_key)

    if not raw or not isinstance(raw, list):
        raise HTTPException(404, "No hay datos para esta estación y periodo.")

    df = pd.DataFrame(raw)

    if freq == "hourly":
        keep = {
            "fecha": "fecha",
            "hora":  "hora",
            "prec":  "prec_mm",
            "vv":    "viento_ms",
            "dv":    "dir_viento_deg",
            "ta":    "temp_C",
            "hr":    "humedad_pct",
            "ap":    "presion_hPa",
        }
    else:
        keep = {
            "fecha":    "fecha",
            "prec":     "prec_mm",
            "tmed":     "tmed_C",
            "tmin":     "tmin_C",
            "tmax":     "tmax_C",
            "velmedia": "viento_kmh",
            "racha":    "racha_kmh",
            "sol":      "sol_h",
            "presMax":  "presMax_hPa",
            "presMin":  "presMin_hPa",
        }

    cols = {k: v for k, v in keep.items() if k in df.columns}
    df = df[list(cols)].rename(columns=cols)

    for col in df.columns:
        if col not in ("fecha", "hora"):
            df[col] = df[col].apply(_to_float)

    df = df.sort_values("fecha").reset_index(drop=True)

    if download:
        freq_label = "horario" if freq == "hourly" else "diario"
        fname = f"aemet_{station}_{start}_{end}_{freq_label}.csv"
        return StreamingResponse(
            io.BytesIO(df.to_csv(index=False).encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{fname}"'},
        )

    n_total = len(df)
    return {
        "station": station,
        "freq":    freq,
        "start":   start,
        "end":     end,
        "n_rows":  n_total,
        "columns": list(df.columns),
        "preview": df.to_dict(orient="records"),
    }
