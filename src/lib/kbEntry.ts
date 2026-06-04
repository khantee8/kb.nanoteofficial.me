// The shape returned by company.nanoteofficial.me/api/kb (published-only).
import type { Artifact } from './artifacts';

export type DeptId = 'ceo' | 'cyb' | 'mkt' | 'rnd' | 'ops' | 'fin';
export type KbCategory =
  | 'market-brief' | 'threat-intel' | 'research'
  | 'content-plan' | 'ops-status'  | 'exec-brief';

export interface KbEntry {
  id: string;
  dept: DeptId;
  date: string;   // YYYY-MM-DD
  ts: string;     // ISO timestamp
  category: KbCategory;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  pinned?: boolean;
  summary: string;
  highlight: string;
  flags: string[];
  artifacts: Artifact[];
  markdown: string;
}

export interface KbApiResponse {
  entries: KbEntry[];
  count: number;
  generatedAt: string;
}
