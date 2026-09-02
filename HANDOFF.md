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

**Confirmed by the owner:** ductwork and pipework are roughly an even split, and
he wants both covered completely rather than one favoured. New build versus
occupied-building renovation did not come up in his interview, so both are
covered. Factory work is unknown, and is handled as a delta chapter rather than
a parallel curriculum.

**Scope decision.** The owner asked for complete coverage of every case. That is
compatible with the deadline only because coverage and writing order are separate
decisions here: every topic gets an id and a place in the taxonomy, and stage
governs what actually gets written first. Do not let a request for completeness
turn into writing stage 3 material before stage 1 exists.

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

A second pass then closed the remaining gaps the owner flagged:

- **40 — building services plant.** AHUs, chillers, calorifiers, heat exchangers,
  pumps, tanks, fan coil units. Chapter 13 covers equipment in an industrial
  register; this is the plant they will actually meet in a building. 24 items,
  safety-critical for surface temperature and live plant.
- **41 — building services systems.** Chilled water, refrigerant, LTHW, domestic
  hot and cold, drainage, risers and distribution. Identifying which system a
  pipe belongs to before touching it. 25 items.
- **42 — industrial work, what changes.** Deliberately a delta chapter, not a
  parallel curriculum: higher temperatures, permits to work, confined space,
  asbestos in older plant, heavier documentation. 15 items, stage 3.
- **01.8 to 01.9 — new build and handover.** Sequence, phasing, working before
  the building is closed, snagging, photographing work that will be hidden.

Total is now **1146 items**. Nothing has ever been renumbered; every
pre-existing id is intact, including the exemplar.

### Still worth demoting

Not yet done: seismic and movement joints, refinery-scale geometry, the
industrial QA/QC apparatus in chapter 20 that the previous scaffold already
flagged as inspector-oriented rather than installer-oriented. These are stage 3
already, so the ordering handles most of it, but the content should be written
for building services when it is reached.

## First technical task — done

**Split the generated index.** `build-index.mjs` now emits two things instead
of one `index.json`:

- `src/generated/catalog.json` — ids, titles, summaries, terms, sources,
  stage, status, everything search and navigation need, for all 1146 items,
  written or stub. No item bodies. Statically imported, loaded up front.
- `src/generated/chapters/chNN.json` — one file per chapter, `id -> body`,
  authored items only. `App.tsx` loads a chapter's chunk on demand via
  `import.meta.glob` when a reader opens an item in it, and only that
  chapter's chunk.

Verified in a browser (Playwright against `vite`): opening the one written
item (`02.3.01`) fetches `catalog.json` plus `chapters/ch02.json` only — no
other chapter chunk loads. Search and the Corpus filter still work against
the catalog alone. Stub items and the chapter list trigger no extra fetch at
all.

At the current one-written-item state the byte counts are close (the old
single file was 360,786 bytes; catalog.json is 342,667 bytes plus a 6,674
byte `ch02.json`) because catalog metadata for 1146 items, not body text,
dominates the file today. The split doesn't pay off yet, it pays off going
forward: `catalog.json` stays roughly flat as content is written, while body
text — which will run several KB per item — moves into chunks a reader only
downloads for the chapter they open.

`npm run check` passes. Taxonomy and schema untouched.

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
