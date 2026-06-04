import type { Artifact } from './artifacts';
import type { DeptId, KbCategory } from './kbEntry';

export type ItemKind = 'company_brief' | 'note';

export interface Item {
  id: string;
  kind: ItemKind;
  externalId: string | null;
  dept: DeptId | null;
  category: KbCategory | string | null;
  summary: string;
  highlight: string;
  bodyMd: string;
  flags: string[];
  artifacts: Artifact[];
  sourceDate: string | null;
  sourceTs: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  state?: ItemState;
}

export interface ItemState {
  pinned: boolean;
  archived: boolean;
  saved: boolean;
  read: boolean;
}

export interface Collection {
  id: string; name: string; slug: string;
  description: string; color: string; icon: string; createdAt: string;
  itemCount?: number;
}

export interface Tag { id: string; label: string; slug: string; count?: number; }

export interface SyncLog {
  id: string; startedAt: string; finishedAt: string | null;
  fetchedCount: number; upsertedCount: number;
  status: 'running' | 'ok' | 'error'; error: string | null;
}

export const EMPTY_STATE: ItemState = { pinned: false, archived: false, saved: false, read: false };
