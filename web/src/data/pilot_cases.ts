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
  <rect width="760" height="400" rx="8" fill="#0f172a"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9">Pipeline: Los Corrales de Buelna — Río Besaya (ROP 3598, 2018)</text>

  <!-- Row 1: steps 1-4 -->
  <rect x="24" y="56" width="158" height="76" rx="8" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="32" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#60a5fa">01</text>
  <text x="32" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#93c5fd">Adquisición</text>
  <text x="32" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">13 pluvióm. · aforos Besaya</text>
  <text x="32" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">LIDAR 0.5 pts/m² · BTA 25m</text>

  <path d="M182 94 L196 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="196" y="56" width="158" height="76" rx="8" fill="#1a0c3e" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="204" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#a78bfa">02</text>
  <text x="204" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#c4b5fd">Interpolación geoest.</text>
  <text x="204" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">KO · UK · IDW → Taylor</text>
  <text x="204" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">IDW seleccionado · 9 subcuencas</text>

  <path d="M354 94 L368 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="368" y="56" width="158" height="76" rx="8" fill="#0e1545" stroke="#6366f1" stroke-width="1.5"/>
  <text x="376" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#818cf8">03</text>
  <text x="376" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#a5b4fc">Extremos de caudal</text>
  <text x="376" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">GEV · GPD sobre aforos</text>
  <text x="376" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">T10 · T100 · T500</text>

  <path d="M526 94 L540 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <rect x="540" y="56" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">04</text>
  <text x="548" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d">HEC-HMS calibrado</text>
  <text x="548" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">SMA + Clark + Muskingum</text>
  <text x="548" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">NSE &gt; 0.8 · Torrelavega + Las Caldas</text>

  <!-- vertical connector 4→5 -->
  <path d="M638 132 L638 188" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr)"/>

  <!-- Row 2: steps 8←7←6←5 -->
  <rect x="540" y="188" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">05</text>
  <text x="548" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d">Separación de eventos</text>
  <text x="548" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">Umbral → Qmax · Qmed · T · Tipo</text>
  <text x="548" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Serie continua 1970–2012</text>

  <path d="M540 226 L526 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="368" y="188" width="158" height="76" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="376" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#c084fc">06</text>
  <text x="376" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#d8b4fe">Síntesis híbrida</text>
  <text x="376" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">PCA+K-Means+Cóp. Gauss.+MaxDiss</text>
  <text x="376" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Reconstrucción polinomios grado 2</text>

  <path d="M368 226 L354 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="196" y="188" width="158" height="76" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="204" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb923c">07</text>
  <text x="204" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fdba74">Iber / HEC-RAS 2D</text>
  <text x="204" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">RTIN · LIDAR 0.5 pts/m²</text>
  <text x="204" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Malla ≤ 8 m · flujo no permanente</text>

  <path d="M196 226 L182 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l)"/>

  <rect x="24" y="188" width="158" height="76" rx="8" fill="#20040e" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="32" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb7185">08</text>
  <text x="32" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fda4af">Riesgo de inundación</text>
  <text x="32" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">KNN k=6 · CDF empírica píxel a píxel</text>
  <text x="32" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">HR · AV · T10 · T100 · T500</text>

  <!-- Results bar -->
  <rect x="24" y="292" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="316" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle">RESULTADOS PRINCIPALES</text>
  <text x="122" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#60a5fa" text-anchor="middle">50–60%</text>
  <text x="122" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">reducción caudal punta HEC-HMS</text>
  <text x="302" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#a78bfa" text-anchor="middle">k=6</text>
  <text x="302" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">vecinos KNN óptimo</text>
  <text x="482" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#fb7185" text-anchor="middle">&gt;13%</text>
  <text x="482" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">población en zona inundable</text>
  <text x="652" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#34d399" text-anchor="middle">1946</text>
  <text x="652" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">validación mancha T10 vs ortofoto</text>

  <defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#475569"/>
    </marker>
    <marker id="arr-l" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto">
      <path d="M7,0 L7,6 L0,3 z" fill="#475569"/>
    </marker>
  </defs>
</svg>`;

// ─── SVG figures — Valencia DANA ────────────────────────────────────────────

const danaSvg = `
<svg viewBox="0 0 760 280" role="img" aria-label="Flujo metodológico Valencia DANA 2024" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="280" rx="8" fill="#0f172a"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9">Pipeline: Valencia DANA — 29 octubre 2024</text>

  <!-- Step 01 -->
  <rect x="24" y="56" width="330" height="88" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="36" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#fb923c">01</text>
  <text x="36" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#fdba74">Exploración de datos</text>
  <text x="36" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">Registros pluviométricos · Control de calidad</text>
  <text x="36" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b">Fuentes: AEMET · CHJ · Meteostat</text>

  <path d="M354 100 L380 100" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr2)"/>

  <!-- Step 02 -->
  <rect x="380" y="56" width="356" height="88" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="392" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#c084fc">02</text>
  <text x="392" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#d8b4fe">Análisis de extremos</text>
  <text x="392" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">GEV / GPD · Período de retorno del evento</text>
  <text x="392" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b">Comparación con registros históricos</text>

  <!-- Results bar -->
  <rect x="24" y="172" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="196" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle">DATOS DEL EPISODIO DANA — 29/10/2024</text>
  <text x="122" y="232" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#fb923c" text-anchor="middle">&gt;900</text>
  <text x="122" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">mm en 8 horas (Chiva)</text>
  <text x="322" y="232" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#c084fc" text-anchor="middle">&gt;220</text>
  <text x="322" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">víctimas mortales</text>
  <text x="522" y="232" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#60a5fa" text-anchor="middle">T&gt;500</text>
  <text x="522" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">período de retorno est.</text>
  <text x="682" y="232" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#34d399" text-anchor="middle">10+</text>
  <text x="682" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">cuencas afectadas</text>

  <defs>
    <marker id="arr2" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#475569"/>
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
  {
    slug: 'valencia-dana',
    title: 'Valencia DANA 2024',
    subtitle: {
      es: 'Análisis del episodio de precipitación extrema del 29 de octubre de 2024 en la provincia de Valencia',
      en: 'Analysis of the extreme precipitation episode of 29 October 2024 in the Valencia province',
    },
    location: {
      es: 'Provincia de Valencia, Comunitat Valenciana, España',
      en: 'Valencia Province, Valencian Community, Spain',
    },
    river: 'Barranc del Poyo · Turia',
    region: 'Valencia',
    color: 'from-orange-900 via-red-900 to-slate-900',
    tag: 'Caso Piloto',
    summary: {
      es: 'La DANA del 29 de octubre de 2024 desencadenó el episodio de lluvia más extremo registrado en España en los últimos 50 años, acumulando más de 900 mm en ocho horas en el municipio de Chiva. Las cuencas del Barranc del Poyo y del Magro respondieron en minutos con caudales punta de diseño milenario, causando más de 220 víctimas mortales y miles de millones de euros en daños. Este caso piloto aplica HYDRA para caracterizar el episodio observado: exploración y control de calidad de los registros disponibles, ajuste de distribuciones de valores extremos y estimación del período de retorno del evento.',
      en: 'The 29 October 2024 DANA triggered the most extreme rainfall episode recorded in Spain in the last 50 years, accumulating more than 900 mm in eight hours at the municipality of Chiva. The Barranc del Poyo and Magro catchments responded in minutes with millennial-design peak flows, causing more than 220 fatalities and billions of euros in damage. This pilot case applies HYDRA to characterise the observed episode: exploration and quality control of available records, extreme-value distribution fitting and return-period estimation of the event.',
    },
    challenge: {
      es: 'La caracterización estadística de eventos tan extremos es metodológicamente compleja: las series de datos disponibles son cortas en comparación con el período de retorno estimado, los pluviómetros horarios fallaron durante el episodio por saturación o daños materiales, y la rapidez del evento (menos de 8 horas) excede la resolución temporal de la mayoría de los registros históricos. Ello obliga a combinar múltiples fuentes (AEMET, CHJ, Meteostat, radar) y a ser muy cuidadoso con la selección del umbral de exceso para el ajuste GPD.',
      en: 'The statistical characterisation of such extreme events is methodologically complex: available data series are short relative to the estimated return period, hourly rain gauges failed during the episode due to saturation or material damage, and the event\'s rapidity (under 8 hours) exceeds the temporal resolution of most historical records. This requires combining multiple sources (AEMET, CHJ, Meteostat, radar) and being very careful with the excess threshold selection for GPD fitting.',
    },
    approach: {
      es: 'El caso se organiza en dos notebooks. El primero explora y depura los registros disponibles: series pluviométricas de estaciones AEMET y CHJ, caudales aforados en el Barranc del Poyo y el Turia, e imágenes de radar del MeteoSat. El segundo aplica el pipeline de análisis de extremos de HYDRA (GEV y GPD por MLE, L-momentos y MAP bayesiano) para estimar el período de retorno del episodio y construir bandas de incertidumbre.',
      en: 'The case is organised in two notebooks. The first explores and cleans available records: rainfall series from AEMET and CHJ stations, gauged flows at the Barranc del Poyo and Turia, and MeteoSat radar images. The second applies the HYDRA extreme-value analysis pipeline (GEV and GPD via MLE, L-moments and Bayesian MAP) to estimate the episode\'s return period and build uncertainty bands.',
    },
    steps: [
      {
        number: 1,
        title: { es: 'Exploración de datos', en: 'Data exploration' },
        description: {
          es: 'Carga de registros pluviométricos horarios y diarios de estaciones AEMET y CHJ para la cuenca del Turia y zonas afectadas. Control de calidad, detección de outliers y lagunas, visualización espacial de isoyetas del episodio y exportación de series limpias para el análisis de extremos.',
          en: 'Loading hourly and daily rainfall records from AEMET and CHJ stations for the Turia catchment and affected areas. Quality control, outlier and gap detection, spatial isohyet visualisation of the episode, and export of clean series for extreme-value analysis.',
        },
        notebookPath: 'pilot_cases/valencia_dana/01_data_exploration.ipynb',
        tags: ['Datos'],
        tagColor: 'bg-orange-100 text-orange-700',
      },
      {
        number: 2,
        title: { es: 'Análisis de valores extremos', en: 'Extreme value analysis' },
        description: {
          es: 'Ajuste de distribuciones GEV y GPD a las series de precipitación máxima anual y sobre umbral (POT). Estimación del período de retorno del evento del 29/10/2024 con intervalos de confianza bootstrap y MAP bayesiano. Comparación con los valores publicados por AEMET y con los mapas de peligrosidad del SNCZI.',
          en: 'GEV and GPD fitting to annual maximum and POT precipitation series. Return-period estimation for the 29/10/2024 event with bootstrap confidence intervals and Bayesian MAP. Comparison with values published by AEMET and with SNCZI hazard maps.',
        },
        notebookPath: 'pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb',
        tags: ['Clima'],
        tagColor: 'bg-red-100 text-red-700',
      },
    ],
    stats: [
      { value: '>900 mm', label: { es: 'Precipitación en 8 h (Chiva)', en: 'Rainfall in 8 h (Chiva)' } },
      { value: '>220', label: { es: 'Víctimas mortales', en: 'Fatalities' } },
      { value: 'T>500', label: { es: 'Período de retorno est.', en: 'Est. return period' } },
      { value: '29/10/2024', label: { es: 'Fecha del evento', en: 'Event date' } },
    ],
    keyFindings: [
      {
        es: 'La precipitación acumulada en 8 horas en Chiva (>900 mm) supera el período de retorno de 500 años para acumulaciones diarias en la mayoría de las distribuciones ajustadas.',
        en: 'The 8-hour accumulated precipitation at Chiva (>900 mm) exceeds the 500-year return period for daily accumulations in most fitted distributions.',
      },
      {
        es: 'La rapidez del episodio (tiempo de concentración < 2 h en el Barranc del Poyo) expone la insuficiencia de los datos diarios para caracterizar eventos convectivos mediterráneos.',
        en: 'The episode\'s rapidity (concentration time < 2 h in the Barranc del Poyo) exposes the inadequacy of daily data for characterising Mediterranean convective events.',
      },
      {
        es: 'La combinación de fuentes (AEMET, CHJ, radar) es imprescindible: varios pluviómetros horarios fallaron durante el pico de intensidad, dejando lagunas en el registro.',
        en: 'Combining sources (AEMET, CHJ, radar) is essential: several hourly rain gauges failed during the intensity peak, leaving gaps in the record.',
      },
    ],
    references: [
      {
        title: {
          es: 'Informe preliminar AEMET sobre la DANA',
          en: 'AEMET preliminary report on the DANA',
        },
        description: {
          es: 'Análisis meteorológico oficial del episodio con registros pluviométricos, evolución sinóptica y comparación con valores históricos.',
          en: 'Official meteorological analysis of the episode with rainfall records, synoptic evolution and comparison with historical values.',
        },
        href: 'https://www.aemet.es/es/noticias/2024/11/dana_octubre_2024',
        cta: { es: 'Ver en AEMET', en: 'View at AEMET' },
      },
    ],
    figures: [
      {
        title: {
          es: 'Pipeline Valencia DANA — 2 pasos',
          en: 'Valencia DANA pipeline — 2 steps',
        },
        caption: {
          es: 'Flujo de trabajo para el episodio DANA: exploración y control de calidad de los registros disponibles (paso 1) y análisis de valores extremos para estimar el período de retorno del evento (paso 2).',
          en: 'Workflow for the DANA episode: exploration and quality control of available records (step 1) and extreme-value analysis to estimate the event return period (step 2).',
        },
        svg: danaSvg,
      },
    ],
  },
];
