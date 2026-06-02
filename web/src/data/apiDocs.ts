export type I18n = { es: string; en: string };

export interface ApiParam {
  name: string;
  type: string;
  default?: string;
  description: I18n;
}

export interface ApiMethod {
  name: string;
  signature: string;
  description: I18n;
  params?: ApiParam[];
  returns?: I18n;
  example?: string;
}

export interface ApiItem {
  kind: 'class' | 'function';
  name: string;
  module: string;
  description: I18n;
  params?: ApiParam[];
  returns?: I18n;
  methods?: ApiMethod[];
  note?: I18n;
  example?: string;
}

export interface ModuleApiDocs {
  slug: string;
  items: ApiItem[];
}

export const apiDocs: ModuleApiDocs[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FUENTES DE DATOS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'fuentes-datos',
    items: [
      // ── OGIMET ──────────────────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'OGIMETDownloader',
        module: 'pyhydra.data_sources.rainfall.ogimet',
        description: {
          es: 'Widget Jupyter interactivo para seleccionar estaciones SYNOP en un mapa y descargar series temporales con un solo clic.',
          en: 'Interactive Jupyter widget to select SYNOP stations on a map and download time series with a single click.',
        },
        params: [
          { name: 'stations_csv', type: 'str | None', default: 'None', description: { es: 'Ruta al CSV con metadatos de estaciones. Si es None usa el CSV incluido en el paquete.', en: 'Path to the CSV with station metadata. If None, uses the CSV bundled with the package.' } },
          { name: 'output_dir', type: 'str', default: '"."', description: { es: 'Directorio de salida para los archivos descargados.', en: 'Output directory for downloaded files.' } },
        ],
        methods: [
          { name: 'display', signature: 'display() → None', description: { es: 'Muestra el widget completo (mapa ipyleaflet + controles de fecha + botones) en el notebook.', en: 'Renders the full widget (ipyleaflet map + date controls + buttons) in the notebook.' } },
        ],
        example: `from pyhydra.data_sources.rainfall.ogimet import OGIMETDownloader
widget = OGIMETDownloader(output_dir="./datos_sinopticos")
widget.display()`,
      },
      {
        kind: 'function',
        name: 'download_synop',
        module: 'pyhydra.data_sources.rainfall.ogimet',
        description: {
          es: 'Descarga datos SYNOP diarios de una estación desde ogimet.com. Procesa la respuesta HTML y devuelve un DataFrame con variables meteorológicas con índice multi-nivel.',
          en: 'Downloads daily SYNOP data for a station from ogimet.com. Parses the HTML response and returns a DataFrame with meteorological variables and a multi-level index.',
        },
        params: [
          { name: 'station_id', type: 'int | str', description: { es: 'Código SYNOP numérico (ej. 8023).', en: 'Numeric SYNOP code (e.g. 8023).' } },
          { name: 'start_date', type: 'str | datetime', description: { es: 'Fecha de inicio.', en: 'Start date.' } },
          { name: 'end_date', type: 'str | datetime', description: { es: 'Fecha de fin.', en: 'End date.' } },
          { name: 'progress', type: 'IntProgress | None', default: 'None', description: { es: 'Widget ipywidgets para mostrar progreso.', en: 'ipywidgets IntProgress widget to display download progress.' } },
          { name: 'cancel_flag', type: 'dict | None', default: 'None', description: { es: 'Dict con clave "cancel": True para interrumpir desde otro hilo.', en: 'Dict with key "cancel": True to interrupt from another thread.' } },
        ],
        returns: { es: 'pd.DataFrame con columnas multi-nivel, o None si la descarga falla.', en: 'pd.DataFrame with multi-level columns, or None if the download fails.' },
        example: `from pyhydra.data_sources.rainfall.ogimet import download_synop
df_raw = download_synop(8023, "2020-01-01", "2020-12-31")`,
      },
      {
        kind: 'function',
        name: 'process_all_meteorological_variables',
        module: 'pyhydra.data_sources.rainfall.ogimet',
        description: {
          es: "Convierte un DataFrame bruto de OGIMET a una serie diaria limpia. Convierte direcciones de viento, gestiona precipitación traza ('ip') y agrega observaciones 3-horarias a diarias.",
          en: "Converts a raw OGIMET DataFrame to a clean daily series. Converts wind directions, handles trace precipitation ('ip'), and aggregates 3-hourly observations to daily.",
        },
        params: [
          { name: 'df', type: 'pd.DataFrame', description: { es: 'DataFrame bruto de download_synop().', en: 'Raw DataFrame from download_synop().' } },
        ],
        returns: { es: 'pd.DataFrame con columnas limpias y una fila por día.', en: 'pd.DataFrame with clean columns and one row per day.' },
        example: `from pyhydra.data_sources.rainfall.ogimet import process_all_meteorological_variables
daily = process_all_meteorological_variables(df_raw)`,
      },
      // ── AEMET ────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_aemet_daily_data',
        module: 'pyhydra.data_sources.rainfall.aemet',
        description: {
          es: 'Descarga datos climatológicos diarios de todas las estaciones AEMET mediante la API OpenData. Almacena los resultados en NetCDF particionados por chunk temporal.',
          en: 'Downloads daily climatological data from all AEMET stations via the OpenData API. Stores results in NetCDF files partitioned by temporal chunk.',
        },
        params: [
          { name: 'path_output', type: 'str', description: { es: 'Directorio para los archivos NetCDF.', en: 'Directory for NetCDF output files.' } },
          { name: 'api_key', type: 'str', description: { es: 'Clave de API AEMET OpenData.', en: 'AEMET OpenData API key.' } },
          { name: 'start_date_str', type: 'str', description: { es: "Fecha inicio '%Y-%m-%dT%H:%M:%S[UTC]'.", en: "Start date '%Y-%m-%dT%H:%M:%S[UTC]'." } },
          { name: 'end_date_str', type: 'str', description: { es: 'Fecha fin, mismo formato.', en: 'End date, same format.' } },
          { name: 'interval_days', type: 'int', default: '15', description: { es: 'Chunk en días (límite API AEMET = 15).', en: 'Chunk size in days (AEMET API limit = 15).' } },
        ],
        returns: { es: 'None. Archivos escritos en path_output.', en: 'None. Files written to path_output.' },
        note: { es: 'Requiere API key gratuita en https://opendata.aemet.es', en: 'Requires a free API key at https://opendata.aemet.es' },
        example: `from pyhydra.data_sources.rainfall.aemet import download_aemet_daily_data
download_aemet_daily_data(
    path_output="./aemet/",
    api_key="tu_api_key",
    start_date_str="2000-01-01T00:00:00UTC",
    end_date_str="2023-12-31T00:00:00UTC",
)`,
      },
      // ── ERA5 ─────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_era5',
        module: 'pyhydra.data_sources.rainfall.era5',
        description: {
          es: 'Descarga datos ERA5 del Copernicus CDS para un rango de años y meses. Soporta descarga paralela por hilo y guarda archivos NetCDF combinados.',
          en: 'Downloads ERA5 data from the Copernicus CDS for a range of years and months. Supports parallel download threads and saves combined NetCDF files.',
        },
        params: [
          { name: 'folder_out', type: 'str', description: { es: 'Directorio de salida.', en: 'Output directory.' } },
          { name: 'api_key', type: 'str', description: { es: 'Clave API de Copernicus CDS.', en: 'Copernicus CDS API key.' } },
          { name: 'url', type: 'str', description: { es: 'URL del CDS API.', en: 'CDS API URL.' } },
          { name: 'area', type: 'list[float]', description: { es: 'Bounding box [N, W, S, E] en grados.', en: 'Bounding box [N, W, S, E] in degrees.' } },
          { name: 'variables_list', type: 'list[str]', description: { es: 'Lista de nombres de variables CDS.', en: 'List of CDS variable names.' } },
          { name: 'years', type: 'list[int] | range', description: { es: 'Años a descargar.', en: 'Years to download.' } },
          { name: 'months', type: 'range', default: 'range(1, 13)', description: { es: 'Meses a descargar.', en: 'Months to download.' } },
          { name: 'max_workers', type: 'int', default: '5', description: { es: 'Hilos de descarga paralela.', en: 'Parallel download threads.' } },
          { name: 'file_format', type: 'str', default: '"netcdf"', description: { es: "Formato de salida: 'netcdf' o 'grib'.", en: "Output format: 'netcdf' or 'grib'." } },
          { name: 'frequency', type: 'str', default: '"hourly"', description: { es: "'hourly' o 'monthly'.", en: "'hourly' or 'monthly'." } },
        ],
        returns: { es: 'None. Archivos NetCDF escritos en folder_out.', en: 'None. NetCDF files written to folder_out.' },
        note: { es: 'Requiere: pip install cdsapi y fichero ~/.cdsapirc con credenciales CDS.', en: 'Requires: pip install cdsapi and ~/.cdsapirc with CDS credentials.' },
        example: `from pyhydra.data_sources.rainfall.era5 import download_era5
download_era5(
    folder_out="./era5/",
    api_key="tu_uid:tu_api_key",
    url="https://cds.climate.copernicus.eu/api/v2",
    area=[44, -10, 35, 5],
    variables_list=["total_precipitation", "2m_temperature"],
    years=range(2000, 2024),
    frequency="monthly",
)`,
      },
      // ── GPM ──────────────────────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'GPMDownloader',
        module: 'pyhydra.data_sources.rainfall.gpm',
        description: {
          es: 'Descarga y extrae datos GPM IMERG desde NASA Earthdata. Soporta resolución horaria, diaria y mensual. Puede extraer series puntuales o subconjuntos espaciales.',
          en: 'Downloads and extracts GPM IMERG data from NASA Earthdata. Supports hourly, daily and monthly resolution. Can extract point time series or spatial subsets.',
        },
        note: { es: 'Requiere: pip install earthaccess tqdm xarray y credenciales NASA Earthdata.', en: 'Requires: pip install earthaccess tqdm xarray and NASA Earthdata credentials.' },
        methods: [
          {
            name: 'set_region',
            signature: 'set_region(points=None, lat_bounds=None, lon_bounds=None) → None',
            description: { es: 'Define la región espacial de descarga.', en: 'Defines the spatial region for download.' },
            params: [
              { name: 'points', type: 'list[tuple]', description: { es: 'Lista de tuplas (lat, lon) para extracción puntual.', en: 'List of (lat, lon) tuples for point extraction.' } },
              { name: 'lat_bounds', type: 'tuple[float, float]', description: { es: '(lat_min, lat_max) para región rectangular.', en: '(lat_min, lat_max) for a rectangular region.' } },
              { name: 'lon_bounds', type: 'tuple[float, float]', description: { es: '(lon_min, lon_max) para región rectangular.', en: '(lon_min, lon_max) for a rectangular region.' } },
            ],
          },
          {
            name: 'search',
            signature: "search(start_date, end_date, resolution='hourly') → list",
            description: { es: 'Busca los gránulos disponibles en el rango temporal y región definida.', en: 'Searches for available granules in the given time range and defined region.' },
            params: [
              { name: 'start_date', type: 'str', description: { es: "Fecha inicio 'YYYY-MM-DD'.", en: "Start date 'YYYY-MM-DD'." } },
              { name: 'end_date', type: 'str', description: { es: 'Fecha fin.', en: 'End date.' } },
              { name: 'resolution', type: 'str', default: '"hourly"', description: { es: "'hourly', 'daily', o 'monthly'.", en: "'hourly', 'daily', or 'monthly'." } },
            ],
            returns: { es: 'Lista de gránulos earthaccess.', en: 'List of earthaccess granules.' },
          },
          {
            name: 'open_dataset',
            signature: "open_dataset(results, variable='precipitation', ...) → pd.DataFrame | None",
            description: { es: 'Descarga, procesa y guarda los gránulos GPM.', en: 'Downloads, processes and saves GPM granules.' },
            params: [
              { name: 'results', type: 'list', description: { es: 'Gránulos de search().', en: 'Granules from search().' } },
              { name: 'variable', type: 'str', default: '"precipitation"', description: { es: 'Variable a extraer.', en: 'Variable to extract.' } },
              { name: 'output_folder', type: 'str', default: '"outputs"', description: { es: 'Directorio de salida.', en: 'Output directory.' } },
            ],
            returns: { es: 'DataFrame de series temporales si se extraen puntos, None si se guardan NetCDF.', en: 'DataFrame of time series if extracting points, None if saving NetCDF.' },
          },
        ],
        example: `from pyhydra.data_sources.rainfall.gpm import GPMDownloader
gpm = GPMDownloader()
gpm.set_region(lat_bounds=(36, 44), lon_bounds=(-10, 4))
results = gpm.search("2020-01-01", "2020-12-31", resolution="daily")
gpm.open_dataset(results, output_folder="./gpm_data")`,
      },
      // ── PERSIANN ─────────────────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'PERSSIANDownloader',
        module: 'pyhydra.data_sources.rainfall.persiann',
        description: {
          es: 'Descarga datos PERSIANN-CCS desde el servidor FTP de UCI. Resolución 0.04° global (60°S–60°N). Soporta modo puntual y modo área.',
          en: 'Downloads PERSIANN-CCS data from the UCI FTP server. Resolution 0.04° global (60°S–60°N). Supports point and area modes.',
        },
        params: [
          { name: 'lon', type: 'float | list[float] | None', default: 'None', description: { es: 'Longitud(es) para extracción puntual.', en: 'Longitude(s) for point extraction.' } },
          { name: 'lat', type: 'float | list[float] | None', default: 'None', description: { es: 'Latitud(es) para extracción puntual.', en: 'Latitude(s) for point extraction.' } },
          { name: 'lon_min/lon_max', type: 'float', description: { es: 'Límites de longitud para modo área.', en: 'Longitude bounds for area mode.' } },
          { name: 'lat_min/lat_max', type: 'float', description: { es: 'Límites de latitud para modo área.', en: 'Latitude bounds for area mode.' } },
          { name: 'path_output', type: 'str', default: '"output"', description: { es: 'Directorio de salida.', en: 'Output directory.' } },
          { name: 'max_workers', type: 'int', default: '2', description: { es: 'Hilos FTP paralelos.', en: 'Parallel FTP threads.' } },
        ],
        methods: [
          {
            name: 'download_daily',
            signature: 'download_daily(start_date, end_date) → pd.Series | None',
            description: { es: 'Descarga acumulados diarios. En modo puntual devuelve Series; en modo área guarda NetCDF.', en: 'Downloads daily totals. In point mode returns a Series; in area mode saves NetCDF.' },
          },
          {
            name: 'download_hourly',
            signature: 'download_hourly(start_date, end_date) → pd.Series | None',
            description: { es: 'Descarga datos horarios.', en: 'Downloads hourly data.' },
          },
        ],
        example: `from pyhydra.data_sources.rainfall.persiann import PERSSIANDownloader
dl = PERSSIANDownloader(lon=-3.7, lat=40.4, path_output="./persiann")
series = dl.download_daily("2015-01-01", "2015-12-31")`,
      },
      // ── GloFAS ───────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_glofas',
        module: 'pyhydra.data_sources.river_discharge.glofas',
        description: {
          es: 'Descarga datos de caudal GloFAS (reanálisis, repronóstico u operacional) desde el Copernicus EWDS. Envía una única petición CDS para todos los años y meses seleccionados.',
          en: 'Downloads GloFAS streamflow data (reanalysis, reforecast or operational) from the Copernicus EWDS. Sends a single CDS request for all selected years and months.',
        },
        params: [
          { name: 'area', type: 'list[float]', description: { es: 'Bounding box [Norte, Oeste, Sur, Este] en grados decimales.', en: 'Bounding box [North, West, South, East] in decimal degrees.' } },
          { name: 'years', type: 'list[int] | range', description: { es: 'Años a descargar.', en: 'Years to download.' } },
          { name: 'output_dir', type: 'str', description: { es: 'Directorio de salida.', en: 'Output directory.' } },
          { name: 'dataset', type: 'str', default: '"cems-glofas-historical"', description: { es: "'cems-glofas-historical', 'cems-glofas-reforecast', o 'cems-glofas-forecast'.", en: "'cems-glofas-historical', 'cems-glofas-reforecast', or 'cems-glofas-forecast'." } },
          { name: 'system_version', type: 'str', default: '"version_4_0"', description: { es: 'Versión del sistema GloFAS.', en: 'GloFAS system version.' } },
          { name: 'months', type: 'list[int] | None', default: 'None', description: { es: 'Lista de meses 1–12. Por defecto todos.', en: 'List of months 1–12. Default: all.' } },
          { name: 'api_key', type: 'str | None', default: 'None', description: { es: 'Clave CDS. Si None lee de ~/.cdsapirc.', en: 'CDS key. If None reads from ~/.cdsapirc.' } },
        ],
        returns: { es: 'Lista de rutas a los archivos descargados.', en: 'List of paths to downloaded files.' },
        note: { es: 'Requiere: pip install cdsapi y cuenta en https://ewds.climate.copernicus.eu', en: 'Requires: pip install cdsapi and an account at https://ewds.climate.copernicus.eu' },
        example: `from pyhydra.data_sources.river_discharge.glofas import download_glofas
rutas = download_glofas(
    area=[44, -10, 35, 5],
    years=[2000, 2001, 2002],
    output_dir="./glofas_data",
)`,
      },
      {
        kind: 'function',
        name: 'download_glofas_by_year',
        module: 'pyhydra.data_sources.river_discharge.glofas',
        description: {
          es: 'Igual que download_glofas pero envía una petición CDS por año, evitando peticiones muy grandes que pueden agotar el tiempo del servidor.',
          en: 'Same as download_glofas but sends one CDS request per year, avoiding very large requests that may time out on the server.',
        },
        params: [
          { name: 'area', type: 'list[float]', description: { es: 'Bounding box [N, O, S, E].', en: 'Bounding box [N, W, S, E].' } },
          { name: 'years', type: 'list[int] | range', description: { es: 'Años a descargar (uno por archivo).', en: 'Years to download (one file per year).' } },
          { name: 'output_dir', type: 'str', description: { es: 'Directorio de salida.', en: 'Output directory.' } },
          { name: 'dataset', type: 'str', default: '"cems-glofas-historical"', description: { es: 'Dataset CDS.', en: 'CDS dataset.' } },
        ],
        returns: { es: 'Lista de rutas (una por año).', en: 'List of file paths (one per year).' },
      },
      {
        kind: 'function',
        name: 'read_glofas_nc',
        module: 'pyhydra.data_sources.river_discharge.glofas',
        description: {
          es: 'Extrae una serie temporal de caudal de un archivo NetCDF de GloFAS en un punto geográfico.',
          en: 'Extracts a streamflow time series from a GloFAS NetCDF file at a geographic point.',
        },
        params: [
          { name: 'filepath', type: 'str', description: { es: 'Ruta al archivo .nc de GloFAS.', en: 'Path to the GloFAS .nc file.' } },
          { name: 'lat', type: 'float', description: { es: 'Latitud del punto (grados decimales).', en: 'Latitude of the point (decimal degrees).' } },
          { name: 'lon', type: 'float', description: { es: 'Longitud del punto.', en: 'Longitude of the point.' } },
          { name: 'variable', type: 'str', default: '"dis24"', description: { es: 'Nombre de la variable NetCDF de caudal.', en: 'Name of the NetCDF streamflow variable.' } },
        ],
        returns: { es: "pd.DataFrame con columnas 'date' y 'discharge' (m³/s).", en: "pd.DataFrame with columns 'date' and 'discharge' (m³/s)." },
      },
      // ── GRDC ─────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'read_grdc',
        module: 'pyhydra.data_sources.river_discharge.grdc',
        description: {
          es: 'Parsea un archivo GRDC diario o mensual (.day / .mon) a un DataFrame ordenado. El formato GRDC usa valores centinela (-999) para datos faltantes.',
          en: 'Parses a GRDC daily or monthly file (.day / .mon) into a tidy DataFrame. The GRDC format uses sentinel values (-999) for missing data.',
        },
        params: [
          { name: 'filepath', type: 'str', description: { es: 'Ruta al archivo .day o .mon de GRDC.', en: 'Path to the GRDC .day or .mon file.' } },
        ],
        returns: { es: "pd.DataFrame con columnas 'date' (Timestamp) y 'discharge' (m³/s, NaN donde faltan datos).", en: "pd.DataFrame with columns 'date' (Timestamp) and 'discharge' (m³/s, NaN where missing)." },
        note: { es: 'Los datos GRDC se solicitan manualmente en https://portal.grdc.bafg.de — no hay API de descarga.', en: 'GRDC data must be requested manually at https://portal.grdc.bafg.de — no download API.' },
        example: `from pyhydra.data_sources.river_discharge.grdc import read_grdc, analyze_grdc_quality
df = read_grdc("6335020_Q_Day.Cmd.day")
stats = analyze_grdc_quality(df)`,
      },
      {
        kind: 'function',
        name: 'read_grdc_metadata',
        module: 'pyhydra.data_sources.river_discharge.grdc',
        description: { es: 'Extrae metadatos de estación del cabecero del archivo GRDC (nombre, río, país, lat/lon, cuenca).', en: 'Extracts station metadata from the GRDC file header (name, river, country, lat/lon, basin).' },
        params: [{ name: 'filepath', type: 'str', description: { es: 'Ruta al archivo GRDC.', en: 'Path to the GRDC file.' } }],
        returns: { es: "Dict con claves 'station', 'river', 'country', 'latitude', 'longitude', 'altitude_m', 'catchment_area_km2', 'grdc_no'.", en: "Dict with keys 'station', 'river', 'country', 'latitude', 'longitude', 'altitude_m', 'catchment_area_km2', 'grdc_no'." },
      },
      {
        kind: 'function',
        name: 'read_grdc_folder',
        module: 'pyhydra.data_sources.river_discharge.grdc',
        description: { es: 'Lee todos los archivos GRDC de una carpeta que coincidan con un patrón glob.', en: 'Reads all GRDC files in a folder matching a glob pattern.' },
        params: [
          { name: 'folder', type: 'str', description: { es: 'Directorio con archivos GRDC.', en: 'Directory containing GRDC files.' } },
          { name: 'pattern', type: 'str', default: '"*.day"', description: { es: "Patrón glob. Usar '*.mon' para mensual.", en: "Glob pattern. Use '*.mon' for monthly." } },
        ],
        returns: { es: 'Dict nombre_archivo → DataFrame.', en: 'Dict filename → DataFrame.' },
      },
      {
        kind: 'function',
        name: 'analyze_grdc_quality',
        module: 'pyhydra.data_sources.river_discharge.grdc',
        description: { es: 'Estadísticas básicas de calidad de una serie GRDC: fecha inicio/fin, días totales, % faltantes, media y máximo.', en: 'Basic quality statistics for a GRDC series: start/end date, total days, % missing, mean and maximum.' },
        params: [{ name: 'df', type: 'pd.DataFrame', description: { es: 'Salida de read_grdc().', en: 'Output of read_grdc().' } }],
        returns: { es: "Dict con claves 'start', 'end', 'n_days', 'missing_pct', 'mean_m3s', 'max_m3s'.", en: "Dict with keys 'start', 'end', 'n_days', 'missing_pct', 'mean_m3s', 'max_m3s'." },
      },
      // ── USGS ─────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_usgs',
        module: 'pyhydra.data_sources.river_discharge.usgs',
        description: {
          es: 'Descarga caudal diario medio de una o más estaciones USGS NWIS (sin registro requerido). Los valores de caudal se convierten de ft³/s a m³/s por defecto.',
          en: 'Downloads mean daily streamflow from one or more USGS NWIS stations (no registration required). Flow values are converted from ft³/s to m³/s by default.',
        },
        params: [
          { name: 'site_no', type: 'str | list[str]', description: { es: "Número(s) de estación USGS (ej. '08279500').", en: "USGS station number(s) (e.g. '08279500')." } },
          { name: 'start_date', type: 'str', description: { es: "Fecha inicio 'YYYY-MM-DD'.", en: "Start date 'YYYY-MM-DD'." } },
          { name: 'end_date', type: 'str', description: { es: 'Fecha fin.', en: 'End date.' } },
          { name: 'units', type: 'str', default: '"metric"', description: { es: "'metric' (m³/s) o 'imperial' (ft³/s).", en: "'metric' (m³/s) or 'imperial' (ft³/s)." } },
          { name: 'max_retries', type: 'int', default: '3', description: { es: 'Reintentos por petición fallida.', en: 'Retries per failed request.' } },
        ],
        returns: { es: "pd.DataFrame con DatetimeIndex y columnas 'Q_<site_no>' por estación.", en: "pd.DataFrame with DatetimeIndex and columns 'Q_<site_no>' per station." },
        example: `from pyhydra.data_sources.river_discharge.usgs import download_usgs, search_usgs_sites
# Buscar estaciones en el río Colorado
estaciones = search_usgs_sites(bbox=(-115, 31, -110, 37))
# Descargar caudal
df = download_usgs(["09380000", "09163500"], "2010-01-01", "2020-12-31")`,
      },
      {
        kind: 'function',
        name: 'search_usgs_sites',
        module: 'pyhydra.data_sources.river_discharge.usgs',
        description: { es: 'Encuentra estaciones USGS de caudal dentro de un bounding box.', en: 'Finds USGS streamflow stations within a bounding box.' },
        params: [
          { name: 'bbox', type: 'tuple[float, float, float, float]', description: { es: '(west, south, east, north) en grados decimales.', en: '(west, south, east, north) in decimal degrees.' } },
          { name: 'parameter_cd', type: 'str', default: '"00060"', description: { es: "Código de parámetro NWIS. '00060' = caudal.", en: "NWIS parameter code. '00060' = discharge." } },
        ],
        returns: { es: "pd.DataFrame con columnas 'site_no', 'station_nm', 'dec_lat_va', 'dec_long_va', 'drain_area_km2'.", en: "pd.DataFrame with columns 'site_no', 'station_nm', 'dec_lat_va', 'dec_long_va', 'drain_area_km2'." },
      },
      // ── SoilGrids ─────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_soilgrids',
        module: 'pyhydra.data_sources.soils.soilgrids',
        description: {
          es: 'Descarga los GeoTIFF de arena/limo/arcilla de SoilGrids 2017 (ISRIC, 250 m) para 7 profundidades de suelo. Total 21 capas.',
          en: 'Downloads SoilGrids 2017 (ISRIC, 250 m) sand/silt/clay GeoTIFFs for 7 soil depths. Total of 21 layers.',
        },
        params: [
          { name: 'output_dir', type: 'str', description: { es: 'Directorio de destino (se crea si no existe).', en: 'Destination directory (created if absent).' } },
          { name: 'max_retries', type: 'int', default: '10', description: { es: 'Intentos por archivo.', en: 'Attempts per file.' } },
          { name: 'include_metadata', type: 'bool', default: 'False', description: { es: 'También descargar archivos XML y CSV de metadatos.', en: 'Also download XML and CSV metadata files.' } },
        ],
        returns: { es: 'None. Archivos escritos en output_dir.', en: 'None. Files written to output_dir.' },
        example: `from pyhydra.data_sources.soils.soilgrids import download_soilgrids
download_soilgrids("./soilgrids_data")`,
      },
      // ── CMIP6 ────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'download_CDS_CMIP6',
        module: 'pyhydra.data_sources.climate_change.copernicus',
        description: {
          es: 'Descarga proyecciones CMIP6 del Copernicus CDS con ejecución paralela por año y reintento automático en fallos transitorios.',
          en: 'Downloads CMIP6 projections from Copernicus CDS with parallel execution by year and automatic retry on transient failures.',
        },
        params: [
          { name: 'url', type: 'str', description: { es: 'URL del CDS API.', en: 'CDS API URL.' } },
          { name: 'api_key', type: 'str', description: { es: 'Clave del CDS API.', en: 'CDS API key.' } },
          { name: 'start_date', type: 'str', description: { es: "Año de inicio (ej. '1950-01-01').", en: "Start year (e.g. '1950-01-01')." } },
          { name: 'end_date', type: 'str', description: { es: "Año de fin (ej. '2100-12-31').", en: "End year (e.g. '2100-12-31')." } },
          { name: 'temporal_resolution', type: 'str', description: { es: "'daily' o 'monthly'.", en: "'daily' or 'monthly'." } },
          { name: 'model', type: 'str', description: { es: "Nombre del modelo o 'All' para todos los disponibles.", en: "Model name or 'All' for all available models." } },
          { name: 'experiments', type: 'list[str]', description: { es: "Lista de experimentos (ej. ['historical', 'ssp245', 'ssp585']).", en: "List of experiments (e.g. ['historical', 'ssp245', 'ssp585'])." } },
          { name: 'variables', type: 'list[str]', description: { es: 'Lista de variables CDS CMIP6.', en: 'List of CDS CMIP6 variables.' } },
          { name: 'download_base_dir', type: 'str', description: { es: 'Directorio raíz de descarga.', en: 'Root download directory.' } },
          { name: 'area', type: 'list[float]', description: { es: 'Bounding box [N, W, S, E].', en: 'Bounding box [N, W, S, E].' } },
          { name: 'max_workers', type: 'int', default: '5', description: { es: 'Hilos paralelos por modelo.', en: 'Parallel threads per model.' } },
          { name: 'max_retries', type: 'int', default: '3', description: { es: 'Reintentos por año.', en: 'Retries per year.' } },
        ],
        returns: { es: 'None. Archivos descargados en download_base_dir.', en: 'None. Files downloaded to download_base_dir.' },
        note: { es: 'Requiere: pip install cdsapi y ~/.cdsapirc con credenciales Copernicus CDS.', en: 'Requires: pip install cdsapi and ~/.cdsapirc with Copernicus CDS credentials.' },
      },
      // ── ESGF ─────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'get_dataset_metadata',
        module: 'pyhydra.data_sources.climate_change.esgf',
        description: {
          es: 'Consulta el índice ESGF y devuelve metadatos de los datasets disponibles que coinciden con los filtros dados.',
          en: 'Queries the ESGF index and returns metadata for available datasets matching the given filters.',
        },
        params: [
          { name: 'filters', type: 'dict', description: { es: "Dict de filtros ESGF, por ejemplo {'source_id': 'MPI-ESM1-2-HR', 'experiment_id': 'historical'}.", en: "Dict of ESGF filters, e.g. {'source_id': 'MPI-ESM1-2-HR', 'experiment_id': 'historical'}." } },
          { name: 'limit', type: 'int', default: '5000', description: { es: 'Número máximo de resultados a recuperar.', en: 'Maximum number of results to retrieve.' } },
        ],
        returns: { es: "pd.DataFrame con columnas: dataset_id, model, experiment, variable, variant, table, start, end.", en: "pd.DataFrame with columns: dataset_id, model, experiment, variable, variant, table, start, end." },
        example: `from pyhydra.data_sources.climate_change.esgf import get_dataset_metadata
df = get_dataset_metadata({'source_id': 'MPI-ESM1-2-HR', 'experiment_id': 'ssp585', 'variable_id': 'pr'})`,
      },
      {
        kind: 'function',
        name: 'get_all_urls',
        module: 'pyhydra.data_sources.climate_change.esgf',
        description: {
          es: 'Obtiene todas las URLs de descarga para un dataset ESGF dado su dataset_id. Devuelve tanto enlaces HTTPServer como OPeNDAP.',
          en: 'Retrieves all download URLs for an ESGF dataset given its dataset_id. Returns both HTTPServer and OPeNDAP links.',
        },
        params: [
          { name: 'dataset_id', type: 'str', description: { es: 'Identificador completo del dataset ESGF.', en: 'Full ESGF dataset identifier.' } },
        ],
        returns: { es: "Lista de dicts con claves 'url' y 'url_type' ('HTTPServer' u 'OPeNDAP').", en: "List of dicts with keys 'url' and 'url_type' ('HTTPServer' or 'OPeNDAP')." },
      },
      {
        kind: 'function',
        name: 'get_combination_if_complete',
        module: 'pyhydra.data_sources.climate_change.esgf',
        description: {
          es: 'Verifica si una combinación (modelo, experimento, variante) tiene todas las variables requeridas disponibles en ESGF. Útil para filtrar combinaciones incompletas antes de descargar.',
          en: 'Checks whether a (model, experiment, variant) combination has all required variables available on ESGF. Useful for filtering incomplete combinations before downloading.',
        },
        params: [
          { name: 'model', type: 'str', description: { es: 'Identificador del modelo CMIP6.', en: 'CMIP6 model identifier.' } },
          { name: 'experiment', type: 'str', description: { es: "Experimento CMIP6 (ej. 'historical', 'ssp245').", en: "CMIP6 experiment (e.g. 'historical', 'ssp245')." } },
          { name: 'variant', type: 'str', description: { es: "Etiqueta de variante (ej. 'r1i1p1f1').", en: "Variant label (e.g. 'r1i1p1f1')." } },
          { name: 'variables', type: 'list[str]', description: { es: 'Variables requeridas.', en: 'Required variables.' } },
        ],
        returns: { es: 'Lista de filas de metadata si la combinación está completa, lista vacía si falta alguna variable.', en: 'List of metadata rows if the combination is complete, empty list if any variable is missing.' },
      },
      {
        kind: 'function',
        name: 'download_file',
        module: 'pyhydra.data_sources.climate_change.esgf',
        description: {
          es: 'Descarga un archivo desde una URL HTTPServer de ESGF con reintentos y reanudación parcial.',
          en: 'Downloads a file from an ESGF HTTPServer URL with retries and partial resume support.',
        },
        params: [
          { name: 'url', type: 'str', description: { es: 'URL HTTPServer del archivo a descargar.', en: 'HTTPServer URL of the file to download.' } },
          { name: 'local_path', type: 'str', description: { es: 'Ruta local de destino.', en: 'Local destination path.' } },
          { name: 'chunk_size', type: 'int', default: '1048576', description: { es: 'Tamaño de chunk en bytes (1 MB por defecto).', en: 'Chunk size in bytes (1 MB by default).' } },
          { name: 'max_retries', type: 'int', default: '3', description: { es: 'Número máximo de reintentos.', en: 'Maximum number of retries.' } },
        ],
        returns: { es: 'True si la descarga fue exitosa, False en caso contrario.', en: 'True if the download succeeded, False otherwise.' },
      },
      {
        kind: 'function',
        name: 'process_file',
        module: 'pyhydra.data_sources.climate_change.esgf',
        description: {
          es: 'Descarga (o lee vía OPeNDAP) un archivo CMIP6 desde ESGF, recorta al bounding box indicado y guarda el resultado como NetCDF en path_output.',
          en: 'Downloads (or reads via OPeNDAP) a CMIP6 file from ESGF, clips to the given bounding box and saves the result as NetCDF to path_output.',
        },
        params: [
          { name: 'url', type: 'str', description: { es: 'URL del archivo (HTTPServer u OPeNDAP).', en: 'File URL (HTTPServer or OPeNDAP).' } },
          { name: 'path_output', type: 'str', description: { es: 'Directorio de salida para el NetCDF recortado.', en: 'Output directory for the clipped NetCDF.' } },
          { name: 'lat_min', type: 'float', description: { es: 'Latitud mínima del bounding box.', en: 'Minimum latitude of the bounding box.' } },
          { name: 'lat_max', type: 'float', description: { es: 'Latitud máxima.', en: 'Maximum latitude.' } },
          { name: 'lon_min', type: 'float', description: { es: 'Longitud mínima.', en: 'Minimum longitude.' } },
          { name: 'lon_max', type: 'float', description: { es: 'Longitud máxima.', en: 'Maximum longitude.' } },
          { name: 'url_type', type: 'str', default: '"OPENDAP"', description: { es: "'OPENDAP' o 'HTTPServer'.", en: "'OPENDAP' or 'HTTPServer'." } },
        ],
        returns: { es: "Cadena de estado: '[OK]' si éxito, '[SKIPPED]' si ya existe, '[ERROR] ...' con mensaje de error.", en: "Status string: '[OK]' on success, '[SKIPPED]' if already exists, '[ERROR] ...' with error message." },
        example: `from pyhydra.data_sources.climate_change.esgf import get_dataset_metadata, get_all_urls, process_file
df = get_dataset_metadata({'source_id': 'MPI-ESM1-2-HR', 'experiment_id': 'historical', 'variable_id': 'pr'})
urls = get_all_urls(df.iloc[0]['dataset_id'])
status = process_file(urls[0]['url'], './cmip6/', lat_min=35, lat_max=44, lon_min=-10, lon_max=5)`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANÁLISIS CLIMÁTICO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'analisis-climatico',
    items: [
      // ── Extracción de eventos ─────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'extract_events',
        module: 'pyhydra.climate.time_series.events',
        description: {
          es: 'Punto de entrada unificado para extracción de eventos. Redirige a la función específica según el tipo de variable y el método elegido.',
          en: 'Unified entry point for event extraction. Dispatches to the appropriate function depending on the variable type and chosen method.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie temporal con DatetimeIndex.', en: 'Time series with DatetimeIndex.' } },
          { name: 'threshold', type: 'float', description: { es: 'Umbral de detección de eventos.', en: 'Event detection threshold.' } },
          { name: 'variable', type: 'str', default: '"discharge"', description: { es: "'discharge' o 'precipitation'.", en: "'discharge' or 'precipitation'." } },
          { name: 'method', type: 'str', default: '"spell"', description: { es: "Precipitación: 'spell' (manchas húmedas), 'pot' (picos sobre umbral), 'nday' (acumulación N días).", en: "Precipitation: 'spell' (wet spells), 'pot' (peaks over threshold), 'nday' (N-day accumulation)." } },
          { name: 'threshold2', type: 'float | None', default: 'None', description: { es: 'Caudal: pico mínimo para retener un evento.', en: 'Discharge: minimum peak to retain an event.' } },
          { name: 'min_duration', type: 'int', default: '1', description: { es: 'Precipitación spell: duración mínima del evento (días).', en: 'Precipitation spell: minimum event duration (days).' } },
          { name: 'min_sep', type: 'int', default: '7', description: { es: 'POT: separación máxima entre excedencias del mismo cluster (días).', en: 'POT: maximum gap between exceedances of the same cluster (days).' } },
          { name: 'n_days', type: 'int', default: '3', description: { es: 'N-day: ventana de acumulación en días.', en: 'N-day: accumulation window in days.' } },
        ],
        returns: { es: "Tupla (stats, bounds) — stats: DataFrame con métricas del evento; bounds: DataFrame con columnas 'start', 'end'.", en: "Tuple (stats, bounds) — stats: DataFrame with event metrics; bounds: DataFrame with columns 'start', 'end'." },
        example: `from pyhydra.climate.time_series.events import extract_events
stats, bounds = extract_events(caudal, threshold=200, variable='discharge')
stats_precip, _ = extract_events(precip, threshold=30, variable='precipitation', method='pot')`,
      },
      {
        kind: 'function',
        name: 'extract_discharge_events',
        module: 'pyhydra.climate.time_series.events',
        description: {
          es: 'Identifica eventos de crecida en una serie de caudal mediante el método de puntos de inflexión. Los eventos empiezan antes de que el limbo ascendente cruce el umbral y terminan cuando el limbo descendente baja por debajo.',
          en: 'Identifies flood events in a streamflow series using the inflection-point method. Events start before the rising limb crosses the threshold and end when the falling limb drops below it.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie de caudal con DatetimeIndex.', en: 'Discharge series with DatetimeIndex.' } },
          { name: 'threshold', type: 'float', description: { es: 'Caudal mínimo para definir un evento (m³/s).', en: 'Minimum discharge to define an event (m³/s).' } },
          { name: 'threshold2', type: 'float | None', default: 'None', description: { es: 'Pico mínimo para retener el evento. Por defecto igual a threshold.', en: 'Minimum peak to retain the event. Default: same as threshold.' } },
          { name: 'plot', type: 'bool', default: 'False', description: { es: 'Si True, muestra el evento más grande con marcadores.', en: 'If True, plots the largest event with markers.' } },
        ],
        returns: { es: 'Tupla (stats, bounds). stats: DataFrame con [peak, mean, duration, volume, date_peak]. bounds: DataFrame con [start, end].', en: 'Tuple (stats, bounds). stats: DataFrame with [peak, mean, duration, volume, date_peak]. bounds: DataFrame with [start, end].' },
      },
      {
        kind: 'function',
        name: 'extract_precipitation_events_pot',
        module: 'pyhydra.climate.time_series.events',
        description: {
          es: 'Extrae eventos extremos de precipitación mediante POT con declustering. Identifica excedencias, las agrupa en clusters, retiene el pico de cada cluster y lo expande a la mancha húmeda contigua. Produce eventos aproximadamente independientes, adecuados para ajustar GPD o GEV.',
          en: 'Extracts extreme precipitation events via POT with declustering. Identifies exceedances, groups them into clusters, retains the cluster peak and expands it to the surrounding wet spell. Yields approximately independent events suitable for fitting GPD or GEV.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie de precipitación diaria con DatetimeIndex.', en: 'Daily precipitation series with DatetimeIndex.' } },
          { name: 'threshold', type: 'float', description: { es: 'Precipitación diaria mínima para excedencia POT (mm). Típicamente percentil 90–95 de días lluviosos.', en: 'Minimum daily precipitation for a POT exceedance (mm). Typically the 90–95th percentile of wet days.' } },
          { name: 'min_sep', type: 'int', default: '7', description: { es: 'Máximo gap en días entre excedencias del mismo cluster.', en: 'Maximum gap in days between exceedances of the same cluster.' } },
        ],
        returns: { es: 'Tupla (stats, bounds). stats: DataFrame con [peak, total, duration, mean_intensity, date_peak].', en: 'Tuple (stats, bounds). stats: DataFrame with [peak, total, duration, mean_intensity, date_peak].' },
        example: `from pyhydra.climate.time_series.events import extract_precipitation_events_pot
stats, bounds = extract_precipitation_events_pot(
    precip_diaria, threshold=30.0, min_sep=7
)`,
      },
      {
        kind: 'function',
        name: 'extract_concurrent_events',
        module: 'pyhydra.climate.time_series.events',
        description: {
          es: 'Extrae estadísticos en múltiples estaciones durante las ventanas de eventos detectados en una estación objetivo. Útil para análisis de extremos compuestos/concurrentes y construcción de datasets multivariantes.',
          en: 'Extracts statistics from multiple stations during the event windows detected at a target station. Useful for compound/concurrent extreme analysis and building multivariate datasets.',
        },
        params: [
          { name: 'event_bounds', type: 'pd.DataFrame', description: { es: "Ventanas de eventos con columnas 'start' y 'end' — salida de cualquier extract_*_events().", en: "Event windows with columns 'start' and 'end' — output of any extract_*_events()." } },
          { name: 'series_dict', type: 'dict[str, pd.Series]', description: { es: 'Dict nombre_estacion → pd.Series, todos con el mismo DatetimeIndex.', en: 'Dict station_name → pd.Series, all sharing the same DatetimeIndex.' } },
          { name: 'buffer_days', type: 'int', default: '0', description: { es: 'Extiende cada ventana N días a cada lado para capturar respuestas desfasadas.', en: 'Extends each window by N days on each side to capture lagged responses.' } },
          { name: 'stats', type: 'tuple[str, ...]', default: "('max', 'mean', 'total')", description: { es: "Estadísticos a calcular: 'max', 'mean', 'total'.", en: "Statistics to compute: 'max', 'mean', 'total'." } },
        ],
        returns: { es: "pd.DataFrame con una fila por evento y columnas '<nombre>_max', '<nombre>_mean', '<nombre>_total' por estación.", en: "pd.DataFrame with one row per event and columns '<name>_max', '<name>_mean', '<name>_total' per station." },
      },
      // ── Análisis de extremos ──────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'extract_block_maxima',
        module: 'pyhydra.climate.time_series.extremes',
        description: {
          es: 'Extrae los máximos por bloque de una serie temporal. Equivalente GEV/Block-Maxima para análisis de frecuencia.',
          en: 'Extracts block maxima from a time series. GEV/Block-Maxima equivalent for frequency analysis.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie temporal con DatetimeIndex.', en: 'Time series with DatetimeIndex.' } },
          { name: 'freq', type: 'str', default: '"YE"', description: { es: "Frecuencia de bloque: 'YE' (anual), 'QE' (estacional), 'ME' (mensual).", en: "Block frequency: 'YE' (annual), 'QE' (seasonal), 'ME' (monthly)." } },
        ],
        returns: { es: 'pd.Series con máximos por bloque indexados por fecha de fin de bloque.', en: 'pd.Series of block maxima indexed by block end date.' },
        example: `from pyhydra.climate.time_series.extremes import extract_block_maxima
maximos_anuales = extract_block_maxima(caudal_diario, freq='YE')`,
      },
      {
        kind: 'function',
        name: 'extract_pot',
        module: 'pyhydra.climate.time_series.extremes',
        description: {
          es: 'Extrae picos independientes sobre umbral (POT) para ajuste GPD. Detecta máximos locales e impone independencia mediante ventana mínima de separación.',
          en: 'Extracts independent peaks over threshold (POT) for GPD fitting. Detects local maxima and enforces independence via a minimum separation window.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie temporal con DatetimeIndex.', en: 'Time series with DatetimeIndex.' } },
          { name: 'threshold', type: 'float', description: { es: 'Valor mínimo para que un pico sea retenido.', en: 'Minimum value for a peak to be retained.' } },
          { name: 'min_gap', type: 'int', default: '7', description: { es: 'Pasos mínimos entre picos independientes.', en: 'Minimum steps between independent peaks.' } },
        ],
        returns: { es: 'pd.Series con picos indexados por timestamp.', en: 'pd.Series of peaks indexed by timestamp.' },
      },
      {
        kind: 'function',
        name: 'threshold_stability_plot',
        module: 'pyhydra.climate.time_series.extremes',
        description: {
          es: 'Gráfico de estabilidad del umbral GPD (exceso medio y parámetro de forma vs umbral). Un umbral adecuado es el más bajo donde ambos gráficos son aproximadamente lineales/planos.',
          en: 'GPD threshold stability plot (mean excess and shape parameter vs threshold). A suitable threshold is the lowest where both plots are approximately linear/flat.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie temporal.', en: 'Time series.' } },
          { name: 'thresholds', type: 'ndarray | None', default: 'None', description: { es: 'Umbrales a evaluar. Por defecto percentiles 50–95 en pasos del 1 %.', en: 'Thresholds to evaluate. Default: 50th–95th percentiles in 1% steps.' } },
          { name: 'min_peaks', type: 'int', default: '10', description: { es: 'Excedencias mínimas para incluir un punto.', en: 'Minimum exceedances to include a point.' } },
        ],
        returns: { es: 'pd.DataFrame con columnas: threshold, n_exceed, mean_excess, gpd_shape, gpd_scale.', en: 'pd.DataFrame with columns: threshold, n_exceed, mean_excess, gpd_shape, gpd_scale.' },
      },
      {
        kind: 'function',
        name: 'fit_gev',
        module: 'pyhydra.climate.time_series.extremes',
        description: {
          es: 'Ajusta una GEV a máximos por bloque. MLE robusto con arranque L-moments y varios puntos de inicio, o estimación pura por L-moments.',
          en: 'Fits a GEV to block maxima. Robust MLE with L-moments start and multiple initial points, or pure L-moments estimation.',
        },
        params: [
          { name: 'data', type: 'array-like', description: { es: 'Máximos anuales o por bloque.', en: 'Annual or block maxima.' } },
          { name: 'method', type: 'str', default: '"mle"', description: { es: "'mle', 'lmom', o 'both'.", en: "'mle', 'lmom', or 'both'." } },
          { name: 'xi_bounds', type: 'tuple', default: '(-0.5, 0.8)', description: { es: 'Límites del parámetro de forma para MLE.', en: 'Shape parameter bounds for MLE.' } },
        ],
        returns: { es: 'dict con claves mu (localización), sigma (escala), xi (forma). xi > 0 → Fréchet; xi = 0 → Gumbel; xi < 0 → Weibull.', en: 'dict with keys mu (location), sigma (scale), xi (shape). xi > 0 → Fréchet; xi = 0 → Gumbel; xi < 0 → Weibull.' },
        example: `from pyhydra.climate.time_series.extremes import extract_block_maxima, fit_gev
am = extract_block_maxima(caudal)
params = fit_gev(am, method='mle')  # {'mu': 450, 'sigma': 120, 'xi': 0.08}`,
      },
      // ── RFA ──────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'fit_gev_mle',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Ajusta GEV por MLE con optimización multi-arranque y parámetro de forma acotado. Diseñado para series cortas en análisis regional de frecuencia. Cae a L-moments si MLE falla.',
          en: 'Fits GEV by MLE with multi-start optimisation and bounded shape parameter. Designed for short series in regional frequency analysis. Falls back to L-moments if MLE fails.',
        },
        params: [
          { name: 'data', type: 'array-like', description: { es: 'Array 1D de máximos anuales.', en: '1D array of annual maxima.' } },
          { name: 'xi_bounds', type: 'tuple', default: '(-0.5, 0.8)', description: { es: 'Límites de xi.', en: 'Bounds for xi.' } },
        ],
        returns: { es: 'dict con claves mu, sigma, xi.', en: 'dict with keys mu, sigma, xi.' },
      },
      {
        kind: 'function',
        name: 'fit_gev_lmom',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Ajusta una GEV por el método de L-momentos. Más robusto que MLE para muestras pequeñas (n < 30) aunque sin intervalos de confianza directos.',
          en: 'Fits a GEV by the method of L-moments. More robust than MLE for small samples (n < 30), though without direct confidence intervals.',
        },
        params: [
          { name: 'data', type: 'array-like', description: { es: 'Array 1D de máximos anuales.', en: '1D array of annual maxima.' } },
        ],
        returns: { es: 'dict con claves mu (localización), sigma (escala), xi (forma).', en: 'dict with keys mu (location), sigma (scale), xi (shape).' },
        note: { es: 'Requiere: pip install lmoments3', en: 'Requires: pip install lmoments3' },
      },
      {
        kind: 'function',
        name: 'return_level',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Calcula el nivel de retorno para un periodo T dado a partir de parámetros GEV.',
          en: 'Computes the return level for a given return period T from GEV parameters.',
        },
        params: [
          { name: 'params', type: 'dict', description: { es: 'dict con mu, sigma, xi — salida de fit_gev_mle() o fit_gev_lmom().', en: 'dict with mu, sigma, xi — output of fit_gev_mle() or fit_gev_lmom().' } },
          { name: 'T', type: 'float | array-like', description: { es: 'Periodo(s) de retorno en años.', en: 'Return period(s) in years.' } },
        ],
        returns: { es: 'Nivel de retorno — misma forma que T.', en: 'Return level — same shape as T.' },
        example: `from pyhydra.climate.spatial_analysis.rfa import fit_gev_mle, return_level
params = fit_gev_mle(maximos_anuales)
q100 = return_level(params, 100)`,
      },
      {
        kind: 'function',
        name: 'fit_gev_bayes',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Ajusta una GEV bayesiana mediante MCMC (PyMC + NUTS) para una única estación. Devuelve el posterior completo.',
          en: 'Fits a Bayesian GEV via MCMC (PyMC + NUTS) for a single station. Returns the full posterior.',
        },
        params: [
          { name: 'data', type: 'array-like', description: { es: 'Array 1D de máximos anuales.', en: '1D array of annual maxima.' } },
          { name: 'n_chains', type: 'int', default: '4', description: { es: 'Cadenas MCMC.', en: 'MCMC chains.' } },
          { name: 'n_samples', type: 'int', default: '1000', description: { es: 'Muestras por cadena.', en: 'Samples per chain.' } },
        ],
        returns: { es: 'pd.DataFrame con columnas mu, sigma, xi (muestras del posterior).', en: 'pd.DataFrame with columns mu, sigma, xi (posterior samples).' },
        note: { es: 'Requiere PyMC. Para análisis multi-estación usar HierarchicalGEV.', en: 'Requires PyMC. For multi-station analysis use HierarchicalGEV.' },
      },
      {
        kind: 'function',
        name: 'return_level_bayes',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Calcula la distribución posterior del nivel de retorno para un periodo T a partir de muestras MCMC.',
          en: 'Computes the posterior distribution of the return level for a period T from MCMC samples.',
        },
        params: [
          { name: 'posterior', type: 'pd.DataFrame', description: { es: 'Posterior de fit_gev_bayes() con columnas mu, sigma, xi.', en: 'Posterior from fit_gev_bayes() with columns mu, sigma, xi.' } },
          { name: 'T', type: 'float', description: { es: 'Periodo de retorno en años.', en: 'Return period in years.' } },
          { name: 'credible', type: 'float', default: '0.95', description: { es: 'Amplitud del intervalo creíble.', en: 'Credible interval width.' } },
        ],
        returns: { es: "dict con claves 'median', 'lower', 'upper'.", en: "dict with keys 'median', 'lower', 'upper'." },
      },
      {
        kind: 'function',
        name: 'regional_index_flood',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Normaliza cada serie estacional por su crecida índice (media de máximos anuales). Paso previo al análisis regional de frecuencia.',
          en: 'Normalises each station series by its index flood (mean annual maximum). First step in regional frequency analysis.',
        },
        params: [
          { name: 'data_dict', type: 'dict[str, array-like]', description: { es: 'nombre_estacion → array 1D de máximos anuales.', en: 'station_name → 1D array of annual maxima.' } },
        ],
        returns: { es: 'Tupla (normalised_dict, index_floods_Series) — series normalizadas y crecidas índice por estación.', en: 'Tuple (normalised_dict, index_floods_Series) — normalised series and index floods per station.' },
      },
      {
        kind: 'function',
        name: 'fit_regional_gev',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Ajusta una GEV regional a los datos normalizados y agrupados de todas las estaciones.',
          en: 'Fits a regional GEV to the normalised, pooled data from all stations.',
        },
        params: [
          { name: 'data_dict', type: 'dict[str, array-like]', description: { es: 'nombre_estacion → array 1D de máximos anuales.', en: 'station_name → 1D array of annual maxima.' } },
          { name: 'method', type: 'str', default: '"lmom"', description: { es: "'lmom' o 'mle'.", en: "'lmom' or 'mle'." } },
        ],
        returns: { es: 'Tupla (regional_params_dict, index_floods_Series).', en: 'Tuple (regional_params_dict, index_floods_Series).' },
      },
      {
        kind: 'function',
        name: 'regional_return_levels',
        module: 'pyhydra.climate.spatial_analysis.rfa',
        description: {
          es: 'Calcula los niveles de retorno para T años en cada estación mediante la GEV regional.',
          en: 'Computes T-year return levels at each station using the regional GEV.',
        },
        params: [
          { name: 'data_dict', type: 'dict[str, array-like]', description: { es: 'nombre_estacion → array 1D de máximos anuales.', en: 'station_name → 1D array of annual maxima.' } },
          { name: 'T_values', type: 'tuple[int, ...]', default: '(2, 5, 10, 20, 50, 100)', description: { es: 'Periodos de retorno en años.', en: 'Return periods in years.' } },
          { name: 'method', type: 'str', default: '"lmom"', description: { es: "'lmom' o 'mle'.", en: "'lmom' or 'mle'." } },
        ],
        returns: { es: 'pd.DataFrame (estaciones × periodos T) con niveles de retorno.', en: 'pd.DataFrame (stations × T periods) with return levels.' },
        example: `from pyhydra.climate.spatial_analysis.rfa import regional_return_levels
df = regional_return_levels({'Est_A': am_a, 'Est_B': am_b}, T_values=(10, 50, 100))`,
      },
      // ── Bayesiano jerárquico ──────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'HierarchicalGEV',
        module: 'pyhydra.climate.spatial_analysis.bayes_hierarchical',
        description: {
          es: 'Modelo GEV jerárquico bayesiano estimado por MCMC (PyMC + NUTS). Usa parametrización no centrada para mejor mezcla cuando las series de estación son cortas o heterogéneas. Valores NaN en la matriz de máximos anuales se enmascaran automáticamente.',
          en: 'Bayesian hierarchical GEV model estimated by MCMC (PyMC + NUTS). Uses non-centred parameterisation for better mixing when station series are short or heterogeneous. NaN values in the annual-maxima matrix are automatically masked.',
        },
        params: [
          { name: 'T_values', type: 'tuple[int, ...]', default: '(2, 10, 50, 100)', description: { es: 'Periodos de retorno para cuantiles a posteriori.', en: 'Return periods for posterior quantiles.' } },
          { name: 'n_chains', type: 'int', default: '4', description: { es: 'Cadenas MCMC.', en: 'MCMC chains.' } },
          { name: 'n_samples', type: 'int', default: '1000', description: { es: 'Muestras por cadena tras calentamiento.', en: 'Samples per chain after warm-up.' } },
          { name: 'warmup', type: 'int', default: '1000', description: { es: 'Pasos de calentamiento.', en: 'Warm-up steps.' } },
          { name: 'adapt_delta', type: 'float', default: '0.99', description: { es: 'Target acceptance rate del sampler NUTS.', en: 'Target acceptance rate for the NUTS sampler.' } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(data_dict) → self',
            description: { es: 'Ajusta el modelo jerárquico. Usa PyMC si está instalado; cae automáticamente a PyStan 3.', en: 'Fits the hierarchical model. Uses PyMC if installed; falls back automatically to PyStan 3.' },
            params: [{ name: 'data_dict', type: 'dict[str, array-like]', description: { es: 'nombre_estacion → array 1D de máximos anuales.', en: 'station_name → 1D array of annual maxima.' } }],
          },
          { name: 'posterior_summary', signature: 'posterior_summary() → pd.DataFrame', description: { es: 'Resumen a posteriori: media, SD, HDI 94 %, R-hat por parámetro.', en: 'Posterior summary: mean, SD, 94% HDI, R-hat per parameter.' } },
          { name: 'return_levels', signature: 'return_levels() → pd.DataFrame', description: { es: 'Niveles de retorno a posteriori por estación y periodo T.', en: 'Posterior return levels by station and return period T.' } },
        ],
        note: { es: 'Requiere PyMC (prod/Azure) o PyStan 3 (local). Sin compilación C++ con PyMC.', en: 'Requires PyMC (prod/Azure) or PyStan 3 (local). No C++ compilation with PyMC.' },
        example: `from pyhydra.climate.spatial_analysis.bayes_hierarchical import HierarchicalGEV
model = HierarchicalGEV(T_values=(10, 50, 100), n_chains=4)
model.fit({"Est_A": am_a, "Est_B": am_b, "Est_C": am_c})
print(model.return_levels())`,
      },
      // ── Interpolación ─────────────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'IDWInterpolator',
        module: 'pyhydra.climate.spatial_analysis.interpolation',
        description: { es: 'Interpolación espacial por distancia inversa ponderada (IDW). Implementación pura NumPy, sin dependencias externas.', en: 'Spatial interpolation by inverse distance weighting (IDW). Pure NumPy implementation, no external dependencies.' },
        params: [
          { name: 'power', type: 'float', default: '2.0', description: { es: 'Exponente de decaimiento con la distancia.', en: 'Distance-decay exponent.' } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(data, x_col="lon", y_col="lat", value_col="value") → self',
            description: { es: 'Almacena coordenadas y valores de estación.', en: 'Stores station coordinates and values.' },
          },
          {
            name: 'predict',
            signature: 'predict(grid_data, x_col="lon", y_col="lat") → np.ndarray',
            description: { es: 'Interpola en nuevas ubicaciones.', en: 'Interpolates to new locations.' },
            returns: { es: 'ndarray de forma (n_grid,).', en: 'ndarray of shape (n_grid,).' },
          },
        ],
        example: `from pyhydra.climate.spatial_analysis.interpolation import IDWInterpolator
idw = IDWInterpolator(power=2)
idw.fit(estaciones_df, x_col='lon', y_col='lat', value_col='precip')
grid_values = idw.predict(rejilla_df)`,
      },
      {
        kind: 'class',
        name: 'KrigingInterpolator',
        module: 'pyhydra.climate.spatial_analysis.interpolation',
        description: { es: 'Kriging Universal espacial via pykrige. Estima variograma automáticamente y produce predicción más varianza de error.', en: 'Universal spatial kriging via pykrige. Automatically estimates the variogram and produces prediction plus error variance.' },
        note: { es: 'Requiere: pip install pykrige', en: 'Requires: pip install pykrige' },
        params: [
          { name: 'variogram_model', type: 'str', default: '"spherical"', description: { es: "'spherical', 'gaussian', 'exponential', 'linear'.", en: "'spherical', 'gaussian', 'exponential', 'linear'." } },
          { name: 'drift_terms', type: 'list[str]', default: '["regional_linear"]', description: { es: 'Términos de tendencia para Kriging Universal.', en: 'Drift terms for Universal Kriging.' } },
        ],
        methods: [
          { name: 'fit', signature: 'fit(data, x_col="lon", y_col="lat", value_col="value") → self', description: { es: 'Ajusta el variograma a los datos de estación.', en: 'Fits the variogram to station data.' } },
          { name: 'predict', signature: 'predict(grid_data, x_col="lon", y_col="lat") → tuple[ndarray, ndarray]', description: { es: 'Interpola.', en: 'Interpolates.' }, returns: { es: '(predicciones, varianza_error).', en: '(predictions, error_variance).' } },
        ],
      },
      {
        kind: 'class',
        name: 'GaussianProcessInterpolator',
        module: 'pyhydra.climate.spatial_analysis.interpolation',
        description: { es: 'Regresión por Proceso Gaussiano (GPR) con scikit-learn. Soporta covariables adicionales (altitud, aspecto, etc.).', en: 'Gaussian Process Regression (GPR) with scikit-learn. Supports additional covariates (elevation, aspect, etc.).' },
        note: { es: 'Requiere: pip install scikit-learn', en: 'Requires: pip install scikit-learn' },
        params: [
          { name: 'kernel', type: 'Kernel | None', default: 'None', description: { es: 'Kernel de covarianza. Por defecto RBF + WhiteKernel.', en: 'Covariance kernel. Default: RBF + WhiteKernel.' } },
          { name: 'normalize_y', type: 'bool', default: 'True', description: { es: 'Normalizar la variable respuesta.', en: 'Standardise the response variable.' } },
        ],
        methods: [
          { name: 'fit', signature: 'fit(data, feature_cols, value_col="value") → self', description: { es: 'Ajusta el GP.', en: 'Fits the GP.' }, params: [{ name: 'feature_cols', type: 'list[str]', description: { es: "Columnas features, ej. ['lon', 'lat', 'elev'].", en: "Feature columns, e.g. ['lon', 'lat', 'elev']." } }] },
          { name: 'predict', signature: 'predict(grid_data, feature_cols) → tuple[ndarray, ndarray]', description: { es: 'Predice.', en: 'Predicts.' }, returns: { es: '(media, desviación_estándar).', en: '(mean, standard_deviation).' } },
        ],
      },
      // ── Cópulas ───────────────────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'BivariateCopula',
        module: 'pyhydra.climate.spatial_analysis.copulas',
        description: {
          es: 'Cópula Archimediana bivariante para análisis de periodo de retorno en inundación compuesta. Ajusta marginales univariantes (GEV/log-normal/gamma por AIC) y una cópula paramétrica calibrada por τ de Kendall.',
          en: 'Bivariate Archimedean copula for compound flood return period analysis. Fits univariate marginals (GEV/log-normal/gamma by AIC) and a parametric copula calibrated by Kendall\'s τ.',
        },
        params: [
          { name: 'family', type: 'str', default: '"gumbel"', description: { es: "'gumbel', 'clayton', 'frank'.", en: "'gumbel', 'clayton', 'frank'." } },
          { name: 'marginal_families', type: 'tuple', default: '("gev", "lognorm", "gamma")', description: { es: 'Candidatos de marginal. Se elige el mejor por AIC.', en: 'Marginal candidates. Best selected by AIC.' } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(x, y, labels=("X", "Y")) → self',
            description: { es: 'Ajusta marginales y cópula.', en: 'Fits marginals and copula.' },
            params: [
              { name: 'x', type: 'array-like', description: { es: 'Primera variable.', en: 'First variable.' } },
              { name: 'y', type: 'array-like', description: { es: 'Segunda variable.', en: 'Second variable.' } },
            ],
          },
          { name: 'return_period', signature: 'return_period(x0, y0, scenario="OR") → float', description: { es: 'T = 1 / P(exceedance).', en: 'T = 1 / P(exceedance).' }, params: [{ name: 'scenario', type: 'str', default: '"OR"', description: { es: "'OR': unión; 'AND': intersección.", en: "'OR': union; 'AND': intersection." } }] },
          { name: 'return_period_contour', signature: 'return_period_contour(T, scenario="OR", n_pts=300) → tuple', description: { es: 'Curva iso-T en espacio físico.', en: 'Iso-T curve in physical space.' }, returns: { es: '(x_curva, y_curva).', en: '(x_curve, y_curve).' } },
          { name: 'most_probable_event', signature: 'most_probable_event(T, scenario="OR", n_pts=500) → tuple', description: { es: 'Evento de Diseño Más Probable (MPDE): punto de máxima densidad sobre la curva iso-T.', en: 'Most Probable Design Event (MPDE): point of maximum density on the iso-T curve.' }, returns: { es: '(x_mpde, y_mpde) o (None, None) si el contorno está vacío.', en: '(x_mpde, y_mpde) or (None, None) if the contour is empty.' } },
          { name: 'plot_contours', signature: 'plot_contours(T_list=(2, 5, 10, 25, 50, 100), scenario="both", data=True) → Figure', description: { es: 'Gráfico estándar de periodo de retorno bivariante.', en: 'Standard bivariate return period plot.' } },
        ],
        example: `from pyhydra.climate.spatial_analysis.copulas import BivariateCopula
cop = BivariateCopula(family='gumbel')
cop.fit(caudal, nivel_mar, labels=('Q (m³/s)', 'SL (m)'))
xc, yc = cop.return_period_contour(100, scenario='OR')
x_mpde, y_mpde = cop.most_probable_event(100)`,
      },
      {
        kind: 'class',
        name: 'TrivariateCopula',
        module: 'pyhydra.climate.spatial_analysis.copulas',
        description: {
          es: 'Cópula Archimediana trivariante para análisis de inundación compuesta con tres variables (p.ej. caudal, nivel del mar y precipitación). Ajusta tres marginales y un único parámetro de cópula (exchangeable) estimado mediante la τ de Kendall media de los tres pares.',
          en: 'Trivariate Archimedean copula for compound-flood analysis with three variables (e.g. river discharge, sea level and precipitation). Fits three marginals and a single copula parameter (exchangeable) estimated from the mean pairwise Kendall τ.',
        },
        params: [
          { name: 'family', type: 'str', default: '"gumbel"', description: { es: "'gumbel', 'clayton', 'frank'.", en: "'gumbel', 'clayton', 'frank'." } },
          { name: 'marginal_families', type: 'tuple', default: '("gev", "lognorm", "gamma")', description: { es: 'Candidatos de marginal seleccionados por AIC.', en: 'Marginal candidates selected by AIC.' } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(x, y, z, labels=("X","Y","Z")) → self',
            description: { es: 'Ajusta marginales y parámetro de cópula trivariante.', en: 'Fits marginals and trivariate copula parameter.' },
            params: [
              { name: 'x', type: 'array-like', description: { es: 'Primera variable (ej. caudal).', en: 'First variable (e.g. discharge).' } },
              { name: 'y', type: 'array-like', description: { es: 'Segunda variable (ej. nivel del mar).', en: 'Second variable (e.g. sea level).' } },
              { name: 'z', type: 'array-like', description: { es: 'Tercera variable (ej. precipitación).', en: 'Third variable (e.g. precipitation).' } },
            ],
          },
          { name: 'joint_exceedance', signature: 'joint_exceedance(x0, y0, z0, scenario="OR") → float', description: { es: 'P(X>x0, Y>y0, Z>z0) para escenario OR o AND.', en: 'P(X>x0, Y>y0, Z>z0) for OR or AND scenario.' } },
          { name: 'return_period', signature: 'return_period(x0, y0, z0, scenario="OR") → float', description: { es: 'T = 1 / P(exceedance).', en: 'T = 1 / P(exceedance).' } },
          {
            name: 'conditional_contours',
            signature: 'conditional_contours(z_quantile, T_list, scenario="AND", n_pts=250) → dict',
            description: { es: 'Curvas iso-T en el plano (X, Y) condicionadas a Z ≥ su cuantil z_quantile.', en: 'Iso-T curves in the (X, Y) plane conditional on Z ≥ its z_quantile quantile.' },
            returns: { es: 'dict {T: (x_curva, y_curva)}.', en: 'dict {T: (x_curve, y_curve)}.' },
          },
          { name: 'plot', signature: 'plot(T_list=(2,10,50,100), z_quantiles=(0.5,0.8,0.95), scenario="AND") → Figure', description: { es: 'Rejilla de contornos condicionales OR y AND para múltiples niveles de Z.', en: 'Grid of conditional OR and AND contours for multiple Z levels.' } },
        ],
        example: `from pyhydra.climate.spatial_analysis.copulas import TrivariateCopula
cop = TrivariateCopula(family='gumbel')
cop.fit(caudal, nivel_mar, precipitacion, labels=('Q', 'SL', 'P'))
contours = cop.conditional_contours(z_quantile=0.9, T_list=[50, 100, 500])`,
      },
      {
        kind: 'class',
        name: 'FloodEventCopula',
        module: 'pyhydra.climate.spatial_analysis.copulas',
        description: {
          es: 'Cópula Normal multivariante para generación sintética de hidrogramas de crecida. Ajusta marginales BIC-seleccionadas y una cópula Normal al catálogo de eventos observados.',
          en: 'Multivariate Normal copula for synthetic flood hydrograph generation. Fits BIC-selected marginals and a Normal copula to the observed event catalogue.',
        },
        note: { es: 'Requiere: conda install -c conda-forge openturns', en: 'Requires: conda install -c conda-forge openturns' },
        params: [
          { name: 'continuous_vars', type: 'list[str]', default: "['Qmax', 'Qmed', 'Duracion']", description: { es: 'Variables continuas — marginal automática por BIC.', en: 'Continuous variables — automatic marginal by BIC.' } },
          { name: 'discrete_vars', type: 'list[str]', default: "['shape_type']", description: { es: 'Variables discretas — distribución empírica.', en: 'Discrete variables — empirical distribution.' } },
        ],
        methods: [
          { name: 'fit', signature: 'fit(data) → self', description: { es: 'Ajusta marginales y cópula Normal.', en: 'Fits marginals and Normal copula.' }, params: [{ name: 'data', type: 'pd.DataFrame', description: { es: 'DataFrame con una columna por variable.', en: 'DataFrame with one column per variable.' } }] },
          { name: 'sample', signature: 'sample(n_samples) → pd.DataFrame', description: { es: 'Genera n_samples eventos sintéticos.', en: 'Generates n_samples synthetic events.' } },
          { name: 'plot_marginals', signature: 'plot_marginals() → None', description: { es: 'ECDF vs CDF ajustada por variable.', en: 'ECDF vs fitted CDF per variable.' } },
        ],
        example: `from pyhydra.climate.spatial_analysis.copulas import FloodEventCopula
cop = FloodEventCopula(['Qmax', 'Qmed', 'Duracion'], ['shape_type'])
cop.fit(eventos_clasificados_df)
sinteticos = cop.sample(5000)`,
      },
      // ── Corrección de sesgo ───────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'delta_method',
        module: 'pyhydra.climate.bias_correction.delta',
        description: {
          es: 'Aplica el método Delta para proyectar una serie observada a condiciones futuras. Calcula deltas mensuales entre el modelo histórico y futuro, y los aplica multiplicativamente (precipitación) o aditivamente (temperatura).',
          en: 'Applies the Delta method to project an observed series to future conditions. Computes monthly deltas between historical and future model, then applies them multiplicatively (precipitation) or additively (temperature).',
        },
        params: [
          { name: 'serie_raw', type: 'pd.Series', description: { es: 'Serie observada a modificar (DatetimeIndex).', en: 'Observed series to modify (DatetimeIndex).' } },
          { name: 'serie_hist', type: 'pd.Series', description: { es: 'Serie modelo histórico.', en: 'Historical model series.' } },
          { name: 'serie_mod', type: 'pd.Series', description: { es: 'Serie modelo futuro.', en: 'Future model series.' } },
          { name: 'var', type: 'str', description: { es: "'pr' para precipitación (delta multiplicativo); cualquier otro string para delta aditivo (temperatura, etc.).", en: "'pr' for precipitation (multiplicative delta); any other string for additive delta (temperature, etc.)." } },
          { name: 'stat', type: 'str', description: { es: "'mean' o 'median' — cómo agregar deltas de múltiples modelos.", en: "'mean' or 'median' — how to aggregate deltas from multiple models." } },
        ],
        returns: { es: 'pd.Series con valores corregidos e índice temporal desplazado al periodo futuro.', en: 'pd.Series with corrected values and a time index shifted to the future period.' },
        example: `from pyhydra.climate.bias_correction.delta import delta_method
fut = delta_method(precip_obs, precip_hist_model, precip_fut_model, var='pr', stat='mean')`,
      },
      // ── Corrección cuantílica ─────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'BiasCorrection',
        module: 'pyhydra.climate.bias_correction.quantile',
        description: {
          es: 'Corrección de sesgo cuantílica para series de modelo climático. Implementa mapeo cuantílico aditivo empírico, mapeo delta cuantílico multiplicativo y mapeo de distribución escalada (SDM) paramétrico.',
          en: 'Quantile-based bias correction for climate model series. Implements additive empirical quantile mapping, multiplicative quantile delta mapping and parametric scaled distribution mapping (SDM).',
        },
        params: [
          { name: 'obs', type: 'array-like', description: { es: 'Serie observada (periodo de calibración).', en: 'Observed series (calibration period).' } },
          { name: 'mod', type: 'array-like', description: { es: 'Serie modelo histórico (mismo periodo).', en: 'Historical model series (same period).' } },
          { name: 'sce', type: 'array-like', description: { es: 'Serie modelo escenario futuro a corregir.', en: 'Future scenario model series to correct.' } },
        ],
        methods: [
          {
            name: 'quantile_mapping',
            signature: 'quantile_mapping() → np.ndarray',
            description: {
              es: 'Mapeo cuantílico aditivo empírico: aplica el delta de cuantil entre obs y mod histórico a la serie de escenario.',
              en: 'Additive empirical quantile mapping: applies the quantile delta between obs and historical mod to the scenario series.',
            },
            returns: { es: 'Array con la serie de escenario corregida.', en: 'Array with the corrected scenario series.' },
          },
          {
            name: 'quantile_deltamapping',
            signature: 'quantile_deltamapping() → np.ndarray',
            description: {
              es: 'Mapeo delta cuantílico multiplicativo: preserva la señal de cambio relativa del modelo mientras corrige la distribución.',
              en: 'Multiplicative quantile delta mapping: preserves the relative change signal of the model while correcting the distribution.',
            },
            returns: { es: 'Array con la serie de escenario corregida.', en: 'Array with the corrected scenario series.' },
          },
          {
            name: 'scaled_distribution_mapping',
            signature: 'scaled_distribution_mapping(variable, **kwargs) → np.ndarray',
            description: {
              es: "Mapeo de distribución escalada paramétrico. Usa distribución gamma para precipitación ('pr') y normal para temperatura.",
              en: "Parametric scaled distribution mapping. Uses gamma distribution for precipitation ('pr') and normal for temperature.",
            },
            params: [
              { name: 'variable', type: 'str', description: { es: "'pr' para precipitación (gamma); cualquier otro string para temperatura (normal).", en: "'pr' for precipitation (gamma); any other string for temperature (normal)." } },
            ],
            returns: { es: 'Array con la serie de escenario corregida.', en: 'Array with the corrected scenario series.' },
          },
        ],
        example: `from pyhydra.climate.bias_correction.quantile import BiasCorrection
bc = BiasCorrection(obs=precip_obs, mod=precip_hist, sce=precip_fut)
corrected_qm  = bc.quantile_mapping()
corrected_qdm = bc.quantile_deltamapping()
corrected_sdm = bc.scaled_distribution_mapping(variable='pr')`,
      },
      // ── Downscaling híbrido ───────────────────────────────────────────────────
      {
        kind: 'class',
        name: 'HydrographClassifier',
        module: 'pyhydra.climate.hybrid_downscaling.classification',
        description: {
          es: 'Clasifica hidrogramas de crecida en tipos morfológicos mediante PCA + K-means. Estandariza los hidrogramas a n_points antes de reducir a componentes principales.',
          en: 'Classifies flood hydrographs into morphological types using PCA + K-means. Standardises hydrographs to n_points before reducing to principal components.',
        },
        note: { es: 'Requiere: pip install scikit-learn', en: 'Requires: pip install scikit-learn' },
        params: [
          { name: 'discharge', type: 'pd.Series', description: { es: 'Serie de caudal con DatetimeIndex.', en: 'Discharge series with DatetimeIndex.' } },
          { name: 'events_bounds', type: 'pd.DataFrame', description: { es: "DataFrame con columnas 'start' y 'end' de cada evento.", en: "DataFrame with 'start' and 'end' columns for each event." } },
          { name: 'n_types', type: 'int', description: { es: 'Número de tipos morfológicos (clusters K-means).', en: 'Number of morphological types (K-means clusters).' } },
          { name: 'n_points', type: 'int', default: '100', description: { es: 'Puntos de resampleo por hidrograma.', en: 'Resampling points per hydrograph.' } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit() → pd.DataFrame',
            description: {
              es: 'Ejecuta PCA + K-means y devuelve el catálogo de eventos clasificados.',
              en: 'Runs PCA + K-means and returns the classified event catalogue.',
            },
            returns: { es: "DataFrame con columnas Qmax, Qmed, Duracion, shape_type por evento.", en: "DataFrame with columns Qmax, Qmed, Duracion, shape_type per event." },
          },
        ],
        example: `from pyhydra.climate.hybrid_downscaling.classification import HydrographClassifier
clf = HydrographClassifier(discharge=Q, events_bounds=bounds, n_types=4)
classified = clf.fit()`,
      },
      {
        kind: 'function',
        name: 'find_spatial_arrangement',
        module: 'pyhydra.climate.hybrid_downscaling.classification',
        description: {
          es: 'Encuentra la disposición espacial óptima de los centroides de tipos de hidrograma en una rejilla n_rows × n_cols minimizando la distancia total de flujo (algoritmo D8).',
          en: 'Finds the optimal spatial arrangement of hydrograph-type centroids on an n_rows × n_cols grid minimising total flow distance (D8 algorithm).',
        },
        params: [
          { name: 'n_rows', type: 'int', description: { es: 'Filas de la rejilla de disposición.', en: 'Rows of the arrangement grid.' } },
          { name: 'n_cols', type: 'int', description: { es: 'Columnas de la rejilla.', en: 'Columns of the grid.' } },
          { name: 'centers', type: 'array-like', description: { es: 'Centroides PCA de los tipos de hidrograma.', en: 'PCA centroids of the hydrograph types.' } },
          { name: 'iters', type: 'int', default: '200000', description: { es: 'Iteraciones de búsqueda aleatoria.', en: 'Random search iterations.' } },
          { name: 'method', type: 'str', default: '"D8"', description: { es: "Algoritmo de conectividad: 'D8'.", en: "Connectivity algorithm: 'D8'." } },
        ],
        returns: { es: 'Lista con la mejor permutación de tipos en la rejilla.', en: 'List with the best type permutation on the grid.' },
      },
      {
        kind: 'function',
        name: 'maxdiss',
        module: 'pyhydra.climate.hybrid_downscaling.reconstruction',
        description: {
          es: 'Selección MaxDiss (Maximally Dissimilar): elige n_select eventos representativos del conjunto sintético maximizando la disimilaridad entre ellos. Algoritmo greedy de complejidad O(n × k).',
          en: 'MaxDiss (Maximally Dissimilar) selection: chooses n_select representative events from the synthetic set by maximising dissimilarity between them. Greedy algorithm with O(n × k) complexity.',
        },
        params: [
          { name: 'data', type: 'pd.DataFrame', description: { es: 'Conjunto de eventos sintéticos.', en: 'Set of synthetic events.' } },
          { name: 'n_select', type: 'int', description: { es: 'Número de eventos representativos a seleccionar.', en: 'Number of representative events to select.' } },
          { name: 'scalar_cols', type: 'list[str]', description: { es: 'Columnas escalares para el cálculo de distancia.', en: 'Scalar columns for distance computation.' } },
          { name: 'seed_positions', type: 'list[int]', description: { es: 'Índices semilla para inicializar la selección.', en: 'Seed indices to initialise the selection.' } },
        ],
        returns: { es: 'Tupla (subset_df, positions_list) — eventos seleccionados y sus índices en el conjunto original.', en: 'Tuple (subset_df, positions_list) — selected events and their indices in the original set.' },
      },
      {
        kind: 'class',
        name: 'HydrographReconstructor',
        module: 'pyhydra.climate.hybrid_downscaling.reconstruction',
        description: {
          es: 'Reconstruye hidrogramas sintéticos a partir de la cópula FloodEventCopula y el clasificador de tipos. Aplica MaxDiss para reducir el catálogo a n_representatives eventos de simulación.',
          en: 'Reconstructs synthetic hydrographs from the FloodEventCopula and the type classifier. Applies MaxDiss to reduce the catalogue to n_representatives simulation events.',
        },
        params: [
          { name: 'discharge', type: 'pd.Series', description: { es: 'Serie de caudal histórica con DatetimeIndex.', en: 'Historical discharge series with DatetimeIndex.' } },
          { name: 'synthetic_matrix', type: 'pd.DataFrame', description: { es: 'Eventos sintéticos de la cópula (Qmax, Qmed, Duracion, shape_type).', en: 'Synthetic events from the copula (Qmax, Qmed, Duracion, shape_type).' } },
          { name: 'classified_events', type: 'pd.DataFrame', description: { es: 'Catálogo clasificado de HydrographClassifier.fit().', en: 'Classified catalogue from HydrographClassifier.fit().' } },
          { name: 'n_types', type: 'int', description: { es: 'Número de tipos morfológicos.', en: 'Number of morphological types.' } },
          { name: 'n_representatives', type: 'int', default: '400', description: { es: 'Eventos representativos a seleccionar con MaxDiss.', en: 'Representative events to select with MaxDiss.' } },
          { name: 'output_dir', type: 'str', default: '"."', description: { es: 'Directorio de salida para CSV de hidrogramas.', en: 'Output directory for hydrograph CSVs.' } },
          { name: 'plot', type: 'bool', default: 'False', description: { es: 'Visualizar los hidrogramas reconstruidos.', en: 'Plot the reconstructed hydrographs.' } },
        ],
        methods: [
          { name: 'run', signature: 'run() → tuple[pd.DataFrame, pd.DataFrame]', description: { es: 'Selecciona representativos, reconstruye hidrogramas y escribe Hidrograma_{j}.csv y centroids.csv.', en: 'Selects representatives, reconstructs hydrographs and writes Hidrograma_{j}.csv and centroids.csv.' }, returns: { es: '(centroids_df, synthetic_matrix_filtered).', en: '(centroids_df, synthetic_matrix_filtered).' } },
        ],
        example: `from pyhydra.climate.hybrid_downscaling.reconstruction import HydrographReconstructor
rec = HydrographReconstructor(Q, synthetic_df, classified_df, n_types=4, n_representatives=400, output_dir='./hidrogramas')
centroids, subset = rec.run()`,
      },
      {
        kind: 'class',
        name: 'FloodMapInterpolator',
        module: 'pyhydra.climate.hybrid_downscaling.interpolation',
        description: {
          es: 'Interpola mapas de inundación para el catálogo sintético completo mediante k-NN ponderado por distancia en el espacio de cópula. Calcula mapas de periodo de retorno pixel a pixel.',
          en: 'Interpolates flood maps for the full synthetic catalogue using distance-weighted k-NN in copula space. Computes pixel-by-pixel return-period maps.',
        },
        note: { es: 'Requiere: conda install gdal', en: 'Requires: conda install gdal' },
        params: [
          { name: 'synthetic_matrix', type: 'pd.DataFrame', description: { es: 'Catálogo sintético completo (Qmax, Qmed, Duracion, shape_type).', en: 'Full synthetic catalogue (Qmax, Qmed, Duracion, shape_type).' } },
          { name: 'centroids', type: 'pd.DataFrame', description: { es: 'Centroides representativos seleccionados por MaxDiss.', en: 'Representative centroids selected by MaxDiss.' } },
          { name: 'simulations_dir', type: 'str', description: { es: 'Directorio con los GeoTIFF de simulación (hamax_sim_{j}.tif).', en: 'Directory with simulation GeoTIFFs (hamax_sim_{j}.tif).' } },
          { name: 'n_simulations', type: 'int', description: { es: 'Número total de simulaciones hidráulicas.', en: 'Total number of hydraulic simulations.' } },
          { name: 'k_neighbors', type: 'int', default: '6', description: { es: 'Vecinos k-NN para la interpolación.', en: 'k-NN neighbors for interpolation.' } },
          { name: 'landa', type: 'float', default: '4.943', description: { es: 'Tasa media anual de eventos (λ) para la conversión a periodo de retorno.', en: 'Mean annual event rate (λ) for conversion to return period.' } },
          { name: 'output_dir', type: 'str | None', default: 'None', description: { es: 'Directorio para guardar GeoTIFF de periodo de retorno.', en: 'Directory to save return-period GeoTIFFs.' } },
        ],
        methods: [
          {
            name: 'compute_return_period_maps',
            signature: 'compute_return_period_maps(return_periods=(5,10,25,50,100,200,500,1000), n_blocks=20) → tuple',
            description: { es: 'Calcula los mapas de periodo de retorno por bloques para gestionar memoria.', en: 'Computes return-period maps in blocks to manage memory.' },
            returns: { es: 'Tupla (calados_dict, geotiff_paths_list) — dict {T: ndarray(nrows,ncols)} y lista de rutas GeoTIFF.', en: 'Tuple (calados_dict, geotiff_paths_list) — dict {T: ndarray(nrows,ncols)} and list of GeoTIFF paths.' },
          },
        ],
        example: `from pyhydra.climate.hybrid_downscaling.interpolation import FloodMapInterpolator
interp = FloodMapInterpolator(
    synthetic_matrix=subset, centroids=centroids,
    simulations_dir='./sfincs_runs/', n_simulations=400,
    landa=4.943, output_dir='./return_period_maps/'
)
calados, paths = interp.compute_return_period_maps(return_periods=(10, 50, 100, 500))`,
      },
      {
        kind: 'class',
        name: 'FloodMapInterpolatorCC',
        module: 'pyhydra.climate.hybrid_downscaling.interpolation',
        description: {
          es: 'Extiende FloodMapInterpolator para cambio climático. Interpola mapas para dos catálogos sintéticos (histórico + escenario CC) usando los mismos hidrogramas de simulación, permitiendo comparar mapas de periodo de retorno entre periodos.',
          en: 'Extends FloodMapInterpolator for climate change. Interpolates maps for two synthetic catalogues (historical + CC scenario) using the same simulation hydrographs, allowing comparison of return-period maps between periods.',
        },
        note: { es: 'Requiere: conda install gdal', en: 'Requires: conda install gdal' },
        params: [
          { name: 'synthetic_matrix', type: 'pd.DataFrame', description: { es: 'Catálogo sintético histórico.', en: 'Historical synthetic catalogue.' } },
          { name: 'centroids', type: 'pd.DataFrame', description: { es: 'Centroides representativos históricos.', en: 'Historical representative centroids.' } },
          { name: 'simulations_dir_hist', type: 'str', description: { es: 'Directorio de simulaciones históricas.', en: 'Historical simulations directory.' } },
          { name: 'simulations_dir_cc', type: 'str', description: { es: 'Directorio de simulaciones de cambio climático.', en: 'Climate-change simulations directory.' } },
          { name: 'n_simulations_hist', type: 'int', description: { es: 'Número de simulaciones históricas.', en: 'Number of historical simulations.' } },
          { name: 'n_simulations_cc', type: 'int', description: { es: 'Número de simulaciones CC.', en: 'Number of CC simulations.' } },
          { name: 'k_neighbors', type: 'int', default: '6', description: { es: 'Vecinos k-NN.', en: 'k-NN neighbors.' } },
          { name: 'landa', type: 'float', default: '4.943', description: { es: 'Tasa media anual de eventos λ.', en: 'Mean annual event rate λ.' } },
          { name: 'output_dir', type: 'str | None', default: 'None', description: { es: 'Directorio de salida GeoTIFF.', en: 'GeoTIFF output directory.' } },
        ],
      },
      {
        kind: 'function',
        name: 'pixel_return_period',
        module: 'pyhydra.climate.hybrid_downscaling.return_period',
        description: {
          es: 'Calcula el periodo de retorno pixel a pixel a partir de un bloque de calados de eventos mediante una distribución de Poisson–GEV. Implementación vectorizada sobre ndarray.',
          en: 'Computes pixel-by-pixel return period from a block of event depth arrays using a Poisson–GEV distribution. Vectorised over ndarray.',
        },
        note: { es: 'Requiere: conda install gdal', en: 'Requires: conda install gdal' },
        params: [
          { name: 'events_block', type: 'list[ndarray]', description: { es: 'Lista de arrays 2D (nrows, ncols) con calados de cada evento.', en: 'List of 2D arrays (nrows, ncols) with depth for each event.' } },
          { name: 'landa', type: 'float', description: { es: 'Tasa media anual de eventos (λ).', en: 'Mean annual event rate (λ).' } },
          { name: 'return_periods', type: 'tuple[int, ...]', default: '(5,10,25,50,100,200,500,1000)', description: { es: 'Periodos de retorno a calcular.', en: 'Return periods to compute.' } },
        ],
        returns: { es: 'Dict {T: ndarray(nrows, ncols)} con el calado máximo esperado para cada periodo de retorno.', en: 'Dict {T: ndarray(nrows, ncols)} with the expected maximum depth for each return period.' },
      },
      {
        kind: 'function',
        name: 'save_return_period_geotiffs',
        module: 'pyhydra.climate.hybrid_downscaling.return_period',
        description: {
          es: 'Exporta los mapas de periodo de retorno como archivos GeoTIFF usando un raster de plantilla para georreferenciación.',
          en: 'Exports return-period maps as GeoTIFF files using a template raster for georeferencing.',
        },
        note: { es: 'Requiere: conda install gdal', en: 'Requires: conda install gdal' },
        params: [
          { name: 'calados', type: 'dict[int, ndarray]', description: { es: "Dict {T: ndarray} de salida de pixel_return_period().", en: "Dict {T: ndarray} output from pixel_return_period()." } },
          { name: 'template_tif', type: 'str', description: { es: 'Ruta al GeoTIFF de plantilla con CRS y geotransformación de referencia.', en: 'Path to the template GeoTIFF with reference CRS and geotransformation.' } },
          { name: 'output_dir', type: 'str', description: { es: 'Directorio de salida para los GeoTIFF generados.', en: 'Output directory for the generated GeoTIFFs.' } },
        ],
        returns: { es: 'Lista de objetos Path a los archivos GeoTIFF generados.', en: 'List of Path objects for the generated GeoTIFF files.' },
        example: `from pyhydra.climate.hybrid_downscaling.return_period import pixel_return_period, save_return_period_geotiffs
calados = pixel_return_period(events_block, landa=4.943, return_periods=(10, 50, 100, 500))
paths = save_return_period_geotiffs(calados, template_tif='hamax_sim_0.tif', output_dir='./output/')`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERACIÓN ESTOCÁSTICA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'generacion-estocastica',
    items: [
      {
        kind: 'function',
        name: 'analyze_ts',
        module: 'pyhydra.climate.stochastic_generation.point',
        description: {
          es: 'Ajusta un modelo estocástico estacional a una serie diaria. Envuelve cosmos_py para ajustar marginal y estructura de autocorrelación por mes. Para precipitación usar NSRPModel.',
          en: 'Fits a seasonal stochastic model to a daily series. Wraps cosmos_py to fit marginal distribution and autocorrelation structure by month. Use NSRPModel for precipitation.',
        },
        params: [
          { name: 'series', type: 'pd.Series', description: { es: 'Serie con DatetimeIndex. Ceros tratados como pasos secos.', en: 'Series with DatetimeIndex. Zeros treated as dry time steps.' } },
          { name: 'season', type: 'str', default: '"month"', description: { es: "'month' o 'week'.", en: "'month' or 'week'." } },
          { name: 'dist', type: 'str', default: '"gengamma"', description: { es: "'gengamma', 'paretoII', 'burrXII', 'burrIII', 'gev', 'lnorm'.", en: "'gengamma', 'paretoII', 'burrXII', 'burrIII', 'gev', 'lnorm'." } },
          { name: 'acs_id', type: 'str', default: '"weibull"', description: { es: "Modelo de autocorrelación: 'weibull', 'paretoII', …", en: "Autocorrelation model: 'weibull', 'paretoII', …" } },
          { name: 'lag_max', type: 'int', default: '30', description: { es: 'Lag máximo para estimación empírica de ACF.', en: 'Maximum lag for empirical ACF estimation.' } },
        ],
        returns: { es: 'Dict con el modelo ajustado (entrada para simulate_ts / report_ts).', en: 'Dict with the fitted model (input for simulate_ts / report_ts).' },
        note: { es: 'Requiere: pip install cosmos_py (https://github.com/navass11/CoSMoS_py)', en: 'Requires: pip install cosmos_py (https://github.com/navass11/CoSMoS_py)' },
        example: `from pyhydra.climate.stochastic_generation.point import analyze_ts, simulate_ts
modelo = analyze_ts(caudal_diario, dist='gengamma')
sintetico = simulate_ts(modelo, from_date='2000-01-01', to_date='2099-12-31')`,
      },
      {
        kind: 'function',
        name: 'report_ts',
        module: 'pyhydra.climate.stochastic_generation.point',
        description: { es: 'Resume un modelo estocástico ajustado con estadísticos estacionales, ajustes marginales o ajustes ACS.', en: 'Summarises a fitted stochastic model with seasonal statistics, marginal fits or ACS fits.' },
        params: [
          { name: 'analyzed', type: 'dict', description: { es: 'Salida de analyze_ts().', en: 'Output of analyze_ts().' } },
          { name: 'method', type: 'str', default: '"stat"', description: { es: "'stat' (DataFrame), 'dist' (gráficos marginales), 'acs' (gráficos ACS).", en: "'stat' (DataFrame), 'dist' (marginal plots), 'acs' (ACS plots)." } },
        ],
        returns: { es: "DataFrame de estadísticos estacionales cuando method='stat', None en caso contrario.", en: "DataFrame of seasonal statistics when method='stat', None otherwise." },
      },
      {
        kind: 'function',
        name: 'simulate_ts',
        module: 'pyhydra.climate.stochastic_generation.point',
        description: { es: 'Genera una serie temporal diaria sintética a partir de un modelo ajustado.', en: 'Generates a synthetic daily time series from a fitted model.' },
        params: [
          { name: 'analyzed', type: 'dict', description: { es: 'Salida de analyze_ts().', en: 'Output of analyze_ts().' } },
          { name: 'from_date', type: 'str | None', default: 'None', description: { es: 'Fecha de inicio (por defecto: inicio del periodo de calibración).', en: 'Start date (default: beginning of the calibration period).' } },
          { name: 'to_date', type: 'str | None', default: 'None', description: { es: 'Fecha de fin.', en: 'End date.' } },
        ],
        returns: { es: 'pd.Series sintética.', en: 'Synthetic pd.Series.' },
      },
      {
        kind: 'class',
        name: 'NSRPModel',
        module: 'pyhydra.climate.stochastic_generation.point',
        description: {
          es: 'Generador estocástico de precipitación en un punto (NSRP — Neyman-Scott Rectangular Pulses). Calibrado con PSO sobre estadísticos observados.',
          en: 'Point stochastic precipitation generator (NSRP — Neyman–Scott Rectangular Pulses). Calibrated with PSO on observed statistics.',
        },
        note: { es: 'Requiere: pip install NEOPRENE (https://github.com/IHCantabria/NEOPRENE)', en: 'Requires: pip install NEOPRENE (https://github.com/IHCantabria/NEOPRENE)' },
        params: [
          { name: 'temporal_resolution', type: 'str', default: '"d"', description: { es: "'d' (diario) o 'h' (horario).", en: "'d' (daily) or 'h' (hourly)." } },
          { name: 'seasonality', type: 'str', default: '"monthly"', description: { es: "'annual', 'seasonal', 'monthly', 'user_defined'.", en: "'annual', 'seasonal', 'monthly', 'user_defined'." } },
          { name: 'n_iterations', type: 'int', default: '100', description: { es: 'Iteraciones PSO.', en: 'PSO iterations.' } },
          { name: 'n_bees', type: 'int', default: '100', description: { es: 'Tamaño enjambre PSO. Usar 1000 para producción.', en: 'PSO swarm size. Use 1000 for production.' } },
        ],
        methods: [
          { name: 'fit', signature: 'fit(series) → self', description: { es: 'Calibra NSRP con PSO.', en: 'Calibrates NSRP with PSO.' }, params: [{ name: 'series', type: 'pd.Series', description: { es: 'Precipitación diaria con DatetimeIndex.', en: 'Daily precipitation with DatetimeIndex.' } }] },
          { name: 'simulate', signature: 'simulate(from_year, to_year) → pd.Series', description: { es: 'Genera precipitación sintética.', en: 'Generates synthetic precipitation.' }, params: [{ name: 'from_year', type: 'int', description: { es: 'Año inicio.', en: 'Start year.' } }, { name: 'to_year', type: 'int', description: { es: 'Año fin.', en: 'End year.' } }] },
        ],
        example: `from pyhydra.climate.stochastic_generation.point import NSRPModel
modelo = NSRPModel(temporal_resolution='d', seasonality='monthly')
modelo.fit(precip_diaria)
sintetica = modelo.simulate(2000, 2100)`,
      },
      {
        kind: 'class',
        name: 'STNSRPModel',
        module: 'pyhydra.climate.stochastic_generation.spatial',
        description: {
          es: 'Generador espacio-temporal de precipitación multi-estación (STNSRP). Preserva estadísticos puntuales y correlaciones cruzadas espaciales entre estaciones.',
          en: 'Spatial–temporal multi-site precipitation generator (STNSRP). Preserves point statistics and spatial cross-correlations between stations.',
        },
        note: { es: 'Requiere: pip install NEOPRENE', en: 'Requires: pip install NEOPRENE' },
        params: [
          { name: 'temporal_resolution', type: 'str', default: '"d"', description: { es: "'d' o 'h'.", en: "'d' or 'h'." } },
          { name: 'seasonality', type: 'str', default: '"monthly"', description: { es: "'annual', 'seasonal', 'monthly', 'user_defined'.", en: "'annual', 'seasonal', 'monthly', 'user_defined'." } },
          { name: 'n_iterations', type: 'int', default: '100', description: { es: 'Iteraciones PSO.', en: 'PSO iterations.' } },
          { name: 'n_bees', type: 'int', default: '100', description: { es: 'Tamaño enjambre PSO.', en: 'PSO swarm size.' } },
          { name: 'cell_radius', type: 'list[float]', default: '[1.0, 50.0]', description: { es: 'Límites PSO del radio de celda de tormenta [min_km, max_km]. Debe ser lista de exactamente dos flotantes.', en: 'PSO bounds for storm cell radius [min_km, max_km]. Must be a list of exactly two floats.' } },
          { name: 'coordinates', type: 'str', default: '"geographical"', description: { es: "'geographical' (lat/lon) o 'UTM'.", en: "'geographical' (lat/lon) or 'UTM'." } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(multisite_df, attributes) → self',
            description: { es: 'Calibra STNSRP para múltiples estaciones preservando correlaciones espaciales.', en: 'Calibrates STNSRP for multiple stations preserving spatial correlations.' },
            params: [
              { name: 'multisite_df', type: 'pd.DataFrame', description: { es: 'Precipitación con columnas por estación y DatetimeIndex.', en: 'Precipitation with one column per station and DatetimeIndex.' } },
              { name: 'attributes', type: 'pd.DataFrame', description: { es: "DataFrame con columnas 'ID', 'Lon', 'Lat', 'elevation'.", en: "DataFrame with columns 'ID', 'Lon', 'Lat', 'elevation'." } },
            ],
          },
          { name: 'simulate', signature: 'simulate(from_year, to_year, attributes) → pd.DataFrame', description: { es: 'Genera precipitación simultánea en todas las estaciones.', en: 'Generates simultaneous synthetic precipitation at all stations.' } },
        ],
        example: `from pyhydra.climate.stochastic_generation.spatial import STNSRPModel
attrs = pd.DataFrame({'ID': ['S1','S2'], 'Lon': [-3.7,-3.8], 'Lat': [43.3,43.4], 'elevation': [10,20]})
modelo = STNSRPModel(temporal_resolution='d', seasonality='monthly')
modelo.fit(multisite_precip_df, attributes=attrs)
sintetica = modelo.simulate(2000, 2100, attributes=attrs)`,
      },
      {
        kind: 'class',
        name: 'SpatialFieldModel',
        module: 'pyhydra.climate.stochastic_generation.fields',
        description: {
          es: 'Generador espacio-temporal de campos aleatorios (enfoque VAR de CoSMoS_py). Genera campos en rejilla o en ubicaciones irregulares con distribución marginal y estructura de correlación espacio-temporal especificada.',
          en: 'Spatial–temporal random field generator (CoSMoS_py VAR approach). Generates fields on a grid or at irregular locations with a specified marginal distribution and space–time correlation structure.',
        },
        note: { es: 'Requiere: pip install cosmos_py (https://github.com/navass11/CoSMoS_py)', en: 'Requires: pip install cosmos_py (https://github.com/navass11/CoSMoS_py)' },
        params: [
          { name: 'dist', type: 'str', description: { es: "Distribución marginal: 'gengamma', 'burrXII', 'paretoII', 'burrIII', 'gev'.", en: "Marginal distribution: 'gengamma', 'burrXII', 'paretoII', 'burrIII', 'gev'." } },
          { name: 'dist_params', type: 'dict', description: { es: 'Parámetros de la distribución marginal.', en: 'Marginal distribution parameters.' } },
          { name: 'p0', type: 'float', default: '0.0', description: { es: 'Probabilidad de cero (intermitencia). Usar 0 para temperatura o viento.', en: 'Zero probability (intermittency). Use 0 for temperature or wind.' } },
          { name: 'p', type: 'int', default: '1', description: { es: 'Orden VAR (profundidad de lag temporal).', en: 'VAR order (temporal lag depth).' } },
          { name: 'stcs_id', type: 'str', default: '"clayton"', description: { es: "Estructura de correlación espacio-temporal: 'clayton', 'gneiting14', 'gneiting16'.", en: "Space–time correlation structure: 'clayton', 'gneiting14', 'gneiting16'." } },
          { name: 'dep_structure', type: 'str', default: '"gauss"', description: { es: "Cópula de dependencia espacial: 'gauss', 'student', 'bardossy'.", en: "Spatial dependence copula: 'gauss', 'student', 'bardossy'." } },
          { name: 'dep_arg', type: 'float | None', default: 'None', description: { es: 'Grados de libertad (Student-t) o parámetro m (Bardossy).', en: 'Degrees of freedom (Student-t) or m parameter (Bardossy).' } },
          { name: 'anisotropy_id', type: 'str', default: '"affine"', description: { es: "Transformación de anisotropía: 'affine', 'swirl', 'wave'.", en: "Anisotropy transformation: 'affine', 'swirl', 'wave'." } },
          { name: 'advection_id', type: 'str', default: '"uniform"', description: { es: "Campo de advección: 'uniform', 'rotation', 'spiral'.", en: "Advection field: 'uniform', 'rotation', 'spiral'." } },
        ],
        methods: [
          {
            name: 'fit',
            signature: 'fit(spacepoints) → self',
            description: { es: 'Construye el modelo VAR(p) para el layout espacial dado.', en: 'Builds the VAR(p) model for the given spatial layout.' },
            params: [{ name: 'spacepoints', type: 'int | ndarray (n×2)', description: { es: 'Entero m → rejilla m×m regular; array → n_sites ubicaciones irregulares (x, y).', en: 'Integer m → regular m×m grid; array → n_sites irregular locations (x, y).' } }],
          },
          { name: 'simulate', signature: 'simulate(n_steps, fast=False) → np.ndarray', description: { es: 'Simula n_steps del campo espacio-temporal.', en: 'Simulates n_steps of the space–time field.' }, returns: { es: 'ndarray de forma (n_steps, n_sites).', en: 'ndarray of shape (n_steps, n_sites).' } },
          { name: 'simulate_dataframe', signature: 'simulate_dataframe(n_steps, start_date=None, freq="D") → pd.DataFrame', description: { es: 'Simula y devuelve DataFrame con DatetimeIndex.', en: 'Simulates and returns a DataFrame with DatetimeIndex.' } },
          { name: 'diagnostics', signature: 'diagnostics(n_steps=1000) → dict', description: { es: 'Ejecuta una simulación de prueba y compara estadísticos vs objetivos.', en: 'Runs a test simulation and compares statistics vs targets.' } },
        ],
        example: `from pyhydra.climate.stochastic_generation.fields import SpatialFieldModel
model = SpatialFieldModel(
    dist='gengamma',
    dist_params={'scale': 5.0, 'shape1': 0.8, 'shape2': 0.5},
    p0=0.65,
    stcs_id='clayton',
    dep_structure='gauss',
)
model.fit(spacepoints=10)  # rejilla 10×10
campo = model.simulate(n_steps=365)   # shape (365, 100)`,
      },
      {
        kind: 'function',
        name: 'fit_spatial_model',
        module: 'pyhydra.climate.stochastic_generation.fields',
        description: {
          es: 'Ajusta un modelo VAR(p) espacio-temporal a un conjunto de ubicaciones. API funcional equivalente a SpatialFieldModel.fit().',
          en: 'Fits a space–time VAR(p) model to a set of locations. Functional API equivalent to SpatialFieldModel.fit().',
        },
        params: [
          { name: 'spacepoints', type: 'int | ndarray', description: { es: 'Entero m (rejilla m×m) o array (n×2) de ubicaciones irregulares.', en: 'Integer m (m×m grid) or array (n×2) of irregular locations.' } },
          { name: 'p', type: 'int', description: { es: 'Orden VAR.', en: 'VAR order.' } },
          { name: 'dist', type: 'str', description: { es: 'Distribución marginal.', en: 'Marginal distribution.' } },
          { name: 'dist_params', type: 'dict', description: { es: 'Parámetros de la distribución.', en: 'Distribution parameters.' } },
          { name: 'p0', type: 'float', default: '0.0', description: { es: 'Probabilidad de cero.', en: 'Zero probability.' } },
          { name: 'stcs_id', type: 'str', default: '"clayton"', description: { es: 'Estructura de correlación espacio-temporal.', en: 'Space–time correlation structure.' } },
        ],
        returns: { es: 'Dict del modelo ajustado (entrada para generate_random_field / check_random_field).', en: 'Dict of the fitted model (input for generate_random_field / check_random_field).' },
      },
      {
        kind: 'function',
        name: 'generate_random_field',
        module: 'pyhydra.climate.stochastic_generation.fields',
        description: { es: 'Simula n_steps del campo aleatorio espacio-temporal ajustado.', en: 'Simulates n_steps of the fitted space–time random field.' },
        params: [
          { name: 'n_steps', type: 'int', description: { es: 'Pasos de tiempo a simular.', en: 'Time steps to simulate.' } },
          { name: 'model', type: 'dict', description: { es: 'Salida de fit_spatial_model().', en: 'Output of fit_spatial_model().' } },
        ],
        returns: { es: 'ndarray de forma (n_steps, n_sites).', en: 'ndarray of shape (n_steps, n_sites).' },
      },
      {
        kind: 'function',
        name: 'check_random_field',
        module: 'pyhydra.climate.stochastic_generation.fields',
        description: { es: 'Diagnóstico: compara estadísticos del campo simulado vs objetivos.', en: 'Diagnostics: compares statistics of the simulated field vs targets.' },
        params: [
          { name: 'field', type: 'ndarray (n_steps, n_sites)', description: { es: 'Salida de generate_random_field().', en: 'Output of generate_random_field().' } },
          { name: 'model', type: 'dict', description: { es: 'Salida de fit_spatial_model().', en: 'Output of fit_spatial_model().' } },
        ],
        returns: { es: "Dict con claves 'marginal' (DataFrame), 'spatial_acf' (ndarray), 'temporal_acf' (ndarray).", en: "Dict with keys 'marginal' (DataFrame), 'spatial_acf' (ndarray), 'temporal_acf' (ndarray)." },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MODELIZACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'modelizacion',
    items: [
      // ── HEC-HMS ───────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'generate_gage',
        module: 'pyhydra.modeling.hydrology.hec_hms',
        description: { es: 'Escribe o añade entradas de pluviómetro a un archivo .gage de HEC-HMS.', en: 'Writes or appends rain gauge entries to a HEC-HMS .gage file.' },
        params: [
          { name: 'name_model', type: 'str', description: { es: 'Nombre del proyecto (sin extensión).', en: 'Project name (without extension).' } },
          { name: 'names_stations', type: 'list[str]', description: { es: 'Lista de nombres de pluviómetro.', en: 'List of rain gauge names.' } },
          { name: 'time_interval', type: 'str', description: { es: "Paso de tiempo HEC-HMS (ej. '1HOUR', '1DAY').", en: "HEC-HMS time interval (e.g. '1HOUR', '1DAY')." } },
          { name: 'path_model', type: 'str', description: { es: 'Directorio del modelo.', en: 'Model directory.' } },
          { name: 'start_time', type: 'str', description: { es: "Inicio simulación (ej. '1 January 2010, 00:00').", en: "Simulation start (e.g. '1 January 2010, 00:00')." } },
          { name: 'end_time', type: 'str', description: { es: 'Fin simulación.', en: 'Simulation end.' } },
          { name: 'file_dss', type: 'str', description: { es: 'Archivo DSS de precipitación.', en: 'Precipitation DSS file.' } },
          { name: 'exists_gage', type: 'bool', default: 'False', description: { es: 'Si True, añade al archivo existente.', en: 'If True, appends to existing file.' } },
        ],
        returns: { es: 'None.', en: 'None.' },
        note: { es: 'Requiere HEC-HMS 4.x (Windows) o HEC_HMS_DIR + xvfb (Linux/Docker).', en: 'Requires HEC-HMS 4.x (Windows) or HEC_HMS_DIR + xvfb (Linux/Docker).' },
      },
      {
        kind: 'function',
        name: 'generate_met',
        module: 'pyhydra.modeling.hydrology.hec_hms',
        description: { es: 'Genera o actualiza el archivo .met de modelo meteorológico de HEC-HMS, asignando pluviómetros a subcuencas.', en: 'Generates or updates the HEC-HMS meteorological model file (.met), assigning rain gauges to subbasins.' },
        params: [
          { name: 'name_model', type: 'str', description: { es: 'Nombre del proyecto.', en: 'Project name.' } },
          { name: 'names_stations', type: 'list[str]', description: { es: 'Nombres de pluviómetros.', en: 'Rain gauge names.' } },
          { name: 'names_subbasins', type: 'list[str]', description: { es: 'Nombres de subcuencas.', en: 'Subbasin names.' } },
          { name: 'path_model', type: 'str', description: { es: 'Directorio del modelo.', en: 'Model directory.' } },
          { name: 'file_dss', type: 'str', description: { es: 'Archivo DSS referenciado.', en: 'Referenced DSS file.' } },
        ],
        returns: { es: 'None.', en: 'None.' },
      },
      {
        kind: 'function',
        name: 'generate_flow',
        module: 'pyhydra.modeling.hydrology.hec_hms',
        description: { es: 'Lee los resultados de caudal de una simulación HEC-HMS desde un archivo DSS.', en: 'Reads streamflow results from a HEC-HMS simulation DSS file.' },
        params: [
          { name: 'path_dss', type: 'str', description: { es: 'Ruta al archivo DSS de resultados.', en: 'Path to the results DSS file.' } },
          { name: 'station_name', type: 'str', description: { es: 'Nombre de la subcuenca o punto de control.', en: 'Subbasin or control point name.' } },
          { name: 'run_name', type: 'str', description: { es: 'Nombre de la ejecución en el proyecto HEC-HMS.', en: 'Run name in the HEC-HMS project.' } },
        ],
        returns: { es: 'pd.Series de caudal con DatetimeIndex.', en: 'pd.Series of discharge with DatetimeIndex.' },
        note: { es: 'Requiere: pip install pydsstools (ARM64 no compatible — usar Docker linux/amd64).', en: 'Requires: pip install pydsstools (ARM64 incompatible — use Docker linux/amd64).' },
      },
      // ── SWAT+ ─────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'write_precipitation_file',
        module: 'pyhydra.modeling.hydrology.swat',
        description: {
          es: 'Escribe un archivo de precipitación SWAT+ multi-estación en formato .pcp (formato legado SWAT 2012, una sola línea por día con todas las estaciones).',
          en: 'Writes a multi-station SWAT+ precipitation file in .pcp format (legacy SWAT 2012 format, one line per day with all stations).',
        },
        params: [
          { name: 'df_coords', type: 'pd.DataFrame', description: { es: "DataFrame con columnas ['Station', 'Lati', 'Long', 'Elev'].", en: "DataFrame with columns ['Station', 'Lati', 'Long', 'Elev']." } },
          { name: 'df_series', type: 'pd.DataFrame', description: { es: 'DataFrame con DatetimeIndex y una columna por estación (mm/día).', en: 'DataFrame with DatetimeIndex and one column per station (mm/day).' } },
          { name: 'output_path', type: 'str', description: { es: "Ruta del archivo de salida (ej. 'TxtInOut/pcp1.pcp').", en: "Output file path (e.g. 'TxtInOut/pcp1.pcp')." } },
          { name: 'missing_value', type: 'float', default: '-99.0', description: { es: 'Valor para datos faltantes.', en: 'Value for missing data.' } },
        ],
        returns: { es: 'None.', en: 'None.' },
      },
      {
        kind: 'function',
        name: 'write_swatplus_precipitation_files',
        module: 'pyhydra.modeling.hydrology.swat',
        description: {
          es: 'Escribe archivos de precipitación individuales para SWAT+ (un .pcp por estación) referenciados desde pcp.cli.',
          en: 'Writes individual precipitation files for SWAT+ (one .pcp per station) referenced from pcp.cli.',
        },
        params: [
          { name: 'df_stations', type: 'pd.DataFrame', description: { es: "DataFrame con columnas ['name', 'lat', 'lon', 'elev'].", en: "DataFrame with columns ['name', 'lat', 'lon', 'elev']." } },
          { name: 'df_series', type: 'pd.DataFrame', description: { es: 'DataFrame con DatetimeIndex y una columna por estación (mm/día).', en: 'DataFrame with DatetimeIndex and one column per station (mm/day).' } },
          { name: 'txtinout_dir', type: 'str', description: { es: 'Directorio TxtInOut de SWAT+.', en: 'SWAT+ TxtInOut directory.' } },
          { name: 'missing_value', type: 'float', default: '-99.0', description: { es: 'Valor para datos faltantes.', en: 'Value for missing data.' } },
        ],
        returns: { es: 'None. Archivos .pcp escritos en txtinout_dir.', en: 'None. .pcp files written to txtinout_dir.' },
      },
      {
        kind: 'function',
        name: 'write_swatplus_temperature_files',
        module: 'pyhydra.modeling.hydrology.swat',
        description: {
          es: 'Escribe archivos de temperatura individuales para SWAT+ (un .tmp por estación) referenciados desde tmp.cli.',
          en: 'Writes individual temperature files for SWAT+ (one .tmp per station) referenced from tmp.cli.',
        },
        params: [
          { name: 'df_stations', type: 'pd.DataFrame', description: { es: "DataFrame con columnas ['name', 'lat', 'lon', 'elev'].", en: "DataFrame with columns ['name', 'lat', 'lon', 'elev']." } },
          { name: 'df_tmax', type: 'pd.DataFrame', description: { es: 'Temperatura máxima diaria (°C), columnas = nombres de estación.', en: 'Daily maximum temperature (°C), columns = station names.' } },
          { name: 'df_tmin', type: 'pd.DataFrame', description: { es: 'Temperatura mínima diaria (°C), misma estructura.', en: 'Daily minimum temperature (°C), same structure.' } },
          { name: 'txtinout_dir', type: 'str', description: { es: 'Directorio TxtInOut de SWAT+.', en: 'SWAT+ TxtInOut directory.' } },
          { name: 'missing_value', type: 'float', default: '-99.0', description: { es: 'Valor para datos faltantes.', en: 'Value for missing data.' } },
        ],
        returns: { es: 'None. Archivos .tmp y tmp.cli escritos en txtinout_dir.', en: 'None. .tmp files and tmp.cli written to txtinout_dir.' },
      },
      {
        kind: 'function',
        name: 'write_temperature_file',
        module: 'pyhydra.modeling.hydrology.swat',
        description: { es: 'Escribe el archivo de temperatura SWAT+ (.tmp) con Tmax y Tmin diarios.', en: 'Writes the SWAT+ temperature file (.tmp) with daily Tmax and Tmin.' },
        params: [
          { name: 'df_coords', type: 'pd.DataFrame', description: { es: "DataFrame con columnas ['Station', 'Lati', 'Long', 'Elev'].", en: "DataFrame with columns ['Station', 'Lati', 'Long', 'Elev']." } },
          { name: 'df_tmax', type: 'pd.DataFrame', description: { es: 'Temperatura máxima diaria (°C).', en: 'Daily maximum temperature (°C).' } },
          { name: 'df_tmin', type: 'pd.DataFrame', description: { es: 'Temperatura mínima diaria (°C).', en: 'Daily minimum temperature (°C).' } },
          { name: 'output_path', type: 'str', description: { es: 'Ruta de salida (ej. TxtInOut/tmp1.tmp).', en: 'Output path (e.g. TxtInOut/tmp1.tmp).' } },
        ],
        returns: { es: 'None.', en: 'None.' },
      },
      {
        kind: 'function',
        name: 'edit_file_cio',
        module: 'pyhydra.modeling.hydrology.swat',
        description: { es: 'Edita el file.cio de SWAT+ para establecer el periodo de simulación (IYR y NBYR).', en: 'Edits the SWAT+ file.cio to set the simulation period (IYR and NBYR).' },
        params: [
          { name: 'file_cio_path', type: 'str', description: { es: 'Ruta al file.cio.', en: 'Path to file.cio.' } },
          { name: 'start_year', type: 'int', description: { es: 'Primer año de simulación.', en: 'First simulation year.' } },
          { name: 'end_year', type: 'int', description: { es: 'Último año de simulación.', en: 'Last simulation year.' } },
        ],
        returns: { es: 'None. Modifica el archivo en lugar.', en: 'None. Modifies the file in place.' },
      },
      {
        kind: 'function',
        name: 'run_swat',
        module: 'pyhydra.modeling.hydrology.swat',
        description: {
          es: 'Ejecuta el binario de SWAT+ en el directorio del modelo.',
          en: 'Executes the SWAT+ binary in the model directory.',
        },
        params: [
          { name: 'model_dir', type: 'str', description: { es: 'Directorio con los archivos TxtInOut de SWAT+.', en: 'Directory with the SWAT+ TxtInOut files.' } },
          { name: 'swat_exe', type: 'str', description: { es: 'Ruta al ejecutable SWAT+.', en: 'Path to the SWAT+ executable.' } },
          { name: 'timeout', type: 'int', default: '3600', description: { es: 'Tiempo máximo de ejecución en segundos.', en: 'Maximum execution time in seconds.' } },
        ],
        returns: { es: 'Código de retorno del proceso (0 = éxito).', en: 'Process return code (0 = success).' },
      },
      // ── HEC-RAS ───────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'modify_unsteady_file',
        module: 'pyhydra.modeling.hydraulic.hec_ras',
        description: {
          es: 'Escribe un hietograma o hidrograma en un archivo de flujo no estacionario de HEC-RAS (.u##). Actualiza los datos de flujo para cada condición de contorno.',
          en: 'Writes a hyetograph or hydrograph to a HEC-RAS unsteady flow file (.u##). Updates flow data for each boundary condition.',
        },
        params: [
          { name: 'path_project', type: 'str', description: { es: 'Directorio del proyecto.', en: 'Project directory.' } },
          { name: 'name_project', type: 'str', description: { es: 'Nombre del proyecto.', en: 'Project name.' } },
          { name: 'file_number', type: 'int', description: { es: "Número del archivo de flujo (ej. 1 → '.u01').", en: "Flow file number (e.g. 1 → '.u01')." } },
          { name: 'rainfall_plan_name', type: 'int', description: { es: 'Identificador entero del nuevo plan.', en: 'Integer identifier for the new plan.' } },
          { name: 'flow_series', type: 'pd.DataFrame', description: { es: 'DataFrame con índice datetime y una columna por condición de contorno.', en: 'DataFrame with datetime index and one column per boundary condition.' } },
          { name: 'bc_pathnames', type: 'list[str]', description: { es: 'Rutas DSS identificando cada condición de contorno.', en: 'DSS pathnames identifying each boundary condition.' } },
        ],
        returns: { es: 'None.', en: 'None.' },
        note: { es: 'Requiere HEC-RAS 6.x (Windows). Para ejecución automática: pip install rascontrol.', en: 'Requires HEC-RAS 6.x (Windows). For automated runs: pip install rascontrol.' },
      },
      {
        kind: 'function',
        name: 'modify_plan_file',
        module: 'pyhydra.modeling.hydraulic.hec_ras',
        description: { es: 'Modifica un archivo de plan HEC-RAS (.p##) para referenciar un archivo de flujo diferente, permitiendo automatizar múltiples escenarios.', en: 'Modifies a HEC-RAS plan file (.p##) to reference a different flow file, enabling automation of multiple scenarios.' },
        params: [
          { name: 'path_project', type: 'str', description: { es: 'Directorio del proyecto.', en: 'Project directory.' } },
          { name: 'name_project', type: 'str', description: { es: 'Nombre del proyecto.', en: 'Project name.' } },
          { name: 'plan_number', type: 'int', description: { es: 'Número del plan a modificar.', en: 'Plan number to modify.' } },
          { name: 'new_flow_number', type: 'int', description: { es: 'Número del nuevo archivo de flujo.', en: 'New flow file number.' } },
        ],
        returns: { es: 'None.', en: 'None.' },
      },
      // ── SFINCS ────────────────────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'setup_sfincs_model',
        module: 'pyhydra.modeling.hydraulic.sfincs',
        description: {
          es: 'Configura un modelo SFINCS para una cuenca a partir de un DEM. Construye la rejilla desde el DEM recortado a la cuenca, configura puntos fuente de caudal, y fija el periodo de simulación.',
          en: 'Sets up a SFINCS model for a catchment from a DEM. Builds the grid from the clipped DEM, configures discharge source points and sets the simulation period.',
        },
        params: [
          { name: 'basin_geom', type: 'GeoDataFrame', description: { es: 'GeoDataFrame (fila única) con el polígono de la cuenca.', en: 'GeoDataFrame (single row) with the catchment polygon.' } },
          { name: 'dem_path', type: 'str', description: { es: 'Ruta al DEM GeoTIFF de entrada.', en: 'Path to the input DEM GeoTIFF.' } },
          { name: 'output_dir', type: 'str', description: { es: 'Directorio raíz para los archivos del modelo SFINCS.', en: 'Root directory for SFINCS model files.' } },
          { name: 'discharge_series', type: 'pd.DataFrame', description: { es: 'DataFrame con índice datetime y una columna por punto fuente (m³/s).', en: 'DataFrame with datetime index and one column per source point (m³/s).' } },
          { name: 'src_points', type: 'GeoDataFrame', description: { es: 'Geometrías de los puntos fuente de caudal.', en: 'Geometries of the discharge source points.' } },
          { name: 'crs', type: 'int', default: '32630', description: { es: 'Código EPSG del CRS del modelo.', en: 'EPSG code for the model CRS.' } },
          { name: 'resolution', type: 'float', default: '100.0', description: { es: 'Resolución de la rejilla en metros.', en: 'Grid resolution in metres.' } },
          { name: 'manning', type: 'float', default: '0.04', description: { es: 'Rugosidad de Manning uniforme.', en: 'Uniform Manning roughness.' } },
          { name: 'tref/tstart/tstop', type: 'str', description: { es: "Periodo de simulación en formato 'YYYYMMDD HHMMSS'.", en: "Simulation period in 'YYYYMMDD HHMMSS' format." } },
        ],
        returns: { es: 'SfincsModel configurado (no escrito — llamar mod.write() para persistir).', en: 'Configured SfincsModel (not yet written — call mod.write() to persist).' },
        note: { es: 'Requiere: pip install hydromt_sfincs rasterio geopandas', en: 'Requires: pip install hydromt_sfincs rasterio geopandas' },
        example: `from pyhydra.modeling.hydraulic.sfincs import setup_sfincs_model, run_sfincs
mod = setup_sfincs_model(
    basin_geom=basin_gdf,
    dem_path="dem.tif",
    output_dir="sfincs_run/",
    discharge_series=Q_df,
    src_points=src_gdf,
)
mod.write()
run_sfincs("sfincs_run/", sfincs_exe="./sfincs")`,
      },
      {
        kind: 'function',
        name: 'write_manning_wl_boundary',
        module: 'pyhydra.modeling.hydraulic.sfincs',
        description: {
          es: 'Añade una condición de contorno de nivel del agua (profundidad normal de Manning) en el borde aguas abajo de un directorio SFINCS existente. Modifica sfincs.msk, escribe sfincs.bnd y sfincs.bzs, y actualiza sfincs.inp.',
          en: 'Adds a water-level boundary condition (Manning normal depth) at the downstream edge of an existing SFINCS directory. Modifies sfincs.msk, writes sfincs.bnd and sfincs.bzs, and updates sfincs.inp.',
        },
        params: [
          { name: 'model_dir', type: 'str', description: { es: 'Directorio raíz de la ejecución SFINCS (contiene sfincs.inp).', en: 'Root directory of the SFINCS run (contains sfincs.inp).' } },
          { name: 'discharge_series', type: 'pd.DataFrame', description: { es: 'DataFrame con índice datetime y una columna Q (m³/s).', en: 'DataFrame with datetime index and one column Q (m³/s).' } },
          { name: 'ch_w', type: 'float', description: { es: 'Anchura del canal (m).', en: 'Channel width (m).' } },
          { name: 'ch_zb', type: 'float', description: { es: 'Elevación del fondo del canal aguas abajo (m).', en: 'Channel bed elevation at the downstream end (m).' } },
          { name: 'mann_n', type: 'float', default: '0.035', description: { es: "Manning's n del canal.", en: "Manning's n for the channel." } },
          { name: 'slope', type: 'float', default: '2e-4', description: { es: 'Pendiente longitudinal del fondo (m/m).', en: 'Longitudinal bed slope (m/m).' } },
          { name: 'tref', type: 'str', description: { es: "Tiempo de referencia 'YYYYMMDD HHMMSS'.", en: "Reference time 'YYYYMMDD HHMMSS'." } },
        ],
        returns: { es: 'None. Archivos modificados/escritos en model_dir.', en: 'None. Files modified/written in model_dir.' },
      },
      {
        kind: 'function',
        name: 'run_sfincs',
        module: 'pyhydra.modeling.hydraulic.sfincs',
        description: { es: 'Ejecuta el binario SFINCS.', en: 'Runs the SFINCS binary.' },
        params: [
          { name: 'model_dir', type: 'str', description: { es: 'Directorio con los archivos de entrada SFINCS.', en: 'Directory with SFINCS input files.' } },
          { name: 'sfincs_exe', type: 'str', description: { es: 'Ruta al ejecutable SFINCS.', en: 'Path to the SFINCS executable.' } },
          { name: 'timeout', type: 'int', default: '7200', description: { es: 'Tiempo máximo de ejecución en segundos.', en: 'Maximum execution time in seconds.' } },
        ],
        returns: { es: 'Código de retorno del proceso (0 = éxito).', en: 'Process return code (0 = success).' },
      },
      // ── Sensibilidad Manning ──────────────────────────────────────────────────
      {
        kind: 'function',
        name: 'generate_manning_combinations',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: {
          es: 'Ajusta distribuciones a valores de Manning por uso del suelo y genera combinaciones Monte Carlo para análisis de sensibilidad.',
          en: 'Fits distributions to Manning values by land use and generates Monte Carlo combinations for sensitivity analysis.',
        },
        params: [
          { name: 'manning_dist_csv', type: 'str', description: { es: 'Ruta al CSV con valores n por tipo de uso del suelo.', en: 'Path to CSV with n values per land-use type.' } },
          { name: 'n_samples', type: 'int', default: '1000', description: { es: 'Número de combinaciones a generar.', en: 'Number of combinations to generate.' } },
          { name: 'mc_size', type: 'int', default: '10000', description: { es: 'Muestra MC intermedia antes del muestreo sin reemplazo.', en: 'Intermediate MC sample before sampling without replacement.' } },
          { name: 'seed', type: 'int | None', default: 'None', description: { es: 'Semilla aleatoria.', en: 'Random seed.' } },
        ],
        returns: { es: 'pd.DataFrame de forma (n_samples, n_usos_suelo) con combinaciones de n de Manning.', en: 'pd.DataFrame of shape (n_samples, n_land_uses) with Manning n combinations.' },
        example: `from pyhydra.modeling.hydraulic.sensitivity import (
    generate_manning_combinations, load_flood_ensemble, manning_flood_regression
)
combs = generate_manning_combinations("manning_dist.csv", n_samples=500)
ensemble = load_flood_ensemble("./resultados_sfincs/")
df_reg = manning_flood_regression(ensemble, manning_ensemble)`,
      },
      {
        kind: 'function',
        name: 'load_flood_ensemble',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: {
          es: 'Carga mapas de inundación GeoTIFF en un xarray DataArray ordenado numéricamente. Corrige el bug de ordenación lexicográfica del glob.',
          en: 'Loads flood map GeoTIFFs into a numerically sorted xarray DataArray. Fixes the lexicographic sorting bug from glob.',
        },
        params: [
          { name: 'results_dir', type: 'str', description: { es: 'Directorio con GeoTIFF de resultados.', en: 'Directory with result GeoTIFFs.' } },
          { name: 'pattern', type: 'str', default: '"hamax_sim_*.tif"', description: { es: 'Patrón glob.', en: 'Glob pattern.' } },
          { name: 'threshold', type: 'float', default: '0.05', description: { es: 'Umbral de profundidad (m) para definir celda inundada.', en: 'Depth threshold (m) to define a flooded cell.' } },
        ],
        returns: { es: 'xr.DataArray de forma (n_sims, y, x) con dimensión simulation.', en: 'xr.DataArray of shape (n_sims, y, x) with a simulation dimension.' },
      },
      {
        kind: 'function',
        name: 'build_manning_ensemble',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: { es: 'Construye un DataArray de rugosidad de Manning reclasificando el raster de usos del suelo para cada simulación.', en: 'Builds a Manning roughness DataArray by reclassifying the land-use raster for each simulation.' },
        params: [
          { name: 'raster_path', type: 'str', description: { es: 'Raster de usos del suelo.', en: 'Land-use raster.' } },
          { name: 'combinations_dir', type: 'str', description: { es: 'Directorio con CSVs de combinaciones.', en: 'Directory with combination CSVs.' } },
          { name: 'simulation_numbers', type: 'list[int] | None', default: 'None', description: { es: 'Números de simulación. Si None usa todos los CSVs encontrados.', en: 'Simulation numbers. If None, uses all found CSVs.' } },
        ],
        returns: { es: 'xr.DataArray de forma (n_sims, y, x).', en: 'xr.DataArray of shape (n_sims, y, x).' },
      },
      {
        kind: 'function',
        name: 'manning_flood_regression',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: {
          es: 'Calcula pares Manning–métrica de inundación por simulación para análisis de regresión. Extrae n medio y mediano (restringido a celdas mojadas), junto con profundidad media y área inundada.',
          en: 'Computes Manning–flood-metric pairs per simulation for regression analysis. Extracts mean and median n (restricted to wet cells), together with mean depth and flooded area.',
        },
        params: [
          { name: 'flood_ensemble', type: 'xr.DataArray', description: { es: 'Ensemble de inundación (n_sims, y, x).', en: 'Flood ensemble (n_sims, y, x).' } },
          { name: 'manning_ensemble', type: 'xr.DataArray', description: { es: 'Ensemble de rugosidad (n_sims, y, x).', en: 'Roughness ensemble (n_sims, y, x).' } },
          { name: 'cell_area_m2', type: 'float', default: '25.0', description: { es: 'Área de celda en m².', en: 'Cell area in m².' } },
          { name: 'threshold', type: 'float', default: '0.05', description: { es: 'Umbral de profundidad para celda mojada (m).', en: 'Depth threshold for wet cells (m).' } },
        ],
        returns: { es: "pd.DataFrame indexado por simulación con columnas: 'manning_mean', 'manning_median', 'depth_mean', 'depth_median', 'flooded_area_m2'.", en: "pd.DataFrame indexed by simulation with columns: 'manning_mean', 'manning_median', 'depth_mean', 'depth_median', 'flooded_area_m2'." },
      },
      {
        kind: 'function',
        name: 'filter_anomalous_simulations',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: {
          es: 'Elimina simulaciones con valores extremos (Z-score MAD > z_threshold) de uno o varios DataFrames, manteniendo el mismo conjunto de simulaciones en todos ellos.',
          en: 'Removes simulations with outlying values (MAD Z-score > z_threshold) from one or several DataFrames, keeping the same set of simulations across all of them.',
        },
        params: [
          { name: '*results', type: 'pd.DataFrame', description: { es: 'Uno o más DataFrames indexados por número de simulación.', en: 'One or more DataFrames indexed by simulation number.' } },
          { name: 'metrics', type: 'list[str] | None', default: 'None', description: { es: 'Columnas a evaluar. Si None usa todas las numéricas.', en: 'Columns to evaluate. If None, uses all numeric columns.' } },
          { name: 'z_threshold', type: 'float', default: '3.0', description: { es: 'Umbral Z-score normalizado por MAD.', en: 'Normalised MAD Z-score threshold.' } },
        ],
        returns: { es: 'Tupla (mask_booleana, DataFrame_filtrado).', en: 'Tuple (boolean_mask, filtered_DataFrame).' },
      },
      {
        kind: 'function',
        name: 'flooded_area',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: { es: 'Calcula el área inundada (m²) por simulación aplicando un umbral de profundidad.', en: 'Computes flooded area (m²) per simulation applying a depth threshold.' },
        params: [
          { name: 'ensemble', type: 'xr.DataArray', description: { es: 'Ensemble de inundación (n_sims, y, x).', en: 'Flood ensemble (n_sims, y, x).' } },
          { name: 'cell_area_m2', type: 'float', default: '25.0', description: { es: 'Área de celda en m².', en: 'Cell area in m².' } },
          { name: 'threshold', type: 'float', default: '0.05', description: { es: 'Umbral de profundidad (m).', en: 'Depth threshold (m).' } },
        ],
        returns: { es: 'ndarray 1D de longitud n_sims con área inundada en m².', en: '1D ndarray of length n_sims with flooded area in m².' },
      },
      {
        kind: 'function',
        name: 'spatial_stats',
        module: 'pyhydra.modeling.hydraulic.sensitivity',
        description: { es: 'Calcula media, mediana, desviación estándar y máximo espaciales por simulación. Reduce simultáneamente sobre (x, y) para evitar sesgo con NaN.', en: 'Computes spatial mean, median, standard deviation and maximum per simulation. Reduces simultaneously over (x, y) to avoid NaN bias.' },
        params: [
          { name: 'ensemble', type: 'xr.DataArray', description: { es: 'Ensemble (n_sims, y, x).', en: 'Ensemble (n_sims, y, x).' } },
        ],
        returns: { es: "pd.DataFrame con índice = números de simulación y columnas ['mean', 'median', 'std', 'max'].", en: "pd.DataFrame with index = simulation numbers and columns ['mean', 'median', 'std', 'max']." },
      },
    ],
  },
];
