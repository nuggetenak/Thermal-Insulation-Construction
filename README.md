# 保温保冷工事 — Thermal Insulation Construction

A working reference and study platform for thermal insulation construction
(保温保冷工事 / 熱絶縁施工), built for four people starting work in Japan with
no prior trade experience.

**Live:** https://nuggetenak.github.io/Thermal-Insulation-Construction/

## Why it exists

Formal training is not affordable. This is the substitute: a full-depth,
sourced reference that works as evening study at home and as a one-handed
lookup on site.

Because none of the readers has trade experience, none of them can catch an
error. Content that is uncertain says so, in the text.

## How it is organised

Not by textbook order — by when you need it.

| Stage | Meaning | Items |
|---|---|---|
| 1 | Before you fly | 301 |
| 2 | First year on the job | 317 |
| 3 | Becoming skilled | 194 |
| 4 | Later — certification, lead worker | 162 |

974 items in total, derived from `docs/curriculum-source.md`.

## Working on this

Read `CLAUDE.md` first, then `HANDOFF.md`. Content writers read
`docs/content-style-guide.md`.

```
npm install
npm run dev        # local dev server
npm run validate   # schema, cross-references, safety sourcing
npm run check      # validate + typecheck + build (what CI runs)
```

Stack: React 19, Vite 7, TypeScript, Tailwind 4. Content is markdown compiled
to a single JSON index at build time. No backend, no database.
