# Progress

Updated: 2026-09-02

## Infrastructure

| Item | Status |
|---|---|
| Repo restructure, old scaffold removed | done |
| Taxonomy parser — 974 stable ids | done |
| Content schema + validator | done |
| Build index + glossary extraction | done |
| React app shell, routing, search | done |
| GitHub Actions CI + Pages deploy | done |
| Agent definitions | done |
| Id stability lock (CI-enforced) | done |
| Reading register, outside agent reach | done |
| Voice / length / term-ownership guards | done |
| Canonical terminology lockfile | done |
| Guardrail test suite (23 tests) | done |
| Split index into catalog + lazy chunks | done |
| Offline / PWA service worker | done |
| Dark mode, furigana toggle | done |
| Reading progress, prev/next, continue card | done |
| Glossary and settings pages | done |
| Employer context resolved; curriculum rebalanced | done |
| Source registry + citation links | done |
| Corpus view (filterable) | done |
| Sources index page | done |
| Markdown tables + h3 rendering | done |
| Image registry + licence enforcement | done |
| Image needs list drafted | done |
| Photographs sourced | not started |
| SVG diagrams authored | not started |
| Calculators | not started |
| Diagrams (original SVG) | not started |

## Content

| Stage | Written | Total |
|---|---|---|
| 1 — Before you fly | 5 | 386 |
| 2 — First year | 1 | 389 |
| 3 — Becoming skilled | 0 | 209 |
| 4 — Later (stubs only) | 0 | 162 |

1146 items total, up from 974. Ductwork, 防露, occupied buildings, building
services plant and systems, new build sequence, and an industrial delta chapter.

Six items are written, all at `status: review`:

| Item | Stage | Where |
|---|---|---|
| `01.1.01` general construction workflow | 1 | section 01.1, PR #4 |
| `01.1.02` mechanical equipment trades overview | 1 | section 01.1, PR #4 |
| `01.1.03` relationship between the trades | 1 | section 01.1, PR #4 |
| `01.1.04` subcontractor and site organization | 1 | section 01.1, PR #4 |
| `02.3.01` why insulation reduces heat flow | 2 | general-craft exemplar |
| `09.1.03` three-point contact | 1 | safety-critical exemplar, PR #2 |

Section 01.1 is complete. 01.2 onward is the next writing work.

Two of the six are the exemplars — the quality bar. Open one and match it
before writing.

- `02.3.01` — general craft, chapter 02.
- `09.1.03` — safety-critical, chapter 09. Different shape: the sourcing
  requirement bites, and the places where no source exists are stated in the
  text rather than filled in.

Nothing is approved, and nothing needs to be. `content/_approved.json` is
empty, `approved` is no longer an allowed status value, and the register is a
reading record — an id in it means a human read that item and accepted it — not
a permission to proceed. Writing is not gated on it.

All six have been fact-checked, adversarially, and the reports are in
`reviews/`. That includes the every-line review CLAUDE.md asks for on a
`safetyCritical` chapter, which `09.1.03` had never had.

The owner has read them and the findings are fixed. Each report keeps its
findings as written and carries a dated **Resolution** section saying what was
done with each one, including the two left alone deliberately: whether
`quotable: false` covers an open-access publication's statistics, and the same
flag on a CC-BY paper. Both are policy questions, not errors.

## How to update this file

Move a row, change the date. One source of truth. Do not create new progress
files.
