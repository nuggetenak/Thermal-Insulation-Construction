import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import data from './generated/catalog.json';
import images from '../content/_images.json';
import { search } from './search';
import { getRead, markRead, unmarkRead, getPrefs, setPrefs } from './reader';
import type { Prefs } from './reader';
import type { Chapter, Item, Source } from './types';

const chapters = data.chapters as unknown as Chapter[];
const sources = data.sources as unknown as Source[];
const sourceById = new Map(sources.map((s) => [s.id, s]));
const imageById = new Map(
  (images.images as { id: string }[]).map((i) => [i.id, i as Record<string, string>]),
);
const licences = images.licences as Record<string, { attribution: boolean }>;

// One entry per chapter chunk (src/generated/chapters/chNN.json), each a lazy
// loader for that chapter's { id -> body } map. Catalog items carry no body;
// ItemView fetches its chapter's chunk on demand so opening one item never
// downloads bodies for the other 1100+.
const chapterBodyLoaders = import.meta.glob<{ default: Record<string, string> }>(
  './generated/chapters/*.json',
);

function loadChapterBodies(chapterNo: string): Promise<Record<string, string>> {
  const loader = chapterBodyLoaders[`./generated/chapters/ch${chapterNo}.json`];
  return loader ? loader().then((m) => m.default) : Promise.resolve({});
}

const STAGES = [
  { n: 1, label: 'Before you fly', note: 'What keeps you safe and useful in month one' },
  { n: 2, label: 'First year', note: 'The craft itself, as you meet it on the job' },
  { n: 3, label: 'Becoming skilled', note: 'Geometry, inspection, diagnosis, planning' },
  { n: 4, label: 'Later', note: 'Certification and lead-worker material' },
];

const allItems: Item[] = chapters.flatMap((c) => c.sections.flatMap((s) => s.items));
const itemById = new Map(allItems.map((i) => [i.id, i]));
const itemOrder = allItems.map((i) => i.id);
const orderIndex = new Map(itemOrder.map((id, n) => [id, n]));

/** Next unread item in reading order, preferring earlier stages. */
function nextUnread(read: Set<string>): Item | undefined {
  const byStage = [...allItems].sort(
    (a, b) => a.stage - b.stage || orderIndex.get(a.id)! - orderIndex.get(b.id)!,
  );
  return byStage.find((i) => i.status !== 'stub' && !read.has(i.id));
}

/** Minimal inline markdown: headings, bold, links, lists. No dependency, no runtime parser cost. */
function renderBody(md: string) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const inline = (t: string) =>
    t
      .replace(/\[([^\]]+)\]\([^)]*?(\d{2}\.\d+\.\d{2})[^)]*\)/g, '<a href="#/item/$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  const flush = (key: string) => {
    if (!list.length) return;
    blocks.push(
      <ul key={key}>
        {list.map((li, n) => (
          <li key={n} dangerouslySetInnerHTML={{ __html: inline(li) }} />
        ))}
      </ul>,
    );
    list = [];
  };

  // Markdown tables: material property tables carry real numbers workers act on.
  const renderTable = (rows: string[], key: string) => {
    const cells = rows.map((r) =>
      r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()),
    );
    const [head, , ...body] = cells;
    return (
      <table key={key} className="my-4 w-full border-collapse text-[14px]">
        <thead>
          <tr>
            {head.map((h, n) => (
              <th key={n} className="border-b border-ink py-1.5 pr-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, n) => (
            <tr key={n}>
              {row.map((c, m) => (
                <td key={m} className="border-b border-band py-1.5 pr-3 tabular-nums">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const lines = md.split('\n');
  let table: string[] = [];
  const flushTable = (key: string) => {
    if (table.length >= 2) blocks.push(renderTable(table, key));
    table = [];
  };
  let para: string[] = [];
  const flushPara = (key: string) => {
    if (!para.length) return;
    blocks.push(<p key={key} dangerouslySetInnerHTML={{ __html: inline(para.join(' ')) }} />);
    para = [];
  };

  lines.forEach((line, n) => {
    if (/^\|.*\|$/.test(line.trim())) {
      flushPara('p' + n);
      flush('u' + n);
      table.push(line.trim());
      return;
    }
    flushTable('t' + n);

    const img = /^!\[([^\]]*)\]\(([^)]+)\)/.exec(line.trim());
    if (img) {
      flushPara('p' + n);
      flush('u' + n);
      const meta = imageById.get(img[2]);
      if (meta) {
        const needsCredit = licences[meta.licence]?.attribution;
        blocks.push(
          <figure key={n} className="my-5">
            <img
              src={`${import.meta.env.BASE_URL}${meta.file}`}
              alt={img[1]}
              loading="lazy"
              className="w-full rounded-md border border-band"
            />
            <figcaption className="mt-1.5 text-[13px] text-muted">
              {img[1]}
              {needsCredit && meta.author && (
                <>
                  {' — '}
                  {meta.sourceUrl ? (
                    <a href={meta.sourceUrl} target="_blank" rel="noreferrer noopener"
                       className="underline underline-offset-2">
                      {meta.author}
                    </a>
                  ) : (
                    meta.author
                  )}
                  {`, ${meta.licence}`}
                </>
              )}
            </figcaption>
          </figure>,
        );
      }
      return;
    }

    const h3 = /^###\s+(.+)/.exec(line);
    const h2 = /^##\s+(.+)/.exec(line);
    const h1 = /^#\s+(.+)/.exec(line);
    const li = /^[-*]\s+(.+)/.exec(line);

    if (h2 || h1 || h3 || li || !line.trim()) {
      flushPara('p' + n);
      if (!li) flush('u' + n);
    }
    if (h3) {
      blocks.push(
        <h3 key={n} className="mt-6 mb-1.5 text-[15px] font-semibold">
          {h3[1]}
        </h3>,
      );
      return;
    }
    if (h1) blocks.push(<h1 key={n}>{h1[1]}</h1>);
    else if (h2) blocks.push(<h2 key={n}>{h2[1]}</h2>);
    else if (li) list.push(li[1]);
    else if (line.trim()) para.push(line.trim());
  });
  flushPara('pz');
  flush('uz');
  flushTable('tz');
  return blocks;
}

function StageBar({ stage }: { stage: number }) {
  // A cross-section stripe: the trade's own diagram used as the stage marker.
  return (
    <span className="inline-flex h-3 w-8 shrink-0 overflow-hidden rounded-sm" aria-hidden="true">
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className="flex-1"
          style={{ background: n <= stage ? layerColor(n) : 'var(--color-band)' }}
        />
      ))}
    </span>
  );
}

const layerColor = (n: number) =>
  ({ 1: '#a33b1e', 2: '#b8703a', 3: '#4a7f8c', 4: '#99a1a7' })[n] ?? '#99a1a7';

function Header() {
  return (
    <header className="border-b border-band bg-panel">
      <div className="mx-auto flex max-w-3xl items-baseline gap-3 px-4 py-3">
        <Link to="/" className="text-[15px] font-semibold tracking-tight">
          保温保冷工事
        </Link>
        <nav className="ml-auto flex gap-3 text-[13px]">
          <Link to="/corpus" className="text-muted hover:text-ink">
            Corpus
          </Link>
          <Link to="/glossary" className="text-muted hover:text-ink">
            Glossary
          </Link>
          <Link to="/sources" className="text-muted hover:text-ink">
            Sources
          </Link>
          <Link to="/settings" className="text-muted hover:text-ink" aria-label="Settings">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  const [q, setQ] = useState('');
  const read = getRead();
  const resume = nextUnread(read);
  const navigate = useNavigate();
  const results = useMemo(() => (q.trim() ? search(q, allItems) : []), [q]);

  const written = data.counts.written;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <label className="block">
        <span className="sr-only">Search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search — English or 日本語"
          className="w-full rounded-md border border-band bg-panel px-3 py-2.5 text-[15px] placeholder:text-steel"
          autoComplete="off"
        />
      </label>

      {q.trim() ? (
        <ul className="mt-4 divide-y divide-band border-y border-band">
          {results.length === 0 && (
            <li className="py-4 text-[14px] text-muted">
              Nothing matches that yet. Most items are still unwritten.
            </li>
          )}
          {results.slice(0, 40).map((i) => (
            <li key={i.id}>
              <button
                onClick={() => navigate(`/item/${i.id}`)}
                className="flex w-full items-center gap-3 py-2.5 text-left"
              >
                <StageBar stage={i.stage} />
                <span className="text-[15px]">{i.title}</span>
                <span className="ml-auto text-[12px] tabular-nums text-steel">{i.id}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {resume && (
            <Link
              to={`/item/${resume.id}`}
              className="mt-4 block rounded-md border border-band bg-panel p-3"
            >
              <span className="block text-[12px] text-muted">
                {read.size > 0 ? 'Continue reading' : 'Start here'}
              </span>
              <span className="text-[15px] font-semibold">{resume.title}</span>
              <span className="block text-[13px] text-muted">
                Chapter {resume.chapter} · stage {resume.stage}
              </span>
            </Link>
          )}

          <p className="mt-5 text-[14px] text-muted">
            {read.size} read · {written} of {data.counts.items} items written. Ordered by when you need them, not by
            how a textbook would file them.
          </p>

          {STAGES.map((st) => {
            const chs = chapters.filter((c) => c.stage === st.n);
            if (!chs.length) return null;
            return (
              <section key={st.n} className="mt-7">
                <div className="flex items-center gap-2.5">
                  <StageBar stage={st.n} />
                  <h2 className="text-[15px] font-semibold tracking-tight">{st.label}</h2>
                </div>
                <p className="mt-1 text-[13px] text-muted">{st.note}</p>
                <ul className="mt-2.5 divide-y divide-band border-y border-band">
                  {chs.map((c) => {
                    const items = c.sections.flatMap((s) => s.items);
                    const done = items.filter((i) => i.status !== 'stub').length;
                    return (
                      <li key={c.no}>
                        <Link
                          to={`/chapter/${c.no}`}
                          className="flex items-baseline gap-3 py-2.5 text-[15px]"
                        >
                          <span className="tabular-nums text-steel">{c.no}</span>
                          <span className="flex-1">{c.title}</span>
                          <span className="text-[12px] tabular-nums text-steel">
                            {done}/{items.length}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

function ChapterView() {
  const { no } = useParams();
  const read = getRead();
  const chapter = chapters.find((c) => c.no === no);
  if (!chapter) return <NotFound />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="text-[13px] text-cold underline underline-offset-2">
        All chapters
      </Link>
      <div className="mt-3 flex items-center gap-2.5">
        <StageBar stage={chapter.stage} />
        {chapter.safetyCritical && (
          <span className="rounded-sm bg-hot px-1.5 py-0.5 text-[11px] font-medium text-white">
            Safety critical
          </span>
        )}
      </div>
      <h1 className="mt-2 text-[22px] font-semibold tracking-tight">
        {chapter.no}. {chapter.title}
      </h1>

      {chapter.sections.map((s) => (
        <section key={s.no} className="mt-6">
          <h2 className="text-[15px] font-semibold">
            <span className="tabular-nums text-steel">{s.no}</span> {s.title}
          </h2>
          <ul className="mt-1.5 divide-y divide-band border-y border-band">
            {s.items.map((i) => (
              <li key={i.id}>
                <Link to={`/item/${i.id}`} className="flex items-baseline gap-3 py-2.5 text-[15px]">
                  <span className="flex-1">{i.title}</span>
                  {i.status === 'stub' ? (
                    <span className="text-[12px] text-steel">not written</span>
                  ) : read.has(i.id) ? (
                    <span className="text-[12px] text-cold">read</span>
                  ) : (
                    <span className="text-[12px] text-steel">new</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ItemView() {
  const { id } = useParams();
  const item = id ? itemById.get(id) : undefined;
  const [body, setBody] = useState<string | null>(null);
  const [read, setRead] = useState(getRead);

  // Scroll to top on navigation — otherwise moving to the next item lands the
  // reader halfway down the new page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setBody(null);
    if (!item || item.status === 'stub') return;
    let cancelled = false;
    loadChapterBodies(item.chapter).then((bodies) => {
      if (!cancelled) setBody(bodies[item.id] ?? '');
    });
    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) return <NotFound />;

  const chapter = chapters.find((c) => c.no === item.chapter)!;
  const pos = orderIndex.get(item.id) ?? 0;
  const prev = itemOrder
    .slice(0, pos)
    .reverse()
    .map((x) => itemById.get(x)!)
    .find((x) => x.status !== 'stub');
  const next = itemOrder
    .slice(pos + 1)
    .map((x) => itemById.get(x)!)
    .find((x) => x.status !== 'stub');
  const isRead = read.has(item.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link
        to={`/chapter/${item.chapter}`}
        className="text-[13px] text-cold underline underline-offset-2"
      >
        {chapter.no}. {chapter.title}
      </Link>

      {item.safetyCritical && item.status !== 'stub' && (
        <p className="mt-3 border-l-2 border-hot pl-3 text-[13px]">
          Safety-critical. Your site's method statement and your KY meeting govern what you
          actually do.
        </p>
      )}

      {item.status === 'review' && (
        <p className="mt-3 text-[13px] text-muted">
          Draft — written and validated, not yet signed off by a person.
        </p>
      )}

      {item.status === 'stub' ? (
        <div className="mt-5 rounded-md border border-band bg-panel p-4">
          <h1 className="text-[19px] font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-2 text-[14px] text-muted">
            Not written yet. This item has a reserved place in the curriculum and other pages can
            already link to it.
          </p>
        </div>
      ) : body === null ? (
        <p className="mt-5 text-[14px] text-muted">Loading…</p>
      ) : (
        <>
          <article className="prose-body mt-4">{renderBody(body)}</article>

          <div className="mt-8 flex items-center gap-2 border-t border-band pt-4">
            <button
              onClick={() => setRead(isRead ? unmarkRead(item.id) : markRead(item.id))}
              className={`rounded-md border px-3 py-1.5 text-[14px] ${
                isRead ? 'border-ink bg-ink text-paper' : 'border-band bg-panel'
              }`}
            >
              {isRead ? 'Read' : 'Mark as read'}
            </button>
          </div>

          {item.sources?.length > 0 && (
            <section className="mt-8 border-t border-band pt-4">
              <h2 className="text-[13px] font-semibold text-muted">
                {item.sourceBasis === 'cited' ? 'Sources' : 'Grounded in'}
              </h2>
              <ul className="mt-2 space-y-2.5">
                {item.sources.map((sid) => {
                  const src = sourceById.get(sid);
                  if (!src) return null;
                  return (
                    <li key={sid} className="text-[14px]">
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-cold underline underline-offset-2"
                        >
                          {src.title}
                        </a>
                      ) : (
                        <span>{src.title}</span>
                      )}
                      <span className="text-muted"> — {src.publisher}</span>
                      {src.access === 'paid' && (
                        <span className="ml-1.5 rounded-sm bg-band px-1 py-0.5 text-[11px] text-muted">
                          paid document
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {item.confidence === 'needs-confirmation' && (
                <p className="mt-3 border-l-2 border-hot pl-3 text-[14px]">
                  Parts of this item are not confirmed. Check with your supervisor before relying
                  on it on a live job.
                </p>
              )}
            </section>
          )}

          {item.terms?.length > 0 && (
            <section className="mt-8 border-t border-band pt-4">
              <h2 className="text-[13px] font-semibold text-muted">Japanese in this item</h2>
              <dl className="mt-2 space-y-2">
                {item.terms.map((t) => (
                  <div key={t.term} className="text-[15px]">
                    <dt className="inline font-semibold">{t.term}</dt>
                    <dd className="inline text-muted">
                      {' '}
                      <span lang="ja">{t.reading}</span> — {t.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <nav className="mt-8 flex gap-2 border-t border-band pt-4">
            {prev && (
              <Link
                to={`/item/${prev.id}`}
                className="flex-1 rounded-md border border-band bg-panel p-2.5 text-[14px]"
              >
                <span className="block text-[12px] text-muted">Previous</span>
                {prev.title}
              </Link>
            )}
            {next && (
              <Link
                to={`/item/${next.id}`}
                className="flex-1 rounded-md border border-band bg-panel p-2.5 text-right text-[14px]"
              >
                <span className="block text-[12px] text-muted">Next</span>
                {next.title}
              </Link>
            )}
          </nav>
        </>
      )}
    </div>
  );
}

function Corpus() {
  const [q, setQ] = useState('');
  const [stage, setStage] = useState(0);
  const [written, setWritten] = useState(false);
  const navigate = useNavigate();

  const rows = useMemo(() => {
    let list = q.trim() ? search(q, allItems) : allItems;
    if (stage) list = list.filter((i) => i.stage === stage);
    if (written) list = list.filter((i) => i.status !== 'stub');
    return list;
  }, [q, stage, written]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[19px] font-semibold tracking-tight">Corpus</h1>
      <p className="mt-1 text-[14px] text-muted">
        Every item in the curriculum, filterable. Same content as the chapters, arranged for
        looking things up rather than reading through.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter — English or 日本語"
        className="mt-4 w-full rounded-md border border-band bg-panel px-3 py-2.5 text-[15px] placeholder:text-steel"
        autoComplete="off"
      />

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {[0, 1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => setStage(n)}
            className={`rounded-md border px-2.5 py-1 text-[13px] ${
              stage === n ? 'border-ink bg-ink text-paper' : 'border-band bg-panel text-muted'
            }`}
          >
            {n === 0 ? 'All stages' : `Stage ${n}`}
          </button>
        ))}
        <button
          onClick={() => setWritten(!written)}
          className={`rounded-md border px-2.5 py-1 text-[13px] ${
            written ? 'border-ink bg-ink text-paper' : 'border-band bg-panel text-muted'
          }`}
        >
          Written only
        </button>
      </div>

      <p className="mt-3 text-[13px] text-muted">{rows.length} items</p>

      <ul className="mt-1 divide-y divide-band border-y border-band">
        {rows.slice(0, 250).map((i) => (
          <li key={i.id}>
            <button
              onClick={() => navigate(`/item/${i.id}`)}
              className="flex w-full items-center gap-3 py-2.5 text-left"
            >
              <StageBar stage={i.stage} />
              <span className="flex-1 text-[15px]">{i.title}</span>
              <span className="text-[12px] tabular-nums text-steel">{i.id}</span>
            </button>
          </li>
        ))}
      </ul>
      {rows.length > 250 && (
        <p className="mt-3 text-[13px] text-muted">
          Showing the first 250. Narrow the filter to see more.
        </p>
      )}
    </div>
  );
}

function Sources() {
  const citedBy = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const i of allItems) for (const sid of i.sources ?? []) {
      m.set(sid, [...(m.get(sid) ?? []), i]);
    }
    return m;
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[19px] font-semibold tracking-tight">Sources</h1>
      <p className="mt-1 text-[14px] text-muted">
        Everything content on this site is grounded in. Official Japanese documents are the
        authority for anything about certification, regulation or site safety.
      </p>

      <ul className="mt-5 space-y-5">
        {sources.map((s) => {
          const users = citedBy.get(s.id) ?? [];
          return (
            <li key={s.id} className="border-t border-band pt-4">
              <h2 className="text-[15px] font-semibold">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-cold underline underline-offset-2"
                  >
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
              </h2>
              {s.titleEn !== s.title && (
                <p className="text-[13px] text-muted">{s.titleEn}</p>
              )}
              <p className="mt-1 text-[13px] text-muted">
                {s.publisher} · tier {s.tier}
                {s.access === 'paid' && ' · paid document'}
                {!s.quotable && ' · describe only, never quote'}
              </p>
              <p className="mt-1.5 text-[14px]">{s.note}</p>
              {users.length > 0 && (
                <p className="mt-1.5 text-[13px] text-muted">
                  Cited by{' '}
                  {users.map((u, n) => (
                    <span key={u.id}>
                      {n > 0 && ', '}
                      <Link to={`/item/${u.id}`} className="text-cold underline underline-offset-2">
                        {u.id}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Glossary() {
  const [q, setQ] = useState('');
  const terms = useMemo(() => {
    const list = (data.glossary as { term: string; reading: string; meaning: string; sourceId: string }[]) ?? [];
    if (!q.trim()) return list;
    const n = q.trim().toLowerCase();
    return list.filter(
      (t) =>
        t.term.includes(n) ||
        (t.reading ?? '').includes(n) ||
        (t.meaning ?? '').toLowerCase().includes(n),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[19px] font-semibold tracking-tight">Glossary</h1>
      <p className="mt-1 text-[14px] text-muted">
        Every Japanese term used on this site, with its reading. Each links to the item that
        introduces it.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter — kanji, kana or English"
        className="mt-4 w-full rounded-md border border-band bg-panel px-3 py-2.5 text-[15px] placeholder:text-steel"
        autoComplete="off"
      />
      <p className="mt-3 text-[13px] text-muted">{terms.length} terms</p>
      <dl className="mt-1 divide-y divide-band border-y border-band">
        {terms.map((t) => (
          <div key={t.term + t.sourceId} className="flex items-baseline gap-3 py-2.5">
            <dt className="text-[17px] font-semibold">
              <ruby>
                {t.term}
                <rt>{t.reading}</rt>
              </ruby>
            </dt>
            <dd className="flex-1 text-[14px] text-muted">{t.meaning}</dd>
            <Link to={`/item/${t.sourceId}`} className="text-[12px] tabular-nums text-cold">
              {t.sourceId}
            </Link>
          </div>
        ))}
      </dl>
      {terms.length === 0 && (
        <p className="mt-4 text-[14px] text-muted">
          No terms match. The glossary fills in as items are written.
        </p>
      )}
    </div>
  );
}

function Settings() {
  const [prefs, setLocal] = useState<Prefs>(getPrefs);
  const [read, setRead] = useState(getRead);

  const update = (next: Partial<Prefs>) => {
    const merged = { ...prefs, ...next };
    setLocal(setPrefs(merged));
    document.documentElement.classList.toggle('no-furigana', !merged.furigana);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[19px] font-semibold tracking-tight">Settings</h1>

      <section className="mt-5 border-t border-band pt-4">
        <h2 className="text-[15px] font-semibold">Appearance</h2>
        <div className="mt-2 flex gap-1.5">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => update({ theme: t })}
              className={`rounded-md border px-2.5 py-1 text-[13px] ${
                prefs.theme === t ? 'border-ink bg-ink text-paper' : 'border-band bg-panel text-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[13px] text-muted">
          Dark is easier in a plant room or a ceiling void.
        </p>
      </section>

      <section className="mt-5 border-t border-band pt-4">
        <h2 className="text-[15px] font-semibold">Furigana</h2>
        <button
          onClick={() => update({ furigana: !prefs.furigana })}
          className={`mt-2 rounded-md border px-2.5 py-1 text-[13px] ${
            prefs.furigana ? 'border-ink bg-ink text-paper' : 'border-band bg-panel text-muted'
          }`}
        >
          {prefs.furigana ? 'Readings shown' : 'Readings hidden'}
        </button>
        <p className="mt-1.5 text-[13px] text-muted">
          Turn readings off once you no longer need them.
        </p>
      </section>

      <section className="mt-5 border-t border-band pt-4">
        <h2 className="text-[15px] font-semibold">Reading progress</h2>
        <p className="mt-1.5 text-[14px]">
          {read.size} item{read.size === 1 ? '' : 's'} marked read.
        </p>
        <button
          onClick={() => {
            if (confirm('Clear reading progress on this device? This cannot be undone.')) {
              for (const id of getRead()) unmarkRead(id);
              setRead(new Set());
            }
          }}
          className="mt-2 rounded-md border border-band bg-panel px-2.5 py-1 text-[13px] text-muted"
        >
          Clear progress
        </button>
        <p className="mt-1.5 text-[13px] text-muted">
          Progress is stored on this device only. There is no account and nothing is uploaded.
        </p>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-[19px] font-semibold">That page does not exist</h1>
      <Link to="/" className="mt-2 inline-block text-[15px] text-cold underline underline-offset-2">
        Back to the chapter list
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chapter/:no" element={<ChapterView />} />
          <Route path="/item/:id" element={<ItemView />} />
          <Route path="/corpus" element={<Corpus />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
