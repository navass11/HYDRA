# SoftwareX submission audit

Audit date: 30 July 2026. Major-revision pass: 30 July 2026. Minor-revision
passes: 30-31 July 2026 (four rounds, summarised below).

Official sources:

- [SoftwareX Guide for Authors](https://www.sciencedirect.com/journal/softwarex/publish/guide-for-authors)
- [Official Original Software Publication LaTeX template](https://legacyfileshare.elsevier.com/promis_misc/softwarex-osp-template.tex)

## Minor-revision passes (30-31 July 2026)

Four further rounds of simulated review followed the major-revision pass
below, each resolved before the next:

1. **Version/citation coherence.** The archived `v0.1.0` tag did not match
   what the manuscript described (missing M-30 case, wrong notebook/test
   counts). Cut a clean `v0.1.3` release with matching content, verified by
   CI; a subsequent bug the CI itself surfaced (a `src/`-layout path
   regression, an un-tracked data file, pandas/NumPy compatibility) required
   `v0.1.4`. `README.md`/`CITATION.cff`/`.zenodo.json` were found to still
   describe `v0.1.0` despite the version field having moved on through every
   prior release; fixed in `v0.1.5` by switching badges and citation DOIs to
   the *concept* DOI (always resolves to the latest version), which
   structurally prevents that drift recurring. `v0.1.6` added a Python
   3.9-3.12 CI matrix (PyMC included -- the toolchain issue that had excluded
   it was specific to local macOS, not Ubuntu/CI) and real `pip` extras
   (`statistics`, `geospatial`, `models`, `all`; `all` previously aliased
   `geo` only). `v0.1.7` fixed stale documentation (`docs/index.md`,
   `docs/instalacion.md` still described the pre-split HYDRA monorepo).
   The manuscript, both Zenodo records (creators/ORCID/affiliations) and
   both repositories' `README.md`/`CITATION.cff` are now mutually
   consistent at `pyhydra` v0.1.7 (`ddc5293`, DOI
   `10.5281/zenodo.21705553`) and `HYDRA` v0.1.2 (`627a838`, DOI
   `10.5281/zenodo.21705293`).
2. **Valencia DANA figure.** The archived notebooks do not compute the
   global/local regional-frequency split shown in an earlier draft of
   `fig05_valencia_return_levels.png`; that split lives only in a notebook
   not yet part of a tagged release. Regenerated the figure from a live,
   end-to-end re-execution of the two archived notebooks
   (`01_data_exploration.ipynb`, `02_extreme_value_analysis.ipynb`),
   showing only the single-station and pooled-regional-RFA results those
   notebooks actually produce; updated the table/caption/text
   accordingly and removed the now-unnecessary citation this had required.
3. **Metadata table overflow and C5/C6 density.** `C6`'s exhaustive
   dependency listing made the mandatory metadata table taller than the
   page (`Float too large for page by 104pt`); condensed C6 to reference
   `pyproject.toml` and the extras by name, with the full listing moved to
   Software architecture (\S2.1) where page height is not constrained.
   `C5` was corrected to state the Python 3.9-3.12 CI matrix instead of
   "3.12 only", matching \S2.2.
4. **Figure/text accuracy pass.** OpenTURNS was listed as an optional lazy
   dependency in \S2.1 despite being in `pyproject.toml`'s core
   `dependencies`; removed from that list (it is still imported lazily,
   just not optional). Three references in `references.bib`
   (`teutschbein2012biascorrection`, `hosking1997rfa`, `genest2007copulas`)
   were defined but never cited despite grounding modules the paper
   describes (bias correction, regional frequency analysis, copulas); now
   cited in \S2.2. `fig03_besaya_ensemble.pdf` panel (a) was found to plot
   the same Manning-roughness ensemble as Figure 2 of the companion
   `papers/besaya_manning_sensitivity` manuscript (same seed, same data,
   near-identical vertical blue boxplot); regenerated with a different
   orientation and a land-cover-grouped categorical colour encoding
   (`references/palette.md` of this repo's `dataviz` skill) so the two
   papers no longer carry visually near-duplicate figures of the same
   input ensemble. `\FloatBarrier` added after the module table (\S2.2) to
   stop it drifting three pages from its introduction, past unrelated
   content, into a mostly-blank page.

## Major-revision changes (30 July 2026)

In response to a simulated editorial review recommending major revision,
the following changes were made to `main.tex` and this audit:

- Removed conference proceedings and submitted (not accepted) manuscripts
  as impact evidence throughout (Impact section, illustrative-examples
  discussion). Only published journal articles, one in-press journal
  article, and the software's own Zenodo records now support impact
  claims.
- Removed the case-coverage matrix figure entirely: two of its nine rows
  named applications ("Atlantic basin", "Panama atlas") that do not exist
  in this project, and the remaining rows mixed published and unpublished
  evidence in a way a reviewer could not verify cell-by-cell. Replaced
  with one sentence citing only the two additional applications
  (Andean hydropower, SIMPCCe) backed by published journal articles.
- Fixed a figure/case mismatch: the Manning-roughness ensemble figure was
  captioned under the Besaya continuous-simulation case but documents the
  separate SFINCS--HEC-RAS demonstration case; moved to the correct case.
- Added a per-example reproducibility traceability table (notebook path,
  open/partial data, external engine requirement, reproduction tier),
  confirming the four illustrative-example notebooks exist directly in
  the pyhydra repository (`notebooks/pilot_cases/`), not only via HYDRA.
- Consistently repositioned HYDRA as a companion/optional deployment
  layer (not co-equal subject matter) in the abstract, architecture
  section, illustrative-examples intro, Impact and Data availability.
- Impact section rewritten to separate published methodological impact
  from software-product impact, and to explicitly state that independent
  adoption metrics (downloads, external contributions, teaching/
  commercial use) are not yet available, rather than omitting the
  question or overstating internal use.
- Clarified that `pip install` refers to installation from the GitHub
  repository (`pip install git+https://...`), since pyhydra is not yet
  published on PyPI.
- Minor fixes: expanded all table abbreviations (GEV, GPD, NSE, KGE,
  PBIAS, IDW, GP, DSS, SCE-UA, RBF) in a table footnote; unified "M30" to
  "M-30" throughout; replaced "$\sim$1M" with "approximately one
  million"; resolved a ~44pt overfull hbox in the architecture
  description; added the public demonstration deployment URL with an
  access date and an explicit non-permanence caveat.
- The manuscript has five figures, well within the six-figure limit.

## Manuscript requirements

| Requirement | Status | Evidence or action |
|---|---|---|
| Original Software Publication template | Pass | `main.tex` uses the official `preprint,12pt,a4paper` class settings, zero paragraph indentation and the five mandatory main sections. |
| Maximum 3,000 words (running text) | Pass, small margin | Abstract + body (excluding metadata table, captions, references, declarations): ~2,900 words by `texcount`. Do not add further body text without cutting elsewhere. |
| Maximum six figures | Pass | Five figures are cited and embedded. |
| Abstract no more than 250 words | Pass | ~227 words; no citations; abbreviations are defined or established. |
| One to seven English keywords | Pass | Six keywords. |
| Required metadata and current code version | Pass | Mandatory C1--C8 table lists a single metadata repository (pyhydra, C2), per the guide's requirement of one GitHub link; the companion HYDRA repository is cited separately in the text, not in the table. Fits on one page (no oversized-float warning). |
| Five mandatory sections | Pass | Motivation and significance; Software description; Illustrative examples; Impact; Conclusions. |
| Current executable software version | Pass | Required heading present after the references, naming the exact commit and DOI. |
| CRediT statement | Present; author approval required | Every author must approve before submission. |
| Funding statement | Present; author approval required | Project PCI2024-153483 (WaMA-WaDiT), MICIU/AEI and EU co-funding, with the sponsors' no-role statement. |
| Competing-interest declaration | Present; declarations-tool upload still required | The no-known-competing-interests statement is in the manuscript. Every author must still complete Elsevier's declarations tool and upload its editable output. |
| Generative-AI declaration | Present | Identifies ChatGPT, Codex (OpenAI, versions not recorded) and Claude Sonnet 5 (`claude-sonnet-5`, Anthropic), what each assisted with and when, and states assistance did not extend to designing methodology or validating scientific content. AI-assisted figures are identified in their captions. |
| Data-availability statement | Present | Confirms open software/notebooks and explains why restricted model projects or project datasets are not redistributed. |
| Software citation | Pass | pyhydra (metadata subject) and the companion HYDRA platform are cited separately through their own Zenodo records (specific-version DOI in the manuscript; concept DOI in each repository's own README/CITATION.cff). |
| Test suite / software quality evidence | Pass, with honest gaps disclosed | 256 tests across 16 modules; 256/256 passing on Python 3.10-3.12, 255 passing + 1 skipped on 3.9 (an older-PyMC/NumPy-2.0 incompatibility, guarded to skip rather than fail); 27-28% line coverage, concentrated in statistical/modelling-adapter code. Verified in a public GitHub Actions run tied to the cited commit. |
| Highlights | Pass | `highlights.txt`, five bullets, 71-78 characters each (limit 85), no unexplained acronyms. |
| Graphical abstract | Optional, absent | Recommended but not required. |

## Repository requirements

Only the repository linked in the code metadata table (C2) -- pyhydra -- is
contractually bound by the guide's GitHub-layout requirements. HYDRA is
described and cited in the manuscript as a companion deployment platform,
but is not the C2 metadata repository, so its layout is not a submission
blocker. It is listed below for completeness only.

| Requirement | pyhydra (C2, binding) | HYDRA (cited, not binding) | Status |
|---|---:|---:|---|
| Public GitHub repository | Public | Public | Verified. |
| Permanent version link | `v0.1.7` tag, matches Zenodo `10.5281/zenodo.21705553` | `v0.1.2` tag, matches Zenodo `10.5281/zenodo.21705293` | Verified via the Zenodo API against each tag's commit. |
| Well-documented `README.md` | Present, current | Present, current | Updated this round; installation, purpose, extras and citation all reflect the current release. |
| License file | `LICENSE` (MIT) | `LICENSE` (MIT) | The claim in an earlier draft of this audit that SoftwareX requires the exact filename `LICENSE.txt` could not be verified against the current Guide for Authors; GitHub itself recognises `LICENSE` as the canonical license file. Left as-is; revisit only if Editorial Manager flags it. |
| Source code under `repo/src` | Resolved -- `src/pyhydra/` | Not compliant (`api/`, `web/`, `notebooks/`, `docker/` at repo root) | None required for submission, since HYDRA is not the C2 repository. |
| Recognized open-source license | MIT | MIT | Confirmed. |
| Accepted-version archival by SoftwareX | Future action | N/A (not the metadata repository) | Be prepared for Elsevier to copy the accepted pyhydra code to its GitHub organization. |

## Files for Editorial Manager

- Upload `main.pdf` as "Manuscript (Word or PDF file)".
- Upload a ZIP containing `main.tex`, `references.bib`, all five figure
  files (and the TikZ `.tex` sources / `make_fig*.py` scripts, for the
  authors' own records -- not required by Elsevier) as "Zip file
  containing LaTeX source files".
- Upload `highlights.txt` as the editable highlights file.
- Upload the declarations-tool `.doc` or `.docx` separately.
- Upload each final figure as a logically named separate artwork file.
- Supply full corresponding-author contact details in Editorial Manager:
  email, postal address and telephone number.
- Confirm the author order, spelling and affiliations before first submission;
  SoftwareX does not allow authorship changes after acceptance.
- Run spelling/grammar checks and confirm that every in-text reference appears
  in the bibliography and vice versa.
- Select article type "Original Software Publication".
- Keep Acknowledgements as the final section immediately before the
  bibliography; declarations and the CRediT statement precede it.

## Figure checks

- Vector figures (`fig01`, `fig02`, `fig04`) are TikZ-generated PDF with
  embedded Type 1/TrueType fonts.
- `fig03_besaya_ensemble.pdf` and `fig05_valencia_return_levels.png` are
  matplotlib figures generated from real pyhydra API output (scripts in
  this directory); `fig03` was regenerated with `pdf.fonttype = 42` to
  embed TrueType rather than Type 3 fonts.
- Every figure is cited in numerical order and has a self-contained caption.
- Colour is used redundantly with labels/marker shapes, not as the sole
  identity channel.
- SoftwareX/Elsevier currently advises against combining different images or
  graphs into one composite because of accessibility; the two-panel
  `fig03`/`fig05` figures label each panel and describe both in the caption
  text rather than relying on panel position alone.

## Remaining submission blockers

1. Obtain approval of the funding, competing-interest and CRediT statements
   from both authors, and upload the declarations-tool Word file.
2. Add the corresponding author's telephone number in Editorial Manager.
3. Final read-through by both authors immediately before submission, since
   this audit and the manuscript were prepared with AI assistance (see the
   Declaration of generative AI in `main.tex`) under author supervision.
