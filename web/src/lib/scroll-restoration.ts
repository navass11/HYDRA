// Keep the position with its history entry, rather than sharing one position
// between every visit to a URL. Embedded presentation pages have their own
// scroll synchronisation and must remain under the presenter's control.
if (window.self === window.top) {
  const key = '__hydraScroll';
  const save = () => {
    try {
      history.replaceState({
        ...history.state,
        [key]: { x: scrollX, y: scrollY, href: location.href },
      }, '');
    } catch { /* Native history restoration remains available. */ }
  };

  window.addEventListener('pagehide', save);
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link) save();
    if (!link?.hasAttribute('data-hydra-tools-back') || event.defaultPrevented
      || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      const previous = new URL(document.referrer);
      const destination = new URL((link as HTMLAnchorElement).href);
      if (previous.origin === location.origin && previous.pathname === destination.pathname
        && history.length > 1) {
        event.preventDefault();
        history.back();
      }
    } catch { /* Direct visits use the link's tools-section fallback. */ }
  }, { capture: true });

  window.addEventListener('pageshow', (event) => {
    // A page restored from the back/forward cache already has its exact state.
    if (event.persisted) return;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const position = history.state?.[key];
    if (navigation?.type !== 'back_forward' || position?.href !== location.href
      || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    let stopped = false;
    let frame = 0;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!stopped) window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
      });
    };
    const observer = new ResizeObserver(restore);
    const stop = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.style.scrollBehavior = previousBehavior;
      ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(type => window.removeEventListener(type, stop, true));
    };
    observer.observe(document.body);
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
    restore();
    // Account for late fonts and image layout without fighting later user input.
    document.fonts.ready.then(() => { if (!stopped) restore(); });
    setTimeout(stop, 1500);
  });
}
