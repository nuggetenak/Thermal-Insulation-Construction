import type { Item } from './types';

/**
 * Japanese-aware search without a dependency.
 *
 * Japanese does not put spaces between words, so a whitespace tokeniser finds
 * nothing when someone searches 保温. Character bigrams solve this: 保温保冷
 * indexes as 保温 / 温保 / 保冷, so any two-character query hits. Latin text
 * still tokenises on word boundaries, which behaves better for English.
 */

function bigrams(text: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < text.length - 1; i++) out.push(text.slice(i, i + 2));
  return out;
}

const isCJK = (s: string) => /[\u3040-\u30ff\u4e00-\u9fff]/.test(s);

function tokenise(text: string): Set<string> {
  const tokens = new Set<string>();
  const lower = text.toLowerCase();

  for (const word of lower.split(/[^\p{L}\p{N}]+/u)) {
    if (!word) continue;
    if (isCJK(word)) {
      tokens.add(word);
      for (const b of bigrams(word)) tokens.add(b);
    } else if (word.length > 1) {
      tokens.add(word);
    }
  }
  return tokens;
}

const cache = new WeakMap<Item, Set<string>>();

function indexOf(item: Item): Set<string> {
  let t = cache.get(item);
  if (!t) {
    const haystack = [
      item.title,
      item.japanese ?? '',
      item.summary ?? '',
      item.id,
      ...(item.terms ?? []).flatMap((x) => [x.term, x.reading ?? '', x.meaning ?? '']),
    ].join(' ');
    t = tokenise(haystack);
    cache.set(item, t);
  }
  return t;
}

export function search(query: string, items: Item[]): Item[] {
  const q = tokenise(query);
  if (!q.size) return [];

  const scored: { item: Item; score: number }[] = [];
  for (const item of items) {
    const idx = indexOf(item);
    let score = 0;
    for (const token of q) if (idx.has(token)) score += token.length > 1 ? 2 : 1;
    // Written items outrank stubs — a reader wants something they can read.
    if (score > 0) scored.push({ item, score: score + (item.status !== 'stub' ? 5 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
