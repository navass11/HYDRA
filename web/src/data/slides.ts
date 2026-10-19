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
    script: "Buenos días, señor presidente y miembros del tribunal. Buenos días a mi director, a mi tutor, a los compañeros, familiares y amigos que nos acompañan. Muchas gracias a todos por su presencia.\n\nMi nombre es Salvador Navas Fernández y presento ante este tribunal la tesis doctoral titulada «Desarrollo de un modelo automático de inundación estocástica», realizada en IHCantabria, en el Programa de Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos de la Universidad de Cantabria, y presentada con Mención Industrial. El trabajo ha sido dirigido por el doctor Manuel del Jesus Peñil y tutorizado por el doctor César Álvarez Díaz.\n\nEsta investigación parte de una necesidad de ingeniería: estimar las consecuencias de una inundación cuando tanto los datos de partida como las condiciones futuras son inciertos. Para tomar una decisión no basta con conocer cuánto puede llover; necesitamos relacionar esa lluvia con la respuesta de la cuenca y con los calados o la extensión que puede alcanzar el agua.\n\nA lo largo de la exposición explicaré cómo se ha abordado esa conexión mediante una cadena de cálculo reproducible, qué desarrollos aporta la tesis y qué evidencias ofrecen sus aplicaciones. También señalaré las limitaciones que deben acompañar la interpretación de los resultados.",
    notes: "Saludar y hacer una pausa antes de plantear el problema. Los nombres completos y la Mención Industrial permanecen en portada.",
    bullets: [
      'Salvador Navas Fernández',
      'Dr. Manuel del Jesus Peñil',
      'Dr. César Álvarez Díaz',
    ],
    speakerGoal: "Plantear la defensa como respuesta a un problema de ingeniería.",
    visualGuide: ["Título de la tesis","Autor, director y tutor"],
    speechCues: ["señor presidente y miembros del tribunal","Salvador Navas Fernández","Desarrollo de un modelo automático de inundación estocástica","Mención Industrial","Manuel del Jesus Peñil","César Álvarez Díaz","necesidad de ingeniería","cadena de cálculo reproducible","evidencias","limitaciones"],
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
    script: "He organizado la defensa en los seis bloques que aparecen en esta diapositiva. Comenzaré con la introducción: la motivación del trabajo, la pregunta de investigación y las hipótesis y objetivos que lo han orientado.\n\nA continuación situaré la propuesta frente al estado de la técnica. Esto permitirá explicar por qué resulta necesario conectar métodos que ya existen y qué responsabilidad asume la arquitectura desarrollada. Después presentaré esa arquitectura y recorreré los principales componentes metodológicos, desde la preparación de los datos hasta la obtención de resultados hidráulicos.\n\nLa segunda parte de la exposición estará dedicada a los casos de estudio. Los utilizaré para responder a preguntas concretas sobre la frecuencia del impacto, la sensibilidad a los datos y modelos y la transferencia a distintos problemas de ingeniería. Finalmente, volveré a las hipótesis para presentar las conclusiones, delimitar mi contribución y exponer las principales líneas de continuidad.",
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
    speechCues: ["seis bloques","pregunta de investigación","hipótesis y objetivos","estado de la técnica","arquitectura","componentes metodológicos","casos de estudio","conclusiones"],
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
    script: "Las cuatro palabras del título delimitan el alcance de la investigación. Con «modelo» me refiero a una arquitectura de cálculo que conecta métodos y motores físicos existentes. «Automático» significa que la preparación, la ejecución y el tratamiento de resultados pueden organizarse mediante operaciones repetibles.\n\n«Inundación» sitúa el resultado en la respuesta física: por ejemplo, el calado o la extensión alcanzada. Finalmente, «estocástica» indica que consideramos múltiples realizaciones plausibles para estudiar su frecuencia y su variabilidad.\n\nPara reproducir ese análisis hay que conservar los datos, la configuración, las versiones y las salidas. La automatización facilita ese trabajo, mientras que la justificación de las hipótesis continúa siendo responsabilidad del investigador.",
    processSteps:['Entradas trazables','Escenarios plausibles','Modelos físicos','Frecuencia del impacto'],
    notes: 'Cita literal (cap. 1, primer párrafo, antes de la sección de antecedentes): "En esta memoria, el modelo automático de inundación estocástica que recoge el título se entiende en sentido amplio: no como un único motor hidráulico o algoritmo aislado, sino como una arquitectura reproducible de cálculo. Su núcleo central es pyhydra, la librería Python donde se implementan los módulos científicos y técnicos; HYDRA designa la plataforma que integra ese núcleo con web, notebooks, Docker y servicios de apoyo. [...] Es la automatización de esa cadena completa, y no de un componente particular, lo que constituye el objeto central de la investigación. [...] el término reproducible se emplea en un sentido operativo [...] que se concreta en cuatro contratos verificables: entradas trazables, transformaciones reproducibles, salidas en formatos estándar y registro suficiente para auditar cada resultado."\n\nDeliberadamente NO se explica aquí el nombre HYDRA en detalle — solo se menciona que existe una plataforma con nombre propio. En la siguiente diapositiva se explica el origen del trabajo en el TFM. La metáfora del nombre HYDRA puede comentarse al presentar el producto, una vez explicada la arquitectura.',
    bullets: [
      'Modelo: arquitectura completa de cálculo, no un nuevo motor hidráulico.',
      'Automático: ejecución repetible de tareas que manualmente son lentas y frágiles.',
      'Inundación: frecuencia estimada sobre calado y extensión, no heredada directamente de la lluvia.',
      'Estocástica: cientos o miles de combinaciones plausibles de forzamientos, estados y parámetros.',
    ],
    backup: false,
    speakerGoal: "Delimitar qué significa el título y evitar que se interprete como un nuevo solver hidráulico.",
    visualGuide: ["Modelo y automatización","Inundación y escenarios estocásticos","Contratos de reproducibilidad"],
    speechCues: ["arquitectura de cálculo","operaciones repetibles","respuesta física","múltiples realizaciones plausibles","reproducir","justificación de las hipótesis"],
    transitionCue: "trabajo del Besaya"
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
    script: "Las tres condiciones de esta diapositiva explican por qué esa estimación debe considerar situaciones cambiantes. Cuando aumenta la ocupación de las zonas inundables, crece la exposición de personas e infraestructuras. La urbanización modifica la infiltración y la rapidez con la que responde la cuenca. A su vez, el cambio climático obliga a examinar condiciones que pueden diferir de las históricas.\n\nLa combinación de estos factores hace necesario comparar escenarios y expresar qué incertidumbre acompaña a sus resultados. Para una decisión de diseño interesa conocer tanto la magnitud del impacto como su sensibilidad a esas condiciones. Este es el contexto en el que se plantea el trabajo.",
    notes: 'Abrir el problema a escala social antes de hablar de software. La imagen es conceptual y no corresponde a un evento concreto; las evidencias cuantitativas y geográficas aparecerán después en los casos de estudio. Conectar con la siguiente idea: si el riesgo exige múltiples escenarios, el flujo manual deja de ser viable.',
    bullets: ["Exposición: personas e infraestructuras situadas en zonas inundables.","Urbanización: cambios en infiltración y respuesta hidrológica.","Cambio climático: escenarios distintos de las condiciones históricas."],
    backup: false,
    speakerGoal: "Explicar los cambios que motivan el trabajo, después de situar sus consecuencias.",
    visualGuide: ["Exposición","Urbanización","Condiciones climáticas cambiantes"],
    speechCues: ["situaciones cambiantes","exposición","urbanización","cambio climático","comparar escenarios","sensibilidad"],
    transitionCue: "alcance de la investigación"
  },

  {
    id: 4.6,
    block: 'Motivación', blockColor: '#8b5cf6',
    title: "Qué aporta la propuesta",
    subtitle: 'De metodologías avanzadas pero fragmentadas a una capacidad de ingeniería reproducible',
    estimatedMinutes: 2,
    type: 'normal',
    script: "La figura resume el valor que persiguen esos objetivos. La integración conecta las etapas desde los datos hasta el impacto, de manera que sus resultados puedan utilizarse en la siguiente operación. La reproducibilidad exige conservar la información necesaria para repetir y revisar el cálculo. La transferencia permite reutilizar los componentes cuando cambian el dominio, los datos o la finalidad del estudio.\n\nEstas tres ideas sirven como criterios para evaluar el trabajo. A continuación presentaré cómo surgieron los desarrollos y cómo se organizan. Más adelante, los casos permitirán identificar qué se ha conseguido y cuáles son las condiciones y los límites de esa reutilización.",
    notes: 'Esta diapositiva anticipa la respuesta a “¿qué aporta realmente la tesis?” y se recupera al final. No enumerar librerías. Explicar los tres pilares con una frase y un ejemplo: integración — Calle 30; reproducibilidad — Besaya/Valencia; transferencia — Panamá y SIMPCCe.\n\nOrden: esta diapositiva se presenta después de la pregunta y los objetivos, como anticipo de la respuesta; así la aportación no aparece antes de haber planteado el problema.',
    bullets: [
      'Integración: una sola cadena desde el dato hasta el impacto.',
      'Reproducibilidad: resultados auditables por terceros.',
      'Transferencia: el mismo núcleo aplicado a problemas de escala y finalidad distintas.',
    ],
    backup: false,
    speakerGoal: "Anticipar los tres compromisos de la propuesta; su balance con evidencia se reserva para el cierre.",
    visualGuide: ["Integración de extremo a extremo","Registro para repetir el cálculo","Transferencia a otros problemas"],
    speechCues: ["integración","reproducibilidad","transferencia","criterios para evaluar","condiciones y los límites"],
    transitionCue: "recorrido investigador"
  },

  {
    id: 3,
    block: 'Apertura', blockColor: '#0d9488',
    title: "Besaya: del primer caso al problema doctoral",
    subtitle: 'Besaya 2017–2018: del primer desarrollo metodológico a una línea de investigación',
    estimatedMinutes: 2,
    type: 'timeline',
    script: "El origen de esta investigación está en mi Trabajo Fin de Máster sobre el Besaya, realizado en 2017. Allí conecté la descripción de las avenidas, la generación de escenarios y la simulación con Iber para estudiar sus impactos. El trabajo recibió el premio nacional del Colegio de Caminos en la categoría de Mejor Calidad y Contenido.\n\nLa publicación de 2018 consolidó una idea que recorre esta defensa: calcular la frecuencia a partir de la respuesta hidráulica. Sin embargo, preparar y repetir la cadena requería numerosos intercambios manuales. Esa dificultad dio lugar al problema doctoral: cómo conservar el procedimiento científico y trasladarlo a otros estudios sin reconstruir sus conexiones en cada ocasión.",
    notes: "Origen: TFM de 2017, publicación ROP 3598 de mayo de 2018. La cadena y los resultados del caso se desarrollan después en validación.",
    bullets: ["2017 — Primera cadena estocástica completa en el TFM del Besaya.","2018 — Publicación del principio T(forzamiento) ≠ T(impacto).","Límite — Conexiones manuales y configuración específica para una cuenca.","Tesis — Repetir y transferir la cadena conservando su trazabilidad."],
    speakerGoal: "Explicar el origen del problema doctoral sin repetir todavía los resultados del caso.",
    visualGuide: ["2017: primera cadena del TFM","2018: publicación del principio","Limitación manual y pregunta doctoral"],
    speechCues: ["Trabajo Fin de Máster","2017","Iber","2018","respuesta hidráulica","problema doctoral","otros estudios"],
    transition: "La pregunta dejó de ser cómo resolver una cuenca y pasó a ser cómo hacer reutilizable la cadena completa.",
    transitionCue: "estima habitualmente"
  },

  {
    id: 5,
    offlineFrames: [{"src": "offline_hydra_home.png", "label": "Plataforma", "caption": "Portada local de HYDRA: acceso a módulos, herramientas y notebooks."}],
    block: 'Arquitectura', blockColor: '#0891b2',
    title: "Primera visita a HYDRA: del núcleo al navegador",
    subtitle: 'Núcleo científico, plataforma web y entorno reproducible',
    estimatedMinutes: 1,
    url: '/', anchor: "body", highlight: "",
    webMode: 'evidence',
    webLabel: "Primera navegación · Plataforma HYDRA",
    webPurpose: "Situar al tribunal en la web y reconocer sus accesos antes de explicar los módulos.",
    webAction: "Entrar por primera vez en la portada. Mostrar los accesos a módulos, herramientas y casos/notebooks sin ejecutar todavía una herramienta. Volver al relato al pasar de diapositiva.",
    figure: 'fig_hydra_web_home.png', figurePosition: 'right',
    figureCaption: 'HYDRA integra documentación, herramientas y casos reproducibles',
    type: 'split',
    script: "Entramos ahora por primera vez en HYDRA. Esta portada será nuestro punto de referencia para las visitas a la web durante la defensa. Desde aquí podemos localizar la documentación de los módulos, las herramientas interactivas y los casos de estudio con sus notebooks.\n\nConviene distinguir los dos nombres: pyhydra es la librería que realiza el cálculo; HYDRA reúne las formas de acceder a ese trabajo y documentarlo. También podemos ejecutar el análisis directamente desde Python o desde un notebook.\n\nEn esta primera visita quiero situar esos accesos. Volveremos a ellos para realizar una operación e interpretar resultados concretos, después de explicar cómo se organiza el núcleo científico.",
    notes: "Primera visita necesaria. Navegación de orientación, distinta de la demostración GEV y de las páginas de resultados. No saltarla. Evitar recorrer menús o ejecutar cálculos todavía. No dejar recuadros de resaltado sobre la portada.",
    bullets: [
      'Núcleo científico: concentra los métodos de datos, clima y modelización.',
      'Plataforma web: permite explorar documentación, herramientas y casos.',
      'Ejecución reproducible: reúne API, notebooks y servicios en un entorno controlado.',
      'Distribución abierta: código versionado y software archivado con DOI.',
    ],
    backup: false,
    anchorPosition: "start",
    offlineScript: "La captura muestra la portada de HYDRA, que constituye nuestra primera entrada en la plataforma. En ella se localizan la documentación de los módulos, las herramientas interactivas y los casos de estudio con sus notebooks.\n\nConviene distinguir los dos nombres: pyhydra es la librería que realiza el cálculo; HYDRA reúne las formas de acceder a ese trabajo y documentarlo. El análisis también puede ejecutarse desde Python o desde un notebook.\n\nEn este recorrido utilizo capturas preparadas para conservar la explicación sin conexión. Esta primera vista nos sitúa en la plataforma. Las siguientes permitirán explicar una operación y los resultados de los casos, después de recorrer el núcleo científico.",
    speakerGoal: "Conservar una primera entrada explícita en HYDRA y orientar al tribunal antes de mostrar operaciones concretas.",
    visualGuide: ["Portada y navegación principal","Módulos, herramientas y casos/notebooks","Diferencia entre pyhydra y HYDRA"],
    speechCues: ["primera vez en HYDRA","documentación de los módulos","herramientas interactivas","casos de estudio","pyhydra","núcleo científico"],
    offlineSpeechCues: ["portada de HYDRA","primera entrada","pyhydra","HYDRA","capturas preparadas","núcleo científico"],
    transitionCue: "tres bloques"
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
    script: "Sigamos el esquema de izquierda a derecha. Partimos de los registros, ajustamos una distribución de extremos y elegimos un evento de diseño. Los modelos hidrológicos e hidráulicos transforman después esa entrada en caudal, calado y extensión.\n\nLas decisiones señaladas debajo afectan a la interpretación: suponer estacionariedad, seleccionar un evento y atribuir su período de retorno al impacto. Cada una necesita una justificación. Un período de retorno de cien años expresa una probabilidad anual de superación del uno por ciento para una variable y unas condiciones determinadas. Por tanto, debemos comprobar qué ocurre con esa frecuencia cuando el evento atraviesa un sistema cuya respuesta depende también de otras condiciones.",
    notes: "El período de retorno se refiere a una variable y a hipótesis especificadas. En condiciones estacionarias, T100 corresponde a una probabilidad anual de superación de 0,01.",
    speakerGoal: "Separar la cadena física válida de los supuestos de asignación de frecuencia.",
    visualGuide: ["Fila superior, de registros a impacto","Tres supuestos en los recuadros inferiores"],
    speechCues: ["izquierda a derecha","evento de diseño","estacionariedad","período de retorno","uno por ciento","respuesta"],
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
    script: "En las dos filas de esta figura se aplica la misma lluvia, con un período de retorno de cien años. En la situación superior, el suelo seco permite que el agua permanezca dentro del cauce. En la inferior, el suelo saturado y la crecida del afluente favorecen el desbordamiento.\n\nLo que cambia es la respuesta del sistema, aunque hayamos mantenido la lluvia. El dibujo no permite asignar por sí solo una frecuencia al segundo impacto. Para estimarla necesitamos considerar la frecuencia de las distintas combinaciones y simular sus consecuencias. Esa es la razón de distinguir el período de retorno del forzamiento del período de retorno del calado que finalmente interesa para el diseño.",
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
    speechCues: ["misma lluvia","suelo seco","suelo saturado","respuesta del sistema","distintas combinaciones","período de retorno del calado"],
    transition: "Esta dificultad apareció de forma concreta en el trabajo con el que comenzó la investigación: el Besaya.",
    transitionCue: "pregunta doctoral"
  },

  {
    id: 7,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "Hipótesis: qué debe demostrar la propuesta",
    type: 'quote',
    quote: "Una arquitectura modular y reproducible permite integrar las metodologías disponibles y transferir el análisis a proyectos reales.",
    estimatedMinutes: 2,
    script: "El esquema compara dos formas de trabajar: arriba, componentes cuyas conexiones se reconstruyen para cada proyecto; abajo, una cadena integrada desde los datos hasta el impacto. Sobre esa diferencia se apoyan las tres hipótesis de la memoria.\n\nLa primera plantea que la automatización mejora la eficiencia, la reproducibilidad y la aplicación práctica. La segunda propone que una integración modular reduce las barreras técnicas y facilita incorporar clima e incertidumbre. La tercera plantea que un flujo coordinado y reproducible permite representar la incertidumbre de forma más consistente que un único escenario de diseño.\n\nLas aplicaciones aportarán evidencias para valorar estas hipótesis. En las conclusiones distinguiré también las comprobaciones que siguen pendientes.",
    notes: "H1 incluye eficiencia y reproducibilidad: hay evidencia de ejecución viable, pero falta medir el ahorro sistemático frente al trabajo manual. H2 y H3 se cierran con alcance limitado por los casos.",
    bullets: ["H1 · Automatización: eficiencia, reproducibilidad y aplicación práctica.","H2 · Integración modular: reducir barreras técnicas e incorporar clima e incertidumbre.","H3 · Flujo reproducible: representar incertidumbre con mayor consistencia que un escenario único."],
    speakerGoal: "Formular una pregunta y tres hipótesis que luego se puedan cerrar con evidencia.",
    visualGuide: ["Fila superior: métodos fragmentados","Fila inferior: arquitectura conectada","H1, H2 y H3"],
    speechCues: ["tres hipótesis","primera","segunda","tercera","evidencias","comprobaciones que siguen pendientes"],
    transition: "Para contrastar esas hipótesis necesitamos concretar qué se va a desarrollar y qué resultado verificará cada objetivo.",
    transitionCue: "objetivos",
    subtitle: "¿Puede una cadena reproducible transferirse a problemas reales bajo incertidumbre?"
  },

  {
    id: 8,
    block: 'Motivación', blockColor: '#3b82f6',
    title: "La pregunta de investigación",
    type: 'quote',
    quote: "¿Es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería?",
    estimatedMinutes: 2,
    script: "La pregunta de investigación es la siguiente: ¿Es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería?\n\nLa figura de la derecha permite descomponerla. Necesitamos tratar datos inciertos, conectar los métodos con los modelos físicos y conservar un procedimiento que pueda repetirse. Además, esa conexión tiene que resultar utilizable en aplicaciones reales. La dificultad científica y operativa está en mantener la coherencia del análisis entre etapas y al cambiar de problema.",
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
    speechCues: ["pregunta de investigación","automatizar de forma reproducible","incertidumbre hidrológica y climática","aplicaciones reales","coherencia del análisis"],
    transitionCue: "tres hipótesis"
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
    script: "El objetivo general consiste en desarrollar y validar pyhydra como núcleo modular del análisis probabilístico de inundaciones y demostrar su transferencia mediante HYDRA. La tabla relaciona cada objetivo específico con su desarrollo y su evidencia.\n\nEl primero integra datos y modelos climáticos en los flujos estocásticos. El segundo implementa y conecta la generación de eventos de precipitación y caudal. El tercero automatiza la configuración, la ejecución y el postprocesado de los modelos hidrológicos e hidráulicos. El cuarto consolida y documenta el núcleo y su despliegue, y los valida mediante casos reproducibles.\n\nEsta correspondencia permitirá valorar después qué parte del problema responde cada desarrollo y qué evidencia lo respalda.",
    notes: "Leer una fila objetivo–desarrollo–evidencia completa y recorrer las otras tres. Conservar estos cuatro criterios hasta el cierre.",
    bullets: ["Objetivo general: desarrollar y validar pyhydra y demostrar su transferencia mediante HYDRA.","OE1–OE2: integrar datos y modelos climáticos, y generar eventos de precipitación y caudal.","OE3–OE4: automatizar los modelos físicos; documentar y validar pyhydra e HYDRA mediante casos reproducibles."],
    speakerGoal: "Relacionar cada objetivo con una evidencia que aparecerá en la defensa.",
    visualGuide: ["Leer una fila completa: objetivo, desarrollo y evidencia","Recorrer los cuatro objetivos"],
    speechCues: ["objetivo general","pyhydra","HYDRA","primero","segundo","tercero","cuarto","qué evidencia lo respalda"],
    transition: "El primer paso para cumplirlos es entender qué exige una cadena estocástica completa y qué ofrecen los métodos existentes.",
    transitionCue: "tres aportaciones"
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
    script: "La cronología muestra cómo fue ampliándose el problema inicial. En 2017 y 2018, el Besaya permitió formular y publicar la estimación de frecuencia sobre el impacto. Los trabajos posteriores incorporaron otras dificultades: cuencas con pocos datos, calibración en grandes dominios y generación de escenarios con coherencia espacial y temporal.\n\nLas aplicaciones industriales y los episodios extremos añadieron exigencias de ejecución, contraste y documentación. Esa experiencia converge en 2026 en la arquitectura y las versiones de software de la tesis. La secuencia ayuda a entender por qué conviven aquí métodos y escalas diferentes: cada desarrollo responde a una necesidad concreta que después se ha tratado de convertir en un componente reutilizable.",
    notes: 'Explicar una evolución científica, no una sucesión de congresos o lugares. El primer hito es el TFM del doctorando. La comunicación de las V JIA es una vía de difusión del trabajo, no el origen conceptual por sí sola.',
    bullets: ["2017–2018 — Besaya: cadena estocástica y frecuencia sobre el impacto.","2019–2020 — Pocos datos y grandes dominios: reconstrucción y calibración regional.","2021–2023 — Generación de escenarios con estructura espacial y temporal.","2024–2025 — Transferencia industrial, eventos extremos y contraste de modelos.","2026 — Integración, documentación y distribución versionada."],
    backup: false,
    speakerGoal: "Mostrar la evolución del problema científico sin volver a explicar cada caso.",
    visualGuide: ["Besaya como origen","Nuevas exigencias de datos y escenarios","Síntesis en la arquitectura"],
    speechCues: ["cronología","frecuencia sobre el impacto","pocos datos","coherencia espacial y temporal","2026","componente reutilizable"],
    transitionCue: "cadena estocástica completa"
  },

  {
    id: 10,
    block: 'Estado del arte', blockColor: '#6366f1',
    title: 'Posicionamiento frente a los marcos integrados más próximos',
    subtitle: 'Cobertura funcional comparada en el capítulo 2 de la memoria',
    estimatedMinutes: 2,
    type: 'normal',
    script: "La matriz permite situar la propuesta frente a los marcos revisados en la memoria. Compara su cobertura de las capacidades indicadas mediante marcas completas o parciales. CLIMADA aborda riesgo climático; RainyDay genera tormentas por transposición; wflow y HydroMT facilitan la preparación de modelos. Los enfoques de simulación continua pueden alcanzar el impacto, con implementaciones vinculadas a determinados dominios.\n\nLa comparación identifica la combinación que aborda HYDRA: datos heterogéneos, extremos, dependencia, escenarios y motores físicos dentro de un flujo reutilizable que calcule la frecuencia del impacto. Esa cobertura conjunta delimita la propuesta. La elección de una herramienta para un estudio concreto depende también de sus requisitos y del ámbito de aplicación.",
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
    speechCues: ["matriz","CLIMADA","RainyDay","wflow y HydroMT","cobertura conjunta","frecuencia del impacto"],
    transition: "Para cubrir esa combinación, separé el cálculo científico de su ejecución y de su acceso desde la web.",
    transitionCue: "arquitectura de HYDRA"
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
    script: "Voy a leer la arquitectura desde su base. En el nivel científico, pyhydra reúne los métodos como una librería de Python. El nivel de servicios permite ejecutarlos: la API atiende las peticiones de las herramientas y JupyterLab ofrece un entorno para repetir análisis mediante notebooks. Arriba encontramos la web, la documentación y los casos.\n\nLa separación de responsabilidades permite utilizar el mismo núcleo desde un programa, un notebook o una interfaz visual. Los contenedores representados en el contorno conservan las dependencias del entorno. Esta organización hace posible desarrollar y revisar el método sin que su implementación dependa de una única forma de acceso.",
    notes: "La figura representa responsabilidades funcionales. pyhydra calcula; API y notebooks lo ejecutan; la web facilita el acceso. Datos, configuración y licencias siguen siendo requisitos de reproducción.",
    bullets: ["pyhydra: métodos científicos reutilizables.","API y notebooks: dos accesos al mismo cálculo.","Web: documentación, herramientas y casos."],
    speakerGoal: "Explicar quién calcula, quién ejecuta y cómo accede el usuario.",
    visualGuide: ["Núcleo inferior pyhydra","Servicios intermedios API y JupyterLab","Interfaz superior y contenedor exterior"],
    speechCues: ["desde su base","nivel científico","nivel de servicios","mismo núcleo","contenedores","separación de responsabilidades"],
    transition: "Dentro de ese núcleo, los métodos se ordenan según las tres responsabilidades de la cadena.",
    transitionCue: "entorno de cálculo"
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
    script: "Este esquema muestra cómo se lleva la arquitectura a un entorno utilizable. La web proporciona el acceso, la API recibe las operaciones dirigidas al núcleo y el servicio de notebooks permite desarrollar y repetir los análisis. Los contenedores recogen las dependencias de cada servicio para facilitar su ejecución en otro equipo.\n\nLa reproducibilidad exige además conservar los datos, la configuración y las versiones de los motores utilizados. El contenedor resuelve una parte de ese requisito, pero el estudio necesita documentar todo su contexto. En la transferencia industrial, entregar una aplicación incluye explicar cómo ejecutarla, qué necesita y qué condiciones deben mantenerse para poder revisar sus resultados.",
    notes: 'Señalar las partes de la figura de infraestructura. Destacar el volumen compartido de datos `/data` (montado desde Azure Files en producción) que permite a Jupyter y a la API leer las mismas series sin duplicados. Cada usuario recibe una sesión de notebooks aislada mediante una cookie anónima (hydra_jupyter_session), copiando los notebooks a una carpeta de sesión propia — así nadie edita el catálogo compartido.',
    backup: false,
    speakerGoal: "Distinguir la arquitectura lógica de las condiciones reales para desplegarla y repetir un análisis.",
    visualGuide: ["Web, API y notebooks","Entorno de ejecución en contenedores","Datos, configuración y motores externos"],
    speechCues: ["web","API","notebooks","dependencias","reproducibilidad","documentar todo su contexto","transferencia industrial"],
    transitionCue: "primera vez"
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
    script: "Las tres columnas muestran la organización de los catorce submódulos. El bloque de datos contiene cuatro, dedicados a lluvia, caudal, cambio climático y suelos. El bloque climático y estadístico agrupa cinco responsabilidades: extremos, análisis espacial, generación, corrección de sesgo y downscaling. Los otros cinco se ocupan de la modelización y su sensibilidad.\n\nLas rutas de la figura permiten localizar esos componentes en el código. Cada estudio utiliza los que necesita: puede terminar en un análisis de extremos o continuar hasta la simulación hidráulica. Así se conserva una organización común y se puede adaptar el recorrido a la pregunta del caso, como veremos en las aplicaciones.",
    notes: "4 submódulos de datos, 5 de clima/estadística y 5 de modelización. Relacionar las columnas con las operaciones siguientes; las rutas pequeñas son localizadores de código.",
    speakerGoal: "Dar un mapa funcional del núcleo sin recitar rutas de código.",
    visualGuide: ["Columna de datos","Columna de clima y estadística","Columna de modelización"],
    speechCues: ["catorce submódulos","bloque de datos","climático y estadístico","modelización","localizar","pregunta del caso"],
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
    script: "El primer problema aparece en las fuentes de datos, situadas a la izquierda. Estaciones, reanálisis, satélites, información de ríos y suelos y proyecciones climáticas tienen accesos, unidades y resoluciones diferentes.\n\nLos adaptadores centrales permiten adquirir y organizar esas entradas para producir las estructuras comunes de tiempo, espacio y variable que aparecen a la derecha. Cuando corresponde, se unifican referencias como UTC y WGS84. Los metadatos permiten conservar la procedencia y las condiciones de la consulta.\n\nEsta homogeneización facilita conectar el cálculo y repetirlo. La revisión experta de la calidad, la cobertura y la representatividad sigue siendo necesaria para decidir si una fuente resulta adecuada para el problema.",
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
    speechCues: ["fuentes de datos","adaptadores","estructuras comunes","UTC y WGS84","procedencia","calidad"],
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
    script: "En esta figura, el eje horizontal representa el período de retorno, en escala logarítmica, y el vertical la precipitación máxima anual. Los puntos corresponden a la muestra. Las curvas ilustran máxima verosimilitud, L-momentos y una aproximación bayesiana; la referencia punteada se conoce porque el ejemplo es ilustrativo.\n\nPara leerla fijamos un período de retorno y comparamos las alturas y sus bandas. La separación aumenta al extrapolar, donde disponemos de menos información. Esa lectura debe acompañar cualquier valor de diseño.\n\nLa figura explica el papel del estimador y de la incertidumbre. En la demostración identificaré el ajuste puntual y el procedimiento de sus bandas, porque ambos necesitan interpretarse por separado.",
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
    speechCues: ["período de retorno","muestra","ejemplo es ilustrativo","alturas y sus bandas","extrapolar","ajuste puntual"],
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
    script: "La figura representa el caudal en el eje horizontal y el nivel del mar en el vertical. Los puntos negros son pares observados y los grises son pares generados; los bordes muestran las distribuciones individuales. La cópula permite describir la dependencia que une esas dos variables.\n\nLas curvas rojas corresponden al criterio AND, que exige superar ambos umbrales. Las azules corresponden a OR, donde basta superar uno. Por eso expresan sucesos distintos. Las cruces MPDE identifican combinaciones de máxima densidad sobre las curvas de diseño.\n\nUna misma curva contiene muchas parejas posibles. Para seleccionar las relevantes debemos justificar la dependencia, las colas y la respuesta física que queremos estudiar.",
    notes: "Q está en m³/s y SL en metros. AND: ambos umbrales; OR: al menos uno. Las cruces MPDE localizan máxima densidad sobre una isolínea: no equivalen automáticamente a máxima respuesta hidráulica.",
    bullets: [
      'Familias: gaussiana para pico, duración y volumen; Gumbel, Clayton y Frank para eventos compuestos.',
      'T_OR: al menos una variable supera el umbral (diseño conservador).',
      'T_AND: superación simultánea (crítica en confluencias fluviales).',
      'Evento de diseño más probable: máximo de la densidad conjunta sobre la isolínea del período de retorno (Salvadori y De Michele).',
    ],
    speakerGoal: "Relacionar dependencia, AND/OR y evento de diseño con la figura.",
    visualGuide: ["Ejes Q y SL y puntos observados","Distribuciones marginales en los bordes","Curvas AND/OR y cruces de máxima densidad"],
    speechCues: ["dependencia","AND","ambos umbrales","OR","sucesos distintos","muchas parejas posibles","respuesta física"],
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
    script: "La generación estocástica produce realizaciones plausibles que después podemos introducir en los modelos. Para utilizarlas debemos comprobar qué propiedades conservan. La captura compara la media, la desviación estándar y la autocorrelación de primer retardo entre la entrada y la simulación.\n\nAquí la entrada es sintética: «observado» es la etiqueta de esta demostración. El tercer gráfico recuerda que reproducir la media resulta insuficiente si cambia la persistencia. Esta demo rápida debe distinguirse de las capacidades de la librería: CoSMoS combina distribución marginal y autocorrelación, mientras NSRP y STNSRP representan precipitación espacial.\n\nLos diagnósticos justifican el uso de las realizaciones bajo sus hipótesis; no convierten las series en predicciones exactas.",
    notes: "Captura de una demo sintética: la entrada etiquetada «observado» también es sintética. La herramienta calibra con CoSMoS y utiliza una simulación rápida AR(1) estacional con transformación marginal. Los diagnósticos deben revisarse antes de usar el ensemble.",
    bullets: [
      'NSRP / STNSRP: lluvia puntual y multisitio calibrada con media, varianza, probabilidad de día seco y autocorrelación.',
      'CoSMoS: reproduce a la vez la distribución marginal y la autocorrelación estacional.',
      'MaxDiss: selecciona un subconjunto de escenarios que cubre todo el rango del ensemble.',
      'k-NN y clasificación de hidrogramas: reconstruyen los impactos de los escenarios no simulados.',
    ],
    speakerGoal: "Explicar generación y diagnóstico usando la captura correcta.",
    visualGuide: ["Tres gráficos: media, dispersión y autocorrelación","Barras de la serie de entrada y línea simulada","Condición previa a usar las realizaciones"],
    speechCues: ["realizaciones plausibles","media","desviación estándar","autocorrelación","entrada es sintética","CoSMoS","NSRP y STNSRP","diagnósticos"],
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
    script: "El esquema muestra el trabajo de un adaptador. Primero recibe los escenarios y prepara los archivos que necesita el motor. Después ejecuta el programa, registra su versión y el resultado del proceso, y convierte las salidas a estructuras comunes para revisarlas.\n\nA la derecha aparecen modelos hidrológicos, como HEC-HMS y SWAT, e hidráulicos, como HEC-RAS y SFINCS. Este contrato permite conectar motores diferentes conservando los componentes estadísticos.\n\nEn los trabajos iniciales Iber se utilizó manualmente, por lo que la automatización tiene distinto alcance según el caso. La elección del motor, la geometría y las condiciones de contorno exige una justificación física que acompaña a la organización del cálculo.",
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
    speechCues: ["adaptador","prepara","ejecuta","estructuras comunes","HEC-HMS","HEC-RAS y SFINCS","Iber","justificación física"],
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
    script: "El esquema sigue una petición desde la interfaz hasta el resultado. El usuario introduce datos y parámetros; la API recibe la operación, la dirige a pyhydra y devuelve las salidas y las figuras. La herramienta visual utiliza así el mismo núcleo que puede emplearse desde un notebook.\n\nLos ejemplos incluyen extremos, dependencia, interpolación y curvas IDF. Su utilidad consiste en facilitar el acceso a una operación manteniendo identificable el método que se ejecuta. En la demostración recorreré una de ellas para distinguir los datos de entrada, la selección de eventos, el ajuste y la incertidumbre. Ese recorrido permite interpretar el resultado antes de utilizarlo como información de diseño.",
    notes: "Esta diapositiva explica el acceso al método; la siguiente demuestra su operación. Tiempo de demo previsto: aproximadamente 90 segundos adicionales a la explicación.",
    bullets: [
      'Simulación estocástica CoSMoS en 3 pasos',
      'Estimación de GEV bayesiana y curvas de retorno',
      'Cópulas compuestas y curvas AND/OR en confluencias',
      'Una demostración principal; el resto, preparado como material de reserva para preguntas',
    ],
    speakerGoal: "Distinguir acceso interactivo y núcleo científico antes de la demo.",
    visualGuide: ["Herramientas en la parte superior","API y núcleo compartido","Ruta de una petición"],
    speechCues: ["petición","datos y parámetros","API","mismo núcleo","método","datos de entrada","ajuste y la incertidumbre"],
    transition: "En esa demostración distinguiremos la serie que entra al cálculo, el estimador puntual y el origen de la incertidumbre mostrada.",
    transitionCue: "herramienta de extremos"
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
    script: "Estamos en la herramienta de extremos. La serie de demostración es sintética y debe distinguirse de los datos de Turís que veremos después. Primero reviso la entrada y la selección: el umbral permite identificar eventos, mientras que la GEV se ajusta a máximos anuales.\n\nEjecuto ahora el cálculo. La curva puntual corresponde al máximo de la posterior, MAP. Las bandas se aproximan mediante Fisher; no proceden de cadenas MCMC. En el gráfico, el período de retorno está en horizontal y la precipitación en vertical.\n\nPara leer un período de diseño debemos considerar conjuntamente curva y banda. Esta lectura conjunta permite reconocer cuánto respaldo ofrece la muestra al valor que usaríamos en el diseño.",
    notes: "En vivo: revisar entrada → ejecutar → leer curva y banda. En capturas: alternar Datos y ajuste → Resultado e incertidumbre. La serie es sintética. La GEV usa máximos anuales; las bandas Fisher alrededor de MLE no son una posterior MCMC.",
    bullets: ["Serie demo sintética o CSV identificado.","Extracción de eventos por umbral; GEV sobre máximos anuales.","Ajuste puntual MAP y bandas aproximadas mediante Fisher.","Respaldo local: figura del notebook de Valencia, con método y procedencia."],
    speakerGoal: "Guiar una demo breve y explicar exactamente lo que calcula.",
    visualGuide: ["Entrada sintética y selección del análisis","Máximos anuales usados por la GEV","MAP y banda aproximada mediante Fisher"],
    speechCues: ["serie de demostración es sintética","máximos anuales","MAP","Fisher","curva y banda","cambio de datos y métodos"],
    transition: "La demo muestra que el método puede ejecutarse. Los casos permiten valorar qué conocimiento y qué capacidad operativa aporta.",
    transitionCue: "evidencias de los casos",
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
    script: "Esta tabla es el mapa de las nueve aplicaciones que presentaré. Las columnas indican los componentes utilizados y la última diferencia su disponibilidad: Besaya, Calle 30 y Valencia cuentan hoy con notebooks reproducibles en HYDRA; los otros seis casos se documentan mediante publicaciones y proyectos.\n\nEl recorrido aborda tres cuestiones. La primera es cómo estimar la frecuencia del impacto y cómo influye el modelo. La segunda es cuánto condicionan el diseño los datos y el procedimiento. La tercera es qué componentes pueden transferirse entre escalas y finalidades.\n\nCada caso aporta una evidencia concreta. Esta distinción permite interpretar el conjunto sin atribuir a todas las aplicaciones el mismo alcance de reproducción actual.",
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
    speechCues: ["nueve aplicaciones","Besaya, Calle 30 y Valencia","tres cuestiones","frecuencia del impacto","datos y el procedimiento","transferirse","evidencia concreta"],
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
    script: "Este segundo trabajo sobre el Besaya examina la sensibilidad al motor hidráulico. Arriba vemos 995 pares de realizaciones, con SFINCS en horizontal y HEC-RAS en vertical. La diagonal representa igualdad. Las correlaciones de 0,52 en calado y 0,49 en área muestran diferencias entre sus respuestas.\n\nAbajo, las distribuciones permiten interpretar esas diferencias. HEC-RAS presenta dos regímenes de área, vinculados a la activación de un compartimento secundario de 7,4 hectáreas y un collado a cota 60,1 metros.\n\nSon 1.990 ejecuciones variando Manning. La comparación caracteriza sensibilidad e incertidumbre estructural; para determinar qué motor reproduce mejor la realidad necesitamos además contraste observacional.",
    notes: "995 pares = 1.990 ejecuciones. Explicar primero diagonal 1:1 y después distribuciones. La bifurcación topográfica tiene un anexo propio. Diferencia entre motores y validación frente a observaciones son preguntas diferentes.",
    bullets: [
      'Enfoque Monte Carlo: 995 simulaciones hidráulicas emparejadas sobre 9 usos de suelo (Manning).',
      'Incertidumbre: Variabilidad inter-modelo (motores) > Variabilidad intra-modelo (rugosidad, <2% de la varianza).',
      'Bifurcación: un collado a cota 60,1 m s.n.m. controla la conexión con una llanura secundaria de unas 7,4 ha.',
      'Respuesta bimodal: HEC-RAS muestra saltos discretos (sesgo +0,172 m, r=0,52) no capturados por SFINCS.',
    ],
    speakerGoal: "Leer las diferencias entre motores en los cuatro paneles.",
    visualGuide: ["Paneles superiores: pares SFINCS/HEC-RAS y diagonal 1:1","Paneles inferiores: distribuciones de calado y área","Regímenes asociados a la topografía"],
    speechCues: ["995 pares","diagonal","0,52","0,49","dos regímenes","1.990 ejecuciones","incertidumbre estructural","contraste observacional"],
    transition: "En Mallorca cambia la dificultad de partida: disponer de muy pocos datos hidrológicos para construir y contrastar la cadena.",
    transitionCue: "pocos datos"
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
    script: "En el esquema del Besaya seguimos el agua desde los aforos hasta el resultado hidráulico. Primero se extraen avenidas independientes y se describen mediante pico, volumen y duración. Una cópula gaussiana permite conservar su dependencia al generar nuevos hidrogramas plausibles.\n\nDespués, Iber transforma esos hidrogramas en calados y extensión. El último bloque reúne las respuestas y estima su frecuencia. Por tanto, el período de retorno del calado se obtiene después de simular el comportamiento del sistema.\n\nEste trabajo de 2018 precede a pyhydra y establece el fundamento científico del desarrollo posterior. La tesis recoge la necesidad de repetir esas operaciones y conectarlas de una forma trazable y transferible.",
    notes: "El TFM y el artículo preceden a la arquitectura actual. La frecuencia de calado/extensión se estima después de la simulación hidráulica.",
    bullets: [
      'Los datos de partida son caudales observados, no precipitación.',
      'La dependencia conjunta se modela entre caudal pico, volumen y duración.',
      'Iber fue el motor de la publicación fundacional de 2018.',
      'El estudio HEC-RAS/SFINCS pertenece a una etapa posterior de sensibilidad sobre el mismo dominio.',
    ],
    speakerGoal: "Mostrar dónde se calcula la frecuencia dentro de la cadena fundacional.",
    visualGuide: ["Aforos y descripción multivariante","Hidrogramas generados y simulación con Iber","Distribución del impacto al final"],
    speechCues: ["aforos","pico, volumen y duración","cópula gaussiana","Iber","después de simular","2018","fundamento científico"],
    transition: "Una cadena reproducible permite comparar sus componentes; en el Besaya la comparación se hizo entre dos motores hidráulicos.",
    transitionCue: "cambiar de motor"
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
    script: "Los mapas comparan el procedimiento clásico, a la izquierda, con el estocástico, a la derecha, en Sant Llorenç. Los colores representan calados y permiten reconocer que las diferencias varían según la localización.\n\nLa dificultad de partida era una cuenca sin aforos. Tras el episodio de octubre de 2018, la precipitación se reconstruyó combinando hietogramas, dependencia entre estaciones y kriging. Esa entrada se transformó mediante una malla hidrológica de 25 metros e Iber, con una malla hidráulica de 8 metros basada en LiDAR.\n\nLa extensión se contrastó con Copernicus. El máximo de 5,85 metros es simulado. El caso muestra por qué la incertidumbre de la lluvia espacial debe acompañar a la interpretación hidráulica.",
    notes: "Panel izquierdo: procedimiento clásico; derecho: estocástico. Copernicus aporta referencia de extensión. 5,85 m es un máximo modelado, no una medición observada.",
    bullets: [
      'Sin aforo: contraste cualitativo con la mancha Copernicus y con marcas documentadas del episodio.',
      'Clasificación PCA + k-means: 25 formas representativas de hietograma histórico.',
      'Cópula gaussiana: acopla máximo, media, duración y tipo de tormenta entre pluviómetros.',
      'Doble malla: hidrología a 25 m, hidráulica a 8 m (LiDAR, Iber); calado máximo simulado de 5,85 m.',
    ],
    speakerGoal: "Explicar qué compara el mapa y qué validación permite el caso.",
    visualGuide: ["Izquierda: procedimiento clásico; derecha: enfoque estocástico","Calado y extensión en la trama urbana","Alcance del contraste con Copernicus"],
    speechCues: ["procedimiento clásico","estocástico","sin aforos","precipitación se reconstruyó","25 metros","8 metros","5,85 metros es simulado","lluvia espacial"],
    transition: "La siguiente aplicación añade una exigencia operativa: hacer viable esa cadena en una infraestructura crítica.",
    transitionCue: "Calle 30"
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
    script: "En Calle 30, la cadena debe hacer viable el cálculo de muchos escenarios para una infraestructura crítica. Sigamos las dos selecciones del esquema. Primero se generan lluvias multisitio mediante extremos y cópulas; la selección inicial se transforma en hidrogramas con HEC-HMS.\n\nDespués, MaxDiss selecciona entre esos hidrogramas los casos que se ejecutan en HEC-RAS 1D. A partir de sus resultados, k-NN reconstruye los impactos de los escenarios restantes. El último bloque calcula la frecuencia del calado.\n\nCada operación tiene así una función definida dentro del conjunto. La aplicación, vinculada a FORESEE y Ferrovial, traslada la cadena estocástica a una necesidad industrial y prepara los resultados que vamos a interpretar en la web.",
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
    speechCues: ["dos selecciones","HEC-HMS","Después, MaxDiss","HEC-RAS 1D","k-NN","frecuencia del calado","necesidad industrial"],
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
    script: "Estamos en el apartado Análisis interactivo. Comienzo por la gráfica del Puente de Toledo: el eje horizontal representa el período de retorno y el vertical, el calado. Para comparar los procedimientos fijamos el mismo período y leemos las dos curvas. El cursor permite consultar valores y la leyenda aislar las series.\n\nEl perfil de la derecha añade la posición a lo largo del tramo para períodos de cien y quinientos años. Así podemos examinar en qué secciones aparecen las diferencias.\n\nLas gráficas responden a una pregunta de diseño concreta: qué calado considerar en un lugar y con qué frecuencia. Son la interpretación localizada de toda la cadena que acabamos de recorrer.",
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
    speechCues: ["Análisis interactivo","Puente de Toledo","mismo período","cursor","perfil","cien y quinientos años","qué calado","interpretación localizada"],
    transition: "Hasta aquí hemos propagado escenarios por modelos físicos. Valencia plantea otra dificultad: que un solo dato extremo cambie el ajuste de entrada.",
    transitionCue: "extremo excepcional",
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
    script: "En Valencia examinamos la sensibilidad de una estimación al incorporar un episodio extraordinario. Las barras comparan el mismo cuantil de precipitación T100 en Turís: el ajuste bayesiano pasa de 260 a 952 milímetros al incluir la DANA, un incremento del 266 por ciento.\n\nConviene separar ese cuantil de la observación: el 29 de octubre de 2024 se registraron 710,8 milímetros en 24 horas. El período de retorno asignado a ese episodio, incluyendo el dato, se sitúa entre 66 y 91 años según el estimador.\n\nEl caso muestra cuánto puede influir un extremo en una serie corta. Repetir el análisis permite revisar esa sensibilidad y sus bandas antes de interpretar la cifra de diseño.",
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
    speechCues: ["mismo cuantil","260 a 952","266 por ciento","observación","710,8","66 y 91 años","serie corta","sensibilidad y sus bandas"],
    transition: "Tanganica conserva la necesidad de estimar extremos con pocos datos, pero cambia la variable de diseño: de precipitación a nivel del lago.",
    transitionCue: "materiales del análisis"
  },

  {

    id: 34,
    offlineFrames: [{"src": "offline_valencia_web.png", "label": "Resultados", "caption": "Ficha de Valencia: cifras publicadas y acceso a los notebooks del caso."}],
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "Valencia en HYDRA: del resultado al notebook",
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
    script: "La ficha de Valencia permite conectar las cifras de la diapositiva con el procedimiento de análisis. En la cabecera reconocemos la precipitación del episodio y los resultados que acabamos de comparar. La página reúne también los estimadores y el acceso al notebook del estudio regional.\n\nEsta visita muestra qué significa la trazabilidad para quien consulta un resultado: identificar la serie, revisar la preparación de los datos y examinar las decisiones del cálculo. El notebook permite seguir ese recorrido y estudiar las diferencias entre métodos.\n\nDe esta forma, el resultado presentado queda relacionado con unos materiales que pueden revisarse, siempre que se disponga de los datos y del entorno necesarios para repetir el análisis.",
    notes: "Este es un segundo momento de evidencia web con función distinta de la visita inicial a HYDRA: trazabilidad del caso Valencia. Mostrar el acceso al notebook sin ejecutarlo durante la defensa.",
    bullets: ["La ficha reúne resultados, métodos y materiales del caso.","El notebook permite revisar datos, preparación y estimadores.","Las diferencias entre métodos deben interpretarse con sus hipótesis."],
    backup: false,
    offlineScript: "La captura corresponde a la ficha de Valencia en HYDRA. En ella reconocemos el episodio de 710,8 milímetros y las cifras que acabamos de analizar, junto con el acceso a los materiales del caso.\n\nEsta vista documenta la conexión entre el resultado presentado y el notebook del estudio regional. Su función es la trazabilidad: identificar la serie, la preparación de datos y las decisiones del cálculo. La captura permite mostrar esa relación; abrir los enlaces y ejecutar el notebook exige disponer del entorno correspondiente.",
    speakerGoal: "Mostrar trazabilidad y acceso al procedimiento, sin repetir la interpretación de las barras de T100.",
    visualGuide: ["Cifras de la ficha","Comparación de estimadores","Acceso al notebook del estudio regional"],
    speechCues: ["ficha de Valencia","procedimiento de análisis","notebook","trazabilidad","decisiones del cálculo","repetir el análisis"],
    offlineSpeechCues: ["captura","710,8 milímetros","trazabilidad","notebook","entorno correspondiente"],
    transitionCue: "nivel del lago"
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
    script: "En Tanganica, la variable de diseño es el nivel del lago y el registro de altimetría de 1992–2023 resulta limitado. La cadena combina caudales estimados mediante ERA5 y AdaBoost con una relación caudal-nivel en tres regímenes. Los cambios futuros incorporan 19 modelos CMIP6 mediante deltas mensuales.\n\nLa figura compara el T100 histórico: 770,19 metros con bootstrap frente a 771,55–771,76 con GEV y Weibull. El incremento futuro superior a 0,9 metros corresponde a T5–T10 en 2041–2060.\n\nEl bootstrap remuestrea residuos de la relación caudal-nivel y genera unos 20.000 años. La diferencia entre métodos debe acompañar a la cota de diseño, porque refleja la sensibilidad de una estimación apoyada en registros cortos.",
    notes: "Primero explicar las dos comparaciones visibles. T100 histórico y cambio climático máximo T5–T10 son magnitudes diferentes. El bootstrap remuestrea residuos de N(Q), no de AdaBoost. La figura de forzamientos y las curvas por horizontes están en los anexos.",
    bullets: [
      'AdaBoost estima caudales mensuales a partir de ERA5; no estima directamente los niveles extremos.',
      'La función N(Q), separada en tres regímenes por K-means, transforma caudal en nivel del lago.',
      'El bootstrap remuestrea residuos de N(Q) y los percentiles de máximos anuales determinan los cambios de nivel.',
      'Las anomalías de cuatro horizontes CMIP6 se aplican sobre los niveles históricos obtenidos con la altimetría Hydroweb 1992-2023.',
    ],
    speakerGoal: "Separar nivel histórico T100, método de cálculo y cambio climático proyectado.",
    visualGuide: ["Comparación histórica T100: bootstrap y GEV/Weibull","Recuadro futuro: cambio máximo para T5–T10","Cadena caudal → nivel → extremos"],
    speechCues: ["nivel del lago","registro","19 modelos CMIP6","T100 histórico","770,19","T5–T10","relación caudal-nivel","diferencia entre métodos"],
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
    script: "Los cuatro paneles representan Colombia, Bolivia, Perú y Ecuador. El eje horizontal recorre los meses y el vertical muestra cambios porcentuales de caudal; la leyenda distingue escenarios y horizontes. En algunos meses de Perú y Ecuador aparecen aumentos superiores al 40 por ciento, mientras otras combinaciones muestran reducciones.\n\nPara obtener esas curvas se procesaron más de 200 subcuencas. Los datos se completan con satélite e interpolación; SPOTPY organiza la calibración y VIC transforma las entradas en caudal. Después se propagan 21 modelos CMIP5.\n\nLa contribución operativa consiste en repetir consistentemente ese ciclo regional. La interpretación debe conservar su carácter de proyección condicionada a los datos, los modelos y los escenarios utilizados.",
    notes: "Los ejes muestran cambio porcentual del caudal mensual, no precipitación. El +40 % corresponde a determinados meses y escenarios de Perú/Ecuador. Automatización de la calibración no elimina la necesidad de validación hidrológica.",
    bullets: [
      'La escala territorial hizo inviable la calibración manual de los modelos hidrológicos.',
      'SPOTPY automatizó la búsqueda de parámetros mediante PSO, DREAM y SCE-UA.',
      'VIC transformó los campos de precipitación y temperatura en caudales para más de 200 subcuencas.',
      'La experiencia se trasladó después a la interfaz de calibración automática de los adaptadores de HYDRA.',
    ],
    speakerGoal: "Leer el cambio estacional en los cuatro países y explicar qué automatización lo hizo posible.",
    visualGuide: ["Cuatro paneles por país","Meses en horizontal y cambio porcentual en vertical","Escenarios y horizontes de la leyenda"],
    speechCues: ["meses","cambios porcentuales","algunos meses","200 subcuencas","SPOTPY","VIC","21 modelos CMIP5","proyección condicionada"],
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
    script: "El mapa de Panamá representa precipitación por subcuencas en milímetros. Es una entrada climática del análisis nacional. El encargo abarca 52 cuencas y 1.464 puntos costeros, con necesidades de organización y trazabilidad a gran escala.\n\nSe completaron 73 estaciones mediante NEOPRENE/STNSRP y se interpolaron campos con kriging universal a un kilómetro. Las 23 configuraciones GCM, dos SSP, tres variables y tres horizontes dan 414 combinaciones climáticas documentadas. Esa cifra no cuenta ejecuciones hidráulicas verificadas.\n\nLa corrección de sesgo prepara las entradas para LEM y SFINCS. La aportación es mantener un procedimiento común para organizar fuentes, configuraciones y resultados cuando el volumen de trabajo exige repetir numerosas operaciones.",
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
    speechCues: ["precipitación","52 cuencas","1.464 puntos costeros","73 estaciones","414 combinaciones climáticas","procedimiento común","numerosas operaciones"],
    transition: "Con los casos revisados, podemos distinguir cómo se ha comunicado la investigación y cuál ha sido mi contribución personal.",
    transitionCue: "alcance de su transferencia"
  },

  {
    id: 38,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: "SIMPCCe: aportaciones a embalses bajo cambio climático",
    subtitle: "Embalse 2 · medias mensuales del conjunto de modelos · 2071–2100",
    estimatedMinutes: 2,
    url: '/cases/simpcce', anchor: '#case-findings-heading', highlight: '#case-findings-heading',
    figure: "fig_simpcce_regimen_mensual.svg", figurePosition: "full",
    figureCaption: "Fuente: Fundación Canal (2022), tabla 25, p. 118.",
    caseReference: "",
    type: "figure",
    results: [
      { value:'60', label:'series corregidas por variable', implication:'10 modelos, 2 RCP y 3 horizontes' },
      { value:'20', label:'realizaciones futuras por punto', implication:'aplicables a la red hídrica nacional' },
      { value:'Premio 2023', label:'Talento Joven “M.R. Llamas”', implication:'Observatorio del Agua de la Fundación Botín; candidatura colectiva por la guía que enmarca SIMPCCe' },
    ],
    pyhydraRole:'Transforma proyecciones climáticas en aportaciones y fichas de decisión para cualquier punto de la red hídrica española.',
    pyhydraModules:['pyhydra.data_sources','pyhydra.climate','SDM','red neuronal'],
    processSteps:['SPAIN02 + SIMPA','PCA 95 %','ANN de aportaciones','SDM climático','Sequía y fiabilidad'],
    script: "Esta figura permite conservar el detalle estacional que perderíamos con una media anual. Utiliza la tabla publicada del Embalse 2 para 2071–2100. A la izquierda están las medias mensuales en hectómetros cúbicos: la referencia histórica en gris, RCP4.5 en verde y RCP8.5 en naranja.\n\nA la derecha se representan sus cambios porcentuales. En julio, RCP8.5 pasa de 0,56 a 0,13 hectómetros cúbicos mensuales, aproximadamente un 77 por ciento menos. El volumen inicial ayuda a interpretar la magnitud de ese cambio relativo.\n\nSon medias del conjunto, sin representar cuantiles ni una envolvente de incertidumbre. SIMPCCe conecta clima, corrección de sesgo y aportaciones para trasladar esta información mensual a la gestión del embalse.",
    notes: "Fuente numérica: guía Fundación Canal (2022), tabla 25, p. 118 (página 119 del PDF). Embalse 2, columnas Hist Mean y RCP4.5/RCP8.5 2071–2100 Mean. El cambio es 100 × (futuro/histórico − 1), calculado con los valores redondeados de la tabla. No identificar esta figura como ampliación de la ficha anterior ni confundir media del conjunto con cuantiles o envolvente intermodelo. La captura original de ejemplo se conserva en los anexos.",
    bullets: [
      'Herramienta nacional aplicable a cualquier punto de la red hidrográfica española (guía metodológica Fundación Canal).',
      'Red neuronal (ANN) sobre componentes principales (95% varianza) de precipitación y temperatura distribuidas.',
      '10 modelos CORDEX-AEMET × RCP4.5/8.5 × 3 horizontes → 60 series corregidas por variable (SDM).',
      'Los caudales mínimos de estiaje caen incluso donde la precipitación media no muestra cambio significativo.',
      'Premio al Talento Joven “M.R. Llamas” 2023: candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave por la guía metodológica que enmarca SIMPCCe.',
    ],
    speakerGoal: "Leer la estacionalidad en una figura vectorial trazable a valores publicados, distinguiendo volumen y cambio relativo.",
    visualGuide: ["Izquierda: medias históricas y futuras, en hm³/mes","Derecha: cambios porcentuales de esas mismas medias","Julio como ejemplo de volumen inicial y reducción relativa"],
    speechCues: ["detalle estacional","Embalse 2","medias mensuales","cambios porcentuales","0,56 a 0,13","77 por ciento menos","medias del conjunto","gestión del embalse"],
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
    script: "Este estudio compara el procedimiento convencional basado en IDF con una cadena estocástica. El mapa muestra diferencias de calado T100 para 2041–2070, RCP4.5, que cambian espacialmente.\n\nLos recuadros incluyen una comparación adicional de caudal T100 en 2011–2040. Para RCP4.5, IDF da 208,8 y el enfoque estocástico 278,5 metros cúbicos por segundo: un 33,4 por ciento más respecto a IDF. Ese porcentaje corresponde al caudal y no se traslada uniformemente al mapa de calados.\n\nEl cálculo utilizó 10.000 años sintéticos y 200 casos seleccionados con MaxDiss para Iber, reconstruyendo el resto mediante k-NN. La diferencia evidencia sensibilidad al procedimiento; demostrar mayor exactitud requiere contrastarla con observaciones.",
    notes: "Fuente contrastada: memoria definitiva, tabla 7.6, p. 114 (página 144 del PDF), y §8.6, p. 130. El ejemplo T100 RCP4.5 2011–2040 es 208,8 → 278,5 m³/s: +33,4 % respecto a IDF; tomando como base el estocástico, IDF es un 25,0 % menor. Las 24 comparaciones de la tabla dan alrededor del 33 % de incremento, sin reconstruir los extremos del rango narrado 30–37 %. Ese rango requiere el artículo original. El mapa corresponde a 2041–2070; no confundir horizontes ni variables.",
    bullets: ["Ejemplo T100 (2011–2040, RCP4.5): 208,8 → 278,5 m³/s, +33,4 % respecto a IDF.","El mapa representa diferencias de calado para 2041–2070.","El porcentaje de un caudal no es un factor corrector uniforme del mapa.","La diferencia entre métodos no prueba por sí sola mayor exactitud."],
    speakerGoal: "Distinguir la comparación espacial de calados de la comparación numérica de caudales.",
    visualGuide: ["Mapa: diferencia de calado en T100, 2041–2070 y RCP4.5","Cifras de caudal como comparación adicional","Diferencia entre métodos y verdad observada"],
    speechCues: ["IDF","diferencias de calado","2041–2070","2011–2040","208,8","278,5","33,4 por ciento","sensibilidad al procedimiento"],
    transition: "La transferencia también debe funcionar cuando la decisión no es protegerse de una avenida, sino gestionar aportaciones escasas.",
    transitionCue: "gestión de embalses"
  },

  {
    id: 39.5,
    block: 'Casos de estudio', blockColor: '#f59e0b',
    title: 'Qué demuestra el conjunto de casos',
    subtitle: 'La modelación estocástica es el hilo que conecta datos, clima, física e impacto',
    estimatedMinutes: 2,
    script: "Este gráfico reúne las aplicaciones para interpretar su alcance conjunto. El eje espacial recorre desde una infraestructura hasta varios países. Los símbolos distinguen las dimensiones abordadas y señalan los tres casos que hoy pueden reproducirse mediante notebooks en HYDRA: Besaya, Calle 30 y Valencia.\n\nLa comparación permite reconocer los bloques que se reutilizan y las adaptaciones que necesita cada problema. Los demás casos conservan sus evidencias en publicaciones y proyectos. Su diversidad documenta la transferencia de componentes entre contextos, con distintos grados de integración y disponibilidad actual.\n\nEse es el alcance de la síntesis: identificar qué capacidad se ha demostrado y dónde debe continuar la consolidación del sistema.",
    notes: 'Esta es la diapositiva de síntesis del bloque. Hacer una pausa antes de presentar la producción científica; después se delimita la autoría y se cierran las hipótesis. No enumerar otra vez los nueve casos: responder a “¿qué aprendemos de todos ellos juntos?”.',
    bullets: [
      'La lluvia de diseño es una entrada; el riesgo se decide con la distribución del impacto.',
      'Cada caso activa herramientas diferentes porque la cadena física y los datos disponibles también son diferentes.',
      'La aportación común es mantener trazabilidad e incertidumbre desde la fuente hasta el resultado de ingeniería.',
    ],
    backup: false,
    speakerGoal: "Sintetizar después de los resultados qué transferencia se ha demostrado y qué disponibilidad tiene cada caso.",
    visualGuide: ["Escala espacial del gráfico","Dimensiones de aplicación","Casos con notebooks actuales y casos documentados"],
    speechCues: ["alcance conjunto","Besaya, Calle 30 y Valencia","bloques que se reutilizan","distintos grados","capacidad se ha demostrado"],
    transitionCue: "producción científica"
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
    script: "La producción científica acompaña el desarrollo y la comunicación de estas aplicaciones. Los recuadros distinguen dos artículos publicados en Ingeniería del Agua, Calle 30 y SIMPCCe; dos manuscritos enviados, sobre Tanganica y rugosidad del Besaya; cinco comunicaciones y dos DOI de software, correspondientes a pyhydra e HYDRA.\n\nEl estado de cada trabajo es relevante: los manuscritos enviados permanecen en evaluación. Las publicaciones y comunicaciones presentan los resultados y sus métodos, mientras el archivo del software permite localizar y citar una versión concreta del desarrollo.\n\nEn conjunto, estos productos conservan distintas partes de la investigación y facilitan su consulta y continuidad, con la responsabilidad específica que explicaré a continuación.",
    notes: "Distinguir artículos publicados, envíos, comunicaciones y DOI. Mantener el estado documental de la versión de la memoria; no anticipar aceptaciones.",
    bullets: [
      'Infraestructura urbana: cadena estocástica completa con transformación lluvia–caudal y modelización 1D.',
      'Gestión de embalses: transferencia de clima, corrección de sesgo y emulación de caudales mínimos.',
      'Eventos y niveles extremos: incertidumbre, datos globales y respuesta ante problemas recientes.',
      'Sensibilidad hidráulica: automatización masiva para revelar incertidumbre entre motores.',
    ],
    speakerGoal: "Distinguir publicación, comunicación, evaluación y software citable.",
    visualGuide: ["Dos artículos publicados","Dos manuscritos enviados y cinco comunicaciones","Dos DOI de software"],
    speechCues: ["producción científica","dos artículos publicados","dos manuscritos enviados","cinco comunicaciones","dos DOI","en evaluación","versión concreta"],
    transition: "La existencia de esos productos no explica por sí sola mi papel; la siguiente tabla lo delimita.",
    transitionCue: "mi contribución"
  },

  {
    id: 39.7,
    block: 'Contribuciones científicas', blockColor: '#0ea5e9',
    title: "Mi contribución científica y tecnológica",
    subtitle: "Métodos aplicados, trabajo colaborativo y software propio",
    estimatedMinutes: 2,
    type: 'normal',
    script: "La tabla distingue tres ámbitos de mi contribución: los trabajos liderados, las colaboraciones y el software. En los primeros he asumido responsabilidades de metodología, simulación, análisis y redacción. En las colaboraciones, mi aportación se delimita a tareas de calibración, clima, extremos o desarrollo.\n\nEn pyhydra e HYDRA participo como primer autor en diseño, desarrollo, documentación y publicación. La memoria recoge siete trabajos liderados y cuatro colaboraciones específicas. El trabajo del grupo sobre cópulas vine se cita como extensión y no corresponde a mi autoría.\n\nEsta separación permite valorar la contribución doctoral dentro de un trabajo colectivo. La relación completa por publicación está disponible en los anexos para su consulta.",
    notes: "El detalle por publicación queda en reserva. La distinción de autoría debe mantenerse aunque se resuma el texto oral. El trabajo de cópulas vine citado como extensión no tiene autoría del doctorando.",
    mathBlock: "<table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Responsabilidad</th><th>Aportación</th></tr></thead><tbody><tr><th>Trabajos liderados</th><td>Metodología, simulación, análisis y redacción</td></tr><tr><th>Colaboraciones</th><td>Calibración, clima, extremos y software, con rol delimitado</td></tr><tr><th>pyhydra e HYDRA</th><td>Diseño, desarrollo, documentación y publicación con rol de primer autor</td></tr></tbody></table><p class=\"thesis-matrix-legend\">El detalle por publicación está disponible en los anexos.</p>",
    bullets: [
      'Siete trabajos como primer autor, cuatro con aportación delimitada y software con rol de primer autor.',
    ],
    speakerGoal: "Delimitar la responsabilidad personal con tres filas legibles.",
    visualGuide: ["Trabajos liderados","Colaboraciones con aportación delimitada","Diseño y desarrollo del software"],
    speechCues: ["trabajos liderados","colaboraciones","software","primer autor","siete trabajos","cuatro colaboraciones","trabajo colectivo"],
    transition: "Con las responsabilidades delimitadas, podemos cerrar las tres hipótesis usando la evidencia presentada.",
    transitionCue: "hipótesis y sus evidencias"
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
    script: "Vuelvo a las tres hipótesis para cerrar la relación entre objetivos y evidencias. En H1, las campañas muestran capacidad operativa; falta medir de forma sistemática el ahorro frente al trabajo manual, y la automatización histórica tiene distinto alcance según el caso.\n\nEn H2, la reutilización entre aplicaciones respalda la modularidad. Besaya, Calle 30 y Valencia tienen notebooks actuales; evaluar el uso por otros equipos permitirá contrastar la reducción de barreras.\n\nEn H3, los cambios de método y muestra muestran sensibilidad, y las bandas expresan incertidumbre. Para demostrar una representación más consistente hacen falta comparaciones sistemáticas y contraste observacional. Este balance precisa qué sostiene cada hipótesis y qué parte debe comprobarse todavía.",
    notes: "La formulación de H1 contempla eficiencia, pero esta defensa acredita principalmente viabilidad operativa. H2 tiene tres casos con notebooks actuales. H3 muestra sensibilidad e incertidumbre, no una demostración general de exactitud superior.",
    bullets: ["H1: viabilidad demostrada; ahorro de tiempo pendiente de medir.","H2: reutilización entre aplicaciones; tres casos con notebooks reproducibles hoy.","H3: sensibilidad del diseño a métodos y datos; mayor valor no implica mayor exactitud."],
    speakerGoal: "Cerrar cada hipótesis con evidencia y un límite explícito.",
    visualGuide: ["H1: campañas de ejecuciones en la franja superior","H2: matriz central de componentes reutilizados","H3: comparaciones numéricas inferiores"],
    speechCues: ["tres hipótesis","H1","ahorro","H2","otros equipos","H3","contraste observacional","qué parte debe comprobarse"],
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
    script: "La figura distingue la procedencia de los componentes y la contribución que resulta de conectarlos. En la base están los métodos científicos previos: análisis de extremos, cópulas, generadores y motores físicos. En el nivel central se sitúan los desarrollos de la tesis: submódulos, adaptadores y flujos documentados. Arriba aparece su integración reproducible y transferible.\n\nLos casos dan contenido a esa integración: permiten examinar la influencia de entradas y modelos, estimar frecuencia sobre el impacto y reutilizar componentes en otra escala. La contribución original consiste en hacer operativa esa cadena, conservando la trazabilidad de sus decisiones y delimitando las condiciones en las que pueden interpretarse los resultados.",
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
    speechCues: ["métodos científicos previos","desarrollos de la tesis","integración reproducible y transferible","frecuencia sobre el impacto","contribución original","trazabilidad"],
    transition: "Los límites se localizan precisamente en las etapas de la cadena que hemos recorrido.",
    transitionCue: "comprobaciones y desarrollos"
  },

  {
    id: 42,
    block: 'Conclusiones', blockColor: '#ef4444',
    title: 'Qué resuelve HYDRA y qué permanece abierto',
    subtitle: 'La automatización organiza la incertidumbre; no elimina los límites de los datos ni de los modelos',
    estimatedMinutes: 2,
    type: 'normal',
    script: "Las limitaciones se distribuyen a lo largo de la cadena. Las series pueden ser cortas o de calidad desigual; los generadores dependen de sus hipótesis; los motores tienen requisitos de licencia, versión y coste; y el contraste observacional del impacto sigue siendo insuficiente.\n\nLas propuestas inferiores responden a esas dificultades: reforzar el control de calidad, expresar la incertidumbre, condicionar la generación al clima y estudiar emuladores o ejecución distribuida. Priorizaría dos comprobaciones: medir el acierto de los impactos y cuantificar el ahorro real de trabajo.\n\nHYDRA facilita repetir y auditar el análisis. La selección de entradas y modelos y la justificación de las decisiones continúan requiriendo el criterio del equipo responsable.",
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
    speechCues: ["limitaciones","contraste observacional","control de calidad","generación al clima","acierto de los impactos","ahorro real","criterio del equipo responsable"],
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
    script: "Para terminar, recupero la idea que ha guiado la defensa. La tesis desarrolla una cadena reproducible que conecta datos, métodos y modelos para estimar la frecuencia del impacto bajo incertidumbre hidrológica y climática. Las aplicaciones muestran su utilidad en problemas de ingeniería y permiten precisar los límites que he expuesto.\n\nLos repositorios y las versiones citables de pyhydra e HYDRA quedan disponibles para continuar esa investigación y revisar sus desarrollos. Con esta síntesis concluyo la exposición del trabajo y quedo a disposición del tribunal para las aclaraciones y preguntas que considere oportunas.",
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
    speechCues: ["cadena reproducible","frecuencia del impacto","incertidumbre hidrológica y climática","problemas de ingeniería","límites","aclaraciones y preguntas"],
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
    script: "Esta ilustración reúne tres situaciones que pueden coincidir en un problema de inundación: una avenida fluvial, la acumulación de agua en la ciudad y la influencia costera. Es una representación conceptual, que nos ayuda a situar la pregunta de ingeniería.\n\nEn el dibujo también aparecen las personas, las viviendas y las infraestructuras expuestas. Para valorar su seguridad necesitamos conocer dónde puede llegar el agua, qué calado puede alcanzar y con qué frecuencia puede ocurrir. La precipitación inicia una parte del proceso, pero la cuenca y el sistema hidráulico transforman esa entrada. La tesis se ocupa de conectar esas etapas para estimar las consecuencias sobre una variable útil para decidir.",
    notes: "La imagen es conceptual. Señalar los sistemas expuestos y formular la pregunta de decisión. No presentarla como fotografía documental de un evento.",
    bullets: [
      'La misma precipitación puede producir consecuencias distintas según el estado de la cuenca y la exposición.',
      'La decisión se toma sobre personas, infraestructuras y niveles de agua, no sobre la lluvia de forma aislada.',
    ],
    speakerGoal: "Situar la variable sobre la que se toma una decisión.",
    visualGuide: ["Ilustración conceptual: río, ciudad y costa","Edificios, movilidad e infraestructuras expuestas"],
    speechCues: ["ilustración","pregunta de ingeniería","qué calado","con qué frecuencia","transforman esa entrada","variable útil para decidir"],
    transition: "Veamos cómo recorre esa distancia el procedimiento de cálculo habitual.",
    transitionCue: "condiciones"
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
    script: "La figura recorre la cadena necesaria para una modelación estocástica. A partir de una serie se generan escenarios plausibles, que se transforman mediante los modelos físicos en respuestas hidráulicas. Un mapa de calado representa el resultado de una de esas ejecuciones.\n\nAl reunir muchos resultados podemos construir la curva de frecuencia situada al final y estimar la probabilidad de superar un calado. La banda expresa la incertidumbre de esa estimación. Así conectamos los escenarios con la variable de decisión.\n\nLos años sintéticos amplían las realizaciones disponibles bajo unas hipótesis; no añaden nuevas observaciones. Por eso debemos revisar los diagnósticos del generador y la adecuación de los modelos antes de interpretar la curva.",
    notes: "Los años sintéticos son realizaciones del modelo. La curva final está condicionada a las hipótesis del generador y de los motores.",
    bullets: [
      'Representar escenarios plausibles exige datos y relaciones de dependencia.',
      'Propagar esos escenarios exige modelos hidrológicos e hidráulicos.',
      'Evaluar el riesgo exige calcular la distribución de la variable de impacto.',
    ],
    speakerGoal: "Explicar la cadena estocástica antes de comparar arquitecturas.",
    visualGuide: ["Serie corta de partida","Población de escenarios","Mapa por escenario y curva final"],
    speechCues: ["escenarios plausibles","respuestas hidráulicas","curva de frecuencia","probabilidad de superar un calado","incertidumbre","no añaden nuevas observaciones"],
    transition: "La cuestión es qué parte de esta cadena cubren conjuntamente los marcos disponibles.",
    transitionCue: "otros marcos"
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
  "notes": "Esta diapositiva responde preventivamente a dos preguntas: qué resultados pertenecen al doctorando y cómo se relacionan las publicaciones previas con la contribución doctoral. No atribuirse el trabajo Vine cópulas/GPR de 2026: la memoria lo cita como línea de extensión sin autoría del doctorando. La tabla se distribuye en dos columnas; se leen por separado de arriba abajo.",
  "mathBlock": "<div class=\"authorship-grid\"><table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead><tbody><tr><th scope=\"row\">V JIA (2017)</th><td class=\"tm-yes\">Primer autor</td><td>Conceptualización de la cadena estocástica, análisis y redacción</td></tr><tr><th scope=\"row\">Besaya, ROP (2018)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, modelización hidrológico-hidráulica, impactos y redacción</td></tr><tr><th scope=\"row\">Mallorca (2019)</th><td class=\"tm-yes\">Primer autor</td><td>Downscaling híbrido, geoestadística, simulación y redacción</td></tr><tr><th scope=\"row\">Andes, BID e IA (2019–2020)</th><td class=\"tm-part\">Coautor</td><td>Calibración automática y procesamiento climático</td></tr><tr><th scope=\"row\">NEOPRENE, GMD (2023)</th><td class=\"tm-part\">Segundo autor</td><td>Desarrollo, validación y documentación del software</td></tr><tr><th scope=\"row\">Calle 30, IA (2024)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología completa, automatización HEC-HMS/HEC-RAS y redacción</td></tr><tr><th scope=\"row\">Downscaling, EGU (2024)</th><td class=\"tm-part\">Coautor</td><td>Generación estocástica y reconstrucción integradas en pyhydra</td></tr></tbody></table><table class=\"thesis-matrix authorship-matrix\"><thead><tr><th>Trabajo</th><th>Posición</th><th>Contribución del doctorando</th></tr></thead><tbody><tr><th scope=\"row\">SIMPCCe, IA (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño y desarrollo íntegro, validación nacional y redacción</td></tr><tr><th scope=\"row\">Valencia (2025)</th><td class=\"tm-part\">Segundo autor</td><td>Módulos de extremos y AFR y ejecución de los cálculos</td></tr><tr><th scope=\"row\">Tanganica (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Metodología, datos globales, aprendizaje automático y redacción</td></tr><tr><th scope=\"row\">Rugosidad Besaya, EMS (2025)</th><td class=\"tm-yes\">Primer autor</td><td>Ensemble Monte Carlo, automatización de ambos motores y redacción</td></tr><tr><th scope=\"row\">Vine cópulas y GPR (2026)</th><td class=\"tm-no\">Sin autoría</td><td>Trabajo del grupo citado como extensión; no es contribución de la tesis</td></tr><tr><th scope=\"row\">pyhydra e HYDRA, Zenodo (2026)</th><td class=\"tm-yes\">Primer autor</td><td>Diseño, desarrollo, documentación y publicación del software</td></tr></tbody></table></div><p class=\"thesis-matrix-legend\">Fuente: memoria definitiva, tabla 8.2. Los trece registros se distribuyen en dos columnas para consulta.</p>",
  "bullets": [],
  "backup": true,
    visualGuide: ["Columna izquierda: primeros trabajos y colaboraciones","Columna derecha: aplicaciones posteriores, extensión sin autoría y software"]
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
  "figureCaption": "Ficha automática original de SIMPCCe, conservada como documentación del producto completo.",
  "script": "Esta es la ficha automática original que reúne varios productos de SIMPCCe. Los mapas sitúan el punto de la ficha. Las matrices superiores recogen cambios anuales por modelo y período; los paneles inferiores reúnen estadísticas mensuales y factores de cambio.\n\nLa utilizo como documentación del producto completo, para localizar qué indicadores genera la herramienta. No es la fuente numérica de la gráfica vectorial del recorrido principal: aquella procede de la tabla 25 de la guía y está identificada como Embalse 2. Para leer una cifra de esta ficha debe ampliarse su panel y comprobar su variable, unidad, horizonte y escenario.",
  "notes": "Material de consulta del producto original. No asumir que la ficha y la gráfica del Embalse 2 corresponden al mismo punto. La gráfica principal tiene fuente tabulada explícita; esta ficha documenta la variedad de salidas."
}
];

// Deliberate narrative order; supporting material remains available in the appendices.
const presentationOrder = [1, 4, 44, 4.5, 2, 3, 5.5, 6, 8, 7, 8.5, 4.6, 9, 46, 10, 11, 12, 5, 12.6, 13, 14, 15, 16, 17, 18, 19, 27, 29, 28, 30, 31, 32, 33, 34, 35, 36, 39, 38, 37, 39.5, 39.6, 39.7, 40, 41, 42, 42.5, 43];
const appendixOrder = [20, 21, 22, 23, 24, 25, 26, 56, 57, 58, 59, 60, 61, 45, 8.6, 47, 48, 55, 62];
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
      "text": "El origen de este planteamiento está en el trabajo del Besaya."
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
      "text": "Su valor conjunto se resume en tres aportaciones que orientan el desarrollo."
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
      "nextId": 5,
      "text": "Entramos ahora por primera vez en la plataforma HYDRA."
    }
  ],
  [
    5,
    {
      "nextId": 12.6,
      "text": "Dentro de esos accesos, el núcleo se organiza en tres bloques."
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
      "nextId": 16,
      "text": "Esas propiedades permiten generar las realizaciones que alimentarán los modelos."
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
      "nextId": 18,
      "text": "Las herramientas web facilitan el acceso a operaciones de ese mismo núcleo."
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
      "nextId": 28,
      "text": "El siguiente trabajo estudia cómo cambia ese impacto al cambiar de motor."
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
