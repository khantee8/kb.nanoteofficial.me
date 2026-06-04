import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { ItemCard } from '@/components/ItemCard';
import { listItems } from '@/lib/items';
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireSession();
  const { slug } = await params;
  const items = await listItems({ collection: slug, limit: 100 });
  return (
    <>
      <AppChrome />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12, padding: 18 }}>
        {items.map(it => <ItemCard key={it.id} it={it} />)}
        {items.length === 0 && <p style={{ color: '#889' }}>Empty collection.</p>}
      </div>
    </>
  );
}
