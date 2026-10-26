# Revisión de negritas de la presentación

Estado: **aplicado en `slides.ts` el 26/10/2026, sin commit ni despliegue**. Tras aplicar, las 48 diapositivas no tienen ninguna expresión sin coincidencia (548 expresiones en total). La numeración es la que ves en el presentador (1–48); entre paréntesis, el `id` de `web/src/data/slides.ts`, donde se editan los `speechCues`.

Cómo funciona: se resalta la primera aparición de cada expresión (sin distinguir mayúsculas, solo palabras completas). Si una expresión no aparece en el texto, no se marca nada. Todas las expresiones propuestas se han probado con el mismo código de la presentación y se marcarían.

## 1. Expresiones que hoy no marcan nada (el texto cambió y no se actualizaron)

| Diap. | Expresión actual sin coincidencia | Qué hacer |
|---|---|---|
| 35 (id 34) | «indicadores superiores», «Justo debajo», «notebook del estudio regional», «comparación de estimadores», «indicadores» | Sustituir (ver sección 2). El guion de Valencia se reescribió y las negritas quedaron del texto antiguo: solo 3 de 8 marcaban. |
| 42 (id 39.6) | «dos manuscritos enviados», «publicación, evaluación, comunicación y software» | Sustituir por «dos manuscritos» y «artículos publicados, manuscritos en evaluación, comunicaciones y software» |
| 16 (id 12.6) | «catorce submódulos» | Quitar o cambiar (ver sección 2) |
| 18 (id 14) | «cuantil» | Quitar o cambiar (ver sección 2) |
| 44 (id 40) | «Arriba, H1», «En el centro, H2», «Abajo, H3» | Inofensivas: las absorbe «H1, automatización», etc. Se pueden quitar. |

## 2. Expresiones que faltan (propuesta por diapositiva)

Solo se listan las diapositivas con algo relevante que añadir. El resto (2, 5, 12, 19–25, 27, 28, 30, 31, 33, 34, 37, 39, 41, 43, 45–48) se ven bien cubiertas.

| Diap. (id) | Añadir |
|---|---|
| 1 (1) | IHCantabria |
| 3 (44) | lluvia de diseño · no constituye una estimación completa de las pérdidas |
| 4 (4.5) | una única lluvia de diseño |
| 6 (3) | premio principal · Revista de Obras Públicas · no coincide necesariamente · pyhydra |
| 7 (5.5) | único evento · mismo período de retorno · cadena física |
| 8 (6) | cien años · El forzamiento es idéntico |
| 9 (8) | cadena completa del análisis probabilístico · transferible a proyectos reales de ingeniería · frecuencia con la que se supera un calado |
| 10 (7) | cadena modular y reproducible · no cuantifica por sí solo el ahorro |
| 11 (8.5) | desarrollar y validar |
| 13 (46) | mapa de calado · años sintéticos |
| 14 (10) | cobertura funcional |
| 15 (11) | contenedores |
| 16 (12.6) | cuatro módulos funcionales · climate · funciones metodológicas |
| 17 (13) | UTC · WGS84 |
| 18 (14) | cola · extrapolación |
| 26 (64) | FloodEventCopula |
| 29 (27) | seis documentados mediante publicaciones o proyectos |
| 32 (30) | Sant Llorenç · sin aforos |
| 35 (34) | hallazgos clave · incorporar el episodio de la DANA · sensibilidad del análisis · qué datos entran en el ajuste · qué método se utiliza · qué incertidumbre acompaña |
| 36 (33) | dato observado · sin DANA y con DANA · T100 |
| 38 (39) | 10.000 años sintéticos · 200 casos |
| 40 (37) | NEOPRENE |
| 42 (39.6) | dos manuscritos · artículos publicados, manuscritos en evaluación, comunicaciones y software · Zenodo |

La diapositiva 5 (id 2) ya está aplicada en `slides.ts` (sin commit).

## 3. Criterios y avisos

- No se han añadido palabras sueltas muy comunes para no diluir el contraste. La diapositiva 31 (id 28) ya tiene 25 expresiones para 367 palabras; no se propone ninguna más.
- Las limitaciones y cautelas (p. ej. «no cuantifica por sí solo el ahorro», «no constituye una estimación completa de las pérdidas») se proponen a propósito: son lo que el tribunal puede preguntar.
- El texto de las diapositivas 35 y 42 cambió en los últimos commits («Focus Valencia presentation visit on key findings») sin actualizar sus negritas; conviene revisar esas dos antes de la defensa.
- Esta revisión cubre el guion principal. El texto de «Apoyo breve» del presentador se resalta con las mismas expresiones, pero no lo he revisado aparte.
