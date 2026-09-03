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
6. **Never set `status: approved`.** It is not an allowed status value.
   `content/_approved.json` is the owner's reading record — an id there means a
   human read that item and accepted it. It is not a gate and nothing waits on
   it. Use `review` when you think an item is finished.
7. **Never write in the first person.** This reference has no narrator. Say
   "no source consulted states this", never "I could not find".
8. **Never regenerate `content/_ids.lock` to silence an error.** That lock is
   what makes ids permanent. If it fails, something renumbered — find out what.
9. **Use the canonical term.** `content/_terms.lock.json` fixes the English name
   for things with several names. Jacketing, not cladding. Insulation, not
   lagging. Supervisor, not foreman. Vapor, not vapour.
10. **Run `npm run validate` before every commit.** It is fast and it catches
   the drift that a human reviewer will not.

## Repository map

```
content/_taxonomy.json     generated skeleton — all 974 ids, never edited by hand
content/_sources.json      source registry — hand-maintained; cite by id only
content/_images.json       image registry — licence enforced, cite by id only
content/_approved.json     owner-only reading record; agents never edit this
content/_ids.lock          permanent id set; CI fails if an id moves
content/_terms.lock.json   canonical English terms; variants are rejected
scripts/test-guardrails.mjs  tests the validator itself, not the content
content/chNN/              authored markdown, one file per item
docs/curriculum-source.md  the original outline; the taxonomy derives from it
docs/content-style-guide.md  how to write an item — read before writing content
scripts/parse-taxonomy.mjs  regenerates the skeleton from the source outline
scripts/validate-content.mjs  the schema, enforced
scripts/build-index.mjs    compiles content into src/generated/catalog.json (loaded up
                            front) plus src/generated/chapters/chNN.json (bodies, loaded
                            on demand)
src/                       React 19 + Vite + Tailwind 4, TypeScript
.claude/agents/            subagent definitions
```

## Commands

```
npm ci             # first, in a fresh session — see below
node scripts/primary-sweep.mjs --law <e-gov id> --cited <articles>
                   # authoring aid for a source pack — see docs/source-pack-protocol.md
npm run validate   # ids, schema, cross-references, terminology, sourcing
npm test           # tests the guardrails themselves
npm run check      # everything above, then typecheck and build. CI runs this.
npm run dev        # local dev server
```

A cloud session starts with no `node_modules`. `validate` and `test` are
zero-dependency and run anyway, so it is easy to believe everything passes;
`npm run check` then fails at the typecheck step with `Cannot find type
definition file for 'vite/client'`, which looks like a code error and is not.
Run `npm ci` once before trusting `npm run check`.

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
- Review runs **Opus**, high effort. `.claude/agents/fact-checker.md` is pinned
  to it; if that frontmatter and this line ever disagree again, this line wins.
- Run writing agents **one at a time**. Two in parallel is not twice as fast:
  both compete for the same session quota, and when it runs out they die
  mid-write, leaving half-finished files that still have to be reviewed or
  thrown away. That happened on section 01.2 — two agents launched together,
  both killed, one file salvaged. One at a time, checking `/usage` between.
- A killed agent leaves its file on disk, unvalidated and possibly truncated.
  Check headings and word count before trusting anything a failed run produced.

## Review tiers

- **Full review, every line:** anything in a `safetyCritical` chapter, every
  calculator formula, every number a reader might act on. Chapters 07, 08, 09,
  12, 14, 15, 16, 20, 27.
- **Spot review:** general craft chapters.
- **Validator only:** stage 4 stubs.

## Running sessions

Run **one content session at a time**. `content/_sources.json`,
`content/_images.json` and `content/_terms.lock.json` are single shared files;
two sessions writing different chapters will both append to them and collide.

## Writing content

Read `docs/content-style-guide.md` first. Then read an exemplar as an example —
`02.3.01` for general craft, `09.1.03` for safety-critical. Match it. Do not
invent a new structure.

### Brief writers from primary sources, not from memory

The single largest quality lever found so far, and the largest single point of
failure. **Read `docs/source-pack-protocol.md` before building one.** It carries
the method and the post-mortem of the two errors that got into section 01.2 —
both omissions, one from choosing articles by expectation instead of sweeping
the neighbourhood, one from a summary silently dropping a parenthetical
exclusion.

Before commissioning a section, open the documents it will rest on and extract
the exact clauses into a pack: clause number, what it says, and — this is the
part that earns its keep — what it does **not** say, and where its scope stops.
Hand writers that pack and tell them to work only from it. Run
`node scripts/primary-sweep.mjs` over your citation list first; it prints the
uncited articles next to the ones you took, which is where the missing duty
usually is.

Section 01.2 was written this way. The MLIT specification was re-read from the
PDF and the statutes pulled through the e-Gov API, and the pack carried
cautions like "these pedestrian-route widths are a roads clause, do not apply
them to a corridor". The writers then held those limits on their own.

Two things follow, and both matter:

- **The pack is a single point of failure.** Every item written from it
  inherits any misreading, and they will all agree with each other. When the
  fact-checker runs, give it a verbatim extraction of the primaries and tell it
  the pack is under test too. Never let it check items against the pack.
- **Keep the pack out of the content.** The reader has never seen it. See
  `docs/content-style-guide.md` on referring to the brief.

### Review the writers' output before committing it

A writing agent that reports success has satisfied the validator, which is a
floor and not a standard. Every item in section 01.2 needed at least one fix
after its agent reported clean: a clause stated more firmly than it reads, a
cross-reference to a filename that does not exist, an undeclared term, a
sentence pointing at the brief. Several of those are now machine-checked
because of it. Read what the agent wrote.
