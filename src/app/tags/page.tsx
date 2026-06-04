import Link from 'next/link';
import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { listTags } from '@/lib/tags';
export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  await requireSession();
  const tags = await listTags();
  return (
    <>
      <AppChrome />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 18 }}>
        {tags.map(t => (
          <Link key={t.id} href={`/tags/${t.slug}`} className="glass" style={{ padding: '6px 12px', textDecoration: 'none', color: 'var(--ink)', fontSize: 13 + Math.min((t.count ?? 1), 8) }}>
            #{t.label} <span style={{ color: '#889' }}>{t.count}</span>
          </Link>
        ))}
        {tags.length === 0 && <p style={{ color: '#889' }}>No tags yet.</p>}
      </div>
    </>
  );
}
