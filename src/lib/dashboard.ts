import { getSql } from './db';
import { listItems } from './items';

export interface DashboardData {
  total: number; thisWeek: number; openFlags: number; pinned: number;
  byCategory: { label: string; value: number }[];
  recent: Awaited<ReturnType<typeof listItems>>;
  pinnedItems: Awaited<ReturnType<typeof listItems>>;
}

export async function getDashboard(): Promise<DashboardData> {
  const sql = getSql();
  const [{ total }] = await sql`SELECT count(*)::int total FROM item` as any[];
  const [{ week }] = await sql`SELECT count(*)::int week FROM item WHERE source_ts > now() - interval '7 days'` as any[];
  const [{ flags }] = await sql`SELECT coalesce(sum(jsonb_array_length(flags)),0)::int flags FROM item` as any[];
  const [{ pinned }] = await sql`SELECT count(*)::int pinned FROM item_state WHERE pinned` as any[];
  const cat = await sql`SELECT category, count(*)::int value FROM item GROUP BY category ORDER BY value DESC` as any[];
  const recent = await listItems({ sort: 'recent', limit: 8 });
  const pinnedItems = await listItems({ pinned: true, limit: 6 });
  return {
    total, thisWeek: week, openFlags: flags, pinned,
    byCategory: cat.map(c => ({ label: c.category ?? '—', value: c.value })),
    recent, pinnedItems,
  };
}
