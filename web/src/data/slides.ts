export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  block: string;
  blockColor: string;
  estimatedMinutes: number; // Manual pacing note for the individual slide
  // Online (iframe) mode URL
  url?: string;
  anchor?: string;
  anchorPosition?: 'start' | 'center';
  highlight?: string;
  webMode?: 'evidence' | 'demo';
  webLabel?: string;
  webPurpose?: string;
  webAction?: string;
  // Local captures replace live navigation in the offline deck.
  offlineScript?: string;
  offlineFrames?: { src: string; label: string; caption: string }[];
  // Offline figure assets
  figure?: string;
  figureCaption?: string;
  secondaryFigure?: string;
  secondaryFigureCaption?: string;
  figurePosition?: 'full' | 'right' | 'left';
  speakerGoal?: string;
  visualGuide?: string[];
  speechCues?: string[];
  offlineSpeechCues?: string[];
  transitionCue?: string;
  // Slide texts
  script: string;        // Presenter speech / guion
  quote?: string;        // Short on-screen statement for quote slides (the script stays in the notes)
  transition?: string;   // Spoken bridge to the next slide in the current order
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
    script: "Buenos días, miembros del tribunal, director, tutor, compañeros, familiares y amigos. Muchas gracias por acompañarme. Soy Salvador Navas Fernández y presento mi tesis, «Desarrollo de un modelo automático de inundación estocástica», realizada en IHCantabria dentro del programa IH2O, con Mención Industrial. La ha dirigido Manuel del Jesus Peñil y la ha tutorizado César Álvarez Díaz.\n\nEl problema que recorre esta defensa es concreto: cómo pasar de datos y escenarios inciertos a una frecuencia de inundación útil para decidir. Explicaré por qué ese paso exige estudiar la respuesta física, cómo construí la cadena que lo permite y qué muestran sus aplicaciones.",
    notes: "Saludar y hacer una pausa antes de plantear el problema. Los nombres completos y la Mención Industrial permanecen en portada.",
    bullets: [
      'Salvador Navas Fernández',
      'Dr. Manuel del Jesus Peñil',
      'Dr. César Álvarez Díaz',
    ],
    speakerGoal: "Plantear la defensa como respuesta a un problema de ingeniería.",
    visualGuide: ["Título de la tesis","Autor, director y tutor"],
    speechCues: ["Salvador Navas Fernández","Manuel del Jesus Peñil","César Álvarez Díaz","frecuencia de inundación útil para decidir"],
    transition: "La estructura de la exposición sigue los pasos necesarios para responder a ese problema.",
    transitionCue: "responder a ese problema"
  },

  {
    id: 4,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Estructura de la defensa',
    subtitle: 'Correspondencia directa con los capítulos de la memoria doctoral',
    estimatedMinutes: 1,
    type: 'index',
    script: "La defensa sigue los seis bloques de la pantalla. La introducción plantea el problema y los objetivos. El estado de la técnica identifica qué conexión falta entre métodos que ya existen. La arquitectura explica cómo se organiza la solución; la metodología, cómo trabaja. Los casos permiten valorar sus resultados. Las conclusiones vuelven a las hipótesis y precisan la contribución y sus límites.\n\nLa ruta superior nos situará en cada bloque.",
    notes: "Situar los seis bloques. La diapositiva de índice se utiliza una sola vez en el recorrido principal.",
    bullets: [
      '1. Introducción — Origen, motivación, problema, hipótesis y objetivos',
      '2. Estado de la técnica — Antecedentes, soluciones existentes y brecha',
      '3. Arquitectura de HYDRA — Núcleo científico, servicios e interfaz reproducible',
      '4. Metodología — Datos; análisis climático y estadístico; modelización',
      '5. Casos y validación — Evidencia científica y transferencia a proyectos reales',
      '6. Conclusiones — Contribuciones, límites y trabajo futuro',
    ],
    speakerGoal: "Dar al tribunal un mapa de la argumentación.",
    visualGuide: ["Seis bloques del índice","Ruta superior de cada diapositiva"],
    speechCues: ["introducción","estado de la técnica","arquitectura","metodología","casos","conclusiones"],
    transition: "Comencemos por la decisión que necesitamos tomar cuando estudiamos una inundación.",
    transitionCue: "decisión"
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
    script: 'El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una cadena completa de cálculo. “Automático” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente la preparación de archivos y el intercambio de datos entre etapas. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que representa la variabilidad y la incertidumbre. Esta definición exige además reproducibilidad operativa: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la variable sobre la que se toman decisiones.',
    processSteps:['Entradas trazables','Escenarios plausibles','Modelos físicos','Frecuencia del impacto'],
    notes: 'Cita literal (cap. 1, primer párrafo, antes de la sección de antecedentes): "En esta memoria, el modelo automático de inundación estocástica que recoge el título se entiende en sentido amplio: no como un único motor hidráulico o algoritmo aislado, sino como una arquitectura reproducible de cálculo. Su núcleo central es pyhydra, la librería Python donde se implementan los módulos científicos y técnicos; HYDRA designa la plataforma que integra ese núcleo con web, notebooks, Docker y servicios de apoyo. [...] Es la automatización de esa cadena completa, y no de un componente particular, lo que constituye el objeto central de la investigación. [...] el término reproducible se emplea en un sentido operativo [...] que se concreta en cuatro contratos verificables: entradas trazables, transformaciones reproducibles, salidas en formatos estándar y registro suficiente para auditar cada resultado."\n\nDeliberadamente NO se explica aquí el nombre HYDRA en detalle — solo se menciona que existe una plataforma con nombre propio. En la siguiente diapositiva se explica el origen del trabajo en el TFM. La metáfora del nombre HYDRA puede comentarse al presentar el producto, una vez explicada la arquitectura.',
    bullets: [
      'Modelo: arquitectura completa de cálculo, no un nuevo motor hidráulico.',
      'Automático: ejecución repetible de tareas que manualmente son lentas y frágiles.',
      'Inundación: frecuencia estimada sobre calado y extensión, no heredada directamente de la lluvia.',
      'Estocástica: cientos o miles de combinaciones plausibles de forzamientos, estados y parámetros.',
    ],
    backup: true
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
    script: 'Esta tesis se realiza porque las inundaciones pueden causar graves daños humanos, económicos y territoriales, y porque las condiciones que determinan ese riesgo están cambiando. La ocupación de las llanuras inundables aumenta la exposición de personas e infraestructuras; el cambio climático modifica las condiciones hidrológicas y puede alterar la frecuencia y la intensidad de los extremos; y la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman interacciones entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre asociada a la decisión.',
    notes: 'Abrir el problema a escala social antes de hablar de software. La imagen es conceptual y no corresponde a un evento concreto; las evidencias cuantitativas y geográficas aparecerán después en los casos de estudio. Conectar con la siguiente idea: si el riesgo exige múltiples escenarios, el flujo manual deja de ser viable.',
    bullets: [
      'Las inundaciones constituyen el riesgo natural con mayor impacto social, económico y territorial.',
      'Cambio climático, urbanización y exposición hacen insuficiente el escenario único.',
      'La variable decisiva es el impacto hidráulico y su incertidumbre.',
    ],
    backup: true
  },

  {
    id: 4.6,
    block: 'Motivación', blockColor: '#8b5cf6',
    title: 'Qué aporta esta tesis',
    subtitle: 'De metodologías avanzadas pero fragmentadas a una capacidad de ingeniería reproducible',
    estimatedMinutes: 2,
    type: 'normal',
    script: 'Con los objetivos fijados, anticipo qué aporta la tesis. No reivindica como nuevos los métodos estadísticos, los generadores ni los modelos físicos; su aportación es hacerlos trabajar juntos, y tiene tres partes. Integración: una sola cadena, de los datos al impacto, como muestra la franja superior. Reproducibilidad: cada resultado deja registro de su fuente, su método, su configuración y su salida, de modo que un tercero puede repetirlo. Y transferencia: el mismo núcleo resuelve problemas distintos, desde un túnel urbano hasta la escala nacional. Al presentar los casos distinguiré cuáles originaron la arquitectura y cuáles pueden reproducirse hoy con ella.',
    notes: 'Esta diapositiva anticipa la respuesta a “¿qué aporta realmente la tesis?” y se recupera al final. No enumerar librerías. Explicar los tres pilares con una frase y un ejemplo: integración — Calle 30; reproducibilidad — Besaya/Valencia; transferencia — Panamá y SIMPCCe.\n\nOrden: esta diapositiva se presenta después de la pregunta y los objetivos, como anticipo de la respuesta; así la aportación no aparece antes de haber planteado el problema.',
    bullets: [
      'Integración: una sola cadena desde el dato hasta el impacto.',
      'Reproducibilidad: resultados auditables por terceros.',
      'Transferencia: el mismo núcleo aplicado a problemas de escala y finalidad distintas.',
    ],
    backup: true
  },

  {
    id: 3,
    block: 'Apertura', blockColor: '#0d9488',
    title: "Besaya: del primer caso al problema doctoral",
    subtitle: 'Besaya 2017–2018: del primer desarrollo metodológico a una línea de investigación',
    estimatedMinutes: 2,
    type: 'timeline',
    script: "La cronología resume cómo esa pregunta se convirtió en una tesis. En 2017, mi Trabajo Fin de Máster sobre el Besaya construyó una primera cadena: describir avenidas, generar escenarios, simularlos con Iber y analizar sus impactos. El trabajo recibió el premio nacional del Colegio de Caminos en la categoría de Mejor Calidad y Contenido.\n\nEn 2018, la publicación en la Revista de Obras Públicas consolidó el principio que acabamos de ver. Pero la cadena dependía de muchos intercambios manuales y de una configuración específica para ese caso. El problema doctoral surgió al intentar repetirla: cómo conservar el método y transferirlo a otros datos, modelos y escalas sin reconstruir cada enlace. Los resultados hidráulicos del Besaya los explicaré en el bloque de validación.",
    notes: "Origen: TFM de 2017, publicación ROP 3598 de mayo de 2018. La cadena y los resultados del caso se desarrollan después en validación.",
    bullets: ["2017 — Primera cadena estocástica completa en el TFM del Besaya.","2018 — Publicación del principio T(forzamiento) ≠ T(impacto).","Límite — Conexiones manuales y configuración específica para una cuenca.","Tesis — Repetir y transferir la cadena conservando su trazabilidad."],
    speakerGoal: "Explicar el origen del problema doctoral sin repetir todavía los resultados del caso.",
    visualGuide: ["2017: primera cadena del TFM","2018: publicación del principio","Limitación manual y pregunta doctoral"],
    speechCues: ["2017","2018","intercambios manuales","repetirla","transferirlo"],
    transition: "La pregunta dejó de ser cómo resolver una cuenca y pasó a ser cómo hacer reutilizable la cadena completa.",
    transitionCue: "reutilizable la cadena completa"
  },

  {
    id: 5,
    offlineFrames: [{"src": "offline_hydra_home.png", "label": "Plataforma", "caption": "Portada local de HYDRA: acceso a módulos, herramientas y notebooks."}],
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'Un producto científico y operativo real',
    subtitle: 'Núcleo científico, plataforma web y entorno reproducible',
    estimatedMinutes: 1,
    url: '/', anchor: '.hero-stats', highlight: '.hero-stats',
    webMode: 'evidence',
    webLabel: 'Evidencia 1 · Producto transferible',
    webPurpose: 'Demostrar que la aportación se entrega como infraestructura utilizable, no solo como memoria.',
    webAction: 'Mostrar únicamente arquitectura, DOI y acceso a casos. No recorrer el menú completo.',
    figure: 'fig_hydra_web_home.png', figurePosition: 'right',
    figureCaption: 'HYDRA integra documentación, herramientas y casos reproducibles',
    type: 'split',
    script: 'La aportación principal de este trabajo no es solo teórica; se entrega como un ecosistema reproducible completo. Consta de la librería modular de Python "pyhydra" y la plataforma "HYDRA" que facilita ejecutar los flujos implementados desde el navegador. Los contenedores Docker conservan las versiones del software y sus dependencias para facilitar la reproducción de los cálculos.',
    notes: 'Llamar la atención del tribunal sobre la web de fondo (si se usa modo online). Señalar los badges reales.\n\n❓ "¿Esto es reproducible o es solo una demo personal?" → Distinguir la instancia cloud efímera (no citable, solo demostrativa) de las versiones archivadas en Zenodo (navas2026pyhydra, navas2026hydrarepo, v0.1.0) como referencia de reproducibilidad permanente — la propia tesis hace esta distinción explícita (cap. 3, Estructura del paquete).',
    bullets: [
      'Núcleo científico: concentra los métodos de datos, clima y modelización.',
      'Plataforma web: permite explorar documentación, herramientas y casos.',
      'Ejecución reproducible: reúne API, notebooks y servicios en un entorno controlado.',
      'Distribución abierta: código versionado y software archivado con DOI.',
    ],
    backup: true
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
    script: "El esquema se lee de izquierda a derecha. De los registros de lluvia o caudal pasamos al ajuste de extremos; de ahí obtenemos un evento de diseño. Los modelos hidrológicos e hidráulicos transforman ese evento en caudales, calados y extensión inundada.\n\nLa fila inferior señala tres decisiones que condicionan el resultado: suponer estacionariedad, representar el diseño con un único evento y trasladar al impacto el período de retorno del forzamiento. La cadena física sigue siendo necesaria. Lo que debemos revisar es si un único evento representa adecuadamente todas las situaciones relevantes y si conserva su frecuencia al atravesar el sistema.\n\nEl período de retorno de cien años describe una probabilidad anual de superación del uno por ciento para una variable y unas condiciones dadas. No significa que todas las variables que aparecen después compartan esa probabilidad.",
    notes: "El período de retorno se refiere a una variable y a hipótesis especificadas. En condiciones estacionarias, T100 corresponde a una probabilidad anual de superación de 0,01.",
    speakerGoal: "Separar la cadena física válida de los supuestos de asignación de frecuencia.",
    visualGuide: ["Fila superior, de registros a impacto","Tres supuestos en los recuadros inferiores"],
    speechCues: ["izquierda a derecha","estacionariedad","único evento","período de retorno del forzamiento","probabilidad anual de superación"],
    transition: "El siguiente ejemplo muestra por qué esa frecuencia puede cambiar incluso con la misma lluvia.",
    transitionCue: "misma lluvia"
  },

  {
    id: 6,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "La misma lluvia puede producir impactos distintos",
    subtitle: 'Cuando la frecuencia del forzamiento se toma por la frecuencia del impacto',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Comparemos las dos filas. La lluvia de entrada es la misma y tiene asociado un período de retorno de cien años. En la fila superior el suelo está seco y el agua queda dentro del cauce. En la inferior, el suelo está saturado y el afluente llega en crecida: se produce el desbordamiento.\n\nEl ejemplo no asigna un nuevo período de retorno a cada dibujo. Muestra que, para una misma lluvia, existen respuestas distintas porque cambian las condiciones del sistema. Para conocer la frecuencia de un calado determinado necesitamos considerar esas combinaciones y calcular cuántas veces producen su superación.\n\nEsta es la diferencia expresada al pie: T del forzamiento no equivale necesariamente a T del impacto. Es la idea científica que debe conservar toda la cadena.",
    notes: "Las dos filas son un ejemplo conceptual. La figura muestra respuestas posibles, no calcula el período de retorno de cada impacto dibujado.",
    mathBlock: `
      <div class="impact-equation">
        T<sub>forzante</sub>(P) &ne; T<sub>impacto</sub>(Q, h)
      </div>
      <p class="impact-equation-caption">El período de retorno de la lluvia (P) no es el del impacto hidráulico (caudal Q, calado h).</p>
    `,
    bullets: [
      'Un evento de lluvia no determina por sí solo la frecuencia del impacto.',
      'El suelo antecedente, las confluencias y la duración cambian la respuesta.',
      'La cadena manual dificulta explorar escenarios y reproducir el análisis.',
    ],
    speakerGoal: "Hacer comprensible la diferencia entre frecuencia del forzamiento y del impacto.",
    visualGuide: ["Comparar las dos filas del esquema","Suelo seco frente a suelo saturado y afluente en crecida","Resultado hidráulico de cada fila"],
    speechCues: ["misma","suelo está seco","suelo está saturado","respuestas distintas","frecuencia de un calado","T del impacto"],
    transition: "Esta dificultad apareció de forma concreta en el trabajo con el que comenzó la investigación: el Besaya.",
    transitionCue: "Besaya"
  },

  {
    id: 7,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "Pregunta de investigación e hipótesis",
    type: 'quote',
    quote: "¿Cómo automatizar una cadena reproducible que propague la incertidumbre hasta el impacto y pueda transferirse a proyectos reales?",
    estimatedMinutes: 2,
    script: "La pregunta doctoral es si podemos automatizar de forma reproducible el análisis del riesgo de inundación bajo incertidumbre y transferirlo a proyectos reales.\n\nEl esquema contrapone las dos situaciones que originan esa pregunta. Arriba aparecen métodos disponibles, como extremos, cópulas, generadores y modelos hidráulicos, cuyos enlaces se reconstruyen en cada proyecto. Abajo, esos métodos forman una cadena conectada desde los datos hasta el impacto.\n\nLa hipótesis general es que una arquitectura común puede resolver esa fragmentación. La memoria formula tres hipótesis: H1, que automatizar el flujo mejora la eficiencia, la reproducibilidad y su aplicación práctica; H2, que la integración modular reduce barreras técnicas e incorpora sistemáticamente clima e incertidumbre; y H3, que el flujo integrado representa la incertidumbre de forma más consistente que un escenario único de diseño. Al final volveré a cada una y distinguiré la evidencia conseguida de lo que queda por medir.",
    notes: "H1 incluye eficiencia y reproducibilidad: hay evidencia de ejecución viable, pero falta medir el ahorro sistemático frente al trabajo manual. H2 y H3 se cierran con alcance limitado por los casos.",
    bullets: ["H1 · Automatización: viabilidad de la ejecución, reproducibilidad y eficiencia.","H2 · Modularidad: reutilización de componentes entre problemas reales.","H3 · Incertidumbre: representar el efecto de escenarios y métodos sobre el diseño."],
    speakerGoal: "Formular una pregunta y tres hipótesis que luego se puedan cerrar con evidencia.",
    visualGuide: ["Fila superior: métodos fragmentados","Fila inferior: arquitectura conectada","H1, H2 y H3"],
    speechCues: ["pregunta doctoral","fragmentación","H1","H2","H3","lo que queda por medir"],
    transition: "Para contrastar esas hipótesis necesitamos concretar qué se va a desarrollar y qué resultado verificará cada objetivo.",
    transitionCue: "resultado verificará cada objetivo",
    subtitle: "¿Puede una cadena reproducible transferirse a problemas reales bajo incertidumbre?"
  },

  {
    id: 8,
    block: 'Motivación', blockColor: '#3b82f6',
    title: 'Pregunta de investigación',
    type: 'quote',
    quote: '¿Es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías previamente desarrolladas en un marco transferible a proyectos reales de ingeniería?',
    estimatedMinutes: 2,
    script: 'La pregunta de investigación es la que aparece a la izquierda: ¿es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías previamente desarrolladas en un marco transferible a proyectos reales de ingeniería? A la derecha está la cadena que exige: datos climáticos con su incertidumbre; una cadena automática cuyos cálculos puedan repetirse conservando los datos, la configuración, las versiones y las semillas aleatorias; modelos físicos adecuados a cada caso; y una aplicación real en la que se estime la frecuencia con la que se supera un calado, una extensión inundada o un nivel relevantes para el diseño. El esquema recuerda una condición esencial: las fuentes de incertidumbre consideradas deben propagarse a través de la cadena y reflejarse en los resultados finales.',
    notes: 'Pronunciar despacio: es la formulación literal de la memoria (cap. 1). El foco está en "automatizar de forma reproducible" e "integrando metodologías previamente desarrolladas" — de ahí que la tesis no reivindique algoritmos nuevos, sino su operacionalización conjunta.',
    bullets: [
      'Conectar datos, análisis estadístico, escenarios y modelos físicos.',
      'Conservar la incertidumbre entre etapas en lugar de perderla.',
      'Repetir y auditar el cálculo completo.',
      'Funcionar en casos reales con escalas, datos y motores diferentes.',
    ],
    backup: true
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
    script: "El objetivo general es desarrollar y validar pyhydra como núcleo modular para analizar inundaciones bajo incertidumbre climática e hidrológica, y demostrar su transferencia mediante HYDRA. La tabla traduce ese objetivo en cuatro compromisos; se lee por filas: objetivo, desarrollo y evidencia.\n\nEl primero integra datos y modelos de cambio climático en la cadena estocástica: deben quedar escenarios climáticos con procedencia registrada. El segundo implementa y conecta la generación de eventos de precipitación y caudal: debemos comprobar las propiedades de las realizaciones antes de utilizarlas. El tercero automatiza la configuración, ejecución y postprocesado de los modelos hidrológicos e hidráulicos. El cuarto consolida y documenta el núcleo y su despliegue, y los valida mediante casos reproducibles.\n\nEstos cuatro compromisos son los criterios con los que valoraremos la arquitectura y los casos.",
    notes: "Leer una fila objetivo–desarrollo–evidencia completa y recorrer las otras tres. Conservar estos cuatro criterios hasta el cierre.",
    bullets: ["Objetivo general: desarrollar y validar pyhydra y demostrar su transferencia mediante HYDRA.","OE1–OE2: integrar datos y modelos climáticos, y generar eventos de precipitación y caudal.","OE3–OE4: automatizar los modelos físicos; documentar y validar pyhydra e HYDRA mediante casos reproducibles."],
    speakerGoal: "Relacionar cada objetivo con una evidencia que aparecerá en la defensa.",
    visualGuide: ["Leer una fila completa: objetivo, desarrollo y evidencia","Recorrer los cuatro objetivos"],
    speechCues: ["desarrollar y validar pyhydra","transferencia mediante HYDRA","cambio climático","generación de eventos","configuración, ejecución y postprocesado","casos reproducibles"],
    transition: "El primer paso para cumplirlos es entender qué exige una cadena estocástica completa y qué ofrecen los métodos existentes.",
    transitionCue: "cadena estocástica completa"
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
        <div class="traceability-head">Necesidad</div><div class="traceability-head">Estrategia</div><div class="traceability-head">Criterio de éxito</div>
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
    backup: true
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
    script: 'La cronología no es una lista de lugares ni de proyectos. Comienza en 2017 con una pregunta nacida en el Trabajo Fin de Máster: cómo calcular la frecuencia sobre el impacto hidráulico y no heredarla directamente del forzamiento. El artículo de 2018 consolida ese principio. Después, la investigación incorpora progresivamente problemas que aquella primera cadena no resolvía: cuencas sin aforo, precipitación espacial, calibración automática de modelos regionales, infraestructuras urbanas críticas, gestión de embalses, eventos sin precedente e incertidumbre entre motores hidráulicos. Esa acumulación de necesidades conduce finalmente a una arquitectura común, documentada y distribuida como software para repetir los análisis.',
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
    backup: true
  },

  {
    id: 10,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Posicionamiento frente a los marcos integrados más próximos',
    subtitle: 'Cobertura funcional comparada en el capítulo 2 de la memoria',
    estimatedMinutes: 2,
    type: 'normal',
    script: "La matriz compara capacidades, no popularidad de herramientas. Cada fila es un marco y cada columna una responsabilidad de la cadena. Las marcas permiten ver qué cubre cada uno de forma completa o parcial.\n\nCLIMADA destaca en riesgo climático con funciones de impacto agregadas. RainyDay genera tormentas por transposición. wflow y HydroMT facilitan la preparación de modelos a partir de datos globales. Los marcos de simulación continua pueden alcanzar el impacto, aunque su implementación esté vinculada a un dominio concreto.\n\nLa brecha que identifica la memoria es la combinación: datos heterogéneos, extremos y dependencia, generación de escenarios, motores físicos y frecuencia del impacto dentro de un flujo reutilizable. Esa combinación define el alcance de HYDRA. Las bibliotecas estadísticas que utiliza son componentes científicos de la solución.",
    notes: "Comparación funcional documentada en la memoria. Las marcas de capacidad parcial requieren considerar el alcance de cada marco y su dominio. Evitar afirmar superioridad universal.",
    mathBlock: `
      <table class="thesis-matrix positioning-matrix">
        <thead><tr><th>Capacidad</th><th class="tm-hydra">HYDRA</th><th>CLIMADA</th><th>RainyDay</th><th>wflow / HydroMT</th><th>Sim. continua</th></tr></thead>
        <tbody>
          <tr><th scope="row">Adquisición automática de datos globales</th><td class="tm-yes">●</td><td class="tm-yes">●</td><td class="tm-part">◐</td><td class="tm-yes">●</td><td class="tm-no">—</td></tr>
          <tr><th scope="row">Extremos con incertidumbre (bayesiano, AFR)</th><td class="tm-yes">●</td><td class="tm-part">◐</td><td class="tm-no">—</td><td class="tm-no">—</td><td class="tm-part">◐</td></tr>
          <tr><th scope="row">Análisis multivariante (cópulas)</th><td class="tm-yes">●</td><td class="tm-no">—</td><td class="tm-no">—</td><td class="tm-no">—</td><td class="tm-part">◐</td></tr>
          <tr><th scope="row">Generación estocástica de eventos</th><td class="tm-yes">●</td><td class="tm-no">—</td><td class="tm-yes">●</td><td class="tm-no">—</td><td class="tm-yes">●</td></tr>
          <tr><th scope="row">Corrección de sesgo de proyecciones</th><td class="tm-yes">●</td><td class="tm-part">◐</td><td class="tm-no">—</td><td class="tm-part">◐</td><td class="tm-part">◐</td></tr>
          <tr><th scope="row">Motores profesionales (HEC, SWAT, SFINCS)</th><td class="tm-yes">●</td><td class="tm-no">—</td><td class="tm-no">—</td><td class="tm-part">◐</td><td class="tm-no">—</td></tr>
          <tr><th scope="row">Período de retorno basado en impacto</th><td class="tm-yes">●</td><td class="tm-part">◐</td><td class="tm-no">—</td><td class="tm-no">—</td><td class="tm-yes">●</td></tr>
          <tr><th scope="row">Producto transferible (Docker, web, notebooks)</th><td class="tm-yes">●</td><td class="tm-yes">●</td><td class="tm-part">◐</td><td class="tm-yes">●</td><td class="tm-no">—</td></tr>
        </tbody>
      </table>
      <p class="thesis-matrix-legend">● Sí · ◐ Parcial (limitada o con herramientas externas) · — No. Fuente: memoria, cap. 2.</p>
    `,
    bullets: [
      'Ningún marco revisado cubre a la vez las ocho capacidades de la tabla.',
      'Stan, PyMC o extRemes se integran como componentes; no compiten con HYDRA.',
    ],
    speakerGoal: "Localizar la brecha mediante la matriz comparativa.",
    visualGuide: ["Columnas: capacidades; filas: marcos","Diferenciar capacidad completa y parcial","Combinación de capacidades de HYDRA"],
    speechCues: ["capacidades","completa o parcial","CLIMADA","RainyDay","wflow y HydroMT","la combinación"],
    transition: "Para cubrir esa combinación, separé el cálculo científico de su ejecución y de su acceso desde la web.",
    transitionCue: "cálculo científico"
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 4 — ARQUITECTURA
  // ════════════════════════════════════════════════════

  {
    id: 11,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'La arquitectura del sistema de tres niveles',
    subtitle: 'Nivel científico, nivel de servicios y nivel de interfaz',
    estimatedMinutes: 2,
    url: '/', anchor: '#modulos', highlight: '#modulos .grid',
    type: 'normal',
    script: "Leamos la figura desde abajo. El núcleo pyhydra contiene los métodos científicos y se puede utilizar como librería de Python. La fila intermedia ofrece dos formas de ejecutarlos: la API, que atiende a las herramientas, y JupyterLab, que permite reproducir los análisis mediante notebooks. Arriba está la web, con la documentación y los casos.\n\nLa separación permite que el mismo cálculo se utilice desde un programa, un notebook o una herramienta visual. La web no contiene una segunda implementación del método. El contorno exterior representa el entorno en contenedores, que conserva versiones y dependencias.\n\nReproducir un resultado exige además conservar datos y configuración, y disponer de los motores y licencias que requiera el caso. Esta figura describe las responsabilidades del sistema; la siguiente abre el contenido del núcleo científico.",
    notes: "La figura representa responsabilidades funcionales. pyhydra calcula; API y notebooks lo ejecutan; la web facilita el acceso. Datos, configuración y licencias siguen siendo requisitos de reproducción.",
    bullets: ["pyhydra: métodos científicos reutilizables.","API y notebooks: dos accesos al mismo cálculo.","Web: documentación, herramientas y casos."],
    speakerGoal: "Explicar quién calcula, quién ejecuta y cómo accede el usuario.",
    visualGuide: ["Núcleo inferior pyhydra","Servicios intermedios API y JupyterLab","Interfaz superior y contenedor exterior"],
    speechCues: ["desde abajo","núcleo pyhydra","API","JupyterLab","mismo cálculo","datos y configuración"],
    transition: "Dentro de ese núcleo, los métodos se ordenan según las tres responsabilidades de la cadena.",
    transitionCue: "tres responsabilidades"
  },

  {
    id: 12,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'Infraestructura de despliegue industrial',
    subtitle: 'El mismo entorno de cálculo en un portátil o en la nube',
    estimatedMinutes: 2,
    figure: 'fig_hydra_azure_infraestructura.png', figurePosition: 'full',
    figureCaption: 'Esquema de la infraestructura de contenedores para despliegue local o en Azure ACA',
    type: 'figure',
    script: 'Para reducir las diferencias entre los entornos de ejecución, la plataforma se empaqueta en contenedores: el entorno de notebooks, la API y la web, coordinados por un proxy. Una canalización de integración continua construye esas imágenes y las publica en la nube. Lo relevante para la tesis no es la tecnología concreta, sino que los datos conservados, las versiones del software y la configuración permiten repetir los cálculos en distintos equipos. La presentación descargada puede consultarse sin conexión; repetir un cálculo exige además disponer de los datos, los programas y, cuando corresponda, las licencias del modelo.',
    notes: 'Señalar las partes de la figura de infraestructura. Destacar el volumen compartido de datos `/data` (montado desde Azure Files en producción) que permite a Jupyter y a la API leer las mismas series sin duplicados. Cada usuario recibe una sesión de notebooks aislada mediante una cookie anónima (hydra_jupyter_session), copiando los notebooks a una carpeta de sesión propia — así nadie edita el catálogo compartido.',
    backup: true
  },

  {
    id: 12.6,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: 'Catorce módulos organizados en tres bloques',
    subtitle: 'La estructura funcional de la librería sigue el flujo del análisis de inundación',
    estimatedMinutes: 1,
    type: 'figure',
    figure: 'fig_pyhydra_modules.svg', figurePosition: 'full',
    figureCaption: 'Estructura de los submódulos descrita en el capítulo de arquitectura de la memoria',
    script: "Las tres columnas muestran el contenido de pyhydra. La primera reúne cuatro submódulos de datos: lluvia, caudal, cambio climático y suelos. La segunda agrupa cinco de clima y estadística: series y extremos, análisis espacial y regional, generación estocástica, corrección de sesgo y downscaling híbrido. La tercera conecta la modelización hidrológica e hidráulica y el análisis de sensibilidad.\n\nLas rutas pequeñas permiten localizar el código; las funciones de cada columna explican para qué sirve. Una aplicación selecciona los componentes que necesita. Un estudio de extremos puede terminar en la segunda columna; una inundación requiere continuar hasta la respuesta física.\n\nVoy a recorrer ahora esas tres responsabilidades con las figuras que muestran sus operaciones principales.",
    notes: "4 submódulos de datos, 5 de clima/estadística y 5 de modelización. Relacionar las columnas con las operaciones siguientes; las rutas pequeñas son localizadores de código.",
    speakerGoal: "Dar un mapa funcional del núcleo sin recitar rutas de código.",
    visualGuide: ["Columna de datos","Columna de clima y estadística","Columna de modelización"],
    speechCues: ["tres columnas","datos","clima y estadística","modelización","selecciona los componentes"],
    transition: "La primera dificultad práctica es que las entradas proceden de fuentes muy distintas.",
    transitionCue: "fuentes muy distintas"
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 5 — METODOLOGÍA: DATOS, CLIMA/ESTADÍSTICA Y MODELIZACIÓN
  // ════════════════════════════════════════════════════

  {
    id: 13,
    block: 'Bloque de datos', blockColor: '#0ea5e9',
    title: 'Fuentes de datos',
    subtitle: 'Cuatro submódulos para adquirir, homogeneizar y validar datos',
    estimatedMinutes: 3,
    url: '/modules/fuentes-datos',
    type: 'normal',
    script: "A la izquierda aparecen las familias de fuentes: estaciones, reanálisis, satélite, información de ríos y suelos, y proyecciones climáticas. Tienen resoluciones, unidades y formas de acceso diferentes.\n\nEl bloque central representa los adaptadores de pyhydra. Su trabajo es descargar, revisar y organizar esas entradas para que los métodos posteriores puedan utilizarlas. A la derecha se ve la salida común: tiempo, espacio y variable. Cuando corresponde, las referencias temporales se expresan en UTC y las coordenadas en WGS84.\n\nDebajo figuran los metadatos: fuente, fecha y consulta. Son necesarios para volver a obtener la entrada y detectar cambios. Homogeneizar el formato facilita el cálculo; la calidad y la representatividad de los datos siguen requiriendo revisión experta.",
    notes: "La salida común no garantiza calidad física. Revisar unidades, ausencias, representatividad y metadatos antes del análisis.",
    bullets: [
      'Precipitación: ERA5 (0.25°, horaria, desde 1940), GPM-IMERG (0.1°, 30 min, desde 2000, hasta 60°N/S), PERSIANN-CCS (~0.04°, horaria, desde 2003).',
      'Caudales fluviales: GloFAS-ERA5 (0.1°, desde 1979, modelo de tránsito H-TESSEL), GRDC, USGS.',
      'Cambio Climático: Modelos CMIP6 (ESGF y Copernicus Climate Data Store).',
      'Suelos: SoilGrids (250 m, archivo estático 2017, 7 profundidades), clasificación textural USDA automática.',
      'Estaciones: Meteostat agrega ~70.000 estaciones globales (NOAA ISD, DWD, AEMET, Environment Canada) con códigos OMM cruzables entre fuentes.',
    ],
    speakerGoal: "Mostrar qué transforma un adaptador de datos y qué conserva.",
    visualGuide: ["Cinco familias de fuentes a la izquierda","Adaptadores en el centro","Salida común y metadatos a la derecha"],
    speechCues: ["familias de fuentes","adaptadores","salida común","UTC","WGS84","metadatos"],
    transition: "Con las entradas identificadas y revisadas, podemos estimar la frecuencia de sus valores extremos.",
    transitionCue: "frecuencia de sus valores extremos"
  },

  {
    id: 14,
    block: 'Bloque climático-estadístico', blockColor: '#0ea5e9',
    title: 'Extremos y distribuciones GEV',
    subtitle: 'Estimación de eventos raros y su incertidumbre',
    estimatedMinutes: 3,
    url: '/modules/analisis-climatico',
    figure: 'fig_gev_comparacion.png', figurePosition: 'right',
    figureCaption: "Ejemplo ilustrativo de curvas GEV: estimadores, extrapolación y bandas; no constituye una validación comparativa.",
    type: 'split',
    script: "La figura es un ejemplo ilustrativo de lectura de curvas GEV. El eje horizontal es el período de retorno, en escala logarítmica; el vertical, la precipitación máxima anual. Los puntos negros representan la muestra del ejemplo. La curva azul corresponde a máxima verosimilitud, la roja a L-momentos y la verde a una aproximación bayesiana. La línea punteada es una referencia conocida en este ejemplo; en un problema real desconocemos la distribución verdadera.\n\nFijemos un período de retorno y comparemos las alturas de las curvas. La separación aumenta en la zona de extrapolación, donde hay pocos datos. Las bandas añaden la incertidumbre de la estimación; esta ilustración no constituye una validación comparativa de los métodos.\n\nEl módulo permite elegir y comparar estimadores. La inferencia bayesiana completa exige revisar convergencia y sensibilidad a los priors; una aproximación mediante Fisher es un procedimiento distinto, que veremos identificado en la demo.",
    notes: "Figura ilustrativa con distribución de referencia. No atribuir estos puntos a Turís ni interpretar la línea de referencia como una verdad conocida en casos reales. La demo MAP/Fisher y la inferencia bayesiana con MCMC son procedimientos distintos.",
    mathBlock: `
      <div class="gev-equation">
        <span>F(x; &mu;, &sigma;, &xi;) =</span>
        <span>exp { - [ 1 + &xi; ( (x - &mu;) / &sigma; ) ]<sup>-1/&xi;</sup> }</span>
      </div>
      <p class="gev-equation-caption">&mu;: localización · &sigma;: escala · &xi;: forma</p>
    `,
    bullets: [
      'Máxima verosimilitud: ajuste rápido, sensible a extremos aislados.',
      'L-momentos: opción robusta para registros cortos (menos de 30 años).',
      'Inferencia bayesiana: banda de credibilidad; exige revisar priors y convergencia.',
      'Aproximación de Fisher: alternativa de menor coste para análisis exploratorios.',
    ],
    speakerGoal: "Enseñar a leer una curva de niveles de retorno y su incertidumbre.",
    visualGuide: ["Eje horizontal: período de retorno","Puntos y curvas azul, roja y verde","Separación de métodos y bandas hacia la derecha"],
    speechCues: ["ejemplo ilustrativo","período de retorno","zona de extrapolación","bandas","comparar estimadores","procedimiento distinto"],
    transition: "Pero ajustar cada variable por separado no describe cómo ocurren conjuntamente.",
    transitionCue: "conjuntamente"
  },

  {
    id: 15,
    block: 'Bloque climático-estadístico', blockColor: '#0ea5e9',
    title: 'Dependencia multivariante y cópulas',
    subtitle: 'Relaciones conjuntas entre variables hidroclimáticas',
    estimatedMinutes: 3,
    url: '/tools/copulas',
    figure: 'fig_copula_joint_ret.png', figurePosition: 'right',
    figureCaption: 'Período de retorno conjunto (AND en rojo, OR en azul) para confluencias fluviales costeras',
    type: 'split',
    script: "En el panel central, el eje horizontal es el caudal Q y el vertical es el nivel del mar SL. Los puntos negros representan pares observados y los grises, combinaciones generadas. Los paneles de los bordes muestran las distribuciones de cada variable por separado.\n\nLa cópula conecta esas marginales y describe su dependencia. Las curvas rojas representan el período de retorno conjunto AND: ambos umbrales se superan. Las azules representan OR: se supera al menos uno. Por eso AND y OR no son intercambiables.\n\nLas cruces identifican combinaciones de máxima densidad conjunta sobre las curvas de diseño, el MPDE. Una curva contiene muchas parejas posibles: el diseño requiere justificar cuál se selecciona y para qué respuesta física. El módulo incorpora distintas familias de cópulas; la elección debe atender a la dependencia y al comportamiento de las colas, además del ajuste global.",
    notes: "Q está en m³/s y SL en metros. AND: ambos umbrales; OR: al menos uno. Las cruces MPDE localizan máxima densidad sobre una isolínea: no equivalen automáticamente a máxima respuesta hidráulica.",
    bullets: [
      'Familias: gaussiana para pico, duración y volumen; Gumbel, Clayton y Frank para eventos compuestos.',
      'T_OR: al menos una variable supera el umbral (diseño conservador).',
      'T_AND: superación simultánea (crítica en confluencias fluviales).',
      'Evento de diseño más probable: máximo de la densidad conjunta sobre la isolínea del período de retorno (Salvadori y De Michele).',
    ],
    speakerGoal: "Relacionar dependencia, AND/OR y evento de diseño con la figura.",
    visualGuide: ["Ejes Q y SL y puntos observados","Distribuciones marginales en los bordes","Curvas AND/OR y cruces de máxima densidad"],
    speechCues: ["caudal Q","nivel del mar SL","AND","OR","MPDE","muchas parejas posibles"],
    transition: "Una vez descritas las distribuciones y la dependencia, podemos generar escenarios que conserven las propiedades seleccionadas.",
    transitionCue: "generar escenarios"
  },

  {
    id: 16,
    block: 'Bloque climático-estadístico', blockColor: '#0ea5e9',
    title: 'Generación estocástica de escenarios',
    subtitle: 'Escenarios de lluvia coherentes en espacio y tiempo',
    estimatedMinutes: 2,
    url: '/modules/generacion-estocastica',
    figure: "anexo_stochastic_modelo.png", figurePosition: 'right',
    figureCaption: "Diagnóstico estacional de una demo sintética: media, desviación estándar y autocorrelación; «observado» designa la entrada de demostración.",
    type: 'split',
    script: "Esta captura muestra un diagnóstico de generación estocástica con datos de demostración sintéticos. Los tres gráficos comparan, mes a mes, la media, la desviación estándar y la autocorrelación de primer retardo de la serie de entrada con el modelo simulado. La etiqueta «observado» de la interfaz se refiere aquí a esa entrada de demostración.\n\nLa coincidencia de la media no sería suficiente: necesitamos representar también la dispersión y la persistencia temporal. Las diferencias del tercer gráfico recuerdan que cada propiedad debe revisarse antes de utilizar el ensemble.\n\nLa captura utiliza una demostración rápida; en la librería, CoSMoS combina una distribución marginal con una estructura de autocorrelación. Para precipitación espacial, NSRP y su extensión STNSRP representan además la coherencia entre localizaciones. El objetivo es generar trayectorias plausibles bajo esas hipótesis, no predecir exactamente el episodio que ocurrirá. La evolución de treinta realizaciones queda disponible en el anexo de generación.",
    notes: "Captura de una demo sintética: la entrada etiquetada «observado» también es sintética. La herramienta calibra con CoSMoS y utiliza una simulación rápida AR(1) estacional con transformación marginal. Los diagnósticos deben revisarse antes de usar el ensemble.",
    bullets: [
      'NSRP / STNSRP: lluvia puntual y multisitio calibrada con media, varianza, probabilidad de día seco y autocorrelación.',
      'CoSMoS: reproduce a la vez la distribución marginal y la autocorrelación estacional.',
      'MaxDiss: selecciona un subconjunto de escenarios que cubre todo el rango del ensemble.',
      'k-NN y clasificación de hidrogramas: reconstruyen los impactos de los escenarios no simulados.',
    ],
    speakerGoal: "Explicar generación y diagnóstico usando la captura correcta.",
    visualGuide: ["Tres gráficos: media, dispersión y autocorrelación","Barras de la serie de entrada y línea simulada","Condición previa a usar las realizaciones"],
    speechCues: ["datos de demostración sintéticos","media","desviación estándar","autocorrelación","CoSMoS","STNSRP","trayectorias plausibles"],
    transition: "Esas trayectorias deben convertirse ahora en una respuesta hidrológica e hidráulica.",
    transitionCue: "respuesta hidrológica e hidráulica"
  },

  {
    id: 17,
    block: 'Bloque de modelización', blockColor: '#0ea5e9',
    title: 'Modelos hidrológicos e hidráulicos',
    subtitle: 'Cinco submódulos para preparar y validar motores físicos',
    estimatedMinutes: 2,
    url: '/modules/modelizacion',
    type: 'normal',
    script: "El diagrama explica el contrato de los adaptadores. Los escenarios llegan por la izquierda. A continuación se preparan las entradas en el formato del motor, se ejecuta el programa registrando su versión y su resultado, se leen las salidas en estructuras comunes y se comprueba la plausibilidad de la simulación.\n\nLos motores de la derecha responden a problemas físicos distintos: HEC-HMS y SWAT en hidrología, SFINCS y HEC-RAS en hidráulica. El contrato común permite cambiar de motor sin rehacer los métodos estadísticos que generan sus entradas.\n\nIber aparece identificado como uso manual en los trabajos iniciales. Esa diferencia delimita qué estaba automatizado en cada caso. La arquitectura organiza la ejecución; la elección del modelo, la geometría y las condiciones de contorno siguen siendo decisiones científicas y de ingeniería.",
    notes: "El esquema del adaptador distingue preparación, ejecución, homogeneización y validación. Iber se usó manualmente en los trabajos fundacionales; no atribuirle integración automática.",
    bullets: [
      'HEC-HMS: calibración automática de parámetros frente a NSE, PBIAS o RMSE.',
      'SWAT+: simulación continua con forzamientos climáticos generados automáticamente.',
      'SFINCS: motor 2D rápido para campañas Monte Carlo de miles de escenarios.',
      'HEC-RAS 1D/2D: geometría e hidrogramas de entrada preparados automáticamente.',
      'Límite: Iber (Besaya, Mallorca) no tiene adaptador por falta de ejecución por lotes.',
    ],
    speakerGoal: "Explicar el contrato común que conecta escenarios y motores.",
    visualGuide: ["Escenarios de entrada","Cuatro operaciones del adaptador","Motores conectados e Iber manual"],
    speechCues: ["contrato","preparan las entradas","registrando su versión","estructuras comunes","plausibilidad","uso manual"],
    transition: "Con los métodos y los adaptadores conectados, podemos ofrecer la misma operación a través de una herramienta web.",
    transitionCue: "misma operación"
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
    script: "La figura conecta las herramientas visibles con el cálculo que realizan. El usuario selecciona datos y parámetros en la interfaz; la petición pasa por la API y llega al núcleo pyhydra. La respuesta vuelve con los resultados y sus figuras.\n\nAsí se accede a extremos, dependencia, interpolación o curvas IDF desde el navegador, utilizando los mismos métodos que los notebooks. El interés para la tesis es esa continuidad entre método documentado y operación reproducible.\n\nLa demostración siguiente recorre un único ejemplo: la entrada de una serie, el ajuste de extremos y la lectura de sus bandas. La valoración científica de los resultados reales vendrá después, en los casos.",
    notes: "Esta diapositiva explica el acceso al método; la siguiente demuestra su operación. Tiempo de demo previsto: aproximadamente 90 segundos adicionales a la explicación.",
    bullets: [
      'Simulación estocástica CoSMoS en 3 pasos',
      'Estimación de GEV bayesiana y curvas de retorno',
      'Cópulas compuestas y curvas AND/OR en confluencias',
      'Una demostración principal; el resto, preparado como material de reserva para preguntas',
    ],
    speakerGoal: "Distinguir acceso interactivo y núcleo científico antes de la demo.",
    visualGuide: ["Herramientas en la parte superior","API y núcleo compartido","Ruta de una petición"],
    speechCues: ["API","núcleo pyhydra","mismos métodos","entrada de una serie","lectura de sus bandas"],
    transition: "En esa demostración distinguiremos la serie que entra al cálculo, el estimador puntual y el origen de la incertidumbre mostrada.",
    transitionCue: "origen de la incertidumbre"
  },

  {
    id: 19,
    offlineScript: "Estas capturas permiten seguir la misma operación sin conexión. La primera muestra una serie demo sintética de precipitación diaria de 1980 a 2024; no son los datos observados de Turís. La herramienta identifica 124 eventos con un umbral de 39,322 milímetros y una separación de cinco días, pero ajusta la GEV a los 45 máximos anuales.\n\nPaso a la segunda captura. El eje horizontal representa el período de retorno y el vertical el nivel de precipitación. La curva verde es el ajuste MAP. La banda P5–P95 se obtiene mediante Fisher alrededor del ajuste MLE: es una aproximación de incertidumbre, no una posterior obtenida con MCMC.\n\nAl desplazarnos hacia períodos de retorno mayores, la banda se ensancha. La lectura para diseño incluye ambas cosas: el valor y la incertidumbre que lo acompaña. Después veremos cómo cambia una estimación real al incorporar un evento extraordinario.",

    offlineFrames: [{"src": "offline_gev_entrada.png", "label": "Datos y ajuste", "caption": "Serie sintética de demostración: entrada y configuración del ajuste GEV."}, {"src": "offline_gev_resultado.png", "label": "Resultado e incertidumbre", "caption": "Ejecución real de la serie sintética: MAP y bandas aproximadas de Fisher; no son los datos de Turís."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: "Demostración guiada: GEV MAP e incertidumbre aproximada",
    subtitle: "Máximos anuales, ajuste MAP y bandas mediante Fisher",
    estimatedMinutes: 2,
    url: '/tools/statistical',
    webMode: 'demo',
    webLabel: 'Evidencia 2 · Motor científico operativo',
    webPurpose: 'Enseñar una sola cadena científica completa, conectada con el caso Valencia.',
    webAction: 'Ejecutar un ajuste preparado y señalar resultado, incertidumbre y trazabilidad. Máximo 3 minutos.',
    type: 'normal',
    script: "La entrada seleccionada es una serie demo sintética. Sirve para mostrar la operación de la herramienta; los datos observados de Turís se analizarán en el caso Valencia.\n\nPrimero reviso la serie y el análisis elegido. El umbral identifica eventos, mientras que la GEV se ajusta a los máximos anuales. Después ejecuto el ajuste y paso a la gráfica de resultados. La curva puntual se obtiene mediante MAP, el máximo de la posterior. Las bandas de esta interfaz son una aproximación calculada mediante Fisher; no proceden de cadenas MCMC.\n\nEn la gráfica, el eje horizontal indica el período de retorno y el vertical el nivel estimado. Para un período de diseño leo conjuntamente la curva y la amplitud de la banda. Si la API falla, utilizo el respaldo identificado: procede del notebook de Valencia y tiene otros datos y otros métodos.",
    notes: "En vivo: revisar entrada → ejecutar → leer curva y banda. En capturas: alternar Datos y ajuste → Resultado e incertidumbre. La serie es sintética. La GEV usa máximos anuales; las bandas Fisher alrededor de MLE no son una posterior MCMC.",
    bullets: ["Serie demo sintética o CSV identificado.","Extracción de eventos por umbral; GEV sobre máximos anuales.","Ajuste puntual MAP y bandas aproximadas mediante Fisher.","Respaldo local: figura del notebook de Valencia, con método y procedencia."],
    speakerGoal: "Guiar una demo breve y explicar exactamente lo que calcula.",
    visualGuide: ["Entrada sintética y selección del análisis","Máximos anuales usados por la GEV","MAP y banda aproximada mediante Fisher"],
    speechCues: ["demo sintética","máximos anuales","MAP","Fisher","curva y la amplitud de la banda","respaldo identificado"],
    transition: "La demo muestra que el método puede ejecutarse. Los casos permiten valorar qué conocimiento y qué capacidad operativa aporta.",
    transitionCue: "Los casos",
    offlineSpeechCues: ["primera","demo sintética","45 máximos anuales","segunda captura","MAP","Fisher alrededor del ajuste MLE","valor y la incertidumbre"]
  },

  {
    id: 20,
    offlineFrames: [{"src": "anexo_stochastic_modelo.png", "label": "Diagnóstico estacional", "caption": "Demo sintética 1990–2019: media, desviación estándar y autocorrelación mensual."}, {"src": "anexo_stochastic_resultado.png", "label": "Ensemble", "caption": "30 realizaciones para 2025, semilla 42; bandas entre trayectorias, no un pronóstico observado."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: generación de series sintéticas',
    subtitle: "Calibración estacional y ensemble de 30 realizaciones",
    estimatedMinutes: 2,
    url: '/tools/stochastic',
    type: 'normal',
    backup: true,
    script: "Estas dos capturas documentan la generación estocástica. Partimos de la serie demo sintética de caudal diario de 1990 a 2019. La primera figura compara, mes a mes, la media, la desviación estándar y la autocorrelación de primer retardo del registro de entrada y de las realizaciones. Después mostramos 30 realizaciones para 2025, obtenidas con semilla 42: la línea resume la mediana y las bandas muestran la dispersión entre trayectorias. No estamos prediciendo el caudal observado de 2025; estamos generando escenarios plausibles. La interfaz calibra con CoSMoS y utiliza una simulación rápida mediante AR(1) estacional y transformación a las marginales ajustadas. Debemos comprobar sus diagnósticos antes de utilizar el ensemble en un cálculo de diseño.",
    notes: "Capturas de la API ejecutada el 6 de octubre de 2026. Mostrar primero el diagnóstico estacional y después el ensemble. Datos demo sintéticos; 30 años de calibración y 30 realizaciones de un año. La simulación rápida conserva la marginal y aproxima la dependencia con AR(1), no toda la estructura temporal de una simulación CoSMoS completa.",

  },

  {
    id: 21,
    offlineFrames: [{"src": "anexo_sensitivity_resultado.png", "label": "Manning e impacto", "caption": "CSV demo HEC-RAS: 1000 simulaciones; relaciones con calado medio, mediano y área inundada."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: sensibilidad de la rugosidad',
    subtitle: "Diagnóstico del ensemble hidráulico ya calculado",
    estimatedMinutes: 1,
    url: '/tools/sensitivity',
    type: 'normal',
    backup: true,
    script: "Esta captura procede del análisis del CSV demo de mil simulaciones HEC-RAS. Cada punto corresponde a una simulación del ensemble y relaciona una medida de Manning con el calado medio, el calado mediano o el área inundada. Las rectas resumen una asociación lineal simple: el R cuadrado del calado medio es 0,0069 y el del calado mediano, 0,0014. Una relación lineal tan débil no significa que la rugosidad carezca de efecto. Puede haber respuestas no lineales, umbrales topográficos y otros controles. Esta herramienta analiza salidas ya calculadas; no vuelve a ejecutar HEC-RAS ni reproduce aquí las 995 parejas HEC-RAS y SFINCS del contraste principal. La figura permite explicar por qué necesitamos mirar la distribución del impacto y sus regímenes, además de una única regresión.",
    notes: "La demo lee un CSV con 1000 simulaciones HEC-RAS y calcula estadísticos, correlaciones y regresiones. Distinguir este CSV del conjunto emparejado y depurado de 995 realizaciones por motor presentado en el caso principal. No afirmar que la interfaz elige distribuciones de Manning ni ejecuta los motores hidráulicos.",

  },

  {
    id: 22,
    offlineFrames: [{"src": "anexo_idf_resultado.png", "label": "Curvas IDF", "caption": "Demo: 40 años sintéticos, 7 duraciones y GEV MAP; una curva por período de retorno."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: curvas IDF',
    subtitle: "Intensidad, duración y frecuencia: qué representa cada curva",
    estimatedMinutes: 1,
    url: '/tools/idf',
    type: 'normal',
    backup: true,
    script: "La captura muestra una curva IDF obtenida con la demo sintética: cuarenta años de máximos anuales y siete duraciones, desde diez minutos hasta veinticuatro horas. Para cada duración se ajusta una GEV mediante MAP y se calculan intensidades asociadas a varios períodos de retorno. Cada línea representa un período de retorno distinto; la intensidad disminuye al aumentar la duración. Este producto organiza los extremos de precipitación y puede ser una entrada de diseño. Por sí solo no describe la forma temporal completa de la tormenta, la humedad antecedente ni la respuesta hidráulica. Por eso sirve para explicar la diferencia entre caracterizar la lluvia y calcular la frecuencia del impacto. Las cifras de esta demo no son los resultados del estudio IAHR 2022.",
    notes: "Figura obtenida ejecutando /tools/idf con datos sintéticos. Ajuste MAP por duración. Usar como explicación de las curvas IDF, no como reproducción del experimento IAHR 2022 ni de sus caudales.",

  },

  {
    id: 23,
    offlineFrames: [{"src": "anexo_rfa_resultado.png", "label": "Curva y homogeneidad", "caption": "Demo regional de 5 estaciones sintéticas; L-momentos y H = 0,386."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: análisis de frecuencia regional',
    subtitle: "Curva regional normalizada y comprobación de homogeneidad",
    estimatedMinutes: 1,
    url: '/tools/rfa',
    type: 'normal',
    backup: true,
    script: "En esta captura usamos cinco estaciones sintéticas con cuarenta años de máximos anuales. El análisis regional divide los datos por el caudal índice de cada estación y ajusta una curva común mediante L-momentos. La figura central muestra el factor de crecimiento q de T. Para recuperar el nivel en una estación, multiplicamos ese factor por su caudal índice. A la derecha comprobamos la homogeneidad: en esta demo, H vale 0,386 y queda por debajo de uno. También se revisa la discordancia de las estaciones antes de agruparlas. Es una explicación del procedimiento index-flood; no son las 224 estaciones del caso Valencia ni sus períodos de retorno. La selección de la región debe justificarse físicamente, porque agrupar estaciones inadecuadas puede suavizar en exceso un extremo local.",
    notes: "Captura real de /tools/rfa: 5 estaciones sintéticas, 40 años, L-momentos, H=0,386. No confundir con Valencia. Etiquetas completas de períodos 25, 50, 200 y 500 verificadas.",

  },

  {
    id: 24,
    offlineFrames: [{"src": "anexo_interpolation_resultado.png", "label": "Mapa kriging", "caption": "Demo de 8 estaciones: mapa de kriging ordinario sobre una malla de 45 × 45 puntos."}, {"src": "anexo_interpolation_rmse.png", "label": "Validación LOOCV", "caption": "RMSE de la demo: kriging 14,796; IDW 15,281; RBF 19,327. La comparación depende de esta red."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: interpolación espacial',
    subtitle: "Comparar campos interpolados y error de validación cruzada",
    estimatedMinutes: 1,
    url: '/tools/interpolation',
    type: 'normal',
    backup: true,
    script: "La captura compara métodos sobre la misma demo de ocho estaciones: IDW, kriging ordinario y una función de base radial. En el mapa, los puntos sitúan las estaciones y el campo continuo representa la variable interpolada en los puntos objetivo. La validación cruzada deja fuera una estación, predice su valor con las restantes y repite el proceso para calcular el RMSE. Así podemos comparar métodos con los mismos datos y no solo por el aspecto del mapa. Esta interfaz muestra kriging ordinario; no incluye aquí la covariable de elevación de un kriging universal. Tampoco convierte una red escasa en observaciones nuevas: la calidad sigue limitada por la distribución de estaciones y la estructura espacial de la variable.",
    notes: "Captura de la ejecución local de /tools/interpolation. Demo de 8 estaciones; IDW, kriging ordinario y RBF. Señalar el mapa y el RMSE LOOCV. No presentar como reproducción de Andes o Mallorca ni como kriging universal con DEM.",

  },

  {
    id: 25,
    offlineFrames: [{"src": "anexo_bias_resultado.png", "label": "Antes y después", "caption": "Demo sintética de precipitación: QDM multiplicativo, CDF y medias mensuales."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: corrección de sesgo climático',
    subtitle: "Distribuciones y medias mensuales antes y después de corregir",
    estimatedMinutes: 1,
    url: '/tools/bias',
    type: 'normal',
    backup: true,
    script: "Esta captura usa treinta años de precipitación diaria sintética y la opción multiplicativa de Quantile Delta Mapping. A la izquierda se comparan las distribuciones acumuladas de la referencia, del modelo bruto y del modelo corregido. A la derecha, las medias mensuales permiten comprobar la estacionalidad y cómo cambia el sesgo. La corrección se calibra en un período histórico y se aplica al escenario: su objetivo es ajustar el sesgo sin borrar la señal de cambio, por lo que la distribución futura corregida no tiene por qué coincidir exactamente con la observación histórica. La interfaz permite también otras opciones, como Scaled Distribution Mapping. Esta es una demostración del módulo; las capturas no corresponden a datos de Panamá, Andes o SIMPCCe. En esos proyectos hay que documentar además el método, las variables y los períodos empleados.",
    notes: "Captura de /tools/bias con demo sintética y QDM multiplicativo. No afirmar que este resultado reproduce las 414 combinaciones de Panamá ni que todos los proyectos usaron idéntica configuración. Señalar CDF, medias mensuales y conservación de la señal del escenario.",

  },

  {
    id: 26,
    offlineFrames: [{"src": "anexo_compound_resultado.png", "label": "Período de retorno conjunto y MPDE", "caption": "Demo sintética de 120 pares caudal–nivel del mar: Gumbel, isolíneas AND/OR y MPDE."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: 'Demostración: eventos compuestos',
    subtitle: "Isolíneas AND/OR y evento de diseño de máxima probabilidad",
    estimatedMinutes: 1,
    url: '/tools/compound',
    type: 'normal',
    backup: true,
    script: "La captura muestra el ajuste de una cópula Gumbel a ciento veinte pares de caudal máximo y nivel del mar de la demo sintética. Los puntos representan los pares de la muestra y las líneas describen períodos de retorno conjuntos. En azul, OR significa que al menos una de las dos variables supera su umbral; en rojo, AND exige que ambas lo superen simultáneamente. Las cruces localizan el evento de máxima densidad conjunta sobre cada isolínea, el MPDE. Hay múltiples combinaciones de caudal y nivel que comparten un mismo período de retorno conjunto: por eso el diseño compuesto no se reduce a sumar dos extremos univariantes. Podemos comparar familias de cópulas, pero la elección debe atender a la dependencia y a las colas. La figura está guardada localmente y puede explicarse sin ejecutar la herramienta.",
    notes: "Captura real de /tools/compound con familia Gumbel y 120 pares sintéticos. Distinguir OR y AND y explicar las cruces MPDE. Los puntos de demo no son observaciones de un caso piloto.",

  },

  // ════════════════════════════════════════════════════
  // BLOQUE 7 — CASOS PILOTO Y VALIDACIÓN CIENTÍFICA
  // ════════════════════════════════════════════════════

  {
    id: 27,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Nueve casos, tres dimensiones de validación',
    subtitle: 'Tres reproducibles con notebooks en HYDRA; seis documentados desde su publicación o proyecto',
    estimatedMinutes: 2,
    type: 'table',
    script: "La tabla reúne las nueve aplicaciones. Las filas indican los problemas y las columnas, los componentes que intervienen. La última distingue los casos hoy reproducibles con notebooks en HYDRA: Besaya, Calle 30 y Valencia. Los otros seis se documentan mediante sus publicaciones o proyectos y contribuyeron a definir la arquitectura.\n\nEl recorrido responde a tres preguntas. Primero: ¿cómo se calcula la frecuencia del impacto y cuánto depende del modelo? Lo veremos en Besaya, Mallorca y Calle 30. Segundo: ¿qué ocurre cuando los datos y el método condicionan el diseño? Lo muestran Valencia, Tanganica e IAHR. Tercero: ¿puede repetirse el flujo a otra escala y con otra finalidad? Andes, SIMPCCe y Panamá permiten valorarlo.\n\nCada caso aportará una respuesta concreta a esas preguntas.",
    notes: "Mantener la distinción entre evidencia histórica/documentada y reproducibilidad actual. Tres casos disponen de notebooks ejecutables en la plataforma.",
    bullets: [
      'Frecuencia sobre el impacto: cuenca fluvial cantábrica (Besaya).',
      'Cadena en cuenca sin aforo: precipitación espacial y modelización 2D (Mallorca).',
      'Infraestructura urbana crítica: de la lluvia multisitio al calado en túneles (Madrid Calle 30).',
      'Valencia: estimación de extremos e incertidumbre tras la DANA de 2024.',
      'Niveles lacustres con registros limitados: clima, caudal y cotas futuras (lago Tanganica).',
      'Calibración hidrológica regional: transformación lluvia–caudal a gran escala (Andes).',
      'Contraste IAHR 2022: procedimiento convencional frente a cadena estocástica completa.',
      'Gestión climática de embalses: caudales mínimos y apoyo a decisiones (SIMPCCe).',
      'Automatización nacional: cientos de combinaciones climáticas y capas de riesgo (Panamá).',
    ],
    speakerGoal: "Dar a cada caso una pregunta distinta y delimitar su reproducibilidad.",
    visualGuide: ["Filas: aplicaciones","Columnas: componentes y disponibilidad en HYDRA","Tres preguntas de validación"],
    speechCues: ["última","Besaya, Calle 30 y Valencia","frecuencia del impacto","datos y el método","otra escala"],
    transition: "Empezamos en Besaya, donde se formuló el principio que debe conservar toda la arquitectura.",
    transitionCue: "principio"
  },

  {
    id: 28,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "Besaya: cuánto cambia el impacto al cambiar de motor",
    subtitle: 'Dos trabajos sobre el mismo dominio que no deben confundirse',
    estimatedMinutes: 3,
    url: '/cases/manning-rugosidades', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "besaya_fig04_intermodel_comparison.png", figurePosition: 'right',
    figureCaption: "Las 995 realizaciones emparejadas muestran diferencias entre HEC-RAS y SFINCS",


    caseReference: 'Referencia: Memoria doctoral, cap. 7 (Besaya); manuscrito enviado a Environmental Modelling & Software',
    type: 'split',
    results: [
      { value:'1.990', label:'simulaciones hidráulicas 2D', implication:'995 realizaciones emparejadas en HEC-RAS y SFINCS' },
      { value:'7,4 ha', label:'compartimento secundario activado', implication:'bifurcación asociada al umbral topográfico de 60,1 m' },
      { value:'8,4 %', label:'CV del área en HEC-RAS', implication:'frente al 2,0 % obtenido con SFINCS' },
    ],
    pyhydraRole:'Convierte un ensemble de parámetros y dos motores hidráulicos en una comparación probabilística trazable del impacto.',
    pyhydraModules:['pyhydra.modeling','pyhydra.modeling.hydraulic','HEC-RAS 2D','SFINCS'],
    processSteps:['Manning Monte Carlo','HEC-RAS 2D + SFINCS','Comparación emparejada','Distribuciones de impacto'],
    script: "Los paneles superiores comparan 995 simulaciones emparejadas: SFINCS en el eje horizontal y HEC-RAS en el vertical. La diagonal discontinua indica igualdad. Cada punto alejado de ella representa una diferencia entre motores para una realización emparejada. Las correlaciones son moderadas: 0,52 para calado y 0,49 para área.\n\nLos paneles inferiores muestran las distribuciones del ensemble. En verde aparece SFINCS y en rojo HEC-RAS. La distribución roja es más dispersa; en el área distingue dos regímenes relacionados con la activación de un compartimento secundario.\n\nEl mecanismo topográfico se documenta en el anexo: un collado a cota 60,1 metros controla unas 7,4 hectáreas adicionales. Se realizaron 995 pares, 1.990 simulaciones en total, variando la rugosidad de Manning. Esta comparación muestra incertidumbre estructural y sensibilidad. Sin un contraste observacional adicional, la diferencia no determina por sí sola qué motor reproduce mejor la realidad.",
    notes: "995 pares = 1.990 ejecuciones. Explicar primero diagonal 1:1 y después distribuciones. La bifurcación topográfica tiene un anexo propio. Diferencia entre motores y validación frente a observaciones son preguntas diferentes.",
    bullets: [
      'Enfoque Monte Carlo: 995 simulaciones hidráulicas emparejadas sobre 9 usos de suelo (Manning).',
      'Incertidumbre: Variabilidad inter-modelo (motores) > Variabilidad intra-modelo (rugosidad, <2% de la varianza).',
      'Bifurcación: un collado a cota 60,1 m s.n.m. controla la conexión con una llanura secundaria de unas 7,4 ha.',
      'Respuesta bimodal: HEC-RAS muestra saltos discretos (sesgo +0,172 m, r=0,52) no capturados por SFINCS.',
    ],
    speakerGoal: "Leer las diferencias entre motores en los cuatro paneles.",
    visualGuide: ["Paneles superiores: pares SFINCS/HEC-RAS y diagonal 1:1","Paneles inferiores: distribuciones de calado y área","Regímenes asociados a la topografía"],
    speechCues: ["995 simulaciones emparejadas","diagonal","0,52","0,49","distribuciones","dos regímenes","no determina por sí sola"],
    transition: "En Mallorca cambia la dificultad de partida: disponer de muy pocos datos hidrológicos para construir y contrastar la cadena.",
    transitionCue: "muy pocos datos hidrológicos"
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
    figureCaption: 'Cadena fundacional documentada en la memoria: el período de retorno se estima a partir del resultado hidráulico',
    caseReference: 'Referencia: TFM (2017); Revista de Obras Públicas 3598 (2018); memoria doctoral, cap. 7',
    type: 'split',
    results: [
      { value:'3 variables', label:'pico, volumen y duración', implication:'dos avenidas con el mismo pico pueden causar impactos distintos' },
      { value:'Iber', label:'motor hidráulico de 2018', implication:'empleado manualmente, sin adaptador por lotes en pyhydra' },
      { value:'T(calado)', label:'frecuencia sobre el impacto', implication:'no se hereda directamente del caudal pico' },
    ],
    pyhydraRole:'Formaliza después los bloques repetibles que este trabajo reveló como necesarios: eventos, dependencia, modelos y postproceso.',
    pyhydraModules:['pyhydra.climate','pyhydra.climate.time_series','cópulas','Iber'],
    processSteps:['Aforos','Qp + V + duración','Cópula gaussiana','Hidrogramas','Iber → T(calado)'],
    script: "La figura reconstruye la cadena del Besaya de 2018. A la izquierda están los aforos. De ellos se extraen avenidas independientes y se describen mediante pico, volumen y duración. La cópula gaussiana conserva su dependencia y permite generar hidrogramas plausibles.\n\nLa simulación con Iber transforma cada hidrograma en calados y extensión inundada. El último bloque reúne esas salidas para estimar su frecuencia. Ese es el resultado conceptual: el período de retorno del impacto se calcula después de simular la respuesta, sobre la variable que interesa para la decisión.\n\nEste trabajo precede a la arquitectura actual de pyhydra. Su valor en la defensa es mostrar el procedimiento científico que después hubo que hacer repetible y transferible. La aplicación siguiente utiliza el mismo dominio para formular otra pregunta: cuánto cambia el resultado al cambiar la hidráulica.",
    notes: "El TFM y el artículo preceden a la arquitectura actual. La frecuencia de calado/extensión se estima después de la simulación hidráulica.",
    bullets: [
      'Los datos de partida son caudales observados, no precipitación.',
      'La dependencia conjunta se modela entre caudal pico, volumen y duración.',
      'Iber fue el motor de la publicación fundacional de 2018.',
      'El estudio HEC-RAS/SFINCS pertenece a una etapa posterior de sensibilidad sobre el mismo dominio.',
    ],
    speakerGoal: "Mostrar dónde se calcula la frecuencia dentro de la cadena fundacional.",
    visualGuide: ["Aforos y descripción multivariante","Hidrogramas generados y simulación con Iber","Distribución del impacto al final"],
    speechCues: ["pico, volumen y duración","cópula gaussiana","Iber","último bloque","después de simular la respuesta","precede"],
    transition: "Una cadena reproducible permite comparar sus componentes; en el Besaya la comparación se hizo entre dos motores hidráulicos.",
    transitionCue: "dos motores hidráulicos"
  },

  {
    id: 30,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "Mallorca: reconstruir la cadena con pocos datos",
    subtitle: 'Sant Llorenç des Cardassar (Episodio de octubre 2018)',
    estimatedMinutes: 2,
    url: '/cases/mallorca-sant-llorenc', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_mallorca_comparativa.png', figurePosition: 'right',
    figureCaption: 'Calados en Sant Llorenç: Metodología clásica (izquierda) vs Enfoque Estocástico Completo (derecha)',
    caseReference: 'Referencia: Caso Sant Llorenç (2019); memoria doctoral, cap. 7',
    type: 'split',
    results: [
      { value:'Miles', label:'de tormentas sintéticas', implication:'amplían registros horarios cortos' },
      { value:'k = 6', label:'vecinos óptimos para reconstrucción', implication:'calados y velocidades no simulados' },
      { value:'Impacto', label:'frecuencia calculada sobre calado', implication:'mancha distinta a la metodología basada en lluvia' },
    ],
    pyhydraRole:'Une lluvia sintética, interpolación espacial, simulación física y reconstrucción de impactos en una cuenca sin aforos.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','pyhydra.climate.spatial_analysis','Iber 2D'],
    processSteps:['Lluvia observada','Cópulas + kriging','MaxDiss + Iber 2D','k-NN','T sobre calado'],
    script: "Los dos mapas corresponden al mismo entorno urbano de Sant Llorenç. El panel izquierdo muestra el procedimiento clásico y el derecho el enfoque estocástico. Los colores representan calado; la comparación permite ver que la respuesta cambia espacialmente y que las diferencias no se resumen con un factor único.\n\nEl problema de partida era una cuenca sin aforos, tras la tormenta del 9 de octubre de 2018. Se reconstruyó la precipitación mediante clasificación de hietogramas, dependencia entre pluviómetros y kriging. El cálculo hidrológico utilizó una malla de 25 metros y la hidráulica con Iber, una de 8 metros basada en LiDAR.\n\nLa extensión se contrastó con la referencia disponible de Copernicus, con concordancia razonable. El máximo de 5,85 metros es un calado simulado, no una medición de campo. El caso amplía el principio del Besaya a una cadena que debe comenzar en la lluvia espacial.",
    notes: "Panel izquierdo: procedimiento clásico; derecho: estocástico. Copernicus aporta referencia de extensión. 5,85 m es un máximo modelado, no una medición observada.",
    bullets: [
      'Sin aforo: contraste cualitativo con la mancha Copernicus y con marcas documentadas del episodio.',
      'Clasificación PCA + k-means: 25 formas representativas de hietograma histórico.',
      'Cópula gaussiana: acopla máximo, media, duración y tipo de tormenta entre pluviómetros.',
      'Doble malla: hidrología a 25 m, hidráulica a 8 m (LiDAR, Iber); calado máximo simulado de 5,85 m.',
    ],
    speakerGoal: "Explicar qué compara el mapa y qué validación permite el caso.",
    visualGuide: ["Izquierda: procedimiento clásico; derecha: enfoque estocástico","Calado y extensión en la trama urbana","Alcance del contraste con Copernicus"],
    speechCues: ["mismo entorno urbano","clásico","estocástico","sin aforos","Copernicus","calado simulado"],
    transition: "La siguiente aplicación añade una exigencia operativa: hacer viable esa cadena en una infraestructura crítica.",
    transitionCue: "infraestructura crítica"
  },

  {
    id: 31,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Calle 30, Madrid: Infraestructura crítica urbana',
    subtitle: 'Túneles de la M-30: la cadena completa, en el proyecto FORESEE con Ferrovial',
    estimatedMinutes: 3,
    figure: 'fig_m30_metodologia_auditorio.svg', figurePosition: 'right',
    figureCaption: 'Cadena Calle 30: lluvia multisitio → HEC-HMS → selección MaxDiss → HEC-RAS 1D → reconstrucción k-NN',
    caseReference: 'Referencia: Navas et al., Ingeniería del Agua (2024); proyecto FORESEE/Ferrovial; memoria, cap. 7',
    type: 'split',
    results: [
      { value:'1D', label:'modelo hidráulico HEC-RAS', implication:'representa la red de túneles de Calle 30' },
      { value:'Miles', label:'eventos sintéticos multisitio', implication:'MaxDiss selecciona un subconjunto representativo' },
      { value:'Mapa T', label:'período de retorno por píxel', implication:'la frecuencia se calcula sobre el calado' },
    ],
    pyhydraRole:'Orquesta la cadena lluvia–caudal–hidráulica y permite asignar frecuencia directamente al calado en la red de túneles.',
    pyhydraModules:['pyhydra.climate','pyhydra.modeling','HEC-HMS','HEC-RAS 1D','MaxDiss + k-NN'],
    processSteps:['Lluvia multisitio','Cópulas','Selección inicial','HEC-HMS','MaxDiss + HEC-RAS 1D','k-NN → T(calado)'],
    script: "La figura de Calle 30 se lee de izquierda a derecha y contiene dos selecciones distintas. Primero se generan eventos de lluvia multisitio a partir de extremos de precipitación y cópulas. Un subconjunto inicial se transforma en hidrogramas con HEC-HMS.\n\nDespués actúa MaxDiss sobre esos hidrogramas: selecciona los casos representativos que se simularán con HEC-RAS 1D en la red canalizada y de túneles. Es importante mantener ese orden. MaxDiss no sustituye a HEC-HMS. Finalmente, k-NN reconstruye los impactos de los escenarios no simulados explícitamente.\n\nEl último bloque calcula el período de retorno del calado. La reducción de simulaciones hace viable la exploración, pero su resultado debe evaluarse sobre esa variable de impacto. El caso aporta una cadena aplicada completa y transferida al contexto industrial de FORESEE y Ferrovial. El mapa de la red queda disponible como apoyo en los anexos.",
    notes: "Orden: preselección de lluvia → HEC-HMS → MaxDiss sobre hidrogramas → HEC-RAS 1D → k-NN → frecuencia del calado. La malla de salida no transforma el motor hidráulico 1D en 2D.",
    bullets: [
      'Multisitio: Precipitación espacialmente correlacionada (cópulas gaussianas) en los distritos de Madrid.',
      'Cadena física: HEC-HMS genera los caudales de entrada y HEC-RAS 1D modela la red de túneles.',
      'Eficiencia computacional: MaxDiss evita simular exhaustivamente los miles de eventos sintéticos.',
      'Reconstrucción: k-NN estima los calados de los escenarios no simulados explícitamente.',
      'Transferencia industrial directa: caso desarrollado con Ferrovial dentro del proyecto FORESEE.',
    ],
    speakerGoal: "Explicar las dos selecciones del flujo de Calle 30.",
    visualGuide: ["Lluvia multisitio y preselección inicial","HEC-HMS antes de MaxDiss","HEC-RAS 1D, reconstrucción y frecuencia del calado"],
    speechCues: ["dos selecciones","HEC-HMS","Después","MaxDiss","HEC-RAS 1D","k-NN","período de retorno del calado"],
    transition: "Ahora podemos leer el resultado hidráulico de esa cadena en las gráficas de análisis interactivo.",
    transitionCue: "resultado hidráulico"
  },

  {

    id: 32,
    offlineFrames: [{"src": "offline_calle30_analisis.png", "label": "Análisis interactivo", "caption": "Calle 30: curvas de período de retorno y perfil longitudinal de calados; enfoque basado en cópulas frente al clásico."}],
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Calle 30 en HYDRA: análisis interactivo',
    subtitle: 'Del forzamiento meteorológico al período de retorno del calado',
    estimatedMinutes: 1,
    url: '/cases/m30-manzanares', anchor: '#m30-interactive-heading', anchorPosition: 'start',
    webMode: 'evidence',
    webLabel: 'Evidencia 3 · Transferencia industrial',
    webPurpose: 'Comparar los resultados del enfoque basado en cópulas y del procedimiento clásico en el análisis interactivo de Calle 30.',
    webAction: "Abrir Análisis interactivo. Comparar un período de retorno en el Puente de Toledo y una sección en el perfil T100/T500. Utilizar cursor y leyenda; dejar la nube MaxDiss como apoyo opcional.",
    type: 'split',
    figure: 'foto_tunel_infraestructura_critica.png', figurePosition: 'right',
    figureCaption: 'La variable relevante para la operación no es solo la lluvia: es la cota alcanzada dentro de una infraestructura crítica',
    caseReference: 'Referencia: Navas et al., Ingeniería del Agua (2024); proyecto FORESEE/Ferrovial',
    results: [
      { value:'HEC-RAS 1D', label:'modelo de la red de túneles', implication:'no es una simulación hidráulica 2D' },
      { value:'MaxDiss + k-NN', label:'selección y reconstrucción', implication:'hacen viable explorar miles de eventos' },
      { value:'T(calado)', label:'resultado de diseño', implication:'frecuencia del impacto, no solo de la lluvia' },
    ],
    pyhydraRole:'Hace navegable y repetible el flujo completo del caso, desde la precipitación multisitio hasta el mapa de impacto.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','pyhydra.modeling','MaxDiss + k-NN'],
    script: "La página se abre directamente en Análisis interactivo. Empezamos por la gráfica izquierda: el eje horizontal es el período de retorno y el vertical el calado en el Puente de Toledo. Para un mismo período, comparemos las series del procedimiento clásico y del basado en cópulas. El cursor permite leer sus valores y la leyenda, aislarlas.\n\nLa gráfica derecha cambia la pregunta. Su eje horizontal recorre el tramo; los perfiles muestran cómo varía el calado para períodos de retorno de cien y quinientos años. Las diferencias entre procedimientos dependen también de la sección que observamos.\n\nEstas dos lecturas conectan la cadena anterior con una decisión localizada: qué calado considerar aquí y con qué frecuencia. La nube MaxDiss queda más abajo como detalle de selección, disponible si necesitamos explicar la reducción de escenarios.",
    offlineScript: "La captura conserva las dos gráficas de Análisis interactivo. A la izquierda está el calado en el Puente de Toledo frente al período de retorno. Para un mismo período se comparan las series del enfoque clásico y del basado en cópulas.\n\nA la derecha, el eje horizontal recorre el tramo y los perfiles representan los calados para períodos de retorno de cien y quinientos años. La comparación muestra que las diferencias entre procedimientos también dependen de la sección.\n\nEsta copia es una imagen: para leer valores con el cursor y activar o desactivar series hay que abrir la herramienta en vivo. La conclusión que sí podemos explicar con la captura es cómo el resultado de toda la cadena se convierte en una comparación hidráulica localizada.",
    notes: "La visita principal se limita a Análisis interactivo: comparar curva de Puente de Toledo y perfil T100/T500. El cursor y la leyenda operan en vivo; la copia preparada conserva imágenes. MaxDiss es una ampliación opcional.",
    bullets: [
      'Curvas de período de retorno del calado en el Puente de Toledo.',
      'Perfil longitudinal para períodos de retorno de cien y quinientos años.',
      'Cursores y leyendas para consultar y comparar las series en vivo.',
      'Nube de eventos representativos seleccionados mediante MaxDiss.',
    ],
    speakerGoal: "Guiar dos comparaciones visibles sin dispersarse por la web.",
    visualGuide: ["Curva de período de retorno en Puente de Toledo","Perfil longitudinal T100/T500","Cursor y leyenda de las series"],
    speechCues: ["Análisis interactivo","gráfica izquierda","mismo período","gráfica derecha","cien y quinientos años","decisión localizada"],
    transition: "Hasta aquí hemos propagado escenarios por modelos físicos. Valencia plantea otra dificultad: que un solo dato extremo cambie el ajuste de entrada.",
    transitionCue: "un solo dato extremo",
    offlineSpeechCues: ["izquierda","Puente de Toledo","mismo período","derecha","cien y quinientos años","Esta copia es una imagen","comparación hidráulica localizada"]
  },

  {
    id: 33,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Valencia: Análisis rápido ante la DANA del 2024',
    subtitle: 'Qué cambia en los estimadores de extremos cuando entra un evento sin precedente',
    estimatedMinutes: 3,
    figure: 'fig_valencia_t100_auditorio.svg', figurePosition: 'right',
    figureCaption: 'Turís (8337X): T100 bayesiano pasa de 260 a 952 mm; las curvas completas están en los anexos',
    caseReference: 'Referencia: VIII Jornadas de Ingeniería del Agua (2025); memoria doctoral, cap. 7',
    type: 'split',
    results: [
      { value:'710,8 mm', label:'precipitación en 24 h', implication:'máximo de la serie de Turís, muy por encima de los valores previos' },
      { value:'+266 %', label:'cambio del cuantil T100 bayesiano', implication:'de 260 a 952 mm al incorporar la DANA' },
      { value:'66–91 años', label:'período de retorno con el evento incluido', implication:'los tres estimadores convergen; sin él, de 3.069 (Bayes) a 31.345 años (L-mom.)' },
    ],
    pyhydraRole:'Permite recalcular rápidamente extremos e incertidumbre cuando entra en la serie un evento sin precedente histórico.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate.time_series','PyMC','análisis regional'],
    processSteps:['224 estaciones','Máximos anuales','GEV: 3 estimadores','RFA local/global','Antes ↔ después'],
    script: "Las dos barras responden a la misma pregunta: cuál es el nivel de precipitación asociado a un período de retorno de cien años en Turís. Cambia la muestra utilizada para estimarlo. Sin incorporar la DANA, el ajuste bayesiano da 260 milímetros; al incluirla, 952. Es un incremento del 266 por ciento del nivel estimado para T100.\n\nLa DANA del 29 de octubre de 2024 dejó 710,8 milímetros en 24 horas en esa estación. Ese valor observado es distinto de las alturas de las barras. También es distinta la pregunta de qué período de retorno se asigna al episodio: con el evento incorporado, los estimadores lo sitúan entre 66 y 91 años; sin él, extrapolan frecuencias mucho más raras.\n\nLa figura muestra cuánto condiciona un extremo la inferencia con series cortas. HYDRA permite repetir el análisis y comparar métodos. La decisión debe comunicar esa sensibilidad y las bandas de incertidumbre; recalcular no convierte automáticamente un estimador en la verdad.",
    notes: "Distinguir tres magnitudes: lluvia observada (710,8 mm), nivel de retorno T100 (260/952 mm) y período de retorno asignado al episodio (66–91 años al incorporarlo). El +266 % se refiere al cambio del nivel T100 bayesiano.",
    bullets: [
      'Valencia (29-10-2024): 710,8 mm en 24 h en Turís (8337X), máximo de su serie.',
      'Sin el evento: período de retorno > 11.000 años (MLE), > 31.000 (L-momentos) y ≈ 3.069 (bayesiano).',
      'Con el evento: los tres estimadores convergen en 66–91 años; T100 bayesiano de 260 a 952 mm.',
      'Análisis regional: el local (9 estaciones) da 34–41 años; el global suaviza el evento hasta 10–19 años.',
      'Lección: con series cortas, comparar estimadores y comunicar bandas, no una cifra puntual.',
    ],
    speakerGoal: "Relacionar las dos barras de T100 con la información que aporta la DANA.",
    visualGuide: ["Barras sin DANA y con DANA","260 frente a 952 mm, mismo cuantil","Distinguir T100 del período asignado al episodio"],
    speechCues: ["misma pregunta","260 milímetros","952","266 por ciento","710,8 milímetros","distinta la pregunta","bandas de incertidumbre"],
    transition: "Tanganica conserva la necesidad de estimar extremos con pocos datos, pero cambia la variable de diseño: de precipitación a nivel del lago.",
    transitionCue: "nivel del lago"
  },

  {

    id: 34,
    offlineFrames: [{"src": "offline_valencia_web.png", "label": "Resultados", "caption": "Ficha de Valencia: cifras publicadas y acceso a los notebooks del caso."}],
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
    caseReference: 'Referencia: VIII Jornadas de Ingeniería del Agua (2025); notebook reproducible del caso Valencia',
    type: 'split',
    results: [
      { value:'224', label:'estaciones analizadas', implication:'30 AEMET, 41 SIAR y 153 AVAMET' },
      { value:'34–41 años', label:'período de retorno mediante RFA local', implication:'estimación estable con 9 estaciones próximas' },
      { value:'3 métodos', label:'GEV comparados', implication:'MLE, L-momentos y bayesiano' },
    ],
    pyhydraRole:'Mantiene una cadena única y auditable para comparar métodos, escalas regionales y resultados antes/después de la DANA.',
    pyhydraModules:['pyhydra.climate.time_series','pyhydra.climate.spatial_analysis','PyMC','notebook trazable'],
    script: 'La cabecera de esta ficha resume en cifras lo que acabamos de ver: los mismos números —710,8 mm, el salto del cuantil T100— están publicados aquí, trazables hasta el notebook que los calculó.',
    notes: 'Momento de navegación en vivo en /cases/valencia-dana. Resaltar la fila de estadísticas de la cabecera. El tercer notebook del caso (migración a pyhydra/PyMC) ya aparece en el flujo de trabajo de la página.',
    bullets: [
      'Cifras publicadas directamente desde el análisis reproducible, no copiadas a mano.',
      'Trazabilidad completa hasta pilot_cases/valencia_dana/03_real_regional_study_pyhydra.ipynb.',
      'Tercer notebook añadido tras la migración a pyhydra/PyMC: contrasta el resultado contra las tablas históricas de Stan.',
      'De la DANA (29-Oct-2024) a esta ficha publicada: el mismo margen de horas que se reivindica como aportación en el capítulo 8.',
    ],
    backup: true
  },

  {
    id: 35,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Lago Tanganica: niveles de diseño con registros limitados',
    subtitle: 'De variables climáticas a caudal, nivel del lago y extremos futuros',
    estimatedMinutes: 2,
    url: '/cases/lago-tanganica', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "fig_tanganica_resultados_auditorio.svg", figurePosition: 'right',
    figureCaption: "T100 histórico: comparación de niveles por método; la proyección climática máxima corresponde a T5–T10, no a T100.",


    caseReference: 'Referencia: VIII Jornadas de Ingeniería del Agua (2025); manuscrito enviado a Ingeniería del Agua',
    type: 'split',
    results: [
      { value:'R² > 0,85', label:'AdaBoost en validación cruzada', implication:'R² = 0,96 sobre el conjunto completo' },
      { value:'770,19 m', label:'nivel bootstrap para T100', implication:'frente a 771,55-771,76 m con GEV/Weibull' },
      { value:'> 0,9 m', label:'máximo incremento proyectado', implication:'2041-2060 y retornos cortos T5-T10' },
    ],
    pyhydraRole:'Encadena fuentes globales, señal climática y una relación caudal-nivel no lineal para estimar cotas de diseño donde la altimetría observada es corta.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','AdaBoost','CMIP6 + Hydroweb'],
    processSteps:['ERA5 → AdaBoost','Caudal → N(Q)','CMIP6 + delta','Bootstrap N(Q)','Extremos de nivel'],
    script: "La figura contiene dos comparaciones que debemos mantener separadas. A la izquierda se estima el nivel histórico de diseño para T100: el bootstrap da 770,19 metros y GEV/Weibull, entre 771,55 y 771,76. El recuadro de la derecha se refiere a otra magnitud: el mayor incremento futuro, superior a 0,9 metros, aparece para T5–T10 en 2041–2060. No es el incremento de T100.\n\nEl puerto de Kalundu necesita cotas de diseño, pero la altimetría satelital disponible es corta, de 1992 a 2023. La cadena aprovecha ERA5 y AdaBoost para estimar caudales mensuales. Una relación empírica N(Q), separada en tres regímenes, transforma esos caudales en niveles.\n\nLa señal de 19 modelos CMIP6 se incorpora mediante el método delta mensual. El bootstrap remuestrea residuos de la relación caudal-nivel, no de AdaBoost, y genera aproximadamente 20.000 años simulados. Los máximos anuales permiten obtener cambios mediante percentiles empíricos, aplicados a los niveles históricos ajustados. Las diferencias entre métodos son parte de la incertidumbre que debe acompañar la cota de diseño.",
    notes: "Primero explicar las dos comparaciones visibles. T100 histórico y cambio climático máximo T5–T10 son magnitudes diferentes. El bootstrap remuestrea residuos de N(Q), no de AdaBoost. La figura de forzamientos y las curvas por horizontes están en los anexos.",
    bullets: [
      'AdaBoost estima caudales mensuales a partir de ERA5; no estima directamente los niveles extremos.',
      'La función N(Q), separada en tres regímenes por K-means, transforma caudal en nivel del lago.',
      'El bootstrap remuestrea residuos de N(Q) y los percentiles de máximos anuales determinan los cambios de nivel.',
      'Las anomalías de cuatro horizontes CMIP6 se aplican sobre los niveles históricos obtenidos con la altimetría Hydroweb 1992-2023.',
    ],
    speakerGoal: "Separar nivel histórico T100, método de cálculo y cambio climático proyectado.",
    visualGuide: ["Comparación histórica T100: bootstrap y GEV/Weibull","Recuadro futuro: cambio máximo para T5–T10","Cadena caudal → nivel → extremos"],
    speechCues: ["mantener separadas","770,19","771,55 y 771,76","No es el incremento de T100","AdaBoost","N(Q)","residuos de la relación caudal-nivel"],
    transition: "Para aplicar cadenas de este tipo a un territorio mayor aparece otro cuello de botella: calibrar muchos modelos de forma consistente.",
    transitionCue: "calibrar muchos modelos"
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
    caseReference: 'Referencia: Estudios hidroeléctricos andinos; memoria doctoral, cap. 7',
    type: 'split',
    results: [
      { value:'SPOTPY', label:'calibración automática', implication:'PSO, DREAM y SCE-UA para evitar ajustes manuales cuenca a cuenca' },
      { value:'> 200', label:'subcuencas procesadas', implication:'transformación regional de lluvia y clima en caudal' },
      { value:'> +40 %', label:'caudal mensual proyectado', implication:'meses húmedos de Perú y Ecuador al final de siglo' },
    ],
    pyhydraRole:'Generaliza la experiencia andina: automatizar el ciclo parámetros-modelo-evaluación con SPOTPY para convertir clima en caudal de forma repetible.',
    pyhydraModules:['pyhydra.climate','pyhydra.modeling','SPOTPY','VIC','clima → caudal'],
    processSteps:['Campos climáticos','SPOTPY calibra','VIC lluvia → caudal','21 CMIP5','Caudal regional'],
    script: "Cada panel corresponde a un país: Colombia, Bolivia, Perú y Ecuador. El eje horizontal recorre los meses; el vertical muestra el cambio porcentual del caudal proyectado. La leyenda distingue horizontes y escenarios RCP4.5 y RCP8.5. Las líneas cambian de forma entre países y meses: en Perú y Ecuador aparecen aumentos superiores al 40 por ciento en determinados meses, mientras otras combinaciones muestran reducciones.\n\nObtener esas curvas exigió transformar campos climáticos en caudales para más de 200 subcuencas. Los vacíos de información se completaron con datos satelitales e interpolación. SPOTPY organizó la calibración con algoritmos como PSO, DREAM y SCE-UA; VIC realizó la transformación hidrológica, y después se propagaron 21 modelos CMIP5.\n\nLa contribución que conecta este trabajo con la tesis es hacer repetible el ciclo de calibración y simulación regional. Las proyecciones de la figura están condicionadas a esos modelos, escenarios y horizontes.",
    notes: "Los ejes muestran cambio porcentual del caudal mensual, no precipitación. El +40 % corresponde a determinados meses y escenarios de Perú/Ecuador. Automatización de la calibración no elimina la necesidad de validación hidrológica.",
    bullets: [
      'La escala territorial hizo inviable la calibración manual de los modelos hidrológicos.',
      'SPOTPY automatizó la búsqueda de parámetros mediante PSO, DREAM y SCE-UA.',
      'VIC transformó los campos de precipitación y temperatura en caudales para más de 200 subcuencas.',
      'La experiencia se trasladó después a la interfaz de calibración automática de los adaptadores de HYDRA.',
    ],
    speakerGoal: "Leer el cambio estacional en los cuatro países y explicar qué automatización lo hizo posible.",
    visualGuide: ["Cuatro paneles por país","Meses en horizontal y cambio porcentual en vertical","Escenarios y horizontes de la leyenda"],
    speechCues: ["Cada panel","meses","cambio porcentual","40 por ciento","más de 200 subcuencas","SPOTPY","calibración y simulación regional"],
    transition: "Además del clima futuro, debemos comprobar cuánto cambia el diseño por el propio procedimiento de cálculo.",
    transitionCue: "procedimiento de cálculo"
  },

  {
    id: 37,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Atlas de Panamá: automatización a escala nacional',
    subtitle: 'Ministerio de Ambiente y BID: 52 cuencas en ambas vertientes',
    estimatedMinutes: 2,
    url: '/cases/atlas-panama', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: 'fig_panama_precipitacion.png', figurePosition: 'right',
    figureCaption: 'Precipitación media por subcuencas, obtenida mediante el flujo nacional de descarga, control de calidad e interpolación espacial',
    caseReference: 'Fuente: Producto 3, Downscaling Estadístico (2023), pp. 3, 29–30; 414 = producto de sus dimensiones de análisis',
    type: 'split',
    results: [
      { value:'52', label:'cuencas con capas de inundación', implication:'escala nacional y tres períodos de retorno' },
      { value:'414', label:'combinaciones climáticas', implication:'23 GCM × 2 SSP × 3 variables × 3 horizontes' },
      { value:'1.464', label:'puntos costeros analizados', implication:'52 escenarios de nivel de agua total' },
    ],
    pyhydraRole:'Escala la misma arquitectura desde una cuenca piloto hasta un encargo nacional con cientos de combinaciones climáticas.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','NEOPRENE','SFINCS'],
    processSteps:['73 estaciones','NEOPRENE + kriging','414 combinaciones','LEM + SFINCS','Capas de riesgo'],
    script: "El mapa muestra precipitación por subcuencas. La barra inferior permite leer valores en milímetros: los colores fríos indican zonas más húmedas y los cálidos, menos precipitación. Es un producto de datos que alimenta el cálculo; no es un mapa de calado ni de período de retorno.\n\nEl encargo del Ministerio de Ambiente de Panamá y el BID abarca 52 cuencas, además de 1.464 puntos costeros. Para preparar las entradas se completaron 73 estaciones mediante NEOPRENE/STNSRP y se interpolaron campos con kriging universal a un kilómetro.\n\nEl informe climático organiza 23 configuraciones GCM, dos escenarios SSP, tres variables y tres horizontes: 414 combinaciones de análisis. Esa cifra describe las dimensiones documentadas, no un registro verificado de 414 simulaciones hidráulicas terminadas. La corrección de sesgo alimenta LEM y SFINCS. El aporte a la tesis es la capacidad de organizar ese volumen de fuentes, configuraciones y resultados con un procedimiento común.",
    notes: "El mapa es de precipitación, no de inundación. 414 = 23 GCM × 2 SSP × 3 variables × 3 horizontes, según Producto 3, pp. 3 y 29–30. No equivale a un registro comprobado de ejecuciones completadas ni a 414 simulaciones hidráulicas.",
    bullets: [
      '52 cuencas (hasta 13.400 km²) en ambas vertientes de Panamá, encargo del Ministerio de Ambiente y el BID.',
      'NEOPRENE/STNSRP rellena 73 estaciones nacionales (1950-2022); kriging universal a malla de 1 km.',
      '414 combinaciones de análisis: 23 GCM × 2 SSP × 3 variables × 3 horizontes.',
      'Modelo hidrológico LEM (NS=0,87) + SFINCS nacional y 2D de alta resolución en el área metropolitana.',
      '1.464 puntos costeros analizados en ambas costas frente a inundación costera.',
    ],
    speakerGoal: "Leer el mapa como producto intermedio de datos y separar las magnitudes de escala.",
    visualGuide: ["Mapa y barra de precipitación","52 cuencas y 1.464 puntos: dominios de aplicación","414 combinaciones: dimensiones climáticas"],
    speechCues: ["precipitación por subcuencas","no es un mapa de calado","52 cuencas","1.464 puntos costeros","414 combinaciones de análisis","dimensiones documentadas","procedimiento común"],
    transition: "Con los casos revisados, podemos distinguir cómo se ha comunicado la investigación y cuál ha sido mi contribución personal.",
    transitionCue: "mi contribución personal"
  },

  {
    id: 38,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'SIMPCCe: caudales mínimos de embalses ante el cambio climático',
    subtitle: 'Herramienta nacional para la red de embalses española, según la guía metodológica de Fundación Canal',
    estimatedMinutes: 2,
    url: '/cases/simpcce', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "fig_simpcce_regimen_mensual.svg", figurePosition: "full",
    figureCaption: "Detalle original de SIMPCCe: régimen mensual 2071–2100. Barras en porcentaje y líneas como factores de cambio. Figura completa en el anexo de resultados.",
    caseReference: 'Referencia: Navas et al., Ingeniería del Agua (2025); guía de Fundación Canal; premio del Observatorio del Agua de la Fundación Botín',
    type: "figure",
    results: [
      { value:'60', label:'series corregidas por variable', implication:'10 modelos, 2 RCP y 3 horizontes' },
      { value:'20', label:'realizaciones futuras por punto', implication:'aplicables a la red hídrica nacional' },
      { value:'Premio 2023', label:'Talento Joven “M.R. Llamas”', implication:'Observatorio del Agua de la Fundación Botín; candidatura colectiva por la guía que enmarca SIMPCCe' },
    ],
    pyhydraRole:'Transforma proyecciones climáticas en aportaciones y fichas de decisión para cualquier punto de la red hídrica española.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','SDM','red neuronal'],
    processSteps:['SPAIN02 + SIMPA','PCA 95 %','ANN de aportaciones','SDM climático','Sequía y fiabilidad'],
    script: "Los dos paneles corresponden al mismo punto de estudio y al horizonte 2071–2100. A la izquierda está RCP4.5 y a la derecha RCP8.5. El eje horizontal recorre los meses.\n\nLas barras azules muestran el cambio porcentual de la aportación media y se leen en el eje izquierdo: cero significa que no cambia. Las líneas roja y violeta muestran cambios de los cuantiles 95 y 25 y se leen en el eje derecho, como factores: uno significa que no cambia. Las barras y las líneas tienen escalas distintas.\n\nLa comparación muestra que el cambio depende del mes y del indicador. Una media anual puede ocultar variaciones relevantes para el estiaje y la fiabilidad de un embalse.\n\nSIMPCCe produce estas salidas combinando datos de SPAIN02 y SIMPA-CEDEX, una red neuronal de aportaciones, diez modelos CORDEX-AEMET y corrección de sesgo. El caso traslada los componentes climáticos e hidrológicos a una finalidad de gestión distinta. La figura completa de resultados y el entrenamiento quedan disponibles en los anexos.",
    notes: "Detalle ampliado de la figura científica original: RCP4.5/RCP8.5 en 2071–2100. Barras: porcentaje de cambio, referencia 0. Líneas: factor de cambio, referencia 1. Conservar la distinción al señalar las curvas. La guía metodológica recibió el premio colectivo de 2023; las figuras completas y la interfaz de entrenamiento están en reserva.",
    bullets: [
      'Herramienta nacional aplicable a cualquier punto de la red hidrográfica española (guía metodológica Fundación Canal).',
      'Red neuronal (ANN) sobre componentes principales (95% varianza) de precipitación y temperatura distribuidas.',
      '10 modelos CORDEX-AEMET × RCP4.5/8.5 × 3 horizontes → 60 series corregidas por variable (SDM).',
      'Los caudales mínimos de estiaje caen incluso donde la precipitación media no muestra cambio significativo.',
      'Premio al Talento Joven “M.R. Llamas” 2023: candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave por la guía metodológica que enmarca SIMPCCe.',
    ],
    speakerGoal: "Relacionar aportaciones medias y cuantiles mensuales sin confundir sus escalas.",
    visualGuide: ["Izquierda RCP4.5 y derecha RCP8.5, para 2071–2100","Meses en horizontal; barras porcentuales y líneas con factor de cambio","Implicación para la gestión estacional"],
    speechCues: ["mismo punto","2071–2100","barras azules","eje izquierdo","líneas roja y violeta","eje derecho","escalas distintas","media anual","finalidad de gestión distinta"],
    transition: "Panamá lleva esa exigencia de repetir un flujo con procedencia controlada a un encargo de escala nacional.",
    transitionCue: "escala nacional"
  },

  {
    id: 39,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "IAHR 2022: el procedimiento también cambia el diseño",
    subtitle: 'Estudio comparativo: Método convencional (IDF) vs Enfoque Estocástico',
    estimatedMinutes: 2,
    figure: 'fig_iahr2022_comparativa_es.svg', figurePosition: 'right',
    figureCaption: "Mapa: diferencia de calado en 2041–2070, RCP4.5. Recuadros: comparación adicional de caudales T100; ejemplo 2011–2040.",
    caseReference: 'Referencia: 39th IAHR World Congress, Granada (2022); memoria doctoral, cap. 7',
    type: 'split',
    results: [{"value":"+33,4 %","label":"ejemplo de caudal T100","implication":"208,8 → 278,5 m³/s; 2011–2040, RCP4.5"},{"value":"10.000 años","label":"serie sintética del estudio","implication":"200 casos seleccionados para Iber"},{"value":"Espacial","label":"diferencia de calados","implication":"mapa 2041–2070; variación según localización"}],
    pyhydraRole:'Demuestra por qué la frecuencia debe propagarse por toda la cadena y evaluarse sobre el impacto, no heredarse de la lluvia.',
    pyhydraModules:['pyhydra.climate','pyhydra.climate.bias_correction','cópulas','MaxDiss + k-NN','Iber'],
    processSteps:['EURO-CORDEX','Sesgo + cópulas','10.000 años','MaxDiss + Iber','IDF ↔ estocástico'],
    script: "La imagen izquierda representa diferencias de calado entre las dos metodologías para T100, en 2041–2070 bajo RCP4.5. La escala de color muestra que la diferencia se distribuye de forma desigual por el territorio. No es una comparación directa de las alturas de dos hidrogramas.\n\nLos recuadros muestran además un ejemplo de caudal T100 para 2011–2040 bajo RCP4.5: de 208,8 metros cúbicos por segundo con el procedimiento IDF a 278,5 con la cadena estocástica. Respecto al valor IDF, el incremento es del 33,4 por ciento. Ese porcentaje se refiere a este ejemplo; no es un factor de corrección general para el mapa de calados.\n\nLa cadena generó 10.000 años sintéticos y seleccionó 200 casos con MaxDiss para simular en Iber; el resto se reconstruyó mediante k-NN. La diferencia entre métodos muestra sensibilidad a la representación del evento y del sistema. Sin observaciones de esos caudales futuros, un resultado mayor no demuestra por sí solo mayor exactitud.",
    notes: "Fuente contrastada: memoria definitiva, tabla 7.6, p. 114 (página 144 del PDF), y §8.6, p. 130. El ejemplo T100 RCP4.5 2011–2040 es 208,8 → 278,5 m³/s: +33,4 % respecto a IDF; tomando como base el estocástico, IDF es un 25,0 % menor. Las 24 comparaciones de la tabla dan alrededor del 33 % de incremento, sin reconstruir los extremos del rango narrado 30–37 %. Ese rango requiere el artículo original. El mapa corresponde a 2041–2070; no confundir horizontes ni variables.",
    bullets: ["Ejemplo T100 (2011–2040, RCP4.5): 208,8 → 278,5 m³/s, +33,4 % respecto a IDF.","El mapa representa diferencias de calado para 2041–2070.","El porcentaje de un caudal no es un factor corrector uniforme del mapa.","La diferencia entre métodos no prueba por sí sola mayor exactitud."],
    speakerGoal: "Distinguir la comparación espacial de calados de la comparación numérica de caudales.",
    visualGuide: ["Mapa: diferencia de calado en T100, 2041–2070 y RCP4.5","Cifras de caudal como comparación adicional","Diferencia entre métodos y verdad observada"],
    speechCues: ["diferencias de calado","2041–2070","2011–2040","208,8","278,5","33,4 por ciento","no es un factor de corrección general","no demuestra por sí solo mayor exactitud"],
    transition: "La transferencia también debe funcionar cuando la decisión no es protegerse de una avenida, sino gestionar aportaciones escasas.",
    transitionCue: "aportaciones escasas"
  },

  {
    id: 39.5,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Qué demuestra el conjunto de casos',
    subtitle: 'La modelación estocástica es el hilo que conecta datos, clima, física e impacto',
    estimatedMinutes: 2,
    script: 'Este gráfico sitúa los nueve casos según su escala espacial, de una infraestructura a varios países, y según la dimensión que validan. Los puntos rellenos son los casos que hoy se reproducen con notebooks en HYDRA: Calle 30, Besaya y Valencia; los demás se documentan desde su publicación o su proyecto. El argumento común es que la modelación estocástica no es una herramienta aislada, sino el principio que obliga a representar muchos forzamientos, propagarlos por la hidrología y la hidráulica y estimar la frecuencia sobre la variable que se utiliza para tomar la decisión de diseño: caudal, calado, extensión inundada o nivel. pyhydra aporta el núcleo común y HYDRA hace visible, reproducible y transferible la cadena.',
    notes: 'Esta es la diapositiva de síntesis del bloque. Hacer una pausa antes de presentar la producción científica; después se delimita la autoría y se cierran las hipótesis. No enumerar otra vez los nueve casos: responder a “¿qué aprendemos de todos ellos juntos?”.',
    bullets: [
      'La lluvia de diseño es una entrada; el riesgo se decide con la distribución del impacto.',
      'Cada caso activa herramientas diferentes porque la cadena física y los datos disponibles también son diferentes.',
      'La aportación común es mantener trazabilidad e incertidumbre desde la fuente hasta el resultado de ingeniería.',
    ],
    backup: true
  },

  {
    id: 39.6,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: 'Producción científica asociada a la tesis',
    subtitle: 'La validación externa acompaña la evolución desde el método hasta la herramienta',
    estimatedMinutes: 2,
    type: 'normal',
    results: [
      { value:'2 artículos', label:'propios de la tesis y publicados', implication:'Calle 30 (2024) y SIMPCCe (2025), en Ingeniería del Agua' },
      { value:'2 enviados', label:'manuscritos en evaluación', implication:'Tanganica, en Ingeniería del Agua; rugosidades, en Environmental Modelling & Software' },
      { value:'5 comunicaciones', label:'presentadas entre 2023 y 2025', implication:'VII JIA, HIC 2024, InterJIA 2024 y dos trabajos en VIII JIA' },
      { value:'2 DOI', label:'software científico publicado', implication:'pyhydra e HYDRA preservados y versionados en Zenodo' },
    ],
    script: "Los cuatro recuadros separan productos con estados diferentes. Dos artículos están publicados en Ingeniería del Agua: Calle 30 y SIMPCCe. Dos manuscritos están enviados a evaluación: Tanganica y el análisis de rugosidad y estructura hidráulica del Besaya. Cinco comunicaciones presentaron avances de la línea entre 2023 y 2025. Finalmente, los dos DOI identifican versiones preservadas de pyhydra e HYDRA.\n\nEsta distinción evita presentar un envío como un artículo aceptado. También muestra dos formas de transferencia: resultados científicos que pueden discutirse en una publicación y software que puede localizarse, citarse y utilizarse bajo sus requisitos. La relación completa de autoría queda disponible en los anexos.",
    notes: "Distinguir artículos publicados, envíos, comunicaciones y DOI. Mantener el estado documental de la versión de la memoria; no anticipar aceptaciones.",
    bullets: [
      'Infraestructura urbana: cadena estocástica completa con transformación lluvia–caudal y modelización 1D.',
      'Gestión de embalses: transferencia de clima, corrección de sesgo y emulación de caudales mínimos.',
      'Eventos y niveles extremos: incertidumbre, datos globales y respuesta ante problemas recientes.',
      'Sensibilidad hidráulica: automatización masiva para revelar incertidumbre entre motores.',
    ],
    speakerGoal: "Distinguir publicación, comunicación, evaluación y software citable.",
    visualGuide: ["Dos artículos publicados","Dos manuscritos enviados y cinco comunicaciones","Dos DOI de software"],
    speechCues: ["cuatro recuadros","publicados","enviados a evaluación","Cinco comunicaciones","dos DOI"],
    transition: "La existencia de esos productos no explica por sí sola mi papel; la siguiente tabla lo delimita.",
    transitionCue: "mi papel"
  },

  {
    id: 39.7,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: "Mi contribución científica y tecnológica",
    subtitle: "Métodos aplicados, trabajo colaborativo y software propio",
    estimatedMinutes: 2,
    type: 'normal',
    script: "La tabla distingue tres responsabilidades. En la primera fila están los trabajos que lidero: formulación de la metodología aplicada, modelización, análisis y redacción. En la segunda aparecen colaboraciones en las que mi aportación está delimitada, como calibración automática, procesamiento climático, extremos o desarrollo de software.\n\nLa tercera corresponde a pyhydra e HYDRA: su diseño, desarrollo, documentación y publicación son mi aportación como primer autor. En conjunto, la tabla de la memoria recoge siete trabajos como primer autor y cuatro colaboraciones con aportación específica. El trabajo del grupo sobre cópulas vine se cita como extensión y no como autoría mía.\n\nEsta separación permite valorar qué resultados son colectivos y qué desarrollo científico y tecnológico realizo personalmente.",
    notes: "El detalle por publicación queda en reserva. La distinción de autoría debe mantenerse aunque se resuma el texto oral. El trabajo de cópulas vine citado como extensión no tiene autoría del doctorando.",
    mathBlock: "<table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Responsabilidad</th><th>Aportación</th></tr></thead><tbody><tr><th>Trabajos liderados</th><td>Metodología, simulación, análisis y redacción</td></tr><tr><th>Colaboraciones</th><td>Calibración, clima, extremos y software, con rol delimitado</td></tr><tr><th>pyhydra e HYDRA</th><td>Diseño, desarrollo, documentación y publicación con rol de primer autor</td></tr></tbody></table><p class=\"thesis-matrix-legend\">El detalle por publicación está disponible en los anexos.</p>",
    bullets: [
      'Siete trabajos como primer autor, cuatro con aportación delimitada y software con rol de primer autor.',
    ],
    speakerGoal: "Delimitar la responsabilidad personal con tres filas legibles.",
    visualGuide: ["Trabajos liderados","Colaboraciones con aportación delimitada","Diseño y desarrollo del software"],
    speechCues: ["tres responsabilidades","trabajos que lidero","colaboraciones","primer autor","siete trabajos","no como autoría mía"],
    transition: "Con las responsabilidades delimitadas, podemos cerrar las tres hipótesis usando la evidencia presentada.",
    transitionCue: "cerrar las tres hipótesis"
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 8 — CONCLUSIONES Y COMPILACIÓN DE HIPÓTESIS
  // ════════════════════════════════════════════════════

  {
    id: 40,
    block: 'Validación', blockColor: '#8b5cf6',
    title: "Qué evidencia aporta cada hipótesis y qué falta comprobar",
    subtitle: 'Evidencia acumulada, con el alcance de cada una',
    estimatedMinutes: 3,
    type: 'normal',
    script: "La figura vuelve a las tres hipótesis. Arriba, H1 se apoya en campañas como los 995 pares hidráulicos del Besaya, los 10.000 años sintéticos y los miles de eventos de Calle 30. Estas campañas sustentan la capacidad operativa del flujo; no todas sus etapas históricas estaban automatizadas. La mejora de eficiencia que plantea H1 requiere todavía medir el ahorro frente al trabajo manual.\n\nEn el centro, la reutilización de bloques entre los nueve casos apoya la integración modular de H2. La reducción de barreras técnicas requiere también evaluar su uso por otros equipos. La disponibilidad actual debe leerse con el matiz ya señalado: tres casos reproducibles hoy con notebooks y seis documentados desde sus proyectos o publicaciones.\n\nAbajo, H3 reúne dos efectos distintos. Cambiar el procedimiento modifica el caudal de diseño; incorporar la DANA modifica el cuantil estimado. Son evidencias de sensibilidad metodológica y estadística. Apoyan la necesidad de representar incertidumbre que plantea H3. Para demostrar una representación más consistente necesitamos contrastes observacionales y comparaciones sistemáticas; un resultado más alto no es por sí solo más exacto.",
    notes: "La formulación de H1 contempla eficiencia, pero esta defensa acredita principalmente viabilidad operativa. H2 tiene tres casos con notebooks actuales. H3 muestra sensibilidad e incertidumbre, no una demostración general de exactitud superior.",
    bullets: ["H1: viabilidad demostrada; ahorro de tiempo pendiente de medir.","H2: reutilización entre aplicaciones; tres casos con notebooks reproducibles hoy.","H3: sensibilidad del diseño a métodos y datos; mayor valor no implica mayor exactitud."],
    speakerGoal: "Cerrar cada hipótesis con evidencia y un límite explícito.",
    visualGuide: ["H1: campañas de ejecuciones en la franja superior","H2: matriz central de componentes reutilizados","H3: comparaciones numéricas inferiores"],
    speechCues: ["H1","capacidad operativa","medir el ahorro","H2","evaluar su uso por otros equipos","tres casos reproducibles","H3","sensibilidad metodológica y estadística","contrastes observacionales y comparaciones sistemáticas"],
    transition: "Ese cierre permite precisar la contribución doctoral sin confundir métodos previos, desarrollos propios y conocimiento aportado.",
    transitionCue: "contribución doctoral"
  },

  {
    id: 41,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'La contribución original: hacer operativa la ciencia existente',
    subtitle: 'Integración extremo a extremo, reproducibilidad sistemática y transferencia demostrada',
    estimatedMinutes: 3,
    type: 'normal',
    script: "Los tres niveles de la figura separan responsabilidades científicas. En la base están los métodos preexistentes: estadística de extremos, cópulas, generadores y motores físicos. La tesis reconoce esa procedencia.\n\nEn el nivel intermedio está el desarrollo realizado: submódulos, adaptadores y flujos de ejecución. En el superior aparece la contribución original: integrar esos componentes de extremo a extremo, registrar lo necesario para repetir el análisis y demostrar su transferencia a problemas reales.\n\nEl recorrido de los casos da contenido a esa afirmación. Hemos visto cómo cambia la frecuencia al propagarse por el sistema, cómo influyen datos y métodos y qué permite repetir el cálculo a otra escala. La aportación es una arquitectura operativa para estudiar esas preguntas de forma coherente; su alcance debe expresarse junto con sus limitaciones.",
    notes: "Base científica previa → desarrollo de componentes → integración reproducible y transferencia. Explicar esta jerarquía como conclusión de los casos.",
    results: [
      { value:'Extremo a extremo', label:'integración funcional', implication:'datos, estadística, escenarios, modelos físicos e impacto' },
      { value:'Trazable', label:'reproducibilidad sistemática', implication:'cada resultado conserva fuente, método y configuración' },
      { value:'9 casos', label:'transferibilidad operativa', implication:'tres reproducibles con notebooks; seis documentados desde su publicación o proyecto' },
    ],
    bullets: [
      'Las metodologías científicas incorporadas son reconocidas explícitamente como conocimiento previo.',
      'El desarrollo doctoral las convierte en módulos, adaptadores y flujos reproducibles.',
      'La originalidad reside en integrarlas y demostrar que esa arquitectura puede transferirse a proyectos reales.',
      'La automatización no sustituye el juicio experto: lo hace más eficiente y trazable.',
    ],
    speakerGoal: "Cerrar la tesis distinguiendo tres niveles de contribución.",
    visualGuide: ["Nivel inferior: conocimiento previo","Nivel intermedio: desarrollo de la tesis","Nivel superior: contribución original"],
    speechCues: ["métodos preexistentes","desarrollo realizado","contribución original","extremo a extremo","repetir el análisis","transferencia"],
    transition: "Los límites se localizan precisamente en las etapas de la cadena que hemos recorrido.",
    transitionCue: "etapas de la cadena"
  },

  {
    id: 42,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'Qué resuelve HYDRA y qué permanece abierto',
    subtitle: 'La automatización organiza la incertidumbre; no elimina los límites de los datos ni de los modelos',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Cada columna coloca un límite en su etapa. Los datos pueden ser cortos o desiguales; en extremos, eso deja poca información sobre la cola. Los generadores pueden asumir estacionariedad. Los modelos dependen de licencias, versiones y coste computacional. Al final de la cadena, falta todavía un contraste sistemático del impacto con observaciones.\n\nLa fila inferior indica cómo avanzar: control de calidad, incertidumbre explícita, generación condicionada al clima y reducción del coste mediante emuladores y ejecución distribuida.\n\nPriorizaría dos comprobaciones: medir el acierto de los impactos y cuantificar el ahorro real de trabajo. Esas medidas permitirían valorar mejor la utilidad de la automatización. La plataforma facilita repetir y auditar los cálculos; la responsabilidad de justificar datos, hipótesis y decisiones permanece en el equipo que realiza el estudio.",
    notes: "Prioridad propuesta: validación observacional del impacto y medida del ahorro. Los intervalos representan incertidumbres consideradas y no garantizan cubrir todas las fuentes posibles.",
    bullets: [
      'Datos: las series cortas y los extremos raros mantienen una incertidumbre irreducible en la cola.',
      'Validación: falta un contraste sistemático de manchas y frecuencias de impacto con observaciones.',
      'Dependencias: licencias, versiones e instalación de motores externos condicionan la reproducibilidad completa.',
      'Método: los generadores estacionarios no representan por sí solos tendencias climáticas no estacionarias.',
      'Cómputo: MaxDiss, k-NN y emuladores reducen carga, pero no sustituyen la validación física.',
      'Siguiente etapa: generación no estacionaria, métricas de acierto, ahorro medido, ejecución distribuida y suite de tests.',
    ],
    speakerGoal: "Priorizar los límites y relacionarlos con desarrollos verificables.",
    visualGuide: ["Fila superior: etapas de la cadena","Limitación y siguiente etapa en cada columna","Prioridad: contraste observacional y ahorro medido"],
    speechCues: ["Cada columna","contraste sistemático","fila inferior","medir el acierto","cuantificar el ahorro real","responsabilidad"],
    transition: "Ese es el alcance del trabajo y la continuidad que propongo. Quiero cerrar agradeciendo a quienes lo hicieron posible.",
    transitionCue: "agradeciendo"
  },

  {
    id: 42.5,
    block: 'Agradecimientos', blockColor: '#0d9488',
    title: 'Una tesis se firma con un nombre, pero se construye con muchos',
    subtitle: 'A quienes hicieron posible que este trabajo llegara hasta aquí',
    estimatedMinutes: 1,
    type: 'normal',
    script: "Quiero dar las gracias a mi familia por acompañarme y sostenerme durante todo este recorrido. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad. A IHCantabria, por el entorno humano, científico y técnico en el que he podido desarrollar el trabajo. Y a Álvaro Galán, por ayudarme a mantener la motivación y mejorar esta investigación.\n\nA todos, muchas gracias.",
    notes: "Tono personal y pausado. Hacer una pausa antes de la frase final.",
    bullets: [
      'Mi familia — el apoyo que sostuvo todo el recorrido.',
      'Manuel del Jesus Peñil — rigor, confianza y vocación de utilidad.',
      'César Álvarez Díaz — disponibilidad y generosidad constantes.',
      'IHCantabria — el entorno humano, científico y técnico de la tesis.',
      'Álvaro Galán — motivación y ayuda para mejorar el trabajo.',
    ],
    speakerGoal: "Agradecer sin abrir otra explicación científica.",
    visualGuide: ["Familia, director y tutor","IHCantabria y Álvaro Galán"],
    speechCues: ["mi familia","Manuel del Jesus Peñil","César Álvarez Díaz","IHCantabria","Álvaro Galán"],
    transition: "Termino con la respuesta a la pregunta que abrió la defensa.",
    transitionCue: "respuesta"
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
    script: "La respuesta de la tesis es que podemos conectar datos, métodos y modelos en una cadena reproducible para estimar la frecuencia del impacto bajo incertidumbre. Los casos muestran su utilidad y también delimitan lo que queda por validar.\n\nLos repositorios y las versiones citables quedan disponibles para continuar ese trabajo. Muchas gracias por su atención. Quedo a disposición del tribunal para sus preguntas.",
    notes: "Terminar la respuesta científica, agradecer y ceder la palabra. Los enlaces quedan visibles durante las preguntas.",
    bullets: [
      'GitHub Librería: github.com/navass11/pyhydra (Licencia MIT)',
      'GitHub Plataforma: github.com/navass11/HYDRA',
      'DOI pyhydra: 10.5281/zenodo.20932555',
      'DOI HYDRA: 10.5281/zenodo.21138151',
      'Contacto: s.navas11@gmail.com',
    ],
    speakerGoal: "Dar una conclusión recordable y ceder la palabra.",
    visualGuide: ["Mensaje final","Repositorios y DOI para acceder al trabajo"],
    speechCues: ["frecuencia del impacto bajo incertidumbre","lo que queda por validar","Muchas gracias","preguntas"],
    transition: "Muchas gracias. Cedo la palabra al tribunal.",
    transitionCue: "Cedo la palabra al tribunal"
  },

  // ════════════════════════════════════════════════════
  // DIAPOSITIVAS DE ENLACE NARRATIVO
  // Se ordenan mediante presentationRank para reforzar el relato sin
  // convertir la defensa en una sucesión de herramientas o topónimos.
  // ════════════════════════════════════════════════════

  {
    id: 44,
    block: 'Motivación', blockColor: '#ef4444',
    title: "Qué necesitamos saber para decidir ante una inundación",
    subtitle: 'Un mismo fenómeno compromete seguridad, actividad económica e infraestructuras esenciales',
    estimatedMinutes: 1,
    type: 'figure',
    figure: 'fig_problematica_inundaciones.png', figurePosition: 'full',
    figureCaption: "Ilustración conceptual: mecanismos fluviales, urbanos y costeros y sistemas expuestos. No representa un episodio observado.",
    script: "Esta ilustración reúne tres situaciones que pueden coincidir: una avenida fluvial a la izquierda, la acumulación de agua en la ciudad y la influencia costera a la derecha. Es una imagen conceptual, no la observación de un episodio concreto.\n\nLo que necesitamos proteger aparece en el mismo dibujo: personas, viviendas, carreteras e infraestructuras. Para decidir sobre ellas interesa saber dónde llegará el agua, con qué calado, durante cuánto tiempo y con qué frecuencia. La lluvia es una entrada del problema; sus consecuencias dependen también del estado de la cuenca, del sistema hidráulico y de la exposición. Esa distancia entre la entrada meteorológica y la consecuencia es el punto de partida de la tesis.",
    notes: "La imagen es conceptual. Señalar los sistemas expuestos y formular la pregunta de decisión. No presentarla como fotografía documental de un evento.",
    bullets: [
      'La misma precipitación puede producir consecuencias distintas según el estado de la cuenca y la exposición.',
      'La decisión se toma sobre personas, infraestructuras y niveles de agua, no sobre la lluvia de forma aislada.',
    ],
    speakerGoal: "Situar la variable sobre la que se toma una decisión.",
    visualGuide: ["Ilustración conceptual: río, ciudad y costa","Edificios, movilidad e infraestructuras expuestas"],
    speechCues: ["imagen conceptual","dónde llegará el agua","con qué frecuencia","estado de la cuenca","entrada meteorológica y la consecuencia"],
    transition: "Veamos cómo recorre esa distancia el procedimiento de cálculo habitual.",
    transitionCue: "procedimiento de cálculo habitual"
  },

  {
    id: 45,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Del Trabajo Fin de Máster a la pregunta doctoral',
    subtitle: 'La primera cadena resolvió un caso y reveló un problema más general',
    estimatedMinutes: 1,
    backup: true,
    type: 'split',
    figure: 'fig_besaya_cadena_fundacional.svg', figurePosition: 'right',
    figureCaption: 'La aplicación del Besaya lleva la frecuencia desde los aforos hasta el calado',
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
    type: 'normal',
    script: "El dibujo sigue cinco etapas. Empezamos con una serie observada, normalmente corta. El generador produce muchos escenarios que representan las propiedades estadísticas seleccionadas. Esos escenarios atraviesan los modelos físicos y generan un resultado hidráulico para cada ejecución.\n\nEl cambio importante está entre las dos últimas etapas: un mapa de calado describe un escenario; una curva de frecuencia reúne los resultados de muchos escenarios y permite preguntar con qué probabilidad se supera un calado. La banda recuerda que esa estimación también es incierta.\n\nGenerar muchos años sintéticos no añade observaciones reales ni garantiza por sí solo una buena representación de los extremos. El valor de la cadena depende de las hipótesis, los diagnósticos y los modelos con los que se construye cada etapa.",
    notes: "Los años sintéticos son realizaciones del modelo. La curva final está condicionada a las hipótesis del generador y de los motores.",
    bullets: [
      'Representar escenarios plausibles exige datos y relaciones de dependencia.',
      'Propagar esos escenarios exige modelos hidrológicos e hidráulicos.',
      'Evaluar el riesgo exige calcular la distribución de la variable de impacto.',
    ],
    speakerGoal: "Explicar la cadena estocástica antes de comparar arquitecturas.",
    visualGuide: ["Serie corta de partida","Población de escenarios","Mapa por escenario y curva final"],
    speechCues: ["cinco etapas","un mapa de calado","curva de frecuencia","banda","no añade observaciones reales"],
    transition: "La cuestión es qué parte de esta cadena cubren conjuntamente los marcos disponibles.",
    transitionCue: "qué parte de esta cadena"
  },

  {
    id: 47,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Mapa metodológico de la tesis',
    subtitle: 'Cinco responsabilidades científicas que después se materializan en la arquitectura',
    estimatedMinutes: 1,
    type: 'normal',
    script: 'Antes de la arquitectura técnica, este es el mapa metodológico: cinco responsabilidades y los submódulos de pyhydra que las materializan. Los datos: lluvia, caudal, cambio climático y suelos. Los extremos y el clima: series, análisis regional y corrección de sesgo. Los escenarios: generación estocástica y downscaling híbrido. La respuesta física: HEC-HMS, SWAT+, SFINCS y HEC-RAS. Y el impacto: reconstrucción de escenarios no simulados, sensibilidad y período de retorno sobre el calado. Son catorce submódulos en tres bloques, y cada caso activa solo la combinación que necesita.',
    notes: 'Utilizar esta diapositiva como orientación. No enumerar aún clases ni submódulos. En la diapositiva siguiente se explica que la arquitectura asigna una capa técnica a estas responsabilidades.',
    backup: true
  },

  {
    id: 48,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Resultados que sostienen la contribución',
    subtitle: 'Los casos aportan evidencias distintas y complementarias',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Estas cuatro figuras reúnen resultados que se desarrollan en el recorrido principal. IAHR muestra un ejemplo T100 de 208,8 frente a 278,5 m³/s, un aumento del 33,4 por ciento respecto a IDF; el mapa espacial corresponde a un horizonte distinto. En Valencia, el nivel T100 bayesiano pasa de 260 a 952 mm al incorporar la DANA. En el Besaya, 995 pares de simulaciones permiten comparar dos motores. En Panamá, 414 combinaciones describen dimensiones del análisis climático, no un registro de ejecuciones hidráulicas. Cada resultado debe leerse con su variable, método, horizonte y alcance.",
    notes: "Resumen de reserva. El rango 30–37 % del texto de la memoria queda pendiente de cotejo con el artículo original; se utiliza el ejemplo aritméticamente comprobable de +33,4 % respecto a IDF.",
    bullets: [
      'La evidencia combina contraste metodológico, actualización estadística, sensibilidad hidráulica y escalabilidad.',
      'El valor conjunto reside en conservar la trazabilidad desde la entrada hasta la cifra final.',
    ],
    backup: true
  },

{
  "id": 55,
  "block": "Contribuciones científicas",
  "blockColor": "#0ea5e9",
  "title": "Autoría completa de la línea de investigación",
  "subtitle": "Rol del doctorando en cada publicación, según la tabla de autoría del capítulo 8",
  "estimatedMinutes": 2,
  "type": "normal",
  "script": "Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución, y esta tabla la resume. Soy primer autor en siete trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los trabajos andinos contribuí a la calibración automática y al procesamiento climático; en NEOPRENE, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en Valencia, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. El trabajo de cópulas vine del grupo se cita como extensión, sin autoría mía. Finalmente, pyhydra e HYDRA son software con rol de primer autor, diseñado, desarrollado y documentado como parte de la tesis.",
  "notes": "Esta diapositiva responde preventivamente a dos preguntas: qué resultados pertenecen al doctorando y cómo se relacionan las publicaciones previas con la contribución doctoral. No atribuirse el trabajo Vine cópulas/GPR de 2026: la memoria lo cita como línea de extensión sin autoría del doctorando.",
  "mathBlock": "\n      <table class=\"thesis-matrix authorship-matrix\">\n        <thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead>\n        <tbody>\n          <tr><th scope=\"row\">V JIA (2017)</th><td class=\"tm-yes\">Primer autor</td><td>Conceptualización de la cadena estocástica, análisis y redacción</td></tr>\n          <tr><th scope=\"row\">Besaya, ROP (2018)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, modelización hidrológico-hidráulica, impactos y redacción</td></tr>\n          <tr><th scope=\"row\">Mallorca (2019)</th><td class=\"tm-yes\">Primer autor</td><td>Downscaling híbrido, geoestadística, simulación y redacción</td></tr>\n          <tr><th scope=\"row\">Andes, BID e IA (2019–2020)</th><td class=\"tm-part\">Coautor</td><td>Calibración automática y procesamiento climático</td></tr>\n          <tr><th scope=\"row\">NEOPRENE, GMD (2023)</th><td class=\"tm-part\">Segundo autor</td><td>Desarrollo, validación y documentación del software</td></tr>\n          <tr><th scope=\"row\">Calle 30, IA (2024)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología completa, automatización HEC-HMS/HEC-RAS y redacción</td></tr>\n          <tr><th scope=\"row\">Downscaling, EGU (2024)</th><td class=\"tm-part\">Coautor</td><td>Generación estocástica y reconstrucción integradas en pyhydra</td></tr>\n          <tr><th scope=\"row\">SIMPCCe, IA (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño y desarrollo íntegro, validación nacional y redacción</td></tr>\n          <tr><th scope=\"row\">Valencia (2025)</th><td class=\"tm-part\">Segundo autor</td><td>Módulos de extremos y AFR y ejecución de los cálculos</td></tr>\n          <tr><th scope=\"row\">Tanganica (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, datos globales, aprendizaje automático y redacción</td></tr>\n          <tr><th scope=\"row\">Rugosidad Besaya, EMS (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Ensemble Monte Carlo, automatización de ambos motores y redacción</td></tr>\n          <tr><th scope=\"row\">Vine cópulas y GPR (2026)</th><td class=\"tm-no\">Sin autoría</td><td>Trabajo del grupo citado como extensión; no es contribución de la tesis</td></tr>\n          <tr><th scope=\"row\">pyhydra e HYDRA, Zenodo (2026)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño, desarrollo, documentación y publicación del software</td></tr>\n        </tbody>\n      </table>\n      <p class=\"thesis-matrix-legend\">Fuente: memoria, cap. 8, tabla de rol del doctorando en las publicaciones de la línea.</p>\n    ",
  "bullets": [
    "Siete trabajos como primer autor, cuatro con aportación delimitada y software con rol de primer autor."
  ],
  "backup": true
},
{
  "id": 56,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: bifurcación hidráulica del Besaya",
  "estimatedMinutes": 1,
  "figure": "besaya_fig05_hydraulic_bifurcation_es.svg",
  "figureCaption": "El collado topográfico a cota 60,1 m s.n.m. controla la activación del compartimento secundario",
  "script": "El collado a cota 60,1 metros controla la activación del compartimento secundario de 7,4 hectáreas. Esta figura permite explicar el mecanismo topográfico que origina la respuesta bimodal."
},
{
  "id": 57,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: proyecciones de niveles del lago Tanganica",
  "estimatedMinutes": 1,
  "figure": "fig_tanganika_variaciones_nivel.png",
  "figureCaption": "Cambio del nivel extremo para T5-T500, cuatro horizontes y los escenarios SSP2-4.5 y SSP5-8.5",
  "script": "El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. El mayor incremento futuro supera 0,9 m en 2041-2060 para T5-T10; a finales de siglo queda por debajo de 0,6 m para T100-T500."
},
{
  "id": 58,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: forzamientos climáticos de Tanganica",
  "estimatedMinutes": 1,
  "figure": "fig_tanganika_proyecciones.png",
  "figureCaption": "Proyecciones climáticas que alimentan la estimación de niveles futuros",
  "script": "Estas proyecciones alimentan la estimación de niveles futuros. Se presentan como forzamientos del modelo, no como observaciones futuras."
},
{
  "id": 59,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: red de túneles de Calle 30",
  "type": "figure",
  "figure": "fig_m30_localizacion.png",
  "figureCaption": "Ámbito de la infraestructura urbana y red de túneles analizada",
  "estimatedMinutes": 1,
  "script": "Este mapa sitúa el dominio del caso Calle 30. La cadena mostrada en la presentación conecta lluvia multisitio, HEC-HMS y HEC-RAS 1D; el mapa delimita la infraestructura a la que se asigna la frecuencia del calado.",
  "backup": true
},
{
  "id": 60,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: curvas completas de Valencia",
  "type": "figure",
  "figure": "fig_valencia_curvas_retorno.png",
  "figureCaption": "Turís y Carlet, antes y después de incorporar la DANA",
  "estimatedMinutes": 1,
  "script": "Aquí están las curvas completas que sustentan la síntesis del caso Valencia. Los dos paneles superiores corresponden a Turís, antes y después de la DANA; los inferiores corresponden a Carlet. La comparación muestra tanto el desplazamiento de los niveles de retorno como el cambio en la incertidumbre entre estimadores.",
  "backup": true
},
{
  "id": 61,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: entrenamiento de SIMPCCe",
  "type": "figure",
  "figure": "fig_simpcce_interfaz.png",
  "figureCaption": "Interfaz de entrenamiento y validación de la red neuronal",
  "estimatedMinutes": 1,
  "script": "Esta interfaz documenta el entrenamiento y la validación de la red neuronal de SIMPCCe. La presentación principal muestra los resultados de aportaciones y caudales mínimos; aquí puedo explicar cómo se configura y valida el modelo que los produce.",
  "backup": true
},
{
  "id": 62,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: resultados completos de SIMPCCe",
  "estimatedMinutes": 2,
  "figure": "fig_simpcce_resultados.png",
  "figurePosition": "full",
  "figureCaption": "Figura original completa de SIMPCCe: series anuales, régimen mensual, cuantiles y localización del punto.",
  "script": "La figura completa permite situar el detalle mensual explicado en la presentación. Los mapas de la derecha localizan el punto. Arriba, las matrices muestran cambios anuales de aportaciones por modelo climático y por año, con RCP4.5 en el primer panel y RCP8.5 en el segundo. Abajo a la izquierda se comparan estadísticas mensuales; a la derecha, cambios del régimen medio mensual y de los cuantiles para tres horizontes. Las barras usan porcentajes y las líneas de los cuantiles usan factores de cambio. Esta vista sirve para localizar resultados adicionales; el detalle ampliado del recorrido principal corresponde a los dos paneles inferiores de la derecha, de 2071–2100.",
  "notes": "Usar según la pregunta. Para cifras concretas, ampliar el panel solicitado o abrir la herramienta y sus informes. La figura reúne varios indicadores: declarar variable, horizonte y escenario antes de interpretar un valor."
}
];

// Deliberate narrative order; supporting material remains available in the appendices.
const presentationOrder = [1,4,44,5.5,6,3,7,8.5,46,10,11,12.6,13,14,15,16,17,18,19,27,29,28,30,31,32,33,35,36,39,38,37,39.6,39.7,40,41,42,42.5,43];
const appendixOrder = [20,21,22,23,24,25,26,56,57,58,59,60,61,2,45,4.5,8,4.6,8.6,9,47,12,5,34,48,39.5,55,62];
const presentationRank = (slide: Slide) => presentationOrder.indexOf(slide.id);

// One pacing estimate feeds the deck, presenter and rehearsal guide.
function pacingMinutes(slide: Slide, transition = slide.transition ?? ''): number {
  const words = (slide.script + ' ' + transition).trim().split(/\s+/).length;
  // Voice at 115 words/min, ~5 s per change, ~7 s to read a figure,
  // and ~72 s of operation in the single guided demo; rehearse to measure reality.
  return Math.round((words / 115 + 0.08 + (slide.figure ? 0.12 : 0) + (slide.webMode === 'demo' ? 1.2 : 0)) * 10) / 10;
}

// Each transition states why the next slide is needed in this exact order.
const spokenBridges = new Map<number, { nextId: number; text: string }>([
  [
    1,
    {
      "nextId": 4,
      "text": "La estructura de la exposición sigue los pasos necesarios para responder a ese problema."
    }
  ],
  [
    4,
    {
      "nextId": 44,
      "text": "Comencemos por la decisión que necesitamos tomar cuando estudiamos una inundación."
    }
  ],
  [
    44,
    {
      "nextId": 5.5,
      "text": "Veamos cómo recorre esa distancia el procedimiento de cálculo habitual."
    }
  ],
  [
    5.5,
    {
      "nextId": 6,
      "text": "El siguiente ejemplo muestra por qué esa frecuencia puede cambiar incluso con la misma lluvia."
    }
  ],
  [
    6,
    {
      "nextId": 3,
      "text": "Esta dificultad apareció de forma concreta en el trabajo con el que comenzó la investigación: el Besaya."
    }
  ],
  [
    3,
    {
      "nextId": 7,
      "text": "La pregunta dejó de ser cómo resolver una cuenca y pasó a ser cómo hacer reutilizable la cadena completa."
    }
  ],
  [
    7,
    {
      "nextId": 8.5,
      "text": "Para contrastar esas hipótesis necesitamos concretar qué se va a desarrollar y qué resultado verificará cada objetivo."
    }
  ],
  [
    8.5,
    {
      "nextId": 46,
      "text": "El primer paso para cumplirlos es entender qué exige una cadena estocástica completa y qué ofrecen los métodos existentes."
    }
  ],
  [
    46,
    {
      "nextId": 10,
      "text": "La cuestión es qué parte de esta cadena cubren conjuntamente los marcos disponibles."
    }
  ],
  [
    10,
    {
      "nextId": 11,
      "text": "Para cubrir esa combinación, separé el cálculo científico de su ejecución y de su acceso desde la web."
    }
  ],
  [
    11,
    {
      "nextId": 12.6,
      "text": "Dentro de ese núcleo, los métodos se ordenan según las tres responsabilidades de la cadena."
    }
  ],
  [
    12.6,
    {
      "nextId": 13,
      "text": "La primera dificultad práctica es que las entradas proceden de fuentes muy distintas."
    }
  ],
  [
    13,
    {
      "nextId": 14,
      "text": "Con las entradas identificadas y revisadas, podemos estimar la frecuencia de sus valores extremos."
    }
  ],
  [
    14,
    {
      "nextId": 15,
      "text": "Pero ajustar cada variable por separado no describe cómo ocurren conjuntamente."
    }
  ],
  [
    15,
    {
      "nextId": 16,
      "text": "Una vez descritas las distribuciones y la dependencia, podemos generar escenarios que conserven las propiedades seleccionadas."
    }
  ],
  [
    16,
    {
      "nextId": 17,
      "text": "Esas trayectorias deben convertirse ahora en una respuesta hidrológica e hidráulica."
    }
  ],
  [
    17,
    {
      "nextId": 18,
      "text": "Con los métodos y los adaptadores conectados, podemos ofrecer la misma operación a través de una herramienta web."
    }
  ],
  [
    18,
    {
      "nextId": 19,
      "text": "En esa demostración distinguiremos la serie que entra al cálculo, el estimador puntual y el origen de la incertidumbre mostrada."
    }
  ],
  [
    19,
    {
      "nextId": 27,
      "text": "La demo muestra que el método puede ejecutarse. Los casos permiten valorar qué conocimiento y qué capacidad operativa aporta."
    }
  ],
  [
    27,
    {
      "nextId": 29,
      "text": "Empezamos en Besaya, donde se formuló el principio que debe conservar toda la arquitectura."
    }
  ],
  [
    29,
    {
      "nextId": 28,
      "text": "Una cadena reproducible permite comparar sus componentes; en el Besaya la comparación se hizo entre dos motores hidráulicos."
    }
  ],
  [
    28,
    {
      "nextId": 30,
      "text": "En Mallorca cambia la dificultad de partida: disponer de muy pocos datos hidrológicos para construir y contrastar la cadena."
    }
  ],
  [
    30,
    {
      "nextId": 31,
      "text": "La siguiente aplicación añade una exigencia operativa: hacer viable esa cadena en una infraestructura crítica."
    }
  ],
  [
    31,
    {
      "nextId": 32,
      "text": "Ahora podemos leer el resultado hidráulico de esa cadena en las gráficas de análisis interactivo."
    }
  ],
  [
    32,
    {
      "nextId": 33,
      "text": "Hasta aquí hemos propagado escenarios por modelos físicos. Valencia plantea otra dificultad: que un solo dato extremo cambie el ajuste de entrada."
    }
  ],
  [
    33,
    {
      "nextId": 35,
      "text": "Tanganica conserva la necesidad de estimar extremos con pocos datos, pero cambia la variable de diseño: de precipitación a nivel del lago."
    }
  ],
  [
    35,
    {
      "nextId": 36,
      "text": "Para aplicar cadenas de este tipo a un territorio mayor aparece otro cuello de botella: calibrar muchos modelos de forma consistente."
    }
  ],
  [
    36,
    {
      "nextId": 39,
      "text": "Además del clima futuro, debemos comprobar cuánto cambia el diseño por el propio procedimiento de cálculo."
    }
  ],
  [
    39,
    {
      "nextId": 38,
      "text": "La transferencia también debe funcionar cuando la decisión no es protegerse de una avenida, sino gestionar aportaciones escasas."
    }
  ],
  [
    38,
    {
      "nextId": 37,
      "text": "Panamá lleva esa exigencia de repetir un flujo con procedencia controlada a un encargo de escala nacional."
    }
  ],
  [
    37,
    {
      "nextId": 39.6,
      "text": "Con los casos revisados, podemos distinguir cómo se ha comunicado la investigación y cuál ha sido mi contribución personal."
    }
  ],
  [
    39.6,
    {
      "nextId": 39.7,
      "text": "La existencia de esos productos no explica por sí sola mi papel; la siguiente tabla lo delimita."
    }
  ],
  [
    39.7,
    {
      "nextId": 40,
      "text": "Con las responsabilidades delimitadas, podemos cerrar las tres hipótesis usando la evidencia presentada."
    }
  ],
  [
    40,
    {
      "nextId": 41,
      "text": "Ese cierre permite precisar la contribución doctoral sin confundir métodos previos, desarrollos propios y conocimiento aportado."
    }
  ],
  [
    41,
    {
      "nextId": 42,
      "text": "Los límites se localizan precisamente en las etapas de la cadena que hemos recorrido."
    }
  ],
  [
    42,
    {
      "nextId": 42.5,
      "text": "Ese es el alcance del trabajo y la continuidad que propongo. Quiero cerrar agradeciendo a quienes lo hicieron posible."
    }
  ],
  [
    42.5,
    {
      "nextId": 43,
      "text": "Termino con la respuesta a la pregunta que abrió la defensa."
    }
  ]
]);

export const slides = slideLibrary
  .filter(slide => !slide.backup)
  .sort((a, b) => presentationRank(a) - presentationRank(b))
  .map((slide, index, ordered) => {
    const next = ordered[index + 1];
    const bridge = spokenBridges.get(slide.id);
    const transition = next
      ? (bridge?.nextId === next.id ? bridge.text : `A continuación, presentaré ${next.title.toLowerCase()}.`)
      : 'Muchas gracias. Cedo la palabra al tribunal.';
    return { ...slide, transition, estimatedMinutes: pacingMinutes(slide, transition) };
  });
export const backupSlides = slideLibrary.filter(slide => slide.backup).sort((a,b) => appendixOrder.indexOf(a.id)-appendixOrder.indexOf(b.id)).map(slide => ({ ...slide, estimatedMinutes: pacingMinutes(slide) }));
export const totalSlides = slides.length;
// Includes speech at 115 words/min, transitions, figures and a brief live demo.
export const totalMinutes = Math.round(slides.reduce((minutes, slide) => minutes + slide.estimatedMinutes, 0));
