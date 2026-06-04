import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { ItemCard } from '@/components/ItemCard';
import { listItems } from '@/lib/items';
export const dynamic = 'force-dynamic';

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireSession();
  const { slug } = await params;
  const items = await listItems({ tag: slug, limit: 100 });
  return (
    <>
      <AppChrome />
      <div style={{ padding: '8px 18px', color: '#aab' }}>#{slug}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12, padding: '0 18px 24px' }}>
        {items.map(it => <ItemCard key={it.id} it={it} />)}
        {items.length === 0 && <p style={{ color: '#889' }}>No briefs with this tag.</p>}
      </div>
    </>
  );
}
