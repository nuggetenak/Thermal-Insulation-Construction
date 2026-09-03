Reports from the fact-checker agent land here.

## Reports

| Report | Covers | Written |
|---|---|---|
| `ch01-factcheck.md` | `01.1.01` – `01.1.04` | 2026-09-02 |
| `ch01.2-factcheck.md` | `01.2.01` – `01.2.05` | 2026-09-03 |
| `ch02-factcheck.md` | `02.3.01` | 2026-09-02 |
| `ch09-factcheck.md` | `09.1.03` | 2026-09-02 |

## Naming

A whole chapter is `chNN-factcheck.md`. A single section is
`chNN.S-factcheck.md`. Chapters here are written a section at a time, and one
file per chapter cannot hold two reviews without the second overwriting the
first one's findings and its Resolution.

Every report names the item ids it covers and the commit it read them at.
Content moves after a review is written — a report is a statement about a
particular version, not about the file forever.

A report records what was checked and what was found. Writing one never changes
content: acting on a finding is the owner's decision. The fact-checker has no
Write tool for the same reason — a reviewer that can edit content can quietly
"fix" a claim it has misread, and the misreading then looks like a correction.
It returns its report and somebody else saves it.

**Give the reviewer the primary text, not the notes the writer worked from.**
Where writers were briefed from a prepared pack of clauses, that pack is a
single point of failure: if it misread something, every item written from it
inherits the error and they all agree with each other. Checking items against
the pack would confirm the error rather than find it. Extract the clauses
verbatim from the actual documents and have the reviewer test the pack too.

When the owner does decide, the findings stay as written and a dated
**Resolution** section is appended saying what was done with each one, including
what was deliberately left alone and why. That way the next reviewer can see
both what was looked at and what came of it, and does not re-raise a finding
that was considered and declined.
