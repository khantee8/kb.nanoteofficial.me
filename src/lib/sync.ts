import type { KbEntry, KbApiResponse } from './kbEntry';
import { normalizeTags } from './artifacts';
import { getSql } from './db';
import type { SyncLog } from './types';

export interface MappedItem {
  kind: 'company_brief'; externalId: string; dept: string; category: string;
  summary: string; highlight: string; bodyMd: string;
  flags: string[]; artifacts: KbEntry['artifacts'];
  sourceDate: string; sourceTs: string; tags: string[];
}

/** Pure: KbEntry → row payload. Tags normalized; no DB. */
export function mapEntryToItem(e: KbEntry): MappedItem {
  return {
    kind: 'company_brief', externalId: e.id, dept: e.dept, category: e.category,
    summary: e.summary ?? '', highlight: e.highlight ?? '', bodyMd: e.markdown ?? '',
    flags: Array.isArray(e.flags) ? e.flags : [],
    artifacts: Array.isArray(e.artifacts) ? e.artifacts : [],
    sourceDate: e.date, sourceTs: e.ts, tags: normalizeTags(e.tags ?? []),
  };
}

/** Fetch published entries, upsert items + tags, write a sync_log row. */
export async function runSync(now = new Date()): Promise<SyncLog> {
  const sql = getSql();
  const url = process.env.COMPANY_KB_URL ?? 'https://company.nanoteofficial.me/api/kb';
  const [log] = await sql`INSERT INTO sync_log (started_at, status) VALUES (${now.toISOString()}, 'running')
    RETURNING id, started_at` as { id: string; started_at: string }[];
  try {
    const res = await fetch(`${url}?limit=200`, { headers: { accept: 'application/json' } });
    const data = (await res.json()) as KbApiResponse;
    const entries = Array.isArray(data.entries) ? data.entries : [];
    let upserted = 0;
    for (const e of entries) {
      const m = mapEntryToItem(e);
      const [row] = await sql`
        INSERT INTO item (kind, external_id, dept, category, summary, highlight, body_md, flags, artifacts, source_date, source_ts, updated_at)
        VALUES (${m.kind}, ${m.externalId}, ${m.dept}, ${m.category}, ${m.summary}, ${m.highlight}, ${m.bodyMd},
                ${JSON.stringify(m.flags)}, ${JSON.stringify(m.artifacts)}, ${m.sourceDate}, ${m.sourceTs}, now())
        ON CONFLICT (external_id) DO UPDATE SET
          dept=EXCLUDED.dept, category=EXCLUDED.category, summary=EXCLUDED.summary,
          highlight=EXCLUDED.highlight, body_md=EXCLUDED.body_md, flags=EXCLUDED.flags,
          artifacts=EXCLUDED.artifacts, source_date=EXCLUDED.source_date, source_ts=EXCLUDED.source_ts, updated_at=now()
        RETURNING id` as { id: string }[];
      for (const label of m.tags) {
        const slug = label;
        const [tag] = await sql`INSERT INTO tag (label, slug) VALUES (${label}, ${slug})
          ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label RETURNING id` as { id: string }[];
        await sql`INSERT INTO item_tag (item_id, tag_id, source) VALUES (${row.id}, ${tag.id}, 'company')
          ON CONFLICT DO NOTHING`;
      }
      upserted++;
    }
    const [done] = await sql`UPDATE sync_log SET finished_at=now(), status='ok',
      fetched_count=${entries.length}, upserted_count=${upserted} WHERE id=${log.id}
      RETURNING id, started_at, finished_at, fetched_count, upserted_count, status, error` as any[];
    return normalizeLog(done);
  } catch (err) {
    const [done] = await sql`UPDATE sync_log SET finished_at=now(), status='error', error=${String(err)}
      WHERE id=${log.id} RETURNING id, started_at, finished_at, fetched_count, upserted_count, status, error` as any[];
    return normalizeLog(done);
  }
}

function normalizeLog(r: any): SyncLog {
  return { id: r.id, startedAt: r.started_at, finishedAt: r.finished_at,
    fetchedCount: r.fetched_count ?? 0, upsertedCount: r.upserted_count ?? 0,
    status: r.status, error: r.error ?? null };
}
