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
  accentColor: string;
  icon: string;
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

const m30Svg = `
<svg viewBox="0 0 760 420" width="100%" role="img" aria-label="Pipeline metodológico M30 Manzanares" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr-m30" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#60a5fa"/>
    </marker>
    <marker id="arr-m30-b" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8"/>
    </marker>
  </defs>

  <rect width="760" height="420" rx="8" fill="#0f172a"/>
  <text x="28" y="32" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#f1f5f9">Pipeline: Estadística Multivariada de Inundación — M30 Manzanares</text>

  <!-- Row 1: precip → PCA → copula → maxdiss -->
  <!-- Step 1 -->
  <rect x="24"  y="52" width="148" height="72" rx="7" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="98"  y="72" text-anchor="middle" font-family="Inter" font-size="9" fill="#93c5fd">PASO 1</text>
  <text x="98"  y="86" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">Series de</text>
  <text x="98"  y="100" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">precipitación</text>
  <text x="98"  y="114" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">17 pluviómetros · M30</text>
  <line x1="172" y1="88" x2="196" y2="88" stroke="#60a5fa" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 2 -->
  <rect x="196" y="52" width="148" height="72" rx="7" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="270" y="72" text-anchor="middle" font-family="Inter" font-size="9" fill="#93c5fd">PASO 2</text>
  <text x="270" y="86" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">PCA + K-Means</text>
  <text x="270" y="100" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">clasificación</text>
  <text x="270" y="114" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">24 tipos de evento</text>
  <line x1="344" y1="88" x2="368" y2="88" stroke="#60a5fa" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 3 -->
  <rect x="368" y="52" width="148" height="72" rx="7" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="442" y="72" text-anchor="middle" font-family="Inter" font-size="9" fill="#93c5fd">PASO 3</text>
  <text x="442" y="86" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">Cópula Gaussiana</text>
  <text x="442" y="100" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">multivariada</text>
  <text x="442" y="114" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">~1 000 000 eventos sint.</text>
  <line x1="516" y1="88" x2="540" y2="88" stroke="#60a5fa" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 4 -->
  <rect x="540" y="52" width="196" height="72" rx="7" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="638" y="72" text-anchor="middle" font-family="Inter" font-size="9" fill="#93c5fd">PASO 4</text>
  <text x="638" y="86" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">MaxDiss</text>
  <text x="638" y="100" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">selección</text>
  <text x="638" y="114" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">1 000 eventos representativos</text>

  <!-- Arrow down from step 4 -->
  <line x1="638" y1="124" x2="638" y2="154" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr-m30-b)"/>

  <!-- Row 2: right to left — RAS → HMS → kNN → T de retorno -->
  <!-- Step 5 -->
  <rect x="540" y="155" width="196" height="72" rx="7" fill="#0f2e28" stroke="#059669" stroke-width="1.5"/>
  <text x="638" y="175" text-anchor="middle" font-family="Inter" font-size="9" fill="#6ee7b7">PASO 5</text>
  <text x="638" y="189" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">HEC-HMS</text>
  <text x="638" y="203" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">simulación hidrológica</text>
  <text x="638" y="217" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">1 000 caudales máximos</text>
  <line x1="540" y1="191" x2="516" y2="191" stroke="#059669" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 6 -->
  <rect x="368" y="155" width="148" height="72" rx="7" fill="#0f2e28" stroke="#059669" stroke-width="1.5"/>
  <text x="442" y="175" text-anchor="middle" font-family="Inter" font-size="9" fill="#6ee7b7">PASO 6</text>
  <text x="442" y="189" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">HEC-RAS</text>
  <text x="442" y="203" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">hidráulica 1D</text>
  <text x="442" y="217" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">22 manchas simuladas</text>
  <line x1="368" y1="191" x2="344" y2="191" stroke="#059669" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 7 -->
  <rect x="196" y="155" width="148" height="72" rx="7" fill="#0f2e28" stroke="#059669" stroke-width="1.5"/>
  <text x="270" y="175" text-anchor="middle" font-family="Inter" font-size="9" fill="#6ee7b7">PASO 7</text>
  <text x="270" y="189" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">kNN</text>
  <text x="270" y="203" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">reconstrucción</text>
  <text x="270" y="217" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">1M calados interpolados</text>
  <line x1="196" y1="191" x2="172" y2="191" stroke="#059669" stroke-width="1.5" marker-end="url(#arr-m30)"/>

  <!-- Step 8 -->
  <rect x="24"  y="155" width="148" height="72" rx="7" fill="#0f2e28" stroke="#059669" stroke-width="1.5"/>
  <text x="98"  y="175" text-anchor="middle" font-family="Inter" font-size="9" fill="#6ee7b7">PASO 8</text>
  <text x="98"  y="189" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">Régimen extremal</text>
  <text x="98"  y="203" text-anchor="middle" font-family="Inter" font-size="11" font-weight="600" fill="#f1f5f9">multivariado</text>
  <text x="98"  y="217" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">T = 2…500 años</text>

  <!-- Divider -->
  <line x1="24" y1="260" x2="736" y2="260" stroke="#1e293b" stroke-width="1"/>

  <!-- Results comparison row -->
  <text x="28" y="283" font-family="Inter" font-size="10" font-weight="700" fill="#94a3b8">SECCIÓN PUENTE DE TOLEDO — Calado por período de retorno:</text>

  <!-- T=100 comparison -->
  <rect x="24" y="295" width="218" height="54" rx="6" fill="#111827" stroke="#1e293b" stroke-width="1"/>
  <text x="133" y="316" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">T = 100 AÑOS</text>
  <text x="78"  y="336" text-anchor="middle" font-family="Inter" font-size="18" font-weight="700" fill="#60a5fa">5.05 m</text>
  <text x="78"  y="349" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">Clásico</text>
  <text x="178" y="336" text-anchor="middle" font-family="Inter" font-size="18" font-weight="700" fill="#f97316">6.00 m</text>
  <text x="178" y="349" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">Cópula</text>
  <text x="128" y="340" text-anchor="middle" font-family="Inter" font-size="11" fill="#475569">+0.95 m</text>

  <!-- T=500 comparison -->
  <rect x="254" y="295" width="218" height="54" rx="6" fill="#111827" stroke="#1e293b" stroke-width="1"/>
  <text x="363" y="316" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">T = 500 AÑOS</text>
  <text x="308" y="336" text-anchor="middle" font-family="Inter" font-size="18" font-weight="700" fill="#60a5fa">6.78 m</text>
  <text x="308" y="349" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">Clásico</text>
  <text x="408" y="336" text-anchor="middle" font-family="Inter" font-size="18" font-weight="700" fill="#f97316">7.61 m</text>
  <text x="408" y="349" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">Cópula</text>
  <text x="358" y="340" text-anchor="middle" font-family="Inter" font-size="11" fill="#475569">+0.83 m</text>

  <!-- Lambda / events stats -->
  <rect x="484" y="295" width="252" height="54" rx="6" fill="#111827" stroke="#1e293b" stroke-width="1"/>
  <text x="610" y="312" text-anchor="middle" font-family="Inter" font-size="9" fill="#94a3b8">ESTADÍSTICAS DE LA METODOLOGÍA</text>
  <text x="530" y="330" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#f1f5f9">λ = 5.17</text>
  <text x="530" y="344" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">eventos/año</text>
  <text x="620" y="330" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#f1f5f9">17</text>
  <text x="620" y="344" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">pluviómetros</text>
  <text x="706" y="330" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#f1f5f9">1M</text>
  <text x="706" y="344" text-anchor="middle" font-family="Inter" font-size="8" fill="#94a3b8">sint. generados</text>

  <!-- Footer note -->
  <text x="28" y="396" font-family="Inter" font-size="8" fill="#475569">Navas et al. (2024) · Ingeniería del Agua · Caso M30 Manzanares, Madrid · DOI: 10.4995/ia.2024.20925</text>
  <text x="28" y="410" font-family="Inter" font-size="8" fill="#475569">pyhydra: HydrographClassifier · FloodEventSelector · FloodMapInterpolator · pixel_return_period</text>
</svg>`;

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
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9" data-t-es="Pipeline: Los Corrales de Buelna — Río Besaya (ROP 3598, 2018)" data-t-en="Pipeline: Los Corrales de Buelna — Río Besaya (ROP 3598, 2018)">Pipeline: Los Corrales de Buelna — Río Besaya (ROP 3598, 2018)</text>

  <!-- Row 1: steps 1-4 -->
  <rect x="24" y="56" width="158" height="76" rx="8" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="32" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#60a5fa">01</text>
  <text x="32" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#93c5fd" data-t-es="Adquisición" data-t-en="Acquisition">Adquisición</text>
  <text x="32" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="13 pluvióm. · aforos Besaya" data-t-en="13 rain gauges · Besaya flows">13 pluvióm. · aforos Besaya</text>
  <text x="32" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">LIDAR 0.5 pts/m² · BTA 25m</text>

  <path d="M182 94 L196 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="196" y="56" width="158" height="76" rx="8" fill="#1a0c3e" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="204" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#a78bfa">02</text>
  <text x="204" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#c4b5fd" data-t-es="Interpolación geoest." data-t-en="Geostat. interpolation">Interpolación geoest.</text>
  <text x="204" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">KO · UK · IDW → Taylor</text>
  <text x="204" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="IDW seleccionado · 9 subcuencas" data-t-en="IDW selected · 9 subbasins">IDW seleccionado · 9 subcuencas</text>

  <path d="M354 94 L368 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="368" y="56" width="158" height="76" rx="8" fill="#0e1545" stroke="#6366f1" stroke-width="1.5"/>
  <text x="376" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#818cf8">03</text>
  <text x="376" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#a5b4fc" data-t-es="Extremos de caudal" data-t-en="Streamflow extremes">Extremos de caudal</text>
  <text x="376" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="GEV · GPD sobre aforos" data-t-en="GEV · GPD on gauges">GEV · GPD sobre aforos</text>
  <text x="376" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">T10 · T100 · T500</text>

  <path d="M526 94 L540 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <rect x="540" y="56" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">04</text>
  <text x="548" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d" data-t-es="HEC-HMS calibrado" data-t-en="Calibrated HEC-HMS">HEC-HMS calibrado</text>
  <text x="548" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">SMA + Clark + Muskingum</text>
  <text x="548" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">NSE &gt; 0.8 · Torrelavega + Las Caldas</text>

  <!-- vertical connector 4→5 -->
  <path d="M638 132 L638 188" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-bc)"/>

  <!-- Row 2: steps 8←7←6←5 -->
  <rect x="540" y="188" width="196" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="548" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">05</text>
  <text x="548" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d" data-t-es="Separación de eventos" data-t-en="Event separation">Separación de eventos</text>
  <text x="548" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="Umbral → Qmax · Qmed · T · Tipo" data-t-en="Threshold → Qmax · Qmed · T · Type">Umbral → Qmax · Qmed · T · Tipo</text>
  <text x="548" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Serie continua 1970–2012" data-t-en="Continuous series 1970–2012">Serie continua 1970–2012</text>

  <path d="M540 226 L526 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

  <rect x="368" y="188" width="158" height="76" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="376" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#c084fc">06</text>
  <text x="376" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#d8b4fe" data-t-es="Síntesis híbrida" data-t-en="Hybrid synthesis">Síntesis híbrida</text>
  <text x="376" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">PCA+K-Means+Cóp.+MaxDiss</text>
  <text x="376" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Reconstr. polinomios grado 2" data-t-en="Degree-2 polynomial reconstr.">Reconstr. polinomios grado 2</text>

  <path d="M368 226 L354 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

  <rect x="196" y="188" width="158" height="76" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="204" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb923c">07</text>
  <text x="204" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fdba74">Iber / HEC-RAS 2D</text>
  <text x="204" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">RTIN · LIDAR 0.5 pts/m²</text>
  <text x="204" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Malla ≤ 8m · no permanente" data-t-en="Mesh ≤ 8m · unsteady flow">Malla ≤ 8m · no permanente</text>

  <path d="M196 226 L182 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-bc)"/>

  <rect x="24" y="188" width="158" height="76" rx="8" fill="#20040e" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="32" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb7185">08</text>
  <text x="32" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fda4af" data-t-es="Riesgo de inundación" data-t-en="Flood risk">Riesgo de inundación</text>
  <text x="32" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="KNN k=6 · CDF emp. píxel" data-t-en="KNN k=6 · Emp. CDF pixel">KNN k=6 · CDF emp. píxel</text>
  <text x="32" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b">HR · AV · T10 · T100 · T500</text>

  <!-- Results bar -->
  <rect x="24" y="292" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="316" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle" data-t-es="RESULTADOS PRINCIPALES" data-t-en="MAIN RESULTS">RESULTADOS PRINCIPALES</text>
  <text x="122" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#60a5fa" text-anchor="middle">50–60%</text>
  <text x="122" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="reducción caudal punta HEC-HMS" data-t-en="peak flow reduction (HEC-HMS)">reducción caudal punta HEC-HMS</text>
  <text x="302" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#a78bfa" text-anchor="middle">k=6</text>
  <text x="302" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="vecinos KNN óptimo" data-t-en="optimal KNN neighbours">vecinos KNN óptimo</text>
  <text x="482" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#fb7185" text-anchor="middle">&gt;13%</text>
  <text x="482" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="población en zona inundable" data-t-en="population in floodplain">población en zona inundable</text>
  <text x="652" y="346" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#34d399" text-anchor="middle">1946</text>
  <text x="652" y="364" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="validación mancha T10 vs ortofoto" data-t-en="T10 extent vs 1946 orthophoto">validación mancha T10 vs ortofoto</text>
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
  <text x="28" y="34" font-family="Inter, system-ui" font-size="15" font-weight="800" fill="#f1f5f9" data-t-es="Pipeline: Valencia DANA — 29 octubre 2024 (JIA 2025)" data-t-en="Pipeline: Valencia DANA — 29 October 2024 (JIA 2025)">Pipeline: Valencia DANA — 29 octubre 2024 (JIA 2025)</text>

  <!-- Step 01 -->
  <rect x="24" y="56" width="330" height="88" rx="8" fill="#251000" stroke="#f97316" stroke-width="1.5"/>
  <text x="36" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#fb923c">01</text>
  <text x="36" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#fdba74" data-t-es="Datos y contexto histórico" data-t-en="Data &amp; historical context">Datos y contexto histórico</text>
  <text x="36" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8">9 estaciones AEMET · SIAR · AVAMET</text>
  <text x="36" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="AMS por año hidrológico · Turís 8337X · Carlet V103" data-t-en="AMS by hydrol. year · Turís 8337X · Carlet V103">AMS por año hidrológico · Turís 8337X · Carlet V103</text>

  <path d="M354 100 L380 100" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-dana)"/>

  <!-- Step 02 -->
  <rect x="380" y="56" width="356" height="88" rx="8" fill="#200840" stroke="#a855f7" stroke-width="1.5"/>
  <text x="392" y="80" font-family="Inter, system-ui" font-size="22" font-weight="800" fill="#c084fc">02</text>
  <text x="392" y="100" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#d8b4fe" data-t-es="Ajuste GEV + RFA" data-t-en="GEV fitting + RFA">Ajuste GEV + RFA</text>
  <text x="392" y="118" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="MLE · L-mom · Bayesiano (HMC/Stan) — SD vs CD" data-t-en="MLE · L-mom · Bayesian (HMC/Stan) — WO vs W">MLE · L-mom · Bayesiano (HMC/Stan) — SD vs CD</text>
  <text x="392" y="134" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Individual · RFA local (9 est.) · RFA global (C. Valenciana)" data-t-en="Individual · local RFA (9 stn.) · global RFA (Valencia)">Individual · RFA local (9 est.) · RFA global (C. Valenciana)</text>

  <!-- Results bar -->
  <rect x="24" y="172" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="196" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle" data-t-es="RESULTADOS PRINCIPALES — Turís (8337X)" data-t-en="MAIN RESULTS — Turís (8337X)">RESULTADOS PRINCIPALES — Turís (8337X)</text>
  <text x="122" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#fb923c" text-anchor="middle">710,8 mm</text>
  <text x="122" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="récord diario nacional" data-t-en="national daily record">récord diario nacional</text>
  <text x="322" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#c084fc" text-anchor="middle" data-t-es="31.345 años" data-t-en="31,345 years">31.345 años</text>
  <text x="322" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="T retorno sin DANA (L-mom)" data-t-en="Return period w/o DANA (L-mom)">T retorno sin DANA (L-mom)</text>
  <text x="522" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#60a5fa" text-anchor="middle" data-t-es="66–91 años" data-t-en="66–91 years">66–91 años</text>
  <text x="522" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="T retorno con DANA" data-t-en="Return period with DANA">T retorno con DANA</text>
  <text x="682" y="232" font-family="Inter, system-ui" font-size="24" font-weight="800" fill="#34d399" text-anchor="middle">Bayes</text>
  <text x="682" y="250" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="método más estable" data-t-en="most stable method">método más estable</text>
</svg>`;

// ─── Pilot cases ────────────────────────────────────────────────────────────

export const pilotCases: PilotCase[] = [
  {
    slug: 'm30-manzanares',
    title: 'M30 · Manzanares',
    subtitle: {
      es: 'Estadística multivariada de inundación mediante cópulas gaussianas — Río Manzanares, Madrid',
      en: 'Multivariate flood frequency analysis using Gaussian copulas — Manzanares River, Madrid',
    },
    location: {
      es: 'Río Manzanares, Madrid, España',
      en: 'Manzanares River, Madrid, Spain',
    },
    river: 'Río Manzanares',
    region: 'Madrid',
    color: 'from-orange-900 via-red-900 to-slate-900',
    tag: 'Caso Piloto',
    accentColor: 'orange',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="12" rx="10" ry="10"/><path d="M12 2 C8 6 8 10 12 12 C16 14 16 18 12 22"/><line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="3 2" stroke-width="1.2"/></svg>',
    summary: {
      es: 'Caso piloto publicado en Ingeniería del Agua (Navas et al. 2024) en el que se desarrolla una metodología de análisis de frecuencia de inundación basada en la generación de hietogramas sintéticos multivariados a partir de cópulas gaussianas sobre 17 pluviómetros de la red Ferrovial en el entorno de la Calle 30 de Madrid. La metodología clasifica 1.761 eventos históricos mediante PCA + K-Means, genera ~1M eventos sintéticos por cópula, selecciona 1.000 mediante MaxDiss, los simula en HEC-HMS (1D) y HEC-RAS, y reconstruye los calados en 1M puntos mediante interpolación kNN, obteniendo curvas de periodo de retorno en las secciones de interés (Puente de Toledo, Represa nº9).',
      en: 'Pilot case published in Ingeniería del Agua (Navas et al. 2024) presenting a flood frequency analysis methodology based on multivariate synthetic hyetogram generation using Gaussian copulas over 17 rain gauges from the Ferrovial network around the Madrid M30. The methodology classifies 1,761 historical events via PCA + K-Means, generates ~1M synthetic events by copula, selects 1,000 via MaxDiss, simulates them in HEC-HMS and HEC-RAS, and reconstructs flood depths at 1M points via kNN interpolation, yielding return period curves at key cross-sections (Puente de Toledo, Represa nº9).',
    },
    challenge: {
      es: 'El análisis de frecuencia univariado de precipitación subestima el riesgo en cuencas urbanas densamente instrumentadas como el Manzanares en Madrid. La estadística de precipitación en una sola estación ignora la variabilidad espacial y la correlación entre pluviómetros. Además, transformar precipitación en caudal exige una cadena de modelos (hidrológico + hidráulico) cuya incertidumbre acumulada es difícil de cuantificar si sólo se propagan hietogramas de diseño clásicos. El resultado es una caracterización del riesgo con cobertura de incertidumbre insuficiente y potencial infravaloración del evento de diseño.',
      en: 'Univariate precipitation frequency analysis underestimates risk in densely instrumented urban catchments such as the Manzanares in Madrid. Single-station precipitation statistics ignore spatial variability and inter-gauge correlations. Furthermore, translating precipitation to discharge requires a model chain (hydrological + hydraulic) whose accumulated uncertainty is hard to quantify when only classical design hyetographs are propagated. The result is a risk characterisation with insufficient uncertainty coverage and potential underestimation of the design event.',
    },
    approach: {
      es: 'La metodología de los notebooks reproduce el pipeline de Navas et al. (2024): (1) los 1.761 eventos históricos de 17 pluviómetros se caracterizan con cuatro parámetros por estación (Pmax, Pmed, Duración, Tipo de hietograma); (2) PCA + K-Means sobre la forma temporal normalizada del hietograma clasifica los eventos (≥100 tipos); (3) una cópula gaussiana OpenTURNS sobre las 68 variables genera ~1M de eventos sintéticos; (4) el algoritmo MaxDiss (<code>pyhydra.climate.hybrid_downscaling.reconstruction.maxdiss</code>) selecciona 1.000 eventos representativos; (5) los hietogramas se simulan en HEC-HMS (caudales) y HEC-RAS 1D estacionario (calados en 303 secciones); (6) un regresor k-NN (scikit-learn, k=3, espacio log-Q) reconstruye calados en los ~1M eventos; (7) el modelo de Poisson compuesto (λ=5.17 ev/año) transforma frecuencias anuales en calados de diseño para T=2…500 años.',
      en: 'The notebooks reproduce the pipeline of Navas et al. (2024): (1) 1,761 historical events from 17 rain gauges are characterised with four parameters per station (Pmax, Pmed, Duration, hyetograph Type); (2) PCA + K-Means on the normalised temporal shape of the hyetograph classifies events (≥100 types); (3) an OpenTURNS Gaussian copula over 68 variables generates ~1M synthetic events; (4) the MaxDiss algorithm (<code>pyhydra.climate.hybrid_downscaling.reconstruction.maxdiss</code>) selects 1,000 representative events; (5) hyetographs are simulated in HEC-HMS (peak discharges) and steady-state HEC-RAS 1D (water depths at 303 cross-sections); (6) a k-NN regressor (scikit-learn, k=3, log-Q space) reconstructs depths for all ~1M events; (7) the compound Poisson model (λ=5.17 ev/yr) yields design depths at T=2…500 years.',
    },
    steps: [
      {
        number: 1,
        title: { es: 'Datos pluviométricos y eventos históricos', en: 'Rain-gauge data & historical events' },
        description: {
          es: 'Carga del dataset de eventos de la red Ferrovial (M30, Madrid): 17 pluviómetros con 1.000 eventos sintéticos seleccionados, cada uno caracterizado por cuatro parámetros por estación — Pmax (mm), Pmed (mm), Duración (h) y Tipo de hietograma. Exploración de la distribución espacial de la red, relación elevación-precipitación y estadísticas por estación para la estación de referencia P_27 (930 eventos no nulos; Pmax máx = 16.79 mm).',
          en: 'Loading the Ferrovial rain-gauge dataset (M30, Madrid): 17 gauges with 1,000 synthetic-selected events, each characterised by four parameters per station — Pmax (mm), Pmed (mm), Duration (h) and hyetograph Type. Exploration of the spatial network distribution, elevation–rainfall relationship and per-station statistics for the reference gauge P_27 (930 non-zero events; max Pmax = 16.79 mm).',
        },
        notebookPath: 'pilot_cases/m30_manzanares/01_rain_data.ipynb',
        tags: ['Datos', 'Clima'],
        tagColor: 'bg-orange-100 text-orange-700',
      },
      {
        number: 2,
        title: { es: 'Clasificación PCA + K-Means', en: 'PCA + K-Means classification' },
        description: {
          es: 'Análisis de la columna <code>Tipo</code> del dataset, que recoge la clasificación de la forma temporal del hietograma obtenida mediante PCA + K-Means sobre 100 instantes normalizados: ≥100 tipos en el artículo. Se muestra la distribución de eventos por tipo, los estadísticos (Pmax, Pmed, Duración) por tipo para P_27 y se explica que la clasificación se realiza sobre la <em>forma temporal</em> del hietograma, no sobre el patrón espacial de precipitación.',
          en: 'Analysis of the <code>Type</code> column in the dataset, which records the temporal hyetograph shape classification obtained via PCA + K-Means on 100 normalised time steps: ≥100 types in the paper. Shows the event distribution per type, per-type statistics (Pmax, Pmed, Duration) for P_27, and explains that the classification is performed on the <em>temporal shape</em> of the hyetograph, not the spatial rainfall pattern.',
        },
        notebookPath: 'pilot_cases/m30_manzanares/02_classification.ipynb',
        tags: ['Estadística'],
        tagColor: 'bg-purple-100 text-purple-700',
      },
      {
        number: 3,
        title: { es: 'Cópula gaussiana y generación sintética', en: 'Gaussian copula & synthetic generation' },
        description: {
          es: 'Reproducción de la Figura 6 de Navas et al. (2024): scatters de 4 paneles para la estación de referencia P_27 (Pmax vs Pmed, Pmax vs Duración, Pmed vs Duración, Pmed vs Tipo). Comparación entre los eventos sintéticos generados por la cópula gaussiana OpenTURNS (~1M, azul) y los 1.000 eventos seleccionados (rojo). Ajuste de distribuciones marginales (Exponencial, Weibull, LogNormal, Gamma) con test KS y curva de período de retorno para Pmax en P_27.',
          en: 'Reproduction of Figure 6 from Navas et al. (2024): 4-panel scatter plots for reference gauge P_27 (Pmax vs Pmed, Pmax vs Duration, Pmed vs Duration, Pmed vs Type). Comparison between synthetic events generated by the OpenTURNS Gaussian copula (~1M, blue) and the 1,000 selected events (red). Marginal distribution fitting (Exponential, Weibull, LogNormal, Gamma) with KS test and return period curve for Pmax at P_27.',
        },
        notebookPath: 'pilot_cases/m30_manzanares/03_copula_generation.ipynb',
        tags: ['Estadística', 'Hidrología'],
        tagColor: 'bg-blue-100 text-blue-700',
      },
      {
        number: 4,
        title: { es: 'MaxDiss — selección de 1.000 eventos', en: 'MaxDiss — selection of 1,000 events' },
        description: {
          es: 'Reproducción de la Figura 7 de Navas et al. (2024): scatters para P_27 con los 1.000 eventos seleccionados por MaxDiss (rojo) sobre los ~1M sintéticos (azul). Demostración en vivo del algoritmo MaxDiss (<code>pyhydra.climate.hybrid_downscaling.reconstruction.maxdiss</code>): selección de 50 eventos representativos de una muestra de 10.000 en el espacio 4D de P_27, mostrando la cobertura cuasi-uniforme obtenida.',
          en: 'Reproduction of Figure 7 from Navas et al. (2024): scatter plots for P_27 with 1,000 MaxDiss-selected events (red) overlaid on ~1M synthetic (blue). Live demonstration of the MaxDiss algorithm (<code>pyhydra.climate.hybrid_downscaling.reconstruction.maxdiss</code>): selection of 50 representative events from 10,000 in the 4D space of P_27, showing the quasi-uniform coverage achieved.',
        },
        notebookPath: 'pilot_cases/m30_manzanares/04_maxdiss_selection.ipynb',
        tags: ['Hidrología'],
        tagColor: 'bg-cyan-100 text-cyan-700',
      },
      {
        number: 5,
        title: { es: 'HEC-HMS + HEC-RAS — simulación hidráulica', en: 'HEC-HMS + HEC-RAS — hydraulic simulation' },
        description: {
          es: 'Exportación de los 1.000 hietogramas seleccionados a formato HEC-HMS (.met) y ejecución del modelo hidrológico sobre la cuenca del Manzanares (22 subcuencas, método SCS-CN, tránsito Muskingum). Los caudales pico resultantes se agrupan en 22 valores de referencia que se simulan en HEC-RAS 1D estacionario sobre el tramo canalizado M30 (17 km, 303 secciones transversales, hipótesis hidráulica 6). Los resultados se exportan como calados y láminas de agua en las 303 secciones.',
          en: 'Export of the 1,000 selected hyetographs to HEC-HMS format (.met) and execution of the hydrological model over the Manzanares catchment (22 sub-basins, SCS-CN method, Muskingum routing). The resulting peak discharges are grouped into 22 reference values simulated in steady-state HEC-RAS 1D over the channelised M30 reach (17 km, 303 cross-sections, hydraulic hypothesis 6). Results are exported as water depths and surface elevations at all 303 sections.',
        },
        notebookPath: 'pilot_cases/m30_manzanares/05_hms_ras_simulation.ipynb',
        tags: ['Hidrología', 'Hidráulica'],
        tagColor: 'bg-green-100 text-green-700',
      },
      {
        number: 6,
        title: { es: 'kNN + régimen extremal', en: 'kNN + extreme value analysis' },
        description: {
          es: 'Reconstrucción de los calados en las 1M simulaciones sintéticas mediante interpolación k-vecinos más cercanos (k=3) en el espacio de caudales máximos. Aplicación del modelo de Poisson compuesto (λ=5.17 eventos/año) para obtener calados de diseño en T=2, 5, 10, 20, 50, 100 y 500 años en las 303 secciones. Comparación con el régimen extremal clásico (GEV univariada sobre la serie de aforos). El método basado en cópulas (Navas et al., 2024) supera en ~0.83 m al clásico en el Puente de Toledo para T=500 años.',
          en: 'Reconstruction of water depths across 1M synthetic simulations via k-nearest-neighbour interpolation (k=3) in peak-discharge space. Application of the compound Poisson model (λ=5.17 ev/yr) to obtain design depths at T=2, 5, 10, 20, 50, 100 and 500 years across all 303 cross-sections. Comparison with the classical extreme value analysis (univariate GEV on the gauged series). The copula-based method (Navas et al., 2024) exceeds the classical approach by ~0.83 m at Puente de Toledo for T=500 years.',
        },
        notebookPath: 'pilot_cases/m30_manzanares/06_knn_return_periods.ipynb',
        tags: ['Estadística', 'Hidráulica'],
        tagColor: 'bg-rose-100 text-rose-700',
      },
    ],
    stats: [
      { value: '17', label: { es: 'pluviómetros red Ferrovial', en: 'Ferrovial rain gauges' } },
      { value: '~1M', label: { es: 'eventos sintéticos generados', en: 'synthetic events generated' } },
      { value: '+0.83 m', label: { es: 'calado adicional T=500 (cópula vs clásico)', en: 'extra depth T=500 (copula vs classical)' } },
      { value: '303', label: { es: 'secciones transversales HEC-RAS', en: 'HEC-RAS cross-sections' } },
    ],
    keyFindings: [
      {
        es: 'La metodología basada en cópulas (Navas et al., 2024) — cópula gaussiana multivariada + kNN + Poisson compuesto — produce calados de diseño sistemáticamente mayores que el método clásico (GEV univariada) en toda la longitud del tramo M30 canalizado. Para T=500 años en el Puente de Toledo, la diferencia es de +0,83 m (7,61 m vs 6,78 m), con implicaciones directas para el dimensionamiento de las obras de protección y la zonificación de inundabilidad.',
        en: 'The copula-based methodology (Navas et al., 2024) — multivariate Gaussian copula + kNN + compound Poisson — systematically produces larger design depths than the classical method (univariate GEV) along the entire channelised M30 reach. For T=500 years at Puente de Toledo, the difference is +0.83 m (7.61 m vs 6.78 m), with direct implications for flood protection sizing and flood zoning.',
      },
      {
        es: 'La cópula gaussiana multivariada sobre 17 pluviómetros captura la covarianza espacial de la precipitación extrema: eventos con máximos simultáneos en múltiples estaciones — que representan el verdadero escenario de riesgo en una cuenca urbana extensa — son generados en proporción realista por la cópula pero subrepresentados por el análisis univariado en una sola estación.',
        en: 'The multivariate Gaussian copula over 17 rain gauges captures the spatial covariance of extreme precipitation: events with simultaneous maxima at multiple stations — which represent the true risk scenario in a large urban catchment — are generated in realistic proportion by the copula but underrepresented by single-station univariate analysis.',
      },
      {
        es: 'El algoritmo MaxDiss reduce el espacio de ~1M eventos sintéticos a 1.000 eventos representativos manteniendo una cobertura cuasi-uniforme del espacio de posibilidades. Esto permite ejecutar la cadena HEC-HMS/HEC-RAS a coste computacional asequible (~22 runs de referencia) y reconstruir el resto por interpolación kNN con error medio de calado inferior a 0,05 m en las secciones de control.',
        en: 'The MaxDiss algorithm reduces the ~1M synthetic event space to 1,000 representative events while maintaining quasi-uniform coverage of the possibility space. This enables running the HEC-HMS/HEC-RAS chain at affordable computational cost (~22 reference runs) and reconstructing the remainder by kNN interpolation with mean depth error below 0.05 m at the control cross-sections.',
      },
      {
        es: 'La comparación entre las dos secciones de control — Puente de Toledo (XS 6262) y Represa nº9 (XS 4112) — muestra que la diferencia entre métodos aumenta con el período de retorno y es consistente en ambas secciones (+0,83 m y +0,69 m respectivamente para T=500 años), lo que indica que el incremento de calado no es un artefacto local sino una consecuencia sistemática de la metodología multivariada.',
        en: 'The comparison between the two control sections — Puente de Toledo (XS 6262) and Represa nº9 (XS 4112) — shows that the method difference increases with return period and is consistent across both sections (+0.83 m and +0.69 m respectively for T=500 years), indicating that the depth increment is not a local artefact but a systematic consequence of the multivariate methodology.',
      },
    ],
    references: [
      {
        title: {
          es: 'Navas et al. (2024) — Ingeniería del Agua · DOI 10.4995/ia.2024.20925',
          en: 'Navas et al. (2024) — Ingeniería del Agua · DOI 10.4995/ia.2024.20925',
        },
        description: {
          es: 'Análisis de frecuencia de inundación multivariado mediante cópulas gaussianas sobre series de precipitación de 17 estaciones en el entorno de la M30 (Madrid). Metodología completa: PCA + K-Means + cópula + MaxDiss + HEC-HMS + HEC-RAS + kNN + Poisson compuesto. Ferrovial — IHCantabria — Universidad de Cantabria.',
          en: 'Multivariate flood frequency analysis using Gaussian copulas over precipitation series from 17 stations around the M30 (Madrid). Complete methodology: PCA + K-Means + copula + MaxDiss + HEC-HMS + HEC-RAS + kNN + compound Poisson. Ferrovial — IHCantabria — University of Cantabria.',
        },
      },
    ],
    figures: [
      {
        title: {
          es: 'Pipeline: Estadística Multivariada de Inundación M30 — 8 pasos',
          en: 'Pipeline: M30 Multivariate Flood Frequency — 8 steps',
        },
        caption: {
          es: 'Flujo metodológico: desde las series de precipitación de 17 pluviómetros (paso 1) hasta las curvas de período de retorno por sección (paso 8). Los pasos 1–4 (azul) construyen el espacio sintético multivariado; los pasos 5–8 (verde) ejecutan la cadena HMS+RAS+kNN y extraen el régimen extremal. El resultado central es el calado de diseño en el Puente de Toledo: +0,83 m sobre el método clásico para T=500 años.',
          en: 'Methodology workflow: from 17 rain-gauge precipitation series (step 1) to return period curves by cross-section (step 8). Steps 1–4 (blue) build the multivariate synthetic space; steps 5–8 (green) run the HMS+RAS+kNN chain and extract the extreme-value regime. The central result is the design depth at Puente de Toledo: +0.83 m above the classical method for T=500 years.',
        },
        svg: m30Svg,
      },
    ],
  },
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
    accentColor: 'sky',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="19" x2="22" y2="19"/><path d="M3 19C6 19 8 17 10 12 12 7 13 5 14 6 15 7 16 11 18 16 19 18 21 19 22 19"/><line x1="3" y1="13" x2="7" y2="13" stroke-dasharray="2 2" stroke-width="1.2"/><line x1="18" y1="13" x2="22" y2="13" stroke-dasharray="2 2" stroke-width="1.2"/><circle cx="14" cy="5.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
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
    accentColor: 'orange',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 17L4 17L5 15L6 17L8 16L9 17L11 6L13 17L15 15L16 17L18 16L19 17L22 17"/><line x1="2" y1="11" x2="22" y2="11" stroke-dasharray="3 2" stroke-width="1.2"/><circle cx="11" cy="6" r="2.2" stroke-width="1.5"/></svg>',
    summary: {
      es: 'La DANA del 29 de octubre de 2024 desencadenó el episodio de precipitación más extremo registrado en la Comunitat Valenciana: la estación de Turís (8337X) acumuló 710,8 mm en 24 horas — récord nacional — y Carlet (V103) registró 265,1 mm simultáneamente. Este caso piloto es la implementación en HYDRA del trabajo publicado en las VIII Jornadas de Ingeniería del Agua (JIA 2025, Zaragoza): "Comparación de métodos de ajuste para la distribución de precipitaciones extremas: Análisis del evento de octubre 2024 en Valencia" (del Jesus, Navas y Urrea, IHCantabria, 2025). El objetivo central es evaluar cómo se comportan tres métodos de ajuste de la GEV — MLE, L-momentos e inferencia bayesiana — frente a la inclusión o exclusión del evento extremo, a tres escalas espaciales: análisis individual en las dos estaciones más afectadas, análisis regional de frecuencia local (RFA local, 9 estaciones próximas) y análisis regional de frecuencia global (RFA global, red amplia de la Comunitat Valenciana).',
      en: 'The 29 October 2024 DANA triggered the most extreme precipitation episode ever recorded in the Valencian Community: the Turís station (8337X) accumulated 710.8 mm in 24 hours — a national record — while Carlet (V103) simultaneously recorded 265.1 mm. This pilot case is the HYDRA implementation of the work published at the VIII Jornadas de Ingeniería del Agua (JIA 2025, Zaragoza): "Comparison of Fitting Methods for Extreme Precipitation Distributions: Analysis of the October 2024 Event in Valencia" (del Jesus, Navas and Urrea, IHCantabria, 2025). The central objective is to evaluate how three GEV fitting methods — MLE, L-moments and Bayesian inference — behave under the inclusion or exclusion of the extreme event, at three spatial scales: individual analysis at the two most affected stations, local regional frequency analysis (local RFA, 9 nearby stations) and global regional frequency analysis (global RFA, wide Valencian Community network).',
    },
    challenge: {
      es: 'La caracterización estadística de 710,8 mm/24h en Turís enfrenta un problema estructural: sin incluir el evento en la serie, los métodos clásicos estiman períodos de retorno inverosímilmente altos — más de 31.000 años con L-momentos y 11.453 años con MLE —, creando una falsa sensación de seguridad. Al incluirlo, los mismos métodos clásicos colapsan hacia períodos de retorno de 66–91 años en Turís, un salto de tres órdenes de magnitud que los hace poco fiables como herramienta de toma de decisiones. La inferencia bayesiana, al representar explícitamente la incertidumbre paramétrica, proporciona respuestas más estables (3.069 años sin evento, 66 años con evento) aunque igualmente sensibles al escenario. La escala de agregación espacial complica adicionalmente el análisis: el RFA global suaviza tanto el efecto del evento que puede subestimar el riesgo local extremo.',
      en: 'The statistical characterisation of 710.8 mm/24h at Turís faces a structural problem: without including the event in the series, classical methods estimate implausibly high return periods — over 31,000 years with L-moments and 11,453 years with MLE — creating a false sense of security. When it is included, the same classical methods collapse to return periods of 66–91 years at Turís, a three-order-of-magnitude jump that makes them unreliable as decision-making tools. Bayesian inference, by explicitly representing parameter uncertainty, provides more stable answers (3,069 years without event, 66 years with event) though equally sensitive to the scenario. The spatial aggregation scale further complicates the analysis: the global RFA smooths the event effect so much that it can underestimate extreme local risk.',
    },
    approach: {
      es: 'Los notebooks implementan la metodología del artículo JIA 2025. El primer notebook construye la base de datos: 9 estaciones seleccionadas de las redes AEMET (30 disponibles), SIAR (41) y AVAMET (153) distribuidas entre la costa y el interior de la Comunitat Valenciana, mapa de localización, análisis de cobertura temporal y extracción de series de máximos anuales (AMS) por año hidrológico. El segundo notebook aplica tres métodos de ajuste GEV — MLE (máxima verosimilitud), L-momentos (robusto frente a atípicos) e inferencia bayesiana (HMC vía Stan, 4 cadenas × 1000 muestras, priores débiles: μ∼N(0,10⁴), σ∼Cauchy(0,5), ξ∼N(0.25)) — bajo dos escenarios paralelos: sin el evento de 2024 y con él. Los cuantiles regionales (RFA) se obtienen estandarizando las series por Z-score, ajustando la GEV a la muestra conjunta regional y reescalando a escala local mediante z<sub>T,i</sub> = y<sub>T</sub> · s<sub>i</sub> + x̄<sub>i</sub>.',
      en: 'The notebooks implement the JIA 2025 article methodology. The first notebook builds the database: 9 selected stations from the AEMET (30 available), SIAR (41) and AVAMET (153) networks distributed between the coast and inland Valencian Community, location map, temporal coverage analysis and annual maximum series (AMS) extraction by hydrological year. The second notebook applies three GEV fitting methods — MLE (maximum likelihood), L-moments (robust to outliers) and Bayesian inference (HMC via Stan, 4 chains × 1000 samples, weak priors: μ∼N(0,10⁴), σ∼Cauchy(0,5), ξ∼N(0.25)) — under two parallel scenarios: without the 2024 event and with it. Regional quantiles (RFA) are obtained by Z-score standardising the series, fitting the GEV to the joint regional sample and back-scaling to local scale via z<sub>T,i</sub> = y<sub>T</sub> · s<sub>i</sub> + x̄<sub>i</sub>.',
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
        href: 'https://www.aemet.es/es/conocermas/recursos_en_linea/publicaciones_y_estudios/estudios/detalles/episodio_dana_oct_nov24',
        cta: { es: 'Ver estudio AEMET', en: 'View AEMET study' },
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

// ─── Manning SVG ─────────────────────────────────────────────────────────────

const manningSvg = `
<svg viewBox="0 0 760 400" width="100%" role="img" aria-label="Flujo metodológico Manning Roughness Sensitivity" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr-mn" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L7,3 z" fill="#475569"/>
    </marker>
    <marker id="arr-l-mn" markerWidth="7" markerHeight="7" refX="1" refY="3" orient="auto">
      <path d="M7,0 L7,6 L0,3 z" fill="#475569"/>
    </marker>
  </defs>

  <rect width="760" height="400" rx="8" fill="#0f172a"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="14" font-weight="800" fill="#f1f5f9" data-t-es="Pipeline: Manning Roughness — Besaya (Env. Modelling &amp; Software, en revisión)" data-t-en="Pipeline: Manning Roughness — Besaya (Env. Modelling &amp; Software, under review)">Pipeline: Manning Roughness — Besaya (Env. Modelling &amp; Software, en revisión)</text>

  <!-- Row 1: steps 01–04 -->
  <rect x="24" y="56" width="158" height="76" rx="8" fill="#0c1f40" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="32" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#60a5fa">01</text>
  <text x="32" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#93c5fd" data-t-es="Monte Carlo" data-t-en="Monte Carlo">Monte Carlo</text>
  <text x="32" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="1,000 combins. rugosidad" data-t-en="1,000 roughness combns.">1,000 combins. rugosidad</text>
  <text x="32" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="9 clases · Normal/LogN/Gamma" data-t-en="9 classes · Normal/LogN/Gamma">9 clases · Normal/LogN/Gamma</text>

  <path d="M182 94 L196 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-mn)"/>

  <rect x="196" y="56" width="158" height="76" rx="8" fill="#0c2020" stroke="#0d9488" stroke-width="1.5"/>
  <text x="204" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#2dd4bf">02</text>
  <text x="204" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#99f6e4" data-t-es="Análisis SFINCS" data-t-en="SFINCS analysis">Análisis SFINCS</text>
  <text x="204" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="Calado · velocidad · área" data-t-en="Depth · velocity · area">Calado · velocidad · área</text>
  <text x="204" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Ecs. inerciales simplif." data-t-en="Simplified inertial eqs.">Ecs. inerciales simplif.</text>

  <path d="M354 94 L368 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-mn)"/>

  <rect x="368" y="56" width="158" height="76" rx="8" fill="#291500" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="376" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fbbf24">03</text>
  <text x="376" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fcd34d" data-t-es="Análisis HEC-RAS" data-t-en="HEC-RAS analysis">Análisis HEC-RAS</text>
  <text x="376" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="Saint-Venant 2D completo" data-t-en="Full 2D Saint-Venant">Saint-Venant 2D completo</text>
  <text x="376" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Distribución bimodal" data-t-en="Bimodal distribution">Distribución bimodal</text>

  <path d="M526 94 L540 94" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-mn)"/>

  <rect x="540" y="56" width="196" height="76" rx="8" fill="#1a0c3e" stroke="#7c3aed" stroke-width="1.5"/>
  <text x="548" y="76" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#a78bfa">04</text>
  <text x="548" y="94" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#c4b5fd" data-t-es="Comparación modelos" data-t-en="Model comparison">Comparación modelos</text>
  <text x="548" y="110" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="SFINCS vs HEC-RAS · dispersión" data-t-en="SFINCS vs HEC-RAS · scatter">SFINCS vs HEC-RAS · dispersión</text>
  <text x="548" y="124" font-family="Inter, system-ui" font-size="9" fill="#64748b">CV · scatter · KDE</text>

  <!-- vertical connector 04→05 -->
  <path d="M638 132 L638 188" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-mn)"/>

  <!-- Row 2: 07←06←05 (right-to-left flow) -->
  <rect x="540" y="188" width="196" height="76" rx="8" fill="#20040e" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="548" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#fb7185">05</text>
  <text x="548" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#fda4af" data-t-es="Bifurcación hidráulica" data-t-en="Hydraulic bifurcation">Bifurcación hidráulica</text>
  <text x="548" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="GMM bimodal · umbral topogr." data-t-en="Bimodal GMM · topogr. threshold">GMM bimodal · umbral topogr.</text>
  <text x="548" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="7,4 ha zona secund. · ~60 m" data-t-en="7.4 ha secondary zone · ~60 m">7,4 ha zona secund. · ~60 m</text>

  <path d="M540 226 L526 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-mn)"/>

  <rect x="368" y="188" width="158" height="76" rx="8" fill="#0e1545" stroke="#6366f1" stroke-width="1.5"/>
  <text x="376" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#818cf8">06</text>
  <text x="376" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#a5b4fc" data-t-es="Figuras artículo" data-t-en="Paper figures">Figuras artículo</text>
  <text x="376" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="6 figuras · PDF + PNG" data-t-en="6 figures · PDF + PNG">6 figuras · PDF + PNG</text>
  <text x="376" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="Env. Modelling &amp; Software" data-t-en="Env. Modelling &amp; Software">Env. Modelling &amp; Software</text>

  <path d="M368 226 L354 226" stroke="#475569" stroke-width="1.8" fill="none" marker-end="url(#arr-l-mn)"/>

  <rect x="24" y="188" width="330" height="76" rx="8" fill="#0c2018" stroke="#059669" stroke-width="1.5"/>
  <text x="32" y="208" font-family="Inter, system-ui" font-size="18" font-weight="800" fill="#34d399">07</text>
  <text x="32" y="226" font-family="Inter, system-ui" font-size="11" font-weight="700" fill="#6ee7b7" data-t-es="Manning correlado" data-t-en="Correlated Manning">Manning correlado</text>
  <text x="32" y="242" font-family="Inter, system-ui" font-size="10" fill="#94a3b8" data-t-es="Cópula Gaussiana entre clases" data-t-en="Gaussian copula across classes">Cópula Gaussiana entre clases</text>
  <text x="32" y="256" font-family="Inter, system-ui" font-size="9" fill="#64748b" data-t-es="ρ=0 · ρ=0.5 · ρ=1.0 — amplif. CV" data-t-en="ρ=0 · ρ=0.5 · ρ=1.0 — CV amplif.">ρ=0 · ρ=0.5 · ρ=1.0 — amplif. CV</text>

  <!-- Results bar -->
  <rect x="24" y="292" width="712" height="88" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <text x="380" y="316" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle" data-t-es="RESULTADOS PRINCIPALES" data-t-en="MAIN RESULTS">RESULTADOS PRINCIPALES</text>
  <text x="122" y="348" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#60a5fa" text-anchor="middle">1,000</text>
  <text x="122" y="366" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="simulaciones Monte Carlo" data-t-en="Monte Carlo simulations">simulaciones Monte Carlo</text>
  <text x="302" y="348" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#2dd4bf" text-anchor="middle">2</text>
  <text x="302" y="366" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="modelos 2D comparados" data-t-en="2D models compared">modelos 2D comparados</text>
  <text x="482" y="348" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#fb7185" text-anchor="middle" data-t-es="Bimodal" data-t-en="Bimodal">Bimodal</text>
  <text x="482" y="366" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="bifurcación HEC-RAS" data-t-en="HEC-RAS bifurcation">bifurcación HEC-RAS</text>
  <text x="652" y="348" font-family="Inter, system-ui" font-size="26" font-weight="800" fill="#34d399" text-anchor="middle">7,4 ha</text>
  <text x="652" y="366" font-family="Inter, system-ui" font-size="10" fill="#64748b" text-anchor="middle" data-t-es="zona secundaria bimodal" data-t-en="bimodal secondary zone">zona secundaria bimodal</text>
</svg>`;

// ─── Manning pilot case ───────────────────────────────────────────────────────

pilotCases.push({
  slug: 'manning-rugosidades',
  title: 'Manning Roughness — Besaya',
  subtitle: {
    es: 'Sensibilidad hidráulica 2D a la incertidumbre en coeficientes de Manning: SFINCS vs HEC-RAS en el Río Besaya',
    en: 'Hydraulic 2D sensitivity to Manning roughness uncertainty: SFINCS vs HEC-RAS on the Besaya River',
  },
  location: {
    es: 'Los Corrales de Buelna, Cantabria, España',
    en: 'Los Corrales de Buelna, Cantabria, Spain',
  },
  river: 'Río Besaya',
  region: 'Cantabria',
  color: 'from-emerald-900 via-teal-800 to-slate-900',
  tag: 'Caso Piloto',
  accentColor: 'emerald',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21L7 14L11 12L13 12L17 14L21 21"/><path d="M5 12Q12 10 19 12"/><path d="M5 9Q12 7 19 9" stroke-dasharray="3 2" stroke-width="1.3"/><path d="M9 17L13 17M12 15L14 17L12 19" stroke-width="1.1"/></svg>',
  summary: {
    es: 'Tercer caso piloto de HYDRA: cuantifica la propagación de la incertidumbre en los coeficientes de Manning a través de dos modelos hidráulicos 2D — SFINCS y HEC-RAS — aplicados al tramo urbano del Río Besaya. Se generan 1,000 combinaciones Monte Carlo de rugosidades para 9 clases de uso de suelo, ajustando la distribución marginal de cada clase (Normal, Log-Normal o Gamma) a valores bibliográficos (Chow 1959, USGS, FHWA). El hallazgo principal es una bifurcación hidráulica en HEC-RAS: la distribución del área inundada es bimodal y una Mezcla Gaussiana identifica dos regímenes cuya causa física es un umbral topográfico — una silla de presión a ~60 m s.n.m. — que controla si una zona secundaria de 7,4 ha se inunda. Este fenómeno no está gobernado por la rugosidad y es invisible para SFINCS. El estudio ha sido enviado a Environmental Modelling & Software.',
    en: 'Third HYDRA pilot case: quantifies how Manning roughness uncertainty propagates through two 2D hydraulic models — SFINCS and HEC-RAS — applied to the Besaya River urban reach. 1,000 Monte Carlo combinations of roughness coefficients for 9 land-use classes are generated, fitting the marginal distribution (Normal, Log-Normal or Gamma) of each class to bibliographic sources (Chow 1959, USGS, FHWA). The key finding is a hydraulic bifurcation in HEC-RAS: the flooded-area distribution is bimodal, and a Gaussian Mixture Model identifies two regimes whose physical cause is a topographic saddle at ~60 m a.s.l. controlling whether a secondary zone of 7.4 ha is flooded. This phenomenon is NOT driven by Manning roughness and is invisible to SFINCS. Submitted to Environmental Modelling & Software.',
  },
  challenge: {
    es: 'La práctica habitual asigna un único valor "representativo" de Manning por clase de uso de suelo, ignorando la variabilidad bibliográfica que puede alcanzar ±50 % para la misma categoría. En el tramo urbano del Besaya, esta incertidumbre se amplifica por la coexistencia de cauce, llanura, arbolado y zonas urbanas con geometrías complejas. La cuestión central no es cuánto varía el resultado numérico, sino si esa variabilidad puede predecir el régimen de inundación — o si el control real es topográfico, no paramétrico. Responder a esto requiere un ensemble de simulaciones suficientemente grande para distinguir la varianza Monte Carlo de una bifurcación hidráulica estructural.',
    en: 'Standard practice assigns a single "representative" Manning value per land-use class, ignoring bibliographic variability that can reach ±50 % for the same category. In the Besaya urban reach, this uncertainty is amplified by the coexistence of main channel, floodplain, woodland and urban areas with complex geometries. The central question is not how much the numerical result varies, but whether that variability can predict the inundation regime — or whether the real control is topographic, not parametric. Answering this requires an ensemble large enough to separate Monte Carlo variance from a structural hydraulic bifurcation.',
  },
  approach: {
    es: 'El notebook 01 genera 1,000 combinaciones de Manning para 9 clases ajustando la distribución de mejor ajuste (criterio: p-valor KS máximo entre Normal, Log-Normal y Gamma) a fuentes bibliográficas (Chow 1959, USGS, FHWA, Brater & King, Barnes). Los notebooks 02 y 03 ejecutan las simulaciones en SFINCS (ecuaciones inerciales simplificadas, GPU/SLURM) y HEC-RAS 6.6 (Saint-Venant 2D completo, COM rascontrol, Windows) respectivamente. El notebook 04 compara modelos: dispersión 1:1, KDE de distribuciones de resultados y coeficiente de variación (CV) por métrica. El notebook 05 identifica la bifurcación hidráulica mediante una Mezcla Gaussiana de 2 componentes y localiza la causa topográfica — umbral en ~60 m s.n.m. que, al superarse, inunda una zona secundaria de 7,4 ha — verificando mediante tests estadísticos (t-Student, Spearman) que el régimen no está correlacionado con los valores de Manning. El notebook 06 genera las 6 figuras del artículo. El notebook 07 extiende el análisis con una cópula Gaussiana para correlaciones cruzadas entre clases (ρ = 0, 0.5, 1.0), cuantificando la amplificación del CV del ensemble.',
    en: 'Notebook 01 generates 1,000 Manning combinations for 9 classes by fitting the best-fit distribution (criterion: maximum KS p-value among Normal, Log-Normal and Gamma) to bibliographic sources (Chow 1959, USGS, FHWA, Brater & King, Barnes). Notebooks 02 and 03 run the simulations in SFINCS (simplified inertial equations, GPU/SLURM) and HEC-RAS 6.6 (full 2D Saint-Venant, COM rascontrol, Windows) respectively. Notebook 04 compares models: 1:1 scatter, KDE of result distributions and coefficient of variation (CV) per metric. Notebook 05 identifies the hydraulic bifurcation via a 2-component Gaussian Mixture Model and locates the topographic cause — a saddle at ~60 m a.s.l. that, when water exceeds it, floods a secondary zone of 7.4 ha — verified by statistical tests (t-Student, Spearman) that the regime is uncorrelated with Manning values. Notebook 06 generates the 6 paper figures. Notebook 07 extends the analysis with a Gaussian copula for cross-class correlations (ρ = 0, 0.5, 1.0), quantifying the ensemble CV amplification.',
  },
  steps: [
    {
      number: 1,
      title: { es: 'Generación Monte Carlo', en: 'Monte Carlo generation' },
      description: {
        es: 'Generación de 1,000 combinaciones estocásticas de coeficientes de Manning para 9 clases de uso de suelo. Se ajusta la distribución marginal de mejor ajuste (Normal, Log-Normal o Gamma) por clase a partir de valores bibliográficos (Chow 1959, USGS, FHWA, Brater & King, Barnes) y se muestrea sin reemplazamiento.',
        en: 'Generation of 1,000 stochastic combinations of Manning coefficients for 9 land-use classes. The best-fit marginal distribution (Normal, Log-Normal or Gamma) per class is fitted from bibliographic values (Chow 1959, USGS, FHWA, Brater & King, Barnes) and sampled without replacement.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/01_monte_carlo_rugosidades.ipynb',
      tags: ['Monte Carlo'],
      tagColor: 'bg-blue-100 text-blue-700',
    },
    {
      number: 2,
      title: { es: 'Sensibilidad SFINCS', en: 'SFINCS sensitivity' },
      description: {
        es: 'Ejecución de las 1,000 simulaciones en SFINCS (ecuaciones inerciales simplificadas, GPU/SLURM) y extracción de métricas por simulación: calado máximo, velocidad máxima y área inundada. SFINCS usa ecuaciones de onda difusiva sin términos advectivos.',
        en: 'Running 1,000 simulations in SFINCS (simplified inertial equations, GPU/SLURM) and extracting per-simulation metrics: maximum depth, maximum velocity and flooded area. SFINCS uses diffusive wave equations without advective terms.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/02_analisis_sfincs.ipynb',
      tags: ['SFINCS'],
      tagColor: 'bg-teal-100 text-teal-700',
    },
    {
      number: 3,
      title: { es: 'Sensibilidad HEC-RAS', en: 'HEC-RAS sensitivity' },
      description: {
        es: 'Ejecución de las 1,000 simulaciones en HEC-RAS 6.6 (Saint-Venant 2D completo, COM rascontrol, Windows). La distribución de área inundada resulta bimodal — una característica inesperada que da lugar al análisis del notebook 05.',
        en: 'Running 1,000 simulations in HEC-RAS 6.6 (full 2D Saint-Venant, COM rascontrol, Windows). The flooded-area distribution turns out to be bimodal — an unexpected characteristic that drives the notebook 05 analysis.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/03_analisis_hecras.ipynb',
      tags: ['HEC-RAS'],
      tagColor: 'bg-amber-100 text-amber-700',
    },
    {
      number: 4,
      title: { es: 'Comparación inter-modelo', en: 'Inter-model comparison' },
      description: {
        es: 'Comparación de la respuesta de ambos modelos a la misma incertidumbre en Manning: dispersión 1:1, KDE de la distribución de resultados para calado, velocidad y área, y coeficiente de variación (CV) por métrica. Se cuantifica cuánto difieren SFINCS y HEC-RAS en sensibilidad.',
        en: 'Comparison of both models\' response to the same Manning uncertainty: 1:1 scatter, KDE of results distribution for depth, velocity and area, and coefficient of variation (CV) per metric. Quantifies how much SFINCS and HEC-RAS differ in sensitivity.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/04_comparacion_modelos.ipynb',
      tags: ['Comparación'],
      tagColor: 'bg-violet-100 text-violet-700',
    },
    {
      number: 5,
      title: { es: 'Bifurcación hidráulica', en: 'Hydraulic bifurcation' },
      description: {
        es: 'La distribución bimodal del área inundada en HEC-RAS se clasifica mediante una Mezcla Gaussiana de 2 componentes. Se localiza la causa física: una silla topográfica a ~60 m s.n.m. que controla si una zona secundaria de 7,4 ha se inunda. Tests estadísticos (t-Student, Spearman) verifican que el régimen no está correlacionado con Manning.',
        en: 'The bimodal flooded-area distribution in HEC-RAS is classified using a 2-component Gaussian Mixture Model. The physical cause is located: a topographic saddle at ~60 m a.s.l. that controls whether a secondary 7.4 ha zone is flooded. Statistical tests (t-Student, Spearman) verify that the regime is uncorrelated with Manning values.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/05_analisis_regimenes.ipynb',
      tags: ['Régimen'],
      tagColor: 'bg-rose-100 text-rose-700',
    },
    {
      number: 6,
      title: { es: 'Figuras del artículo', en: 'Paper figures' },
      description: {
        es: 'Generación de las 6 figuras del artículo a resolución de publicación (PDF + PNG). Incluye: distribuciones de Manning por clase, boxplots del ensemble Monte Carlo, dispersión intra-modelo coloreada por régimen, comparación inter-modelo 1:1 y KDE, bifurcación hidráulica, y CV por modelo y métrica.',
        en: 'Generation of the 6 paper figures at publication resolution (PDF + PNG). Includes: Manning distributions by class, Monte Carlo ensemble boxplots, intra-model scatter coloured by regime, inter-model 1:1 and KDE comparison, hydraulic bifurcation, and CV by model and metric.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/06_figuras_paper.ipynb',
      tags: ['Paper'],
      tagColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      number: 7,
      title: { es: 'Manning correlado', en: 'Correlated Manning' },
      description: {
        es: 'Extensión del análisis base con una cópula Gaussiana que permite correlaciones cruzadas entre clases de uso de suelo. Se evalúan 3 escenarios: independiente (ρ=0, referencia), correlación moderada (ρ=0.5) y correlación perfecta (ρ=1.0). Se cuantifica la amplificación del coeficiente de variación del ensemble sin desplazar el umbral de bifurcación.',
        en: 'Extension of the base analysis with a Gaussian copula allowing cross-class correlations among land-use classes. Three scenarios are evaluated: independent (ρ=0, reference), moderate correlation (ρ=0.5) and perfect correlation (ρ=1.0). The ensemble CV amplification is quantified without shifting the bifurcation threshold.',
      },
      notebookPath: 'pilot_cases/manning_rugosidades/07_correlated_manning.ipynb',
      tags: ['Cópula'],
      tagColor: 'bg-emerald-100 text-emerald-700',
    },
  ],
  stats: [
    { value: '1,000', label: { es: 'simulaciones Monte Carlo', en: 'Monte Carlo simulations' } },
    { value: '9 clases', label: { es: 'clases de uso de suelo', en: 'land-use classes' } },
    { value: 'Bimodal', label: { es: 'bifurcación en HEC-RAS', en: 'HEC-RAS bifurcation' } },
    { value: '7,4 ha', label: { es: 'zona secundaria topográfica', en: 'topographic secondary zone' } },
  ],
  keyFindings: [
    {
      es: 'La distribución del área inundada en HEC-RAS es bimodal: una Mezcla Gaussiana de 2 componentes identifica claramente dos regímenes de inundación — el régimen ALTO inunda ~7,4 ha más que el régimen BAJO, en función de si el agua supera una silla topográfica a ~60 m s.n.m.',
      en: 'The HEC-RAS flooded-area distribution is bimodal: a 2-component Gaussian Mixture Model clearly identifies two flooding regimes — the HIGH regime floods ~7.4 ha more than the LOW regime, depending on whether water exceeds a topographic saddle at ~60 m a.s.l.',
    },
    {
      es: 'La bifurcación hidráulica NO está gobernada por los coeficientes de Manning: los tests estadísticos (t-Student y Spearman) muestran que los valores de Manning no predicen el régimen. El control es exclusivamente topográfico, no paramétrico.',
      en: 'The hydraulic bifurcation is NOT driven by Manning coefficients: statistical tests (t-Student and Spearman) show that Manning values do not predict the regime. The control is exclusively topographic, not parametric.',
    },
    {
      es: 'SFINCS, con sus ecuaciones inerciales simplificadas, no reproduce la bifurcación: su distribución de área inundada es unimodal, con varianza atribuible únicamente a la rugosidad. La bifurcación es un fenómeno invisible para modelos simplificados.',
      en: 'SFINCS, with its simplified inertial equations, does not reproduce the bifurcation: its flooded-area distribution is unimodal, with variance attributable solely to roughness. The bifurcation is a phenomenon invisible to simplified models.',
    },
    {
      es: 'La incorporación de correlaciones cruzadas entre clases mediante una cópula Gaussiana amplifica el coeficiente de variación del ensemble, pero no desplaza el umbral de bifurcación: la topografía mantiene su rol dominante independientemente de la estructura de correlación de Manning.',
      en: 'Incorporating cross-class correlations via a Gaussian copula amplifies the ensemble coefficient of variation, but does not shift the bifurcation threshold: topography maintains its dominant role regardless of the Manning correlation structure.',
    },
    {
      es: 'El hallazgo tiene implicaciones directas para la modelización hidráulica de riesgo: en tramos con geometría compleja que generen bifurcaciones de régimen, la variabilidad de los resultados depende más de la topografía que de la incertidumbre paramétrica, y los modelos simplificados pueden ocultar este comportamiento.',
      en: 'The finding has direct implications for hydraulic risk modelling: in reaches with complex geometry that generate regime bifurcations, result variability depends more on topography than parametric uncertainty, and simplified models can mask this behaviour.',
    },
  ],
  references: [
    {
      title: {
        es: 'Navas et al. — Environmental Modelling & Software (en revisión)',
        en: 'Navas et al. — Environmental Modelling & Software (under review)',
      },
      description: {
        es: 'Sensibilidad de los resultados de modelos hidráulicos 2D (SFINCS y HEC-RAS) a la incertidumbre en los coeficientes de Manning: análisis Monte Carlo y bifurcación hidráulica en el Río Besaya. IHCantabria — Universidad de Cantabria.',
        en: 'Sensitivity of 2D hydraulic model outputs (SFINCS and HEC-RAS) to Manning roughness uncertainty: Monte Carlo analysis and hydraulic bifurcation on the Besaya River. IHCantabria — Universidad de Cantabria.',
      },
    },
    {
      title: {
        es: 'Chow, V.T. (1959) — Open-channel hydraulics',
        en: 'Chow, V.T. (1959) — Open-channel hydraulics',
      },
      description: {
        es: 'Referencia bibliográfica fundamental para los valores de Manning por tipo de cauce y uso del suelo. McGraw-Hill, New York. Fuente principal de los rangos de rugosidad utilizados en el ajuste de distribuciones.',
        en: 'Fundamental bibliographic reference for Manning values by channel type and land use. McGraw-Hill, New York. Primary source of roughness ranges used in distribution fitting.',
      },
    },
  ],
  figures: [
    {
      title: {
        es: 'Pipeline: Manning Roughness Sensitivity — 7 pasos',
        en: 'Pipeline: Manning Roughness Sensitivity — 7 steps',
      },
      caption: {
        es: 'Flujo metodológico: desde la generación Monte Carlo de 1,000 combinaciones de rugosidad (paso 1) hasta el análisis con cópulas correlacionadas (paso 7). El hallazgo central — bifurcación hidráulica topográfica en HEC-RAS — se identifica en el paso 5.',
        en: 'Methodology workflow: from Monte Carlo generation of 1,000 roughness combinations (step 1) to correlated copula analysis (step 7). The central finding — topographic hydraulic bifurcation in HEC-RAS — is identified in step 5.',
      },
      svg: manningSvg,
    },
  ],
});
