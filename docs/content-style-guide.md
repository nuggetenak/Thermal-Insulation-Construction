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
status: draft          # stub | draft | review | approved
summary: "..."         # one sentence, under 30 words, plain language
terms:                 # every Japanese term used in the body
  - term: 保温
    reading: ほおん     # kana only, validator enforces this
    meaning: hot insulation
seeAlso: ["02.3.02"]   # taxonomy ids only; validator checks they exist
confidence: verified   # verified | standard-practice | needs-confirmation
sources:
  - "..."              # required for safety-critical items
---
```

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

## Length

Full depth. Roughly 400–900 words for an article. Shorter is acceptable when
the topic is genuinely small; padding to hit a number is not. The validator
warns below 120 words.

## Copyright

JIS, ASTM, ISO, API and ASME documents are paid publications.

- Allowed: describing what a standard covers, why it exists, and that it
  applies, in your own words.
- Not allowed: quoting clauses, reproducing tables, listing specified values.

Diagrams must be original SVG drawn from geometry, never traced or scraped.

## Things that will get an item rejected

- A procedure written with confidence by someone who was guessing
- A number with no source in a safety-critical chapter
- Filler under a required heading
- A Japanese term in the prose that is missing from `terms`
- Reproduced standard text
- A new heading structure invented for one item
