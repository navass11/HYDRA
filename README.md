# Tesis doctoral — Desarrollo de un modelo automático de inundación estocástica

Fuentes LaTeX de la tesis doctoral de **Salvador Navas Fernández**:

- **Título (ES):** Desarrollo de un modelo automático de inundación estocástica
- **Título (EN):** Development of an automatic stochastic flood model
- **Director:** Manuel del Jesús Peñil · **Tutor:** César Álvarez Díaz
- **Programa:** Doctorado en Ingeniería de Costas, Hidrobiología y Gestión de Sistemas Acuáticos (IH2O)
- **Universidad de Cantabria**, en colaboración con IH Cantabria (tesis industrial)

Esta rama contiene únicamente los documentos de la tesis. El software desarrollado (**pyhydra** / **HYDRA**) vive en un repositorio y una rama independientes:

- 🌐 **Demo en vivo de HYDRA:** [hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io](https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/)
- 📦 **Código:** [github.com/navass11/HYDRA](https://github.com/navass11/HYDRA) (rama `main`) y [github.com/navass11/pyhydra](https://github.com/navass11/pyhydra)
- 📄 **Citar el software** (no la URL de demo, que es efímera): pyhydra está archivado en Zenodo — https://doi.org/10.5281/zenodo.20932555. HYDRA (repositorio de integración) está pendiente de archivado en Zenodo.

## Estructura

```
thesis/
├── main.tex              # Documento raíz
├── frontmatter/          # Portada, metadatos, acrónimos
├── chapters/              # Capítulos 00-09
├── appendices/             # Apéndices (API práctica, convenciones, notebooks)
├── figures/                # Figuras (generadas y reproducidas de publicaciones propias)
├── assets/                  # Plantilla y estilos
└── references.bib          # Bibliografía
```

## Compilar

Requiere una distribución LaTeX completa (TeX Live 2026 o equivalente) con `latexmk` y `biber`.

```bash
cd thesis
latexmk -pdf -interaction=nonstopmode main.tex
```

El PDF resultante es `thesis/main.pdf`.

## Generar figuras

Algunas figuras del capítulo 5 y 8 se generan con `thesis/figures/gen_figures.py` (Python: numpy, matplotlib, scipy). El resto son reproducciones directas de las publicaciones propias citadas en cada caso de estudio.
