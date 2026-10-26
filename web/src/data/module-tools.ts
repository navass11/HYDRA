// Public tools associated with each current module slug. Shared by the module
// catalogue and return navigation so their destinations cannot drift apart.
export const moduleTools: Record<string, Array<{ label: string; slug: string }>> = {
  'fuentes-datos': [
    { label: 'Meteostat', slug: 'meteostat' },
    { label: 'AEMET', slug: 'aemet' },
    { label: 'OGIMET', slug: 'ogimet' },
  ],
  'analisis-climatico': [
    { label: 'Eventos y GEV bayesiana', slug: 'statistical' },
    { label: 'Curvas IDF', slug: 'idf' },
    { label: 'Tendencias', slug: 'trend' },
    { label: 'Corrección de sesgo', slug: 'bias' },
    { label: 'Interpolación espacial', slug: 'interpolation' },
    { label: 'Análisis regional de frecuencia', slug: 'rfa' },
  ],
  'generacion-estocastica': [
    { label: 'Generación estocástica', slug: 'stochastic' },
    { label: 'Cópulas', slug: 'copulas' },
    { label: 'Eventos compuestos', slug: 'compound' },
  ],
  modelizacion: [
    { label: 'Hidráulica de canales', slug: 'hydraulic' },
    { label: 'Sensibilidad de Manning', slug: 'sensitivity' },
  ],
};
