/** HYDRA scientific figures: adapt presentation, never the values or color scales. */
declare const Plotly: any;
type Options = Record<string, any>;
type PlotTarget = string | HTMLElement;
type PlotState = { data: Options[]; layout: Options; config: Options; scales?: any[] };
const plots = new Map<HTMLElement, PlotState>();

function targetElement(target: PlotTarget): HTMLElement {
  return typeof target === 'string' ? document.getElementById(target)! : target;
}

export function plotPalette(element: HTMLElement) {
  const css = getComputedStyle(element);
  const token = (name: string, fallback: string) => css.getPropertyValue(`--hydra-${name}`).trim() || fallback;
  return {
    text: token('text', '#23354b'), muted: token('muted', '#526276'),
    field: token('plot', '#f8fafc'), grid: token('grid', '#d6dfe8'),
    border: token('border', '#b8c6d4'), surface: token('surface', '#ffffff'),
  };
}

function rgb(color: string): number[] | null {
  if (/^#[\da-f]{3}$/i.test(color)) return color.slice(1).split('').map(c => parseInt(c + c, 16));
  if (/^#[\da-f]{6}$/i.test(color)) return [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  const match = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  return match ? match.slice(1).map(Number) : null;
}
function luminance(color: number[]) {
  const c = color.map(value => { const v = value / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
}
function contrast(a: number[], b: number[]) {
  const l = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l[0] + .05) / (l[1] + .05);
}
function readableColor(color: unknown, background: string, minimum = 3): unknown {
  if (typeof color !== 'string') return color; // Numeric color arrays encode data.
  const source = rgb(color), bg = rgb(background);
  if (!source || !bg || contrast(source, bg) >= minimum) return color;
  const destination = luminance(bg) < .3 ? 255 : 0;
  for (let step = 1; step <= 20; step++) {
    const mixed = source.map(v => Math.round(v + (destination - v) * step / 20));
    if (contrast(mixed, bg) >= minimum) return `rgb(${mixed.join(',')})`;
  }
  return destination === 255 ? '#ffffff' : '#000000';
}

function title(value: any, color: string) {
  const original = typeof value === 'string' ? { text: value } : (value ?? {});
  return { ...original, font: { ...original.font, color } };
}
function colorbar(bar: Options | undefined, palette: ReturnType<typeof plotPalette>) {
  return { ...bar, tickfont: { ...bar?.tickfont, color: palette.text, size: Math.max(12, bar?.tickfont?.size ?? 12) }, title: title(bar?.title, palette.text), titlefont: { ...bar?.titlefont, color: palette.text, size: Math.max(12, bar?.titlefont?.size ?? 12) } };
}
function themedTrace(trace: Options, palette: ReturnType<typeof plotPalette>): Options {
  const copy = { ...trace };
  if (trace.line) copy.line = { ...trace.line, color: readableColor(trace.line.color, palette.field, 4.5) };
  if (trace.marker) {
    copy.marker = { ...trace.marker, color: readableColor(trace.marker.color, palette.field) };
    if (trace.marker.colorbar) copy.marker.colorbar = colorbar(trace.marker.colorbar, palette);
  }
  if (trace.textfont && trace.type !== 'heatmap') copy.textfont = { ...trace.textfont, color: readableColor(trace.textfont.color ?? palette.text, palette.field, 4.5) };
  if (trace.colorbar || trace.type === 'heatmap' || trace.type === 'contour') copy.colorbar = colorbar(trace.colorbar, palette);
  return copy;
}

// The RdBu field is unchanged. Each cell label chooses ink against its own color.
function heatmapLabels(trace: Options, scale?: any[]): Options[] {
  if (trace.type !== 'heatmap' || trace.colorscale !== 'RdBu' || !trace.texttemplate || !scale?.length) return [];
  return trace.z.flatMap((row: number[], y: number) => row.map((value, x) => {
    if (!Number.isFinite(value)) return null;
    let position = Math.max(0, Math.min(1, (value - (trace.zmin ?? -1)) / ((trace.zmax ?? 1) - (trace.zmin ?? -1))));
    if (trace.reversescale) position = 1 - position;
    let index = scale.findIndex((stop: any) => stop[0] >= position);
    if (index <= 0) index = 1;
    const a = rgb(scale[index - 1][1])!, b = rgb(scale[index][1])!;
    if (!a || !b) return null;
    const fraction = (position - scale[index - 1][0]) / (scale[index][0] - scale[index - 1][0]);
    const cell = a.map((v, i) => v + (b[i] - v) * fraction);
    const ink = contrast(rgb('#ffffff')!, cell) > contrast(rgb('#0f172a')!, cell) ? '#ffffff' : '#0f172a';
    return { x: trace.x[x], y: trace.y[y], text: trace.text?.[y]?.[x] ?? value.toFixed(2), showarrow: false, font: { color: ink, size: 12 } };
  }).filter(Boolean));
}

function presentation(element: HTMLElement, state: PlotState) {
  const p = plotPalette(element), original = state.layout;
  const layout: Options = {
    ...original, paper_bgcolor: p.surface, plot_bgcolor: p.field,
    font: { ...original.font, family: 'Inter, system-ui, sans-serif', size: Math.max(12, original.font?.size ?? 12), color: p.text },
    title: title(original.title, p.text),
    legend: { ...original.legend, bgcolor: p.surface, bordercolor: p.border, font: { ...original.legend?.font, color: p.text, size: Math.max(12, original.legend?.font?.size ?? 12) } },
    hoverlabel: { ...original.hoverlabel, bgcolor: p.surface, bordercolor: p.border, font: { ...original.hoverlabel?.font, color: p.text } },
  };
  for (const key of new Set(['xaxis', 'yaxis', ...Object.keys(original).filter(key => /^[xy]axis\d*$/.test(key))])) {
    const axis = original[key] ?? {};
    layout[key] = { ...axis, gridcolor: p.grid, zerolinecolor: p.border, linecolor: p.border,
      tickfont: { ...axis.tickfont, color: p.text, size: Math.max(12, axis.tickfont?.size ?? 12) }, title: title(axis.title, p.text), automargin: true };
  }
  layout.annotations = (original.annotations ?? []).map((annotation: Options) => ({
    ...annotation, font: { ...annotation.font, color: annotation.bgcolor && rgb(annotation.bgcolor)
      ? readableColor(annotation.font?.color ?? p.text, annotation.bgcolor, 4.5)
      : readableColor(annotation.font?.color ?? p.text, p.field, 4.5) },
  }));
  const data = state.data.map((trace, index) => {
    const labels = heatmapLabels(trace, state.scales?.[index]), adapted = themedTrace(trace, p);
    if (trace.type === 'heatmap' && trace.colorscale === 'RdBu' && trace.texttemplate) delete adapted.texttemplate;
    if (labels.length) layout.annotations.push(...labels);
    return adapted;
  });
  if (original.coloraxis) layout.coloraxis = { ...original.coloraxis, colorbar: colorbar(original.coloraxis.colorbar, p) };
  return { data, layout };
}

function refreshHeatmapLabels(element: HTMLElement, state: PlotState) {
  if (!state.data.some(trace => trace.type === 'heatmap' && trace.texttemplate)) return;
  // Use Plotly's resolved scale, so label contrast follows the actual cell color.
  state.scales = (element as any)._fullData?.map((trace: Options) => trace.colorscale);
  const themed = presentation(element, state);
  return Plotly.relayout(element, { annotations: themed.layout.annotations });
}

export function newPlot(target: PlotTarget, data: Options[], layout: Options = {}, config: Options = {}) {
  const element = targetElement(target), state: PlotState = { data, layout, config };
  plots.set(element, state);
  const themed = presentation(element, state);
  return Plotly.newPlot(element, themed.data, themed.layout, { ...config, responsive: true }).then(() => refreshHeatmapLabels(element, state));
}
export function reactPlot(target: PlotTarget, data: Options[], layout: Options = {}, config: Options = {}) {
  const element = targetElement(target), state: PlotState = { data, layout, config };
  plots.set(element, state);
  const themed = presentation(element, state);
  return Plotly.react(element, themed.data, themed.layout, { ...config, responsive: true }).then(() => refreshHeatmapLabels(element, state));
}
window.addEventListener('hydra-theme-change', () => {
  for (const [element, state] of plots) {
    if (!element.isConnected || !element.classList.contains('js-plotly-plot')) { plots.delete(element); continue; }
    // Keep the user's zoom and selected legends while adapting the figure.
    const themed = presentation(element, state);
    const current = (element as any).layout ?? {};
    for (const key of Object.keys(themed.layout).filter(key => /^[xy]axis\d*$/.test(key))) {
      if (current[key]?.range) themed.layout[key] = { ...themed.layout[key], range: current[key].range, autorange: current[key].autorange };
    }
    themed.data.forEach((trace, index) => {
      const visible = (element as any).data?.[index]?.visible;
      if (visible !== undefined) trace.visible = visible;
    });
    Plotly.react(element, themed.data, themed.layout, state.config).then(() => refreshHeatmapLabels(element, state));
  }
});
