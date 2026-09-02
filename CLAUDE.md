# CLAUDE.md — read this before doing anything

This file governs every session on this repository. If you are starting fresh
with no conversation history, this file plus `HANDOFF.md` is your full context.

## What this is

A reference and study platform for **保温保冷工事** (thermal insulation
construction) being built by four Indonesian workers who start jobs in Japan in
under six months. None of them has trade experience. None can afford formal
training. This site is the substitute.

**That fact sets the quality bar.** A reader cannot catch your mistake. If you
write a confident, wrong procedure for working at height, nobody downstream
will notice before someone follows it. Uncertainty must be visible in the text,
not smoothed over.

## Non-negotiables

1. **Never invent a procedure.** If you do not know how something is actually
   done on a Japanese site, say so in the text and set
   `confidence: needs-confirmation`. "Ask your supervisor before doing this"
   is a legitimate and often correct thing to write.
2. **Never reproduce standard text.** JIS, ASTM, ISO, API and ASME documents
   are paid. You may describe what a standard covers and why it exists, in your
   own words. You may never quote its clauses, tables or values. The registry
   marks these `quotable: false`.
3. **Cite by registry id.** `sources` in frontmatter holds ids from
   `content/_sources.json`. Add the source to the registry before citing it.
   Free-text sources are rejected.
4. **Never renumber an ID.** IDs in `content/_taxonomy.json` are permanent.
   Other files link to them. Append, never renumber.
5. **Never hand-write an ID.** Take it from the taxonomy. `npm run validate`
   rejects invented IDs.
6. **Run `npm run validate` before every commit.** It is fast and it catches
   the drift that a human reviewer will not.

## Repository map

```
content/_taxonomy.json     generated skeleton — all 974 ids, never edited by hand
content/_sources.json      source registry — hand-maintained; cite by id only
content/chNN/              authored markdown, one file per item
docs/curriculum-source.md  the original outline; the taxonomy derives from it
docs/content-style-guide.md  how to write an item — read before writing content
scripts/parse-taxonomy.mjs  regenerates the skeleton from the source outline
scripts/validate-content.mjs  the schema, enforced
scripts/build-index.mjs    compiles content into src/generated/index.json
src/                       React 19 + Vite + Tailwind 4, TypeScript
.claude/agents/            subagent definitions
```

## Commands

```
npm run validate   # schema + cross-references + safety sourcing
npm run check      # validate, then typecheck, then build. CI runs this.
npm run dev        # local dev server
```

## Stages, not chapters

The source outline is ordered like an encyclopedia: all universal craft first,
Japan-specific material second. That ordering puts communication and site
conduct behind twenty-two chapters of theory, which is wrong for someone
starting work in months.

Content is therefore ordered by **when it is needed**:

| Stage | Meaning | Items |
|---|---|---|
| 1 | Before you fly | 386 |
| 2 | First year on the job | 389 |
| 3 | Becoming skilled | 209 |
| 4 | Parked — years away, stubs only | 162 |

Coverage is deliberately complete: every case has an id and a place. Writing
order is deliberately ruthless. Those are separate decisions — do not let one
override the other.

**Write stage 1 first.** If this project runs out of time at sixty percent
complete, the missing forty percent must be the material nobody would have
touched for two years anyway.

## Model and cost discipline

The owner is on a single Claude Pro plan. Claude Code and the chat apps share
one usage pool.

- Writing agents run **Sonnet**, `effort: medium`. Set `model: sonnet`
  explicitly in agent frontmatter — a subagent with no model specified inherits
  the main session's model, which silently burns Opus quota.
- Review runs **Opus**, high effort.
- Run agents **one or two at a time**, not ten. Check `/usage` between batches.

## Review tiers

- **Full review, every line:** anything in a `safetyCritical` chapter, every
  calculator formula, every number a reader might act on. Chapters 07, 08, 09,
  12, 14, 15, 16, 20, 27.
- **Spot review:** general craft chapters.
- **Validator only:** stage 4 stubs.

## Writing content

Read `docs/content-style-guide.md` first. Then read an approved item as an
example. Match it. Do not invent a new structure.
