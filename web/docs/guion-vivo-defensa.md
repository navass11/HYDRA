# Guion vivo de la defensa doctoral

**Tesis:** Desarrollo de un modelo automático de inundación estocástica bajo incertidumbre hidrológica y climática  
**Doctorando:** Salvador Navas Fernández  
**Versión de trabajo:** 2 de octubre de 2026  
**Duración objetivo:** 50–55 minutos; estimación actual del guion: ~56 minutos  
**Fuente de contenido:** `thesis/main.tex` y capítulos 1–6, 8 y 9  
**Guion por diapositiva:** sincronizado con `web/src/data/slides.ts`

> Este documento no se debe memorizar palabra por palabra. Sirve para dominar el argumento, ensayar las transiciones y evitar que una diapositiva se convierta en una lectura de viñetas. Cada revisión de contenido de la presentación debe reflejarse también aquí.

> La sección **Guion oral completo por diapositiva** recoge el texto sugerido para decir, en el orden exacto de la presentación principal. Las notas privadas aparecen aparte y no se leen. Las demostraciones de la web son apoyo del bloque metodológico: el manual práctico corresponde al material complementario de la memoria, no a un capítulo principal adicional.

## La tesis en una frase

Esta tesis convierte métodos científicos ya consolidados pero dispersos en una arquitectura automática, reproducible y transferible que propaga la incertidumbre desde los datos y los forzamientos hasta la variable de impacto sobre la que se toman decisiones.

## Las cinco ideas que el tribunal debe recordar

1. El período de retorno del forzamiento no coincide necesariamente con el período de retorno del impacto: **T(forzante) ≠ T(impacto)**.
2. La aportación no es un nuevo motor hidráulico ni un nuevo algoritmo estadístico aislado, sino su **integración extremo a extremo**.
3. **pyhydra** es el núcleo científico reutilizable; **HYDRA** es la plataforma que lo hace ejecutable, visible, documentado y transferible.
4. Los nueve casos validan tres dimensiones: inundación estocástica basada en impactos; extremos e incertidumbre; cambio climático, datos globales y escalabilidad.
5. La tesis no elimina la incertidumbre: permite **representarla, propagarla y auditarla**.

## Mapa oral y tiempos

| Bloque | Contenido de la memoria | Tiempo orientativo |
|---|---|---:|
| Introducción | Problema, origen, pregunta, hipótesis y objetivos | 13–14 min |
| Estado de la técnica | Brecha, antecedentes y línea científica | 2–3 min |
| Arquitectura | Tres capas, despliegue y mapa de 14 submódulos | 3–4 min |
| Metodología | Datos; clima y estadística; modelización; demostración breve | 7–8 min |
| Casos y validación | Evidencia agrupada y comparación de resultados | 19–20 min |
| Conclusiones | Hipótesis, contribución, límites, agradecimientos | 6–7 min |

La estimación de ~56 minutos combina el texto oral a un ritmo de 115 palabras por minuto, unos segundos por cambio de diapositiva, lectura de figuras y una demostración breve. Es una referencia inicial: un ensayo cronometrado con pausas naturales determinará el tiempo real.

Las demostraciones adicionales son material de reserva. En el relato principal, abrir la web solo cuando aporta una evidencia que la figura no muestra mejor. Si un ensayo supera 57 minutos, recortar navegación antes que contexto científico.

---

## 1. Portada

### Mensaje imprescindible

Presentar formalmente el trabajo, situarlo como tesis con mención industrial y dar los nombres en líneas separadas: doctorando, director y tutor.

### Versión oral

Buenos días. Miembros del tribunal, director, tutor, profesores, compañeros, familiares y amigos: muchas gracias por acompañarme. Soy Salvador Navas Fernández y voy a presentar la tesis doctoral titulada *Desarrollo de un modelo automático de inundación estocástica bajo incertidumbre hidrológica y climática*, realizada en IHCantabria dentro del programa de doctorado IH2O y con mención industrial. La tesis ha sido dirigida por el doctor Manuel del Jesus Peñil y tutorizada por el doctor César Álvarez Díaz.

### Transición

Antes de entrar en el problema científico, voy a mostrar brevemente la estructura de la exposición.

## 2. Estructura de la defensa

### Mensaje imprescindible

Este es el único índice. Su estructura corresponde a la memoria doctoral y permite al tribunal saber dónde se encuentra en todo momento.

### Versión oral

La exposición sigue la estructura académica de la memoria. Comenzaré por la introducción: origen, motivación, problema, hipótesis y objetivos. Después resumiré la brecha detectada en el estado de la técnica. Presentaré entonces la arquitectura de pyhydra y HYDRA y los bloques metodológicos que la componen. La parte central será la validación mediante casos de estudio y resultados. Finalmente cerraré las hipótesis, delimitaré la contribución científica, expondré las limitaciones y señalaré las líneas de continuidad.

### Transición

Para entender el alcance exacto del trabajo, conviene empezar por el propio título.

### Dimensión del problema de las inundaciones

Antes de interpretar el título, situar el problema que justifica la investigación. Una inundación compromete personas, viviendas, movilidad, actividad económica y servicios esenciales. El daño depende de la distribución espacial y temporal de la lluvia, del estado previo de la cuenca y de la vulnerabilidad del sistema expuesto. La decisión de ingeniería necesita la frecuencia de los impactos y su incertidumbre, no únicamente la frecuencia de la precipitación.

## 3. Qué significa el título

### Mensaje imprescindible

“Modelo” significa cadena completa; “automático”, ejecución reproducible; “inundación”, impacto hidráulico; y “estocástica”, población de escenarios plausibles.

### Versión oral

El título delimita con bastante precisión el objeto de la investigación. “Modelo” no significa que haya desarrollado un nuevo solver hidráulico, sino una arquitectura completa de cálculo. “Automático” significa que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente tareas lentas y frágiles. “Inundación” indica que el resultado importante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: el calado, la extensión o el nivel alcanzado. Finalmente, “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que permite representar la variabilidad y la incertidumbre.

El nombre HYDRA resume la misma idea. Como la criatura mitológica, está formada por distintas “cabezas” o módulos que pueden actuar de forma especializada, pero coordinados dentro de un único organismo.

En esta tesis, “reproducible” tampoco se utiliza como una afirmación genérica. Se concreta en cuatro contratos: entradas trazables, transformaciones repetibles, salidas en formatos estándar y registro suficiente de la configuración para auditar el resultado. La figura resume el recorrido: de una entrada conocida se generan escenarios plausibles, esos escenarios atraviesan modelos físicos y la frecuencia se calcula finalmente sobre el impacto.

### Transición

Esta arquitectura no surgió de una decisión abstracta de software. Nació de una dificultad científica concreta encontrada durante mi Trabajo Fin de Máster.

## 4. El origen: TFM y artículo de la Revista de Obras Públicas

### Mensaje imprescindible

El Besaya es el origen conceptual. El TFM recibió el premio nacional a la mejor calidad y contenido del Colegio de Caminos y el trabajo se publicó posteriormente en la Revista de Obras Públicas.

### Versión oral

El punto de partida real de la tesis es mi Trabajo Fin de Máster de 2017 sobre el río Besaya en Los Corrales de Buelna. Allí construí una primera cadena completa: caracterización multivariante de avenidas, generación de escenarios, simulación con Iber y análisis estadístico de los impactos. Ese trabajo recibió el premio principal a la mejor calidad y contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. Posteriormente se publicó en el número 3598 de la Revista de Obras Públicas, en mayo de 2018.

El resultado esencial fue comprobar físicamente que dos eventos con una frecuencia semejante en la variable de entrada podían producir impactos muy diferentes. De ahí surge el principio que guía la tesis: el período de retorno del forzamiento no se puede trasladar automáticamente al impacto. La dificultad práctica era que aquella cadena era potente, pero demasiado manual, fragmentada y difícil de repetir. La respuesta doctoral consiste en convertirla en una arquitectura reutilizable.

### Transición

La necesidad de esa arquitectura se vuelve todavía más clara cuando observamos cómo está cambiando el problema de las inundaciones.

### Del TFM a la pregunta doctoral

El TFM resolvió una aplicación concreta y demostró que el impacto posee una distribución propia. También reveló que una cadena basada en múltiples traspasos manuales resultaba difícil de repetir y de adaptar. La pregunta doctoral surge al generalizar esa limitación: cómo conservar el rigor del método, auditar cada transformación y transferir la cadena a problemas con otros datos, escalas y modelos físicos.

## 5. Por qué es necesaria la tesis

### Mensaje imprescindible

Las inundaciones combinan riesgo creciente, urbanización, clima e interacciones no lineales. Un único escenario de diseño ya no representa suficientemente el problema.

### Versión oral

Las inundaciones constituyen uno de los riesgos naturales de mayor impacto social, económico y territorial. La exposición aumenta en las llanuras inundables; la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta; y el cambio climático altera la intensidad y la organización temporal de los eventos. Además, el impacto depende de interacciones entre precipitación, caudal, humedad antecedente, nivel del mar, topografía y funcionamiento de infraestructuras.

En este contexto, una única lluvia de diseño ofrece una imagen limitada. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre que acompaña a la decisión.

### Transición

El problema no es que falten métodos científicos; el problema es que se encuentran fragmentados y resulta difícil llevarlos de forma consistente hasta una decisión de ingeniería.

## 6. Qué aporta la tesis

### Mensaje imprescindible

Tres aportaciones: integración, reproducibilidad y transferencia.

### Qué necesita una modelación estocástica de inundaciones

La modelación estocástica no termina en la generación de escenarios. Necesita datos observados y proyecciones coherentes, métodos que conserven dependencias espaciales y temporales, modelos que transformen lluvia en caudal y agua en calado, y un postproceso que estime frecuencia sobre el impacto. Esta es la razón por la que la tesis incorpora clima, estadística, calibración, aprendizaje automático y modelización física sin perder el hilo principal.

### Mapa metodológico antes de la arquitectura

La tesis distribuye el trabajo científico en cinco responsabilidades: adquirir y controlar datos; caracterizar extremos y señal climática; generar escenarios plausibles; simular la respuesta física; y estimar frecuencia e incertidumbre sobre el impacto. La arquitectura técnica que se presenta después mantiene conectadas estas responsabilidades y registra qué método actúa en cada etapa.

### Versión oral

La tesis no presenta como nuevos la distribución GEV, las cópulas, los generadores de lluvia o los motores HEC-RAS, SFINCS, VIC e Iber. Su aportación consiste en hacerlos trabajar dentro de una única arquitectura operativa.

La primera aportación es la integración extremo a extremo: desde la adquisición del dato hasta el impacto. La segunda es la reproducibilidad: cada resultado mantiene la trazabilidad de su fuente, método y configuración. La tercera es la transferencia: los mismos bloques centrales se aplican en nueve casos de escalas, climas y necesidades distintas sin reconstruir el sistema para cada proyecto.

pyhydra contiene el núcleo científico reutilizable. HYDRA integra ese núcleo con la web, notebooks, contenedores y servicios para convertirlo en un producto utilizable por terceros.

## 7. Problema, hipótesis, pregunta y objetivos

### Mensaje imprescindible

No leer cuatro diapositivas independientes: construir una sola cadena lógica.

### Versión oral

El procedimiento convencional —lluvia de diseño, transformación lluvia–caudal y simulación hidráulica— es correcto como cadena física. La dificultad aparece cuando la incertidumbre se pierde entre sus eslabones y se asigna al impacto la frecuencia estimada para una variable de entrada.

La hipótesis central es que una arquitectura modular y automatizada puede integrar datos, métodos probabilísticos y modelos físicos, reducir la intervención manual y conservar la incertidumbre hasta la variable relevante para la decisión.

La pregunta de investigación es, por tanto, si es posible automatizar de forma reproducible el análisis estocástico de inundaciones integrando metodologías previamente desarrolladas y modelos físicos heterogéneos.

Esa pregunta se convierte en cuatro compromisos: integrar fuentes y métodos; automatizar la cadena; demostrar su reutilización en casos distintos; y evaluar la frecuencia sobre el impacto en lugar de heredarla directamente del forzamiento.

### Transición

Antes de describir la arquitectura, conviene comprobar cómo se puede seguir cada compromiso desde su formulación hasta una evidencia concreta.

### Diapositiva 13 · Estrategia de investigación

Una vez formulada la pregunta, la estrategia se apoya en cuatro decisiones. La primera consiste en representar explícitamente la incertidumbre mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema. La segunda consiste en automatizar la cadena completa para evitar rupturas manuales entre etapas. La tercera separa los componentes para poder sustituirlos o reutilizarlos sin reconstruir todo el flujo. La cuarta exige validar la propuesta en problemas de distinta escala y con información disponible muy diferente.

La respuesta se considerará válida si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, admite distintos modelos físicos y produce resultados interpretables que puedan utilizarse en decisiones científicas e industriales.

En este punto de la defensa no se deben mencionar todavía nombres de paquetes ni casos concretos. El público debe comprender primero la lógica de la investigación. Los nombres técnicos aparecerán después, al explicar la arquitectura, y los lugares se presentarán con su problema, contexto y referencia dentro del bloque de validación.

### Transición

Una vez establecida esa correspondencia, puedo explicar la arquitectura sin perder de vista para qué sirve cada nivel.

## 8. pyhydra y HYDRA: la respuesta construida

### Mensaje imprescindible

No enumerar clases ni dependencias. Explicar la función de cada nivel y su relación con el problema científico.

### Versión oral

La solución se organiza en tres niveles. El primero es pyhydra, donde se implementan los bloques científicos de adquisición de datos, análisis climático y estadístico, generación estocástica, acoplamiento con modelos y postproceso. El segundo agrupa los servicios operativos: API, notebooks, contenedores y almacenamiento compartido. El tercero es la interfaz HYDRA, que facilita el acceso, la documentación y la transferencia.

Esta separación es importante: la ciencia no depende de la interfaz. pyhydra puede utilizarse desde scripts y notebooks aunque la web cambie. Al mismo tiempo, la web permite que un usuario explore métodos y casos sin tener que reconstruir previamente todo el entorno de cálculo.

Los módulos siguen una lógica común: adquirir y homogeneizar datos; caracterizar extremos y dependencias; generar escenarios plausibles; propagarlos mediante modelos hidrológicos e hidráulicos; y convertir las simulaciones en distribuciones de impacto. Esa cadena, y no una herramienta individual, es la aportación operativa.

### Demostración principal

Si se realiza una demostración, debe responder a una sola pregunta científica. La opción principal es el análisis de extremos de Valencia: mostrar datos, ajuste bayesiano, incertidumbre y cambio de la estimación al incorporar un evento sin precedente. El resto de herramientas queda disponible para las preguntas.

### Transición

La validez de la arquitectura no se demuestra por el número de módulos, sino por lo que permite descubrir y resolver en aplicaciones reales.

## 9. Los casos como evolución científica

### Mensaje imprescindible

Organizar nueve casos en cuatro movimientos, sin convertir la defensa en nueve microponencias.

### Plantilla oral común para cada caso

Antes de explicar un método, situar siempre cinco elementos, en este orden:

1. **Contexto:** dónde, cuándo y para qué necesidad se realizó el trabajo.
2. **Limitación inicial:** qué dato, método o capacidad impedía resolverlo convencionalmente.
3. **Proceso:** qué cadena metodológica se aplicó, indicando las librerías concretas solo cuando aclaran la responsabilidad de cada bloque.
4. **Resultado:** una o dos cifras o hallazgos verificables y su significado físico.
5. **Referencia y papel en la tesis:** publicación, congreso o capítulo que lo documenta y qué hipótesis ayuda a validar.

### Versión oral de entrada

Los casos no son una sucesión de topónimos. Forman cuatro etapas de validación: primero, calcular la frecuencia sobre el impacto; segundo, completar la cadena desde la lluvia hasta el calado; tercero, cuantificar la diferencia frente al procedimiento convencional y responder ante un evento sin precedente; y cuarto, probar transferencia y escala en aplicaciones climáticas, regionales y nacionales. El nombre de cada caso se introduce después de explicar la necesidad que resuelve.

### 9.1 Besaya: principio y sensibilidad

**Contexto y referencia:** Los Corrales de Buelna, cuenca del Besaya. El trabajo fundacional procede del TFM de 2017 y de su publicación en la *Revista de Obras Públicas*, número 3598, en 2018. La campaña posterior de sensibilidad hidráulica se documenta separadamente en el capítulo 8 y en el manuscrito asociado sobre rugosidad y estructura de modelo.

En 2018, las avenidas se describieron mediante caudal pico, volumen y duración. Una cópula conservó su dependencia y permitió generar hidrogramas plausibles. Iber transformó esos hidrogramas en calados y manchas. Solo después se estimó la frecuencia sobre el impacto. Aquí nace T(forzante) ≠ T(impacto).

En un trabajo posterior sobre el mismo dominio, 995 simulaciones emparejadas de HEC-RAS 2D y SFINCS permitieron estudiar la incertidumbre estructural y de rugosidad. HEC-RAS reveló una respuesta bimodal asociada a un collado topográfico a cota 60,1 metros y a la activación de un compartimento secundario de unas 7,4 hectáreas. Esta segunda etapa no debe confundirse con el caso fundacional: demuestra cómo el dominio se convierte después en banco de pruebas de automatización y sensibilidad.

**Frase de salida:** Besaya formula la pregunta y demuestra que el impacto tiene su propia distribución.

### 9.2 Mallorca: del caudal a la lluvia en una cuenca sin aforo

**Contexto y referencia:** Sant Llorenç des Cardassar, después del episodio torrencial de octubre de 2018. El caso, desarrollado en 2019 y documentado en el capítulo 8, responde a una cuenca sin aforos suficientes y con necesidad de reconstruir espacialmente la tormenta y sus impactos.

Mallorca lleva la metodología a una cuenca torrencial sin estaciones de aforo. Se clasifican formas de hietograma, se conserva la dependencia espacial mediante cópulas y kriging, y se propagan los escenarios con Iber. MaxDiss reduce el número de simulaciones explícitas y k-NN reconstruye los impactos restantes. El caso demuestra que la frecuencia del calado puede estudiarse incluso cuando la observación hidrológica es limitada, siempre que se declare y gestione esa limitación.

**Frase de salida:** Mallorca amplía la cadena desde los hidrogramas observados hacia la precipitación espacial.

### 9.3 Calle 30: cadena industrial completa

**Contexto y referencia:** red de túneles y tramos canalizados de Madrid Calle 30, una infraestructura crítica urbana. El trabajo se desarrolló con Ferrovial dentro del proyecto FORESEE y se publicó en *Ingeniería del Agua* en 2024; la memoria lo desarrolla en el capítulo 8.

Calle 30 es la aplicación industrial más completa. A partir de ERA5 y AEMET se ajustan extremos de precipitación multiduración y se generan miles de eventos multisitio. HEC-HMS transforma la lluvia en hidrogramas. MaxDiss selecciona el subconjunto hidráulicamente representativo, HEC-RAS **1D** modela la red canalizada y de túneles, y k-NN reconstruye los escenarios no simulados. El resultado final es el período de retorno del calado, no una frecuencia heredada de la lluvia.

El valor de pyhydra aquí es la orquestación: hace viable y trazable una cadena que combina estadística, hidrología, hidráulica y reconstrucción de impactos en una infraestructura crítica, dentro del proyecto FORESEE con Ferrovial.

**Frase de salida:** Calle 30 demuestra transferencia industrial y automatización extremo a extremo.

### 9.4 Valencia: respuesta ante un evento sin precedente

**Contexto y referencia:** análisis realizado a raíz de la DANA del 29 de octubre de 2024 mediante 224 estaciones de AEMET, SIAR y AVAMET. Los resultados se presentaron en las VIII Jornadas de Ingeniería del Agua de 2025 y se documentan mediante notebooks reproducibles y en el capítulo 8.

La DANA del 29 de octubre de 2024 dejó 710,8 milímetros en 24 horas en Turís. El caso muestra el comportamiento de la inferencia de extremos cuando aparece un evento fuera del rango histórico. Al incorporarlo, el cuantil de cien años cambia de forma muy intensa y el período de retorno asignado al evento pasa de miles de años a un orden de decenas. Más que fijarnos en una cifra aislada, el resultado importante es que la estimación y su incertidumbre pueden recalcularse con rapidez, comparar métodos y conservar trazabilidad.

**Frase de salida:** Valencia demuestra capacidad de respuesta y la necesidad de expresar incertidumbre, no solo un período de retorno puntual.

### 9.5 IAHR 2022: prueba cuantitativa de la hipótesis

**Contexto y referencia:** estudio comparativo presentado en el 39.º Congreso Mundial de IAHR, celebrado en Granada en 2022, y recogido en el capítulo 8. Su propósito fue aislar cuánto cambia el resultado de diseño al sustituir el procedimiento convencional por la cadena estocástica completa.

El estudio presentado en el Congreso Mundial de IAHR compara la cadena estocástica completa con el procedimiento convencional. Se generaron 10.000 años sintéticos de precipitación, se seleccionaron 200 eventos mediante MaxDiss para simulación con Iber y se reconstruyó el resto con k-NN. El método convencional subestimó sistemáticamente los caudales de diseño entre un 30 % y un 37 %. Para T100 en uno de los escenarios, la diferencia fue de 208,8 frente a 278,5 metros cúbicos por segundo.

La diferencia no puede corregirse con un factor uniforme porque la respuesta hidráulica es espacial y no lineal. Esta es la evidencia cuantitativa más directa de que la frecuencia debe propagarse por la cadena y evaluarse sobre el impacto.

### 9.6 Transferencia y escala: Andes, Tanganica, SIMPCCe y Panamá

En Andes, la aportación decisiva fue automatizar con SPOTPY la calibración de modelos hidrológicos globales y construir a gran escala el proceso que transforma precipitación en caudal bajo escenarios climáticos. No debe presentarse solo como kriging o corrección de sesgo.

**Referencia Andes:** estudios hidroeléctricos regionales en Colombia, Bolivia, Perú y Ecuador, sintetizados en el capítulo 8. Al mencionar `pyhydra.climate` y `pyhydra.modeling`, explicar que el primero prepara y corrige los campos climáticos y el segundo organiza la calibración y ejecución de VIC; el nombre de la librería no sustituye la explicación del proceso.

Tanganica aborda la estimación de niveles de diseño con observaciones limitadas y fuentes globales. Su valor está en combinar información heterogénea declarando las restricciones de los datos; no debe atribuirse al caso una cadena o unos resultados que la memoria no documenta.

**Referencia Tanganica:** trabajo presentado en las VIII Jornadas de Ingeniería del Agua de 2025 y desarrollado en el capítulo 8. El problema de ingeniería es obtener cotas extremas para el puerto de Kalundu con una serie altimétrica corta, no producir un mapa hidráulico 2D.

SIMPCCe traslada corrección de sesgo, escenarios climáticos y modelos de aprendizaje automático a la estimación de caudales mínimos de embalse. El trabajo obtuvo el premio de la Fundación Botín, evidencia adicional de su utilidad aplicada.

**Referencia SIMPCCe:** artículo publicado en *Ingeniería del Agua* en 2025 y proyecto reconocido por la Fundación Botín. El resultado debe conectarse con la operación de embalses y las sequías, no presentarse únicamente como una red neuronal.

Panamá demuestra escala nacional: automatiza cientos de correcciones de sesgo y conecta información climática con modelización de inundaciones para construir productos homogéneos sobre todo un país.

**Referencia Panamá:** Atlas Nacional de Riesgo de Inundación de Panamá, con participación institucional y financiación del BID, documentado en el capítulo 8. Es la evidencia principal de automatización a escala territorial.

**Frase de salida del bloque:** Los casos abarcan más temas que la generación estocástica porque datos, clima, calibración, modelos físicos y cómputo son condiciones necesarias para estudiar inundaciones estocásticamente en problemas reales.

### Resultados que sostienen la contribución

Cerrar los casos reuniendo cuatro evidencias: una diferencia del 30 al 37 % en el caudal de diseño frente al procedimiento convencional; un incremento del 266 % en el cuantil T100 después de incorporar un evento sin precedente; 1.990 simulaciones hidráulicas 2D para estudiar sensibilidad paramétrica y diferencias entre motores; y 414 correcciones climáticas automatizadas en un estudio de escala nacional. Explicar el significado de cada cifra y terminar señalando su elemento común: todas dependen de una cadena trazable desde el dato hasta el resultado.

## 10. Contribuciones científicas

### Mensaje imprescindible

No presentar un currículum. Explicar cómo artículos, congresos, software y premios validan partes de la misma línea científica.

### Versión oral

La producción científica debe presentarse por estado editorial. Hay dos artículos publicados en *Ingeniería del Agua*: la aplicación de Calle 30, publicada en 2024, y SIMPCCe, publicada en 2025. A ellos se suman cinco comunicaciones: SIMPCCe en las VII Jornadas de Ingeniería del Agua de 2023 y en Hydroinformatics 2024; HYDRA en InterJIA 2024; y los trabajos de Valencia y lago Tanganica en las VIII Jornadas de Ingeniería del Agua de 2025.

Actualmente hay dos manuscritos enviados. El trabajo **“Proyección de niveles extremos del lago Tanganica bajo cambio climático en una cuenca poco instrumentada”** se ha enviado a *Ingeniería del Agua*. El estudio sobre incertidumbre de rugosidad de Manning y estructura de modelo en el Besaya se ha enviado a *Environmental Modelling & Software*. Debo utilizar siempre la expresión “enviado” o “en evaluación”, sin presentarlos como aceptados o publicados.

Los productos de software pyhydra e HYDRA completan esta producción con versiones publicadas y citables en Zenodo. La diapositiva no funciona como un currículum, sino como evidencia de que cada bloque de la tesis ha generado contraste externo, transferencia o un producto científico preservado.

La memoria delimita también mi contribución en los trabajos compartidos. He liderado como primer autor los trabajos que articulan la línea principal y he contribuido de forma identificable en calibración automática, procesamiento climático, generación estocástica, análisis de extremos y desarrollo de software en los trabajos colaborativos.

## 11. Cierre de hipótesis

### Versión oral

Las hipótesis se cierran con evidencia acumulada. La automatización queda respaldada por cadenas extensas ejecutadas sobre una infraestructura urbana y a escala nacional. La modularidad se demuestra mediante la reutilización de bloques de datos, clima y modelización en contextos distintos. La representación de la incertidumbre se valida con una comparación cuantitativa frente al procedimiento convencional y con la actualización de un análisis extremo tras un evento sin precedente.

El resultado no es que HYDRA elimine la incertidumbre. El resultado es que permite representarla, propagarla y auditarla con mayor consistencia.

## 12. Contribución original

### Mensaje imprescindible

Responder sin ambigüedad a “¿qué hay de nuevo si los métodos ya existían?”.

### Versión oral

La memoria distingue tres niveles. En primer lugar están las metodologías incorporadas, que se reconocen como conocimiento previo: extremos, cópulas, generadores estocásticos, corrección de sesgo, MaxDiss, k-NN y motores físicos. En segundo lugar están los desarrollos realizados: módulos, adaptadores, flujos automatizados y mecanismos de trazabilidad. En tercer lugar se encuentra la contribución original de la tesis: integrar esos elementos extremo a extremo, sistematizar su reproducibilidad y demostrar su transferencia en nueve casos heterogéneos sin modificar el núcleo para cada aplicación.

La mención industrial no reside únicamente en resolver casos reales. Reside en que el conocimiento se entrega como una infraestructura instalable, ejecutable, auditable y ampliable por terceros.

## 13. Limitaciones y continuidad

### Versión oral

HYDRA organiza la incertidumbre, pero no elimina los límites de los datos ni de los modelos. Las series cortas siguen condicionando la inferencia de cola; los motores externos introducen dependencias de licencias y versiones; los generadores estacionarios no representan por sí solos tendencias climáticas; los grandes conjuntos hidráulicos mantienen un coste computacional alto; y las fuentes globales tienen calidad heterogénea.

Estas limitaciones definen la continuidad: generación no estacionaria, eventos compuestos, ejecución distribuida, más adaptadores y documentación orientada a usuarios externos.

## 14. Agradecimientos y cierre

### Versión oral

Antes de terminar, quiero agradecer a mi familia el apoyo que ha sostenido todo este recorrido. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor, honestidad y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad. A IHCantabria, por el entorno humano, científico y técnico en el que me he formado. Y a Álvaro Galán, por ayudarme a mantener la motivación y por contribuir a mejorar este trabajo.

La tesis demuestra que es posible convertir una década de metodologías probabilísticas en una cadena reproducible y transferible, desde los datos hasta los mapas de frecuencia del impacto. El reto que queda abierto es que HYDRA deje de ser únicamente una herramienta de su equipo de desarrollo y se convierta en una herramienta de su comunidad.

Muchas gracias por su atención. Quedo a disposición del tribunal para las preguntas que deseen formular.

---

## Guion oral completo por diapositiva

Este es el libreto de la presentación principal, en el orden exacto de navegación. En cada diapositiva, el párrafo bajo **Diálogo** es el texto completo propuesto para pronunciar. La **Transición** se dice después de ese párrafo, mientras se avanza a la siguiente. Las pautas entre corchetes son acciones para el presentador; no se leen al tribunal. Puedes adaptar el tratamiento formal y las pausas a tu forma natural de hablar.

### 1. Desarrollo de un modelo automático de inundación estocástica

**Bloque:** Apertura · **Tiempo orientativo:** 3 min

**Diálogo**

Buenos días, miembros del tribunal, director, tutor, profesores, compañeros, familiares y amigos. Muchas gracias por acompañarme. Soy Salvador Navas Fernández y voy a presentar mi tesis doctoral, titulada "Desarrollo de un modelo automático de inundación estocástica bajo incertidumbre hidrológica y climática". La he realizado en IHCantabria, dentro del programa de doctorado IH2O y con Mención Industrial. La tesis ha sido dirigida por el doctor Manuel del Jesus Peñil y tutorizada por el doctor César Álvarez Díaz. A lo largo de la exposición explicaré qué problema científico la origina, cómo se construyó la solución y qué evidencia permite valorar su utilidad.

**[Pauta: saluda, espera un instante y nombra a las personas con calma.]**

**Transición:** Para situar el recorrido, empezaré por la estructura académica que seguirá la exposición.

### 2. Estructura de la defensa

**Bloque:** Apertura · **Tiempo orientativo:** 1 min

**Diálogo**

La exposición sigue el argumento académico de la memoria. Empieza con el problema, los antecedentes, la pregunta y las hipótesis; continúa con el estado de la técnica y la arquitectura de HYDRA. Los tres capítulos metodológicos se agrupan en datos, análisis climático y estadístico, y modelización. Después presento los casos como evidencia de validación y cierro con contribuciones, límites y trabajo futuro. La demostración de la plataforma es un apoyo práctico, no un capítulo principal independiente.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Con este recorrido en mente, fijemos primero por qué el problema merece esta investigación.

### 3. Dimensión del problema de las inundaciones

**Bloque:** Motivación · **Tiempo orientativo:** 1 min

**Diálogo**

Antes de delimitar la tesis conviene recordar la dimensión del problema. Una inundación afecta simultáneamente a personas, viviendas, movilidad, actividad industrial y servicios esenciales. El daño depende de dónde se produce el agua, de la velocidad con la que llega, del estado previo de la cuenca y de la vulnerabilidad de cada elemento expuesto. Por eso una única lluvia asociada a un período de retorno no basta para describir el riesgo. La pregunta de ingeniería exige conocer qué impactos pueden producirse, con qué frecuencia y con qué incertidumbre.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Con esa necesidad presente, voy a explicar qué significa cada parte del título.

### 4. Qué significa el título de la tesis

**Bloque:** Apertura · **Tiempo orientativo:** 2 min

**Diálogo**

El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una cadena completa de cálculo. “Automático” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente tareas frágiles. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que representa la variabilidad y la incertidumbre. Esta definición exige además reproducibilidad operativa: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la variable sobre la que se toman decisiones.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** El origen concreto de esta pregunta está en un trabajo anterior sobre el río Besaya.

### 5. El TFM y el artículo que originan esta tesis

**Bloque:** Apertura · **Tiempo orientativo:** 2 min

**Diálogo**

El punto de partida real de esta tesis es mi Trabajo Fin de Máster, desarrollado en 2017 sobre el río Besaya a su paso por Los Corrales de Buelna. En aquel trabajo construí la primera cadena completa: caracterización multivariante de avenidas, generación de escenarios, simulación hidráulica con Iber y análisis estadístico de los impactos. El TFM recibió el premio principal en la categoría de Mejor Calidad y Contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. El trabajo se publicó después en la Revista de Obras Públicas, número 3598 de mayo de 2018, y consolidó la observación que guía toda la tesis: el período de retorno del forzamiento no coincide necesariamente con el del impacto hidráulico. A partir de esa dificultad concreta —repetir, conectar y auditar una cadena extensa— nace la necesidad de pyhydra y, finalmente, de HYDRA.

**[Pauta: recorre la cronología de arriba abajo y detente en el cambio de etapa.]**

**Transición:** Ese primer caso resolvió una aplicación, pero también dejó al descubierto una limitación más general.

### 6. Por qué es necesaria esta tesis

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

Esta tesis se realiza porque las inundaciones son el riesgo natural con mayor impacto social, económico y territorial, y porque las condiciones que determinan ese riesgo están cambiando. La exposición se acumula en llanuras inundables; el cambio climático intensifica y altera el ciclo hidrológico; y la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman interacciones entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre asociada a la decisión.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Esa necesidad conduce a la aportación que propone la tesis.

### 7. Qué aporta esta tesis

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

La tesis no reivindica como nuevos los métodos estadísticos, los generadores de lluvia ni los modelos hidrológicos e hidráulicos utilizados. Su aportación consiste en hacerlos trabajar dentro de una única arquitectura operativa. Primero, integra extremo a extremo la adquisición de datos, el análisis de extremos, la generación de escenarios, la simulación física y el cálculo de impactos. Segundo, establece reproducibilidad sistemática: cada resultado puede trazarse hasta su fuente, su método y su configuración. Tercero, demuestra transferencia operativa en problemas con escalas y necesidades muy diferentes, sin reconstruir los componentes centrales para cada proyecto. Más adelante presentaré cómo se materializa técnicamente esta arquitectura.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Para entender la brecha, repasemos antes cómo se estima habitualmente una inundación.

### 8. Cómo se estima convencionalmente una inundación

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

Antes de presentar la solución, conviene fijar el procedimiento de referencia. Partimos de registros, ajustamos extremos, construimos un evento de diseño, lo transformamos mediante modelos hidrológicos e hidráulicos y obtenemos un mapa de inundación. La cadena física es necesaria y no se pretende reemplazar. La dificultad está en tres simplificaciones frecuentes: asumir estacionariedad, representar el extremo con un único evento y trasladar el mismo período de retorno desde el forzamiento hasta el impacto. HYDRA conserva esta cadena, pero automatiza la exploración de muchos escenarios y lleva la incertidumbre hasta el calado y la extensión inundada.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** La cadena convencional funciona físicamente; el problema aparece al asignar frecuencia al impacto.

### 9. El problema científico

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

El problema científico aparece cuando la frecuencia de una variable de entrada se interpreta como si fuera directamente la frecuencia del daño. En el procedimiento convencional se selecciona una lluvia o un hidrograma asociado a un período de retorno y se simula su respuesta. Pero el mismo forzamiento puede producir impactos distintos según la humedad antecedente, la distribución espacial de la lluvia, la coincidencia de ondas en una confluencia y la respuesta no lineal del terreno y del modelo hidráulico. Por eso no basta con preguntar cada cuánto ocurre una lluvia de diseño. Hay que preguntar cada cuánto se supera un calado, un caudal o una extensión inundada relevantes para la decisión. La tesis parte de esa diferencia entre T del forzamiento y T del impacto.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** A partir de ese problema se formula la hipótesis que voy a contrastar.

### 10. La hipótesis central

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

La hipótesis de partida es que la principal barrera para aplicar metodologías avanzadas de análisis probabilístico de inundaciones no es la falta de conocimiento científico. El obstáculo es integrar métodos, datos y modelos físicos en un flujo operativo que pueda ejecutarse de forma eficiente y repetirse sin reconstruirlo manualmente en cada proyecto. Si los componentes se organizan de manera modular, se comunican mediante contratos claros y conservan la trazabilidad de sus entradas y configuraciones, entonces la incertidumbre puede propagarse hasta el impacto y la metodología puede transferirse entre casos. Esta hipótesis no presupone que todos los modelos den la misma respuesta: propone una arquitectura para comparar esas respuestas de forma explícita y auditable.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** La hipótesis se concreta en una pregunta que guía el trabajo completo.

### 11. Pregunta de investigación

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

La pregunta de investigación es: ¿es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías previamente desarrolladas en un marco transferible a proyectos reales de ingeniería? La pregunta reúne cuatro exigencias. La cadena debe conectar datos, análisis estadístico, escenarios y modelos físicos; debe conservar la incertidumbre en lugar de perderla entre etapas; debe poder repetirse y auditarse; y debe funcionar en casos reales con escalas, fuentes de información y motores diferentes. No se busca proponer un método universal que sustituya a todos los existentes, sino comprobar si una arquitectura común puede hacerlos trabajar juntos con rigor.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Para responderla, la investigación se organiza en un objetivo general y cuatro compromisos.

### 12. Objetivo general y objetivos específicos

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

El objetivo general es desarrollar y validar un marco automático y reproducible para el análisis estocástico de inundaciones bajo incertidumbre hidrológica y climática. Ese objetivo se concreta en cuatro compromisos. Integrar fuentes de datos heterogéneas; encapsular los métodos estadísticos y estocásticos en un núcleo reutilizable; acoplarlos con modelos hidrológicos e hidráulicos sin imponer un único motor; y demostrar su transferencia mediante casos reales de distinta escala. Esta formulación permite que cada parte de la defensa responda a un objetivo y termine en evidencia, no en una mera descripción de herramientas.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Estos compromisos se traducen en una estrategia verificable.

### 13. Estrategia de investigación

**Bloque:** Motivación · **Tiempo orientativo:** 2 min

**Diálogo**

Una vez formulada la pregunta, la estrategia de investigación se organiza en cuatro decisiones. La primera es representar explícitamente la incertidumbre mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema, no solo sobre la variable de entrada. La segunda es automatizar la cadena completa para evitar rupturas manuales entre datos, métodos y modelos. La tercera es separar sus componentes para que puedan sustituirse o reutilizarse sin reconstruir todo el flujo. La cuarta es validar la propuesta en problemas de distinta escala y con información disponible muy diferente. Consideraremos que la respuesta funciona si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, se adapta a distintos modelos y produce resultados útiles en aplicaciones científicas e industriales.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Antes de ver la arquitectura, aclaremos qué necesita realmente una modelación estocástica.

### 14. Qué necesita una modelación estocástica de inundaciones

**Bloque:** Motivación · **Tiempo orientativo:** 1 min

**Diálogo**

El carácter estocástico de la tesis no se limita a generar números aleatorios o tormentas sintéticas. Para estudiar inundaciones hacen falta series observadas y proyecciones climáticas coherentes, métodos que preserven la dependencia espacial y temporal, modelos que transformen lluvia en caudal y agua en calado, y un postproceso que asigne frecuencia al impacto. Estas herramientas auxiliares explican por qué la tesis abarca más temas que la generación estocástica estricta. Todos forman parte de la misma pregunta probabilística.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Esta cadena de necesidades fue creciendo a lo largo de una línea de investigación.

### 15. Evolución de la investigación (2017–2026)

**Bloque:** Estado del arte · **Tiempo orientativo:** 2 min

**Diálogo**

La cronología no es una lista de lugares ni de proyectos. Comienza en 2017 con una pregunta nacida en el Trabajo Fin de Máster: cómo calcular la frecuencia sobre el impacto hidráulico y no heredarla directamente del forzamiento. El artículo de 2018 consolida ese principio. Después, la investigación incorpora progresivamente problemas que aquella primera cadena no resolvía: cuencas sin aforo, precipitación espacial, calibración automática de modelos regionales, infraestructuras urbanas críticas, gestión de embalses, eventos sin precedente e incertidumbre entre motores hidráulicos. Esa acumulación de necesidades conduce finalmente a una arquitectura común, documentada y publicable como software reproducible.

**[Pauta: recorre la cronología de arriba abajo y detente en el cambio de etapa.]**

**Transición:** La trayectoria permite ahora delimitar qué aporta HYDRA frente a las herramientas existentes.

### 16. Posicionamiento y originalidad de HYDRA

**Bloque:** Estado del arte · **Tiempo orientativo:** 2 min

**Diálogo**

"La brecha principal no es la ausencia de métodos aislados, sino la falta de integración operativa entre datos climáticos, análisis estadístico, generación estocástica, modelos físicos y documentación utilizable." Herramientas como Stan, PyMC, R-INLA o extRemes resuelven muy bien la inferencia bayesiana, pero de forma aislada del modelado hidráulico. HYDRA no compite con ellas: las orquesta. De hecho, el patrón de adaptadores de pyhydra está inspirado explícitamente en el proyecto HydroMT, un precedente reconocido en la propia memoria.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** La metodología de la tesis ordena esas responsabilidades antes de implementarlas.

### 17. Mapa metodológico de la tesis

**Bloque:** Estado del arte · **Tiempo orientativo:** 1 min

**Diálogo**

Antes de presentar la arquitectura técnica, este es el mapa metodológico de la tesis. La primera responsabilidad consiste en adquirir y controlar las fuentes de datos. La segunda caracteriza extremos, tendencias y señal climática. La tercera genera escenarios que preservan las relaciones relevantes. La cuarta propaga esos escenarios por los modelos físicos. La quinta calcula frecuencia e incertidumbre sobre la variable de impacto. La arquitectura que veremos a continuación existe para mantener conectadas estas cinco responsabilidades sin ocultar qué método actúa en cada etapa.

**Transición:** Con el mapa metodológico claro, veamos cómo se organiza técnicamente la solución.

### 18. La arquitectura del sistema de tres niveles

**Bloque:** Arquitectura · **Tiempo orientativo:** 2 min

**Diálogo**

El sistema se organiza en tres capas. En la base, la librería pyhydra escrita en Python que encapsula la lógica científica en 14 submódulos. En la capa intermedia, una API REST con FastAPI que expone las operaciones y un contenedor JupyterLab que permite a científicos depurar. En la superficie, la web interactiva Astro/Tailwind, con un catálogo de 26 notebooks generales y 23 entradas de casos piloto.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** La arquitectura debe poder ejecutarse de manera estable en equipos distintos.

### 19. Infraestructura de despliegue industrial

**Bloque:** Arquitectura · **Tiempo orientativo:** 2 min

**Diálogo**

Para garantizar la reproducibilidad y facilidad de despliegue, todo el stack se empaqueta en tres contenedores de Docker coordinados por un proxy Nginx: JupyterLab, la API FastAPI y el frontend web. La integración continua en GitHub Actions construye las imágenes linux/amd64 y las publica en Azure Container Registry, desde donde se despliegan en Azure Container Apps. Esto permite ejecutar la plataforma idénticamente en un portátil local sin conexión a internet, o escalarla en la nube.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Ese despliegue convierte la arquitectura en un producto utilizable.

### 20. Un producto científico y operativo real

**Bloque:** Arquitectura · **Tiempo orientativo:** 1 min

**Diálogo**

La aportación principal de este trabajo no es solo teórica; se entrega como un ecosistema reproducible completo. Consta de la librería modular de Python "pyhydra" y la plataforma "HYDRA" que permite ejecutar todo el flujo desde el navegador de manera reproducible gracias a la contenedorización Docker.

**[Acción en pantalla: Mostrar únicamente arquitectura, DOI y acceso a casos. No recorrer el menú completo.]**

**Transición:** El producto se apoya en módulos especializados que siguen una misma cadena.

### 21. Catorce módulos organizados en tres bloques

**Bloque:** Arquitectura · **Tiempo orientativo:** 1 min

**Diálogo**

La librería reúne catorce submódulos en tres bloques: cuatro de fuentes de datos, cinco de clima y estadística y cinco de modelización. Los bloques se conectan desde la observación hasta la respuesta física. El diagrama recoge tanto la función comprensible para el tribunal como la ruta del submódulo. No significa que los catorce módulos intervengan en cada caso: cada aplicación activa la combinación que necesita.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Comencemos la cadena por el elemento que condiciona todo análisis: los datos.

### 22. Fuentes de datos

**Bloque:** Bloque de datos · **Tiempo orientativo:** 3 min

**Diálogo**

El primer módulo automatiza la descarga y estructuración de datos. Evita la descarga manual de portales inconexos. Se conecta mediante APIs a Copernicus, satélites de la NASA y redes de estaciones locales, devolviendo datos listos en memoria con formato, huso horario (UTC) y proyección (WGS84) estandarizados, junto a metadatos de trazabilidad (fuente, fecha de descarga, parámetros de consulta).

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Una vez preparados los datos, estimamos la frecuencia de los extremos.

### 23. Extremos y distribuciones GEV

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 3 min

**Diálogo**

Para calcular caudales o precipitaciones asociadas a períodos de retorno se implementa la función de distribución GEV con cuatro vías de ajuste: MLE (scipy.stats.genextreme), L-momentos (Hosking & Wallis, la opción por defecto con series cortas de menos de 30 años), inferencia bayesiana vía PyMC con muestreador NUTS y parametrización no centrada (4 cadenas de 2.000 muestras), y una aproximación más económica basada en la matriz de información de Fisher. La inferencia bayesiana resulta superior porque no depende puramente de la muestra observada corta y proporciona curvas de credibilidad completas, fundamentales para el diseño bajo incertidumbre. Una clase `HierarchicalGEV` permite además el análisis regional agrupado, con respaldo en PyStan.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Los extremos marginales no bastan cuando varias variables dependen entre sí.

### 24. Dependencia multivariante y cópulas

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 3 min

**Diálogo**

El riesgo real a menudo surge de la combinación de eventos (e.g. lluvia intensa simultánea con nivel alto de marea). pyhydra incorpora cópulas Gaussianas (pico-duración-volumen) y Gumbel/Clayton/Frank para eventos compuestos como oleaje y lluvia, parametrizadas mediante la tau de Kendall. Esto permite calcular el período de retorno conjunto AND y OR, y localizar el Evento de Diseño Más Probable (MPDE) como el máximo de la densidad conjunta sobre la isolínea de un período de retorno dado, siguiendo la formulación de Salvadori y De Michele.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Esa dependencia permite generar escenarios conjuntos físicamente plausibles.

### 25. Generación estocástica de escenarios

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 2 min

**Diálogo**

El módulo estocástico permite crear ensembles de series meteorológicas coherentes en espacio y tiempo. El generador espacial NSRP (proceso de pulsos rectangulares de Neyman-Scott, Rodríguez-Iturbe 1987-88) se calibra para reproducir la media, la varianza, la probabilidad de día seco, la autocorrelación de orden 1 y el coeficiente de variación de la serie observada, con una versión multisitio (STNSRP) para campos espacialmente coherentes. El generador temporal CoSMoS (Papalexiou 2018) ajusta por separado la distribución marginal y la estructura de autocorrelación estacional, y las combina para simular series manteniendo ambas propiedades y la estacionalidad simultáneamente.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Los escenarios solo son útiles si se propagan por modelos de respuesta física.

### 26. Modelos hidrológicos e hidráulicos

**Bloque:** Bloque de modelización · **Tiempo orientativo:** 2 min

**Diálogo**

El último bloque actúa como puente con los modelos numéricos de ingeniería mediante un patrón de adaptador con cuatro responsabilidades fijas: preparar las entradas en formato nativo, ejecutar el motor vía API, controlador o subproceso con registro de versión y código de salida, leer las salidas (DSS, HDF, NetCDF, GeoTIFF o texto) en estructuras comunes, y validar la finalización y la plausibilidad física de los resultados. La calibración de HEC-HMS, por ejemplo, edita el fichero .basin como factores multiplicativos envueltos en una clase spotpy que ejecuta el algoritmo SCE-UA (evolución compleja mezclada).

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** La plataforma ofrece acceso a estas operaciones desde herramientas interactivas.

### 27. Herramientas interactivas en la nube

**Bloque:** Demo en vivo · **Tiempo orientativo:** 1 min

**Diálogo**

Para transferir el conocimiento a usuarios que no programan, HYDRA incorpora herramientas interactivas conectadas con la API y con el núcleo pyhydra. En la defensa no recorreré el catálogo: utilizaré una única demostración, el ajuste estadístico ligado al caso Valencia, para probar que el motor científico es accesible, reproducible y operativo. El resto de herramientas queda como material de apoyo para las preguntas del tribunal.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Voy a ilustrar esa operación con un único ejemplo de ajuste de extremos.

### 28. Demostración guiada: ajuste bayesiano de extremos

**Bloque:** Demo en vivo · **Tiempo orientativo:** 2 min

**Diálogo**

Voy a mostrar un solo recorrido, vinculado al análisis de extremos de Valencia. Primero cargo la serie preparada y explico qué observaciones se consideran extremas; en este ejemplo, el umbral POT separa los eventos que entran en el ajuste. Después inicio el cálculo y señalo tres cosas: qué método se ha ejecutado, qué cuantil de diseño produce y cómo cambia su incertidumbre. La comparación entre la estimación bayesiana y el ajuste de máxima verosimilitud ayuda a ver que no debemos comunicar solo una cifra puntual. La banda de credibilidad forma parte del resultado. No recorreré ahora todas las herramientas: esta demostración sirve para comprobar que el método descrito también puede ejecutarse y documentarse desde la plataforma. Si la conexión falla, explicaré la secuencia y continuaré sin convertir la defensa en una prueba técnica.

**[Acción en pantalla: Ejecutar un ajuste preparado y señalar resultado, incertidumbre y trazabilidad. Máximo 3 minutos.]**

**Transición:** Con la demostración cerrada, volvamos a la evidencia acumulada en los casos.

### 29. Nueve casos, tres dimensiones de validación

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

El capítulo de validación organiza los casos en tres dimensiones. Besaya, Mallorca y Calle 30 comprueban la cadena de inundación estocástica basada en impactos. Valencia contrasta estimadores de extremos ante un evento sin precedente. Tanganica, Andes, IAHR 2022, SIMPCCe y Panamá prueban el tratamiento del clima, la disponibilidad desigual de datos y la transferencia a escalas diferentes. La tabla muestra qué bloques metodológicos intervienen en cada caso; no es una clasificación de importancia.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Los casos se agrupan por lo que validan; empecemos por el origen conceptual.

### 30. Besaya 2018: aquí nace la frecuencia sobre el impacto

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min

**Diálogo**

Este es el origen conceptual de la tesis. A partir de series de aforo se extraen avenidas independientes y cada una se describe mediante pico, volumen y duración. Una cópula gaussiana conserva la dependencia entre esas variables y permite generar hidrogramas plausibles. En la aplicación de 2018, Iber transforma esos hidrogramas en manchas y calados. Solo entonces se estima el período de retorno sobre la variable de impacto. pyhydra no existía todavía con su arquitectura actual: surge precisamente de la necesidad de repetir y conectar estas etapas de forma consistente.

**[Acción en pantalla: Señalar el flujo fundacional y distinguirlo expresamente del estudio posterior de rugosidades.]**

**Transición:** El caso fundacional abrió también una pregunta sobre la sensibilidad hidráulica.

### 31. Besaya: del caso fundacional a la sensibilidad hidráulica

**Bloque:** Casos de estudio · **Tiempo orientativo:** 3 min

**Diálogo**

Conviene separar dos etapas del Besaya. El trabajo fundacional de 2018 partió de aforos y utilizó Iber para trasladar la frecuencia desde los hidrogramas hacia los calados. Años después, sobre el mismo dominio, se estudió la incertidumbre estructural mediante 995 simulaciones emparejadas de SFINCS y HEC-RAS 2D, variando la rugosidad de Manning en nueve usos de suelo. Esta segunda etapa reveló una respuesta bimodal en HEC-RAS y un compartimento secundario de unas 7,4 hectáreas asociado a un collado a cota 60,1 metros. La correlación entre motores fue solo moderada: 0,52 en calado y 0,49 en área. El mensaje no es que este sea el origen de la metodología, sino que el dominio fundacional se convirtió también en banco de pruebas para automatización y sensibilidad hidráulica.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Después, la metodología se amplió a una cuenca torrencial con pocos aforos.

### 32. Mallorca: Downscaling híbrido en cuencas torrenciales

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

El 9 de octubre de 2018 cayeron cerca de 220 L/m² en pocas horas en una cuenca sin estaciones de aforo, con la extensión de Copernicus como única referencia de validación. Se aplicó el downscaling híbrido: clasificación de 25 formas de hietograma histórico mediante PCA y k-means, acoplamiento de máximos, duración y tipo de tormenta entre pluviómetros vía cópula gaussiana, y reconstrucción espacial por kriging a 25 m. La hidrología se resolvió en una malla de 25 m y la hidráulica en una malla de 8 m derivada de LiDAR (Iber), calibrada contra la extensión de Copernicus, alcanzando un calado máximo simulado de 5,85 m en el núcleo urbano.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** El siguiente paso fue aplicar la cadena completa a una infraestructura urbana crítica.

### 33. Calle 30, Madrid: Infraestructura crítica urbana

**Bloque:** Casos de estudio · **Tiempo orientativo:** 3 min

**Diálogo**

Calle 30 es la cadena metodológica más completa de los casos aplicados. A partir de ERA5 y pluviómetros AEMET, pyhydra ajusta extremos de precipitación multiduración y genera miles de eventos sintéticos multisitio mediante cópulas gaussianas. Primero se toma un subconjunto de eventos para ejecutar HEC-HMS y convertir la lluvia en hidrogramas. Después, MaxDiss actúa sobre esos hidrogramas y selecciona el subconjunto hidráulicamente representativo que se simula en HEC-RAS 1D. Para los escenarios no simulados, k-NN reconstruye los calados. El producto final no es un retorno heredado de la lluvia, sino un mapa de período de retorno del calado para cada píxel.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** La ficha de HYDRA permite seguir y auditar las etapas de ese caso.

### 34. Calle 30 en HYDRA: hallazgos clave en la web

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min

**Diálogo**

La ficha web permite auditar la cadena completa de Calle 30. Lo esencial es distinguir los dos modelos: HEC-HMS transforma la precipitación multisitio en caudales y HEC-RAS 1D calcula los calados a lo largo de la red canalizada y de túneles. MaxDiss selecciona los escenarios que se simulan explícitamente y k-NN reconstruye el resto. Así se obtiene la frecuencia sobre el calado hidráulico, que es la variable de impacto relevante para el diseño.

**[Acción en pantalla: Señalar HEC-RAS 1D, la selección MaxDiss, la reconstrucción k-NN y el mapa final de período de retorno del calado.]**

**Transición:** La segunda demostración de transferencia aborda la actualización estadística tras la DANA.

### 35. Valencia: Análisis rápido ante la DANA del 2024

**Bloque:** Casos de estudio · **Tiempo orientativo:** 3 min

**Diálogo**

La DANA de Valencia del 29 de octubre de 2024 dejó 710,8 mm en 24 horas en la estación de Turís, un récord nacional. Al aplicar el ajuste clásico (MLE) sin el evento en la serie, el período de retorno estimado para esa precipitación supera los 11.000 años; un valor sin sentido práctico que evidencia la inestabilidad del método ante outliers históricos. El estimador bayesiano implementado en HYDRA asimiló el evento de manera consistente, recalculando el cuantil T100 de diseño (de 260 mm a 952 mm, un salto del 266%) e incrementando realistamente las bandas de incertidumbre operacional.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Veamos ahora las cifras publicadas que resumen ese análisis.

### 36. Valencia en HYDRA: los números reales del caso

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min

**Diálogo**

La cabecera de esta ficha resume en cifras lo que acabamos de ver: los mismos números —710,8 mm, el salto del cuantil T100— están publicados aquí, trazables hasta el notebook que los calculó.

**[Acción en pantalla: Señalar 710,8 mm, el cambio de T100 y el enlace al notebook; no abandonar la sección de resultados.]**

**Transición:** De los extremos de precipitación pasamos a niveles de diseño con registros limitados.

### 37. Lago Tanganica: niveles de diseño con registros limitados

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. El mayor incremento futuro supera 0,9 m en 2041-2060 para T5-T10; a finales de siglo queda por debajo de 0,6 m para T100-T500.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** A continuación, la escala regional exige automatizar calibraciones hidrológicas.

### 38. Andes: calibración hidrológica automatizada a gran escala

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

La aportación decisiva del caso andino fue hacer viable la modelización hidrológica a gran escala. En Bolivia, Colombia, Ecuador y Perú no bastaba con obtener proyecciones climáticas: había que reconstruir campos de precipitación y temperatura, calibrar modelos sobre numerosas cuencas y transformar cada escenario de lluvia en series de caudal. Los vacíos amazónicos se completaron con precipitación satelital e interpolación por kriging universal; después, la calibración automática se organizó con SPOTPY, utilizando algoritmos PSO, DREAM y SCE-UA. Esto evitó el ajuste manual cuenca a cuenca y permitió ejecutar de forma homogénea el modelo distribuido VIC sobre más de 200 subcuencas. Una vez calibrada la cadena lluvia-caudal, se propagaron 21 modelos CMIP5, dos escenarios RCP y tres horizontes temporales. El resultado científico incluye aumentos mensuales superiores al 40 por ciento en Perú y Ecuador, pero la contribución tecnológica que conecta este caso con la tesis es la automatización del ciclo completo de calibración y simulación regional.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** La comparación del Besaya ofrece una prueba directa del efecto sobre el diseño.

### 39. IAHR 2022: Evidencia cuantitativa de la hipótesis H3

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

El artículo presentado en el 39º Congreso Mundial IAHR (Granada, 2022) aporta la prueba numérica de la hipótesis H3. Con 15 modelos EURO-CORDEX bajo RCP4.5/8.5 y corrección de sesgo por quantile-mapping, se generaron 10.000 años sintéticos de precipitación sobre la cuenca del Besaya; 200 casos se seleccionaron mediante MaxDiss para simulación completa no estacionaria en Iber, y el resto se reconstruyó por k-NN. El método convencional (curvas IDF con único pico de lluvia) subestima los caudales de diseño entre un 30% y un 37% de forma sistemática frente al pipeline estocástico completo, en todos los períodos de retorno, escenarios y horizontes analizados —por ejemplo, 208,8 m³/s frente a 278,5 m³/s para T100 en el horizonte 2011-2040 bajo RCP4.5.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** La transferencia también importa para la gestión de embalses bajo cambio climático.

### 40. SIMPCCe: caudales mínimos de embalses ante el cambio climático

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

SIMPCCe es una herramienta de ámbito nacional, aplicable a cualquier punto de la red hidrográfica española, desarrollada según la guía metodológica para estimar aportaciones mínimas a embalses bajo cambio climático. En 2023, el Observatorio del Agua de la Fundación Botín concedió a esa guía el Premio al Talento Joven “M.R. Llamas” mediante la candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave. SIMPCCe operacionaliza ese marco: descarga SPAIN02, SIMPA-CEDEX y 10 modelos CORDEX-AEMET; entrena una red neuronal sobre las componentes principales de precipitación y temperatura; corrige el sesgo climático y genera simulaciones futuras e informes automáticos de sequía y fiabilidad.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** El caso de Panamá lleva la automatización a una escala territorial nacional.

### 41. Atlas de Panamá: automatización a escala nacional

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

Encargado por el Ministerio de Ambiente de Panamá y el BID, este es el caso de mayor escala del catálogo: 52 cuencas de hasta 13.400 km² en ambas vertientes, más 1.464 puntos costeros analizados frente a inundación costera y viento extremo sobre el área metropolitana. NEOPRENE/STNSRP rellenó 73 estaciones nacionales (1950-2022), y el kriging universal generó una malla de 1 km. Sobre esta base se corrigieron automáticamente 414 combinaciones de sesgo (23 modelos CMIP6 × 2 escenarios SSP × 6 variables × 3 horizontes) mediante QDM y SDM, alimentando el modelo hidrológico LEM (NS=0,87) y ejecuciones masivas de SFINCS nacional, con modelos 2D de alta resolución en el área metropolitana.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Reunamos ahora las cifras que sostienen la contribución de los casos.

### 42. Resultados que sostienen la contribución

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

Antes de cerrar el bloque, conviene reunir las evidencias que dan valor a la contribución. La comparación metodológica muestra diferencias del 30 al 37 por ciento en el caudal de diseño. La incorporación de un evento sin precedente eleva en un 266 por ciento el cuantil T100 estimado en la estación analizada. Una campaña de 1.990 simulaciones hidráulicas permite separar sensibilidad paramétrica y diferencias entre motores. Y 414 correcciones climáticas automáticas muestran que la arquitectura puede operar a escala nacional. Son resultados distintos, pero todos dependen de una cadena reproducible que conecta datos, incertidumbre, modelos y decisión.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Las cifras cobran sentido al compararlas con el argumento común de la tesis.

### 43. Qué demuestra el conjunto de casos

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min

**Diálogo**

Al reunir los casos aparece con claridad el argumento central de la tesis. La modelación estocástica no es una herramienta aislada que se añade al final del cálculo. Es el principio que obliga a representar múltiples forzamientos plausibles, propagarlos por la hidrología y la hidráulica, y estimar la frecuencia sobre la variable que realmente condiciona la decisión: el caudal, el calado, la extensión inundada o el nivel del lago. Los casos abarcan más asuntos que la generación estocástica —datos globales, cambio climático, inferencia bayesiana, aprendizaje automático o automatización de motores— porque todos son necesarios para que ese análisis probabilístico pueda funcionar en problemas reales. pyhydra aporta el núcleo común y HYDRA hace visible, reproducible y transferible la cadena completa.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Esa evidencia se traduce también en producción científica y software preservado.

### 44. Producción científica asociada a la tesis

**Bloque:** Contribuciones científicas · **Tiempo orientativo:** 2 min

**Diálogo**

La producción científica debe distinguir resultados publicados, comunicaciones y trabajos actualmente enviados. Hay dos artículos publicados en Ingeniería del Agua: la aplicación de Calle 30, en 2024, y SIMPCCe, en 2025. La investigación también se ha presentado en cinco comunicaciones: SIMPCCe en las séptimas Jornadas de Ingeniería del Agua de 2023 y en Hydroinformatics 2024, HYDRA en InterJIA 2024, y los trabajos de Valencia y del lago Tanganica en las octavas Jornadas de Ingeniería del Agua de 2025. Además, se han enviado dos manuscritos: “Proyección de niveles extremos del lago Tanganica bajo cambio climático en una cuenca poco instrumentada” a Ingeniería del Agua, y el estudio de incertidumbre de rugosidad y estructura de modelo a Environmental Modelling & Software. Finalmente, pyhydra e HYDRA cuentan con versiones publicadas y citables en Zenodo.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Antes de cerrar, delimitaré mi contribución dentro de los trabajos compartidos.

### 45. Una línea de investigación consolidada entre 2017 y 2026

**Bloque:** Contribuciones científicas · **Tiempo orientativo:** 2 min

**Diálogo**

Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución. Soy primer autor en siete trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los trabajos andinos contribuí a la calibración automática y al procesamiento climático; en NEOPRENE, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en Valencia, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. Finalmente, pyhydra e HYDRA condensan esa trayectoria en dos productos de software científico diseñados, desarrollados y documentados como parte de la tesis.

**[Pauta: presenta primero la idea de la figura y señala solo el elemento que sostiene este mensaje.]**

**Transición:** Con esa contribución delimitada, podemos revisar las hipótesis una por una.

### 46. Las hipótesis se cierran con evidencia acumulada

**Bloque:** Validación · **Tiempo orientativo:** 3 min

**Diálogo**

Las hipótesis no se verifican con una única cifra ni con una demostración de software. Se cierran mediante evidencia acumulada. La primera queda respaldada por campañas que encadenan cientos o miles de ejecuciones sin intervención manual, tanto en una infraestructura urbana como en un atlas nacional. La segunda se apoya en la reutilización de los mismos bloques de datos, clima y modelización en problemas de escala y finalidad muy diferentes. La tercera es cuantitativa: la comparación con el procedimiento convencional muestra una subestimación del 30 al 37 por ciento en los caudales de diseño, y el análisis de un evento sin precedente evidencia la mayor estabilidad de la inferencia bayesiana. El resultado no es eliminar la incertidumbre, sino representarla, propagarla y auditarla de forma más consistente.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** El cierre de las hipótesis permite responder con precisión qué es original.

### 47. La contribución original: hacer operativa la ciencia existente

**Bloque:** Conclusiones · **Tiempo orientativo:** 3 min

**Diálogo**

La memoria estratifica sus aportaciones en tres niveles, precisamente para responder a la pregunta de qué hay de nuevo. Primero, las metodologías incorporadas: NEOPRENE/CoSMoS, GEV/GPD con L-momentos y estimación bayesiana, cópulas gaussianas y vine, CMIP6/SSP, corrección de sesgo, MaxDiss/k-NN, y los motores HEC-HMS/SWAT/SFINCS/HEC-RAS/Iber — todas preexistentes. Segundo, los desarrollos implementados: los bloques modulares en Python, los adaptadores y las tuberías automatizadas. Y tercero, la contribución original propiamente dicha: la integración extremo a extremo, la reproducibilidad sistemática, y la transferibilidad operativa demostrada en 9 casos de estudio sin modificar el núcleo. Cierro esta idea con la frase que resume la mención industrial de la tesis: no reside únicamente en los resultados de los casos de estudio, sino en que esos mismos resultados son reproducibles por terceros con los mismos datos y la misma infraestructura.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Toda contribución debe presentarse junto con sus límites y el trabajo pendiente.

### 48. Qué resuelve HYDRA y qué permanece abierto

**Bloque:** Conclusiones · **Tiempo orientativo:** 2 min

**Diálogo**

Identificamos con honestidad las limitaciones actuales del sistema para marcar la hoja de ruta de los próximos desarrollos: la sensibilidad de los ajustes extremos a series cortas, la dependencia de licencias comerciales para HEC-RAS, el supuesto de estacionariedad en los generadores estocásticos, el coste computacional de los grandes ensembles hidráulicos, y la calidad heterogénea de las fuentes de datos globales (ERA5, CMIP6, GRDC, GloFAS).

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Después de exponer los límites, quiero agradecer a quienes hicieron posible este recorrido.

### 49. Una tesis se firma con un nombre, pero se construye con muchos

**Bloque:** Agradecimientos · **Tiempo orientativo:** 1 min

**Diálogo**

Antes de cerrar, quiero dedicar unas palabras de agradecimiento. A mi familia, por acompañarme desde el comienzo y sostenerme también en los momentos en que el camino parecía no avanzar. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor, honestidad y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad constantes. A IHCantabria, por los medios, los proyectos y el entorno humano y técnico en el que me he formado como investigador e ingeniero. Y a Álvaro Galán, por ayudarme a mantener la motivación y por contribuir a mejorar este trabajo. A todos, gracias.

**[Pauta: usa las viñetas como apoyo visual; no las leas una por una.]**

**Transición:** Termino reuniendo en una frase el resultado y el reto que queda abierto.

### 50. Muchas gracias por su atención

**Bloque:** Cierre · **Tiempo orientativo:** 1 min

**Diálogo**

La tesis demuestra que es posible convertir una década de metodologías probabilísticas en una cadena completa, reproducible y transferible, desde la adquisición de los datos hasta los mapas de período de retorno del impacto. El reto que queda abierto es que HYDRA deje de ser la herramienta de su equipo de desarrollo y se convierta en la herramienta de su comunidad. Muchas gracias por su atención. Quedo a disposición del tribunal para las preguntas que deseen formular.

**[Pauta: saluda, espera un instante y nombra a las personas con calma.]**

**[Pauta final: haz una pausa, mira al tribunal y cede la palabra para las preguntas.]**
## Hoja de ensayo

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
