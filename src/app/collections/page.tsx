import Link from 'next/link';
import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { GlassCard } from '@/components/GlassCard';
import { listCollections } from '@/lib/collections';
export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  await requireSession();
  const cols = await listCollections();
  return (
    <>
      <AppChrome />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12, padding: 18 }}>
        {cols.map(c => (
          <Link key={c.id} href={`/collections/${c.slug}`} style={{ textDecoration: 'none' }}>
            <GlassCard style={{ borderLeft: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 20 }}>{c.icon}</div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
              <div style={{ color: '#889', fontSize: 12 }}>{c.itemCount ?? 0} items</div>
            </GlassCard>
          </Link>
        ))}
        {cols.length === 0 && <p style={{ color: '#889' }}>No collections yet.</p>}
      </div>
    </>
  );
}
