import { getSql } from './db';
import type { Collection } from './types';
import { slugify } from './tags';

export async function listCollections(): Promise<Collection[]> {
  const sql = getSql();
  const rows = await sql`SELECT c.*, count(ci.item_id)::int item_count
    FROM collection c LEFT JOIN collection_item ci ON ci.collection_id=c.id
    GROUP BY c.id ORDER BY c.created_at DESC` as any[];
  return rows.map(toCollection);
}
export async function createCollection(name: string, color = '#a78bfa', icon = '◆', description = ''): Promise<Collection> {
  const sql = getSql();
  const [r] = await sql`INSERT INTO collection (name, slug, color, icon, description)
    VALUES (${name}, ${slugify(name)}, ${color}, ${icon}, ${description}) RETURNING *` as any[];
  return toCollection(r);
}
export async function addToCollection(collectionId: string, itemId: string): Promise<void> {
  const sql = getSql();
  await sql`INSERT INTO collection_item (collection_id, item_id) VALUES (${collectionId}, ${itemId}) ON CONFLICT DO NOTHING`;
}
export async function removeFromCollection(collectionId: string, itemId: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM collection_item WHERE collection_id=${collectionId} AND item_id=${itemId}`;
}
export async function deleteCollection(id: string): Promise<void> {
  const sql = getSql(); await sql`DELETE FROM collection WHERE id=${id}`;
}
function toCollection(r: any): Collection {
  return { id: r.id, name: r.name, slug: r.slug, description: r.description,
    color: r.color, icon: r.icon, createdAt: r.created_at, itemCount: r.item_count };
}
