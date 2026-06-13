export type I18n = { es: string; en: string };

export type PilotCaseStep = {
  number: number;
  title: I18n;
  description: I18n;
  notebookPath: string;
  tags: string[];
  tagColor: string;
};

export type PilotCase = {
  slug: string;
  title: string;
  subtitle: I18n;
  location: I18n;
  river: string;
  region: string;
  color: string;
  tag: string;
  summary: I18n;
  challenge: I18n;
  approach: I18n;
  steps: PilotCaseStep[];
  stats: Array<{ value: string; label: I18n }>;
  keyFindings: I18n[];
  references?: Array<{
    title: I18n;
    description: I18n;
    href?: string;
    cta?: I18n;
  }>;
  figures: Array<{ title: I18n; caption: I18n; svg: string }>;
};

// ─── SVG figures ────────────────────────────────────────────────────────────

const workflowSvg = `
<svg viewBox="0 0 760 400" role="img" aria-label="Flujo metodológico Los Corrales de Buelna" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="400" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#0f172a">Pipeline: Los Corrales de Buelna — Río Besaya</text>

  <!-- Row 1: steps 1-4 -->
  <rect x="24" y="56" width="158" height="76" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="32" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#1d4ed8">01</text>
  <text x="32" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#1e40af">Adquisición</text>
  <text x="32" y="110" font-family="Inter, system-ui" font-size="10" fill="#475569">13 estaciones · 42 años</text>
  <text x="32" y="124" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Datos</text>

  <path d="M182 94 L196 94" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="196" y="56" width="158" height="76" rx="8" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1.5"/>
  <text x="204" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#6d28d9">02</text>
  <text x="204" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#5b21b6">Interpolación</text>
  <text x="204" y="110" font-family="Inter, system-ui" font-size="10" fill="#475569">Kriging · UK · IDW</text>
  <text x="204" y="124" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Análisis esp.</text>

  <path d="M354 94 L368 94" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="368" y="56" width="158" height="76" rx="8" fill="#eef2ff" stroke="#c7d2fe" stroke-width="1.5"/>
  <text x="376" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#3730a3">03</text>
  <text x="376" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#312e81">Extremos GEV</text>
  <text x="376" y="110" font-family="Inter, system-ui" font-size="10" fill="#475569">T10 · T100 · T500</text>
  <text x="376" y="124" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Clima</text>

  <path d="M526 94 L540 94" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="540" y="56" width="196" height="76" rx="8" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
  <text x="548" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#92400e">04</text>
  <text x="548" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#78350f">HEC-HMS diseño</text>
  <text x="548" y="110" font-family="Inter, system-ui" font-size="10" fill="#475569">Calibración NSE &gt; 0.8</text>
  <text x="548" y="124" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Modelización</text>

  <!-- vertical connector 4→5 -->
  <path d="M638 132 L638 188" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <!-- Row 2: steps 8←7←6←5 -->
  <rect x="540" y="188" width="196" height="76" rx="8" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
  <text x="548" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#92400e">05</text>
  <text x="548" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#78350f">Simulación continua</text>
  <text x="548" y="242" font-family="Inter, system-ui" font-size="10" fill="#475569">42 a · separación eventos</text>
  <text x="548" y="256" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Modelización</text>

  <path d="M540 226 L526 226" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="368" y="188" width="158" height="76" rx="8" fill="#fdf4ff" stroke="#e9d5ff" stroke-width="1.5"/>
  <text x="376" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#7e22ce">06</text>
  <text x="376" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#6b21a8">Cópulas Gausianas</text>
  <text x="376" y="242" font-family="Inter, system-ui" font-size="10" fill="#475569">PCA · K-Means · MaxDiss</text>
  <text x="376" y="256" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Análisis esp.</text>

  <path d="M368 226 L354 226" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="196" y="188" width="158" height="76" rx="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
  <text x="204" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#9a3412">07</text>
  <text x="204" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#7c2d12">Hidráulica 2D (Iber)</text>
  <text x="204" y="242" font-family="Inter, system-ui" font-size="10" fill="#475569">LIDAR 0.5 pts/m²</text>
  <text x="204" y="256" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">Modelización</text>

  <path d="M196 226 L182 226" stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="24" y="188" width="158" height="76" rx="8" fill="#fff1f2" stroke="#fecdd3" stroke-width="1.5"/>
  <text x="32" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#be123c">08</text>
  <text x="32" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#9f1239">Mapas de riesgo</text>
  <text x="32" y="242" font-family="Inter, system-ui" font-size="10" fill="#475569">Peligrosidad · Vulnerabilidad</text>
  <text x="32" y="256" font-family="Inter, system-ui" font-size="9" fill="#94a3b8">T10 · T100 · T500</text>

  <!-- Results bar -->
  <rect x="24" y="292" width="712" height="88" rx="10" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="380" y="316" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">RESULTADOS PRINCIPALES</text>
  <text x="122" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#1d4ed8" text-anchor="middle">13</text>
  <text x="122" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">estaciones pluvio.</text>
  <text x="302" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#7c3aed" text-anchor="middle">42 a</text>
  <text x="302" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">años de datos</text>
  <text x="482" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#be123c" text-anchor="middle">&gt;13%</text>
  <text x="482" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">población en riesgo</text>
  <text x="652" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#0d9488" text-anchor="middle">1946</text>
  <text x="652" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">validación ortofoto</text>

  <defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8"/>
    </marker>
    <marker id="arr-l" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto">
      <path d="M7,0 L7,6 L0,3 z" fill="#94a3b8"/>
    </marker>
  </defs>
</svg>`;

// ─── Pilot cases ────────────────────────────────────────────────────────────

export const pilotCases: PilotCase[] = [
  {
    slug: 'los-corrales-buelna',
    title: 'Los Corrales de Buelna',
    subtitle: {
      es: 'Evaluación integral del riesgo de inundación del Río Besaya, Cantabria',
      en: 'Comprehensive flood risk assessment of the Besaya River, Cantabria',
    },
    location: {
      es: 'Los Corrales de Buelna, Cantabria, España',
      en: 'Los Corrales de Buelna, Cantabria, Spain',
    },
    river: 'Río Besaya',
    region: 'Cantabria',
    color: 'from-blue-900 via-blue-800 to-slate-900',
    tag: 'Caso Piloto',
    summary: {
      es: 'Los Corrales de Buelna es el caso piloto que dio origen a buena parte de HYDRA: un estudio real del riesgo de inundación del río Besaya desarrollado como Trabajo Fin de Máster (2017) y publicado después en la Revista de Obras Públicas. El flujo reproduce la cadena completa del trabajo original: datos observados, control topográfico LIDAR, interpolación espacial de precipitación, simulación hidrológica, reconstrucción sintética de avenidas, hidráulica 2D y mapas finales de peligrosidad, vulnerabilidad y riesgo. El municipio se asienta en el fondo de valle del Besaya, con una cuenca corta y de fuerte desnivel que responde muy rápido a la precipitación; más del 13% de la población y cerca del 20% de la superficie municipal pueden quedar afectados.',
      en: 'Los Corrales de Buelna is the pilot case that seeded much of HYDRA: a real flood-risk study of the Besaya River developed as a Master\'s Thesis — TFM (2017) — and later published in Revista de Obras Públicas. The workflow reproduces the full chain of the original work: observed data, LIDAR topographic control, spatial rainfall interpolation, hydrological simulation, synthetic flood-event reconstruction, 2D hydraulics, and final hazard, vulnerability and risk maps. The town sits on the Besaya valley floor, in a short and steep catchment that responds rapidly to rainfall; more than 13% of the population and nearly 20% of the municipal area can be affected.',
    },
    challenge: {
      es: 'El problema no es solo calcular un caudal de diseño. La baja densidad de pluviómetros sobre la cuenca y la longitud limitada de las series observadas dificultan construir hietogramas representativos para eventos raros. Con la metodología habitual, las series cortas pueden subestimar los caudales pico en un 50-60%, lo que desplaza los mapas de inundación hacia el lado de la inseguridad. Además, la canalización urbana del tramo medio evita desbordamientos locales pero traslada el problema aguas abajo, donde el cauce se vuelve meandriforme, pierde velocidad y deposita sedimentos.',
      en: 'The problem is not merely estimating a design discharge. Sparse rain-gauge coverage and limited observed record length make it difficult to build representative hyetographs for rare events. With the conventional workflow, short records can underestimate peak flows by 50-60%, shifting flood maps toward the unsafe side. In addition, the urban channelisation of the middle reach prevents local overtopping but transfers the problem downstream, where the river becomes meandering, loses velocity and deposits sediment.',
    },
    approach: {
      es: 'HYDRA organiza el caso en ocho notebooks reproducibles. La idea central procede del artículo de partida: no estimar la inundación solo desde hietogramas de diseño, sino reconstruir muchas dinámicas de avenida y aplicar la estadística de extremos sobre el calado y la velocidad resultantes. A partir de 42 años de caudales diarios se separan 209 eventos, se clasifican formas de hidrograma con PCA y K-Means, se generan 4973 eventos sintéticos con Cópulas Gaussianas, se seleccionan 400 escenarios representativos con MaxDiss y se simulan hidráulicamente los casos necesarios para reconstruir el espacio completo de inundaciones. La validación se apoya en la ortofoto histórica de 1946, cuya llanura fluvial coincide con la mancha generada para T10.',
      en: 'HYDRA organises the case into eight reproducible notebooks. The core idea comes from the starting article: do not estimate flooding only from design hyetographs, but reconstruct many flood-event dynamics and apply extreme-value statistics to the resulting water depth and velocity. From 42 years of daily discharge, 209 events are separated, hydrograph shapes are classified with PCA and K-Means, 4973 synthetic events are generated with Gaussian Copulas, 400 representative scenarios are selected with MaxDiss, and the necessary hydraulic cases are simulated to reconstruct the full flood space. Validation uses the 1946 historical orthophoto, whose floodplain matches the generated T10 extent.',
    },
    steps: [
      {
        number: 1,
        title: { es: 'Adquisición de datos', en: 'Data acquisition' },
        description: {
          es: 'Carga de 13 estaciones pluviométricas del Gobierno de Cantabria y datos foronómicos diarios en el período Oct 1970 – Oct 2012. Control de calidad: clipping de outliers, validación de fechas, consenso temporal. Exportación de rain_daily.csv, flow_daily.csv y stations_meta.csv.',
          en: 'Loading 13 rainfall stations from Cantabria Government and daily flow gauge data for Oct 1970 – Oct 2012. Quality control: outlier clipping, date validation, temporal consensus. Export of rain_daily.csv, flow_daily.csv and stations_meta.csv.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/01_data_acquisition.ipynb',
        tags: ['Datos'],
        tagColor: 'bg-sky-100 text-sky-700',
      },
      {
        number: 2,
        title: { es: 'Interpolación espacial', en: 'Spatial interpolation' },
        description: {
          es: 'Comparativa de tres métodos geoestadísticos: Kriging Ordinario, Kriging Universal e IDW. Validación cruzada para seleccionar el método con menor RMSE. Generación de campos de precipitación diaria distribuidos sobre las subcuencas del Besaya.',
          en: 'Comparison of three geostatistical methods: Ordinary Kriging, Universal Kriging and IDW. Cross-validation to select the method with lowest RMSE. Generation of daily distributed precipitation fields over the Besaya subbasins.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/02_spatial_interpolation.ipynb',
        tags: ['Análisis esp.'],
        tagColor: 'bg-violet-100 text-violet-700',
      },
      {
        number: 3,
        title: { es: 'Análisis de valores extremos', en: 'Extreme value analysis' },
        description: {
          es: 'Ajuste de distribuciones GEV y GPD a la serie de caudales en las estaciones de aforo de Torrelavega y Las Caldas. Estimación de cuantiles para períodos de retorno T10, T100 y T500. Análisis de precipitaciones extremas para la obtención de hietogramas de cálculo.',
          en: 'GEV and GPD distribution fitting to flow series at Torrelavega and Las Caldas gauging stations. Quantile estimation for T10, T100 and T500 return periods. Extreme precipitation analysis to generate design hyetograms.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/03_extreme_value_analysis.ipynb',
        tags: ['Clima'],
        tagColor: 'bg-indigo-100 text-indigo-700',
      },
      {
        number: 4,
        title: { es: 'Tormenta de diseño + HEC-HMS', en: 'Design storm + HEC-HMS' },
        description: {
          es: 'Hietogramas de diseño asociados a T10, T100 y T500. Modelo hidrológico HEC-HMS con método SMA de infiltración y transformación unitaria. Calibración en Torrelavega y Las Caldas (Oct 1970 – Oct 2000) y validación (Oct 2000 – Oct 2012). Nash-Sutcliffe > 0.8 a escala diaria.',
          en: 'Design hyetograms for T10, T100 and T500. HEC-HMS hydrological model with SMA infiltration and unit hydrograph transformation. Calibration at Torrelavega and Las Caldas (Oct 1970 – Oct 2000) and validation (Oct 2000 – Oct 2012). Nash-Sutcliffe > 0.8 at daily scale.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/04_design_storm_hms.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 5,
        title: { es: 'Simulación continua', en: 'Continuous simulation' },
        description: {
          es: 'Simulación hidrológica continua de 42 años con HEC-HMS para obtener la serie temporal de caudales sintéticos. Separación de la serie en eventos de inundación estableciendo un umbral de caudal. Cada evento queda caracterizado por cuatro parámetros: Q_max, Q_med, duración T y tipo de hidrograma.',
          en: '42-year continuous HEC-HMS hydrological simulation to obtain the synthetic flow time series. Event separation by flow threshold. Each event is characterised by four parameters: Q_max, Q_med, duration T and hydrograph type.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/05_continuous_simulation.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 6,
        title: { es: 'Reconstrucción híbrida (cópulas)', en: 'Hybrid event reconstruction (copulas)' },
        description: {
          es: 'Clasificación de hidrogramas según su forma mediante PCA y K-Means. Generación de eventos sintéticos mediante regresión probabilística con Cópulas Gaussianas (Ben Alaya et al., 2014). Selección de eventos representativos por algoritmo de máxima disimilitud (MaxDiss). Reconstrucción de hidrogramas con polinomios de grado 2.',
          en: 'Hydrograph shape classification via PCA and K-Means. Synthetic event generation via probabilistic regression with Gaussian Copulas (Ben Alaya et al., 2014). Representative event selection by Maximum Dissimilarity Algorithm (MaxDiss). Hydrograph reconstruction with 2nd-degree polynomials.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/06_hybrid_event_reconstruction.ipynb',
        tags: ['Análisis esp.', 'Clima'],
        tagColor: 'bg-violet-100 text-violet-700',
      },
      {
        number: 7,
        title: { es: 'Hidráulica 2D (Iber / HEC-RAS)', en: '2D hydraulics (Iber / HEC-RAS)' },
        description: {
          es: 'Modelización hidráulica bidimensional de flujo turbulento en lámina libre. Malla de cálculo generada con RTIN sobre MDT LIDAR (0.5 pts/m²). Asignación de coeficientes de rugosidad de Manning por usos del suelo. Mapas de calado y velocidad para los eventos sintéticos seleccionados.',
          en: '2D turbulent free-surface hydraulic modelling. Computational mesh generated with RTIN on LIDAR DTM (0.5 pts/m²). Manning roughness coefficient assignment by land use. Depth and velocity maps for selected synthetic events.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 8,
        title: { es: 'Períodos de retorno y mapas de riesgo', en: 'Return periods & risk maps' },
        description: {
          es: 'Reconstrucción de manchas de inundación para eventos no simulados mediante interpolación KNN. Estadística de extremos píxel a píxel con CDF empírica para obtener calado y velocidad por período de retorno. Mapas de peligrosidad (índice HR), vulnerabilidad (AV) y riesgo según metodología MAGRAMA 2013 para T10, T100 y T500.',
          en: 'Flood spot reconstruction for non-simulated events via KNN interpolation. Pixel-wise extreme statistics with empirical CDF to obtain depth and velocity by return period. Hazard (HR index), vulnerability (AV) and risk maps per MAGRAMA 2013 methodology for T10, T100 and T500.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/08_hybrid_return_periods.ipynb',
        tags: ['Análisis esp.', 'Modelización'],
        tagColor: 'bg-rose-100 text-rose-700',
      },
    ],
    stats: [
      { value: '13', label: { es: 'Estaciones pluviométricas', en: 'Rain gauges' } },
      { value: '42', label: { es: 'Años de datos (1970–2012)', en: 'Years of data (1970–2012)' } },
      { value: 'T10·T100·T500', label: { es: 'Períodos de retorno', en: 'Return periods' } },
      { value: '>13%', label: { es: 'Población en zona inundable', en: 'Population in floodplain' } },
    ],
    keyFindings: [
      {
        es: 'La metodología híbrida genera manchas de inundación más extensas que la metodología habitual para el mismo período de retorno, permaneciendo del lado de la seguridad.',
        en: 'The hybrid methodology generates larger flood spots than the traditional approach for the same return period, remaining on the conservative side.',
      },
      {
        es: 'La mancha de inundación para T10 coincide con la llanura histórica del río Besaya documentada en la ortofoto de 1946, lo que valida de forma independiente la metodología.',
        en: 'The T10 flood spot coincides with the historical Besaya floodplain documented in the 1946 orthophoto, providing independent validation of the methodology.',
      },
      {
        es: 'La metodología desplaza el foco estadístico: el período de retorno se calcula sobre calados y velocidades de inundación, no únicamente sobre lluvia o caudal de entrada.',
        en: 'The methodology shifts the statistical focus: the return period is computed on flood depths and velocities, not only on rainfall or input discharge.',
      },
      {
        es: 'Las series cortas y la baja densidad de pluviómetros pueden subestimar los caudales pico en un 50–60%. La generación de eventos sintéticos mediante cópulas cubre el abanico de dinámicas que la metodología habitual no alcanza.',
        en: 'Short records and sparse rain-gauge coverage can underestimate peak flows by 50–60%. Synthetic event generation via copulas covers the range of dynamics that the conventional workflow misses.',
      },
      {
        es: 'La canalización urbana del tramo medio evita desbordamientos locales pero traslada el problema aguas abajo al reducir la velocidad del flujo y depositar sedimentos.',
        en: 'The urban channelling of the middle reach prevents local overflows but transfers the problem downstream by reducing flow velocity and depositing sediments.',
      },
      {
        es: 'Una inundación para cualquier período de retorno estudiado puede afectar a más del 13% de la población y al 20% de la superficie del municipio, con al menos 1 fallecido potencial.',
        en: 'A flood for any studied return period can affect more than 13% of the population and 20% of the town\'s surface area, with at least 1 potential fatality.',
      },
    ],
    references: [
      {
        title: {
          es: 'Artículo de partida en Revista de Obras Públicas',
          en: 'Starting article in Revista de Obras Públicas',
        },
        description: {
          es: 'Navas Fernández, Sánchez Espeso y del Jesus Peñil (2018), "Evaluación y análisis del riesgo de inundación del Río Besaya a su paso por Los Corrales de Buelna, Cantabria". Este artículo fue el punto de partida metodológico de todo el caso piloto.',
          en: 'Navas Fernández, Sánchez Espeso and del Jesus Peñil (2018), "Flood risk assessment of the Besaya River at Los Corrales de Buelna, Cantabria". This article was the methodological starting point for the whole pilot case.',
        },
        href: 'https://dialnet.unirioja.es/servlet/articulo?codigo=6476731',
        cta: { es: 'Ver en Dialnet', en: 'View on Dialnet' },
      },
      {
        title: {
          es: 'Trabajo Fin de Máster completo',
          en: "Full Master's Thesis (TFM)",
        },
        description: {
          es: 'Memoria original de 2017 depositada en el repositorio de la Universidad de Cantabria, con el desarrollo completo del caso Besaya, anexos metodológicos, mapas y validaciones.',
          en: "Original 2017 Master's Thesis (TFM) deposited in the University of Cantabria repository, with the full Besaya case, methodological annexes, maps and validation material.",
        },
        href: 'https://repositorio.unican.es/xmlui/bitstream/handle/10902/10636/Navas+Fern%C3%A1ndez,+Salvador.pdf?sequence=1',
        cta: { es: 'Abrir PDF', en: 'Open PDF' },
      },
      {
        title: {
          es: 'Datos observados del caso Besaya',
          en: 'Observed data for the Besaya case',
        },
        description: {
          es: 'Series de precipitación de 13 estaciones del Gobierno de Cantabria y caudal diario en el período Oct 1970-Oct 2012; el primer notebook documenta control de calidad, metadatos y exportaciones reproducibles.',
          en: 'Rainfall series from 13 Cantabria Government stations and daily streamflow for Oct 1970-Oct 2012; the first notebook documents quality control, metadata and reproducible exports.',
        },
      },
      {
        title: {
          es: 'Metodología híbrida con cópulas',
          en: 'Hybrid copula methodology',
        },
        description: {
          es: 'La reconstrucción de eventos utiliza Cópulas Gaussianas inspiradas en Ben Alaya et al. (2014) para preservar dependencias multivariantes entre los parámetros del hidrograma.',
          en: 'Event reconstruction uses Gaussian Copulas inspired by Ben Alaya et al. (2014) to preserve multivariate dependence between hydrograph parameters.',
        },
      },
      {
        title: {
          es: 'Mapas de peligrosidad, vulnerabilidad y riesgo',
          en: 'Hazard, vulnerability and risk maps',
        },
        description: {
          es: 'El cierre del caso aplica índices de peligrosidad y vulnerabilidad compatibles con la metodología MAGRAMA 2013 para T10, T100 y T500.',
          en: 'The final case step applies hazard and vulnerability indices aligned with the MAGRAMA 2013 methodology for T10, T100 and T500.',
        },
      },
      {
        title: {
          es: 'Validación geomorfológica independiente',
          en: 'Independent geomorphological validation',
        },
        description: {
          es: 'La ortofoto histórica de 1946 se usa como referencia externa para comprobar que la mancha T10 reproduce la llanura fluvial histórica del Besaya.',
          en: 'The 1946 historical orthophoto is used as an external reference to verify that the T10 extent reproduces the historical Besaya floodplain.',
        },
      },
    ],
    figures: [
      {
        title: {
          es: 'Flujo metodológico completo — 8 pasos',
          en: 'Full methodology workflow — 8 steps',
        },
        caption: {
          es: 'Pipeline integrado: desde la adquisición de 13 estaciones pluviométricas hasta los mapas de peligrosidad, vulnerabilidad y riesgo para T10, T100 y T500. La reconstrucción híbrida mediante cópulas Gaussianas (paso 6) es la clave diferencial frente a la metodología tradicional.',
          en: 'Integrated pipeline: from acquisition of 13 rainfall stations to hazard, vulnerability and risk maps for T10, T100 and T500. The hybrid reconstruction via Gaussian Copulas (step 6) is the key differentiator from the traditional methodology.',
        },
        svg: workflowSvg,
      },
    ],
  },
];
