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
<svg viewBox="0 0 760 400" width="100%" role="img" aria-label="Flujo metodológico Los Corrales de Buelna" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr-bc" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#475569"/>
    </marker>
    <marker id="arr-l-bc" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto">
      <path d="M7,0 L7,6 L0,3 z" fill="#475569"/>
    </marker>
  </defs>

  <rect width="760" height="400" rx="8" fill="#0f172a"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9">Pipeline: Los Corrales de Buelna — Río Besaya (ROP 3598, 2018)</text>

  <!-- Row 1: steps 1-4 -->
  <rect x="24" y="56" width="158" height="76" rx="8" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="32" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#60a5fa">01</text>
  <text x="32" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#93c5fd">Adquisición</text>
  <text x="32" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">13 pluvióm. · aforos Besaya</text>
  <text x="32" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">LIDAR 0.5 pts/m² · BTA 25m</text>

  <path d="M182 94 L196 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="196" y="56" width="158" height="76" rx="8" fill="#1a0c3e" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="204" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#a78bfa">02</text>
  <text x="204" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#c4b5fd">Interpolación geoest.</text>
  <text x="204" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">KO · UK · IDW → Taylor</text>
  <text x="204" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">IDW seleccionado · 9 subcuencas</text>

  <path d="M354 94 L368 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="368" y="56" width="158" height="76" rx="8" fill="#0e1545" stroke="#6366f1" stroke-width="1.5"/>
  <text x="376" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#818cf8">03</text>
  <text x="376" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#a5b4fc">Extremos de caudal</text>
  <text x="376" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">GEV · GPD sobre aforos</text>
  <text x="376" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">T10 · T100 · T500</text>

  <path d="M526 94 L540 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="540" y="56" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">04</text>
  <text x="548" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d">HEC-HMS calibrado</text>
  <text x="548" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">SMA + Clark + Muskingum</text>
  <text x="548" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">NSE &gt; 0.8 · Torrelavega + Las Caldas</text>

  <!-- vertical connector 4→5 -->
  <path d="M638 132 L638 188" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <!-- Row 2: steps 8←7←6←5 -->
  <rect x="540" y="188" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">05</text>
  <text x="548" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d">Separación de eventos</text>
  <text x="548" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">Umbral → Qmax · Qmed · T · Tipo</text>
  <text x="548" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Serie continua 1970–2012</text>

  <path d="M540 226 L526 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

  <rect x="368" y="188" width="158" height="76" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="376" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#c084fc">06</text>
  <text x="376" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#d8b4fe">Síntesis híbrida</text>
  <text x="376" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">PCA+K-Means+Cóp. Gauss.+MaxDiss</text>
  <text x="376" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Reconstrucción polinomios grado 2</text>

  <path d="M368 226 L354 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

  <rect x="196" y="188" width="158" height="76" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="204" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb923c">07</text>
  <text x="204" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fdba74">Iber / HEC-RAS 2D</text>
  <text x="204" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">RTIN · LIDAR 0.5 pts/m²</text>
  <text x="204" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">Malla ≤ 8 m · flujo no permanente</text>

  <path d="M196 226 L182 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

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
</svg>`;

// ─── SVG figures — Valencia DANA ────────────────────────────────────────────

const danaSvg = `
<svg viewBox="0 0 760 280" width="100%" role="img" aria-label="Flujo metodológico Valencia DANA 2024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr-dana" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#475569"/>
    </marker>
  </defs>

  <rect width="760" height="280" rx="8" fill="#0f172a"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9">Pipeline: Valencia DANA — 29 octubre 2024 (JIA 2025)</text>

  <!-- Step 01 -->
  <rect x="24" y="56" width="330" height="88" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="36" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#fb923c">01</text>
  <text x="36" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#fdba74">Datos y contexto histórico</text>
  <text x="36" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">9 estaciones AEMET · SIAR · AVAMET</text>
  <text x="36" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b">AMS por año hidrológico · Turís 8337X · Carlet V103</text>

  <path d="M354 100 L380 100" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-dana)"/>

  <!-- Step 02 -->
  <rect x="380" y="56" width="356" height="88" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="392" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#c084fc">02</text>
  <text x="392" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#d8b4fe">Ajuste GEV + RFA</text>
  <text x="392" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">MLE · L-mom · Bayesiano (HMC/Stan) — SD vs CD</text>
  <text x="392" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b">Individual · RFA local (9 est.) · RFA global (C. Valenciana)</text>

  <!-- Results bar -->
  <rect x="24" y="172" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="196" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle">RESULTADOS PRINCIPALES — Turís (8337X)</text>
  <text x="122" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#fb923c" text-anchor="middle">710,8 mm</text>
  <text x="122" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">récord diario nacional</text>
  <text x="322" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#c084fc" text-anchor="middle">31.345 años</text>
  <text x="322" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">T retorno sin DANA (L-mom)</text>
  <text x="522" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#60a5fa" text-anchor="middle">66–91 años</text>
  <text x="522" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">T retorno con DANA</text>
  <text x="682" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#34d399" text-anchor="middle">Bayes</text>
  <text x="682" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle">método más estable</text>
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
      es: 'Los Corrales de Buelna es el caso piloto que dio origen a HYDRA: un estudio real publicado en la Revista de Obras Públicas (ROP 3598, mayo 2018) y galardonado con el Premio de Mejor Calidad y Contenido en el 1.er Concurso Nacional de Proyectos Fin de Máster de Ingeniería de Caminos. El municipio se asienta en el fondo del valle del Besaya — cuenca corta y de fuerte desnivel que responde en horas a la precipitación — y ha sufrido inundaciones históricas recurrentes ligadas a los desbordamientos del río. La metodología propuesta abandona el paradigma habitual de los hietogramas de diseño: genera una colección extensa de eventos sintéticos de crecida mediante técnicas geoestadísticas, simulación hidrológica continua y regresión probabilística con cópulas, y aplica la estadística de extremos directamente sobre los calados y velocidades obtenidos de la simulación hidráulica 2D, no sobre la precipitación. Esto permite mapas de peligrosidad, vulnerabilidad y riesgo más fieles a la realidad histórica.',
      en: 'Los Corrales de Buelna is the pilot case that seeded HYDRA: a real study published in the Revista de Obras Públicas (ROP 3598, May 2018) and awarded the Best Quality and Content Prize at the 1st National Competition of Masters Theses in Civil Engineering. The town sits on the Besaya valley floor — a short, steep catchment that responds to rainfall within hours — and has suffered recurring historical floods from the river. The proposed methodology abandons the conventional design-hyetogram paradigm: it generates a large collection of synthetic flood events through geostatistical techniques, continuous hydrological simulation and probabilistic regression with copulas, then applies extreme-value statistics directly to the water depths and velocities from 2D hydraulic simulation rather than to rainfall. This produces hazard, vulnerability and risk maps that more faithfully match historical observations.',
    },
    challenge: {
      es: 'La metodología habitual calcula la magnitud de una inundación tomando como datos de partida los hietogramas de diseño asociados a distintos períodos de retorno, obtenidos a partir de la estadística de extremos de la precipitación, asumiendo una respuesta homogénea en toda la cuenca. El problema surge al no incluir variables que afectan a la respuesta: el grado de saturación del suelo, la distribución espacial de la lluvia o la forma del hidrograma resultante. En el Besaya, la escasa densidad de pluviómetros hace que el modelo hidrológico reduzca sistemáticamente los caudales punta entre un 50 y un 60 % respecto a los observados en el aforo. Si se añade que las series cortas no capturan las dinámicas de crecida más extremas, el resultado es un espacio de eventos posibles muy incompleto que empuja los mapas de inundación hacia el lado de la inseguridad.',
      en: 'The conventional method estimates flood magnitude from design hyetographs associated with return periods derived from extreme-value statistics of rainfall, assuming a homogeneous catchment response. The problem arises from excluding key variables: soil moisture, spatial rainfall distribution and the resulting hydrograph shape. In the Besaya, sparse rain-gauge coverage causes the hydrological model to systematically reduce peak flows by 50–60 % compared with gauged observations. Combined with short records that miss the most extreme flood dynamics, the result is a very incomplete event space that pushes flood maps toward the unsafe side.',
    },
    approach: {
      es: 'La metodología parte de la mejora de la información pluviométrica mediante técnicas geoestadísticas (KO, UK, IDW) que generan series distribuidas por subcuencas; IDW resulta el mejor método dado que en esta cuenca no existe correlación entre altitud y precipitación. Con esas series se calibra HEC-HMS (SMA + Clark + Muskingum) sobre los aforos de Torrelavega y Las Caldas, logrando NSE > 0.8. La simulación continua de 42 años genera la serie de caudales diarios de la que se extraen los eventos de inundación (separados por umbral de desbordamiento) y se caracterizan por cuatro parámetros: Qmax, Qmed, duración T y tipo de hidrograma según su forma. PCA reduce la dimensionalidad; K-Means clasifica los hidrogramas en tipos representativos; las Cópulas Gaussianas (Ben Alaya et al., 2014) generan sintéticamente miles de eventos preservando la correlación entre parámetros; MaxDiss selecciona el subconjunto más representativo del espacio de variación. Los hidrogramas se reconstruyen con polinomios de grado 2 que preservan Qmax y Qmed. La simulación 2D con Iber sobre una malla RTIN del LIDAR de 0.5 pts/m² produce calados y velocidades para los eventos seleccionados. Finalmente, KNN (k = 6, óptimo determinado por minimización del error acumulado) reconstruye los resultados para el resto de eventos y la CDF empírica píxel a píxel entrega calados y velocidades asociados a cada período de retorno, sobre los que se calculan los índices HR, AV y riesgo según la metodología MAGRAMA 2013.',
      en: 'The methodology starts by improving rainfall information through geostatistical techniques (OK, UK, IDW) that generate distributed subcatchment series; IDW performs best because no elevation-precipitation correlation exists in this basin. Those series feed an HEC-HMS calibration (SMA + Clark + Muskingum) against the Torrelavega and Las Caldas gauges, achieving NSE > 0.8. A 42-year continuous simulation yields the daily flow series from which flood events are extracted (separated by an overbank threshold) and characterised by four parameters: Qmax, Qmed, duration T and hydrograph shape type. PCA reduces dimensionality; K-Means classifies hydrographs into representative types; Gaussian Copulas (Ben Alaya et al., 2014) synthetically generate thousands of events preserving parameter correlations; MaxDiss selects the most representative subset of the event space. Hydrographs are reconstructed with degree-2 polynomials preserving Qmax and Qmed. 2D simulation with Iber on a RTIN mesh from 0.5 pts/m² LIDAR data produces depth and velocity for the selected events. Finally, KNN (k = 6, optimal value minimising accumulated error) reconstructs results for the remaining events and a pixel-wise empirical CDF delivers depth and velocity associated with each return period, from which HR, AV and risk indices are computed per the MAGRAMA 2013 methodology.',
    },
    steps: [
      {
        number: 1,
        title: { es: 'Adquisición de datos', en: 'Data acquisition' },
        description: {
          es: 'Carga de 13 estaciones pluviométricas diarias del Gobierno de Cantabria y datos foronómicos de Torrelavega y Las Caldas (Oct 1970 – Oct 2012). Comparativa de modelos digitales del terreno: MDT 25 m del IGN (LIDAR) frente a la Base Topográfica Armonizada (BTA) de la Consejería de Cantabria; las diferencias se concentran en zonas de arboleda espesa y láminas de agua. Control de calidad de los datos LIDAR 0.5 pts/m²: densidad de puntos y clasificación.',
          en: 'Loading 13 daily rainfall stations from Cantabria Government and flow gauge data at Torrelavega and Las Caldas (Oct 1970 – Oct 2012). Digital elevation model comparison: IGN 25 m DTM (LIDAR) vs. Cantabria BTA; differences concentrate in dense woodland and water surfaces. Quality control of 0.5 pts/m² LIDAR data: point density and classification.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/01_data_acquisition.ipynb',
        tags: ['Datos'],
        tagColor: 'bg-sky-100 text-sky-700',
      },
      {
        number: 2,
        title: { es: 'Interpolación geoestadística', en: 'Geostatistical interpolation' },
        description: {
          es: 'Comparativa de Kriging Ordinario (KO), Universal-Kriging (UK) e IDW sobre la red de pluviómetros del Besaya. Validación cruzada representada en diagramas de Taylor (correlación, desviación típica y RMSE). IDW produce el mejor ajuste: en esta cuenca no existe correlación entre altitud y precipitación, lo que invalida la ventaja de UK. Las series interpoladas se distribuyen sobre las 9 subcuencas del Besaya como forzamiento del modelo hidrológico.',
          en: 'Comparison of Ordinary Kriging (OK), Universal Kriging (UK) and IDW over the Besaya rain-gauge network. Cross-validation represented in Taylor diagrams (correlation, standard deviation and RMSE). IDW gives the best fit: no elevation-precipitation correlation exists in this catchment, which negates UK\'s advantage. The interpolated series are distributed over 9 Besaya subbasins as hydrological model forcing.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/02_spatial_interpolation.ipynb',
        tags: ['Análisis esp.'],
        tagColor: 'bg-violet-100 text-violet-700',
      },
      {
        number: 3,
        title: { es: 'Análisis de extremos de caudal', en: 'Streamflow extreme value analysis' },
        description: {
          es: 'Ajuste de distribuciones GEV y GPD a las series de caudales observados en los aforos de Torrelavega y Las Caldas mediante MLE y L-momentos. Estimación de cuantiles de caudal para T10, T100 y T500 con bandas de incertidumbre. Estos cuantiles sirven para contextualizar la capacidad de la simulación continua y como referencia de comparación con la metodología habitual de tormenta de diseño.',
          en: 'GEV and GPD fitting to observed flow series at Torrelavega and Las Caldas gauges via MLE and L-moments. Streamflow quantile estimation for T10, T100 and T500 with uncertainty bands. These quantiles contextualise the continuous simulation capacity and serve as a reference to compare with the conventional design-storm approach.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/03_extreme_value_analysis.ipynb',
        tags: ['Clima'],
        tagColor: 'bg-indigo-100 text-indigo-700',
      },
      {
        number: 4,
        title: { es: 'Calibración HEC-HMS', en: 'HEC-HMS calibration' },
        description: {
          es: 'Modelo hidrológico HEC-HMS con SMA (Soil Moisture Accounting) para la infiltración —tres capas: suelo, agua subterránea 1 y 2—, Clark para la transformación lluvia-caudal y Muskingum para el tránsito en cauce. Calibración sobre las series de caudal diario en Torrelavega y Las Caldas (Oct 1970 – Oct 2000) y validación (Oct 2000 – Oct 2012) con Nash-Sutcliffe > 0.8. La escasa densidad de pluviómetros causa una reducción sistemática del 50–60 % en los caudales punta respecto a los observados.',
          en: 'HEC-HMS hydrological model with SMA (Soil Moisture Accounting) for infiltration — three layers: soil, groundwater 1 and 2 —, Clark for rainfall-runoff transformation and Muskingum for channel routing. Calibration on daily flow series at Torrelavega and Las Caldas (Oct 1970 – Oct 2000) and validation (Oct 2000 – Oct 2012) with Nash-Sutcliffe > 0.8. Sparse rain-gauge coverage causes a systematic 50–60 % reduction in peak flows compared with observations.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/04_design_storm_hms.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 5,
        title: { es: 'Simulación continua y separación de eventos', en: 'Continuous simulation & event separation' },
        description: {
          es: 'Simulación hidrológica continua de 42 años (Oct 1970 – Oct 2012) con HEC-HMS y las series IDW para obtener la serie de caudal diario en Los Corrales. Separación en eventos de inundación mediante un umbral de desbordamiento: inicio en la inflexión de la pendiente creciente que supera el umbral; fin en la primera curva de recesión que lo cruza. Cada evento queda caracterizado por cuatro parámetros: Qmax, Qmed, duración T y tipo de hidrograma según su forma.',
          en: 'Continuous 42-year (Oct 1970 – Oct 2012) HEC-HMS simulation with IDW series to obtain the daily flow series at Los Corrales. Event separation via an overbank threshold: onset at the rising-limb inflection that exceeds the threshold; end at the first recession curve that crosses it back. Each event is characterised by four parameters: Qmax, Qmed, duration T and hydrograph shape type.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/05_continuous_simulation.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 6,
        title: { es: 'Síntesis híbrida de hidrogramas', en: 'Hybrid hydrograph synthesis' },
        description: {
          es: 'PCA reduce la dimensionalidad de la forma del hidrograma; K-Means clasifica los eventos en tipos representativos. Regresión probabilística con Cópulas Gaussianas (Ben Alaya et al., 2014) genera miles de eventos sintéticos preservando la correlación entre Qmax, Qmed, T y tipo. MaxDiss (Máxima Disimilitud) selecciona el subconjunto más representativo que cubre todo el espacio de variación. Cada hidrograma sintético se reconstruye con un polinomio de grado 2 Q*(Q) que preserva Qmax y Qmed: Q*ᵢ = a·(Qᵢ)² + b·Qᵢ.',
          en: 'PCA reduces hydrograph shape dimensionality; K-Means classifies events into representative types. Probabilistic regression with Gaussian Copulas (Ben Alaya et al., 2014) generates thousands of synthetic events preserving the correlation among Qmax, Qmed, T and type. MaxDiss (Maximum Dissimilarity) selects the most representative subset covering the full variation space. Each synthetic hydrograph is reconstructed with a degree-2 polynomial Q*(Q) preserving Qmax and Qmed: Q*ᵢ = a·(Qᵢ)² + b·Qᵢ.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/06_hybrid_event_reconstruction.ipynb',
        tags: ['Análisis esp.', 'Clima'],
        tagColor: 'bg-violet-100 text-violet-700',
      },
      {
        number: 7,
        title: { es: 'Simulación hidráulica 2D', en: '2D hydraulic simulation' },
        description: {
          es: 'Simulación bidimensional de flujo turbulento en lámina libre en régimen no permanente con Iber (artículo original) y HEC-RAS 2D (notebook HYDRA). Malla RTIN generada sobre el LIDAR de 0.5 pts/m² con tolerancia altimétrica de 0.5 m y lado máximo de 8 m. Los hidrogramas reconstruidos de los eventos seleccionados por MaxDiss se introducen en los elementos perimetrales de la malla. Salida: series de calado y velocidad por evento para toda la zona de estudio.',
          en: 'Two-dimensional turbulent free-surface flow simulation in unsteady regime with Iber (original article) and HEC-RAS 2D (HYDRA notebook). RTIN mesh generated from 0.5 pts/m² LIDAR with 0.5 m altimetric tolerance and 8 m maximum side. The reconstructed hydrographs of MaxDiss-selected events are introduced at the perimeter elements of the mesh. Output: depth and velocity time series per event for the entire study area.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/07_hec_ras_hydraulics.ipynb',
        tags: ['Modelización'],
        tagColor: 'bg-amber-100 text-amber-700',
      },
      {
        number: 8,
        title: { es: 'Períodos de retorno y mapas de riesgo', en: 'Return periods & risk maps' },
        description: {
          es: 'Reconstrucción de calados y velocidades para eventos no simulados mediante KNN con k = 6 vecinos (valor óptimo determinado minimizando el error acumulado sobre las 10 últimas de las 150 primeras simulaciones). CDF empírica píxel a píxel: Prob(X ≤ xᵢ) = i/(N+1); período de retorno T a partir de i ≈ N(1 − 1/λT). Mapas de peligrosidad (índice HR), vulnerabilidad (AV) y riesgo según MAGRAMA 2013 para T10, T100 y T500. La mancha T10 coincide geométricamente con la llanura fluvial histórica del Besaya documentada en la ortofoto de 1946.',
          en: 'Depth and velocity reconstruction for non-simulated events via KNN with k = 6 neighbours (optimal value determined by minimising accumulated error over the last 10 of the first 150 simulations). Pixel-wise empirical CDF: Prob(X ≤ xᵢ) = i/(N+1); return period T from i ≈ N(1 − 1/λT). Hazard (HR index), vulnerability (AV) and risk maps per MAGRAMA 2013 for T10, T100 and T500. The T10 flood extent matches geometrically the historical Besaya floodplain documented in the 1946 orthophoto.',
        },
        notebookPath: 'pilot_cases/los_corrales_buelna/08_hybrid_return_periods.ipynb',
        tags: ['Análisis esp.', 'Modelización'],
        tagColor: 'bg-rose-100 text-rose-700',
      },
    ],
    stats: [
      { value: '13', label: { es: 'Estaciones pluviométricas', en: 'Rain gauges' } },
      { value: '42 años', label: { es: 'Simulación continua (1970–2012)', en: 'Continuous simulation (1970–2012)' } },
      { value: 'k=6 KNN', label: { es: 'Vecinos óptimos (mín. error)', en: 'Optimal neighbours (min. error)' } },
      { value: '>13%', label: { es: 'Población en zona inundable', en: 'Population in floodplain' } },
    ],
    keyFindings: [
      {
        es: 'La estadística de extremos se aplica sobre calados y velocidades de inundación —no sobre la precipitación ni el caudal punta— logrando mapas de peligrosidad más fieles a la dinámica real del río.',
        en: 'Extreme-value statistics are applied to flood depths and velocities — not to rainfall or peak discharge — producing hazard maps that more faithfully reflect the actual river dynamics.',
      },
      {
        es: 'La escasa densidad de pluviómetros reduce sistemáticamente los caudales punta del modelo HEC-HMS entre un 50 y un 60 % respecto a los observados; la generación sintética de eventos mediante Cópulas Gaussianas es imprescindible para cubrir ese rango de caudales máximos.',
        en: 'Sparse rain-gauge coverage systematically reduces HEC-HMS peak flows by 50–60 % relative to observations; synthetic event generation via Gaussian Copulas is essential to cover that peak-flow range.',
      },
      {
        es: 'La mancha de inundación para T10 coincide geométricamente con la llanura fluvial histórica documentada en la ortofoto de 1946, validando de forma independiente que los eventos generados son físicamente plausibles.',
        en: 'The T10 flood extent matches geometrically the historical floodplain documented in the 1946 orthophoto, independently validating that the generated events are physically plausible.',
      },
      {
        es: 'La metodología híbrida genera manchas de inundación más extensas que la metodología habitual de tormenta de diseño para el mismo período de retorno, permaneciendo del lado de la seguridad.',
        en: 'The hybrid methodology produces larger flood extents than the conventional design-storm approach for the same return period, remaining on the safe side.',
      },
      {
        es: 'El algoritmo KNN con k = 6 vecinos (óptimo determinado por minimización del error acumulado) permite reconstruir las manchas de inundación del espacio completo de eventos sin necesidad de simulación hidráulica individualizada.',
        en: 'The KNN algorithm with k = 6 neighbours (optimal value determined by minimising accumulated error) reconstructs flood extents for the full event space without individual hydraulic simulation.',
      },
      {
        es: 'Una inundación para cualquier período de retorno estudiado puede afectar a más del 13 % de la población y al 20 % de la superficie del municipio; la canalización del tramo medio traslada el problema aguas abajo sin eliminarlo.',
        en: 'A flood for any studied return period can affect more than 13 % of the population and 20 % of the municipal area; the channelisation of the middle reach transfers the problem downstream without eliminating it.',
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
      es: 'La DANA del 29 de octubre de 2024 desencadenó el episodio de precipitación más extremo registrado en la Comunitat Valenciana: la estación de Turís (8337X) acumuló 710,8 mm en 24 horas — récord nacional — y Carlet (V103) registró 265,1 mm simultáneamente. Este caso piloto es la implementación en HYDRA del trabajo publicado en las VIII Jornadas de Ingeniería del Agua (JIA 2025, Zaragoza): "Comparación de métodos de ajuste para la distribución de precipitaciones extremas: Análisis del evento de octubre 2024 en Valencia" (del Jesus, Navas y Urrea, IHCantabria, 2025). El objetivo central es evaluar cómo se comportan tres métodos de ajuste de la GEV — MLE, L-momentos e inferencia bayesiana — frente a la inclusión o exclusión del evento extremo, a tres escalas espaciales: análisis individual en las dos estaciones más afectadas, análisis regional de frecuencia local (RFA local, 9 estaciones próximas) y análisis regional de frecuencia global (RFA global, red amplia de la Comunitat Valenciana).',
      en: 'The 29 October 2024 DANA triggered the most extreme precipitation episode ever recorded in the Valencian Community: the Turís station (8337X) accumulated 710.8 mm in 24 hours — a national record — while Carlet (V103) simultaneously recorded 265.1 mm. This pilot case is the HYDRA implementation of the work published at the VIII Jornadas de Ingeniería del Agua (JIA 2025, Zaragoza): "Comparison of Fitting Methods for Extreme Precipitation Distributions: Analysis of the October 2024 Event in Valencia" (del Jesus, Navas and Urrea, IHCantabria, 2025). The central objective is to evaluate how three GEV fitting methods — MLE, L-moments and Bayesian inference — behave under the inclusion or exclusion of the extreme event, at three spatial scales: individual analysis at the two most affected stations, local regional frequency analysis (local RFA, 9 nearby stations) and global regional frequency analysis (global RFA, wide Valencian Community network).',
    },
    challenge: {
      es: 'La caracterización estadística de 710,8 mm/24h en Turís enfrenta un problema estructural: sin incluir el evento en la serie, los métodos clásicos estiman períodos de retorno inverosímilmente altos — más de 31.000 años con L-momentos y 11.453 años con MLE —, creando una falsa sensación de seguridad. Al incluirlo, los mismos métodos clásicos colapsan hacia períodos de retorno de 66–91 años en Turís, un salto de tres órdenes de magnitud que los hace poco fiables como herramienta de toma de decisiones. La inferencia bayesiana, al representar explícitamente la incertidumbre paramétrica, proporciona respuestas más estables (3.069 años sin evento, 66 años con evento) aunque igualmente sensibles al escenario. La escala de agregación espacial complica adicionalmente el análisis: el RFA global suaviza tanto el efecto del evento que puede subestimar el riesgo local extremo.',
      en: 'The statistical characterisation of 710.8 mm/24h at Turís faces a structural problem: without including the event in the series, classical methods estimate implausibly high return periods — over 31,000 years with L-moments and 11,453 years with MLE — creating a false sense of security. When it is included, the same classical methods collapse to return periods of 66–91 years at Turís, a three-order-of-magnitude jump that makes them unreliable as decision-making tools. Bayesian inference, by explicitly representing parameter uncertainty, provides more stable answers (3,069 years without event, 66 years with event) though equally sensitive to the scenario. The spatial aggregation scale further complicates the analysis: the global RFA smooths the event effect so much that it can underestimate extreme local risk.',
    },
    approach: {
      es: 'Los notebooks implementan la metodología del artículo JIA 2025. El primer notebook construye la base de datos: 9 estaciones seleccionadas de las redes AEMET (30 disponibles), SIAR (41) y AVAMET (153) distribuidas entre la costa y el interior de la Comunitat Valenciana, mapa de localización, análisis de cobertura temporal y extracción de series de máximos anuales (AMS) por año hidrológico. El segundo notebook aplica tres métodos de ajuste GEV — MLE (máxima verosimilitud), L-momentos (robusto frente a atípicos) e inferencia bayesiana (HMC vía Stan, 4 cadenas × 1000 muestras, priores débiles: μ∼N(0,10⁴), σ∼Cauchy(0,5), ξ∼N(0.25)) — bajo dos escenarios paralelos: sin el evento de 2024 y con él. Los cuantiles regionales (RFA) se obtienen estandarizando las series por Z-score, ajustando la GEV a la muestra conjunta regional y reescalando a escala local mediante z_T,i = y_T · s_i + x̄_i.',
      en: 'The notebooks implement the JIA 2025 article methodology. The first notebook builds the database: 9 selected stations from the AEMET (30 available), SIAR (41) and AVAMET (153) networks distributed between the coast and inland Valencian Community, location map, temporal coverage analysis and annual maximum series (AMS) extraction by hydrological year. The second notebook applies three GEV fitting methods — MLE (maximum likelihood), L-moments (robust to outliers) and Bayesian inference (HMC via Stan, 4 chains × 1000 samples, weak priors: μ∼N(0,10⁴), σ∼Cauchy(0,5), ξ∼N(0.25)) — under two parallel scenarios: without the 2024 event and with it. Regional quantiles (RFA) are obtained by Z-score standardising the series, fitting the GEV to the joint regional sample and back-scaling to local scale via z_T,i = y_T · s_i + x̄_i.',
    },
    steps: [
      {
        number: 1,
        title: { es: 'Datos y contexto histórico', en: 'Data & historical context' },
        description: {
          es: 'Carga de series diarias de 9 estaciones AEMET, SIAR y AVAMET. Mapa de localización con la red local (entorno de Turís y Carlet) y referencia a la red global de la Comunitat Valenciana. Análisis de cobertura temporal: longitud efectiva, porcentaje de lagunas, límite fiable de extrapolación (≈N/2 años). Extracción de máximos anuales (AMS) por año hidrológico. Visualización del evento DANA en el contexto de la serie histórica de Turís y Carlet — el valor de 2024 es un outlier extremo que supera entre 5 y 7 veces el máximo previo.',
          en: 'Loading daily series from 9 AEMET, SIAR and AVAMET stations. Location map with the local network (Turís and Carlet area) and reference to the global Valencian Community network. Temporal coverage analysis: effective record length, gap percentage, reliable extrapolation limit (≈N/2 years). Annual maximum series (AMS) extraction by hydrological year. Visualisation of the DANA event in the historical context of Turís and Carlet — the 2024 value is an extreme outlier exceeding the previous maximum by a factor of 5 to 7.',
        },
        notebookPath: 'pilot_cases/valencia_dana/01_data_exploration.ipynb',
        tags: ['Datos'],
        tagColor: 'bg-orange-100 text-orange-700',
      },
      {
        number: 2,
        title: { es: 'Ajuste GEV y análisis regional', en: 'GEV fitting & regional analysis' },
        description: {
          es: 'Análisis individual en Turís (8337X) y Carlet (V103) con tres métodos — MLE, L-momentos y bayesiano (HMC/Stan) — y dos escenarios: sin evento 2024 (SD) y con evento (CD). Tabla de cuantiles T10/T100/T500 y distribución de probabilidad del período de retorno del valor observado. Análisis regional de frecuencia (RFA) a escala local (9 estaciones) y global (red amplia): estandarización Z-score, ajuste GEV conjunto y retransformación a escala local. Comparación de estimaciones entre métodos y escalas para evaluar robustez y prudencia de cada enfoque.',
          en: 'Individual analysis at Turís (8337X) and Carlet (V103) with three methods — MLE, L-moments and Bayesian (HMC/Stan) — and two scenarios: without 2024 event (SD) and with it (CD). Return-level table T10/T100/T500 and return-period probability distribution for the observed value. Regional frequency analysis (RFA) at local scale (9 stations) and global scale (wide network): Z-score standardisation, joint GEV fitting and back-transformation to local scale. Comparison of estimates across methods and scales to evaluate robustness and conservatism of each approach.',
        },
        notebookPath: 'pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb',
        tags: ['Clima'],
        tagColor: 'bg-red-100 text-red-700',
      },
    ],
    stats: [
      { value: '710,8 mm/día', label: { es: 'Récord en Turís 8337X (29/10/2024)', en: 'Record at Turís 8337X (29/10/2024)' } },
      { value: '66–91 años', label: { es: 'T retorno con evento (análisis indiv.)', en: 'Return period with event (indiv. analysis)' } },
      { value: '>31.000 años', label: { es: 'T retorno sin evento (L-mom, Turís)', en: 'Return period without event (L-mom, Turís)' } },
      { value: '3 métodos × 2', label: { es: 'MLE · L-mom · Bayes — SD vs CD', en: 'MLE · L-mom · Bayes — SD vs CD' } },
    ],
    keyFindings: [
      {
        es: 'Sin incluir el evento en la serie, los métodos clásicos estiman períodos de retorno de 11.453 años (MLE) y 31.345 años (L-momentos) para los 710,8 mm de Turís — valores inverosímiles que crean una falsa sensación de seguridad y conducen a infraestimar el riesgo real.',
        en: 'Without including the event in the series, classical methods estimate return periods of 11,453 years (MLE) and 31,345 years (L-moments) for the 710.8 mm at Turís — implausible values that create a false sense of security and lead to underestimating real risk.',
      },
      {
        es: 'Al incluir el evento, los mismos métodos clásicos colapsan a 66–91 años en Turís y 70–95 años en Carlet: un salto de tres órdenes de magnitud que evidencia su alta sensibilidad al escenario y los hace poco fiables como herramienta estable de toma de decisiones.',
        en: 'When the event is included, the same classical methods collapse to 66–91 years at Turís and 70–95 years at Carlet: a three-order-of-magnitude jump that reveals their high sensitivity to the scenario and makes them unreliable as stable decision-making tools.',
      },
      {
        es: 'La inferencia bayesiana ofrece la respuesta más estable y coherente entre escenarios: 3.069 años sin evento vs 66 años con evento en Turís (análisis individual), evitando los saltos bruscos de MLE y L-momentos. Su superioridad se acentúa a altos períodos de retorno, donde la incertidumbre paramétrica domina.',
        en: 'Bayesian inference provides the most stable and coherent response between scenarios: 3,069 years without event vs 66 years with event at Turís (individual analysis), avoiding the abrupt jumps of MLE and L-moments. Its superiority is accentuated at high return periods, where parameter uncertainty dominates.',
      },
      {
        es: 'El RFA local (9 estaciones próximas) mejora la robustez respecto al análisis individual: T retorno con evento = 34–41 años en Turís, con menor dispersión entre métodos. Ofrece el mejor equilibrio entre sensibilidad al evento extremo y estabilidad estadística.',
        en: 'Local RFA (9 nearby stations) improves robustness over individual analysis: return period with event = 34–41 years at Turís, with lower dispersion between methods. It offers the best balance between sensitivity to the extreme event and statistical stability.',
      },
      {
        es: 'El RFA global suaviza excesivamente los efectos del evento: sin incluirlo, el período de retorno es infinito en ambas estaciones; con él, desciende a 13–19 años en Turís y 7–9 años en Carlet — valores que pueden subestimar el riesgo extremo local si el evento no se incorpora explícitamente.',
        en: 'The global RFA over-smooths the event\'s effects: without including it, the return period is infinite at both stations; with it, it drops to 13–19 years at Turís and 7–9 years at Carlet — values that may underestimate extreme local risk if the event is not explicitly incorporated.',
      },
      {
        es: 'La inclusión del evento de 2024 es determinante para obtener estimaciones realistas: para T500 en Turís, el nivel bayesiano individual pasa de 417,6 mm (sin evento) a 3.004,1 mm (con evento), y el RFA local de 313,7 mm a 1.415,6 mm — diferencias con implicaciones directas en el dimensionamiento de infraestructuras.',
        en: 'Including the 2024 event is essential for realistic estimates: for T500 at Turís, the individual Bayesian level goes from 417.6 mm (without event) to 3,004.1 mm (with event), and the local RFA from 313.7 mm to 1,415.6 mm — differences with direct implications for infrastructure design.',
      },
    ],
    references: [
      {
        title: {
          es: 'del Jesus, Navas y Urrea (2025) — JIA 2025',
          en: 'del Jesus, Navas and Urrea (2025) — JIA 2025',
        },
        description: {
          es: 'Comparación de métodos de ajuste para la distribución de precipitaciones extremas: Análisis del evento de octubre 2024 en Valencia. VIII Jornadas de Ingeniería del Agua, Zaragoza, 22-23 oct. 2025. IHCantabria — Universidad de Cantabria.',
          en: 'Comparison of Fitting Methods for Extreme Precipitation Distributions: Analysis of the October 2024 Event in Valencia. VIII Jornadas de Ingeniería del Agua, Zaragoza, 22-23 Oct. 2025. IHCantabria — Universidad de Cantabria.',
        },
        href: 'https://github.com/navass11/HYDRA/blob/main/Comunicacion_Lluvias_Valencia_V1.pdf',
        cta: { es: 'Ver artículo', en: 'View paper' },
      },
      {
        title: {
          es: 'Informe AEMET — DANA octubre 2024',
          en: 'AEMET report — October 2024 DANA',
        },
        description: {
          es: 'Análisis meteorológico oficial del episodio: registros pluviométricos, evolución sinóptica de la DANA y comparación con valores históricos en la Comunitat Valenciana.',
          en: 'Official meteorological analysis of the episode: rainfall records, synoptic evolution of the DANA and comparison with historical values in the Valencian Community.',
        },
        href: 'https://www.aemet.es/es/noticias/2024/11/dana_octubre_2024',
        cta: { es: 'Ver en AEMET', en: 'View at AEMET' },
      },
      {
        title: {
          es: 'Coles, Pericchi y Sisson (2003)',
          en: 'Coles, Pericchi and Sisson (2003)',
        },
        description: {
          es: 'A fully probabilistic approach to extreme rainfall modeling. Journal of Hydrology, 273(1), 35-50. Referencia metodológica central del análisis bayesiano: muestra que eventos históricos considerados "sorprendentes" no lo son cuando se incorpora la incertidumbre adecuadamente.',
          en: 'A fully probabilistic approach to extreme rainfall modeling. Journal of Hydrology, 273(1), 35-50. Central methodological reference for the Bayesian analysis: shows that historically "surprising" events are not when uncertainty is properly incorporated.',
        },
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
