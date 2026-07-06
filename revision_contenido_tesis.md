# Informe de revisión — Tesis doctoral industrial

**Título:** Desarrollo de un modelo automático de inundación estocástica
**Doctorando:** Salvador Navas Fernández · **Programa:** IH2O, Universidad de Cantabria
**Alcance de la revisión:** contenido de los capítulos 0–9 y anexos, con criterio de revisor externo de tesis con mención industrial.

---

## 1. Valoración general

La tesis presenta una contribución sólida y bien delimitada: la operacionalización integrada de metodologías probabilísticas de análisis del riesgo de inundación en una arquitectura reproducible (pyhydra/HYDRA). La hipótesis central —que la barrera de adopción es operativa y no científica— está bien formulada, es falsable y se cierra de forma explícita en el capítulo 9 con evidencia cuantitativa. El principio metodológico T_forzante ≠ T_impacto vertebra coherentemente todo el documento, desde la motivación hasta los casos. El carácter industrial está genuinamente acreditado: entregables versionados con DOI, entorno Docker, contratos operativos de uso (cap. 7), adaptadores para motores profesionales y validación sobre proyectos reales con clientes identificables. La honestidad en la delimitación de contribuciones (incorporadas / implementadas / original) es infrecuente y muy valorable ante un tribunal.

**Recomendación: apta para defensa con modificaciones menores.** Los comentarios mayores siguientes deberían abordarse antes del depósito; ninguno compromete la contribución central.

---

## 2. Comentarios mayores

**M1. Delimitación de autoría en resultados compartidos.** Varios resultados de peso proceden de trabajos en coautoría o liderados por otros miembros del grupo: las vine cópulas y el emulador GPR (Urrea et al., 2026), la formulación del downscaling híbrido (del Jesús et al., 2024) y el análisis de Valencia (del Jesús et al., 2025). La memoria los atribuye correctamente, pero el tribunal preguntará qué es exclusivamente del doctorando. Se recomienda añadir una tabla de publicaciones con el rol del doctorando en cada una (tipo CRediT: conceptualización, software, análisis, redacción), idealmente en el capítulo 9 junto a las contribuciones.

**M2. Validación "a nivel de módulo" declarada pero no evidenciada.** El capítulo 8 anuncia dos niveles de validación (módulo y flujo), pero la evidencia mostrada es casi toda de nivel de flujo (coherencia con estudios y publicaciones previas). A la vez, el capítulo 9 relega la "extensión de la suite de tests automáticos" a trabajo futuro. Hay una tensión entre lo que se afirma y lo que se muestra. Opciones: (a) incluir métricas de la suite de tests actual (número de tests, cobertura por bloque, ejemplos de test de regresión frente a valores publicados) o (b) suavizar la afirmación del nivel de módulo.

**M3. Error de la reconstrucción k-NN sin cuantificar.** El downscaling híbrido es la pieza que hace viable la metodología, pero la memoria no presenta métricas de error de los mapas reconstruidos (validación cruzada dejando fuera simulaciones: RMSE de calados, acierto en extensión inundada, sesgo por percentil). El emulador GPR sí tiene error cuantificado (MAE ~1e-3); el k-NN, que se usa en Mallorca, Calle 30 y Panamá, no. Es la pregunta técnica más previsible del tribunal y merece una subsección en el capítulo 5 u 8.

**M4. Falta contraste frente a inundaciones observadas.** Los casos validan frente a estudios previos y coherencia interna, pero no se muestra una comparación cuantitativa mancha simulada vs. mancha observada de un evento real (Sant Llorenç 2018 parece el candidato natural; existe figura comparativa pero conviene acompañarla de métricas: índice de acierto/CSI, error en calados en marcas de avenida). Si no es posible, justificar explícitamente por qué (ausencia de levantamientos post-evento, etc.).

**M5. Posicionamiento frente a marcos integrados existentes.** El estado del arte descarta la existencia de herramientas que integren la cadena completa, pero solo discute HydroMT. Para blindar la afirmación conviene una tabla comparativa de capacidades frente a los competidores más próximos (p. ej. CLIMADA, RainyDay, wflow/Delft-FIAT, marcos de simulación continua tipo SHETRAN/Newcastle, SWMM-based). Aunque la conclusión se mantenga, el ejercicio demuestra vigilancia tecnológica, que en una tesis industrial es exigible.

**M6. Beneficio industrial sin métrica.** Se afirma reducción de coste y plazo pero solo el GPR aporta cifra (94 %). Una tabla breve con indicadores por caso (nº de simulaciones gestionadas, horas-persona estimadas antes/después, tiempo de pared de la campaña de Panamá o del ensemble de 995 realizaciones) reforzaría el argumento central de la tesis con muy poco esfuerzo.

**M7. Gobernanza y licencia del software.** Para las afirmaciones de transferibilidad: ¿bajo qué licencia se distribuyen pyhydra y HYDRA? ¿Qué política de versiones y de soporte asume IHCantabria? ¿Cómo se gestionan credenciales de APIs (CDS, AEMET, Earthdata) en un despliegue de terceros? Un apartado breve en el capítulo 7 cerraría el círculo del producto industrial.

---

## 3. Comentarios por capítulo

- **Cap. 0 (English Summary).** Correcto tras la ampliación; extensión y figuras adecuadas.
- **Cap. 1.** Hipótesis y objetivos bien construidos. Sugerencia: anticipar aquí, con una frase, la definición operativa de "reproducible" que luego concretan los contratos del cap. 7 (entrada trazable, transformación reproducible, salida estándar, registro auditable).
- **Cap. 2.** Sólido en la línea propia; corto en alternativas internacionales (ver M5). La sección de brecha está bien argumentada.
- **Cap. 3.** Arquitectura clara; la correspondencia tarea–módulo–capítulo (tabla 3.3) es un acierto para el tribunal.
- **Cap. 4.** Muy buen nivel operativo (cada fuente con rol, límites y criterio de uso). Dos puntos: justificar el uso de SoilGrids 2017 estático citando SoilGrids 2.0 (la cita actual es de 2021 pero se descarga la versión "former"); y añadir una nota sobre condiciones de uso/licencias de datos (CDS, AEMET OpenData) que afectan a la reproducibilidad por terceros.
- **Cap. 5.** El capítulo más completo. Distinguir aún más nítidamente lo implementado hoy (cópula gaussiana, BivariateCopula) de la línea de extensión (vine/GPR, de Urrea 2026). Añadir la validación del k-NN (M3). El bloque de eventos compuestos (T_OR/T_AND, MPDE) está bien traído.
- **Cap. 6.** El patrón de adaptador está bien defendido y los límites (HEC-RAS sin API estable, Iber sin batch, lector SWAT+ no universal) se declaran con honestidad. Falta una matriz de versiones soportadas/probadas de cada motor (HEC-RAS 5.x/6.x, SWAT+ x.y, SFINCS release) y la restricción de sistema operativo (rascontrol/Jython en Windows) como condición explícita de reproducibilidad.
- **Cap. 7.** Los contratos operativos son la mejor página "industrial" de la memoria. Revisar la coherencia de recuentos de notebooks entre capítulos y con la web (26 generales / 23 casos piloto / 34 en la portada web). Añadir licencia y requisitos (M7).
- **Cap. 8.** La matriz de validación con criterios de aceptación es excelente. Incorporar métricas cuantitativas de validación donde existan (M3, M4) y, en Panamá, alguna cifra de esfuerzo computacional (M6).
- **Cap. 9.** La tabla de limitaciones con impacto/mitigación/fuera-de-alcance es ejemplar. Añadir la tabla de rol de autoría (M1).
- **Anexos.** Coherentes con el planteamiento híbrido memoria/manual.

---

## 4. Cuestiones formales

1. Erratas de acentuación repetidas, probablemente heredadas de la conversión de codificación: "friccion", "aceptacion", "programaticas", "extraidas", "peticion", "asintoticamente", "símulaciones", "no se específica". Conviene una pasada de corrector sobre los .tex.
2. Unificar "IHCantabria" vs "IH Cantabria" (aparecen ambas).
3. La etiqueta `\label{ch:modelización}` contiene acento; funciona, pero es frágil ante cambios de codificación — mejor `ch:modelizacion`.
4. Referencias "enviado": verificar el estado (aceptado/en revisión) en el momento del depósito y actualizar.
5. Revisar los desbordes de línea moderados detectados en los capítulos 5, 8 y 9 al compilar con separación silábica española.

---

## 5. Síntesis

| Criterio | Valoración |
|---|---|
| Originalidad y delimitación de la contribución | Alta, con reserva M1 |
| Rigor metodológico | Alto; refuerzo pendiente en M2–M4 |
| Carácter industrial y transferencia | Muy alto; completar M6–M7 |
| Validación empírica | Amplia en cobertura; mejorable en métricas cuantitativas |
| Calidad formal y estructura | Buena; erratas menores |

**Dictamen del revisor: aprobar con modificaciones menores.** Prioridad sugerida: M3 y M4 (refuerzo técnico), M1 (defensa), M5 (estado del arte), M6–M7 (industrial), erratas.
