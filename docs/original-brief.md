# Project Brief — Hoon Horei Koji Learning Platform (for Opus)

You're being asked to build — content AND the actual working platform, through deployment — a self-study site for **Thermal Insulation Construction — 保温保冷工事（熱絶縁施工）**. This brief is your context. The companion file `Kurikulum-Konsolidasi-Hoon-Horei-Koji.md` is your taxonomy — a ~1,000-item outline split into PART 1 (Universal Craft Knowledge) and PART 2 (Japan-Specific Layer). Read that file in full before starting.

You'll be given direct push access to the GitHub repo (link + token). Use it — set up the repo, build, commit, and deploy live, the same way Nugget's other projects run (GitHub + GitHub Pages). Nugget is the "prompt director" here: he owns vision, judgment calls, and final review. You own everything technical through to a working, deployed site. Don't wait for permission on implementation details that are clearly within this brief's scope — use your judgment and keep moving, the same working relationship Nugget uses on his other AI-built projects.

## 1. Who this is for

Four real people: Nugget and 3 kouhai, all headed into the same job, at the same employer, in Japan. Not a generic public course — zero-to-competent training for four specific people who need to actually do this work safely and well. A wrong procedure or a skipped safety point is a real hazard for a real person, not an abstract quality issue.

Baseline: zero field experience, capable adult learners, comfortable enough in English to learn from it (see §2).

## 2. Language

**Write in English.** This is a deliberate departure from Nugget's other Japanese-learning projects (which are Indonesian-medium) — the reasoning is that the best available open, non-copyright technical source material for this trade is overwhelmingly in English, not Indonesian, so English lets you ground content in better sources.

- Explanations, procedures, all prose content: **English.**
- Japanese terms stay embedded throughout, with reading support (furigana/ruby-style, matching the convention already used in the taxonomy file) — the workplace is Japan, so the vocabulary has to be real and present, just not the explanatory medium.
- Vocabulary-entry schema (Ch.23 and anywhere else a term gets a structured entry): term, reading, **English meaning**, nuance/differentiation from near-synonyms, cross-references. This mirrors the schema Nugget's other vocab corpus uses, except the meaning field is English instead of Indonesian for this project specifically — don't default to Indonesian out of habit.

## 3. Site architecture — four tracks, one site

The platform has four distinct sections. Build them as one coherent site (shared nav, shared design system, cross-linked — see §3.5), not four disconnected mini-apps.

### 3.1 Modules
The taxonomy, sequential. Part 1 (universal craft) is the priority — build and get this right before moving deep into Part 2 (Japan-specific layer: vocabulary, workplace communication/conduct, 技能検定 exam prep, SSW/技能実習 pathway). See Appendix A in the taxonomy file for the recommended phase order. Module content format is in §4.

### 3.2 Corpus
**Not separately-authored content** — the same underlying knowledge base as the modules, presented as a searchable/browsable reference instead of a sequential read. To make "one source, two views" actually buildable rather than just a slogan: author each taxonomy leaf item as **structured data** (frontmatter/JSON — term/topic, chapter+section ref, the module body fields from §4, tags) that the Modules UI renders as a sequential reader and the Corpus UI renders as a searchable/filterable database (by chapter, by material, by JIS/exam reference, by free-text search). Don't hand-write two separate prose versions of the same content.

Japanese-language search needs a tokenizer that handles the lack of word spacing — naive substring matching will miss most real queries. Use a search library with real Japanese support (e.g. something built on a bigram/n-gram index, or a proper JP tokenizer) rather than a plain English-oriented full-text search library.

### 3.3 Calculation tools
Real, working interactive tools — this is a first-class part of the build, not a "later" item. Candidates drawn from the taxonomy's math/geometry chapters (Ch.03, 05, 18, 29): pipe/insulation circumference and thickness math, elbow segmentation angles, cone/reducer pattern development, sheet-metal jacketing pattern "unfold," material takeoff/waste estimation, dew-point/condensation risk check, insulation-thickness selection.

**Verify before shipping.** These get used on real jobs — a plausible-looking but subtly wrong formula is a real-world risk, not a cosmetic bug. Cross-check each formula against a second independent source or worked example before treating it as field-ready, and say in the tool's own module/corpus entry what it was verified against.

### 3.4 Blog (research journal)
Out of scope for you to write. This section is authored separately by Nugget in collaboration with a friend using a different AI model — your job is only the **hosting infrastructure**: a route/section that can display posts, most likely as static markdown files in a `/blog/` directory rendered at build time (matching the no-backend, static-everything pattern the rest of this stack uses — no CMS, no database). Build the shell and a couple of placeholder/example posts if useful for testing, but don't generate real blog content yourself.

Since a different person + different AI is producing that content, share the terminology-convention and copyright sections of this brief (§2, §6) with them too if Nugget asks — keeps the whole site sounding like one platform instead of two projects stitched together.

### 3.5 Cross-linking
A module about elbow segmentation should link to the elbow-segmentation calculator and to its own corpus entry, and vice versa. Build this as a real requirement, not an afterthought — the whole point of this platform (per Nugget) is that it's convenient to use *at work*, which means fast lateral movement between "read about it," "look it up," and "calculate it," not three isolated silos.

## 4. Module content format

Every taxonomy leaf item becomes a self-contained module. Textbook content — explain, show why it matters, walk through procedure, flag mistakes. **Not flashcards or quizzes** — that's an explicit later phase (gamification/spaced-repetition comes only after the textbook layer is solid; don't shape writing to be quiz-friendly in the meantime).

Suggested fields (adapt per item — a vocab term needs less scaffolding than a fabrication procedure):

- **Concept/definition** — plain-language, Japanese term(s)+reading where relevant
- **Why it matters in the field**
- **Detail** — the actual technical content
- **Common mistakes/defects** — tie to the defect taxonomy (Ch.20/27) where relevant
- **Visual need** — flag if a photo/diagram/illustration would help (see §7); don't skip writing just because you can't generate the image in this pass
- **Cross-references** — related items, and links per §3.5
- **Exam relevance** — tag if it maps to a 学科/実技 item in Appendix B
- **Source basis** — tag as either *general technical knowledge* or *cited source* (name the source — MHLW PDF, JAVADA archive, a specific manufacturer spec, etc.). This is the audit trail: real people are trusting this content for real work, so anyone reviewing later needs to see at a glance which claims are well-grounded and which are worth double-checking against a supervisor or official document before relying on them in the field.
- **Scope** — for the handful of items flagged `[JP-layer, defer]` inside otherwise-Part-1 chapters (currently just relocated into Ch.24.6 — check the taxonomy file's intro note), tag explicitly so it's clear why a Japan-specific note sits inside a "universal" section.

Include a standard disclaimer somewhere persistent on the platform (footer or an about page is fine): this is training support, not a substitute for official safety procedures or a supervisor's actual instructions on a real job.

## 5. Sourcing

In priority order: (1) your own training knowledge of the trade and adjacent fields (HVAC, piping, general construction), (2) the official Japanese government sources already identified in the taxonomy's Appendix B (MHLW exam-scope PDF, JAVADA past-exam archive) for anything exam- or certification-related, (3) non-copyrighted supplementary material — public-domain/openly-licensed technical references, manufacturer public data sheets (facts, not copied prose), JIS standard numbers cited (not reproduced), (4) live web research where you have that capability and your training data is insufficient — flag the gap explicitly if you don't.

## 6. Copyright — hard rules

Nugget wants zero copyright-strike risk. No exceptions:

- **Never reproduce text verbatim** from any textbook, commercial exam-prep book, manufacturer manual, or website — including JAVADA-hosted problem text or the 雇用問題研究会 past-question book. Synthesize in your own words; use official past questions as a style/scope guide, never copy-paste source.
- **No copyrighted illustrations or scraped images** without a confirmed open license. When unsure, don't use it — flag it as needing an AI-generated or commissioned replacement.
- **No copyrighted characters, brand mockups, or trademarks**, even as placeholders or jokes.
- **Cite standards by number**, don't reproduce their clauses (e.g. "JIS A9501," not its text).
- If genuinely unsure whether something's safe, flag it in your output rather than silently including it.

## 7. Media

- Photos/illustrations: confirmed non-copyright sources, or AI-generated. Note which you used where it isn't obvious.
- **Diagrams** (elbow segmentation, layer cross-sections, symbol keys): if you have image/diagram generation available, generating these directly is usually more convenient than sourcing photos. If you can't generate something in a given pass, leave a clear spec (what it shows, what's labeled) for a follow-up.
- **Repo hygiene**: compress/optimize images before committing (the repo will accumulate hundreds of photos/diagrams over time) — don't commit raw unoptimized files.

## 8. Repo, deployment, and workflow

- **New standalone repo** — not a module inside the existing SSW-Konstruksi repo. Fork or otherwise reuse that repo's proven stack as your starting scaffold (React 19, Vite 6, the lazy-loaded-section pattern it already uses for its 23 study modes) rather than reinventing architecture that's already working and exam-validated in production.
- **Deploy live** the same way Nugget's other projects run (GitHub Pages–style static deploy).
- **Branch strategy**: do heavy iteration on a dev/feature branch, keep a stable branch as what's actually live — mirroring the content-dq/main split already used on SSW-Konstruksi, so active work in progress never breaks the live site.
- **Token**: expect a fine-grained PAT scoped to just this one repo, not full-account access.
- **Access**: default to a normal public deploy (matches every other project in this ecosystem, simplest to build, nothing here is sensitive). If Nugget wants it unlisted rather than promoted/indexed, that's a zero-code choice (just don't link it anywhere public) — flag to him if an actual login wall ever seems worth the added complexity, but don't build one unprompted.
- **Session continuity**: this project is too large for one sitting. Use the same HANDOFF.md / PROGRESS.md relay pattern Nugget already runs on the content-dq campaign — update PROGRESS.md before each commit, leave HANDOFF.md in a state where a fresh session (yours or a future one) can pick up cleanly without replaying this whole brief from memory. One task per commit, same discipline as his existing projects.

## 9. Keep this consistent with Nugget's ecosystem

- **SSW Konstruksi Nihongo** (`nuggetenak/Nugget-Nihongo-SSW-Konstruksi`) — match its terminology conventions where topics overlap (general construction vocab, safety language, site communication) so a learner moving between the two doesn't hit inconsistent terms. This is also your architecture template per §8.
- **Nugget Nihongo corpus** — vocabulary entries follow its schema shape (term, reading, meaning, nuance differentiation, cross-references) — with English instead of Indonesian in the meaning field for this project (§2).

You won't have direct access to those repos in this session unless Nugget provides them — match the conventions described here rather than guessing file structures.

## 10. Pacing

1. **Pilot first**: fully build ONE Part-1 chapter to nail the module template/quality bar — Ch.02 (Thermal Fundamentals) is a good pilot: foundational, self-contained, no messy exceptions.
2. Once approved, follow Appendix A's phase order — all of Part 1 before going deep on Part 2.
3. Stand up the site shell (routing for all 4 tracks, corpus data schema, at least one working calculator) early enough to validate the cross-linked architecture in §3.5 — don't leave integration until the end.
4. Flag anything in the taxonomy that seems to need a real-world correction as you go deeper than this pass did — it's already been through one gap-fixing revision, but you'll likely find more.

## 11. Output

Real commits to the real repo, deployed live, not a document dump. Keep commits small and reviewable (one task each, per §8) so Nugget can actually track progress and course-correct rather than getting one giant unreviewable push.
