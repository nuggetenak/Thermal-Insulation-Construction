#!/usr/bin/env node
/**
 * parse-taxonomy.mjs
 *
 * Reads docs/curriculum-source.md (the consolidated curriculum outline) and
 * emits content/_taxonomy.json: every chapter, section and leaf item with a
 * stable ID.
 *
 * Why this exists: every content file, cross-reference and route in this
 * project is keyed to these IDs. Generating them once, up front, from the
 * source document means an agent writing chapter 14 can reference an item in
 * chapter 02 that nobody has written yet. IDs must never be renumbered after
 * content exists — append instead.
 *
 * Zero dependencies by design. Runs on plain Node.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'docs/curriculum-source.md');
const OUT = resolve(ROOT, 'content/_taxonomy.json');

/**
 * Stage assignment. This is the rebalance: the source document is ordered as
 * an encyclopedia of the trade (universal craft first, Japan layer second).
 * That ordering puts communication and site conduct behind twenty-two chapters
 * of theory, which is wrong for someone starting work in months rather than
 * years.
 *
 * Stages reorder by WHEN IT IS NEEDED:
 *   1 = before you fly        2 = first year on the job
 *   3 = becoming skilled      4 = parked (years away; stubs only)
 */
const STAGE_BY_CHAPTER = {
  '00': 1, // Orientation & Learning System
  '01': 1, // Construction & Site Fundamentals   <- under-weighted in source
  '06': 1, // Materials (identification + handling)
  '07': 1, // Tools, Machines & Equipment
  '08': 1, // PPE, Safety & Health
  '09': 1, // Work-at-Height & Access
  '11': 1, // Core Skill: Straight Pipe
  '22': 1, // Material Logistics & Site Management
  '23': 1, // Japanese Trade Vocabulary
  '24': 1, // Japanese Communication & Reporting

  '02': 2, // Thermal Fundamentals
  '03': 2, // Physics, Units & Technical Math
  '04': 2, // Drawings, Specifications & Work Instructions
  '05': 2, // Measurement, Marking & Layout
  '10': 2, // Surface & Substrate Preparation
  '12': 2, // Valves, Flanges & Fittings
  '13': 2, // Equipment Insulation
  '14': 2, // Hot Insulation Systems
  '15': 2, // Cold Insulation Systems
  '16': 2, // Vapor Barrier & Moisture Sealing
  '17': 2, // Metal Jacketing & Outer Finish
  '25': 2, // Practical Training Ladder

  '18': 3, // Complex Geometry & Fabrication
  '19': 3, // Supports, Penetrations, Seismic
  '20': 3, // Inspection, Testing & Quality Control
  '21': 3, // Work Planning & Rework Prevention
  '26': 3, // Training Projects / Mock Workpieces
  '27': 3, // Fault Finding & Troubleshooting
  '29': 3, // Measurement, Estimation & Takeoff
  '30': 3, // Documentation & Work Records

  '28': 4, // Advanced Technical Knowledge
  '31': 4, // 技能検定 exam
  '32': 4, // Independent Worker Certification
  '33': 4, // Senior / Lead Worker Skills
  '34': 4, // Teaching Curriculum for the group
  '35': 4, // Mastery Capstone
  '36': 4, // Reference Library
};

/**
 * Chapters where a wrong or incomplete instruction can injure someone.
 * Every item in these chapters gets full human review before merge, and the
 * safety-writer agent handles them rather than the general craft writer.
 */
const SAFETY_CRITICAL_CHAPTERS = ['07', '08', '09', '12', '14', '15', '16', '20', '27'];

/** Content shape. Not everything is an article. */
function inferKind(chapterNo) {
  if (chapterNo === '23') return 'vocabulary';
  if (chapterNo === '25' || chapterNo === '26') return 'practical';
  if (chapterNo === '27') return 'diagnostic';
  return 'article';
}

function slugify(text) {
  const s = text
    .normalize('NFKD')
    .replace(/[\u3000-\u9fff\uff00-\uffef]/g, ' ') // strip CJK, keep position
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s.slice(0, 60);
}

/** Pull any Japanese term out of a heading, e.g. "Hot Insulation — 保温". */
function extractJapanese(text) {
  const m = text.match(/[\u3040-\u30ff\u4e00-\u9fff][\u3040-\u30ff\u4e00-\u9fff\u30fc々]*/g);
  return m ? m.join(' ') : null;
}

function parse() {
  const raw = readFileSync(SOURCE, 'utf8');
  const lines = raw.split(/\r?\n/);

  const chapters = [];
  let chapter = null;
  let section = null;
  let leafSeq = 0;

  for (const line of lines) {
    const h1 = /^# (\d{2})\.\s+(.+?)\s*$/.exec(line);
    if (h1) {
      const [, no, title] = h1;
      chapter = {
        no,
        title,
        japanese: extractJapanese(title),
        slug: slugify(title),
        stage: STAGE_BY_CHAPTER[no] ?? 3,
        safetyCritical: SAFETY_CRITICAL_CHAPTERS.includes(no),
        kind: inferKind(no),
        sections: [],
      };
      chapters.push(chapter);
      section = null;
      continue;
    }

    // Any other H1 (PART banners, appendices, front matter) closes the chapter.
    if (/^# /.test(line)) {
      chapter = null;
      section = null;
      continue;
    }

    const h2 = /^## (\d{2})\.(\d+)\s+(.+?)\s*$/.exec(line);
    if (h2 && chapter) {
      const [, chNo, secNo, title] = h2;
      if (chNo !== chapter.no) continue; // defensive: mismatched numbering
      section = {
        no: `${chNo}.${secNo}`,
        title,
        slug: slugify(title),
        items: [],
      };
      chapter.sections.push(section);
      leafSeq = 0;
      continue;
    }

    const h3 = /^### (.+?)\s*$/.exec(line);
    if (h3 && chapter && section) {
      leafSeq += 1;
      const title = h3[1];
      const id = `${section.no}.${String(leafSeq).padStart(2, '0')}`;
      const slug = slugify(title) || `item-${leafSeq}`;
      section.items.push({
        id,
        title,
        japanese: extractJapanese(title),
        slug,
        stage: chapter.stage,
        kind: chapter.kind,
        safetyCritical: chapter.safetyCritical,
        chapter: chapter.no,
        section: section.no,
        path: `content/ch${chapter.no}/${id}-${slug}.md`,
        status: 'stub',
      });
    }
  }

  return chapters;
}

const chapters = parse();

const allItems = chapters.flatMap((c) => c.sections.flatMap((s) => s.items));
const byStage = allItems.reduce((acc, i) => {
  acc[i.stage] = (acc[i.stage] || 0) + 1;
  return acc;
}, {});
const byKind = allItems.reduce((acc, i) => {
  acc[i.kind] = (acc[i.kind] || 0) + 1;
  return acc;
}, {});

const output = {
  generatedFrom: 'docs/curriculum-source.md',
  generatedAt: new Date().toISOString().slice(0, 10),
  counts: {
    chapters: chapters.length,
    sections: chapters.reduce((n, c) => n + c.sections.length, 0),
    items: allItems.length,
    byStage,
    byKind,
    safetyCritical: allItems.filter((i) => i.safetyCritical).length,
  },
  chapters,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

// Duplicate-ID guard. If this ever fires, cross-references are unsafe.
const seen = new Set();
const dupes = allItems.filter((i) => (seen.has(i.id) ? true : (seen.add(i.id), false)));

console.log('chapters :', output.counts.chapters);
console.log('sections :', output.counts.sections);
console.log('items    :', output.counts.items);
console.log('by stage :', JSON.stringify(byStage));
console.log('by kind  :', JSON.stringify(byKind));
console.log('safety   :', output.counts.safetyCritical);
console.log('dupe ids :', dupes.length);
if (dupes.length) {
  console.error('DUPLICATE IDS:', dupes.map((d) => d.id).join(', '));
  process.exit(1);
}
