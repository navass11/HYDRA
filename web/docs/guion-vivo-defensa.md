# Guion vivo de la defensa doctoral

**Tesis:** Desarrollo de un modelo automático de inundación estocástica<br>
**Doctorando:** Salvador Navas Fernández<br>
**Versión de trabajo:** 5 de octubre de 2026<br>
**Duración objetivo:** 50–55 minutos; estimación actual del guion: ~55 minutos<br>
**Fuente de contenido:** `thesis/main.tex` y capítulos 1–6, 8 y 9<br>
**Guion por diapositiva:** sincronizado con `web/src/data/slides.ts`

> Este documento no se debe memorizar palabra por palabra. Sirve para dominar el argumento, ensayar las transiciones y evitar que una diapositiva se convierta en una lectura de viñetas. Cada revisión de contenido de la presentación debe reflejarse también aquí.

> La sección **Guion oral completo por diapositiva** recoge el texto sugerido para decir, en el orden exacto de la presentación principal. Las notas privadas aparecen aparte y no se leen. Las demostraciones de la web son apoyo del bloque metodológico: el manual práctico corresponde al material complementario de la memoria, no a un capítulo principal adicional.

## La tesis en una frase

Esta tesis convierte métodos científicos ya consolidados pero dispersos en una arquitectura automática, reproducible y transferible que propaga la incertidumbre desde los datos y los forzamientos hasta la variable de impacto sobre la que se toman decisiones.

## Las cinco ideas que el tribunal debe recordar

1. El período de retorno del forzamiento no coincide necesariamente con el período de retorno del impacto: **T(forzante) ≠ T(impacto)**.
2. La aportación no es un nuevo motor hidráulico ni un nuevo algoritmo estadístico aislado, sino su **integración extremo a extremo**.
3. **pyhydra** es el núcleo científico reutilizable; **HYDRA** es la plataforma que lo hace ejecutable, visible, documentado y transferible.
4. Los nueve casos cubren tres dimensiones: inundación estocástica basada en impactos; extremos e incertidumbre; cambio climático, datos globales y escalabilidad. Tres (Besaya, Calle 30 y Valencia) se reproducen hoy con notebooks; los otros seis originaron o ampliaron el diseño.
5. La tesis no elimina la incertidumbre: permite **representarla, propagarla y auditarla**.

## Mapa oral y tiempos

| Bloque | Tiempo orientativo |
|---|---:|
| Introducción | 15,1 min |
| Estado de la técnica | 2,4 min |
| Arquitectura | 3,5 min |
| Metodología | 8,9 min |
| Casos y validación | 17,7 min |
| Conclusiones | 7,4 min |

La estimación de ~55 minutos combina el texto oral a un ritmo de 115 palabras por minuto, unos segundos por cambio de diapositiva, lectura de figuras y una demostración breve. Es una referencia inicial: un ensayo cronometrado con pausas naturales determinará el tiempo real.

Las demostraciones adicionales son material de reserva. En el relato principal, abrir la web solo cuando aporta una evidencia que la figura no muestra mejor. Si un ensayo supera 57 minutos, recortar navegación antes que contexto científico.

---

## 1. Portada

### Mensaje imprescindible

Presentar formalmente el trabajo, situarlo como tesis con mención industrial y dar los nombres en líneas separadas: doctorando, director y tutor.

### Versión oral

Buenos días. Miembros del tribunal, director, tutor, profesores, compañeros, familiares y amigos: muchas gracias por acompañarme. Soy Salvador Navas Fernández y voy a presentar la tesis doctoral titulada *Desarrollo de un modelo automático de inundación estocástica*, realizada en IHCantabria dentro del programa de Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos (IH2O) y con mención industrial. La tesis ha sido dirigida por el doctor Manuel del Jesus Peñil y tutorizada por el doctor César Álvarez Díaz.

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

La primera aportación es la integración extremo a extremo: desde la adquisición del dato hasta el impacto. La segunda es la reproducibilidad: cada resultado mantiene la trazabilidad de su fuente, método y configuración. La tercera es la transferencia: la misma arquitectura se aplica a problemas de escala, clima y finalidad distintas. Al llegar a los casos distinguiré cuáles se reproducen hoy con notebooks y cuáles originaron el diseño.

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

### Estrategia de investigación

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

La DANA del 29 de octubre de 2024 dejó 710,8 milímetros en 24 horas en Turís, muy por encima de cualquier valor previo de su serie. El caso muestra el comportamiento de la inferencia de extremos cuando aparece un evento fuera del rango histórico. Al incorporarlo, el cuantil de cien años cambia de forma muy intensa y el período de retorno asignado al evento pasa de miles de años a un orden de decenas. Sin el evento, MLE y L-momentos le asignan más de 11.000 y 31.000 años, y el bayesiano unos 3.069; con él, los tres convergen entre 66 y 91 años. Más que fijarnos en una cifra aislada, el resultado importante es que la estimación y su incertidumbre pueden recalcularse con rapidez, comparar métodos y conservar trazabilidad.

**Cuidado:** no decir «récord nacional» sin fuente de AEMET, ni que el bayesiano es «más estable» sin matiz: su salto también es grande, aunque menor.

**Frase de salida:** Valencia demuestra capacidad de respuesta y la necesidad de expresar incertidumbre, no solo un período de retorno puntual.

### 9.5 IAHR 2022: prueba cuantitativa de la hipótesis

**Contexto y referencia:** estudio comparativo presentado en el 39.º Congreso Mundial de IAHR, celebrado en Granada en 2022, y recogido en el capítulo 8. Su propósito fue aislar cuánto cambia el resultado de diseño al sustituir el procedimiento convencional por la cadena estocástica completa.

El estudio presentado en el Congreso Mundial de IAHR compara la cadena estocástica completa con el procedimiento convencional. Se generaron 10.000 años sintéticos de precipitación, se seleccionaron 200 eventos mediante MaxDiss para simulación con Iber y se reconstruyó el resto con k-NN. Los caudales de diseño de la cadena estocástica fueron sistemáticamente entre un 30 % y un 37 % superiores a los del método convencional. Para T100 en uno de los escenarios, 278,5 frente a 208,8 metros cúbicos por segundo.

**Cuidado con la cifra:** el estocástico es un 30–37 % superior; la IDF queda alrededor de un 25 % por debajo. No decir que la IDF «subestima un 30–37 %» (es la errata del cap. 9 de la memoria).

La diferencia no puede corregirse con un factor uniforme porque la respuesta hidráulica es espacial y no lineal. Esta es la evidencia cuantitativa más directa de que la elección metodológica cambia el diseño más que el propio escenario climático. No prueba por sí sola cuál de los dos valores es el correcto, porque no hay observaciones de esos caudales futuros.

### 9.6 Transferencia y escala: Andes, Tanganica, SIMPCCe y Panamá

En Andes, la aportación decisiva fue automatizar con SPOTPY la calibración de modelos hidrológicos globales y construir a gran escala el proceso que transforma precipitación en caudal bajo escenarios climáticos. No debe presentarse solo como kriging o corrección de sesgo.

**Referencia Andes:** estudios hidroeléctricos regionales en Colombia, Bolivia, Perú y Ecuador, sintetizados en el capítulo 8. Al mencionar `pyhydra.climate` y `pyhydra.modeling`, explicar que el primero prepara y corrige los campos climáticos y el segundo organiza la calibración y ejecución de VIC; el nombre de la librería no sustituye la explicación del proceso.

Tanganica aborda la estimación de niveles de diseño con observaciones limitadas y fuentes globales. Su valor está en combinar información heterogénea declarando las restricciones de los datos; no debe atribuirse al caso una cadena o unos resultados que la memoria no documenta.

**Referencia Tanganica:** trabajo presentado en las VIII Jornadas de Ingeniería del Agua de 2025 y desarrollado en el capítulo 8. El problema de ingeniería es obtener cotas extremas para el puerto de Kalundu con una serie altimétrica corta, no producir un mapa hidráulico 2D.

SIMPCCe traslada corrección de sesgo, escenarios climáticos y modelos de aprendizaje automático a la estimación de caudales mínimos de embalse. Se desarrolló según la guía metodológica de Fundación Canal, y esa guía obtuvo el Premio al Talento Joven «M.R. Llamas» del Observatorio del Agua de la Fundación Botín, evidencia adicional de su utilidad aplicada.

**Referencia SIMPCCe:** artículo publicado en *Ingeniería del Agua* en 2025; guía metodológica de Fundación Canal; premio del Observatorio del Agua de la Fundación Botín. El resultado debe conectarse con la operación de embalses y las sequías, no presentarse únicamente como una red neuronal.

Panamá demuestra escala nacional: automatiza cientos de correcciones de sesgo y conecta información climática con modelización de inundaciones para construir productos homogéneos sobre todo un país.

**Referencia Panamá:** Atlas Nacional de Riesgo de Inundación de Panamá, con participación institucional y financiación del BID, documentado en el capítulo 8. Es la evidencia principal de automatización a escala territorial.

**Frase de salida del bloque:** Los casos abarcan más temas que la generación estocástica porque datos, clima, calibración, modelos físicos y cómputo son condiciones necesarias para estudiar inundaciones estocásticamente en problemas reales.

### Resultados que sostienen la contribución

Cerrar los casos reuniendo cuatro evidencias: una diferencia del 30 al 37 % en el caudal de diseño frente al procedimiento convencional; un incremento del 266 % en el cuantil T100 después de incorporar un evento sin precedente; 1.990 simulaciones hidráulicas 2D para estudiar sensibilidad paramétrica y diferencias entre motores; y cientos de correcciones climáticas automatizadas en un estudio de escala nacional. Explicar el significado de cada cifra y terminar señalando su elemento común: todas dependen de una cadena trazable desde el dato hasta el resultado.

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

Las hipótesis se cierran con evidencia acumulada. La automatización queda respaldada por cadenas extensas ejecutadas sin intervención manual sobre una infraestructura urbana y a escala nacional; es una evidencia de viabilidad, no una medida del ahorro de tiempo. La modularidad se demuestra mediante la reutilización de bloques de datos, clima y modelización en contextos distintos. La representación de la incertidumbre se apoya en una comparación cuantitativa frente al procedimiento convencional (caudales estocásticos un 30–37 % superiores) y en la comparación de estimadores tras un evento sin precedente.

El resultado no es que HYDRA elimine la incertidumbre. El resultado es que permite representarla, propagarla y auditarla con mayor consistencia.

## 12. Contribución original

### Mensaje imprescindible

Responder sin ambigüedad a “¿qué hay de nuevo si los métodos ya existían?”.

### Versión oral

La memoria distingue tres niveles. En primer lugar están las metodologías incorporadas, que se reconocen como conocimiento previo: extremos, cópulas, generadores estocásticos, corrección de sesgo, MaxDiss, k-NN y motores físicos. En segundo lugar están los desarrollos realizados: módulos, adaptadores, flujos automatizados y mecanismos de trazabilidad. En tercer lugar se encuentra la contribución original de la tesis: integrar esos elementos extremo a extremo, sistematizar su reproducibilidad y demostrar su transferencia a problemas heterogéneos, con tres casos que hoy se reproducen mediante notebooks.

La mención industrial no reside únicamente en resolver casos reales. Reside en que el conocimiento se entrega como una infraestructura instalable, ejecutable, auditable y ampliable por terceros.

## 13. Limitaciones y continuidad

### Versión oral

HYDRA organiza la incertidumbre, pero no elimina los límites de los datos ni de los modelos. Las series cortas siguen condicionando la inferencia de cola; los motores externos introducen dependencias de licencias y versiones; los generadores estacionarios no representan por sí solos tendencias climáticas; los grandes conjuntos hidráulicos mantienen un coste computacional alto; y las fuentes globales tienen calidad heterogénea. Además, falta un contraste sistemático de manchas y frecuencias de impacto con observaciones y una medida cuantitativa del ahorro de tiempo.

Estas limitaciones definen la continuidad: generación no estacionaria, métricas de acierto frente a observaciones, medida del ahorro, eventos compuestos, ejecución distribuida, más adaptadores, una suite de tests y documentación orientada a usuarios externos.

## 14. Agradecimientos y cierre

### Versión oral

Antes de terminar, quiero agradecer a mi familia el apoyo que ha sostenido todo este recorrido. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor, honestidad y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad. A IHCantabria, por el entorno humano, científico y técnico en el que me he formado. Y a Álvaro Galán, por ayudarme a mantener la motivación y por contribuir a mejorar este trabajo.

La tesis demuestra que es posible convertir una década de metodologías probabilísticas en una cadena reproducible y transferible, desde los datos hasta los mapas de frecuencia del impacto. El reto que queda abierto es que HYDRA deje de ser únicamente una herramienta de su equipo de desarrollo y se convierta en una herramienta de su comunidad.

Muchas gracias por su atención. Quedo a disposición del tribunal para las preguntas que deseen formular.

---

## Guion oral completo por diapositiva

Libreto del recorrido principal: **46 diapositivas**, unos **55 minutos**. El texto bajo **Diálogo** se pronuncia; la **Transición** acompaña el cambio de diapositiva. Las pautas entre corchetes son acciones privadas. Los tiempos incluyen el habla a 115 palabras/min, la transición, la lectura de figuras y la demostración. Son los mismos que utiliza la vista de presentador.

### 1. Desarrollo de un modelo automático de inundación estocástica

**Bloque:** Apertura · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

Buenos días, miembros del tribunal, director, tutor, profesores, compañeros, familiares y amigos. Muchas gracias por acompañarme. Soy Salvador Navas Fernández y voy a presentar mi tesis doctoral, titulada "Desarrollo de un modelo automático de inundación estocástica". La he realizado en IHCantabria, dentro del programa de Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos (IH2O) y con Mención Industrial. La tesis ha sido dirigida por el doctor Manuel del Jesus Peñil y tutorizada por el doctor César Álvarez Díaz. A lo largo de la exposición explicaré qué problema científico la origina, cómo se construyó la solución y qué evidencia permite valorar su utilidad.

**Transición:** Para situar el recorrido, empezaré por la estructura académica que seguirá la exposición.

### 2. Estructura de la defensa

**Bloque:** Apertura · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

La exposición sigue seis bloques que agrupan los capítulos de la memoria, en este orden. Primero, la introducción: el problema, la pregunta, las hipótesis y los objetivos. Después, el estado de la técnica y la brecha que justifica la tesis. En tercer lugar, la arquitectura de HYDRA. En cuarto, la metodología: datos, análisis climático y estadístico, y modelización, con una breve demostración. En quinto, los casos como evidencia de validación. Y por último, las conclusiones: contribución, límites y trabajo futuro. Esta misma ruta aparece arriba en cada diapositiva para que sepan en qué punto estamos.

**Transición:** Con este recorrido en mente, fijemos primero por qué el problema merece esta investigación.

### 3. Dimensión del problema de las inundaciones

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

Antes de delimitar la tesis conviene recordar la dimensión del problema. Una inundación afecta simultáneamente a personas, viviendas, movilidad, actividad industrial y servicios esenciales. El daño depende de dónde se produce el agua, de la velocidad con la que llega, del estado previo de la cuenca y de la vulnerabilidad de cada elemento expuesto. Por eso una única lluvia asociada a un período de retorno no basta para describir el riesgo. La pregunta de ingeniería exige conocer qué impactos pueden producirse, con qué frecuencia y con qué incertidumbre.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con esa necesidad presente, voy a explicar qué significa cada parte del título.

### 4. Qué significa el título de la tesis

**Bloque:** Apertura · **Tiempo orientativo:** 1 min 36 s

**Diálogo**

El título resume el alcance de la tesis y conviene interpretar cada término. “Modelo” no significa un nuevo solver hidráulico: significa una cadena completa de cálculo. “Automático” indica que los datos, los métodos estadísticos, los escenarios y los modelos físicos pueden encadenarse sin repetir manualmente tareas frágiles. “Inundación” señala que el resultado relevante no es únicamente la lluvia o el caudal, sino el impacto hidráulico: calado y extensión inundada. Y “estocástica” significa que no se estudia un único evento de diseño, sino una población de escenarios plausibles que representa la variabilidad y la incertidumbre. Esta definición exige además reproducibilidad operativa: conocer de dónde procede cada entrada, repetir las transformaciones, conservar las salidas en formatos estándar y registrar la configuración que produjo cada resultado. Por tanto, el modelo automático de inundación estocástica es una arquitectura reproducible que lleva la incertidumbre desde los datos hasta la variable sobre la que se toman decisiones.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El origen concreto de esta pregunta está en un trabajo anterior sobre el río Besaya.

### 5. El TFM y el artículo que originan esta tesis

**Bloque:** Apertura · **Tiempo orientativo:** 1 min 24 s

**Diálogo**

El punto de partida real de esta tesis es mi Trabajo Fin de Máster, desarrollado en 2017 sobre el río Besaya a su paso por Los Corrales de Buelna. En aquel trabajo construí la primera cadena completa: caracterización multivariante de avenidas, generación de escenarios, simulación hidráulica con Iber y análisis estadístico de los impactos. El TFM recibió el premio principal en la categoría de Mejor Calidad y Contenido del primer Concurso Nacional de Proyectos Fin de Máster del Colegio de Ingenieros de Caminos, Canales y Puertos. El trabajo se publicó después en la Revista de Obras Públicas, número 3598 de mayo de 2018, y consolidó la observación que guía toda la tesis: el período de retorno del forzamiento no coincide necesariamente con el del impacto hidráulico. A partir de esa dificultad concreta —repetir, conectar y auditar una cadena extensa— nace la necesidad de pyhydra y, finalmente, de HYDRA.

**Transición:** Ese primer caso resolvió una aplicación, pero también dejó al descubierto una limitación más general.

### 6. Por qué es necesaria esta tesis

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 18 s

**Diálogo**

Esta tesis se realiza porque las inundaciones son el riesgo natural con mayor impacto social, económico y territorial, y porque las condiciones que determinan ese riesgo están cambiando. La exposición se acumula en llanuras inundables; el cambio climático intensifica y altera el ciclo hidrológico; y la impermeabilización urbana concentra la escorrentía y reduce los tiempos de respuesta. A ello se suman interacciones entre precipitación, caudal, nivel del mar, humedad antecedente y funcionamiento de infraestructuras. En este contexto, una única lluvia de diseño produce una imagen demasiado limitada del problema. La ingeniería necesita explorar muchos escenarios plausibles y conocer no solo un valor de cálculo, sino también la incertidumbre asociada a la decisión.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Para entender la brecha, repasemos antes cómo se estima habitualmente una inundación.

### 7. Cómo se estima convencionalmente una inundación

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

Antes de presentar la solución, conviene fijar el procedimiento de referencia. Partimos de registros, ajustamos extremos, construimos un evento de diseño, lo transformamos mediante modelos hidrológicos e hidráulicos y obtenemos un mapa de inundación. La cadena física es necesaria y no se pretende reemplazar. La dificultad está en tres simplificaciones frecuentes: asumir estacionariedad, representar el extremo con un único evento y trasladar el mismo período de retorno desde el forzamiento hasta el impacto. HYDRA conserva esta cadena, pero automatiza la exploración de muchos escenarios y lleva la incertidumbre hasta el calado y la extensión inundada.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** La cadena convencional funciona físicamente; el problema aparece al asignar frecuencia al impacto.

### 8. El problema científico

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

El problema científico se ve en este esquema. En las dos filas cae la misma lluvia, con un período de retorno de cien años. En la fila de arriba el suelo está seco y el agua queda dentro del cauce. En la de abajo el suelo está saturado y el afluente llega en crecida: el río desborda. El forzamiento es idéntico; el impacto, no. Por eso no basta con preguntar cada cuánto ocurre una lluvia de diseño. Hay que preguntar cada cuánto se supera un calado, un caudal o una extensión inundada relevantes para la decisión. La tesis parte de esa diferencia: el período de retorno del forzamiento no es el del impacto.

**Transición:** A partir de ese problema se formula la hipótesis que voy a contrastar.

### 9. La hipótesis central

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

La hipótesis central es que la barrera para aplicar estos métodos no es la falta de conocimiento científico, sino su integración. El esquema lo resume. Arriba están los métodos que ya existen —extremos, cópulas, generadores, proyecciones, corrección de sesgo y motores hidráulicos—, pero desconectados: en cada proyecto hay que reconstruir a mano los enlaces que aparecen en rojo. Abajo, la misma ciencia organizada en una cadena modular y reproducible, desde los datos hasta el impacto. Como enunciado general no se contrasta directamente; se descompone en las tres hipótesis operativas de la parte inferior, que cerraré al final con evidencia concreta.

**Transición:** La hipótesis se concreta en una pregunta que guía el trabajo completo.

### 10. Pregunta de investigación

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

La pregunta de investigación es la que aparece a la izquierda: ¿es posible automatizar de forma reproducible la cadena completa del análisis probabilístico del riesgo de inundación bajo incertidumbre hidrológica y climática, integrando metodologías previamente desarrolladas en un marco transferible a proyectos reales de ingeniería? A la derecha está la cadena que exige: datos climáticos con su incertidumbre; una cadena automática que, con las mismas entradas, dé el mismo resultado; modelos físicos adecuados a cada caso; y un proyecto real en el que la frecuencia se decide sobre el impacto. La cuña recuerda la condición esencial: la incertidumbre tiene que llegar hasta el final, sin perderse entre etapas.

**Transición:** Para responderla, la investigación se organiza en un objetivo general y cuatro compromisos.

### 11. Objetivo general y objetivos específicos

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

El objetivo general es desarrollar y validar un marco automático y reproducible para el análisis estocástico de inundaciones bajo incertidumbre hidrológica y climática. Ese objetivo se concreta en cuatro compromisos. Integrar fuentes de datos heterogéneas; encapsular los métodos estadísticos y estocásticos en un núcleo reutilizable; acoplarlos con modelos hidrológicos e hidráulicos sin imponer un único motor; y demostrar su transferencia mediante casos reales de distinta escala. Esta formulación permite que cada parte de la defensa responda a un objetivo y termine en evidencia, no en una mera descripción de herramientas.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Con los objetivos fijados, anticipo qué aporta la tesis antes de explicar cómo se ha investigado.

### 12. Qué aporta esta tesis

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

Con los objetivos fijados, anticipo qué aporta la tesis. No reivindica como nuevos los métodos estadísticos, los generadores ni los modelos físicos; su aportación es hacerlos trabajar juntos, y tiene tres partes. Integración: una sola cadena, de los datos al impacto, como muestra la franja superior. Reproducibilidad: cada resultado deja registro de su fuente, su método, su configuración y su salida, de modo que un tercero puede repetirlo. Y transferencia: el mismo núcleo resuelve problemas distintos, desde un túnel urbano hasta la escala nacional. Al presentar los casos distinguiré cuáles originaron la arquitectura y cuáles pueden reproducirse hoy con ella.

**Transición:** Para llegar a esas aportaciones, la investigación siguió una estrategia verificable.

### 13. Estrategia de investigación

**Bloque:** Motivación · **Tiempo orientativo:** 1 min 12 s

**Diálogo**

Una vez formulada la pregunta, la estrategia de investigación se organiza en cuatro decisiones. La primera es representar explícitamente la incertidumbre mediante múltiples escenarios plausibles y calcular la frecuencia sobre la respuesta del sistema, no solo sobre la variable de entrada. La segunda es automatizar la cadena completa para evitar rupturas manuales entre datos, métodos y modelos. La tercera es separar sus componentes para que puedan sustituirse o reutilizarse sin reconstruir todo el flujo. La cuarta es validar la propuesta en problemas de distinta escala y con información disponible muy diferente. Consideraremos que la respuesta funciona si conserva la incertidumbre hasta el impacto, permite repetir y auditar el cálculo, se adapta a distintos modelos y produce resultados útiles en aplicaciones científicas e industriales.

**Transición:** La estrategia se sitúa ahora frente a los marcos integrados más próximos.

### 14. Posicionamiento frente a los marcos integrados más próximos

**Bloque:** Estado del arte · **Tiempo orientativo:** 1 min 30 s

**Diálogo**

La brecha no es la ausencia de métodos, sino la falta de integración operativa. Para comprobarlo, la memoria compara HYDRA con los marcos integrados más próximos. CLIMADA es la referencia para el riesgo climático global, pero trabaja con funciones de impacto agregadas y sin una cadena hidrológico-hidráulica explícita. RainyDay genera tormentas estocásticas por transposición, pero delega la simulación física y el análisis de impactos. wflow y HydroMT automatizan la construcción de modelos a partir de datos globales, pero no abordan los extremos multivariantes ni el período de retorno sobre el impacto. Los marcos de simulación continua, como el de Falter y colaboradores, sí calculan el riesgo de extremo a extremo, pero son implementaciones ligadas a un dominio y a un equipo concretos. Ninguno cubre a la vez las ocho capacidades de la tabla, y esa combinación es la que HYDRA integra. Herramientas como Stan, PyMC o extRemes no son competidores: son componentes que la arquitectura utiliza.

**Transición:** La metodología de la tesis ordena esas responsabilidades antes de implementarlas.

### 15. Mapa metodológico de la tesis

**Bloque:** Estado del arte · **Tiempo orientativo:** 0 min 54 s

**Diálogo**

Antes de la arquitectura técnica, este es el mapa metodológico: cinco responsabilidades y los submódulos de pyhydra que las materializan. Los datos: lluvia, caudal, cambio climático y suelos. Los extremos y el clima: series, análisis regional y corrección de sesgo. Los escenarios: generación estocástica y downscaling híbrido. La respuesta física: HEC-HMS, SWAT+, SFINCS y HEC-RAS. Y el impacto: reconstrucción de escenarios no simulados, sensibilidad y período de retorno sobre el calado. Son catorce submódulos en tres bloques, y cada caso activa solo la combinación que necesita.

**Transición:** Con el mapa metodológico claro, veamos cómo se organiza técnicamente la solución.

### 16. La arquitectura del sistema de tres niveles

**Bloque:** Arquitectura · **Tiempo orientativo:** 0 min 54 s

**Diálogo**

La arquitectura tiene tres niveles. Abajo, el núcleo científico pyhydra: catorce submódulos en tres bloques —fuentes de datos, clima y estadística, y modelización—, instalable como una librería de Python. En medio, los servicios de ejecución: una API que alimenta las herramientas web y un entorno JupyterLab con los notebooks reproducibles. Arriba, la interfaz web, con documentación, herramientas y casos navegables. Todo se ejecuta dentro del mismo entorno en contenedores, el recuadro discontinuo, para que el cálculo sea idéntico en un portátil o en la nube.

**Transición:** La arquitectura debe poder ejecutarse de manera estable en equipos distintos.

### 17. Infraestructura de despliegue industrial

**Bloque:** Arquitectura · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

Para que un resultado no dependa del ordenador de quien lo calcula, la plataforma se empaqueta en contenedores: el entorno de notebooks, la API y la web, coordinados por un proxy. Una canalización de integración continua construye esas imágenes y las publica en la nube. Lo relevante para la tesis no es la tecnología concreta, sino que la misma configuración se ejecuta igual en un portátil sin conexión o en un servidor, que es lo que permite repetir los cálculos.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Ese despliegue convierte la arquitectura en un producto utilizable.

### 18. Un producto científico y operativo real

**Bloque:** Arquitectura · **Tiempo orientativo:** 0 min 42 s

**Diálogo**

La aportación principal de este trabajo no es solo teórica; se entrega como un ecosistema reproducible completo. Consta de la librería modular de Python "pyhydra" y la plataforma "HYDRA" que permite ejecutar todo el flujo desde el navegador de manera reproducible gracias a la contenedorización Docker.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El producto se apoya en módulos especializados que siguen una misma cadena.

### 19. Catorce módulos organizados en tres bloques

**Bloque:** Arquitectura · **Tiempo orientativo:** 0 min 54 s

**Diálogo**

La librería reúne catorce submódulos en tres bloques: cuatro de fuentes de datos, cinco de clima y estadística y cinco de modelización. Los bloques se conectan desde la observación hasta la respuesta física. El diagrama recoge tanto la función comprensible para el tribunal como la ruta del submódulo. No significa que los catorce módulos intervengan en cada caso: cada aplicación activa la combinación que necesita.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Comencemos la cadena por el elemento que condiciona todo análisis: los datos.

### 20. Fuentes de datos

**Bloque:** Bloque de datos · **Tiempo orientativo:** 0 min 54 s

**Diálogo**

El primer bloque resuelve la entrada de datos. A la izquierda están las cinco familias de fuentes: estaciones, reanálisis como ERA5, satélite, ríos y suelos, y proyecciones climáticas. Cada una tiene su formato, su resolución y su forma de acceso. Los adaptadores de pyhydra las descargan, controlan su calidad y las entregan con una salida común: hora en UTC, coordenadas WGS84 y la fuente, la fecha y la consulta registradas como metadatos. Así, cualquier análisis posterior parte de datos homogéneos y trazables.

**Transición:** Una vez preparados los datos, estimamos la frecuencia de los extremos.

### 21. Extremos y distribuciones GEV

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 1 min 18 s

**Diálogo**

Para estimar los cuantiles de diseño, el módulo de extremos ajusta la distribución GEV con cuatro estimadores. Máxima verosimilitud es rápida y útil con series largas, pero sensible a extremos aislados. Los L-momentos son más estables con registros cortos, de menos de treinta años. La inferencia bayesiana comunica la incertidumbre paramétrica como una banda de credibilidad, a cambio de revisar la convergencia y la sensibilidad a las distribuciones a priori. La aproximación de Fisher ofrece una estimación de incertidumbre más económica para análisis exploratorios. La memoria no elige un estimador universal: comparar métodos, y no elegir uno de forma automática, es lo que permite valorar la fiabilidad del cuantil. Para el análisis regional, un modelo jerárquico comparte información entre estaciones.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Los extremos marginales no bastan cuando varias variables dependen entre sí.

### 22. Dependencia multivariante y cópulas

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

El riesgo real a menudo surge de la combinación de eventos (e.g. lluvia intensa simultánea con nivel alto de marea). El módulo incorpora cópulas gaussianas para describir conjuntamente pico, duración y volumen, y cópulas de Gumbel, Clayton y Frank para eventos compuestos como oleaje y lluvia. Esto permite calcular el período de retorno conjunto AND y OR, y localizar el Evento de Diseño Más Probable (MPDE) como el máximo de la densidad conjunta sobre la isolínea de un período de retorno dado, siguiendo la formulación de Salvadori y De Michele.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Esa dependencia permite generar escenarios conjuntos físicamente plausibles.

### 23. Generación estocástica de escenarios

**Bloque:** Bloque climático-estadístico · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

El módulo estocástico permite crear ensembles de series meteorológicas coherentes en espacio y tiempo. El generador espacial NSRP (proceso de pulsos rectangulares de Neyman-Scott, Rodríguez-Iturbe 1987-88) se calibra para reproducir la media, la varianza, la probabilidad de día seco, la autocorrelación de orden 1 y el coeficiente de variación de la serie observada, con una versión multisitio (STNSRP) para campos espacialmente coherentes. El generador temporal CoSMoS (Papalexiou 2018) ajusta por separado la distribución marginal y la estructura de autocorrelación estacional, y las combina para simular series manteniendo ambas propiedades y la estacionalidad simultáneamente.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Los escenarios solo son útiles si se propagan por modelos de respuesta física.

### 24. Modelos hidrológicos e hidráulicos

**Bloque:** Bloque de modelización · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

El último bloque conecta la cadena con los motores de ingeniería mediante un adaptador común. Los escenarios entran por arriba y el adaptador cumple siempre cuatro pasos: prepara las entradas en el formato de cada motor, lo ejecuta registrando versión y resultado, lee las salidas en estructuras comunes y valida que la simulación es físicamente plausible. A la derecha están los motores conectados: HEC-HMS, SWAT+, SFINCS y HEC-RAS. Añadir o cambiar un motor no obliga a rehacer la estadística ni los escenarios. Iber aparece en rojo porque no permite ejecución por lotes: en los casos iniciales se utilizó de forma manual.

**Transición:** La plataforma ofrece acceso a estas operaciones desde herramientas interactivas.

### 25. Herramientas interactivas en la nube

**Bloque:** Demo en vivo · **Tiempo orientativo:** 0 min 48 s

**Diálogo**

Para que quien no programa pueda aplicar estos métodos, HYDRA ofrece herramientas interactivas: extremos GEV, cópulas, series sintéticas, curvas IDF, análisis regional y corrección de sesgo. Lo importante es lo que hay debajo: cada herramienta llama, a través de la API, al mismo núcleo pyhydra que usan los notebooks y los casos, no a una copia simplificada. En la defensa utilizaré solo una, el ajuste de extremos ligado al caso Valencia; el resto queda como apoyo para las preguntas.

**Transición:** Voy a ilustrar esa operación con un único ejemplo de ajuste de extremos.

### 26. Demostración guiada: GEV MAP e incertidumbre aproximada

**Bloque:** Demo en vivo · **Tiempo orientativo:** 2 min 42 s

**Diálogo**

Voy a mostrar el recorrido que ejecuta la herramienta web. Usaré su serie demo, que es sintética y sirve para explicar la operación; el análisis observado de Turís se presenta después en el caso Valencia. El umbral identifica eventos, pero la GEV se ajusta a los máximos anuales de la serie. La estimación puntual es MAP: el máximo de la distribución posterior. Las bandas se obtienen mediante una aproximación de Fisher; esta interfaz no ejecuta cadenas MCMC ni compara automáticamente MLE y L-momentos. Señalaré la estimación de diseño y sus bandas aproximadas. Si la API no responde, abriré el respaldo local: una figura ya calculada del notebook de Valencia, cuya metodología y procedencia están identificadas.

**[Respaldo: abrir /defensa-respaldo si la API no responde. La figura procede del notebook de Valencia; no presentarla como resultado de la serie demo sintética.]**

**Transición:** Tras esta demostración, volvamos a la evidencia acumulada en los casos.

### 27. Nueve casos, tres dimensiones de validación

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 12 s

**Diálogo**

El capítulo de validación organiza los casos en tres dimensiones. Besaya, Mallorca y Calle 30 comprueban la cadena de inundación estocástica basada en impactos. Valencia contrasta estimadores de extremos ante un evento sin precedente. Tanganica, Andes, IAHR 2022, SIMPCCe y Panamá prueban el tratamiento del clima, la disponibilidad desigual de datos y la transferencia a escalas diferentes. Conviene distinguir además dos tipos de evidencia. Besaya, Calle 30 y Valencia pueden reproducirse hoy con notebooks ejecutables sobre pyhydra, como indica la última columna. Los otros seis se documentan desde su publicación o proyecto; varios son anteriores a la librería y son, precisamente, los trabajos que revelaron qué módulos había que construir. La tabla muestra qué bloques intervienen en cada caso; no es una clasificación de importancia.

**Transición:** Los casos se agrupan por lo que validan; empecemos por el origen conceptual.

### 28. Besaya 2018: aquí nace la frecuencia sobre el impacto

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

Este es el origen conceptual de la tesis. A partir de series de aforo se extraen avenidas independientes y cada una se describe mediante pico, volumen y duración. Una cópula gaussiana conserva la dependencia entre esas variables y permite generar hidrogramas plausibles. En la aplicación de 2018, Iber transforma esos hidrogramas en manchas y calados. Solo entonces se estima el período de retorno sobre la variable de impacto. pyhydra no existía todavía con su arquitectura actual: surge precisamente de la necesidad de repetir y conectar estas etapas de forma consistente.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El caso fundacional abrió también una pregunta sobre la sensibilidad hidráulica.

### 29. Besaya: del caso fundacional a la sensibilidad hidráulica

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 24 s

**Diálogo**

Conviene separar dos etapas del Besaya. El trabajo fundacional de 2018 partió de aforos y utilizó Iber para trasladar la frecuencia desde los hidrogramas hacia los calados. Años después, sobre el mismo dominio, se estudió la incertidumbre estructural mediante 995 simulaciones emparejadas de SFINCS y HEC-RAS 2D, variando la rugosidad de Manning en nueve usos de suelo. Esta segunda etapa reveló una respuesta bimodal en HEC-RAS y un compartimento secundario de unas 7,4 hectáreas asociado a un collado a cota 60,1 metros. La correlación entre motores fue solo moderada: 0,52 en calado y 0,49 en área. El mensaje no es que este sea el origen de la metodología, sino que el dominio fundacional se convirtió también en banco de pruebas para automatización y sensibilidad hidráulica.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Después, la metodología se amplió a una cuenca torrencial con pocos aforos.

### 30. Mallorca: Downscaling híbrido en cuencas torrenciales

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 18 s

**Diálogo**

El 9 de octubre de 2018 cayeron cerca de 220 L/m² en pocas horas en una cuenca sin estaciones de aforo, con la extensión de Copernicus como única referencia de validación. Se aplicó el downscaling híbrido: clasificación de 25 formas de hietograma histórico mediante PCA y k-means, acoplamiento de máximos, duración y tipo de tormenta entre pluviómetros vía cópula gaussiana, y reconstrucción espacial por kriging a 25 m. La hidrología se resolvió en una malla de 25 m y la hidráulica en una malla de 8 m derivada de LiDAR (Iber), contrastada con la extensión observada por Copernicus, que reproduce de forma razonable, y alcanza un calado máximo simulado de 5,85 m en el núcleo urbano.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El siguiente paso fue aplicar la cadena completa a una infraestructura urbana crítica.

### 31. Calle 30, Madrid: Infraestructura crítica urbana

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 12 s

**Diálogo**

Calle 30 es la cadena metodológica más completa de los casos aplicados. A partir de ERA5 y pluviómetros AEMET, pyhydra ajusta extremos de precipitación multiduración y genera miles de eventos sintéticos multisitio mediante cópulas gaussianas. Primero se toma un subconjunto de eventos para ejecutar HEC-HMS y convertir la lluvia en hidrogramas. Después, MaxDiss actúa sobre esos hidrogramas y selecciona el subconjunto hidráulicamente representativo que se simula en HEC-RAS 1D. Para los escenarios no simulados, k-NN reconstruye los calados. El producto final no es un retorno heredado de la lluvia, sino un mapa de período de retorno del calado para cada píxel.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El siguiente caso estudia cómo actualizar los extremos tras un evento sin precedente.

### 32. Valencia: Análisis rápido ante la DANA del 2024

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 30 s

**Diálogo**

La DANA del 29 de octubre de 2024 dejó 710,8 milímetros en 24 horas en la estación de Turís, muy por encima de cualquier valor previo de su serie. Sin incluir el evento, máxima verosimilitud le asigna un período de retorno superior a 11.000 años y los L-momentos, superior a 31.000; el estimador bayesiano lo sitúa en unos 3.069 años. Ninguna de esas cifras debe leerse como la frecuencia real del evento: muestran que, con series cortas, la cola de la distribución está mal informada. Al incorporar el evento, los tres estimadores convergen entre 66 y 91 años, y el cuantil T100 bayesiano pasa de 260 a 952 milímetros. La aportación no es que un método acierte, sino poder recalcular rápidamente, comparar estimadores y comunicar la incertidumbre como una banda de credibilidad en lugar de una cifra única.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Pasamos ahora a niveles de diseño en un lago con registros limitados.

### 33. Lago Tanganica: niveles de diseño con registros limitados

**Bloque:** Casos de estudio · **Tiempo orientativo:** 2 min 00 s

**Diálogo**

El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. El mayor incremento futuro supera 0,9 m en 2041-2060 para T5-T10; a finales de siglo queda por debajo de 0,6 m para T100-T500.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** A continuación, la escala regional exige automatizar calibraciones hidrológicas.

### 34. Andes: calibración hidrológica automatizada a gran escala

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 36 s

**Diálogo**

La aportación decisiva del caso andino fue hacer viable la modelización hidrológica a gran escala. En Bolivia, Colombia, Ecuador y Perú no bastaba con obtener proyecciones climáticas: había que reconstruir campos de precipitación y temperatura, calibrar modelos sobre numerosas cuencas y transformar cada escenario de lluvia en series de caudal. Los vacíos amazónicos se completaron con precipitación satelital e interpolación por kriging universal; después, la calibración automática se organizó con SPOTPY, utilizando algoritmos PSO, DREAM y SCE-UA. Esto evitó el ajuste manual cuenca a cuenca y permitió ejecutar de forma homogénea el modelo distribuido VIC sobre más de 200 subcuencas. Una vez calibrada la cadena lluvia-caudal, se propagaron 21 modelos CMIP5, dos escenarios RCP y tres horizontes temporales. El resultado científico incluye aumentos mensuales superiores al 40 por ciento en Perú y Ecuador, pero la contribución tecnológica que conecta este caso con la tesis es la automatización del ciclo completo de calibración y simulación regional.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** La comparación del Besaya ofrece una prueba directa del efecto sobre el diseño.

### 35. IAHR 2022: evidencia cuantitativa de la hipótesis H3

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 42 s

**Diálogo**

El trabajo presentado en el 39.º Congreso Mundial de la IAHR, en Granada en 2022, aporta la prueba numérica de la hipótesis H3. Con 15 modelos EURO-CORDEX bajo RCP4.5 y RCP8.5 y corrección de sesgo por quantile mapping, se generaron 10.000 años sintéticos de precipitación; 200 casos se seleccionaron mediante MaxDiss para simulación completa en Iber y el resto se reconstruyó por k-NN. El método convencional, basado en curvas IDF con un único pico de lluvia, produce caudales de diseño sistemáticamente menores: los de la cadena estocástica completa son entre un 30 y un 37 por ciento superiores en todos los períodos de retorno, escenarios y horizontes. Por ejemplo, para T100 en 2011-2040 bajo RCP4.5, 278,5 frente a 208,8 metros cúbicos por segundo. Esta diferencia no demuestra por sí sola cuál de los dos valores es el correcto, porque no hay observaciones de esos caudales futuros; demuestra que la elección metodológica es una fuente de incertidumbre de primer orden, mayor que la dispersión entre modelos climáticos.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** La transferencia también importa para la gestión de embalses bajo cambio climático.

### 36. SIMPCCe: caudales mínimos de embalses ante el cambio climático

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 12 s

**Diálogo**

SIMPCCe es una herramienta de ámbito nacional, aplicable a cualquier punto de la red hidrográfica española, desarrollada según la guía metodológica para estimar aportaciones mínimas a embalses bajo cambio climático. En 2023, el Observatorio del Agua de la Fundación Botín concedió a esa guía el Premio al Talento Joven “M.R. Llamas” mediante la candidatura colectiva de Manuel del Jesus Peñil, Salvador Navas Fernández y Dina V. Gómez Rave. SIMPCCe operacionaliza ese marco: descarga SPAIN02, SIMPA-CEDEX y 10 modelos CORDEX-AEMET; entrena una red neuronal sobre las componentes principales de precipitación y temperatura; corrige el sesgo climático y genera simulaciones futuras e informes automáticos de sequía y fiabilidad.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** El caso de Panamá lleva la automatización a una escala territorial nacional.

### 37. Atlas de Panamá: automatización a escala nacional

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 24 s

**Diálogo**

Encargado por el Ministerio de Ambiente de Panamá y el BID, este es el caso de mayor escala del catálogo: 52 cuencas de hasta 13.400 km² en ambas vertientes, más 1.464 puntos costeros analizados frente a inundación costera y viento extremo sobre el área metropolitana. NEOPRENE/STNSRP rellenó 73 estaciones nacionales (1950-2022), y el kriging universal generó una malla de 1 km. El informe de downscaling documenta 23 configuraciones GCM, dos escenarios SSP, tres variables —precipitación y temperaturas mínima y máxima— y tres horizontes. Su producto da 414 combinaciones de análisis, sobre las que se organiza la corrección de sesgo mediante QDM y SDM, alimentando el modelo hidrológico LEM (NS=0,87) y ejecuciones masivas de SFINCS nacional, con modelos 2D de alta resolución en el área metropolitana.

**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**

**Transición:** Reunamos ahora las cifras que sostienen la contribución de los casos.

### 38. Resultados que sostienen la contribución

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

Antes de cerrar el bloque reúno cuatro resultados, cada uno con su figura. En IAHR 2022, los caudales de diseño de la cadena estocástica son entre un 30 y un 37 por ciento superiores a los del método convencional. En Valencia, incorporar la DANA eleva un 266 por ciento el cuantil T100 bayesiano de Turís. En el Besaya, 1.990 simulaciones emparejadas separan la sensibilidad a la rugosidad de las diferencias entre motores. Y en Panamá, más de cuatrocientas correcciones climáticas automáticas muestran que la arquitectura opera a escala nacional. Son resultados distintos, pero todos dependen de la misma cadena reproducible.

**Transición:** Las cifras cobran sentido al compararlas con el argumento común de la tesis.

### 39. Qué demuestra el conjunto de casos

**Bloque:** Casos de estudio · **Tiempo orientativo:** 1 min 06 s

**Diálogo**

Este gráfico sitúa los nueve casos según su escala espacial, de una infraestructura a varios países, y según la dimensión que validan. Los puntos rellenos son los casos que hoy se reproducen con notebooks en HYDRA: Calle 30, Besaya y Valencia; los demás se documentan desde su publicación o su proyecto. El argumento común es que la modelación estocástica no es una herramienta aislada, sino el principio que obliga a representar muchos forzamientos, propagarlos por la hidrología y la hidráulica y estimar la frecuencia sobre la variable que decide: caudal, calado, extensión o nivel. pyhydra aporta el núcleo común y HYDRA hace visible, reproducible y transferible la cadena.

**Transición:** Esa evidencia se traduce también en producción científica y software preservado.

### 40. Producción científica asociada a la tesis

**Bloque:** Contribuciones científicas · **Tiempo orientativo:** 1 min 18 s

**Diálogo**

La producción científica debe distinguir resultados publicados, comunicaciones y trabajos actualmente enviados. Hay dos artículos publicados en Ingeniería del Agua: la aplicación de Calle 30, en 2024, y SIMPCCe, en 2025. La investigación también se ha presentado en cinco comunicaciones: SIMPCCe en las séptimas Jornadas de Ingeniería del Agua de 2023 y en Hydroinformatics 2024, HYDRA en InterJIA 2024, y los trabajos de Valencia y del lago Tanganica en las octavas Jornadas de Ingeniería del Agua de 2025. Además, se han enviado dos manuscritos: “Proyección de niveles extremos del lago Tanganica bajo cambio climático en una cuenca poco instrumentada” a Ingeniería del Agua, y el estudio de incertidumbre de rugosidad y estructura de modelo a Environmental Modelling & Software. Finalmente, pyhydra e HYDRA cuentan con versiones publicadas y citables en Zenodo.

**Transición:** Antes de cerrar, delimitaré mi contribución dentro de los trabajos compartidos.

### 41. Mi contribución científica y tecnológica

**Bloque:** Contribuciones científicas · **Tiempo orientativo:** 0 min 48 s

**Diálogo**

Mi contribución se organiza en tres responsabilidades. En los trabajos que lidero, desarrollé la metodología aplicada, la modelización y el análisis de resultados. En las colaboraciones, mi aportación está delimitada: calibración hidrológica, procesamiento climático, análisis de extremos y desarrollo de software. Finalmente, diseñé, desarrollé, documenté y publiqué pyhydra e HYDRA como software de autor único. La tabla completa de autoría queda disponible en los anexos para precisar cualquier trabajo concreto.

**Transición:** Con mi contribución delimitada, revisemos las hipótesis una por una.

### 42. Las hipótesis se cierran con evidencia acumulada

**Bloque:** Validación · **Tiempo orientativo:** 1 min 18 s

**Diálogo**

Las hipótesis se cierran con evidencia acumulada, y el esquema muestra cuál y con qué alcance. Para la primera, la automatización: campañas como las 1.990 simulaciones del Besaya, los 10.000 años sintéticos de IAHR 2022 o los miles de eventos de Calle 30, encadenados sin intervención manual. Es una prueba de viabilidad; la medida del ahorro de tiempo queda pendiente. Para la segunda, la modularidad: la matriz muestra los mismos bloques en los nueve casos. Para la tercera, la incertidumbre: en el ejemplo, la cadena estocástica da un caudal un 33 por ciento superior al del método IDF, y en Valencia el cuantil T100 pasa de 260 a 952 milímetros al incorporar la DANA. El resultado no es eliminar la incertidumbre, sino representarla, propagarla y auditarla de forma más consistente.

**Transición:** El cierre de las hipótesis permite responder con precisión qué es original.

### 43. La contribución original: hacer operativa la ciencia existente

**Bloque:** Conclusiones · **Tiempo orientativo:** 1 min 12 s

**Diálogo**

La memoria separa sus aportaciones en tres niveles, precisamente para responder a la pregunta de qué hay de nuevo. En la base, las metodologías incorporadas, que reconozco como conocimiento previo: extremos, L-momentos, inferencia bayesiana, cópulas, generadores, corrección de sesgo, MaxDiss y k-NN, y los motores externos. En medio, los desarrollos de la tesis: los catorce submódulos, los adaptadores para cuatro motores y los flujos reproducibles. Y arriba, la contribución original: la integración extremo a extremo, la reproducibilidad sistemática y la transferencia a proyectos reales. La mención industrial reside en que esos resultados pueden reproducirse por terceros con los mismos datos y la misma infraestructura, con la salvedad, que la propia memoria reconoce, de los motores sujetos a licencia.

**Transición:** Toda contribución debe presentarse junto con sus límites y el trabajo pendiente.

### 44. Qué resuelve HYDRA y qué permanece abierto

**Bloque:** Conclusiones · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

Las limitaciones se entienden mejor colocadas sobre la cadena. En los datos, series cortas y fuentes de calidad desigual. En los extremos, una cola de la distribución poco informada. En los escenarios, generadores que suponen estacionariedad. En los modelos, licencias, versiones y el coste de los grandes ensembles. Y en el impacto, la limitación principal: falta un contraste sistemático con observaciones. Debajo de cada una está el desarrollo que la aborda: control de calidad, bandas de credibilidad explícitas, generación condicionada al clima, emuladores y ejecución distribuida, y métricas de acierto junto con una medida real del ahorro de tiempo.

**Transición:** Después de exponer los límites, quiero agradecer a quienes hicieron posible este recorrido.

### 45. Una tesis se firma con un nombre, pero se construye con muchos

**Bloque:** Agradecimientos · **Tiempo orientativo:** 1 min 00 s

**Diálogo**

Antes de cerrar, quiero dedicar unas palabras de agradecimiento. A mi familia, por acompañarme desde el comienzo y sostenerme también en los momentos en que el camino parecía no avanzar. A mi director, Manuel del Jesus Peñil, por enseñarme a investigar con rigor, honestidad y vocación de utilidad. A mi tutor, César Álvarez Díaz, por su disponibilidad y generosidad constantes. A IHCantabria, por los medios, los proyectos y el entorno humano y técnico en el que me he formado como investigador e ingeniero. Y a Álvaro Galán, por ayudarme a mantener la motivación y por contribuir a mejorar este trabajo. A todos, gracias.

**Transición:** Termino reuniendo en una frase el resultado y el reto que queda abierto.

### 46. Muchas gracias por su atención

**Bloque:** Cierre · **Tiempo orientativo:** 0 min 48 s

**Diálogo**

La tesis demuestra que es posible convertir una década de metodologías probabilísticas en una cadena completa, reproducible y transferible, desde la adquisición de los datos hasta los mapas de período de retorno del impacto. El reto que queda abierto es que HYDRA deje de ser la herramienta de su equipo de desarrollo y se convierta en la herramienta de su comunidad. Muchas gracias por su atención. Quedo a disposición del tribunal para las preguntas que deseen formular.

**[Pauta final: haz una pausa y cede la palabra al tribunal.]**

## Guion de los anexos

Material disponible en **/defensa-anexos**, fuera del tiempo principal. Abrir solo el anexo que responda a la pregunta del tribunal.

### Anexo 1. Evolución de la investigación (2017–2026)

**Tiempo orientativo:** 1 min 00 s

La cronología no es una lista de lugares ni de proyectos. Comienza en 2017 con una pregunta nacida en el Trabajo Fin de Máster: cómo calcular la frecuencia sobre el impacto hidráulico y no heredarla directamente del forzamiento. El artículo de 2018 consolida ese principio. Después, la investigación incorpora progresivamente problemas que aquella primera cadena no resolvía: cuencas sin aforo, precipitación espacial, calibración automática de modelos regionales, infraestructuras urbanas críticas, gestión de embalses, eventos sin precedente e incertidumbre entre motores hidráulicos. Esa acumulación de necesidades conduce finalmente a una arquitectura común, documentada y publicable como software reproducible.

### Anexo 2. Demostración: generación de series sintéticas

**Tiempo orientativo:** 0 min 30 s

Demostración del generador CoSMoS. A partir de una serie temporal corta, CoSMoS calibra la autocorrelación mensual y la asimetría para generar 100 series sintéticas plausibles. Cada serie conserva los estadísticos del registro real pero introduce variabilidad climática natural.

### Anexo 3. Demostración: sensibilidad de la rugosidad

**Tiempo orientativo:** 0 min 24 s

Esta herramienta reproduce en vivo el experimento numérico del caso Besaya: variar los coeficientes de Manning por clase de uso de suelo y observar cómo se propaga esa incertidumbre a calado y área inundada.

### Anexo 4. Demostración: curvas IDF

**Tiempo orientativo:** 0 min 24 s

Esta herramienta construye curvas Intensidad-Duración-Frecuencia con el método clásico de único pico de lluvia, el mismo enfoque que el estudio IAHR 2022 comparó contra la cadena estocástica completa.

### Anexo 5. Demostración: análisis de frecuencia regional

**Tiempo orientativo:** 0 min 30 s

El Análisis Regional de Frecuencia agrupa estaciones para estabilizar la estimación de cuantiles extremos. Es la misma técnica que, con 224 estaciones, situaba el periodo de retorno del evento de Turís en 7,5 millones de años antes de incorporar la DANA de 2024.

### Anexo 6. Demostración: interpolación espacial

**Tiempo orientativo:** 0 min 24 s

Esta herramienta interpola variables climáticas a malla regular por kriging universal, el mismo procedimiento que rellenó los vacíos instrumentales amazónicos en el caso andino y reconstruyó los campos de precipitación en Mallorca.

### Anexo 7. Demostración: corrección de sesgo climático

**Tiempo orientativo:** 0 min 36 s

Esta herramienta corrige el sesgo sistemático de un modelo climático frente a la observación mediante Quantile Delta Mapping y Scaled Distribution Mapping. Es el mismo módulo, sin ninguna modificación, que se reutilizó en las 414 combinaciones de análisis del Atlas de Panamá, en SIMPCCe y en el caso andino.

### Anexo 8. Demostración: eventos compuestos

**Tiempo orientativo:** 0 min 30 s

Cerramos el bloque de demos con la herramienta de eventos compuestos: selección de familia de cópula, cálculo de los períodos de retorno conjuntos AND/OR y localización del MPDE sobre la isolínea de diseño, tal y como se explicó en el módulo de cópulas.

### Anexo 9. Calle 30 en HYDRA: hallazgos clave en la web

**Tiempo orientativo:** 0 min 54 s

La ficha web permite auditar la cadena completa de Calle 30. Lo esencial es distinguir los dos modelos: HEC-HMS transforma la precipitación multisitio en caudales y HEC-RAS 1D calcula los calados a lo largo de la red canalizada y de túneles. MaxDiss selecciona los escenarios que se simulan explícitamente y k-NN reconstruye el resto. Así se obtiene la frecuencia sobre el calado hidráulico, que es la variable de impacto relevante para el diseño.

### Anexo 10. Valencia en HYDRA: los números reales del caso

**Tiempo orientativo:** 0 min 36 s

La cabecera de esta ficha resume en cifras lo que acabamos de ver: los mismos números —710,8 mm, el salto del cuantil T100— están publicados aquí, trazables hasta el notebook que los calculó.

### Anexo 11. Del Trabajo Fin de Máster a la pregunta doctoral

**Tiempo orientativo:** 1 min 00 s

El Trabajo Fin de Máster demostró que la frecuencia del impacto debía calcularse después de la simulación hidráulica. Al mismo tiempo dejó visible una limitación práctica: la cadena funcionaba, pero dependía de muchos traspasos manuales y de una configuración específica para una única cuenca. La tesis nace al convertir esa limitación en una pregunta general. ¿Cómo conservar el rigor del método, repetirlo de forma auditable y transferirlo a problemas con otros datos, otras escalas y otros modelos físicos?

### Anexo 12. Qué necesita una modelación estocástica de inundaciones

**Tiempo orientativo:** 1 min 00 s

Este esquema recorre la cadena estocástica completa. Partimos de una serie observada, normalmente corta y con pocos extremos. A partir de ella se generan miles de escenarios que conservan el clima y la dependencia entre variables. Cada escenario pasa por los modelos físicos, que convierten lluvia en caudal y caudal en calado. El resultado es un mapa de calado por escenario y, al reunirlos, una curva de frecuencia sobre el impacto con su banda de incertidumbre. Por eso la tesis abarca más que la generación estocástica: datos, clima, extremos y modelos son eslabones necesarios de la misma pregunta.

### Anexo 13. Anexo: autoría completa de la línea de investigación

**Tiempo orientativo:** 1 min 18 s

Como parte de la evidencia procede de trabajos compartidos, la memoria delimita expresamente mi contribución, y esta tabla la resume. Soy primer autor en siete trabajos de la línea: la formulación inicial de 2017, Besaya, Mallorca, Calle 30, SIMPCCe, Tanganica y el manuscrito de rugosidad del Besaya. En los trabajos andinos contribuí a la calibración automática y al procesamiento climático; en NEOPRENE, al desarrollo, validación y documentación del software; en el trabajo de downscaling de EGU, a la generación estocástica y la reconstrucción; y en Valencia, a los módulos de extremos y análisis regional y a la ejecución de los cálculos. El trabajo de cópulas vine del grupo se cita como extensión, sin autoría mía. Finalmente, pyhydra e HYDRA son software de autor único, diseñado, desarrollado y documentado como parte de la tesis.

### Anexo 14. Anexo: bifurcación hidráulica del Besaya

**Tiempo orientativo:** 0 min 30 s

El collado a cota 60,1 metros controla la activación del compartimento secundario de 7,4 hectáreas. Esta figura permite explicar el mecanismo topográfico que origina la respuesta bimodal.

### Anexo 15. Anexo: proyecciones de niveles del lago Tanganica

**Tiempo orientativo:** 2 min 00 s

El problema de Tanganica no es simular una inundación 2D, sino obtener cotas extremas de diseño para el puerto de Kalundu con una serie de altimetría satelital corta, de 1992 a 2023. La cadena tiene cinco pasos y conviene no mezclarlos. Primero, las variables climáticas de ERA5 se reducen mediante componentes principales y AdaBoost estima los caudales mensuales de entrada al lago. Segundo, esos caudales se convierten en niveles mediante una relación empírica N(Q): K-means separa tres regímenes de caudal y se ajustan funciones distintas para representar su respuesta no lineal. Tercero, 19 modelos CMIP6, bajo SSP2-4.5 y SSP5-8.5, incorporan la señal climática mediante el método delta mensual. Cuarto, el bootstrap remuestrea los residuos de la relación caudal-nivel, no los de AdaBoost, y genera aproximadamente 20.000 años simulados. Finalmente, los máximos anuales sintéticos proporcionan cambios de nivel por percentiles empíricos, que se suman a los niveles históricos ajustados con GEV. Para T100, GEV y Weibull sitúan el nivel histórico entre 771,55 y 771,76 m, mientras el bootstrap produce 770,19 m. El mayor incremento futuro supera 0,9 m en 2041-2060 para T5-T10; a finales de siglo queda por debajo de 0,6 m para T100-T500.

### Anexo 16. Anexo: forzamientos climáticos de Tanganica

**Tiempo orientativo:** 0 min 30 s

Estas proyecciones alimentan la estimación de niveles futuros. Se presentan como forzamientos del modelo, no como observaciones futuras.

### Anexo 17. Anexo: red de túneles de Calle 30

**Tiempo orientativo:** 0 min 36 s

Este mapa sitúa el dominio del caso Calle 30. La cadena mostrada en la presentación conecta lluvia multisitio, HEC-HMS y HEC-RAS 1D; el mapa delimita la infraestructura a la que se asigna la frecuencia del calado.

### Anexo 18. Anexo: curvas completas de Valencia

**Tiempo orientativo:** 0 min 42 s

Aquí están las curvas completas que sustentan la síntesis del caso Valencia. Los dos paneles superiores corresponden a Turís, antes y después de la DANA; los inferiores corresponden a Carlet. La comparación muestra tanto el desplazamiento de los niveles de retorno como el cambio en la incertidumbre entre estimadores.

### Anexo 19. Anexo: entrenamiento de SIMPCCe

**Tiempo orientativo:** 0 min 36 s

Esta interfaz documenta el entrenamiento y la validación de la red neuronal de SIMPCCe. La presentación principal muestra los resultados de aportaciones y caudales mínimos; aquí puedo explicar cómo se configura y valida el modelo que los produce.
## Hoja de ensayo

### Comprobación del libreto · 5 de octubre de 2026

El recorrido contiene **5.002 palabras de diálogo y 542 de transiciones**. A 115 palabras por minuto, el habla ocupa unos **48,2 minutos**; la previsión de **55 minutos** deja el resto para figuras, pausas y la demostración. A 100 palabras por minuto, el habla por sí sola ocupa **55,4 minutos**, por lo que el total superaría una hora al añadir esas acciones.

Se ha comprobado la correspondencia del diálogo con las 46 diapositivas y los 19 anexos. Esta revisión del texto y los tiempos no sustituye un ensayo oral cronometrado del doctorando.

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
