export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  block: string;
  blockColor: string;
  estimatedMinutes: number;
  // Online (iframe) mode URL
  url?: string;
  anchor?: string;
  highlight?: string;
  webMode?: 'evidence' | 'demo';
  webLabel?: string;
  webPurpose?: string;
  webAction?: string;
  // Offline figure assets
  figure?: string;
  figureCaption?: string;
  secondaryFigure?: string;
  secondaryFigureCaption?: string;
  figurePosition?: 'full' | 'right' | 'left';
  // Slide texts
  script: string;        // Presenter speech / guion
  notes?: string;        // Private presenter guide notes
  bullets?: string[];    // Bullet points shown on slide
  mathBlock?: string;    // Custom HTML/MathML for mathematical equations
  results?: { value: string; label: string; implication?: string }[];
  pyhydraRole?: string;
  pyhydraModules?: string[];
  processSteps?: string[]; // Compact methodological chain shown beside case-study figures
  caseReference?: string; // Visible provenance for case-study evidence
  type?: 'title' | 'index' | 'quote' | 'timeline' | 'matrix' | 'figure' | 'split' | 'table' | 'normal';
  backup?: boolean;      // Material preparado para preguntas, fuera del relato principal
}

export const slideLibrary: Slide[] = [

  // ════════════════════════════════════════════════════
  // BLOQUE 1 — APERTURA Y PORTADA
  // ════════════════════════════════════════════════════

  {
    id: 1,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Desarrollo de un modelo automático de inundación estocástica',
    subtitle: 'Tesis Doctoral con Mención Industrial, presentada para la obtención del título de Doctor por la Universidad de Cantabria',
    estimatedMinutes: 3,
    type: 'title',
    script: 'Buenos días. Miembros del tribunal, directores, profesores y compañeros. Les presento la defensa de mi tesis doctoral titulada "Desarrollo de un modelo automático de inundación estocástica bajo incertidumbre hidrológica y climática", con Mención Industrial, desarrollada en el Instituto de Hidráulica Ambiental IHCantabria.',
    notes: 'Iniciar con tono formal y pausado. Agradecer la presencia del tribunal.\n\nDatos de portada clave:\n- Autor: Salvador Navas Fernández\n- Director: Manuel del Jesús Peñil\n- Tutor: César Álvarez Díaz\n- Programa: IH2O\n- Universidad: UC / IHCantabria\n\n💡 El nombre "HYDRA" no es casual: evoca a la criatura mitológica de múltiples cabezas que actúa como un solo organismo coordinado — exactamente la metáfora de una arquitectura modular pero unificada. Puede servir como imagen mental para el tribunal desde el primer minuto.\n\n❓ Pregunta típica: "¿Esto es ingeniería de software o ciencia?" → La propia tesis estratifica sus aportaciones en tres niveles (metodologías incorporadas / desarrollos implementados / contribución original, cap. 9) precisamente para anticipar esta pregunta: la novedad se reivindica en la integración, no en algoritmos nuevos.',
    bullets: [
      'Salvador Navas Fernández',
      'Dr. Manuel del Jesús Peñil',
      'Dr. César Álvarez Díaz',
    ],
  },

  {
    id: 4,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Estructura de la defensa',
    subtitle: 'Correspondencia directa con los capítulos de la memoria doctoral',
    estimatedMinutes: 1,
    type: 'index',
    script: 'La exposición reproduce la estructura académica de la memoria. Primero presentaré la introducción: origen, motivación, problema, hipótesis y objetivos. Después resumiré el estado de la técnica y la brecha que justifica la investigación. El tercer bloque describe la arquitectura de pyhydra y HYDRA. Los tres capítulos metodológicos de la memoria se agrupan a continuación en fuentes de datos, análisis climático y estadístico, y modelización hidrológica e hidráulica. Seguidamente mostraré el uso operativo de la plataforma, equivalente al manual práctico. Los casos de estudio constituyen el bloque de validación. Finalmente cerraré con las hipótesis, las contribuciones científicas, las conclusiones, las limitaciones y el trabajo futuro.',
    notes: 'Esta es la única diapositiva de índice. Explicar expresamente la correspondencia con los capítulos 1–9. Los capítulos 4, 5 y 6 se agrupan visualmente como metodología, pero se nombran por separado para que el tribunal reconozca la estructura de la memoria.',
    bullets: [
      '1. Introducción — Origen, motivación, problema, hipótesis y objetivos',
      '2. Estado de la técnica — Antecedentes, soluciones existentes y brecha',
      '3. Arquitectura de HYDRA — pyhydra, plataforma web y reproducibilidad',
      '4. Metodología — Fuentes de datos; análisis climático y estadístico; modelización',
      '5. Uso práctico de HYDRA — Flujo operativo, herramientas y demostración',
      '6. Casos de estudio y validación — Resultados científicos y transferencia industrial',
      '7. Conclusiones y trabajo futuro — Hipótesis, contribuciones, limitaciones y continuidad',
    ],
  },

  {
    id: 2,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Qué significa el título de la tesis',
    subtitle: 'Cada palabra delimita el objeto real de la investigación',
    estimatedMinutes: 2,
    type: 'split',
    figure: 'foto_cuenca_incertidumbre_climatica.png', figurePosition: 'right',
    figureCaption: 'Cuenca, observación y clima: el sistema físico que la arquitectura debe representar bajo incertidumbre',
    script: 'El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una cadena completa de cálculo. “Automático” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente tareas frágiles. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que representa la variabilidad y la incertidumbre. Esta definición exige además reproducibilidad operativa: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la variable sobre la que se toman decisiones.',
    processSteps:['Entradas trazables','Escenarios plausibles','Modelos físicos','Frecuencia del impacto'],
    notes: 'Cita literal (cap. 1, primer párrafo, antes de la sección de antecedentes): "En esta memoria, el modelo automático de inundación estocástica que recoge el título se entiende en sentido amplio: no como un único motor hidráulico o algoritmo aislado, sino como una arquitectura reproducible de cálculo. Su núcleo central es pyhydra, la librería Python donde se implementan los módulos científicos y técnicos; HYDRA designa la plataforma que integra ese núcleo con web, notebooks, Docker y servicios de apoyo. [...] Es la automatización de esa cadena completa, y no de un componente particular, lo que constituye el objeto central de la investigación. [...] el término reproducible se emplea en un sentido operativo [...] que se concreta en cuatro contratos verificables: entradas trazables, transformaciones reproducibles, salidas en formatos estándar y registro suficiente para auditar cada resultado."\n\nDeliberadamente NO se explica aquí el nombre HYDRA en detalle — solo se menciona que existe una plataforma con nombre propio. La explicación completa del nombre (la metáfora de la hidra mitológica) se reserva para la siguiente diapositiva, junto con el origen y la mención industrial, para no saturar esta diapositiva y dar a cada idea el espacio que merece.',
    bullets: [
      'Modelo: arquitectura completa de cálculo, no un nuevo motor hidráulico.',
      'Automático: ejecución repetible de tareas que manualmente son lentas y frágiles.',
      'Inundación: frecuencia estimada sobre calado y extensión, no heredada directamente de la lluvia.',
      'Estocástica: cientos o miles de combinaciones plausibles de forzamientos, estados y parámetros.',
    ],
  },

  {
    id: 4.5,
    block: 'Motivación', blockColor: '#ef4444',
    title: 'Por qué es necesaria esta tesis',
    subtitle: 'Un riesgo creciente que ya no puede representarse con un único escenario de diseño',
    estimatedMinutes: 2,
    figure: 'foto_inundacion_urbano_industrial.png', figurePosition: 'right',
    figureCaption: 'La inundación afecta simultáneamente a población, movilidad, actividad industrial e infraestructuras críticas',
    type: 'split',
    results: [
      { value:'Exposición', label:'ocupación de llanuras inundables', implication:'más población e infraestructuras situadas en zonas susceptibles' },
      { value:'Clima', label:'ciclo hidrológico más intenso', implication:'los escenarios históricos dejan de representar por sí solos el futuro' },
      { value:'Ciudad', label:'impermeabilización creciente', implication:'respuestas más rápidas y concentradas ante lluvias intensas' },
    ],
    processSteps:['Riesgo creciente','Múltiples forzamientos','Impactos no lineales','Decisiones bajo incertidumbre'],
    script: 'Esta tesis se realiza porque las inundaciones son el riesgo natural con mayor impacto social, económico y territorial, y porque las condiciones que determinan ese riesgo están cambiando. La exposición se acumula en llanuras inundables; el cambio climático intensifica y altera el ciclo hidrológico; y la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman interacciones entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre asociada a la decisión.',
    notes: 'Abrir el problema a escala social antes de hablar de software. La imagen es conceptual y no corresponde a un evento concreto; las evidencias cuantitativas y geográficas aparecerán después en los casos de estudio. Conectar con la siguiente idea: si el riesgo exige múltiples escenarios, el flujo manual deja de ser viable.',
    bullets: [
      'Las inundaciones constituyen el riesgo natural con mayor impacto social, económico y territorial.',
      'Cambio climático, urbanización y exposición hacen insuficiente el escenario único.',
      'La variable decisiva es el impacto hidráulico y su incertidumbre.',
    ],
  },

  {
    id: 4.6,
    block: 'Motivación', blockColor: '#8b5cf6',
    title: 'Qué aporta esta tesis',
    subtitle: 'De metodologías avanzadas pero fragmentadas a una capacidad de ingeniería reproducible',
    estimatedMinutes: 2,
    type: 'normal',
    script: 'La tesis no reivindica como nuevos los métodos estadísticos, los generadores de lluvia ni los modelos hidrológicos e hidráulicos utilizados. Su aportación consiste en hacerlos trabajar dentro de una única arquitectura operativa. Primero, integra extremo a extremo la adquisición de datos, el análisis de extremos, la generación de escenarios, la simulación física y el cálculo de impactos. Segundo, establece reproducibilidad sistemática: cada resultado puede trazarse hasta su fuente, su método y su configuración. Tercero, demuestra transferencia operativa en problemas con escalas y necesidades muy diferentes, sin reconstruir los componentes centrales para cada proyecto. Más adelante presentaré cómo se materializa técnicamente esta arquitectura.',
    notes: 'Esta diapositiva anticipa la respuesta a “¿qué aporta realmente la tesis?” y se recupera al final. No enumerar librerías. Explicar los tres pilares con una frase y un ejemplo: integración — Calle 30; reproducibilidad — Besaya/Valencia; transferencia — Panamá y SIMPCCe.',
    bullets: [
      'Integración: una sola cadena desde el dato hasta el impacto.',
      'Reproducibilidad: resultados auditables por terceros.',
      'Transferencia: nueve aplicaciones reales con un núcleo común.',
    ],
  },

  {
    id: 3,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'El TFM y el artículo que originan esta tesis',
    subtitle: 'Besaya 2017–2018: del primer desarrollo metodológico a una línea de investigación',
    estimatedMinutes: 2,
    figure: 'fig_besaya_cadena_fundacional.svg', figurePosition: 'right',
    figureCaption: 'El TFM construye la cadena y el artículo de la Revista de Obras Públicas consolida el principio Tforzante ≠ Timpacto',
    type: 'split',
    results: [
      { value:'Premio nacional', label:'Mejor Calidad y Contenido', implication:'premio principal del I Concurso Nacional de Proyectos Fin de Máster del Colegio de Caminos' },
      { value:'ROP 3598', label:'publicación del trabajo', implication:'Revista de Obras Públicas · mayo de 2018' },
    ],
    script: 'El punto de partida real de esta tesis es mi Trabajo Fin de Máster, desarrollado en 2017 sobre el río Besaya a su paso por Los Corrales de Buelna. En aquel trabajo construí la primera cadena completa: caracterización multivariante de avenidas, generación de escenarios, simulación hidráulica con Iber y análisis estadístico de los impactos. El TFM recibió el premio principal en la categoría de Mejor Calidad y Contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. El trabajo se publicó después en la Revista de Obras Públicas, número 3598 de mayo de 2018, y consolidó la observación que guía toda la tesis: el período de retorno del forzamiento no coincide necesariamente con el del impacto hidráulico. A partir de esa dificultad concreta —repetir, conectar y auditar una cadena extensa— nace la necesidad de pyhydra y, finalmente, de HYDRA.',
    notes: 'Diapositiva colocada justo después de la explicación del título, y antes del índice: en una defensa con mención industrial, el tribunal espera que estos puntos (origen, mención industrial, nombre) se enuncien pronto y con claridad, no que queden implícitos en el resto de la presentación.\n\nCitas literales de la memoria (cap. 1, "Mención industrial de la memoria" y antecedentes):\n- "El punto de partida de esta tesis se encuentra en trabajos previos de modelado estocástico de inundaciones desarrollados en IHCantabria [...] El caso fundacional de esta línea es el estudio del río Besaya en Los Corrales de Buelna [...] Esta observación —el principio T_forzante ≠ T_impacto— [...] constituye el fundamento metodológico de HYDRA."\n- "Este cambio es relevante para una tesis con mención industrial: el conocimiento no se materializa solo en publicaciones o resultados de caso, sino en una herramienta que puede instalarse, ejecutarse, auditarse y ampliarse."\n- (cap. 9, cierre) "La mención industrial de la tesis no reside únicamente en los resultados de los casos de estudio, sino en que esos mismos resultados son reproducibles por terceros con los mismos datos y la misma infraestructura."\n- (nota al pie, cap. 1) "El nombre evoca a la hidra de la mitología griega: una criatura de múltiples cabezas que actúan de forma coordinada como un único organismo. La analogía refleja la arquitectura modular de la herramienta, cuyos módulos operan de manera autónoma pero integrada dentro de un flujo de cálculo unificado."\n\n⚠️ Precisión importante: la memoria NO nombra una empresa concreta como cotutora formal de la mención industrial — la afiliación industrial declarada es IHCantabria. El carácter industrial se demuestra en la práctica mediante proyectos reales con terceros (Ferrovial/FORESEE en Calle 30, Ministerio de Ambiente de Panamá + BID, Fundación Canal en SIMPCCe), no mediante un convenio formal con una única empresa. No sobrevender este matiz si el tribunal pregunta directamente por la figura de cotutela industrial.',
    bullets: [
      '2017 · TFM: primera implementación completa de la metodología en el río Besaya.',
      '2018 · Revista de Obras Públicas: publicación y consolidación del principio Tforzante ≠ Timpacto.',
      'Problema detectado: una cadena científicamente potente, pero demasiado manual, fragmentada y difícil de reproducir.',
      'Respuesta doctoral: convertir aquella metodología en una arquitectura modular, reproducible y transferible.',
    ],
  },

  {
    id: 5,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Un producto científico y operativo real',
    estimatedMinutes: 1,
    url: '/', anchor: '.hero-stats', highlight: '.hero-stats',
    webMode: 'evidence',
    webLabel: 'Evidencia 1 · Producto transferible',
    webPurpose: 'Demostrar que la aportación se entrega como infraestructura utilizable, no solo como memoria.',
    webAction: 'Mostrar únicamente arquitectura, DOI y acceso a casos. No recorrer el menú completo.',
    figure: 'fig_hydra_web_home.png', figurePosition: 'right',
    figureCaption: 'HYDRA integra documentación, herramientas y casos reproducibles',
    type: 'split',
    script: 'La aportación principal de este trabajo no es solo teórica; se entrega como un ecosistema reproducible completo. Consta de la librería modular de Python "pyhydra" y la plataforma "HYDRA" que permite ejecutar todo el flujo desde el navegador de manera reproducible gracias a la contenedorización Docker.',
    notes: 'Llamar la atención del tribunal sobre la web de fondo (si se usa modo online). Señalar los badges reales.\n\n❓ "¿Esto es reproducible o es solo una demo personal?" → Distinguir la instancia cloud efímera (no citable, solo demostrativa) de las versiones archivadas en Zenodo (navas2026pyhydra, navas2026hydrarepo, v0.1.0) como referencia de reproducibilidad permanente — la propia tesis hace esta distinción explícita (cap. 3, Estructura del paquete).',
    bullets: [
      '📦 pyhydra — Librería modular de Python (14 submódulos en 3 bloques: fuentes de datos, clima, modelización), disponible en GitHub y PyPI',
      '🌐 HYDRA — Entorno web integrado con API en FastAPI, JupyterLab y proxy Nginx',
      '🐳 Docker Stack — 3 servicios coordinados (jupyter, api, web) sobre Python 3.12; despliegue vía GitHub Actions → Azure Container Registry → Azure Container Apps',
      '📄 DOI Zenodo: 10.5281/zenodo.21138151 (Software abierto con licencia MIT)',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 2 — INTRODUCCIÓN Y MOTIVACIÓN
  // ════════════════════════════════════════════════════

  {
    id: 5.5,
    block: 'Motivación', blockColor: '#ef4444',
    title: 'Cómo se estima convencionalmente una inundación',
    subtitle: 'La cadena es correcta; el problema aparece cuando la incertidumbre se pierde entre sus eslabones',
    estimatedMinutes: 2,
    figure: 'fig_cadena_convencional.svg', figurePosition: 'full',
    figureCaption: 'Cadena clásica y tres supuestos que HYDRA permite sustituir por una propagación explícita de escenarios',
    type: 'figure',
    script: 'Antes de presentar la solución, conviene fijar el procedimiento de referencia. Partimos de registros, ajustamos extremos, construimos un evento de diseño, lo transformamos mediante modelos hidrológicos e hidráulicos y obtenemos un mapa de inundación. La cadena física es necesaria y no se pretende reemplazar. La dificultad está en tres simplificaciones frecuentes: asumir estacionariedad, representar el extremo con un único evento y trasladar el mismo período de retorno desde el forzamiento hasta el impacto. HYDRA conserva esta cadena, pero automatiza la exploración de muchos escenarios y lleva la incertidumbre hasta el calado y la extensión inundada.',
    notes: 'Esta diapositiva establece el vocabulario común antes de formular la brecha. Recorrer la figura de izquierda a derecha. Detenerse después en los tres avisos rojos. No presentar HYDRA como sustituto de HEC-RAS, Iber, SFINCS o VIC: es la arquitectura que los conecta con datos y métodos probabilísticos.',
  },

  {
    id: 6,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'El problema científico',
    subtitle: 'Insuficiencia de los métodos clásicos ante el cambio climático',
    estimatedMinutes: 2,
    figure: 'fig_iahr2022_comparativa_es.svg', figurePosition: 'right',
    figureCaption: 'La selección de un único evento de diseño pierde volumen, duración y estado antecedente',
    type: 'split',
    script: 'Los estudios convencionales de inundabilidad utilizan un único evento de diseño (el hidrograma del cuantil T de lluvia). Asumen de forma simplista que el período de retorno de la precipitación equivale al de la inundación. Esto ignora la saturación del suelo, los efectos de confluencias y las dinámicas complejas que determinan el verdadero impacto.',
    notes: 'Explicar por qué es peligroso usar un único evento clásico. Si hay DANA previa, el suelo está saturado, lo que convierte una lluvia media en catástrofe.\n\nEsta idea nace del caso Besaya (2018): fue la primera confirmación física, con modelos Iber, de que T_forzante ≠ T_impacto.',
    mathBlock: `
      <div style="font-family:'JetBrains Mono', monospace; background:rgba(0,0,0,0.3); padding:14px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); margin:10px 0; font-size:15px; color:#93c5fd;">
        T<sub>forzante</sub>(P) &ne; T<sub>impacto</sub>(Q, h)
      </div>
      <p style="font-size:11px; color:#64748b; margin-top:4px;">El período de retorno de la lluvia (P) no es el período de retorno del daño (caudal Q, calado h)</p>
    `,
    bullets: [
      '⚠️ Riesgo global: El riesgo natural más destructivo por pérdidas económicas y vidas humanas.',
      '❌ Premisa errónea: Período de retorno del forzamiento meteorológico ≠ Período de retorno del impacto hidráulico.',
      '🌧️ Sat. antecedente: El estado del suelo determina si una lluvia común genera un caudal extraordinario.',
      '⚙️ Dinámica temporal: La forma del hidrograma y la duración de la tormenta determinan el rebase de diques.',
      '🔄 Flujo manual ineficiente: Descarga, conversión de formatos, modelado y mapas se hacen con herramientas inconexas.',
    ],
  },

  {
    id: 7,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'La hipótesis central',
    type: 'quote',
    estimatedMinutes: 2,
    script: 'La principal barrera para la adopción operativa de metodologías avanzadas de análisis del riesgo de inundación no reside en la ausencia de conocimiento científico, sino en la dificultad de integrarlas dentro de flujos de trabajo eficientes, reproducibles y transferibles a proyectos reales.',
    notes: 'Detenerse aquí. Esta frase resume el por qué de una tesis industrial. El objetivo no es inventar la rueda estadística, sino hacerla rodar de verdad en la industria.',
    bullets: [
      'H1 · Automatizar el flujo completo mejora eficiencia, reproducibilidad y aplicabilidad práctica.',
      'H2 · Integrar análisis estocástico, clima y simulación hidrofísica en una librería modular reduce barreras técnicas.',
      'H3 · Coordinar metodologías avanzadas representa la incertidumbre de forma más consistente que un único escenario de diseño.',
    ],
  },

  {
    id: 8,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'Pregunta de investigación',
    type: 'quote',
    estimatedMinutes: 2,
    script: '¿Es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería?',
    notes: 'Pronunciar despacio: es la formulación literal de la memoria (cap. 1). El foco está en "automatizar de forma reproducible" e "integrando metodologías previamente desarrolladas" — de ahí que la tesis no reivindique algoritmos nuevos, sino su operacionalización conjunta.',
    bullets: [
      'Objetivo general · Desarrollar y validar un marco automático, modular y reproducible para el análisis estocástico de inundaciones.',
      'Integrar datos y modelos de cambio climático en flujos estocásticos de evaluación de inundaciones.',
      'Conectar generación estocástica, análisis probabilístico y motores físicos mediante interfaces reproducibles.',
      'Validar la transferencia del mismo núcleo en nueve casos con escalas, climas y necesidades operativas distintas.',
    ],
  },

  {
    id: 8.5,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'Objetivo general y objetivos específicos',
    subtitle: 'La pregunta se convierte en cuatro compromisos verificables',
    estimatedMinutes: 2,
    type: 'split',
    figure: 'fig_objetivos_evidencias.svg', figurePosition: 'right',
    figureCaption: 'Cada objetivo conduce a un desarrollo concreto y a una evidencia verificable',
    script: 'El objetivo general es desarrollar y validar un marco automático y reproducible para el análisis estocástico de inundaciones bajo incertidumbre hidrológica y climática. Ese objetivo se concreta en cuatro compromisos. Integrar fuentes de datos heterogéneas; encapsular los métodos estadísticos y estocásticos en un núcleo reutilizable; acoplarlos con modelos hidrológicos e hidráulicos sin imponer un único motor; y demostrar su transferencia mediante casos reales de distinta escala. Esta formulación permite que cada parte de la defensa responda a un objetivo y termine en evidencia, no en una mera descripción de herramientas.',
    notes: 'Subrayar que “desarrollar” incluye arquitectura, implementación y validación, no la invención de todos los métodos incorporados. Relacionar OE1-OE4 con los bloques que siguen y recuperar esta estructura en la diapositiva de cierre de hipótesis.',
    bullets: [
      'Objetivo general · Desarrollar y validar un marco automático y reproducible para analizar inundaciones estocásticas bajo incertidumbre hidrológica y climática.',
      'OE1–OE2 · Integrar datos heterogéneos y convertir los métodos científicos en componentes reutilizables.',
      'OE3–OE4 · Acoplar motores físicos y demostrar transferencia mediante casos, resultados e implicaciones de ingeniería.',
    ],
  },

  {
    id: 8.6,
    block: 'Motivación', blockColor: '#6366f1',
    title: 'Estrategia de investigación',
    subtitle: 'Del problema científico a los criterios utilizados para validar la respuesta',
    estimatedMinutes: 2,
    type: 'normal',
    script: 'Una vez formulada la pregunta, la estrategia de investigación se organiza en cuatro decisiones. La primera es representar explícitamente la incertidumbre mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema, no solo sobre la variable de entrada. La segunda es automatizar la cadena completa para evitar rupturas manuales entre datos, métodos y modelos. La tercera es separar sus componentes para que puedan sustituirse o reutilizarse sin reconstruir todo el flujo. La cuarta es validar la propuesta en problemas de distinta escala y con información disponible muy diferente. Consideraremos que la respuesta funciona si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, se adapta a distintos modelos y produce resultados útiles en aplicaciones científicas e industriales.',
    notes: 'Esta diapositiva pertenece todavía a la introducción. No mencionar aquí nombres de paquetes, herramientas o casos. Leer por filas: necesidad → estrategia → criterio de éxito. Los nombres técnicos se presentan más adelante, después del estado de la técnica y de la arquitectura.',
    mathBlock: `
      <div class="traceability-matrix">
        <div class="traceability-head">NECESIDAD</div><div class="traceability-head">ESTRATEGIA</div><div class="traceability-head">CRITERIO DE ÉXITO</div>
        <div class="traceability-goal"><strong>Representar la incertidumbre</strong><span>Un escenario único no describe todas las respuestas posibles</span></div>
        <div class="traceability-build"><strong>Múltiples escenarios plausibles</strong><span>Propagar variabilidad de entradas, estados y parámetros</span></div>
        <div class="traceability-proof"><strong>Frecuencia sobre el impacto</strong><span>Calcularla en caudal, calado, extensión o nivel</span></div>
        <div class="traceability-goal"><strong>Evitar cadenas manuales</strong><span>Los traspasos entre etapas son lentos y difíciles de auditar</span></div>
        <div class="traceability-build"><strong>Automatización completa</strong><span>Conectar datos, análisis, escenarios y modelos físicos</span></div>
        <div class="traceability-proof"><strong>Cálculo repetible</strong><span>Mismas entradas y configuración, mismos resultados</span></div>
        <div class="traceability-goal"><strong>Trabajar con problemas distintos</strong><span>Cambian los datos disponibles, la escala y el modelo físico</span></div>
        <div class="traceability-build"><strong>Arquitectura modular</strong><span>Sustituir componentes sin reconstruir toda la cadena</span></div>
        <div class="traceability-proof"><strong>Adaptación sin perder trazabilidad</strong><span>El método conserva su lógica en contextos diferentes</span></div>
        <div class="traceability-goal"><strong>Demostrar utilidad real</strong><span>La validez no puede limitarse a un ejemplo académico</span></div>
        <div class="traceability-build"><strong>Validación progresiva</strong><span>Contrastar resultados, límites y capacidad de transferencia</span></div>
        <div class="traceability-proof"><strong>Utilidad científica e industrial</strong><span>Resultados interpretables y aplicables a decisiones</span></div>
      </div>`,
    bullets: [
      'La solución será válida si representa la incertidumbre, puede repetirse y funciona en contextos diferentes.',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 3 — ESTADO DEL ARTE Y CRONOLOGÍA
  // ════════════════════════════════════════════════════

  {
    id: 9,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Evolución de la investigación (2017–2026)',
    subtitle: 'De una pregunta hidráulica concreta a un marco reproducible y transferible',
    estimatedMinutes: 2,
    type: 'timeline',
    script: 'La cronología no es una lista de lugares ni de proyectos. Comienza en 2017 con una pregunta nacida en el Trabajo Fin de Máster: cómo calcular la frecuencia sobre el impacto hidráulico y no heredarla directamente del forzamiento. El artículo de 2018 consolida ese principio. Después, la investigación incorpora progresivamente problemas que aquella primera cadena no resolvía: cuencas sin aforo, precipitación espacial, calibración automática de modelos regionales, infraestructuras urbanas críticas, gestión de embalses, eventos sin precedente e incertidumbre entre motores hidráulicos. Esa acumulación de necesidades conduce finalmente a una arquitectura común, documentada y publicable como software reproducible.',
    notes: 'Explicar una evolución científica, no una sucesión de congresos o lugares. El primer hito es el TFM del doctorando. La comunicación de las V JIA es una vía de difusión del trabajo, no el origen conceptual por sí sola.',
    bullets: [
      '2017 — TFM: primera cadena estocástica completa y formulación del problema sobre el impacto.',
      '2018 — Revista de Obras Públicas: Tforzante ≠ Timpacto y frecuencia calculada sobre calados y extensiones.',
      '2019–2020 — Cuencas sin aforo y grandes dominios: precipitación espacial y calibración regional automatizada.',
      '2021–2023 — Generación estocástica espacial: consolidación y distribución del método como software.',
      '2024 — Aplicación industrial: infraestructura urbana crítica y gestión climática de embalses.',
      '2025 — Nuevos límites: eventos sin precedente, niveles lacustres e incertidumbre entre modelos.',
      '2026 — Síntesis: integración, documentación y publicación versionada de la arquitectura.',
    ],
  },

  {
    id: 10,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Posicionamiento y originalidad de HYDRA',
    subtitle: 'Frente a Stan/PyMC/R-INLA, HydroMT y las bases de datos globales de referencia',
    estimatedMinutes: 2,
    type: 'normal',
    script: '"La brecha principal no es la ausencia de métodos aislados, sino la falta de integración operativa entre datos climáticos, análisis estadístico, generación estocástica, modelos físicos y documentación utilizable." Herramientas como Stan, PyMC, R-INLA o extRemes resuelven muy bien la inferencia bayesiana, pero de forma aislada del modelado hidráulico. HYDRA no compite con ellas: las orquesta. De hecho, el patrón de adaptadores de pyhydra está inspirado explícitamente en el proyecto HydroMT, un precedente reconocido en la propia memoria.',
    notes: 'Dejar claro al tribunal: "No hemos reinventado HEC-RAS, ni Stan, ni PyMC: hemos construido el director de orquesta que les permite trabajar juntos de forma reproducible."\n\n❓ "¿Por qué no usar directamente HydroMT o Stan en vez de construir HYDRA?" → La propia tesis argumenta que la fragmentación es la barrera: HydroMT es el precedente reconocido para el patrón de adaptadores, pero no cubre extremo a extremo la cadena estocástica/cópulas/clima (cap. 2, Brecha identificada).',
    bullets: [
      '📊 Inferencia bayesiana aislada: Stan, PyMC, R-INLA, OpenTURNS, extRemes → excelentes en estadística, sin acoplamiento a motores hidráulicos.',
      '🌐 Precedente arquitectónico: HydroMT inspira explícitamente el patrón de adaptadores de pyhydra, pero no cubre la cadena estocástica-cópulas-clima.',
      '🛰️ Fuentes de datos globales: GloFAS, GRDC, SoilGrids, PERSIANN → homogeneizadas y encadenadas automáticamente, no solo descargadas.',
      '📚 Base metodológica citada: Hosking & Wallis (1997, L-momentos/RFA), Rodríguez-Iturbe (1987-88, NSRP), Aas et al. (2009, cópulas vine), Teutschbein & Seibert (2012, bias correction).',
      '🚀 Posicionamiento propio: "Esta tesis no propone nuevos métodos... demuestra que es posible integrar y operacionalizar este conjunto de metodologías dentro de un marco reproducible común."',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 4 — ARQUITECTURA
  // ════════════════════════════════════════════════════

  {
    id: 11,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'La arquitectura del sistema de tres niveles',
    subtitle: 'Nivel científico · Nivel operativo/servicios · Nivel de interfaz',
    estimatedMinutes: 2,
    url: '/', anchor: '#modulos', highlight: '#modulos .grid',
    figure: 'fig_hydra_web_home.png', figurePosition: 'right',
    figureCaption: 'Punto de entrada de la plataforma interactiva',
    type: 'split',
    script: 'El sistema se organiza en tres capas. En la base, la librería pyhydra escrita en Python que encapsula la lógica científica en 14 submódulos. En la capa intermedia, una API REST con FastAPI que expone las operaciones y un contenedor JupyterLab que permite a científicos depurar. En la superficie, la web interactiva Astro/Tailwind, con un catálogo de 26 notebooks generales y 23 entradas de casos piloto.',
    notes: 'Explicar las ventajas del desacoplamiento: si la interfaz cambia, el motor científico (pyhydra) sigue siendo totalmente independiente y utilizable en scripts de terminal.\n\nDependencias en tres niveles: núcleo pip instalable (NumPy, pandas, xarray, dask, scikit-learn, OpenTURNS...), extensiones Docker (PyMC, pyvinecopulib, NEOPRENE, CoSMoS_py, pykrige, lmoments3, hydromt_sfincs, hecdss, pySWATPlus, spotpy), y motores externos (HEC-HMS/RAS, SFINCS, SWAT+).',
    bullets: [
      '🔬 pyhydra (Core Python) → 14 submódulos en 3 bloques (fuentes de datos, clima, modelización). Instalable por pip.',
      '⚡ FastAPI API → Expone analítica compleja para herramientas web.',
      '📓 JupyterLab Workspace → 26 notebooks generales + 23 entradas de casos piloto, sesiones aisladas por usuario.',
      '🎨 Web (Astro) → Frontend modular enfocado en la experiencia de usuario.',
    ],
  },

  {
    id: 12,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'Infraestructura de despliegue industrial',
    subtitle: 'Docker Compose + Nginx Reverse Proxy + CI/CD en Azure',
    estimatedMinutes: 2,
    figure: 'fig_hydra_azure_infraestructura.png', figurePosition: 'full',
    figureCaption: 'Esquema de la infraestructura de contenedores para despliegue local o en Azure ACA',
    type: 'figure',
    script: 'Para garantizar la reproducibilidad y facilidad de despliegue, todo el stack se empaqueta en tres contenedores de Docker coordinados por un proxy Nginx: JupyterLab, la API FastAPI y el frontend web. La integración continua en GitHub Actions construye las imágenes linux/amd64 y las publica en Azure Container Registry, desde donde se despliegan en Azure Container Apps. Esto permite ejecutar la plataforma idénticamente en un portátil local sin conexión a internet, o escalarla en la nube.',
    notes: 'Señalar las partes de la figura de infraestructura. Destacar el volumen compartido de datos `/data` (montado desde Azure Files en producción) que permite a Jupyter y a la API leer las mismas series sin duplicados. Cada usuario recibe una sesión de notebooks aislada mediante una cookie anónima (hydra_jupyter_session), copiando los notebooks a una carpeta de sesión propia — así nadie edita el catálogo compartido.',
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 5 — LOS CUATRO MÓDULOS CIENTÍFICOS
  // ════════════════════════════════════════════════════

  {
    id: 13,
    block: 'Módulos', blockColor: '#0ea5e9',
    title: 'Módulo 1: Fuentes de datos (pyhydra.data_sources)',
    subtitle: 'Descarga automática, homogeneización y control de calidad',
    estimatedMinutes: 3,
    url: '/modules/fuentes-datos',
    type: 'normal',
    script: 'El primer módulo automatiza la descarga y estructuración de datos. Evita la descarga manual de portales inconexos. Se conecta mediante APIs a Copernicus, satélites de la NASA y redes de estaciones locales, devolviendo datos listos en memoria con formato, huso horario (UTC) y proyección (WGS84) estandarizados, junto a metadatos de trazabilidad (fuente, fecha de descarga, parámetros de consulta).',
    notes: 'En modo online: navegar a /modules/fuentes-datos. Mostrar la lista de fuentes soportadas.\nEnfatizar el valor del control de calidad integrado: los códigos de estación OMM compartidos entre OGIMET y Meteostat permiten validación cruzada automática entre fuentes.\n\nDetalle de ingeniería real para el módulo de suelos: `find_usda_soilclass` clasifica texturalmente (USDA) a partir de las fracciones SNDPPT/SLTPPT/CLYPPT de SoilGrids, y `extract_mode_soilclass` agrega por moda entre las 7 profundidades estándar — no es solo "descargar suelos", hay lógica de agregación real detrás.',
    bullets: [
      '🌧️ Precipitación: ERA5 (0.25°, horaria, desde 1940), GPM-IMERG (0.1°, 30 min, desde 2000, hasta 60°N/S), PERSIANN-CCS (~0.04°, horaria, desde 2003).',
      '📈 Caudales fluviales: GloFAS-ERA5 (0.1°, desde 1979, modelo de tránsito H-TESSEL), GRDC, USGS.',
      '🌡️ Cambio Climático: Modelos CMIP6 (ESGF y Copernicus Climate Data Store).',
      '🌱 Suelos: SoilGrids (250 m, archivo estático 2017, 7 profundidades), clasificación textural USDA automática.',
      '📡 Estaciones: Meteostat agrega ~70.000 estaciones globales (NOAA ISD, DWD, AEMET, Environment Canada) con códigos OMM cruzables entre fuentes.',
    ],
  },

  {
    id: 14,
    block: 'Módulos', blockColor: '#0ea5e9',
    title: 'Módulo 2a: Estadística de extremos y GEV',
    subtitle: 'MLE, L-momentos, Bayesiano (PyMC/NUTS) y aproximación de Fisher',
    estimatedMinutes: 3,
    url: '/modules/analisis-climatico',
    figure: 'fig_gev_comparacion.png', figurePosition: 'right',
    figureCaption: 'Comparación empírica de ajustes GEV (Máx. Verosimilitud vs L-Momentos vs Bayesiana)',
    type: 'split',
    script: 'Para calcular caudales o precipitaciones asociadas a períodos de retorno se implementa la función de distribución GEV con cuatro vías de ajuste: MLE (scipy.stats.genextreme), L-momentos (Hosking & Wallis, la opción por defecto con series cortas de menos de 30 años), inferencia bayesiana vía PyMC con muestreador NUTS y parametrización no centrada (4 cadenas de 2.000 muestras), y una aproximación más económica basada en la matriz de información de Fisher. La inferencia bayesiana resulta superior porque no depende puramente de la muestra observada corta y proporciona curvas de credibilidad completas, fundamentales para el diseño bajo incertidumbre. Una clase `HierarchicalGEV` permite además el análisis regional agrupado, con respaldo en PyStan.',
    notes: 'Explicar brevemente la fórmula en pantalla. El caso Valencia 2024 es la demostración más contundente: sin el evento en la serie, MLE estima un período de retorno superior a 11.000 años para la precipitación observada (un valor sin sentido físico); el estimador bayesiano ya lo situaba en ~3.069 años antes del evento, y en 66-91 años al incluirlo.\n\n❓ "¿Por qué NUTS y no Metropolis-Hastings clásico?" → NUTS explora mejor la geometría de la posterior en distribuciones de cola pesada como la GEV, reduciendo autocorrelación entre muestras; la parametrización no centrada evita patologías de "embudo" (funnel) típicas de estos modelos jerárquicos.\n\nPara diagnósticos regionales se usa el estadístico de discordancia y la heterogeneidad H₁ de Hosking-Wallis.',
    mathBlock: `
      <div style="font-family:'JetBrains Mono', monospace; background:rgba(0,0,0,0.3); padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); margin:10px 0; font-size:14px; color:#a5b4fc;">
        F(x; &mu;, &sigma;, &xi;) = exp { - [ 1 + &xi; ( (x - &mu;) / &sigma; ) ]<sup>-1/&xi;</sup> }
      </div>
      <p style="font-size:11px; color:#64748b; margin-top:4px;">Parámetros: &mu; (localización), &sigma; (escala), &xi; (forma)</p>
    `,
    bullets: [
      '🎯 MLE (scipy.stats.genextreme): Rápido pero sensible a valores extremos aislados (outliers).',
      '📐 L-Momentos (Hosking & Wallis): Opción por defecto con n < 30 años, evita problemas de no convergencia numérica.',
      '🔵 Bayesiano (PyMC + NUTS, 4 cadenas × 2.000 muestras, parametrización no centrada): estabilidad ante eventos históricos extraordinarios y bandas de credibilidad formales.',
      '⚡ Aproximación de Fisher: alternativa gaussiana-asintótica de bajo coste computacional.',
      '🗺️ HierarchicalGEV: agrupación regional con respaldo en PyStan; diagnóstico vía discordancia y H₁ de Hosking-Wallis.',
    ],
  },

  {
    id: 15,
    block: 'Módulos', blockColor: '#0ea5e9',
    title: 'Módulo 2b: Cópulas multivariantes y extremos conjuntos',
    subtitle: 'Familias Gaussiana/Gumbel/Clayton/Frank y extensión Vine',
    estimatedMinutes: 3,
    url: '/tools/copulas',
    figure: 'fig_copula_joint_ret.png', figurePosition: 'right',
    figureCaption: 'Período de retorno conjunto (AND en rojo, OR en azul) para confluencias fluviales costeras',
    type: 'split',
    script: 'El riesgo real a menudo surge de la combinación de eventos (e.g. lluvia intensa simultánea con nivel alto de marea). pyhydra incorpora cópulas Gaussianas (pico-duración-volumen) y Gumbel/Clayton/Frank para eventos compuestos como oleaje y lluvia, parametrizadas mediante la tau de Kendall. Esto permite calcular el período de retorno conjunto AND y OR, y localizar el Evento de Diseño Más Probable (MPDE) como el máximo de la densidad conjunta sobre la isolínea de un período de retorno dado, siguiendo la formulación de Salvadori y De Michele.',
    notes: 'Explicar las cópulas implementadas: Gaussiana, Gumbel, Clayton, Frank. Las cópulas permiten separar las marginales (distribuciones de cada variable) de su estructura de dependencia.\n\nDato de impacto (extensión vine-cópula sobre Besaya, Urrea 2026): un vine flexible logra un AIC mediano de -5,04 frente a 3,91 de la cópula gaussiana con agrupación regional, y un RMSE de cola superior de 0,11 frente a 0,30. Para un período de retorno conjunto de 100 años, el nivel crítico de Kendall pasa de τ=0,778 (gaussiana) a τ=0,993 (vine), lo que implica una tormenta de diseño un 36% más intensa (63,45 mm frente a 46,49 mm) — una diferencia de diseño nada trivial. Un emulador basado en Procesos Gaussianos con kernel racional cuadrático reduce el coste de calcular la función de distribución conjunta (JCDF) en un 94%, con un error medio absoluto de 9,25·10⁻⁴.',
    bullets: [
      '🔗 Familias implementadas: Gaussiana (FloodEventCopula, pico-duración-volumen) y Gumbel/Clayton/Frank (BivariateCopula, eventos compuestos), parametrizadas vía τ de Kendall.',
      '📊 T_OR: probabilidad de que al menos una variable exceda el umbral (diseño conservador).',
      '📊 T_AND: probabilidad de excedencia simultánea (crítico en confluencias fluviales).',
      '📍 MPDE: máximo de la densidad conjunta sobre la isolínea del período de retorno de diseño (Salvadori & De Michele).',
      '🚀 Extensión vine (Besaya): AIC -5,04 vs 3,91 gaussiano; tormenta de diseño un 36% más intensa a T=100 años.',
    ],
  },

  {
    id: 16,
    block: 'Módulos', blockColor: '#0ea5e9',
    title: 'Módulo 3: Generación estocástica (pyhydra.climate)',
    subtitle: 'NSRP/STNSRP espacial y CoSMoS temporal estacional',
    estimatedMinutes: 2,
    url: '/modules/generacion-estocastica',
    figure: 'fig_mallorca_reconstruccion_lluvia.png', figurePosition: 'right',
    figureCaption: 'Reconstrucción espacial de precipitación: del generador al campo de forzamiento',
    type: 'split',
    script: 'El módulo estocástico permite crear ensembles de series meteorológicas coherentes en espacio y tiempo. El generador espacial NSRP (proceso de pulsos rectangulares de Neyman-Scott, Rodríguez-Iturbe 1987-88) se calibra para reproducir la media, la varianza, la probabilidad de día seco, la autocorrelación de orden 1 y el coeficiente de variación de la serie observada, con una versión multisitio (STNSRP) para campos espacialmente coherentes. El generador temporal CoSMoS (Papalexiou 2018) ajusta por separado la distribución marginal y la estructura de autocorrelación estacional, y las combina para simular series manteniendo ambas propiedades y la estacionalidad simultáneamente.',
    notes: 'Explicar la diferencia:\n- NSRPModel (puntual) vs STNSRPModel (multisitio): se calibran con datos minutales u horarios para modelar celdas de tormenta espaciales.\n- CoSMoS: fit_distribution + fit_acs calibran marginal y autocorrelación por separado; analyze_ts encadena ambos; simulate_ts/generate_ts producen las realizaciones finales.\n\nLa reducción del ensemble se apoya en MaxDiss (Camus 2011): maximiza iterativamente la distancia mínima entre escenarios seleccionados. La reconstrucción de los eventos no simulados usa un k-NN implementado en FloodMapInterpolator, y la clasificación de formas de hidrograma se apoya en PCA + k-means (HydrographClassifier).',
    bullets: [
      '🌧️ NSRP / STNSRP (Rodríguez-Iturbe 1987-88): calibrado sobre media, varianza, prob. de día seco, autocorrelación lag-1 y coeficiente de variación.',
      '📈 CoSMoS (Papalexiou 2018): ajuste independiente de marginal (fit_distribution) y autocorrelación estacional (fit_acs), combinados en analyze_ts/simulate_ts.',
      '🔵 MaxDiss (Camus 2011): maximiza iterativamente la distancia mínima entre escenarios seleccionados de un ensemble de N realizaciones.',
      '🔄 Reconstrucción k-NN (FloodMapInterpolator) y clasificación de hidrogramas vía PCA + k-means (HydrographClassifier).',
    ],
  },

  {
    id: 17,
    block: 'Módulos', blockColor: '#0ea5e9',
    title: 'Módulo 4: Modelización y acoplamiento (pyhydra.modeling)',
    subtitle: 'Patrón adaptador para HEC-HMS, SWAT+, SFINCS y HEC-RAS',
    estimatedMinutes: 2,
    url: '/modules/modelizacion',
    figure: 'fig_m30_metodologia_auditorio.svg', figurePosition: 'right',
    figureCaption: 'Calle 30: acoplamiento reproducible desde precipitación hasta impacto',
    type: 'split',
    script: 'El último bloque actúa como puente con los modelos numéricos de ingeniería mediante un patrón de adaptador con cuatro responsabilidades fijas: preparar las entradas en formato nativo, ejecutar el motor vía API, controlador o subproceso con registro de versión y código de salida, leer las salidas (DSS, HDF, NetCDF, GeoTIFF o texto) en estructuras comunes, y validar la finalización y la plausibilidad física de los resultados. La calibración de HEC-HMS, por ejemplo, edita el fichero .basin como factores multiplicativos envueltos en una clase spotpy que ejecuta el algoritmo SCE-UA (evolución compleja mezclada).',
    notes: 'En modo online: navegar a /modules/modelizacion. Explicar el concepto de patrón adaptador: permite acoplar nuevos modelos sin alterar la estadística extrema.\n\nHonestidad científica: Iber, usado en Besaya y Mallorca, NO tiene adaptador — carece de API programable para ejecución por lotes, a diferencia de HEC-RAS y SFINCS. Es una limitación reconocida explícitamente, buen contraste si el tribunal pregunta por la cobertura real de automatización.',
    bullets: [
      '🏔️ HEC-HMS (Lluvia-Escorrentía): calibración automática vía spotpy + SCE-UA sobre el fichero .basin (factores multiplicativos), con NSE/PBIAS/RMSE configurable.',
      '🌱 SWAT+ (Simulación continua): escritura automática de ficheros climáticos (.pcp/.tmp o pcp.cli/tmp.cli) y lectura de salidas channel_sd.',
      '🌊 SFINCS (Hidráulico 2D ultra-rápido): motor ideal para simulación Monte Carlo de miles de escenarios.',
      '🏙️ HEC-RAS 1D/2D: generación automática de geometría y suavizado de caudales (create_flow_series, máximo móvil centrado).',
      '⚠️ Límite honesto: Iber (Besaya, Mallorca) no tiene adaptador — sin API de ejecución por lotes.',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 6 — DEMOSTRACIONES EN VIVO
  // ════════════════════════════════════════════════════

  {
    id: 18,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Herramientas interactivas en la nube',
    subtitle: 'Acceso democratizado al motor pyhydra',
    estimatedMinutes: 1,
    url: '/', anchor: '#herramientas', highlight: '#herramientas .grid',
    type: 'normal',
    script: 'Para transferir el conocimiento a usuarios que no programan, HYDRA incorpora herramientas interactivas conectadas con la API y con el núcleo pyhydra. En la defensa no recorreré el catálogo: utilizaré una única demostración, el ajuste estadístico ligado al caso Valencia, para probar que el motor científico es accesible, reproducible y operativo. El resto de herramientas queda como material de apoyo para las preguntas del tribunal.',
    notes: 'No navegar por la cuadrícula de herramientas. Esta diapositiva explica la estrategia: una demo principal (estadística/Valencia) y el resto como reserva. Si el tribunal pregunta por generación estocástica, sensibilidad, RFA, interpolación o sesgo, abrir entonces la herramienta correspondiente.',
    bullets: [
      '🎲 Simulación estocástica CoSMoS en 3 pasos',
      '📊 Estimación de GEV bayesiana y curvas de retorno',
      '🔗 Cópulas compuestas y curvas AND/OR en confluencias',
      '🧭 Una demostración principal; el resto, preparado como material de reserva para preguntas',
    ],
  },

  {
    id: 19,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Estimación Bayesiana en la web',
    subtitle: 'Ajuste interactivo y bandas de credibilidad',
    estimatedMinutes: 2,
    url: '/tools/statistical',
    webMode: 'demo',
    webLabel: 'Evidencia 2 · Motor científico operativo',
    webPurpose: 'Enseñar una sola cadena científica completa, conectada con el caso Valencia.',
    webAction: 'Ejecutar un ajuste preparado y señalar resultado, incertidumbre y trazabilidad. Máximo 3 minutos.',
    type: 'normal',
    script: 'Demostración de ajuste bayesiano. Subiremos una serie diaria, seleccionaremos un umbral POT para identificar extremos e iniciaremos la estimación. La herramienta mostrará las bandas de credibilidad bayesianas comparadas con los límites paramétricos de MLE.',
    notes: 'Si la API está disponible, subir serie diaria y ajustar. Resaltar la banda de credibilidad (el área sombreada). Si no hay internet, explicar que el componente está listo en localhost.',
    bullets: [
      '→ Selección de datos y extracción de máximos anuales o POT.',
      '→ Ajuste numérico instantáneo de MLE y L-Momentos.',
      '→ Inferencia bayesiana mediante MCMC (cadenas de Markov).',
      '→ Visualización interactiva de la incertidumbre en el cuantil de diseño.',
    ],
  },

  {
    id: 20,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Generador estocástico CoSMoS',
    subtitle: 'Ensemble multidecadal estacional',
    estimatedMinutes: 2,
    url: '/tools/stochastic',
    type: 'normal',
    backup: true,
    script: 'Demostración del generador CoSMoS. A partir de una serie temporal corta, CoSMoS calibra la autocorrelación mensual y la asimetría para generar 100 series sintéticas plausibles. Cada serie conserva los estadísticos del registro real pero introduce variabilidad climática natural.',
    notes: 'Mostrar el gráfico del ensemble sintético en la herramienta. Explicar cómo esto alimenta el análisis Monte Carlo.',
    bullets: [
      '→ Calibración mensual estacional automática.',
      '→ Simulación de trayectorias independientes con semilla fija (reproducibilidad).',
      '→ Conservación de media, desviación estándar, sesgo y correlación temporal.',
    ],
  },

  {
    id: 21,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Sensibilidad de Manning',
    subtitle: 'El ensemble Monte Carlo en vivo detrás de la bifurcación de Besaya',
    estimatedMinutes: 1,
    url: '/tools/sensitivity',
    type: 'normal',
    backup: true,
    script: 'Esta herramienta reproduce en vivo el experimento numérico del caso Besaya: variar los coeficientes de Manning por clase de uso de suelo y observar cómo se propaga esa incertidumbre a calado y área inundada.',
    notes: 'Es la contraparte interactiva de la diapositiva de Besaya y de la página /cases/manning-rugosidades: aquí el tribunal ve el propio ensemble, no solo el resultado ya calculado.',
    bullets: [
      '→ Distribuciones de Manning por clase de uso de suelo (Normal/Log-Normal/Gamma).',
      '→ Diagramas de dispersión Manning n vs. calado/área en tiempo real.',
      '→ Misma base numérica que sustenta el <2% de varianza explicada citado en Besaya.',
    ],
  },

  {
    id: 22,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Curvas IDF clásicas',
    subtitle: 'El método convencional que IAHR 2022 demostró insuficiente',
    estimatedMinutes: 1,
    url: '/tools/idf',
    type: 'normal',
    backup: true,
    script: 'Esta herramienta construye curvas Intensidad-Duración-Frecuencia con el método clásico de único pico de lluvia, el mismo enfoque que el estudio IAHR 2022 comparó contra la cadena estocástica completa.',
    notes: 'Buen contraste visual: mostrar cómo el método clásico colapsa toda la tormenta en una única curva IDF, sin representar volumen ni saturación antecedente — la causa física de la subestimación del 30-37% ya presentada.',
    bullets: [
      '→ Ajuste IDF clásico por estación y período de retorno.',
      '→ Mismo insumo (extremos GEV) que alimenta el pipeline estocástico completo.',
      '→ Referencia visual directa para el resultado cuantitativo de IAHR 2022.',
    ],
  },

  {
    id: 23,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Análisis Regional de Frecuencia',
    subtitle: 'La técnica que situó Valencia en periodos de retorno millonarios antes de la DANA',
    estimatedMinutes: 1,
    url: '/tools/rfa',
    type: 'normal',
    backup: true,
    script: 'El Análisis Regional de Frecuencia agrupa estaciones para estabilizar la estimación de cuantiles extremos. Es la misma técnica que, con 224 estaciones, situaba el periodo de retorno del evento de Turís en 7,5 millones de años antes de incorporar la DANA de 2024.',
    notes: 'Mostrar la curva de crecimiento regional q(T) y cómo se combina con el índice de avenida local. Conecta directamente con la nota de la diapositiva de Valencia sobre el RFA de 224 estaciones.',
    bullets: [
      '→ Curva de crecimiento regional q(T) y factor de índice de avenida.',
      '→ Discordancia y heterogeneidad H₁ de Hosking-Wallis en vivo.',
      '→ Misma familia de métodos que el análisis local de Valencia (8337X, Turís).',
    ],
  },

  {
    id: 24,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Interpolación espacial (Kriging)',
    subtitle: 'El motor de relleno de vacíos de Andes y Mallorca',
    estimatedMinutes: 1,
    url: '/tools/interpolation',
    type: 'normal',
    backup: true,
    script: 'Esta herramienta interpola variables climáticas a malla regular por kriging universal, el mismo procedimiento que rellenó los vacíos instrumentales amazónicos en el caso andino y reconstruyó los campos de precipitación en Mallorca.',
    notes: 'Si el tribunal pregunta por la baja correlación cruzada del caso andino (ρ=0,42), esta herramienta permite mostrar en vivo cómo varía la calidad de la interpolación con la densidad de estaciones disponibles.',
    bullets: [
      '→ Kriging universal con covariable de elevación (DEM) configurable.',
      '→ Validación cruzada en vivo (RMSE, sesgo medio).',
      '→ Mismo motor citado en Andes (ρ=0,42) y en la reconstrucción espacial de Mallorca.',
    ],
  },

  {
    id: 25,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Corrección de sesgo climático',
    subtitle: 'QDM/SDM en vivo — la pieza reutilizada en Panamá, Andes, SIMPCCe e IAHR 2022',
    estimatedMinutes: 1,
    url: '/tools/bias',
    type: 'normal',
    backup: true,
    script: 'Esta herramienta corrige el sesgo sistemático de un modelo climático frente a la observación mediante Quantile Delta Mapping y Scaled Distribution Mapping. Es el mismo módulo, sin ninguna modificación, que se reutilizó en las 414 combinaciones del Atlas de Panamá, en SIMPCCe y en el caso andino.',
    notes: 'Ilustra directamente la hipótesis H2 (modularidad): mismo código, cuatro casos de estudio distintos, cero cambios en el núcleo.',
    bullets: [
      '→ Comparación de funciones de distribución acumulada antes/después de corregir.',
      '→ Métodos QDM y SDM seleccionables en vivo.',
      '→ Evidencia visual directa de H2: un único módulo, reutilizado sin modificar.',
    ],
  },

  {
    id: 26,
    block: 'Demo en vivo', blockColor: '#10b981',
    title: '🔴 DEMO: Eventos compuestos',
    subtitle: 'Cópulas Gumbel/Clayton/Frank y el Evento de Diseño Más Probable (MPDE)',
    estimatedMinutes: 1,
    url: '/tools/compound',
    type: 'normal',
    backup: true,
    script: 'Cerramos el bloque de demos con la herramienta de eventos compuestos: selección de familia de cópula, cálculo de los períodos de retorno conjuntos AND/OR y localización del MPDE sobre la isolínea de diseño, tal y como se explicó en el módulo de cópulas.',
    notes: 'Es la contraparte interactiva de la diapositiva de cópulas (Módulo 2b). Mostrar cómo cambia la isolínea de diseño y el punto MPDE al variar la familia de cópula o la tau de Kendall.',
    bullets: [
      '→ Familias Gumbel, Clayton y Frank seleccionables en vivo.',
      '→ Curvas T_AND / T_OR recalculadas al variar la dependencia.',
      '→ Localización del MPDE sobre la isolínea del período de retorno de diseño.',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 7 — CASOS PILOTO Y VALIDACIÓN CIENTÍFICA
  // ════════════════════════════════════════════════════

  {
    id: 27,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Los casos cuentan una evolución, no un catálogo',
    subtitle: 'Del principio científico a una arquitectura transferible',
    estimatedMinutes: 2,
    type: 'table',
    script: 'Los nueve casos no son nueve nombres para memorizar, sino cuatro etapas de validación. Primero, una cuenca fluvial permite formular que la frecuencia debe calcularse sobre el impacto. Segundo, una cuenca sin aforo y una infraestructura urbana crítica obligan a completar la cadena desde la lluvia espacial hasta el calado. Tercero, una comparación metodológica y un evento sin precedente aportan evidencia cuantitativa sobre el error y la incertidumbre. Cuarto, aplicaciones climáticas, regionales y nacionales prueban que la arquitectura puede transferirse y escalar. Solo después de explicar cada necesidad introduciré el nombre del caso que la documenta.',
    notes: 'Presentar los casos por la pregunta que resuelven. El nombre geográfico se menciona después, como referencia: 1) frecuencia sobre el impacto — Besaya; 2) cadena completa — Mallorca y Calle 30; 3) evidencia cuantitativa y respuesta — IAHR y Valencia; 4) transferencia y escala — Andes, Tanganica, SIMPCCe y Panamá. La web se abre solo en tres momentos y siempre con una pregunta científica explícita.',
    bullets: [
      'Frecuencia sobre el impacto · cuenca fluvial cantábrica (Besaya).',
      'Cadena en cuenca sin aforo · precipitación espacial y modelización 2D (Mallorca).',
      'Infraestructura urbana crítica · de la lluvia multisitio al calado en túneles (Madrid Calle 30).',
      'Evento sin precedente · inferencia extrema e incertidumbre actualizada (DANA de 2024).',
      'Niveles lacustres con registros limitados · clima, caudal y cotas futuras (lago Tanganica).',
      'Calibración hidrológica regional · transformación lluvia–caudal a gran escala (Andes).',
      'Automatización nacional · cientos de combinaciones climáticas y capas de riesgo (Panamá).',
      'Gestión climática de embalses · caudales mínimos y apoyo a decisiones (SIMPCCe).',
      'Contraste cuantitativo · método convencional frente a cadena estocástica completa.',
    ],
  },

  {
    id: 28,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Besaya: del caso fundacional a la sensibilidad hidráulica',
    subtitle: 'Dos trabajos sobre el mismo dominio que no deben confundirse',
    estimatedMinutes: 3,
    url: '/cases/manning-rugosidades', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'besaya_fig05_hydraulic_bifurcation_es.svg', figurePosition: 'right',
    figureCaption: 'El collado topográfico a cota 60,1 m s.n.m. controla la activación del compartimento secundario',
    secondaryFigure: 'besaya_fig02_mc_boxplots_es.png',
    secondaryFigureCaption: 'El ensemble revela la dispersión de calado y área que una única simulación ocultaría',
    caseReference: 'Referencia · Memoria doctoral, cap. 8 (Besaya) · manuscrito enviado a Environmental Modelling & Software',
    type: 'split',
    results: [
      { value:'1.990', label:'simulaciones hidráulicas 2D', implication:'995 realizaciones emparejadas en HEC-RAS y SFINCS' },
      { value:'7,4 ha', label:'compartimento secundario activado', implication:'bifurcación asociada al umbral topográfico de 60,1 m' },
      { value:'8,4 %', label:'CV del área en HEC-RAS', implication:'frente al 2,0 % obtenido con SFINCS' },
    ],
    pyhydraRole:'Convierte un ensemble de parámetros y dos motores hidráulicos en una comparación probabilística trazable del impacto.',
    pyhydraModules:['pyhydra.modeling','pyhydra.modeling.hydraulic','HEC-RAS 2D','SFINCS'],
    processSteps:['Manning Monte Carlo','HEC-RAS 2D + SFINCS','Comparación emparejada','Distribuciones de impacto'],
    script: 'Conviene separar dos etapas del Besaya. El trabajo fundacional de 2018 partió de aforos y utilizó Iber para trasladar la frecuencia desde los hidrogramas hacia los calados. Años después, sobre el mismo dominio, se estudió la incertidumbre estructural mediante 995 simulaciones emparejadas de SFINCS y HEC-RAS 2D, variando la rugosidad de Manning en nueve usos de suelo. Esta segunda etapa reveló una respuesta bimodal en HEC-RAS y un compartimento secundario de unas 7,4 hectáreas asociado a un collado a cota 60,1 metros. La correlación entre motores fue solo moderada: 0,52 en calado y 0,49 en área. El mensaje no es que este sea el origen de la metodología, sino que el dominio fundacional se convirtió también en banco de pruebas para automatización y sensibilidad hidráulica.',
    notes: 'Hito Besaya clave:\n- La bifurcación bimodal de HEC-RAS es indetectable con una simulación determinista convencional.\n- Sesgo entre modelos: HEC-RAS da +0,172 m de calado y +0,149 km² de área frente a SFINCS.\n- Este caso dio pie al estudio de sensibilidad Manning (navas2025roughness) que fundamenta toda la comparativa.\n\nEn modo online: navegar a /cases/manning-rugosidades, la página real y publicada de este estudio (1.000 combinaciones Monte Carlo, 9 clases de uso de suelo, Mezcla Gaussiana de 2 componentes). Los hallazgos clave de la sección resaltada son estos mismos números.',
    bullets: [
      '📐 Enfoque Monte Carlo: 995 simulaciones hidráulicas emparejadas sobre 9 usos de suelo (Manning).',
      '⚖️ Incertidumbre: Variabilidad inter-modelo (motores) > Variabilidad intra-modelo (rugosidad, <2% de la varianza).',
      '🔀 Bifurcación: un collado a cota 60,1 m s.n.m. controla la conexión con una llanura secundaria de unas 7,4 ha.',
      '📊 Respuesta bimodal: HEC-RAS muestra saltos discretos (sesgo +0,172 m, r=0,52) no capturados por SFINCS.',
    ],
  },

  {
    id: 29,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Besaya 2018: aquí nace la frecuencia sobre el impacto',
    subtitle: 'Aforos → eventos multivariantes → Iber → distribución de calados',
    estimatedMinutes: 1,
    url: '/cases/los-corrales-buelna', anchor: '#case-workflow-heading', highlight: '#case-workflow-heading',
    webMode: 'evidence',
    webLabel: 'Evidencia 2 · Reproducibilidad',
    webPurpose: 'Mostrar el origen conceptual de la cadena estocástica basada en impactos.',
    webAction: 'Señalar el flujo fundacional y distinguirlo expresamente del estudio posterior de rugosidades.',
    figure: 'fig_besaya_cadena_fundacional.svg', figurePosition: 'right',
    figureCaption: 'Cadena fundacional documentada en la memoria: el retorno se estima sobre el resultado hidráulico',
    caseReference: 'Referencia · TFM (2017) · Revista de Obras Públicas 3598 (2018) · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'3 variables', label:'pico, volumen y duración', implication:'dos avenidas con el mismo pico pueden causar impactos distintos' },
      { value:'Iber', label:'motor hidráulico de 2018', implication:'empleado manualmente, sin adaptador por lotes en pyhydra' },
      { value:'T(calado)', label:'frecuencia sobre el impacto', implication:'no se hereda directamente del caudal pico' },
    ],
    pyhydraRole:'Formaliza después los bloques repetibles que este trabajo reveló como necesarios: eventos, dependencia, modelos y postproceso.',
    pyhydraModules:['pyhydra.climate','pyhydra.climate.time_series','cópulas','Iber'],
    processSteps:['Aforos','Qp + V + duración','Cópula gaussiana','Hidrogramas','Iber → T(calado)'],
    script: 'Este es el origen conceptual de la tesis. A partir de series de aforo se extraen avenidas independientes y cada una se describe mediante pico, volumen y duración. Una cópula gaussiana conserva la dependencia entre esas variables y permite generar hidrogramas plausibles. En la aplicación de 2018, Iber transforma esos hidrogramas en manchas y calados. Solo entonces se estima el período de retorno sobre la variable de impacto. pyhydra no existía todavía con su arquitectura actual: surge precisamente de la necesidad de repetir y conectar estas etapas de forma consistente.',
    notes: 'Momento de navegación: mostrar el flujo conceptual del caso. Ser transparente: la aplicación de 2018 usó Iber manualmente; los notebooks internos y el estudio HEC-RAS/SFINCS aportan evidencia posterior, pero no deben presentarse como una sola campaña.',
    bullets: [
      'Los datos de partida son caudales observados, no precipitación.',
      'La dependencia conjunta se modela entre caudal pico, volumen y duración.',
      'Iber fue el motor de la publicación fundacional de 2018.',
      'El estudio HEC-RAS/SFINCS pertenece a una etapa posterior de sensibilidad sobre el mismo dominio.',
    ],
  },

  {
    id: 30,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Mallorca: Downscaling híbrido en cuencas torrenciales',
    subtitle: 'Sant Llorenç des Cardassar (Episodio de octubre 2018)',
    estimatedMinutes: 2,
    url: '/cases/mallorca-sant-llorenc', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_mallorca_comparativa.png', figurePosition: 'right',
    figureCaption: 'Calados en Sant Llorenç: Metodología clásica (izquierda) vs Enfoque Estocástico Completo (derecha)',
    secondaryFigure: 'fig_mallorca_reconstruccion_lluvia.png',
    secondaryFigureCaption: 'Reconstrucción espacial de la lluvia que alimenta los escenarios hidráulicos',
    caseReference: 'Referencia · Caso Sant Llorenç (2019) · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'Miles', label:'de tormentas sintéticas', implication:'amplían registros horarios cortos' },
      { value:'k = 6', label:'vecinos óptimos para reconstrucción', implication:'calados y velocidades no simulados' },
      { value:'Impacto', label:'frecuencia calculada sobre calado', implication:'mancha distinta a la metodología basada en lluvia' },
    ],
    pyhydraRole:'Une lluvia sintética, interpolación espacial, simulación física y reconstrucción de impactos en una cuenca sin aforos.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','pyhydra.climate.spatial_analysis','Iber 2D'],
    processSteps:['Lluvia observada','Cópulas + kriging','MaxDiss + Iber 2D','k-NN','T sobre calado'],
    script: 'El 9 de octubre de 2018 cayeron cerca de 220 L/m² en pocas horas en una cuenca sin estaciones de aforo, con la extensión de Copernicus como única referencia de validación. Se aplicó el downscaling híbrido: clasificación de 25 formas de hietograma histórico mediante PCA y k-means, acoplamiento de máximos, duración y tipo de tormenta entre pluviómetros vía cópula gaussiana, y reconstrucción espacial por kriging a 25 m. La hidrología se resolvió en una malla de 25 m y la hidráulica en una malla de 8 m derivada de LiDAR (Iber), calibrada contra la extensión de Copernicus, alcanzando un calado máximo simulado de 5,85 m en el núcleo urbano.',
    notes: 'Explicar la figura: la imagen de la derecha muestra calados variables y mayor dispersión del flujo en calles secundarias que el modelo determinista clásico (izquierda) ignoraba por completo. Los eventos no simulados se reconstruyen con k-NN de 6 vecinos, eligiendo k por minimización del error sobre los últimos 10 eventos simulados.\n\nEn modo online: navegar a /cases/mallorca-sant-llorenc. Es un caso de 2019, anterior a pyhydra — la página lo marca honestamente como "documentado" (sin notebooks ejecutables) en vez de fingir reproducibilidad que no existe.',
    bullets: [
      '🛰️ Sin aforo: validación frente a la extensión Copernicus y a marcas documentadas del episodio.',
      '🧮 Clasificación PCA + k-means: 25 formas representativas de hietograma histórico.',
      '🔗 Cópula gaussiana: acopla máximo, media, duración y tipo de tormenta entre pluviómetros.',
      '🗺️ Doble malla: hidrología a 25 m, hidráulica a 8 m (LiDAR, Iber) — calado máximo simulado 5,85 m.',
    ],
  },

  {
    id: 31,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Calle 30, Madrid: Infraestructura crítica urbana',
    subtitle: 'Túneles de la M-30 · Pipeline E2E completo · Proyecto FORESEE (Ferrovial)',
    estimatedMinutes: 3,
    figure: 'fig_m30_metodologia_auditorio.svg', figurePosition: 'right',
    figureCaption: 'Cadena Calle 30: lluvia multisitio → HEC-HMS → selección MaxDiss → HEC-RAS 1D → reconstrucción k-NN',
    secondaryFigure: 'fig_m30_localizacion.png',
    secondaryFigureCaption: 'Ámbito de la infraestructura urbana y red de túneles analizada',
    caseReference: 'Referencia · Navas et al., Ingeniería del Agua (2024) · proyecto FORESEE/Ferrovial · memoria, cap. 8',
    type: 'split',
    results: [
      { value:'1D', label:'modelo hidráulico HEC-RAS', implication:'representa la red de túneles de Calle 30' },
      { value:'Miles', label:'eventos sintéticos multisitio', implication:'MaxDiss selecciona un subconjunto representativo' },
      { value:'Mapa T', label:'período de retorno por píxel', implication:'la frecuencia se calcula sobre el calado' },
    ],
    pyhydraRole:'Orquesta la cadena lluvia–caudal–hidráulica y permite asignar frecuencia directamente al calado en la red de túneles.',
    pyhydraModules:['pyhydra.climate','pyhydra.modeling','HEC-HMS','HEC-RAS 1D','MaxDiss + k-NN'],
    processSteps:['Lluvia multisitio','Cópulas','Selección inicial','HEC-HMS','MaxDiss + HEC-RAS 1D','k-NN → T(calado)'],
    script: 'Calle 30 es la cadena metodológica más completa de los casos aplicados. A partir de ERA5 y pluviómetros AEMET, pyhydra ajusta extremos de precipitación multiduración y genera miles de eventos sintéticos multisitio mediante cópulas gaussianas. Primero se toma un subconjunto de eventos para ejecutar HEC-HMS y convertir la lluvia en hidrogramas. Después, MaxDiss actúa sobre esos hidrogramas y selecciona el subconjunto hidráulicamente representativo que se simula en HEC-RAS 1D. Para los escenarios no simulados, k-NN reconstruye los calados. El producto final no es un retorno heredado de la lluvia, sino un mapa de período de retorno del calado para cada píxel.',
    notes: 'La memoria no documenta en este capítulo un número fijo de colectores, un tamaño exacto del subconjunto ni un RMSE único. No citar 18, 1.000→50, 95% o 0,038 m como resultados de la tesis. La evidencia defendible es: miles de eventos multisitio, selección representativa, HEC-HMS, HEC-RAS 1D, reconstrucción k-NN y mapas de período de retorno del calado.\n\nValor industrial: la aplicación aborda una infraestructura crítica y encadena automáticamente lluvia, hidrología, hidráulica y postproceso con trazabilidad.',
    bullets: [
      '🌧️ Multisitio: Precipitación espacialmente correlacionada (cópulas gaussianas) en los distritos de Madrid.',
      '📐 Cadena física: HEC-HMS genera los caudales de entrada y HEC-RAS 1D modela la red de túneles.',
      '🔵 Eficiencia computacional: MaxDiss evita simular exhaustivamente los miles de eventos sintéticos.',
      '🔄 Reconstrucción: k-NN estima los calados de los escenarios no simulados explícitamente.',
      '🤝 Transferencia industrial directa: caso desarrollado con Ferrovial dentro del proyecto FORESEE.',
    ],
  },

  {
    id: 32,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Calle 30 en HYDRA: hallazgos clave en la web',
    subtitle: 'Del forzamiento meteorológico al período de retorno del calado',
    estimatedMinutes: 1,
    url: '/cases/m30-manzanares', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    webMode: 'evidence',
    webLabel: 'Evidencia 3 · Transferencia industrial',
    webPurpose: 'Cerrar el argumento mostrando un caso aplicado con Ferrovial y resultados auditables.',
    webAction: 'Señalar HEC-RAS 1D, la selección MaxDiss, la reconstrucción k-NN y el mapa final de período de retorno del calado.',
    type: 'split',
    figure: 'foto_tunel_infraestructura_critica.png', figurePosition: 'right',
    figureCaption: 'La variable relevante para la operación no es solo la lluvia: es la cota alcanzada dentro de una infraestructura crítica',
    caseReference: 'Referencia · Navas et al., Ingeniería del Agua (2024) · proyecto FORESEE/Ferrovial',
    results: [
      { value:'HEC-RAS 1D', label:'modelo de la red de túneles', implication:'no es una simulación hidráulica 2D' },
      { value:'MaxDiss + k-NN', label:'selección y reconstrucción', implication:'hacen viable explorar miles de eventos' },
      { value:'T(calado)', label:'resultado de diseño', implication:'frecuencia del impacto, no solo de la lluvia' },
    ],
    pyhydraRole:'Hace navegable y repetible el flujo completo del caso, desde la precipitación multisitio hasta el mapa de impacto.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','pyhydra.modeling','MaxDiss + k-NN'],
    script: 'La ficha web permite auditar la cadena completa de Calle 30. Lo esencial es distinguir los dos modelos: HEC-HMS transforma la precipitación multisitio en caudales y HEC-RAS 1D calcula los calados a lo largo de la red canalizada y de túneles. MaxDiss selecciona los escenarios que se simulan explícitamente y k-NN reconstruye el resto. Así se obtiene la frecuencia sobre el calado hidráulico, que es la variable de impacto relevante para el diseño.',
    notes: 'Momento de navegación en vivo en /cases/m30-manzanares. Resaltar la cadena lluvia → HEC-HMS → HEC-RAS 1D → k-NN y el cálculo final del período de retorno del calado.',
    bullets: [
      '📄 Hallazgos clave publicados en la propia web, no solo en la memoria.',
      '🔗 Referencias del caso enlazadas: navas2024calle30 y el proyecto FORESEE.',
      '🗂️ El flujo completo (precipitación → HEC-HMS → HEC-RAS 1D → k-NN) es navegable paso a paso.',
      '🏢 Página pensada para un ingeniero de Ferrovial que quiera auditar el caso sin acceso a la memoria completa.',
    ],
  },

  {
    id: 33,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Valencia: Análisis rápido ante la DANA del 2024',
    subtitle: 'Inferencia bayesiana con eventos sin precedente histórico',
    estimatedMinutes: 3,
    figure: 'fig_valencia_curvas_retorno.png', figurePosition: 'right',
    figureCaption: 'Curva de retorno en la estación de Turís (8337X): El cuantil T100 bayesiano salta un 266% al incluir la DANA',
    secondaryFigure: 'fig_valencia_return_levels_8337X_clean.png',
    secondaryFigureCaption: 'Comparación de niveles de retorno antes y después de incorporar el evento de 2024',
    caseReference: 'Referencia · VIII Jornadas de Ingeniería del Agua (2025) · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'710,8 mm', label:'precipitación en 24 h', implication:'récord observado en Turís' },
      { value:'+266 %', label:'cambio del cuantil T100', implication:'de 260 a 952 mm al incorporar la DANA' },
      { value:'66–91 años', label:'retorno estimado tras el evento', implication:'frente a miles de años antes de incorporarlo' },
    ],
    pyhydraRole:'Permite recalcular rápidamente extremos e incertidumbre cuando entra en la serie un evento sin precedente histórico.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate.time_series','PyMC','análisis regional'],
    processSteps:['224 estaciones','Máximos anuales','GEV: 3 estimadores','RFA local/global','Antes ↔ después'],
    script: 'La DANA de Valencia del 29 de octubre de 2024 dejó 710,8 mm en 24 horas en la estación de Turís, un récord nacional. Al aplicar el ajuste clásico (MLE) sin el evento en la serie, el período de retorno estimado para esa precipitación supera los 11.000 años; un valor sin sentido práctico que evidencia la inestabilidad del método ante outliers históricos. El estimador bayesiano implementado en HYDRA asimiló el evento de manera consistente, recalculando el cuantil T100 de diseño (de 260 mm a 952 mm, un salto del 266%) e incrementando realistamente las bandas de incertidumbre operacional.',
    notes: 'Resaltar la figura de Valencia: la línea verde (bayesiana con DANA) es estable y el área verde muestra la incertidumbre calculada de manera formal. MLE (máxima verosimilitud clásica) colapsa ante outliers tan severos.\n\nDato adicional de contraste: el análisis regional de frecuencia (RFA) con 224 estaciones (30 AEMET, 41 SIAR, 153 AVAMET) es aún más extremo a escala local (9 estaciones): antes de la DANA, el período de retorno del evento llegaba a 7,5 millones de años — un valor sin ningún sentido físico que ilustra la fragilidad de la extrapolación clásica ante muestras cortas.',
    bullets: [
      '⚠️ Valencia (29-Oct-2024): 710,8 mm en 24h en Turís (8337X), récord nacional sin precedentes instrumentales.',
      '⚡ Respuesta rápida: Curvas de retorno generadas en pocas horas mediante pyhydra.',
      '📈 Salto de diseño: El cuantil T100 bayesiano pasa de 260 mm a 952 mm (+266%) al incluir la DANA.',
      '📊 MLE clásico vs Bayesiano: Sin la DANA, MLE situaba el período de retorno del evento en >11.000 años; el bayesiano ya lo estimaba en ~3.069 años.',
      '🗺️ RFA (224 estaciones): el análisis local pre-DANA llega a periodos de retorno de hasta 7,5 millones de años.',
    ],
  },

  {
    id: 34,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Valencia en HYDRA: los números reales del caso',
    subtitle: 'La ficha del caso, trazable hasta el notebook que calculó cada cifra',
    estimatedMinutes: 1,
    url: '/cases/valencia-dana', anchor: '#case-stats', highlight: '#case-stats',
    webMode: 'evidence',
    webLabel: 'Evidencia 4 · Trazabilidad y respuesta rápida',
    webPurpose: 'Mostrar que las cifras de Valencia están vinculadas a datos, métodos y notebooks reproducibles.',
    webAction: 'Señalar 710,8 mm, el cambio de T100 y el enlace al notebook; no abandonar la sección de resultados.',
    figure: 'fig_valencia_return_levels_8337X_clean.png', figurePosition: 'right',
    figureCaption: 'Niveles de retorno de Turís y cambio de incertidumbre tras incorporar la DANA',
    caseReference: 'Referencia · VIII Jornadas de Ingeniería del Agua (2025) · notebook reproducible del caso Valencia',
    type: 'split',
    results: [
      { value:'224', label:'estaciones analizadas', implication:'30 AEMET · 41 SIAR · 153 AVAMET' },
      { value:'34–41 años', label:'retorno RFA local', implication:'estimación estable con 9 estaciones próximas' },
      { value:'3 métodos', label:'GEV comparados', implication:'MLE · L-momentos · Bayesiano' },
    ],
    pyhydraRole:'Mantiene una cadena única y auditable para comparar métodos, escalas regionales y resultados antes/después de la DANA.',
    pyhydraModules:['pyhydra.climate.time_series','pyhydra.climate.spatial_analysis','PyMC','notebook trazable'],
    script: 'La cabecera de esta ficha resume en cifras lo que acabamos de ver: los mismos números —710,8 mm, el salto del cuantil T100— están publicados aquí, trazables hasta el notebook que los calculó.',
    notes: 'Momento de navegación en vivo en /cases/valencia-dana. Resaltar la fila de estadísticas de la cabecera. El tercer notebook del caso (migración a pyhydra/PyMC) ya aparece en el flujo de trabajo de la página.',
    bullets: [
      '🔢 Cifras publicadas directamente desde el análisis reproducible, no copiadas a mano.',
      '📓 Trazabilidad completa hasta pilot_cases/valencia_dana/03_real_regional_study_pyhydra.ipynb.',
      '🆕 Tercer notebook añadido tras la migración a pyhydra/PyMC: contrasta el resultado contra las tablas históricas de Stan.',
      '⏱️ De la DANA (29-Oct-2024) a esta ficha publicada: el mismo margen de horas que se reivindica como aportación en el capítulo 8.',
    ],
  },

  {
    id: 35,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Lago Tanganica: niveles de diseño con registros limitados',
    subtitle: 'De variables climáticas a caudal, nivel del lago y extremos futuros',
    estimatedMinutes: 2,
    url: '/cases/lago-tanganica', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_tanganika_variaciones_nivel.png', figurePosition: 'right',
    figureCaption: 'Cambio del nivel extremo para T5-T500, cuatro horizontes y los escenarios SSP2-4.5 y SSP5-8.5',
    secondaryFigure: 'fig_tanganika_proyecciones.png',
    secondaryFigureCaption: 'Proyecciones climáticas que alimentan la estimación de niveles futuros',
    caseReference: 'Referencia · VIII Jornadas de Ingeniería del Agua (2025) · manuscrito enviado a Ingeniería del Agua',
    type: 'split',
    results: [
      { value:'R² > 0,85', label:'AdaBoost en validación cruzada', implication:'R² = 0,96 sobre el conjunto completo' },
      { value:'770,19 m', label:'nivel bootstrap para T100', implication:'frente a 771,55-771,76 m con GEV/Weibull' },
      { value:'> 0,9 m', label:'máximo incremento proyectado', implication:'2041-2060 y retornos cortos T5-T10' },
    ],
    pyhydraRole:'Encadena fuentes globales, señal climática y una relación caudal-nivel no lineal para estimar cotas de diseño donde la altimetría observada es corta.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','AdaBoost','CMIP6 + Hydroweb'],
    processSteps:['ERA5 → AdaBoost','Caudal → N(Q)','CMIP6 + delta','Bootstrap N(Q)','Extremos de nivel'],
    script: 'El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. El mayor incremento futuro supera 0,9 m en 2041-2060 para T5-T10; a finales de siglo queda por debajo de 0,6 m para T100-T500.',
    notes: 'No presentar el caso como una hidráulica 2D ni como un simple modelo de machine learning. AdaBoost solo resuelve clima → caudal. La pieza física-estadística clave es la relación no lineal N(Q), construida con tres clusters. El bootstrap representa la incertidumbre de N(Q). Las proyecciones se evalúan en cuatro horizontes: 2021-2040, 2041-2060, 2061-2080 y 2081-2100.\n\nEl caso valida la cadena climática de HYDRA en un sistema lacustre con escasa instrumentación: ERA5/CMIP6, método delta, bootstrap y extremos no paramétricos.',
    bullets: [
      'AdaBoost estima caudales mensuales a partir de ERA5; no estima directamente los niveles extremos.',
      'La función N(Q), separada en tres regímenes por K-means, transforma caudal en nivel del lago.',
      'El bootstrap remuestrea residuos de N(Q) y los percentiles de máximos anuales determinan los cambios de nivel.',
      'Las anomalías de cuatro horizontes CMIP6 se aplican sobre los niveles históricos obtenidos con la altimetría Hydroweb 1992-2023.',
    ],
  },

  {
    id: 36,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Andes: calibración hidrológica automatizada a gran escala',
    subtitle: 'De campos climáticos incompletos a caudales futuros en cuatro países',
    estimatedMinutes: 2,
    url: '/cases/andes-hidroelectrico', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_andes_caudales_cc.png', figurePosition: 'right',
    figureCaption: 'Influencia proyectada del cambio climático en el caudal mensual de Colombia, Bolivia, Perú y Ecuador (RCP4.5/8.5, tres horizontes)',
    caseReference: 'Referencia · Estudios hidroeléctricos andinos · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'SPOTPY', label:'calibración automática', implication:'PSO, DREAM y SCE-UA para evitar ajustes manuales cuenca a cuenca' },
      { value:'> 200', label:'subcuencas procesadas', implication:'transformación regional de lluvia y clima en caudal' },
      { value:'> +40 %', label:'caudal mensual proyectado', implication:'meses húmedos de Perú y Ecuador al final de siglo' },
    ],
    pyhydraRole:'Generaliza la experiencia andina: automatizar el ciclo parámetros-modelo-evaluación con SPOTPY para convertir clima en caudal de forma repetible.',
    pyhydraModules:['pyhydra.climate','pyhydra.modeling','SPOTPY','VIC','clima → caudal'],
    processSteps:['Campos climáticos','SPOTPY calibra','VIC lluvia → caudal','21 CMIP5','Caudal regional'],
    script: 'La aportación decisiva del caso andino fue hacer viable la modelización hidrológica a gran escala. En Bolivia, Colombia, Ecuador y Perú no bastaba con obtener proyecciones climáticas: había que reconstruir campos de precipitación y temperatura, calibrar modelos sobre numerosas cuencas y transformar cada escenario de lluvia en series de caudal. Los vacíos amazónicos se completaron con precipitación satelital e interpolación por kriging universal; después, la calibración automática se organizó con SPOTPY, utilizando algoritmos PSO, DREAM y SCE-UA. Esto evitó el ajuste manual cuenca a cuenca y permitió ejecutar de forma homogénea el modelo distribuido VIC sobre más de 200 subcuencas. Una vez calibrada la cadena lluvia-caudal, se propagaron 21 modelos CMIP5, dos escenarios RCP y tres horizontes temporales. El resultado científico incluye aumentos mensuales superiores al 40 por ciento en Perú y Ecuador, pero la contribución tecnológica que conecta este caso con la tesis es la automatización del ciclo completo de calibración y simulación regional.',
    notes: 'Distinguir dos niveles. En el estudio andino, SPOTPY permitió automatizar la calibración de los modelos hidrológicos a escala regional. Esa experiencia informó posteriormente el módulo de calibración automática de HMSModel en HYDRA, que expone la misma interfaz SPOTPY. No afirmar que el caso andino utilizó HEC-HMS: el motor del caso fue VIC.\n\nLa estación de referencia CachEsperanz obtuvo NSE=0,65 y PBIAS=14,17%. La interpolación climática tuvo ρ=0,42, RMSE=10,47 mm y sesgo medio del 8%, limitaciones documentadas por la baja cobertura amazónica.',
    bullets: [
      'La escala territorial hizo inviable la calibración manual de los modelos hidrológicos.',
      'SPOTPY automatizó la búsqueda de parámetros mediante PSO, DREAM y SCE-UA.',
      'VIC transformó los campos de precipitación y temperatura en caudales para más de 200 subcuencas.',
      'La experiencia se trasladó después a la interfaz de calibración automática de los adaptadores de HYDRA.',
    ],
  },

  {
    id: 37,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Atlas de Panamá: automatización a escala nacional',
    subtitle: 'Ministerio de Ambiente + BID · 52 cuencas en ambas vertientes',
    estimatedMinutes: 2,
    url: '/cases/atlas-panama', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_panama_precipitacion.png', figurePosition: 'right',
    figureCaption: 'Precipitación media por subcuencas, obtenida mediante el flujo nacional de descarga, control de calidad e interpolación espacial',
    caseReference: 'Referencia · Atlas Nacional de Riesgo de Inundación de Panamá · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'52', label:'cuencas con capas de inundación', implication:'escala nacional y tres períodos de retorno' },
      { value:'414', label:'correcciones de sesgo', implication:'23 modelos · 2 SSP · 6 variables · 3 períodos' },
      { value:'1.464', label:'puntos costeros analizados', implication:'52 escenarios de nivel de agua total' },
    ],
    pyhydraRole:'Escala la misma arquitectura desde una cuenca piloto hasta un encargo nacional con cientos de combinaciones climáticas.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','NEOPRENE','SFINCS'],
    processSteps:['73 estaciones','NEOPRENE + kriging','414 correcciones','LEM + SFINCS','Capas de riesgo'],
    script: 'Encargado por el Ministerio de Ambiente de Panamá y el BID, este es el caso de mayor escala del catálogo: 52 cuencas de hasta 13.400 km² en ambas vertientes, más 1.464 puntos costeros analizados frente a inundación costera y viento extremo sobre el área metropolitana. NEOPRENE/STNSRP rellenó 73 estaciones nacionales (1950-2022), y el kriging universal generó una malla de 1 km. Sobre esta base se corrigieron automáticamente 414 combinaciones de sesgo (23 modelos CMIP6 × 2 escenarios SSP × 6 variables × 3 horizontes) mediante QDM y SDM, alimentando el modelo hidrológico LEM (NS=0,87) y ejecuciones masivas de SFINCS nacional, con modelos 2D de alta resolución en el área metropolitana.',
    notes: 'Citado como navas2024ihcantabria/ihcantabria2023panama. Es el ejemplo explícito de la memoria para la hipótesis H1: automatización que hace viable un estudio regional antes inabordable de forma manual.\n\n❓ "¿Cómo se garantiza la trazabilidad de 414 combinaciones sin supervisión manual?" → El patrón adaptador (Módulo 4) registra versión, código de salida y validación de rangos por cada combinación ejecutada — la automatización no elimina la auditoría, la sistematiza.\n\nEn modo online: navegar a /cases/atlas-panama, con enlace directo al atlas interactivo público del Ministerio de Ambiente.',
    bullets: [
      '🌎 52 cuencas (hasta 13.400 km²) en ambas vertientes de Panamá, encargo del Ministerio de Ambiente y el BID.',
      '📡 NEOPRENE/STNSRP rellena 73 estaciones nacionales (1950-2022); kriging universal a malla de 1 km.',
      '🔁 414 combinaciones de corrección de sesgo (23 modelos CMIP6 × 2 SSP × 6 variables × 3 horizontes).',
      '💧 Modelo hidrológico LEM (NS=0,87) + SFINCS nacional y 2D de alta resolución en el área metropolitana.',
      '🌊 1.464 puntos costeros analizados en ambas costas frente a inundación costera.',
    ],
  },

  {
    id: 38,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'SIMPCCe: caudales mínimos de embalses ante el cambio climático',
    subtitle: 'Herramienta nacional para la red de embalses española · Fundación Canal',
    estimatedMinutes: 2,
    url: '/cases/simpcce', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_simpcce_interfaz.png', figurePosition: 'right',
    figureCaption: 'Interfaz de entrenamiento y validación de la red neuronal de SIMPCCe',
    secondaryFigure: 'fig_simpcce_resultados.png',
    secondaryFigureCaption: 'Resultados de aportaciones y caudales mínimos bajo escenarios climáticos',
    caseReference: 'Referencia · Navas et al., Ingeniería del Agua (2025) · proyecto SIMPCCe · Fundación Botín',
    type: 'split',
    results: [
      { value:'60', label:'series corregidas por variable', implication:'10 modelos · 2 RCP · 3 horizontes' },
      { value:'20', label:'realizaciones futuras por punto', implication:'aplicables a la red hídrica nacional' },
      { value:'Premio 2023', label:'Talento Joven “M.R. Llamas”', implication:'Fundación Botín · candidatura colectiva por la guía metodológica que enmarca SIMPCCe' },
    ],
    pyhydraRole:'Transforma proyecciones climáticas en aportaciones y fichas de decisión para cualquier punto de la red hídrica española.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','SDM','red neuronal'],
    processSteps:['SPAIN02 + SIMPA','PCA 95 %','ANN de aportaciones','SDM climático','Sequía y fiabilidad'],
    script: 'SIMPCCe es una herramienta de ámbito nacional, aplicable a cualquier punto de la red hidrográfica española, desarrollada según la guía metodológica para estimar aportaciones mínimas a embalses bajo cambio climático. En 2023, el Observatorio del Agua de la Fundación Botín concedió a esa guía el Premio al Talento Joven “M.R. Llamas” mediante la candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave. SIMPCCe operacionaliza ese marco: descarga SPAIN02, SIMPA-CEDEX y 10 modelos CORDEX-AEMET; entrena una red neuronal sobre las componentes principales de precipitación y temperatura; corrige el sesgo climático y genera simulaciones futuras e informes automáticos de sequía y fiabilidad.',
    notes: 'El proyecto recibió el Premio al Talento Joven M.R. Llamas (Fundación Botín, Observatorio del Agua). Citas: navas2023simpce (VII JIA 2023), navas2024iahrsimpcce (IAHR Europe 2024), navas2025simpce (Ingeniería del Agua, 2025).\n\n❓ "¿Por qué una red neuronal y no un modelo físico distribuido?" → Coste computacional: SIMPCCe necesita reentrenarse rápidamente para cualquier cuenca española, algo inviable con un modelo físico distribuido calibrado caso a caso.\n\nNota interna: el capítulo 8 (metodología detallada) describe una red neuronal (ANN); el capítulo 9 la menciona de pasada junto a SWAT en el resumen de conclusiones. Ante una pregunta directa, remitirse a la metodología del capítulo 8 como referencia autorizada.\n\nResultado principal: el cambio climático reduce las aportaciones medias anuales en la mayoría de cuencas españolas, y los mínimos de estiaje caen incluso donde la precipitación media no muestra cambio significativo — la severidad y duración de la sequía hidrológica aumenta en ambos escenarios.\n\nEn modo online: navegar a /cases/simpcce, con enlace directo a la publicación DOI en Ingeniería del Agua (2025).',
    bullets: [
      '🏞️ Herramienta nacional aplicable a cualquier punto de la red hidrográfica española (guía metodológica Fundación Canal).',
      '🤖 Red neuronal (ANN) sobre componentes principales (95% varianza) de precipitación y temperatura distribuidas.',
      '🔁 10 modelos CORDEX-AEMET × RCP4.5/8.5 × 3 horizontes → 60 series corregidas por variable (SDM).',
      '📉 Los caudales mínimos de estiaje caen incluso donde la precipitación media no muestra cambio significativo.',
      '🏆 Premio al Talento Joven “M.R. Llamas” 2023: candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave por la guía metodológica que enmarca SIMPCCe.',
    ],
  },

  {
    id: 39,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'IAHR 2022: Evidencia cuantitativa de la hipótesis H3',
    subtitle: 'Estudio comparativo: Método convencional (IDF) vs Enfoque Estocástico',
    estimatedMinutes: 2,
    figure: 'fig_iahr2022_comparativa_es.svg', figurePosition: 'right',
    figureCaption: 'Subestimación del caudal de diseño convencional frente al estocástico',
    caseReference: 'Referencia · 39th IAHR World Congress, Granada (2022) · memoria doctoral, cap. 8',
    type: 'split',
    results: [
      { value:'+30–37 %', label:'caudal de diseño estocástico', implication:'superior al método IDF en todos los escenarios' },
      { value:'10.000 años', label:'serie sintética', implication:'200 casos seleccionados para simulación Iber' },
      { value:'No lineal', label:'respuesta espacial', implication:'no existe un factor simple para corregir el método clásico' },
    ],
    pyhydraRole:'Demuestra por qué la frecuencia debe propagarse por toda la cadena y evaluarse sobre el impacto, no heredarse de la lluvia.',
    pyhydraModules:['pyhydra.climate','pyhydra.climate.bias_correction','cópulas','MaxDiss + k-NN','Iber'],
    processSteps:['EURO-CORDEX','Sesgo + cópulas','10.000 años','MaxDiss + Iber','IDF ↔ estocástico'],
    script: 'El artículo presentado en el 39º Congreso Mundial IAHR (Granada, 2022) aporta la prueba numérica de la hipótesis H3. Con 15 modelos EURO-CORDEX bajo RCP4.5/8.5 y corrección de sesgo por quantile-mapping, se generaron 10.000 años sintéticos de precipitación sobre la cuenca del Besaya; 200 casos se seleccionaron mediante MaxDiss para simulación completa no estacionaria en Iber, y el resto se reconstruyó por k-NN. El método convencional (curvas IDF con único pico de lluvia) subestima los caudales de diseño entre un 30% y un 37% de forma sistemática frente al pipeline estocástico completo, en todos los períodos de retorno, escenarios y horizontes analizados —por ejemplo, 208,8 m³/s frente a 278,5 m³/s para T100 en el horizonte 2011-2040 bajo RCP4.5.',
    notes: 'Punto crítico: la subestimación del método tradicional (30-37%) es mayor que la dispersión intermodelo de los escenarios de cambio climático RCP4.5 vs RCP8.5. Esto prueba que la metodología de cálculo tiene más impacto en el riesgo que la propia incertidumbre climática futura.\n\nMatiz adicional para profundizar: la diferencia de calado inundado NO es proporcional a la diferencia de caudal — no existe un factor de corrección uniforme aplicable a posteriori, lo que refuerza que la simulación estocástica completa no puede sustituirse por un simple factor de mayoración sobre el método clásico.',
    bullets: [
      '📊 Resultados numéricos: Subestimación sistemática del caudal máximo de diseño (30-37%), p.ej. 208,8 vs 278,5 m³/s a T100 (RCP4.5, 2011-2040).',
      '🎲 10.000 años sintéticos generados; 200 casos seleccionados por MaxDiss para simulación completa en Iber, resto por k-NN.',
      '🌱 Causa física: El método convencional no captura el volumen ni la saturación antecedente de la cuenca.',
      '⚖️ Impacto en diseño: la diferencia de calado no es proporcional a la de caudal — no existe un factor de corrección uniforme válido.',
    ],
  },

  {
    id: 39.5,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Qué demuestra el conjunto de casos',
    subtitle: 'La modelación estocástica es el hilo que conecta datos, clima, física e impacto',
    estimatedMinutes: 2,
    type: 'normal',
    results: [
      { value:'Tforzante ≠ Timpacto', label:'principio metodológico', implication:'la frecuencia debe calcularse sobre la respuesta hidráulica' },
      { value:'9 casos', label:'transferencia demostrada', implication:'distintas escalas, climas, motores y contextos institucionales' },
      { value:'1 arquitectura', label:'núcleo reutilizable', implication:'los módulos centrales no se reescriben para cada aplicación' },
    ],
    pyhydraRole:'Convierte métodos probabilísticos y motores físicos dispersos en una cadena auditable que conserva la incertidumbre hasta la variable de impacto.',
    pyhydraModules:['datos trazables','extremos y clima','escenarios estocásticos','modelos físicos','impacto y frecuencia'],
    script: 'Al reunir los casos aparece con claridad el argumento central de la tesis. La modelación estocástica no es una herramienta aislada que se añade al final del cálculo. Es el principio que obliga a representar múltiples forzamientos plausibles, propagarlos por la hidrología y la hidráulica, y estimar la frecuencia sobre la variable que realmente condiciona la decisión: el caudal, el calado, la extensión inundada o el nivel del lago. Los casos abarcan más asuntos que la generación estocástica —datos globales, cambio climático, inferencia bayesiana, aprendizaje automático o automatización de motores— porque todos son necesarios para que ese análisis probabilístico pueda funcionar en problemas reales. pyhydra aporta el núcleo común y HYDRA hace visible, reproducible y transferible la cadena completa.',
    notes: 'Esta es la diapositiva de síntesis del bloque. Hacer una pausa antes de pasar a las hipótesis. No enumerar otra vez los nueve casos: responder a “¿qué aprendemos de todos ellos juntos?”.',
    bullets: [
      'La lluvia de diseño es una entrada; el riesgo se decide con la distribución del impacto.',
      'Cada caso activa herramientas diferentes porque la cadena física y los datos disponibles también son diferentes.',
      'La aportación común es mantener trazabilidad e incertidumbre desde la fuente hasta el resultado de ingeniería.',
    ],
  },

  {
    id: 39.6,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: 'Producción científica asociada a la tesis',
    subtitle: 'La validación externa acompaña la evolución desde el método hasta la herramienta',
    estimatedMinutes: 2,
    type: 'normal',
    results: [
      { value:'2 artículos', label:'propios de la tesis y publicados', implication:'Calle 30 (2024) · SIMPCCe (2025), Ingeniería del Agua' },
      { value:'2 enviados', label:'manuscritos en evaluación', implication:'Tanganica, Ingeniería del Agua · rugosidades, Environmental Modelling & Software' },
      { value:'5 comunicaciones', label:'presentadas entre 2023 y 2025', implication:'VII JIA · HIC 2024 · InterJIA 2024 · dos trabajos en VIII JIA' },
      { value:'2 DOI', label:'software científico publicado', implication:'pyhydra e HYDRA preservados y versionados en Zenodo' },
    ],
    script: 'La producción científica debe distinguir resultados publicados, comunicaciones y trabajos actualmente enviados. Hay dos artículos publicados en Ingeniería del Agua: la aplicación de Calle 30, en 2024, y SIMPCCe, en 2025. La investigación también se ha presentado en cinco comunicaciones: SIMPCCe en las séptimas Jornadas de Ingeniería del Agua de 2023 y en Hydroinformatics 2024, HYDRA en InterJIA 2024, y los trabajos de Valencia y del lago Tanganica en las octavas Jornadas de Ingeniería del Agua de 2025. Además, se han enviado dos manuscritos: “Proyección de niveles extremos del lago Tanganica bajo cambio climático en una cuenca poco instrumentada” a Ingeniería del Agua, y el estudio de incertidumbre de rugosidad y estructura de modelo a Environmental Modelling & Software. Finalmente, pyhydra e HYDRA cuentan con versiones publicadas y citables en Zenodo.',
    notes: 'Mantener con precisión el estado editorial. Calle 30 y SIMPCCe están publicados. Tanganica y rugosidades están enviados y en evaluación; no presentarlos como aceptados ni publicados. El DAD aportado registra los dos artículos y tres comunicaciones hasta 2024. La actualización incorpora las dos comunicaciones de VIII JIA 2025 y los dos envíos indicados por el doctorando.',
    bullets: [
      'Infraestructura urbana · cadena estocástica completa con transformación lluvia–caudal y modelización 1D.',
      'Gestión de embalses · transferencia de clima, corrección de sesgo y emulación de caudales mínimos.',
      'Eventos y niveles extremos · incertidumbre, datos globales y respuesta ante problemas recientes.',
      'Sensibilidad hidráulica · automatización masiva para revelar incertidumbre entre motores.',
    ],
  },

  {
    id: 39.7,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: 'Una línea de investigación consolidada entre 2017 y 2026',
    subtitle: 'Artículos, congresos, informe técnico y software con una contribución doctoral identificable',
    estimatedMinutes: 2,
    type: 'split',
    figure: 'fig_trayectoria_cientifica.svg', figurePosition: 'right',
    figureCaption: 'Del TFM del Besaya a la publicación versionada de pyhydra e HYDRA',
    results: [
      { value:'7 trabajos', label:'liderados como primer autor', implication:'desde V JIA 2017 hasta Tanganica y el manuscrito Besaya 2025' },
      { value:'4 trabajos', label:'en coautoría o como segundo autor', implication:'calibración regional · software estocástico · downscaling · extremos' },
      { value:'2017–2026', label:'continuidad de la investigación', implication:'del concepto inicial a la publicación de pyhydra e HYDRA' },
    ],
    script: 'Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución. Soy primer autor en siete trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los trabajos andinos contribuí a la calibración automática y al procesamiento climático; en NEOPRENE, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en Valencia, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. Finalmente, pyhydra e HYDRA condensan esa trayectoria en dos productos de software científico diseñados, desarrollados y documentados como parte de la tesis.',
    notes: 'Esta diapositiva responde preventivamente a dos preguntas: qué resultados pertenecen al doctorando y cómo se relacionan las publicaciones previas con la contribución doctoral. No atribuirse el trabajo Vine cópulas/GPR de 2026: la memoria lo cita como línea de extensión sin autoría del doctorando.',
    bullets: [
      'Primer autor · concepto, metodología, automatización, análisis y redacción en los trabajos liderados.',
      'Coautoría · aportaciones delimitadas en calibración, software, generación estocástica y extremos.',
      'Software · diseño, desarrollo, documentación y publicación de pyhydra e HYDRA.',
      'Resultado conjunto · una trayectoria científica que desemboca en una infraestructura industrial reproducible.',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 8 — CONCLUSIONES Y COMPILACIÓN DE HIPÓTESIS
  // ════════════════════════════════════════════════════

  {
    id: 40,
    block: 'Validación', blockColor: '#8b5cf6',
    title: 'Las hipótesis se cierran con evidencia acumulada',
    subtitle: 'Eficiencia, modularidad y representación consistente de la incertidumbre',
    estimatedMinutes: 3,
    type: 'normal',
    script: 'Las hipótesis no se verifican con una única cifra ni con una demostración de software. Se cierran mediante evidencia acumulada. La primera queda respaldada por campañas que encadenan cientos o miles de ejecuciones sin intervención manual, tanto en una infraestructura urbana como en un atlas nacional. La segunda se apoya en la reutilización de los mismos bloques de datos, clima y modelización en problemas de escala y finalidad muy diferentes. La tercera es cuantitativa: la comparación con el procedimiento convencional muestra una subestimación del 30 al 37 por ciento en los caudales de diseño, y el análisis de un evento sin precedente evidencia la mayor estabilidad de la inferencia bayesiana. El resultado no es eliminar la incertidumbre, sino representarla, propagarla y auditarla de forma más consistente.',
    notes: 'Explicar primero la evidencia y solo después citar el caso que la documenta: H1 — infraestructura urbana y atlas nacional; H2 — gestión de embalses, escala regional y clima; H3 — comparación metodológica y evento sin precedente.',
    bullets: [
      'H1 · Automatización viable: una cadena extensa puede ejecutarse y auditarse sin intervención manual entre etapas.',
      'H2 · Arquitectura reutilizable: los mismos bloques resuelven problemas climáticos, regionales, urbanos y nacionales.',
      'H3 · Incertidumbre mejor representada: −30–37 % frente al método convencional y mayor estabilidad ante un evento extraordinario.',
    ],
  },

  {
    id: 41,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'La contribución original: hacer operativa la ciencia existente',
    subtitle: 'Integración extremo a extremo, reproducibilidad sistemática y transferencia demostrada',
    estimatedMinutes: 3,
    type: 'normal',
    script: 'La memoria estratifica sus aportaciones en tres niveles, precisamente para responder a la pregunta de qué hay de nuevo. Primero, las metodologías incorporadas: NEOPRENE/CoSMoS, GEV/GPD con L-momentos y estimación bayesiana, cópulas gaussianas y vine, CMIP6/SSP, corrección de sesgo, MaxDiss/k-NN, y los motores HEC-HMS/SWAT/SFINCS/HEC-RAS/Iber — todas preexistentes. Segundo, los desarrollos implementados: los bloques modulares en Python, los adaptadores y las tuberías automatizadas. Y tercero, la contribución original propiamente dicha: la integración extremo a extremo, la reproducibilidad sistemática, y la transferibilidad operativa demostrada en 9 casos de estudio sin modificar el núcleo. Cierro esta idea con la frase que resume la mención industrial de la tesis: no reside únicamente en los resultados de los casos de estudio, sino en que esos mismos resultados son reproducibles por terceros con los mismos datos y la misma infraestructura.',
    notes: 'Leer las aportaciones despacio. Destacar la transferencia industrial como valor principal.\n\n❓ "¿Qué hay de nuevo aquí si todos los métodos están tomados de otros trabajos?" → Esta es precisamente la pregunta que la memoria anticipa con esta taxonomía de tres niveles: la novedad es la integración de extremo a extremo con interfaces estandarizadas, y la transferencia demostrada en 9 casos heterogéneos sin tocar el núcleo — no un algoritmo nuevo.\n\nCierra el arco narrativo abierto en la diapositiva 2 (origen y mención industrial): allí se planteó la mención industrial como pregunta, aquí se cierra como conclusión verificada.',
    results: [
      { value:'Extremo a extremo', label:'integración funcional', implication:'datos, estadística, escenarios, modelos físicos e impacto' },
      { value:'Trazable', label:'reproducibilidad sistemática', implication:'cada resultado conserva fuente, método y configuración' },
      { value:'9 casos', label:'transferibilidad operativa', implication:'problemas reales sin modificar los módulos centrales' },
    ],
    bullets: [
      'Las metodologías científicas incorporadas son reconocidas explícitamente como conocimiento previo.',
      'El desarrollo doctoral las convierte en módulos, adaptadores y flujos reproducibles.',
      'La originalidad reside en integrarlas y demostrar que esa arquitectura puede transferirse a proyectos reales.',
      'La automatización no sustituye el juicio experto: lo hace más eficiente y trazable.',
    ],
  },

  {
    id: 42,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'Qué resuelve HYDRA y qué permanece abierto',
    subtitle: 'La automatización organiza la incertidumbre; no elimina los límites de los datos ni de los modelos',
    estimatedMinutes: 2,
    type: 'normal',
    script: 'Identificamos con honestidad las limitaciones actuales del sistema para marcar la hoja de ruta de los próximos desarrollos: la sensibilidad de los ajustes extremos a series cortas, la dependencia de licencias comerciales para HEC-RAS, el supuesto de estacionariedad en los generadores estocásticos, el coste computacional de los grandes ensembles hidráulicos, y la calidad heterogénea de las fuentes de datos globales (ERA5, CMIP6, GRDC, GloFAS).',
    notes: 'Mencionar las limitaciones antes de que el tribunal pregunte por ellas. Demuestra autocrítica científica. Cada una tiene su mitigación explícita en la memoria (cap. 9): no son huecos ignorados, son líneas de trabajo activas.',
    bullets: [
      'Datos · Las series cortas y los extremos raros mantienen una incertidumbre irreducible en la cola.',
      'Dependencias · Licencias, versiones e instalación de motores externos condicionan la reproducibilidad completa.',
      'Método · Los generadores estacionarios no representan por sí solos tendencias climáticas no estacionarias.',
      'Cómputo · MaxDiss, k-NN y emuladores reducen carga, pero no sustituyen la validación física.',
      'Siguiente etapa · Generación no estacionaria, eventos compuestos, ejecución distribuida y más documentación transferible.',
    ],
  },

  {
    id: 42.5,
    block: 'Agradecimientos', blockColor: '#0d9488',
    title: 'Una tesis se firma con un nombre, pero se construye con muchos',
    subtitle: 'A quienes hicieron posible que este trabajo llegara hasta aquí',
    estimatedMinutes: 1,
    type: 'normal',
    script: 'Antes de cerrar, quiero dedicar unas palabras de agradecimiento. A mi familia, por acompañarme desde el comienzo y sostenerme también en los momentos en que el camino parecía no avanzar. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor, honestidad y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad constantes. A IHCantabria, por los medios, los proyectos y el entorno humano y técnico en el que me he formado como investigador e ingeniero. Y a Álvaro Galán, por ayudarme a mantener la motivación y por contribuir a mejorar este trabajo. A todos, gracias.',
    notes: 'Esta diapositiva no se lee deprisa. Mirar al público y hacer pequeñas pausas. Mantener los nombres en líneas separadas y sin añadir instituciones o personas que no aparecen en los agradecimientos de la memoria.',
    bullets: [
      'Mi familia — el apoyo que sostuvo todo el recorrido.',
      'Manuel del Jesus Peñil — rigor, confianza y vocación de utilidad.',
      'César Álvarez Díaz — disponibilidad y generosidad constantes.',
      'IHCantabria — el entorno humano, científico y técnico de la tesis.',
      'Álvaro Galán — motivación y ayuda para mejorar el trabajo.',
    ],
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 9 — CIERRE Y AGRADECIMIENTOS
  // ════════════════════════════════════════════════════

  {
    id: 43,
    block: 'Cierre', blockColor: '#0d9488',
    title: 'Muchas gracias por su atención',
    subtitle: 'HYDRA — Software libre y reproducible al servicio de la sociedad',
    estimatedMinutes: 1,
    type: 'title',
    script: 'La tesis demuestra que es posible convertir una década de metodologías probabilísticas en una cadena completa, reproducible y transferible, desde la adquisición de los datos hasta los mapas de período de retorno del impacto. El reto que queda abierto es que HYDRA deje de ser la herramienta de su equipo de desarrollo y se convierta en la herramienta de su comunidad. Muchas gracias por su atención. Quedo a disposición del tribunal para las preguntas que deseen formular.',
    notes: 'Mantenerse de pie en silencio. Esperar las preguntas del tribunal. Dejar proyectada esta diapositiva de cierre con las referencias de contacto e instalación en pantalla.',
    bullets: [
      '📦 GitHub Librería: github.com/navass11/pyhydra (Licencia MIT)',
      '🌐 GitHub Plataforma: github.com/navass11/HYDRA',
      '📄 DOI pyhydra: 10.5281/zenodo.20932555',
      '📄 DOI HYDRA: 10.5281/zenodo.21138151',
      '📧 Contacto: s.navas11@gmail.com',
    ],
  },

  // ════════════════════════════════════════════════════
  // DIAPOSITIVAS DE ENLACE NARRATIVO
  // Se ordenan mediante presentationRank para reforzar el relato sin
  // convertir la defensa en una sucesión de herramientas o topónimos.
  // ════════════════════════════════════════════════════

  {
    id: 44,
    block: 'Motivación', blockColor: '#ef4444',
    title: 'Dimensión del problema de las inundaciones',
    subtitle: 'Un mismo fenómeno compromete seguridad, actividad económica e infraestructuras esenciales',
    estimatedMinutes: 1,
    type: 'figure',
    figure: 'fig_problematica_inundaciones.png', figurePosition: 'full',
    figureCaption: 'La evaluación debe considerar el sistema expuesto y la distribución de los impactos, no únicamente la magnitud de la lluvia',
    script: 'Antes de delimitar la tesis conviene recordar la dimensión del problema. Una inundación afecta simultáneamente a personas, viviendas, movilidad, actividad industrial y servicios esenciales. El daño depende de dónde se produce el agua, de la velocidad con la que llega, del estado previo de la cuenca y de la vulnerabilidad de cada elemento expuesto. Por eso una única lluvia asociada a un período de retorno no basta para describir el riesgo. La pregunta de ingeniería exige conocer qué impactos pueden producirse, con qué frecuencia y con qué incertidumbre.',
    notes: 'Diapositiva de contexto social y físico. No mencionar todavía software, nombres de librerías ni casos concretos. Concluir con la necesidad de calcular frecuencia sobre el impacto.',
    bullets: [
      'La misma precipitación puede producir consecuencias distintas según el estado de la cuenca y la exposición.',
      'La decisión se toma sobre personas, infraestructuras y niveles de agua, no sobre la lluvia de forma aislada.',
    ],
  },

  {
    id: 45,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Del Trabajo Fin de Máster a la pregunta doctoral',
    subtitle: 'La primera cadena resolvió un caso y reveló un problema más general',
    estimatedMinutes: 1,
    type: 'normal',
    results: [
      { value:'Hallazgo', label:'la frecuencia cambia al propagarse', implication:'el impacto posee una distribución propia' },
      { value:'Límite', label:'cadena manual y difícil de repetir', implication:'cada nueva aplicación exigía reconstruir conexiones' },
      { value:'Pregunta doctoral', label:'generalización reproducible', implication:'cómo transferir el método entre problemas reales' },
    ],
    script: 'El Trabajo Fin de Máster demostró que la frecuencia del impacto debía calcularse después de la simulación hidráulica. Al mismo tiempo dejó visible una limitación práctica: la cadena funcionaba, pero dependía de muchos traspasos manuales y de una configuración específica para una única cuenca. La tesis nace al convertir esa limitación en una pregunta general. ¿Cómo conservar el rigor del método, repetirlo de forma auditable y transferirlo a problemas con otros datos, otras escalas y otros modelos físicos?',
    notes: 'Esta diapositiva es el puente entre el origen de la investigación y la formulación del problema. No adelantar nombres de paquetes. El mensaje es que la tesis generaliza una necesidad científica detectada en el TFM.',
    bullets: [
      'El TFM aporta el principio científico.',
      'La dificultad de repetir la cadena define el problema doctoral.',
      'La tesis busca generalización, trazabilidad y transferencia.',
    ],
  },

  {
    id: 46,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'Qué necesita una modelación estocástica de inundaciones',
    subtitle: 'La generación de escenarios solo adquiere valor cuando se conecta con datos, clima y modelos físicos',
    estimatedMinutes: 1,
    type: 'split',
    figure: 'fig_mallorca_reconstruccion_lluvia.png', figurePosition: 'right',
    figureCaption: 'La variabilidad espacial de la precipitación condiciona los escenarios que después se propagan hasta el impacto',
    results: [
      { value:'Datos', label:'observación y fuentes globales', implication:'calidad, escala y trazabilidad condicionan el análisis' },
      { value:'Escenarios', label:'dependencia espacial y temporal', implication:'preservar combinaciones físicamente plausibles' },
      { value:'Impacto', label:'hidrología e hidráulica', implication:'transformar el forzamiento en variables de decisión' },
    ],
    script: 'El carácter estocástico de la tesis no se limita a generar números aleatorios o tormentas sintéticas. Para estudiar inundaciones hacen falta series observadas y proyecciones climáticas coherentes, métodos que preserven la dependencia espacial y temporal, modelos que transformen lluvia en caudal y agua en calado, y un postproceso que asigne frecuencia al impacto. Estas herramientas auxiliares explican por qué la tesis abarca más temas que la generación estocástica estricta. Todos forman parte de la misma pregunta probabilística.',
    notes: 'Esta diapositiva responde de manera explícita a por qué aparecen clima, datos, aprendizaje automático y motores físicos en una tesis titulada sobre inundación estocástica. Mantener el lenguaje funcional; las librerías concretas aparecen después.',
    bullets: [
      'Representar escenarios plausibles exige datos y relaciones de dependencia.',
      'Propagar esos escenarios exige modelos hidrológicos e hidráulicos.',
      'Evaluar el riesgo exige calcular la distribución de la variable de impacto.',
    ],
  },

  {
    id: 47,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Mapa metodológico de la tesis',
    subtitle: 'Cinco responsabilidades científicas que después se materializan en la arquitectura',
    estimatedMinutes: 1,
    type: 'normal',
    results: [
      { value:'1', label:'adquirir y controlar datos', implication:'observación, reanálisis y proyecciones' },
      { value:'2', label:'caracterizar extremos y clima', implication:'frecuencia, tendencia y corrección de sesgo' },
      { value:'3', label:'generar escenarios plausibles', implication:'dependencia, variabilidad y selección' },
      { value:'4', label:'simular la respuesta física', implication:'lluvia, caudal, nivel y calado' },
      { value:'5', label:'estimar frecuencia sobre el impacto', implication:'resultados trazables para decidir' },
    ],
    script: 'Antes de presentar la arquitectura técnica, este es el mapa metodológico de la tesis. La primera responsabilidad consiste en adquirir y controlar las fuentes de datos. La segunda caracteriza extremos, tendencias y señal climática. La tercera genera escenarios que preservan las relaciones relevantes. La cuarta propaga esos escenarios por los modelos físicos. La quinta calcula frecuencia e incertidumbre sobre la variable de impacto. La arquitectura que veremos a continuación existe para mantener conectadas estas cinco responsabilidades sin ocultar qué método actúa en cada etapa.',
    notes: 'Utilizar esta diapositiva como orientación. No enumerar aún clases ni submódulos. En la diapositiva siguiente se explica que la arquitectura asigna una capa técnica a estas responsabilidades.',
    bullets: [
      'Cada etapa transforma la información y conserva la procedencia del resultado.',
      'La arquitectura técnica se presenta después de comprender esta lógica científica.',
    ],
  },

  {
    id: 48,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Resultados que sostienen la contribución',
    subtitle: 'Los casos aportan evidencias distintas y complementarias',
    estimatedMinutes: 2,
    type: 'normal',
    results: [
      { value:'+30–37 %', label:'diferencia en caudal de diseño', implication:'el procedimiento convencional subestima la respuesta en la comparación realizada' },
      { value:'+266 %', label:'cambio del cuantil T100', implication:'un evento sin precedente modifica sustancialmente la estimación de diseño' },
      { value:'1.990', label:'simulaciones hidráulicas 2D', implication:'la automatización revela sensibilidad de parámetros y de estructura de modelo' },
      { value:'414', label:'correcciones climáticas automáticas', implication:'la misma lógica escala desde una cuenca hasta un estudio nacional' },
    ],
    script: 'Antes de cerrar el bloque, conviene reunir las evidencias que dan valor a la contribución. La comparación metodológica muestra diferencias del 30 al 37 por ciento en el caudal de diseño. La incorporación de un evento sin precedente eleva en un 266 por ciento el cuantil T100 estimado en la estación analizada. Una campaña de 1.990 simulaciones hidráulicas permite separar sensibilidad paramétrica y diferencias entre motores. Y 414 correcciones climáticas automáticas muestran que la arquitectura puede operar a escala nacional. Son resultados distintos, pero todos dependen de una cadena reproducible que conecta datos, incertidumbre, modelos y decisión.',
    notes: 'Presentar las cifras como evidencia, no como competición entre casos. Aclarar el dominio de cada cifra si el tribunal pregunta. Esta diapositiva prepara la síntesis conceptual de la siguiente.',
    bullets: [
      'La evidencia combina contraste metodológico, actualización estadística, sensibilidad hidráulica y escalabilidad.',
      'El valor conjunto reside en conservar la trazabilidad desde la entrada hasta la cifra final.',
    ],
  },
];

const presentationRank = (slide: Slide) => {
  if (slide.id === 1) return 0;
  if (slide.id === 4) return 1;
  if (slide.id === 44) return 1.5;
  if (slide.id === 2) return 2;
  if (slide.id === 3) return 3;
  if (slide.id === 45) return 3.5;
  if (slide.id === 46) return 8.7;
  if (slide.id === 47) return 10.5;
  if (slide.id === 48) return 39.4;
  // El producto se presenta después de explicar el problema, el estado de la
  // técnica y la arquitectura. En la introducción todavía no se adelantan
  // nombres de librerías ni detalles de implementación.
  if (slide.id === 5) return 12.5;
  return slide.id;
};

export const slides = slideLibrary
  .filter(slide => !slide.backup)
  .sort((a, b) => presentationRank(a) - presentationRank(b));
export const backupSlides = slideLibrary.filter(slide => slide.backup);
export const totalSlides = slides.length;
export const totalMinutes = slides.reduce((acc, s) => acc + s.estimatedMinutes, 0);
