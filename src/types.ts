export interface Term {
  term: string;
  reading: string | null;
  meaning: string | null;
}

export interface Source {
  id: string;
  title: string;
  titleEn: string;
  publisher: string;
  url: string | null;
  language: string;
  tier: number;
  access: 'open' | 'paid' | 'registration';
  quotable: boolean;
  retrieved: string;
  recheckAfter: string | null;
  note: string;
}

export interface Item {
  id: string;
  title: string;
  japanese: string | null;
  slug: string;
  stage: number;
  kind: 'article' | 'vocabulary' | 'practical' | 'diagnostic';
  safetyCritical: boolean;
  chapter: string;
  section: string;
  path: string;
  status: 'stub' | 'draft' | 'review' | 'approved';
  summary?: string;
  confidence?: string | null;
  sourceBasis?: 'general' | 'cited';
  sources: string[];
  seeAlso?: string[];
  headings?: string[];
  terms: Term[];
  /** Not present in the catalog. Loaded on demand per chapter — see loadChapterBodies. */
  body?: string;
}

export interface Section {
  no: string;
  title: string;
  slug: string;
  items: Item[];
}

export interface Chapter {
  no: string;
  title: string;
  japanese: string | null;
  slug: string;
  stage: number;
  safetyCritical: boolean;
  kind: string;
  sections: Section[];
}
