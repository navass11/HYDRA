# Memoria doctoral HYDRA

Este directorio contiene el esqueleto LaTeX de la memoria doctoral en formato híbrido: tesis académica y manual técnico-industrial de la librería HYDRA.

## Estructura

- `main.tex`: punto de entrada del documento.
- `frontmatter/`: metadatos y portada provisional, preparada para sustituirse por una plantilla UC.
- `chapters/`: capitulos principales de la memoria.
- `appendices/`: anexos practicos de API, notebooks y convenciones.
- `references.bib`: bibliografia inicial extraida del plan de investigacion.
- `build/`: directorio recomendado para artefactos de compilacion.

## Compilacion

Si tienes una distribucion LaTeX con `latexmk` y `biber`:

```bash
cd thesis
latexmk -pdf -interaction=nonstopmode -outdir=build main.tex
```

Alternativamente:

```bash
cd thesis
pdflatex -output-directory=build main.tex
biber build/main
pdflatex -output-directory=build main.tex
pdflatex -output-directory=build main.tex
```

## Adaptacion futura a Plantilla UC

La estructura mantiene metadatos, portada, capitulos, anexos y bibliografia separados. Cuando se incorpore la plantilla institucional, el cambio esperado se concentra en `main.tex`, `frontmatter/titlepage.tex` y, si procede, en las opciones bibliograficas.
