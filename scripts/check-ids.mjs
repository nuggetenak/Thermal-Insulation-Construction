#!/usr/bin/env node
/**
 * check-ids.mjs
 *
 * Ids in this project are permanent. Content files are named after them,
 * cross-references resolve through them, and an item written in month one is
 * linked to from an item written in month five.
 *
 * Nothing else in the pipeline notices if an id changes. A careless edit to
 * parse-taxonomy.mjs, or a heading reworded in the source outline, could
 * silently renumber hundreds of items — and everything would still validate,
 * because the taxonomy and the content would agree with each other while both
 * disagreed with every link written before the change.
 *
 * This locks the id set. Adding ids is fine. Removing or changing one fails.
 *
 * To intentionally retire an id: delete it here, in its own commit, with a
 * message explaining why. Never regenerate the lock to make an error go away.
 *
 *   node scripts/check-ids.mjs           # verify
 *   node scripts/check-ids.mjs --write   # regenerate (deliberate act only)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TAXONOMY = resolve(ROOT, 'content/_taxonomy.json');
const LOCK = resolve(ROOT, 'content/_ids.lock');

const taxonomy = JSON.parse(readFileSync(TAXONOMY, 'utf8'));
const current = taxonomy.chapters
  .flatMap((c) => c.sections.flatMap((s) => s.items))
  .map((i) => `${i.id}\t${i.title}`)
  .sort();

if (process.argv.includes('--write')) {
  writeFileSync(LOCK, current.join('\n') + '\n', 'utf8');
  console.log(`lock written: ${current.length} ids`);
  process.exit(0);
}

if (!existsSync(LOCK)) {
  console.error('content/_ids.lock is missing. Create it with: node scripts/check-ids.mjs --write');
  process.exit(1);
}

const locked = readFileSync(LOCK, 'utf8').trim().split('\n');
const lockedIds = new Map(locked.map((l) => l.split('\t')));
const currentIds = new Map(current.map((l) => l.split('\t')));

const removed = [...lockedIds.keys()].filter((id) => !currentIds.has(id));
const retitled = [...lockedIds.entries()].filter(
  ([id, title]) => currentIds.has(id) && currentIds.get(id) !== title,
);
const added = [...currentIds.keys()].filter((id) => !lockedIds.has(id));

if (removed.length) {
  console.error(`\n${removed.length} id(s) disappeared. Ids are permanent.\n`);
  for (const id of removed.slice(0, 20)) console.error(`  x ${id}  (was: ${lockedIds.get(id)})`);
  if (removed.length > 20) console.error(`  ... and ${removed.length - 20} more`);
}

if (retitled.length) {
  console.error(`\n${retitled.length} id(s) changed title. An id must keep meaning what it meant.\n`);
  for (const [id, was] of retitled.slice(0, 20)) {
    console.error(`  x ${id}\n      was: ${was}\n      now: ${currentIds.get(id)}`);
  }
}

if (removed.length || retitled.length) {
  console.error(
    '\nIf this is intentional, edit content/_ids.lock in its own commit and say why.\n' +
      'Do not regenerate the lock to silence this.\n',
  );
  process.exit(1);
}

console.log(
  `ids stable: ${lockedIds.size} locked, ${added.length} added${added.length ? ` (${added.slice(0, 5).join(', ')}${added.length > 5 ? ', ...' : ''})` : ''}`,
);
