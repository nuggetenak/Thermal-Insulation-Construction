export interface Term {
  term: string;
  reading: string | null;
  meaning: string | null;
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
  terms: Term[];
  body: string;
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
