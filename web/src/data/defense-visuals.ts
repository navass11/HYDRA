// Shared visual content for projection and study views.
export const quoteFigures: Record<number, string> = { 7: 'esq_hipotesis_central.svg', 8: 'esq_pregunta.svg' };
export const visualSlides: Record<number, { kind: string; metric?: string; figure?: string; figures?: { src: string; caption: string }[]; items: { label: string; detail: string }[] }> = {
  2: { kind:'flow', metric:'El título describe una arquitectura reproducible, no un único algoritmo', items:[
    {label:'Modelo',detail:'una cadena completa de cálculo'}, {label:'Automático',detail:'reduce tareas manuales frágiles'},
    {label:'Inundación',detail:'calcula la frecuencia sobre el impacto'}, {label:'Estocástica',detail:'propaga múltiples escenarios plausibles'} ] },
  4.6: { kind:'layers', figure:'esq_nombre_hydra.svg', metric:'HYDRA: funciones especializadas, un sistema coordinado', items:[
    {label:'Requisitos',detail:'automatizar, modularizar y repetir el análisis'},
    {label:'pyhydra',detail:'librería Python que implementa el núcleo científico'},
    {label:'HYDRA',detail:'plataforma que integra núcleo, web, notebooks y servicios'} ] },
  6: { kind:'problem', figure:'esq_tforzante_timpacto.svg', metric:'T(forzante) ≠ T(impacto)', items:[
    {label:'Evento único',detail:'un pico de lluvia no describe todas las avenidas plausibles'},
    {label:'Estado antecedente',detail:'humedad y confluencias cambian la respuesta de la cuenca'},
    {label:'Impacto hidráulico',detail:'la frecuencia se estima después de simular calados y extensión'} ] },
  11: { kind:'layers', figure:'esq_arquitectura_capas.svg', metric:'Un núcleo científico, tres capas que lo hacen transferible', items:[
    {label:'Métodos científicos',detail:'datos, extremos, escenarios y modelos físicos'},
    {label:'Servicios de ejecución',detail:'API y notebooks sobre el mismo núcleo'},
    {label:'Interfaz web',detail:'acceso, documentación y casos navegables'} ] },
  13: { kind:'sources', figure:'esq_fuentes_datos.svg', metric:'Cualquier fuente llega con el mismo formato y su procedencia registrada', items:[
    {label:'Estaciones',detail:'AEMET, Meteostat y OGIMET'}, {label:'Reanálisis',detail:'ERA5, con cobertura global'},
    {label:'Satélite',detail:'GPM y PERSIANN'}, {label:'Ríos y suelo',detail:'GloFAS, GRDC y SoilGrids'},
    {label:'Proyecciones',detail:'CMIP6 con escenarios SSP'} ] },
  17: { kind:'flow', figure:'esq_adaptadores.svg', metric:'Un contrato común conecta motores distintos sin rehacer el núcleo', items:[
    {label:'Preparar',detail:'adaptar entradas al formato del motor'},
    {label:'Ejecutar',detail:'registrar versión, proceso y resultado'},
    {label:'Homogeneizar',detail:'leer salidas en estructuras comunes'},
    {label:'Validar',detail:'comprobar ejecución y plausibilidad física'} ] },
  18: { kind:'tools', figure:'esq_herramientas.svg', metric:'Las herramientas web llaman al mismo núcleo pyhydra que los notebooks', items:[
    {label:'Extremos',detail:'GEV/GPD bayesiana'}, {label:'Dependencia',detail:'cópulas multivariantes'},
    {label:'Espacio',detail:'kriging e interpolación'}, {label:'Diseño',detail:'curvas IDF'},
    {label:'Modelos',detail:'sensibilidad hidráulica'} ] },
  19: { kind:'flow', figure:'shot_herramienta_gev.jpg', metric:'El método descrito se ejecuta desde la plataforma, con su incertidumbre', items:[
    {label:'Datos',detail:'serie demo sintética o CSV identificado'},
    {label:'Máximos anuales',detail:'la GEV se ajusta a máximos por año'},
    {label:'Ajuste MAP',detail:'máximo de la posterior, sin MCMC'},
    {label:'Resultado',detail:'cuantil y bandas aproximadas mediante Fisher'} ] },
  39.5: { kind:'layers', figure:'esq_casos_escala.svg', metric:'Tres casos se reproducen hoy con notebooks; los nueve aportan resultados contrastables', items:[
    {label:'Principio común',detail:'frecuencia estimada sobre el impacto'},
    {label:'Contextos distintos',detail:'escalas, climas y modelos diferentes'},
    {label:'Transferencia',detail:'módulos auditables sin reconstruir la cadena'} ] },
  46: { kind:'flow', figure:'esq_cadena_estocastica.svg', metric:'Los escenarios aportan valor cuando su impacto puede estimarse', items:[
    {label:'Datos',detail:'observaciones y proyecciones climáticas'},
    {label:'Dependencia',detail:'relaciones espaciales y temporales plausibles'},
    {label:'Modelos físicos',detail:'transformar lluvia en caudal y calado'},
    {label:'Decisión',detail:'estimar frecuencia sobre la variable de impacto'} ] },
  32: { kind:'flow', metric:'En Calle 30 la frecuencia se calcula sobre el calado, con HEC-RAS 1D', items:[
    {label:'Lluvia',detail:'eventos multisitio con cópulas'}, {label:'Caudal',detail:'transformación HEC-HMS'},
    {label:'Selección',detail:'subconjunto representativo MaxDiss'}, {label:'Hidráulica',detail:'HEC-RAS 1D'},
    {label:'Reconstrucción',detail:'miles de impactos con k-NN'} ] },
  40: { kind:'evidence', figure:'esq_hipotesis_evidencia.svg', metric:'Cada hipótesis se contrasta con evidencia y con un límite', items:[
    {label:'H1 Automatización',detail:'campañas de cálculo: capacidad operativa; ahorro por medir'},
    {label:'H2 Modularidad',detail:'los mismos bloques resuelven problemas y escalas diferentes'},
    {label:'H3 Incertidumbre',detail:'sensibilidad del diseño a métodos y datos; bandas en lugar de cifras únicas'} ] },
  47: { kind:'method-map', figure:'esq_responsabilidades.svg', metric:'La procedencia se conserva en cada transformación', items:[
    {label:'Datos',detail:'observar, reunir y controlar fuentes'},
    {label:'Extremos y clima',detail:'caracterizar frecuencia y condiciones'},
    {label:'Escenarios',detail:'generar combinaciones plausibles'},
    {label:'Respuesta física',detail:'simular lluvia, caudal y calado'},
    {label:'Impacto',detail:'estimar frecuencia para decidir'} ] },
  48: { kind:'evidence', figures:[{src:'fig_iahr2022_comparativa_es.svg',caption:'IAHR 2022: caudal estocástico frente a IDF'},{src:'fig_valencia_t100_auditorio.svg',caption:'Valencia: actualización de T100 en Turís'},{src:'besaya_fig04_intermodel_comparison.png',caption:'Besaya: HEC-RAS frente a SFINCS'},{src:'fig_panama_precipitacion.png',caption:'Panamá: precipitación por subcuencas'}], metric:'Cuatro resultados distintos sostenidos por una misma cadena reproducible', items:[
    {label:'+33,4 %',detail:'ejemplo T100: 208,8 → 278,5 m³/s (IAHR 2022)'},
    {label:'+266 %',detail:'actualización de T100 al incorporar la DANA (Valencia)'},
    {label:'1.990',detail:'simulaciones hidráulicas emparejadas (Besaya)'},
    {label:'414',detail:'combinaciones de análisis climático (Panamá)'} ] },
  41: { kind:'layers', figure:'esq_niveles_contribucion.svg', metric:'Lo original es la integración; los métodos de base son conocimiento previo', items:[
    {label:'Base científica',detail:'metodologías preexistentes incorporadas'},
    {label:'Desarrollo',detail:'módulos, adaptadores y pipelines'},
    {label:'Contribución original',detail:'integración, reproducibilidad y transferencia'} ] },
  42: { kind:'roadmap', figure:'esq_limitaciones.svg', metric:'Cada limitación reconocida abre un desarrollo verificable', items:[
    {label:'Series cortas',detail:'incertidumbre explícita en la cola'}, {label:'Motores externos',detail:'adaptadores y versiones registradas'},
    {label:'Estacionariedad',detail:'generación condicionada al clima'}, {label:'Coste',detail:'emuladores + ejecución distribuida'},
    {label:'Datos globales',detail:'control de calidad y trazabilidad'},
    {label:'Validación observacional',detail:'métricas de acierto y ahorro medido'} ] },
  42.5: { kind:'acknowledgements', metric:'A todos, gracias', items:[
    {label:'Mi familia',detail:'el apoyo que sostuvo todo el recorrido'},
    {label:'Manuel del Jesus Peñil',detail:'rigor, confianza y vocación de utilidad'},
    {label:'César Álvarez Díaz',detail:'disponibilidad y generosidad constantes'},
    {label:'IHCantabria',detail:'el entorno humano, científico y técnico de la tesis'},
    {label:'Álvaro Galán',detail:'motivación y ayuda para mejorar el trabajo'} ] },
};
