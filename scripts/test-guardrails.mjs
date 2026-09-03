#!/usr/bin/env node
/**
 * test-guardrails.mjs
 *
 * Tests the validator, not the content.
 *
 * Every quality rule in this project is enforced by scripts/validate-content.mjs.
 * If a future session refactors that file and a check quietly stops firing,
 * nothing announces it — content keeps passing, and the failure is invisible
 * until someone reads three hundred items and notices they drifted.
 *
 * So each guard gets a deliberately broken fixture and must reject it. A guard
 * that no longer catches its own fixture is a guard that has stopped working.
 *
 * Zero dependencies, matching the rest of the scripts. Run: npm test
 */

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TMP = resolve(ROOT, 'content/_test');

/** A minimally valid item. Each test breaks exactly one thing. */
const base = {
  id: '"02.3.02"',
  title: '"Effect of thickness"',
  chapter: '"02"',
  section: '"02.3"',
  stage: '2',
  kind: 'article',
  status: 'review',
  summary: '"A short valid summary well under the word limit."',
  sourceBasis: 'general',
};

const BODY = `
# Effect of thickness

## What it is

${'Adding thickness adds resistance to heat flow through the layer. '.repeat(12)}

## Why it matters on the job

${'Thickness comes from the specification, not from judgement on site. '.repeat(12)}

## In detail

${'Each added layer contributes resistance in series with the others. '.repeat(12)}

## Common mistakes

- Guessing a thickness rather than reading the specification.
`;

function write(overrides = {}, body = BODY, extraLines = []) {
  const fm = { ...base, ...overrides };
  const lines = Object.entries(fm)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `${k}: ${v}`);
  mkdirSync(TMP, { recursive: true });
  writeFileSync(
    resolve(TMP, `${String(fm.id).replace(/"/g, '')}-test.md`),
    `---\n${[...lines, ...extraLines].join('\n')}\n---\n${body}`,
    'utf8',
  );
}

function validate() {
  try {
    execFileSync('node', [resolve(ROOT, 'scripts/validate-content.mjs')], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return { failed: false, output: '' };
  } catch (e) {
    return { failed: true, output: (e.stdout || '') + (e.stderr || '') };
  }
}

const tests = [];
const test = (name, setup, expect) => tests.push({ name, setup, expect });

test('rejects an id that is not in the taxonomy', () => write({ id: '"99.9.99"' }), 'not in the taxonomy');
test('rejects a filename that does not match its id', () => {
  write();
  mkdirSync(TMP, { recursive: true });
  writeFileSync(resolve(TMP, 'wrong-name.md'), `---\nid: "02.3.03"\ntitle: "x"\nchapter: "02"\nsection: "02.3"\nstage: 2\nkind: article\nstatus: review\nsummary: "x"\nsourceBasis: general\n---\n${BODY}`, 'utf8');
}, 'must begin with its id');
test('rejects a dangling cross-reference', () => write({}, BODY, ['seeAlso: ["99.9.99"]']), 'unknown id');
// Body links were unchecked for a long time: seeAlso was validated, inline
// links were not, so an invented id rendered as a live link to nothing. Both
// directions matter — an unwritten target is legitimate and must keep passing.
test('rejects a body link to an id that is not in the taxonomy', () =>
  write({}, BODY.replace('## Common mistakes', 'Thickness is covered in [x](../ch01/01.3.99-nope.md).\n\n## Common mistakes')),
  'not in the taxonomy');
test('accepts a body link to a real but unwritten item', () =>
  write({}, BODY.replace('## Common mistakes', 'Inspection is covered in [01.3.04](../ch01/01.3.04-inspection.md).\n\n## Common mistakes')),
  null);
test('rejects a body link whose id has a digit too many', () =>
  write({}, BODY.replace('## Common mistakes', 'Inspection is covered in [01.3.04](../ch01/01.3.041-inspection.md).\n\n## Common mistakes')),
  'malformed id');
test('rejects a body link whose id has a digit too many in front', () =>
  write({}, BODY.replace('## Common mistakes', 'Inspection is covered in [01.3.04](../ch01/101.3.04-inspection.md).\n\n## Common mistakes')),
  'malformed id');
test('rejects a body link into a chapter directory with an unreadable id', () =>
  write({}, BODY.replace('## Common mistakes', 'Inspection is covered in [01.3.4](../ch01/01.3.4-inspection.md).\n\n## Common mistakes')),
  'carries no id the app can read');
test('rejects status approved set by hand', () => write({ status: 'approved' }), 'not settable here');
test('rejects first-person voice', () => write({}, BODY.replace('## In detail', '## In detail\n\nI could not find a source for this.')), 'first-person');
test('rejects a missing required heading', () => write({}, BODY.replace('## Common mistakes', '## Something else')), 'missing required section');
test('rejects a non-canonical term', () => write({}, BODY.replace('Adding thickness', 'Adding cladding thickness')), 'canonical term');
test('accepts a non-canonical term when explicitly allowed', () => write({}, BODY.replace('Adding thickness', 'Adding cladding thickness'), ['allowVariants: ["cladding"]']), null);
test('rejects a kana-only violation in a reading', () => write({}, BODY, ['terms:', '  - term: 保温', '    reading: hoon', '    meaning: hot insulation']), 'must be kana only');
test('rejects an unregistered image', () => write({}, BODY.replace('## Common mistakes', '![A photo of something](not-registered)\n\n## Common mistakes')), 'not in content/_images.json');
test('rejects an image with no alt text', () => write({}, BODY.replace('## Common mistakes', '![](not-registered)\n\n## Common mistakes')), 'no alt text');
test('rejects an oversized summary', () => write({ summary: `"${'word '.repeat(40).trim()}"` }), 'limit is');
test('rejects a safety-critical item with no source', () =>
  write({ id: '"09.1.01"', title: '"Selection"', chapter: '"09"', section: '"09.1"', stage: '1', confidence: 'verified', sourceBasis: 'general' }),
  'must cite at least one source');
test('rejects a safety-critical item sourced only from general knowledge', () =>
  write({ id: '"09.1.01"', title: '"Selection"', chapter: '"09"', section: '"09.1"', stage: '1', confidence: 'verified', sourceBasis: 'cited' }, BODY, ['sources:', '  - general-heat-transfer']),
  'tier 1 or tier 2');
// A document discussed by name is a claim about that document. 02.3.01 named
// JIS A 9501 three times without citing it and nothing noticed, because the
// sourcing checks only validated the ids that were already listed.
test('rejects an item that names a registry document without citing it', () =>
  write({}, BODY.replace('## Common mistakes', 'Thickness in Japan is governed by JIS A 9501.\n\n## Common mistakes')),
  'does not cite');
test('accepts naming a registry document when it is cited', () =>
  write({}, BODY.replace('## Common mistakes', 'Thickness in Japan is governed by JIS A 9501.\n\n## Common mistakes'), ['sources:', '  - jis-a9501']),
  null);
test('rejects an unknown source id', () => write({ sourceBasis: 'cited' }, BODY, ['sources:', '  - no-such-source']), 'unknown id');
test('rejects a reproduced block of standard text', () =>
  write({}, BODY.replace('## Common mistakes', `> ${'reproduced clause text '.repeat(15)}\n\n## Common mistakes`)),
  'long quoted passage');

// --- guards added after section 01.2, each for a defect that shipped clean ---

test('rejects a body link whose filename is not the one the taxonomy holds', () =>
  write({}, BODY.replace('## Common mistakes', 'See [02.3.01](../ch02/02.3.01-wrong-file-name.md).\n\n## Common mistakes')),
  'names a file that does not exist');

test('accepts a body link whose filename matches the taxonomy', () =>
  write({}, BODY.replace('## Common mistakes', 'See [02.3.01](../ch02/02.3.01-why-insulation-reduces-heat-flow.md).\n\n## Common mistakes')),
  null);

test('rejects a Japanese term in the prose that no item declares', () =>
  write({}, BODY.replace('Adding thickness', 'Adding 換気扇 thickness')),
  'no item declares it');

test('accepts a Japanese term another item already declares', () =>
  write({}, BODY.replace('Adding thickness', 'Adding 保温 thickness')),
  null);

test('accepts a Japanese function word without a glossary entry', () =>
  write({}, BODY.replace('Adding thickness', 'The clause carries a ただし proviso, so adding thickness')),
  null);

test('still rejects a trade term dressed up next to a function word', () =>
  write({}, BODY.replace('Adding thickness', 'The clause carries a ただし proviso on 換気扇 work, so adding thickness')),
  'no item declares it');

test('accepts a longer word built around a declared term', () =>
  write({}, BODY.replace('Adding thickness', 'Adding 熱伝導率測定 thickness')),
  null);

test('rejects a clause reference to a registry document that is not cited', () =>
  write({}, BODY.replace('Adding thickness', 'Clause 1.3.6 of the specification applies, and adding thickness')),
  'does not cite it');

test('accepts a clause reference when the document is cited', () =>
  write({ sourceBasis: 'cited' }, BODY.replace('Adding thickness', 'Clause 1.3.6 of the specification applies, and adding thickness'), ['sources:', '  - mlit-kikai-shiyosho']),
  null);

test('rejects prose that points at the writer\'s briefing', () =>
  write({}, BODY.replace('Adding thickness', 'That is not settled by anything in this pack, and adding thickness')),
  "refers to the writer's briefing");

test('rejects prose that cites a section letter of the briefing', () =>
  write({}, BODY.replace('Adding thickness', 'See section D below. Adding thickness')),
  "refers to the writer's briefing");

// Regressions: both of these used to be rejected, and both are correct content.
test('accepts two separately quoted words far apart in one paragraph', () =>
  write({}, BODY.replace('Adding thickness', `The "boundary" here is not a fence. ${'Filler that pushes the two quoted words well past two hundred characters apart. '.repeat(4)}The "public" is a patient on a trolley. Adding thickness`)),
  null);

test('accepts a quoted example phrase that wraps a source line', () =>
  write({}, BODY.replace('Adding thickness', 'Somebody may say "that one is not\nabout us" on site. Adding thickness')),
  null);

let passed = 0;
const failures = [];

process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));

for (const { name, setup, expect } of tests) {
  rmSync(TMP, { recursive: true, force: true });
  try {
    setup();
  } catch (e) {
    failures.push(`${name}\n    fixture setup threw: ${e.message}`);
    continue;
  }
  const { failed, output } = validate();

  if (expect === null) {
    if (failed) failures.push(`${name}\n    expected it to pass, but validation failed:\n    ${output.trim().split('\n').slice(-2).join('\n    ')}`);
    else passed++;
  } else if (!failed) {
    failures.push(`${name}\n    expected rejection, but validation passed. THIS GUARD HAS STOPPED WORKING.`);
  } else if (!output.includes(expect)) {
    failures.push(`${name}\n    rejected, but not for the expected reason (wanted "${expect}"):\n    ${output.trim().split('\n').slice(-2).join('\n    ')}`);
  } else {
    passed++;
  }
}

rmSync(TMP, { recursive: true, force: true });
if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });

console.log(`guardrails: ${passed}/${tests.length} passed`);
if (failures.length) {
  console.error('');
  for (const f of failures) console.error('  x ' + f + '\n');
  process.exit(1);
}
