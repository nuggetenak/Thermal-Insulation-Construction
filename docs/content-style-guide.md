# Content style guide

Read this before writing any item. Then open an item with `status: approved`
and match it. Consistency across 800 items comes from imitating a real example,
not from remembering rules.

## Who you are writing for

Four adults with no construction experience, starting work in Japan. They read
technical English comfortably. They are not children and they are not
engineers. Write the way a good senior worker explains something to a new hire
who is genuinely trying: direct, concrete, no talking down, no padding.

They will read this at home in the evening, and on a phone at work with one
hand. Both matter.

## Voice

- Plain sentences. Short ones are fine.
- Second person. "You will see this on..." not "One observes..."
- Say the thing, then explain it. Never build up to the point.
- No enthusiasm, no marketing, no "it's important to note that".
- British or American spelling is fine, but be consistent within a file.

**Never write filler.** If a section has nothing real in it, that item probably
needs merging with another, or the heading is wrong. Say so rather than padding.

## Required structure

The validator enforces these headings. Do not add a new top-level structure
without changing the validator first.

**article**
```
## What it is
## Why it matters on the job
## In detail
## Common mistakes
```

**vocabulary**
```
## Terms
## How it sounds on site
## Common mistakes
```

**practical**
```
## Goal
## What you need
## Steps
## How to know it is right
## Common mistakes
```

**diagnostic**
```
## Symptom
## Likely causes
## How to check
## What to do
## Common mistakes
```

### Optional sections

Two extra sections are allowed, placed before `## Common mistakes`:

- `## Worked example` — real numbers run through to a real answer. Use it
  whenever a claim has arithmetic behind it. A number a reader can follow beats
  a paragraph asserting the same thing.
- `## Check yourself` — a few questions with answers, for study items.

Do not invent other sections. Consistency across 800 items comes from a small
fixed vocabulary of structure.

`## Common mistakes` is required everywhere. Knowing the failure mode is most
of the craft, and it is the part a textbook usually omits.

## Frontmatter

```yaml
---
id: "02.3.01"          # from the taxonomy. Never invent one.
title: "..."           # match the taxonomy title
chapter: "02"          # quoted — leading zeros matter
section: "02.3"
stage: 2
kind: article
status: draft          # stub | draft | review — never "approved"''")

s = s.replace(### Approval is not yours to give

`status` accepts `stub`, `draft` and `review`. It does not accept `approved`,
and the validator rejects it.

Approval is recorded in `content/_approved.json`, edited by the owner alone. An
id in that file means a human read the item and accepted it as correct. An agent
marking its own work approved would make the whole review tier meaningless, so
the field is simply not available.

Set `review` when you believe an item is finished.

### Canonical terminology

`content/_terms.lock.json` fixes the English name for things this trade calls
several names. The validator rejects a variant and tells you the canonical word.

Jacketing is never cladding. Insulation is never lagging. Thermal resistance is
never R-value. Condensation control is never anti-sweat. The supervisor is never
the foreman. American spelling throughout, so vapor barrier rather than vapour.

None of these choices is more correct than its alternatives. The point is that
chapter 09 and chapter 41, written months apart in different sessions, use the
same word for the same thing.

If a variant is deliberate — usually to tell the reader what else people call
it — declare it:

```yaml
allowVariants: ["lagging"]
```

That makes it a visible decision rather than drift. If you need a term the
lockfile does not cover, add it to the lockfile in the same commit.

### Term ownership

A Japanese term is introduced **once**, in the item it belongs to, with its full
`terms` entry. Elsewhere, use it in the prose and cross-reference the item that
owns it.

保護帽 belongs to the helmet item. 作業床 belongs to the work-platform item. If
every item that mentions them re-declares them, the generated glossary fills
with near-duplicates that quietly disagree about the meaning. The validator warns
when a term is declared in more than one item.

### Sourcing
summary: "..."         # one sentence, under 30 words, plain language
terms:                 # every Japanese term used in the body
  - term: 保温
    reading: ほおん     # kana only, validator enforces this
    meaning: hot insulation
seeAlso: ["02.3.02"]   # taxonomy ids only; validator checks they exist
confidence: verified   # verified | standard-practice | needs-confirmation
sourceBasis: cited     # general | cited
sources:
  - mhlw-exam-scope    # ids from content/_sources.json, never free text
---
```

### Sourcing

`sourceBasis` is the audit trail. A reviewer must be able to see at a glance
which claims are grounded and which need checking with a supervisor.

- `general` — standard physics, arithmetic, or trade knowledge that any
  competent reference would agree on. Still list what it rests on.
- `cited` — the claim comes from a specific document. `sources` must not be
  empty.

`sources` holds **ids from `content/_sources.json`**, never prose. If the
source you need is not in the registry, add it there first. The validator
rejects unknown ids.

Safety-critical chapters must cite at least one **tier 1 or tier 2** source —
an official document or an industry association, not general knowledge.

Every registry entry carries `quotable`. When it is `false`, the document is
paid or restricted: describe what it covers, never reproduce its text. JIS
A 9501 is the case you will meet most.

Registry entries also carry `recheckAfter`. Official exam documents are
reissued annually, and the validator warns once a source is past that date.
When you see that warning, re-verify before writing anything that depends on
it.

### Why terms are structured

Every Japanese term goes in `terms` as three separate fields, even when it also
appears in the prose. The build extracts them into a glossary automatically. A
flashcard deck later gets generated from content that already exists rather
than written again from scratch. Burying 保温 inside a sentence costs nothing
today and costs the whole deck later.

Readings are kana only. Watch the trade readings that differ from the obvious
one — 施工 is せこう in this trade, not しこう.

## Confidence, and admitting ignorance

| Value | Use when |
|---|---|
| `verified` | Physics, arithmetic, or something you checked against a real source |
| `standard-practice` | Widely taught trade practice, but site practice varies |
| `needs-confirmation` | You are not certain, or it depends on the employer |

Nobody reading this can catch your error. `needs-confirmation` is not a
weakness in the writing — it is the writing doing its job. Pair it with a
sentence telling the reader who to ask.

## Cross-references

Link with the item id: `[02.3.02](../ch02/02.3.02-effect-of-thickness.md)`.
The app rewrites these to internal routes. Referencing an unwritten item is
fine and expected — the target exists in the taxonomy from day one.

## Length is earned, not capped

There is no maximum. An item may run to 1700 words if it has 1700 words of
substance. The approved safety exemplar does exactly that, and every hundred
words of it carries a figure, a source, a named failure mode, or an honest
statement of what is not known.

The test is not how long it is. The test is whether a reader would lose
something if you cut it.

**What earns length:** a real figure with a source behind it. A failure mode
described concretely enough to recognise. A limit on the rule you just gave. A
worked example run through to a number. A named thing the sources do not settle.

**What does not earn length:** restating the summary in the opening paragraph.
Explaining the same idea twice in different words. Hedging that carries no
information. Transitions that announce what the next section will cover.

The validator warns below 120 words, and warns above 1200 words when fewer than
two sources are cited — a long item resting on one source is usually
elaboration rather than evidence.

## Voice: there is no narrator

Never write in the first person. This reference is written across many separate
sessions, and "I" refers to nobody a reader can identify. The validator rejects
it.

Write the finding, not the search for it:

- No: "I could not find a Japanese source for this."
- Yes: "This is not stated in any source consulted here."
- No: "In my view the risk is..."
- Yes: "The risk is..."

Saying what is unknown is required. Attaching it to a narrator is not.

## Images

Reference an image by its registry id, not a path:

```
![Glass wool pipe section, cut face visible](gw-section-cut)
```

The id must exist in `content/_images.json`. Alt text is mandatory — the
validator rejects an empty one.

Before referencing an image, read `docs/image-needs.md`. The short version:

- **Photographs** are for recognising a real thing. Licensed only, never
  AI-generated. Material identification, tools, PPE and defects are all
  photographs.
- **Diagrams** are geometry. Original SVG in this repo.
- **AI-generated images** may only be chapter header illustration. The
  validator blocks them from safety-critical chapters entirely.

A generated photo of glass wool is a hallucination presented as evidence, and
the whole job of that image is to show what the real thing looks like.

Attribution renders automatically from the registry. CC-BY and CC-BY-SA are
legal obligations, so the licence field is enforced rather than trusted.

## Copyright

JIS, ASTM, ISO, API and ASME documents are paid publications.

- Allowed: describing what a standard covers, why it exists, and that it
  applies, in your own words.
- Not allowed: quoting clauses, reproducing tables, listing specified values.

Diagrams must be original SVG drawn from geometry, never traced or scraped.

## Things that will get an item rejected

- A procedure written with confidence by someone who was guessing
- A number with no source in a safety-critical chapter
- A source written as prose instead of a registry id
- Reproduced text from a source marked `quotable: false`
- Filler under a required heading
- A Japanese term in the prose that is missing from `terms`
- Reproduced standard text
- A new heading structure invented for one item
