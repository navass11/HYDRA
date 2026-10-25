export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  block: string;
  sectionLabel?: string; // Specific visible label; block retains chapter/navigation grouping.
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
  processSteps?: string[]; // Compact methodological chain shown in the shared case-study footer
  caseReference?: string; // Visible provenance for case-study evidence
  type?: 'title' | 'index' | 'quote' | 'timeline' | 'matrix' | 'figure' | 'split' | 'table' | 'normal';
  backup?: boolean;      // Material preparado para preguntas, fuera del relato principal
}

/** Chapter names match the six headings shown in the presentation route. */
export function chapterLabelFor(slide: Pick<Slide, 'block'>): string {
  if (['Apertura', 'Motivación'].includes(slide.block)) return 'Introducción';
  if (slide.block === 'Estado del arte') return 'Estado de la técnica';
  if (slide.block === 'Arquitectura') return 'Arquitectura';
  if (['Bloque de datos', 'Bloque climático-estadístico', 'Bloque de modelización', 'Demo en vivo'].includes(slide.block)) return 'Metodología';
  if (slide.block === 'Casos de estudio') return 'Casos y validación';
  return 'Conclusiones';
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
    script: "Buenos días, miembros del tribunal, director, tutor, profesores, compañeros, familiares y amigos. Muchas gracias por acompañarme. Soy Salvador Navas Fernández y voy a presentar mi tesis doctoral, titulada «Desarrollo de un modelo automático de inundación estocástica». La he realizado en IHCantabria, dentro del programa de Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos (IH2O) y con Mención Industrial. La tesis ha sido dirigida por el doctor Manuel del Jesus Peñil y tutorizada por el doctor César Álvarez Díaz. A lo largo de la exposición explicaré qué problema científico la origina, cómo se construyó la solución y qué evidencia permite valorar su utilidad.\n\nEl título reúne las dos dimensiones que recorreremos durante la defensa. La primera es científica: representar la variabilidad hidrológica y climática y trasladarla hasta el impacto. La segunda es tecnológica: conectar métodos y programas para que ese análisis pueda ejecutarse, revisarse y repetirse. La portada identifica también el marco académico y la Mención Industrial, que sitúa el trabajo en su relación con problemas reales de ingeniería. Mi propósito será explicar tanto el fundamento de los cálculos como el alcance de las evidencias obtenidas.",
    notes: "Saludar y hacer una pausa antes de plantear el problema. Los nombres completos y la Mención Industrial permanecen en portada.",
    bullets: [
      'Salvador Navas Fernández',
      'Dr. Manuel del Jesus Peñil',
      'Dr. César Álvarez Díaz',
    ],
    speakerGoal: "Plantear la defensa como respuesta a un problema de ingeniería.",
    visualGuide: ["Título de la tesis","Autor, director y tutor"],
    speechCues: ["miembros del tribunal","Salvador Navas Fernández","Desarrollo de un modelo automático de inundación estocástica","Mención Industrial","Manuel del Jesus Peñil","César Álvarez Díaz","problema científico","evidencia","científica","tecnológica"],
    transition: "La estructura de la exposición sigue los pasos necesarios para responder a ese problema.",
    transitionCue: "esta estructura"
  },

  {
    id: 4,
    block: 'Apertura', blockColor: '#0d9488',
    title: 'Estructura de la defensa',
    subtitle: 'Correspondencia directa con los capítulos de la memoria doctoral',
    estimatedMinutes: 1,
    type: 'index',
    script: "La exposición sigue seis bloques que agrupan los capítulos de la memoria, en este orden. Primero, la introducción: el problema, la pregunta, las hipótesis y los objetivos. Después, el estado de la técnica y la brecha que justifica la tesis. En tercer lugar, la arquitectura del sistema. En cuarto, la metodología: datos, análisis climático y estadístico, y modelización, con una breve demostración. En quinto, los casos como evidencia de validación. Y por último, las conclusiones: contribución, límites y trabajo futuro. Esta misma ruta aparece en las diapositivas para situarnos durante la exposición; las visitas a la web forman parte de ese recorrido.\n\nLa metodología explicará qué recibe cada bloque, qué transformación realiza y qué entrega al siguiente. En los casos veremos resultados concretos para valorar esas operaciones. Esta separación ayudará a distinguir la descripción de una capacidad de su comprobación en una aplicación. Cuando entremos en la web, seguiremos dentro del mismo recorrido: la navegación servirá para localizar una herramienta, interpretar sus resultados o consultar el procedimiento que los produjo. La franja superior mantiene visibles estos seis bloques para que podamos reconocer en todo momento dónde estamos.",
    notes: "Situar los seis bloques. La diapositiva de índice se utiliza una sola vez en el recorrido principal.",
    bullets: ["1. Introducción — Origen, motivación, problema, hipótesis y objetivos","2. Estado de la técnica — Antecedentes, soluciones existentes y brecha","3. Arquitectura del sistema — Núcleo científico, servicios e interfaz reproducible","4. Metodología — Datos; análisis climático y estadístico; modelización","5. Casos y validación — Evidencia científica y transferencia a proyectos reales","6. Conclusiones — Contribuciones, límites y trabajo futuro"],
    speakerGoal: "Dar al tribunal un mapa de la argumentación.",
    visualGuide: ["Seis bloques del índice","Ruta superior de cada diapositiva"],
    speechCues: ["seis bloques","introducción","estado de la técnica","arquitectura del sistema","metodología","casos","conclusiones","visitas a la web"],
    transition: "Comencemos por la decisión que necesitamos tomar cuando estudiamos una inundación.",
    transitionCue: "consecuencias"
  },

  {
    id: 2,
    block: 'Apertura', blockColor: '#0d9488',
    title: "Qué significa el título de la tesis",
    subtitle: 'Cada palabra delimita el objeto real de la investigación',
    estimatedMinutes: 2,
    type: 'split',
    figure: 'foto_cuenca_incertidumbre_climatica.png', figurePosition: 'right',
    figureCaption: 'Cuenca, observación y clima: el sistema físico que la arquitectura debe representar bajo incertidumbre',
    script: "El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una cadena completa de cálculo. “Automático” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente la preparación de archivos y el intercambio de datos entre etapas. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que representa la variabilidad y la incertidumbre. Esta definición exige además reproducibilidad operativa: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la variable sobre la que se toman decisiones.\n\nLos cuatro términos también establecen cómo valorar el resultado. La cadena debe estar conectada, de modo que una salida pueda utilizarse como entrada de la siguiente etapa. Debe poder repetirse, conservando datos y configuración. Debe producir una variable física interpretable, con su unidad y localización. Y debe conservar la información necesaria para estimar su frecuencia e incertidumbre. El esquema de la diapositiva organiza esas responsabilidades; la fotografía sitúa el sistema físico sobre el que se aplican. Así, podremos preguntar de forma concreta qué escenario produjo un determinado calado y qué hipótesis intervienen en su interpretación.",
    processSteps:['Entradas trazables','Escenarios plausibles','Modelos físicos','Frecuencia del impacto'],
    notes: "Interpretar los cuatro términos del título. El Besaya se presenta a continuación como antecedente científico del análisis sobre el impacto. La pregunta, las hipótesis y los objetivos se explican antes de introducir pyhydra como respuesta tecnológica y HYDRA como plataforma.",
    bullets: [
      'Modelo: arquitectura completa de cálculo, no un nuevo motor hidráulico.',
      'Automático: ejecución repetible de tareas que manualmente son lentas y frágiles.',
      'Inundación: frecuencia estimada sobre calado y extensión, no heredada directamente de la lluvia.',
      'Estocástica: cientos o miles de combinaciones plausibles de forzamientos, estados y parámetros.',
    ],
    backup: false,
    speakerGoal: "Delimitar qué significa el título y evitar que se interprete como un nuevo solver hidráulico.",
    visualGuide: ["Modelo y automatización","Inundación y escenarios estocásticos","Contratos de reproducibilidad"],
    speechCues: ["cadena completa de cálculo","Automático","impacto hidráulico","población de escenarios plausibles","reproducibilidad operativa","variable sobre la que se toman decisiones","conectada","repetirse","variable física interpretable","frecuencia e incertidumbre"],
    transitionCue: "antecedente científico",
    sectionLabel: "Alcance de la tesis"
  },

  {
    id: 4.5,
    block: 'Motivación', blockColor: '#ef4444',
    title: "Por qué necesitamos considerar condiciones cambiantes",
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
    script: "Esta tesis se realiza porque las inundaciones pueden causar graves daños humanos, económicos y territoriales, y porque las condiciones que determinan ese riesgo están cambiando. La ocupación de las llanuras inundables aumenta la exposición de personas e infraestructuras; el cambio climático modifica las condiciones hidrológicas y puede alterar la frecuencia y la intensidad de los extremos; y la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman interacciones entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre asociada a la decisión.\n\nLos tres elementos de la diapositiva describen mecanismos diferentes. La exposición cambia cuando aumenta la presencia de personas y bienes en zonas inundables. El clima introduce escenarios bajo los cuales pueden cambiar las condiciones de entrada del análisis. La urbanización modifica cómo la superficie transforma la lluvia en escorrentía. La imagen inferior sitúa esas interacciones en un territorio con usos distintos. Por eso, repetir el cálculo con un único evento y una única configuración deja fuera respuestas posibles. Explorar escenarios permite separar qué parte del resultado depende del forzamiento, cuál del estado del sistema y cuál de las decisiones de modelización.",
    notes: 'Abrir el problema a escala social antes de hablar de software. La imagen es conceptual y no corresponde a un evento concreto; las evidencias cuantitativas y geográficas aparecerán después en los casos de estudio. Conectar con la siguiente idea: si el riesgo exige múltiples escenarios, el flujo manual deja de ser viable.',
    bullets: ["Exposición: personas e infraestructuras situadas en zonas inundables.","Urbanización: cambios en infiltración y respuesta hidrológica.","Cambio climático: escenarios distintos de las condiciones históricas."],
    backup: false,
    speakerGoal: "Explicar los cambios que motivan el trabajo, después de situar sus consecuencias.",
    visualGuide: ["Exposición","Urbanización","Condiciones climáticas cambiantes"],
    speechCues: ["graves daños humanos, económicos y territoriales","exposición","cambio climático","impermeabilización urbana","interacciones","escenarios plausibles","incertidumbre asociada","clima","urbanización"],
    transitionCue: "alcance de la investigación",
    sectionLabel: "Motivación"
  },

  {
    id: 4.6,
    block: 'Motivación', blockColor: '#8b5cf6',
    title: "De los objetivos a pyhydra e HYDRA",
    subtitle: "Un núcleo científico modular y una plataforma para hacerlo utilizable",
    estimatedMinutes: 2,
    type: 'normal',
    script: "Las hipótesis y los objetivos anteriores fijan los requisitos del desarrollo: automatizar el cálculo, organizarlo en módulos y conservar la información necesaria para repetirlo. Para dar respuesta a esos requisitos se desarrolla pyhydra, la librería de Python que reúne el núcleo científico.\n\nHYDRA designa la plataforma que integra ese núcleo con la web, los notebooks y los servicios de ejecución. Así distinguimos la implementación de los métodos y las formas de utilizarlos y documentarlos.\n\nEl nombre HYDRA evoca a la hidra de la mitología griega. Sus múltiples cabezas sobre un mismo organismo representan aquí funciones especializadas que trabajan de forma coordinada: datos, estadística, escenarios y modelos físicos conectados en un flujo común. La metáfora expresa la modularidad y la integración de la propuesta.\n\nEn la figura, las hipótesis y los objetivos aparecen como requisitos de partida. La caja de pyhydra identifica la implementación del núcleo científico; la de HYDRA, los recursos con los que se utiliza y documenta. A la derecha se muestra el emblema oficial, junto a la referencia a la mitología griega. La imagen representa la idea de funciones especializadas conectadas a un conjunto común. Esta distinción será útil al interpretar los casos: una función puede utilizarse desde Python, desde un notebook o desde una interfaz web sin que esas tres formas de acceso constituyan tres métodos científicos diferentes.\n\nLa aportación se valorará por esa integración, por la posibilidad de repetir el análisis y por su transferencia a problemas reales.",
    notes: "Secuencia causal: pregunta → hipótesis → objetivos → requisitos → desarrollo de pyhydra → integración en HYDRA. El Besaya aporta el antecedente científico, no el origen causal del software. Significado del nombre: memoria definitiva, cap. 1, apartado 1.2, p. 10, nota al pie 1. No inventar un acrónimo. La metáfora representa módulos autónomos e integrados en un flujo unificado.",
    bullets: ["Requisitos: automatizar, modularizar y repetir el análisis.","pyhydra: librería Python que implementa el núcleo científico.","HYDRA: plataforma que integra núcleo, web, notebooks y servicios."],
    backup: false,
    speakerGoal: "Presentar pyhydra como respuesta a los objetivos e hipótesis, distinguir la plataforma y explicar su nombre.",
    visualGuide: ["Requisitos derivados de las hipótesis y los objetivos","pyhydra: núcleo científico; HYDRA: plataforma","Origen del nombre: hidra de la mitología griega y logotipo oficial"],
    speechCues: ["hipótesis y los objetivos","requisitos","dar respuesta","pyhydra","núcleo científico","HYDRA designa la plataforma","hidra de la mitología griega","funciones especializadas","modularidad y la integración","transferencia a problemas reales","HYDRA","mitología griega"],
    transitionCue: "recorrido investigador",
    sectionLabel: "Respuesta tecnológica"
  },

  {
    id: 3,
    block: 'Apertura', blockColor: '#0d9488',
    title: "Besaya: antecedente científico del análisis sobre el impacto",
    subtitle: "TFM de 2017 y publicación de 2018: fundamento metodológico previo al software",
    estimatedMinutes: 2,
    type: 'timeline',
    script: "Un antecedente científico de esta tesis es mi Trabajo Fin de Máster, desarrollado en 2017 sobre el río Besaya a su paso por Los Corrales de Buelna. En aquel trabajo construí la primera cadena completa: caracterización multivariante de avenidas, generación de escenarios, simulación hidráulica con Iber y análisis estadístico de los impactos. El TFM recibió el premio principal en la categoría de Mejor Calidad y Contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. El trabajo se publicó después en la Revista de Obras Públicas, número 3598 de mayo de 2018, y consolidó la observación que guía toda la tesis: el período de retorno del forzamiento no coincide necesariamente con el del impacto hidráulico. Se comparó la inundación obtenida mediante metodologías habituales con la obtenida mediante la metodología desarrollada en el Besaya. Este caso proporciona un antecedente metodológico y muestra la dificultad de repetir una cadena extensa.\n\nLas etiquetas de la izquierda ordenan el antecedente: 2017 corresponde al TFM; 2018, a su publicación. La fila de comparación recoge ese contraste. Las dos últimas filas expresan la dificultad práctica y la consecuencia para la investigación. La metodología permitía llegar hasta el impacto, pero repetirla exigía preparar y transferir información entre herramientas de forma manual. Este antecedente motiva la pregunta científica. El desarrollo de pyhydra vendrá después, como respuesta a las hipótesis y objetivos de la tesis. Conviene mantener esa secuencia: primero se identifica qué necesitamos demostrar y, a partir de ello, se define la solución tecnológica.",
    notes: "El Besaya es un antecedente científico y una evidencia del principio de frecuencia sobre el impacto. No presentarlo como origen de pyhydra. La librería se desarrolla para responder a los objetivos e hipótesis; su nombre y la plataforma se presentan después de formularlos.",
    bullets: ["2017 — Cadena estocástica completa en el TFM del Besaya.","2018 — Publicación del principio T(forzamiento) ≠ T(impacto).","Comparativa — Inundación obtenida con metodologías habituales y con la metodología del Besaya.","Dificultad — Conexiones manuales y configuración específica para una cuenca.","Antecedente — Base metodológica para plantear la investigación."],
    speakerGoal: "Situar el Besaya como antecedente científico, antes de formular las hipótesis y los objetivos.",
    visualGuide: ["2017: TFM y cadena estocástica","2018: frecuencia sobre el impacto","Dificultad operativa y antecedente metodológico"],
    speechCues: ["antecedente científico","Trabajo Fin de Máster","2017","Los Corrales de Buelna","primera cadena completa","Iber","2018","período de retorno del forzamiento","antecedente metodológico","repetir una cadena extensa","hipótesis y objetivos de la tesis"],
    transition: "La pregunta dejó de ser cómo resolver una cuenca y pasó a ser cómo hacer reutilizable la cadena completa.",
    transitionCue: "estima habitualmente",
    sectionLabel: "Antecedente científico"
  },

  {
    id: 5,
    offlineFrames: [{"src": "offline_hydra_home.png", "label": "Plataforma", "caption": "Portada local de HYDRA: acceso a módulos, herramientas y notebooks."}],
    block: 'Demo en vivo', blockColor: '#0891b2',
    title: "Primera visita a HYDRA: del núcleo al navegador",
    subtitle: 'Núcleo científico, plataforma web y entorno reproducible',
    estimatedMinutes: 1,
    url: '/', anchor: "body", highlight: "",
    webMode: 'evidence',
    webLabel: "Primera navegación · Plataforma HYDRA",
    webPurpose: "Reconocer en la web los módulos ya explicados y situar el acceso a las herramientas antes de mostrar su funcionamiento.",
    webAction: "Entrar por primera vez en la portada. Mostrar los accesos a módulos, herramientas y casos/notebooks sin ejecutar todavía una herramienta. Volver al relato al pasar de diapositiva.",
    figure: 'fig_hydra_web_home.png', figurePosition: 'right',
    figureCaption: 'HYDRA integra documentación, herramientas y casos reproducibles',
    type: 'split',
    script: "Una vez explicados los cuatro módulos y cómo se conectan sus operaciones, entramos por primera vez en HYDRA para reconocer su organización en la web. La portada permite reconocer los accesos a la documentación de los módulos, las herramientas interactivas y los casos de estudio con sus notebooks.\n\nLa primera entrada que señalo es la documentación de módulos, donde se explica qué hace cada bloque y qué necesita. La segunda son las herramientas, que permiten ejecutar operaciones acotadas desde formularios y leer sus salidas. La tercera son los casos, que sitúan esas operaciones en un problema y enlazan los materiales disponibles. En esta primera visita no ejecutaremos aún una cadena territorial completa. El objetivo es reconocer esos accesos y la función que tendrán en el resto de la defensa, para que cada cambio entre diapositiva y web conserve una finalidad clara.\n\nLa web reúne esos recursos y los conecta con el núcleo científico. Aquí situamos esas tres entradas; después utilizaremos una herramienta e interpretaremos resultados concretos. Los cuatro módulos que acabamos de explicar proporcionan el cálculo científico. A continuación veremos cómo se accede a algunas de sus operaciones desde las herramientas web.",
    notes: "Primera visita necesaria, situada después de los módulos y antes de las herramientas web. Navegación de orientación, distinta de la demostración GEV y de las páginas de resultados. No saltarla. Evitar recorrer menús o ejecutar cálculos todavía. No dejar recuadros de resaltado sobre la portada.",
    bullets: [
      'Núcleo científico: concentra los métodos de datos, clima y modelización.',
      'Plataforma web: permite explorar documentación, herramientas y casos.',
      'Ejecución reproducible: reúne API, notebooks y servicios en un entorno controlado.',
      'Distribución abierta: código versionado y software archivado con DOI.',
    ],
    backup: false,
    anchorPosition: "start",
    offlineScript: "Tras explicar los cuatro módulos y su conexión, esta captura muestra nuestra primera entrada en la portada de HYDRA. En ella se reconocen los accesos a la documentación de los módulos, las herramientas interactivas y los casos de estudio con sus notebooks.\n\nLa primera entrada que señalo es la documentación de módulos, donde se explica qué hace cada bloque y qué necesita. La segunda son las herramientas, que permiten ejecutar operaciones acotadas desde formularios y leer sus salidas. La tercera son los casos, que sitúan esas operaciones en un problema y enlazan los materiales disponibles. En esta primera visita no ejecutaremos aún una cadena territorial completa. El objetivo es reconocer esos accesos y la función que tendrán en el resto de la defensa, para que cada cambio entre diapositiva y web conserve una finalidad clara.\n\nEsta vista reúne los recursos que acompañan al núcleo científico. Esta copia utiliza capturas preparadas para conservar el recorrido sin conexión. Después veremos la configuración de una herramienta y sus resultados. Los módulos y su conexión ya han quedado explicados. A continuación veremos cómo las herramientas web permiten configurar operaciones concretas de ese núcleo y leer sus resultados.",
    speakerGoal: "Conservar una primera entrada explícita en HYDRA y orientar al tribunal antes de mostrar operaciones concretas.",
    visualGuide: ["Portada y navegación principal","Accesos a documentación, herramientas y casos/notebooks","Relación con el núcleo científico"],
    speechCues: ["primera vez en HYDRA","documentación de los módulos","herramientas interactivas","casos de estudio","esas tres entradas","núcleo científico","documentación de módulos","herramientas","casos"],
    offlineSpeechCues: ["primera entrada","portada de HYDRA","documentación de los módulos","herramientas interactivas","casos de estudio","capturas preparadas","núcleo científico","documentación de módulos","herramientas","casos"],
    sectionLabel: "Navegación por HYDRA",
    transitionCue: "herramientas web"
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
    figureCaption: "Cadena convencional y tres supuestos que deben revisarse al propagar escenarios e incertidumbre.",
    type: 'figure',
    script: "Antes de presentar la solución, conviene fijar el procedimiento de referencia. Partimos de registros, ajustamos extremos, construimos un evento de diseño, lo transformamos mediante modelos hidrológicos e hidráulicos y obtenemos un mapa de inundación. Esta cadena física permite transformar la entrada en una respuesta hidráulica. La dificultad está en tres simplificaciones frecuentes: asumir estacionariedad, representar el extremo con un único evento y trasladar el mismo período de retorno desde el forzamiento hasta el impacto. La propuesta conserva la cadena física y organiza la exploración de múltiples escenarios para estimar la frecuencia del calado y de la extensión inundada, bajo las hipótesis del análisis.\n\nEn la figura se lee la secuencia de izquierda a derecha: datos, caracterización estadística, evento, modelos físicos y mapa. El mapa conserva información espacial: permite reconocer dónde aparecen los calados calculados. Sin embargo, para asignarle una frecuencia necesitamos saber qué conjunto de eventos y estados representa. Las tres advertencias del esquema se refieren precisamente a ese paso: unas condiciones estadísticas que pueden cambiar, la reducción de la variabilidad a un único evento y la asociación directa de su período de retorno con el resultado. La propuesta amplía las realizaciones que atraviesan esa misma cadena física y analiza sus impactos conjuntamente.",
    notes: "El período de retorno se refiere a una variable y a hipótesis especificadas. En condiciones estacionarias, T100 corresponde a una probabilidad anual de superación de 0,01.",
    speakerGoal: "Separar la cadena física válida de los supuestos de asignación de frecuencia.",
    visualGuide: ["Fila superior, de registros a impacto","Tres supuestos en los recuadros inferiores"],
    speechCues: ["procedimiento de referencia","evento de diseño","mapa de inundación","tres simplificaciones","estacionariedad","múltiples escenarios","frecuencia del calado","datos, caracterización estadística, evento, modelos físicos y mapa"],
    transition: "El siguiente ejemplo muestra por qué esa frecuencia puede cambiar incluso con la misma lluvia.",
    transitionCue: "misma lluvia",
    sectionLabel: "Procedimiento de referencia"
  },

  {
    id: 6,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "La misma lluvia puede producir impactos distintos",
    subtitle: 'Cuando la frecuencia del forzamiento se toma por la frecuencia del impacto',
    estimatedMinutes: 2,
    type: 'normal',
    script: "El problema científico se ve en este esquema. En las dos filas cae la misma lluvia, con un período de retorno de cien años. En la fila de arriba el suelo está seco y el agua queda dentro del cauce. En la de abajo el suelo está saturado y el afluente llega en crecida: el río desborda. El forzamiento es idéntico, pero las condiciones de la cuenca producen impactos distintos. Por eso no basta con preguntar cada cuánto ocurre una lluvia de diseño. Hay que preguntar cada cuánto se supera un calado, un caudal o una extensión inundada relevantes para la decisión. El esquema ilustra esa diferencia, sin asignar por sí solo otra frecuencia a cada respuesta. La tesis parte de que el período de retorno del forzamiento no puede asignarse directamente al impacto.\n\nLa comparación mantiene fijo el período de retorno de la lluvia para aislar el efecto de las condiciones del sistema. El suelo seco admite una parte del agua antes de que llegue al río; la saturación y la coincidencia de aportaciones pueden aumentar la respuesta hidráulica. Las dos filas ilustran, por tanto, una transformación condicionada por varios factores. No podemos deducir la frecuencia de cada impacto únicamente mirando esas dos imágenes: necesitaríamos conocer también con qué frecuencia aparecen las condiciones representadas. Esta es la razón para construir un conjunto de escenarios que conserve sus relaciones y evaluar la respuesta de cada uno.",
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
    speechCues: ["misma lluvia","cien años","suelo está seco","suelo está saturado","impactos distintos","cada cuánto se supera un calado","no puede asignarse directamente","período de retorno de la lluvia"],
    transition: "Esta dificultad apareció de forma concreta en el trabajo con el que comenzó la investigación: el Besaya.",
    transitionCue: "pregunta doctoral",
    sectionLabel: "Problema científico"
  },

  {
    id: 7,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "Hipótesis: qué debe demostrar la propuesta",
    type: 'quote',
    quote: "Una arquitectura modular y reproducible permite integrar las metodologías disponibles y transferir el análisis a proyectos reales.",
    estimatedMinutes: 2,
    script: "La hipótesis central es que una de las principales barreras operativas para aplicar estos métodos está en su integración. El esquema lo resume. Arriba están los métodos disponibles —extremos, cópulas, generadores, proyecciones, corrección de sesgo y motores hidráulicos—, con conexiones que deben reconstruirse en cada proyecto. Abajo aparece esa ciencia organizada en una cadena modular y reproducible, desde los datos hasta el impacto.\n\nLas dos partes de la figura contienen métodos conocidos; lo que cambia es su forma de conexión. Una conexión manual obliga a conocer formatos, unidades y decisiones que pueden quedar repartidas entre archivos o programas. Una conexión explícita permite conservar esas transformaciones y reutilizarlas. Eso da contenido a las hipótesis, pero no las convierte automáticamente en resultados demostrados. Para contrastarlas habrá que examinar campañas de cálculo, reutilización de componentes y cambios en los resultados, y reconocer qué comparaciones adicionales siguen pendientes. En particular, disponer de una campaña automática no cuantifica por sí solo el ahorro respecto a un procedimiento manual.\n\nLa memoria concreta este planteamiento en tres hipótesis: H1 propone que la automatización mejora la eficiencia, la reproducibilidad y la aplicación práctica. H2 plantea que la integración modular reduce barreras técnicas y facilita incorporar clima e incertidumbre. H3 propone que un flujo coordinado y reproducible representa la incertidumbre de forma más consistente que un único escenario de diseño. En el cierre volveré a ellas para distinguir las evidencias disponibles y las comprobaciones pendientes.",
    notes: "H1 incluye eficiencia y reproducibilidad: hay evidencia de ejecución viable, pero falta medir el ahorro sistemático frente al trabajo manual. H2 y H3 se cierran con alcance limitado por los casos.",
    bullets: ["H1 · Automatización: eficiencia, reproducibilidad y aplicación práctica.","H2 · Integración modular: reducir barreras técnicas e incorporar clima e incertidumbre.","H3 · Flujo reproducible: representar incertidumbre con mayor consistencia que un escenario único."],
    speakerGoal: "Formular una pregunta y tres hipótesis que luego se puedan cerrar con evidencia.",
    visualGuide: ["Fila superior: métodos fragmentados","Fila inferior: arquitectura conectada","H1, H2 y H3"],
    speechCues: ["integración","arriba","abajo","tres hipótesis","H1","H2","H3","comprobaciones pendientes","forma de conexión"],
    transition: "Para contrastar esas hipótesis necesitamos concretar qué se va a desarrollar y qué resultado verificará cada objetivo.",
    transitionCue: "objetivos",
    subtitle: "¿Puede una cadena reproducible transferirse a problemas reales bajo incertidumbre?",
    sectionLabel: "Hipótesis"
  },

  {
    id: 8,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "La pregunta de investigación",
    type: 'quote',
    quote: "¿Es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería?",
    estimatedMinutes: 2,
    script: "La pregunta de investigación es la que aparece a la izquierda: ¿es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería? A la derecha está la cadena que exige: datos climáticos con su incertidumbre; una cadena automática cuyos cálculos puedan repetirse conservando los datos, la configuración, las versiones y las semillas aleatorias; modelos físicos adecuados a cada caso; y una aplicación real en la que se estime la frecuencia con la que se supera un calado, una extensión inundada o un nivel relevantes para el diseño. El esquema recuerda una condición esencial: las fuentes de incertidumbre consideradas deben propagarse a través de la cadena y reflejarse en los resultados finales.\n\nEl texto de la pregunta impone varias exigencias simultáneas. Automatizar requiere conectar las operaciones; reproducir exige conservar la información del cálculo; integrar incertidumbre requiere representar las fuentes consideradas y seguir su propagación; y transferir significa poder adaptar el procedimiento a otro problema. La cadena de la derecha permite comprobar dónde interviene cada exigencia. Si una etapa pierde la referencia de sus datos o sustituye el ensemble por un único valor sin justificarlo, esa pérdida afecta a la interpretación posterior. La pregunta doctoral se refiere a la coherencia del conjunto, además del funcionamiento de cada componente por separado.",
    notes: 'Pronunciar despacio: es la formulación literal de la memoria (cap. 1). El foco está en "automatizar de forma reproducible" e "integrando metodologías previamente desarrolladas" — de ahí que la tesis no reivindique algoritmos nuevos, sino su operacionalización conjunta.',
    bullets: [
      'Conectar datos, análisis estadístico, escenarios y modelos físicos.',
      'Conservar la incertidumbre entre etapas en lugar de perderla.',
      'Repetir y auditar el cálculo completo.',
      'Funcionar en casos reales con escalas, datos y motores diferentes.',
    ],
    backup: false,
    speakerGoal: "Formular la pregunta doctoral completa, con una pausa para que se comprenda su alcance.",
    visualGuide: ["Pregunta de investigación","Datos, cadena reproducible y modelos físicos","Transferencia a una aplicación real"],
    speechCues: ["pregunta de investigación","automatizar de forma reproducible","incertidumbre hidrológica y climática","semillas aleatorias","aplicación real","propagarse a través de la cadena","Automatizar","reproducir","integrar incertidumbre","transferir"],
    transitionCue: "tres hipótesis",
    sectionLabel: "Pregunta de investigación"
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
    script: "El objetivo general es desarrollar y validar un núcleo científico modular que permita aplicar el análisis probabilístico de inundaciones bajo incertidumbre climática e hidrológica, y demostrar su transferencia mediante una plataforma reproducible.\n\nEse objetivo se concreta en cuatro compromisos. El primero integra datos y modelos de cambio climático en los flujos estocásticos. El segundo implementa y conecta la generación de eventos de precipitación y caudal. El tercero automatiza la configuración, ejecución y postprocesado de los modelos hidrológicos e hidráulicos. El cuarto consolida y documenta la librería y su despliegue en una plataforma, y los valida mediante casos reproducibles. Estos objetivos definen los requisitos a los que debe responder el desarrollo tecnológico.\n\nLos objetivos están agrupados en la diapositiva para mostrar su conexión. Datos y clima proporcionan las entradas y los escenarios de cambio; generación convierte la información estadística en realizaciones plausibles; modelización transforma esas realizaciones en respuestas físicas; y documentación y validación permiten examinar lo obtenido. Cada compromiso necesita una salida comprobable: una serie documentada, un conjunto de eventos, una ejecución de modelo o un procedimiento que otro usuario pueda revisar. Los objetivos no exigen que todos los casos utilicen todos los módulos, sino que las combinaciones necesarias puedan organizarse de forma consistente.",
    notes: "Explicación funcional de los mismos objetivos de la memoria, que denominan pyhydra al núcleo e HYDRA a la plataforma. Aquí se presentan sus requisitos antes de dar nombre a la respuesta tecnológica, en la diapositiva siguiente. Leer una fila objetivo–desarrollo–evidencia y recorrer las otras tres.",
    bullets: ["Objetivo general: desarrollar y validar un núcleo modular y demostrar su transferencia mediante una plataforma reproducible.","OE1–OE2: integrar datos y modelos climáticos, y generar eventos de precipitación y caudal.","OE3–OE4: automatizar los modelos físicos; documentar y validar el núcleo y la plataforma mediante casos reproducibles."],
    speakerGoal: "Relacionar cada objetivo con una evidencia que aparecerá en la defensa.",
    visualGuide: ["Leer una fila completa: objetivo, desarrollo y evidencia","Recorrer los cuatro objetivos"],
    speechCues: ["objetivo general","núcleo científico modular","plataforma reproducible","cuatro compromisos","primero","segundo","tercero","cuarto","requisitos","Datos y clima","generación","modelización","documentación y validación"],
    transition: "El primer paso para cumplirlos es entender qué exige una cadena estocástica completa y qué ofrecen los métodos existentes.",
    transitionCue: "respuesta tecnológica",
    sectionLabel: "Objetivos"
  },

  {
    id: 8.6,
    block: 'Motivación', blockColor: '#6366f1',
    title: 'Estrategia de investigación',
    subtitle: 'Del problema científico a los criterios utilizados para validar la respuesta',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Una vez formulada la pregunta, la estrategia de investigación se organiza en cuatro decisiones. La primera es representar explícitamente la incertidumbre mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema, no solo sobre la variable de entrada. La segunda es automatizar la cadena completa para evitar rupturas manuales entre datos, métodos y modelos. La tercera es separar sus componentes para que puedan sustituirse o reutilizarse sin reconstruir todo el flujo. La cuarta es validar la propuesta en problemas de distinta escala y con información disponible muy diferente. Consideraremos que la respuesta funciona si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, se adapta a distintos modelos y produce resultados útiles en aplicaciones científicas e industriales.\n\nLas cuatro decisiones pueden leerse como necesidad, estrategia y criterio de éxito. Representar incertidumbre exige generar alternativas y analizar sus impactos. Conectar operaciones exige controlar los intercambios de información. Modularizar permite sustituir un componente sin reconstruir el conjunto. Aplicar el flujo a problemas distintos permite examinar qué se reutiliza y qué necesita adaptación. El éxito debe evaluarse con evidencias concretas y límites explícitos: una operación disponible, una ejecución repetida, una comparación de resultados o un material que permita revisar el procedimiento. Esta figura organiza la estrategia de investigación y no constituye por sí misma el resultado de su validación.",
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
    backup: true,
    sectionLabel: "Origen de la investigación",
    speechCues: ["necesidad, estrategia y criterio de éxito","incertidumbre","automatizar","separar","validar","criterio de éxito","datos","evidencias concretas","límites explícitos"]
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
    script: "La cronología muestra cómo fue ampliándose el problema inicial. En 2017 y 2018, el Besaya permitió formular y publicar la estimación de frecuencia sobre el impacto. Los trabajos posteriores incorporaron cuencas con pocos datos, calibración en grandes dominios y escenarios con coherencia espacial y temporal.\n\nLas primeras fechas corresponden al trabajo sobre frecuencia del impacto. El siguiente grupo incorpora la escasez de observaciones y los dominios de mayor tamaño, que exigen completar entradas y repetir calibraciones. Después aparecen los desarrollos de escenarios espaciales y temporales, necesarios para representar entradas simultáneas y su persistencia. Las aplicaciones de 2024 y 2025 permiten contrastar métodos y atender necesidades industriales. El último tramo recoge la integración y distribución del software. La cronología organiza esa evolución; no significa que todos los componentes actuales estuvieran ya implementados en los primeros trabajos.\n\nLas aplicaciones industriales añadieron exigencias de ejecución, contraste y documentación. Ese recorrido converge en la arquitectura y las versiones de software de la tesis. La diversidad de métodos responde a necesidades concretas que se han convertido en componentes reutilizables.",
    notes: 'Explicar una evolución científica, no una sucesión de congresos o lugares. El primer hito es el TFM del doctorando. La comunicación de las V JIA es una vía de difusión del trabajo, no el origen conceptual por sí sola.',
    bullets: ["2017–2018 — Besaya: cadena estocástica y frecuencia sobre el impacto.","2019–2020 — Pocos datos y grandes dominios: reconstrucción y calibración regional.","2021–2023 — Generación de escenarios con estructura espacial y temporal.","2024–2025 — Transferencia industrial, eventos extremos y contraste de modelos.","2026 — Integración, documentación y distribución versionada."],
    backup: false,
    speakerGoal: "Mostrar la evolución del problema científico sin volver a explicar cada caso.",
    visualGuide: ["Besaya como origen","Nuevas exigencias de datos y escenarios","Síntesis en la arquitectura"],
    speechCues: ["cronología","Besaya","frecuencia sobre el impacto","exigencias de ejecución","arquitectura","componentes reutilizables","frecuencia del impacto","escenarios espaciales y temporales"],
    transitionCue: "cadena estocástica completa",
    sectionLabel: "Antecedentes"
  },

  {
    id: 10,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Posicionamiento frente a los marcos integrados más próximos',
    subtitle: 'Cobertura funcional comparada en el capítulo 2 de la memoria',
    estimatedMinutes: 2,
    type: 'normal',
    script: "La matriz permite situar la propuesta frente a los marcos revisados en la memoria. Compara su cobertura de las capacidades indicadas mediante marcas completas o parciales. CLIMADA aborda riesgo climático; RainyDay genera tormentas por transposición; wflow y HydroMT facilitan la preparación de modelos. Los enfoques de simulación continua pueden alcanzar el impacto, con implementaciones vinculadas a determinados dominios.\n\nLas filas representan ocho capacidades y las columnas, los marcos comparados. Una marca completa indica cobertura; una parcial, cobertura limitada o dependiente de recursos externos; el guion indica ausencia en el alcance revisado. Las primeras filas se refieren a datos y tratamiento estadístico; las siguientes, a generación, clima y motores; las últimas, al período de retorno del impacto y a la transferencia del producto. La lectura útil consiste en seguir una necesidad a través de varias filas. La tabla compara cobertura funcional según la memoria; no establece una clasificación universal de velocidad, exactitud o calidad para cualquier aplicación.\n\nLa comparación identifica la combinación que aborda HYDRA: datos heterogéneos, extremos, dependencia, escenarios y motores físicos dentro de un flujo reutilizable que calcule la frecuencia del impacto. Esa cobertura conjunta delimita la propuesta. La elección de una herramienta para un estudio concreto depende también de sus requisitos y del ámbito de aplicación.",
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
    ],
    speakerGoal: "Localizar la brecha mediante la matriz comparativa.",
    visualGuide: ["Columnas: capacidades; filas: marcos","Diferenciar capacidad completa y parcial","Combinación de capacidades de HYDRA"],
    speechCues: ["matriz","CLIMADA","RainyDay","wflow y HydroMT","cobertura conjunta","frecuencia del impacto","ocho capacidades"],
    transition: "Para cubrir esa combinación, separé el cálculo científico de su ejecución y de su acceso desde la web.",
    transitionCue: "arquitectura de HYDRA",
    sectionLabel: "Estado de la técnica"
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
    script: "La figura separa tres responsabilidades. En la base, pyhydra contiene el cálculo científico: los métodos que transforman los datos y producen los resultados. En el nivel intermedio están los servicios que permiten ejecutarlo. La API responde a las herramientas interactivas; JupyterLab permite trabajar con código y conservar el análisis en notebooks. En la parte superior, la web reúne la documentación, las herramientas y los casos de estudio.\n\nEl recorrido del cálculo atraviesa esos niveles en ambos sentidos. Un usuario introduce datos o parámetros en la interfaz; el servicio solicita la operación al núcleo; el núcleo devuelve un resultado que la interfaz presenta. El notebook ofrece otra forma de trabajar con ese cálculo, conservando código y pasos intermedios. Separar responsabilidades permite revisar una transformación científica sin depender del diseño de su formulario. También permite mantener una interfaz mientras se actualiza una operación del núcleo, siempre que se conserve y documente su contrato de entrada y salida.\n\nLa separación permite utilizar un mismo método desde distintas formas de acceso. Los contenedores conservan sus dependencias de ejecución.",
    notes: "La figura representa responsabilidades funcionales. pyhydra calcula; API y notebooks lo ejecutan; la web facilita el acceso. Datos, configuración y licencias siguen siendo requisitos de reproducción.",
    bullets: ["pyhydra: métodos científicos reutilizables.","API y notebooks: dos accesos al mismo cálculo.","Web: documentación, herramientas y casos."],
    speakerGoal: "Un mismo núcleo científico, tres formas de acceso.",
    visualGuide: ["Base: núcleo científico","Centro: API y JupyterLab","Arriba: acceso desde la web"],
    speechCues: ["tres responsabilidades","pyhydra","API","JupyterLab","web","mismo método","interfaz","servicio","núcleo"],
    transition: "Dentro de ese núcleo, los métodos se ordenan según las tres responsabilidades de la cadena.",
    transitionCue: "entorno de cálculo"
  },

  {
    id: 12,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: "HYDRA en Azure y en el entorno de cada proyecto",
    subtitle: "Acceso público a las herramientas y despliegue propio con contenedores",
    estimatedMinutes: 2,
    figure: "esq_infraestructura_operacion.svg", figurePosition: 'full',
    figureCaption: "Despliegue público en Azure y entorno propio de proyecto.",
    type: 'figure',
    script: "Esta diapositiva distingue dos usos de la misma plataforma. La fila superior muestra el despliegue público que hemos preparado en Azure para facilitar el acceso a HYDRA. El código se conserva en GitHub, se construyen imágenes con sus dependencias, se almacenan en Azure Container Registry y se ejecutan en Azure Container Apps. La web reúne la documentación, las herramientas interactivas y los casos de estudio. La API atiende las operaciones de las herramientas y JupyterLab permite explorar y ejecutar los notebooks disponibles. Los datos y las sesiones que deben conservarse utilizan almacenamiento persistente.\n\nEsta instalación pública facilita conocer los métodos, consultar su documentación y trabajar con los ejemplos disponibles. Abrir un notebook en ella prepara una copia de trabajo dentro de la infraestructura compartida; no despliega una instalación completa de HYDRA para cada usuario.\n\nLa fila inferior muestra cómo un usuario puede montar su propio entorno para un proyecto. Obtiene una versión del repositorio y utiliza la configuración Docker Compose incluida para construir y levantar los servicios web, API y JupyterLab en su equipo o en un servidor propio. A continuación configura los volúmenes que conectan esos servicios con sus carpetas de datos, modelos y resultados. Así puede adaptar los notebooks y la configuración al problema que quiere estudiar, conservando sus archivos fuera de la vida del contenedor.\n\nTambién existe una variante más sencilla para quien solo quiera trabajar con notebooks: ejecutar únicamente el contenedor de JupyterLab con pyhydra y sus dependencias. En ese caso no necesita levantar la web ni la API. Conecta sus notebooks y datos mediante volúmenes, configura el acceso directo a JupyterLab y conserva los resultados en sus carpetas de proyecto. La plataforma completa es útil si desea disponer también de las herramientas y la interfaz web; el contenedor de notebooks basta cuando el trabajo se realiza desde código.\n\nLas imágenes reúnen el software y sus dependencias compatibles, pero un proyecto sigue necesitando sus datos, parámetros y los motores externos que utilice. Deben comprobarse sus requisitos de instalación, plataforma y licencia. Docker Compose proporciona el punto de partida del entorno propio; su puesta en servicio en un servidor exige configurar también los accesos y la persistencia. La distinción central es, por tanto, el propósito de cada instalación: Azure ofrece una puerta de entrada pública a HYDRA; el despliegue propio permite organizar y conservar el trabajo específico de un proyecto.",
    notes: "Fuentes: README.md, docs/instalacion.md, docker/docker-compose.yml y deploy/azure/README.md. La configuración local incluye web, API y JupyterLab; el servicio jupyter puede utilizarse por separado, configurando el puerto de acceso, JUPYTER_BASE_URL, JUPYTER_WORKDIR y los volúmenes de notebooks y datos; HYDRA_DATA_PATH permite montar una carpeta de datos propia. En Azure, web/API y Jupyter se ejecutan en aplicaciones separadas. No confundir una copia de notebook en el servicio público con un contenedor o instalación exclusiva por usuario. No afirmar que Docker elimina requisitos de motores o licencias. La configuración Compose es un punto de partida: revisar autenticación y accesos antes de exponer un servidor propio.",
    backup: false,
    speakerGoal: "Diferenciar la plataforma pública en Azure del despliegue que un usuario configura para sus propios proyectos.",
    visualGuide: ["Arriba: despliegue público en Azure y recursos que ofrece", "Abajo: Plataforma completa o solo JupyterLab; archivos propios del proyecto"],
    speechCues: ["dos usos", "despliegue público", "Azure", "documentación", "herramientas interactivas", "infraestructura compartida", "propio entorno", "Docker Compose", "solo notebooks", "JupyterLab", "web, API y JupyterLab", "datos, modelos y resultados", "motores externos", "cuatro módulos"],
    transition: "En cualquiera de los dos entornos, las operaciones científicas se organizan en los mismos cuatro módulos.",
    transitionCue: "cuatro módulos",
  },

  {
    id: 12.6,
    block: 'Arquitectura', blockColor: '#0891b2',
    title: "Cuatro módulos funcionales, un núcleo científico",
    subtitle: "La misma organización que encontramos al navegar por HYDRA",
    estimatedMinutes: 1,
    type: 'figure',
    figure: 'fig_pyhydra_modules.svg', figurePosition: 'full',
    figureCaption: "Fuentes de datos → Análisis climático → Generación estocástica → Modelización",
    script: "Las cuatro columnas corresponden a los módulos de la web: fuentes de datos, análisis climático, generación estocástica y modelización. Sus productos se conectan: series documentadas, distribuciones y escenarios, realizaciones sintéticas y respuestas físicas. Cada estudio utiliza los componentes necesarios.\n\nLa columna de fuentes de datos reúne lluvia, caudal, proyecciones y suelos. La de análisis climático incluye series y extremos, análisis espacial, corrección de sesgo y downscaling híbrido. La generación estocástica produce múltiples realizaciones con variabilidad y dependencia. La modelización conecta HEC-HMS, SWAT, SFINCS y HEC-RAS y añade el análisis de sensibilidad hidráulica. Las rutas de código indican dónde se implementan esas capacidades. La franja inferior explica por qué los cuatro módulos de la web no equivalen a cuatro paquetes independientes: análisis y generación comparten climate. Este dibujo es un mapa funcional; cada caso elegirá su propia cadena de operaciones.\n\n¿Por qué separamos análisis climático y generación estocástica si ambos están dentro de climate? Porque esta diapositiva explica funciones metodológicas, no paquetes de programación. El análisis caracteriza las series, sus extremos y dependencias, y trata el sesgo o la señal de cambio climático. La generación utiliza la caracterización estadística para producir múltiples realizaciones sintéticas con la variabilidad y dependencia consideradas. Se distinguen para explicar qué hace cada parte y qué entrega a la siguiente, aunque comparten métodos y se implementan en el mismo paquete climate. Por tanto, hay cuatro módulos funcionales en la web y tres paquetes principales en el código: data_sources, climate y modeling. Ahora explicaré sus operaciones y comprobaciones, siguiendo el recorrido científico.",
    notes: "Mantener los cuatro nombres de la web. No confundir cuatro módulos funcionales con tres paquetes del código (data_sources, climate y modeling) ni con los tres niveles de arquitectura (núcleo, servicios e interfaz). El downscaling híbrido integra etapas y utiliza otros componentes; el diagrama muestra su ubicación, no cuatro etapas obligatorias.",
    speakerGoal: "Reconocer los cuatro módulos de la web y distinguirlos de la organización interna del código.",
    visualGuide: ["Fuentes de datos", "Análisis climático", "Generación estocástica", "Modelización", "Franja inferior: correspondencia con los paquetes del código"],
    speechCues: ["funciones metodológicas","caracteriza las series","realizaciones sintéticas","cuatro columnas","fuentes de datos","análisis climático","generación estocástica","modelización","productos","climate","catorce submódulos","tres paquetes","operaciones y comprobaciones"],
    transition: "La primera dificultad práctica es que las entradas proceden de fuentes muy distintas.",
    transitionCue: "bloque de datos"
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
    script: "Las fuentes de la izquierda aportan observaciones, reanálisis, satélites, caudales, suelos y proyecciones. El adaptador central recibe una variable, un dominio y un período; descarga y convierte unidades, coordenadas y tiempos a estructuras comunes. La salida de la derecha conserva valores y metadatos de procedencia.\n\nLa figura distingue las familias de fuentes, los adaptadores y una salida común organizada por tiempo, espacio y variable. Cuando corresponde, se utiliza UTC para la referencia temporal y WGS84 para las coordenadas. La fuente, la fecha y la consulta se conservan como metadatos. Esto permite reconstruir de dónde procede un valor y evitar comparar, por ejemplo, acumulaciones con unidades o intervalos distintos. Estaciones, reanálisis y satélite aportan información de naturaleza diferente: antes de combinarlos debemos comprobar qué representa cada producto y cuál es su resolución útil para el problema.\n\nAntes de ajustar modelos revisamos ausencias, cobertura, resolución y representatividad. Una serie de ERA5 puede aportar continuidad temporal, pero sus extremos locales deben contrastarse con estaciones. Homogeneizar formatos permite conectar etapas; no convierte todas las fuentes en observaciones equivalentes.",
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
    speechCues: ["variable, un dominio y un período","estructuras comunes","metadatos","ausencias","representatividad","ERA5","contrastarse con estaciones","no convierte","familias de fuentes","adaptadores","salida común"],
    transition: "Con las entradas identificadas y revisadas, podemos estimar la frecuencia de sus valores extremos.",
    transitionCue: "frecuencia de sus extremos"
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
    script: "Partimos de máximos anuales y ajustamos la GEV mediante localización, escala y forma; este último parámetro controla la cola. Comparamos máxima verosimilitud, L-momentos o inferencia bayesiana según los datos y supuestos.\n\nEn la gráfica, los puntos negros representan máximos anuales de la muestra. La línea azul ilustra máxima verosimilitud; la roja discontinua, L-momentos; y la verde, una aproximación bayesiana. La gris punteada es la distribución de referencia de este ejemplo. Para comparar estimadores fijamos el mismo período de retorno y leemos la altura de sus curvas. En períodos elevados se separan porque la información sobre la cola es escasa. Las bandas muestran incertidumbre alrededor de las estimaciones; no convierten una extrapolación en una observación. Esta figura sirve para explicar esa sensibilidad, sin demostrar que un estimador concreto sea siempre superior.\n\nCuando una estación tiene pocos datos, el análisis regional puede aportar información de estaciones homogéneas, normalizada y reescalada localmente. La homogeneidad debe justificarse. La referencia punteada solo se conoce en esta figura ilustrativa.",
    notes: "Memoria: §5.2 (GEV/GPD, estimadores e incertidumbre) y §5.3.1 (AFR). GEV sobre máximos de bloque y GPD sobre excedencias independientes son enfoques distintos. AFR: diagnosticar discordancia/heterogeneidad, normalizar por índice local, ajustar distribución regional y reescalar. No atribuir sus resultados a la curva ilustrativa de la derecha. Bootstrap, posterior MCMC y aproximación Fisher de la demo no son intercambiables.",
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
      'Análisis regional: normalizar, combinar estaciones homogéneas y reescalar los cuantiles locales.',
    ],
    speakerGoal: "Un valor de diseño debe leerse junto con su incertidumbre.",
    visualGuide: ["Izquierda: parámetros de la GEV","Derecha: puntos y curvas","Períodos mayores: extrapolación y bandas"],
    speechCues: ["máximos anuales","localización, escala y forma","máxima verosimilitud","L-momentos","inferencia bayesiana","cuantil","incertidumbre","análisis regional","estaciones homogéneas","figura ilustrativa","puntos negros","línea azul","roja discontinua","verde","gris punteada"],
    transition: "Pero ajustar cada variable por separado no describe cómo ocurren conjuntamente.",
    transitionCue: "dependencia entre variables"
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
    script: "El caudal horizontal y el nivel del mar vertical tienen distribuciones marginales propias, representadas en los bordes. Ajustamos esas marginales y después una cópula para conservar su dependencia al generar pares. Los puntos negros son observaciones y los grises, realizaciones.\n\nLos paneles de los bordes muestran la densidad marginal de cada variable: indican dónde se concentran sus valores por separado. La nube central añade la información de cómo coinciden caudal y nivel del mar. Una cópula permite representar esa dependencia separadamente de las marginales. En las isolíneas podemos movernos entre un caudal mayor y un nivel menor, o al contrario, conservando una misma definición de frecuencia conjunta. La combinación de máxima densidad señalada con una cruz es una referencia estadística; no tiene por qué producir el mayor calado. Esa respuesta depende también de la geometría y de las condiciones del modelo hidráulico.\n\nLas curvas AND, rojas, exigen superar ambos umbrales; las OR, azules, al menos uno. Las cruces localizan máxima densidad sobre cada curva. Un mismo período de retorno conjunto admite muchas parejas, con impactos diferentes. Por eso propagamos las combinaciones por el modelo físico antes de asignar frecuencia al impacto.",
    notes: "Q está en m³/s y SL en metros. AND: ambos umbrales; OR: al menos uno. Las cruces MPDE localizan máxima densidad sobre una isolínea: no equivalen automáticamente a máxima respuesta hidráulica.",
    bullets: [
      'Familias: gaussiana para pico, duración y volumen; Gumbel, Clayton y Frank para eventos compuestos.',
      'T_OR: al menos una variable supera el umbral (diseño conservador).',
      'T_AND: superación simultánea (crítica en confluencias fluviales).',
      'Evento de diseño más probable: máximo de la densidad conjunta sobre la isolínea del período de retorno (Salvadori y De Michele).',
    ],
    speakerGoal: "La dependencia determina qué combinaciones deben simularse.",
    visualGuide: ["Ejes Q y SL y puntos observados","Distribuciones marginales en los bordes","Curvas AND/OR y cruces de máxima densidad"],
    speechCues: ["distribuciones marginales","cópula","dependencia","puntos negros","grises","AND","ambos umbrales","OR","al menos uno","muchas parejas","frecuencia al impacto","densidad marginal","máxima densidad"],
    transition: "Una vez descritas las distribuciones y la dependencia, podemos generar escenarios que conserven las propiedades seleccionadas.",
    transitionCue: "generar las realizaciones"
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
    script: "El generador se elige según el problema: NEOPRENE representa lluvia mediante tormentas y células, en un punto con NSRP o en varias estaciones con STNSRP. CoSMoS reproduce una distribución marginal y su dependencia temporal.\n\nCalibramos con las series de entrada y generamos realizaciones; después comprobamos estacionalidad, dispersión, persistencia y, cuando corresponde, dependencia espacial. Los tres gráficos comparan media mensual, desviación típica y autocorrelación. Aquí la entrada «observado» también es sintética: explica el diagnóstico, sin validar todos los generadores. La salida es un ensemble que alimentará los modelos físicos.\n\nEn los tres gráficos, las barras verdes representan la entrada y la línea naranja, el resultado simulado de la demostración. El primero compara la evolución estacional de la media; el segundo, cuánto varían los valores alrededor de ella; el tercero, la relación con el valor del paso temporal anterior. Se aprecia una buena coincidencia de las medias, mientras que la autocorrelación presenta diferencias en varios meses. Ese diagnóstico importa: dos series pueden tener medias parecidas y una persistencia distinta. Si alimentan un modelo hidrológico, la duración y la secuencia de las entradas pueden influir en la respuesta. La comparación debe hacerse antes de utilizar las realizaciones en un estudio de diseño.",
    notes: "Memoria: §5.4. NEOPRENE (NSRP/STNSRP) y CoSMoS son librerías externas integradas como envoltorios. En lluvia también se comprueban frecuencia de días secos/húmedos y extremos; en multisitio, correlación espacial y simultaneidad. La captura es una demo sintética con simulación rápida AR(1) estacional y transformación marginal, no una ejecución completa de STNSRP. Selección MaxDiss y reconstrucción k-NN se explican después de los motores físicos.",
    bullets: ["NEOPRENE: tormentas y células; NSRP puntual o STNSRP multisitio.","CoSMoS: distribución marginal, autocorrelación y estacionalidad.","Calibrar → generar → comprobar media, dispersión, persistencia y dependencia espacial.","Salida: realizaciones sintéticas; verificar sus propiedades antes de simular impactos."],
    speakerGoal: "Generar, comprobar propiedades y seleccionar escenarios representativos.",
    visualGuide: ["Tres gráficos: media, dispersión y autocorrelación","Barras de la serie de entrada y línea simulada","Condición previa a usar las realizaciones"],
    speechCues: ["NEOPRENE","NSRP","STNSRP","CoSMoS","Calibramos","comprobamos","dependencia espacial","tres gráficos","también es sintética","ensemble","barras verdes","línea naranja"],
    transition: "Esas trayectorias deben convertirse ahora en una respuesta hidrológica e hidráulica.",
    transitionCue: "modelos físicos"
  },

  {
    id: 17,
    block: 'Bloque de modelización', blockColor: '#0ea5e9',
    title: 'Modelos hidrológicos e hidráulicos',
    subtitle: 'Cinco submódulos para preparar y validar motores físicos',
    estimatedMinutes: 2,
    url: '/modules/modelizacion',
    type: 'normal',
    script: "El modelo hidrológico convierte lluvia en hidrogramas; el hidráulico transforma caudales y condiciones de contorno en calados, velocidades y extensión inundada. HEC-HMS y SWAT+ cubren la primera tarea; HEC-RAS y SFINCS, la segunda.\n\nEl adaptador prepara archivos, ejecuta el motor con su versión registrada, lee las salidas y comprueba unidades, rangos y finalización. Obtenemos respuestas comparables por escenario. La geometría, la rugosidad, las condiciones de contorno y la estabilidad numérica requieren revisión experta. Iber fue el motor manual de los trabajos fundacionales; no tiene un adaptador propio en pyhydra.\n\nLas cuatro operaciones del adaptador tienen salidas verificables. Preparar produce los archivos y parámetros que espera el motor. Ejecutar registra cómo terminó el proceso y con qué versión. Leer convierte sus resultados a estructuras comunes, y validar comprueba que existen, tienen unidades coherentes y permiten continuar. Esto es distinto de demostrar que el modelo reproduce el comportamiento observado del sistema. La revisión física incluye la geometría, las estructuras, las condiciones de contorno y las decisiones de calibración. La figura separa ambas tareas para que la automatización de una ejecución no se confunda con la validación completa de un modelo.",
    notes: "El esquema del adaptador distingue preparación, ejecución, homogeneización y validación. Iber se usó manualmente en los trabajos fundacionales; no atribuirle integración automática.",
    bullets: [
      'HEC-HMS: calibración automática de parámetros frente a NSE, PBIAS o RMSE.',
      'SWAT+: simulación continua con forzamientos climáticos generados automáticamente.',
      'SFINCS: motor 2D rápido para campañas Monte Carlo de miles de escenarios.',
      'HEC-RAS 1D/2D: geometría e hidrogramas de entrada preparados automáticamente.',
      'Límite: Iber (Besaya, Mallorca) no tiene adaptador por falta de ejecución por lotes.',
    ],
    speakerGoal: "Los adaptadores conectan escenarios y respuestas físicas.",
    visualGuide: ["Escenarios de entrada","Cuatro operaciones del adaptador","Motores conectados e Iber manual"],
    speechCues: ["hidrogramas","calados, velocidades y extensión","HEC-HMS y SWAT+","HEC-RAS y SFINCS","prepara archivos","versión registrada","respuestas comparables","revisión experta","Iber","Preparar","Ejecutar","Leer","validar"],
    transition: "Con los métodos y los adaptadores conectados, podemos ofrecer la misma operación a través de una herramienta web.",
    transitionCue: "herramientas web"
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
    script: "Los seis accesos superiores permiten utilizar extremos, cópulas, series sintéticas, curvas IDF, análisis regional y corrección de sesgo. El esquema inferior muestra el recorrido común: la web envía entradas y parámetros a la API, pyhydra calcula y devuelve resultados.\n\nLos accesos superiores corresponden a preguntas concretas. Extremos estima cuantiles y su incertidumbre; cópulas, combinaciones de variables dependientes; series sintéticas, realizaciones temporales; IDF, relaciones entre intensidad, duración y frecuencia; análisis regional, estimaciones que comparten información entre estaciones; y corrección de sesgo, transformación de proyecciones respecto a una referencia. El esquema inferior muestra su acceso común al núcleo. La pantalla facilita configurar una operación, pero cada resultado debe interpretarse junto con la serie utilizada, el método seleccionado y sus hipótesis. La demostración siguiente permitirá recorrer ese proceso sin mezclar varias herramientas a la vez.\n\nLa interfaz hace accesible el cálculo; interpretar sus hipótesis y límites exige criterio técnico. Mostraré una operación completa con la herramienta de extremos.",
    notes: "Esta diapositiva explica el acceso al método; la siguiente demuestra su operación. La explicación y la interacción se cronometran por separado en el ensayo de esta versión amplia.",
    bullets: [
      'Simulación estocástica CoSMoS en 3 pasos',
      'Estimación de GEV bayesiana y curvas de retorno',
      'Cópulas compuestas y curvas AND/OR en confluencias',
      'Una demostración principal; el resto, preparado como material de reserva para preguntas',
    ],
    speakerGoal: "La interfaz facilita el acceso; la interpretación exige conocer el método.",
    visualGuide: ["Seis herramientas de la parte superior","API común","Núcleo pyhydra"],
    speechCues: ["seis accesos","recorrido común","entradas y parámetros","API","pyhydra","hipótesis y límites","herramienta de extremos","Extremos","cópulas","series sintéticas","IDF","análisis regional","corrección de sesgo"],
    transition: "En esa demostración distinguiremos la serie que entra al cálculo, el estimador puntual y el origen de la incertidumbre mostrada.",
    transitionCue: "herramienta de extremos",
    sectionLabel: "Herramientas interactivas"
  },

  {
    id: 19,
    offlineScript: "La primera captura muestra la entrada Demo: precipitación diaria sintética de 1980 a 2024. Los controles configuran eventos y ajuste; todavía no hay resultados. La GEV utiliza máximos anuales.\n\nLa opción Demo permite trabajar con una entrada identificada y repetir el ejemplo. Antes del ajuste hay que reconocer qué variable y unidad se utilizan y qué parte del registro entra en el cálculo. La selección de eventos por umbral es una operación diferente del ajuste GEV sobre máximos anuales. En el gráfico de salida, un período de retorno se interpreta bajo las hipótesis del ajuste: por ejemplo, cien años corresponde a una probabilidad anual de superación del uno por ciento si se mantiene ese modelo. No significa que el episodio deba repetirse regularmente cada cien años. La curva y la banda deben leerse sobre la misma escala y para el mismo período.\n\nPaso a la segunda captura, «Resultado e incertidumbre». El eje horizontal indica período de retorno y el vertical, precipitación. La curva verde es el ajuste MAP. La banda P5–P95 utiliza una aproximación de Fisher alrededor del ajuste MLE; no procede de MCMC. Leemos curva y banda conjuntamente para el período de diseño: su ensanchamiento advierte de incertidumbre al extrapolar.",

    offlineFrames: [{"src":"offline_gev_entrada.png","label":"Configuración inicial","caption":"Estado anterior al cálculo: selección de la serie sintética Demo y controles del ajuste."},{"src":"offline_gev_resultado.png","label":"Resultado e incertidumbre","caption":"Resultado de la demo sintética: curva MAP y banda aproximada Fisher alrededor de MLE."}],
    block: 'Demo en vivo', blockColor: '#10b981',
    title: "Demostración guiada: GEV MAP e incertidumbre aproximada",
    subtitle: "Máximos anuales, ajuste MAP y bandas mediante Fisher",
    estimatedMinutes: 2,
    url: '/tools/statistical',
    webMode: 'demo',
    webLabel: 'Evidencia 2 · Motor científico operativo',
    webPurpose: 'Enseñar una sola cadena científica completa, conectada con el caso Valencia.',
    webAction: 'Ejecutar el ajuste preparado, identificar entrada y método y señalar resultado, incertidumbre y trazabilidad. Cronometrar este paso después de revisar el libreto amplio.',
    type: 'normal',
    script: "En la columna de entrada selecciono Demo: precipitación diaria sintética de 1980 a 2024. Los controles permiten separar eventos; la GEV utiliza máximos anuales. Pulso «Ajustar modelo».\n\nLa opción Demo permite trabajar con una entrada identificada y repetir el ejemplo. Antes del ajuste hay que reconocer qué variable y unidad se utilizan y qué parte del registro entra en el cálculo. La selección de eventos por umbral es una operación diferente del ajuste GEV sobre máximos anuales. En el gráfico de salida, un período de retorno se interpreta bajo las hipótesis del ajuste: por ejemplo, cien años corresponde a una probabilidad anual de superación del uno por ciento si se mantiene ese modelo. No significa que el episodio deba repetirse regularmente cada cien años. La curva y la banda deben leerse sobre la misma escala y para el mismo período.\n\nEn el resultado, el eje horizontal indica período de retorno y el vertical, precipitación. La curva verde es el ajuste MAP, máximo de la posterior. La banda P5–P95 utiliza una aproximación de Fisher alrededor del ajuste MLE; no procede de MCMC. Para un período de diseño leemos curva y banda conjuntamente: su ensanchamiento advierte de incertidumbre al extrapolar.",
    notes: "En vivo: revisar entrada → ejecutar → leer curva y banda. En capturas: alternar Datos y ajuste → Resultado e incertidumbre. La serie es sintética. La GEV usa máximos anuales; las bandas Fisher alrededor de MLE no son una posterior MCMC.",
    bullets: ["Serie demo sintética o CSV identificado.","Extracción de eventos por umbral; GEV sobre máximos anuales.","Ajuste puntual MAP y bandas aproximadas mediante Fisher.","Respaldo local: figura del notebook de Valencia, con método y procedencia."],
    speakerGoal: "Configurar primero; ejecutar y leer después la curva y la banda.",
    visualGuide: ["Entrada: opción Demo y controles","Acción: Ajustar modelo","Resultado: curva MAP y banda Fisher"],
    speechCues: ["columna de entrada","Demo","máximos anuales","Ajustar modelo","MAP","Fisher","MLE","no procede de MCMC","curva y banda"],
    transition: "La demo muestra que el método puede ejecutarse. Los casos permiten valorar qué conocimiento y qué capacidad operativa aporta.",
    transitionCue: "evidencias de los casos",
    offlineSpeechCues: ["primera captura","Demo","todavía no hay resultados","máximos anuales","segunda captura","MAP","Fisher","MLE","no procede de MCMC","curva y banda"],
    sectionLabel: "Demostración GEV"
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
    script: "Estas dos capturas documentan la generación estocástica. Partimos de la serie demo sintética de caudal diario de 1990 a 2019. La primera figura compara, mes a mes, la media, la desviación estándar y la autocorrelación de primer retardo del registro de entrada y de las realizaciones. Después mostramos 30 realizaciones para 2025, obtenidas con semilla 42: la línea resume la mediana y las bandas muestran la dispersión entre trayectorias. No estamos prediciendo el caudal observado de 2025; estamos generando escenarios plausibles. La interfaz calibra con CoSMoS y utiliza una simulación rápida mediante AR(1) estacional y transformación a las marginales ajustadas. Debemos comprobar sus diagnósticos antes de utilizar el ensemble en un cálculo de diseño.\n\nEl diagnóstico y el ensemble responden a dos preguntas distintas. Los gráficos mensuales comprueban si la simulación conserva propiedades de la entrada. El ensemble muestra trayectorias alternativas que cumplen aproximadamente esas condiciones. La mediana resume la posición central entre realizaciones; las bandas describen su dispersión y no son una predicción observacional de un año concreto. La semilla permite repetir esta ejecución, pero no modifica la naturaleza sintética del ejemplo. Antes de alimentar un modelo físico, revisaríamos también extremos, persistencia y, si hubiera varias estaciones, su dependencia espacial. Una coincidencia de medias no garantiza por sí sola que todas esas propiedades estén reproducidas.",
    notes: "Capturas de la API ejecutada el 6 de octubre de 2026. Mostrar primero el diagnóstico estacional y después el ensemble. Datos demo sintéticos; 30 años de calibración y 30 realizaciones de un año. La simulación rápida conserva la marginal y aproxima la dependencia con AR(1), no toda la estructura temporal de una simulación CoSMoS completa.",
    sectionLabel: "Demostración documentada",
    speechCues: ["dos preguntas distintas","mediana","serie demo sintética","media","desviación estándar","autocorrelación","30 realizaciones","bandas","AR(1)","diagnóstico","ensemble"]

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
    script: "Esta captura procede del análisis del CSV demo de mil simulaciones HEC-RAS. Cada punto corresponde a una simulación del ensemble y relaciona una medida de Manning con el calado medio, el calado mediano o el área inundada. Las rectas resumen una asociación lineal simple: el R cuadrado del calado medio es 0,0069 y el del calado mediano, 0,0014. Una relación lineal tan débil no significa que la rugosidad carezca de efecto. Puede haber respuestas no lineales, umbrales topográficos y otros controles. Esta herramienta analiza salidas ya calculadas; no vuelve a ejecutar HEC-RAS ni reproduce aquí las 995 parejas HEC-RAS y SFINCS del contraste principal. La figura permite explicar por qué necesitamos mirar la distribución del impacto y sus regímenes, además de una única regresión.\n\nPara leer cada nube fijamos qué indicador aparece en el eje vertical y qué resumen de Manning se utiliza en el horizontal. Una nube poco alineada con la recta indica que una relación lineal simple explica una fracción pequeña de esa variación; no demuestra independencia física ni ausencia de otros mecanismos. La media y la mediana del calado tampoco describen exactamente la misma propiedad de la inundación. Esta demo sirve como diagnóstico de salidas agregadas. Si detectamos grupos o cambios de régimen, necesitamos volver a los mapas y condiciones hidráulicas para investigarlos. Es la diferencia entre describir una asociación estadística y explicar el mecanismo que la produce.",
    notes: "La demo lee un CSV con 1000 simulaciones HEC-RAS y calcula estadísticos, correlaciones y regresiones. Distinguir este CSV del conjunto emparejado y depurado de 995 realizaciones por motor presentado en el caso principal. No afirmar que la interfaz elige distribuciones de Manning ni ejecuta los motores hidráulicos.",
    sectionLabel: "Demostración documentada",
    speechCues: ["eje vertical","mapas y condiciones hidráulicas","mil simulaciones","Manning","calado medio","calado mediano","área inundada","R cuadrado","0,0069","0,0014","no lineales","CSV"]

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
    script: "La captura muestra una curva IDF obtenida con la demo sintética: cuarenta años de máximos anuales y siete duraciones, desde diez minutos hasta veinticuatro horas. Para cada duración se ajusta una GEV mediante MAP y se calculan intensidades asociadas a varios períodos de retorno. Cada línea representa un período de retorno distinto; la intensidad disminuye al aumentar la duración. Este producto organiza los extremos de precipitación y puede ser una entrada de diseño. Por sí solo no describe la forma temporal completa de la tormenta, la humedad antecedente ni la respuesta hidráulica. Por eso sirve para explicar la diferencia entre caracterizar la lluvia y calcular la frecuencia del impacto. Las cifras de esta demo no son los resultados del estudio IAHR 2022.\n\nEl eje horizontal representa duración y el vertical, intensidad. Para leer una lluvia de diseño elegimos una duración y una curva de período de retorno, y obtenemos su intensidad en la intersección. Cambiar de duración manteniendo el período compara extremos de distinta ventana temporal. Las líneas no son la evolución de una tormenta: no indican en qué momento llueve más dentro de un episodio. Para construir un hietograma y obtener un impacto hacen falta decisiones adicionales sobre distribución temporal, patrón espacial y estado de la cuenca. Esa distinción permite utilizar las curvas IDF con su finalidad propia sin asignar automáticamente su frecuencia al calado resultante.",
    notes: "Figura obtenida ejecutando /tools/idf con datos sintéticos. Ajuste MAP por duración. Usar como explicación de las curvas IDF, no como reproducción del experimento IAHR 2022 ni de sus caudales.",
    sectionLabel: "Demostración documentada",
    speechCues: ["eje horizontal","vertical","IDF","cuarenta años","siete duraciones","MAP","períodos de retorno","intensidad","duración","hietograma","frecuencia del impacto"]

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
    script: "En esta captura usamos cinco estaciones sintéticas con cuarenta años de máximos anuales. El análisis regional divide los datos por el caudal índice de cada estación y ajusta una curva común mediante L-momentos. La figura central muestra el factor de crecimiento q de T. Para recuperar el nivel en una estación, multiplicamos ese factor por su caudal índice. A la derecha comprobamos la homogeneidad: en esta demo, H vale 0,386 y queda por debajo de uno. También se revisa la discordancia de las estaciones antes de agruparlas. Es una explicación del procedimiento index-flood; no son las 224 estaciones del caso Valencia ni sus períodos de retorno. La selección de la región debe justificarse físicamente, porque agrupar estaciones inadecuadas puede suavizar en exceso un extremo local.\n\nLa curva de crecimiento regional permite separar forma estadística y escala local. Primero dividimos cada serie por su índice para trabajar con magnitudes comparables; después ajustamos el comportamiento común y finalmente recuperamos las unidades multiplicando por el índice de la estación. El estadístico de heterogeneidad orienta sobre la compatibilidad del conjunto y la discordancia ayuda a localizar estaciones que requieren revisión. Un valor favorable en una demo no sustituye la justificación climática e hidrológica de una región real. La ganancia consiste en compartir información entre series comparables, manteniendo el vínculo con cada estación y evitando mezclar regímenes incompatibles solo para aumentar el tamaño de la muestra.",
    notes: "Captura real de /tools/rfa: 5 estaciones sintéticas, 40 años, L-momentos, H=0,386. No confundir con Valencia. Etiquetas completas de períodos 25, 50, 200 y 500 verificadas.",
    sectionLabel: "Demostración documentada",
    speechCues: ["curva de crecimiento regional","heterogeneidad","cinco estaciones","caudal índice","L-momentos","homogeneidad","0,386","discordancia","escala local","región"]

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
    script: "La captura compara métodos sobre la misma demo de ocho estaciones: IDW, kriging ordinario y una función de base radial. En el mapa, los puntos sitúan las estaciones y el campo continuo representa la variable interpolada en los puntos objetivo. La validación cruzada deja fuera una estación, predice su valor con las restantes y repite el proceso para calcular el RMSE. Así podemos comparar métodos con los mismos datos y no solo por el aspecto del mapa. Esta interfaz muestra kriging ordinario; no incluye aquí la covariable de elevación de un kriging universal. Tampoco convierte una red escasa en observaciones nuevas: la calidad sigue limitada por la distribución de estaciones y la estructura espacial de la variable.\n\nLos puntos del mapa representan el soporte observacional; los valores entre ellos son estimaciones del interpolador. Un campo visualmente suave puede seguir teniendo errores importantes donde la red es escasa o cambia el régimen espacial. La validación dejando una estación fuera obliga a predecir un dato conocido sin utilizarlo en el ajuste de esa repetición. El RMSE resume esas diferencias en las unidades de la variable. Para comparar los tres métodos mantenemos las mismas estaciones y el mismo protocolo. El resultado informa sobre el comportamiento en esta muestra, sin garantizar el mismo error en todos los puntos del territorio ni en otro episodio.",
    notes: "Captura de la ejecución local de /tools/interpolation. Demo de 8 estaciones; IDW, kriging ordinario y RBF. Señalar el mapa y el RMSE LOOCV. No presentar como reproducción de Andes o Mallorca ni como kriging universal con DEM.",
    sectionLabel: "Demostración documentada",
    speechCues: ["soporte observacional","dejando una estación fuera","ocho estaciones","IDW","kriging ordinario","base radial","RMSE","validación cruzada","mismos datos"]

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
    script: "Esta captura usa treinta años de precipitación diaria sintética y la opción multiplicativa de Quantile Delta Mapping. A la izquierda se comparan las distribuciones acumuladas de la referencia, del modelo bruto y del modelo corregido. A la derecha, las medias mensuales permiten comprobar la estacionalidad y cómo cambia el sesgo. La corrección se calibra en un período histórico y se aplica al escenario: su objetivo es ajustar el sesgo sin borrar la señal de cambio, por lo que la distribución futura corregida no tiene por qué coincidir exactamente con la observación histórica. La interfaz permite también otras opciones, como Scaled Distribution Mapping. Esta es una demostración del módulo; las capturas no corresponden a datos de Panamá, Andes o SIMPCCe. En esos proyectos hay que documentar además el método, las variables y los períodos empleados.\n\nLa distribución acumulada relaciona un valor de precipitación con la proporción de datos que queda por debajo. Permite reconocer diferencias que una media única ocultaría. El gráfico mensual añade la estacionalidad: una corrección global puede comportarse de forma distinta según el mes. Para interpretar el escenario futuro hay que distinguir el sesgo histórico de la señal de cambio que queremos conservar según la variante aplicada. La referencia observada no es una plantilla que deba copiarse en todos los horizontes futuros. La comprobación consiste en revisar cómo se transforman las propiedades relevantes y documentar qué hipótesis sostienen esa transformación.",
    notes: "Captura de /tools/bias con demo sintética y QDM multiplicativo. No afirmar que este resultado reproduce las 414 combinaciones de Panamá ni que todos los proyectos usaron idéntica configuración. Señalar CDF, medias mensuales y conservación de la señal del escenario.",
    sectionLabel: "Demostración documentada",
    speechCues: ["distribución acumulada","señal de cambio","Quantile Delta Mapping","distribuciones acumuladas","medias mensuales","período histórico","Scaled Distribution Mapping"]

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
    script: "La captura muestra el ajuste de una cópula Gumbel a ciento veinte pares de caudal máximo y nivel del mar de la demo sintética. Los puntos representan los pares de la muestra y las líneas describen períodos de retorno conjuntos. En azul, OR significa que al menos una de las dos variables supera su umbral; en rojo, AND exige que ambas lo superen simultáneamente. Las cruces localizan el evento de máxima densidad conjunta sobre cada isolínea, el MPDE. Hay múltiples combinaciones de caudal y nivel que comparten un mismo período de retorno conjunto: por eso el diseño compuesto no se reduce a sumar dos extremos univariantes. Podemos comparar familias de cópulas, pero la elección debe atender a la dependencia y a las colas. La figura está guardada localmente y puede explicarse sin ejecutar la herramienta.\n\nEn esta demo, los pares de la muestra son sintéticos, aunque la herramienta permita trabajar con observaciones de un estudio real. Para leer una curva conjunta fijamos la definición AND u OR y después buscamos las combinaciones de ambos ejes que pertenecen a ella. Cambiar de definición modifica la probabilidad que estamos calculando. La cruz de máxima densidad identifica una combinación estadísticamente característica de esa curva, sin sustituir una exploración de su respuesta hidráulica. Si el nivel del mar dificulta el desagüe o si un caudal elevado domina el resultado, el escenario de mayor impacto dependerá de esas condiciones físicas y no únicamente de la densidad de la cópula.",
    notes: "Captura real de /tools/compound con familia Gumbel y 120 pares sintéticos. Distinguir OR y AND y explicar las cruces MPDE. Los puntos de demo no son observaciones de un caso piloto.",
    sectionLabel: "Demostración documentada",
    speechCues: ["sintéticos","cruz de máxima densidad","Gumbel","ciento veinte","OR","AND","MPDE","máxima densidad","respuesta hidráulica"]

  },

  // ════════════════════════════════════════════════════
  // BLOQUE 7 — CASOS PILOTO Y VALIDACIÓN CIENTÍFICA
  // ════════════════════════════════════════════════════

  {
    id: 27,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Diez estudios, tres dimensiones de validación',
    subtitle: 'Dos estudios en el Besaya: frecuencia del impacto y sensibilidad a las rugosidades',
    estimatedMinutes: 2,
    type: 'table',
    script: "Esta tabla sitúa los diez estudios que examinaremos y muestra qué componentes intervienen en cada uno. Las primeras columnas identifican el problema y su aplicación principal. Las cuatro columnas centrales indican datos, clima o extremos, generación estocástica y modelización. Las marcas permiten seguir qué parte de la cadena necesita cada estudio; un guion señala que ese componente no forma parte del alcance mostrado.\n\nLos dos trabajos sobre el Besaya comparten dominio, pero responden a preguntas distintas: estimar la frecuencia del impacto y estudiar la sensibilidad a la rugosidad y al motor hidráulico. Mallorca y Calle 30 recorren cadenas hasta el resultado hidráulico. Valencia se concentra en extremos e incertidumbre. Tanganica, Andes, SIMPCCe y Panamá muestran aplicaciones climáticas en dominios y decisiones diferentes. El contraste IAHR 2022 permite examinar la influencia del procedimiento de diseño.\n\nLa última columna distingue cuatro estudios con notebooks —Besaya, rugosidades, Calle 30 y Valencia— de los seis documentados mediante publicaciones o proyectos. Tener un notebook permite consultar el procedimiento; ejecutarlo exige también los datos, las dependencias y los motores de cada flujo. La tabla presenta, por tanto, cobertura metodológica y disponibilidad de materiales, con alcances diferentes. Seguiremos los casos para interpretar qué evidencia aporta cada uno.",
    notes: "Diez estudios, no diez emplazamientos distintos. Cuatro entradas con notebooks; seis documentadas. Los notebooks actuales del Besaya no equivalen a reproducir automáticamente el flujo manual histórico de Iber. HEC-RAS requiere Windows y SFINCS su ejecutable y entorno de cálculo.",
    bullets: [
      "Besaya: frecuencia sobre el impacto",
      "Besaya: rugosidades de Manning y comparación de motores",
      "Mallorca: cadena en cuenca sin aforo",
      "Madrid Calle 30: lluvia multisitio y calado en túneles",
      "Valencia: extremos e incertidumbre tras la DANA de 2024",
      "Lago Tanganica: clima, caudal y cotas futuras",
      "Andes: calibración hidrológica regional",
      "IAHR 2022: procedimiento convencional frente a cadena estocástica",
      "SIMPCCe: caudales mínimos y gestión de embalses",
      "Panamá: automatización climática y capas de riesgo"
    ],
    speakerGoal: "Cada caso aporta una evidencia y un alcance de reproducción distintos.",
    visualGuide: ["Filas: aplicaciones","Columnas: componentes y disponibilidad en HYDRA","Tres preguntas de validación"],
    speechCues: ["diez estudios","frecuencia del impacto","sensibilidad","datos, clima o extremos, generación estocástica y modelización","Besaya","Mallorca y Calle 30","Valencia","Tanganica, Andes, SIMPCCe y Panamá","IAHR 2022","cuatro estudios con notebooks"],
    transition: "Empezamos en Besaya, donde se formuló el principio que debe conservar toda la arquitectura.",
    transitionCue: "frecuencia sobre el impacto"
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
    script: "Esta figura compara 995 realizaciones de rugosidad ejecutadas con ambos motores: 1.990 simulaciones. La leeré de arriba abajo, primero el calado y después el área inundada.\n\nArriba, cada punto corresponde a la misma realización: SFINCS en horizontal y HEC-RAS en vertical. A la izquierda se compara el calado medio, en metros; a la derecha, el área inundada, en kilómetros cuadrados. La diagonal discontinua indica igualdad. Por encima, HEC-RAS produce valores mayores. La diferencia media es de 0,172 metros en calado y 0,149 kilómetros cuadrados en área. Las correlaciones, próximas a 0,5, indican una asociación moderada: ambos motores no responden de forma equivalente.\n\nAquí, azul y rosa distinguen dos regímenes de HEC-RAS, de menor y mayor extensión. Las líneas horizontales señalan sus áreas medias: 0,577 y 0,700 kilómetros cuadrados.\n\nAbajo cambia el significado de los colores: verde representa SFINCS y rojo, HEC-RAS. Las curvas resumen cómo se distribuyen los resultados; un pico alto indica concentración alrededor de un valor, no más simulaciones. En calado, la curva roja está desplazada hacia valores mayores y es más ancha.\n\nEn área, SFINCS concentra sus resultados en una zona estrecha; HEC-RAS presenta dos regímenes, cuya separación se aprecia mejor arriba. El coeficiente de variación mide la dispersión respecto a la media: 8,4 por ciento en HEC-RAS y 2 por ciento en SFINCS. El análisis espacial vincula los regímenes con la conexión de un compartimento secundario de 7,4 hectáreas.\n\nEl coeficiente de variación es la desviación típica dividida por la media, expresada en porcentaje. Permite comparar dispersión relativa entre conjuntos con medias distintas. En calado es del 3 por ciento en SFINCS y del 5,7 por ciento en HEC-RAS; en área, del 2 y del 8,4 por ciento, respectivamente. Las curvas inferiores son densidades suavizadas: su altura no es una probabilidad puntual y cada distribución está normalizada. Las diferencias medias entre motores tampoco son errores frente a una medición. El anexo espacial permitirá investigar el mecanismo que separa los regímenes sin atribuirlo a una sola clase de Manning o a un umbral topográfico suficiente por sí mismo.\n\nLa conclusión es que elegir el motor modifica el impacto y su variabilidad. Estas diferencias no demuestran cuál reproduce mejor la realidad; para ello necesitamos observaciones.",
    notes: "Fuente: memoria definitiva, §7.2.3 y figura 7.3, pp. 91–93; código de la figura 4 en notebooks/pilot_cases/manning_rugosidades/06_figuras_paper.ipynb. Bias = media de HEC-RAS menos SFINCS: diferencia entre modelos, no error frente a observaciones. r de Pearson: 0,516 en calado y 0,490 en área; no es un porcentaje de acierto. Arriba, azul/rosa clasifican el régimen de HEC-RAS; abajo, verde/rojo identifican el motor. Los 97 casos de régimen bajo y 898 de régimen alto son realizaciones del ensemble, no probabilidades anuales. Las curvas inferiores son densidades suavizadas, con área total unitaria; la altura no es una probabilidad ni un recuento. CV = desviación típica / media × 100: calado 3,0 % SFINCS y 5,7 % HEC-RAS; área 2,0 % y 8,4 %. Las medias 0,577 y 0,700 km² son de los regímenes de HEC-RAS; su diferencia (12,3 ha) no equivale a la superficie del compartimento secundario (7,4 ha). La conexión no depende de una sola clase de Manning ni de rebasar por sí solo el collado de 60,1 m: intervienen campo de rugosidad, gradientes, malla y conectividad. Para ampliar este mecanismo, abrir el anexo de bifurcación hidráulica.",
    bullets: [
      'Enfoque Monte Carlo: 995 simulaciones hidráulicas emparejadas sobre 9 usos de suelo (Manning).',
      'Incertidumbre: Variabilidad inter-modelo (motores) > Variabilidad intra-modelo (rugosidad, <2% de la varianza).',
      'Bifurcación: un collado a cota 60,1 m s.n.m. controla la conexión con una llanura secundaria de unas 7,4 ha.',
      'Respuesta bimodal: HEC-RAS muestra saltos discretos (sesgo +0,172 m, r=0,52) no capturados por SFINCS.',
    ],
    speakerGoal: "La elección del motor también cambia el impacto estimado.",
    visualGuide: ["(a) Arriba izquierda: ejes, diagonal 1:1 y diferencia media de calado","(b) Arriba derecha: área, colores de los regímenes y medias 0,577 / 0,700 km²","(c) Abajo izquierda: cambio de colores a motores; concentración y desplazamiento del calado","(d) Abajo derecha: distribución del área y CV 8,4 % / 2 %","Cerrar con incertidumbre estructural y necesidad de observaciones"],
    speechCues: ["995 realizaciones","1.990 simulaciones","SFINCS en horizontal","HEC-RAS en vertical","diagonal discontinua","valores mayores","0,172 metros","0,149 kilómetros cuadrados","asociación moderada","azul y rosa","dos regímenes de HEC-RAS","0,577 y 0,700","Abajo cambia","verde representa SFINCS","rojo, HEC-RAS","no más simulaciones","coeficiente de variación","8,4 por ciento","2 por ciento","7,4 hectáreas","elegir el motor","necesitamos observaciones","3 por ciento en SFINCS","5,7 por ciento en HEC-RAS","2 y del 8,4 por ciento"],
    transition: "En Mallorca cambia la dificultad de partida: disponer de muy pocos datos hidrológicos para construir y contrastar la cadena.",
    transitionCue: "pocos datos"
  },

  {
    id: 29,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Besaya 2018: aquí nace la frecuencia sobre el impacto',
    subtitle: 'Aforos → eventos multivariantes → Iber → distribución de calados',
    estimatedMinutes: 1,
    url: '/cases/los-corrales-buelna', anchor: "#besaya-foundational-figure", highlight: "",
    webMode: 'evidence',
    webLabel: "Visita web · Cadena fundacional del Besaya",
    webPurpose: 'Mostrar el origen conceptual de la cadena estocástica basada en impactos.',
    webAction: "Mostrar el esquema fundacional de 2018. Los notebooks actuales aparecen después, en una sección distinta; volver al relato al avanzar.",
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
    script: "En el esquema del Besaya seguimos el agua desde los aforos hasta el resultado hidráulico. Primero se extraen avenidas independientes y se describen mediante pico, volumen y duración. Una cópula gaussiana permite conservar su dependencia al generar nuevos hidrogramas plausibles.\n\nDespués, Iber transforma esos hidrogramas en calados y extensión. El último bloque reúne las respuestas y estima su frecuencia. Por tanto, el período de retorno del calado se obtiene después de simular el comportamiento del sistema.\n\nLa fila superior parte de los aforos y describe cada avenida mediante pico, volumen y duración. Esas magnitudes deben conservar una dependencia plausible al generar nuevos hidrogramas. El terreno y los usos del suelo aportan después la información espacial que necesita Iber para transformar el caudal en una respuesta hidráulica. La selección de escenarios permite organizar las ejecuciones, y el postprocesado reúne calados y velocidades. El bloque final asigna frecuencia a los impactos simulados. El orden es esencial: primero se transforma cada entrada en una respuesta y después se analiza el conjunto de respuestas, en lugar de trasladar directamente una etiqueta de frecuencia desde el hidrograma.\n\nEste trabajo de 2018 precede a pyhydra y establece el fundamento científico del desarrollo posterior. La tesis recoge la necesidad de repetir esas operaciones y conectarlas de una forma trazable y transferible.",
    notes: "El TFM y el artículo preceden a la arquitectura actual. La frecuencia de calado/extensión se estima después de la simulación hidráulica.",
    bullets: [
      'Los datos de partida son caudales observados, no precipitación.',
      'La dependencia conjunta se modela entre caudal pico, volumen y duración.',
      'Iber fue el motor de la publicación fundacional de 2018.',
      'El estudio HEC-RAS/SFINCS pertenece a una etapa posterior de sensibilidad sobre el mismo dominio.',
    ],
    speakerGoal: "Mostrar dónde se calcula la frecuencia dentro de la cadena fundacional.",
    visualGuide: ["Aforos y descripción multivariante","Hidrogramas generados y simulación con Iber","Distribución del impacto al final"],
    speechCues: ["aforos","pico, volumen y duración","cópula gaussiana","Iber","después de simular","2018","fundamento científico","fila superior"],
    transition: "Una cadena reproducible permite comparar sus componentes; en el Besaya la comparación se hizo entre dos motores hidráulicos.",
    transitionCue: "cambiar de motor",
    anchorPosition: "center"
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
    script: "Mallorca introduce otra dificultad: reconstruir una inundación en una cuenca sin aforos. Tras el episodio de Sant Llorenç de octubre de 2018, se combinó información de lluvia, dependencia entre estaciones e interpolación espacial para construir entradas plausibles.\n\nLos indicadores de la izquierda resumen la estrategia: generar miles de escenarios, simular una selección y reconstruir los restantes mediante k-NN, aquí con seis vecinos. Iber transforma las entradas en calados y extensión; la extensión se contrasta con la cartografía de Copernicus.\n\nLos dos mapas muestran el mismo dominio urbano, lo que permite comparar la localización de las diferencias. La leyenda indica calado en metros: el azul oscuro representa mayor profundidad y el claro, menor profundidad. Conviene distinguir dos aspectos: la extensión de la zona mojada y la profundidad dentro de ella. El mapa estocástico presenta diferencias de calado y de distribución espacial respecto al clásico; no equivale a aplicar un factor constante a toda la mancha. El indicador k igual a seis se refiere a los vecinos utilizados para reconstruir respuestas no simuladas. El contraste con Copernicus aporta una referencia de extensión para el episodio, con las limitaciones de observación y datos del caso.\n\nA la derecha comparamos el mapa clásico, a la izquierda, con el estocástico, a la derecha. Las diferencias dependen de la localización. La aportación es llevar la variabilidad de la lluvia hasta el impacto, incluso cuando la escasez de datos dificulta caracterizar el episodio.",
    notes: "Panel izquierdo: procedimiento clásico; derecho: estocástico. Copernicus aporta referencia de extensión. 5,85 m es un máximo modelado, no una medición observada.",
    bullets: [
      'Sin aforo: contraste cualitativo con la mancha Copernicus y con marcas documentadas del episodio.',
      'Clasificación PCA + k-means: 25 formas representativas de hietograma histórico.',
      'Cópula gaussiana: acopla máximo, media, duración y tipo de tormenta entre pluviómetros.',
      'Doble malla: hidrología a 25 m, hidráulica a 8 m (LiDAR, Iber); calado máximo simulado de 5,85 m.',
    ],
    speakerGoal: "Con pocos datos, la incertidumbre de la lluvia debe llegar al mapa hidráulico.",
    visualGuide: ["Izquierda: escenarios, k=6 e impacto","Mapas: clásico a la izquierda, estocástico a la derecha","Diferencias espaciales de calado"],
    speechCues: ["sin aforos","miles de escenarios","seis vecinos","Iber","Copernicus","mapa clásico","estocástico","variabilidad de la lluvia","mismo dominio urbano","calado en metros","k igual a seis"],
    transition: "La siguiente aplicación añade una exigencia operativa: hacer viable esa cadena en una infraestructura crítica.",
    transitionCue: "Calle 30"
  },

  {
    id: 31,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Calle 30, Madrid: Infraestructura crítica urbana',
    subtitle: 'Túneles de la M-30: la cadena completa, en el proyecto FORESEE con Ferrovial',
    estimatedMinutes: 3,
    figure: 'fig_m30_metodologia_auditorio.svg', figurePosition: 'full',
    figureCaption: "Selección MaxDiss de eventos de lluvia antes de HEC-HMS; calados y períodos de retorno en secciones 1D.",
    caseReference: "Caso Calle 30: Navas et al. (2024); notebooks 04–06 de selección, simulación y reconstrucción.",
    type: 'figure',
    results: [
      { value:'1D', label:'modelo hidráulico HEC-RAS', implication:'representa la red de túneles de Calle 30' },
      { value:'Miles', label:'eventos sintéticos multisitio', implication:'MaxDiss selecciona un subconjunto representativo' },
      { value:'Secciones', label:'períodos de retorno del calado', implication:'resultados localizados del modelo 1D' },
    ],
    pyhydraRole:'Orquesta la cadena lluvia–caudal–hidráulica y permite asignar frecuencia directamente al calado en la red de túneles.',
    pyhydraModules:['pyhydra.climate','pyhydra.modeling','HEC-HMS','HEC-RAS 1D','MaxDiss + k-NN'],
    processSteps:['Lluvia multisitio','Cópulas','MaxDiss sobre lluvia','HEC-HMS','HEC-RAS 1D','k-NN → T por sección'],
    script: "El esquema sigue la cadena del caso Calle 30. Leemos la fila superior de izquierda a derecha: los datos de precipitación permiten caracterizar los eventos, ajustar su dependencia mediante cópulas y generar eventos sintéticos multisitio. Esos eventos representan combinaciones plausibles de lluvia en las subcuencas.\n\nEn la fila central empezamos por la derecha. MaxDiss selecciona eventos de lluvia representativos del conjunto sintético antes de ejecutar HEC-HMS. La selección se realiza sobre los descriptores de precipitación; no hay una segunda selección MaxDiss de hidrogramas después del modelo hidrológico.\n\nHEC-HMS transforma los eventos seleccionados en caudales de entrada. HEC-RAS 1D calcula la respuesta hidráulica utilizando esos caudales y la geometría del modelo urbano. El resultado se interpreta en secciones de la red, como las utilizadas para las curvas de calado y los perfiles longitudinales del análisis interactivo.\n\nEn la fila inferior, k-NN permite reconstruir los calados de los escenarios no simulados explícitamente, a partir de los resultados calculados. Finalmente se analiza la frecuencia de excedencia del calado en cada sección de estudio y se obtienen sus períodos de retorno. No se trata de un resultado por píxel o por celda de una malla 2D.\n\nLa secuencia esencial es, por tanto: lluvia sintética, selección MaxDiss, HEC-HMS, HEC-RAS 1D, reconstrucción y frecuencia del calado por sección. El período de retorno se estima sobre la respuesta hidráulica, sin asignarle directamente el de la lluvia. Esta es la cadena que podremos reconocer en las gráficas del caso.",
    notes: "Corrección del autor (24 de octubre de 2026), coherente con los notebooks del caso 04_maxdiss_selection, 05_hms_ras_simulation y 06_knn_return_periods. MaxDiss se aplica a los descriptores de los eventos de lluvia sintéticos antes de HEC-HMS. El caso utiliza HEC-RAS 1D y obtiene calados y períodos de retorno en secciones; no describir píxeles, celdas ni mapas 2D como salida de este modelo. k-NN reconstruye calados, no mapas. El esquema anterior trasladaba incorrectamente MaxDiss a hidrogramas y presentaba la salida por píxel. La mención al nivel freático es contexto, no prueba de una simulación acoplada.",
    bullets: [
      'Multisitio: Precipitación espacialmente correlacionada (cópulas gaussianas) en los distritos de Madrid.',
      'Cadena física: HEC-HMS genera los caudales de entrada y HEC-RAS 1D modela la red de túneles.',
      'Eficiencia computacional: MaxDiss evita simular exhaustivamente los miles de eventos sintéticos.',
      'Reconstrucción: k-NN estima los calados de los escenarios no simulados explícitamente.',
      'Transferencia industrial directa: caso desarrollado con Ferrovial dentro del proyecto FORESEE.',
    ],
    speakerGoal: "Explicar la selección de lluvia antes de HEC-HMS y la frecuencia del calado en secciones del modelo 1D.",
    visualGuide: ["Fila superior: datos, eventos, cópulas y lluvia sintética", "Fila central, de derecha a izquierda: MaxDiss sobre lluvia, HEC-HMS y HEC-RAS 1D; entrada del modelo urbano por la izquierda", "Fila inferior: reconstrucción k-NN y período de retorno del calado por sección"],
    speechCues: ["precipitación", "cópulas", "MaxDiss", "eventos de lluvia", "antes de ejecutar HEC-HMS", "caudales de entrada", "HEC-RAS 1D", "secciones", "k-NN", "frecuencia de excedencia del calado", "períodos de retorno"],
    transition: "Ahora podemos leer el resultado hidráulico de esa cadena en las gráficas de análisis interactivo.",
    transitionCue: "Análisis interactivo"
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
    script: "Estamos en el apartado Análisis interactivo. Comienzo por la gráfica del Puente de Toledo: el eje horizontal representa el período de retorno y el vertical, el calado. Para comparar los procedimientos fijamos el mismo período y leemos las dos curvas. El cursor permite consultar valores y la leyenda aislar las series.\n\nEl perfil de la derecha añade la posición a lo largo del tramo para períodos de cien y quinientos años. Así podemos examinar en qué secciones aparecen las diferencias.\n\nEn la primera gráfica, comparar las curvas significa mantener fijo el período de retorno y observar qué calado proporciona cada procedimiento en el mismo punto. Una separación vertical indica diferencia de profundidad; no debe interpretarse como una distancia entre lugares. En el perfil longitudinal, en cambio, la posición horizontal cambia a lo largo del tramo. Allí comparamos los resultados en una misma sección y reconocemos si la diferencia se concentra en determinadas zonas. Las referencias a cien y quinientos años identifican dos frecuencias de diseño. Las gráficas son complementarias: una describe la relación frecuencia–calado en un punto; la otra muestra dónde se distribuyen los calados a lo largo de la infraestructura.\n\nLas gráficas responden a una pregunta de diseño concreta: qué calado considerar en un lugar y con qué frecuencia. Son la interpretación localizada de toda la cadena que acabamos de recorrer.",
    offlineScript: "La captura conserva las dos gráficas de Análisis interactivo. A la izquierda está el calado en el Puente de Toledo frente al período de retorno. Para un mismo período se comparan las series del enfoque clásico y del basado en cópulas.\n\nA la derecha, el eje horizontal recorre el tramo y los perfiles representan los calados para períodos de retorno de cien y quinientos años. La comparación muestra que las diferencias entre procedimientos también dependen de la sección.\n\nEn la primera gráfica, comparar las curvas significa mantener fijo el período de retorno y observar qué calado proporciona cada procedimiento en el mismo punto. Una separación vertical indica diferencia de profundidad; no debe interpretarse como una distancia entre lugares. En el perfil longitudinal, en cambio, la posición horizontal cambia a lo largo del tramo. Allí comparamos los resultados en una misma sección y reconocemos si la diferencia se concentra en determinadas zonas. Las referencias a cien y quinientos años identifican dos frecuencias de diseño. Las gráficas son complementarias: una describe la relación frecuencia–calado en un punto; la otra muestra dónde se distribuyen los calados a lo largo de la infraestructura.\n\nEsta copia es una imagen: para leer valores con el cursor y activar o desactivar series hay que abrir la herramienta en vivo. La conclusión que sí podemos explicar con la captura es cómo el resultado de toda la cadena se convierte en una comparación hidráulica localizada.",
    notes: "La visita principal se limita a Análisis interactivo: comparar curva de Puente de Toledo y perfil T100/T500. El cursor y la leyenda operan en vivo; la copia preparada conserva imágenes. MaxDiss es una ampliación opcional.",
    bullets: [
      'Curvas de período de retorno del calado en el Puente de Toledo.',
      'Perfil longitudinal para períodos de retorno de cien y quinientos años.',
      'Cursores y leyendas para consultar y comparar las series en vivo.',
      'Nube de eventos representativos seleccionados mediante MaxDiss.',
    ],
    speakerGoal: "Guiar dos comparaciones visibles sin dispersarse por la web.",
    visualGuide: ["Curva de período de retorno en Puente de Toledo","Perfil longitudinal T100/T500","Cursor y leyenda de las series"],
    speechCues: ["Análisis interactivo","Puente de Toledo","mismo período","cursor","perfil","cien y quinientos años","qué calado","interpretación localizada","período de retorno","perfil longitudinal"],
    transition: "Hasta aquí hemos propagado escenarios por modelos físicos. Valencia plantea otra dificultad: que un solo dato extremo cambie el ajuste de entrada.",
    transitionCue: "extremo excepcional",
    offlineSpeechCues: ["izquierda","Puente de Toledo","mismo período","derecha","cien y quinientos años","Esta copia es una imagen","comparación hidráulica localizada","período de retorno","perfil longitudinal"]
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
    script: "En Valencia la pregunta es cuánto cambia una estimación al incorporar un episodio extraordinario. El primer indicador recuerda el dato observado: 710,8 milímetros en 24 horas en Turís, el 29 de octubre de 2024.\n\nLas barras de la derecha comparan otra cantidad: la precipitación estimada para un período de retorno de cien años. Con el ajuste bayesiano pasa de 260 milímetros sin la DANA a 952 al incorporarla: un aumento del 266 por ciento respecto al primer ajuste.\n\nLa diapositiva separa una observación de dos resultados estadísticos. Los 710,8 milímetros son la precipitación medida del episodio. Los 260 y 952 milímetros son cuantiles calculados para T100 con muestras distintas. El intervalo de 66 a 91 años corresponde al período de retorno asignado al episodio cuando se incluye en el ajuste, según el estimador. Para leer las barras debemos mantener fijo el método y comparar sin DANA y con DANA. El aumento del 266 por ciento se calcula respecto al valor inicial de 260 milímetros; no expresa un aumento observado de la lluvia entre dos fechas. La franja metodológica recuerda que el estudio compara estimadores y escalas de análisis sobre las series disponibles.\n\nEl intervalo de 66 a 91 años se refiere al período asignado al episodio observado, incluyendo el dato y según el estimador. Son magnitudes diferentes. La comparación muestra la sensibilidad de la cola a la muestra y la necesidad de revisar la incertidumbre antes de fijar un valor de diseño.",
    notes: "Distinguir tres magnitudes: lluvia observada (710,8 mm), nivel de retorno T100 (260/952 mm) y período de retorno asignado al episodio (66–91 años al incorporarlo). El +266 % se refiere al cambio del nivel T100 bayesiano.",
    bullets: [
      'Valencia (29-10-2024): 710,8 mm en 24 h en Turís (8337X), máximo de su serie.',
      'Sin el evento: período de retorno > 11.000 años (MLE), > 31.000 (L-momentos) y ≈ 3.069 (bayesiano).',
      'Con el evento: los tres estimadores convergen en 66–91 años; T100 bayesiano de 260 a 952 mm.',
      'Análisis regional: el local (9 estaciones) da 34–41 años; el global suaviza el evento hasta 10–19 años.',
      'Lección: con series cortas, comparar estimadores y comunicar bandas, no una cifra puntual.',
    ],
    speakerGoal: "Separar lluvia observada, cuantil T100 y período asignado al episodio.",
    visualGuide: ["Izquierda: lluvia observada e indicadores","Derecha: T100 sin y con DANA","Distinguir T100 del período asignado al episodio"],
    speechCues: ["dato observado","710,8","barras","cien años","260","952","266 por ciento","66 a 91 años","magnitudes diferentes","una observación","dos resultados estadísticos","sin DANA y con DANA"],
    transition: "Tanganica conserva la necesidad de estimar extremos con pocos datos, pero cambia la variable de diseño: de precipitación a nivel del lago.",
    transitionCue: "materiales del análisis"
  },

  {

    id: 34,
    offlineFrames: [{"src":"offline_valencia_web.png","label":"Resultados y procedimiento","caption":"Indicadores de Valencia y acceso visible al notebook del estudio regional."}],
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "Valencia en HYDRA: del resultado al notebook",
    subtitle: 'La ficha del caso, trazable hasta el notebook que calculó cada cifra',
    estimatedMinutes: 1,
    url: '/cases/valencia-dana', anchor: "#valencia-analysis-access", highlight: '#case-stats',
    webMode: 'evidence',
    webLabel: 'Evidencia 4 · Trazabilidad y respuesta rápida',
    webPurpose: 'Mostrar que las cifras de Valencia están vinculadas a datos, métodos y notebooks reproducibles.',
    webAction: "Mostrar juntos los indicadores y el acceso al notebook regional. Señalar el botón; la ejecución completa no forma parte de esta visita breve.",
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
    script: "En esta visita vamos a relacionar el resultado con los materiales que permiten revisarlo. Los indicadores superiores identifican el episodio y los métodos comparados. Justo debajo está el acceso al notebook del estudio regional, acompañado de las tareas que documenta: preparación de datos, ajuste de extremos y comparación de estimadores.\n\nEse enlace es el paso desde consultar una cifra hasta examinar cómo se ha calculado. Permite examinar el código con los datos y el entorno necesarios. En esta visita señalo el acceso; la ejecución completa queda disponible para la revisión técnica.\n\nLos indicadores resumen qué resultado merece atención; el notebook documenta cómo se llegó a él. En él se puede revisar qué estaciones y períodos se utilizaron, cómo se seleccionaron los máximos y qué estimador produjo cada curva. Para interpretar una discrepancia entre métodos, esas decisiones son tan importantes como el valor final. Abrir el material permite consultar el análisis, mientras que repetirlo requiere comprobar que están disponibles las entradas y las dependencias correspondientes. Esta visita tiene una función precisa dentro del relato: mostrar el vínculo entre el resultado que acabamos de interpretar y el procedimiento que permite examinarlo.\n\nLa trazabilidad consiste en conservar esa relación entre entradas, procedimiento y resultado. La plataforma hace accesible esa relación.",
    notes: "Este es un segundo momento de evidencia web con función distinta de la visita inicial a HYDRA: trazabilidad del caso Valencia. Mostrar el acceso al notebook sin ejecutarlo durante la defensa.",
    bullets: ["La ficha reúne resultados, métodos y materiales del caso.","El notebook permite revisar datos, preparación y estimadores.","Las diferencias entre métodos deben interpretarse con sus hipótesis."],
    backup: false,
    offlineScript: "La captura muestra dos elementos de la ficha de Valencia. Arriba están los indicadores del episodio. Debajo aparece el acceso al notebook del estudio regional y las tareas que documenta: preparación de datos, ajuste de extremos y comparación de estimadores.\n\nLa imagen permite identificar dónde se consulta el procedimiento, aunque los enlaces no se ejecutan dentro de una captura. La versión web y el notebook permiten continuar la revisión con los datos y el entorno correspondientes.\n\nLos indicadores resumen qué resultado merece atención; el notebook documenta cómo se llegó a él. En él se puede revisar qué estaciones y períodos se utilizaron, cómo se seleccionaron los máximos y qué estimador produjo cada curva. Para interpretar una discrepancia entre métodos, esas decisiones son tan importantes como el valor final. Abrir el material permite consultar el análisis, mientras que repetirlo requiere comprobar que están disponibles las entradas y las dependencias correspondientes. Esta visita tiene una función precisa dentro del relato: mostrar el vínculo entre el resultado que acabamos de interpretar y el procedimiento que permite examinarlo.\n\nEste es el significado práctico de la trazabilidad: poder relacionar la cifra presentada con las entradas, el método y las decisiones del análisis. El resultado queda acompañado de los materiales necesarios para examinar su procedencia.",
    speakerGoal: "Del indicador visible al acceso concreto al procedimiento.",
    visualGuide: ["Indicadores del episodio","Acceso al notebook del estudio regional","Datos, ajustes y comparación documentados"],
    speechCues: ["indicadores superiores","Justo debajo","notebook del estudio regional","preparación de datos","comparación de estimadores","trazabilidad","indicadores","notebook"],
    offlineSpeechCues: ["Arriba","Debajo","notebook","preparación de datos","captura","trazabilidad","entradas, el método y las decisiones","indicadores"],
    transitionCue: "nivel del lago",
    anchorPosition: "center"
  },

  {
    id: 35,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "Lago Tanganica: niveles de diseño bajo cambio climático",
    subtitle: "De ERA5 y CMIP6 al cambio de nivel extremo respecto al histórico",
    estimatedMinutes: 2,
    url: '/cases/lago-tanganica', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "fig_tanganica_resultados_auditorio.svg", figurePosition: 'full',
    figureCaption: "Detalle de la figura 7.15: horizonte 2041–2060. Los cuatro horizontes se conservan en el anexo.",


    caseReference: "Fuente: memoria doctoral, §7.6, pp. 108–110; figura 7.15 (Navas et al., 2025a)",
    type: 'figure',
    results: [{"value": "R² > 0,85", "label": "AdaBoost en validación cruzada", "implication": "estima caudales mensuales; no valida toda la proyección"}, {"value": "19 modelos", "label": "ensemble climático CMIP6", "implication": "SSP2-4.5 y SSP5-8.5; método delta mensual"}, {"value": "ΔNivel(T)", "label": "cambio respecto al histórico", "implication": "se aplica sobre niveles históricos ajustados con GEV"}],

    pyhydraRole: "Integra datos globales, método delta mensual y análisis de niveles extremos en un sistema lacustre con registros limitados.",
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','AdaBoost','CMIP6 + Hydroweb'],
    processSteps: ["ERA5 → AdaBoost", "Caudal → N(Q)", "CMIP6 + delta", "Residuos N(Q) → bootstrap", "ΔNivel(T) + GEV histórica"],
    script: "En el lago Tanganica estimamos cotas de diseño bajo cambio climático con altimetría de 1992–2023. A la izquierda, AdaBoost convierte ERA5 en caudales mensuales; la relación empírica N(Q) los transforma en niveles. Los deltas de 19 modelos CMIP6 incorporan la señal climática. El bootstrap remuestrea los residuos de N(Q).\n\nA la derecha mostramos el horizonte 2041–2060 de la memoria. El eje horizontal indica el período de retorno; el vertical, el incremento de nivel respecto al histórico. Los colores distinguen ambos escenarios SSP y las barras de error representan incertidumbre intermodelo. Los cuatro horizontes están en el anexo.\n\nPodemos recorrer la columna izquierda sin saltar directamente desde el clima a una cota extrema. AdaBoost estima caudal mensual; N de Q transforma caudal en nivel y distingue tres regímenes para representar una relación no lineal. El bootstrap actúa sobre los residuos de esa relación, generando variabilidad alrededor de ella. En el gráfico de la derecha, cada grupo corresponde a un período de retorno y las barras comparan los dos escenarios SSP en 2041–2060. El eje vertical expresa un incremento en metros, no la altitud absoluta del lago. Las barras de error representan la incertidumbre intermodelo indicada en la memoria. Para obtener una cota futura hay que añadir el incremento a su referencia histórica, manteniendo el mismo período de retorno.\n\nLos cambios calculados con máximos anuales sintéticos se suman a las cotas históricas ajustadas con GEV. Así obtenemos niveles futuros conservando la referencia observada.",
    notes: "Fuente: §7.6.2–7.6.3, pp. 108–109; figura 7.15, p. 110. El texto menciona 770,19 m bootstrap y 771,55–771,76 m GEV/Weibull para T100; el intervalo entre métodos no es una banda de confianza. R²=0,96 corresponde al conjunto completo y no es una validación independiente. Hay una discrepancia entre texto/pie y las barras de la figura 7.15 sobre el horizonte máximo y el umbral de 0,6 m para T100–T500: no afirmar esos dos resultados hasta contrastar la tabla numérica original. No atribuir al bootstrap de N(Q) todas las fuentes de incertidumbre. El detalle mostrado conserva las barras y ejes originales del horizonte identificado.",
    bullets: [
      'AdaBoost estima caudales mensuales a partir de ERA5; no estima directamente los niveles extremos.',
      'La función N(Q), separada en tres regímenes por K-means, transforma caudal en nivel del lago.',
      'El bootstrap remuestrea residuos de N(Q) y los percentiles de máximos anuales determinan los cambios de nivel.',
      'Los cambios de nivel de cuatro horizontes se aplican sobre las cotas históricas ajustadas con GEV a la altimetría Hydroweb 1992–2023.',
    ],
    speakerGoal: "Explicar el encadenamiento y leer correctamente el incremento proyectado respecto al histórico.",
    visualGuide: ["Izquierda: cinco etapas de cálculo", "Derecha: detalle original 2041–2060", "Eje horizontal: período de retorno; vertical: variación de nivel", "Colores: SSP; barras de error: incertidumbre intermodelo"],
    speechCues: ["cotas de diseño","caudales mensuales","19 modelos CMIP6","residuos","2041–2060","período de retorno","incremento de nivel","incertidumbre intermodelo","columna izquierda","caudal mensual","nivel","residuos de esa relación","incremento en metros"],
    transition: "Para aplicar cadenas de este tipo a un territorio mayor aparece otro cuello de botella: calibrar muchos modelos de forma consistente.",
    transitionCue: "ejecución hidrológica regional"
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
    script: "Los cuatro paneles representan Colombia, Bolivia, Perú y Ecuador. El eje horizontal recorre los meses y el vertical muestra cambios porcentuales de caudal; la leyenda distingue escenarios y horizontes. En algunos meses de Perú y Ecuador aparecen aumentos superiores al 40 por ciento, mientras otras combinaciones muestran reducciones.\n\nPara obtener esas curvas se procesaron más de 200 subcuencas. Los datos se completan con satélite e interpolación; SPOTPY organiza la calibración y VIC transforma las entradas en caudal. Después se propagan 21 modelos CMIP5.\n\nLa leyenda combina color y tipo de línea. Azul identifica 2011–2040; rojo, 2041–2070; y gris o negro, 2071–2100. Las líneas discontinuas corresponden a RCP4.5 y las continuas a RCP8.5. Para comparar escenarios debemos fijar país, mes y horizonte. El cero del eje vertical representa ausencia de cambio respecto a la referencia; por encima hay aumento y por debajo, reducción del caudal. El mayor cambio de final de siglo se aprecia en algunos meses de Perú y Ecuador, sin que eso describa todos los países o estaciones del año. Las escalas verticales difieren entre paneles, por lo que la comparación cuantitativa exige leer sus números y no solo la altura visual de las líneas.\n\nLa contribución operativa consiste en repetir consistentemente ese ciclo regional. La interpretación debe conservar su carácter de proyección condicionada a los datos, los modelos y los escenarios utilizados.",
    notes: "Los ejes muestran cambio porcentual del caudal mensual, no precipitación. El +40 % corresponde a determinados meses y escenarios de Perú/Ecuador. Automatización de la calibración no elimina la necesidad de validación hidrológica.",
    bullets: [
      'La escala territorial hizo inviable la calibración manual de los modelos hidrológicos.',
      'SPOTPY automatizó la búsqueda de parámetros mediante PSO, DREAM y SCE-UA.',
      'VIC transformó los campos de precipitación y temperatura en caudales para más de 200 subcuencas.',
      'La experiencia se trasladó después a la interfaz de calibración automática de los adaptadores de HYDRA.',
    ],
    speakerGoal: "Leer el cambio estacional en los cuatro países y explicar qué automatización lo hizo posible.",
    visualGuide: ["Cuatro paneles por país","Meses en horizontal y cambio porcentual en vertical","Escenarios y horizontes de la leyenda"],
    speechCues: ["meses","cambios porcentuales","algunos meses","200 subcuencas","SPOTPY","VIC","21 modelos CMIP5","proyección condicionada","color y tipo de línea","RCP4.5","RCP8.5"],
    transition: "Además del clima futuro, debemos comprobar cuánto cambia el diseño por el propio procedimiento de cálculo.",
    transitionCue: "dos procedimientos"
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
    script: "Este caso muestra la aplicación de la cadena a escala nacional. El mapa de la derecha representa precipitación media distribuida por subcuencas de Panamá. Las líneas negras delimitan esas unidades y la cuadrícula sitúa su posición geográfica; no delimitan manchas de inundación. La escala inferior está en milímetros: los rojos corresponden a valores menores y los verdes, cianes y azules a valores progresivamente mayores. El rango representado va aproximadamente de 1.500 a 6.000 milímetros. El mapa permite reconocer contrastes espaciales de la entrada climática, sin deducir directamente de sus colores dónde será mayor el daño.\n\nLas tres cifras de la izquierda describen magnitudes distintas. Las 52 cuencas son el dominio de las capas de inundación fluvial. Las 414 combinaciones climáticas proceden de 23 modelos, dos escenarios SSP, tres variables y tres horizontes; describen dimensiones del análisis, no un registro verificado de 414 ejecuciones hidráulicas. Los 1.464 puntos costeros corresponden a la evaluación de inundación costera en ambas costas, un ámbito diferente del mapa de precipitación.\n\nLa franja inferior resume el proceso metodológico. Se completan las series de 73 estaciones con NEOPRENE y se interpolan campos mediante kriging universal a un kilómetro. La corrección de sesgo prepara escenarios climáticos. LEM transforma las entradas en caudales y SFINCS produce respuestas hidráulicas que alimentan las capas del atlas. El mapa que vemos es un producto intermedio de esa cadena.\n\nLa aportación consiste en repetir un procedimiento documentado sobre múltiples dominios y configuraciones, conservando la relación entre entrada climática, modelo y resultado. La escala exige automatización y trazabilidad; también exige mantener separadas las variables y los alcances de cada producto.",
    notes: "El mapa es de precipitación, no de inundación. 414 = 23 GCM × 2 SSP × 3 variables × 3 horizontes, según Producto 3, pp. 3 y 29–30. No equivale a un registro comprobado de ejecuciones completadas ni a 414 simulaciones hidráulicas.",
    bullets: [
      '52 cuencas (hasta 13.400 km²) en ambas vertientes de Panamá, encargo del Ministerio de Ambiente y el BID.',
      'NEOPRENE/STNSRP rellena 73 estaciones nacionales (1950-2022); kriging universal a malla de 1 km.',
      '414 combinaciones de análisis: 23 GCM × 2 SSP × 3 variables × 3 horizontes.',
      'Modelo hidrológico LEM (NS=0,87) + SFINCS nacional y 2D de alta resolución en el área metropolitana.',
      '1.464 puntos costeros analizados en ambas costas frente a inundación costera.',
    ],
    speakerGoal: "Leer el mapa como producto intermedio de datos y separar las magnitudes de escala.",
    visualGuide: ["Mapa: precipitación en mm, límites de subcuencas y escala de colores","Izquierda: 52 cuencas, 414 combinaciones y 1.464 puntos costeros","Franja inferior: estaciones → escenarios → LEM/SFINCS → capas del atlas"],
    speechCues: ["precipitación","52 cuencas","1.464 puntos costeros","73 estaciones","414 combinaciones climáticas","escala nacional","milímetros","magnitudes distintas","proceso metodológico","líneas negras","rojos","azules","kriging universal","LEM","SFINCS"],
    transition: "Con los casos revisados, podemos distinguir cómo se ha comunicado la investigación y cuál ha sido mi contribución personal.",
    transitionCue: "alcance de su transferencia"
  },

  {
    id: 38,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "SIMPCCe: aportaciones a embalses bajo cambio climático",
    subtitle: "Del pronóstico de aportaciones a la gestión del suministro",
    estimatedMinutes: 2,
    url: '/cases/simpcce', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "fig_simpcce_articulo.svg", figurePosition: "full",
    figureCaption: "Ejemplo de uso publicado: relación entre suministro y fiabilidad (figura 11, p. 145).",
    caseReference: "Navas y del Jesus (2025). Ingeniería del Agua, 29(2), 132–148. DOI: 10.4995/ia.2025.23217",
    type: "figure",
    results: [
      { value:'60', label:'series corregidas por variable', implication:'10 modelos, 2 RCP y 3 horizontes' },
      { value:'20', label:'realizaciones futuras por punto', implication:'aplicables a la red hídrica nacional' },
      { value:'Premio 2023', label:'Talento Joven “M.R. Llamas”', implication:'Observatorio del Agua de la Fundación Botín; candidatura colectiva por la guía que enmarca SIMPCCe' },
    ],
    pyhydraRole:'Transforma proyecciones climáticas en aportaciones y fichas de decisión para cualquier punto de la red hídrica española.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','SDM','red neuronal'],
    processSteps:['SPAIN02 + SIMPA','PCA 95 %','ANN de aportaciones','SDM climático','Sequía y fiabilidad'],
    script: "SIMPCCe, publicada en Ingeniería del Agua en 2025, traslada el análisis climático a la gestión de embalses. La columna izquierda resume sus cinco módulos: datos oficiales, configuración de cuenca, entrenamiento de la red neuronal, corrección de sesgo SDM e informes de aportaciones.\n\nEl gráfico de la derecha procede del artículo. Relaciona el volumen suministrado con su fiabilidad: el eje horizontal indica el porcentaje de garantía y el vertical, el volumen anual. Las líneas rojas señalan la demanda y el suministro aceptable.\n\nLa lectura de la columna izquierda sigue el recorrido de la herramienta. Los datos oficiales aportan las series de referencia; la configuración delimita la cuenca y sus puntos climáticos; la red neuronal relaciona esas entradas con aportaciones; la corrección climática prepara escenarios; y los informes reúnen sus resultados. En el gráfico, al avanzar hacia una fiabilidad mayor, el volumen que puede suministrarse con esa garantía tiende a reducirse. La referencia de demanda permite ver si se mantiene el objetivo de suministro. Las líneas rojas ilustran la lectura de un suministro aceptable asociado a una garantía. La curva procede del ejemplo del artículo y no representa una serie de observaciones de un embalse presentada aquí como validación universal.\n\nPara obtener estos indicadores, las aportaciones de SIMPCCe deben combinarse con un modelo de gestión. Esa conexión permite estudiar medidas de adaptación y sus consecuencias sobre el suministro.",
    notes: "Referencia científica principal: Navas y del Jesus (2025), DOI 10.4995/ia.2025.23217. Figura 11, p.145: ejemplo de apoyo a decisiones; el cálculo de suministros requiere combinar aportaciones con un modelo de gestión. El artículo señala en Discusión que no presenta casos de estudio específicos. No atribuirle los valores de Embalse 2 de la guía de 2022 ni la reducción de julio del 77 %. La guía es antecedente industrial, no la fuente del gráfico mostrado. La figura 10 del artículo se conserva en el anexo.",
    bullets: ["Artículo publicado: Navas y del Jesus (2025), Ingeniería del Agua.","SIMPCCe genera series de aportaciones; el modelo de gestión las transforma en suministros.","Los indicadores de fiabilidad permiten comparar medidas de adaptación."],
    speakerGoal: "Presentar la herramienta publicada y su conexión con decisiones de suministro.",
    visualGuide: ["Izquierda: cinco módulos de SIMPCCe","Derecha: figura 11 del artículo","Ejes: fiabilidad y suministro; referencias de demanda"],
    speechCues: ["Ingeniería del Agua","cinco módulos","corrección de sesgo SDM","fiabilidad","demanda","suministro aceptable","modelo de gestión","medidas de adaptación","columna izquierda","fiabilidad mayor"],
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
    script: "Este estudio compara el procedimiento convencional basado en IDF con una cadena estocástica. El mapa muestra diferencias de calado T100 para 2041–2070, RCP4.5, que cambian espacialmente.\n\nLos recuadros incluyen una comparación adicional de caudal T100 en 2011–2040. Para RCP4.5, IDF da 208,8 y el enfoque estocástico 278,5 metros cúbicos por segundo: un 33,4 por ciento más respecto a IDF. Ese porcentaje corresponde al caudal y no se traslada uniformemente al mapa de calados.\n\nLa figura contiene dos comparaciones relacionadas, pero distintas. El mapa localiza diferencias de calado para un horizonte concreto. Los recuadros presentan caudales de diseño de otro horizonte. Mantener las unidades evita confundir metros de profundidad con metros cúbicos por segundo. El 33,4 por ciento resulta de dividir la diferencia de caudal entre 208,8, el valor del método IDF. No implica que cada celda del mapa aumente esa proporción. La franja inferior permite reconstruir el procedimiento: proyecciones EURO-CORDEX, corrección de sesgo y dependencia, generación sintética, selección y simulación con Iber. El resultado muestra cuánto puede importar la elección de la cadena de diseño bajo las condiciones analizadas.\n\nEl cálculo utilizó 10.000 años sintéticos y 200 casos seleccionados con MaxDiss para Iber, reconstruyendo el resto mediante k-NN. La diferencia evidencia sensibilidad al procedimiento; demostrar mayor exactitud requiere contrastarla con observaciones.",
    notes: "Fuente contrastada: memoria definitiva, tabla 7.6, p. 114 (página 144 del PDF), y §8.6, p. 130. El ejemplo T100 RCP4.5 2011–2040 es 208,8 → 278,5 m³/s: +33,4 % respecto a IDF; tomando como base el estocástico, IDF es un 25,0 % menor. Las 24 comparaciones de la tabla dan alrededor del 33 % de incremento, sin reconstruir los extremos del rango narrado 30–37 %. Ese rango requiere el artículo original. El mapa corresponde a 2041–2070; no confundir horizontes ni variables.",
    bullets: ["Ejemplo T100 (2011–2040, RCP4.5): 208,8 → 278,5 m³/s, +33,4 % respecto a IDF.","El mapa representa diferencias de calado para 2041–2070.","El porcentaje de un caudal no es un factor corrector uniforme del mapa.","La diferencia entre métodos no prueba por sí sola mayor exactitud."],
    speakerGoal: "Distinguir la comparación espacial de calados de la comparación numérica de caudales.",
    visualGuide: ["Mapa: diferencia de calado en T100, 2041–2070 y RCP4.5","Cifras de caudal como comparación adicional","Diferencia entre métodos y verdad observada"],
    speechCues: ["IDF","diferencias de calado","2041–2070","2011–2040","208,8","278,5","33,4 por ciento","sensibilidad al procedimiento","dos comparaciones relacionadas, pero distintas"],
    transition: "La transferencia también debe funcionar cuando la decisión no es protegerse de una avenida, sino gestionar aportaciones escasas.",
    transitionCue: "gestión de embalses"
  },

  {
    id: 39.5,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Qué demuestra el conjunto de casos',
    subtitle: 'La modelación estocástica es el hilo que conecta datos, clima, física e impacto',
    estimatedMinutes: 2,
    script: "Esta diapositiva reúne los diez estudios para interpretar el alcance del conjunto. El eje horizontal ordena la escala espacial, desde una infraestructura hasta varios países. No representa una distancia geográfica ni una medida numérica de superficie. Las tres filas distinguen la finalidad del análisis: inundación basada en impacto, extremos e incertidumbre, y clima y escalabilidad.\n\nEn la primera fila se sitúan Calle 30, los dos trabajos del Besaya y Sant Llorenç. Valencia aparece en extremos e incertidumbre. IAHR, Panamá, SIMPCCe, Tanganica y Andes se sitúan en el ámbito climático y de escalabilidad. Esa clasificación organiza la comparación; varios trabajos utilizan componentes compartidos y no quedan limitados a una sola idea metodológica.\n\nLos círculos rellenos señalan los cuatro estudios con notebooks: Besaya, rugosidades, Calle 30 y Valencia. Los círculos vacíos identifican los otros seis, documentados mediante publicaciones o proyectos. La leyenda recuerda que la ejecución necesita el entorno correspondiente. Los símbolos describen disponibilidad de materiales, no una clasificación de calidad científica.\n\nLos tres mensajes de la izquierda sintetizan la lectura. El principio común es estimar la frecuencia sobre la variable de impacto cuando el caso la requiere. Los contextos distintos ponen a prueba otras escalas, datos y motores. La transferencia consiste en reutilizar componentes conservando las decisiones del análisis. La figura muestra diversidad funcional y grados de integración distintos; no afirma que todos los casos ejecuten la misma cadena completa.",
    notes: 'Esta es la diapositiva de síntesis del bloque. Hacer una pausa antes de presentar la producción científica; después se delimita la autoría y se cierran las hipótesis. No enumerar otra vez los diez estudios: responder a “¿qué aprendemos de todos ellos juntos?”.',
    bullets: [
      'La lluvia de diseño es una entrada; el riesgo se decide con la distribución del impacto.',
      'Cada caso activa herramientas diferentes porque la cadena física y los datos disponibles también son diferentes.',
      'La aportación común es mantener trazabilidad e incertidumbre desde la fuente hasta el resultado de ingeniería.',
    ],
    backup: false,
    speakerGoal: "Leer escala, finalidad y disponibilidad sin atribuir el mismo alcance a todos los casos.",
    visualGuide: ["Horizontal: escala espacial","Filas: finalidad del análisis","Símbolos: notebook actual o documentación"],
    speechCues: ["escala espacial","tres filas","círculos rellenos","círculos vacíos","transferencia","diez estudios","finalidad del análisis","principio común","contextos distintos"],
    transitionCue: "producción científica"
  },

  {
    id: 39.6,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: 'Producción científica asociada a la tesis',
    subtitle: 'La validación externa acompaña la evolución desde el método hasta la herramienta',
    estimatedMinutes: 2,
    type: 'normal',
    results: [{"value":"2 artículos","label":"publicados en Ingeniería del Agua","implication":"Calle 30 (2024) y SIMPCCe (2025). Valencia: aceptado, pendiente de publicación."},{"value":"2 enviados","label":"manuscritos en evaluación","implication":"Tanganica y rugosidades (Environmental Modelling & Software)"},{"value":"5 comunicaciones","label":"presentadas entre 2023 y 2025","implication":"VII JIA, HIC 2024, InterJIA 2024 y dos trabajos en VIII JIA"},{"value":"2 DOI","label":"software científico publicado","implication":"pyhydra e HYDRA, preservados en Zenodo"}],
    script: "La producción científica reúne dos artículos publicados en Ingeniería del Agua: Calle 30, de 2024, y SIMPCCe, de 2025. El artículo de Valencia está aceptado, pendiente de publicación, por lo que se indica por separado y no se incluye en el recuento de publicados. Los dos manuscritos que continúan enviados son Tanganica y el estudio de rugosidades remitido a Environmental Modelling & Software.\n\nLa diapositiva organiza los productos en cuatro columnas. La primera recoge los artículos publicados; la segunda, los manuscritos que permanecen en evaluación. La nota de la primera columna indica que Valencia está aceptado, pendiente de publicación. Así quedan separados los artículos publicados, el artículo aceptado y los manuscritos que continúan en evaluación.\n\nLa tercera columna presenta cinco comunicaciones, difundidas entre 2023 y 2025 en jornadas y congresos. Estas comunicaciones permiten seguir la evolución de los trabajos y su discusión con la comunidad científica. Una comunicación y el artículo posterior pueden proceder de una misma investigación: no representan necesariamente casos de estudio diferentes.\n\nLa cuarta columna corresponde al software científico. Los dos DOI de Zenodo identifican versiones citables de pyhydra e HYDRA y permiten referenciar los productos desarrollados, además de los métodos y resultados descritos en las publicaciones.\n\nLos mensajes inferiores agrupan las aportaciones por los problemas abordados: infraestructura urbana, gestión de embalses y análisis de eventos y niveles extremos. En conjunto, estas cuatro columnas muestran distintas formas de documentar y difundir el trabajo: artículos publicados, manuscritos en evaluación, comunicaciones y software. La siguiente diapositiva concreta mi responsabilidad personal en esos trabajos.",
    notes: "Estado editorial corregido por el doctorando el 21 de octubre de 2026: dos artículos publicados (Calle 30 y SIMPCCe), Valencia aceptado pendiente de publicación y dos manuscritos enviados (Tanganica y rugosidades, este último a Environmental Modelling & Software). La revista, fecha y DOI del artículo de Valencia no se han facilitado; no inferirlos. Las comunicaciones previas y los manuscritos son productos distintos de una misma línea, no casos de estudio nuevos.",
    bullets: [
      'Infraestructura urbana: cadena estocástica completa con transformación lluvia–caudal y modelización 1D.',
      'Gestión de embalses: transferencia de clima, corrección de sesgo y emulación de caudales mínimos.',
      'Eventos y niveles extremos: incertidumbre, datos globales y respuesta ante problemas recientes.',
      'Sensibilidad hidráulica: automatización masiva para revelar incertidumbre entre motores.',
    ],
    speakerGoal: "Distinguir publicación, comunicación, evaluación y software citable.",
    visualGuide: ["Dos artículos publicados","Dos manuscritos enviados","Cinco comunicaciones","Dos DOI de software","Valencia: aceptado, pendiente de publicación"],
    speechCues: ["dos artículos publicados","aceptado, pendiente de publicación","dos manuscritos enviados","Valencia","Tanganica","rugosidades","cinco comunicaciones","dos DOI","en evaluación","publicación, evaluación, comunicación y software"],
    transition: "La existencia de esos productos no explica por sí sola mi papel; la siguiente tabla lo delimita.",
    transitionCue: "mi contribución"
  },

  {
    id: 39.7,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: "Mi contribución científica y tecnológica",
    subtitle: "Trabajo, posición de autoría y contribución personal",
    estimatedMinutes: 2,
    type: 'normal',
    script: "Esta tabla concreta mi responsabilidad por trabajo. Las columnas identifican la publicación, mi posición de autoría y la contribución personal. En siete trabajos figuro como primer autor: la formulación inicial de la cadena estocástica, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y rugosidades. Mis tareas abarcan metodología, desarrollo, simulación, análisis y redacción, con el alcance indicado en cada fila.\n\nLas colaboraciones delimitan otras responsabilidades: calibración y clima en los Andes; desarrollo, validación y documentación de NEOPRENE; generación y reconstrucción en downscaling; y módulos de extremos y frecuencia regional en Valencia.\n\nLa tabla se lee por filas, manteniendo juntas sus tres columnas. En la formulación inicial y el Besaya, mi aportación se refiere a la cadena estocástica y los impactos. En Mallorca, al downscaling, la geoestadística y la simulación. En Calle 30, a la metodología y la automatización de los modelos. SIMPCCe recoge el diseño y desarrollo de la herramienta; Tanganica, la metodología con datos globales y aprendizaje automático; y rugosidades, el ensemble y la comparación de motores. Las filas de colaboración concretan tareas parciales, en lugar de atribuirme la totalidad de esos trabajos. La fila del software separa además su diseño, documentación y publicación como un producto propio de la tesis.\n\nEn pyhydra e HYDRA soy primer autor del diseño, desarrollo, documentación y publicación del software. La investigación se apoya en trabajo colectivo; esta distribución identifica qué aporté personalmente. La extensión sobre cópulas vine se cita sin atribuirme su autoría.",
    notes: "Detalle basado en tabla 8.2, p.133. Mantener siete trabajos liderados, cuatro colaboraciones y el software con rol de primer autor. La aceptación del artículo de Valencia no cambia su posición de segundo autor. No confundir autoría con ejecución exclusiva de todo el trabajo. El anexo conserva el desglose literal ampliado de análisis y redacción.",
    mathBlock: "<table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead><tbody><tr><th scope=\"row\">V JIA (2017)</th><td class=\"tm-yes\">Primer autor</td><td>Conceptualización de la cadena estocástica, análisis y redacción</td></tr><tr><th scope=\"row\">Besaya, ROP (2018)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, modelización hidrológico-hidráulica, impactos y redacción</td></tr><tr><th scope=\"row\">Mallorca (2019)</th><td class=\"tm-yes\">Primer autor</td><td>Downscaling híbrido, geoestadística, simulación y redacción</td></tr><tr><th scope=\"row\">Andes, BID e IA (2019–2020)</th><td class=\"tm-part\">Coautor</td><td>Calibración automática y procesamiento climático</td></tr><tr><th scope=\"row\">NEOPRENE, GMD (2023)</th><td class=\"tm-part\">Segundo autor</td><td>Desarrollo, validación y documentación del software</td></tr><tr><th scope=\"row\">Calle 30, IA (2024)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología completa, automatización HEC-HMS/HEC-RAS y redacción</td></tr><tr><th scope=\"row\">Downscaling, EGU (2024)</th><td class=\"tm-part\">Coautor</td><td>Generación estocástica y reconstrucción integradas en pyhydra</td></tr><tr><th scope=\"row\">SIMPCCe, IA (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño y desarrollo íntegro, validación nacional y redacción</td></tr><tr><th scope=\"row\">Valencia (2025)</th><td class=\"tm-part\">Segundo autor</td><td>Módulos de extremos y AFR y ejecución de los cálculos</td></tr><tr><th scope=\"row\">Tanganica (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, datos globales, aprendizaje automático y redacción</td></tr><tr><th scope=\"row\">Rugosidad Besaya, EMS (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Ensemble Monte Carlo, automatización de ambos motores y redacción</td></tr><tr><th scope=\"row\">Vine cópulas y GPR (2026)</th><td class=\"tm-no\">Sin autoría</td><td>Trabajo del grupo citado como extensión; no es contribución de la tesis</td></tr><tr><th scope=\"row\">pyhydra e HYDRA, Zenodo (2026)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño, desarrollo, documentación y publicación del software</td></tr></tbody></table><p class=\"thesis-matrix-legend\">Fuente: memoria definitiva, tabla 8.2, p. 133. Siete trabajos como primer autor, cuatro colaboraciones y software con rol de primer autor.</p>",
    bullets: [],
    speakerGoal: "Leer la tabla por trabajo, posición de autoría y contribución concreta.",
    visualGuide: ["Primera columna: trabajo o publicación","Segunda columna: posición de autoría","Tercera columna: contribución del doctorando","Fila de extensión del grupo: sin autoría propia"],
    speechCues: ["responsabilidad por trabajo","posición de autoría","contribución personal","primer autor","colaboraciones","NEOPRENE","extremos y frecuencia regional","pyhydra e HYDRA","diseño, desarrollo, documentación y publicación","personalmente","por filas"],
    transition: "Con las responsabilidades delimitadas, podemos cerrar las tres hipótesis usando la evidencia presentada.",
    transitionCue: "hipótesis y sus evidencias"
  },

  // ════════════════════════════════════════════════════
  // BLOQUE 8 — CONCLUSIONES Y COMPILACIÓN DE HIPÓTESIS
  // ════════════════════════════════════════════════════

  {
    id: 40,
    block: "Conclusiones", blockColor: '#8b5cf6',
    title: "Qué evidencia aporta cada hipótesis y qué falta comprobar",
    subtitle: 'Evidencia acumulada, con el alcance de cada una',
    estimatedMinutes: 3,
    type: 'normal',
    script: "Esta figura vuelve a las tres hipótesis y organiza sus evidencias de arriba abajo. Cada grupo responde a una pregunta distinta: qué campañas podemos gestionar, qué componentes podemos reutilizar y cuánto cambia el resultado al modificar datos o procedimientos.\n\nArriba, H1, automatización, reúne 1.990 simulaciones hidráulicas del Besaya, 10.000 años sintéticos en IAHR y miles de eventos en Calle 30. Las unidades son diferentes: simulaciones, años y eventos. No podemos compararlas como tres medidas de tiempo ahorrado. Demuestran capacidad operativa para organizar campañas; el ahorro sistemático frente a un flujo manual sigue pendiente de medición.\n\nEn el centro, H2, modularidad, muestra la cobertura de los bloques en los diez estudios. Podemos seguir una columna para reconocer dónde se reutiliza un componente, o una fila para ver qué necesita un caso. La diversidad de combinaciones respalda la reutilización. La disponibilidad de cuatro estudios con notebooks añade materiales de revisión, con requisitos de ejecución propios. Evaluar cuánto reduce las barreras para otros equipos exige además una comprobación de uso.\n\nAbajo, H3, incertidumbre, presenta dos parejas de resultados. IAHR compara caudal T100 en metros cúbicos por segundo; Turís compara precipitación T100 en milímetros, sin y con la DANA. Las barras tienen escala dentro de cada gráfico, pero sus alturas no se comparan entre ambos. Muestran sensibilidad del diseño al procedimiento y a la muestra. Una diferencia, o un valor mayor, no demuestra por sí sola mayor exactitud. El contraste observacional y las comparaciones adicionales siguen siendo necesarios para valorar esa hipótesis con todo su alcance.",
    notes: "La formulación de H1 contempla eficiencia, pero esta defensa acredita principalmente viabilidad operativa. H2 tiene cuatro estudios con notebooks actuales, sujetos a sus requisitos de ejecución. H3 muestra sensibilidad e incertidumbre, no una demostración general de exactitud superior.",
    bullets: ["H1: viabilidad demostrada; ahorro de tiempo pendiente de medir.","H2: reutilización entre aplicaciones; cuatro estudios con notebooks y requisitos de ejecución propios.","H3: sensibilidad del diseño a métodos y datos; mayor valor no implica mayor exactitud."],
    speakerGoal: "Cada hipótesis tiene una evidencia concreta y una comprobación pendiente.",
    visualGuide: ["Arriba: campañas y capacidad operativa","Centro: reutilización de módulos","Abajo: dos comparaciones, con escalas distintas"],
    speechCues: ["Arriba, H1","capacidad operativa","ahorro","En el centro, H2","reutilización","Abajo, H3","contraste observacional","tres hipótesis","H1, automatización","H2, modularidad","H3, incertidumbre"],
    transition: "Ese cierre permite precisar la contribución doctoral sin confundir métodos previos, desarrollos propios y conocimiento aportado.",
    transitionCue: "contribución original"
  },

  {
    id: 41,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'La contribución original: hacer operativa la ciencia existente',
    subtitle: 'Integración extremo a extremo, reproducibilidad sistemática y transferencia demostrada',
    estimatedMinutes: 3,
    type: 'normal',
    script: "La figura distingue la procedencia de los componentes y la contribución que resulta de conectarlos. En la base están los métodos científicos previos: análisis de extremos, cópulas, generadores y motores físicos. En el nivel central se sitúan los desarrollos de la tesis: submódulos, adaptadores y flujos documentados. Arriba aparece su integración reproducible y transferible.\n\nLos niveles de la figura distinguen conocimiento previo, desarrollo e integración. Los métodos de la base tienen autores y formulaciones reconocidos. El nivel intermedio representa el trabajo de convertirlos en componentes utilizables, conectarlos con datos y motores y conservar sus transformaciones. El nivel superior recoge el comportamiento del conjunto: ejecutar un flujo, examinar su procedencia y adaptarlo a otra aplicación. Los tres indicadores de la izquierda expresan ese resultado mediante integración extremo a extremo, trazabilidad y transferencia en diez estudios. La originalidad se sitúa en esa articulación operativa, cuyo alcance debe leerse junto con la evidencia y los requisitos de cada caso.\n\nLos casos dan contenido a esa integración: permiten examinar la influencia de entradas y modelos, estimar frecuencia sobre el impacto y reutilizar componentes en otra escala. La contribución original consiste en hacer operativa esa cadena, conservando la trazabilidad de sus decisiones y delimitando las condiciones en las que pueden interpretarse los resultados.",
    notes: "Base científica previa → desarrollo de componentes → integración reproducible y transferencia. Explicar esta jerarquía como conclusión de los casos.",
    results: [
      { value:'Extremo a extremo', label:'integración funcional', implication:'datos, estadística, escenarios, modelos físicos e impacto' },
      { value:'Trazable', label:'reproducibilidad sistemática', implication:'cada resultado conserva fuente, método y configuración' },
      { value:'10 estudios', label:'transferibilidad operativa', implication:'cuatro con notebooks; seis documentados desde su publicación o proyecto' },
    ],
    bullets: [
      'Las metodologías científicas incorporadas son reconocidas explícitamente como conocimiento previo.',
      'El desarrollo doctoral las convierte en módulos, adaptadores y flujos reproducibles.',
      'La originalidad reside en integrarlas y demostrar que esa arquitectura puede transferirse a proyectos reales.',
      'La automatización no sustituye el juicio experto: lo hace más eficiente y trazable.',
    ],
    speakerGoal: "Cerrar la tesis distinguiendo tres niveles de contribución.",
    visualGuide: ["Nivel inferior: conocimiento previo","Nivel intermedio: desarrollo de la tesis","Nivel superior: contribución original"],
    speechCues: ["métodos científicos previos","desarrollos de la tesis","integración reproducible y transferible","frecuencia sobre el impacto","contribución original","trazabilidad","conocimiento previo, desarrollo e integración"],
    transition: "Los límites se localizan precisamente en las etapas de la cadena que hemos recorrido.",
    transitionCue: "comprobaciones y desarrollos"
  },

  {
    id: 42,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: "Limitaciones y trabajo futuro",
    subtitle: "Cinco limitaciones y tres ámbitos de trabajo futuro",
    figure: "esq_limitaciones.svg", figurePosition: "full",
    figureCaption: "Fuente: memoria doctoral, tabla 8.1 y trabajo futuro, pp. 128–130.",
    estimatedMinutes: 2,
    type: "figure",
    script: "La tabla organiza cinco limitaciones y se lee de izquierda a derecha. La primera columna identifica el problema; la segunda, las medidas que HYDRA incorpora; y la tercera, el límite que permanece. La franja inferior reúne el trabajo futuro, separado de las capacidades actuales.\n\nEn la primera fila, las series cortas y los extremos raros dejan poca información sobre la cola. Bootstrap, inferencia bayesiana y análisis regional ayudan a representar o compartir esa información, pero no generan observaciones nuevas. El análisis regional exige además justificar la homogeneidad de las estaciones.\n\nLa segunda fila trata los motores externos. Los adaptadores normalizan su uso y los contenedores conservan las dependencias compatibles con ese entorno. Permanecen los requisitos de instalación, licencia, plataforma y versión de cada motor; automatizar el acceso no los elimina.\n\nLa tercera distingue los generadores estacionarios de una representación completa de cambios en el tiempo. Corregir sesgos y generar por escenario permite tratar condiciones climáticas concretas, pero la no estacionariedad completa requiere formulaciones y comprobaciones específicas.\n\nLa cuarta se refiere al coste de simulación hidráulica: tiempo y recursos necesarios para ejecutar muchos escenarios con el modelo físico. MaxDiss, k-NN, emulación y selección permiten reducir ejecuciones, pero sus aproximaciones deben validarse. Algunos casos seguirán necesitando simulación directa. Se trata del coste computacional de las simulaciones que exige cada estudio.\n\nLa quinta recoge la calidad de los datos globales. El diagnóstico, la corrección de sesgo y la trazabilidad permiten detectar y documentar diferencias. Persisten errores de representación, especialmente en cuencas complejas o con pocas observaciones locales.\n\nLas tres áreas inferiores plantean ampliar métodos y validación, desarrollar infraestructura de campañas y configuración de estudios, y reforzar documentación y transferencia. La conclusión es que HYDRA ayuda a organizar estas limitaciones y sus controles; cada aplicación debe justificar qué incertidumbre trata y cuál permanece.",
    notes: "Síntesis editorial trazable a la tabla 8.1 y §8.4 (pp.128–129) y §8.5 (pp.129–130). Las cinco limitaciones y las mitigaciones son las de la tabla, sin convertirlas en cinco etapas nuevas de la cadena. Bootstrap, Bayes, AFR, control de calidad, adaptadores, MaxDiss, k-NN y emulación ya aparecen como mitigaciones disponibles. VineCopula, CopulaCDFEmulator y pyhydra.uq ya forman parte de pyhydra 0.2.0; el trabajo futuro es ampliar su validación en casos reales, no presentarlos como desarrollos aún inexistentes. La tabla no garantiza reproducibilidad de motores externos ni elimina errores de representación de datos globales. La comprobación de acierto y ahorro pertenece al contraste de hipótesis (§8.6), no debe confundirse con una sexta fila de la tabla 8.1. La distribución y los archivos versionados requieren continuidad; no se presentan como recursos aún inexistentes.",
    bullets: [],
    speakerGoal: "Distinguir con precisión mitigación disponible, límite persistente y trabajo futuro según la memoria.",
    visualGuide: ["Tabla superior: cinco limitaciones de la tabla 8.1", "Columnas: limitación, mitigación disponible y límite persistente", "Franja inferior: los tres ámbitos del trabajo futuro"],
    speechCues: ["cinco limitaciones","trabajo futuro","series cortas y los extremos raros","motores externos","generadores estacionarios","coste de simulación hidráulica","calidad de los datos globales","coste de simulación hidráulica"],
    transition: "Ese es el alcance del trabajo y la continuidad que propongo. Quiero cerrar agradeciendo a quienes lo hicieron posible.",
    transitionCue: "agradecer"
  },

  {
    id: 42.5,
    block: 'Agradecimientos', blockColor: '#0d9488',
    title: 'Una tesis se firma con un nombre, pero se construye con muchos',
    subtitle: 'A quienes hicieron posible que este trabajo llegara hasta aquí',
    estimatedMinutes: 1,
    type: 'normal',
    script: "Quiero dar las gracias a mi familia por acompañarme y sostenerme durante todo este recorrido. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad. A IHCantabria, por el entorno humano, científico y técnico en el que he podido desarrollar el trabajo. A mis compañeros de la Universidad de Castilla-La Mancha, por su apoyo y compañerismo. Y al Banco Santander, por la beca que me ha concedido.\n\nEn la diapositiva aparecen personas e instituciones con funciones distintas en ese recorrido: el apoyo personal, la dirección y tutela académicas, el entorno de investigación y el apoyo mediante la beca. La tesis reúne desarrollos propios y trabajo compartido, como he procurado distinguir en la tabla de contribuciones. Quiero que este cierre reconozca ambas dimensiones: la responsabilidad científica de lo que presento y la ayuda que hizo posible desarrollarlo y llevarlo hasta la defensa.\n\nA todos, muchas gracias.",
    notes: "Tono personal y pausado. Hacer una pausa antes de la frase final.",
    bullets: [
      'Mi familia — el apoyo que sostuvo todo el recorrido.',
      'Manuel del Jesus Peñil — rigor, confianza y vocación de utilidad.',
      'César Álvarez Díaz — disponibilidad y generosidad constantes.',
      'IHCantabria — el entorno humano, científico y técnico de la tesis.',
      'Compañeros de la Universidad de Castilla-La Mancha — apoyo y compañerismo.',
      'Banco Santander — por la beca concedida.',
    ],
    speakerGoal: "Agradecer sin abrir otra explicación científica.",
    visualGuide: ["Familia, director y tutor","IHCantabria y compañeros de la Universidad de Castilla-La Mancha","Banco Santander: beca concedida"],
    speechCues: ["mi familia","Manuel del Jesus Peñil","César Álvarez Díaz","IHCantabria","Universidad de Castilla-La Mancha","Banco Santander","beca"],
    transition: "Termino con la respuesta a la pregunta que abrió la defensa.",
    transitionCue: "idea central"
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
    figure: 'qr_hydra.svg',
    figureCaption: 'Código QR para abrir la portada pública de HYDRA, sus herramientas y casos.',
    script: "Para terminar, recupero la idea que ha guiado la defensa. La tesis desarrolla una cadena reproducible que conecta datos, métodos y modelos para estimar la frecuencia del impacto bajo incertidumbre hidrológica y climática. Las aplicaciones muestran su utilidad en problemas de ingeniería y permiten precisar los límites que he expuesto.\n\nLa frase central resume la propuesta: una cadena reproducible convierte información climática e hidrológica en resultados físicos que pueden examinarse. El código QR permite abrir la portada de HYDRA para consultar sus herramientas, documentación y casos. Los enlaces inferiores identifican los repositorios y versiones de los dos productos de software. Permiten continuar la consulta del trabajo con el alcance documentado en cada recurso. El recorrido ha mostrado tanto resultados concretos como condiciones de aplicación: calidad de datos, hipótesis estadísticas, motores y validación. Esa delimitación forma parte de la contribución, porque permite reconocer qué sabemos a partir de cada análisis y qué comprobaciones deben acompañar su uso en una decisión de ingeniería.\n\nLos repositorios y las versiones citables de pyhydra e HYDRA quedan disponibles para continuar esa investigación y revisar sus desarrollos. Con esta síntesis concluyo la exposición del trabajo y quedo a disposición del tribunal para las aclaraciones y preguntas que considere oportunas.",
    notes: "Terminar la respuesta científica, agradecer y ceder la palabra. El QR abre la portada pública de HYDRA; los enlaces quedan visibles durante las preguntas.",
    bullets: [
      'GitHub Librería: github.com/navass11/pyhydra (Licencia MIT)',
      'GitHub Plataforma: github.com/navass11/HYDRA',
      'DOI pyhydra: 10.5281/zenodo.20932555',
      'DOI HYDRA: 10.5281/zenodo.21138151',
      'Contacto: s.navas11@gmail.com',
    ],
    speakerGoal: "Dar una conclusión recordable y ceder la palabra.",
    visualGuide: ["Mensaje final","Repositorios y DOI para acceder al trabajo"],
    speechCues: ["cadena reproducible","frecuencia del impacto","incertidumbre hidrológica y climática","problemas de ingeniería","límites","aclaraciones y preguntas","una cadena reproducible"],
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
    script: "Las inundaciones afectan simultáneamente a personas, viviendas, movilidad, actividad industrial y servicios esenciales. La gravedad de los daños depende de qué zonas se inundan, de la profundidad y la velocidad del agua, de cuánto dura la inundación y de la vulnerabilidad de las personas, los edificios y las infraestructuras expuestos. El estado previo de la cuenca condiciona, a su vez, cómo responde a la lluvia. Por eso, al utilizar una lluvia de diseño, debemos justificar qué condiciones representa y cómo se relaciona su frecuencia con la del impacto. La pregunta de ingeniería exige conocer qué impactos pueden producirse, con qué frecuencia y con qué incertidumbre.\n\nLa ilustración reúne distintos sistemas expuestos para recordar que una misma situación meteorológica puede afectar de forma diferente a cada uno. En una infraestructura, interesa saber hasta qué punto entra el agua; en una zona habitada, también importa su extensión, profundidad y velocidad. Para interpretar el daño necesitamos combinar la respuesta física con la exposición y la vulnerabilidad. En esta tesis, el desarrollo se concentra en la cadena que caracteriza los escenarios y estima la respuesta hidrológica e hidráulica. Esa información alimenta la evaluación del riesgo y las decisiones de diseño; por sí sola no constituye una estimación completa de las pérdidas de todos los elementos expuestos.",
    notes: "La imagen es conceptual. Señalar los sistemas expuestos y formular la pregunta de decisión. No presentarla como fotografía documental de un evento.",
    bullets: [
      'La misma precipitación puede producir consecuencias distintas según el estado de la cuenca y la exposición.',
      'La decisión se toma sobre personas, infraestructuras y niveles de agua, no sobre la lluvia de forma aislada.',
    ],
    speakerGoal: "Situar la variable sobre la que se toma una decisión.",
    visualGuide: ["Ilustración conceptual: río, ciudad y costa","Edificios, movilidad e infraestructuras expuestas"],
    speechCues: ["personas","profundidad y la velocidad","vulnerabilidad","estado previo de la cuenca","frecuencia","incertidumbre","respuesta física","exposición y la vulnerabilidad"],
    transition: "Veamos cómo recorre esa distancia el procedimiento de cálculo habitual.",
    transitionCue: "condiciones",
    sectionLabel: "Contexto del problema"
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
    script: "El Trabajo Fin de Máster demostró que la frecuencia del impacto debía calcularse después de la simulación hidráulica. Al mismo tiempo dejó visible una limitación práctica: la cadena funcionaba, pero dependía de muchos traspasos manuales y de una configuración específica para una única cuenca. Este antecedente ayuda a plantear una pregunta más general. ¿Cómo conservar el rigor del método, repetirlo de forma auditable y transferirlo a problemas con otros datos, otras escalas y otros modelos físicos?\n\nEn el esquema se reconoce la secuencia aforos, eventos, dependencia, hidrogramas, respuesta hidráulica e impacto. Esa secuencia aporta el fundamento científico previo. La pregunta doctoral exige después formular hipótesis y objetivos para decidir qué debemos automatizar, cómo organizarlo y con qué evidencia valorar la propuesta. Por tanto, el TFM es un antecedente metodológico, mientras que el desarrollo de pyhydra se plantea para responder a los requisitos de la tesis. Esta distinción evita presentar una aplicación inicial como si ya contuviera toda la plataforma actual o como si su evolución tecnológica hubiera sido el único objetivo de investigación.",
    notes: 'Esta diapositiva es el puente entre el origen de la investigación y la formulación del problema. No adelantar nombres de paquetes. El mensaje es que la tesis generaliza una necesidad científica detectada en el TFM.',
    bullets: [
      'El TFM aporta el principio científico.',
      'La dificultad de repetir la cadena define el problema doctoral.',
      'La tesis busca generalización, trazabilidad y transferencia.',
    ],
    sectionLabel: "Marco conceptual",
    speechCues: ["aforos, eventos, dependencia, hidrogramas, respuesta hidráulica e impacto","antecedente metodológico","Trabajo Fin de Máster","frecuencia del impacto","traspasos manuales","hipótesis y objetivos","pyhydra","transferir"]
  },

  {

    id: 46,
    block: "Estado del arte", blockColor: '#3b82f6',
    title: 'Qué necesita una modelación estocástica de inundaciones',
    subtitle: 'La generación de escenarios solo adquiere valor cuando se conecta con datos, clima y modelos físicos',
    estimatedMinutes: 1,
    type: 'normal',
    script: "La figura recorre la cadena necesaria para una modelación estocástica. A partir de una serie se generan escenarios plausibles, que se transforman mediante los modelos físicos en respuestas hidráulicas. Un mapa de calado representa el resultado de una de esas ejecuciones.\n\nAl reunir muchos resultados podemos construir la curva de frecuencia situada al final y estimar la probabilidad de superar un calado. La banda expresa la incertidumbre de esa estimación. Así conectamos los escenarios con la variable de decisión.\n\nPodemos leer los cinco pasos de la figura como una transformación progresiva. La serie observada aporta información limitada sobre la variabilidad. El generador produce realizaciones bajo sus hipótesis. Los modelos físicos las convierten en respuestas, y cada mapa describe un escenario concreto. La curva final reúne esas respuestas para relacionar un calado con su frecuencia. Para leerla fijamos un período de retorno en el eje horizontal y buscamos el calado correspondiente; la banda recuerda que esa estimación tampoco es exacta. Los mapas individuales son realizaciones del cálculo, mientras que la curva resume el comportamiento del conjunto.\n\nLos años sintéticos amplían las realizaciones disponibles bajo unas hipótesis; no añaden nuevas observaciones. Por eso debemos revisar los diagnósticos del generador y la adecuación de los modelos antes de interpretar la curva.",
    notes: "Los años sintéticos son realizaciones del modelo. La curva final está condicionada a las hipótesis del generador y de los motores.",
    bullets: [
      'Representar escenarios plausibles exige datos y relaciones de dependencia.',
      'Propagar esos escenarios exige modelos hidrológicos e hidráulicos.',
      'Evaluar el riesgo exige calcular la distribución de la variable de impacto.',
    ],
    speakerGoal: "Explicar la cadena estocástica antes de comparar arquitecturas.",
    visualGuide: ["Serie corta de partida","Población de escenarios","Mapa por escenario y curva final"],
    speechCues: ["escenarios plausibles","respuestas hidráulicas","curva de frecuencia","probabilidad de superar un calado","incertidumbre","no añaden nuevas observaciones","serie observada","generador","modelos físicos","curva final"],
    transition: "La cuestión es qué parte de esta cadena cubren conjuntamente los marcos disponibles.",
    transitionCue: "otros marcos",
    sectionLabel: "Modelación estocástica"
  },

  {
    id: 47,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Mapa metodológico de la tesis',
    subtitle: 'Cinco responsabilidades científicas que después se materializan en la arquitectura',
    estimatedMinutes: 1,
    type: 'normal',
    script: "Antes de la arquitectura técnica, este es el mapa metodológico: cinco responsabilidades y los submódulos de pyhydra que las materializan. Los datos: lluvia, caudal, cambio climático y suelos. Los extremos y el clima: series, análisis regional y corrección de sesgo. Los escenarios: generación estocástica y downscaling híbrido. La respuesta física: HEC-HMS, SWAT+, SFINCS y HEC-RAS. Y el impacto: reconstrucción de escenarios no simulados, sensibilidad y período de retorno sobre el calado. La web organiza estas capacidades en cuatro módulos funcionales: fuentes de datos, análisis climático, generación estocástica y modelización. El código reúne los catorce submódulos descritos en la memoria en tres paquetes principales; cada caso utiliza solo la combinación que necesita.\n\nLas cinco responsabilidades del esquema no son cinco módulos adicionales de la web. Describen funciones científicas que atraviesan la organización del software. Un mismo componente puede intervenir en varios pasos: los extremos ayudan a caracterizar entradas, y la reconstrucción ayuda a formar el conjunto de impactos. Las flechas señalan relaciones de cálculo; no obligan a que cada caso recorra todas las cajas en el mismo orden. La utilidad del mapa es mantener identificada la salida de cada transformación y su procedencia, de modo que podamos seguir una cifra desde el dato de entrada hasta el resultado de ingeniería.",
    notes: 'Utilizar esta diapositiva como orientación. No enumerar aún clases ni submódulos. En la diapositiva siguiente se explica que la arquitectura asigna una capa técnica a estas responsabilidades.',
    backup: true,
    sectionLabel: "Mapa metodológico",
    speechCues: ["cinco responsabilidades","datos","extremos y el clima","escenarios","respuesta física","impacto","cuatro módulos funcionales","tres paquetes principales","procedencia"]
  },

  {
    id: 48,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Resultados que sostienen la contribución',
    subtitle: 'Los casos aportan evidencias distintas y complementarias',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Estas cuatro figuras reúnen resultados que se desarrollan en el recorrido principal. IAHR muestra un ejemplo T100 de 208,8 frente a 278,5 m³/s, un aumento del 33,4 por ciento respecto a IDF; el mapa espacial corresponde a un horizonte distinto. En Valencia, el nivel T100 bayesiano pasa de 260 a 952 mm al incorporar la DANA. En el Besaya, 995 pares de simulaciones permiten comparar dos motores. En Panamá, 414 combinaciones describen dimensiones del análisis climático, no un registro de ejecuciones hidráulicas. Cada resultado debe leerse con su variable, método, horizonte y alcance.\n\nPara comparar estas cuatro evidencias hay que conservar sus unidades y preguntas. El ejemplo IAHR relaciona un caudal con el procedimiento de diseño. Valencia relaciona un cuantil de precipitación con la inclusión de un episodio en la muestra. Besaya compara respuestas de motores para realizaciones emparejadas. Panamá muestra organización de entradas y configuraciones a escala nacional. No son cuatro medidas del mismo efecto ni cuatro pruebas intercambiables de exactitud. En conjunto, permiten reconocer por qué resulta útil una cadena trazable: hace posible identificar qué decisión o componente produce una diferencia y qué contraste adicional se necesita para interpretarla.",
    notes: "Resumen de reserva. El rango 30–37 % del texto de la memoria queda pendiente de cotejo con el artículo original; se utiliza el ejemplo aritméticamente comprobable de +33,4 % respecto a IDF.",
    bullets: [
      'La evidencia combina contraste metodológico, actualización estadística, sensibilidad hidráulica y escalabilidad.',
      'El valor conjunto reside en conservar la trazabilidad desde la entrada hasta la cifra final.',
    ],
    backup: true,
    speechCues: ["unidades y preguntas","cuatro figuras","208,8 frente a 278,5","33,4 por ciento","260 a 952 mm","995 pares","414 combinaciones","método"]
  },

{
  "id": 55,
  "block": "Contribuciones científicas",
  "blockColor": "#0ea5e9",
  "title": "Autoría completa de la línea de investigación",
  "subtitle": "Rol del doctorando en cada publicación, según la tabla de autoría del capítulo 8",
  "estimatedMinutes": 2,
  "type": "normal",
  "script": "Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución, y esta tabla la resume. Soy primer autor en siete trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los trabajos andinos contribuí a la calibración automática y al procesamiento climático; en NEOPRENE, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en Valencia, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. El trabajo de cópulas vine del grupo se cita como extensión, sin autoría mía. Finalmente, pyhydra e HYDRA son software con rol de primer autor, diseñado, desarrollado y documentado como parte de la tesis.\n\nLa posición de autoría y la tarea realizada responden a preguntas distintas. Ser primer autor identifica una responsabilidad principal, pero no implica autoría única de un trabajo colectivo. Las filas de colaboración delimitan tareas concretas de calibración, procesamiento climático, desarrollo de software o cálculo de extremos. La tabla incluye expresamente una extensión del grupo sin autoría propia, para evitar atribuirme ese resultado. Finalmente, el software constituye un producto con responsabilidades de diseño, desarrollo, documentación y distribución. Este desglose permite responder por una publicación concreta sin convertir una contribución parcial en una atribución de todo el estudio.",
  "notes": "Esta diapositiva responde preventivamente a dos preguntas: qué resultados pertenecen al doctorando y cómo se relacionan las publicaciones previas con la contribución doctoral. No atribuirse el trabajo Vine cópulas/GPR de 2026: la memoria lo cita como línea de extensión sin autoría del doctorando. La tabla se distribuye en dos columnas; se leen por separado de arriba abajo.",
  "mathBlock": "<div class=\"authorship-grid\"><table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead><tbody><tr><th scope=\"row\">V JIA (2017)</th><td class=\"tm-yes\">Primer autor</td><td>Conceptualización de la cadena estocástica, análisis y redacción</td></tr><tr><th scope=\"row\">Besaya, ROP (2018)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, modelización hidrológico-hidráulica, impactos y redacción</td></tr><tr><th scope=\"row\">Mallorca (2019)</th><td class=\"tm-yes\">Primer autor</td><td>Downscaling híbrido, geoestadística, simulación y redacción</td></tr><tr><th scope=\"row\">Andes, BID e IA (2019–2020)</th><td class=\"tm-part\">Coautor</td><td>Calibración automática y procesamiento climático</td></tr><tr><th scope=\"row\">NEOPRENE, GMD (2023)</th><td class=\"tm-part\">Segundo autor</td><td>Desarrollo, validación y documentación del software</td></tr><tr><th scope=\"row\">Calle 30, IA (2024)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología completa, automatización HEC-HMS/HEC-RAS y redacción</td></tr><tr><th scope=\"row\">Downscaling, EGU (2024)</th><td class=\"tm-part\">Coautor</td><td>Generación estocástica y reconstrucción integradas en pyhydra</td></tr></tbody></table><table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead><tbody><tr><th scope=\"row\">SIMPCCe, IA (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño y desarrollo íntegro, validación nacional y redacción</td></tr><tr><th scope=\"row\">Valencia (2025)</th><td class=\"tm-part\">Segundo autor</td><td>Módulos de extremos y AFR y ejecución de los cálculos</td></tr><tr><th scope=\"row\">Tanganica (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, datos globales, aprendizaje automático y redacción</td></tr><tr><th scope=\"row\">Rugosidad Besaya, EMS (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Ensemble Monte Carlo, automatización de ambos motores y redacción</td></tr><tr><th scope=\"row\">Vine cópulas y GPR (2026)</th><td class=\"tm-no\">Sin autoría</td><td>Trabajo del grupo citado como extensión; no es contribución de la tesis</td></tr><tr><th scope=\"row\">pyhydra e HYDRA, Zenodo (2026)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño, desarrollo, documentación y publicación del software</td></tr></tbody></table></div><p class=\"thesis-matrix-legend\">Fuente: memoria definitiva, tabla 8.2. Los trece registros se distribuyen en dos columnas para consulta.</p>",
  "bullets": [],
  "backup": true,
    visualGuide: ["Columna izquierda: primeros trabajos y colaboraciones","Columna derecha: aplicaciones posteriores, extensión sin autoría y software"],
    speechCues: ["posición de autoría","tarea realizada","sin autoría propia","primer autor en siete","trabajos andinos","NEOPRENE","Valencia","sin autoría mía","pyhydra e HYDRA"]
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
  "script": "Los dos mapas comparan regímenes hidráulicos del ensemble de HEC-RAS en Los Corrales de Buelna. El régimen bajo reúne 97 realizaciones y el alto, 898; juntas forman las 995 realizaciones válidas del contraste. Los tonos de frecuencia espacial permiten reconocer qué zonas se inundan de forma consistente dentro de cada grupo. Son frecuencias entre realizaciones del ensemble, no probabilidades anuales de inundación asignadas directamente por estos mapas.\n\nLa diferencia que interesa es la conexión con un compartimento secundario de unas 7,4 hectáreas. El collado señalado se sitúa a 60,1 metros y forma parte del corredor que permite esa conexión. Esto ayuda a investigar por qué aparecen dos grupos de áreas inundadas en los gráficos de comparación.\n\nLa interpretación necesita una precisión: la cota del collado no es un umbral suficiente por sí solo. Según la memoria, ambos regímenes llegan a mojar ese píxel, pero con distribuciones de nivel distintas. Intervienen conjuntamente el campo de rugosidad, los gradientes hidráulicos, la malla y la conectividad del corredor. Ninguna clase individual de Manning predice por sí sola el régimen.\n\nEste anexo muestra cómo pasamos de una separación estadística a una hipótesis física contrastable mediante las salidas espaciales. La comparación entre motores y la comprobación con observaciones siguen siendo preguntas diferentes.",
    speechCues: ["regímenes hidráulicos","97 realizaciones","898","compartimento secundario de unas 7,4 hectáreas","60,1 metros","no es un umbral suficiente por sí solo","hipótesis física contrastable","995","probabilidades anuales","7,4 hectáreas","malla"]
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
  "script": "El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. La figura compara cambios de nivel respecto al histórico, en metros, para cuatro horizontes y dos escenarios. Las barras de error representan la incertidumbre del ensemble climático. La lectura compara los horizontes y sus bandas sin convertir una proyección concreta en una cota universal de diseño.\n\nLa figura distribuye los cuatro horizontes en paneles, de modo que debemos conservar escenario y período de retorno al comparar entre ellos. Dentro de cada panel, el eje horizontal identifica la frecuencia de diseño y la altura de la barra, el incremento respecto al histórico. Las barras de error añaden la dispersión asociada al ensemble climático. Un incremento pequeño para un período largo no significa que la cota absoluta sea menor que la correspondiente a un período corto: cada incremento se suma a una referencia histórica distinta. Tampoco debemos sumar como si fueran equivalentes el desacuerdo entre métodos históricos y la dispersión entre modelos climáticos. Son componentes de incertidumbre con orígenes diferentes.",
    speechCues: ["cuatro horizontes en paneles","altimetría","AdaBoost","N(Q)","K-means","19 modelos CMIP6","delta mensual","residuos","20.000 años","máximos anuales","GEV","incremento","barras de error"]
},
{
  "id": 58,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: caudales proyectados de entrada al lago Tanganica",
  "estimatedMinutes": 1,
  "figure": "fig_tanganika_proyecciones.png",
  "figureCaption": "Figura 7.14, p. 110: caudales de entrada estimados con AdaBoost; no son niveles del lago",
  "script": "Esta figura es una serie temporal de caudales de entrada al lago, no una curva de niveles extremos. El eje horizontal recorre los años y el vertical expresa caudal en metros cúbicos por segundo. El tramo gris representa la referencia histórica; azul y rojo distinguen las proyecciones SSP2-4.5 y SSP5-8.5. La línea vertical separa visualmente el tramo histórico del futuro y las zonas sombreadas representan incertidumbre intermodelo.\n\nLas oscilaciones muestran que la proyección no consiste en una tendencia lisa y única. Las líneas centrales resumen cada escenario y las bandas permiten reconocer la dispersión de las estimaciones. El hecho de que se solapen en algunos períodos impide interpretar cualquier diferencia entre líneas como una separación inequívoca entre futuros posibles.\n\nEstos caudales se estiman mediante AdaBoost a partir de información climática y alimentan después la relación N de Q para obtener niveles. Para llegar a cotas de diseño hay que continuar con la generación de variabilidad, los máximos anuales y la referencia histórica. La figura documenta un eslabón de la cadena, no observaciones futuras ni una cota directamente aplicable al puerto.",
    speechCues: ["serie temporal de caudales de entrada al lago","metros cúbicos por segundo","SSP2-4.5 y SSP5-8.5","AdaBoost","N de Q","referencia histórica","SSP2-4.5","SSP5-8.5","incertidumbre intermodelo"]
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
  "script": "Este mapa sitúa el dominio del caso Calle 30. La cadena mostrada en la presentación conecta lluvia multisitio, HEC-HMS y HEC-RAS 1D; el mapa delimita la infraestructura a la que se asigna la frecuencia del calado.\n\nEl mapa permite localizar la infraestructura y su entorno, que dan sentido a la selección de puntos de entrada y secciones hidráulicas. Una sección de túnel y una zona de acceso pueden responder de forma distinta al mismo conjunto de caudales. Por eso el análisis conserva la posición de cada resultado. La figura no es un mapa de período de retorno ni permite leer un calado por su color sin una variable hidráulica asociada. Su función en la defensa es situar el dominio sobre el que se interpretan los perfiles y las curvas del caso principal, y recordar que el modelo 1D representa una red de infraestructura concreta.",
  "backup": true,
    speechCues: ["infraestructura y su entorno","mapa","dominio","lluvia multisitio","HEC-HMS","HEC-RAS 1D","secciones","período de retorno","calado"]
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
  "script": "Los cuatro paneles permiten comparar dos estaciones y dos muestras. Arriba aparece Turís; abajo, Carlet. La columna izquierda ajusta las series sin la DANA de 2024 y la derecha incorpora ese episodio. En cada fila debemos mantener la estación al comparar de izquierda a derecha, porque la escala vertical cambia entre estaciones.\n\nEl eje horizontal representa período de retorno en años y el vertical, precipitación máxima diaria en milímetros. La línea verde representa el ajuste bayesiano; la azul, máxima verosimilitud; y la roja discontinua, L-momentos. Las bandas muestran incertidumbre. La línea horizontal punteada sitúa la precipitación observada del episodio: 710,8 milímetros en Turís y 265,1 en Carlet.\n\nHay dos lecturas diferentes. Si fijamos un período de retorno, las alturas de las curvas proporcionan cuantiles de diseño y permiten comparar estimadores. Si fijamos la precipitación observada, la intersección con cada curva permite examinar el período que ese ajuste le asigna. Incorporar el episodio cambia ambas lecturas al modificar la cola estimada.\n\nLa separación de curvas y el ensanchamiento de bandas hacia períodos largos recuerdan la incertidumbre de extrapolación. El contraste sirve para evaluar sensibilidad a la muestra y al método; no establece una frecuencia verdadera conocida del episodio ni permite interpretar como observaciones los cuantiles extrapolados.",
  "backup": true,
    speechCues: ["dos estaciones y dos muestras","eje horizontal","vertical","período de retorno","precipitación observada","Turís","Carlet","sin la DANA","verde","azul","L-momentos","bandas","710,8","265,1"]
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
  "script": "La captura muestra la pestaña Modelos Regresión de SIMPCCe. A la izquierda aparecen opciones para aportar una serie de aportaciones naturalizadas y para combinar el ajuste con la actualización climática. Las pestañas superiores sitúan esa operación entre la configuración de la cuenca y el cambio climático. Los controles visibles corresponden al ejemplo capturado; no indican por sí solos una configuración válida para cualquier cuenca.\n\nEl gráfico superior derecho compara observado en horizontal y simulado en vertical. La línea diagonal permite reconocer coincidencia entre ambos valores; los puntos muestran sus diferencias. Los indicadores NSE, R cuadrado y sesgo resumen aspectos distintos del ajuste. El valor de cada uno pertenece a este ejemplo de la interfaz y no es una validación global de la herramienta.\n\nEl panel inferior compara las series temporales de aportaciones, en hectómetros cúbicos por mes. Permite revisar si se reproducen la evolución y los picos, además de los indicadores agregados. La zona de registro documenta el avance del proceso.\n\nEste anexo explica cómo se configura y revisa el modelo de aportaciones. En la diapositiva principal, esas aportaciones se conectan con un modelo de gestión para interpretar suministro y fiabilidad; esta pantalla no calcula por sí sola toda esa decisión.",
  "backup": true,
    speechCues: ["Modelos Regresión","configuración de la cuenca","cambio climático","observado en horizontal y simulado en vertical","series temporales de aportaciones","modelo de gestión","NSE","R cuadrado","sesgo","simulado"]
},
{
  "id": 62,
  "backup": true,
  "type": "figure",
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "title": "Anexo: resultados completos de SIMPCCe",
  "estimatedMinutes": 2,
  "figure": "fig_simpcce_articulo_ficha3.png",
  "figurePosition": "full",
  "figureCaption": "Figura 10 del artículo de Navas y del Jesus (2025), p. 144: ficha de aportaciones, ejemplo de Alcántara.",
  "script": "Esta es la ficha de aportaciones reproducida en la figura 10 del artículo de SIMPCCe. El ejemplo se identifica como embalse de Alcántara. Las matrices superiores muestran cambios anuales por modelo para RCP4.5 y RCP8.5. Debajo se presentan aportaciones medias, varianza y cuantil 25 por mes, junto a paneles que comparan el cambio porcentual de la media y factores de cambio de los cuantiles. Las filas corresponden a los tres horizontes futuros.\n\nLa ficha muestra los productos que genera la herramienta. Para leer un valor concreto debe ampliarse su panel y comprobar variable, unidad, horizonte y escenario.\n\nLa lectura exige distinguir porcentajes de cambio de factores multiplicativos. Un cambio porcentual se interpreta respecto a la referencia histórica y tiene cero como ausencia de cambio; un factor tiene uno como referencia. Las filas organizan los horizontes y los colores separan los escenarios. Las medias y la varianza resumen aspectos diferentes de las aportaciones, mientras que el cuantil 25 permite examinar la parte baja de su distribución. Esta ficha reúne productos de diagnóstico: para utilizar una cifra de diseño habría que identificar el panel, el punto, la variable y el escenario correspondientes y conservar su referencia. La figura completa sirve como respaldo documental, sin sustituir esa lectura detallada por un único valor general.",
  "notes": "Fuente: figura 10, p.144, del artículo publicado de Navas y del Jesus (2025). Ejemplo identificado como Alcántara. La diapositiva principal muestra el apoyo a decisiones de la figura 11; este anexo conserva la ficha de aportaciones. No inventar valores a partir de la imagen.",
    speechCues: ["porcentajes de cambio","factores multiplicativos","Alcántara","RCP4.5","RCP8.5","cuantil 25","variable","horizonte","ausencia de cambio"]
},
{
  "id": 15.5,
  "block": "Bloque climático-estadístico",
  "blockColor": "#0ea5e9",
  "sectionLabel": "Análisis climático",
  "title": "Cambio climático: corregir el sesgo antes de propagar escenarios",
  "subtitle": "Referencia observada, histórico del modelo y proyección futura",
  "estimatedMinutes": 1,
  "type": "figure",
  "figure": "esq_metodo_sesgo.svg",
  "figurePosition": "full",
  "figureCaption": "Síntesis de la memoria doctoral, §5.5, pp. 65–66. La corrección se documenta por variable, modelo, escenario y horizonte.",
  "script": "Para incorporar cambio climático necesitamos tres entradas: observaciones, histórico del modelo y proyección futura. El período histórico común permite caracterizar diferencias sistemáticas. El método delta aplica cambios mensuales; el mapeo cuantil corrige la distribución. QDM y SDM permiten tratar la señal de cambio según el método elegido.\n\nEn las tres cajas superiores, las observaciones y el histórico del modelo deben compararse durante un período común. La proyección futura aporta el escenario que queremos transformar. En el método delta, la temperatura puede tratarse con cambios aditivos y la precipitación con factores multiplicativos. El mapeo cuantil trabaja sobre las distribuciones; sus variantes cambian cómo trasladan la señal futura. Por eso hay que declarar la opción utilizada. La caja de salida conserva la referencia, el modelo, el método y el horizonte. La franja inferior recuerda las comprobaciones: ajustar una media no garantiza representar correctamente la frecuencia de lluvia ni sus extremos.\n\nLa salida es un escenario corregido y documentado, que podrá alimentar la generación o los modelos físicos. Comprobamos medias, frecuencia de precipitación y extremos según la variable. Corregir sesgos no elimina la incertidumbre climática ni garantiza reproducir cualquier extremo local.",
  "notes": "Fuente: memoria §5.5, pp. 65–66. Delta aditivo para temperatura y multiplicativo para precipitación; EQM empírico; QDM multiplicativo; SDM paramétrico gamma/normal. Preservación de la señal depende de método y variable, no atribuirla por igual a todos. Conservar referencia, período histórico común, modelo, escenario, horizonte y configuración. Comprobar calidad de referencia, extrapolación y resultados físicos; no presentar una variante universal ni una validación automática fuera de muestra.",
  "speakerGoal": "Explicar qué se compara, qué se corrige y qué incertidumbre permanece.",
  "visualGuide": [
    "Tres entradas: referencia, control y futuro",
    "Métodos: delta o corrección de distribuciones",
    "Escenarios corregidos y controles"
  ],
  "speechCues": ["tres entradas","período histórico común","diferencias sistemáticas","delta","mapeo cuantil","QDM y SDM","escenario corregido y documentado","Comprobamos","no elimina","observaciones y el histórico del modelo"],
  "transitionCue": "escenarios corregidos",
  "transition": "Con esos escenarios corregidos podemos generar realizaciones sintéticas coherentes."
},
{
  "id": 17.5,
  "block": "Bloque de modelización",
  "blockColor": "#0ea5e9",
  "sectionLabel": "Propagación del impacto",
  "title": "Del ensemble a los mapas de período de retorno",
  "subtitle": "Seleccionar, simular, reconstruir y comprobar antes de estimar frecuencia",
  "estimatedMinutes": 1,
  "type": "figure",
  "figure": "esq_metodo_impacto.svg",
  "figurePosition": "full",
  "figureCaption": "Síntesis de la memoria doctoral, §5.6–5.6.1, pp. 66–68. N escenarios generados; n seleccionados para simulación física.",
  "script": "Simular físicamente todos los escenarios puede resultar costoso. El esquema separa N escenarios de un subconjunto n: MaxDiss selecciona realizaciones que cubren su variabilidad. Ejecutamos esas realizaciones y k-NN reconstruye los mapas restantes a partir de escenarios similares.\n\nLa primera caja contiene el ensemble completo N, con sus descriptores y su frecuencia de ocurrencia. MaxDiss escoge un subconjunto que cubre el espacio considerado; esa selección no convierte a todos los representantes en eventos equiprobables. La caja central recoge las n simulaciones físicas, y k-NN utiliza escenarios próximos para reconstruir respuestas no simuladas. La validación del panel inferior izquierdo reserva mapas conocidos y los compara con sus reconstrucciones. El panel derecho reúne después los impactos para estimar frecuencia por celda. Así se mantienen separadas dos preguntas: cuánto error introduce reconstruir un mapa y qué frecuencia corresponde al calado obtenido.\n\nValidamos excluyendo simulaciones conocidas y comparando sus mapas reconstruidos con los físicos: error de calado, acierto de extensión y cuantiles altos. Si la cobertura es insuficiente, ampliamos o revisamos la selección. Finalmente estimamos la frecuencia del calado en cada celda, conservando la duración representada o los pesos de ocurrencia. Esa frecuencia corresponde al impacto.",
  "notes": "Fuente: memoria §5.6–5.6.1, pp. 66–68. MaxDiss cubre el espacio de descriptores; su selección no asigna probabilidad ni garantiza representatividad hidráulica por sí sola. k-NN interpola mapas usando vecinos y pesos; exige validación cruzada por aplicación. Métricas: RMSE/sesgo de calado, CSI y sobre/infrapredicción de extensión, error en cuantiles altos. Conservar la frecuencia del ensemble completo; no asignar el mismo peso a cada representante MaxDiss por defecto. Estimar T sobre máximos/ocurrencias de impacto según el diseño temporal y los supuestos del estudio. La validación de reconstrucción contra el motor no equivale a validación contra observaciones.",
  "speakerGoal": "Mostrar cómo el ensemble se transforma en frecuencia del impacto y cómo se comprueba la reconstrucción.",
  "visualGuide": [
    "N escenarios → MaxDiss → n simulaciones",
    "Mapas físicos → k-NN → ensemble de impactos",
    "Validación cruzada y frecuencia por celda"
  ],
  "speechCues": ["N escenarios","subconjunto n","MaxDiss","k-NN","Validamos excluyendo","error de calado","acierto de extensión","cuantiles altos","ampliamos o revisamos","frecuencia del calado","pesos de ocurrencia","impacto","ensemble completo N","n simulaciones físicas"],
  "transitionCue": "herramientas web",
  "transition": "Las herramientas web permiten acceder a operaciones de esta cadena."
},
{
  "id": 28.1,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "sectionLabel": "Besaya · Documentación aérea",
  "type": "figure",
  "estimatedMinutes": 2,
  "title": "Besaya: dónde se tomaron las fotografías del terreno",
  "subtitle": "Mapa general, sectores A/B y correspondencia con las fotografías",
  "figure": "besaya_uav_localizacion_auditorio.svg",
  "figurePosition": "full",
  "figureCaption": "Composición apaisada de los tres mapas de S8. El original completo, con las orientaciones, se conserva en el anexo.",
  "caseReference": "Fuente: material suplementario del manuscrito de rugosidades del Besaya, enviado a Environmental Modelling & Software; figura S8.",
  "script": "Antes de comparar los motores, sitúo la documentación del terreno que acompaña al artículo de rugosidades. El mapa general de la izquierda representa el tramo del Besaya en Los Corrales de Buelna. La flecha indica el norte y la barra inferior permite reconocer la escala del dominio.\n\nLos puntos azules identifican las fotografías del sector A, en la parte norte, alrededor del puente y del trazado curvo del cauce. Los naranjas corresponden al sector B, situado más al sur junto a la zona edificada. Los dos paneles de la derecha amplían esos sectores y conservan los mismos identificadores. La leyenda central mantiene la correspondencia entre los colores y cada sector.\n\nCada número enlaza una posición del mapa con una fotografía de la lámina siguiente. La figura S8 completa, disponible en el anexo, añade la orientación de la cámara para cada toma. Esa información permite comprender por qué fotografías obtenidas desde lugares próximos muestran perspectivas distintas. En esta composición nos centramos en localizar los dos sectores y relacionar sus identificadores con las fotografías.\n\nEsta documentación ayuda a reconocer la geometría visible del corredor y la distribución de vegetación, superficies abiertas e infraestructura. Es un apoyo para interpretar la heterogeneidad del dominio, no una medición directa del coeficiente de Manning. Con esa localización, podemos leer ahora las fotografías y relacionarlas con el territorio que representan.",
  "notes": "Composición apaisada de los tres mapas originales de S8, sin retocar sus píxeles. Se mantienen identificadores, norte y escalas. S8 completa, con las orientaciones, se conserva en el anexo 20. Sectores A y B según la leyenda original; identificadores correspondientes a S9. No atribuir dirección de flujo a los azimuts de cámara, ni fecha de campaña, calados de avenida o valores de Manning a partir de estas imágenes.",
  "speakerGoal": "Relacionar posición, identificador y orientación con las fotografías del terreno.",
  "visualGuide": ["Izquierda: mapa general, norte y escala","Centro: detalle y leyenda del sector A","Derecha: detalle del sector B","Identificadores: correspondencia con S9; S8 completa en el anexo"],
  "speechCues": ["documentación del terreno","mapa general","norte","puntos azules","sector A","naranjas","sector B","leyenda central","Cada número","figura S8 completa","orientación de la cámara","heterogeneidad","coeficiente de Manning"],
  "transition": "Veamos las fotografías asociadas a esos puntos para reconocer las superficies y el entorno del cauce.",
  "transitionCue": "fotografías asociadas"
},
{
  "id": 28.2,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "sectionLabel": "Besaya · Fotografías del terreno",
  "type": "figure",
  "estimatedMinutes": 2,
  "title": "Besaya: heterogeneidad del cauce y de sus márgenes",
  "subtitle": "Lámina S9 · vistas aéreas del cauce y sus márgenes",
  "figure": "besaya_figS9_uav_photos.jpg",
  "figurePosition": "full",
  "figureCaption": "Figura suplementaria S9: cada fotografía conserva el identificador de posición y orientación del mapa S8.",
  "caseReference": "Fuente: material suplementario del manuscrito de rugosidades del Besaya, enviado a Environmental Modelling & Software; figura S9.",
  "script": "La lámina reúne las fotografías aéreas del artículo. Los números de cada imagen permiten volver a su posición y orientación en el mapa anterior. Son distintas vistas del terreno utilizado como dominio del estudio.\n\nEn las imágenes del entorno del puente se reconocen el cauce, sus curvas, superficies expuestas, franjas de vegetación ribereña y la relación con la infraestructura. Otras perspectivas muestran prados y espacios abiertos junto al corredor fluvial. Las fotografías del sector B amplían la lectura hacia el tramo meridional y su proximidad a zonas edificadas. Las tomas oblicuas ayudan a reconocer relaciones espaciales que una vista exclusivamente cenital puede hacer menos evidentes.\n\nEsa diversidad importa al interpretar la rugosidad: representar todo el dominio mediante un único valor oculta diferencias entre superficies y coberturas. En el estudio se exploran distribuciones de Manning para nueve clases de uso del suelo y se propagan sus combinaciones mediante los motores hidráulicos. Las fotografías ilustran el contexto físico de esa heterogeneidad; por sí solas no determinan un valor numérico del coeficiente.\n\nTampoco son fotografías de una avenida con niveles medidos, por lo que no las utilizamos aquí para afirmar cuál motor reproduce mejor una crecida observada. Su función es documentar el dominio y apoyar la interpretación del experimento. A continuación veremos qué cambia en los calados y las áreas al ejecutar las mismas realizaciones con HEC-RAS y SFINCS.",
  "notes": "Original aportado por el autor: figS9_uav_photos.jpg, sin recortes ni alteración. Mantener la relación de números con S8. Describir coberturas visibles sin atribuir fechas, tipos granulométricos medidos, valores de Manning o niveles de avenida no documentados. Nueve clases de uso del suelo: configuración del ensemble del estudio, no clasificación inferida automáticamente a partir de estas fotografías. La vista de estudio permite ampliar el original.",
  "speakerGoal": "Reconocer la heterogeneidad física y situar qué aportan las imágenes al estudio de Manning.",
  "visualGuide": [
    "Identificadores: correspondencia con S8",
    "Entorno del puente y curvas del cauce",
    "Vegetación ribereña, superficies expuestas y espacios abiertos",
    "Tramo del sector B y relación con zonas edificadas"
  ],
  "speechCues": [
    "fotografías aéreas",
    "números",
    "posición y orientación",

    "vegetación ribereña",
    "prados y espacios abiertos",
    "rugosidad",
    "nueve clases de uso del suelo",
    "Manning",
    "contexto físico",
    "no determinan",
    "HEC-RAS y SFINCS"
  ],
  "transition": "Con el terreno situado, comparemos las 995 realizaciones emparejadas de los dos motores.",
  "transitionCue": "995 realizaciones emparejadas"
},
{
  "id": 63,
  "backup": true,
  "block": "Casos de estudio",
  "blockColor": "#f59e0b",
  "sectionLabel": "Besaya · Original S8",
  "type": "figure",
  "estimatedMinutes": 2,
  "title": "Anexo: posiciones y orientaciones completas de las fotografías UAV",
  "subtitle": "Figura S8 original del material suplementario de rugosidades",
  "figure": "besaya_figS8_uav_map_orientation.jpg",
  "figurePosition": "full",
  "figureCaption": "Original S8: mapa general, sectores A/B y dirección de la cámara por fotografía.",
  "caseReference": "Fuente: material suplementario aportado por el autor del manuscrito de rugosidades del Besaya, figura S8.",
  "script": "Esta es la figura S8 completa que respalda la composición de la presentación principal. A la izquierda aparece la vista general del tramo y a la derecha, los detalles de los sectores A y B. Los puntos azules y naranjas sitúan las tomas, conservando el identificador de cada fotografía de S9. La flecha norte y las barras de escala permiten interpretar la orientación y el tamaño de las zonas representadas.\n\nLa franja inferior contiene una referencia por fotografía. Cada círculo está orientado con el norte hacia arriba y su flecha indica el azimut de la cámara. Para relacionar una vista oblicua con el mapa buscamos primero su número, localizamos el punto y revisamos hacia dónde miraba la cámara. Estas flechas describen la toma fotográfica; no son vectores hidráulicos.\n\nEl original permite revisar la correspondencia espacial sin alterar la imagen del artículo. Documenta posiciones y perspectivas del terreno. Para contrastar una simulación de crecida se necesitarían además observaciones hidráulicas apropiadas y sus condiciones de adquisición.",
  "notes": "Original S8 copiado sin alteración. Puede ampliarse desde la vista de estudio. La diapositiva principal recompone únicamente los tres paneles cartográficos, manteniendo sus píxeles, identificadores, escalas y norte. La orientación de cámara se consulta en esta figura completa.",
  "speakerGoal": "Relacionar punto, número y azimut de cámara en el original del artículo.",
  "visualGuide": [
    "Mapa general y escala",
    "Sectores A/B e identificadores",
    "Fila inferior: norte y azimut por toma"
  ],
  "speechCues": [
    "figura S8 completa",
    "sectores A y B",
    "puntos azules y naranjas",
    "identificador",
    "norte",
    "barras de escala",
    "franja inferior",
    "azimut de la cámara",
    "no son vectores hidráulicos",
    "observaciones hidráulicas"
  ]
}
];

// Deliberate narrative order; supporting material remains available in the appendices.
const presentationOrder = [1, 4, 44, 4.5, 2, 3, 5.5, 6, 8, 7, 8.5, 4.6, 9, 46, 10, 11, 12, 12.6, 13, 14, 15, 15.5, 16, 17, 17.5, 5, 18, 19, 27, 29, 28.1, 28.2, 28, 30, 31, 32, 33, 34, 35, 36, 39, 38, 37, 39.5, 39.6, 39.7, 40, 41, 42, 42.5, 43];
const appendixOrder = [20, 21, 22, 23, 24, 25, 26, 56, 57, 58, 59, 60, 61, 45, 8.6, 47, 48, 55, 62, 63];
const presentationRank = (slide: Slide) => presentationOrder.indexOf(slide.id);

// One pacing estimate feeds the deck, presenter and rehearsal guide.
function pacingMinutes(slide: Slide, transition = slide.transition ?? ''): number {
  const spokenWords = (text: string) => (text + ' ' + transition).trim().split(/\s+/).length;
  const words = Math.max(spokenWords(slide.script), spokenWords(slide.offlineScript ?? slide.script));
  // Voice at 115 words/min, ~5 s per change, ~7 s to read a figure,
  // plus the GEV demo and explicitly timed orientation/result visits; rehearse to measure reality.
  return Math.round((words / 115 + 0.08 + (slide.figure ? 0.12 : 0) + (slide.webMode === 'demo' ? 1.2 : slide.id === 5 ? 0.8 : slide.id === 32 ? 0.5 : slide.id === 34 ? 0.35 : 0)) * 10) / 10;
}

// Each transition states why the next slide is needed in this exact order.
const spokenBridges = new Map<number, { nextId: number; text: string }>([
  [28.1,{nextId:28.2,text:"Veamos las fotografías asociadas a esos puntos para reconocer las superficies y el entorno del cauce."}],
  [28.2,{nextId:28,text:"Con el terreno situado, comparemos las 995 realizaciones emparejadas de los dos motores."}],
  [15.5, {nextId:16, text:"Con esos escenarios corregidos podemos generar realizaciones sintéticas coherentes."}],
  [17.5, {nextId:5, text:"Con los cuatro módulos y su conexión ya explicados, entremos por primera vez en HYDRA para reconocerlos en la web."}],
  [
    1,
    {
      "nextId": 4,
      "text": "Presentaré el problema, los desarrollos y sus evidencias siguiendo esta estructura."
    }
  ],
  [
    4,
    {
      "nextId": 44,
      "text": "Comenzaré por las consecuencias que necesitamos estimar para decidir ante una inundación."
    }
  ],
  [
    44,
    {
      "nextId": 4.5,
      "text": "La respuesta depende también de unas condiciones que pueden cambiar."
    }
  ],
  [
    4.5,
    {
      "nextId": 2,
      "text": "Ante esas condiciones, el título concreta el alcance de la investigación."
    }
  ],
  [
    2,
    {
      "nextId": 3,
      "text": "El Besaya aporta un antecedente científico para comprender este planteamiento."
    }
  ],
  [
    3,
    {
      "nextId": 5.5,
      "text": "Para situar aquella dificultad, veamos cómo se estima habitualmente una inundación."
    }
  ],
  [
    5.5,
    {
      "nextId": 6,
      "text": "La siguiente figura muestra cómo una misma lluvia admite respuestas diferentes."
    }
  ],
  [
    6,
    {
      "nextId": 8,
      "text": "Esa variabilidad de la respuesta conduce a la pregunta doctoral."
    }
  ],
  [
    8,
    {
      "nextId": 7,
      "text": "La pregunta se desarrolla en las tres hipótesis de la memoria."
    }
  ],
  [
    7,
    {
      "nextId": 8.5,
      "text": "Para contrastarlas, el trabajo se organiza mediante los siguientes objetivos."
    }
  ],
  [
    8.5,
    {
      "nextId": 4.6,
      "text": "Estos requisitos permiten presentar cómo se materializa la respuesta tecnológica."
    }
  ],
  [
    4.6,
    {
      "nextId": 9,
      "text": "Estas necesidades fueron apareciendo a lo largo del recorrido investigador."
    }
  ],
  [
    9,
    {
      "nextId": 46,
      "text": "Ese recorrido permite precisar qué necesita una cadena estocástica completa."
    }
  ],
  [
    46,
    {
      "nextId": 10,
      "text": "Podemos ahora comparar esas necesidades con la cobertura de otros marcos."
    }
  ],
  [
    10,
    {
      "nextId": 11,
      "text": "La arquitectura de HYDRA organiza las responsabilidades para cubrir esa combinación."
    }
  ],
  [
    11,
    {
      "nextId": 12,
      "text": "Veamos cómo se conserva y despliega ese entorno de cálculo."
    }
  ],
  [
    12,
    {
      "nextId": 12.6,
      "text": "Veamos los cuatro módulos funcionales y cómo organizan el cálculo científico."
    }
  ],
  [
    5,
    {
      "nextId": 18,
      "text": "Una vez situados en la plataforma, veamos cómo se utilizan sus herramientas interactivas."
    }
  ],
  [
    12.6,
    {
      "nextId": 13,
      "text": "Comenzaré por el bloque de datos y sus fuentes."
    }
  ],
  [
    13,
    {
      "nextId": 14,
      "text": "Una vez revisadas las series, podemos estudiar la frecuencia de sus extremos."
    }
  ],
  [
    14,
    {
      "nextId": 15,
      "text": "Las cópulas añaden la dependencia entre variables a sus distribuciones individuales."
    }
  ],
  [
    15,
    {
      "nextId": 15.5,
      "text": "Antes de generar escenarios futuros, debemos tratar el sesgo de las proyecciones climáticas."
    }
  ],
  [
    16,
    {
      "nextId": 17,
      "text": "Los modelos físicos transforman después esos escenarios en caudales y calados."
    }
  ],
  [
    17,
    {
      "nextId": 17.5,
      "text": "Veamos cómo obtener impactos para el ensemble completo sin simularlo íntegramente."
    }
  ],
  [
    18,
    {
      "nextId": 19,
      "text": "Voy a mostrar ese recorrido en la herramienta de extremos."
    }
  ],
  [
    19,
    {
      "nextId": 27,
      "text": "Pasamos de la operación individual a las evidencias de los casos."
    }
  ],
  [
    27,
    {
      "nextId": 29,
      "text": "El Besaya establece el primer principio: estimar la frecuencia sobre el impacto."
    }
  ],
  [
    29,
    {
      "nextId": 28.1,
      "text": "El estudio de rugosidades documenta el terreno del mismo dominio con fotografías aéreas."
    }
  ],
  [
    28,
    {
      "nextId": 30,
      "text": "En Mallorca, la dificultad comienza antes: disponer de entradas con pocos datos."
    }
  ],
  [
    30,
    {
      "nextId": 31,
      "text": "Calle 30 añade la exigencia de calcular muchos escenarios para una infraestructura."
    }
  ],
  [
    31,
    {
      "nextId": 32,
      "text": "Abrimos Análisis interactivo para interpretar el resultado de esa cadena."
    }
  ],
  [
    32,
    {
      "nextId": 33,
      "text": "Valencia muestra ahora la sensibilidad del análisis al incorporar un extremo excepcional."
    }
  ],
  [
    33,
    {
      "nextId": 34,
      "text": "La ficha web permite seguir esas estimaciones hasta los materiales del análisis."
    }
  ],
  [
    34,
    {
      "nextId": 35,
      "text": "En Tanganica, esa trazabilidad acompaña otra variable de diseño: el nivel del lago."
    }
  ],
  [
    35,
    {
      "nextId": 36,
      "text": "La aplicación andina amplía el problema a la ejecución hidrológica regional."
    }
  ],
  [
    36,
    {
      "nextId": 39,
      "text": "El estudio de IAHR permite comparar dos procedimientos de cálculo del diseño."
    }
  ],
  [
    39,
    {
      "nextId": 38,
      "text": "SIMPCCe traslada el análisis climático e hidrológico a la gestión de embalses."
    }
  ],
  [
    38,
    {
      "nextId": 37,
      "text": "Panamá extiende la preparación trazable de escenarios a escala nacional."
    }
  ],
  [
    37,
    {
      "nextId": 39.5,
      "text": "Podemos reunir ahora las aplicaciones para valorar el alcance de su transferencia."
    }
  ],
  [
    39.5,
    {
      "nextId": 39.6,
      "text": "La producción científica muestra cómo se comunican y conservan esos desarrollos."
    }
  ],
  [
    39.6,
    {
      "nextId": 39.7,
      "text": "En estos trabajos compartidos, corresponde precisar cuál ha sido mi contribución."
    }
  ],
  [
    39.7,
    {
      "nextId": 40,
      "text": "Con esas responsabilidades delimitadas, vuelvo a las hipótesis y sus evidencias."
    }
  ],
  [
    40,
    {
      "nextId": 41,
      "text": "Ese balance permite sintetizar la contribución original de la tesis."
    }
  ],
  [
    41,
    {
      "nextId": 42,
      "text": "Sus límites permiten identificar qué comprobaciones y desarrollos deben seguir."
    }
  ],
  [
    42,
    {
      "nextId": 42.5,
      "text": "Quiero agradecer a quienes han hecho posible este trabajo."
    }
  ],
  [
    42.5,
    {
      "nextId": 43,
      "text": "Termino recuperando la idea central que resume la investigación."
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
