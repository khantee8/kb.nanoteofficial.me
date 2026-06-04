import { getSql } from './db';
import type { Item } from './types';

export interface ItemsQuery {
  dept?: string; category?: string; tag?: string; collection?: string;
  q?: string; archived?: boolean; pinned?: boolean; saved?: boolean;
  sort?: 'recent' | 'oldest'; limit?: number;
}

/** Pure: build parameterized WHERE clauses + ordered params. ($1-based) */
export function buildItemsWhere(opt: ItemsQuery): { clauses: string[]; params: (string)[] } {
  const clauses: string[] = []; const params: string[] = [];
  const p = (v: string) => { params.push(v); return `$${params.length}`; };

  clauses.push(opt.archived ? `st.archived = true` : `(st.archived = false OR st.archived IS NULL)`);
  if (opt.pinned) clauses.push(`st.pinned = true`);
  if (opt.saved) clauses.push(`st.saved = true`);
  if (opt.dept) clauses.push(`i.dept = ${p(opt.dept)}`);
  if (opt.category) clauses.push(`i.category = ${p(opt.category)}`);
  if (opt.q && opt.q.trim()) clauses.push(`i.search @@ plainto_tsquery('english', ${p(opt.q.trim())})`);
  if (opt.tag) clauses.push(`EXISTS (SELECT 1 FROM item_tag it JOIN tag t ON t.id=it.tag_id WHERE it.item_id=i.id AND t.slug=${p(opt.tag)})`);
  if (opt.collection) clauses.push(`EXISTS (SELECT 1 FROM collection_item ci JOIN collection c ON c.id=ci.collection_id WHERE ci.item_id=i.id AND c.slug=${p(opt.collection)})`);
  return { clauses, params };
}

const SELECT = `
  SELECT i.*, coalesce(st.pinned,false) pinned, coalesce(st.archived,false) archived,
         coalesce(st.saved,false) saved, coalesce(st.read,false) read,
         coalesce(array_agg(DISTINCT t.slug) FILTER (WHERE t.slug IS NOT NULL), '{}') tags
  FROM item i
  LEFT JOIN item_state st ON st.item_id = i.id
  LEFT JOIN item_tag itg ON itg.item_id = i.id
  LEFT JOIN tag t ON t.id = itg.tag_id`;

export async function listItems(opt: ItemsQuery = {}): Promise<Item[]> {
  const sql = getSql();
  const { clauses, params } = buildItemsWhere(opt);
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const order = opt.sort === 'oldest' ? 'ASC' : 'DESC';
  const limit = opt.limit && opt.limit > 0 ? Math.min(opt.limit, 200) : 100;
  const rows = await sql(
    `${SELECT} ${where} GROUP BY i.id, st.pinned, st.archived, st.saved, st.read
     ORDER BY i.source_ts ${order} NULLS LAST LIMIT ${limit}`, params);
  return (rows as any[]).map(rowToItem);
}

export async function getItem(id: string): Promise<Item | null> {
  const sql = getSql();
  const rows = await sql(`${SELECT} WHERE i.id = $1
     GROUP BY i.id, st.pinned, st.archived, st.saved, st.read`, [id]);
  const r = (rows as any[])[0];
  return r ? rowToItem(r) : null;
}

export function rowToItem(r: any): Item {
  return {
    id: r.id, kind: r.kind, externalId: r.external_id, dept: r.dept, category: r.category,
    summary: r.summary, highlight: r.highlight, bodyMd: r.body_md,
    flags: r.flags ?? [], artifacts: r.artifacts ?? [],
    sourceDate: r.source_date, sourceTs: r.source_ts,
    createdAt: r.created_at, updatedAt: r.updated_at, tags: r.tags ?? [],
    state: { pinned: r.pinned, archived: r.archived, saved: r.saved, read: r.read },
  };
}
