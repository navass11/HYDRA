import type { Slide } from '../data/slides';

export type NarrationMode = 'live' | 'prepared';

export const narrationModes = {
  live: 'Guion principal · en vivo',
  prepared: 'Guion con capturas preparadas',
} as const;

/** The same complete dialogue used to generate the internal printed/ebook script. */
export function dialogueFor(slide: Slide, mode: NarrationMode): string {
  return mode === 'prepared' ? slide.offlineScript ?? slide.script : slide.script;
}

export function narrationNotice(slide: Slide, mode: NarrationMode): string {
  return mode === 'prepared' && slide.offlineScript
    ? 'Diálogo en demos preparadas del guion: sustituye al diálogo principal en esta diapositiva.'
    : 'Texto de «Diálogo» del guion oral completo por diapositiva. La transición se dice al cambiar de diapositiva.';
}

/** Delivery cues are already public presenter notes; never load the private document. */
export function deliveryCue(slide: Slide, reserve = false): string {
  if (reserve) return slide.offlineFrames
    ? 'Apoyo visual local: ' + slide.offlineFrames.map((frame, i) => `${i + 1}. ${frame.label}`).join(' → ') + '. Utiliza los botones de la diapositiva para cambiar de figura.'
    : '';
  const cues: string[] = [];
  if (slide.offlineFrames) cues.push('Demos preparadas: muestra las capturas locales en orden: ' + slide.offlineFrames.map(frame => frame.label).join(' → ') + '. Utiliza los botones de la diapositiva para cambiar de captura.');
  if (slide.id === 19) cues.push('Respaldo: abrir /defensa-respaldo si la API no responde. La figura procede del notebook de Valencia; no presentarla como resultado de la serie demo sintética.');
  else if (slide.figure) cues.push('Pauta: señala la figura principal al explicar el resultado. Las figuras adicionales están en /defensa-anexos.');
  return cues.join('\n\n');
}
