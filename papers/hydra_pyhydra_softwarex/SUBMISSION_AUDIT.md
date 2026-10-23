# SoftwareX submission audit

Audit date: 30 July 2026. Major-revision pass: 30 July 2026. Minor-revision
passes: 30-31 July 2026 (four rounds, summarised below). Content update:
4 August 2026 (pyhydra v0.2.0, summarised below). Release 0.2.1 and M-30
rewrite: 13 October 2026 (summarised first). Session update:
14 September 2026 (summarised first, below -- corrects two stale figures
left over from the 4 August pass and fixes a real compilation defect this
audit had not caught).

Official sources:

- [SoftwareX Guide for Authors](https://www.sciencedirect.com/journal/softwarex/publish/guide-for-authors)
- [Official Original Software Publication LaTeX template](https://legacyfileshare.elsevier.com/promis_misc/softwarex-osp-template.tex)

## Release 0.3.0: licence change to GPL-3.0-only (23 October 2026)

pyhydra builds on GPL-3.0 code, so the MIT licence of the earlier releases was
not valid for a derived work (supervisor comment). Chosen by the authors:
**GPL-3.0-only**, version **0.3.0**; HYDRA stays MIT (independent project).

- pyhydra `v0.3.0` (commit `2ea0100`, tag `v0.3.0`, Zenodo
  `10.5281/zenodo.23594513`, licence recorded by Zenodo as GPL-3.0; CI run
  `39945818609`): `LICENSE` and `LICENSE.txt` hold the GPLv3 text. Same test
  results: 297/297 on Python 3.10-3.12, 296 + 1 skipped on 3.9; coverage 32%
  (31% on 3.9); no `exit code 128` annotation.
- Manuscript moved to v0.3.0 (C1-C3, test paragraph, executable version,
  `navas2026pyhydra`, abstract, Impact, Conclusions, Data availability, AI
  statement) and states the GPL basis in Software architecture. Earlier
  records v0.2.1 and v0.2.2 remain archived as MIT.
- The template's C3 asks for "one of the approved licenses": GPL-3.0 is one.

## Supervisor review (23 October 2026)

Comments from the second author and the changes made:

- **Figure text too small**: figures 1, 2 and 3 (TikZ) were redrawn at the
  final printed width (about 137 mm) with 8.5 pt text, and the Besaya and
  Valencia plots were regenerated at that width with 9 pt text, so none is
  scaled down in the article (before, the effective size was about 5-7 pt).
  The redrawn M-30 figure also fixes "1,000 selected events" to the 625 events
  of the published study.
- **pyhydra in bold** throughout the running text, captions, tables and
  title (`\pyhydra{}` macro); not in code, URLs, file names or citations.
- **Acknowledgements**: references to IHCantabria and the University of
  Cantabria removed (affiliations already show them); SIAR and AVAMET added
  as data providers; the Azure academic subscription is kept.
- **Open**: licence (GPLv3 constraint) and the length of the AI declaration.

## Zenodo deposit of the pilot-case data (14 October 2026)

The guide asks for research data to be deposited in a repository (Option C).
The Zenodo deposit `10.5281/zenodo.23366599` (draft id 23366599; four files:
README plus three zips; version 1.0.0; CC-BY-4.0) holds the Besaya
HEC-HMS/HEC-RAS projects and processed data, the M-30 sample and results and
the Valencia series. The optional 746 MB terrain zip is not uploaded. The
manuscript cites it as `navas2026pilotdata` (Data availability, Table 3,
bibliography). **The record must be published on Zenodo before submission**:
until then the DOI does not resolve. The repository README of pyhydra and
`pyhydra-get-data` still point to the private file share.

## Check against the Guide for authors (14 October 2026)

The authors saved the current Guide for authors as a PDF (ScienceDirect,
14 October 2026) and it was read in full. Confirmed as compliant: GitHub
repository with `README.md`, `LICENSE.txt` (added in v0.2.2) and code under
`src/`; at most six figures; abstract at most 250 words (140); one to seven
keywords; highlights (five bullets, 71-78 characters, file name contains
"highlights"); numbered sections and cross-references; Acknowledgements
directly before the references; CRediT roles; standard funding sentence;
generative-AI statement in its own section before the references, with the
AI-assisted figures identified in their captions; numbered square-bracket
references in order of appearance with DOIs; software and dataset
references; tables without vertical rules; no maps; LaTeX upload as PDF plus
a zip of sources.

Changed after the check:

- References with more than 6 authors (ERA5, GPM/IMERG, GloFAS, SoilGrids)
  now list the first 6 plus "et al."; the two Spanish-language journals use
  LTWA-style abbreviations (`Ing. Agua`, `Rev. Obras Públicas`).
- Valencia figure re-exported as vector PDF with embedded fonts (bitmapped
  line drawings would need 1000 dpi); the two data figures whose plotting
  scripts were written with AI assistance now say so in their captions.

Open after the check (decisions for the authors):

1. **Word count**: the limit counts abstract, running text, captions and
   footnotes. The text before the CRediT statement is about 3,760 words; if
   the end sections (CRediT, funding, declarations, data availability, AI
   statement, acknowledgements) are also counted it is about 4,490.
2. **Research data (Option C)**: the journal requires depositing research
   data in a repository, citing and linking it, or stating why it cannot be
   shared. The SFINCS--HEC-RAS data are on Zenodo; the other pilot-case data
   are served from a private file share, which is not a repository.
3. **Multi-panel figure**: resolved. The Besaya figure was split into two
   figures (now six, the maximum), regenerated from the open Zenodo dataset
   `10.5281/zenodo.23104366` (`make_fig03a_besaya_manning_input.py`,
   `make_fig03b_besaya_flooded_area.py`). The old panel (a) was generated
   live with seed 42, and that dataset's README states that the matrix
   originally deposited did not match the production matrix (0 of 1000 rows);
   the new panel (a) plots the corrected production matrix. Panel (b) now
   shows 995 valid SFINCS runs (five non-converged runs removed) instead of
   1,000; the median is unchanged (0.539 km2). Figure titles were removed
   from inside the artwork (the guide wants the title in the caption only).
4. Figure 1 text is about 7 pt before scaling to the text width.

## Release 0.2.2 (14 October 2026)

The official OSP template says a `Licence.txt` file is mandatory and that
a paper without it "will be returned". pyhydra `v0.2.1` only had `LICENSE`,
and the tag cannot change, so `v0.2.2` was cut:

- pyhydra `v0.2.2` (commit `cbbb6bb`, tag `v0.2.2`, Zenodo
  `10.5281/zenodo.23365448`; CI run `38554754081`): adds `LICENSE.txt`
  (identical to `LICENSE`) and the CI clean-up fix (`wiki` gitlink removed).
  Same test results as v0.2.1: 297/297 on Python 3.10-3.12, 296 + 1 skipped
  on 3.9; coverage 32% (31% on 3.9); no `exit code 128` annotation.
- Manuscript: C1, C2, C7, the test paragraph, Table 3 URL, the executable
  software version, `navas2026pyhydra` (DOI and version) and the paper
  README moved to v0.2.2. The `v0.2.1` release and DOI remain archived.

## Coherence review against SoftwareX (13 October 2026, later pass)

Whole-manuscript re-read against the official OSP template and the
guide for authors, with each number re-checked at the `v0.2.1` tag.
Verified, no change needed: preamble/class identical to the official
template (`elsarticle`, `preprint,12pt,a4paper`); C1-C8 metadata rows;
mandatory sections and order; 15 sub-modules = 15 rows of the module
table; 18 test files; notebook counts 9/6/3/7 per pilot case; CI figures
(296+1 skipped on 3.9, 297 on 3.10-3.12; 31-32% coverage; run
`38400271759`); Zenodo titles, versions and creators of
`10.5281/zenodo.23342206` (pyhydra v0.2.1) and `10.5281/zenodo.21705293`
(HYDRA v0.1.2); 25 cited keys = 25 defined (+ `navas2026besayadata`);
five figures; highlights 71-78 characters; abstract about 236 words.

Check against the official OSP template (`softwarex-osp-template.tex`,
downloaded 13 October 2026), whose "Before you begin" box lists the hard
rules:

- GitHub-only repository in the metadata table: pass (C2).
- 4,000-word limit: pass (about 3,850; the template also mentions a 6-page
  guideline for the main text, subordinate to the word limit).
- At most six figures: pass (six).
- Five mandatory sections, "Current executable software version": pass.
- **Metadata table left column** must be left "as it is": C2, C3, C5, C6, C7
  and the caption did not match the template wording; restored.
- **Abstract**: the template says "Ca. 100 words"; ours had 236. Condensed to
  140 words (facts unchanged; the 0.83 m and "six articles" claims remain in
  the body).
- **`Licence.txt`**: the template says a `Licence.txt` file is mandatory and
  the paper "will be returned if these are missing". pyhydra has `LICENSE`
  only. Not changed here; see the open items below.

Changes made:

- **Urrea et al. (2026) is published** (J. Hydrol. 677, 135762, September
  2026, via Crossref). Bibliography entry updated and Impact now says
  "six published journal articles" instead of "five published and one in
  press".
- **Impact overclaims removed.** The text said the two-engine comparison
  was "exercised" in Sect. 3, but Sect. 3 scopes it out, and that the M-30
  comparison "begins to quantify" a shift in design estimates, which is a
  published result rather than a pyhydra output. Both sentences now say so.
- **Conclusions**: "cross-engine Monte Carlo comparison" became "Monte
  Carlo ensembles run through two hydraulic engines"; "decade-long"
  became "multi-year" (earliest cited work is 2018).
- **Closing paragraph of Sect. 3** listed three execution paths for four
  workflows; the SFINCS--HEC-RAS path was added.
- **Figure 2 was never cited in the text** (`fig:reproducibility` had no
  `\cref`); now cited in the Reproducibility-boundary paragraph.
- **Code snippet** checked against the `v0.2.1` API (imports, signatures,
  `fit` returning `self`): correct. Its comment called the return value a
  "joint return period", but `joint_return_period` returns the
  iso-return-period contour; comment fixed.
- **References** checked against Crossref (all DOIs resolve; years, authors
  and journals match). The three Spanish-language journal articles carried
  English titles; they now use the original titles with "In Spanish" notes,
  and "Pena" became "Peña".
- **Case figures re-checked against the `v0.2.1` notebooks**: M-30 (1,761
  events, 17 gauges, 303 sections, 7.61/6.78 m, 10,000 / 100,000 / 625
  events, 3,486 pairs, mean |Δρ| 0.011), Valencia (710.8 mm, nine stations,
  218-271 -> 756-1,241 mm, factor 3.47-4.58), Besaya (13 stations, 1970-2012,
  k = 6) and Manning (1,000 combinations, 9 classes, all cited functions
  exist). Besaya claims checked against the primary sources
  (2018 master's thesis, UC repository handle 10902/10636, and the ROP 3598
  article): 42 years of daily data (Oct 1970-Oct 2012), 13 rain gauges and
  k = 6 (cross-validated) are in the thesis. The "13% of the population and
  20% of the surface" figure is also in the thesis only ("pudiendo llegar a
  afectar", over the return periods analysed), not in the ROP article, and
  it is not "population within the mapped floodplain". Text corrected and
  the thesis added as `navas2018tfm`.
- **Compiled with Tectonic 0.17** (bibtex included) on 13 October 2026:
  0 errors, 0 undefined references or citations, 22 A4 pages, no overfull
  box above 3 pt. Remaining warnings are harmless: underfull boxes in the
  tables, `h` float specifiers promoted to `ht`, hyperref
  "token not allowed in a PDF string" for the corresponding-author mark,
  and PDF-1.7 figures included in a 1.5 output.
- **Bibliography rendering**: `elsarticle-num` lower-cased proper nouns in
  titles ("río besaya", "calle 30 (madrid)", "neyman-scott", "Climada",
  "Hydromt"); protected with braces in `references.bib`.
- **Table 3** was set in very narrow columns with broken
  `pyhydra-get-data` tokens and sat four pages after its first citation;
  columns widened and left-aligned, placement `[!htbp]` (now one page
  after the citation).
- **Paper `README.md`** still pointed to `v0.2.0` and its DOI; now v0.2.1.
- **Word count measured, not estimated.** Abstract + text + captions
  + footnotes, excluding tables and code: about 3,770 words (about 4,300
  if the end declarations, CRediT, funding, data availability, AI
  statement and acknowledgements are also counted). The earlier
  "~3,000-3,500" figure was too low. Under the 4,000-word limit if the
  declarations are excluded, as the guide indicates; margin is thin.
- `wiki` gitlink removed from pyhydra `main` (commit `dd5d0ed`); the
  `git exit code 128` annotation no longer appears in CI (run
  `38406048016`, success on 3.9-3.12). The `v0.2.1` tag still contains
  the gitlink, which does not affect the archived code.

Still open, needs the authors:

1. **Data availability vs. the Azure share (listed, names only).**
   `pilot_cases/los_corrales_buelna` holds the authors' HEC-HMS and HEC-RAS
   projects and processed outputs, but also raw third-party records: 13
   rain-gauge files (AEMET station codes) and two flow-gauge spreadsheets
   (Torrelavega, Las Caldas), plus about 3.7 GB of CORDEX pickles.
   `valencia_dana` holds daily series for nine stations of the AEMET, SIAR
   and AVAMET networks. Decision (13 October 2026): Table 3 no longer says "Yes" for Besaya and
   Valencia (now "Partial") and Data availability states that the
   third-party records are not offered as open data and follow their
   providers' terms. Files were not removed from the share and permissions
   were not requested. Still open: confirm that those terms
   allow redistribution, and deposit the data on Zenodo, because the share
   is private infrastructure behind a share-wide token that expires
   2027-12-31.
2. **Corresponding-author email** `@alumnos.unican.es`: kept by the authors
   (decision 14 October 2026), although the thesis defence is on
   27 October 2026 and the account may be deactivated.
3. **Generative-AI declaration**: extended on 14 October 2026 with the
   final review session (Claude Sonnet 5.5, `claude-sonnet-5-5`).
4. `fig05_valencia_return_levels` is now a vector PDF with embedded fonts (the guide asks 1000 dpi for bitmapped line drawings).
5. HYDRA demo URL access date (30 July 2026) not re-checked.
6. `main.pdf` rebuilt with these edits (Tectonic, 22 pages).

## Release 0.2.1 and M-30 rewrite (13 October 2026)

A second independent review opened every pilot notebook to check that each
illustrative example actually executes with pyhydra. The M-30 case did not.
At `v0.2.0`, only notebook 04 (MaxDiss) imported pyhydra. Notebook 03 drew
no copula samples, not even with OpenTURNS, and notebooks 05-06 read the
final 2024 design-depth tables plus hard-coded design flows. The "+0.83 m"
headline was therefore a published result, not a pyhydra output. The
engine outputs needed to recompute it were not found: the HEC-HMS runs of
the FORESEE project were saved outside the backup disk, and no annual
maximum flows were available. A mixed fix was applied:

- **pyhydra v0.2.1** (commit `4a50962`, tag `v0.2.1`, Zenodo
  `10.5281/zenodo.23342206`; CI run `38400271759`): 297/297 tests pass on
  Python 3.10-3.12, 296 + 1 skipped on 3.9; coverage 32% (31% on 3.9).
  - `FloodEventCopula` gained restricted marginal families, zero-inflated
    marginals and vectorised sampling. On the real M-30 data the previous
    all-family BIC search picked Fréchet marginals for dry-gauge rainfall
    and sampled values of order 1e70 mm. Six unit tests were added.
  - M-30 notebook 03 now fits the 84-variable copula with pyhydra to the
    archived 10,000-event synthetic sample, used as a proxy because the
    historical events are not redistributable. The regenerated catalogue
    reproduces dry shares and rank dependence (mean |Δρ| = 0.011).
  - Notebook 04 runs pyhydra MaxDiss for 625 events in the full space.
    The authors confirmed (13 October 2026) that the published study
    simulated 625 events. The archived selection and the FORESEE HEC-HMS
    project contain 1,000.
  - Notebooks 05-06 state that their design depths are archived results.
- **Manuscript.**
  - M-30 is now described as re-running copula generation and MaxDiss with
    pyhydra, with the 0.83 m attributed to the published study and read
    from its archived outputs. The abstract, Fig. 4 caption, Table 3 and
    Impact were updated to match.
  - "compound-event" became "extreme-rainfall".
  - `pip` commands no longer imply PyPI.
  - The generative-AI declaration was extended to 13 October 2026.
  - All metadata (C1/C2/C7, test paragraph, CI run, executable version,
    `navas2026pyhydra` DOI) moved to v0.2.1.
- **Still open before submission.**
  - The public read-and-list SAS token in `pyhydra.data.download` covers
    the whole `dockerdata` share, and it expires 2027-12-31. Restrict it,
    and deposit the Valencia data on Zenodo.
  - Re-check the HYDRA demo URL access date, which is still 30 July 2026.
  - Check whether Urrea et al. (2026) is still "in press".
  - Remove the untracked `wiki` gitlink (no `.gitmodules`) that causes the
    harmless `git exit code 128` annotation in CI.

## Session update (14 September 2026)

Independent re-review against the guide for authors fetched directly as a
PDF (not from memory), plus a real `pdflatex`+`bibtex` compile and a live
audit of the `pyhydra`/`HYDRA` GitHub repositories and the connected local
checkout. Findings and fixes:

- **Word/page limits were misstated in the table below and are corrected
  here.** The guide's real limit is **4,000 words** (not 3,000), counting
  abstract + running text + captions + footnotes and excluding title,
  authors, affiliations, references and the metadata table; there is
  **no page limit** at all (compiled length is 22-23 pages with
  `elsarticle`, which is normal and not a submission concern). The
  manuscript is well within the real limit (~3,000-3,500 words depending
  on whether the end declarations are counted), so this correction does
  not change the Pass verdict, only the reasoning behind it.
- **Abstract was 255 words at the start of this session**, not the ~227
  this audit previously recorded (the two must have diverged after the
  4 August content update). Trimmed back to 231 words; still a Pass
  against the real 250-word limit, with a comfortable margin now.
- **Real compilation defect found and fixed.** `\'a`/`\'e`-style TeX
  accents inside `\affiliation{organization={...}}` and in
  Acknowledgements produced visibly corrupted text in the compiled PDF
  ("Hidr ΩΩimmediateáulica" instead of "Hidráulica") under
  `elsarticle`+`hyperref`. This is not something `texcount` or a word-count
  pass would ever catch. Fixed by switching to literal UTF-8 accented
  characters; recompiled clean (0 errors, 0 undefined references) with the
  real `references.bib`.
- **Valencia DANA factor corrected.** The stated "factor of 3.2-4.6" does
  not match any method in `notebooks/pilot_cases/valencia_dana/02_extreme_value_analysis.ipynb`;
  the real minimum across all method/scale combinations (point and
  regional-RFA, MLE and L-moments) is 3.47. Corrected to "3.5-4.6".
- **Bibliography cross-checked against the real `references.bib`**: 25
  keys cited in `main.tex`, 25 entries defined, exact match both ways.
  Recompiled with the real bibliography: 0 undefined references, citations
  render as numbered brackets as the guide requires.
- **`highlights.txt` re-verified**: 5 bullets, 67-74 characters each,
  under the 85-character limit -- unchanged, still a Pass.
- **`LICENSE` copyright line** in both `pyhydra` and `HYDRA` said
  "Copyright (c) ... Salvador Navas, hidralab.com"; per an explicit
  authorial decision this session, "hidralab.com" was removed from both
  (pyhydra: committed directly in the connected local checkout; HYDRA:
  committed to local `main` via a worktree, **not yet pushed** -- run
  `git push` from the HYDRA repo to publish it).
- **`pyhydra`'s `main` branch is 4 commits ahead of the cited `v0.2.0`
  tag** (dropped the auxiliary `07_hec_ras_hydraulics_run.ipynb` that
  Table 3's footnote still describes as present, added two new
  notebooks). Not a defect as long as `v0.2.0` remains the tag/DOI cited
  by the manuscript; flagged here so a future re-tag does not silently
  invalidate Table 3 without a corresponding text update.

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

## Content update (4 August 2026)

pyhydra `v0.2.0` (commit `5552aa9`) added a fifteenth sub-module,
`pyhydra.uq`: a decision layer that measures, from a budget-charged pilot
design, whether an expensive solver's response can be emulated well enough
to justify a reduce-and-emulate strategy, or should instead be sampled by
direct Monte Carlo. Reflected throughout the manuscript: the architecture
now describes four functional blocks instead of three (`fig01_architecture`
redrawn with a fourth "UQ strategy" box); the module table
(`tab:modules`) gained a `uq` row; the "Uncertainty propagation and
analysis" paragraph (\S2.2) now describes the decision rule; and the
test-suite paragraph, C1/C2 metadata and both software citations were
updated to the verified `v0.2.0` state (291/291 tests passing on Python
3.10-3.12, 290 passed + 1 skipped on 3.9, 30-31% coverage, CI run
`30904958268`, DOI `10.5281/zenodo.21790226`). Per an explicit authorial
decision, the module is described only in Software functionalities -- no
new illustrative example/demonstrator was added, since a prospective
validation of the decision rule is the subject of a separate,
not-yet-published manuscript and is not cited here.

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
- The manuscript has six figures (the maximum).

## Manuscript requirements

| Requirement | Status | Evidence or action |
|---|---|---|
| Original Software Publication template | Pass | `main.tex` uses the official `preprint,12pt,a4paper` class settings, zero paragraph indentation and the five mandatory main sections. |
| Maximum 4,000 words (abstract + running text + captions + footnotes; excludes title/authors/affiliations/references/metadata table) | Pass, thin margin | Measured 13 Oct 2026: about 3,770 words excluding end declarations, about 4,300 including them (see the coherence review above). Limit checked 14 Sept 2026 against the guide fetched directly as a PDF. The template also states a 6-page main-text guideline, secondary to the word limit. |
| Maximum six figures | Pass (at the limit) | Six figures are cited and embedded; the former two-panel Besaya figure was split in two to follow the guide's rule against combining images in one file. |
| Abstract no more than 250 words (template: "Ca. 100 words") | Pass | 140 words as of 14 Oct 2026 (condensed from 236 to follow the template). No citations; abbreviations are defined or established. |
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
| Test suite / software quality evidence | Pass, with honest gaps disclosed | v0.3.0: 297 tests in 18 files; 297/297 passing on Python 3.10-3.12, 296 passing + 1 skipped on 3.9 (an older-PyMC/NumPy-2.0 incompatibility, guarded to skip rather than fail); 32% line coverage (31% on 3.9), concentrated in statistical/modelling-adapter code. Verified in a public GitHub Actions run tied to the cited commit. |
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
| Permanent version link | `v0.3.0` tag (commit `2ea0100`), matches Zenodo `10.5281/zenodo.23594513` | `v0.1.2` tag, matches Zenodo `10.5281/zenodo.21705293` | Verified via the Zenodo API against each tag's commit. |
| Well-documented `README.md` | Present, current | Present, current | Updated this round; installation, purpose, extras and citation all reflect the current release. |
| License file | `LICENSE` and `LICENSE.txt` (GPL-3.0-only; the official template requires `LICENSE.txt`) | `LICENSE` (MIT) | Resolved for pyhydra, the C2 repository. HYDRA is an independent MIT project and is not the C2 repository. |
| Source code under `repo/src` | Resolved -- `src/pyhydra/` | Not compliant (`api/`, `web/`, `notebooks/`, `docker/` at repo root) | None required for submission, since HYDRA is not the C2 repository. |
| Recognized open-source license | MIT | MIT | Confirmed. |
| Accepted-version archival by SoftwareX | Future action | N/A (not the metadata repository) | Be prepared for Elsevier to copy the accepted pyhydra code to its GitHub organization. |

## Files for Editorial Manager

- Upload `main.pdf` as "Manuscript (Word or PDF file)".
- Upload a ZIP containing `main.tex`, `references.bib`, all six figure
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
