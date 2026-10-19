import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const module = { exports: {} };
const source = fs.readFileSync(new URL('../src/data/slides.ts', import.meta.url), 'utf8');
new Function('exports', 'require', 'module', ts.transpile(source, {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}))(module.exports, require, module);
const { slides, backupSlides, totalMinutes, chapterLabelFor } = module.exports;
const narrationModule = { exports: {} };
new Function('exports', 'require', 'module', ts.transpile(fs.readFileSync(new URL('../src/lib/defense-narration.ts', import.meta.url), 'utf8'), {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}))(narrationModule.exports, require, narrationModule);
const { dialogueFor, deliveryCue } = narrationModule.exports;
const emphasisModule = { exports: {} };
new Function('exports', 'require', 'module', ts.transpile(fs.readFileSync(new URL('../src/lib/presenter-emphasis.ts', import.meta.url), 'utf8'), {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}))(emphasisModule.exports, require, emphasisModule);
const { presenterTextParts, presenterKeywords } = emphasisModule.exports;
const emphasized = (s, mode = 'live', transition = false) => presenterTextParts(
  transition ? s.transition ?? '' : dialogueFor(s, mode), presenterKeywords(s, mode, transition),
).map(part => part.emphasized ? `**${part.text}**` : part.text).join('');

const revisionDate = process.env.GUION_REVISION_DATE || new Intl.DateTimeFormat('es-ES', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid',
}).format(new Date());
const path = new URL('../docs/guion-vivo-defensa.md', import.meta.url);
let doc = fs.readFileSync(path, 'utf8');
const heading = '## Guion oral completo por diapositiva';
const start = doc.indexOf(heading);
const end = doc.indexOf('## Hoja de ensayo');
if (start < 0 || end < 0) throw new Error('Faltan los límites del guion oral');
const duration = s => {
  const seconds = Math.round(s.estimatedMinutes * 60);
  return `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, '0')} s`;
};
const rows = [heading, '', `Libreto del recorrido principal: **${slides.length} diapositivas**, unos **${totalMinutes} minutos**. El texto bajo **Diálogo** coincide con la vista de presentador en vivo y se pronuncia; la **Transición** acompaña el cambio de diapositiva. Las pautas entre corchetes son acciones privadas. Los tiempos incluyen el habla a 115 palabras/min, la transición, la lectura de figuras y la demostración. Son los mismos que utiliza la vista de presentador.`, ''];
slides.forEach((s, i) => {
  rows.push(`### ${i + 1}. ${s.title}`, '', `**Bloque:** ${chapterLabelFor(s)}${s.sectionLabel ? ` · **Apartado:** ${s.sectionLabel}` : ''} · **Tiempo orientativo:** ${duration(s)}`, '');
  if (s.webMode) rows.push('**Formato:** visita web en vivo; figura o capturas preparadas en la copia sin conexión. Al avanzar se regresa al siguiente paso del recorrido.', '');
  if (s.speakerGoal) rows.push('**Idea que debe quedar:** ' + s.speakerGoal, '');
  if (s.visualGuide?.length) rows.push('**Recorrido visual:**', '', ...s.visualGuide.map((cue, step) => `${step + 1}. ${cue}`), '');
  rows.push('**Diálogo**', '', emphasized(s).trim(), '');
  if (s.notes) rows.push('**Notas privadas:** ' + s.notes, '');
  if (s.webAction) rows.push('**Acción en la web:** ' + s.webAction, '');
  if (s.offlineScript) rows.push('**Diálogo en demos preparadas (sustituye al diálogo anterior)**', '', emphasized(s, 'prepared'), '');
  const cues = deliveryCue(s);
  if (cues) rows.push(...cues.split('\n\n').flatMap(cue => [`**[${cue}]**`, '']));
  if (s.transition) rows.push(`**Transición:** ${emphasized(s, 'live', true)}`, '');
});
rows.push('**[Pauta final: haz una pausa y cede la palabra al tribunal.]**', '', '## Guion de los anexos', '', 'Material disponible en **/defensa-anexos**, fuera del tiempo principal. Abrir solo el anexo que responda a la pregunta del tribunal.', '');
backupSlides.forEach((s, i) => {
  rows.push(`### Anexo ${i + 1}. ${s.title}`, '', `**Tiempo orientativo:** ${duration(s)}`, '', emphasized(s).trim(), '');
  const cue = deliveryCue(s, true);
  if (cue) rows.push(`**[${cue}]**`, '');
  if (s.notes) rows.push('**Notas privadas:** ' + s.notes, '');
});
doc = doc.slice(0, start) + rows.join('\n') + doc.slice(end);
doc = doc.replace(/estimación actual del guion: ~\d+ minutos/, `estimación actual del guion: ~${totalMinutes} minutos`)
  .replace(/\*\*Versión de trabajo:\*\* [^\n]+/, `**Versión de trabajo:** ${revisionDate}<br>`)
  .replace(/La estimación de ~\d+ minutos/, `La estimación de ~${totalMinutes} minutos`);
doc = doc.replace(/\(23 modelos CMIP6 × 2 escenarios SSP × 6 variables × 3 horizontes\)/g, 'para distintos modelos, variables, escenarios y horizontes');
const route = s => ['Apertura', 'Motivación'].includes(s.block) ? 0 : s.block === 'Estado del arte' ? 1 : s.block === 'Arquitectura' ? 2 : ['Bloque de datos', 'Bloque climático-estadístico', 'Bloque de modelización', 'Demo en vivo'].includes(s.block) ? 3 : s.block === 'Casos de estudio' ? 4 : 5;
const names = ['Introducción', 'Estado de la técnica', 'Arquitectura', 'Metodología', 'Casos y validación', 'Conclusiones'];
const totals = names.map((_, i) => slides.filter(s => route(s) === i).reduce((n, s) => n + s.estimatedMinutes, 0));
const table = '| Bloque | Tiempo orientativo |\n|---|---:|\n' + names.map((n, i) => `| ${n} | ${totals[i].toFixed(1).replace('.', ',')} min |`).join('\n');
doc = doc.replace(/\| Bloque \|[^\n]*\n\|---[\s\S]*?(?=\n\n)/, table);
doc = doc.replace(/Esta revisión contiene[^\n]+/, `Esta revisión contiene **${slides.length} diapositivas principales y ${backupSlides.length} anexos**. La estimación es de **${totalMinutes} minutos**, con voz a 115 palabras/minuto, transiciones, lectura de figuras y una demo breve. Debe comprobarse mediante ensayo cronometrado.`);
const dialogueWords = slides.reduce((n, slide) => n + slide.script.trim().split(/\s+/).length, 0);
const transitionWords = [...rows.join('\n').split('## Guion de los anexos')[0].matchAll(/\*\*Transición:\*\* (.*)/g)].reduce((n, match) => n + match[1].trim().split(/\s+/).length, 0);
const decimal = number => number.toFixed(1).replace('.', ',');
doc = doc.replace(/### Comprobación del libreto ·[^\n]+/, `### Comprobación del libreto · ${revisionDate}`);
doc = doc.replace(/El recorrido (?:contiene|principal en vivo contiene)[^\n]+/, `El recorrido principal en vivo contiene **${dialogueWords} palabras de diálogo y ${transitionWords} de transiciones**. A 115 palabras por minuto, son unos **${decimal((dialogueWords + transitionWords) / 115)} minutos de voz**; la estimación completa es de **${totalMinutes} minutos**, incluyendo pausas, figuras y demostración. A 100 palabras por minuto, el texto solo requiere **${decimal((dialogueWords + transitionWords) / 100)} minutos**. La variante con demos preparadas sustituye el diálogo de la demo por la explicación de las capturas, sin ejecutar la API.`);
doc = doc.replace(/(?:Se ha comprobado la correspondencia del diálogo con|El diálogo está sincronizado con)[^\n]+/, `El diálogo está sincronizado con las ${slides.length} diapositivas principales y los ${backupSlides.length} anexos. Esta revisión del texto y los tiempos no sustituye un ensayo oral cronometrado del doctorando.`);
fs.writeFileSync(path, doc);
console.log(`${slides.length} diálogos principales; ${backupSlides.length} anexos; ${totalMinutes} minutos.`);
