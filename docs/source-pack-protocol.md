# Building a source pack

A source pack is a set of verified clauses handed to a writing agent so it works
from law rather than from memory. It is the largest quality lever this project
has found, and it is also the largest single point of failure, because one pack
feeds a whole section and every item inherits whatever it gets wrong.

This document exists because the pack for section 01.2 got two things wrong and
all five items shipped the errors. Read the post-mortem before the rules — the
rules only make sense as answers to it.

## What went wrong, exactly

### Error one: a selection failure

The pack cited 安衛則第619条 (清掃等の実施) and moved on to 第628条.
**第620条 is the very next article.** It is captioned 労働者の清潔保持義務 and it
requires a worker to attend to the cleanliness of the work area and not to
discard waste anywhere other than the place set aside for it.

That clause is the legal root of the entire housekeeping item. Missing it,
`01.2.05` concluded *positively* that the daily standard was trade practice
rather than law — it did not merely omit a rule, it asserted the opposite of
one.

The cause was not careless reading. Every article that was read was read
correctly. The cause was that articles were **chosen one at a time from
expectation**: a list of numbers written down from a mental model of what would
be relevant, then extracted. 第620条 was never a candidate, so no amount of care
in reading would have found it. The failure was upstream of reading.

### Error two: a compression failure

廃掃法施行規則第18条の2 opens its first 号 by defining the waste as
「建設工事に伴い生ずる廃棄物（**特別管理一般廃棄物及び特別管理産業廃棄物を除く**。…）」.

The pack listed every condition of that article **except** this one. For a trade
that strips old insulation it is the condition most likely to bite, because
廃石綿等 — waste asbestos — is specially controlled industrial waste. The pack
then told writers the condition list was complete, so `01.2.04` presented a test
a reader could fail while believing they had passed it.

The article contains two 除く exclusions. The one that sat where a condition was
expected — in the イ limb, excluding demolition and new build — was captured.
The one in a parenthetical, which read as definitional scope-setting rather than
as a condition, was dropped. **Summarising is lossy, and the loss is biased**:
parentheticals, 除く, ただし, 等, 限る, and the difference between 努める and
しなければならない all read as noise while you are hunting for the operative rule.

### Error three: the one worth remembering longest

That article was read **twice**. Once when building the pack. Once again a day
later, deliberately and at the primary text, to refute an automated reviewer's
claim that 改築 belonged in the exclusion list — a refutation that was correct.

Both times, the missing exclusion sat two lines above what was being examined,
and both times it went unseen. **Verifying a specific claim against a source is
not the same task as auditing that source, and it does not accidentally become
that task no matter how carefully it is done.** Attention narrows to the claim.
Plan an audit as its own pass, or it will not happen.

## The rules

### 1. Sweep neighbourhoods, never article numbers

Do not write down a list of articles you expect to need. Take the structural
unit — the chapter or section that contains anything you need — and read every
caption in it before deciding what to extract.

`scripts/primary-sweep.mjs` does this mechanically:

```
node scripts/primary-sweep.mjs --law 347M50002000032 --cited 619,604,540 --window 3
```

It prints every uncited article within `--window` of anything you cite, with its
caption. Run it, read every caption, and dismiss each one deliberately. Run
against the 01.2 citation list it surfaces 第620条 immediately — and it also
surfaced two further clauses that a full Opus fact-check had missed:

- **第549条** — escape routes not in everyday use must be marked and kept
  readily usable, which is exactly what an access-routes item is about.
- **第536条** — nothing may be dropped from 3 m or more without a chute and a
  watcher, and its second paragraph binds the worker directly.

Both are now in `01.2.03` and `01.2.04`. Neither would have been found by
reading more carefully; both were found by looking one article to the side.

### 1b. A clause number is not an address until you say which part

Both documents this project leans on hardest reuse their numbering. The MLIT
outline has two volumes where 第16 is 粉塵対策 in one and 作業場の出入口 in the
other. The MLIT specification repeats clause numbers across its 編 — 1.5.3 is
一工程の施工の確認及び報告, 冷凍機, and 連結送水管, three subjects under one
number in one file.

So: name the volume, the 編, or the part, every time. Section 01.2 got the right
clauses and cited eight of them by bare number, which left nothing a reviewer
could check without re-deriving the whole thing.

### 1c. Read the definition clause. Always. Sweeping cannot find it.

`primary-sweep.mjs` sweeps neighbours **by number**, and a document's
definitions are never numerically adjacent to the clause that uses them. This
is a blind spot in the method, not in how carefully it was applied.

Section 01.3 proved it. Three of its findings die on this one rule:

- 建設業法第2条第5項 defines 元請負人 as **the party that orders work under a
  subcontract** — whoever engaged you, at any tier. The pack rendered it "the
  prime contractor", and two items then told the reader the 20-day inspection
  duty was owed by a company their employer has no contract with.
- Specification 1.1.2 defines 一工程の施工 as work using the same material and
  the same method **that the 監督職員 has consented to**. Two items glossed it
  as "a stage the job is divided into", and both then asked, as an open
  question, something the definition answers.
- Specification 1.1.2 also defines 工事関係図書 as a class of documents. One
  item defined it instead by the single clause that uses it, which is circular.

So, before choosing any clause from a document:

1. Read its definition article — 第2条 in a statute, 用語の定義 in a
   specification — in full.
2. Carry every defined term the pack will use, with the document's own words.
3. Check the pack's glossary entries against those definitions, not against
   what the term appears to mean in the clause you happen to be citing.

The same applies to a statute's foundation articles. 建設業法第19条, which
requires a construction contract to state the completion-inspection timing, the
handover time and the defect-liability terms, is nowhere near 第24条の4 and is
directly relevant to it.

### 2. Copy the qualifiers, not the gist

For every clause in the pack, carry across:

- every parenthetical, especially one containing 除く
- every ただし proviso and every 限る restriction
- 等 **and その他の**, both of which make a rule wider than the examples it
  names. その他の is the commoner of the two in statute and was the one missed:
  第26条の4第1項's 「その他の技術上の管理」 turned a list of examples into a
  closed list of four in two items
- whether the duty is しなければならない or 努める, because a pack that renders
  an endeavour duty as a flat obligation produces content that overstates the law
- who the duty binds — 事業者, 注文者, 元請業者, or 労働者. A duty on the worker
  is worth more to this readership than three duties on their employer, and it
  is the class most often missed.

The sweep tool counts these tokens per article so you know how many limits you
are responsible for having carried.

### 3. Mark every list COMPLETE or PARTIAL

A condition list in a pack must say which it is:

- **COMPLETE** — every element was checked back against the clause text, one at
  a time, after the list was written.
- **PARTIAL** — say what is missing and why, so the writer states the gap in the
  item instead of presenting a whole test.

`01.2.04` presented five conditions as an exhaustive test when the ordinance has
seven. Had the pack said PARTIAL, the item would have said so too, and a reader
would have asked instead of concluding.

### 4. Reconcile as a separate pass

Never write the pack in the same motion as reading the source. When the pack is
drafted, go back to the verbatim text and check the pack against it clause by
clause, looking only for what the pack does not say. This is the pass that error
three shows will not happen by itself.

### 5. Keep the verbatim extract, and keep it out of the repo

Extract the clauses verbatim into a working file and keep it beside the pack for
as long as the section is being written. **Build that extract from the source's
structural unit, not from the list of clauses you ended up citing** — otherwise
the reviewer inherits the pack's blind spot in a new wrapper, and confirms the
selection instead of testing it. The reviewer needs it (see below), and
so does anyone re-checking a finding.

Statutes and 告示 are outside copyright under 著作権法第13条. **The MLIT
specification is not** — `content/_sources.json` marks it `quotable: false`, so
a verbatim extract of it stays in the scratchpad and never gets committed. The
pack itself is paraphrase and can be committed; see `docs/source-packs/`.

### 6. Give the reviewer primary text, and tell it the pack is the suspect

This is what caught both errors. A fact-checker handed the pack would have
confirmed it: every item agrees with the pack, because every item came from it.
Hand over the verbatim extraction instead and say in terms that the pack is the
thing under test. `.claude/agents/fact-checker.md` carries this rule.

### 7. Correct the pack, not just the content

When a review finds a pack error, fix the pack, the registry note built from it,
and the items — in that order, because the pack is what the next section
inherits. Mark corrections in place and dated, so the next writer can see which
parts have been through a review and which have not.

Packs live in `docs/source-packs/`, one per section.
