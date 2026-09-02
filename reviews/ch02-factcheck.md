# 02.3.01 — fact-check

Item reviewed: `02.3.01` why insulation reduces heat flow.
Date: 2026-09-02. Read-only review: no content file was edited to produce it.
The owner has since read it and asked for the gaps to be fixed — see
**Resolution** at the end for what changed. The findings are left as written,
so they describe the item as it stood before that.

This is the general-craft exemplar. Every item written after it copies its
shape, so an error here propagates by imitation rather than staying put. It
carries `confidence: verified`, the strongest label available, and it is the
only written item that puts a table of numbers in front of the reader.

One source was read in full: Jeon et al. 2017 (`wiley-wool-moisture`,
DOI 10.1155/2017/3938965), reached through a cached copy after the publisher
page returned 403. The second source (`lambda-overview`, ScienceDirect
S2352710221004629) could not be reached — 403 on every route, and a mirror
returned 503. That matters, because most of the lambda table depends on it.

---

## Findings

### 1. The worked example's wet lambda is real, but the condition behind it is not what the item implies

**Claim.** "Now the same section after it has taken up moisture, measured at a
lambda of 0.136." Tied later to: "If material has been rained on before
installation, say so before you fit it."

**What the paper says.** The pair 0.0343 dry / 0.136 wet is genuinely in Jeon et
al., for glass wool, and the four-fold increase is the paper's own headline. But
the wet condition was **four hours in a sealed chamber at over 90 percent
relative humidity**, described by the authors as resembling the summer monsoon,
producing **8.67 percent moisture by weight**. That is humidity uptake, not
rain, not immersion, and not a soaked roll on a laydown yard.

Worse for the comparison, the two figures were **measured by different methods**.
The paper states plainly that its conventional apparatus cannot measure a
moisture-laden sample, so the wet figure was taken by hot wire while the dry
figure was taken on a heat-flow meter. The authors flag this themselves and call
for a standard method. The item presents the pair as one clean before-and-after.

**Severity: significant.** The direction of the lesson is right and probably
conservative — real rain-soaked material could be worse — so nothing unsafe
reaches the reader. But this is the item's centrepiece calculation, in the
exemplar, under `confidence: verified`, and the measurement it rests on is not
the measurement the prose describes.

**Suggested action.** State the actual test condition and the method caveat, or
soften "the same section after it has taken up moisture" to a measured
laboratory wet condition.

### 2. The summary states the 23x ratio in the direction a reader can invert

**Claim (summary, so it appears on every card and search result).** "motionless
air conducts heat about twenty-three times worse than water."

The arithmetic is right (0.598 ÷ 0.026 = 23.0) and the ratio is stated by the
cited paper itself. The problem is the wording. "Conducts heat worse" applied to
the *better* insulator requires the reader to already hold the chain
*worse conductor → lower lambda → better insulator*. A reader who takes "worse"
as an intensifier — as in "the leak got worse" — arrives at the opposite
conclusion: that air lets 23 times more heat through than water.

The body says it the safe way round: "water conducts heat about twenty-three
times better than air." The summary does not.

**Severity: significant**, given who reads this. CLAUDE.md's whole premise is
that the reader cannot catch the mistake, and this is a sentence that reverses
under an ordinary misreading.

**Suggested action.** Put the body's phrasing in the summary.

### 3. The table gives no temperature while the prose says it does

The item states, under what the figures do not settle: "The lambda values above
are published measurements taken dry, **at a stated mean temperature**, on a
test sample." No temperature is stated anywhere in the item.

It is not merely missing, it is load-bearing. The air figure (0.026) and the
water figure (0.598) come from two different physical-constants references and
are not stated to be at the same temperature — 0.026 is consistent with roughly
25 °C, 0.598 is the usual 20 °C value. The item sets them side by side and
divides one by the other.

**Severity: significant** (self-contradiction, and it undercuts the 23x figure
the summary leads with).

**Suggested action.** State the reference condition, or drop the claim that one
is stated.

### 4. The polyurethane figure does not say whether it is initial or aged

**Claim.** "Rigid polyurethane foam | from 0.022".

Initial and aged lambda for PU and PIR differ materially: the blowing agent
diffuses out over months to years and is partly replaced by air, moving a fresh
~0.022 figure into roughly 0.024–0.028 as a long-term design value. The item
gives one unqualified number in a table whose stated purpose is comparing
materials.

**Severity: significant.** Partly mitigated by the item telling the reader not
to work back from a lambda to a thickness.

**Suggested action.** Say which state the figure is, or give an aged range.

### 5. Four table rows could not be verified against the source they rest on

Glass wool 0.030–0.046, rock wool 0.032–0.044, cellular glass about 0.041, and
the PU figure all trace to `lambda-overview`, which could not be retrieved.
Third-party summaries of the same paper match the glass wool range closely but
give a different rock wool upper bound (0.046 against the item's 0.044).
Cellular glass is plausible against general sources, which spread from about
0.035 to 0.055 depending on product and density, but was not confirmed against
the cited paper.

**Severity: significant** — these are unverified against their own stated
source, which is a different and worse position than unsourced.

**Suggested action.** Someone with access should check these four rows line by
line before the `verified` label is trusted for them.

### 6. The steel figure has no source behind it

**Claim.** "Carbon steel | on the order of 50", and "Steel at roughly 50 is
about two thousand times more conductive than still air."

Neither cited paper contains it — one is a wool moisture study, the other a
survey of insulation materials. The third source, `general-heat-transfer`, is a
tier 3 placeholder with no document behind it. The figure is plausible (carbon
steel is commonly given as 43–54 W/(m·K) at room temperature) and the derived
ratio is arithmetically right, but the item is `sourceBasis: cited` and nothing
cited says it.

**Severity: significant** as a sourcing gap, minor as physics.

**Suggested action.** Add a source, or mark the row as general knowledge.

### 7. JIS A 9501 is discussed by name but not cited

The item makes three specific claims about JIS A 9501 — that it governs
insulation practice in Japan, that it is a paid document, and that a
specification citing it would govern over this table. `jis-a9501` is in the
registry, tier 1, but is not in this item's `sources`.

CLAUDE.md rule 3 says citation is by registry id. A claim about what a named
document is and does should cite it.

**Severity: minor and procedural**, but the validator cannot catch this class —
it checks that cited ids exist, not that named documents are cited.

**Suggested action.** Add `jis-a9501` to `sources`.

### 8. One claim about cold systems rests on nothing cited

"on a cold system it gets worse rather than better as condensation keeps
forming." Standard trade knowledge and low risk, but the Wiley paper's humidity
test was a bare sample in ambient air, not an operating cold pipe behind a vapor
barrier. Nothing cited supports it.

**Severity: minor.**

### 9. Registry: an open-access CC-BY paper is flagged `quotable: false`

`wiley-wool-moisture` is Creative Commons Attribution — explicitly redistributable
with credit — and the registry flags it `quotable: false` alongside the paid JIS
and MLIT documents. The item is unaffected, since it paraphrases throughout.
Raised as registry hygiene: the flag is doing two different jobs.

**Severity: minor.** Not this item's defect.

### 10. Two "Common mistakes" bullets are the same mistake

"Reading a lambda value off a data sheet and assuming it holds on site" and
"Treating a published lambda as the value on your pipe" state the same point in
the same section, with the same explanation. In the exemplar, a duplicated
bullet is a pattern other items will copy.

**Severity: minor**, editorial.

### 11. Japanese readings are correct

保温 ほおん, 熱伝導 ねつでんどう, 熱伝導率 ねつでんどうりつ, 熱抵抗 ねつていこう.
All four standard, no trade reading missed. Worth noting that this item cites no
Japanese-language source at all, so nothing in its own sourcing could have
caught a wrong reading.

### 12. No reproduced standard text

JIS A 9501 is described, not reproduced, and the academic sources are restated
rather than quoted. No copyright problem found.

---

## What was verified, and against what

Read in full from the cited paper (Jeon et al. 2017):

- still air 0.026 W/(m·K), citing Kadoya, Matsunaga & Nagashima 1985
- water 0.598 W/(m·K), citing Sengers & Watson 1986
- the 23x ratio, stated by the paper itself
- dry glass wool 0.0343, wet glass wool 0.136, a four-fold increase
- the test conditions behind the wet figure: >90 percent RH for four hours,
  8.67 percent moisture by weight, hot wire rather than heat-flow meter

Checked by hand, all correct:

- 0.050 ÷ 0.0343 = 1.46
- 0.050 ÷ 0.136 = 0.37
- 0.37 ÷ 1.46 ≈ 0.25, "about a quarter"
- 1.46 × 0.136 ≈ 0.199 m, "roughly 200 mm", four times the thickness

The physics prose — conduction through loosely packed gases, convection
suppressed by pore size, radiation smallest at pipework temperatures and rising
steeply with temperature, resistances in series, and the cylindrical-geometry
point that doubling thickness on a pipe does not halve heat loss — is correct as
stated and not overstated.

## What could not be resolved

- **`lambda-overview` could not be retrieved** (403 from ScienceDirect on every
  route, 503 from a mirror). The rock wool, cellular glass and polyurethane rows
  remain unverified against their own cited source. Finding 5 is open until
  someone with access checks them.
- The reference temperature the writer intended for the table (finding 3).

---

## Resolution — 2026-09-02

The owner read this report and asked for the gaps to be fixed. Findings are
left above exactly as written. What changed in the content:

| Finding | Action |
|---|---|
| 1 — wet lambda test condition | Fixed. The worked example now states what the wet figure is: four hours in a sealed box above 90 percent relative humidity, a little under nine percent moisture by weight, and dry and wet measured on two different instruments because the standard apparatus cannot measure a wet sample — which the study says itself. The item now tells the reader to read the four-fold drop as the size of the effect, not as a measurement of what rain does, and says plainly that no source consulted measures the rained-on case. |
| 2 — summary inverts under a plain misreading | Fixed. The summary now reads "Water conducts heat about twenty-three times better than still air, which is why wet insulation stops working." The body sentence gained the two figures and an instruction to read it the way round it is written. |
| 3 — temperature claimed but not stated | Fixed. The table now carries the condition above it — dry, around room temperature, roughly 20 to 25 °C — and says the air and water figures come from different references and are not at exactly the same temperature, so the ratio is an order-of-magnitude comparison. The sentence claiming "a stated mean temperature" is gone. |
| 4 — polyurethane initial vs aged | Fixed. The row reads "from 0.022, when new", with a paragraph explaining that the blowing agent diffuses out over months and years and that the aged design value is higher. |
| 5 — four rows unverifiable | Partly fixed, honestly rather than by assertion. ScienceDirect refused every route again in this session, so the figures were not changed and are not claimed as verified: the item now records that the rock wool, cellular glass and polyurethane rows come from a survey paper that could not be re-opened, that published ranges move with density and product, and that every row is an order of magnitude rather than a specification. `confidence` dropped from `verified` to `standard-practice`. |
| 6 — steel figure unsourced | Fixed. The item now says the steel row is there for scale, that no source in the registry states it, and that nothing in this reference asks the reader to calculate with it. |
| 7 — JIS A 9501 named but not cited | Fixed. `jis-a9501` added to `sources`, and the validator now rejects this class of gap generally — see below. |
| 8 — cold-system condensation uncited | Fixed. Now marked as a claim no source consulted here measures, with the reasoning shown. |
| 9 — CC-BY paper flagged `quotable: false` | **Not changed, deliberately.** The licence claim could not be re-verified in this session, and `quotable: false` is the safe direction: it costs nothing, since the item paraphrases throughout. Left for the owner. |
| 10 — duplicated Common mistakes bullet | Fixed. The duplicate was replaced with a bullet warning against reading the wet-material figure as what rain does. |
| 11, 12 | No action required. |

**Also added, from finding 7.** `scripts/validate-content.mjs` now rejects an
item that names a registry document in its prose without citing it, driven by a
`namedAs` field on registry entries, with two guardrail tests. This is the
check that would have caught finding 7 on the day it was written.
