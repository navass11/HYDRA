# Comprobaciones de la defensa

Revisión realizada el 5 de octubre de 2026 y cierre el 6 de octubre de 2026.

## Actualización del 6 de octubre: figuras de los anexos

Los siete anexos de herramientas incluyen ahora nueve capturas locales de ejecuciones reales. Los seis anexos de resultados conservan sus figuras; en total, los 13 anexos cargan 15 imágenes.

| Anexo | Apoyo visual y procedencia |
| --- | --- |
| Generación estocástica | Diagnóstico mensual y ensemble: serie demo sintética 1990–2019, 30 realizaciones de 2025, semilla 42. Calibración CoSMoS y simulación rápida AR(1) estacional. |
| Sensibilidad de Manning | Tres diagramas de dispersión del CSV demo de 1000 simulaciones HEC-RAS; análisis de resultados ya calculados. |
| IDF | Curvas de la demo sintética de 40 años y 7 duraciones, con ajuste GEV MAP. |
| Frecuencia regional | Curva normalizada, homogeneidad y parámetros: 5 estaciones sintéticas, L-momentos, H = 0,386. |
| Interpolación | Mapa de kriging ordinario y comparación RMSE LOOCV de IDW, kriging y RBF sobre 8 estaciones demo. |
| Corrección de sesgo | CDF y medias mensuales: demo sintética de precipitación, opción QDM multiplicativa. |
| Eventos compuestos | Diagrama conjunto completo: 120 pares sintéticos, cópula Gumbel, isolíneas AND/OR y puntos MPDE. |

Las capturas muestran los gráficos completos con ejes y leyendas. Los diálogos y las notas privadas del guion se han actualizado para distinguir demos, CSV de resultados y casos de la tesis.

Durante la obtención de las capturas se corrigió la conexión de interpolación a la API local, la compatibilidad del generador con la función de cuantiles de la versión local de CoSMoS y las etiquetas completas de períodos de retorno en RFA. Las siete herramientas devolvieron resultados tras ejecutar sus demos.

Verificación mediante MCP en el navegador integrado: los 13 anexos, sus botones de cambio de figura y las 15 imágenes funcionan con recursos externos bloqueados. Sin errores de consola ni desbordamientos; 26 comprobaciones adicionales en 1024 × 768 y 390 × 844, con el lienzo dentro de la pantalla. Evidencia: `outputs/defensa-qa-2026-10-06/anexos-con-figuras.png` y registro JSON en el mismo directorio.

El recorrido principal continúa con 52 diapositivas y una estimación de 61 minutos.

## Actualización del 6 de octubre: contenido principal y capturas

A petición del usuario se incorporan los antiguos anexos 1, 9, 10, 11, 12 y 13 al recorrido principal. El total actual es **52 diapositivas principales y 13 anexos**, con una estimación de **61 minutos**. El guion se ha sincronizado y contiene una variante oral para explicar la demo offline.

Se añade el botón «Anexos» a la barra superior del modo offline y «Presentación» para volver. Las capturas locales cubren la portada de HYDRA, los hallazgos de Calle 30, las cifras de Valencia y dos pasos de la herramienta estadística: entrada y resultado. Este último se obtuvo ejecutando realmente la API local el 6 de octubre: 45 máximos anuales y 124 eventos de la serie sintética. El esquema científico del Besaya sigue disponible en su diapositiva.

Los resultados de la revisión anterior que aparecen a continuación corresponden a la versión de 46 diapositivas y 19 anexos.

### Comprobación de la actualización

- Compilación correcta de las 37 páginas.
- Navegador integrado mediante MCP: 52 diapositivas principales en el tamaño habitual y en 1024 × 768 y 390 × 844; 156 comprobaciones sin desbordamientos. Lienzo dentro del área disponible en las dos dimensiones adicionales.
- Revisados los 13 anexos sin desbordamientos ni imágenes rotas detectadas.
- El botón «Anexos» abre el material de apoyo y «Presentación» recupera la posición del recorrido principal.
- El selector «2. Resultado e incertidumbre» cambia a la captura real de la demo. Verificado también en Google Chrome mediante MCP, junto con la apertura de los anexos y su contador 1/13.
- Autoría completa ampliada a 24 px en el lienzo; tabla completa sin desbordamientos.
- Evidencias de esta actualización: `outputs/defensa-qa-2026-10-06/demo-offline.png` y `outputs/defensa-qa-2026-10-06/chrome-demo-offline.png`.

## Resultado de la revisión anterior

La presentación contiene 46 diapositivas principales y 19 anexos. El guion incluye el texto oral y las transiciones. La duración prevista es de 55 minutos: es una estimación, pendiente de ensayo oral cronometrado.

| Comprobación | Resultado y alcance |
| --- | --- |
| Revisión visual en Google Chrome mediante MCP | Revisadas las 46 diapositivas principales. Corregidos recortes, etiquetas y figuras demasiado pequeñas. |
| Ajuste automático | Revisadas las 46 diapositivas en 1280 × 720, 1024 × 768 y 390 × 844: 138 comprobaciones sin desbordamientos. El lienzo conserva sus proporciones y se escala al espacio disponible. En móvil el contenido queda reducido. |
| Imágenes y navegación | Las 46 diapositivas principales y los 19 anexos cargan sus imágenes y permiten navegar sin desbordamientos detectados. |
| Funcionamiento sin recursos externos | Presentación, anexos y respaldo revisados con recursos externos bloqueados y API detenida. Las fuentes del sistema y las imágenes locales permiten mantener la exposición. |
| Modo presentador | Previsualización completa, guion y siguiente diapositiva. Repetición final el 6 de octubre: avanzar del 5 al 6 actualizó público y presentador a 6/46; relojes 2:23 y 2:24, dentro de la actualización de un segundo. |
| Demostración con API real | HTTP 200; serie sintética 1980–2024, 16 437 días, 45 máximos anuales y 124 eventos. Parámetros y niveles de retorno finitos. Cálculo local observado de aproximadamente 0,235 s. |
| Lectura científica de la demo | La estimación puntual se identifica como MAP; las bandas de Fisher son aproximadas y se calculan desde MLE. No se presenta esta demo como MCMC. |
| Errores de entrada | CSV mal formado, fechas inválidas, ausencia de valores numéricos, serie insuficiente y tamaño de muestra inválido devuelven errores 400 comprensibles. Tras un error, la demo vuelve a funcionar. |
| API desconectada | Mensaje comprensible y enlace al respaldo local, con figura y texto oral preparados. |
| Gráfico estadístico | Etiquetas de períodos 25 y 50 corregidas y contraste adaptado al tema. |
| Compilación | `astro build` completado con 37 páginas; repetido el 6 de octubre. `git diff --check` sin errores. |

Las comprobaciones de tamaños, bloqueo de recursos y repetición final de sincronización se hicieron con el navegador integrado mediante MCP. La revisión visual completa y la demostración también se comprobaron en Google Chrome mediante MCP el 5 de octubre.

## Panamá: fuente y significado de 414

Fuente proporcionada por el usuario: `Producto_3_Downscaling_Estadístico.pdf`, en el directorio `05_Entregado/Producto_3` del proyecto UNDP de Panamá.

- Página 3: dos escenarios SSP y tres horizontes temporales.
- Página 29: tres variables, precipitación, temperatura mínima y temperatura máxima.
- Página 30: 23 configuraciones de modelos globales, contando las dos rejillas de GFDL-CM4.
- Producto de dimensiones: **23 × 2 × 3 × 3 = 414 combinaciones de análisis**.

La cifra no se describe como un registro de 414 ejecuciones ni de correcciones de sesgo completadas. Se ha actualizado la presentación, sus notas y el guion con esta precisión.

## Tiempo y ensayo pendiente

El texto contiene 5 002 palabras de discurso y 542 de transiciones, 5 544 en total. A 115 palabras por minuto, son aproximadamente 48,2 minutos de voz, con margen hasta los 55 minutos para pausas, figuras y demostración. A 100 palabras por minuto, el texto solo ya requiere unos 55,4 minutos.

Quedan dos comprobaciones humanas: ensayo oral cronometrado completo y prueba en el proyector real, incluyendo legibilidad desde el fondo de la sala.

## Evidencia conservada

La captura de cierre del presentador está en `outputs/defensa-qa-2026-10-06/presentador.png`. Las capturas temporales del 5 de octubre no se conservaron tras el reinicio del entorno; este informe registra su alcance sin ofrecer enlaces a archivos desaparecidos.

## Revisión de desbordamientos — 7 de octubre de 2026

- Medidas de texto SVG frente a sus recuadros en las 24 figuras vectoriales. Corregidas cuatro figuras: cadena convencional (mensaje en dos líneas y flechas ajustadas), cadena estocástica (leyendas), fuentes de datos (estaciones en dos líneas) y objetivos/evidencias (título dividido).
- 156 comprobaciones de la presentación: 52 diapositivas a 1920×1080, 1024×768 y 390×844; sin texto fuera del lienzo ni desbordamiento horizontal en los elementos medidos.
- 39 comprobaciones de anexos: 13 diapositivas en las mismas tres resoluciones, sin incidencias detectadas.
- Las 52 diapositivas también medidas en modo proyección, sin desbordamientos detectados.
- Compilación y regeneración del ZIP correctas. Copia de Descargas actualizada. Las comprobaciones se ejecutaron mediante el navegador MCP sobre la vista previa HTTP; el navegador automatizado no permite abrir `file://`.
- Evidencia: `outputs/azure-deploy-2026-10-07/revision-desbordamientos.json` y `textos-corregidos.png`. Las medidas son geométricas y no analizan texto incrustado en imágenes rasterizadas ni garantizan idénticas métricas en otras fuentes o navegadores.
