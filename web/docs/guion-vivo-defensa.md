# Guion vivo de la defensa doctoral

**Tesis:** Desarrollo de un modelo automático de inundación estocástica bajo incertidumbre hidrológica y climática  
**Doctorando:** Salvador Navas Fernández  
**Versión de trabajo:** 29 de septiembre de 2026  
**Duración objetivo:** 50–55 minutos, con un límite absoluto de 60 minutos  
**Fuente principal:** memoria doctoral definitiva y contenido de `src/data/slides.ts`

> Este documento no se debe memorizar palabra por palabra. Sirve para dominar el argumento, ensayar las transiciones y evitar que una diapositiva se convierta en una lectura de viñetas. Cada revisión de contenido de la presentación debe reflejarse también aquí.

## La tesis en una frase

Esta tesis convierte métodos científicos ya consolidados pero dispersos en una arquitectura automática, reproducible y transferible que propaga la incertidumbre desde los datos y los forzamientos hasta la variable de impacto sobre la que se toman decisiones.

## Las cinco ideas que el tribunal debe recordar

1. El período de retorno del forzamiento no coincide necesariamente con el período de retorno del impacto: **T(forzante) ≠ T(impacto)**.
2. La aportación no es un nuevo motor hidráulico ni un nuevo algoritmo estadístico aislado, sino su **integración extremo a extremo**.
3. **pyhydra** es el núcleo científico reutilizable; **HYDRA** es la plataforma que lo hace ejecutable, visible, documentado y transferible.
4. Los nueve casos no son un catálogo: forman una evolución desde el principio científico del Besaya hasta la automatización, la escala y la transferencia industrial.
5. La tesis no elimina la incertidumbre: permite **representarla, propagarla y auditarla**.

## Mapa oral y tiempos

| Bloque | Propósito oral | Tiempo objetivo |
|---|---|---:|
| Apertura e índice | Presentar la tesis y orientar al tribunal | 4 min |
| Origen, necesidad y pregunta | Justificar por qué existe la tesis | 9–10 min |
| Respuesta propuesta | Explicar pyhydra/HYDRA sin caer en un catálogo técnico | 10–11 min |
| Evidencia y casos | Demostrar utilidad científica e industrial | 20–22 min |
| Contribuciones y cierre | Responder qué aporta, qué limita y qué continúa | 8–9 min |

Las demostraciones adicionales son material de reserva. Durante el relato principal solo se navega cuando la web aporta una evidencia que la diapositiva no puede mostrar mejor. En ensayo, el objetivo no es hablar deprisa para “llegar a 45”, sino sostener una exposición de 50–55 minutos con pausas, lectura de figuras y explicación de resultados. Si un ensayo supera 57 minutos, se recorta navegación antes que contexto científico.

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
