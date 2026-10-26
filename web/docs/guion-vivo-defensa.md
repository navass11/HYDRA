# Guion vivo de la defensa doctoral

**Tesis:** Desarrollo de un modelo automático de inundación estocástica<br>
**Doctorando:** Salvador Navas Fernández<br>
**Fecha de la defensa:** 27 de octubre de 2026<br>
**Versión de trabajo:** 26 de octubre de 2026<br>
**Versión amplia para lectura y estudio:** duración pendiente de ajustar al objetivo de exposición; estimación actual del guion: ~111 minutos<br>
**Fuente de contenido:** memoria definitiva de impresión, figuras originales y fuentes identificadas por caso<br>
**Guion por diapositiva:** sincronizado con `web/src/data/slides.ts`

> Este documento contiene un guion literal completo que puedes estudiar y leer durante la presentación. Las negritas señalan palabras clave para recuperar el hilo; las transiciones están redactadas para decirse en voz alta. Cada revisión de contenido de la presentación debe reflejarse también aquí.

> La sección **Guion oral completo por diapositiva** recoge el texto sugerido para decir, en el orden exacto de la presentación principal. Las notas privadas aparecen aparte y no se leen. Las demostraciones de la web son apoyo del bloque metodológico: el manual práctico corresponde al material complementario de la memoria, no a un capítulo principal adicional.

## Preparar la copia sin conexión

Antes de la defensa, descarga el ZIP desde «Descargar para usar sin conexión» en `/defensa`. Descomprime toda la carpeta y abre `INICIO.html` en el ordenador de la sala. El paquete público incluye la presentación, los anexos y las figuras. Este guion es interno y no se incluye en la descarga. Conserva la carpeta `assets` junto a los HTML. Las demos son capturas preparadas; abrir la versión alojada en Azure y ejecutar herramientas en vivo requiere Internet.

## La tesis en una frase

Esta tesis convierte métodos científicos ya consolidados pero dispersos en una arquitectura automática, reproducible y transferible que propaga la incertidumbre desde los datos y los forzamientos hasta la variable de impacto sobre la que se toman decisiones.

## Las cinco ideas que el tribunal debe recordar

1. El período de retorno del forzamiento no coincide necesariamente con el período de retorno del impacto: **T(forzante) ≠ T(impacto)**.
2. La aportación no es un nuevo motor hidráulico ni un nuevo algoritmo estadístico aislado, sino su **integración extremo a extremo**.
3. **pyhydra** es el núcleo científico reutilizable; **HYDRA** es la plataforma que lo hace ejecutable, visible, documentado y transferible.
4. Los diez estudios cubren tres dimensiones: inundación estocástica basada en impactos; extremos e incertidumbre; cambio climático, datos globales y escalabilidad. Cuatro entradas disponen de notebooks (Besaya, rugosidades, Calle 30 y Valencia), sujetos a datos, dependencias y motores externos; las otras seis están documentadas mediante publicaciones o proyectos. Los dos estudios del Besaya comparten dominio, pero responden a preguntas distintas.
5. La tesis no elimina la incertidumbre: permite **representarla, propagarla y auditarla**.

## Mapa oral y tiempos

| Bloque | Tiempo orientativo |
|---|---:|
| Introducción | 26,6 min |
| Estado de la técnica | 4,0 min |
| Arquitectura | 4,2 min |
| Metodología | 28,5 min |
| Casos y validación | 31,8 min |
| Conclusiones | 15,9 min |

La estimación de ~111 minutos combina el texto oral a un ritmo de 115 palabras por minuto, unos segundos por cambio de diapositiva, lectura de figuras y los momentos de navegación previstos. Es una referencia inicial: un ensayo cronometrado con pausas naturales determinará el tiempo real.

La primera navegación por HYDRA forma parte del recorrido principal y debe mantenerse. Los otros momentos web tienen una función concreta: demostración GEV, cadena del Besaya, análisis interactivo de Calle 30 y trazabilidad de Valencia. Por indicación del doctorando, esta revisión amplía el texto de todas las diapositivas aunque supere el objetivo previo de 60 minutos. Se revisará después la duración mediante ensayo y una decisión editorial explícita; no se han recortado otras explicaciones para compensar la ampliación.

---

## Guion oral completo por diapositiva

Libreto del recorrido principal: **48 diapositivas**, unos **111 minutos**. El texto bajo **Diálogo** coincide con la vista de presentador en vivo y se pronuncia; la **Transición** acompaña el cambio de diapositiva. Las pautas entre corchetes son acciones privadas. Los tiempos incluyen el habla a 115 palabras/min, la transición, la lectura de figuras y la demostración. Son los mismos que utiliza la vista de presentador.

### 1. Desarrollo de un modelo automático de inundación estocástica

**Bloque:** Introducción · **Tiempo orientativo:** 1 min 48 s

**Idea que debe quedar:** Plantear la defensa como respuesta a un problema de ingeniería.

**Recorrido visual:**

1. Título de la tesis
2. Autor, director y tutor

**Diálogo**

Buenos días, **miembros del tribunal**, director, tutor, profesores, compañeros, familiares y amigos. Muchas gracias por acompañarme. Soy **Salvador Navas Fernández** y voy a presentar mi tesis doctoral, titulada «**Desarrollo de un modelo automático de inundación estocástica**». La he realizado en IHCantabria, dentro del programa de Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos (IH2O) y con **Mención Industrial**. La tesis ha sido dirigida por el doctor **Manuel del Jesus Peñil** y tutorizada por el doctor **César Álvarez Díaz**. A lo largo de la exposición explicaré qué **problema científico** la origina, cómo se construyó la solución y qué **evidencia** permite valorar su utilidad.

El título reúne las dos dimensiones que recorreremos durante la defensa. La primera es **científica**: representar la variabilidad hidrológica y climática y trasladarla hasta el impacto. La segunda es **tecnológica**: conectar métodos y programas para que ese análisis pueda ejecutarse, revisarse y repetirse. La portada identifica también el marco académico y la Mención Industrial, que sitúa el trabajo en su relación con problemas reales de ingeniería. Mi propósito será explicar tanto el fundamento de los cálculos como el alcance de las evidencias obtenidas.

**Notas privadas:** Saludar y hacer una pausa antes de plantear el problema. Los nombres completos y la Mención Industrial permanecen en portada.

**Transición:** Presentaré el problema, los desarrollos y sus evidencias siguiendo **esta estructura**.

### 2. Estructura de la defensa

**Bloque:** Introducción · **Tiempo orientativo:** 1 min 48 s

**Idea que debe quedar:** Dar al tribunal un mapa de la argumentación.

**Recorrido visual:**

1. Seis bloques del índice
2. Ruta superior de cada diapositiva

**Diálogo**

La exposición sigue **seis bloques** que agrupan los capítulos de la memoria, en este orden. Primero, la **introducción**: el problema, la pregunta, las hipótesis y los objetivos. Después, el **estado de la técnica** y la brecha que justifica la tesis. En tercer lugar, la **arquitectura del sistema**. En cuarto, la **metodología**: datos, análisis climático y estadístico, y modelización, con una breve demostración. En quinto, los **casos** como evidencia de validación. Y por último, las **conclusiones**: contribución, límites y trabajo futuro. Esta misma ruta aparece en las diapositivas para situarnos durante la exposición; las **visitas a la web** forman parte de ese recorrido.

La metodología explicará qué recibe cada bloque, qué transformación realiza y qué entrega al siguiente. En los casos veremos resultados concretos para valorar esas operaciones. Esta separación ayudará a distinguir la descripción de una capacidad de su comprobación en una aplicación. Cuando entremos en la web, seguiremos dentro del mismo recorrido: la navegación servirá para localizar una herramienta, interpretar sus resultados o consultar el procedimiento que los produjo. La franja superior mantiene visibles estos seis bloques para que podamos reconocer en todo momento dónde estamos.

**Notas privadas:** Situar los seis bloques. La diapositiva de índice se utiliza una sola vez en el recorrido principal.

**Transición:** Comenzaré por las **consecuencias** que necesitamos estimar para decidir ante una inundación.

### 3. Qué necesitamos saber para decidir ante una inundación

**Bloque:** Introducción · **Apartado:** Contexto del problema · **Tiempo orientativo:** 2 min 06 s

**Idea que debe quedar:** Situar la variable sobre la que se toma una decisión.

**Recorrido visual:**

1. Ilustración conceptual: río, ciudad y costa
2. Edificios, movilidad e infraestructuras expuestas

**Diálogo**

Las inundaciones afectan simultáneamente a **personas**, viviendas, movilidad, actividad industrial y servicios esenciales. La gravedad de los daños depende de qué zonas se inundan, de la **profundidad y la velocidad** del agua, de cuánto dura la inundación y de la **vulnerabilidad** de las personas, los edificios y las infraestructuras expuestos. El **estado previo de la cuenca** condiciona, a su vez, cómo responde a la lluvia. Por eso, al utilizar una lluvia de diseño, debemos justificar qué condiciones representa y cómo se relaciona su **frecuencia** con la del impacto. La pregunta de ingeniería exige conocer qué impactos pueden producirse, con qué frecuencia y con qué **incertidumbre**.

La ilustración reúne distintos sistemas expuestos para recordar que una misma situación meteorológica puede afectar de forma diferente a cada uno. En una infraestructura, interesa saber hasta qué punto entra el agua; en una zona habitada, también importa su extensión, profundidad y velocidad. Para interpretar el daño necesitamos combinar la **respuesta física** con la **exposición y la vulnerabilidad**. En esta tesis, el desarrollo se concentra en la cadena que caracteriza los escenarios y estima la respuesta hidrológica e hidráulica. Esa información alimenta la evaluación del riesgo y las decisiones de diseño; por sí sola no constituye una estimación completa de las pérdidas de todos los elementos expuestos.

**Notas privadas:** La imagen es conceptual. Señalar los sistemas expuestos y formular la pregunta de decisión. No presentarla como fotografía documental de un evento.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** La respuesta depende también de unas **condiciones** que pueden cambiar.

### 4. Por qué necesitamos considerar condiciones cambiantes

**Bloque:** Introducción · **Apartado:** Motivación · **Tiempo orientativo:** 2 min 18 s

**Idea que debe quedar:** Explicar los cambios que motivan el trabajo, después de situar sus consecuencias.

**Recorrido visual:**

1. Exposición
2. Urbanización
3. Condiciones climáticas cambiantes

**Diálogo**

Esta tesis se realiza porque las inundaciones pueden causar **graves daños humanos, económicos y territoriales**, y porque las condiciones que determinan ese riesgo están cambiando. La ocupación de las llanuras inundables aumenta la **exposición** de personas e infraestructuras; el **cambio climático** modifica las condiciones hidrológicas y puede alterar la frecuencia y la intensidad de los extremos; y la **impermeabilización urbana** concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman **interacciones** entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos **escenarios plausibles** y conocer no solo un valor de cálculo, sino también la **incertidumbre asociada** a la decisión.

Los tres elementos de la diapositiva describen mecanismos diferentes. La exposición cambia cuando aumenta la presencia de personas y bienes en zonas inundables. El **clima** introduce escenarios bajo los cuales pueden cambiar las condiciones de entrada del análisis. La **urbanización** modifica cómo la superficie transforma la lluvia en escorrentía. La imagen inferior sitúa esas interacciones en un territorio con usos distintos. Por eso, repetir el cálculo con un único evento y una única configuración deja fuera respuestas posibles. Explorar escenarios permite separar qué parte del resultado depende del forzamiento, cuál del estado del sistema y cuál de las decisiones de modelización.

**Notas privadas:** Abrir el problema a escala social antes de hablar de software. La imagen es conceptual y no corresponde a un evento concreto; las evidencias cuantitativas y geográficas aparecerán después en los casos de estudio. Conectar con la siguiente idea: si el riesgo exige múltiples escenarios, el flujo manual deja de ser viable.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Ante esas condiciones, el título concreta el **alcance de la investigación**.

### 5. Qué significa el título de la tesis

**Bloque:** Introducción · **Apartado:** Alcance de la tesis · **Tiempo orientativo:** 2 min 30 s

**Idea que debe quedar:** Delimitar qué significa el título y evitar que se interprete como un nuevo solver hidráulico.

**Recorrido visual:**

1. Modelo y automatización
2. Inundación y escenarios estocásticos
3. Contratos de reproducibilidad

**Diálogo**

El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una **cadena completa de cálculo**. “**Automático**” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente la preparación de archivos y el intercambio de datos entre etapas. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el **impacto hidráulico**: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una **población de escenarios plausibles** que representa la variabilidad y la incertidumbre. Esta definición exige además **reproducibilidad operativa**: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la **variable sobre la que se toman decisiones**.

Los cuatro términos también establecen cómo valorar el resultado. La cadena debe estar **conectada**, de modo que una salida pueda utilizarse como entrada de la siguiente etapa. Debe poder **repetirse**, conservando datos y configuración. Debe producir una **variable física interpretable**, con su unidad y localización. Y debe conservar la información necesaria para estimar su **frecuencia e incertidumbre**. El esquema de la diapositiva organiza esas responsabilidades; la fotografía sitúa el sistema físico sobre el que se aplican. Así, podremos preguntar de forma concreta qué escenario produjo un determinado calado y qué hipótesis intervienen en su interpretación.

**Notas privadas:** Interpretar los cuatro términos del título. El Besaya se presenta a continuación como antecedente científico del análisis sobre el impacto. La pregunta, las hipótesis y los objetivos se explican antes de introducir pyhydra como respuesta tecnológica y HYDRA como plataforma.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El Besaya aporta un **antecedente científico** para comprender este planteamiento.

### 6. Besaya: antecedente científico del análisis sobre el impacto

**Bloque:** Introducción · **Apartado:** Antecedente científico · **Tiempo orientativo:** 2 min 24 s

**Idea que debe quedar:** Situar el Besaya como antecedente científico, antes de formular las hipótesis y los objetivos.

**Recorrido visual:**

1. 2017: TFM y cadena estocástica
2. 2018: frecuencia sobre el impacto
3. Dificultad operativa y antecedente metodológico

**Diálogo**

Un **antecedente científico** de esta tesis es mi **Trabajo Fin de Máster**, desarrollado en **2017** sobre el río Besaya a su paso por **Los Corrales de Buelna**. En aquel trabajo construí la **primera cadena completa**: caracterización multivariante de avenidas, generación de escenarios, simulación hidráulica con **Iber** y análisis estadístico de los impactos. El TFM recibió el premio principal en la categoría de Mejor Calidad y Contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. El trabajo se publicó después en la Revista de Obras Públicas, número 3598 de mayo de **2018**, y consolidó la observación que guía toda la tesis: el **período de retorno del forzamiento** no coincide necesariamente con el del impacto hidráulico. Se comparó la inundación obtenida mediante metodologías habituales con la obtenida mediante la metodología desarrollada en el Besaya. Este caso proporciona un **antecedente metodológico** y muestra la dificultad de **repetir una cadena extensa**.

Las etiquetas de la izquierda ordenan el antecedente: 2017 corresponde al TFM; 2018, a su publicación. La fila de comparación recoge ese contraste. Las dos últimas filas expresan la dificultad práctica y la consecuencia para la investigación. La metodología permitía llegar hasta el impacto, pero repetirla exigía preparar y transferir información entre herramientas de forma manual. Este antecedente motiva la pregunta científica. El desarrollo de pyhydra vendrá después, como respuesta a las **hipótesis y objetivos de la tesis**. Conviene mantener esa secuencia: primero se identifica qué necesitamos demostrar y, a partir de ello, se define la solución tecnológica.

**Notas privadas:** El Besaya es un antecedente científico y una evidencia del principio de frecuencia sobre el impacto. No presentarlo como origen de pyhydra. La librería se desarrolla para responder a los objetivos e hipótesis; su nombre y la plataforma se presentan después de formularlos.

**Transición:** Para situar aquella dificultad, veamos cómo se **estima habitualmente** una inundación.

### 7. Cómo se estima convencionalmente una inundación

**Bloque:** Introducción · **Apartado:** Procedimiento de referencia · **Tiempo orientativo:** 2 min 06 s

**Idea que debe quedar:** Separar la cadena física válida de los supuestos de asignación de frecuencia.

**Recorrido visual:**

1. Fila superior, de registros a impacto
2. Tres supuestos en los recuadros inferiores

**Diálogo**

Antes de presentar la solución, conviene fijar el **procedimiento de referencia**. Partimos de registros, ajustamos extremos, construimos un **evento de diseño**, lo transformamos mediante modelos hidrológicos e hidráulicos y obtenemos un **mapa de inundación**. Esta cadena física permite transformar la entrada en una respuesta hidráulica. La dificultad está en **tres simplificaciones** frecuentes: asumir **estacionariedad**, representar el extremo con un único evento y trasladar el mismo período de retorno desde el forzamiento hasta el impacto. La propuesta conserva la cadena física y organiza la exploración de **múltiples escenarios** para estimar la **frecuencia del calado** y de la extensión inundada, bajo las hipótesis del análisis.

En la figura se lee la secuencia de izquierda a derecha: **datos, caracterización estadística, evento, modelos físicos y mapa**. El mapa conserva información espacial: permite reconocer dónde aparecen los calados calculados. Sin embargo, para asignarle una frecuencia necesitamos saber qué conjunto de eventos y estados representa. Las tres advertencias del esquema se refieren precisamente a ese paso: unas condiciones estadísticas que pueden cambiar, la reducción de la variabilidad a un único evento y la asociación directa de su período de retorno con el resultado. La propuesta amplía las realizaciones que atraviesan esa misma cadena física y analiza sus impactos conjuntamente.

**Notas privadas:** El período de retorno se refiere a una variable y a hipótesis especificadas. En condiciones estacionarias, T100 corresponde a una probabilidad anual de superación de 0,01.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** La siguiente figura muestra cómo una **misma lluvia** admite respuestas diferentes.

### 8. La misma lluvia puede producir impactos distintos

**Bloque:** Introducción · **Apartado:** Problema científico · **Tiempo orientativo:** 2 min 12 s

**Idea que debe quedar:** Hacer comprensible la diferencia entre frecuencia del forzamiento y del impacto.

**Recorrido visual:**

1. Comparar las dos filas del esquema
2. Suelo seco frente a suelo saturado y afluente en crecida
3. Resultado hidráulico de cada fila

**Diálogo**

El problema científico se ve en este esquema. En las dos filas cae la **misma lluvia**, con un período de retorno de **cien años**. En la fila de arriba el **suelo está seco** y el agua queda dentro del cauce. En la de abajo el **suelo está saturado** y el afluente llega en crecida: el río desborda. El forzamiento es idéntico, pero las condiciones de la cuenca producen **impactos distintos**. Por eso no basta con preguntar cada cuánto ocurre una lluvia de diseño. Hay que preguntar **cada cuánto se supera un calado**, un caudal o una extensión inundada relevantes para la decisión. El esquema ilustra esa diferencia, sin asignar por sí solo otra frecuencia a cada respuesta. La tesis parte de que el período de retorno del forzamiento **no puede asignarse directamente** al impacto.

La comparación mantiene fijo el **período de retorno de la lluvia** para aislar el efecto de las condiciones del sistema. El suelo seco admite una parte del agua antes de que llegue al río; la saturación y la coincidencia de aportaciones pueden aumentar la respuesta hidráulica. Las dos filas ilustran, por tanto, una transformación condicionada por varios factores. No podemos deducir la frecuencia de cada impacto únicamente mirando esas dos imágenes: necesitaríamos conocer también con qué frecuencia aparecen las condiciones representadas. Esta es la razón para construir un conjunto de escenarios que conserve sus relaciones y evaluar la respuesta de cada uno.

**Notas privadas:** Las dos filas son un ejemplo conceptual. La figura muestra respuestas posibles, no calcula el período de retorno de cada impacto dibujado.

**Transición:** Esa variabilidad de la respuesta conduce a la **pregunta doctoral**.

### 9. La pregunta de investigación

**Bloque:** Introducción · **Apartado:** Pregunta de investigación · **Tiempo orientativo:** 2 min 12 s

**Idea que debe quedar:** Formular la pregunta doctoral completa, con una pausa para que se comprenda su alcance.

**Recorrido visual:**

1. Pregunta de investigación
2. Datos, cadena reproducible y modelos físicos
3. Transferencia a una aplicación real

**Diálogo**

La **pregunta de investigación** es la que aparece a la izquierda: ¿es posible **automatizar de forma reproducible** la cadena completa del análisis probabilístico del riesgo de inundación bajo **incertidumbre hidrológica y climática**, integrando metodologías avanzadas previamente desarrolladas en un marco operativo transferible a proyectos reales de ingeniería? A la derecha está la cadena que exige: datos climáticos con su incertidumbre; una cadena automática cuyos cálculos puedan repetirse conservando los datos, la configuración, las versiones y las **semillas aleatorias**; modelos físicos adecuados a cada caso; y una **aplicación real** en la que se estime la frecuencia con la que se supera un calado, una extensión inundada o un nivel relevantes para el diseño. El esquema recuerda una condición esencial: las fuentes de incertidumbre consideradas deben **propagarse a través de la cadena** y reflejarse en los resultados finales.

El texto de la pregunta impone varias exigencias simultáneas. **Automatizar** requiere conectar las operaciones; **reproducir** exige conservar la información del cálculo; **integrar incertidumbre** requiere representar las fuentes consideradas y seguir su propagación; y **transferir** significa poder adaptar el procedimiento a otro problema. La cadena de la derecha permite comprobar dónde interviene cada exigencia. Si una etapa pierde la referencia de sus datos o sustituye el ensemble por un único valor sin justificarlo, esa pérdida afecta a la interpretación posterior. La pregunta doctoral se refiere a la coherencia del conjunto, además del funcionamiento de cada componente por separado.

**Notas privadas:** Pronunciar despacio: es la formulación literal de la memoria (cap. 1). El foco está en "automatizar de forma reproducible" e "integrando metodologías previamente desarrolladas" — de ahí que la tesis no reivindique algoritmos nuevos, sino su operacionalización conjunta.

**Transición:** La pregunta se desarrolla en las **tres hipótesis** de la memoria.

### 10. Hipótesis: qué debe demostrar la propuesta

**Bloque:** Introducción · **Apartado:** Hipótesis · **Tiempo orientativo:** 2 min 48 s

**Idea que debe quedar:** Formular una pregunta y tres hipótesis que luego se puedan cerrar con evidencia.

**Recorrido visual:**

1. Fila superior: métodos fragmentados
2. Fila inferior: arquitectura conectada
3. H1, H2 y H3

**Diálogo**

La hipótesis central es que una de las principales barreras operativas para aplicar estos métodos está en su **integración**. El esquema lo resume. **Arriba** están los métodos disponibles —extremos, cópulas, generadores, proyecciones, corrección de sesgo y motores hidráulicos—, con conexiones que deben reconstruirse en cada proyecto. **Abajo** aparece esa ciencia organizada en una cadena modular y reproducible, desde los datos hasta el impacto.

Las dos partes de la figura contienen métodos conocidos; lo que cambia es su **forma de conexión**. Una conexión manual obliga a conocer formatos, unidades y decisiones que pueden quedar repartidas entre archivos o programas. Una conexión explícita permite conservar esas transformaciones y reutilizarlas. Eso da contenido a las hipótesis, pero no las convierte automáticamente en resultados demostrados. Para contrastarlas habrá que examinar campañas de cálculo, reutilización de componentes y cambios en los resultados, y reconocer qué comparaciones adicionales siguen pendientes. En particular, disponer de una campaña automática no cuantifica por sí solo el ahorro respecto a un procedimiento manual.

La memoria concreta este planteamiento en **tres hipótesis**. **H1**, Automatización: La automatización del flujo completo para estudios de inundación, desde la adquisición de datos y la generación de eventos estocásticos hasta la ejecución de modelos hidrológicos e hidráulicos, mejora la eficiencia, reproducibilidad y aplicabilidad práctica del análisis del riesgo.

**H2**, Integración modular: La integración de análisis estocástico, procesamiento climático y simulación hidrofísica en una librería modular reduce barreras técnicas y facilita la incorporación sistemática del cambio climático y la incertidumbre.

**H3**, Flujo reproducible: La integración coordinada de metodologías avanzadas dentro de un flujo reproducible permite representar de forma más consistente la incertidumbre hidrológica y climática que los enfoques convencionales basados en escenarios únicos de diseño, facilitando además su aplicación sistemática en contextos reales de ingeniería. En el cierre volveré a estas mismas tres hipótesis para distinguir las evidencias disponibles y las **comprobaciones pendientes**.

**Notas privadas:** Fuente: memoria definitiva, §1.4, pp. 11–12, y §8.6, p. 130. Automatización, integración modular y flujo reproducible son rótulos abreviados; los enunciados son los de la memoria. H1 incluye eficiencia y reproducibilidad: hay evidencia de ejecución viable, pero falta medir el ahorro sistemático frente al trabajo manual. H2 y H3 se cierran con alcance limitado por los casos.

**Transición:** Para contrastarlas, el trabajo se organiza mediante los siguientes **objetivos**.

### 11. Objetivo general y objetivos específicos

**Bloque:** Introducción · **Apartado:** Objetivos · **Tiempo orientativo:** 2 min 06 s

**Idea que debe quedar:** Relacionar cada objetivo con una evidencia que aparecerá en la defensa.

**Recorrido visual:**

1. Leer una fila completa: objetivo, desarrollo y evidencia
2. Recorrer los cuatro objetivos

**Diálogo**

El **objetivo general** es desarrollar y validar un **núcleo científico modular** que permita aplicar el análisis probabilístico de inundaciones bajo incertidumbre climática e hidrológica, y demostrar su transferencia mediante una **plataforma reproducible**.

Ese objetivo se concreta en **cuatro compromisos**. El **primero** integra datos y modelos de cambio climático en los flujos estocásticos. El **segundo** implementa y conecta la **generación** de eventos de precipitación y caudal. El **tercero** automatiza la configuración, ejecución y postprocesado de los modelos hidrológicos e hidráulicos. El **cuarto** consolida y documenta la librería y su despliegue en una plataforma, y los valida mediante casos reproducibles. Estos objetivos definen los **requisitos** a los que debe responder el desarrollo tecnológico.

Los objetivos están agrupados en la diapositiva para mostrar su conexión. **Datos y clima** proporcionan las entradas y los escenarios de cambio; generación convierte la información estadística en realizaciones plausibles; **modelización** transforma esas realizaciones en respuestas físicas; y **documentación y validación** permiten examinar lo obtenido. Cada compromiso necesita una salida comprobable: una serie documentada, un conjunto de eventos, una ejecución de modelo o un procedimiento que otro usuario pueda revisar. Los objetivos no exigen que todos los casos utilicen todos los módulos, sino que las combinaciones necesarias puedan organizarse de forma consistente.

**Notas privadas:** Explicación funcional de los mismos objetivos de la memoria, que denominan pyhydra al núcleo e HYDRA a la plataforma. Aquí se presentan sus requisitos antes de dar nombre a la respuesta tecnológica, en la diapositiva siguiente. Leer una fila objetivo–desarrollo–evidencia y recorrer las otras tres.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Estos requisitos permiten presentar cómo se materializa la **respuesta tecnológica**.

### 12. De los objetivos a pyhydra e HYDRA

**Bloque:** Introducción · **Apartado:** Respuesta tecnológica · **Tiempo orientativo:** 2 min 18 s

**Idea que debe quedar:** Presentar pyhydra como respuesta a los objetivos e hipótesis, distinguir la plataforma y explicar su nombre.

**Recorrido visual:**

1. Requisitos derivados de las hipótesis y los objetivos
2. pyhydra: núcleo científico; HYDRA: plataforma
3. Origen del nombre: hidra de la mitología griega y logotipo oficial

**Diálogo**

Las **hipótesis y los objetivos** anteriores fijan los **requisitos** del desarrollo: automatizar el cálculo, organizarlo en módulos y conservar la información necesaria para repetirlo. Para **dar respuesta** a esos requisitos se desarrolla **pyhydra**, la librería de Python que reúne el **núcleo científico**.

**HYDRA designa la plataforma** que integra ese núcleo con la web, los notebooks y los servicios de ejecución. Así distinguimos la implementación de los métodos y las formas de utilizarlos y documentarlos.

El nombre **HYDRA** evoca a la **hidra de la mitología griega**. Sus múltiples cabezas sobre un mismo organismo representan aquí **funciones especializadas** que trabajan de forma coordinada: datos, estadística, escenarios y modelos físicos conectados en un flujo común. La metáfora expresa la **modularidad y la integración** de la propuesta.

En la figura, las hipótesis y los objetivos aparecen como requisitos de partida. La caja de pyhydra identifica la implementación del núcleo científico; la de HYDRA, los recursos con los que se utiliza y documenta. A la derecha se muestra el emblema oficial, junto a la referencia a la **mitología griega**. La imagen representa la idea de funciones especializadas conectadas a un conjunto común. Esta distinción será útil al interpretar los casos: una función puede utilizarse desde Python, desde un notebook o desde una interfaz web sin que esas tres formas de acceso constituyan tres métodos científicos diferentes.

La aportación se valorará por esa integración, por la posibilidad de repetir el análisis y por su **transferencia a problemas reales**.

**Notas privadas:** Secuencia causal: pregunta → hipótesis → objetivos → requisitos → desarrollo de pyhydra → integración en HYDRA. El Besaya aporta el antecedente científico, no el origen causal del software. Significado del nombre: memoria definitiva, cap. 1, apartado 1.2, p. 10, nota al pie 1. No inventar un acrónimo. La metáfora representa módulos autónomos e integrados en un flujo unificado.

**Transición:** El nombre identifica la solución; veamos ahora cómo conecta las etapas del análisis.

### 13. Qué necesita una modelación estocástica de inundaciones

**Bloque:** Estado de la técnica · **Apartado:** Modelación estocástica · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Explicar la cadena estocástica antes de comparar arquitecturas.

**Recorrido visual:**

1. Serie corta de partida
2. Población de escenarios
3. Mapa por escenario y curva final

**Diálogo**

La figura recorre la cadena necesaria para una modelación estocástica. A partir de una serie se generan **escenarios plausibles**, que se transforman mediante los **modelos físicos** en **respuestas hidráulicas**. Un mapa de calado representa el resultado de una de esas ejecuciones.

Al reunir muchos resultados podemos construir la **curva de frecuencia** situada al final y estimar la **probabilidad de superar un calado**. La banda expresa la **incertidumbre** de esa estimación. Así conectamos los escenarios con la variable de decisión.

Podemos leer los cinco pasos de la figura como una transformación progresiva. La **serie observada** aporta información limitada sobre la variabilidad. El **generador** produce realizaciones bajo sus hipótesis. Los modelos físicos las convierten en respuestas, y cada mapa describe un escenario concreto. La **curva final** reúne esas respuestas para relacionar un calado con su frecuencia. Para leerla fijamos un período de retorno en el eje horizontal y buscamos el calado correspondiente; la banda recuerda que esa estimación tampoco es exacta. Los mapas individuales son realizaciones del cálculo, mientras que la curva resume el comportamiento del conjunto.

Los años sintéticos amplían las realizaciones disponibles bajo unas hipótesis; **no añaden nuevas observaciones**. Por eso debemos revisar los diagnósticos del generador y la adecuación de los modelos antes de interpretar la curva.

**Notas privadas:** Los años sintéticos son realizaciones del modelo. La curva final está condicionada a las hipótesis del generador y de los motores.

**Transición:** Podemos ahora comparar esas necesidades con la cobertura de **otros marcos**.

### 14. Posicionamiento frente a los marcos integrados más próximos

**Bloque:** Estado de la técnica · **Apartado:** Estado de la técnica · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Localizar la brecha mediante la matriz comparativa.

**Recorrido visual:**

1. Columnas: capacidades; filas: marcos
2. Diferenciar capacidad completa y parcial
3. Combinación de capacidades de HYDRA

**Diálogo**

La **matriz** permite situar la propuesta frente a los marcos revisados en la memoria. Compara su cobertura de las capacidades indicadas mediante marcas completas o parciales. **CLIMADA** aborda riesgo climático; **RainyDay** genera tormentas por transposición; **wflow y HydroMT** facilitan la preparación de modelos. Los enfoques de simulación continua pueden alcanzar el impacto, con implementaciones vinculadas a determinados dominios.

Las filas representan **ocho capacidades** y las columnas, los marcos comparados. Una marca completa indica cobertura; una parcial, cobertura limitada o dependiente de recursos externos; el guion indica ausencia en el alcance revisado. Las primeras filas se refieren a datos y tratamiento estadístico; las siguientes, a generación, clima y motores; las últimas, al período de retorno del impacto y a la transferencia del producto. La lectura útil consiste en seguir una necesidad a través de varias filas. La tabla compara cobertura funcional según la memoria; no establece una clasificación universal de velocidad, exactitud o calidad para cualquier aplicación.

La comparación identifica la combinación que aborda HYDRA: datos heterogéneos, extremos, dependencia, escenarios y motores físicos dentro de un flujo reutilizable que calcule la **frecuencia del impacto**. Esa **cobertura conjunta** delimita la propuesta. La elección de una herramienta para un estudio concreto depende también de sus requisitos y del ámbito de aplicación.

**Notas privadas:** Comparación funcional documentada en la memoria. Las marcas de capacidad parcial requieren considerar el alcance de cada marco y su dominio. Evitar afirmar superioridad universal.

**Transición:** La **arquitectura de HYDRA** organiza las responsabilidades para cubrir esa combinación.

### 15. La arquitectura del sistema de tres niveles

**Bloque:** Arquitectura · **Tiempo orientativo:** 1 min 42 s

**Idea que debe quedar:** Un mismo núcleo científico, tres formas de acceso.

**Recorrido visual:**

1. Base: núcleo científico
2. Centro: API y JupyterLab
3. Arriba: acceso desde la web

**Diálogo**

La figura separa **tres responsabilidades**. En la base, **pyhydra** contiene el cálculo científico: los métodos que transforman los datos y producen los resultados. En el nivel intermedio están los servicios que permiten ejecutarlo. La **API** responde a las herramientas interactivas; **JupyterLab** permite trabajar con código y conservar el análisis en notebooks. En la parte superior, la **web** reúne la documentación, las herramientas y los casos de estudio.

El recorrido del cálculo atraviesa esos niveles en ambos sentidos. Un usuario introduce datos o parámetros en la **interfaz**; el **servicio** solicita la operación al **núcleo**; el núcleo devuelve un resultado que la interfaz presenta. El notebook ofrece otra forma de trabajar con ese cálculo, conservando código y pasos intermedios. Separar responsabilidades permite revisar una transformación científica sin depender del diseño de su formulario. También permite mantener una interfaz mientras se actualiza una operación del núcleo, siempre que se conserve y documente su contrato de entrada y salida.

La separación permite utilizar un **mismo método** desde distintas formas de acceso. Los contenedores conservan sus dependencias de ejecución.

**Notas privadas:** La figura representa responsabilidades funcionales. pyhydra calcula; API y notebooks lo ejecutan; la web facilita el acceso. Datos, configuración y licencias siguen siendo requisitos de reproducción.

**Transición:** Sobre esta arquitectura se organizan los cuatro módulos funcionales que voy a explicar.

### 16. Cuatro módulos funcionales, un núcleo científico

**Bloque:** Arquitectura · **Tiempo orientativo:** 2 min 30 s

**Idea que debe quedar:** Reconocer los cuatro módulos de la web y distinguirlos de la organización interna del código.

**Recorrido visual:**

1. Fuentes de datos
2. Análisis climático
3. Generación estocástica
4. Modelización
5. Franja inferior: correspondencia con los paquetes del código

**Diálogo**

Las **cuatro columnas** corresponden a los módulos de la web: **fuentes de datos**, **análisis climático**, **generación estocástica** y **modelización**. Sus **productos** se conectan: series documentadas, distribuciones y escenarios, **realizaciones sintéticas** y respuestas físicas. Cada estudio utiliza los componentes necesarios.

La columna de fuentes de datos reúne lluvia, caudal, proyecciones y suelos. La de análisis climático incluye series y extremos, análisis espacial, corrección de sesgo y downscaling híbrido. La generación estocástica produce múltiples realizaciones con variabilidad y dependencia. La modelización conecta HEC-HMS, SWAT, SFINCS y HEC-RAS y añade el análisis de sensibilidad hidráulica. Las rutas de código indican dónde se implementan esas capacidades. La franja inferior explica por qué los cuatro módulos de la web no equivalen a cuatro paquetes independientes: análisis y generación comparten **climate**. Este dibujo es un mapa funcional; cada caso elegirá su propia cadena de operaciones.

¿Por qué separamos análisis climático y generación estocástica si ambos están dentro de climate? Porque esta diapositiva explica **funciones metodológicas**, no paquetes de programación. El análisis **caracteriza las series**, sus extremos y dependencias, y trata el sesgo o la señal de cambio climático. La generación utiliza la caracterización estadística para producir múltiples realizaciones sintéticas con la variabilidad y dependencia consideradas. Se distinguen para explicar qué hace cada parte y qué entrega a la siguiente, aunque comparten métodos y se implementan en el mismo paquete climate. Por tanto, hay cuatro módulos funcionales en la web y **tres paquetes** principales en el código: data_sources, climate y modeling. Ahora explicaré sus **operaciones y comprobaciones**, siguiendo el recorrido científico.

**Notas privadas:** Mantener los cuatro nombres de la web. No confundir cuatro módulos funcionales con tres paquetes del código (data_sources, climate y modeling) ni con los tres niveles de arquitectura (núcleo, servicios e interfaz). El downscaling híbrido integra etapas y utiliza otros componentes; el diagrama muestra su ubicación, no cuatro etapas obligatorias.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Comenzaré por el **bloque de datos** y sus fuentes.

### 17. Fuentes de datos

**Bloque:** Metodología · **Tiempo orientativo:** 1 min 42 s

**Idea que debe quedar:** Mostrar qué transforma un adaptador de datos y qué conserva.

**Recorrido visual:**

1. Cinco familias de fuentes a la izquierda
2. Adaptadores en el centro
3. Salida común y metadatos a la derecha

**Diálogo**

Las fuentes de la izquierda aportan observaciones, reanálisis, satélites, caudales, suelos y proyecciones. El adaptador central recibe una **variable, un dominio y un período**; descarga y convierte unidades, coordenadas y tiempos a **estructuras comunes**. La salida de la derecha conserva valores y **metadatos** de procedencia.

La figura distingue las **familias de fuentes**, los **adaptadores** y una **salida común** organizada por tiempo, espacio y variable. Cuando corresponde, se utiliza UTC para la referencia temporal y WGS84 para las coordenadas. La fuente, la fecha y la consulta se conservan como metadatos. Esto permite reconstruir de dónde procede un valor y evitar comparar, por ejemplo, acumulaciones con unidades o intervalos distintos. Estaciones, reanálisis y satélite aportan información de naturaleza diferente: antes de combinarlos debemos comprobar qué representa cada producto y cuál es su resolución útil para el problema.

Antes de ajustar modelos revisamos **ausencias**, cobertura, resolución y **representatividad**. Una serie de **ERA5** puede aportar continuidad temporal, pero sus extremos locales deben **contrastarse con estaciones**. Homogeneizar formatos permite conectar etapas; **no convierte** todas las fuentes en observaciones equivalentes.

**Notas privadas:** La salida común no garantiza calidad física. Revisar unidades, ausencias, representatividad y metadatos antes del análisis.

**Transición:** Una vez revisadas las series, podemos estudiar la **frecuencia de sus extremos**.

### 18. Extremos y distribuciones GEV

**Bloque:** Metodología · **Tiempo orientativo:** 1 min 42 s

**Idea que debe quedar:** Un valor de diseño debe leerse junto con su incertidumbre.

**Recorrido visual:**

1. Izquierda: parámetros de la GEV
2. Derecha: puntos y curvas
3. Períodos mayores: extrapolación y bandas

**Diálogo**

Partimos de **máximos anuales** y ajustamos la GEV mediante **localización, escala y forma**; este último parámetro controla la cola. Comparamos **máxima verosimilitud**, **L-momentos** o **inferencia bayesiana** según los datos y supuestos.

En la gráfica, los **puntos negros** representan máximos anuales de la muestra. La **línea azul** ilustra máxima verosimilitud; la **roja discontinua**, L-momentos; y la **verde**, una aproximación bayesiana. La **gris punteada** es la distribución de referencia de este ejemplo. Para comparar estimadores fijamos el mismo período de retorno y leemos la altura de sus curvas. En períodos elevados se separan porque la información sobre la cola es escasa. Las bandas muestran **incertidumbre** alrededor de las estimaciones; no convierten una extrapolación en una observación. Esta figura sirve para explicar esa sensibilidad, sin demostrar que un estimador concreto sea siempre superior.

Cuando una estación tiene pocos datos, el **análisis regional** puede aportar información de **estaciones homogéneas**, normalizada y reescalada localmente. La homogeneidad debe justificarse. La referencia punteada solo se conoce en esta **figura ilustrativa**.

**Notas privadas:** Memoria: §5.2 (GEV/GPD, estimadores e incertidumbre) y §5.3.1 (AFR). GEV sobre máximos de bloque y GPD sobre excedencias independientes son enfoques distintos. AFR: diagnosticar discordancia/heterogeneidad, normalizar por índice local, ajustar distribución regional y reescalar. No atribuir sus resultados a la curva ilustrativa de la derecha. Bootstrap, posterior MCMC y aproximación Fisher de la demo no son intercambiables.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Las cópulas añaden la **dependencia entre variables** a sus distribuciones individuales.

### 19. Dependencia multivariante y cópulas

**Bloque:** Metodología · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** La dependencia determina qué combinaciones deben simularse.

**Recorrido visual:**

1. Ejes Q y SL y puntos observados
2. Distribuciones marginales en los bordes
3. Curvas AND/OR y cruces de máxima densidad

**Diálogo**

El caudal horizontal y el nivel del mar vertical tienen **distribuciones marginales** propias, representadas en los bordes. Ajustamos esas marginales y después una **cópula** para conservar su **dependencia** al generar pares. Los **puntos negros** son observaciones y los **grises**, realizaciones.

Los paneles de los bordes muestran la **densidad marginal** de cada variable: indican dónde se concentran sus valores por separado. La nube central añade la información de cómo coinciden caudal y nivel del mar. Una cópula permite representar esa dependencia separadamente de las marginales. En las isolíneas podemos movernos entre un caudal mayor y un nivel menor, o al contrario, conservando una misma definición de frecuencia conjunta. La combinación de **máxima densidad** señalada con una cruz es una referencia estadística; no tiene por qué producir el mayor calado. Esa respuesta depende también de la geometría y de las condiciones del modelo hidráulico.

Las curvas **AND**, rojas, exigen superar **ambos umbrales**; las **OR**, azules, **al menos uno**. Las cruces localizan máxima densidad sobre cada curva. Un mismo período de retorno conjunto admite **muchas parejas**, con impactos diferentes. Por eso propagamos las combinaciones por el modelo físico antes de asignar **frecuencia al impacto**.

**Notas privadas:** Q está en m³/s y SL en metros. AND: ambos umbrales; OR: al menos uno. Las cruces MPDE localizan máxima densidad sobre una isolínea: no equivalen automáticamente a máxima respuesta hidráulica.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Antes de generar escenarios futuros, debemos tratar el sesgo de las proyecciones climáticas.

### 20. Cambio climático: corregir el sesgo antes de propagar escenarios

**Bloque:** Metodología · **Apartado:** Análisis climático · **Tiempo orientativo:** 1 min 54 s

**Idea que debe quedar:** Explicar qué se compara, qué se corrige y qué incertidumbre permanece.

**Recorrido visual:**

1. Tres entradas: referencia, control y futuro
2. Métodos: delta o corrección de distribuciones
3. Escenarios corregidos y controles

**Diálogo**

Para incorporar cambio climático necesitamos **tres entradas**: observaciones, histórico del modelo y proyección futura. El **período histórico común** permite caracterizar **diferencias sistemáticas**. El método **delta** aplica cambios mensuales; el **mapeo cuantil** corrige la distribución. **QDM y SDM** permiten tratar la señal de cambio según el método elegido.

En las tres cajas superiores, las **observaciones y el histórico del modelo** deben compararse durante un período común. La proyección futura aporta el escenario que queremos transformar. En el método delta, la temperatura puede tratarse con cambios aditivos y la precipitación con factores multiplicativos. El mapeo cuantil trabaja sobre las distribuciones; sus variantes cambian cómo trasladan la señal futura. Por eso hay que declarar la opción utilizada. La caja de salida conserva la referencia, el modelo, el método y el horizonte. La franja inferior recuerda las comprobaciones: ajustar una media no garantiza representar correctamente la frecuencia de lluvia ni sus extremos.

La salida es un **escenario corregido y documentado**, que podrá alimentar la generación o los modelos físicos. **Comprobamos** medias, frecuencia de precipitación y extremos según la variable. Corregir sesgos **no elimina** la incertidumbre climática ni garantiza reproducir cualquier extremo local.

**Notas privadas:** Fuente: memoria §5.5, pp. 65–66. Delta aditivo para temperatura y multiplicativo para precipitación; EQM empírico; QDM multiplicativo; SDM paramétrico gamma/normal. Preservación de la señal depende de método y variable, no atribuirla por igual a todos. Conservar referencia, período histórico común, modelo, escenario, horizonte y configuración. Comprobar calidad de referencia, extrapolación y resultados físicos; no presentar una variante universal ni una validación automática fuera de muestra.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con esos **escenarios corregidos** podemos generar realizaciones sintéticas coherentes.

### 21. Generación estocástica de escenarios

**Bloque:** Metodología · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Generar, comprobar propiedades y seleccionar escenarios representativos.

**Recorrido visual:**

1. Tres gráficos: media, dispersión y autocorrelación
2. Barras de la serie de entrada y línea simulada
3. Condición previa a usar las realizaciones

**Diálogo**

El generador se elige según el problema: **NEOPRENE** representa lluvia mediante tormentas y células, en un punto con **NSRP** o en varias estaciones con **STNSRP**. **CoSMoS** reproduce una distribución marginal y su dependencia temporal.

**Calibramos** con las series de entrada y generamos realizaciones; después **comprobamos** estacionalidad, dispersión, persistencia y, cuando corresponde, **dependencia espacial**. Los **tres gráficos** comparan media mensual, desviación típica y autocorrelación. Aquí la entrada «observado» **también es sintética**: explica el diagnóstico, sin validar todos los generadores. La salida es un **ensemble** que alimentará los modelos físicos.

En los tres gráficos, las **barras verdes** representan la entrada y la **línea naranja**, el resultado simulado de la demostración. El primero compara la evolución estacional de la media; el segundo, cuánto varían los valores alrededor de ella; el tercero, la relación con el valor del paso temporal anterior. Se aprecia una buena coincidencia de las medias, mientras que la autocorrelación presenta diferencias en varios meses. Ese diagnóstico importa: dos series pueden tener medias parecidas y una persistencia distinta. Si alimentan un modelo hidrológico, la duración y la secuencia de las entradas pueden influir en la respuesta. La comparación debe hacerse antes de utilizar las realizaciones en un estudio de diseño.

**Notas privadas:** Memoria: §5.4. NEOPRENE (NSRP/STNSRP) y CoSMoS son librerías externas integradas como envoltorios. En lluvia también se comprueban frecuencia de días secos/húmedos y extremos; en multisitio, correlación espacial y simultaneidad. La captura es una demo sintética con simulación rápida AR(1) estacional y transformación marginal, no una ejecución completa de STNSRP. Selección MaxDiss y reconstrucción k-NN se explican después de los motores físicos.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Los **modelos físicos** transforman después esos escenarios en caudales y calados.

### 22. Modelos hidrológicos e hidráulicos

**Bloque:** Metodología · **Tiempo orientativo:** 1 min 42 s

**Idea que debe quedar:** Los adaptadores conectan escenarios y respuestas físicas.

**Recorrido visual:**

1. Escenarios de entrada
2. Preparar, ejecutar, homogeneizar y validar
3. HEC-HMS, SWAT+, SFINCS y HEC-RAS

**Diálogo**

El modelo hidrológico convierte lluvia en **hidrogramas**; el hidráulico transforma caudales y condiciones de contorno en **calados, velocidades y extensión** inundada. **HEC-HMS y SWAT+** cubren la primera tarea; **HEC-RAS y SFINCS**, la segunda.

El adaptador **prepara archivos**, ejecuta el motor con su **versión registrada**, homogeneiza las salidas y comprueba unidades, rangos y finalización. Obtenemos **respuestas comparables** por escenario. La geometría, la rugosidad, las condiciones de contorno y la estabilidad numérica requieren **revisión experta**.

Las cuatro operaciones del adaptador tienen salidas verificables. **Preparar** produce los archivos y parámetros que espera el motor. **Ejecutar** registra cómo terminó el proceso y con qué versión. **Homogeneizar** convierte sus resultados a estructuras y unidades comunes, y **validar** comprueba que existen, tienen unidades coherentes y permiten continuar. Esto es distinto de demostrar que el modelo reproduce el comportamiento observado del sistema. La revisión física incluye la geometría, las estructuras, las condiciones de contorno y las decisiones de calibración. La figura separa ambas tareas para que la automatización de una ejecución no se confunda con la validación completa de un modelo.

**Notas privadas:** El esquema del adaptador distingue preparación, ejecución, homogeneización y validación. Diferenciar las comprobaciones de ejecución de la validación física frente a observaciones.

**Transición:** Veamos cómo obtener impactos para el ensemble completo sin simularlo íntegramente.

### 23. Del ensemble a los mapas de período de retorno

**Bloque:** Metodología · **Apartado:** Propagación del impacto · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Mostrar cómo el ensemble se transforma en frecuencia del impacto y cómo se comprueba la reconstrucción.

**Recorrido visual:**

1. N escenarios → MaxDiss → n simulaciones
2. Mapas físicos → k-NN → ensemble de impactos
3. Validación cruzada y frecuencia por celda

**Diálogo**

Simular físicamente todos los escenarios puede resultar costoso. El esquema separa **N escenarios** de un **subconjunto n**: **MaxDiss** selecciona realizaciones que cubren su variabilidad. Ejecutamos esas realizaciones y **k-NN** reconstruye los mapas restantes a partir de escenarios similares.

La primera caja contiene el **ensemble completo N**, con sus descriptores y su frecuencia de ocurrencia. MaxDiss escoge un subconjunto que cubre el espacio considerado; esa selección no convierte a todos los representantes en eventos equiprobables. La caja central recoge las **n simulaciones físicas**, y k-NN utiliza escenarios próximos para reconstruir respuestas no simuladas. La validación del panel inferior izquierdo reserva mapas conocidos y los compara con sus reconstrucciones. El panel derecho reúne después los impactos para estimar frecuencia por celda. Así se mantienen separadas dos preguntas: cuánto error introduce reconstruir un mapa y qué frecuencia corresponde al calado obtenido.

**Validamos excluyendo** simulaciones conocidas y comparando sus mapas reconstruidos con los físicos: **error de calado**, **acierto de extensión** y **cuantiles altos**. Si la cobertura es insuficiente, **ampliamos o revisamos** la selección. Finalmente estimamos la **frecuencia del calado** en cada celda, conservando la duración representada o los **pesos de ocurrencia**. Esa frecuencia corresponde al **impacto**.

**Notas privadas:** Fuente: memoria §5.6–5.6.1, pp. 66–68. MaxDiss cubre el espacio de descriptores; su selección no asigna probabilidad ni garantiza representatividad hidráulica por sí sola. k-NN interpola mapas usando vecinos y pesos; exige validación cruzada por aplicación. Métricas: RMSE/sesgo de calado, CSI y sobre/infrapredicción de extensión, error en cuantiles altos. Conservar la frecuencia del ensemble completo; no asignar el mismo peso a cada representante MaxDiss por defecto. Estimar T sobre máximos/ocurrencias de impacto según el diseño temporal y los supuestos del estudio. La validación de reconstrucción contra el motor no equivale a validación contra observaciones.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con los cuatro módulos y su conexión ya explicados, entremos por primera vez en HYDRA para reconocerlos en la web.

### 24. Primera visita a HYDRA: del núcleo al navegador

**Bloque:** Metodología · **Apartado:** Navegación por HYDRA · **Tiempo orientativo:** 2 min 48 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Conservar una primera entrada explícita en HYDRA y orientar al tribunal antes de mostrar operaciones concretas.

**Recorrido visual:**

1. Portada y navegación principal
2. Accesos a documentación, herramientas y casos/notebooks
3. Relación con el núcleo científico

**Diálogo**

Una vez explicados los cuatro módulos y cómo se conectan sus operaciones, entramos por **primera vez en HYDRA** para reconocer su organización en la web. La portada permite reconocer los accesos a la **documentación de los módulos**, las **herramientas interactivas** y los **casos de estudio** con sus notebooks.

La primera entrada que señalo es la **documentación de módulos**, donde se explica qué hace cada bloque y qué necesita. La segunda son las **herramientas**, que permiten ejecutar operaciones acotadas desde formularios y leer sus salidas. La tercera son los **casos**, que sitúan esas operaciones en un problema y enlazan los materiales disponibles. En esta primera visita no ejecutaremos aún una cadena territorial completa. El objetivo es reconocer esos accesos y la función que tendrán en el resto de la defensa, para que cada cambio entre diapositiva y web conserve una finalidad clara.

La web reúne esos recursos y los conecta con el **núcleo científico**. Aquí situamos **esas tres entradas**; después utilizaremos una herramienta e interpretaremos resultados concretos. Los cuatro módulos que acabamos de explicar proporcionan el cálculo científico. A continuación veremos cómo se accede a algunas de sus operaciones desde las herramientas web.

**Notas privadas:** Primera visita necesaria, situada después de los módulos y antes de las herramientas web. Navegación de orientación, distinta de la demostración GEV y de las páginas de resultados. No saltarla. Evitar recorrer menús o ejecutar cálculos todavía. No dejar recuadros de resaltado sobre la portada.

**Acción en la web:** Entrar por primera vez en la portada. Mostrar los accesos a módulos, herramientas y casos/notebooks sin ejecutar todavía una herramienta. Volver al relato al pasar de diapositiva.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

Tras explicar los cuatro módulos y su conexión, esta captura muestra nuestra **primera entrada** en la **portada de HYDRA**. En ella se reconocen los accesos a la **documentación de los módulos**, las **herramientas interactivas** y los **casos de estudio** con sus notebooks.

La primera entrada que señalo es la **documentación de módulos**, donde se explica qué hace cada bloque y qué necesita. La segunda son las **herramientas**, que permiten ejecutar operaciones acotadas desde formularios y leer sus salidas. La tercera son los **casos**, que sitúan esas operaciones en un problema y enlazan los materiales disponibles. En esta primera visita no ejecutaremos aún una cadena territorial completa. El objetivo es reconocer esos accesos y la función que tendrán en el resto de la defensa, para que cada cambio entre diapositiva y web conserve una finalidad clara.

Esta vista reúne los recursos que acompañan al **núcleo científico**. Esta copia utiliza **capturas preparadas** para conservar el recorrido sin conexión. Después veremos la configuración de una herramienta y sus resultados. Los módulos y su conexión ya han quedado explicados. A continuación veremos cómo las herramientas web permiten configurar operaciones concretas de ese núcleo y leer sus resultados.

**[Demos preparadas: muestra las capturas locales en orden: Plataforma. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Una vez situados en la plataforma, veamos cómo se utilizan sus herramientas interactivas.

### 25. Herramientas interactivas en la nube

**Bloque:** Metodología · **Apartado:** Herramientas interactivas · **Tiempo orientativo:** 1 min 48 s

**Idea que debe quedar:** La interfaz facilita el acceso; la interpretación exige conocer el método.

**Recorrido visual:**

1. Herramientas disponibles
2. API común
3. Núcleo científico

**Diálogo**

Los accesos de la plataforma permiten utilizar **extremos**, **cópulas**, **series sintéticas**, curvas **IDF**, **análisis regional** y **corrección de sesgo**. El esquema inferior muestra el **recorrido común**: la web envía **entradas y parámetros** a la **API**, **pyhydra** calcula y devuelve resultados.

Estos accesos corresponden a preguntas concretas. Extremos estima cuantiles y su incertidumbre; cópulas, combinaciones de variables dependientes; series sintéticas, realizaciones temporales; IDF, relaciones entre intensidad, duración y frecuencia; análisis regional, estimaciones que comparten información entre estaciones; y corrección de sesgo, transformación de proyecciones respecto a una referencia. El esquema inferior muestra su acceso común al núcleo. La pantalla facilita configurar una operación, pero cada resultado debe interpretarse junto con la serie utilizada, el método seleccionado y sus hipótesis. Las demostraciones siguientes recorrerán tres operaciones diferenciadas: generar eventos dependientes, interpolar una variable en el espacio y calcular una respuesta hidráulica.

La interfaz hace accesible el cálculo; interpretar sus **hipótesis y límites** exige criterio técnico. Comenzaré por las cópulas, continuaré con la interpolación espacial y cerraré con el **modelado hidráulico**. En cada herramienta identificaremos las entradas, la operación y la lectura del resultado.

**Notas privadas:** Esta diapositiva explica el acceso al método; la siguiente demuestra su operación. La explicación y la interacción se cronometran por separado en el ensayo de esta versión amplia.

**Transición:** Empecemos con las cópulas: veremos cómo se generan combinaciones que conservan la dependencia entre variables.

### 26. Demostración guiada: cópulas de eventos

**Bloque:** Metodología · **Apartado:** Demostración de cópulas · **Tiempo orientativo:** 3 min 54 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Mostrar que generar eventos exige representar marginales y dependencia, y comprobar ambas.

**Recorrido visual:**

1. Demo: variables y número de muestras
2. Nubes de entrada y sintéticas por parejas
3. Marginales y matrices de correlación

**Diálogo**

Esta demostración permite reconocer cómo se representan las dependencias al generar eventos sintéticos. Utilizo la opción Demo, que contiene **ochenta eventos artificiales**. Selecciono caudal máximo y volumen como variables continuas, y mantengo la estación del año como variable discreta. Solicito **mil realizaciones** y pulso «Ajustar cópula». No son observaciones del Besaya ni de otro caso de estudio.

En los diagramas por parejas, los ejes identifican las dos variables comparadas. Los **puntos verdes** corresponden a la muestra de entrada y los **violetas**, a los eventos generados. La forma y orientación de la nube muestran cómo varían conjuntamente las variables: por ejemplo, si los caudales elevados tienden a acompañarse de volúmenes mayores. La generación busca conservar esa estructura sin repetir los mismos eventos de entrada.

Después comparo las distribuciones **marginales** y las matrices de **correlación** de la muestra y de la generación. Las marginales describen cada variable por separado; las matrices resumen asociaciones entre variables. En esta comparación me centro en la relación entre caudal máximo y volumen; la estación del año es una categoría discreta, no una magnitud continua. Una coincidencia aproximada es un **diagnóstico** del ajuste, pero no garantiza por sí sola la reproducción de toda la dependencia extrema. FloodEventCopula combina marginales ajustadas con una **cópula gaussiana**.

La página incluye además un análisis bivariante de períodos de retorno conjuntos. Es una operación distinta de la generación multivariante que acabamos de recorrer. Para esta visita me centro en las nubes, las marginales y las correlaciones; el ejemplo completo de curvas AND y OR queda disponible en los anexos. La utilidad de estos eventos consiste en alimentar después los **modelos físicos** con combinaciones plausibles, conservando las hipótesis del ajuste.

**Notas privadas:** Los eventos de la demo son artificiales. En los gráficos «Observado» identifica la entrada, no observaciones de campo. La generación multivariante usa FloodEventCopula y cópula gaussiana; el panel de períodos conjuntos bivariantes es otro análisis.

**Acción en la web:** Utilizar Demo, Qmax y volume como variables continuas, season como discreta y 1000 muestras; pulsar Ajustar cópula. Comparar las nubes de entrada y sintéticas, las marginales y las matrices de correlación. No ejecutar otra operación durante esta visita.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

Esta demostración permite reconocer cómo se representan las dependencias al generar eventos sintéticos. Utilizo la opción Demo, que contiene ochenta **eventos artificiales**. Selecciono caudal máximo y volumen como variables continuas, y mantengo la estación del año como variable discreta. Las capturas conservan el resultado de solicitar mil realizaciones. No son observaciones del Besaya ni de otro caso de estudio.

En los diagramas por parejas, los ejes identifican las dos variables comparadas. Los puntos verdes corresponden a la muestra de entrada y los violetas, a los eventos generados. La forma y orientación de la nube muestran cómo varían conjuntamente las variables: por ejemplo, si los caudales elevados tienden a acompañarse de volúmenes mayores. La generación busca conservar esa estructura sin repetir los mismos eventos de entrada.

En la **segunda captura** comparo las distribuciones **marginales** y, en la tercera, las matrices de **correlación** de la muestra y de la generación. Las marginales describen cada variable por separado; las matrices resumen asociaciones entre variables. En esta comparación me centro en la relación entre caudal máximo y volumen; la estación del año es una categoría discreta, no una magnitud continua. Una coincidencia aproximada es un diagnóstico del ajuste, pero no garantiza por sí sola la reproducción de toda la dependencia extrema. FloodEventCopula combina marginales ajustadas con una cópula gaussiana.

La página incluye además un análisis bivariante de períodos de retorno conjuntos. Es una operación distinta de la generación multivariante que acabamos de recorrer. Para esta visita me centro en las **nubes**, las marginales y las correlaciones; el ejemplo completo de curvas AND y OR queda disponible en los anexos. La utilidad de estos eventos consiste en alimentar después los modelos físicos con combinaciones plausibles, conservando las hipótesis del ajuste.

**[Demos preparadas: muestra las capturas locales en orden: Dependencia entre variables → Distribuciones marginales → Correlación. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Si la API no responde, utiliza las capturas preparadas de esta misma herramienta.]**

**Transición:** La dependencia relaciona variables; la interpolación responde a otra pregunta: qué estimamos entre las estaciones disponibles.

### 27. Demostración: interpolación espacial

**Bloque:** Metodología · **Apartado:** Demostración de interpolación · **Tiempo orientativo:** 3 min 30 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Diálogo**

En la herramienta selecciono Demo y comparo tres métodos sobre las mismas **ocho estaciones**: **IDW**, **kriging ordinario** y una función de **base radial**. Ejecuto la comparación con la **validación cruzada** activada. En el mapa, los puntos sitúan las estaciones y el campo continuo representa la variable interpolada en los puntos objetivo. La validación cruzada deja fuera una estación, predice su valor con las restantes y repite el proceso para calcular el **RMSE**. Así podemos comparar métodos con los **mismos datos** y no solo por el aspecto del mapa. La opción de kriging utilizada es ordinaria; no incluye aquí la covariable de elevación de un kriging universal. Tampoco convierte una red escasa en observaciones nuevas: la calidad sigue limitada por la distribución de estaciones y la estructura espacial de la variable.

Los puntos del mapa representan el **soporte observacional**; los valores entre ellos son estimaciones del interpolador. Un campo visualmente suave puede seguir teniendo errores importantes donde la red es escasa o cambia el régimen espacial. La validación **dejando una estación fuera** obliga a predecir un dato conocido sin utilizarlo en el ajuste de esa repetición. El RMSE resume esas diferencias en las unidades de la variable. Para comparar los tres métodos mantenemos las mismas estaciones y el mismo protocolo. El resultado informa sobre el comportamiento en esta muestra, sin garantizar el mismo error en todos los puntos del territorio ni en otro episodio.

**Notas privadas:** Captura de la ejecución local de /tools/interpolation. Demo de 8 estaciones; IDW, kriging ordinario y RBF. Señalar el mapa y el RMSE LOOCV. No presentar como reproducción de Andes o Mallorca ni como kriging universal con DEM.

**Acción en la web:** Ejecutar Demo con IDW, kriging ordinario y RBF; activar validación cruzada. Comparar mapas y RMSE utilizando la misma red de ocho estaciones.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

La captura compara métodos sobre la misma demo de **ocho estaciones**: **IDW**, **kriging ordinario** y una función de **base radial**. En el mapa, los puntos sitúan las estaciones y el campo continuo representa la variable interpolada en los puntos objetivo. La **validación cruzada** deja fuera una estación, predice su valor con las restantes y repite el proceso para calcular el **RMSE**. Así podemos comparar métodos con los **mismos datos** y no solo por el aspecto del mapa. Esta interfaz muestra kriging ordinario; no incluye aquí la covariable de elevación de un kriging universal. Tampoco convierte una red escasa en observaciones nuevas: la calidad sigue limitada por la distribución de estaciones y la estructura espacial de la variable.

Los puntos del mapa representan el **soporte observacional**; los valores entre ellos son estimaciones del interpolador. Un campo visualmente suave puede seguir teniendo errores importantes donde la red es escasa o cambia el régimen espacial. La validación **dejando una estación fuera** obliga a predecir un dato conocido sin utilizarlo en el ajuste de esa repetición. El RMSE resume esas diferencias en las unidades de la variable. Para comparar los tres métodos mantenemos las mismas estaciones y el mismo protocolo. El resultado informa sobre el comportamiento en esta muestra, sin garantizar el mismo error en todos los puntos del territorio ni en otro episodio.

**[Demos preparadas: muestra las capturas locales en orden: Mapa kriging → Validación LOOCV. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Si la API no responde, utiliza las capturas preparadas de esta misma herramienta.]**

**Transición:** Después de estimar las entradas en el espacio, pasemos a la respuesta física de un cauce idealizado.

### 28. Demostración guiada: modelado hidráulico

**Bloque:** Metodología · **Apartado:** Demostración de modelado · **Tiempo orientativo:** 3 min 30 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Explicar cómo las condiciones de entrada y de contorno modifican el perfil hidráulico.

**Recorrido visual:**

1. Controles del modelo idealizado
2. Perfil longitudinal y referencias normal y crítica
3. Cambio del contorno aguas abajo

**Diálogo**

Esta herramienta permite explorar la respuesta hidráulica de un **cauce idealizado**. En los controles fijamos el **caudal**, la pendiente, la **geometría** de la sección y la rugosidad de **Manning** del cauce y de las márgenes. Es un ejemplo didáctico; no representa un tramo calibrado del Besaya ni ejecuta aquí HEC-RAS o SFINCS.

Comienzo con la condición de **flujo uniforme**. En el perfil longitudinal, el eje horizontal representa la **distancia** y el vertical, la **cota**. El lecho aparece en la parte inferior y la línea azul representa la **lámina libre**. Las referencias de **calado** normal y crítico ayudan a interpretar el régimen. Debemos distinguir la cota de la lámina del calado, que es la distancia vertical hasta el lecho.

Cambio únicamente la condición de contorno a un **nivel impuesto** aguas abajo. Mantengo el resto de parámetros para observar cómo esa condición modifica el perfil. Si el nivel impuesto supera el correspondiente al flujo uniforme, aparece un **remanso**: la influencia del contorno se transmite hacia aguas arriba y la lámina deja de seguir paralela al lecho. La comparación permite relacionar una decisión de entrada con una respuesta física visible.

La sección transversal y la representación de la inundación completan la lectura del perfil. Sus resultados están condicionados por la geometría idealizada y los supuestos del cálculo. La herramienta facilita explorar esos efectos; aplicar el método a un proyecto real exige datos del terreno, condiciones de contorno justificadas y **validación**.

**Notas privadas:** Ejemplo didáctico de cauce idealizado mediante Manning y cálculo de perfil. No atribuir esta ejecución a HEC-RAS o SFINCS. Comparar las dos condiciones manteniendo los demás parámetros.

**Acción en la web:** Mostrar el flujo uniforme con los parámetros iniciales. Cambiar a nivel impuesto aguas abajo, conservando los demás parámetros, y comparar el perfil de lámina libre.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

Esta herramienta permite explorar la respuesta hidráulica de un **cauce idealizado**. En los controles fijamos el caudal, la pendiente, la geometría de la sección y la rugosidad de Manning del cauce y de las márgenes. Es un ejemplo didáctico; no representa un tramo calibrado del Besaya ni ejecuta aquí HEC-RAS o SFINCS.

La **primera captura** conserva la condición de **flujo uniforme**. En el perfil longitudinal, el eje horizontal representa la distancia y el vertical, la cota. El lecho aparece en la parte inferior y la línea azul representa la lámina libre. Las referencias de calado normal y crítico ayudan a interpretar el régimen. Debemos distinguir la cota de la lámina del calado, que es la distancia vertical hasta el lecho.

La **segunda captura** utiliza un **nivel impuesto** aguas abajo y mantiene los demás parámetros para mostrar el efecto del contorno. Si el nivel impuesto supera el correspondiente al flujo uniforme, aparece un **remanso**: la influencia del contorno se transmite hacia aguas arriba y la lámina deja de seguir paralela al lecho. La comparación permite relacionar una decisión de entrada con una respuesta física visible.

La sección transversal y la representación de la inundación completan la lectura del perfil. Sus resultados están condicionados por la geometría idealizada y los supuestos del cálculo. La herramienta facilita explorar esos efectos; aplicar el método a un proyecto real exige datos del terreno, condiciones de contorno justificadas y validación.

**[Demos preparadas: muestra las capturas locales en orden: Flujo uniforme → Nivel impuesto aguas abajo. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Si la API no responde, utiliza las capturas preparadas de esta misma herramienta.]**

**Transición:** Pasemos de este ejemplo didáctico al conjunto de casos que aporta la evidencia de la tesis.

### 29. Diez estudios, tres dimensiones de validación

**Bloque:** Casos y validación · **Tiempo orientativo:** 1 min 54 s

**Idea que debe quedar:** Cada caso aporta una evidencia y un alcance de reproducción distintos.

**Recorrido visual:**

1. Filas: aplicaciones
2. Columnas: componentes y disponibilidad en HYDRA
3. Tres preguntas de validación

**Diálogo**

Esta tabla sitúa los **diez estudios** que examinaremos y muestra qué componentes intervienen en cada uno. Las primeras columnas identifican el problema y su aplicación principal. Las cuatro columnas centrales indican **datos, clima o extremos, generación estocástica y modelización**. Las marcas permiten seguir qué parte de la cadena necesita cada estudio; un guion señala que ese componente no forma parte del alcance mostrado.

Los dos trabajos sobre el **Besaya** comparten dominio, pero responden a preguntas distintas: estimar la **frecuencia del impacto** y estudiar la **sensibilidad** a la rugosidad y al motor hidráulico. **Mallorca y Calle 30** recorren cadenas hasta el resultado hidráulico. **Valencia** se concentra en extremos e incertidumbre. **Tanganica, Andes, SIMPCCe y Panamá** muestran aplicaciones climáticas en dominios y decisiones diferentes. El contraste **IAHR 2022** permite examinar la influencia del procedimiento de diseño.

La última columna distingue **cuatro estudios con notebooks** —Besaya, rugosidades, Calle 30 y Valencia— de los seis documentados mediante publicaciones o proyectos. Tener un notebook permite consultar el procedimiento; ejecutarlo exige también los datos, las dependencias y los motores de cada flujo. La tabla presenta, por tanto, cobertura metodológica y disponibilidad de materiales, con alcances diferentes. Seguiremos los casos para interpretar qué evidencia aporta cada uno.

**Notas privadas:** Diez estudios, no diez emplazamientos distintos. Cuatro entradas con notebooks; seis documentadas. Los notebooks actuales del Besaya no equivalen a reproducir automáticamente el flujo manual histórico de Iber. HEC-RAS requiere Windows y SFINCS su ejecutable y entorno de cálculo.

**Transición:** El Besaya establece el primer principio: estimar la **frecuencia sobre el impacto**.

### 30. Besaya 2018: aquí nace la frecuencia sobre el impacto

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 12 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Mostrar dónde se calcula la frecuencia dentro de la cadena fundacional.

**Recorrido visual:**

1. Aforos y descripción multivariante
2. Hidrogramas generados y simulación con Iber
3. Distribución del impacto al final

**Diálogo**

En el esquema del Besaya seguimos el agua desde los **aforos** hasta el resultado hidráulico. Primero se extraen avenidas independientes y se describen mediante **pico, volumen y duración**. Una **cópula gaussiana** permite conservar su dependencia al generar nuevos hidrogramas plausibles.

Después, **Iber** transforma esos hidrogramas en calados y extensión. El último bloque reúne las respuestas y estima su frecuencia. Por tanto, el período de retorno del calado se obtiene **después de simular** el comportamiento del sistema.

La **fila superior** parte de los aforos y describe cada avenida mediante pico, volumen y duración. Esas magnitudes deben conservar una dependencia plausible al generar nuevos hidrogramas. El terreno y los usos del suelo aportan después la información espacial que necesita Iber para transformar el caudal en una respuesta hidráulica. La selección de escenarios permite organizar las ejecuciones, y el postprocesado reúne calados y velocidades. El bloque final asigna frecuencia a los impactos simulados. El orden es esencial: primero se transforma cada entrada en una respuesta y después se analiza el conjunto de respuestas, en lugar de trasladar directamente una etiqueta de frecuencia desde el hidrograma.

Este trabajo de **2018** precede a pyhydra y establece el **fundamento científico** del desarrollo posterior. La tesis recoge la necesidad de repetir esas operaciones y conectarlas de una forma trazable y transferible.

**Notas privadas:** El TFM y el artículo preceden a la arquitectura actual. La frecuencia de calado/extensión se estima después de la simulación hidráulica.

**Acción en la web:** Ir directamente a la figura del pipeline del caso del Besaya, centrada en la ventana. Recorrer sus etapas y volver al relato al avanzar.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con la cadena del Besaya situada, comparemos las respuestas de SFINCS y HEC-RAS frente a la rugosidad.

### 31. Besaya: cuánto cambia el impacto al cambiar de motor

**Bloque:** Casos y validación · **Tiempo orientativo:** 3 min 30 s

**Idea que debe quedar:** La elección del motor también cambia el impacto estimado.

**Recorrido visual:**

1. (a) Arriba izquierda: ejes, diagonal 1:1 y diferencia media de calado
2. (b) Arriba derecha: área, colores de los regímenes y medias 0,577 / 0,700 km²
3. (c) Abajo izquierda: cambio de colores a motores; concentración y desplazamiento del calado
4. (d) Abajo derecha: distribución del área y CV 8,4 % / 2 %
5. Cerrar con incertidumbre estructural y necesidad de observaciones

**Diálogo**

Esta figura compara **995 realizaciones** de rugosidad ejecutadas con ambos motores: **1.990 simulaciones**. La leeré de arriba abajo, primero el calado y después el área inundada.

Arriba, cada punto corresponde a la misma realización: **SFINCS en horizontal** y **HEC-RAS en vertical**. A la izquierda se compara el calado medio, en metros; a la derecha, el área inundada, en kilómetros cuadrados. La **diagonal discontinua** indica igualdad. Por encima, HEC-RAS produce **valores mayores**. La diferencia media es de **0,172 metros** en calado y **0,149 kilómetros cuadrados** en área. Las correlaciones, próximas a 0,5, indican una **asociación moderada**: ambos motores no responden de forma equivalente.

Aquí, **azul y rosa** distinguen **dos regímenes de HEC-RAS**, de menor y mayor extensión. Las líneas horizontales señalan sus áreas medias: **0,577 y 0,700** kilómetros cuadrados.

**Abajo cambia** el significado de los colores: **verde representa SFINCS** y **rojo, HEC-RAS**. Las curvas resumen cómo se distribuyen los resultados; un pico alto indica concentración alrededor de un valor, **no más simulaciones**. En calado, la curva roja está desplazada hacia valores mayores y es más ancha.

En área, SFINCS concentra sus resultados en una zona estrecha; HEC-RAS presenta dos regímenes, cuya separación se aprecia mejor arriba. El **coeficiente de variación** mide la dispersión respecto a la media: **8,4 por ciento** en HEC-RAS y **2 por ciento** en SFINCS. El análisis espacial vincula los regímenes con la conexión de un compartimento secundario de **7,4 hectáreas**.

El coeficiente de variación es la desviación típica dividida por la media, expresada en porcentaje. Permite comparar dispersión relativa entre conjuntos con medias distintas. En calado es del **3 por ciento en SFINCS** y del **5,7 por ciento en HEC-RAS**; en área, del **2 y del 8,4 por ciento**, respectivamente. Las curvas inferiores son densidades suavizadas: su altura no es una probabilidad puntual y cada distribución está normalizada. Las diferencias medias entre motores tampoco son errores frente a una medición. El anexo espacial permitirá investigar el mecanismo que separa los regímenes sin atribuirlo a una sola clase de Manning o a un umbral topográfico suficiente por sí mismo.

La conclusión es que **elegir el motor** modifica el impacto y su variabilidad. Estas diferencias no demuestran cuál reproduce mejor la realidad; para ello **necesitamos observaciones**.

**Notas privadas:** Fuente: memoria definitiva, §7.2.3 y figura 7.3, pp. 91–93; código de la figura 4 en notebooks/pilot_cases/manning_rugosidades/06_figuras_paper.ipynb. Bias = media de HEC-RAS menos SFINCS: diferencia entre modelos, no error frente a observaciones. r de Pearson: 0,516 en calado y 0,490 en área; no es un porcentaje de acierto. Arriba, azul/rosa clasifican el régimen de HEC-RAS; abajo, verde/rojo identifican el motor. Los 97 casos de régimen bajo y 898 de régimen alto son realizaciones del ensemble, no probabilidades anuales. Las curvas inferiores son densidades suavizadas, con área total unitaria; la altura no es una probabilidad ni un recuento. CV = desviación típica / media × 100: calado 3,0 % SFINCS y 5,7 % HEC-RAS; área 2,0 % y 8,4 %. Las medias 0,577 y 0,700 km² son de los regímenes de HEC-RAS; su diferencia (12,3 ha) no equivale a la superficie del compartimento secundario (7,4 ha). La conexión no depende de una sola clase de Manning ni de rebasar por sí solo el collado de 60,1 m: intervienen campo de rugosidad, gradientes, malla y conectividad. Para ampliar este mecanismo, abrir el anexo de bifurcación hidráulica.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** En Mallorca, la dificultad comienza antes: disponer de entradas con **pocos datos**.

### 32. Mallorca: reconstruir la cadena con pocos datos

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 24 s

**Idea que debe quedar:** Con pocos datos, la incertidumbre de la lluvia debe llegar al mapa hidráulico.

**Recorrido visual:**

1. Izquierda: escenarios, k=6 e impacto
2. Mapas: clásico a la izquierda, estocástico a la derecha
3. Diferencias espaciales de calado

**Diálogo**

Mallorca introduce otra dificultad: reconstruir una inundación en una cuenca **sin aforos**. Tras el episodio de Sant Llorenç de octubre de 2018, se combinó información de lluvia, dependencia entre estaciones e interpolación espacial para construir entradas plausibles.

Los indicadores de la izquierda resumen la estrategia: generar **miles de escenarios**, simular una selección y reconstruir los restantes mediante k-NN, aquí con **seis vecinos**. **Iber** transforma las entradas en calados y extensión; la extensión se contrasta con la cartografía de **Copernicus**.

Los dos mapas muestran el **mismo dominio urbano**, lo que permite comparar la localización de las diferencias. La leyenda indica **calado en metros**: el azul oscuro representa mayor profundidad y el claro, menor profundidad. Conviene distinguir dos aspectos: la extensión de la zona mojada y la profundidad dentro de ella. El mapa **estocástico** presenta diferencias de calado y de distribución espacial respecto al clásico; no equivale a aplicar un factor constante a toda la mancha. El indicador **k igual a seis** se refiere a los vecinos utilizados para reconstruir respuestas no simuladas. El contraste con Copernicus aporta una referencia de extensión para el episodio, con las limitaciones de observación y datos del caso.

A la derecha comparamos el **mapa clásico**, a la izquierda, con el estocástico, a la derecha. Las diferencias dependen de la localización. La aportación es llevar la **variabilidad de la lluvia** hasta el impacto, incluso cuando la escasez de datos dificulta caracterizar el episodio.

**Notas privadas:** Panel izquierdo: procedimiento clásico; derecho: estocástico. Copernicus aporta referencia de extensión. 5,85 m es un máximo modelado, no una medición observada.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** **Calle 30** añade la exigencia de calcular muchos escenarios para una infraestructura.

### 33. Calle 30, Madrid: Infraestructura crítica urbana

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 24 s

**Idea que debe quedar:** Explicar la selección de lluvia antes de HEC-HMS y la frecuencia del calado en secciones del modelo 1D.

**Recorrido visual:**

1. Fila superior: datos, eventos, cópulas y lluvia sintética
2. Fila central, de derecha a izquierda: MaxDiss sobre lluvia, HEC-HMS y HEC-RAS 1D; entrada del modelo urbano por la izquierda
3. Fila inferior: reconstrucción k-NN y período de retorno del calado por sección

**Diálogo**

El esquema sigue la cadena del caso Calle 30. Leemos la fila superior de izquierda a derecha: los datos de **precipitación** permiten caracterizar los eventos, ajustar su dependencia mediante **cópulas** y generar eventos sintéticos multisitio. Esos eventos representan combinaciones plausibles de lluvia en las subcuencas.

En la fila central empezamos por la derecha. **MaxDiss** selecciona **eventos de lluvia** representativos del conjunto sintético **antes de ejecutar HEC-HMS**. La selección se realiza sobre los descriptores de precipitación; no hay una segunda selección MaxDiss de hidrogramas después del modelo hidrológico.

HEC-HMS transforma los eventos seleccionados en **caudales de entrada**. **HEC-RAS 1D** calcula la respuesta hidráulica utilizando esos caudales y la geometría del modelo urbano. El resultado se interpreta en **secciones** de la red, como las utilizadas para las curvas de calado y los perfiles longitudinales del análisis interactivo.

En la fila inferior, **k-NN** permite reconstruir los calados de los escenarios no simulados explícitamente, a partir de los resultados calculados. Finalmente se analiza la **frecuencia de excedencia del calado** en cada sección de estudio y se obtienen sus **períodos de retorno**. No se trata de un resultado por píxel o por celda de una malla 2D.

La secuencia esencial es, por tanto: lluvia sintética, selección MaxDiss, HEC-HMS, HEC-RAS 1D, reconstrucción y frecuencia del calado por sección. El período de retorno se estima sobre la respuesta hidráulica, sin asignarle directamente el de la lluvia. Esta es la cadena que podremos reconocer en las gráficas del caso.

**Notas privadas:** Corrección del autor (24 de octubre de 2026), coherente con los notebooks del caso 04_maxdiss_selection, 05_hms_ras_simulation y 06_knn_return_periods. MaxDiss se aplica a los descriptores de los eventos de lluvia sintéticos antes de HEC-HMS. El caso utiliza HEC-RAS 1D y obtiene calados y períodos de retorno en secciones; no describir píxeles, celdas ni mapas 2D como salida de este modelo. k-NN reconstruye calados, no mapas. El esquema anterior trasladaba incorrectamente MaxDiss a hidrogramas y presentaba la salida por píxel. La mención al nivel freático es contexto, no prueba de una simulación acoplada.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Abrimos **Análisis interactivo** para interpretar el resultado de esa cadena.

### 34. Calle 30 en HYDRA: análisis interactivo

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 54 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Guiar dos comparaciones visibles sin dispersarse por la web.

**Recorrido visual:**

1. Curva de período de retorno en Puente de Toledo
2. Perfil longitudinal T100/T500
3. Cursor y leyenda de las series

**Diálogo**

Estamos en el apartado **Análisis interactivo**. Comienzo por la gráfica del **Puente de Toledo**: el eje horizontal representa el **período de retorno** y el vertical, el calado. Para comparar los procedimientos fijamos el **mismo período** y leemos las dos curvas. El **cursor** permite consultar valores y la leyenda aislar las series.

El **perfil** de la derecha añade la posición a lo largo del tramo para períodos de **cien y quinientos años**. Así podemos examinar en qué secciones aparecen las diferencias.

En la primera gráfica, comparar las curvas significa mantener fijo el período de retorno y observar **qué calado** proporciona cada procedimiento en el mismo punto. Una separación vertical indica diferencia de profundidad; no debe interpretarse como una distancia entre lugares. En el **perfil longitudinal**, en cambio, la posición horizontal cambia a lo largo del tramo. Allí comparamos los resultados en una misma sección y reconocemos si la diferencia se concentra en determinadas zonas. Las referencias a cien y quinientos años identifican dos frecuencias de diseño. Las gráficas son complementarias: una describe la relación frecuencia–calado en un punto; la otra muestra dónde se distribuyen los calados a lo largo de la infraestructura.

Las gráficas responden a una pregunta de diseño concreta: qué calado considerar en un lugar y con qué frecuencia. Son la **interpretación localizada** de toda la cadena que acabamos de recorrer.

**Notas privadas:** La visita principal se limita a Análisis interactivo: comparar curva de Puente de Toledo y perfil T100/T500. El cursor y la leyenda operan en vivo; la copia preparada conserva imágenes. MaxDiss es una ampliación opcional.

**Acción en la web:** Abrir Análisis interactivo. Comparar un período de retorno en el Puente de Toledo y una sección en el perfil T100/T500. Utilizar cursor y leyenda; dejar la nube MaxDiss como apoyo opcional.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

La captura conserva las dos gráficas de Análisis interactivo. A la **izquierda** está el calado en el **Puente de Toledo** frente al **período de retorno**. Para un **mismo período** se comparan las series del enfoque clásico y del basado en cópulas.

A la **derecha**, el eje horizontal recorre el tramo y los perfiles representan los calados para períodos de retorno de **cien y quinientos años**. La comparación muestra que las diferencias entre procedimientos también dependen de la sección.

En la primera gráfica, comparar las curvas significa mantener fijo el período de retorno y observar qué calado proporciona cada procedimiento en el mismo punto. Una separación vertical indica diferencia de profundidad; no debe interpretarse como una distancia entre lugares. En el **perfil longitudinal**, en cambio, la posición horizontal cambia a lo largo del tramo. Allí comparamos los resultados en una misma sección y reconocemos si la diferencia se concentra en determinadas zonas. Las referencias a cien y quinientos años identifican dos frecuencias de diseño. Las gráficas son complementarias: una describe la relación frecuencia–calado en un punto; la otra muestra dónde se distribuyen los calados a lo largo de la infraestructura.

**Esta copia es una imagen**: para leer valores con el cursor y activar o desactivar series hay que abrir la herramienta en vivo. La conclusión que sí podemos explicar con la captura es cómo el resultado de toda la cadena se convierte en una **comparación hidráulica localizada**.

**[Demos preparadas: muestra las capturas locales en orden: Análisis interactivo. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El siguiente caso cambia de escala y de pregunta: entremos en los hallazgos de Valencia antes de analizar sus resultados.

### 35. Valencia en HYDRA: del resultado al notebook

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 30 s

**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.

**Idea que debe quedar:** Del indicador visible al acceso concreto al procedimiento.

**Recorrido visual:**

1. Hallazgos clave del caso Valencia
2. Comparación de métodos y efecto de incorporar la DANA
3. Relación entre datos, procedimiento y resultado

**Diálogo**

En esta visita entramos directamente en los hallazgos clave del caso Valencia. Este apartado reúne las conclusiones del análisis y permite relacionar los resultados que analizaremos a continuación con las decisiones del procedimiento. La comparación distingue los estimadores utilizados y el efecto de incorporar el episodio de la DANA a las series.

Al leer estos hallazgos debemos mantener separadas tres cuestiones: qué datos entran en el ajuste, qué método se utiliza y qué incertidumbre acompaña a la estimación. Un cambio importante del resultado al incorporar un evento extremo muestra la sensibilidad del análisis a la información disponible. Para interpretar esa diferencia necesitamos revisar tanto la serie como las hipótesis del estimador.

La ficha conecta estas conclusiones con los materiales del caso. El **notebook** permite examinar la **preparación de datos**, la selección de máximos y la comparación de métodos; repetir el análisis requiere sus datos y dependencias. En esta visita nos centramos en los hallazgos, sin ejecutar el notebook. La **trazabilidad** consiste en poder seguir esa relación entre entradas, procedimiento y resultado.

**Notas privadas:** La navegación se centra en Hallazgos clave, no en los indicadores superiores ni en el acceso al notebook. Relacionar las conclusiones con los datos y métodos sin abrir ni ejecutar el notebook durante la defensa.

**Acción en la web:** Ir directamente a Hallazgos clave del caso Valencia. Relacionar los resultados con los métodos y los datos utilizados, sin abrir ni ejecutar el notebook durante esta visita.

**Diálogo en demos preparadas (sustituye al diálogo anterior)**

La **captura** muestra dos elementos de la ficha de Valencia. **Arriba** están los **indicadores** del episodio. **Debajo** aparece el acceso al **notebook** del estudio regional y las tareas que documenta: **preparación de datos**, ajuste de extremos y comparación de estimadores.

La imagen permite identificar dónde se consulta el procedimiento, aunque los enlaces no se ejecutan dentro de una captura. La versión web y el notebook permiten continuar la revisión con los datos y el entorno correspondientes.

Los indicadores resumen qué resultado merece atención; el notebook documenta cómo se llegó a él. En él se puede revisar qué estaciones y períodos se utilizaron, cómo se seleccionaron los máximos y qué estimador produjo cada curva. Para interpretar una discrepancia entre métodos, esas decisiones son tan importantes como el valor final. Abrir el material permite consultar el análisis, mientras que repetirlo requiere comprobar que están disponibles las entradas y las dependencias correspondientes. Esta visita tiene una función precisa dentro del relato: mostrar el vínculo entre los resultados que vamos a analizar y el procedimiento que permite examinarlos.

Este es el significado práctico de la **trazabilidad**: poder relacionar la cifra presentada con las **entradas, el método y las decisiones** del análisis. El resultado queda acompañado de los materiales necesarios para examinar su procedencia.

**[Demos preparadas: muestra las capturas locales en orden: Resultados y procedimiento. Utiliza los botones de la diapositiva para cambiar de captura.]**

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con el caso situado en la plataforma, examinemos cómo la DANA modifica la estimación de los extremos.

### 36. Valencia: Análisis rápido ante la DANA del 2024

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 30 s

**Idea que debe quedar:** Separar lluvia observada, cuantil T100 y período asignado al episodio.

**Recorrido visual:**

1. Izquierda: lluvia observada e indicadores
2. Derecha: T100 sin y con DANA
3. Distinguir T100 del período asignado al episodio

**Diálogo**

En Valencia la pregunta es cuánto cambia una estimación al incorporar un episodio extraordinario. El primer indicador recuerda el **dato observado**: **710,8** milímetros en 24 horas en Turís, el 29 de octubre de 2024.

Las **barras** de la derecha comparan otra cantidad: la precipitación estimada para un período de retorno de **cien años**. Con el ajuste bayesiano pasa de **260** milímetros sin la DANA a **952** al incorporarla: un aumento del **266 por ciento** respecto al primer ajuste.

La diapositiva separa **una observación** de **dos resultados estadísticos**. Los 710,8 milímetros son la precipitación medida del episodio. Los 260 y 952 milímetros son cuantiles calculados para T100 con muestras distintas. El intervalo de **66 a 91 años** corresponde al período de retorno asignado al episodio cuando se incluye en el ajuste, según el estimador. Para leer las barras debemos mantener fijo el método y comparar **sin DANA y con DANA**. El aumento del 266 por ciento se calcula respecto al valor inicial de 260 milímetros; no expresa un aumento observado de la lluvia entre dos fechas. La franja metodológica recuerda que el estudio compara estimadores y escalas de análisis sobre las series disponibles.

El intervalo de 66 a 91 años se refiere al período asignado al episodio observado, incluyendo el dato y según el estimador. Son **magnitudes diferentes**. La comparación muestra la sensibilidad de la cola a la muestra y la necesidad de revisar la incertidumbre antes de fijar un valor de diseño.

**Notas privadas:** Distinguir tres magnitudes: lluvia observada (710,8 mm), nivel de retorno T100 (260/952 mm) y período de retorno asignado al episodio (66–91 años al incorporarlo). El +266 % se refiere al cambio del nivel T100 bayesiano.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Tras el análisis de extremos de Valencia, pasemos a la transformación regional del clima en caudales en los Andes.

### 37. Andes: calibración hidrológica automatizada a gran escala

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 18 s

**Idea que debe quedar:** Leer el cambio estacional en los cuatro países y explicar qué automatización lo hizo posible.

**Recorrido visual:**

1. Cuatro paneles por país
2. Meses en horizontal y cambio porcentual en vertical
3. Escenarios y horizontes de la leyenda

**Diálogo**

Los cuatro paneles representan Colombia, Bolivia, Perú y Ecuador. El eje horizontal recorre los **meses** y el vertical muestra **cambios porcentuales** de caudal; la leyenda distingue escenarios y horizontes. En **algunos meses** de Perú y Ecuador aparecen aumentos superiores al 40 por ciento, mientras otras combinaciones muestran reducciones.

Para obtener esas curvas se procesaron más de **200 subcuencas**. Los datos se completan con satélite e interpolación; **SPOTPY** organiza la calibración y **VIC** transforma las entradas en caudal. Después se propagan **21 modelos CMIP5**.

La leyenda combina **color y tipo de línea**. Azul identifica 2011–2040; rojo, 2041–2070; y gris o negro, 2071–2100. Las líneas discontinuas corresponden a **RCP4.5** y las continuas a **RCP8.5**. Para comparar escenarios debemos fijar país, mes y horizonte. El cero del eje vertical representa ausencia de cambio respecto a la referencia; por encima hay aumento y por debajo, reducción del caudal. El mayor cambio de final de siglo se aprecia en algunos meses de Perú y Ecuador, sin que eso describa todos los países o estaciones del año. Las escalas verticales difieren entre paneles, por lo que la comparación cuantitativa exige leer sus números y no solo la altura visual de las líneas.

La contribución operativa consiste en repetir consistentemente ese ciclo regional. La interpretación debe conservar su carácter de **proyección condicionada** a los datos, los modelos y los escenarios utilizados.

**Notas privadas:** Los ejes muestran cambio porcentual del caudal mensual, no precipitación. El +40 % corresponde a determinados meses y escenarios de Perú/Ecuador. Automatización de la calibración no elimina la necesidad de validación hidrológica.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El estudio de IAHR permite comparar **dos procedimientos** de cálculo del diseño.

### 38. IAHR 2022: el procedimiento también cambia el diseño

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 06 s

**Idea que debe quedar:** Distinguir la comparación espacial de calados de la comparación numérica de caudales.

**Recorrido visual:**

1. Mapa: diferencia de calado en T100, 2041–2070 y RCP4.5
2. Cifras de caudal como comparación adicional
3. Diferencia entre métodos y verdad observada

**Diálogo**

Este estudio compara el procedimiento convencional basado en **IDF** con una cadena estocástica. El mapa muestra **diferencias de calado** T100 para **2041–2070**, RCP4.5, que cambian espacialmente.

Los recuadros incluyen una comparación adicional de caudal T100 en **2011–2040**. Para RCP4.5, IDF da **208,8** y el enfoque estocástico **278,5** metros cúbicos por segundo: un **33,4 por ciento** más respecto a IDF. Ese porcentaje corresponde al caudal y no se traslada uniformemente al mapa de calados.

La figura contiene **dos comparaciones relacionadas, pero distintas**. El mapa localiza diferencias de calado para un horizonte concreto. Los recuadros presentan caudales de diseño de otro horizonte. Mantener las unidades evita confundir metros de profundidad con metros cúbicos por segundo. El 33,4 por ciento resulta de dividir la diferencia de caudal entre 208,8, el valor del método IDF. No implica que cada celda del mapa aumente esa proporción. La franja inferior permite reconstruir el procedimiento: proyecciones EURO-CORDEX, corrección de sesgo y dependencia, generación sintética, selección y simulación con Iber. El resultado muestra cuánto puede importar la elección de la cadena de diseño bajo las condiciones analizadas.

El cálculo utilizó 10.000 años sintéticos y 200 casos seleccionados con MaxDiss para Iber, reconstruyendo el resto mediante k-NN. La diferencia evidencia **sensibilidad al procedimiento**; demostrar mayor exactitud requiere contrastarla con observaciones.

**Notas privadas:** Fuente contrastada: memoria definitiva, tabla 7.6, p. 114 (página 144 del PDF), y §8.6, p. 130. El ejemplo T100 RCP4.5 2011–2040 es 208,8 → 278,5 m³/s: +33,4 % respecto a IDF; tomando como base el estocástico, IDF es un 25,0 % menor. Las 24 comparaciones de la tabla dan alrededor del 33 % de incremento, sin reconstruir los extremos del rango narrado 30–37 %. Ese rango requiere el artículo original. El mapa corresponde a 2041–2070; no confundir horizontes ni variables.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** SIMPCCe traslada el análisis climático e hidrológico a la **gestión de embalses**.

### 39. SIMPCCe: aportaciones a embalses bajo cambio climático

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 18 s

**Idea que debe quedar:** Presentar la herramienta publicada y su conexión con decisiones de suministro.

**Recorrido visual:**

1. Izquierda: cinco módulos de SIMPCCe
2. Derecha: figura 11 del artículo
3. Ejes: fiabilidad y suministro; referencias de demanda

**Diálogo**

SIMPCCe, publicada en **Ingeniería del Agua** en 2025, traslada el análisis climático a la gestión de embalses. La **columna izquierda** resume sus **cinco módulos**: datos oficiales, configuración de cuenca, entrenamiento de la red neuronal, **corrección de sesgo SDM** e informes de aportaciones.

El gráfico de la derecha procede del artículo. Relaciona el volumen suministrado con su **fiabilidad**: el eje horizontal indica el porcentaje de garantía y el vertical, el volumen anual. Las líneas rojas señalan la **demanda** y el **suministro aceptable**.

La lectura de la columna izquierda sigue el recorrido de la herramienta. Los datos oficiales aportan las series de referencia; la configuración delimita la cuenca y sus puntos climáticos; la red neuronal relaciona esas entradas con aportaciones; la corrección climática prepara escenarios; y los informes reúnen sus resultados. En el gráfico, al avanzar hacia una **fiabilidad mayor**, el volumen que puede suministrarse con esa garantía tiende a reducirse. La referencia de demanda permite ver si se mantiene el objetivo de suministro. Las líneas rojas ilustran la lectura de un suministro aceptable asociado a una garantía. La curva procede del ejemplo del artículo y no representa una serie de observaciones de un embalse presentada aquí como validación universal.

Para obtener estos indicadores, las aportaciones de SIMPCCe deben combinarse con un **modelo de gestión**. Esa conexión permite estudiar **medidas de adaptación** y sus consecuencias sobre el suministro.

**Notas privadas:** Referencia científica principal: Navas y del Jesus (2025), DOI 10.4995/ia.2025.23217. Figura 11, p.145: ejemplo de apoyo a decisiones; el cálculo de suministros requiere combinar aportaciones con un modelo de gestión. El artículo señala en Discusión que no presenta casos de estudio específicos. No atribuirle los valores de Embalse 2 de la guía de 2022 ni la reducción de julio del 77 %. La guía es antecedente industrial, no la fuente del gráfico mostrado. La figura 10 del artículo se conserva en el anexo.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Panamá extiende la preparación trazable de escenarios a **escala nacional**.

### 40. Atlas de Panamá: automatización a escala nacional

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 36 s

**Idea que debe quedar:** Leer el mapa como producto intermedio de datos y separar las magnitudes de escala.

**Recorrido visual:**

1. Mapa: precipitación en mm, límites de subcuencas y escala de colores
2. Izquierda: 52 cuencas, 414 combinaciones y 1.464 puntos costeros
3. Franja inferior: estaciones → escenarios → LEM/SFINCS → capas del atlas

**Diálogo**

Este caso muestra la aplicación de la cadena a **escala nacional**. El mapa de la derecha representa **precipitación** media distribuida por subcuencas de Panamá. Las **líneas negras** delimitan esas unidades y la cuadrícula sitúa su posición geográfica; no delimitan manchas de inundación. La escala inferior está en **milímetros**: los **rojos** corresponden a valores menores y los verdes, cianes y **azules** a valores progresivamente mayores. El rango representado va aproximadamente de 1.500 a 6.000 milímetros. El mapa permite reconocer contrastes espaciales de la entrada climática, sin deducir directamente de sus colores dónde será mayor el daño.

Las tres cifras de la izquierda describen **magnitudes distintas**. Las **52 cuencas** son el dominio de las capas de inundación fluvial. Las **414 combinaciones climáticas** proceden de 23 modelos, dos escenarios SSP, tres variables y tres horizontes; describen dimensiones del análisis, no un registro verificado de 414 ejecuciones hidráulicas. Los **1.464 puntos costeros** corresponden a la evaluación de inundación costera en ambas costas, un ámbito diferente del mapa de precipitación.

La franja inferior resume el **proceso metodológico**. Se completan las series de **73 estaciones** con NEOPRENE y se interpolan campos mediante **kriging universal** a un kilómetro. La corrección de sesgo prepara escenarios climáticos. **LEM** transforma las entradas en caudales y **SFINCS** produce respuestas hidráulicas que alimentan las capas del atlas. El mapa que vemos es un producto intermedio de esa cadena.

La aportación consiste en repetir un procedimiento documentado sobre múltiples dominios y configuraciones, conservando la relación entre entrada climática, modelo y resultado. La escala exige automatización y trazabilidad; también exige mantener separadas las variables y los alcances de cada producto.

**Notas privadas:** El mapa es de precipitación, no de inundación. 414 = 23 GCM × 2 SSP × 3 variables × 3 horizontes, según Producto 3, pp. 3 y 29–30. No equivale a un registro comprobado de ejecuciones completadas ni a 414 simulaciones hidráulicas.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Podemos reunir ahora las aplicaciones para valorar el **alcance de su transferencia**.

### 41. Qué demuestra el conjunto de casos

**Bloque:** Casos y validación · **Tiempo orientativo:** 2 min 12 s

**Idea que debe quedar:** Leer escala, finalidad y disponibilidad sin atribuir el mismo alcance a todos los casos.

**Recorrido visual:**

1. Horizontal: escala espacial
2. Filas: finalidad del análisis
3. Símbolos: notebook actual o documentación

**Diálogo**

Esta diapositiva reúne los **diez estudios** para interpretar el alcance del conjunto. El eje horizontal ordena la **escala espacial**, desde una infraestructura hasta varios países. No representa una distancia geográfica ni una medida numérica de superficie. Las **tres filas** distinguen la **finalidad del análisis**: inundación basada en impacto, extremos e incertidumbre, y clima y escalabilidad.

En la primera fila se sitúan Calle 30, los dos trabajos del Besaya y Sant Llorenç. Valencia aparece en extremos e incertidumbre. IAHR, Panamá, SIMPCCe, Tanganica y Andes se sitúan en el ámbito climático y de escalabilidad. Esa clasificación organiza la comparación; varios trabajos utilizan componentes compartidos y no quedan limitados a una sola idea metodológica.

Los **círculos rellenos** señalan los cuatro estudios con notebooks: Besaya, rugosidades, Calle 30 y Valencia. Los **círculos vacíos** identifican los otros seis, documentados mediante publicaciones o proyectos. La leyenda recuerda que la ejecución necesita el entorno correspondiente. Los símbolos describen disponibilidad de materiales, no una clasificación de calidad científica.

Los tres mensajes de la izquierda sintetizan la lectura. El **principio común** es estimar la frecuencia sobre la variable de impacto cuando el caso la requiere. Los **contextos distintos** ponen a prueba otras escalas, datos y motores. La **transferencia** consiste en reutilizar componentes conservando las decisiones del análisis. La figura muestra diversidad funcional y grados de integración distintos; no afirma que todos los casos ejecuten la misma cadena completa.

**Notas privadas:** Esta es la diapositiva de síntesis del bloque. Hacer una pausa antes de presentar la producción científica; después se delimita la autoría y se cierran las hipótesis. No enumerar otra vez los diez estudios: responder a “¿qué aprendemos de todos ellos juntos?”.

**Transición:** La **producción científica** muestra cómo se comunican y conservan esos desarrollos.

### 42. Producción científica asociada a la tesis

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 24 s

**Idea que debe quedar:** Distinguir publicación, comunicación, evaluación y software citable.

**Recorrido visual:**

1. Dos artículos publicados
2. Dos manuscritos enviados
3. Cinco comunicaciones
4. Dos DOI de software
5. Valencia: aceptado, pendiente de publicación

**Diálogo**

La producción científica reúne **dos artículos publicados** en Ingeniería del Agua: Calle 30, de 2024, y SIMPCCe, de 2025. El artículo de **Valencia** está **aceptado, pendiente de publicación**, por lo que se indica por separado y no se incluye en el recuento de publicados. Los dos manuscritos que continúan enviados son **Tanganica** y el estudio de **rugosidades** remitido a Environmental Modelling & Software.

La diapositiva organiza los productos en cuatro columnas. La primera recoge los artículos publicados; la segunda, los manuscritos que permanecen **en evaluación**. La nota de la primera columna indica que Valencia está aceptado, pendiente de publicación. Así quedan separados los artículos publicados, el artículo aceptado y los manuscritos que continúan en evaluación.

La tercera columna presenta **cinco comunicaciones**, difundidas entre 2023 y 2025 en jornadas y congresos. Estas comunicaciones permiten seguir la evolución de los trabajos y su discusión con la comunidad científica. Una comunicación y el artículo posterior pueden proceder de una misma investigación: no representan necesariamente casos de estudio diferentes.

La cuarta columna corresponde al software científico. Los **dos DOI** de Zenodo identifican versiones citables de pyhydra e HYDRA y permiten referenciar los productos desarrollados, además de los métodos y resultados descritos en las publicaciones.

Los mensajes inferiores agrupan las aportaciones por los problemas abordados: infraestructura urbana, gestión de embalses y análisis de eventos y niveles extremos. En conjunto, estas cuatro columnas muestran distintas formas de documentar y difundir el trabajo: artículos publicados, manuscritos en evaluación, comunicaciones y software. La siguiente diapositiva concreta mi responsabilidad personal en esos trabajos.

**Notas privadas:** Estado editorial corregido por el doctorando el 21 de octubre de 2026: dos artículos publicados (Calle 30 y SIMPCCe), Valencia aceptado pendiente de publicación y dos manuscritos enviados (Tanganica y rugosidades, este último a Environmental Modelling & Software). La revista, fecha y DOI del artículo de Valencia no se han facilitado; no inferirlos. Las comunicaciones previas y los manuscritos son productos distintos de una misma línea, no casos de estudio nuevos.

**Transición:** En estos trabajos compartidos, corresponde precisar cuál ha sido **mi contribución**.

### 43. Mi contribución científica y tecnológica

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 24 s

**Idea que debe quedar:** Leer la tabla por trabajo, posición de autoría y contribución concreta.

**Recorrido visual:**

1. Primera columna: trabajo o publicación
2. Segunda columna: posición de autoría
3. Tercera columna: contribución del doctorando
4. Transferencia de pyhydra a otras tesis doctorales

**Diálogo**

Esta tabla concreta mi **responsabilidad por trabajo**. Las columnas identifican la publicación, mi **posición de autoría** y la **contribución personal**. En siete trabajos figuro como **primer autor**: la formulación inicial de la cadena estocástica, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y rugosidades. Mis tareas abarcan metodología, desarrollo, simulación, análisis y redacción, con el alcance indicado en cada fila.

Las **colaboraciones** delimitan otras responsabilidades: calibración y clima en los Andes; desarrollo, validación y documentación de **NEOPRENE**; generación y reconstrucción en downscaling; y módulos de **extremos y frecuencia regional** en Valencia.

La tabla se lee **por filas**, manteniendo juntas sus tres columnas. En la formulación inicial y el Besaya, mi aportación se refiere a la cadena estocástica y los impactos. En Mallorca, al downscaling, la geoestadística y la simulación. En Calle 30, a la metodología y la automatización de los modelos. SIMPCCe recoge el diseño y desarrollo de la herramienta; Tanganica, la metodología con datos globales y aprendizaje automático; y rugosidades, el ensemble y la comparación de motores. Las filas de colaboración concretan tareas parciales, en lugar de atribuirme la totalidad de esos trabajos. La fila del software separa además su diseño, documentación y publicación como un producto propio de la tesis.

En **pyhydra e HYDRA** soy primer autor del **diseño, desarrollo, documentación y publicación** del software. La investigación se apoya en trabajo colectivo; esta distribución identifica qué aporté **personalmente**. pyhydra también ha servido como herramienta para las tesis de **Diego Urrea Méndez** y **Dina Vanesa Gómez Rave**. Este uso muestra la **transferencia** del software a otras investigaciones doctorales.

**Notas privadas:** Detalle basado en tabla 8.2, p.133. Mantener siete trabajos liderados, cuatro colaboraciones y el software con rol de primer autor. La aceptación del artículo de Valencia no cambia su posición de segundo autor. No confundir autoría con ejecución exclusiva de todo el trabajo. El anexo conserva el desglose literal ampliado de análisis y redacción. El uso de pyhydra en otras tesis describe transferencia de la herramienta; no implica dirección ni autoría de esas tesis.

**Transición:** Con esas responsabilidades delimitadas, vuelvo a las **hipótesis y sus evidencias**.

### 44. Qué evidencia aporta cada hipótesis y qué falta comprobar

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 36 s

**Idea que debe quedar:** Cada hipótesis tiene una evidencia concreta y una comprobación pendiente.

**Recorrido visual:**

1. Arriba: campañas y capacidad operativa
2. Centro: reutilización de módulos
3. Abajo: dos comparaciones, con escalas distintas

**Diálogo**

Esta figura vuelve a las mismas **tres hipótesis**: automatización, integración modular y flujo reproducible. La incertidumbre es lo que H3 propone representar de forma más consistente; no es una hipótesis distinta. La figura organiza sus evidencias de arriba abajo. Cada grupo responde a una pregunta distinta: qué campañas podemos gestionar, qué componentes podemos reutilizar y cuánto cambia el resultado al modificar datos o procedimientos.

Arriba, **H1, automatización**, reúne 1.990 simulaciones hidráulicas del Besaya, 10.000 años sintéticos en IAHR y miles de eventos en Calle 30. Las unidades son diferentes: simulaciones, años y eventos. No podemos compararlas como tres medidas de tiempo ahorrado. Demuestran **capacidad operativa** para organizar campañas; el **ahorro** sistemático frente a un flujo manual sigue pendiente de medición.

En el centro, **H2, integración modular**, muestra la cobertura de los bloques en los diez estudios. Podemos seguir una columna para reconocer dónde se reutiliza un componente, o una fila para ver qué necesita un caso. La diversidad de combinaciones respalda la **reutilización**. La disponibilidad de cuatro estudios con notebooks añade materiales de revisión, con requisitos de ejecución propios. Evaluar cuánto reduce las barreras para otros equipos exige además una comprobación de uso.

Abajo, **H3, flujo reproducible**, presenta dos parejas de resultados. IAHR compara caudal T100 en metros cúbicos por segundo; Turís compara precipitación T100 en milímetros, sin y con la DANA. Las barras tienen escala dentro de cada gráfico, pero sus alturas no se comparan entre ambos. Muestran sensibilidad del diseño al procedimiento y a la muestra. Una diferencia, o un valor mayor, no demuestra por sí sola mayor exactitud. El **contraste observacional** y las comparaciones adicionales siguen siendo necesarios para valorar esa hipótesis con todo su alcance.

**Notas privadas:** Fuente: memoria definitiva, §1.4, pp. 11–12, y §8.6, p. 130. Se mantienen la identidad y el orden de las hipótesis; aquí se presentan sus evidencias y límites. La formulación de H1 contempla eficiencia, pero esta defensa acredita principalmente viabilidad operativa. H2 tiene cuatro estudios con notebooks actuales, sujetos a sus requisitos de ejecución. H3 muestra sensibilidad e incertidumbre, no una demostración general de exactitud superior.

**Transición:** Ese balance permite sintetizar la **contribución original** de la tesis.

### 45. La contribución original: hacer operativa la ciencia existente

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Cerrar la tesis distinguiendo tres niveles de contribución.

**Recorrido visual:**

1. Nivel inferior: conocimiento previo
2. Nivel intermedio: desarrollo de la tesis
3. Nivel superior: contribución original

**Diálogo**

La figura distingue la procedencia de los componentes y la contribución que resulta de conectarlos. En la base están los **métodos científicos previos**: análisis de extremos, cópulas, generadores y motores físicos. En el nivel central se sitúan los **desarrollos de la tesis**: submódulos, adaptadores y flujos documentados. Arriba aparece su **integración reproducible y transferible**.

Los niveles de la figura distinguen **conocimiento previo, desarrollo e integración**. Los métodos de la base tienen autores y formulaciones reconocidos. El nivel intermedio representa el trabajo de convertirlos en componentes utilizables, conectarlos con datos y motores y conservar sus transformaciones. El nivel superior recoge el comportamiento del conjunto: ejecutar un flujo, examinar su procedencia y adaptarlo a otra aplicación. Los tres indicadores de la izquierda expresan ese resultado mediante integración extremo a extremo, **trazabilidad** y transferencia en diez estudios. La originalidad se sitúa en esa articulación operativa, cuyo alcance debe leerse junto con la evidencia y los requisitos de cada caso.

Los casos dan contenido a esa integración: permiten examinar la influencia de entradas y modelos, estimar **frecuencia sobre el impacto** y reutilizar componentes en otra escala. La **contribución original** consiste en hacer operativa esa cadena, conservando la trazabilidad de sus decisiones y delimitando las condiciones en las que pueden interpretarse los resultados.

**Notas privadas:** Base científica previa → desarrollo de componentes → integración reproducible y transferencia. Explicar esta jerarquía como conclusión de los casos.

**Transición:** Sus límites permiten identificar qué **comprobaciones y desarrollos** deben seguir.

### 46. Limitaciones y trabajo futuro

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 54 s

**Idea que debe quedar:** Distinguir con precisión mitigación disponible, límite persistente y trabajo futuro según la memoria.

**Recorrido visual:**

1. Tabla superior: cinco limitaciones de la tabla 8.1
2. Columnas: limitación, mitigación disponible y límite persistente
3. Franja inferior: los tres ámbitos del trabajo futuro

**Diálogo**

La tabla organiza **cinco limitaciones** y se lee de izquierda a derecha. La primera columna identifica el problema; la segunda, las medidas que HYDRA incorpora; y la tercera, el límite que permanece. La franja inferior reúne el **trabajo futuro**, separado de las capacidades actuales.

En la primera fila, las **series cortas y los extremos raros** dejan poca información sobre la cola. Bootstrap, inferencia bayesiana y análisis regional ayudan a representar o compartir esa información, pero no generan observaciones nuevas. El análisis regional exige además justificar la homogeneidad de las estaciones.

La segunda fila trata los **motores externos**. Los adaptadores normalizan su uso y los contenedores conservan las dependencias compatibles con ese entorno. Permanecen los requisitos de instalación, licencia, plataforma y versión de cada motor; automatizar el acceso no los elimina.

La tercera distingue los **generadores estacionarios** de una representación completa de cambios en el tiempo. Corregir sesgos y generar por escenario permite tratar condiciones climáticas concretas, pero la no estacionariedad completa requiere formulaciones y comprobaciones específicas.

La cuarta se refiere al **coste de simulación hidráulica**: tiempo y recursos necesarios para ejecutar muchos escenarios con el modelo físico. MaxDiss, k-NN, emulación y selección permiten reducir ejecuciones, pero sus aproximaciones deben validarse. Algunos casos seguirán necesitando simulación directa. Se trata del coste computacional de las simulaciones que exige cada estudio.

La quinta recoge la **calidad de los datos globales**. El diagnóstico, la corrección de sesgo y la trazabilidad permiten detectar y documentar diferencias. Persisten errores de representación, especialmente en cuencas complejas o con pocas observaciones locales.

Las tres áreas inferiores plantean ampliar métodos y validación, desarrollar infraestructura de campañas y configuración de estudios, y reforzar documentación y transferencia. La conclusión es que HYDRA ayuda a organizar estas limitaciones y sus controles; cada aplicación debe justificar qué incertidumbre trata y cuál permanece.

**Notas privadas:** Síntesis editorial trazable a la tabla 8.1 y §8.4 (pp.128–129) y §8.5 (pp.129–130). Las cinco limitaciones y las mitigaciones son las de la tabla, sin convertirlas en cinco etapas nuevas de la cadena. Bootstrap, Bayes, AFR, control de calidad, adaptadores, MaxDiss, k-NN y emulación ya aparecen como mitigaciones disponibles. VineCopula, CopulaCDFEmulator y pyhydra.uq ya forman parte de pyhydra 0.2.0; el trabajo futuro es ampliar su validación en casos reales, no presentarlos como desarrollos aún inexistentes. La tabla no garantiza reproducibilidad de motores externos ni elimina errores de representación de datos globales. La comprobación de acierto y ahorro pertenece al contraste de hipótesis (§8.6), no debe confundirse con una sexta fila de la tabla 8.1. La distribución y los archivos versionados requieren continuidad; no se presentan como recursos aún inexistentes.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Quiero **agradecer** a quienes han hecho posible este trabajo.

### 47. Una tesis se firma con un nombre, pero se construye con muchos

**Bloque:** Conclusiones · **Tiempo orientativo:** 1 min 36 s

**Idea que debe quedar:** Agradecer sin abrir otra explicación científica.

**Recorrido visual:**

1. Familia, director y tutor
2. IHCantabria y compañeros de la Universidad de Castilla-La Mancha
3. Banco Santander: beca concedida

**Diálogo**

Quiero dar las gracias a **mi familia** por acompañarme y sostenerme durante todo este recorrido. A mi director, **Manuel del Jesus Peñil**, por enseñarme a investigar con rigor y vocación de utilidad. A mi tutor, **César Álvarez Díaz**, por su disponibilidad y generosidad. A **IHCantabria**, por el entorno humano, científico y técnico en el que he podido desarrollar el trabajo. A mis compañeros de la **Universidad de Castilla-La Mancha**, por su apoyo y compañerismo. Y al **Banco Santander**, por la **beca** que me ha concedido.

En la diapositiva aparecen personas e instituciones con funciones distintas en ese recorrido: el apoyo personal, la dirección y tutela académicas, el entorno de investigación y el apoyo mediante la beca. La tesis reúne desarrollos propios y trabajo compartido, como he procurado distinguir en la tabla de contribuciones. Quiero que este cierre reconozca ambas dimensiones: la responsabilidad científica de lo que presento y la ayuda que hizo posible desarrollarlo y llevarlo hasta la defensa.

A todos, muchas gracias.

**Notas privadas:** Tono personal y pausado. Hacer una pausa antes de la frase final.

**Transición:** Termino recuperando la **idea central** que resume la investigación.

### 48. Muchas gracias por su atención

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min 00 s

**Idea que debe quedar:** Dar una conclusión recordable y ceder la palabra.

**Recorrido visual:**

1. Mensaje final
2. Repositorios y DOI para acceder al trabajo

**Diálogo**

Para terminar, recupero la idea que ha guiado la defensa. La tesis desarrolla **una cadena reproducible** que conecta datos, métodos y modelos para estimar la **frecuencia del impacto** bajo **incertidumbre hidrológica y climática**. Las aplicaciones muestran su utilidad en **problemas de ingeniería** y permiten precisar los **límites** que he expuesto.

La frase central resume la propuesta: una **cadena reproducible** convierte información climática e hidrológica en resultados físicos que pueden examinarse. El código QR permite abrir la portada de HYDRA para consultar sus herramientas, documentación y casos. Los enlaces inferiores identifican los repositorios y versiones de los dos productos de software. Permiten continuar la consulta del trabajo con el alcance documentado en cada recurso. El recorrido ha mostrado tanto resultados concretos como condiciones de aplicación: calidad de datos, hipótesis estadísticas, motores y validación. Esa delimitación forma parte de la contribución, porque permite reconocer qué sabemos a partir de cada análisis y qué comprobaciones deben acompañar su uso en una decisión de ingeniería.

Los repositorios y las versiones citables de pyhydra e HYDRA quedan disponibles para continuar esa investigación y revisar sus desarrollos. Con esta síntesis concluyo la exposición del trabajo y quedo a disposición del tribunal para las **aclaraciones y preguntas** que considere oportunas.

**Notas privadas:** Terminar la respuesta científica, agradecer y ceder la palabra. El QR abre la portada pública de HYDRA; los enlaces quedan visibles durante las preguntas.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Muchas gracias. **Cedo la palabra al tribunal**.

**[Pauta final: haz una pausa y cede la palabra al tribunal.]**

## Guion de los anexos

Material disponible en **/defensa-anexos**, fuera del tiempo principal. Abrir solo el anexo que responda a la pregunta del tribunal.

### Anexo 1. Demostración: generación de series sintéticas

**Tiempo orientativo:** 2 min 00 s

Estas dos capturas documentan la generación estocástica. Partimos de la **serie demo sintética** de caudal diario de 1990 a 2019. La primera figura compara, mes a mes, la **media**, la **desviación estándar** y la **autocorrelación** de primer retardo del registro de entrada y de las realizaciones. Después mostramos **30 realizaciones** para 2025, obtenidas con semilla 42: la línea resume la **mediana** y las **bandas** muestran la dispersión entre trayectorias. No estamos prediciendo el caudal observado de 2025; estamos generando escenarios plausibles. La interfaz calibra con CoSMoS y utiliza una simulación rápida mediante **AR(1)** estacional y transformación a las marginales ajustadas. Debemos comprobar sus diagnósticos antes de utilizar el **ensemble** en un cálculo de diseño.

El **diagnóstico** y el ensemble responden a **dos preguntas distintas**. Los gráficos mensuales comprueban si la simulación conserva propiedades de la entrada. El ensemble muestra trayectorias alternativas que cumplen aproximadamente esas condiciones. La mediana resume la posición central entre realizaciones; las bandas describen su dispersión y no son una predicción observacional de un año concreto. La semilla permite repetir esta ejecución, pero no modifica la naturaleza sintética del ejemplo. Antes de alimentar un modelo físico, revisaríamos también extremos, persistencia y, si hubiera varias estaciones, su dependencia espacial. Una coincidencia de medias no garantiza por sí sola que todas esas propiedades estén reproducidas.

**[Apoyo visual local: 1. Diagnóstico estacional → 2. Ensemble. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** Capturas de la API ejecutada el 6 de octubre de 2026. Mostrar primero el diagnóstico estacional y después el ensemble. Datos demo sintéticos; 30 años de calibración y 30 realizaciones de un año. La simulación rápida conserva la marginal y aproxima la dependencia con AR(1), no toda la estructura temporal de una simulación CoSMoS completa.

### Anexo 2. Demostración: sensibilidad de la rugosidad

**Tiempo orientativo:** 2 min 06 s

Esta captura procede del análisis del **CSV** demo de **mil simulaciones** HEC-RAS. Cada punto corresponde a una simulación del ensemble y relaciona una medida de **Manning** con el **calado medio**, el **calado mediano** o el **área inundada**. Las rectas resumen una asociación lineal simple: el **R cuadrado** del calado medio es **0,0069** y el del calado mediano, **0,0014**. Una relación lineal tan débil no significa que la rugosidad carezca de efecto. Puede haber respuestas **no lineales**, umbrales topográficos y otros controles. Esta herramienta analiza salidas ya calculadas; no vuelve a ejecutar HEC-RAS ni reproduce aquí las 995 parejas HEC-RAS y SFINCS del contraste principal. La figura permite explicar por qué necesitamos mirar la distribución del impacto y sus regímenes, además de una única regresión.

Para leer cada nube fijamos qué indicador aparece en el **eje vertical** y qué resumen de Manning se utiliza en el horizontal. Una nube poco alineada con la recta indica que una relación lineal simple explica una fracción pequeña de esa variación; no demuestra independencia física ni ausencia de otros mecanismos. La media y la mediana del calado tampoco describen exactamente la misma propiedad de la inundación. Esta demo sirve como diagnóstico de salidas agregadas. Si detectamos grupos o cambios de régimen, necesitamos volver a los **mapas y condiciones hidráulicas** para investigarlos. Es la diferencia entre describir una asociación estadística y explicar el mecanismo que la produce.

**[Apoyo visual local: 1. Manning e impacto. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** La demo lee un CSV con 1000 simulaciones HEC-RAS y calcula estadísticos, correlaciones y regresiones. Distinguir este CSV del conjunto emparejado y depurado de 995 realizaciones por motor presentado en el caso principal. No afirmar que la interfaz elige distribuciones de Manning ni ejecuta los motores hidráulicos.

### Anexo 3. Demostración: curvas IDF

**Tiempo orientativo:** 2 min 06 s

La captura muestra una curva **IDF** obtenida con la demo sintética: **cuarenta años** de máximos anuales y **siete duraciones**, desde diez minutos hasta veinticuatro horas. Para cada **duración** se ajusta una GEV mediante **MAP** y se calculan intensidades asociadas a varios **períodos de retorno**. Cada línea representa un período de retorno distinto; la **intensidad** disminuye al aumentar la duración. Este producto organiza los extremos de precipitación y puede ser una entrada de diseño. Por sí solo no describe la forma temporal completa de la tormenta, la humedad antecedente ni la respuesta hidráulica. Por eso sirve para explicar la diferencia entre caracterizar la lluvia y calcular la **frecuencia del impacto**. Las cifras de esta demo no son los resultados del estudio IAHR 2022.

El **eje horizontal** representa duración y el **vertical**, intensidad. Para leer una lluvia de diseño elegimos una duración y una curva de período de retorno, y obtenemos su intensidad en la intersección. Cambiar de duración manteniendo el período compara extremos de distinta ventana temporal. Las líneas no son la evolución de una tormenta: no indican en qué momento llueve más dentro de un episodio. Para construir un **hietograma** y obtener un impacto hacen falta decisiones adicionales sobre distribución temporal, patrón espacial y estado de la cuenca. Esa distinción permite utilizar las curvas IDF con su finalidad propia sin asignar automáticamente su frecuencia al calado resultante.

**[Apoyo visual local: 1. Curvas IDF. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** Figura obtenida ejecutando /tools/idf con datos sintéticos. Ajuste MAP por duración. Usar como explicación de las curvas IDF, no como reproducción del experimento IAHR 2022 ni de sus caudales.

### Anexo 4. Demostración: análisis de frecuencia regional

**Tiempo orientativo:** 2 min 06 s

En esta captura usamos **cinco estaciones** sintéticas con cuarenta años de máximos anuales. El análisis regional divide los datos por el **caudal índice** de cada estación y ajusta una curva común mediante **L-momentos**. La figura central muestra el factor de crecimiento q de T. Para recuperar el nivel en una estación, multiplicamos ese factor por su caudal índice. A la derecha comprobamos la **homogeneidad**: en esta demo, H vale **0,386** y queda por debajo de uno. También se revisa la **discordancia** de las estaciones antes de agruparlas. Es una explicación del procedimiento index-flood; no son las 224 estaciones del caso Valencia ni sus períodos de retorno. La selección de la **región** debe justificarse físicamente, porque agrupar estaciones inadecuadas puede suavizar en exceso un extremo local.

La **curva de crecimiento regional** permite separar forma estadística y **escala local**. Primero dividimos cada serie por su índice para trabajar con magnitudes comparables; después ajustamos el comportamiento común y finalmente recuperamos las unidades multiplicando por el índice de la estación. El estadístico de **heterogeneidad** orienta sobre la compatibilidad del conjunto y la discordancia ayuda a localizar estaciones que requieren revisión. Un valor favorable en una demo no sustituye la justificación climática e hidrológica de una región real. La ganancia consiste en compartir información entre series comparables, manteniendo el vínculo con cada estación y evitando mezclar regímenes incompatibles solo para aumentar el tamaño de la muestra.

**[Apoyo visual local: 1. Curva y homogeneidad. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** Captura real de /tools/rfa: 5 estaciones sintéticas, 40 años, L-momentos, H=0,386. No confundir con Valencia. Etiquetas completas de períodos 25, 50, 200 y 500 verificadas.

### Anexo 5. Demostración: corrección de sesgo climático

**Tiempo orientativo:** 2 min 06 s

Esta captura usa treinta años de precipitación diaria sintética y la opción multiplicativa de **Quantile Delta Mapping**. A la izquierda se comparan las **distribuciones acumuladas** de la referencia, del modelo bruto y del modelo corregido. A la derecha, las **medias mensuales** permiten comprobar la estacionalidad y cómo cambia el sesgo. La corrección se calibra en un **período histórico** y se aplica al escenario: su objetivo es ajustar el sesgo sin borrar la **señal de cambio**, por lo que la distribución futura corregida no tiene por qué coincidir exactamente con la observación histórica. La interfaz permite también otras opciones, como **Scaled Distribution Mapping**. Esta es una demostración del módulo; las capturas no corresponden a datos de Panamá, Andes o SIMPCCe. En esos proyectos hay que documentar además el método, las variables y los períodos empleados.

La **distribución acumulada** relaciona un valor de precipitación con la proporción de datos que queda por debajo. Permite reconocer diferencias que una media única ocultaría. El gráfico mensual añade la estacionalidad: una corrección global puede comportarse de forma distinta según el mes. Para interpretar el escenario futuro hay que distinguir el sesgo histórico de la señal de cambio que queremos conservar según la variante aplicada. La referencia observada no es una plantilla que deba copiarse en todos los horizontes futuros. La comprobación consiste en revisar cómo se transforman las propiedades relevantes y documentar qué hipótesis sostienen esa transformación.

**[Apoyo visual local: 1. Antes y después. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** Captura de /tools/bias con demo sintética y QDM multiplicativo. No afirmar que este resultado reproduce las 414 combinaciones de Panamá ni que todos los proyectos usaron idéntica configuración. Señalar CDF, medias mensuales y conservación de la señal del escenario.

### Anexo 6. Demostración: eventos compuestos

**Tiempo orientativo:** 2 min 12 s

La captura muestra el ajuste de una cópula **Gumbel** a **ciento veinte** pares de caudal máximo y nivel del mar de la demo sintética. Los puntos representan los pares de la muestra y las líneas describen períodos de retorno conjuntos. En azul, **OR** significa que al menos una de las dos variables supera su umbral; en rojo, **AND** exige que ambas lo superen simultáneamente. Las cruces localizan el evento de **máxima densidad** conjunta sobre cada isolínea, el **MPDE**. Hay múltiples combinaciones de caudal y nivel que comparten un mismo período de retorno conjunto: por eso el diseño compuesto no se reduce a sumar dos extremos univariantes. Podemos comparar familias de cópulas, pero la elección debe atender a la dependencia y a las colas. La figura está guardada localmente y puede explicarse sin ejecutar la herramienta.

En esta demo, los pares de la muestra son **sintéticos**, aunque la herramienta permita trabajar con observaciones de un estudio real. Para leer una curva conjunta fijamos la definición AND u OR y después buscamos las combinaciones de ambos ejes que pertenecen a ella. Cambiar de definición modifica la probabilidad que estamos calculando. La **cruz de máxima densidad** identifica una combinación estadísticamente característica de esa curva, sin sustituir una exploración de su **respuesta hidráulica**. Si el nivel del mar dificulta el desagüe o si un caudal elevado domina el resultado, el escenario de mayor impacto dependerá de esas condiciones físicas y no únicamente de la densidad de la cópula.

**[Apoyo visual local: 1. Período de retorno conjunto y MPDE. Utiliza los botones de la diapositiva para cambiar de figura.]**

**Notas privadas:** Captura real de /tools/compound con familia Gumbel y 120 pares sintéticos. Distinguir OR y AND y explicar las cruces MPDE. Los puntos de demo no son observaciones de un caso piloto.

### Anexo 7. Anexo: bifurcación hidráulica del Besaya

**Tiempo orientativo:** 2 min 00 s

Los dos mapas comparan **regímenes hidráulicos** del ensemble de HEC-RAS en Los Corrales de Buelna. El régimen bajo reúne **97 realizaciones** y el alto, **898**; juntas forman las **995** realizaciones válidas del contraste. Los tonos de frecuencia espacial permiten reconocer qué zonas se inundan de forma consistente dentro de cada grupo. Son frecuencias entre realizaciones del ensemble, no **probabilidades anuales** de inundación asignadas directamente por estos mapas.

La diferencia que interesa es la conexión con un **compartimento secundario de unas 7,4 hectáreas**. El collado señalado se sitúa a **60,1 metros** y forma parte del corredor que permite esa conexión. Esto ayuda a investigar por qué aparecen dos grupos de áreas inundadas en los gráficos de comparación.

La interpretación necesita una precisión: la cota del collado **no es un umbral suficiente por sí solo**. Según la memoria, ambos regímenes llegan a mojar ese píxel, pero con distribuciones de nivel distintas. Intervienen conjuntamente el campo de rugosidad, los gradientes hidráulicos, la **malla** y la conectividad del corredor. Ninguna clase individual de Manning predice por sí sola el régimen.

Este anexo muestra cómo pasamos de una separación estadística a una **hipótesis física contrastable** mediante las salidas espaciales. La comparación entre motores y la comprobación con observaciones siguen siendo preguntas diferentes.

### Anexo 8. Anexo: proyecciones de niveles del lago Tanganica

**Tiempo orientativo:** 3 min 06 s

El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de **altimetría** satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y **AdaBoost** estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica **N(Q)**: **K-means** separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, **19 modelos CMIP6**, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método **delta mensual**. Cuarto, el bootstrap remuestrea los **residuos** de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente **20.000 años** simulados. Finalmente, los **máximos anuales** sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con **GEV**. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. La figura compara cambios de nivel respecto al histórico, en metros, para cuatro horizontes y dos escenarios. Las **barras de error** representan la incertidumbre del ensemble climático. La lectura compara los horizontes y sus bandas sin convertir una proyección concreta en una cota universal de diseño.

La figura distribuye los **cuatro horizontes en paneles**, de modo que debemos conservar escenario y período de retorno al comparar entre ellos. Dentro de cada panel, el eje horizontal identifica la frecuencia de diseño y la altura de la barra, el **incremento** respecto al histórico. Las barras de error añaden la dispersión asociada al ensemble climático. Un incremento pequeño para un período largo no significa que la cota absoluta sea menor que la correspondiente a un período corto: cada incremento se suma a una referencia histórica distinta. Tampoco debemos sumar como si fueran equivalentes el desacuerdo entre métodos históricos y la dispersión entre modelos climáticos. Son componentes de incertidumbre con orígenes diferentes.

### Anexo 9. Anexo: caudales proyectados de entrada al lago Tanganica

**Tiempo orientativo:** 1 min 48 s

Esta figura es una **serie temporal de caudales de entrada al lago**, no una curva de niveles extremos. El eje horizontal recorre los años y el vertical expresa caudal en **metros cúbicos por segundo**. El tramo gris representa la **referencia histórica**; azul y rojo distinguen las proyecciones **SSP2-4.5 y SSP5-8.5**. La línea vertical separa visualmente el tramo histórico del futuro y las zonas sombreadas representan **incertidumbre intermodelo**.

Las oscilaciones muestran que la proyección no consiste en una tendencia lisa y única. Las líneas centrales resumen cada escenario y las bandas permiten reconocer la dispersión de las estimaciones. El hecho de que se solapen en algunos períodos impide interpretar cualquier diferencia entre líneas como una separación inequívoca entre futuros posibles.

Estos caudales se estiman mediante **AdaBoost** a partir de información climática y alimentan después la relación **N de Q** para obtener niveles. Para llegar a cotas de diseño hay que continuar con la generación de variabilidad, los máximos anuales y la referencia histórica. La figura documenta un eslabón de la cadena, no observaciones futuras ni una cota directamente aplicable al puerto.

### Anexo 10. Anexo: red de túneles de Calle 30

**Tiempo orientativo:** 1 min 30 s

Este **mapa** sitúa el **dominio** del caso Calle 30. La cadena mostrada en la presentación conecta **lluvia multisitio**, **HEC-HMS** y **HEC-RAS 1D**; el mapa delimita la infraestructura a la que se asigna la frecuencia del **calado**.

El mapa permite localizar la **infraestructura y su entorno**, que dan sentido a la selección de puntos de entrada y **secciones** hidráulicas. Una sección de túnel y una zona de acceso pueden responder de forma distinta al mismo conjunto de caudales. Por eso el análisis conserva la posición de cada resultado. La figura no es un mapa de **período de retorno** ni permite leer un calado por su color sin una variable hidráulica asociada. Su función en la defensa es situar el dominio sobre el que se interpretan los perfiles y las curvas del caso principal, y recordar que el modelo 1D representa una red de infraestructura concreta.

### Anexo 11. Anexo: curvas completas de Valencia

**Tiempo orientativo:** 2 min 00 s

Los cuatro paneles permiten comparar **dos estaciones y dos muestras**. Arriba aparece **Turís**; abajo, **Carlet**. La columna izquierda ajusta las series **sin la DANA** de 2024 y la derecha incorpora ese episodio. En cada fila debemos mantener la estación al comparar de izquierda a derecha, porque la escala **vertical** cambia entre estaciones.

El **eje horizontal** representa **período de retorno** en años y el vertical, precipitación máxima diaria en milímetros. La línea **verde** representa el ajuste bayesiano; la **azul**, máxima verosimilitud; y la roja discontinua, **L-momentos**. Las **bandas** muestran incertidumbre. La línea horizontal punteada sitúa la **precipitación observada** del episodio: **710,8** milímetros en Turís y **265,1** en Carlet.

Hay dos lecturas diferentes. Si fijamos un período de retorno, las alturas de las curvas proporcionan cuantiles de diseño y permiten comparar estimadores. Si fijamos la precipitación observada, la intersección con cada curva permite examinar el período que ese ajuste le asigna. Incorporar el episodio cambia ambas lecturas al modificar la cola estimada.

La separación de curvas y el ensanchamiento de bandas hacia períodos largos recuerdan la incertidumbre de extrapolación. El contraste sirve para evaluar sensibilidad a la muestra y al método; no establece una frecuencia verdadera conocida del episodio ni permite interpretar como observaciones los cuantiles extrapolados.

### Anexo 12. Anexo: entrenamiento de SIMPCCe

**Tiempo orientativo:** 1 min 54 s

La captura muestra la pestaña **Modelos Regresión** de SIMPCCe. A la izquierda aparecen opciones para aportar una serie de aportaciones naturalizadas y para combinar el ajuste con la actualización climática. Las pestañas superiores sitúan esa operación entre la **configuración de la cuenca** y el **cambio climático**. Los controles visibles corresponden al ejemplo capturado; no indican por sí solos una configuración válida para cualquier cuenca.

El gráfico superior derecho compara **observado en horizontal y simulado en vertical**. La línea diagonal permite reconocer coincidencia entre ambos valores; los puntos muestran sus diferencias. Los indicadores **NSE**, **R cuadrado** y **sesgo** resumen aspectos distintos del ajuste. El valor de cada uno pertenece a este ejemplo de la interfaz y no es una validación global de la herramienta.

El panel inferior compara las **series temporales de aportaciones**, en hectómetros cúbicos por mes. Permite revisar si se reproducen la evolución y los picos, además de los indicadores agregados. La zona de registro documenta el avance del proceso.

Este anexo explica cómo se configura y revisa el modelo de aportaciones. En la diapositiva principal, esas aportaciones se conectan con un **modelo de gestión** para interpretar suministro y fiabilidad; esta pantalla no calcula por sí sola toda esa decisión.

### Anexo 13. Del Trabajo Fin de Máster a la pregunta doctoral

**Tiempo orientativo:** 1 min 42 s

El **Trabajo Fin de Máster** demostró que la **frecuencia del impacto** debía calcularse después de la simulación hidráulica. Al mismo tiempo dejó visible una limitación práctica: la cadena funcionaba, pero dependía de muchos **traspasos manuales** y de una configuración específica para una única cuenca. Este antecedente ayuda a plantear una pregunta más general. ¿Cómo conservar el rigor del método, repetirlo de forma auditable y transferirlo a problemas con otros datos, otras escalas y otros modelos físicos?

En el esquema se reconoce la secuencia **aforos, eventos, dependencia, hidrogramas, respuesta hidráulica e impacto**. Esa secuencia aporta el fundamento científico previo. La pregunta doctoral exige después formular **hipótesis y objetivos** para decidir qué debemos automatizar, cómo organizarlo y con qué evidencia valorar la propuesta. Por tanto, el TFM es un **antecedente metodológico**, mientras que el desarrollo de **pyhydra** se plantea para responder a los requisitos de la tesis. Esta distinción evita presentar una aplicación inicial como si ya contuviera toda la plataforma actual o como si su evolución tecnológica hubiera sido el único objetivo de investigación.

**Notas privadas:** Esta diapositiva es el puente entre el origen de la investigación y la formulación del problema. No adelantar nombres de paquetes. El mensaje es que la tesis generaliza una necesidad científica detectada en el TFM.

### Anexo 14. Estrategia de investigación

**Tiempo orientativo:** 2 min 00 s

Una vez formulada la pregunta, la estrategia de investigación se organiza en cuatro decisiones. La primera es representar explícitamente la **incertidumbre** mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema, no solo sobre la variable de entrada. La segunda es **automatizar** la cadena completa para evitar rupturas manuales entre **datos**, métodos y modelos. La tercera es **separar** sus componentes para que puedan sustituirse o reutilizarse sin reconstruir todo el flujo. La cuarta es **validar** la propuesta en problemas de distinta escala y con información disponible muy diferente. Consideraremos que la respuesta funciona si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, se adapta a distintos modelos y produce resultados útiles en aplicaciones científicas e industriales.

Las cuatro decisiones pueden leerse como **necesidad, estrategia y criterio de éxito**. Representar incertidumbre exige generar alternativas y analizar sus impactos. Conectar operaciones exige controlar los intercambios de información. Modularizar permite sustituir un componente sin reconstruir el conjunto. Aplicar el flujo a problemas distintos permite examinar qué se reutiliza y qué necesita adaptación. El éxito debe evaluarse con **evidencias concretas** y **límites explícitos**: una operación disponible, una ejecución repetida, una comparación de resultados o un material que permita revisar el procedimiento. Esta figura organiza la estrategia de investigación y no constituye por sí misma el resultado de su validación.

**Notas privadas:** Esta diapositiva pertenece todavía a la introducción. No mencionar aquí nombres de paquetes, herramientas o casos. Leer por filas: necesidad → estrategia → criterio de éxito. Los nombres técnicos se presentan más adelante, después del estado de la técnica y de la arquitectura.

### Anexo 15. Mapa metodológico de la tesis

**Tiempo orientativo:** 1 min 54 s

Antes de la arquitectura técnica, este es el mapa metodológico: **cinco responsabilidades** y los submódulos de pyhydra que las materializan. Los **datos**: lluvia, caudal, cambio climático y suelos. Los **extremos y el clima**: series, análisis regional y corrección de sesgo. Los **escenarios**: generación estocástica y downscaling híbrido. La **respuesta física**: HEC-HMS, SWAT+, SFINCS y HEC-RAS. Y el **impacto**: reconstrucción de escenarios no simulados, sensibilidad y período de retorno sobre el calado. La web organiza estas capacidades en **cuatro módulos funcionales**: fuentes de datos, análisis climático, generación estocástica y modelización. El código reúne los catorce submódulos descritos en la memoria en **tres paquetes principales**; cada caso utiliza solo la combinación que necesita.

Las cinco responsabilidades del esquema no son cinco módulos adicionales de la web. Describen funciones científicas que atraviesan la organización del software. Un mismo componente puede intervenir en varios pasos: los extremos ayudan a caracterizar entradas, y la reconstrucción ayuda a formar el conjunto de impactos. Las flechas señalan relaciones de cálculo; no obligan a que cada caso recorra todas las cajas en el mismo orden. La utilidad del mapa es mantener identificada la salida de cada transformación y su **procedencia**, de modo que podamos seguir una cifra desde el dato de entrada hasta el resultado de ingeniería.

**Notas privadas:** Utilizar esta diapositiva como orientación. No enumerar aún clases ni submódulos. En la diapositiva siguiente se explica que la arquitectura asigna una capa técnica a estas responsabilidades.

### Anexo 16. Resultados que sostienen la contribución

**Tiempo orientativo:** 1 min 42 s

Estas **cuatro figuras** reúnen resultados que se desarrollan en el recorrido principal. IAHR muestra un ejemplo T100 de **208,8 frente a 278,5** m³/s, un aumento del **33,4 por ciento** respecto a IDF; el mapa espacial corresponde a un horizonte distinto. En Valencia, el nivel T100 bayesiano pasa de **260 a 952 mm** al incorporar la DANA. En el Besaya, **995 pares** de simulaciones permiten comparar dos motores. En Panamá, **414 combinaciones** describen dimensiones del análisis climático, no un registro de ejecuciones hidráulicas. Cada resultado debe leerse con su variable, **método**, horizonte y alcance.

Para comparar estas cuatro evidencias hay que conservar sus **unidades y preguntas**. El ejemplo IAHR relaciona un caudal con el procedimiento de diseño. Valencia relaciona un cuantil de precipitación con la inclusión de un episodio en la muestra. Besaya compara respuestas de motores para realizaciones emparejadas. Panamá muestra organización de entradas y configuraciones a escala nacional. No son cuatro medidas del mismo efecto ni cuatro pruebas intercambiables de exactitud. En conjunto, permiten reconocer por qué resulta útil una cadena trazable: hace posible identificar qué decisión o componente produce una diferencia y qué contraste adicional se necesita para interpretarla.

**Notas privadas:** Resumen de reserva. El rango 30–37 % del texto de la memoria queda pendiente de cotejo con el artículo original; se utiliza el ejemplo aritméticamente comprobable de +33,4 % respecto a IDF.

### Anexo 17. Autoría completa de la línea de investigación

**Tiempo orientativo:** 2 min 06 s

Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución, y esta tabla la resume. Soy **primer autor en siete** trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los **trabajos andinos** contribuí a la calibración automática y al procesamiento climático; en **NEOPRENE**, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en **Valencia**, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. pyhydra ha servido también como herramienta para las tesis de **Diego Urrea Méndez** y **Dina Vanesa Gómez Rave**. Finalmente, **pyhydra e HYDRA** son software con rol de primer autor, diseñado, desarrollado y documentado como parte de la tesis.

La **posición de autoría** y la **tarea realizada** responden a preguntas distintas. Ser primer autor identifica una responsabilidad principal, pero no implica autoría única de un trabajo colectivo. Las filas de colaboración delimitan tareas concretas de calibración, procesamiento climático, desarrollo de software o cálculo de extremos. La tabla recoge también la **transferencia** de pyhydra como herramienta de apoyo a otras investigaciones doctorales. Finalmente, el software constituye un producto con responsabilidades de diseño, desarrollo, documentación y distribución. Este desglose permite responder por una publicación concreta sin convertir una contribución parcial en una atribución de todo el estudio.

**Notas privadas:** Esta diapositiva responde preventivamente a dos preguntas: qué resultados pertenecen al doctorando y cómo se relacionan las publicaciones previas con la contribución doctoral. La tabla se distribuye en dos columnas; se leen por separado de arriba abajo. El uso de pyhydra en otras tesis describe transferencia de la herramienta; no implica dirección ni autoría de esas tesis.

### Anexo 18. Anexo: resultados completos de SIMPCCe

**Tiempo orientativo:** 2 min 00 s

Esta es la ficha de aportaciones reproducida en la figura 10 del artículo de SIMPCCe. El ejemplo se identifica como embalse de **Alcántara**. Las matrices superiores muestran cambios anuales por modelo para **RCP4.5** y **RCP8.5**. Debajo se presentan aportaciones medias, varianza y **cuantil 25** por mes, junto a paneles que comparan el cambio porcentual de la media y factores de cambio de los cuantiles. Las filas corresponden a los tres horizontes futuros.

La ficha muestra los productos que genera la herramienta. Para leer un valor concreto debe ampliarse su panel y comprobar **variable**, unidad, **horizonte** y escenario.

La lectura exige distinguir **porcentajes de cambio** de **factores multiplicativos**. Un cambio porcentual se interpreta respecto a la referencia histórica y tiene cero como **ausencia de cambio**; un factor tiene uno como referencia. Las filas organizan los horizontes y los colores separan los escenarios. Las medias y la varianza resumen aspectos diferentes de las aportaciones, mientras que el cuantil 25 permite examinar la parte baja de su distribución. Esta ficha reúne productos de diagnóstico: para utilizar una cifra de diseño habría que identificar el panel, el punto, la variable y el escenario correspondientes y conservar su referencia. La figura completa sirve como respaldo documental, sin sustituir esa lectura detallada por un único valor general.

**Notas privadas:** Fuente: figura 10, p.144, del artículo publicado de Navas y del Jesus (2025). Ejemplo identificado como Alcántara. La diapositiva principal muestra el apoyo a decisiones de la figura 11; este anexo conserva la ficha de aportaciones. No inventar valores a partir de la imagen.

### Anexo 19. Anexo: posiciones y orientaciones completas de las fotografías UAV

**Tiempo orientativo:** 1 min 36 s

Esta es la **figura S8 completa** que respalda la composición de la presentación principal. A la izquierda aparece la vista general del tramo y a la derecha, los detalles de los **sectores A y B**. Los **puntos azules y naranjas** sitúan las tomas, conservando el **identificador** de cada fotografía de S9. La flecha **norte** y las **barras de escala** permiten interpretar la orientación y el tamaño de las zonas representadas.

La **franja inferior** contiene una referencia por fotografía. Cada círculo está orientado con el norte hacia arriba y su flecha indica el **azimut de la cámara**. Para relacionar una vista oblicua con el mapa buscamos primero su número, localizamos el punto y revisamos hacia dónde miraba la cámara. Estas flechas describen la toma fotográfica; **no son vectores hidráulicos**.

El original permite revisar la correspondencia espacial sin alterar la imagen del artículo. Documenta posiciones y perspectivas del terreno. Para contrastar una simulación de crecida se necesitarían además **observaciones hidráulicas** apropiadas y sus condiciones de adquisición.

**Notas privadas:** Original S8 copiado sin alteración. Puede ampliarse desde la vista de estudio. La diapositiva principal recompone únicamente los tres paneles cartográficos, manteniendo sus píxeles, identificadores, escalas y norte. La orientación de cámara se consulta en esta figura completa.

### Anexo 20. Evolución de la investigación (2017–2026)

**Tiempo orientativo:** 1 min 36 s

La **cronología** muestra cómo fue ampliándose el problema inicial. En 2017 y 2018, el **Besaya** permitió formular y publicar la estimación de **frecuencia sobre el impacto**. Los trabajos posteriores incorporaron cuencas con pocos datos, calibración en grandes dominios y escenarios con coherencia espacial y temporal.

Las primeras fechas corresponden al trabajo sobre **frecuencia del impacto**. El siguiente grupo incorpora la escasez de observaciones y los dominios de mayor tamaño, que exigen completar entradas y repetir calibraciones. Después aparecen los desarrollos de **escenarios espaciales y temporales**, necesarios para representar entradas simultáneas y su persistencia. Las aplicaciones de 2024 y 2025 permiten contrastar métodos y atender necesidades industriales. El último tramo recoge la integración y distribución del software. La cronología organiza esa evolución; no significa que todos los componentes actuales estuvieran ya implementados en los primeros trabajos.

Las aplicaciones industriales añadieron **exigencias de ejecución**, contraste y documentación. Ese recorrido converge en la **arquitectura** y las versiones de software de la tesis. La diversidad de métodos responde a necesidades concretas que se han convertido en **componentes reutilizables**.

**Notas privadas:** Explicar una evolución científica, no una sucesión de congresos o lugares. El primer hito es el TFM del doctorando. La comunicación de las V JIA es una vía de difusión del trabajo, no el origen conceptual por sí sola.

### Anexo 21. HYDRA en Azure y en el entorno de cada proyecto

**Tiempo orientativo:** 3 min 48 s

Esta diapositiva distingue **dos usos** de la misma plataforma. La fila superior muestra el **despliegue público** que hemos preparado en **Azure** para facilitar el acceso a HYDRA. El código se conserva en GitHub, se construyen imágenes con sus dependencias, se almacenan en Azure Container Registry y se ejecutan en Azure Container Apps. La web reúne la **documentación**, las **herramientas interactivas** y los casos de estudio. La API atiende las operaciones de las herramientas y **JupyterLab** permite explorar y ejecutar los notebooks disponibles. Los datos y las sesiones que deben conservarse utilizan almacenamiento persistente.

Esta instalación pública facilita conocer los métodos, consultar su documentación y trabajar con los ejemplos disponibles. Abrir un notebook en ella prepara una copia de trabajo dentro de la **infraestructura compartida**; no despliega una instalación completa de HYDRA para cada usuario.

La fila inferior muestra cómo un usuario puede montar su **propio entorno** para un proyecto. Obtiene una versión del repositorio y utiliza la configuración **Docker Compose** incluida para construir y levantar los servicios **web, API y JupyterLab** en su equipo o en un servidor propio. A continuación configura los volúmenes que conectan esos servicios con sus carpetas de **datos, modelos y resultados**. Así puede adaptar los notebooks y la configuración al problema que quiere estudiar, conservando sus archivos fuera de la vida del contenedor.

También existe una variante más sencilla para quien solo quiera trabajar con notebooks: ejecutar únicamente el contenedor de JupyterLab con pyhydra y sus dependencias. En ese caso no necesita levantar la web ni la API. Conecta sus notebooks y datos mediante volúmenes, configura el acceso directo a JupyterLab y conserva los resultados en sus carpetas de proyecto. La plataforma completa es útil si desea disponer también de las herramientas y la interfaz web; el contenedor de notebooks basta cuando el trabajo se realiza desde código.

Las imágenes reúnen el software y sus dependencias compatibles, pero un proyecto sigue necesitando sus datos, parámetros y los **motores externos** que utilice. Deben comprobarse sus requisitos de instalación, plataforma y licencia. Docker Compose proporciona el punto de partida del entorno propio; su puesta en servicio en un servidor exige configurar también los accesos y la persistencia. La distinción central es, por tanto, el propósito de cada instalación: Azure ofrece una puerta de entrada pública a HYDRA; el despliegue propio permite organizar y conservar el trabajo específico de un proyecto.

**Notas privadas:** Fuentes: README.md, docs/instalacion.md, docker/docker-compose.yml y deploy/azure/README.md. La configuración local incluye web, API y JupyterLab; el servicio jupyter puede utilizarse por separado, configurando el puerto de acceso, JUPYTER_BASE_URL, JUPYTER_WORKDIR y los volúmenes de notebooks y datos; HYDRA_DATA_PATH permite montar una carpeta de datos propia. En Azure, web/API y Jupyter se ejecutan en aplicaciones separadas. No confundir una copia de notebook en el servicio público con un contenedor o instalación exclusiva por usuario. No afirmar que Docker elimina requisitos de motores o licencias. La configuración Compose es un punto de partida: revisar autenticación y accesos antes de exponer un servidor propio.

### Anexo 22. Besaya: dónde se tomaron las fotografías del terreno

**Tiempo orientativo:** 2 min 18 s

Antes de comparar los motores, sitúo la **documentación del terreno** que acompaña al artículo de rugosidades. El **mapa general** de la izquierda representa el tramo del Besaya en Los Corrales de Buelna. La flecha indica el **norte** y la barra inferior permite reconocer la escala del dominio.

Los **puntos azules** identifican las fotografías del **sector A**, en la parte norte, alrededor del puente y del trazado curvo del cauce. Los **naranjas** corresponden al **sector B**, situado más al sur junto a la zona edificada. Los dos paneles de la derecha amplían esos sectores y conservan los mismos identificadores. La **leyenda central** mantiene la correspondencia entre los colores y cada sector.

**Cada número** enlaza una posición del mapa con una fotografía de la lámina siguiente. La **figura S8 completa**, disponible en el anexo, añade la **orientación de la cámara** para cada toma. Esa información permite comprender por qué fotografías obtenidas desde lugares próximos muestran perspectivas distintas. En esta composición nos centramos en localizar los dos sectores y relacionar sus identificadores con las fotografías.

Esta documentación ayuda a reconocer la geometría visible del corredor y la distribución de vegetación, superficies abiertas e infraestructura. Es un apoyo para interpretar la **heterogeneidad** del dominio, no una medición directa del **coeficiente de Manning**. Con esa localización, podemos leer ahora las fotografías y relacionarlas con el territorio que representan.

**Notas privadas:** Composición apaisada de los tres mapas originales de S8, sin retocar sus píxeles. Se mantienen identificadores, norte y escalas. S8 completa, con las orientaciones, se conserva en el anexo 20. Sectores A y B según la leyenda original; identificadores correspondientes a S9. No atribuir dirección de flujo a los azimuts de cámara, ni fecha de campaña, calados de avenida o valores de Manning a partir de estas imágenes.

### Anexo 23. Besaya: heterogeneidad del cauce y de sus márgenes

**Tiempo orientativo:** 2 min 18 s

La lámina reúne las **fotografías aéreas** del artículo. Los **números** de cada imagen permiten volver a su **posición y orientación** en el mapa anterior. Son distintas vistas del terreno utilizado como dominio del estudio.

En las imágenes del entorno del puente se reconocen el cauce, sus curvas, superficies expuestas, franjas de **vegetación ribereña** y la relación con la infraestructura. Otras perspectivas muestran **prados y espacios abiertos** junto al corredor fluvial. Las fotografías del sector B amplían la lectura hacia el tramo meridional y su proximidad a zonas edificadas. Las tomas oblicuas ayudan a reconocer relaciones espaciales que una vista exclusivamente cenital puede hacer menos evidentes.

Esa diversidad importa al interpretar la **rugosidad**: representar todo el dominio mediante un único valor oculta diferencias entre superficies y coberturas. En el estudio se exploran distribuciones de **Manning** para **nueve clases de uso del suelo** y se propagan sus combinaciones mediante los motores hidráulicos. Las fotografías ilustran el **contexto físico** de esa heterogeneidad; por sí solas **no determinan** un valor numérico del coeficiente.

Tampoco son fotografías de una avenida con niveles medidos, por lo que no las utilizamos aquí para afirmar cuál motor reproduce mejor una crecida observada. Su función es documentar el dominio y apoyar la interpretación del experimento. A continuación veremos qué cambia en los calados y las áreas al ejecutar las mismas realizaciones con **HEC-RAS y SFINCS**.

**Notas privadas:** Original aportado por el autor: figS9_uav_photos.jpg, sin recortes ni alteración. Mantener la relación de números con S8. Describir coberturas visibles sin atribuir fechas, tipos granulométricos medidos, valores de Manning o niveles de avenida no documentados. Nueve clases de uso del suelo: configuración del ensemble del estudio, no clasificación inferida automáticamente a partir de estas fotografías. La vista de estudio permite ampliar el original.

### Anexo 24. Lago Tanganica: niveles de diseño bajo cambio climático

**Tiempo orientativo:** 2 min 30 s

En el lago Tanganica estimamos **cotas de diseño** bajo cambio climático con altimetría de 1992–2023. A la izquierda, AdaBoost convierte ERA5 en **caudales mensuales**; la relación empírica N(Q) los transforma en niveles. Los deltas de **19 modelos CMIP6** incorporan la señal climática. El bootstrap remuestrea los **residuos** de N(Q).

A la derecha mostramos el horizonte **2041–2060** de la memoria. El eje horizontal indica el **período de retorno**; el vertical, el **incremento de nivel** respecto al histórico. Los colores distinguen ambos escenarios SSP y las barras de error representan **incertidumbre intermodelo**. Los cuatro horizontes están en el anexo.

Podemos recorrer la **columna izquierda** sin saltar directamente desde el clima a una cota extrema. AdaBoost estima **caudal mensual**; N de Q transforma caudal en **nivel** y distingue tres regímenes para representar una relación no lineal. El bootstrap actúa sobre los **residuos de esa relación**, generando variabilidad alrededor de ella. En el gráfico de la derecha, cada grupo corresponde a un período de retorno y las barras comparan los dos escenarios SSP en 2041–2060. El eje vertical expresa un **incremento en metros**, no la altitud absoluta del lago. Las barras de error representan la incertidumbre intermodelo indicada en la memoria. Para obtener una cota futura hay que añadir el incremento a su referencia histórica, manteniendo el mismo período de retorno.

Los cambios calculados con máximos anuales sintéticos se suman a las cotas históricas ajustadas con GEV. Así obtenemos niveles futuros conservando la referencia observada.

**Notas privadas:** Fuente: §7.6.2–7.6.3, pp. 108–109; figura 7.15, p. 110. El texto menciona 770,19 m bootstrap y 771,55–771,76 m GEV/Weibull para T100; el intervalo entre métodos no es una banda de confianza. R²=0,96 corresponde al conjunto completo y no es una validación independiente. Hay una discrepancia entre texto/pie y las barras de la figura 7.15 sobre el horizonte máximo y el umbral de 0,6 m para T100–T500: no afirmar esos dos resultados hasta contrastar la tabla numérica original. No atribuir al bootstrap de N(Q) todas las fuentes de incertidumbre. El detalle mostrado conserva las barras y ejes originales del horizonte identificado.
## Hoja de ensayo

### Comprobación del libreto · 26 de octubre de 2026

El recorrido principal en vivo contiene **10702 palabras de diálogo y 581 de transiciones**. A 115 palabras por minuto, son unos **98,1 minutos de voz**; la estimación completa es de **111 minutos**, incluyendo pausas, figuras y demostración. A 100 palabras por minuto, el texto solo requiere **112,8 minutos**. La variante con demos preparadas sustituye el diálogo de la demo por la explicación de las capturas, sin ejecutar la API.

El diálogo está sincronizado con las 48 diapositivas principales y los 24 anexos. Esta revisión del texto y los tiempos no sustituye un ensayo oral cronometrado del doctorando.

Después de cada ensayo, anotar aquí:

| Fecha | Duración | Bloque que se alargó | Duda o error detectado | Cambio necesario |
|---|---:|---|---|---|
| — | — | — | — | — |

## Reglas para mantener vivo este documento

- Si cambia el orden de las diapositivas, actualizar primero el mapa oral y las transiciones.
- Si cambia una cifra, corregirla en la memoria de trabajo, en `slides.ts` y en este guion.
- Toda cifra que se pronuncie debe tener una fuente verificable en la memoria o en una publicación asociada.
- Los detalles técnicos que no sostienen una conclusión pasan a preguntas o material de reserva.
- Cada caso debe responder siempre a cuatro preguntas: **problema, proceso, resultado y papel de pyhydra/HYDRA**.
- Antes de la versión final, realizar al menos tres ensayos completos cronometrados y uno con interrupciones simuladas del tribunal.

## Cómo ensayar este relato

Esta revisión contiene **48 diapositivas principales y 24 anexos**. La estimación es de **111 minutos**, con voz a 115 palabras/minuto, transiciones, lectura de figuras y una demo breve. Debe comprobarse mediante ensayo cronometrado.

Cada diapositiva sigue el mismo recorrido: **situar lo que se ve → explicar la comparación → extraer una idea → precisar su alcance → enlazar con la pregunta siguiente**. El diálogo completo de arriba es el libreto vigente. Los antiguos desarrollos temáticos se han archivado con la revisión anterior para evitar estudiar un segundo relato que no siga el orden de pantalla.

### Introducción

La decisión requiere frecuencia del impacto. El procedimiento habitual conduce al mapa, pero sus hipótesis no garantizan trasladar la frecuencia de la lluvia. El ejemplo de dos respuestas a una misma lluvia lo hace visible. El Besaya explica el origen de la pregunta doctoral; las hipótesis y objetivos fijan cómo evaluarla.

### Estado de la técnica

La cadena estocástica termina en una distribución de impactos. La comparación de marcos identifica qué combinación de responsabilidades se pretende integrar.

### Arquitectura y metodología

Las capas explican quién calcula y quién ejecuta; los cuatro módulos funcionales de la web, qué operaciones necesita cada estudio. Para cada método, comenzar por ejes, curvas o bloques de la figura y terminar en su papel dentro del cálculo.

### Casos

Besaya: frecuencia tras la hidráulica y diferencias entre motores. Mallorca: pocos datos. Calle 30: viabilidad de la cadena y lectura de resultados. Valencia: sensibilidad a la muestra. Tanganica: nivel de diseño con datos limitados. Andes: calibración regional. IAHR: sensibilidad al procedimiento. SIMPCCe: otra finalidad de gestión. Panamá: escala nacional.

### Conclusiones

Distinguir productos y autoría. Cerrar H1, H2 y H3 con evidencia y límites. Separar métodos previos, desarrollo y contribución original. Priorizar contraste observacional y medida del ahorro. Agradecer y responder a la pregunta inicial.

### Material trasladado a reserva

- **Anexo 14: Qué significa el título de la tesis.** Ampliación disponible fuera del recorrido principal.
- **Anexo 15: Del Trabajo Fin de Máster a la pregunta doctoral.** Ampliación disponible fuera del recorrido principal.
- **Anexo 16: Por qué es necesaria esta tesis.** Ampliación disponible fuera del recorrido principal.
- **Anexo 17: Pregunta de investigación.** Ampliación disponible fuera del recorrido principal.
- **Anexo 18: Qué aporta esta tesis.** Ampliación disponible fuera del recorrido principal.
- **Anexo 19: Estrategia de investigación.** Ampliación disponible fuera del recorrido principal.
- **Anexo 20: Evolución de la investigación (2017–2026).** Ampliación disponible fuera del recorrido principal.
- **Anexo 21: Mapa metodológico de la tesis.** Ampliación disponible fuera del recorrido principal.
- **Anexo 22: Infraestructura de despliegue industrial.** Ampliación disponible fuera del recorrido principal.
- **Anexo 23: Un producto científico y operativo real.** Ampliación disponible fuera del recorrido principal.
- **Anexo 24: Valencia en HYDRA: los números reales del caso.** Ampliación disponible fuera del recorrido principal.
- **Anexo 25: Resultados que sostienen la contribución.** Ampliación disponible fuera del recorrido principal.
- **Anexo 26: Qué demuestra el conjunto de casos.** Ampliación disponible fuera del recorrido principal.
- **Anexo 27: Autoría completa de la línea de investigación.** Ampliación disponible fuera del recorrido principal.

## Preparación de las preguntas del tribunal

Documento interno de ensayo. Estas preguntas se preparan a partir del contenido del guion y de los resultados que recoge la presentación; no son una predicción del tribunal. Las respuestas no añaden resultados experimentales que no estén documentados. Si se solicita un detalle de ejecución, una métrica o una atribución que no se puede acreditar, consultar la fuente antes de afirmarlo.

**Cómo responder:** escuchar la pregunta completa; contestar primero en una frase; desarrollar la evidencia; declarar el límite; abrir una figura solo si ayuda. Ensayar cada respuesta en 45-90 segundos. Las preguntas técnicas pueden ampliarse a dos minutos si el tribunal lo pide. Estos tiempos no forman parte de los 53 minutos estimados del recorrido principal.

**Prioridad de ensayo:** preguntas 1, 3, 4, 7, 8, 11, 14, 17, 37, 39, 40 y 45. Son las que más afectan a originalidad, autoría, validación, incertidumbre, demostración y reproducibilidad.

**Referencias de apoyo:** los números de diapositiva corresponden al recorrido principal de 51 diapositivas; los de anexo, a las 20 diapositivas de reserva. Comprobarlos si se modifica el orden. Las fuentes citadas son las identificadas en el guion; tener disponibles las publicaciones, los informes y la tabla de autoría de la memoria para responder a solicitudes de detalle.

## Preguntas 1-6. Originalidad y contribución personal

### Pregunta 1. ¿Cuál es exactamente la aportación original de la tesis?

**Respuesta para decir:** La aportación original es convertir una cadena de métodos científicos previamente desarrollados en una arquitectura automática, reproducible y transferible para estudiar inundaciones bajo incertidumbre. He conectado adquisición de datos, análisis estadístico, escenarios y modelos físicos hasta obtener resultados sobre el impacto. La contribución se materializa en módulos, adaptadores y flujos de cálculo, y se contrasta en problemas reales de distinta escala. La originalidad se sostiene en esa integración y en su evidencia de aplicación, reconociendo expresamente la procedencia de los métodos de base.

**Evidencia:** arquitectura de tres niveles, módulos reutilizables y diez estudios; cuatro con notebooks y requisitos de ejecución propios.

**Límite:** no reivindicar como nuevos GEV, cópulas, MaxDiss, k-NN ni los motores hidráulicos.

**Apoyo:** diapositiva 16; diapositiva 29; diapositiva 48; capítulos de arquitectura, casos y contribuciones de la memoria.

### Pregunta 2. Si los métodos y los motores ya existían, ¿qué conocimiento nuevo aporta HYDRA?

**Respuesta para decir:** HYDRA permite estudiar de forma consistente cómo las decisiones y la incertidumbre de cada etapa se transmiten hasta el impacto. Los casos muestran consecuencias concretas: diferencias respecto al diseño convencional, cambios de estimadores tras un extremo sin precedente y respuestas distintas entre motores hidráulicos. La arquitectura convierte esos análisis en operaciones repetibles y comparables. El conocimiento que aporta la tesis incluye la evidencia sobre esas consecuencias, las condiciones de transferencia y los límites de la cadena completa.

**Evidencia:** contraste IAHR 2022, actualización de extremos en Valencia y comparación emparejada en Besaya.

**Límite:** los resultados de un caso no constituyen una demostración universal de superioridad.

**Apoyo:** diapositiva 33; diapositiva 37; diapositiva 41; diapositiva 48.

### Pregunta 3. ¿Qué diferencia una contribución doctoral de una integración de software?

**Respuesta para decir:** La diferencia está en la pregunta de investigación, las hipótesis y la evidencia obtenida al aplicarla. Esta tesis pregunta si es posible automatizar y transferir una cadena probabilística completa sin perder la incertidumbre entre etapas. El software es el instrumento que permite contrastar esa pregunta en casos heterogéneos. Las aportaciones incluyen los resultados científicos de esas aplicaciones y una delimitación de lo que la automatización demuestra y de lo que todavía requiere validación. La integración debe evaluarse por esos resultados y por su trazabilidad.

**Evidencia:** formulación de H1-H3 y cierre con evidencia diferenciada de automatización, modularidad e incertidumbre.

**Límite:** instalar un programa o conectar herramientas, por sí solo, no acredita una aportación científica.

**Apoyo:** diapositiva 10; diapositiva 9; diapositiva 47; diapositiva 48.

### Pregunta 4. ¿Qué has desarrollado tú y qué corresponde a tus colaboradores?

**Respuesta para decir:** En pyhydra e HYDRA soy el autor del diseño, desarrollo, documentación y publicación del software. En los trabajos científicos, mi responsabilidad cambia y está delimitada en la tabla de autoría: he liderado metodología, modelización, automatización, análisis y redacción en los trabajos principales; en otros he contribuido a calibración, procesamiento climático, generación estocástica o cálculo de extremos. Citaría el papel concreto en el trabajo por el que me pregunten. Los métodos y los motores de terceros se atribuyen a sus autores.

**Evidencia:** siete trabajos como primer autor, cuatro con aportación delimitada y software con rol de primer autor, según la presentación.

**Límite:** el trabajo del grupo sobre vine cópulas/GPR de 2026 no es una contribución propia de esta tesis. Verificar cada atribución con la tabla de la memoria.

**Apoyo:** diapositiva 46; anexo 18; tabla de rol del doctorando, capítulo 8.

### Pregunta 5. ¿Qué resultados existían antes de la tesis y cuáles se obtuvieron durante ella?

**Respuesta para decir:** Distingo el antecedente fundacional, los trabajos que desarrollaron la línea y la síntesis de la tesis. El TFM del Besaya de 2017 y su publicación de 2018 originan el problema científico. La evolución posterior incorpora generación espacial, infraestructura urbana, aplicaciones climáticas, eventos extremos y comparación de motores. La tesis los organiza y formaliza en una arquitectura transferible. Para clasificar un trabajo como anterior o realizado durante el doctorado utilizaría las fechas de matrícula, ejecución y publicación, que no son necesariamente coincidentes.

**Evidencia:** trayectoria 2017-2026 y estados editoriales de las publicaciones.

**Límite:** la cronología de publicaciones no sustituye la delimitación administrativa del período doctoral; llevar esa información preparada.

**Apoyo:** diapositiva 6; anexo 14; diapositiva 13; diapositiva 45; anexo 18.

### Pregunta 6. ¿Por qué desarrollar HYDRA si existen otros marcos integrados?

**Respuesta para decir:** Los marcos revisados resuelven partes relevantes del problema y son referencias necesarias. La necesidad identificada es reunir adquisición de datos, extremos con incertidumbre, dependencia, generación de escenarios, señal climática, motores profesionales y frecuencia sobre el impacto en un mismo flujo transferible. La comparación del estado de la técnica muestra una cobertura funcional parcial en los marcos más próximos. HYDRA responde a esa necesidad concreta y puede incorporar componentes de esos ecosistemas cuando resulten adecuados.

**Evidencia:** comparación de ocho capacidades con CLIMADA, RainyDay, wflow/HydroMT y simulación continua.

**Límite:** la tabla es una comparación de alcance funcional documentado; no un benchmark actualizado de rendimiento ni una clasificación absoluta de herramientas.

**Apoyo:** diapositiva 15; anexo 16; diapositiva 16; capítulo 2 de la memoria.

## Preguntas 7-13. Hipótesis y validación

### Pregunta 7. ¿Qué evidencia permite aceptar cada una de las tres hipótesis?

**Respuesta para decir:** H1 se apoya en la viabilidad de ejecutar cadenas extensas de forma automatizada; no presento esa evidencia como una medición universal del ahorro de tiempo. H2 se apoya en la reutilización de bloques de datos, clima y modelización entre problemas distintos. H3 se apoya en resultados donde representar escenarios e incertidumbre cambia la interpretación del diseño: el contraste IAHR 2022, Valencia y la sensibilidad del Besaya. Las hipótesis reciben evidencia complementaria, con un alcance específico para cada una.

**Evidencia:** Calle 30 y Panamá para escala y ejecución; diversidad de casos para modularidad; comparación de metodologías y distribuciones para H3.

**Límite:** la evidencia acumulada no equivale a una prueba universal para cualquier cuenca y condición.

**Apoyo:** anexo 17; diapositiva 44; diapositiva 47.

### Pregunta 8. ¿Cómo has medido la mejora de eficiencia respecto al trabajo manual?

**Respuesta para decir:** No dispongo de un benchmark sistemático que permita afirmar un porcentaje general de ahorro frente al trabajo manual. La tesis acredita viabilidad operativa y reducción de tareas repetitivas mediante cadenas que se ejecutan de forma coordinada, con salidas homogéneas y trazables. Para medir la mejora de eficiencia de forma rigurosa habría que comparar el mismo caso, con iguales entradas y resultados, registrando tiempo de preparación, intervención humana, cálculo, revisión y repetición. Esa evaluación cuantitativa es una continuación explícita del trabajo.

**Evidencia:** ejecución automatizada en infraestructura urbana y aplicaciones nacionales.

**Límite:** no convertir número de escenarios o combinaciones en un porcentaje de tiempo ahorrado.

**Apoyo:** diapositiva 47; diapositiva 49.

### Pregunta 9. ¿La automatización mejora la precisión o principalmente la ejecución y la trazabilidad?

**Respuesta para decir:** Su efecto directo es mejorar consistencia operativa, repetibilidad y trazabilidad. Puede reducir errores de transcripción o de intercambio entre etapas, pero no garantiza que un resultado sea más preciso físicamente. La mejora científica procede de utilizar datos, métodos y modelos adecuados y de representar aspectos que un cálculo simplificado omite. La automatización permite aplicar y revisar esos análisis con mayor sistematicidad. Separaría, por tanto, calidad del método, corrección de la implementación y precisión frente a observaciones.

**Evidencia:** comparación metodológica IAHR y flujos de ejecución documentados.

**Límite:** reproducibilidad y precisión son propiedades diferentes.

**Apoyo:** diapositiva 41; diapositiva 47; diapositiva 49.

### Pregunta 10. ¿Cómo sabes que el resultado es físicamente correcto y no solo reproducible?

**Respuesta para decir:** Repetir un resultado demuestra consistencia de ejecución. Para valorar su corrección física hacen falta controles independientes: plausibilidad de entradas y salidas, balances, condiciones de contorno, comparación con observaciones y sensibilidad a parámetros y estructura. La tesis incorpora análisis y contrastes según el caso, pero reconoce que falta una validación observacional sistemática de manchas y frecuencias de impacto. No utilizaría la automatización como sustituto de esa comprobación física.

**Evidencia:** uso de motores físicos, sensibilidad emparejada y límites de validación reconocidos.

**Límite:** no afirmar una validación completa de todos los mapas de inundación si no está documentada.

**Apoyo:** diapositiva 24; diapositiva 33; diapositiva 49; documentación del caso concreto.

### Pregunta 11. ¿Has contrastado las simulaciones con inundaciones observadas?

**Respuesta para decir:** El alcance del contraste observacional debe responderse por caso y por variable. Hay registros que permiten ajustar o evaluar componentes hidrológicos y estadísticos, pero no presento el conjunto de diez estudios como una validación observacional uniforme de manchas y períodos de retorno. La propia tesis identifica esa evaluación sistemática como pendiente. Si me preguntan por un episodio concreto, mostraré qué observación se utilizó, qué variable se comparó y qué métrica se calculó, evitando extrapolar esa comprobación a toda la plataforma.

**Evidencia:** registros y evaluaciones identificados en cada aplicación; reconocimiento del límite en las conclusiones.

**Límite:** disponer de datos observados para calibrar un componente no implica validar todo el impacto hidráulico.

**Apoyo:** diapositiva 29; diapositiva 49; capítulo 7 y publicación del caso consultado.

### Pregunta 12. ¿Qué resultado habría llevado a rechazar alguna hipótesis?

**Respuesta para decir:** H1 quedaría debilitada si ejecutar y repetir la cadena exigiera reconstruir manualmente sus enlaces o si la automatización no mantuviera resultados auditables. H2 quedaría debilitada si cada nuevo caso exigiera sustituir el núcleo completo en lugar de reutilizar componentes. H3 quedaría debilitada si los escenarios no conservaran las propiedades relevantes o si su propagación no aportara una representación consistente del impacto. Son criterios de evaluación que explican la evidencia; no los presento como umbrales experimentales preregistrados.

**Evidencia:** requisitos de repetibilidad, modularidad y conservación de incertidumbre formulados en los objetivos.

**Límite:** una coincidencia entre métodos en un caso aislado no basta para refutar H3.

**Apoyo:** diapositiva 11; anexo 15; diapositiva 47.

### Pregunta 13. ¿Por qué esos diez estudios y qué no cubren?

**Respuesta para decir:** Los casos documentan la evolución del problema y la transferencia de la arquitectura a contextos distintos. Incluyen frecuencia sobre el impacto, cadenas lluvia-caudal-hidráulica, extremos excepcionales y aplicaciones climáticas de mayor escala. Su selección es una validación mediante aplicaciones de ingeniería, no un muestreo aleatorio de todas las situaciones posibles. Permiten mostrar capacidades y dificultades complementarias, pero dejan abiertos dominios, observaciones y condiciones que no han sido evaluados de forma sistemática.

**Evidencia:** tabla de diez estudios y tres dimensiones de validación.

**Límite:** no todos los casos ejecutan todos los módulos; solo tres se reproducen hoy mediante los notebooks de HYDRA.

**Apoyo:** diapositiva 29; diapositiva 44.

## Preguntas 14-20. Frecuencia e incertidumbre

### Pregunta 14. ¿Por qué T(forzante) no coincide necesariamente con T(impacto)?

**Respuesta para decir:** Porque la transformación del forzamiento en impacto depende de más variables y puede ser no lineal. Un pico de lluvia o de caudal no determina por sí solo el calado: intervienen duración, volumen, distribución espacial, humedad antecedente, confluencias y condiciones hidráulicas. El período de retorno pertenece a una variable y a un evento de superación definidos. Para asignárselo al impacto tengo que obtener su distribución después de propagar los escenarios por los modelos.

**Evidencia:** cadena fundacional del Besaya y resultados de los enfoques estocásticos.

**Límite:** no afirmo que los períodos de retorno siempre sean diferentes; pueden coincidir bajo hipótesis particulares.

**Apoyo:** diapositiva 7; diapositiva 8; diapositiva 30.

### Pregunta 15. ¿Puedes explicarlo con un ejemplo sencillo?

**Respuesta para decir:** Pensemos en dos avenidas con el mismo caudal pico. Una es corta y la otra mantiene caudales elevados durante mucho más tiempo. Pueden compartir el período de retorno atribuido al pico, pero la segunda introduce más volumen y puede activar zonas de almacenamiento o superar controles topográficos. También cambiaría el resultado si el nivel aguas abajo fuera distinto. Por eso conocer la frecuencia del pico no basta para conocer la frecuencia de un determinado calado.

**Evidencia:** representación multivariante mediante pico, volumen y duración; umbral topográfico del Besaya como ejemplo de respuesta no lineal.

**Límite:** es un ejemplo explicativo; no una comparación numérica nueva entre dos simulaciones específicas.

**Apoyo:** diapositiva 8; diapositiva 21; diapositiva 30; anexo 8 si se pregunta por el umbral.

### Pregunta 16. ¿Cómo asignas un período de retorno a un calado o a una extensión inundada?

**Respuesta para decir:** Primero defino el impacto: por ejemplo, superar un calado en un punto o una superficie inundada en un dominio. Después simulo escenarios y construyo la distribución de esa variable, conservando la frecuencia de ocurrencia representada por el conjunto. En un esquema de máximos anuales, una probabilidad anual de superación p corresponde a T igual a uno dividido por p. Si trabajo con eventos, debo incorporar también su tasa de ocurrencia y las hipótesis del proceso; no basta con invertir el porcentaje de escenarios que supera el umbral.

**Evidencia:** frecuencia estimada después de la simulación hidráulica en Besaya y Calle 30.

**Límite:** depende de la definición del evento, de su frecuencia temporal y de la estacionariedad asumida.

**Apoyo:** diapositiva 30; diapositiva 35; metodología de frecuencia del caso.

### Pregunta 17. ¿Qué incertidumbres propagas y cuáles quedan fuera?

**Respuesta para decir:** Depende del flujo utilizado. Los escenarios representan variabilidad de forzamientos y dependencias; los ajustes de extremos incorporan incertidumbre de estimación cuando el método lo permite; las proyecciones climáticas representan parte de la incertidumbre de modelos y escenarios; y el Besaya explora rugosidad y estructura mediante dos motores. No presento un único ensemble que reúna exhaustivamente todas esas fuentes en los diez estudios. Errores de datos, geometría, condiciones de contorno y supuestos metodológicos pueden quedar representados parcialmente o permanecer fuera.

**Evidencia:** capítulos metodológicos, bandas de extremos y comparación emparejada de rugosidades y motores.

**Límite:** enumerar fuentes de incertidumbre no significa que todas se hayan muestreado conjuntamente.

**Apoyo:** diapositiva 20; diapositiva 21; diapositiva 23; diapositiva 24; diapositiva 33; diapositiva 49.

### Pregunta 18. ¿Cómo distingues incertidumbre de datos, parámetros y estructura?

**Respuesta para decir:** La incertidumbre de datos afecta a lo que observamos o utilizamos como entrada: cobertura, error de medida o calidad de productos globales. La de parámetros se refiere a los valores estimados dentro de un modelo, como Manning o los parámetros de una GEV. La estructural corresponde a la representación del sistema: ecuaciones, resolución, algoritmos o incluso la familia de modelo. Para estudiarlas debo variar cada componente de forma identificable y declarar qué interacciones quedan incluidas. En Besaya, emparejar las realizaciones permite comparar la respuesta de los dos motores bajo parámetros relacionados.

**Evidencia:** ensemble de Manning y comparación HEC-RAS/SFINCS.

**Límite:** no atribuir automáticamente toda diferencia entre motores a una única causa numérica.

**Apoyo:** diapositiva 33; anexo 8.

### Pregunta 19. ¿Miles de escenarios garantizan que se representen bien los extremos?

**Respuesta para decir:** No. Un ensemble grande reduce el error de muestreo condicionado al modelo, pero no corrige una marginal mal ajustada, una dependencia inadecuada o datos insuficientes en la cola. Debo comprobar las propiedades que condicionan el impacto: distribución, estacionalidad, duración, acumulados, extremos y relaciones entre variables. El tamaño del ensemble y la adecuación del generador son problemas distintos. Además, cada escenario debe ser compatible con el sistema físico al que se aplica.

**Evidencia:** diagnósticos del generador y comparación de estimadores en Valencia.

**Límite:** aumentar el número de simulaciones no aumenta la información observacional original.

**Apoyo:** diapositiva 20; diapositiva 23; anexo 1.

### Pregunta 20. ¿Cómo sabes que el ensemble es suficientemente grande?

**Respuesta para decir:** Lo evaluaría mediante convergencia de las variables de decisión: cuantiles, áreas, probabilidades de superación y diferencias entre regímenes, aumentando el tamaño o repitiendo semillas. Para probabilidades muy pequeñas hacen falta conjuntos mayores y la incertidumbre debe seguir visible. El número adecuado depende del período de retorno y del resultado buscado. Las cantidades utilizadas en cada estudio describen su diseño computacional; no constituyen por sí solas una prueba de convergencia para cualquier extremo.

**Evidencia:** dimensiones de los ensembles y resultados distribucionales descritos en los casos.

**Límite:** no atribuir a todas las aplicaciones una curva de convergencia que no esté documentada. Si se pide una tolerancia, mostrar la comprobación específica o reconocer que falta.

**Apoyo:** diapositiva 23; diapositiva 33; diapositiva 41; publicación del experimento consultado.

## Preguntas 21-28. Decisiones metodológicas

### Pregunta 21. ¿Por qué utilizas cópulas y qué dependencia pueden describir mal?

**Respuesta para decir:** Las cópulas permiten tratar por separado las distribuciones marginales y la estructura de dependencia. Eso facilita generar combinaciones de pico, volumen y duración, o de caudal y nivel aguas abajo, que un análisis univariante no representa. La familia elegida impone restricciones: por ejemplo, una cópula gaussiana no representa dependencia asintótica de cola para correlaciones no degeneradas, mientras otras familias modelan determinadas asimetrías de cola. También puede ser insuficiente una dependencia constante cuando cambian estaciones o procesos físicos.

**Evidencia:** formulación multivariante del Besaya y herramienta de eventos compuestos.

**Límite:** flexibilidad matemática no garantiza que la dependencia extrema quede identificada con registros cortos.

**Apoyo:** diapositiva 21; anexo 7.

### Pregunta 22. ¿Cómo seleccionas y validas la familia de cópula?

**Respuesta para decir:** La elección debe combinar el mecanismo físico y el comportamiento de los datos. Compararía familias compatibles, ajustaría sus parámetros y revisaría dependencia global y de cola, probabilidades conjuntas y sensibilidad de los resultados. Una medida de ajuste global no basta si el objetivo es un extremo conjunto. Conviene contrastar las simulaciones con las características empíricas y valorar la incertidumbre del ajuste. En la interfaz demostrativa, seleccionar una familia permite explorar el procedimiento; no equivale a una selección automática validada.

**Evidencia:** familias gaussiana, Gumbel, Clayton y Frank disponibles en el análisis de eventos compuestos.

**Límite:** no afirmar que se realizó una comparación con AIC o validación externa en todos los casos sin aportar la fuente concreta.

**Apoyo:** diapositiva 21; anexo 7 y metodología de la publicación correspondiente.

### Pregunta 23. ¿Qué diferencia hay entre los períodos de retorno AND y OR?

**Respuesta para decir:** AND define la superación simultánea de todos los umbrales considerados; OR define que al menos uno se supere. Son eventos diferentes y deben elegirse según el mecanismo de fallo o la decisión de diseño. Con iguales umbrales y el mismo proceso temporal, AND está contenido en OR: su probabilidad no puede ser mayor y su período de retorno no puede ser menor. No compararía curvas sin especificar primero qué evento representa cada una y cómo se incorpora la tasa de ocurrencia.

**Evidencia:** isolíneas conjuntas de caudal y nivel del mar en el ejemplo de eventos compuestos.

**Límite:** OR no es universalmente la opción más conservadora para cualquier problema; depende del criterio de fallo.

**Apoyo:** diapositiva 21; anexo 7.

### Pregunta 24. ¿Cómo validas las distribuciones y la autocorrelación de las series sintéticas?

**Respuesta para decir:** Comparo las propiedades observadas y simuladas que utiliza la calibración y las relevantes para el cálculo posterior. En la demostración se muestran media, desviación estándar y autocorrelación de primer retardo por mes. Para una aplicación de diseño ampliaría la comprobación a cuantiles, acumulados, extremos, duración, varios retardos y dependencia espacial cuando proceda. La interfaz calibra con CoSMoS, pero utiliza una simulación rápida con AR(1) estacional y transformación marginal; esa aproximación tiene un alcance más limitado que la simulación completa.

**Evidencia:** diagnósticos mensuales y ensemble de 30 realizaciones de la demo.

**Límite:** los tres diagnósticos mostrados no acreditan por sí solos todas las propiedades extremas y temporales.

**Apoyo:** diapositiva 23; anexo 1.

### Pregunta 25. ¿Cómo justificas la selección mediante MaxDiss?

**Respuesta para decir:** MaxDiss permite escoger escenarios distribuidos sobre el espacio de características para cubrir la diversidad del ensemble con un número de simulaciones físicas asumible. La selección depende de qué variables uso y cómo las normalizo; por eso debe estar ligada a los controles relevantes del impacto. El subconjunto sirve para calcular respuestas y apoyar su reconstrucción sobre el conjunto original. Debo conservar el vínculo con las frecuencias del ensemble: una selección que cubre el espacio no es, por sí misma, una muestra equiprobable para estimar probabilidades.

**Evidencia:** cadenas de Mallorca, Calle 30 e IAHR 2022.

**Límite:** cubrir los forzamientos no garantiza capturar todos los umbrales hidráulicos; revisar especialmente las zonas de transición.

**Apoyo:** diapositiva 23; diapositiva 34; diapositiva 35; diapositiva 41.

### Pregunta 26. ¿Qué errores introduce la reconstrucción con k-NN?

**Respuesta para decir:** La reconstrucción aproxima respuestas no simuladas a partir de escenarios próximos, por lo que añade un error de interpolación que depende de las características utilizadas, la distancia, el número de vecinos y la densidad del conjunto simulado. Puede suavizar extremos o fallar cerca de umbrales donde escenarios parecidos producen respuestas muy distintas. La selección de k debe contrastarse con simulaciones retenidas y con la variable de impacto relevante. El k igual a seis mostrado en Mallorca es una decisión del caso, no una recomendación universal.

**Evidencia:** reconstrucción de calados y velocidades en Mallorca y frecuencia por píxel en Calle 30.

**Límite:** no extrapolar a regiones del espacio de entrada sin soporte; distinguir error del emulador y del motor físico.

**Apoyo:** diapositiva 34; diapositiva 35.

### Pregunta 27. ¿Cómo justificas la homogeneidad de una región en el análisis regional?

**Respuesta para decir:** Primero justifico una agrupación físicamente interpretable y reviso la calidad de las series. Después analizo discordancia entre estaciones y heterogeneidad de los L-momentos normalizados. El procedimiento index-flood presupone una forma regional común que se escala para cada estación. En la demo, cinco estaciones sintéticas producen H igual a 0,386, compatible con homogeneidad según el criterio utilizado. Esa comprobación ilustra el método, pero no valida por sí sola una región real de Valencia.

**Evidencia:** curva regional, discordancia y heterogeneidad mostradas en la herramienta.

**Límite:** un indicador favorable no sustituye la justificación física ni elimina problemas de dependencia entre estaciones o series cortas.

**Apoyo:** anexo 4; análisis regional del caso Valencia.

### Pregunta 28. ¿Cómo eliges la interpolación y compruebas su error?

**Respuesta para decir:** Comparo métodos sobre los mismos datos y evalúo tanto plausibilidad espacial como error de predicción. La herramienta utiliza validación dejando fuera una estación cada vez y compara el valor observado con el interpolado. En la demo de ocho estaciones, los RMSE son aproximadamente 14,796 para IDW, 15,281 para kriging ordinario y 19,327 para RBF, en las unidades de la variable de entrada. Son resultados de ese ejemplo. En aplicaciones reales revisaría también sesgo, residuos espaciales, cobertura y, si procede, validación por bloques espaciales.

**Evidencia:** mapa y tabla LOOCV de la captura preparada.

**Límite:** la validación por estaciones próximas puede ser optimista; esos RMSE no son una validación de Andes ni Mallorca.

**Apoyo:** anexo 5.

## Preguntas 29-37. Casos de estudio

### Pregunta 29. Besaya: ¿por qué difieren HEC-RAS y SFINCS y qué sustenta la bifurcación?

**Respuesta para decir:** Los motores representan y resuelven el sistema de forma distinta, y esas diferencias pueden manifestarse cerca de controles topográficos. En el caso se comparan 995 realizaciones emparejadas por motor: 1.990 simulaciones en total. HEC-RAS muestra una respuesta bimodal asociada a la activación de un compartimento secundario de unas 7,4 hectáreas y a un collado a cota 60,1 metros. El coeficiente de variación del área es 8,4 % en HEC-RAS frente a 2,0 % en SFINCS. La evidencia combina geometría y distribuciones de impacto.

**Evidencia:** comparación emparejada, distribución bimodal y localización del control topográfico.

**Límite:** el contraste no demuestra que un motor sea siempre superior ni identifica una única causa de todas las diferencias. La demo de 1.000 salidas HEC-RAS es otro conjunto.

**Apoyo:** diapositiva 33; anexo 2; anexo 8.

### Pregunta 30. Mallorca: ¿cómo validas una cadena en una cuenca sin aforos?

**Respuesta para decir:** La ausencia de aforos impide una validación directa de caudales del mismo alcance que en una cuenca instrumentada. Hay que contrastar los componentes con la información disponible: lluvia, características físicas de la cuenca y evidencias de impacto cuando existan, declarando qué observaciones son independientes del ajuste. En la presentación, el caso demuestra la conexión de generación espacial, selección de escenarios, simulación y reconstrucción. No convertiría esa demostración ni la comparación con el método clásico en una validación hidrológica exhaustiva.

**Evidencia:** aplicación de Sant Llorenç, cadena documentada y comparación de manchas de diseño.

**Límite:** concretar las evidencias observacionales y sus métricas consultando el estudio; no inventar aforos o validaciones ausentes.

**Apoyo:** diapositiva 34; documentación del caso de 2019.

### Pregunta 31. Calle 30: ¿qué limita una representación hidráulica 1D de los túneles?

**Respuesta para decir:** Una representación 1D es útil cuando la dirección principal del flujo y la geometría de la red permiten describir la respuesta mediante secciones y conexiones. Su alcance se reduce si resultan decisivos flujos transversales, detalles locales de intersecciones, interacción con la superficie o cambios de régimen que la configuración no representa adecuadamente. La elección debe justificarse con el objetivo y con la información disponible. La tesis demuestra una cadena automatizada sobre esa representación; no afirma que reproduzca todas las dinámicas locales de la infraestructura.

**Evidencia:** modelo HEC-RAS 1D de la red de túneles y cadena lluvia-HEC-HMS-MaxDiss-hidráulica-reconstrucción.

**Límite:** remitir los detalles de geometría, conexiones y regímenes a la configuración documentada del proyecto.

**Apoyo:** diapositiva 35; diapositiva 36; anexo 11; Ingeniería del Agua, 2024.

### Pregunta 32. Valencia: ¿qué significa que T100 cambie tanto por un único evento?

**Respuesta para decir:** Significa que la estimación de cola era muy sensible a la información disponible y al método. En Turís, incorporar los 710,8 milímetros de la DANA lleva el T100 bayesiano mostrado de 260 a 952 milímetros, un aumento del 266 %. El episodio altera considerablemente el ajuste y las extrapolaciones. Es una evidencia de sensibilidad e incertidumbre de estimación. No demuestra por sí solo que el clima haya cambiado de forma abrupta ni que el nuevo valor sea una verdad definitiva.

**Evidencia:** curvas antes y después, con comparación de MLE, L-momentos y Bayes.

**Límite:** distinguir el período de retorno atribuido al episodio del cuantil T100; mantener las bandas y los supuestos visibles.

**Apoyo:** diapositiva 37; diapositiva 38; anexo 12.

### Pregunta 33. Tanganica: ¿qué permite confiar en proyecciones con registros limitados?

**Respuesta para decir:** La confianza debe ser condicionada al alcance de los datos y del encadenamiento. Se combinan ERA5, reducción mediante componentes principales, AdaBoost para caudales, una relación no lineal caudal-nivel y señal climática de 19 modelos CMIP6 bajo dos SSP. AdaBoost muestra R cuadrado superior a 0,85 en validación cruzada; el valor de 0,96 del conjunto completo no es una evaluación independiente. El bootstrap de residuos de la relación caudal-nivel representa parte de la variabilidad. La discrepancia entre niveles extremos históricos por método debe formar parte de la interpretación.

**Evidencia:** altimetría 1992-2023, validación del componente y comparación de niveles GEV/Weibull y bootstrap.

**Límite:** esas métricas no validan por sí solas la extrapolación climática de toda la cadena ni todas sus fuentes de incertidumbre.

**Apoyo:** diapositiva 39; anexo 9; anexo 10.

### Pregunta 34. Andes: ¿cómo evitas parámetros calibrados poco plausibles?

**Respuesta para decir:** La calibración automática necesita restricciones físicas, límites de parámetros y una función objetivo coherente con el uso del modelo. Revisaría balances, estacionalidad y respuesta fuera del período de ajuste, además del valor de la función objetivo. Si varias combinaciones ajustan de forma similar, esa equifinalidad debe mantenerse en la interpretación. SPOTPY organiza la búsqueda; no garantiza por sí mismo la plausibilidad de los parámetros. La configuración y los controles del caso deben documentarse para que la automatización no oculte decisiones expertas.

**Evidencia:** calibración regional de VIC y automatización con SPOTPY.

**Límite:** no atribuir a todas las cuencas un protocolo idéntico o una validación fuera de muestra sin consultar los informes.

**Apoyo:** diapositiva 40; estudios hidroeléctricos andinos sintetizados en la memoria.

### Pregunta 35. IAHR 2022: ¿el aumento del 30-37 % es generalizable?

**Respuesta para decir:** Ese intervalo es un resultado del experimento presentado, con sus datos, escenarios y configuración. Muestra que sustituir el procedimiento convencional por la cadena estocástica puede cambiar significativamente el caudal de diseño. Lo transferible es la necesidad de evaluar esa diferencia y propagar las variables relevantes. No aplicaría un factor del 30-37 % a otras cuencas ni a todas las variables de impacto. Además, la respuesta hidráulica es espacial y no lineal, por lo que ni siquiera un factor único de caudal reproduce todos sus efectos.

**Evidencia:** serie sintética de 10.000 años, selección de 200 casos para Iber y comparación entre escenarios.

**Límite:** el contraste no identifica por sí solo el caudal futuro verdadero, para el que no hay observaciones.

**Apoyo:** diapositiva 41; comunicación del 39th IAHR World Congress, 2022.

### Pregunta 36. SIMPCCe: ¿cómo validas fuera de las condiciones de entrenamiento?

**Respuesta para decir:** Hay que diferenciar evaluar datos retenidos dentro del dominio observado de extrapolar a condiciones climáticas futuras. La primera evaluación requiere separar entrenamiento y validación, cuidando la dependencia temporal; la segunda exige revisar si las entradas futuras quedan dentro del dominio aprendido, comprobar plausibilidad hidrológica y estudiar sensibilidad. La interfaz de entrenamiento documenta cómo se configura y evalúa el modelo, pero no convierte automáticamente una proyección fuera de dominio en una predicción validada. Presentaría las particiones y métricas que recoge el artículo.

**Evidencia:** artículo de SIMPCCe, metodología de Fundación Canal y documentación de entrenamiento.

**Límite:** no confundir ajuste en entrenamiento con capacidad de generalización ni atribuir un rendimiento futuro no observado.

**Apoyo:** diapositiva 42; anexo 13; anexo 19; Ingeniería del Agua, 2025.

### Pregunta 37. Panamá: ¿qué representan las 414 combinaciones y cómo controlas su calidad?

**Respuesta para decir:** Las 414 corresponden al producto de 23 modelos globales, dos escenarios SSP, tres variables y tres horizontes. Describen las dimensiones del análisis climático identificadas en el Producto 3 de downscaling estadístico. No son un registro verificado de 414 ejecuciones completadas ni 414 modelos hidráulicos. El control de calidad debe conservar la procedencia y comprobar coherencia temporal y espacial, unidades, períodos de referencia, datos ausentes y diagnósticos de la corrección. La trazabilidad permite detectar y revisar inconsistencias por combinación.

**Evidencia:** Producto 3, Downscaling Estadístico, 2023, páginas 3 y 29-30; 52 cuencas del atlas.

**Límite:** no presentar el producto de dimensiones como log de ejecución ni como métrica de eficiencia.

**Apoyo:** diapositiva 43.

## Preguntas 38-44. Demostración y reproducibilidad

### Pregunta 38. ¿El ajuste de la demo es una inferencia bayesiana completa?

**Respuesta para decir:** La demo obtiene una estimación MAP: el máximo de la distribución posterior bajo la verosimilitud y los priors utilizados. Incorpora un planteamiento bayesiano, pero la interfaz no ejecuta MCMC ni caracteriza toda la posterior mediante muestreo. Es una demostración de ajuste rápido e incertidumbre aproximada. El análisis bayesiano del notebook de Valencia tiene una procedencia y un alcance distintos y debe presentarse separadamente.

**Evidencia:** configuración GEV MAP y cálculo aproximado de bandas en la herramienta.

**Límite:** no llamar a las bandas de la demo intervalos de credibilidad obtenidos de una posterior muestreada.

**Apoyo:** diapositiva 28; respaldo local y notebook de Valencia.

### Pregunta 39. ¿Las bandas son de credibilidad, confianza o una aproximación?

**Respuesta para decir:** En la demo las describo como bandas aproximadas de incertidumbre, calculadas mediante una aproximación basada en Fisher alrededor del ajuste. Su interpretación depende del procedimiento implementado y no es intercambiable con la de un intervalo obtenido muestreando la posterior. En el caso de Valencia, los resultados bayesianos del notebook tienen su propia metodología. Para responder con precisión debo nombrar siempre la figura y el cálculo al que me refiero.

**Evidencia:** distinción explícita entre la interfaz MAP/Fisher y el análisis del caso.

**Límite:** las aproximaciones locales pueden ser poco fiables con muestras cortas, colas sensibles, límites paramétricos o problemas numéricos.

**Apoyo:** diapositiva 20; diapositiva 28; anexo 12 para las curvas del caso.

### Pregunta 40. ¿Los datos de las capturas son reales o sintéticos?

**Respuesta para decir:** Las capturas de herramientas utilizan ejemplos de demostración y están identificadas como tales. La GEV usa una serie sintética; los anexos de generación, IDF, frecuencia regional, interpolación, sesgo y eventos compuestos muestran ejemplos sintéticos o de demostración. La sensibilidad de Manning utiliza un CSV demo de 1.000 salidas HEC-RAS. Las figuras científicas de los casos tienen sus fuentes y conjuntos propios. Mantengo esa separación para que una captura de funcionamiento no se interprete como evidencia experimental del caso.

**Evidencia:** pies de figura, notas y procedencia de cada demo.

**Límite:** las 1.000 salidas del CSV no equivalen a las 995 parejas HEC-RAS/SFINCS; la demo GEV no es la serie de Turís.

**Apoyo:** diapositiva 28; anexo 1-7 y figuras de los casos.

### Pregunta 41. ¿Qué casos puede reproducir hoy alguien descargando HYDRA?

**Respuesta para decir:** En la defensa identifico cuatro estudios con notebooks en HYDRA: Besaya, rugosidades de Manning, Calle 30 y Valencia. Los otros seis están documentados mediante publicaciones o proyectos. Los notebooks actuales del Besaya no reproducen automáticamente el procedimiento manual histórico en Iber; los de rugosidades requieren los motores externos, incluido HEC-RAS en Windows. Reproducir un caso exige seguir sus instrucciones y disponer de datos, dependencias y, cuando corresponda, el motor externo. Descargar la presentación solo permite consultar las figuras y demos preparadas; no reproduce los cálculos científicos.

**Evidencia:** columna de reproducibilidad de la tabla de casos y notebooks enlazados.

**Límite:** no prometer reproducción integral e inmediata de los diez estudios desde un ZIP de presentación o una instalación genérica.

**Apoyo:** diapositiva 26; diapositiva 29; diapositiva 44; instrucciones de cada notebook.

### Pregunta 42. ¿Qué requiere datos privados, licencias o motores externos?

**Respuesta para decir:** El núcleo y el entorno de HYDRA no eliminan los requisitos de sus componentes. Algunos flujos dependen de datos o configuraciones de proyectos, credenciales de servicios y ejecutables externos. Las condiciones de distribución, licencia y plataforma deben comprobarse por motor y por conjunto de datos; tener un adaptador no incorpora automáticamente un derecho de uso o redistribución. En una reproducción concreta distinguiría lo incluido, lo descargable y lo que debe aportar el usuario.

**Evidencia:** capas de software, Docker, notebooks y adaptadores a motores profesionales.

**Límite:** no declarar que todos los casos o motores funcionan sin restricciones, ni que el software libre libera datos de terceros.

**Apoyo:** diapositiva 17; diapositiva 24; diapositiva 49; requisitos y documentación de instalación.

### Pregunta 43. ¿Cómo registras versiones, semillas, parámetros y dependencias?

**Respuesta para decir:** La reproducción debe conservar entradas, configuración y entorno junto a las salidas. HYDRA distribuye código versionado, notebooks y contenedores, y dispone de versiones archivadas y citables en Zenodo. En una ejecución estocástica la semilla debe ser explícita, como en la demo, pero también hay que fijar dependencias y parámetros: la misma semilla con otro algoritmo o versión puede producir otra trayectoria. La trazabilidad de datos y configuración permite auditar la cadena y distinguir una reproducción exacta de una reproducción metodológica.

**Evidencia:** repositorios versionados, entorno de contenedores, publicaciones de software y semilla 42 de la demo.

**Límite:** no afirmar que toda salida histórica de todos los proyectos tiene un manifiesto completo si no se dispone de él.

**Apoyo:** diapositiva 16; diapositiva 17; diapositiva 26; documentación de ejecución y referencias Zenodo.

### Pregunta 44. ¿Qué ocurre si la API o una fuente de datos deja de estar disponible?

**Respuesta para decir:** La presentación tiene una copia descargada con figuras y resultados preparados, que mantiene la exposición sin conexión y sin ejecutar la API. Para repetir cálculos, la caída de un servicio requiere datos conservados o una fuente alternativa compatible y validada. El adaptador debe informar del fallo, y cualquier sustitución debe quedar registrada. Una captura permite explicar un resultado ya obtenido; no sustituye la ejecución científica ni recupera automáticamente datos que no se hayan preservado.

**Evidencia:** versión descargable, separación entre demos y casos, y arquitectura de adaptadores.

**Límite:** no prometer disponibilidad permanente de servicios externos ni equivalencia automática entre fuentes alternativas.

**Apoyo:** diapositiva 16; diapositiva 26; diapositiva 28; procedimiento de respaldo de la defensa.

## Preguntas 45-51. Limitaciones y futuro

### Pregunta 45. ¿Cuál es la limitación más importante de la tesis?

**Respuesta para decir:** Para el objetivo de evaluar inundaciones, destacaría la necesidad de un contraste observacional sistemático del impacto y de sus frecuencias. La tesis demuestra integración, aplicaciones y resultados relevantes, pero repetir un cálculo o comparar métodos no acredita por sí solo cuál reproduce mejor la realidad. A ello se añaden la información limitada sobre la cola, las dependencias de motores y datos y el coste computacional. La prioridad debe depender de la decisión concreta que se quiera apoyar.

**Evidencia:** limitaciones reconocidas en el cierre del guion.

**Límite:** el ahorro de tiempo frente al trabajo manual también sigue pendiente de cuantificación sistemática.

**Apoyo:** diapositiva 49.

### Pregunta 46. ¿Cómo afecta la no estacionariedad climática a las estimaciones?

**Respuesta para decir:** Si cambian las distribuciones de los forzamientos, la probabilidad de superación deja de ser constante y un período de retorno histórico no describe por sí solo toda la vida de una infraestructura. Los escenarios climáticos permiten explorar cambios condicionados a modelos, emisiones y horizontes, pero no eliminan la incertidumbre ni garantizan que todos los generadores representen procesos no estacionarios. Para comunicar el resultado conviene especificar período, escenario y variable, y considerar probabilidades de excedencia durante la vida útil cuando el objetivo lo requiera.

**Evidencia:** señal climática en IAHR, Tanganica, SIMPCCe y Panamá; continuidad hacia generación no estacionaria.

**Límite:** aplicar una corrección de sesgo o un cambio medio no equivale a modelar todos los cambios en extremos y dependencia.

**Apoyo:** diapositiva 39; diapositiva 40; diapositiva 41; diapositiva 42; diapositiva 43; diapositiva 49; anexo 10.

### Pregunta 47. ¿Hasta dónde extrapolarías resultados obtenidos con series cortas?

**Respuesta para decir:** No fijaría un alcance universal sin considerar longitud efectiva, calidad, dependencia y sensibilidad al método. Una serie corta ofrece poca información para períodos de retorno muy largos; los priors o la información regional pueden ayudar bajo hipótesis justificadas, pero no crean observaciones de extremos. Presentaría intervalos y comparación de modelos, explicaría qué parte del resultado es extrapolación y comprobaría la estabilidad de la decisión frente a esos supuestos. Cuanto mayor sea la consecuencia del fallo, más importante es contrastar fuentes y escenarios.

**Evidencia:** sensibilidad de estimadores en Valencia y diferencias entre métodos en Tanganica.

**Límite:** un T muy alto numéricamente no implica precisión ni certeza equivalente.

**Apoyo:** diapositiva 20; diapositiva 37; diapositiva 39; anexo 9; anexo 12.

### Pregunta 48. ¿Qué coste computacional tiene la cadena completa?

**Respuesta para decir:** El coste depende del motor, el dominio, la resolución, la duración simulada y el tamaño del ensemble. No daría una cifra única para HYDRA. En los casos se documentan conjuntos de cientos o miles de simulaciones, y las etapas físicas suelen condicionar el presupuesto de cálculo. La selección representativa y la reconstrucción reducen el número de ejecuciones necesarias, a cambio de introducir supuestos y errores que deben evaluarse. La automatización organiza el trabajo; no elimina su coste físico ni garantiza una aceleración universal.

**Evidencia:** 200 casos físicos seleccionados en IAHR y 1.990 simulaciones en el contraste del Besaya.

**Límite:** el número de simulaciones no sustituye un registro de tiempo, memoria y recursos. Llevar los registros del caso si se solicita una cifra concreta.

**Apoyo:** diapositiva 23; diapositiva 33; diapositiva 41; diapositiva 49.

### Pregunta 49. ¿Qué parte exige todavía intervención experta?

**Respuesta para decir:** La intervención experta sigue siendo necesaria para definir el problema, seleccionar datos y modelos, justificar dependencias y distribuciones, preparar geometría y condiciones de contorno y valorar la plausibilidad del resultado. También es necesaria para decidir qué incertidumbre resulta relevante y cómo comunicarla en una decisión de ingeniería. HYDRA automatiza operaciones repetitivas y organiza sus conexiones. La responsabilidad de revisar hipótesis, configuraciones y consecuencias permanece en quien realiza el estudio.

**Evidencia:** modularidad y adaptadores, con configuraciones específicas para cada aplicación.

**Límite:** automático no significa que cualquier usuario pueda obtener un resultado válido sin conocimiento del sistema físico.

**Apoyo:** diapositiva 5; anexo 15; diapositiva 24; diapositiva 49.

### Pregunta 50. ¿Qué desarrollo abordarías primero si tuvieras un año más?

**Respuesta para decir:** Priorizaría un protocolo de evaluación independiente de la cadena completa. Seleccionaría casos con observaciones de caudal y extensión o calado, fijaría métricas y particiones de validación y compararía configuraciones de forma reproducible. Añadiría un registro de intervención humana y coste de ejecución para medir eficiencia. Ese trabajo permitiría cuantificar mejor dos límites actuales: acierto físico y ahorro operativo. Después ampliaría generadores no estacionarios y emulación, guiado por los errores detectados en esa evaluación.

**Evidencia:** líneas de continuidad declaradas en las conclusiones.

**Límite:** es una prioridad propuesta para el futuro, no un compromiso financiado ni una evaluación ya realizada.

**Apoyo:** diapositiva 49.

### Pregunta 51. ¿En qué condiciones desaconsejarías utilizar HYDRA?

**Respuesta para decir:** Desaconsejaría utilizar sus resultados directamente para una decisión si no hay datos con calidad suficiente, si el mecanismo físico relevante queda fuera del modelo o si la extrapolación no tiene soporte ni una incertidumbre defendible. También si no se puede verificar la configuración, cumplir los requisitos de uso de datos y motores o revisar las salidas con criterio experto. La plataforma puede servir para explorar y organizar un análisis, pero un resultado de demostración no debe convertirse en una cifra de diseño sin las comprobaciones necesarias.

**Evidencia:** separación entre demos y aplicaciones, requisitos externos y límites metodológicos.

**Límite:** la adecuación se decide por caso, objetivo y consecuencias; no hay una garantía general derivada de ejecutar el software.

**Apoyo:** diapositiva 28; diapositiva 49; documentación de la aplicación concreta.

## Ensayo del turno de preguntas

1. Ensayar primero las doce preguntas prioritarias, con una respuesta inicial de una frase y una ampliación de menos de noventa segundos.
2. Hacer una ronda con preguntas mezcladas y sin leer el documento. Pedir a otra persona que interrumpa o solicite una cifra concreta.
3. Practicar la apertura del anexo adecuado y regresar a la presentación sin perder el hilo.
4. Si no se entiende la pregunta, pedir que se concrete la variable, el caso o el criterio de comparación.
5. Si falta un dato, responder: «No tengo aquí una cifra verificable para ese punto. Lo que sí puedo afirmar con la evidencia presentada es...». No improvisar métricas ni estados editoriales.
6. Cerrar cada respuesta cuando quede resuelta la pregunta. Las ampliaciones son para cuando el tribunal las solicite.

**Material interno a tener localizado:** tabla de autoría; fuentes de cifras y configuraciones de cada caso; comparación de estimadores de Valencia; geometría y ensemble del Besaya; Producto 3 de Panamá; requisitos de datos y motores; publicaciones y versiones citables del software. La base documental de la Mención Industrial debe estar disponible si el tribunal pregunta por ella.
