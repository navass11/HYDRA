// Each history entry owns its position, including independently scrolling panes.
// Presentation windows retain their own slide/preview synchronisation.
if (window.self === window.top && !document.querySelector('#live-shell, #pres-shell')) {
  type Position = { href: string; x: number; y: number; panes: Record<string, { x: number; y: number }> };
  type Entry = { id: string; position?: Position };
  const stateKey = '__hydraScrollV2';
  const storeKey = 'hydra-scroll-v2:';
  let entry: Entry;
  let restoring = false;
  let leaving = false;
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let stopRestore = () => {};
  const panes = () => Array.from(document.querySelectorAll<HTMLElement>('[data-hydra-scroll][id]'));
  const readEntry = (): Entry | undefined => {
    const value = history.state?.[stateKey];
    return typeof value?.id === 'string' ? value : undefined;
  };
  const writeEntry = () => {
    try { history.replaceState({ ...history.state, [stateKey]: entry }, ''); } catch { /* Storage below is an additional fallback. */ }
  };
  const newEntry = (): Entry => ({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` });
  const snapshot = (): Position => ({
    href: location.href, x: scrollX, y: scrollY,
    panes: Object.fromEntries(panes().map(pane => [pane.id, { x: pane.scrollLeft, y: pane.scrollTop }])),
  });
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = undefined;
    if (restoring || leaving) return;
    entry.position = snapshot();
    writeEntry();
    try { sessionStorage.setItem(storeKey + entry.id, JSON.stringify(entry.position)); } catch { /* The history entry also holds the position. */ }
  };
  const savedPosition = (): Position | undefined => {
    try {
      const stored = sessionStorage.getItem(storeKey + entry.id);
      if (stored) return JSON.parse(stored);
    } catch { /* Use the entry's copy when storage is unavailable. */ }
    return entry.position;
  };
  const restore = () => {
    stopRestore();
    const position = savedPosition();
    if (position?.href !== location.href || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return;
    restoring = true;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    let frame = 0;
    let stopped = false;
    let timeout: ReturnType<typeof setTimeout>;
    const apply = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (stopped) return;
        window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
        for (const pane of panes()) {
          const saved = position.panes?.[pane.id];
          if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
            pane.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
          }
        }
      });
    };
    const observer = new ResizeObserver(apply);
    const stop = () => {
      if (stopped) return;
      stopped = true;
      restoring = false;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.style.scrollBehavior = previousBehavior;
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(type => window.removeEventListener(type, stop, true));
      window.removeEventListener('load', apply);
    };
    stopRestore = stop;
    observer.observe(document.body);
    for (const pane of panes()) {
      observer.observe(pane);
      for (const child of pane.children) observer.observe(child);
    }
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
    window.addEventListener('load', apply);
    document.fonts.ready.then(() => { if (!stopped) apply(); });
    apply();
    timeout = setTimeout(stop, 4000);
  };

  entry = readEntry() ?? newEntry();
  writeEntry();
  // Own restoration so the browser's smooth scroll/hash handling cannot race it.
  history.scrollRestoration = 'manual';
  document.addEventListener('scroll', () => {
    if (!restoring && !leaving && saveTimer === undefined) {
      saveTimer = setTimeout(() => { saveTimer = undefined; save(); }, 120);
    }
  }, { passive: true, capture: true });
  window.addEventListener('pagehide', () => { save(); leaving = true; stopRestore(); });
  window.addEventListener('pageshow', () => {
    leaving = false;
    // Reconcile even a cached document; it may have been frozen mid-navigation.
    entry = readEntry() ?? entry;
    restore();
  });
  window.addEventListener('popstate', () => {
    clearTimeout(saveTimer); saveTimer = undefined;
    stopRestore();
    entry = readEntry() ?? newEntry();
    writeEntry();
    restore();
  });
  window.addEventListener('hashchange', () => {
    // A fresh anchor visit needs a new identity. Traversal already selected its
    // saved identity in popstate, with a position for this exact URL.
    const current = readEntry();
    if (!current || (current.position && current.position.href !== location.href)) {
      stopRestore();
      entry = newEntry();
      writeEntry();
      save();
    }
  });
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    save();
    if (!link.hasAttribute('data-hydra-tools-back')) return;
    try {
      const previous = new URL(document.referrer);
      const destination = new URL(link.href);
      if (previous.origin === location.origin && previous.pathname === destination.pathname && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    } catch { /* Direct visits use the link's tools-section fallback. */ }
  }, { capture: true });
}
