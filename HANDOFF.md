# HANDOFF — read after CLAUDE.md

State as of 2026-09-03. Written for a session with no conversation history.

## Where the project stands

The foundation is built and deployed, and content writing has started. Seventeen
items are written:

- `01.1.01` to `01.1.04` — the whole of section 01.1, merged in PR #4.
- `01.2.01` to `01.2.05` — the whole of section 01.2, merged in PR #6.
- `01.3.01` to `01.3.06` — the whole of section 01.3. `01.3.01` merged in PR #6;
  the rest are in PR #7, fact-checked and resolved.
- `02.3.01` — the general-craft exemplar, merged before that.
- `09.1.03` — the safety-critical exemplar, merged in PR #2.

The next work is the rest of stage 1, chapter 01 first: section 01.4, working
inside occupied buildings.

**Two decisions are open, both the owner's, both about `confidence` labels.**
Neither blocks any writing.

1. `reviews/ch01.2-factcheck.md` finding 24 — section 01.2's five items.
2. `reviews/ch01.3-factcheck.md` finding 16 — `01.3.04` Inspection, which is
   almost entirely clause description and by the style guide's table reads as
   `verified`.

Both reviews argue `verified` is now defensible: the clause content is checked
against primary text and the inferences are marked as inferences. Both were left
alone because it is a reading decision about the labelling scheme rather than a
correction. The detail of the first:

From `reviews/ch01.2-factcheck.md` finding 24: all
five 01.2 items carry `confidence: standard-practice`, and after the review
almost everything actionable in them is clause text checked against a primary
document. The reviewer's position is that `verified` is now defensible. That is
a reading decision rather than a correction, so it was left alone.

## What sections 01.2 and 01.3 taught, which changes how the next one gets written

Read `docs/source-pack-protocol.md` before building a pack, and read both
`reviews/ch01.2-factcheck.md` and `reviews/ch01.3-factcheck.md` before writing
against either section as a pattern. The protocol was written after 01.2's pack
put two critical errors into five items; 01.3 was the first section built under
it, and its review answered the question the protocol needed answering.

**The verdict: the protocol works exactly as far as it is mechanised, and its
hand-done substitute did not work at all.** 01.3 shipped zero critical findings
against 01.2's two, and the mechanical sweep over 建設業法 surfaced three
articles that choosing from expectation would have missed — including the
20-day inspection clock and a duty binding the reader personally. But eleven of
sixteen findings came from clauses no sweep ever surfaced, because the pack
claimed that reading the specification's seven section headings was "the same
discipline done by hand". It is not. Reading all 590 lines of that part took one
tool call and found four clauses the pack had missed, two of them immediately
adjacent to clauses it had taken.

**The structural lesson, which is the one to carry forward: sweeping by number
cannot find definitions.** A document's definition clause is never numerically
adjacent to the clause that uses it. 建設業法第2条第5項 defines 元請負人 as the
party ordering work under any subcontract — whoever engaged your company, at any
tier — and two 01.3 items rendered it "the prime contractor", telling a reader
the 20-day duty was owed by a company their employer has no contract with. The
specification's 1.1.2 defines 一工程の施工 and 工事関係図書, both of which were
glossed wrongly. Protocol rule 1c now requires the definition clause to be read
every time, and it kills three of the sixteen findings on its own.

## What section 01.2 taught, which changes how the next section gets written

Read `reviews/ch01.2-factcheck.md` before writing 01.3. The short version:

**Brief writers from primary sources.** Before commissioning the section, the
MLIT specification was re-read from the PDF and the statutes pulled through the
e-Gov API, and the exact clauses were extracted into a pack — including what
each clause does *not* say and where its scope stops. Writers worked only from
that. It is the largest quality lever found so far, and the pack is preserved
at `docs/source-packs/01.2-site-zones-and-rules.md`.

**And then treat the pack as the thing most likely to be wrong.** One pack fed
five items, so a misreading in it would appear in all five and they would agree
with each other perfectly. The fact-checker was given verbatim primary text and
told to test the pack, not to check items against it. It found two critical
errors, both in the pack, both omissions rather than misreadings — a condition
left out of a list, an article never looked up. A pack looks complete, which is
exactly its danger. Never let a reviewer verify against the notes the writer
worked from.

**Review what the writing agents produce.** Every one of the five items needed
at least one fix after its agent reported the validator clean. The validator is
a floor, not a standard.

**Run one writing agent at a time.** Two in parallel starved each other's
session quota and both died mid-write, leaving half-finished files.

### The guardrails grew because of it

Six defects reached a clean validator run in this section and were caught by
eye. Four are now machine-checked and two validator bugs that rejected correct
content are fixed. `npm test` goes 23 to 34. The new checks: a cross-reference
path must match the taxonomy (the id is what routes, so a wrong filename still
renders as a working link); every Japanese run in the prose must be declared by
some item, abbreviations included; a registry entry may declare a
`clausePattern` so an item leaning on a document while calling it "the
specification" must still cite it; and prose may not point at the writer's
briefing.

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

## Known risks that are not solved

Recorded so nobody rediscovers them the hard way.

**Japanese readings are unverified.** Readings are generated, and no automated
check can catch a wrong one. 施工 is せこう in this trade rather than the obvious
しこう, and that class of error accumulates silently. The glossary page exists
partly so a native speaker can review the whole set in one pass. Get this done
before the glossary passes a few hundred terms.

**Full-text search does not cover article bodies.** Bodies live in lazy chapter
chunks, so search covers titles, summaries, headings and Japanese terms only.
Headings carry most of the meaning, so this is usually enough. Fixing it
properly means a build-time inverted index, which is worth doing only if
searching turns out to miss things people actually look for.

**Two sessions editing shared registries will conflict.** `_sources.json`,
`_images.json` and `_terms.lock.json` are single files. Two cloud sessions
writing different chapters can both append and collide. Run one content session
at a time, or expect to resolve a merge.

**Reading progress is per device.** localStorage, no account, no sync. Four
people on four phones each have their own. Clearing browser data loses it.
This is a deliberate trade against building any backend.

**The markdown renderer is homegrown.** It handles headings, lists, tables,
images, bold and links. It does not handle nested lists, footnotes, or inline
HTML. If content needs something it does not support, extend the renderer
rather than working around it in the prose.

## First technical task — done

**(Done, session 1.)** Split the generated index. `build-index.mjs` now emits two things instead
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

Measured when only one item was written, the byte counts were close (the old
single file was 360,786 bytes; catalog.json was 342,667 bytes plus a 6,674
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
   content has a different shape. **Done.** `09.1.03` three-point contact,
   merged in PR #2. Two Japanese sources were added to the registry for it —
   `jniosh-ladder-falls` and `kensaibou-low-height`.

   Both exemplars carry `status: review`, which is as far as a content file
   goes: `approved` was removed from the allowed status values in commit
   00841ed, and the validator now rejects it outright.
   `content/_approved.json` is empty.

   **Approval is not a gate, and writing does not wait on it.**
   `content/_approved.json` is a reading record: an id in it means a human
   read that item and accepted it. It grants no permission and blocks nothing.
   What it still does is keep approval out of an agent's hands — an agent
   cannot record acceptance of its own work (CLAUDE.md rule 6). Write against
   the two exemplars because they are the quality bar, not because anyone
   signed them off.

   The caveat to carry forward is about review, not approval: `09.1.03` had
   never had the every-line review CLAUDE.md requires for a `safetyCritical`
   chapter. **That review is now done** — `reviews/ch09-factcheck.md`. Its
   figures all check out against the two cited Japanese sources; what it found
   was three attribution errors, the largest being that the leaflet's rule
   about descending backwards belongs to its stepladder block, not its ladder
   block. Read the report before writing the rest of chapter 09 against this
   item as a pattern.

   All six written items have been fact-checked, and the findings have been
   fixed. `reviews/ch01-factcheck.md` and `reviews/ch02-factcheck.md` carry the
   other two reports. Each keeps its findings as written and ends with a dated
   **Resolution** section recording what was done — including what was left
   alone on purpose, so nobody re-raises it.

   Two things worth carrying forward from that round. The MLIT specification
   was read directly rather than searched, which overturned three findings that
   a web-only pass had reported as unconfirmed — if an item rests on a large
   Japanese PDF, open the PDF. And `02.3.01`'s lambda table still has three
   rows nobody has verified against their own source, because ScienceDirect
   refuses access; the item now says so in the text.
3. Stage 1 content, chapter by chapter. Chapter 01 first — it is the
   most under-weighted chapter in the source relative to how much these
   readers need it. **Sections 01.1, 01.2 and 01.3 done** (fifteen items, PRs
   #4, #6 and #7); 01.4 onward is the next writing work.
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
