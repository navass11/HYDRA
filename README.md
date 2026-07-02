# Paper — Roughness uncertainty in 2D flood inundation models (Besaya)

Fuentes LaTeX del artículo:

> **From roughness uncertainty to model-structure effects in 2D flood inundation models: a Monte Carlo comparison of SFINCS and HEC-RAS**
> Salvador Navas, Álvaro Galán, Manuel del Jesús

Análisis de sensibilidad Monte Carlo del coeficiente de Manning sobre el río Besaya (Los Corrales de Buelna), comparando la respuesta de los modelos hidráulicos 2D SFINCS y HEC-RAS. Es uno de los casos de estudio de validación de la tesis doctoral y de la plataforma **HYDRA**.

- 📦 **Código y herramientas usadas:** [github.com/navass11/HYDRA](https://github.com/navass11/HYDRA) (rama `main`) y [github.com/navass11/pyhydra](https://github.com/navass11/pyhydra)
- 🌐 **Demo en vivo de HYDRA:** [hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io](https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/)
- 📄 **pyhydra en Zenodo:** https://doi.org/10.5281/zenodo.20932555

## Estructura

```
papers/besaya_manning_sensitivity/
├── main_AG.tex          # Documento (versión activa)
├── main.tex               # Versión previa
├── figures/                # Figuras del artículo
├── make_fig*.py             # Scripts de generación de figuras (Python)
├── references.bib            # Bibliografía
└── cas-*.{cls,sty,bst}         # Plantilla Elsevier/cas-sc
```

## Compilar

```bash
cd papers/besaya_manning_sensitivity
latexmk -pdf -interaction=nonstopmode main_AG.tex
```
