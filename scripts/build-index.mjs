#!/usr/bin/env node
/**
 * build-index.mjs
 *
 * Compiles the taxonomy plus whatever content has actually been authored into
 * src/generated/index.json, which the app imports directly.
 *
 * The app never reads the content directory at runtime. One generated file
 * means one network request, offline caching is trivial, and search can be
 * built over a single in-memory structure.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = resolve(ROOT, 'content');
const OUT_DIR = resolve(ROOT, 'src/generated');
const OUT = resolve(OUT_DIR, 'index.json');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { fm: '', body: raw };
  const end = raw.indexOf('\n---', 4);
  if (end === -1) return { fm: '', body: raw };
  return { fm: raw.slice(4, end), body: raw.slice(end + 4).trim() };
}

/** Pull just the fields the app needs. Full validation lives in validate-content.mjs. */
function readField(fm, key) {
  const m = new RegExp(`^${key}:\\s*(.*)$`, 'm').exec(fm);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

function readList(fm, key) {
  const inline = new RegExp(`^${key}:\\s*\\[(.*)\\]`, 'm').exec(fm);
  if (inline) {
    return inline[1]
      .split(',')
      .map((x) => x.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  const block = new RegExp(`^${key}:\\s*$([\\s\\S]*?)(?=^\\w+:|$(?![\\s\\S]))`, 'm').exec(fm);
  if (!block) return [];
  return [...block[1].matchAll(/^\s+- (.+)$/gm)].map((m) =>
    m[1].trim().replace(/^["']|["']$/g, ''),
  );
}

function readTerms(fm) {
  const terms = [];
  const block = /^terms:\s*$([\s\S]*?)(?=^\w+:|\Z)/m.exec(fm);
  if (!block) return terms;
  for (const chunk of block[1].split(/^\s+- /m).slice(1)) {
    const get = (k) => {
      const m = new RegExp(`${k}:\\s*(.*)`).exec(chunk);
      return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
    };
    const term = get('term');
    if (term) terms.push({ term, reading: get('reading'), meaning: get('meaning') });
  }
  return terms;
}

const taxonomy = JSON.parse(readFileSync(resolve(CONTENT, '_taxonomy.json'), 'utf8'));
const registry = JSON.parse(readFileSync(resolve(CONTENT, '_sources.json'), 'utf8')).sources;

const authored = new Map();
const glossary = [];

for (const full of walk(CONTENT)) {
  if (basename(full) === '_taxonomy.json') continue;
  const raw = readFileSync(full, 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const id = readField(fm, 'id');
  if (!id) continue;

  const terms = readTerms(fm);
  authored.set(id, {
    id,
    status: readField(fm, 'status') || 'draft',
    summary: readField(fm, 'summary') || '',
    confidence: readField(fm, 'confidence'),
    sourceBasis: readField(fm, 'sourceBasis') || 'general',
    sources: readList(fm, 'sources'),
    seeAlso: readList(fm, 'seeAlso'),
    terms,
    body,
  });
  for (const t of terms) glossary.push({ ...t, sourceId: id });
}

// Merge: every taxonomy item appears, authored or not. An unwritten item is
// still browsable and still a valid cross-reference target.
const chapters = taxonomy.chapters.map((c) => ({
  ...c,
  sections: c.sections.map((s) => ({
    ...s,
    items: s.items.map((i) => {
      const a = authored.get(i.id);
      return a ? { ...i, ...a } : { ...i, status: 'stub', body: '', sources: [], terms: [] };
    }),
  })),
}));

const written = [...authored.values()].filter((a) => a.status !== 'stub').length;
const total = taxonomy.counts.items;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      counts: { ...taxonomy.counts, written },
      glossary: glossary.sort((a, b) => a.term.localeCompare(b.term, 'ja')),
      sources: registry,
      chapters,
    },
    null,
    0,
  ) + '\n',
  'utf8',
);

console.log(
  `index built: ${written}/${total} items written, ${glossary.length} glossary terms, ${registry.length} sources`,
);
