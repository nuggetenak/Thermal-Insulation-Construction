# 09.1.03 — fact-check (safety-critical, every line)

Item reviewed: `09.1.03` three-point contact.
Date: 2026-09-02. Read-only review. No content file was edited.

This is the every-line review CLAUDE.md requires for a `safetyCritical`
chapter, which this item had never had. It was written to be checkable and it
checks out: every figure in it traces to the cited source and the arithmetic is
right. The findings below are about **attribution** — three places where the
item says "both sources" or "the specification" when only one source, or a
different part of one source, actually says it.

Sources read directly, not via search snippets:

- `jniosh-ladder-falls` — https://www.jniosh.johas.go.jp/publication/pdf/ladder.pdf
- `kensaibou-low-height` — https://www.kensaibou.or.jp/safe_tech/leaflet/files/7f8cfb3e8da875aaf223e2a7c20f9858ce0032a1.pdf

**A caveat on verification depth.** The kensaibou leaflet was extracted and read
twice, independently, and the two passes agree. The JNIOSH document was read in
full in the first pass; a second extraction attempted in this session recovered
only part of it — several pages, including the two statistical tables, use a
font with no usable character mapping and come out as mojibake. **The JNIOSH
figures below therefore rest on a single successful reading, not two.** They are
consistent and internally coherent, but a human should spot-check Tables 1 and 2
against the PDF before chapter 09 is written against this item as a pattern.

---

## Findings

### 1. The descending-backwards rule is attributed to a source that does not state it for ladders

**Claim.** "Turning your back to the ladder on the way down is the other
behaviour both sources name... The association's leaflet prohibits it outright."

**What the leaflet actually does.** Its ladder block (はしご) carries six rules:
keep clear of overhead lines, secure it, about 75°, not on unstable or slippery
ground, always three-point contact when climbing, do not climb carrying things.
**Descending backwards is not among them.** The 背面降りはしない rule appears in
the neighbouring **stepladder (脚立)** block, alongside the top-plate and
straddling prohibitions.

This was checked in both extraction passes and is not an artefact: on the page,
that rule sits with the stepladder illustrations.

JNIOSH does state it for ladders, so the advice itself is sound and
single-sourced. The item's "both sources" framing is what fails.

**Severity: significant.** The item's own argument for the rule's weight is that
two independent Japanese bodies say it. For this rule, one does.

There is a second-order problem. The item elsewhere tells the reader, correctly,
that no source states three-point contact for stepladders and that 脚立 must be
treated as its own topic. But the leaflet rule the item is reaching for here is
a stepladder rule. Fixing the attribution and leaving that paragraph unchanged
would leave the item citing the stepladder block for ladders while warning
against exactly that transfer.

**Suggested action.** Attribute descending-backwards to JNIOSH alone, and
consider whether the 脚立 section should gain the leaflet's 背面降り rule, which
belongs to it.

### 2. "Without qualification" overstates what JNIOSH says about carrying things

**Claim.** "This is why both sources say, separately and without qualification,
that you do not climb holding things."

The leaflet's rule is genuinely unqualified. JNIOSH's is not: its wording is
conditioned on the load being one that prevents a stable body position, and its
list of unsafe behaviours in the fatal cases specifies a *heavy* load in one
hand.

The item's practical instruction — do not carry anything, send it up separately
— is the safer reading and is what the leaflet says. But "both sources, without
qualification" is not accurate to JNIOSH.

**Severity: minor to moderate.** The reader action is unaffected and safe.

**Suggested action.** Attribute the unqualified version to the leaflet, and note
that JNIOSH conditions it on stability.

### 3. `設備工事` is presented as settled classification when it is inference

**Claim.** "設備工事 — building services and equipment work, which is the
category your job sits in — accounts for 35 of them... Not roofing. Not civil
engineering. **Your trade.**"

JNIOSH's table splits construction three ways — 土木工事, 建築工事, 設備工事 —
and does not itemise sub-trades. That thermal insulation work falls in the
設備工事 bucket is a reasonable trade-classification inference. Neither cited
source states it.

**Severity: moderate.** This is the item's emotional hinge — the sentence that
makes the statistics personal to the reader — and it is the one link in the
chain that is inferred rather than sourced. Everything numeric around it is
solid; this is not.

**Suggested action.** Hedge it, or find a source mapping 熱絶縁工事業 onto the
JNIOSH categories.

### 4. The worker's duty to use provided access is real law but not in the cited sources

**Claim.** "the regulation obliges your employer to provide a safe means of
getting up and down, and obliges you to use what is provided."

The employer's duty (安衛則 526条, over 1.5 m) is present in the JNIOSH
regulation summary and the item renders "over" correctly rather than "or more".
The **worker's** duty is 526条 paragraph 2 — real, but not in the excerpt either
cited source reproduces.

**Severity: minor.**

**Suggested action.** Cite the article directly, or scope the sentence to the
employer's duty.

### 5. The 2015 publication date is not in the document

**Claim.** "The institute's ten-year study was published in 2015."

No publication date appears in the PDF. A copy hosted elsewhere has a filename
implying 2015, which is not evidence. The data window itself (FY2004–2013) *is*
stated in the source, so nothing statistical depends on this.

**Severity: minor**, but the item carries `confidence: verified`, and this
particular sentence is not verified.

**Suggested action.** Replace the publication year with the data window, which
is what the argument actually needs.

### 6. The item reproduces both of the source's statistical tables in prose

The "Why it matters" and "Worked example" sections between them restate the
whole of JNIOSH Table 1 (103, and the 35 for 設備工事) and the whole of Table 2
(52 / 29 / 22 overall, 15 / 10 / 10 for 設備工事).

`jniosh-ladder-falls` is registered `quotable: false`, though it is also
registered `access: open`. No Japanese text is reproduced anywhere, and figures
are facts rather than expression, so this is defensible. But the registry flag
says one thing and the item does another, and CLAUDE.md is explicit that an
agent should not resolve that kind of question silently in a safety-critical
chapter.

**Severity: moderate**, as a policy question rather than an error.

**Suggested action.** Owner decides whether `quotable: false` on an open-access
safety publication was meant to cover its statistics. If it was not, the flag is
wrong for this entry; if it was, the item needs trimming.

### 7. Two paraphrases are italicised in a way that reads as quotation

*do not go up or down holding objects* and *working at low height — are you
letting your guard down?* are the writer's English renderings of Japanese
originals, not quotations. Italics on a `quotable: false` source invite a
reviewer to read them as quoted text.

**Severity: minor.** Presentation only.

### 8. HANDOFF.md says four honest gaps; there are three

Not a defect in the item. The item contains three admissions that no consulted
source settles a point: which rail or rung to grip, whether a forearm or knee
counts as a contact point, and three-point contact for stepladders. All three
were checked against both PDFs and all three are genuine — the sources really
are silent. `HANDOFF.md` and this session's earlier note said four.

**Severity: informational.** The docs have been corrected to three.

---

## What was verified, and against what

Checked against the extracted text of the two cited PDFs, and the arithmetic by
hand:

| Claim | Result |
|---|---|
| 103 fatal ladder falls in construction over ten years | confirmed, JNIOSH Table 1 |
| 52 climbing / 29 working / 22 unrecorded | confirmed, JNIOSH Table 2 |
| 設備工事 accounts for 35 of the 103 | confirmed, JNIOSH Table 1 |
| 15 of those 35 during 昇降 | confirmed, JNIOSH Table 2 |
| 52 of 103 is 50.5 percent | correct |
| Worst case 29 + 22 = 51 against 52 | correct, and the argument holds |
| 1.5 and 3.5 deaths a year for 設備工事 | correct (15÷10, 35÷10) |
| Three-point contact, four points, three stay, one moves | confirmed in both sources |
| Ladder is for climbing, not for working from | confirmed in both sources |
| No work from a ladder at 2 m as a rule (JNIOSH) | confirmed |
| 安衛則 518条 / 519条, work platform at 2 m | confirmed via the JNIOSH summary, paraphrased not reproduced |
| 安衛則 526条 threshold is *over* 1.5 m | confirmed, and the item's "more than" is the correct rendering |
| Once a ladder starts to move it is very hard to stop | confirmed, JNIOSH |
| Unsecured ladder is one of five failure categories | confirmed, JNIOSH lists exactly five |
| 脚立 rules: not the top plate, no straddling, brace against top plate or rung | confirmed, leaflet stepladder block |
| No three-point contact rule stated for 脚立 | confirmed by absence in both sources |
| 2025 leaflet: head injury dominates; three helmet failure groups | confirmed, leaflet page 1, dated 2025.3 |
| 20–30 deaths a year across all industries, about half construction, to 2022 | confirmed, leaflet page 1 |
| All 11 kana readings | correct; none is a trade reading that was got wrong |
| Tier requirement for a safety-critical item | met with margin: one tier 1 and two tier 2 sources |
| Reproduced standard text | none found; all restatement is English paraphrase |

The three "no source consulted states this" admissions were each checked against
both documents. All three are genuine, not laziness.

## What could not be resolved

- **Independent re-verification of the JNIOSH tables.** See the caveat at the
  top: the second extraction pass could not read those pages. The figures rest
  on one reading.
- The publication year of the JNIOSH study (finding 5).
- Whether 保温保冷工事 is formally counted within 設備工事 in this
  classification, or could fall under 建築工事 depending on contract structure
  (finding 3).
- Whether `quotable: false` on this registry entry was intended to cover the
  source's statistics (finding 6).
- The cross-referenced items (`09.1.01`, `09.1.02`, `09.1.04`, `08.1.01`,
  `08.2.08`) are unwritten, so the item's claims about what they will cover
  could not be checked.
