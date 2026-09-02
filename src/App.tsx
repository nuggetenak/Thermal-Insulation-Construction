import { useMemo, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import data from './generated/index.json';
import { search } from './search';
import type { Chapter, Item, Source } from './types';

const chapters = data.chapters as unknown as Chapter[];
const sources = data.sources as unknown as Source[];
const sourceById = new Map(sources.map((s) => [s.id, s]));

const STAGES = [
  { n: 1, label: 'Before you fly', note: 'What keeps you safe and useful in month one' },
  { n: 2, label: 'First year', note: 'The craft itself, as you meet it on the job' },
  { n: 3, label: 'Becoming skilled', note: 'Geometry, inspection, diagnosis, planning' },
  { n: 4, label: 'Later', note: 'Certification and lead-worker material' },
];

const allItems: Item[] = chapters.flatMap((c) => c.sections.flatMap((s) => s.items));
const itemById = new Map(allItems.map((i) => [i.id, i]));

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
          <Link to="/sources" className="text-muted hover:text-ink">
            Sources
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  const [q, setQ] = useState('');
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
          <p className="mt-5 text-[14px] text-muted">
            {written} of {data.counts.items} items written. Ordered by when you need them, not by
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
                  ) : (
                    <span className="text-[12px] text-cold">read</span>
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
  if (!item) return <NotFound />;

  const chapter = chapters.find((c) => c.no === item.chapter)!;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link
        to={`/chapter/${item.chapter}`}
        className="text-[13px] text-cold underline underline-offset-2"
      >
        {chapter.no}. {chapter.title}
      </Link>

      {item.status === 'stub' ? (
        <div className="mt-5 rounded-md border border-band bg-panel p-4">
          <h1 className="text-[19px] font-semibold tracking-tight">{item.title}</h1>
          <p className="mt-2 text-[14px] text-muted">
            Not written yet. This item has a reserved place in the curriculum and other pages can
            already link to it.
          </p>
        </div>
      ) : (
        <>
          <article className="prose-body mt-4">{renderBody(item.body)}</article>

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
