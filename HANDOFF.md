# HANDOFF — read after CLAUDE.md

State as of 2026-09-02. Written for a session with no conversation history.

## Where the project stands

The foundation is built and deployed. One exemplar item is written. Content
writing has **not** started, and should not start until the two open questions
below are answered.

## The employer, confirmed

日建工業株式会社 (Nikken Kogyo), 山口県岩国市御庄4-105-5. Part of the 21-company
みどりグループ. Founded 1963, **six employees**. Licensed 熱絶縁工事業.

Stated business: 保温・保冷・防露・断熱工事、各種ダクト工事設計. Work covers
drainage and supply pipework, HVAC ducts, refrigeration and cold-storage plant,
and heating plant, in offices, commercial buildings, hospitals and government
buildings. One job listing states the scope as buildings **excluding factories**.
Another mentions 工場, so a light industrial layer is retained rather than pruned.

Work area is Iwakuni outward across all of Yamaguchi and western Hiroshima. Day
trips. Projects average about two months. Small-crew, multi-site, van-based —
not one large site with a big gang.

Partner-company tradesmen all hold 1級熱絶縁施工技能士, so certification is the
cultural norm there. Still stage 4 for these four, but they should know from the
start that it is the expected path rather than an optional extra.

**Confirmed by the owner:** ductwork and pipework are roughly an even split.
Whether the work is new build or occupied-building renovation did not come up in
his interview, and whether there is any factory work is unknown.

### What that changed

The original outline was written before any of this was known, and had **zero
ductwork items out of 974** for roughly half the daily work. Three chapters were
appended in `docs/curriculum-extensions.md`:

- **37 and 38 — ductwork.** A different craft from pipe: board and blanket
  instead of preformed sections, pins and washers instead of tie wire, different
  corner and joint detail. 56 items.
- **39 — 防露.** Was folded into chapter 16's 防湿. On chilled water and AC ducts
  through a humid Japanese summer, condensation control is the daily craft, and
  the employer names it in their own scope. 19 items, safety-critical.
- **01.4 to 01.7 — occupied buildings.** Chapter 01 assumed a construction site.
  Much of this work is inside live buildings: hospital ceiling voids, school
  plant rooms in the holidays, offices around other trades. Chapter 01 went from
  15 items to 37.

Total is now 1071 items. Nothing was renumbered; every pre-existing id is intact.

### Still worth demoting

Not yet done: seismic and movement joints, refinery-scale geometry, the
industrial QA/QC apparatus in chapter 20 that the previous scaffold already
flagged as inspector-oriented rather than installer-oriented. These are stage 3
already, so the ordering handles most of it, but the content should be written
for building services when it is reached.

## First technical task

**Split the generated index.** `src/generated/index.json` currently ships every
item body in one file. At one written item it is 267 KB. At 800 full-depth
items it would be several megabytes, all downloaded before the first paint.

The fix: emit a catalog (ids, titles, summaries, terms — enough for search and
navigation) loaded up front, plus per-chapter body chunks loaded on demand via
dynamic import. Do this before content volume makes it painful.

## Then, in order

1. Offline support. The site gets used in plant rooms with no signal. Service
   worker, cache the catalog and visited chapters.
2. Second exemplar from a safety-critical chapter (08 or 09), because safety
   content has a different shape and both exemplars need approving before the
   writing agents run.
3. Stage 1 content, chapter by chapter. Chapter 01 first — it is the
   most under-weighted chapter in the source relative to how much these
   readers need it.
4. Calculators, with unit tests and a second independent source per formula.
5. Original SVG diagrams.

## Things already decided — do not relitigate

- Stages replace the source outline's Part 1 / Part 2 split.
- Stage 4 stays as stubs. Exam preparation is years away and 技能検定 2級
  normally requires work experience these readers do not have.
- Flashcards and gamification come **after** articles are done. Terms are
  already stored as structured fields so the deck can be generated later
  without rewriting anything.
- Chapter 23's 57 vocabulary items were discussed for distribution into the
  chapters that use them. Not yet done, not yet rejected.
- Hash routing, because GitHub Pages cannot rewrite paths.
- Zero-dependency scripts. The validator and parser run on plain Node so they
  work anywhere without an install step.

## Environment notes

The owner works from the Claude mobile app using Claude Code **cloud sessions**
— sessions run on Anthropic infrastructure, not a local machine, and persist
after the phone is put away. There is no local dev machine most days.

This means: never write instructions that assume a local terminal, and keep
heavy work in CI rather than in-session.

Single Claude Pro plan. Claude Code and chat share one quota. Writing agents
must be pinned to `model: sonnet` — an unpinned subagent inherits the main
session's model and silently burns Opus quota.

## Security

A GitHub classic personal access token with full account scope was shared in
chat during setup. The owner chose to proceed with it. It should be rotated to
a fine-grained token scoped to this repository alone.
