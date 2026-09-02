# Chapter 01 — fact-check

Items reviewed: `01.1.01`, `01.1.02`, `01.1.03`, `01.1.04`.
Date: 2026-09-02. Read-only review: no content file was edited to produce it.
The owner has since read it and asked for the gaps to be fixed — see
**Resolution** at the end for what changed. The findings are left as written,
so they describe the items as they stood before that.

Run in two passes. The first was the `fact-checker` agent, working from web
sources. It could not open the primary document — the MLIT standard
specification is a 355-page PDF and the agent had no PDF text extraction
available — so its findings on `01.1.03` rested on secondary quotation.

The second pass fixed that. `公共建築工事標準仕様書（機械設備工事編）令和7年版`
was downloaded from the MLIT page in the registry
(`https://www.mlit.go.jp/gobuild/gobuild_tk6_000058.html`), both the base
edition (`content/001888797.pdf`) and the current 修補版
(`content/001967513.pdf`), and the text extracted and searched clause by
clause. **Every clause cited below was read in both editions and is present in
both, identically.** Clause numbers below are from that document. Its text is
not reproduced here — the registry marks it `quotable: false` — only described.

That matters for how you read this report: findings 1 to 8 are settled against
the primary source, not inferred. Findings 9 onward are not, and say so.

---

## The question this review was called to answer

`01.1.03` states four actionable rules and traces all four to one document. If
that document was misread, four confident wrong rules ship together.

**It was not misread. All four rules are in the document.** No rule is invented,
none is attributed to a source that does not carry it, and the failure this
review was called to look for did not happen. That much is closed.

**The item does not state all four with equal accuracy, though**, and the
difference matters more than the headline does. Read findings 1, 3 and 5 before
concluding anything from this section:

- Rule one is exact, but the *painting* sentence beside it is trade inference in
  specification voice — the clause orders testing before painting and testing
  before insulation, and says nothing about which of those two comes first
  (finding 1).
- Rule two is real but stated as a chilled-water rule when the specification
  carries it again for water supply, drainage and hot water supply. The item
  understates its own scope, in the direction that leaves a reader not applying
  it (finding 3).
- Rule three is confirmed verbatim, and rule four's prohibition is confirmed —
  but rule four drops the exception written into the same clause, and folds a
  second, different clause about electrical wiring into it (finding 5).

So: the four rules are in the document, two of them are stated exactly, and two
carry errors of scope that a reader would act on. "The document was not misread"
and "the item needs no correction" are different claims, and only the first is
true.

---

## Findings

### 1. `01.1.03` — "Painting also comes before insulation" is inference, not specification

**Claim.** "**Painting also comes before insulation.** On painted pipework the
sequence is test, paint, then insulate."

**What the source says.** Clause 2.9.1(1) lists three things a test must precede:
concealment or backfill; painting after pipe completion (thread rust-primer
excepted); and insulation work. It establishes that testing comes before both
painting and insulation. **It does not order painting against insulation.**

The item's next sentence compounds it: "Arriving to find the pipe still bare
steel where the specification calls for a primer is a reason to stop and ask" —
which reads as though the specification calls for a primer at that point in the
sequence.

The conclusion is almost certainly right as trade practice, and the reader
action it produces (stop and ask) is safe. But it is presented in a paragraph
whose authority is the specification, and the specification does not say it.
Painting for mechanical work is governed by a separate MLIT document
(`機械工事塗装要領`), which is not in the registry and was not consulted.

**Severity: significant** — it is the one place in the item where an inference
wears the clothes of a cited rule.

**Suggested action.** Either mark this sentence as trade practice rather than
specification content, or add the painting document to the registry and cite it
here.

### 2. `01.1.03` — rule one is otherwise exact, and the registry's clause number is right

Clause 2.9.1(1) confirms the three-part list as the item states it. Clause 2.9.2
confirms the test types the item names: water pressure test for steam and
high-temperature water, air pressure for oil, water pressure for water and
brine, and an airtightness test for refrigerant. The item's sentence that
insulation on refrigerant lines follows the airtightness test is clause 2.4.6(6).

`content/_sources.json` cites clause "2.9.1" in its note for this source. That
is the correct clause. No action.

### 3. `01.1.03` — the fire-compartment rock wool rule is real, and narrower than stated in one way and wider in another

**Claim.** "Where a chilled water or chilled-and-heating water pipe passes
through a fire-rated compartment, the insulation at the penetration itself is
rock wool."

**What the source says.** Confirmed, as note 1 to the air-conditioning
insulation tables in section 3.1.4. Two qualifications the item does not carry:

- The clause is specific to **準耐火構造** compartments as defined by article
  112(20) of the Building Standard Act Enforcement Order. The item says
  "fire-rated compartment", which is looser than the clause.
- The same rule appears **again** at note 1 to section 3.1.5, for water supply,
  drainage and hot water supply pipes. The item presents it as a chilled-water
  rule. It is not: it covers most of what this trade insulates.

The second half of the item's paragraph — gap around a non-combustible pipe
filled with mortar or rock wool, combustible pipe treated by a method
conforming to the Building Standard Act — is clause 2.8.1(1), stated accurately.

**Severity: significant**, because the understatement runs the wrong way. A
reader who has learned this as a chilled-water rule will not apply it to a
domestic hot water riser, where the clause also applies.

**Suggested action.** Widen the sentence to the systems the clauses actually
cover, and name 準耐火構造 rather than "fire-rated".

### 4. `01.1.03` — the dielectric joint rule is confirmed verbatim as a clause

**Claim.** "The specification prohibits metal jacketing around a dielectric
joint, insulating flanges included."

Clause 3.1.3(19) is exactly this prohibition, insulating flanges explicitly
included. The item's wording is a faithful rendering with nothing added.

The first pass reported this as unconfirmed and recommended downgrading it to
general engineering reasoning. **That recommendation is withdrawn.** The clause
exists. Do not weaken this sentence.

**Severity: none.** Recorded because a reviewer reading the first pass alone
would have made the item worse.

### 5. `01.1.03` — the refrigerant co-wrapping rule omits its exception, and conflates two clauses

**Claim.** "The specification states that they are not to be insulated together
in one common wrap, and where the pair is taped together the insulation goes on
before that."

**What the source says.** Clause 2.4.6(6) prohibits co-wrapping (共巻き) liquid
and gas lines — **except where pre-insulated copper tube (断熱材被覆銅管) is
used.** The item states the prohibition flatly and drops the exception.

The second half is a different clause. 2.4.6(7) is about the **interconnecting
electrical wiring** between indoor and outdoor units: where that wiring is
bundled with the refrigerant pipe, it goes on after the pipe is insulated. The
item reads this as being about the pipe pair.

**Severity: significant.** The omitted exception is the case a reader will
actually meet — pre-insulated copper tube is ordinary in this work — and an
item that states a flat prohibition will read as contradicting the material in
their hands.

**Suggested action.** Add the pre-insulated copper tube exception, and separate
the wiring rule from the pipe-pair rule.

### 6. `01.1.03` — the access rule is confirmed verbatim as a clause

**Claim.** "The specification is explicit about the general principle for
equipment you do insulate: doors, 点検口 and access openings must still open and
be usable, and the insulation must not lose its effect around them."

Clause 3.1.3(18) is exactly that, for equipment requiring insulation. "The
specification is explicit" is justified. The first pass reported this as
unconfirmed; **that finding is withdrawn.**

**Severity: none.**

### 7. `01.1.03` — the steam setback figure is correct, and the registry note is correct

The item deliberately does not give the number, saying only that insulation is
kept back "by a stated distance". `content/_sources.json` records the figure as
25 mm.

Clause 3.1.3(15) gives 25 mm from the face of the penetrated wall or floor, for
steam pipework and the like. **The registry figure is right.**

The first pass rated this finding *critical*, having found no corroboration
anywhere for the 25 mm figure. It is a false alarm caused by not being able to
open the document. **Withdrawn.** No change to the registry.

**Severity: none.** Recorded because acting on the first pass would have
removed a correct figure.

### 8. `01.1.03` — one sentence is more absolute than the clause

**Claim.** "Steam pipework is not insulated right up to the face of a wall or
floor it passes through."

Clause 3.1.3(15) says 蒸気管等 — steam pipes *and the like*. The item's "steam
pipework" is narrower than the clause. Minor, and in the safe direction.

**Severity: minor.** No action needed.

### 9. `01.1.03` — two of the four cited sources ground nothing in the item

`sources` lists `mlit-kikai-shiyosho`, `mlit-gyoshu-kubun`, `kensetsugyoho` and
`jis-a9501`. On reading, only the first does evidentiary work. `jis-a9501` is
named once, to say it exists and is not being reproduced. `mlit-gyoshu-kubun`
and `kensetsugyoho` belong to `01.1.02`'s licensing content and are not tied to
any sentence here.

The effect is that a single-source item presents as a four-source item. Every
actionable rule in it rests on one document, which is exactly the concentration
this review was called to test.

**Severity: significant** (sourcing practice, not fact).

**Suggested action.** Drop the two unused ids, or use them in the body.

### 10. `01.1.03` — the prose is more confident than `confidence: standard-practice`

The item says "the specification prohibits", "the specification is explicit",
"the same specification states plainly". After this review those phrasings are
*earned* — the clauses exist. But the frontmatter label is
`standard-practice`, which understates rules that are in fact verified clause
text, while finding 1 (painting) is the reverse case, stated in specification
voice on inference.

**Severity: minor**, now that the underlying facts are settled. The item is
mislabelled in both directions at once.

**Suggested action.** Owner's call. Either `verified` with finding 1 fixed, or
leave the label and fix finding 1 anyway.

### 11. `01.1.01` — the 4週8休 claim has no source behind it

**Claim.** "the industry has been pushing for sites to be closed eight days in
every four weeks."

Real, and well known as the 4週8休 initiative in public works. But none of the
item's cited sources covers it: not the overtime-ceiling page, not the
mechanical specification, not the Construction Business Act. No source in the
registry supports this sentence.

**Severity: minor** (the claim is true, the citation trail is empty).

**Suggested action.** Add an MLIT source for the initiative, or mark the
sentence as general trade knowledge.

### 12. `01.1.04` — the public-work 施工体制台帳 threshold is cited to the wrong statute

**Claim.** On public work, the 施工体制台帳 and 施工体系図 requirement "bites as
soon as there is any subcontracting at all, whatever the value".

Correct as a fact. But it comes from 入契法 (the Act on Promoting Proper
Tendering and Contracting for Public Works), not from 建設業法, and 建設業法 is
the only statute this paragraph cites. A reader who checks the citation will
not find the rule there.

**Severity: significant** — the fact is right, the audit trail is broken, and
the audit trail is the whole point of `sourceBasis: cited`.

**Suggested action.** Add 入契法 to the registry and cite it here.

### 13. `01.1.04` — 統括安全衛生責任者 thresholds are right, with one category dropped

50 workers generally, 30 for tunnelling and certain bridge work: confirmed
against 安衛法 15条 and 施行令 7条. The item omits 圧気工法 (compressed-air
work) as a third 30-worker category. Not work this trade does.

**Severity: minor.** Omission only, nothing incorrect.

### 14. `01.1.02` — licence category description is sound

The 熱絶縁工事業 description (air conditioning and refrigeration plant through
to power and process plant, including sprayed urethane) matches the MLIT
業種区分 document's examples, paraphrased rather than reproduced. Duct
installation falling under 管工事 rather than a category of its own is also
correct. No action.

### 15. All four items — Japanese readings are clean

Every declared reading was checked, 32 terms. No errors.

Particular attention to the trade reading CLAUDE.md warns about: `01.1.01`
declares 施工計画書 as せこうけいかくしょ and 施工要領書 as せこうようりょうしょ;
`01.1.04` declares 施工体制台帳 as せこうたいせいだいちょう and 施工体系図 as
せこうたいけいず. All four take せこう, not しこう. Correct in every case.

`01.1.03`'s seven readings — 水圧試験, 気密試験, 防火区画, 貫通部, 絶縁継手,
冷媒, 点検口 — are all correct, including 継手 as つぎて.

This is the strongest area of the four items.

### 16. All four items — no reproduced standard text, no first-person voice

Every reference to the MLIT specification and to JIS A 9501 is paraphrase. No
clause text is reproduced anywhere in the four items. Required headings are
present and no structure was invented.

`01.1.01`'s worked example is explicitly labelled an illustration rather than a
measured figure, and its arithmetic is internally consistent.

---

## What was checked against the primary document

Downloaded and text-searched, both editions of
`公共建築工事標準仕様書（機械設備工事編）令和7年版`:

| Item claim | Clause | Result |
|---|---|---|
| Test before concealment / backfill | 2.9.1(1) | confirmed |
| Test before painting after pipe completion | 2.9.1(1) | confirmed |
| Test before insulation | 2.9.1(1) | confirmed |
| Paint *then* insulate | — | **not in the document** (finding 1) |
| Test types by system (water / air / airtightness) | 2.9.2 | confirmed |
| Refrigerant insulated after airtightness test | 2.4.6(6) | confirmed |
| Liquid and gas lines not co-wrapped | 2.4.6(6) | confirmed, with an exception the item omits (finding 5) |
| Wiring bundled after pipe insulation | 2.4.6(7) | confirmed, misattributed in the item (finding 5) |
| Gap at penetration filled with mortar or rock wool | 2.8.1(1) | confirmed |
| Combustible pipe treated per Building Standard Act | 2.8.1(1) | confirmed |
| Rock wool at penetration, chilled and chilled/hot water | 3.1.4 note 1 | confirmed, and wider than stated (finding 3) |
| Same, water supply / drainage / hot water supply | 3.1.5 note 1 | **not mentioned by the item** (finding 3) |
| Steam insulation kept 25 mm back from the face | 3.1.3(15) | confirmed, registry figure correct (finding 7) |
| Equipment doors and 点検口 must stay operable | 3.1.3(18) | confirmed (finding 6) |
| No metal jacketing around dielectric joints | 3.1.3(19) | confirmed (finding 4) |

## What was checked without the primary document

- 統括安全衛生責任者 / 元方安全衛生管理者 thresholds, against secondary legal
  explainers citing 安衛法 15条 and 施行令 7条.
- The prime contractor's daily patrol duty.
- The 2024-04-01 end of construction's overtime-ceiling exemption.
- The 熱絶縁工事業 licence category description.
- All 32 Japanese readings.

## What could not be resolved

- **The painting sequence.** `機械工事塗装要領` was not consulted and is not in
  the registry. Whether it orders painting before insulation is open. Finding 1
  stands until someone reads it.
- **The 4週8休 initiative** has no registry source (finding 11).
- **入契法** is not in the registry (finding 12).
- The registry entries `mhlw-anzen`, `mhlw-jikangai-kensetsu` and `ccus` were
  not re-fetched live; only their listed URLs were taken at face value.

---

## Resolution — 2026-09-02

The owner read this report and asked for the gaps to be fixed. Findings are
left above exactly as written. What changed in the content:

| Finding | Action |
|---|---|
| 1 — paint before insulate | Fixed. The item now says the clause orders testing before both and does not order the two against each other, marks the practical sequence as trade reasoning, and names the separate painting document as not consulted. |
| 3 — fire compartment narrower and wider than stated | Fixed. The rock wool rule is no longer presented as a chilled-water rule: the item now states that the specification carries it twice, for chilled and chilled/hot water and again for water supply, drainage and hot water supply, and that this covers most of what the trade insulates. A sentence was added noting the compartments are defined by the Building Standard Act and are not something a worker identifies by eye. |
| 5 — refrigerant exception and clause conflation | Fixed. The pre-insulated copper tube exception is stated, and the wiring rule is separated into its own bullet as a different clause. The Common mistakes bullet carries the exception too. |
| 8 — 蒸気管等 narrower than the clause | Fixed. Now "steam pipework and lines like it". |
| 9 — two cited sources grounded nothing | Fixed. `mlit-gyoshu-kubun` and `kensetsugyoho` removed from `01.1.03`. `jis-a9501` kept, because the item does discuss it. |
| 10 — confidence label | Changed to `verified`. All four rules are confirmed clause text and the one inference is now marked as inference in the prose. |
| 11 — 4週8休 unsourced | Fixed. `mlit-eizen-shukyu` added to the registry — the same MLIT department that issues the specification, defining 週休2日 as 4週8休以上の現場閉所 and publishing monitoring results — and cited in `01.1.01`. The item now says it is a monitored target on public work, not a description of the industry, and that its reach to a small subcontractor is unsettled. |
| 12 — public-work threshold cited to the wrong statute | Fixed. `nyukeiho` added to the registry, verified through the e-Gov API: 第15条第1項 rewrites 建設業法第24条の8 for public works, removing the value threshold, widening the duty beyond 特定建設業者, and requiring public display. Cited in `01.1.04`, and the item now names the statute. |
| 13 — 圧気工法 omitted | Not changed. Compressed-air work is not work this trade does, and the item is not wrong. |
| 2, 4, 6, 7, 14, 15, 16 | No action required — these record claims that were confirmed. |

**Also added, from finding 9's underlying cause.** Nothing checked whether an
item that discusses a registry document by name actually cites it — the sourcing
checks only validated the ids already listed. `scripts/validate-content.mjs` now
rejects an item that names a document in its prose without citing it, driven by
a `namedAs` field on registry entries, with two guardrail tests.
