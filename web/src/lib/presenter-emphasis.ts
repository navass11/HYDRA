import type { Slide } from '../data/slides';
import type { NarrationMode } from './defense-narration';

// Editorial cues keyed by stable slide ID, independent of presentation order.
// These are exact excerpts: emphasis never rewrites the canonical spoken script.
const keywords: Record<number, readonly string[]> = {
  1: ['Salvador Navas Fernández', 'modelo automático de inundación estocástica', 'Manuel del Jesus Peñil', 'César Álvarez Díaz'],
  4: ['introducción', 'estado de la técnica', 'arquitectura de HYDRA', 'metodología', 'evidencia de validación', 'conclusiones'],
  44: ['gravedad de los daños', 'profundidad y la velocidad', 'vulnerabilidad', 'estado previo de la cuenca', 'con qué frecuencia', 'con qué incertidumbre'],
  2: ['cadena completa de cálculo', 'encadenarse sin repetir manualmente', 'impacto hidráulico', 'población de escenarios plausibles', 'reproducibilidad operativa', 'desde los datos hasta la variable'],
  3: ['Trabajo Fin de Máster', '2017', 'primera cadena completa', 'premio principal', 'Revista de Obras Públicas', 'no coincide necesariamente'],
  45: ['frecuencia del impacto', 'traspasos manuales', 'única cuenca', 'repetirlo de forma auditable', 'transferirlo'],
  4.5: ['exposición', 'cambio climático', 'impermeabilización urbana', 'interacciones', 'muchos escenarios plausibles', 'incertidumbre asociada a la decisión'],
  5.5: ['evento de diseño', 'cadena física', 'estacionariedad', 'único evento', 'mismo período de retorno', 'incertidumbre hasta el calado'],
  6: ['misma lluvia', 'suelo está seco', 'suelo está saturado', 'el río desborda', 'El forzamiento es idéntico; el impacto, no.', 'no puede asignarse directamente al impacto'],
  7: ['su integración', 'métodos que ya existen', 'reconstruir a mano', 'cadena modular y reproducible', 'tres hipótesis operativas', 'evidencia concreta'],
  8: ['automatizar de forma reproducible', 'cadena completa', 'marco transferible', 'versiones y las semillas aleatorias', 'frecuencia con la que se supera', 'reflejarse en los resultados finales'],
  8.5: ['desarrollar y validar', 'Integrar fuentes de datos', 'núcleo reutilizable', 'sin imponer un único motor', 'transferencia mediante casos reales'],
  4.6: ['Integración', 'Reproducibilidad', 'Transferencia', 'cuáles pueden reproducirse hoy'],
  8.6: ['representar explícitamente la incertidumbre', 'frecuencia sobre la respuesta', 'automatizar la cadena completa', 'separar sus componentes', 'validar la propuesta', 'repetir y auditar'],
  46: ['serie observada', 'miles de escenarios', 'modelos físicos', 'mapa de calado por escenario', 'curva de frecuencia sobre el impacto', 'banda de incertidumbre'],
  9: ['2017', 'artículo de 2018', 'cuencas sin aforo', 'calibración automática', 'incertidumbre entre motores hidráulicos', 'arquitectura común'],
  10: ['falta de integración operativa', 'CLIMADA', 'RainyDay', 'wflow y HydroMT', 'Falter', 'ocho capacidades', 'componentes que la arquitectura utiliza'],
  47: ['Los datos', 'Los extremos y el clima', 'Los escenarios', 'La respuesta física', 'el impacto', 'cuatro módulos funcionales'],
  11: ['tres niveles', 'núcleo científico pyhydra', 'servicios de ejecución', 'interfaz web', 'entorno en contenedores', 'mismos datos y la misma configuración'],
  12: ['contenedores', 'integración continua', 'repetir los cálculos', 'sin conexión', 'datos, los programas', 'licencias del modelo'],
  5: ['ecosistema reproducible completo', 'pyhydra', 'HYDRA', 'contenedores Docker'],
  12.6: ['catorce submódulos', 'cuatro de fuentes de datos', 'cinco de clima y estadística', 'cinco de modelización', 'la combinación que necesita'],
  13: ['cinco familias de fuentes', 'revisión de calidad', 'normalización', 'UTC', 'WGS84', 'homogéneos y trazables'],
  14: ['cuatro estimadores', 'Máxima verosimilitud', 'L-momentos', 'inferencia bayesiana', 'aproximación de Fisher', 'comparar métodos', 'modelo jerárquico'],
  15: ['combinación de eventos', 'pico, duración y volumen', 'Gumbel, Clayton y Frank', 'período de retorno conjunto AND y OR', 'MPDE', 'máximo de la densidad conjunta'],
  16: ['coherentes en espacio y tiempo', 'NSRP', 'STNSRP', 'CoSMoS', 'distribución marginal', 'autocorrelación estacional'],
  17: ['adaptador común', 'prepara las entradas', 'registrando versión y resultado', 'lee las salidas', 'físicamente plausible', 'Iber', 'de forma manual'],
  18: ['herramientas interactivas', 'API', 'mismo núcleo pyhydra', 'solo una', 'ajuste de extremos'],
  19: ['serie demo, que es sintética', 'máximos anuales', 'MAP', 'aproximación de Fisher', 'no ejecuta cadenas MCMC', 'respaldo local'],
  27: ['tres dimensiones', 'inundación estocástica basada en impactos', 'evento sin precedente', 'escalas diferentes', 'reproducirse hoy con notebooks', 'Los otros seis'],
  29: ['origen conceptual', 'pico, volumen y duración', 'cópula gaussiana', 'Iber', 'período de retorno sobre la variable de impacto', 'pyhydra no existía todavía'],
  28: ['dos etapas', 'fundacional de 2018', '995 simulaciones emparejadas', 'rugosidad de Manning', 'respuesta bimodal', '7,4 hectáreas', '60,1 metros', '0,52 en calado y 0,49 en área'],
  30: ['cuenca sin estaciones de aforo', 'Copernicus', 'downscaling híbrido', '25 formas de hietograma', 'malla de 8 m', '5,85 m', 'no una medición de campo'],
  31: ['precipitación multiduración', 'eventos sintéticos multisitio', 'HEC-HMS', 'MaxDiss', 'HEC-RAS 1D', 'k-NN', 'período de retorno del calado'],
  32: ['análisis interactivo', 'Puente de Toledo', 'cursor', 'leyenda', 'perfil longitudinal', 'cien y quinientos años', 'MaxDiss', 'frecuencia del impacto'],
  33: ['710,8 milímetros', '11.000 años', '31.000', '3.069 años', 'Ninguna de esas cifras', '66 y 91 años', '260 a 952 milímetros', 'banda de credibilidad'],
  34: ['710,8 mm', 'salto del cuantil T100', 'trazables hasta el notebook'],
  35: ['cotas extremas de diseño', 'AdaBoost', 'relación empírica N(Q)', '19 modelos CMIP6', 'método delta mensual', 'residuos de la relación caudal-nivel', '20.000 años simulados', 'percentiles empíricos', 'supera 0,9 m'],
  36: ['gran escala', 'kriging universal', 'calibración automática', 'SPOTPY', 'más de 200 subcuencas', '21 modelos CMIP5', '40 por ciento', 'ciclo completo de calibración y simulación'],
  39: ['hipótesis H3', '10.000 años sintéticos', '200 casos', '30 y un 37 por ciento superiores', '278,5 frente a 208,8', 'no demuestra por sí sola', 'elección metodológica'],
  38: ['ámbito nacional', 'aportaciones mínimas a embalses', 'Premio al Talento Joven', '10 modelos CORDEX-AEMET', 'red neuronal', 'sequía y fiabilidad'],
  37: ['52 cuencas', '1.464 puntos costeros', '73 estaciones', '23 configuraciones GCM', '414 combinaciones', 'QDM y SDM', 'NS=0,87', 'SFINCS nacional'],
  48: ['208,8 frente a 278,5', '33,4 por ciento', '260 a 952 mm', '995 pares', '414 combinaciones', 'variable, método, horizonte y alcance'],
  39.5: ['diez estudios', 'Besaya, rugosidades, Calle 30 y Valencia', 'publicación o su proyecto', 'frecuencia sobre la variable', 'núcleo común', 'visible, reproducible y transferible'],
  39.6: ['dos artículos publicados', 'cinco comunicaciones', 'dos manuscritos', 'versiones publicadas y citables en Zenodo'],
  39.7: ['trabajos que lidero', 'colaboraciones', 'diseño, desarrollo y documentación', 'autoría por publicación'],
  55: ['primer autor en siete trabajos', 'trabajos andinos', 'NEOPRENE', 'downscaling de EGU', 'Valencia', 'sin autoría mía', 'diseño, desarrollo y documentación'],
  40: ['automatización', 'prueba de viabilidad', 'ahorro de tiempo queda pendiente', 'modularidad', 'incertidumbre', '260 a 952 milímetros', 'representarla, propagarla y auditarla'],
  41: ['conocimiento previo', 'desarrollos de la tesis', 'contribución original', 'integración extremo a extremo', 'reproducibilidad sistemática', 'transferencia a proyectos reales'],
  42: ['series cortas', 'estacionariedad', 'coste de los grandes ensembles', 'falta un contraste sistemático con observaciones', 'generación condicionada al clima', 'medida real del ahorro de tiempo'],
  42.5: ['mi familia', 'Manuel del Jesus Peñil', 'César Álvarez Díaz', 'IHCantabria', 'Álvaro Galán', 'A todos, gracias'],
  43: ['cadena completa, reproducible y transferible', 'período de retorno del impacto', 'herramienta de su comunidad', 'Muchas gracias', 'preguntas'],
  20: ['serie demo sintética', 'media', 'desviación estándar', 'autocorrelación', '30 realizaciones', 'semilla 42', 'escenarios plausibles', 'diagnósticos'],
  21: ['CSV demo', 'mil simulaciones HEC-RAS', '0,0069', '0,0014', 'no significa que la rugosidad carezca de efecto', 'salidas ya calculadas', 'distribución del impacto'],
  22: ['demo sintética', 'cuarenta años', 'siete duraciones', 'GEV mediante MAP', 'intensidad disminuye', 'frecuencia del impacto'],
  23: ['cinco estaciones sintéticas', 'caudal índice', 'L-momentos', 'factor de crecimiento', 'H vale 0,386', 'selección de la región'],
  24: ['ocho estaciones', 'IDW', 'kriging ordinario', 'función de base radial', 'validación cruzada', 'RMSE', 'no incluye aquí la covariable de elevación'],
  25: ['precipitación diaria sintética', 'Quantile Delta Mapping', 'distribuciones acumuladas', 'medias mensuales', 'sin borrar la señal de cambio', 'no corresponden a datos de Panamá'],
  26: ['Gumbel', 'demo sintética', 'OR', 'AND', 'MPDE', 'no se reduce a sumar dos extremos univariantes'],
  56: ['60,1 metros', '7,4 hectáreas', 'mecanismo topográfico', 'respuesta bimodal'],
  57: ['cotas extremas de diseño', 'AdaBoost', 'relación empírica N(Q)', '19 modelos CMIP6', 'método delta mensual', 'residuos de la relación caudal-nivel', '20.000 años simulados', 'percentiles empíricos', 'supera 0,9 m'],
  58: ['forzamientos del modelo', 'no como observaciones futuras'],
  59: ['dominio del caso Calle 30', 'lluvia multisitio', 'HEC-HMS', 'HEC-RAS 1D', 'frecuencia del calado'],
  60: ['Turís', 'Carlet', 'niveles de retorno', 'incertidumbre entre estimadores'],
  62: ['mapas de la derecha', 'matrices', 'estadísticas mensuales', 'porcentajes', 'factores de cambio', '2071–2100'],
  61: ['entrenamiento y la validación', 'red neuronal de SIMPCCe', 'aportaciones y caudales mínimos', 'configura y valida el modelo'],
};

const preparedKeywords: Record<number, readonly string[]> = {
  19: ['sin necesitar conexión', 'serie sintética', 'No son los datos observados de Turís', '45 máximos anuales', 'MAP', 'P5–P95', 'Fisher alrededor del ajuste MLE', 'no una posterior obtenida mediante MCMC'],
  32: ['captura', 'Puente de Toledo', 'perfil longitudinal', 'cien y quinientos años', 'cópulas y el procedimiento clásico', 'abrir la herramienta en vivo'],
};

const transitionKeywords: Record<number, readonly string[]> = {
  1: ['estructura académica'], 4: ['problema'], 44: ['cada parte del título'],
  2: ['río Besaya'], 3: ['limitación más general'], 45: ['por qué es necesaria'],
  4.5: ['cómo se estima habitualmente'], 5.5: ['frecuencia al impacto'], 6: ['hipótesis'],
  7: ['pregunta'], 8: ['objetivo general y cuatro compromisos'], 8.5: ['qué aporta la tesis'],
  4.6: ['estrategia verificable'], 8.6: ['cadena estocástica completa'], 46: ['evolución de la investigación'],
  9: ['marcos integrados'], 10: ['metodología'], 47: ['solución'],
  11: ['equipos distintos'], 12: ['producto utilizable'], 5: ['módulos especializados'],
  12.6: ['datos'], 13: ['frecuencia de los extremos'], 14: ['variables dependen entre sí'],
  15: ['escenarios conjuntos', 'coherencia física'], 16: ['modelos de respuesta física'], 17: ['herramientas interactivas'],
  18: ['ejemplo de ajuste de extremos'], 19: ['evidencia acumulada en los casos'], 27: ['origen conceptual'],
  29: ['sensibilidad hidráulica'], 28: ['cuenca torrencial con pocos aforos'], 30: ['infraestructura urbana crítica'],
  31: ['Calle 30'], 32: ['evento sin precedente'], 33: ['Valencia'],
  34: ['lago con registros limitados'], 35: ['calibraciones hidrológicas'], 36: ['IAHR 2022'],
  39: ['embalses bajo cambio climático'], 38: ['escala territorial nacional'], 37: ['cifras'],
  48: ['argumento común'], 39.5: ['producción científica', 'software preservado'], 39.6: ['mi contribución'],
  39.7: ['cada publicación'], 55: ['hipótesis una por una'], 40: ['contribución original'],
  41: ['límites', 'trabajo pendiente'], 42: ['agradecer'], 42.5: ['resultado', 'reto'], 43: ['Cedo la palabra al tribunal'],
};

export function presenterKeywords(slide: Slide, mode: NarrationMode, transition = false): readonly string[] {
  if (transition && slide.transitionCue) return [slide.transitionCue];
  if (!transition && mode === 'prepared' && slide.offlineSpeechCues) return slide.offlineSpeechCues;
  if (!transition && slide.speechCues) return slide.speechCues;
  const id = slide.id;
  return transition ? transitionKeywords[id] ?? [] : (mode === 'prepared' ? preparedKeywords[id] : undefined) ?? keywords[id] ?? [];
}

export function presenterTextParts(text: string, phrases: readonly string[]): { text: string; emphasized: boolean }[] {
  const lower = text.toLocaleLowerCase('es');
  const ranges: { start: number; end: number }[] = [];
  const wordCharacter = /[\p{L}\p{N}_]/u;
  // Prefer longer excerpts when cues overlap; mark each cue once to retain contrast.
  for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
    if (!phrase) continue;
    const needle = phrase.toLocaleLowerCase('es');
    let start = lower.indexOf(needle);
    while (start !== -1) {
      const end = start + phrase.length;
      const insideWord = (wordCharacter.test(phrase[0]) && wordCharacter.test(text[start - 1] ?? '')) ||
        (wordCharacter.test(phrase.at(-1)!) && wordCharacter.test(text[end] ?? ''));
      if (!insideWord && !ranges.some(range => start < range.end && end > range.start)) {
        ranges.push({ start, end });
        break;
      }
      start = lower.indexOf(needle, start + 1);
    }
  }
  const parts: { text: string; emphasized: boolean }[] = [];
  let offset = 0;
  for (const { start, end } of ranges.sort((a, b) => a.start - b.start)) {
    if (start > offset) parts.push({ text: text.slice(offset, start), emphasized: false });
    parts.push({ text: text.slice(start, end), emphasized: true });
    offset = end;
  }
  if (offset < text.length) parts.push({ text: text.slice(offset), emphasized: false });
  return parts;
}

export function emphasizePresenterText(target: HTMLElement, text: string, phrases: readonly string[]): void {
  const content = document.createDocumentFragment();
  for (const part of presenterTextParts(text, phrases)) {
    if (!part.emphasized) content.append(document.createTextNode(part.text));
    else {
      const strong = document.createElement('strong');
      strong.textContent = part.text;
      content.append(strong);
    }
  }
  target.replaceChildren(content);
}
