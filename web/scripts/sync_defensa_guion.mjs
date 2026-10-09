import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const module = { exports: {} };
const source = fs.readFileSync(new URL('../src/data/slides.ts', import.meta.url), 'utf8');
new Function('exports', 'require', 'module', ts.transpile(source, {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}))(module.exports, require, module);
const { slides, backupSlides, totalMinutes } = module.exports;
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
  rows.push(`### ${i + 1}. ${s.title}`, '', `**Bloque:** ${s.block} · **Tiempo orientativo:** ${duration(s)}`, '', '**Diálogo**', '', s.script.trim(), '');
  if (s.notes) rows.push('**Notas privadas:** ' + s.notes, '');
  if (s.webAction) rows.push('**Acción en la web:** ' + s.webAction, '');
  if (s.offlineScript) rows.push('**Diálogo en demos preparadas (sustituye al diálogo anterior)**', '', s.offlineScript, '');
  if (s.offlineFrames) rows.push('**[Demos preparadas: muestra las capturas locales en orden: ' + s.offlineFrames.map(frame => frame.label).join(' → ') + '. Utiliza los botones de la diapositiva para cambiar de captura.]**', '');
  if (s.id === 19) rows.push('**[Respaldo: abrir /defensa-respaldo si la API no responde. La figura procede del notebook de Valencia; no presentarla como resultado de la serie demo sintética.]**', '');
  else if (s.figure) rows.push('**[Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.]**', '');
  if (s.transition) rows.push(`**Transición:** ${s.transition}`, '');
});
rows.push('**[Pauta final: haz una pausa y cede la palabra al tribunal.]**', '', '## Guion de los anexos', '', 'Material disponible en **/defensa-anexos**, fuera del tiempo principal. Abrir solo el anexo que responda a la pregunta del tribunal.', '');
backupSlides.forEach((s, i) => {
  rows.push(`### Anexo ${i + 1}. ${s.title}`, '', `**Tiempo orientativo:** ${duration(s)}`, '', s.script.trim(), '');
  if (s.offlineFrames) rows.push('**[Apoyo visual local: ' + s.offlineFrames.map((frame, step) => `${step + 1}. ${frame.label}`).join(' → ') + '. Utiliza los botones de la diapositiva para cambiar de figura.]**', '');
  if (s.notes) rows.push('**Notas privadas:** ' + s.notes, '');
});
doc = doc.slice(0, start) + rows.join('\n') + doc.slice(end);
doc = doc.replace(/estimación actual del guion: ~\d+ minutos/, `estimación actual del guion: ~${totalMinutes} minutos`)
  .replace(/\*\*Versión de trabajo:\*\* [^\n]+/, '**Versión de trabajo:** 9 de octubre de 2026<br>')
  .replace(/La estimación de ~\d+ minutos/, `La estimación de ~${totalMinutes} minutos`);
doc = doc.replace(/\(23 modelos CMIP6 × 2 escenarios SSP × 6 variables × 3 horizontes\)/g, 'para distintos modelos, variables, escenarios y horizontes');
const route = s => ['Apertura', 'Motivación'].includes(s.block) ? 0 : s.block === 'Estado del arte' ? 1 : s.block === 'Arquitectura' ? 2 : ['Bloque de datos', 'Bloque climático-estadístico', 'Bloque de modelización', 'Demo en vivo'].includes(s.block) ? 3 : s.block === 'Casos de estudio' ? 4 : 5;
const names = ['Introducción', 'Estado de la técnica', 'Arquitectura', 'Metodología', 'Casos y validación', 'Conclusiones'];
const totals = names.map((_, i) => slides.filter(s => route(s) === i).reduce((n, s) => n + s.estimatedMinutes, 0));
const table = '| Bloque | Tiempo orientativo |\n|---|---:|\n' + names.map((n, i) => `| ${n} | ${totals[i].toFixed(1).replace('.', ',')} min |`).join('\n');
doc = doc.replace(/\| Bloque \|[^\n]*\n\|---[\s\S]*?(?=\n\n)/, table);
const dialogueWords = slides.reduce((n, slide) => n + slide.script.trim().split(/\s+/).length, 0);
const transitionWords = [...rows.join('\n').split('## Guion de los anexos')[0].matchAll(/\*\*Transición:\*\* (.*)/g)].reduce((n, match) => n + match[1].trim().split(/\s+/).length, 0);
const decimal = number => number.toFixed(1).replace('.', ',');
doc = doc.replace(/### Comprobación del libreto ·[^\n]+/, '### Comprobación del libreto · 9 de octubre de 2026');
doc = doc.replace(/El recorrido (?:contiene|principal en vivo contiene)[^\n]+/, `El recorrido principal en vivo contiene **${dialogueWords} palabras de diálogo y ${transitionWords} de transiciones**. A 115 palabras por minuto, son unos **${decimal((dialogueWords + transitionWords) / 115)} minutos de voz**; la estimación completa es de **${totalMinutes} minutos**, incluyendo pausas, figuras y demostración. A 100 palabras por minuto, el texto solo requiere **${decimal((dialogueWords + transitionWords) / 100)} minutos**. La variante con demos preparadas sustituye el diálogo de la demo por la explicación de las capturas, sin ejecutar la API.`);
doc = doc.replace(/Se ha comprobado la correspondencia del diálogo con[^\n]+/, `El diálogo está sincronizado con las ${slides.length} diapositivas principales y los ${backupSlides.length} anexos. Esta revisión del texto y los tiempos no sustituye un ensayo oral cronometrado del doctorando.`);
fs.writeFileSync(path, doc);
console.log(`${slides.length} diálogos principales; ${backupSlides.length} anexos; ${totalMinutes} minutos.`);
