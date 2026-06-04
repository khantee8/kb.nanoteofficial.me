import { getSql } from './db';
import type { ItemState } from './types';

const FIELDS = ['pinned', 'archived', 'saved', 'read'] as const;
type Field = typeof FIELDS[number];

/** Upsert a single boolean state field for an item; returns the full state. */
export async function setState(itemId: string, field: Field, value: boolean): Promise<ItemState> {
  if (!FIELDS.includes(field)) throw new Error('bad field');
  const sql = getSql();
  // column name is from a fixed allowlist (FIELDS) — safe to interpolate.
  const [r] = await sql(
    `INSERT INTO item_state (item_id, ${field}) VALUES ($1, $2)
     ON CONFLICT (item_id) DO UPDATE SET ${field}=$2, updated_at=now()
     RETURNING pinned, archived, saved, read`, [itemId, value]) as any[];
  return { pinned: r.pinned, archived: r.archived, saved: r.saved, read: r.read };
}
