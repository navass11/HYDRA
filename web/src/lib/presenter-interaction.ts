/** Controls operate only on same-origin HYDRA frames in the current presentation step. */
export function setupPresenterInteraction(options: {
  presenter: boolean; preview: HTMLIFrameElement; website: HTMLIFrameElement; deck: HTMLIFrameElement;
  current: () => { index: number; id: number; web: boolean }; send: (message: unknown) => void;
}) {
  const { presenter, preview, website, deck, current, send } = options;
  const controlButton = document.getElementById('pres-control-web') as HTMLButtonElement;
  const laserButton = document.getElementById('pres-laser') as HTMLButtonElement;
  let controlling = false, laser = false;
  let pendingLocation: { url: string; x: number; y: number } | null = null;
  const bound = new WeakSet<Document>();
  const dots = new Map<HTMLIFrameElement, HTMLElement>();
  let laserExpiry: ReturnType<typeof setTimeout> | undefined;
  const frames = presenter ? [preview] : [website, deck];
  for (const frame of frames) {
    const dot = document.createElement('span');
    dot.className = 'presentation-laser'; dot.hidden = true; dot.setAttribute('aria-hidden', 'true');
    frame.parentElement!.append(dot); dots.set(frame, dot);
  }
  function hideDots() { dots.forEach(dot => dot.hidden = true); }
  function point(x: number, y: number) {
    hideDots();
    const frame = presenter ? preview : current().web ? website : deck;
    const dot = dots.get(frame)!;
    const rect = frame.getBoundingClientRect(), parent = frame.parentElement!.getBoundingClientRect();
    dot.style.left = `${rect.left - parent.left - frame.parentElement!.clientLeft + x * rect.width}px`;
    dot.style.top = `${rect.top - parent.top - frame.parentElement!.clientTop + y * rect.height}px`;
    dot.hidden = false;
    clearTimeout(laserExpiry); laserExpiry = setTimeout(hideDots, 1800);
  }
  function envelope(data: Record<string, unknown>) { send({ ...data, index: current().index, slideId: current().id }); }
  function setLaser(enabled: boolean, announce = true) {
    laser = enabled; hideDots();
    laserButton.setAttribute('aria-pressed', String(enabled));
    laserButton.textContent = enabled ? 'Desactivar láser (L)' : 'Puntero láser (L)';
    if (announce) envelope({ type: 'laser-enabled', enabled });
    refresh();
  }
  function selectorFor(el: Element): string {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts: string[] = [];
    for (let node: Element | null = el; node && node.tagName !== 'BODY'; node = node.parentElement) {
      const siblings = Array.from(node.parentElement?.children ?? []).filter(other => other.tagName === node!.tagName);
      parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(node) + 1})`);
    }
    return `body > ${parts.join(' > ')}`;
  }
  function publishLocation() {
    if (!presenter || !controlling || !current().web) return;
    try {
      const page = preview.contentWindow!;
      if (page.location.origin !== location.origin) return;
      envelope({ type: 'presenter-web-control', action: 'location', url: page.location.href, x: page.scrollX, y: page.scrollY });
    } catch { /* External pages cannot control the projected HYDRA page. */ }
  }
  function bind(frame: HTMLIFrameElement) {
    try {
      const doc = frame.contentDocument;
      if (!doc?.body || bound.has(doc)) return;
      bound.add(doc);
      let pointerFrame = 0, scrollFrame = 0;
      doc.addEventListener('pointermove', event => {
        if (!laser || !event.isTrusted) return;
        cancelAnimationFrame(pointerFrame);
        pointerFrame = requestAnimationFrame(() => {
          const x = event.clientX / frame.contentWindow!.innerWidth, y = event.clientY / frame.contentWindow!.innerHeight;
          point(x, y); envelope({ type: 'laser-point', x, y });
        });
      });
      doc.documentElement.addEventListener('pointerleave', () => { hideDots(); if (laser) envelope({ type: 'laser-hide' }); });
      doc.addEventListener('keydown', event => {
        if (event.target instanceof doc.defaultView!.HTMLInputElement || event.target instanceof doc.defaultView!.HTMLTextAreaElement || event.target instanceof doc.defaultView!.HTMLSelectElement) return;
        if (event.key.toLowerCase() === 'l' || event.key === 'Escape') {
          event.preventDefault(); event.stopImmediatePropagation(); setLaser(event.key === 'Escape' ? false : !laser);
        }
      }, true);
      doc.addEventListener('click', event => {
        if (laser) { event.preventDefault(); event.stopImmediatePropagation(); return; }
        if (!presenter || !controlling || !current().web || !event.isTrusted) return;
        const target = event.target as Element;
        // Links navigate locally; the load/scroll transport then projects the same URL.
        if (target.closest('a[href]')) return;
        const button = target.closest('button, [role="button"], input[type="submit"], input[type="button"]');
        if (button) envelope({ type: 'presenter-web-control', action: 'click', selector: selectorFor(button) });
      }, true);
      for (const type of ['input', 'change']) doc.addEventListener(type, event => {
        if (!presenter || !controlling || !current().web || !event.isTrusted || laser) return;
        const el = event.target as HTMLInputElement;
        if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) || el.type === 'file' || el.type === 'password') return;
        envelope({ type: 'presenter-web-control', action: 'input', selector: selectorFor(el), value: el.value, checked: el.checked, event: type });
      }, true);
      frame.contentWindow!.addEventListener('scroll', () => {
        cancelAnimationFrame(scrollFrame); scrollFrame = requestAnimationFrame(publishLocation);
      }, { passive: true });
    } catch { /* Same-origin pages only. */ }
  }
  function refresh() {
    if (!current().web) controlling = false;
    controlButton.hidden = !current().web;
    controlButton.setAttribute('aria-pressed', String(controlling));
    controlButton.textContent = controlling ? 'Dejar de controlar web' : 'Controlar web';
    if (presenter) preview.style.pointerEvents = laser || controlling ? 'auto' : 'none';
    frames.forEach(bind);
  }
  for (const frame of frames) frame.addEventListener('load', () => {
    bind(frame);
    if (presenter) publishLocation();
    else if (frame === website && pendingLocation) {
      try {
        if (website.contentWindow!.location.href === pendingLocation.url) website.contentWindow!.scrollTo(pendingLocation.x, pendingLocation.y);
      } catch { /* Wait for same-origin content. */ }
      pendingLocation = null;
    }
  });
  controlButton.addEventListener('click', () => { controlling = !controlling; refresh(); publishLocation(); });
  laserButton.addEventListener('click', () => setLaser(!laser));
  function receive(message: any) {
    if (!message || message.slideId !== current().id || message.index !== current().index) return;
    if (message.type === 'laser-enabled') setLaser(message.enabled === true, false);
    if (message.type === 'laser-hide') hideDots();
    if (message.type === 'laser-point' && Number.isFinite(message.x) && Number.isFinite(message.y) && message.x >= 0 && message.x <= 1 && message.y >= 0 && message.y <= 1) point(message.x, message.y);
    if (message.type !== 'presenter-web-control' || presenter || !current().web) return;
    try {
      const page = website.contentWindow!, doc = website.contentDocument!;
      if (message.action === 'location') {
        const url = new URL(message.url);
        if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol) || !Number.isFinite(message.x) || !Number.isFinite(message.y)) return;
        if (page.location.href !== url.href) { pendingLocation = { url: url.href, x: message.x, y: message.y }; website.src = url.href; }
        else page.scrollTo(message.x, message.y);
      } else if (typeof message.selector === 'string') {
        const el = doc.querySelector(message.selector) as HTMLInputElement | null;
        if (!el) return;
        if (message.action === 'click') el.click();
        if (message.action === 'input' && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) && !['file', 'password'].includes(el.type)) {
          el.value = String(message.value ?? ''); if (el.type === 'checkbox' || el.type === 'radio') el.checked = Boolean(message.checked);
          el.dispatchEvent(new Event(message.event === 'change' ? 'change' : 'input', { bubbles: true }));
        }
      }
    } catch { /* Ignore controls for frames that are still loading. */ }
  }
  return { refresh, receive, hide: hideDots, isControlling: () => controlling, toggleLaser: () => setLaser(!laser), stopLaser: () => setLaser(false) };
}
