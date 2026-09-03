#!/usr/bin/env node
/**
 * primary-sweep.mjs
 *
 * An authoring aid for building a source pack, not a validator. It attacks the
 * two ways a pack goes wrong, both of which happened while building section
 * 01.2 and neither of which any check could have caught.
 *
 * 1. SELECTION. The pack for 01.2 took 安衛則第619条 and then jumped to 第628条.
 *    第620条 — captioned 労働者の清潔保持義務, a duty on the worker to keep the
 *    work area clean and not to dump waste anywhere but the designated place —
 *    is the very next article, and it is the legal root of the entire
 *    housekeeping item. It was never looked at, because articles were chosen
 *    one at a time from expectation rather than read as a neighbourhood.
 *    So: this tool prints the neighbours of every article you cite, with their
 *    captions, and makes you dismiss them consciously.
 *
 * 2. COMPRESSION. A pack is a lossy summary of clause text, and the loss is
 *    biased: parentheticals, 除く exclusions, ただし provisos, 等, and the
 *    difference between 努める and しなければならない read as noise while you
 *    are looking for the operative rule. 廃掃法施行規則第18条の2 excludes
 *    特別管理廃棄物 in a parenthetical in its first 号 — read twice, missed
 *    twice. So: this tool counts the qualifier tokens in each cited article and
 *    tells you how many limits you are responsible for having carried across.
 *
 * Zero dependencies, like the rest of the scripts. Fetches from the e-Gov API
 * and caches, so a second run costs nothing.
 *
 *   node scripts/primary-sweep.mjs --law 347M50002000032 --cited 619,620,540
 *   node scripts/primary-sweep.mjs --law 346M50000100035 --cited 18_2 --window 3
 *
 * Law ids are the ones already in content/_sources.json URLs, e.g.
 *   347AC0000000057  労働安全衛生法
 *   347M50002000032  労働安全衛生規則
 *   345AC0000000137  廃棄物処理法
 *   346M50000100035  廃棄物処理法施行規則
 *   346CO0000000300  廃棄物処理法施行令
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = resolve(ROOT, '.cache/primary');

/** Qualifier tokens. Each one narrows or softens a rule, and each one is a
 *  thing a summary silently drops. */
const QUALIFIERS = [
  ['除く', 'an exclusion — something the rule does NOT cover'],
  ['ただし', 'a proviso — an exception to what was just said'],
  ['限る', 'a restriction — the rule applies only to the stated case'],
  ['努める', 'an endeavour duty, NOT a flat obligation'],
  ['等', 'an "and the like" — the rule is wider than the example it names'],
  ['みなす', 'a deeming provision — something is treated as something else'],
  ['みなして', 'a deeming provision — something is treated as something else'],
];

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || i + 1 >= args.length ? fallback : args[i + 1];
};

const lawId = flag('law');
const cited = (flag('cited') || '').split(',').map((s) => s.trim()).filter(Boolean);
const window = Number(flag('window', '4'));

if (!lawId || cited.length === 0) {
  console.error('usage: node scripts/primary-sweep.mjs --law <lawId> --cited <a,b,c> [--window N]');
  process.exit(2);
}

async function lawXml(id) {
  mkdirSync(CACHE, { recursive: true });
  const file = resolve(CACHE, `${id}.xml`);
  if (existsSync(file)) return readFileSync(file, 'utf8');
  const res = await fetch(`https://laws.e-gov.go.jp/api/1/lawdata/${id}`);
  if (!res.ok) {
    console.error(`e-Gov returned ${res.status} for ${id}`);
    process.exit(1);
  }
  const xml = await res.text();
  writeFileSync(file, xml, 'utf8');
  return xml;
}

/** Articles in document order. Regex rather than a parser, because the files
 *  run to megabytes and Article elements do not nest. */
function articles(xml) {
  const out = [];
  const seen = new Set();
  for (const chunk of xml.split('<Article ').slice(1)) {
    const num = /^[^>]*\bNum="([^"]+)"/.exec(chunk)?.[1];
    if (!num) continue;
    const body = chunk.slice(0, chunk.indexOf('</Article>'));
    // A law reuses article numbers in its 附則. Only the first occurrence is
    // the article proper; later ones are supplementary provisions.
    if (seen.has(num)) continue;
    seen.add(num);
    const caption = /<ArticleCaption>([\s\S]*?)<\/ArticleCaption>/.exec(body)?.[1] ?? '';
    out.push({
      num,
      caption: caption.replace(/<[^>]+>/g, '').trim(),
      text: body.replace(/<[^>]+>/g, ''),
    });
  }
  return out;
}

const xml = await lawXml(lawId);
const all = articles(xml);
const index = new Map(all.map((a, i) => [a.num, i]));
const citedSet = new Set(cited);

const missing = cited.filter((c) => !index.has(c));
if (missing.length) {
  console.log(`! not found in this law: ${missing.join(', ')}\n`);
}

console.log(`${lawId} — ${all.length} articles, ${cited.length} cited\n`);

// --- 1. what each cited article obliges you to carry across -----------------
console.log('CITED ARTICLES — qualifiers you are responsible for carrying into the pack');
console.log('-'.repeat(78));
for (const num of cited) {
  const i = index.get(num);
  if (i === undefined) continue;
  const a = all[i];
  const found = QUALIFIERS.filter(([tok]) => a.text.includes(tok));
  console.log(`\n第${num}条 ${a.caption}`);
  if (!found.length) {
    console.log('    no qualifier tokens');
    continue;
  }
  for (const [tok, why] of found) {
    const n = a.text.split(tok).length - 1;
    console.log(`    ${tok} x${n}  — ${why}`);
  }
}

// --- 2. the neighbours you have not looked at -------------------------------
const neighbours = new Map();
for (const num of cited) {
  const i = index.get(num);
  if (i === undefined) continue;
  for (let j = Math.max(0, i - window); j <= Math.min(all.length - 1, i + window); j++) {
    const a = all[j];
    if (citedSet.has(a.num)) continue;
    if (!neighbours.has(a.num)) neighbours.set(a.num, { a, near: [] });
    neighbours.get(a.num).near.push(num);
  }
}

console.log(`\n\nUNCITED NEIGHBOURS within ${window} articles of something you cited`);
console.log('-'.repeat(78));
console.log('Read every caption. Dismiss each one deliberately. This is the list');
console.log('第620条 would have been on.\n');
for (const [num, { a, near }] of [...neighbours].sort((x, y) => index.get(x[0]) - index.get(y[0]))) {
  const cap = a.caption || '(no caption — often a deleted article)';
  console.log(`  第${num}条 ${cap}`.padEnd(58) + `near 第${near.join(', 第')}条`);
}
console.log(`\n${neighbours.size} uncited neighbour(s) to review.`);
