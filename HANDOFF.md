# HANDOFF — read after CLAUDE.md

State as of 2026-09-02. Written for a session with no conversation history.

## Where the project stands

The foundation is built and deployed. One exemplar item is written. Content
writing has **not** started, and should not start until the two open questions
below are answered.

## Open questions that block content

### 1. Building insulation or plant insulation?

The previous scaffold's notes recorded that the employer, 日建工業 Nikken
Kogyo (Midori Group, Iwakuni, Yamaguchi), does **building and facility**
insulation — school air conditioning, boiler rooms, pipework in public
buildings — rather than refinery or petrochemical plant insulation.

The curriculum outline this project derives from reads as plant-oriented in
places: seismic movement joints, equipment insulation, heavy jacketing systems.

If the job really is building services work, a meaningful share of stage 2 and
stage 3 is aimed at the wrong target. Writing 300 articles about refinery
pipework for someone insulating school ductwork would be exactly the
inconsistency this project is built to avoid.

**Do not scale content writing until this is settled.** It is cheap to answer
and expensive to get wrong.

### 2. Which work category?

Also unresolved from the previous notes: whether the employer's work falls
under 保温保冷工事作業 (general) or 吹付け硬質ウレタンフォーム断熱工事作業
(sprayed rigid urethane foam). These are different skill sets. The taxonomy
assumes the former.

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
