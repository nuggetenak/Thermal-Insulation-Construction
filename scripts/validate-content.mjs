#!/usr/bin/env node
/**
 * validate-content.mjs
 *
 * Every authored content file is checked against the schema before it can be
 * merged. This is the consistency mechanism for the whole project: with many
 * sessions writing 800+ items over months, "remember to keep it consistent"
 * does not survive contact with reality. A machine check does.
 *
 * Run: node scripts/validate-content.mjs
 * Exit 1 on any error. Warnings do not fail the build.
 *
 * Zero dependencies, including the YAML parse — the frontmatter subset used
 * here is deliberately small enough to parse safely without a library.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = resolve(ROOT, 'content');
const TAXONOMY = resolve(CONTENT, '_taxonomy.json');
const SOURCES = resolve(CONTENT, '_sources.json');
const IMAGES = resolve(CONTENT, '_images.json');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS = ['id', 'title', 'chapter', 'section', 'stage', 'kind', 'status', 'summary'];

const VALID_STATUS = ['stub', 'draft', 'review', 'approved'];
const VALID_KIND = ['article', 'vocabulary', 'practical', 'diagnostic'];
const VALID_CONFIDENCE = ['verified', 'standard-practice', 'needs-confirmation'];
const VALID_SOURCE_BASIS = ['general', 'cited'];

/**
 * Required body headings per content kind. These are what make 800 items feel
 * like one book rather than 800 essays. "Common mistakes" is mandatory
 * everywhere because knowing the failure mode is most of the craft.
 */
const REQUIRED_HEADINGS = {
  article: ['What it is', 'Why it matters on the job', 'In detail', 'Common mistakes'],
  vocabulary: ['Terms', 'How it sounds on site', 'Common mistakes'],
  practical: ['Goal', 'What you need', 'Steps', 'How to know it is right', 'Common mistakes'],
  diagnostic: ['Symptom', 'Likely causes', 'How to check', 'What to do', 'Common mistakes'],
};

const SUMMARY_MAX_WORDS = 30;

// ---------------------------------------------------------------------------
// Minimal frontmatter parser
// ---------------------------------------------------------------------------

function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---\n')) {
    err(file, 'missing YAML frontmatter block');
    return { data: null, body: raw };
  }
  const end = raw.indexOf('\n---', 4);
  if (end === -1) {
    err(file, 'frontmatter block is not closed');
    return { data: null, body: raw };
  }
  const block = raw.slice(4, end);
  const body = raw.slice(end + 4);

  const data = {};
  let currentKey = null;
  let listBuffer = null;
  let objBuffer = null;

  for (const line of block.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const listItem = /^\s{2,}- (.*)$/.exec(line);
    if (listItem && currentKey) {
      const val = listItem[1].trim();
      const inlineKv = /^(\w+):\s*(.*)$/.exec(val);
      if (inlineKv) {
        objBuffer = { [inlineKv[1]]: unquote(inlineKv[2]) };
        listBuffer.push(objBuffer);
      } else {
        listBuffer.push(unquote(val));
        objBuffer = null;
      }
      continue;
    }

    const nestedKv = /^\s{4,}(\w+):\s*(.*)$/.exec(line);
    if (nestedKv && objBuffer) {
      objBuffer[nestedKv[1]] = unquote(nestedKv[2]);
      continue;
    }

    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (kv) {
      const [, key, rawVal] = kv;
      currentKey = key;
      objBuffer = null;
      if (rawVal.trim() === '') {
        listBuffer = [];
        data[key] = listBuffer;
      } else if (rawVal.trim().startsWith('[')) {
        data[key] = rawVal
          .trim()
          .slice(1, -1)
          .split(',')
          .map((s) => unquote(s.trim()))
          .filter(Boolean);
        listBuffer = null;
      } else {
        const trimmed = rawVal.trim();
        // A quoted value is always a string. This matters for ids like "02",
        // which must not become the number 2.
        const wasQuoted = /^["'].*["']$/.test(trimmed);
        data[key] = wasQuoted ? unquote(trimmed) : coerce(trimmed);
        listBuffer = null;
      }
    }
  }
  return { data, body };
}

const unquote = (s) => s.replace(/^["']|["']$/g, '');
const coerce = (s) => {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^\d+$/.test(s)) return Number(s);
  return s;
};

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function main() {
  if (!existsSync(TAXONOMY)) {
    console.error('content/_taxonomy.json not found. Run: node scripts/parse-taxonomy.mjs');
    process.exit(1);
  }

  const taxonomy = JSON.parse(readFileSync(TAXONOMY, 'utf8'));
  const items = taxonomy.chapters.flatMap((c) => c.sections.flatMap((s) => s.items));
  const byId = new Map(items.map((i) => [i.id, i]));

  const registry = JSON.parse(readFileSync(SOURCES, 'utf8')).sources;
  const sourceById = new Map(registry.map((s) => [s.id, s]));

  // Official exam documents are reissued annually. Nobody will remember to
  // re-check them, so the build does it.
  const today = new Date().toISOString().slice(0, 10);
  for (const src of registry) {
    if (src.recheckAfter && src.recheckAfter < today) {
      warn('content/_sources.json', `source "${src.id}" is past its recheck date (${src.recheckAfter}) — re-verify before relying on it`);
    }
  }

  const imageData = JSON.parse(readFileSync(IMAGES, 'utf8'));
  const imageById = new Map((imageData.images || []).map((i) => [i.id, i]));

  // A licence with an attribution requirement is a legal obligation, not a
  // nicety. Catch a missing credit here rather than after publication.
  for (const img of imageData.images || []) {
    const lic = imageData.licences[img.licence];
    if (!lic) {
      err('content/_images.json', `image "${img.id}" has unknown licence "${img.licence}"`);
      continue;
    }
    if (lic.attribution && !img.author) {
      err('content/_images.json', `image "${img.id}" is ${img.licence} which requires attribution, but has no author`);
    }
    if (img.origin !== 'own-work' && img.origin !== 'svg' && !img.sourceUrl) {
      err('content/_images.json', `image "${img.id}" has no sourceUrl`);
    }
    if (img.origin === 'generated' && img.usage !== 'illustration') {
      err('content/_images.json', `image "${img.id}" is generated but used as "${img.usage}" — generated images may only be illustration. See docs/image-needs.md`);
    }
  }

  const files = walk(CONTENT).filter(
    (f) => !['_taxonomy.json', '_sources.json', '_images.json'].includes(basename(f)),
  );
  const seenIds = new Set();

  for (const full of files) {
    const file = full.replace(ROOT + '/', '');
    const raw = readFileSync(full, 'utf8');
    const { data, body } = parseFrontmatter(raw, file);
    if (!data) continue;

    for (const f of REQUIRED_FIELDS) {
      if (data[f] === undefined || data[f] === '') err(file, `missing required field "${f}"`);
    }
    if (!data.id) continue;

    // --- identity -----------------------------------------------------------
    const known = byId.get(data.id);
    if (!known) {
      err(file, `id "${data.id}" is not in the taxonomy. IDs are never invented by hand.`);
      continue;
    }
    if (seenIds.has(data.id)) err(file, `duplicate id "${data.id}" — already used by another file`);
    seenIds.add(data.id);

    if (!basename(full).startsWith(data.id)) {
      err(file, `filename must begin with its id "${data.id}"`);
    }
    for (const key of ['chapter', 'section', 'stage', 'kind']) {
      if (String(data[key]) !== String(known[key])) {
        err(file, `"${key}" is "${data[key]}" but the taxonomy says "${known[key]}"`);
      }
    }

    // --- enums --------------------------------------------------------------
    if (!VALID_STATUS.includes(data.status)) {
      err(file, `status "${data.status}" must be one of: ${VALID_STATUS.join(', ')}`);
    }
    if (!VALID_KIND.includes(data.kind)) {
      err(file, `kind "${data.kind}" must be one of: ${VALID_KIND.join(', ')}`);
    }
    if (data.confidence && !VALID_CONFIDENCE.includes(data.confidence)) {
      err(file, `confidence "${data.confidence}" must be one of: ${VALID_CONFIDENCE.join(', ')}`);
    }

    // --- summary ------------------------------------------------------------
    if (typeof data.summary === 'string') {
      const words = data.summary.trim().split(/\s+/).length;
      if (words > SUMMARY_MAX_WORDS) {
        err(file, `summary is ${words} words, limit is ${SUMMARY_MAX_WORDS}`);
      }
    }

    if (data.status === 'stub') continue; // stubs are placeholders; stop here

    // --- cross-references ---------------------------------------------------
    for (const ref of data.seeAlso || []) {
      if (!byId.has(ref)) err(file, `seeAlso references unknown id "${ref}"`);
      if (ref === data.id) err(file, 'seeAlso references itself');
    }

    // --- Japanese terms -----------------------------------------------------
    // Stored as discrete fields so a flashcard deck can be generated later
    // from content that already exists, rather than rewritten from scratch.
    for (const [n, t] of (data.terms || []).entries()) {
      if (typeof t !== 'object') {
        err(file, `terms[${n}] must have term / reading / meaning fields`);
        continue;
      }
      for (const f of ['term', 'reading', 'meaning']) {
        if (!t[f]) err(file, `terms[${n}] is missing "${f}"`);
      }
      if (t.reading && !/^[\u3040-\u309f\u30a0-\u30ff\u30fcー]+$/.test(t.reading)) {
        err(file, `terms[${n}] reading "${t.reading}" must be kana only`);
      }
    }

    // --- sourcing -----------------------------------------------------------
    // The audit trail: a reviewer must see at a glance which claims are
    // grounded and which are worth checking with a supervisor.
    if (!data.sourceBasis) {
      err(file, 'missing "sourceBasis" — must be "general" or "cited"');
    } else if (!VALID_SOURCE_BASIS.includes(data.sourceBasis)) {
      err(file, `sourceBasis "${data.sourceBasis}" must be one of: ${VALID_SOURCE_BASIS.join(', ')}`);
    }

    const cited = data.sources || [];
    for (const sid of cited) {
      const src = sourceById.get(sid);
      if (!src) {
        err(file, `sources references unknown id "${sid}" — add it to content/_sources.json first`);
        continue;
      }
      if (src.quotable === false && /^>\s/m.test(body)) {
        warn(file, `cites "${sid}" which is not quotable — check no text was reproduced`);
      }
    }
    if (data.sourceBasis === 'cited' && cited.length === 0) {
      err(file, 'sourceBasis is "cited" but no sources are listed');
    }

    // Nobody in this group has trade experience, so a confident wrong
    // procedure cannot be caught by the reader. Sourcing is mandatory here.
    if (known.safetyCritical) {
      if (!data.confidence) {
        err(file, 'safety-critical item must declare a "confidence" field');
      }
      if (cited.length === 0) {
        err(file, 'safety-critical item must cite at least one source from the registry');
      }
      const hasAuthority = cited.some((sid) => (sourceById.get(sid)?.tier ?? 9) <= 2);
      if (cited.length > 0 && !hasAuthority) {
        err(file, 'safety-critical item must cite at least one tier 1 or tier 2 source');
      }
    }

    // --- body structure -----------------------------------------------------
    const required = REQUIRED_HEADINGS[data.kind] || [];
    const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1].trim());
    for (const h of required) {
      if (!headings.includes(h)) err(file, `body is missing required section "## ${h}"`);
    }

    const wordCount = body.split(/\s+/).filter(Boolean).length;
    if (data.status !== 'stub' && wordCount < 120) {
      warn(file, `body is only ${wordCount} words — thin for full-depth content`);
    }

    // --- images -------------------------------------------------------------
    for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
      const [, alt, ref] = m;
      if (!alt.trim()) err(file, `image "${ref}" has no alt text`);
      if (!imageById.has(ref)) {
        err(file, `image "${ref}" is not in content/_images.json — register it first`);
        continue;
      }
      const img = imageById.get(ref);
      if (img.origin === 'generated' && known.safetyCritical) {
        err(file, `image "${ref}" is AI-generated and cannot appear in a safety-critical chapter`);
      }
    }

    // --- copyright guard ----------------------------------------------------
    // ASTM / ISO / JIS / API texts are paid documents. Their scope may be
    // described; their clauses may never be reproduced.
    const longQuote = /^>\s*.{200,}$/m.test(body) || /"[^"]{200,}"/.test(body);
    if (longQuote) {
      err(file, 'long quoted passage detected — paraphrase instead, never reproduce standard text');
    }
  }

  // --- report ---------------------------------------------------------------
  const authored = files.length;
  console.log(`checked ${authored} content file(s) against ${byId.size} taxonomy ids`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log('  ! ' + w);
  }
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error('  x ' + e);
    process.exit(1);
  }
  console.log('\nall content valid');
}

main();
