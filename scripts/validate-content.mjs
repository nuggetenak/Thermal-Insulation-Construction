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
const APPROVED = resolve(CONTENT, '_approved.json');
const TERMS_LOCK = resolve(CONTENT, '_terms.lock.json');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS = ['id', 'title', 'chapter', 'section', 'stage', 'kind', 'status', 'summary'];

const VALID_STATUS = ['stub', 'draft', 'review'];
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

/**
 * Paired quotation spans, paragraph by paragraph.
 *
 * Two separate short quotes in one paragraph are not one long quotation, and a
 * quotation that wraps across a source line is still one quotation. Treating
 * any stretch between two quote characters as a quote got both of those wrong:
 * the copyright guard fired on a paragraph carrying two scare-quoted words 200
 * characters apart, and the voice check missed an "us" inside a quotation that
 * happened to wrap a line. Pair the quote characters in order within each
 * paragraph instead, which is what a quotation actually is.
 */
function quotedSpans(body) {
  const spans = [];
  for (const para of body.split(/\n\s*\n/)) {
    const marks = [...para.matchAll(/["\u201c\u201d]/g)].map((m) => m.index);
    for (let i = 0; i + 1 < marks.length; i += 2) {
      spans.push(para.slice(marks[i] + 1, marks[i + 1]));
    }
  }
  return spans;
}
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
  const staleSources = registry.filter((s) => s.recheckAfter && s.recheckAfter < today);

  const approved = new Set(JSON.parse(readFileSync(APPROVED, 'utf8')).approved || []);
  const canonical = JSON.parse(readFileSync(TERMS_LOCK, 'utf8')).canonical || [];
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

  // Every Japanese term declared anywhere, and every name the registry answers
  // to. A term is introduced once and used freely elsewhere, so the check below
  // needs the whole corpus before it can judge any single item.
  const declaredAnywhere = new Set();
  for (const full of files) {
    const { data } = parseFrontmatter(readFileSync(full, 'utf8'), full);
    for (const t of data?.terms || []) if (typeof t === 'object' && t.term) declaredAnywhere.add(t.term);
  }
  const registryNames = new Set(registry.flatMap((src) => src.namedAs || []));

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
      if (data.status === 'approved') {
        // Approval is the owner's act, recorded outside the content file, so an
        // agent cannot mark its own work approved.
        err(file, 'status "approved" is not settable here — approval is recorded in content/_approved.json by the owner. Use "review".');
      } else {
        err(file, `status "${data.status}" must be one of: ${VALID_STATUS.join(', ')}`);
      }
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

    // --- body links ---------------------------------------------------------
    // The renderer turns any body link whose href carries an id-shaped token
    // into a live #/item/<id> link. Nothing checked those ids, so a link to an
    // id that never existed rendered as a working link to nothing, and passed
    // validation clean. seeAlso was the only cross-reference being validated.
    //
    // Linking forward to an item nobody has written yet is deliberate and
    // correct — the app renders an unwritten item as an honest "not written"
    // placeholder, and a reference is meant to point at its own shape before it
    // is filled in. So the rule is only that the id must exist in the taxonomy.
    // The id must stand alone. The renderer's pattern has no digit boundaries, so
    // a typo with one digit too many — 01.1.011 — still contains a valid id and
    // routes the reader to 01.1.01, quietly delivering a different item from the
    // one the link names. Requiring the boundaries here turns that silent
    // substitution into a build failure.
    const ID_IN_HREF = /(?<!\d)\d{2}\.\d+\.\d{2}(?!\d)/;
    const ID_LOOSE = /\d{2}\.\d+\.\d{2}/;
    for (const m of body.matchAll(/(?<!!)\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
      const href = m[2];
      const found = ID_IN_HREF.exec(href);
      if (found) {
        if (!byId.has(found[0])) {
          err(
            file,
            `body links to "${found[0]}" (${href}) which is not in the taxonomy — that renders as a live link to nothing. Linking to an unwritten item is fine; inventing an id is not.`,
          );
        } else if (/(^|\/)ch\d\d\//.test(href)) {
          // The id routes correctly, so a wrong filename wrapped around it still
          // renders as a working link and passes every check that reads the id
          // alone. 01.2.04 shipped a link to "01.2.05-daily-housekeeping.md" for
          // an item actually named 01.2.05-housekeeping-expectations.md, and two
          // more like it survived a hand review of the same section. The
          // taxonomy holds the real path, so compare against it.
          const want = byId.get(found[0]).path;
          const got = 'content/' + href.replace(/^\.\.\//, '');
          if (got !== want) {
            err(
              file,
              `body link "${href}" names a file that does not exist — ${found[0]} is at "${want}". The id still routes, so this renders as a working link and nothing else catches it.`,
            );
          }
        }
      } else if (ID_LOOSE.test(href)) {
        // Digits either side of something id-shaped. The app would read an id
        // out of it and go there, which is worse than failing to link at all.
        err(
          file,
          `body link "${href}" carries a malformed id — the app would read "${ID_LOOSE.exec(href)[0]}" out of it and send the reader there instead`,
        );
      } else if (/(^|\/)ch\d\d\//.test(href)) {
        // An item path carrying no readable id. The renderer cannot linkify it,
        // so it renders as literal markdown in the middle of a sentence.
        err(file, `body link "${href}" points into a chapter directory but carries no id the app can read`);
      }
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
    if (wordCount < 120) {
      warn(file, `body is only ${wordCount} words — thin for full-depth content`);
    }

    // Chapter 24 teaches Japanese phrases, and glossing 分かりません as
    // "I don't understand" is not narration. Strip code spans and quoted
    // example phrases before checking voice and terminology.
    let prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
    // Strip quoted example phrases before the voice and terminology checks.
    // The old pattern refused to match across a newline, so a quotation that
    // wrapped a source line stayed in the prose and tripped the voice check on
    // its contents — 01.2.01 was rejected for an "us" inside quoted speech.
    for (const span of quotedSpans(prose)) {
      if (span.length <= 200) prose = prose.split(`"${span}"`).join(' ');
    }

    // --- named but not cited ---------------------------------------------
    // An item that discusses a document by name is making claims about that
    // document, and those claims belong in the audit trail like any other.
    // 02.3.01 named JIS A 9501 three times — that it governs Japanese practice,
    // that it is paid, that it overrides this reference — without citing it,
    // and nothing caught that, because the sourcing checks only ask whether the
    // ids that ARE listed resolve. A registry entry declares the names it
    // answers to in "namedAs"; using one of them means citing it.
    for (const src of registry) {
      for (const name of src.namedAs || []) {
        if (cited.includes(src.id)) break;
        if (!prose.includes(name)) continue;
        err(
          file,
          `names "${name}" in the body but does not cite "${src.id}". A claim about a document is a claim like any other — add it to sources.`,
        );
        break;
      }
    }

    // --- a document referred to in English, still uncited --------------------
    // "namedAs" only matches the document's own name, so an item could lean on
    // a source all the way through while referring to it as "the specification"
    // with a clause number and never cite it. 01.2.03 did exactly that with
    // clause 1.3.6. A registry entry can declare the shape its clause numbers
    // take, which catches the reference however the prose words it.
    for (const src of registry) {
      if (!src.clausePattern || cited.includes(src.id)) continue;
      if (new RegExp(src.clausePattern, 'i').test(prose)) {
        err(
          file,
          `refers to a clause of "${src.id}" (matching ${src.clausePattern}) but does not cite it. Naming a document in English rather than Japanese does not make it a smaller claim.`,
        );
      }
    }

    // --- the briefing is not part of the item --------------------------------
    // A writing agent works from a brief the reader has never seen. Two items in
    // section 01.2 shipped sentences pointing at it — "see section D below",
    // "not settled by anything in this pack" — which read to a trainee as a
    // reference to a document that does not exist. Nothing caught either.
    const LEAKS = [
      /\bthis pack\b/i,
      /\bthe (?:source )?pack\b/i,
      /\bsections?\s+[A-H]\s+(?:of the pack|below|above)\b/i,
      /\b(?:your|the) brief\b/i,
      /\bas instructed\b/i,
      /\bthe instructions? (?:above|below)\b/i,
      /\bper the (?:brief|pack)\b/i,
    ];
    for (const re of LEAKS) {
      const hit = re.exec(prose);
      if (hit) {
        err(
          file,
          `body refers to the writer's briefing ("${hit[0].trim()}") — the reader has no access to it. Name the document and the clause instead.`,
        );
        break;
      }
    }

    // --- Japanese in the prose that nobody defines -------------------------
    // The style guide makes an undeclared Japanese term grounds for rejection,
    // and nothing enforced it. 01.2.04 shipped 危険物 in the prose while no item
    // in the project declared it, so the generated glossary had no entry and a
    // reader with no Japanese met an undefined word. Bare abbreviations are the
    // same failure: 01.2.01 used 安衛則, which is not the name of anything the
    // registry or the glossary knows.
    //
    // A term is introduced once and used freely afterwards, so anything declared
    // anywhere passes. So does a document name the registry answers to, and a
    // longer word built around a declared one — 元請業者 around 元請 — which is
    // morphology rather than a new term.
    const jpProse = prose
      .replace(/\]\([^)]*\)/g, ' ')
      .replace(/第[0-9０-９一二三四五六七八九十百千]+条(の[0-9０-９]+)?/g, ' ')
      .replace(/第[0-9０-９一二三四五六七八九十]+[項号編章節]/g, ' ');
    for (const run of new Set(jpProse.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]{2,}/g) || [])) {
      if (declaredAnywhere.has(run) || registryNames.has(run)) continue;
      if ([...declaredAnywhere].some((t) => t.length >= 2 && run.includes(t))) continue;
      if ([...registryNames].some((n) => n.includes(run) || run.includes(n))) continue;
      err(
        file,
        `uses the Japanese term "${run}" in the prose but no item declares it. Declare it in "terms" here if this item owns it, or use a term another item already introduces. Never use a bare abbreviation the glossary does not carry.`,
      );
    }

    // Voice. The reference has no narrator. Across 1146 items written in
    // separate sessions, "I" refers to nobody the reader can identify.
    const firstPerson = prose.match(/(?:^|[\s("'])(I|I'm|I've|I'd|my|me|we|our|us)(?=[\s.,;:!?)"'])/g);
    if (firstPerson) {
      const sample = [...new Set(firstPerson.map((m) => m.trim()))].slice(0, 4).join(', ');
      err(file, `first-person voice found (${sample}) — this reference has no narrator. Write "no source consulted states this", not "I could not find".`);
    }

    // Length is earned, not capped. A long item must carry the evidence that
    // justifies it; a long item resting on one source is usually padding.
    if (wordCount > 1200 && cited.length < 2) {
      warn(file, `${wordCount} words on ${cited.length} source(s) — length must be earned by evidence, not by elaboration`);
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

    // --- terminology --------------------------------------------------------
    // The same thing must be called the same name in chapter 09 and chapter 41,
    // written months apart by different sessions. Nothing else enforces that.
    const allowed = new Set((data.allowVariants || []).map((v) => v.toLowerCase()));
    for (const entry of canonical) {
      for (const variant of entry.avoid) {
        if (allowed.has(variant.toLowerCase())) continue;
        const re = new RegExp(`(?<![\\w-])${variant.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'gi');
        const hits = prose.match(re);
        if (hits) {
          err(
            file,
            `uses "${hits[0]}" — the canonical term is "${entry.en}". If the variant is deliberate, add allowVariants: ["${variant}"] to frontmatter.`,
          );
        }
      }
    }

    // --- copyright guard ----------------------------------------------------
    // ASTM / ISO / JIS / API texts are paid documents. Their scope may be
    // described; their clauses may never be reproduced.
    // A reproduced clause is one long quotation. Two separately quoted words in
    // the same paragraph are not, however far apart they sit — the old pattern
    // read everything between them as a single quote and failed 01.2.01 for a
    // paragraph that quoted nothing at all.
    const longestQuote = Math.max(0, ...quotedSpans(body).map((q) => q.length));
    if (/^>\s*.{200,}$/m.test(body) || longestQuote >= 200) {
      err(file, 'long quoted passage detected — paraphrase instead, never reproduce standard text');
    }
  }

  // A stale source is only actionable if you know what depends on it.
  for (const src of staleSources) {
    const dependents = [];
    for (const full of files) {
      const { data } = parseFrontmatter(readFileSync(full, 'utf8'), full);
      if ((data?.sources || []).includes(src.id)) dependents.push(data.id);
    }
    warn(
      'content/_sources.json',
      `source "${src.id}" is past its recheck date (${src.recheckAfter}). ` +
        (dependents.length
          ? `Re-verify, then review: ${dependents.join(', ')}`
          : 'Nothing cites it yet.'),
    );
  }

  // Orphans: an item nobody links to is reachable only by browsing its chapter.
  const linked = new Set();
  for (const full of files) {
    const { data } = parseFrontmatter(readFileSync(full, 'utf8'), full);
    for (const ref of data?.seeAlso || []) linked.add(ref);
  }
  const orphans = [...seenIds].filter((id) => !linked.has(id));
  if (orphans.length > 8) {
    warn('content', `${orphans.length} written items are not linked from any other item — cross-references are how a reference gets used`);
  }

  // Term ownership: a term is introduced once, in the item that owns it, and
  // referenced elsewhere. Otherwise the generated glossary fills with
  // near-duplicate entries that disagree with each other.
  const termOwners = new Map();
  for (const full of files) {
    const { data } = parseFrontmatter(readFileSync(full, 'utf8'), full);
    for (const t of data?.terms || []) {
      if (typeof t !== 'object' || !t.term) continue;
      termOwners.set(t.term, [...(termOwners.get(t.term) || []), data.id]);
    }
  }
  for (const [term, owners] of termOwners) {
    if (owners.length > 1) {
      warn(
        'content',
        `term "${term}" is introduced in ${owners.length} items (${owners.join(', ')}) — introduce it once and cross-reference`,
      );
    }
  }

  // --- report ---------------------------------------------------------------
  const authored = files.length;
  const approvedPresent = [...seenIds].filter((id) => approved.has(id)).length;
  console.log(
    `checked ${authored} content file(s) against ${byId.size} taxonomy ids (${approvedPresent} approved)`,
  );

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
