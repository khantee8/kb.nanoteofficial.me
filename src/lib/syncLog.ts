import { getSql } from './db';
import type { SyncLog } from './types';

export async function recentSyncs(limit = 10): Promise<SyncLog[]> {
  const sql = getSql();
  const rows = await sql`SELECT id, started_at, finished_at, fetched_count, upserted_count, status, error
    FROM sync_log ORDER BY started_at DESC LIMIT ${limit}` as any[];
  return rows.map(r => ({ id: r.id, startedAt: r.started_at, finishedAt: r.finished_at,
    fetchedCount: r.fetched_count, upsertedCount: r.upserted_count, status: r.status, error: r.error }));
}
