export type I18n = { es: string; en: string };

export type ModuleDetail = {
  slug: string;
  title: string;
  subtitle: I18n;
  tag: string;
  color: string;
  summary: I18n;
  purpose: I18n;
  workflow: I18n[];
  capabilities: I18n[];
  methods: Array<{
    name: string;
    description: I18n;
  }>;
  inputs: I18n[];
  outputs: I18n[];
  validation: I18n[];
  industrialUse: I18n[];
  hydra: I18n[];
  figures: Array<{
    title: I18n;
    caption: I18n;
    svg: string;
  }>;
};

// ─── SVG figures ────────────────────────────────────────────────────────────

const dataPipelineSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Pipeline de datos hidrometeorologicos" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Pipeline de datos: fuente → control → producto trazable</text>
  <g font-family="Inter, system-ui">
    <rect x="28" y="54" width="178" height="240" rx="8" fill="white" stroke="#dbeafe" stroke-width="1.5"/>
    <text x="48" y="80" font-size="13" font-weight="700" fill="#1e40af">Fuentes</text>
    <g font-size="11.5" fill="#334155">
      <text x="48" y="106">Meteostat / OGIMET</text>
      <text x="48" y="128">AEMET / ERA5</text>
      <text x="48" y="150">PERSIANN-CCS</text>
      <text x="48" y="172">CMIP6 CDS / ESGF</text>
      <text x="48" y="194">GloFAS / GRDC / USGS</text>
      <text x="48" y="216">SoilGrids (ISRIC)</text>
    </g>
    <rect x="282" y="54" width="196" height="240" rx="8" fill="white" stroke="#ccfbf1" stroke-width="1.5"/>
    <text x="302" y="80" font-size="13" font-weight="700" fill="#0f766e">Control HYDRA</text>
    <g font-size="11.5" fill="#334155">
      <text x="302" y="106">Descarga por bloques</text>
      <text x="302" y="128">Reintentos automaticos</text>
      <text x="302" y="150">Normalizacion de unidades</text>
      <text x="302" y="172">Corrección de fechas</text>
      <text x="302" y="194">Filtrado bbox / estaciones</text>
      <text x="302" y="216">Metadatos y trazabilidad</text>
    </g>
    <rect x="536" y="54" width="192" height="240" rx="8" fill="white" stroke="#fed7aa" stroke-width="1.5"/>
    <text x="556" y="80" font-size="13" font-weight="700" fill="#9a3412">Productos</text>
    <g font-size="11.5" fill="#334155">
      <text x="556" y="106">CSV por estacion</text>
      <text x="556" y="128">NetCDF espacial</text>
      <text x="556" y="150">GeoTIFF de suelo</text>
      <text x="556" y="172">Catálogos de estaciones</text>
      <text x="556" y="194">Inputs HEC-HMS / SWAT+</text>
      <text x="556" y="216">Datasets para análisis</text>
    </g>
  </g>
  <g stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M206 130 L282 130"/><path d="M206 174 L282 174"/><path d="M206 218 L282 218"/>
    <path d="M478 130 L536 130"/><path d="M478 174 L536 174"/><path d="M478 218 L536 218"/>
  </g>
  <g>
    <rect x="28" y="316" width="704" height="24" rx="12" fill="#e2e8f0"/>
    <rect x="28" y="316" width="168" height="24" rx="12" fill="#38bdf8"/>
    <rect x="196" y="316" width="176" height="24" fill="#2dd4bf"/>
    <rect x="372" y="316" width="168" height="24" fill="#a78bfa"/>
    <rect x="540" y="316" width="192" height="24" rx="12" fill="#fb923c"/>
    <text x="44" y="332" font-family="Inter, system-ui" font-size="11" fill="#0f172a">descarga</text>
    <text x="240" y="332" font-family="Inter, system-ui" font-size="11" fill="#0f172a">normalizacion</text>
    <text x="420" y="332" font-family="Inter, system-ui" font-size="11" fill="#0f172a">validacion</text>
    <text x="588" y="332" font-family="Inter, system-ui" font-size="11" fill="#0f172a">exportacion</text>
  </g>
</svg>`;

const cmip6Svg = `
<svg viewBox="0 0 760 360" role="img" aria-label="CMIP6 ESGF descarga y recorte de proyecciones" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">CMIP6 / ESGF: búsqueda, filtrado y descarga de proyecciones</text>
  <!-- Sources -->
  <rect x="28" y="54" width="162" height="240" rx="8" fill="white" stroke="#dbeafe" stroke-width="1.5"/>
  <text x="48" y="80" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#1e40af">Nodos ESGF</text>
  <circle cx="80" cy="122" r="18" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="80" y="126" font-family="Inter, system-ui" font-size="9.5" text-anchor="middle" fill="#1e40af">LLNL</text>
  <circle cx="140" cy="112" r="14" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="140" y="116" font-family="Inter, system-ui" font-size="9" text-anchor="middle" fill="#1e40af">DKRZ</text>
  <circle cx="148" cy="152" r="12" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="148" y="156" font-family="Inter, system-ui" font-size="9" text-anchor="middle" fill="#1e40af">CEDA</text>
  <circle cx="74" cy="158" r="12" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <path d="M80 122L140 112M80 122L148 152M80 122L74 158M140 112L148 152" stroke="#93c5fd" stroke-width="1.5"/>
  <rect x="40" y="190" width="130" height="30" rx="6" fill="#ede9fe" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="105" y="209" font-family="Inter, system-ui" font-size="11" text-anchor="middle" fill="#6d28d9">Copernicus CDS</text>
  <text x="44" y="248" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">download_CDS_CMIP6</text>
  <text x="44" y="266" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">get_dataset_metadata</text>
  <text x="44" y="284" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">process_file (OPeNDAP)</text>
  <!-- Arrow 1 -->
  <path d="M190 174 L224 174" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#arr)"/>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker></defs>
  <!-- Filters -->
  <rect x="226" y="54" width="220" height="240" rx="8" fill="white" stroke="#d1fae5" stroke-width="1.5"/>
  <text x="246" y="80" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#065f46">Filtros de búsqueda</text>
  <g font-family="Inter, system-ui" font-size="11.5" fill="#334155">
    <text x="246" y="112">source_id</text>
    <rect x="330" y="100" width="100" height="18" rx="4" fill="#f0fdf4" stroke="#86efac"/>
    <text x="338" y="113" font-size="10.5" fill="#166534">MPI-ESM1-2-HR</text>
    <text x="246" y="142">experiment_id</text>
    <rect x="330" y="130" width="100" height="18" rx="4" fill="#f0fdf4" stroke="#86efac"/>
    <text x="338" y="143" font-size="10.5" fill="#166534">ssp245 / ssp585</text>
    <text x="246" y="172">variable_id</text>
    <rect x="330" y="160" width="100" height="18" rx="4" fill="#f0fdf4" stroke="#86efac"/>
    <text x="338" y="173" font-size="10.5" fill="#166534">pr / tas / tasmax</text>
    <text x="246" y="202">variant_label</text>
    <rect x="330" y="190" width="100" height="18" rx="4" fill="#f0fdf4" stroke="#86efac"/>
    <text x="338" y="203" font-size="10.5" fill="#166534">r1i1p1f1</text>
  </g>
  <rect x="240" y="228" width="196" height="52" rx="6" fill="#f0fdf4" stroke="#34d399"/>
  <text x="255" y="248" font-family="Inter, system-ui" font-size="11" fill="#065f46" font-weight="600">DataFrame metadatos</text>
  <text x="255" y="264" font-family="Inter, system-ui" font-size="10" fill="#64748b">dataset_id · model · experiment</text>
  <text x="255" y="278" font-family="Inter, system-ui" font-size="10" fill="#64748b">variable · start · end · urls</text>
  <!-- Arrow 2 -->
  <path d="M446 174 L480 174" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#arr)"/>
  <!-- Output -->
  <rect x="482" y="54" width="248" height="240" rx="8" fill="white" stroke="#fed7aa" stroke-width="1.5"/>
  <text x="502" y="80" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#9a3412">Productos</text>
  <g font-family="Inter, system-ui" font-size="11.5" fill="#334155">
    <rect x="498" y="94" width="212" height="38" rx="6" fill="#fff7ed" stroke="#fb923c"/>
    <text x="514" y="112" font-size="10.5" fill="#9a3412">NetCDF recortado a bbox</text>
    <text x="514" y="126" font-size="10" fill="#64748b">lat/lon clip + compresión</text>
    <rect x="498" y="146" width="212" height="38" rx="6" fill="#fff7ed" stroke="#fb923c"/>
    <text x="514" y="164" font-size="10.5" fill="#9a3412">Combinaciones completas</text>
    <text x="514" y="178" font-size="10" fill="#64748b">get_combination_if_complete</text>
    <rect x="498" y="198" width="212" height="38" rx="6" fill="#fff7ed" stroke="#fb923c"/>
    <text x="514" y="216" font-size="10.5" fill="#9a3412">Inputs para bias correction</text>
    <text x="514" y="230" font-size="10" fill="#64748b">BiasCorrection · delta_method</text>
  </g>
  <text x="502" y="280" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">Reintentos automáticos · OPeNDAP y HTTP</text>
</svg>`;

const extremesSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Analisis de extremos GEV bayesiano con diagnosticos" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Extremos: GEV, incertidumbre bayesiana y diagnóstico</text>
  <!-- Return period curve -->
  <rect x="32" y="54" width="380" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <g stroke="#e2e8f0" stroke-width="1"><path d="M68 90H380M68 134H380M68 178H380M68 222H380M68 266H380"/></g>
  <path d="M68 280H380M68 72V280" stroke="#94a3b8" stroke-width="2"/>
  <!-- Confidence band -->
  <path d="M88 262C136 244 186 218 236 188C296 150 338 112 378 82" fill="none" stroke="#a5b4fc" stroke-width="24" stroke-linecap="round" opacity=".45"/>
  <!-- GEV fit line -->
  <path d="M88 260C138 240 192 214 242 183C304 144 347 104 378 78" fill="none" stroke="#4f46e5" stroke-width="4" stroke-linecap="round"/>
  <!-- Observed points -->
  <g fill="#4f46e5" stroke="white" stroke-width="2">
    <circle cx="100" cy="254" r="5"/><circle cx="142" cy="238" r="5"/><circle cx="184" cy="218" r="5"/>
    <circle cx="240" cy="183" r="5"/><circle cx="304" cy="144" r="5"/><circle cx="370" cy="96" r="5"/>
  </g>
  <!-- T=100 reference lines -->
  <path d="M356 72V280" stroke="#f97316" stroke-width="2" stroke-dasharray="6 5"/>
  <path d="M68 100H380" stroke="#f97316" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="360" y="298" font-family="Inter, system-ui" font-size="11.5" fill="#f97316">T=100</text>
  <text x="72" y="298" font-family="Inter, system-ui" font-size="11.5" fill="#64748b">Periodo de retorno (años)</text>
  <text x="20" y="180" font-family="Inter, system-ui" font-size="11.5" fill="#64748b" transform="rotate(-90 20 180)">Nivel de retorno</text>
  <!-- Methods badge -->
  <rect x="52" y="60" width="180" height="22" rx="11" fill="#eef2ff"/>
  <text x="72" y="75" font-family="Inter, system-ui" font-size="10.5" fill="#4f46e5">MLE · L-mom · MAP · MCMC</text>
  <!-- Right panels -->
  <rect x="432" y="54" width="296" height="122" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="452" y="80" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#0f172a">Posterior parámetros (MCMC)</text>
  <path d="M460 116C480 92 510 92 530 116C548 138 578 140 600 116C622 92 648 96 668 116" fill="none" stroke="#7c3aed" stroke-width="3.5" stroke-linecap="round"/>
  <g stroke="#cbd5e1" stroke-width="1"><path d="M456 122H700"/><path d="M510 90V126"/><path d="M596 90V126"/></g>
  <g font-family="Inter, system-ui" font-size="11" fill="#64748b">
    <text x="466" y="144">μ (loc)</text><text x="560" y="144">σ (scale)</text><text x="650" y="144">ξ (shape)</text>
  </g>
  <rect x="432" y="192" width="296" height="132" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="452" y="218" font-family="Inter, system-ui" font-size="13" font-weight="700" fill="#0f172a">Diagnóstico QQ + frecuencia regional</text>
  <path d="M456 296L660 232" stroke="#cbd5e1" stroke-width="2.5"/>
  <g fill="#0f766e"><circle cx="476" cy="288" r="4.5"/><circle cx="508" cy="276" r="4.5"/><circle cx="548" cy="262" r="4.5"/><circle cx="596" cy="247" r="4.5"/><circle cx="648" cy="234" r="4.5"/></g>
  <text x="452" y="314" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">QQ empírico vs GEV ajustada</text>
  <text x="452" y="328" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">RFA: index flood · GEV regional · cuantiles locales</text>
</svg>`;

const downscalingSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Pipeline de downscaling hibrido de mapas de inundacion" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="30" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Downscaling híbrido: clasificación → cópula → simulación → mapas T</text>
  <!-- Step boxes -->
  <g font-family="Inter, system-ui">
    <!-- Step 1: Historical series + classification -->
    <rect x="20" y="48" width="142" height="78" rx="8" fill="white" stroke="#c7d2fe" stroke-width="1.5"/>
    <text x="36" y="70" font-size="11" font-weight="700" fill="#4338ca">Serie histórica Q</text>
    <text x="36" y="88" font-size="10" fill="#64748b">HydrographClassifier</text>
    <text x="36" y="103" font-size="10" fill="#64748b">PCA + K-means</text>
    <text x="36" y="118" font-size="10" fill="#4338ca" font-weight="600">K tipos morfológicos</text>
    <!-- Step 2: Copula -->
    <rect x="196" y="48" width="148" height="78" rx="8" fill="white" stroke="#c7d2fe" stroke-width="1.5"/>
    <text x="212" y="70" font-size="11" font-weight="700" fill="#4338ca">FloodEventCopula</text>
    <text x="212" y="88" font-size="10" fill="#64748b">Cópula Normal multiv.</text>
    <text x="212" y="103" font-size="10" fill="#64748b">marginales BIC</text>
    <text x="212" y="118" font-size="10" fill="#4338ca" font-weight="600">N = 5 000 eventos sint.</text>
    <!-- Step 3: MaxDiss -->
    <rect x="378" y="48" width="148" height="78" rx="8" fill="white" stroke="#c7d2fe" stroke-width="1.5"/>
    <text x="394" y="70" font-size="11" font-weight="700" fill="#4338ca">MaxDiss</text>
    <text x="394" y="88" font-size="10" fill="#64748b">Selección maximally</text>
    <text x="394" y="103" font-size="10" fill="#64748b">dissimilar, O(n·k)</text>
    <text x="394" y="118" font-size="10" fill="#4338ca" font-weight="600">N_rep representativos</text>
    <!-- Step 4: Simulations -->
    <rect x="560" y="48" width="172" height="78" rx="8" fill="white" stroke="#c7d2fe" stroke-width="1.5"/>
    <text x="576" y="70" font-size="11" font-weight="700" fill="#4338ca">Simulaciones SFINCS</text>
    <text x="576" y="88" font-size="10" fill="#64748b">HydrographReconstructor</text>
    <text x="576" y="103" font-size="10" fill="#64748b">Hidrograma_{j}.csv</text>
    <text x="576" y="118" font-size="10" fill="#4338ca" font-weight="600">N_rep mapas calado</text>
    <!-- Arrows top row -->
    <path d="M162 86 L196 86" stroke="#6366f1" stroke-width="2" marker-end="url(#a2)"/>
    <path d="M344 86 L378 86" stroke="#6366f1" stroke-width="2" marker-end="url(#a2)"/>
    <path d="M526 86 L560 86" stroke="#6366f1" stroke-width="2" marker-end="url(#a2)"/>
    <defs><marker id="a2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#6366f1"/></marker></defs>
    <!-- Step 5: Interpolation -->
    <rect x="196" y="174" width="366" height="74" rx="8" fill="white" stroke="#99f6e4" stroke-width="1.5"/>
    <text x="216" y="198" font-size="11" font-weight="700" fill="#0f766e">FloodMapInterpolator</text>
    <text x="216" y="216" font-size="10" fill="#64748b">Interpolación k-NN en espacio de cópula · pesos por distancia euclidea</text>
    <text x="216" y="232" font-size="10" fill="#0f766e" font-weight="600">pixel_return_period · λ = tasa anual de eventos · Poisson-GEV</text>
    <!-- Arrow down from step 4 -->
    <path d="M646 126 L646 164 L562 164" stroke="#6366f1" stroke-width="2" stroke-linecap="round" marker-end="url(#a2)"/>
    <!-- Step 6: Return period maps -->
    <rect x="130" y="290" width="500" height="52" rx="8" fill="#f0fdf4" stroke="#34d399" stroke-width="1.5"/>
    <text x="230" y="312" font-size="11" font-weight="700" fill="#065f46">Mapas de periodo de retorno</text>
    <text x="162" y="330" font-size="10.5" fill="#64748b">T = 5 · 10 · 25 · 50 · 100 · 200 · 500 · 1000 años   →   GeoTIFF por periodo</text>
    <!-- Arrow down from interpolation -->
    <path d="M379 248 L379 290" stroke="#6366f1" stroke-width="2" stroke-linecap="round" marker-end="url(#a2)"/>
    <!-- CC variant note -->
    <rect x="20" y="174" width="162" height="74" rx="8" fill="#fafafa" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="5 4"/>
    <text x="36" y="196" font-size="11" font-weight="700" fill="#64748b">Variante CC</text>
    <text x="36" y="212" font-size="10" fill="#94a3b8">FloodMapInterpolatorCC</text>
    <text x="36" y="228" font-size="10" fill="#94a3b8">hist vs escenario</text>
    <text x="36" y="244" font-size="10" fill="#94a3b8">mismo set de sims</text>
  </g>
</svg>`;

const nsrpSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Modelo NSRP de precipitacion estocastica" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">NSRP / NEOPRENE: proceso de Poisson → celdas → serie sintética</text>
  <!-- Time axis -->
  <path d="M46 246H580" stroke="#94a3b8" stroke-width="2"/>
  <text x="590" y="250" font-family="Inter, system-ui" font-size="12" fill="#64748b">tiempo</text>
  <!-- Storm origins (Poisson) -->
  <g stroke="#f97316" stroke-width="2" stroke-dasharray="4 4">
    <path d="M100 160V246"/><path d="M228 130V246"/><path d="M370 148V246"/><path d="M490 138V246"/>
  </g>
  <g fill="#f97316"><circle cx="100" cy="246" r="5"/><circle cx="228" cy="246" r="5"/><circle cx="370" cy="246" r="5"/><circle cx="490" cy="246" r="5"/></g>
  <text x="48" y="262" font-family="Inter, system-ui" font-size="10.5" fill="#f97316">origen de tormenta (Poisson)</text>
  <!-- Rectangular pulses (cells) -->
  <rect x="70" y="186" width="70" height="60" rx="3" fill="#38bdf8" opacity=".75"/>
  <rect x="98" y="172" width="88" height="74" rx="3" fill="#0891b2" opacity=".65"/>
  <rect x="160" y="200" width="46" height="46" rx="3" fill="#38bdf8" opacity=".60"/>
  <rect x="196" y="166" width="96" height="80" rx="3" fill="#38bdf8" opacity=".70"/>
  <rect x="228" y="152" width="60" height="94" rx="3" fill="#0891b2" opacity=".60"/>
  <rect x="310" y="190" width="80" height="56" rx="3" fill="#38bdf8" opacity=".75"/>
  <rect x="360" y="170" width="100" height="76" rx="3" fill="#0891b2" opacity=".65"/>
  <rect x="448" y="178" width="74" height="68" rx="3" fill="#38bdf8" opacity=".70"/>
  <rect x="476" y="162" width="56" height="84" rx="3" fill="#0891b2" opacity=".60"/>
  <text x="48" y="168" font-family="Inter, system-ui" font-size="10.5" fill="#0891b2">celdas (intensidad, radio, duración aleatorios)</text>
  <!-- Aggregated precipitation below -->
  <path d="M46 310H580" stroke="#94a3b8" stroke-width="1.5"/>
  <path d="M46 280V310" stroke="#94a3b8" stroke-width="1.5"/>
  <g fill="#0f766e" opacity=".85">
    <rect x="56" y="298" width="14" height="12" rx="2"/><rect x="72" y="286" width="14" height="24" rx="2"/>
    <rect x="88" y="278" width="14" height="32" rx="2"/><rect x="104" y="282" width="14" height="28" rx="2"/>
    <rect x="120" y="290" width="14" height="20" rx="2"/><rect x="136" y="296" width="14" height="14" rx="2"/>
    <rect x="166" y="288" width="14" height="22" rx="2"/><rect x="182" y="276" width="14" height="34" rx="2"/>
    <rect x="198" y="272" width="14" height="38" rx="2"/><rect x="214" y="280" width="14" height="30" rx="2"/>
    <rect x="230" y="284" width="14" height="26" rx="2"/><rect x="246" y="292" width="14" height="18" rx="2"/>
    <rect x="306" y="290" width="14" height="20" rx="2"/><rect x="322" y="278" width="14" height="32" rx="2"/>
    <rect x="338" y="274" width="14" height="36" rx="2"/><rect x="354" y="280" width="14" height="30" rx="2"/>
    <rect x="370" y="270" width="14" height="40" rx="2"/><rect x="386" y="282" width="14" height="28" rx="2"/>
    <rect x="448" y="288" width="14" height="22" rx="2"/><rect x="464" y="276" width="14" height="34" rx="2"/>
    <rect x="480" y="272" width="14" height="38" rx="2"/><rect x="496" y="281" width="14" height="29" rx="2"/>
    <rect x="512" y="290" width="14" height="20" rx="2"/>
  </g>
  <text x="48" y="336" font-family="Inter, system-ui" font-size="10.5" fill="#0f766e">precipitación acumulada en el punto (serie sintética)</text>
  <!-- PSO parameters panel -->
  <rect x="612" y="54" width="134" height="268" rx="8" fill="white" stroke="#d1fae5" stroke-width="1.5"/>
  <text x="628" y="80" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#065f46">Calibración PSO</text>
  <g font-family="Inter, system-ui" font-size="11" fill="#334155">
    <text x="628" y="106">λ tasa tormentas</text>
    <text x="628" y="128">μ_c celdas/torm.</text>
    <text x="628" y="150">μ_x intensidad</text>
    <text x="628" y="172">β duración celda</text>
    <text x="628" y="194">ρ radio de celda</text>
    <text x="628" y="216">δ desplazam.</text>
  </g>
  <rect x="620" y="230" width="118" height="40" rx="6" fill="#f0fdf4" stroke="#34d399"/>
  <text x="679" y="248" font-family="Inter, system-ui" font-size="10" text-anchor="middle" fill="#065f46" font-weight="600">NSRPModel.fit()</text>
  <text x="679" y="263" font-family="Inter, system-ui" font-size="10" text-anchor="middle" fill="#64748b">PSO n_bees=1000</text>
  <text x="628" y="300" font-family="Inter, system-ui" font-size="10" fill="#64748b">mensual · diario</text>
  <text x="628" y="316" font-family="Inter, system-ui" font-size="10" fill="#64748b">multianual</text>
</svg>`;

const spatialFieldSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Campo aleatorio espacio-temporal con correlacion espacial" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Campo espacio-temporal VAR(p): marginal, correlación y simulación</text>
  <!-- Synthetic field grid (left) -->
  <rect x="28" y="54" width="258" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="48" y="78" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#0f172a">Campo sintético (rejilla 8×8)</text>
  <g>
    <defs>
      <linearGradient id="sfg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#dbeafe"/><stop offset=".4" stop-color="#06b6d4"/><stop offset=".7" stop-color="#0f766e"/><stop offset="1" stop-color="#fde047"/>
      </linearGradient>
    </defs>
    <!-- 8x8 colored grid representing synthetic precipitation field -->
    <g opacity=".92">
      <rect x="44" y="90" width="26" height="26" fill="#bae6fd"/><rect x="72" y="90" width="26" height="26" fill="#38bdf8"/><rect x="100" y="90" width="26" height="26" fill="#0891b2"/><rect x="128" y="90" width="26" height="26" fill="#0f766e"/><rect x="156" y="90" width="26" height="26" fill="#0891b2"/><rect x="184" y="90" width="26" height="26" fill="#38bdf8"/><rect x="212" y="90" width="26" height="26" fill="#7dd3fc"/><rect x="240" y="90" width="26" height="26" fill="#bae6fd"/>
      <rect x="44" y="118" width="26" height="26" fill="#38bdf8"/><rect x="72" y="118" width="26" height="26" fill="#0891b2"/><rect x="100" y="118" width="26" height="26" fill="#0f766e"/><rect x="128" y="118" width="26" height="26" fill="#166534"/><rect x="156" y="118" width="26" height="26" fill="#0f766e"/><rect x="184" y="118" width="26" height="26" fill="#0891b2"/><rect x="212" y="118" width="26" height="26" fill="#38bdf8"/><rect x="240" y="118" width="26" height="26" fill="#7dd3fc"/>
      <rect x="44" y="146" width="26" height="26" fill="#7dd3fc"/><rect x="72" y="146" width="26" height="26" fill="#0891b2"/><rect x="100" y="146" width="26" height="26" fill="#166534"/><rect x="128" y="146" width="26" height="26" fill="#14532d"/><rect x="156" y="146" width="26" height="26" fill="#166534"/><rect x="184" y="146" width="26" height="26" fill="#0f766e"/><rect x="212" y="146" width="26" height="26" fill="#0891b2"/><rect x="240" y="146" width="26" height="26" fill="#38bdf8"/>
      <rect x="44" y="174" width="26" height="26" fill="#bae6fd"/><rect x="72" y="174" width="26" height="26" fill="#38bdf8"/><rect x="100" y="174" width="26" height="26" fill="#0891b2"/><rect x="128" y="174" width="26" height="26" fill="#0f766e"/><rect x="156" y="174" width="26" height="26" fill="#0f766e"/><rect x="184" y="174" width="26" height="26" fill="#38bdf8"/><rect x="212" y="174" width="26" height="26" fill="#7dd3fc"/><rect x="240" y="174" width="26" height="26" fill="#bae6fd"/>
      <rect x="44" y="202" width="26" height="26" fill="#e0f2fe"/><rect x="72" y="202" width="26" height="26" fill="#7dd3fc"/><rect x="100" y="202" width="26" height="26" fill="#0891b2"/><rect x="128" y="202" width="26" height="26" fill="#0f766e"/><rect x="156" y="202" width="26" height="26" fill="#0891b2"/><rect x="184" y="202" width="26" height="26" fill="#38bdf8"/><rect x="212" y="202" width="26" height="26" fill="#bae6fd"/><rect x="240" y="202" width="26" height="26" fill="#e0f2fe"/>
    </g>
    <!-- Legend -->
    <rect x="44" y="244" width="26" height="12" fill="#e0f2fe"/><rect x="70" y="244" width="26" height="12" fill="#7dd3fc"/><rect x="96" y="244" width="26" height="12" fill="#0891b2"/><rect x="122" y="244" width="26" height="12" fill="#0f766e"/><rect x="148" y="244" width="26" height="12" fill="#166534"/>
    <text x="44" y="270" font-family="Inter, system-ui" font-size="10" fill="#64748b">bajo</text><text x="186" y="270" font-family="Inter, system-ui" font-size="10" fill="#64748b">alto</text>
    <text x="44" y="290" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">SpatialFieldModel.simulate()</text>
    <text x="44" y="308" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">VAR(p) · dep_structure='gauss'</text>
  </g>
  <!-- Correlation function (center) -->
  <rect x="304" y="54" width="200" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="324" y="78" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#0f172a">Correlación espacial</text>
  <path d="M324 200H476M324 100V210" stroke="#94a3b8" stroke-width="1.5"/>
  <path d="M334 108C354 120 374 150 400 172C424 192 450 200 468 204" fill="none" stroke="#4f46e5" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M334 108C360 124 388 158 420 186C448 208 460 208 468 208" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="8 6"/>
  <text x="330" y="230" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">distancia (km)</text>
  <text x="310" y="162" font-family="Inter, system-ui" font-size="10.5" fill="#64748b" transform="rotate(-90 310 162)">correlación</text>
  <text x="330" y="250" font-family="Inter, system-ui" font-size="10.5" fill="#4f46e5">— clayton STCS</text>
  <text x="330" y="266" font-family="Inter, system-ui" font-size="10.5" fill="#f97316">-- gneiting14</text>
  <text x="330" y="290" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">ACTF empírica</text>
  <text x="330" y="308" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">anisotropía: affine / swirl</text>
  <!-- Multi-site series (right) -->
  <rect x="522" y="54" width="214" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="542" y="78" font-family="Inter, system-ui" font-size="12" font-weight="700" fill="#0f172a">Series multisitio</text>
  <path d="M538 280H710M538 100V285" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- 4 correlated synthetic series -->
  <path d="M548 210C558 195 568 220 582 205C596 188 608 215 624 208C638 200 650 185 664 190C678 196 692 180 706 178" fill="none" stroke="#0891b2" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M548 230C560 215 572 238 586 226C600 212 612 236 628 228C644 218 658 202 672 208C686 214 698 196 706 200" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M548 250C562 236 576 255 590 246C604 236 618 254 634 247C648 240 660 225 674 232C688 238 700 222 706 226" fill="none" stroke="#0f766e" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M548 268C564 254 578 272 592 263C606 252 620 270 638 263C654 256 668 242 682 249C694 254 702 240 706 244" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 4"/>
  <text x="542" y="300" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">4 estaciones · correlación preservada</text>
  <text x="542" y="316" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">STNSRPModel · simulate_dataframe()</text>
</svg>`;

const hydrographSvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Cadena de modelos con hidrograma y mapa de inundacion" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Cadena de modelos: precipitación → hidrograma → mapa de inundación</text>
  <!-- Precipitation input -->
  <rect x="28" y="54" width="130" height="270" rx="8" fill="white" stroke="#dbeafe" stroke-width="1.5"/>
  <text x="42" y="78" font-family="Inter, system-ui" font-size="11.5" font-weight="700" fill="#1e40af">Forzante</text>
  <g fill="#38bdf8" opacity=".85">
    <rect x="44" y="92" width="14" height="28" rx="2"/><rect x="62" y="80" width="14" height="40" rx="2"/>
    <rect x="80" y="70" width="14" height="50" rx="2"/><rect x="98" y="74" width="14" height="46" rx="2"/>
    <rect x="116" y="88" width="14" height="32" rx="2"/>
  </g>
  <text x="42" y="158" font-family="Inter, system-ui" font-size="10" fill="#64748b">Lluvia (mm/h)</text>
  <rect x="40" y="170" width="108" height="100" rx="6" fill="#f0f9ff" stroke="#93c5fd"/>
  <text x="48" y="190" font-family="Inter, system-ui" font-size="10.5" fill="#1e40af" font-weight="600">HEC-HMS</text>
  <text x="48" y="208" font-family="Inter, system-ui" font-size="10" fill="#64748b">CN + Clark + Musk.</text>
  <text x="48" y="224" font-family="Inter, system-ui" font-size="10" fill="#64748b">generate_gage()</text>
  <text x="48" y="240" font-family="Inter, system-ui" font-size="10" fill="#64748b">generate_met()</text>
  <text x="48" y="256" font-family="Inter, system-ui" font-size="10" fill="#64748b">generate_flow()</text>
  <!-- Arrow 1 -->
  <path d="M158 188 L190 188" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#a3)"/>
  <defs><marker id="a3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#64748b"/></marker></defs>
  <!-- Hydrograph panel -->
  <rect x="192" y="54" width="226" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="210" y="78" font-family="Inter, system-ui" font-size="11.5" font-weight="700" fill="#0f172a">Hidrograma</text>
  <path d="M210 280H386M210 100V285" stroke="#94a3b8" stroke-width="1.5"/>
  <g stroke="#e2e8f0" stroke-width="1"><path d="M210 150H386M210 200H386M210 250H386"/></g>
  <path d="M220 272C248 265 266 255 288 228C310 200 320 162 338 148C356 136 368 165 378 200C384 220 386 250 386 270" fill="none" stroke="#0891b2" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M220 275C250 268 270 258 292 235C314 210 326 175 344 165C362 155 372 180 380 210C384 228 386 256 386 274" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-dasharray="9 7"/>
  <text x="298" y="312" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">tiempo</text>
  <text x="194" y="196" font-family="Inter, system-ui" font-size="10" fill="#64748b" transform="rotate(-90 194 196)">Q (m³/s)</text>
  <text x="216" y="308" font-family="Inter, system-ui" font-size="10" fill="#0891b2">— simulado</text>
  <text x="300" y="308" font-family="Inter, system-ui" font-size="10" fill="#f97316">-- escenario CC</text>
  <!-- Arrow 2 -->
  <path d="M418 188 L452 188" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#a3)"/>
  <!-- Hydraulic model + flood map -->
  <rect x="454" y="54" width="278" height="270" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="472" y="78" font-family="Inter, system-ui" font-size="11.5" font-weight="700" fill="#0f172a">Modelo hidráulico + mapa</text>
  <rect x="464" y="90" width="128" height="52" rx="6" fill="#fff7ed" stroke="#fb923c"/>
  <text x="480" y="112" font-family="Inter, system-ui" font-size="10.5" fill="#9a3412" font-weight="600">HEC-RAS</text>
  <text x="480" y="128" font-family="Inter, system-ui" font-size="10" fill="#64748b">modify_unsteady_file()</text>
  <rect x="604" y="90" width="118" height="52" rx="6" fill="#f0fdf4" stroke="#34d399"/>
  <text x="618" y="112" font-family="Inter, system-ui" font-size="10.5" fill="#065f46" font-weight="600">SFINCS</text>
  <text x="618" y="128" font-family="Inter, system-ui" font-size="10" fill="#64748b">setup_sfincs_model()</text>
  <!-- Flood map sketch -->
  <path d="M470 176C510 154 540 148 598 150C638 152 670 174 704 190C704 230 670 260 598 268C540 274 488 262 470 248Z" fill="#bae6fd" opacity=".7"/>
  <path d="M490 188C524 174 556 172 600 176C628 180 658 196 696 206C696 228 658 244 600 250C556 256 512 246 490 234Z" fill="#0891b2" opacity=".65"/>
  <path d="M510 200C548 190 572 192 606 196C628 200 650 212 686 220C686 232 648 238 606 240C572 242 536 234 510 226Z" fill="#0f766e" opacity=".75"/>
  <text x="466" y="290" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">calados · velocidades · extensión</text>
  <text x="466" y="308" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">SWAT+ : write_swatplus_precipitation_files()</text>
</svg>`;

const sensitivitySvg = `
<svg viewBox="0 0 760 360" role="img" aria-label="Analisis de sensibilidad hidraulica con Manning y regresion" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="360" rx="8" fill="#f8fafc"/>
  <text x="28" y="34" font-family="Inter, system-ui" font-size="17" font-weight="800" fill="#0f172a">Sensibilidad hidráulica: ensemble Manning → regresión → área inundada</text>
  <!-- Flood maps ensemble (left) -->
  <rect x="28" y="54" width="278" height="258" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="46" y="78" font-family="Inter, system-ui" font-size="11.5" font-weight="700" fill="#0f172a">Ensemble de mapas de calado</text>
  <path d="M60 282C92 252 112 196 164 186C210 178 234 218 274 194C296 181 308 198 295 244C280 290 220 308 162 302C120 297 88 296 60 282Z" fill="#bae6fd"/>
  <path d="M76 276C116 248 130 214 172 210C214 206 232 238 266 222C284 214 292 230 280 258C264 294 200 296 152 290C118 286 92 288 76 276Z" fill="#0891b2" opacity=".72"/>
  <path d="M96 262C138 244 154 228 188 232C224 236 238 260 260 250C240 282 178 284 138 278C118 274 104 270 96 262Z" fill="#0f766e" opacity=".82"/>
  <path d="M44 294H290M44 68V294" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="46" y="318" font-family="Inter, system-ui" font-size="10.5" fill="#64748b">sim_1 … sim_N  ·  generate_manning_combinations()</text>
  <text x="214" y="92" font-family="Inter, system-ui" font-size="10.5" fill="#0f172a">h&gt;2 m</text>
  <text x="214" y="110" font-family="Inter, system-ui" font-size="10.5" fill="#0891b2">h&gt;1 m</text>
  <text x="214" y="128" font-family="Inter, system-ui" font-size="10.5" fill="#0f766e">cauce</text>
  <!-- Regression panel (right) -->
  <rect x="326" y="54" width="406" height="258" rx="8" fill="white" stroke="#e2e8f0"/>
  <text x="344" y="78" font-family="Inter, system-ui" font-size="11.5" font-weight="700" fill="#0f172a">Regresión Manning n → calado / área inundada</text>
  <path d="M344 276H690M344 100V280" stroke="#94a3b8" stroke-width="1.5"/>
  <g stroke="#e2e8f0" stroke-width="1"><path d="M344 144H690M344 188H690M344 232H690"/></g>
  <!-- Scatter + regression -->
  <path d="M360 268C422 228 490 184 664 116" fill="none" stroke="#0f766e" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M356 272C420 234 492 192 664 128" fill="none" stroke="#99f6e4" stroke-width="16" opacity=".5" stroke-linecap="round"/>
  <g fill="#f97316" opacity=".8">
    <circle cx="372" cy="260" r="5"/><circle cx="400" cy="246" r="5"/><circle cx="432" cy="228" r="5"/>
    <circle cx="468" cy="206" r="5"/><circle cx="506" cy="184" r="5"/><circle cx="550" cy="160" r="5"/>
    <circle cx="598" cy="138" r="5"/><circle cx="644" cy="120" r="5"/>
  </g>
  <text x="524" y="310" font-family="Inter, system-ui" font-size="11" fill="#64748b">Manning n medio</text>
  <text x="326" y="206" font-family="Inter, system-ui" font-size="10.5" fill="#64748b" transform="rotate(-90 326 206)">calado medio / área (m²)</text>
  <text x="344" y="310" font-family="Inter, system-ui" font-size="10" fill="#64748b">manning_flood_regression()  ·  filter_anomalous_simulations()</text>
</svg>`;

// ─── Module data ─────────────────────────────────────────────────────────────

export const modules: ModuleDetail[] = [
  {
    slug: 'fuentes-datos',
    title: 'Fuentes de datos',
    subtitle: {
      es: 'Ingesta, normalización y trazabilidad de datos hidrometeorológicos, climatológicos y geoespaciales.',
      en: 'Ingestion, normalisation and traceability of hydrometeorological, climatological and geospatial data.',
    },
    tag: 'Datos',
    color: 'from-sky-950 via-cyan-900 to-teal-700',
    summary: {
      es: 'El módulo de fuentes de datos centraliza la descarga de todos los inputs que necesita un análisis hidrológico completo: precipitación observada (Meteostat, AEMET, OGIMET), precipitación de satélite y reanálisis, caudales históricos y modelizados, proyecciones climáticas CMIP6 y texturas de suelo. Cada conector aplica bloques temporales, reintentos automáticos y normalización de unidades para garantizar reproducibilidad sin intervención manual.',
      en: 'The data sources module centralises the download of all inputs required for a complete hydrological analysis: observed precipitation (Meteostat, AEMET, OGIMET), satellite and reanalysis precipitation, historical and modelled streamflows, CMIP6 climate projections and soil textures. Each connector applies temporal chunking, automatic retries and unit normalisation to guarantee reproducibility without manual intervention.',
    },
    purpose: {
      es: 'Eliminar la dependencia de scripts no documentados para construir el dataset de cada caso de estudio. Cuando el registro observado llega de múltiples fuentes con formatos distintos, este módulo los convierte en series coherentes con trazabilidad completa desde el portal de datos hasta el producto final. En una tesis industrial, esta capa es determinante para justificar la calidad del input ante tribunales y clientes.',
      en: 'Eliminate the dependence on undocumented scripts for building the dataset for each case study. When the observational record comes from multiple sources in different formats, this module converts them into consistent time series with full traceability from the data portal to the final product. In an industrial thesis, this layer is decisive for justifying input quality before review committees and clients.',
    },
    workflow: [
      { es: 'Definición del dominio espacio-temporal y variables requeridas', en: 'Define the spatio-temporal domain and required variables' },
      { es: 'Descarga por bloques con control de errores y reintentos automáticos', en: 'Block-based download with error control and automatic retries' },
      { es: 'Normalización de fechas, unidades, coordenadas y metadatos', en: 'Normalisation of dates, units, coordinates and metadata' },
      { es: 'Exportación a CSV, NetCDF, GeoTIFF o estructuras pandas/xarray', en: 'Export to CSV, NetCDF, GeoTIFF or pandas/xarray structures' },
    ],
    capabilities: [
      {
        es: 'Descarga de precipitación desde Meteostat, GPM IMERG (NASA Earthdata), PERSIANN-CCS (UCI FTP), ERA5 (Copernicus CDS), AEMET OpenData y OGIMET SYNOP; resoluciones desde horaria a mensual, modos puntual y área.',
        en: 'Precipitation download from Meteostat, GPM IMERG (NASA Earthdata), PERSIANN-CCS (UCI FTP), ERA5 (Copernicus CDS), AEMET OpenData and OGIMET SYNOP; resolutions from hourly to monthly, point and area modes.',
      },
      {
        es: 'Acceso a proyecciones CMIP6 mediante Copernicus CDS (download_CDS_CMIP6) y red federada ESGF (get_dataset_metadata, get_all_urls, process_file), con filtrado por modelo, experimento, variable y variante; descarga OPeNDAP y HTTPServer con recorte a bounding box.',
        en: 'Access to CMIP6 projections via Copernicus CDS (download_CDS_CMIP6) and the federated ESGF network (get_dataset_metadata, get_all_urls, process_file), filtered by model, experiment, variable and variant; OPeNDAP and HTTPServer download with bounding-box clipping.',
      },
      {
        es: 'Descarga y lectura de caudales desde GloFAS (reanálisis y reproyecciones), GRDC (archivos .day/.mon con centinelas -999) y USGS NWIS (conversión ft³/s a m³/s, búsqueda por bounding box).',
        en: 'Download and reading of streamflows from GloFAS (reanalysis and re-forecasts), GRDC (.day/.mon files with −999 sentinels) and USGS NWIS (ft³/s to m³/s conversion, bounding-box station search).',
      },
      {
        es: 'Descarga de GeoTIFFs de texturas de suelo SoilGrids 2017 (ISRIC, 250 m): 21 capas de arena, limo y arcilla para 7 profundidades, con metadatos auxiliares opcionales.',
        en: 'Download of SoilGrids 2017 (ISRIC, 250 m) soil texture GeoTIFFs: 21 sand, silt and clay layers for 7 depths, with optional auxiliary metadata.',
      },
      {
        es: 'Exportación orientada a reproducibilidad: CSV por estación con index temporal, NetCDF con CRS y metadatos CF, inventarios de estaciones y logs de descarga para auditoría por caso de estudio.',
        en: 'Reproducibility-oriented export: per-station CSV with temporal index, NetCDF with CRS and CF metadata, station inventories and download logs for case-study auditing.',
      },
    ],
    methods: [
      { name: 'OGIMETDownloader / download_synop', description: { es: 'Widget Jupyter interactivo y función de descarga por bloques de datos SYNOP diarios desde ogimet.com.', en: 'Interactive Jupyter widget and block-based download function for daily SYNOP data from ogimet.com.' } },
      { name: 'Meteostat', description: { es: 'Notebook de descarga de observaciones meteorológicas históricas desde Meteostat con exportación organizada por estación y variable.', en: 'Notebook for downloading historical weather observations from Meteostat with station- and variable-oriented exports.' } },
      { name: 'download_aemet_daily_data', description: { es: 'Descarga diaria AEMET OpenData con chunks de 15 días, exportación a NetCDF y control de rate limit.', en: 'AEMET OpenData daily download in 15-day chunks, NetCDF export and rate-limit control.' } },
      { name: 'GPMDownloader / PERSSIANDownloader / download_era5', description: { es: 'Conectores de satélite y reanálisis: GPM (earthaccess), PERSIANN (FTP paralelo), ERA5 (cdsapi multihilo).', en: 'Satellite and reanalysis connectors: GPM (earthaccess), PERSIANN (parallel FTP), ERA5 (multi-threaded cdsapi).' } },
      { name: 'download_CDS_CMIP6', description: { es: 'Descarga paralela de proyecciones CMIP6 desde Copernicus CDS con reintentos por año y modelo.', en: 'Parallel CMIP6 projection download from Copernicus CDS with per-year and per-model retries.' } },
      { name: 'get_dataset_metadata / get_all_urls / process_file', description: { es: 'Pipeline ESGF completo: búsqueda de metadatos, obtención de URLs y descarga+recorte OPeNDAP o HTTP.', en: 'Full ESGF pipeline: metadata search, URL retrieval and OPeNDAP or HTTP download with spatial clipping.' } },
      { name: 'download_glofas / download_glofas_by_year / read_glofas_nc', description: { es: 'Caudal GloFAS desde Copernicus EWDS: petición global o por año, extracción puntual NetCDF.', en: 'GloFAS streamflow from Copernicus EWDS: global or yearly request, point extraction from NetCDF.' } },
      { name: 'read_grdc / read_grdc_folder / analyze_grdc_quality', description: { es: 'Lectura y diagnóstico de archivos GRDC diarios o mensuales con gestión de centinelas.', en: 'Reading and quality assessment of daily or monthly GRDC files with sentinel management.' } },
      { name: 'download_usgs / search_usgs_sites', description: { es: 'Caudal diario USGS NWIS con conversión de unidades y búsqueda espacial de estaciones.', en: 'Daily USGS NWIS streamflow with unit conversion and spatial station search.' } },
      { name: 'download_soilgrids', description: { es: 'Descarga de 21 GeoTIFFs de texturas SoilGrids 2017 con reintentos robustos.', en: 'Download of 21 SoilGrids 2017 soil texture GeoTIFFs with robust retries.' } },
    ],
    inputs: [
      { es: 'Dominio espacio-temporal: bounding box, fechas, estaciones o identificadores', en: 'Spatio-temporal domain: bounding box, dates, stations or identifiers' },
      { es: 'Credenciales: API keys AEMET, CDS Copernicus, EWDS; cuenta NASA Earthdata', en: 'Credentials: AEMET, CDS Copernicus, EWDS API keys; NASA Earthdata account' },
      { es: 'Filtros CMIP6/ESGF: model, experiment, variable, variant, table', en: 'CMIP6/ESGF filters: model, experiment, variable, variant, table' },
      { es: 'Metadatos de estaciones GRDC/USGS para lectura de archivos locales', en: 'GRDC/USGS station metadata for reading local files' },
    ],
    outputs: [
      { es: 'Series temporales limpias por estación en CSV o DataFrame pandas', en: 'Clean per-station time series in CSV or pandas DataFrame' },
      { es: 'Cubos NetCDF espaciales listos para análisis con xarray', en: 'Spatial NetCDF cubes ready for analysis with xarray' },
      { es: 'GeoTIFFs de texturas de suelo referenciados geoespacialmente', en: 'Geospatially referenced soil texture GeoTIFFs' },
      { es: 'Inventarios de estaciones, logs de descarga y metadatos de trazabilidad', en: 'Station inventories, download logs and traceability metadata' },
    ],
    validation: [
      { es: 'Descarga en bloques temporales para evitar timeouts de servidor (AEMET máx 15 días, GloFAS por año).', en: 'Block-based temporal download to avoid server timeouts (AEMET max 15 days, GloFAS per year).' },
      { es: 'Reintentos automáticos con backoff exponencial para fallos transitorios de red.', en: 'Automatic retries with exponential back-off for transient network failures.' },
      { es: 'Conservación de coordenadas, altitud, identificadores SYNOP/GRDC/USGS y fuente original como metadatos.', en: 'Preservation of coordinates, elevation, SYNOP/GRDC/USGS identifiers and original source as metadata.' },
      { es: 'Separación entre descarga bruta, procesado y producto final para auditar cada caso de estudio.', en: 'Separation between raw download, processing and final product to audit each case study.' },
      { es: 'Control de valores centinela (-999 GRDC, -99 SWAT+) y conversión de unidades en la capa de normalización.', en: 'Sentinel value control (−999 GRDC, −99 SWAT+) and unit conversion in the normalisation layer.' },
    ],
    industrialUse: [
      { es: 'Montar el dataset completo de una cuenca en horas, con todos los inputs documentados para un informe técnico o capítulo de tesis.', en: 'Assemble the complete dataset for a catchment in hours, with all inputs documented for a technical report or thesis chapter.' },
      { es: 'Preparar los forzantes meteorológicos e hidrológicos para HEC-HMS, SWAT+, SFINCS y HEC-RAS directamente desde las fuentes originales.', en: 'Prepare meteorological and hydrological forcings for HEC-HMS, SWAT+, SFINCS and HEC-RAS directly from original sources.' },
      { es: 'Descargar y verificar combinaciones CMIP6 completas (todas las variables requeridas) antes de iniciar el pipeline de corrección de sesgo y downscaling.', en: 'Download and verify complete CMIP6 combinations (all required variables) before starting the bias-correction and downscaling pipeline.' },
    ],
    hydra: [
      { es: 'Base de todos los análisis de extremos, generación estocástica y modelización: sin datos limpios no hay pipeline.', en: 'Foundation of all extreme-value analyses, stochastic generation and modelling: no clean data, no pipeline.' },
      { es: 'Los conectores CMIP6/ESGF alimentan directamente el módulo de corrección de sesgo y el downscaling híbrido.', en: 'CMIP6/ESGF connectors feed directly into the bias-correction module and the hybrid downscaling pipeline.' },
      { es: 'Conecta la web con la herramienta interactiva de descarga OGIMET y los notebooks de fuentes de datos, incluyendo Meteostat para observaciones meteorológicas históricas.', en: 'Links the web with the interactive OGIMET download tool and the data-sources notebooks, including Meteostat for historical weather observations.' },
    ],
    figures: [
      { title: { es: 'Pipeline de ingesta', en: 'Ingestion pipeline' }, caption: { es: 'Las fuentes entran con formatos heterogéneos y HYDRA los transforma en datasets trazables y reproducibles.', en: 'Sources arrive in heterogeneous formats and HYDRA transforms them into traceable, reproducible datasets.' }, svg: dataPipelineSvg },
      { title: { es: 'CMIP6 / ESGF', en: 'CMIP6 / ESGF' }, caption: { es: 'Búsqueda de metadatos en nodos ESGF y Copernicus CDS, filtrado por modelo/experimento/variable y descarga con recorte espacial.', en: 'Metadata search across ESGF nodes and Copernicus CDS, filtered by model/experiment/variable, with spatial clipping on download.' }, svg: cmip6Svg },
    ],
  },

  {
    slug: 'analisis-climatico',
    title: 'Análisis climático',
    subtitle: {
      es: 'Extremos, dependencia multivariante, corrección de sesgo y downscaling híbrido de mapas de inundación.',
      en: 'Extreme values, multivariate dependence, bias correction and hybrid downscaling of flood inundation maps.',
    },
    tag: 'Clima',
    color: 'from-slate-950 via-indigo-950 to-violet-800',
    summary: {
      es: 'Este módulo transforma series climáticas en información de diseño: periodos de retorno con incertidumbre, dependencia entre variables, corrección de proyecciones CMIP6 y generación de mapas de inundación por periodo de retorno mediante el pipeline de downscaling híbrido.',
      en: 'This module transforms climate series into design information: return periods with uncertainty, inter-variable dependence, CMIP6 projection correction and flood inundation maps by return period via the hybrid downscaling pipeline.',
    },
    purpose: {
      es: 'Evaluar el comportamiento estadístico de lluvias, caudales y variables climáticas con énfasis en extremos, desde análisis local y regional hasta la propagación de incertidumbre climática en mapas de inundación. La combinación de cópulas, clasificación morfológica y simulación hidráulica masiva permite producir mapas de periodo de retorno sin necesidad de correr miles de simulaciones hidráulicas costosas.',
      en: 'Evaluate the statistical behaviour of rainfall, streamflow and climate variables with a focus on extremes, from local and regional analysis to the propagation of climate uncertainty in flood inundation maps. The combination of copulas, morphological classification and massive hydraulic simulation makes it possible to produce return-period maps without running thousands of costly hydraulic simulations.',
    },
    workflow: [
      { es: 'Extracción de eventos extremos o máximos por bloque desde series observadas', en: 'Extraction of extreme events or block maxima from observed series' },
      { es: 'Ajuste probabilístico con incertidumbre (GEV, GPD, L-momentos, Bayes)', en: 'Probabilistic fitting with uncertainty (GEV, GPD, L-moments, Bayes)' },
      { es: 'Análisis de dependencia multivariante mediante cópulas', en: 'Multivariate dependence analysis using copulas' },
      { es: 'Corrección de sesgo de proyecciones CMIP6 y downscaling híbrido a mapas T', en: 'Bias correction of CMIP6 projections and hybrid downscaling to return-period maps' },
    ],
    capabilities: [
      {
        es: 'Extracción de eventos por umbral (spell), POT con declustering, ventanas n-días y eventos concurrentes multi-estación; con separación mínima configurable entre eventos.',
        en: 'Threshold-based event extraction (spell), POT with declustering, n-day windows and concurrent multi-station events; with configurable minimum separation between events.',
      },
      {
        es: 'Análisis de valores extremos: GEV y GPD por MLE robusto multi-arranque, L-momentos, MAP bayesiano, intervalos de Fisher y MCMC (PyMC/PyStan); diagnósticos QQ/PP y curvas de nivel de retorno.',
        en: 'Extreme value analysis: GEV and GPD via robust multi-start MLE, L-moments, Bayesian MAP, Fisher intervals and MCMC (PyMC/PyStan); QQ/PP diagnostics and return-level curves.',
      },
      {
        es: 'Análisis de frecuencia regional (RFA): índice de avenida, GEV regional, niveles de retorno locales escalados y estimación bayesiana jerárquica multi-estación (HierarchicalGEV con PyMC).',
        en: 'Regional frequency analysis (RFA): index flood, regional GEV, scaled local return levels and multi-site Bayesian hierarchical estimation (HierarchicalGEV with PyMC).',
      },
      {
        es: 'Interpolación espacial de campos climáticos: IDW, Kriging Universal (pykrige) y Proceso Gaussiano con covariables de altitud (scikit-learn).',
        en: 'Spatial interpolation of climate fields: IDW, Universal Kriging (pykrige) and Gaussian Process with elevation covariates (scikit-learn).',
      },
      {
        es: 'Cópulas Archimedanas bivariantes y trivariantes (Gumbel, Clayton, Frank) para análisis de inundación compuesta; FloodEventCopula Normal multivariante para generación sintética de hidrogramas.',
        en: 'Bivariate and trivariate Archimedean copulas (Gumbel, Clayton, Frank) for compound flood analysis; multivariate Normal FloodEventCopula for synthetic hydrograph generation.',
      },
      {
        es: 'Corrección de sesgo cuantílica: Delta mensual, mapeo cuantílico aditivo (QM), delta cuantílico multiplicativo (QDM) y mapeo de distribución escalada paramétrico gamma/normal (SDM).',
        en: 'Quantile bias correction: monthly Delta, additive quantile mapping (QM), multiplicative quantile-delta (QDM) and parametric scaled distribution mapping gamma/normal (SDM).',
      },
      {
        es: 'Pipeline de downscaling híbrido: clasificación morfológica de crecidas (PCA+K-means), muestreo por cópula Normal multivariante, selección MaxDiss de representativos, simulaciones hidráulicas SFINCS, interpolación k-NN en espacio de cópula y cálculo pixel a pixel de mapas por periodo de retorno.',
        en: 'Hybrid downscaling pipeline: morphological flood classification (PCA+K-means), multivariate Normal copula sampling, MaxDiss representative selection, SFINCS hydraulic simulations, k-NN interpolation in copula space and pixel-by-pixel computation of return-period maps.',
      },
    ],
    methods: [
      { name: 'extract_events / extract_discharge_events / extract_precipitation_events_pot', description: { es: 'Extracción reproducible de eventos de crecida y precipitación con POT, spell y ventana n-días.', en: 'Reproducible extraction of flood and precipitation events with POT, spell and n-day window approaches.' } },
      { name: 'fit_gev / fit_gev_mle / fit_gev_lmom / fit_gev_bayes / return_level', description: { es: 'Ajuste GEV local con MLE, L-momentos, MAP bayesiano y MCMC; niveles de retorno con incertidumbre.', en: 'Local GEV fitting with MLE, L-moments, Bayesian MAP and MCMC; return levels with uncertainty bands.' } },
      { name: 'regional_index_flood / fit_regional_gev / regional_return_levels / HierarchicalGEV', description: { es: 'Análisis de frecuencia regional e inferencia bayesiana jerárquica multi-estación.', en: 'Regional frequency analysis and multi-site Bayesian hierarchical inference.' } },
      { name: 'IDWInterpolator / KrigingInterpolator / GaussianProcessInterpolator', description: { es: 'Reconstrucción espacial de variables climáticas o de crecida.', en: 'Spatial reconstruction of climate or flood variables.' } },
      { name: 'BivariateCopula / TrivariateCopula / FloodEventCopula', description: { es: 'Dependencia multivariante para inundación compuesta (caudal, nivel del mar, precipitación) y generación sintética de hidrogramas.', en: 'Multivariate dependence for compound flooding (flow, sea level, precipitation) and synthetic hydrograph generation.' } },
      { name: 'BiasCorrection (QM / QDM / SDM) / delta_method', description: { es: 'Corrección de sesgo cuantílica empírica y paramétrica para proyecciones climáticas.', en: 'Empirical and parametric quantile bias correction for climate projections.' } },
      { name: 'HydrographClassifier / HydrographReconstructor / maxdiss', description: { es: 'Clasificación morfológica de crecidas y selección MaxDiss de eventos representativos para simulación hidráulica masiva.', en: 'Flood morphological classification and MaxDiss event selection for massive hydraulic simulation.' } },
      { name: 'FloodMapInterpolator / FloodMapInterpolatorCC / pixel_return_period / save_return_period_geotiffs', description: { es: 'Interpolación k-NN de mapas de inundación y cálculo pixel a pixel de mapas GeoTIFF por periodo de retorno (histórico y CC).', en: 'k-NN interpolation of flood maps and pixel-by-pixel computation of return-period GeoTIFFs (historical and climate-change scenarios).' } },
    ],
    inputs: [
      { es: 'Series observadas de precipitación y caudal con DatetimeIndex', en: 'Observed precipitation and streamflow series with DatetimeIndex' },
      { es: 'Proyecciones CMIP6 históricas y SSP (pr, tas, tasmax…)', en: 'Historical and SSP CMIP6 projections (pr, tas, tasmax…)' },
      { es: 'Eventos extraídos, máximos anuales y metadatos espaciales', en: 'Extracted events, annual maxima and spatial metadata' },
      { es: 'Hidrogramas de simulación hidráulica (SFINCS) en directorio de salida', en: 'Hydraulic simulation (SFINCS) hydrographs in output directory' },
    ],
    outputs: [
      { es: 'Niveles de retorno con intervalos de confianza o credibles', en: 'Return levels with confidence or credible intervals' },
      { es: 'Eventos sintéticos multivariantes coherentes (Qmax, Qmed, Duración, tipo)', en: 'Coherent multivariate synthetic events (Qmax, Qmed, Duration, type)' },
      { es: 'Series y campos con sesgo corregido para el periodo futuro', en: 'Bias-corrected series and fields for the future period' },
      { es: 'GeoTIFFs de calado máximo esperado por periodo de retorno (T=5 a T=1000)', en: 'Maximum expected water-depth GeoTIFFs by return period (T=5 to T=1000)' },
    ],
    validation: [
      { es: 'Diagnósticos QQ/PP y curvas de nivel de retorno empíricas frente al ajuste.', en: 'QQ/PP diagnostics and empirical return-level curves against the fit.' },
      { es: 'Comparación de estadísticos observados frente a corregidos o simulados (media, varianza, percentiles extremos).', en: 'Comparison of observed vs corrected or simulated statistics (mean, variance, extreme percentiles).' },
      { es: 'Revisión de estabilidad de umbral GPD y separación mínima entre eventos POT.', en: 'GPD threshold stability review and minimum separation between POT events.' },
      { es: 'Contraste entre correlación observada y sintética para cópulas y FloodEventCopula.', en: 'Contrast between observed and synthetic correlation for copulas and FloodEventCopula.' },
      { es: 'Diagnóstico de convergencia MCMC (R-hat, ESS) en modelos HierarchicalGEV y fit_gev_bayes.', en: 'MCMC convergence diagnostics (R-hat, ESS) for HierarchicalGEV and fit_gev_bayes models.' },
    ],
    industrialUse: [
      { es: 'Convertir series climáticas y proyecciones CMIP6 en valores de diseño hidrológico con incertidumbre cuantificada para informes técnicos.', en: 'Convert climate series and CMIP6 projections into hydrological design values with quantified uncertainty for technical reports.' },
      { es: 'Generar mapas de inundación por periodo de retorno para cualquier escenario climático sin necesidad de correr miles de simulaciones hidráulicas completas.', en: 'Generate flood inundation maps by return period for any climate scenario without running thousands of full hydraulic simulations.' },
      { es: 'Documentar la cadena estadística completa (datos → extremos → corrección → downscaling) en la memoria doctoral con reproducibilidad total.', en: 'Document the full statistical chain (data → extremes → correction → downscaling) in the doctoral thesis with complete reproducibility.' },
    ],
    hydra: [
      { es: 'Alimenta las herramientas interactivas de eventos + GEV bayesiana y cópulas de eventos de la web.', en: "Feeds the web's interactive event + Bayesian GEV and event copula tools." },
      { es: 'El pipeline de downscaling híbrido conecta directamente con los modelos hidráulicos del módulo de modelización.', en: 'The hybrid downscaling pipeline connects directly with the hydraulic models in the modelling module.' },
      { es: 'Produce los escenarios climáticos que alimentan HEC-HMS, SWAT+, SFINCS y HEC-RAS.', en: 'Produces climate scenarios that feed HEC-HMS, SWAT+, SFINCS and HEC-RAS.' },
    ],
    figures: [
      { title: { es: 'Análisis de extremos', en: 'Extreme-value analysis' }, caption: { es: 'Curva de periodo de retorno GEV con banda de incertidumbre, posterior MCMC de parámetros y diagnóstico QQ para diseño hidrológico.', en: 'GEV return-level curve with uncertainty band, MCMC parameter posterior and QQ diagnostic for hydrological design.' }, svg: extremesSvg },
      { title: { es: 'Downscaling híbrido', en: 'Hybrid downscaling' }, caption: { es: 'Pipeline completo: clasificación morfológica → cópula → MaxDiss → simulaciones SFINCS → interpolación k-NN → mapas GeoTIFF de periodo de retorno.', en: 'Full pipeline: morphological classification → copula → MaxDiss → SFINCS simulations → k-NN interpolation → return-period GeoTIFF maps.' }, svg: downscalingSvg },
    ],
  },

  {
    slug: 'generacion-estocastica',
    title: 'Generación estocástica',
    subtitle: {
      es: 'Series, campos y ensembles sintéticos que preservan distribución marginal, estacionalidad y dependencia espacio-temporal.',
      en: 'Synthetic series, fields and ensembles preserving marginal distribution, seasonality and spatio-temporal dependence.',
    },
    tag: 'Simulación',
    color: 'from-slate-950 via-emerald-950 to-teal-700',
    summary: {
      es: 'Este módulo genera escenarios plausibles cuando el registro observado es demasiado corto para explorar riesgo e incertidumbre. Abarca desde series puntuales mediante CoSMoS y NSRP hasta campos espaciales aleatorios multisitio con estructura de correlación espacio-temporal parametrizada.',
      en: 'This module generates plausible scenarios when the observational record is too short to explore risk and uncertainty. It covers point series via CoSMoS and NSRP through to multi-site random spatial fields with a parametrised spatio-temporal correlation structure.',
    },
    purpose: {
      es: 'Ajustar modelos estocásticos que reproduzcan distribución marginal, estacionalidad, autocorrelación y dependencia espacial. Los ensembles resultantes alimentan modelos físicos y análisis de robustez. El enfoque NSRP (Neyman-Scott Rectangular Pulses) es especialmente útil para precipitación intermitente, mientras que CoSMoS VAR(p) permite simular cualquier variable con estructura espacio-temporal.',
      en: 'Fit stochastic models that reproduce marginal distribution, seasonality, autocorrelation and spatial dependence. The resulting ensembles feed physical models and robustness analyses. The NSRP (Neyman-Scott Rectangular Pulses) approach is especially useful for intermittent precipitation, while CoSMoS VAR(p) allows simulation of any variable with a spatio-temporal structure.',
    },
    workflow: [
      { es: 'Ajuste de marginales estacionales y estructura temporal (ACF) sobre la serie observada', en: 'Fit seasonal marginals and temporal structure (ACF) from the observed series' },
      { es: 'Calibración PSO de parámetros NSRP o ajuste VAR(p) del campo espacial', en: 'PSO calibration of NSRP parameters or VAR(p) fitting of the spatial field' },
      { es: 'Simulación de ensembles con semilla reproducible', en: 'Ensemble simulation with reproducible seed' },
      { es: 'Diagnóstico frente a estadísticos observados: media, varianza, ACF, correlación espacial', en: 'Diagnostic against observed statistics: mean, variance, ACF, spatial correlation' },
    ],
    capabilities: [
      {
        es: 'Generación puntual de series con CoSMoS (analyze_ts / simulate_ts): marginales flexibles (gengamma, BurrXII, GEV…), probabilidad de cero p0, autocorrelación estacional mensual o semanal.',
        en: 'Point series generation with CoSMoS (analyze_ts / simulate_ts): flexible marginals (gengamma, BurrXII, GEV…), zero-probability p0, monthly or weekly seasonal autocorrelation.',
      },
      {
        es: 'Modelo NSRP puntual (NSRPModel vía NEOPRENE): proceso de Poisson de tormentas con celdas rectangulares aleatorias, calibración PSO sobre estadísticos observados, resolución diaria u horaria con estacionalidad mensual.',
        en: 'Point NSRP model (NSRPModel via NEOPRENE): Poisson storm process with random rectangular cells, PSO calibration against observed statistics, daily or hourly resolution with monthly seasonality.',
      },
      {
        es: 'Modelo STNSRP multi-estación (STNSRPModel): preserva correlaciones espaciales entre estaciones con coordenadas geográficas o UTM; calibración PSO con enjambre de 1000 partículas para producción.',
        en: 'Multi-site STNSRP model (STNSRPModel): preserves spatial correlations between stations with geographic or UTM coordinates; PSO calibration with a 1000-particle swarm for production runs.',
      },
      {
        es: 'Campos aleatorios espacio-temporales con CoSMoS_py (SpatialFieldModel): VAR(p), marginales flexibles, estructuras de correlación espacio-temporal (Clayton, Gneiting), cópulas de dependencia Gauss/Student/Bardossy, advección uniforme/rotación/espiral y anisotropía afín.',
        en: 'Spatio-temporal random fields with CoSMoS_py (SpatialFieldModel): VAR(p), flexible marginals, spatio-temporal correlation structures (Clayton, Gneiting), Gauss/Student/Bardossy dependence copulas, uniform advection/rotation/swirl and affine anisotropy.',
      },
      {
        es: 'Soporte para rejillas regulares y ubicaciones irregulares; diagnóstico completo de media, varianza, ACF, matriz de correlación y excedencia conjunta.',
        en: 'Support for regular grids and irregular locations; complete diagnostics of mean, variance, ACF, correlation matrix and joint exceedance.',
      },
    ],
    methods: [
      { name: 'analyze_ts / simulate_ts / report_ts', description: { es: 'Ajuste estacional CoSMoS y simulación de series temporales puntuales con diagnóstico completo.', en: 'Seasonal CoSMoS fitting and point time-series simulation with complete diagnostics.' } },
      { name: 'NSRPModel.fit() / NSRPModel.simulate()', description: { es: 'Modelo NSRP puntual calibrado con PSO sobre estadísticos diarios: media, varianza, probabilidad de lluvia, ACF y autocovarianza.', en: 'Point NSRP model calibrated with PSO against daily statistics: mean, variance, rain probability, ACF and autocovariance.' } },
      { name: 'STNSRPModel.fit() / STNSRPModel.simulate()', description: { es: 'Extensión multisitio del NSRP que preserva correlaciones espaciales cruzadas entre estaciones.', en: 'Multi-site NSRP extension preserving spatial cross-correlations between stations.' } },
      { name: 'SpatialFieldModel.fit() / SpatialFieldModel.simulate()', description: { es: 'Campo aleatorio VAR(p) con distribución marginal y estructura de correlación espacio-temporal parametrizada.', en: 'VAR(p) random field with marginal distribution and parametrised spatio-temporal correlation structure.' } },
      { name: 'fit_spatial_model / generate_random_field / check_random_field', description: { es: 'API funcional para ajuste, simulación y diagnóstico de campos espaciales en rejilla o ubicaciones irregulares.', en: 'Functional API for fitting, simulation and diagnostics of spatial fields on grids or irregular locations.' } },
    ],
    inputs: [
      { es: 'Series diarias o sub-diarias observadas con DatetimeIndex (precipitación, caudal, temperatura…)', en: 'Daily or sub-daily observed series with DatetimeIndex (precipitation, streamflow, temperature…)' },
      { es: 'Coordenadas de estaciones (lat/lon o UTM) para modelos multisitio y campos', en: 'Station coordinates (lat/lon or UTM) for multi-site and spatial field models' },
      { es: 'Distribución marginal, p0, orden VAR y parámetros de correlación para SpatialFieldModel', en: 'Marginal distribution, p0, VAR order and correlation parameters for SpatialFieldModel' },
      { es: 'Horizonte de simulación y semilla aleatoria para reproducibilidad del ensemble', en: 'Simulation horizon and random seed for ensemble reproducibility' },
    ],
    outputs: [
      { es: 'Ensembles sintéticos puntuales de cualquier longitud (pd.Series)', en: 'Synthetic point ensembles of any length (pd.Series)' },
      { es: 'Campos espacio-temporales sintéticos (ndarray n_steps × n_sites)', en: 'Synthetic spatio-temporal fields (ndarray n_steps × n_sites)' },
      { es: 'Series multisitio correlacionadas (pd.DataFrame con DatetimeIndex)', en: 'Correlated multi-site series (pd.DataFrame with DatetimeIndex)' },
      { es: 'Diagnósticos de media, varianza, ACF, correlación espacial y dependencia de cola', en: 'Diagnostics of mean, variance, ACF, spatial correlation and tail dependence' },
    ],
    validation: [
      { es: 'Comparación mensual de estadísticos observados y simulados (media, varianza, p0, correlaciones).', en: 'Monthly comparison of observed and simulated statistics (mean, variance, p0, correlations).' },
      { es: 'Evaluación de ACF empírica frente al modelo de autocorrelación ajustado.', en: 'Evaluation of empirical ACF against the fitted autocorrelation model.' },
      { es: 'Matriz de correlación entre estaciones para validar la preservación de dependencia espacial.', en: 'Inter-station correlation matrix to validate spatial dependence preservation.' },
      { es: 'Análisis de excedencia conjunta para revisar eventos extremos simultáneos en el ensemble.', en: 'Joint exceedance analysis to review simultaneous extreme events in the ensemble.' },
    ],
    industrialUse: [
      { es: 'Ampliar el número de escenarios para diseño hidrológico cuando el registro histórico es corto (< 30 años).', en: 'Expand the number of scenarios for hydrological design when the historical record is short (< 30 years).' },
      { es: 'Construir ensembles de lluvia sintética para análisis de sensibilidad de modelos HEC-HMS o SWAT+.', en: 'Build synthetic rainfall ensembles for sensitivity analysis of HEC-HMS or SWAT+ models.' },
      { es: 'Explorar riesgo compuesto y eventos plausibles no observados en el periodo histórico disponible.', en: 'Explore compound risk and plausible unobserved events beyond the available historical period.' },
    ],
    hydra: [
      { es: 'Alimenta la herramienta web de generación estocástica con CoSMoS.', en: "Feeds the web's stochastic generation tool with CoSMoS." },
      { es: 'Los ensembles sintéticos se usan como forzantes en HEC-HMS, SWAT+ y SFINCS.', en: 'Synthetic ensembles are used as forcings in HEC-HMS, SWAT+ and SFINCS.' },
      { es: 'Conecta con el análisis de extremos para validar la representación de eventos raros.', en: 'Connects with extreme-value analysis to validate rare-event representation.' },
    ],
    figures: [
      { title: { es: 'Modelo NSRP', en: 'NSRP model' }, caption: { es: 'Proceso de Poisson de tormentas con celdas rectangulares aleatorias (NSRPModel) y calibración PSO sobre estadísticos observados.', en: 'Poisson storm process with random rectangular cells (NSRPModel) and PSO calibration against observed statistics.' }, svg: nsrpSvg },
      { title: { es: 'Campo espacio-temporal', en: 'Spatio-temporal field' }, caption: { es: 'SpatialFieldModel VAR(p): campo sintético sobre rejilla, función de correlación espacial y series multisitio correlacionadas.', en: 'SpatialFieldModel VAR(p): synthetic field on a grid, spatial correlation function and correlated multi-site series.' }, svg: spatialFieldSvg },
    ],
  },

  {
    slug: 'modelizacion',
    title: 'Modelización',
    subtitle: {
      es: 'Automatización de modelos hidrológicos e hidráulicos en flujos reproducibles orientados a casos de estudio reales.',
      en: 'Automation of hydrological and hydraulic models in reproducible workflows oriented to real case studies.',
    },
    tag: 'Modelos',
    color: 'from-slate-950 via-orange-950 to-amber-700',
    summary: {
      es: 'Este módulo convierte datos y escenarios climáticos en simulaciones hidrológicas e hidráulicas reproducibles. Integra HEC-HMS, SWAT+, HEC-RAS y SFINCS en flujos automatizables: preparación de entradas, ejecución, extracción de resultados y análisis de sensibilidad, eliminando el trabajo manual repetitivo que domina los estudios de consultoría.',
      en: 'This module converts data and climate scenarios into reproducible hydrological and hydraulic simulations. It integrates HEC-HMS, SWAT+, HEC-RAS and SFINCS in automatable workflows: input preparation, execution, result extraction and sensitivity analysis, eliminating the repetitive manual work that dominates consultancy studies.',
    },
    purpose: {
      es: 'Automatizar las operaciones más costosas en tiempo de modelización: generación de archivos de entrada, ejecución de escenarios en lote, lectura de resultados DSS y análisis de sensibilidad de parámetros. En proyectos con decenas o cientos de escenarios climáticos o de Manning, la diferencia entre hacerlo manual o con HYDRA puede ser de días a minutos.',
      en: 'Automate the most time-consuming modelling operations: input file generation, batch scenario execution, DSS result reading and parameter sensitivity analysis. In projects with tens or hundreds of climate or Manning scenarios, the difference between doing this manually or with HYDRA can be days versus minutes.',
    },
    workflow: [
      { es: 'Preparación de forzantes meteorológicos e hidráulicos desde datos observados o sintéticos', en: 'Preparation of meteorological and hydraulic forcings from observed or synthetic data' },
      { es: 'Generación automática de archivos de proyecto para HEC-HMS, SWAT+, HEC-RAS o SFINCS', en: 'Automatic generation of project files for HEC-HMS, SWAT+, HEC-RAS or SFINCS' },
      { es: 'Ejecución del modelo en lote (un escenario o ensemble completo)', en: 'Batch model execution (single scenario or full ensemble)' },
      { es: 'Extracción de hidrogramas, calados, velocidades y áreas inundadas para análisis y sensibilidad', en: 'Extraction of hydrographs, water depths, velocities and flooded areas for analysis and sensitivity studies' },
    ],
    capabilities: [
      {
        es: 'HEC-HMS completo: generación de archivos .gage, .met, .control, .run y .hms; lectura de hidrogramas desde DSS; parametrización automática de Curve Number, Clark y Muskingum-K; ejecución de escenarios de cambio climático en lote.',
        en: 'Complete HEC-HMS: generation of .gage, .met, .control, .run and .hms files; reading hydrographs from DSS; automatic parametrisation of Curve Number, Clark and Muskingum-K; batch climate-change scenario execution.',
      },
      {
        es: 'SWAT+: escritura de archivos de precipitación multi-estación (.pcp legacy y uno por estación), temperatura (.tmp), modificación de file.cio (periodo de simulación) y ejecución del binario.',
        en: 'SWAT+: writing multi-station precipitation files (.pcp legacy and one per station), temperature (.tmp), modification of file.cio (simulation period) and binary execution.',
      },
      {
        es: 'HEC-RAS: modificación automática de archivos de flujo no estacionario (.u##) e archivos de plan (.p##) para automatizar series de escenarios; conversión de hidrogramas a formato DSS.',
        en: 'HEC-RAS: automatic modification of unsteady-flow (.u##) and plan (.p##) files to automate series of scenarios; hydrograph conversion to DSS format.',
      },
      {
        es: 'SFINCS: configuración de malla desde DEM, condiciones de contorno de caudal (fuentes puntuales), condición de contorno aguas abajo por profundidad normal de Manning, rugosidad uniforme y ejecución del binario.',
        en: 'SFINCS: mesh configuration from DEM, point-source flow boundary conditions, normal-depth Manning downstream boundary condition, uniform roughness and binary execution.',
      },
      {
        es: 'Análisis de sensibilidad de Manning: generación Monte Carlo de combinaciones de rugosidad por uso del suelo, carga de ensembles de mapas GeoTIFF, construcción del raster de Manning por escenario, regresión Manning → calado/área y filtrado de simulaciones anómalas por Z-score MAD.',
        en: 'Manning sensitivity analysis: Monte Carlo generation of land-use roughness combinations, loading of GeoTIFF map ensembles, Manning raster construction per scenario, Manning → depth/area regression and anomalous simulation filtering by MAD Z-score.',
      },
    ],
    methods: [
      { name: 'HMSModel / generate_gage / generate_met / generate_control / generate_run', description: { es: 'Construcción completa y ejecución reproducible de proyectos HEC-HMS con múltiples pluviómetros y subcuencas.', en: 'Complete construction and reproducible execution of HEC-HMS projects with multiple rain gauges and sub-catchments.' } },
      { name: 'generate_flow / read_dss6_timeseries', description: { es: 'Extracción de hidrogramas e hyetogramas desde archivos DSS de HEC-HMS y HEC-RAS.', en: 'Extraction of hydrographs and hyetographs from HEC-HMS and HEC-RAS DSS files.' } },
      { name: 'extract_curve_number / calculate_clark_parameters / estimate_muskingum_k', description: { es: 'Parametrización hidrológica desde rasters: CN por uso/suelo, tiempos de Clark y K de Muskingum.', en: 'Hydrological parametrisation from rasters: CN by land use/soil, Clark times and Muskingum K.' } },
      { name: 'write_precipitation_file / write_swatplus_precipitation_files / write_swatplus_temperature_files / run_swat', description: { es: 'Escritura de entradas meteorológicas SWAT+ (formatos legacy y uno-por-estación) y ejecución del modelo.', en: 'Writing SWAT+ meteorological inputs (legacy and per-station formats) and model execution.' } },
      { name: 'modify_unsteady_file / modify_plan_file', description: { es: 'Actualización automática de archivos HEC-RAS para ejecutar series de escenarios sin intervención manual.', en: 'Automatic update of HEC-RAS files for batch scenario execution without manual intervention.' } },
      { name: 'setup_sfincs_model / write_manning_wl_boundary / run_sfincs', description: { es: 'Configuración, condiciones de contorno y ejecución de modelos SFINCS para inundación fluvial simplificada.', en: 'Configuration, boundary conditions and execution of SFINCS models for simplified fluvial flooding.' } },
      { name: 'generate_manning_combinations / build_manning_ensemble / manning_flood_regression / filter_anomalous_simulations', description: { es: 'Diseño y análisis estadístico de ensembles de rugosidad Manning para sensibilidad hidráulica.', en: 'Design and statistical analysis of Manning roughness ensembles for hydraulic sensitivity.' } },
    ],
    inputs: [
      { es: 'Precipitación, temperatura, caudal, CN, topografía, rugosidad y condiciones de contorno', en: 'Precipitation, temperature, streamflow, CN, topography, roughness and boundary conditions' },
      { es: 'Configuraciones de proyecto HEC-HMS, SWAT+, HEC-RAS y SFINCS existentes', en: 'Existing HEC-HMS, SWAT+, HEC-RAS and SFINCS project configurations' },
      { es: 'Escenarios históricos, sintéticos (NSRPModel) o climáticos (BiasCorrection)', en: 'Historical, synthetic (NSRPModel) or climate (BiasCorrection) scenarios' },
      { es: 'Mapas raster de uso del suelo y DEM para parametrización y configuración de malla SFINCS', en: 'Land-use raster maps and DEM for parametrisation and SFINCS mesh configuration' },
    ],
    outputs: [
      { es: 'Hidrogramas simulados en pandas Series y archivos DSS', en: 'Simulated hydrographs in pandas Series and DSS files' },
      { es: 'Mapas de calado, velocidad y extensión inundada (NetCDF, GeoTIFF)', en: 'Water depth, velocity and flood extent maps (NetCDF, GeoTIFF)' },
      { es: 'Métricas de área inundada y calado medio por simulación', en: 'Flooded area and mean depth metrics per simulation' },
      { es: 'Resultados de sensibilidad Manning: regresión, filtrado de anomalías y estadísticos espaciales', en: 'Manning sensitivity results: regression, anomaly filtering and spatial statistics' },
    ],
    validation: [
      { es: 'Comparación de hidrogramas simulados y observados con NSE, sesgo y correlación.', en: 'Comparison of simulated and observed hydrographs with NSE, bias and correlation.' },
      { es: 'Revisión de coherencia hidráulica en calados, velocidades y extensión inundada por escenario.', en: 'Hydraulic consistency review of depths, velocities and flood extent per scenario.' },
      { es: 'Análisis de sensibilidad de Manning con filtrado Z-score MAD para eliminar simulaciones degeneradas.', en: 'Manning sensitivity analysis with MAD Z-score filtering to remove degenerate simulations.' },
      { es: 'Trazabilidad completa: cada escenario referencia su forcing de entrada, su configuración de modelo y su resultado.', en: 'Full traceability: each scenario references its input forcing, model configuration and result.' },
    ],
    industrialUse: [
      { es: 'Reducir días de trabajo a horas en la preparación de 50–500 escenarios de precipitación o Manning para un estudio de riesgo.', en: 'Reduce days of work to hours when preparing 50–500 precipitation or Manning scenarios for a risk study.' },
      { es: 'Transformar proyecciones climáticas o ensembles sintéticos en mapas y métricas operativas para administraciones y consultoras.', en: 'Transform climate projections or synthetic ensembles into operational maps and metrics for authorities and consultancies.' },
      { es: 'Construir un manual práctico reproducible con scripts, parámetros y resultados verificables para la memoria doctoral o un informe técnico.', en: 'Build a reproducible practical manual with scripts, parameters and verifiable results for the doctoral thesis or a technical report.' },
    ],
    hydra: [
      { es: 'Da forma industrial al manual práctico de la tesis: los notebooks de HEC-HMS, SWAT+, HEC-RAS y SFINCS son casos de uso reales.', en: 'Gives industrial form to the thesis practical manual: HEC-HMS, SWAT+, HEC-RAS and SFINCS notebooks are real case studies.' },
      { es: 'Conecta con los ensembles del módulo de análisis climático: los hidrogramas sintéticos de FloodEventCopula alimentan SFINCS.', en: 'Connects with ensembles from the climate analysis module: FloodEventCopula synthetic hydrographs feed SFINCS.' },
      { es: 'Traduce el análisis estadístico climático en resultados operativos (mapas de inundación) para toma de decisiones.', en: 'Translates statistical climate analysis into operational results (flood maps) for decision-making.' },
    ],
    figures: [
      { title: { es: 'Cadena de modelos', en: 'Model chain' }, caption: { es: 'Pipeline completo desde precipitación hasta mapa de inundación: HEC-HMS genera el hidrograma y SFINCS/HEC-RAS produce el mapa de calados.', en: 'Full pipeline from precipitation to flood map: HEC-HMS generates the hydrograph and SFINCS/HEC-RAS produces the water depth map.' }, svg: hydrographSvg },
      { title: { es: 'Sensibilidad de Manning', en: 'Manning sensitivity' }, caption: { es: 'Ensemble Monte Carlo de combinaciones de rugosidad: regresión Manning n → calado medio y área inundada con bandas de incertidumbre.', en: 'Monte Carlo ensemble of roughness combinations: Manning n → mean depth and flooded area regression with uncertainty bands.' }, svg: sensitivitySvg },
    ],
  },
];

export const moduleBySlug = new Map(modules.map((module) => [module.slug, module]));
