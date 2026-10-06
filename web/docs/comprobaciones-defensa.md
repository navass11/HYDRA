# Comprobaciones de la defensa

Revisión realizada el 5 de octubre de 2026 y cierre el 6 de octubre de 2026.

## Resultado

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
