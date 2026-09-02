/**
 * Reader state: what has been read, and how the reader wants it displayed.
 *
 * Stored in localStorage, per device. There is no backend and no account —
 * four people, four phones. Losing this loses reading history and nothing else,
 * so it is deliberately not treated as precious.
 *
 * Every read is wrapped: Safari in private mode throws on localStorage access
 * rather than returning null, and a thrown exception here would blank the whole
 * page. A reference that fails to open is worse than one that forgets your
 * place.
 */

const READ_KEY = 'tic:read';
const PREF_KEY = 'tic:prefs';

export interface Prefs {
  theme: 'light' | 'dark' | 'system';
  furigana: boolean;
}

const defaultPrefs: Prefs = { theme: 'system', furigana: true };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked. Reading still works; the position is just
    // not remembered.
  }
}

export function getRead(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markRead(id: string): Set<string> {
  const read = getRead();
  read.add(id);
  save(READ_KEY, [...read]);
  return read;
}

export function unmarkRead(id: string): Set<string> {
  const read = getRead();
  read.delete(id);
  save(READ_KEY, [...read]);
  return read;
}

export function getPrefs(): Prefs {
  return load(PREF_KEY, defaultPrefs);
}

export function setPrefs(prefs: Prefs): Prefs {
  save(PREF_KEY, prefs);
  applyTheme(prefs.theme);
  return prefs;
}

export function applyTheme(theme: Prefs['theme']): void {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}
