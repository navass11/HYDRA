import type { Slide } from '../data/slides';
import { presenterBriefFor } from '../data/presenter-briefs';
import { dialogueFor, type NarrationMode } from './defense-narration';

/** Local reading preference; it never changes the audience view or study copy. */
export function setupPresenterCopy(onChange: () => void) {
  let brief = true;
  try { brief = localStorage.getItem('hydra-presenter-copy') !== 'full'; } catch { /* Default to brief. */ }
  const pickers = document.querySelectorAll<HTMLSelectElement>('[data-presenter-copy]');
  const apply = () => {
    document.body.classList.toggle('presenter-brief', brief);
    pickers.forEach(picker => { picker.value = brief ? 'brief' : 'full'; });
    document.querySelectorAll('[data-copy-label]').forEach(label => {
      label.textContent = brief ? 'Apoyo breve para exponer' : 'Guion completo para leer';
    });
  };
  apply();
  pickers.forEach(picker => picker.addEventListener('change', () => {
    brief = picker.value === 'brief';
    try { localStorage.setItem('hydra-presenter-copy', brief ? 'brief' : 'full'); } catch { /* Keep the current choice in memory. */ }
    apply();
    onChange();
  }));
  return {
    textFor: (slide: Slide, mode: NarrationMode) =>
      (brief ? presenterBriefFor(slide, mode) : undefined) ?? dialogueFor(slide, mode),
  };
}
