import { getSql } from './db';
import type { Tag } from './types';

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export function mergeTagLabels(labels: string[]): string[] {
  const seen = new Set<string>(); const out: string[] = [];
  for (const l of labels) { const s = slugify(l); if (s && !seen.has(s)) { seen.add(s); out.push(l.trim()); } }
  return out;
}
export async function listTags(): Promise<Tag[]> {
  const sql = getSql();
  const rows = await sql`SELECT t.id, t.label, t.slug, count(it.item_id)::int AS count
    FROM tag t LEFT JOIN item_tag it ON it.tag_id=t.id GROUP BY t.id ORDER BY count DESC, t.label` as any[];
  return rows.map(r => ({ id: r.id, label: r.label, slug: r.slug, count: r.count }));
}
/** Rename a tag (re-slugs); if the new slug exists, repoint item_tag rows then delete the old tag (merge). */
export async function renameTag(id: string, label: string): Promise<void> {
  const sql = getSql(); const slug = slugify(label);
  const existing = await sql`SELECT id FROM tag WHERE slug=${slug} AND id<>${id}` as { id: string }[];
  if (existing.length) {
    const target = existing[0].id;
    // Repoint only rows that won't collide with an existing (item_id, target) pair.
    await sql`UPDATE item_tag SET tag_id=${target} WHERE tag_id=${id}
      AND item_id NOT IN (SELECT item_id FROM item_tag WHERE tag_id=${target})`;
    await sql`DELETE FROM item_tag WHERE tag_id=${id}`;
    await sql`DELETE FROM tag WHERE id=${id}`;
  } else {
    await sql`UPDATE tag SET label=${label}, slug=${slug} WHERE id=${id}`;
  }
}
