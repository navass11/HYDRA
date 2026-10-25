import { moduleTools } from '../data/module-tools';

// A tool opened from a module keeps that explicit context across refreshes.
// Ordinary catalogue/direct visits retain the tools-section fallback.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const current = new URL(location.href);
const toolSlug = current.pathname.replace(/\/$/, '').split('/').pop();
const moduleSlug = current.searchParams.get('fromModule');
if (moduleSlug && moduleTools[moduleSlug]?.some(tool => tool.slug === toolSlug)) {
  document.querySelectorAll<HTMLAnchorElement>('[data-hydra-tools-back]').forEach(link => {
    link.href = `${base}/modules/${moduleSlug}#herramientas-relacionadas`;
    link.dataset.i18n = 'back.module';
    link.dataset.tEs = '← Volver al módulo';
    link.dataset.tEn = '← Back to module';
    link.textContent = document.documentElement.lang === 'en' ? link.dataset.tEn : link.dataset.tEs;
  });
}
