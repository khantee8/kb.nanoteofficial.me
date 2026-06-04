import { requireSession } from '@/lib/session';
import { NavBar } from '@/components/NavBar';
import { ItemCard } from '@/components/ItemCard';
import { listItems } from '@/lib/items';
export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  await requireSession();
  const items = await listItems({ archived: true, limit: 100 });
  return (
    <>
      <NavBar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12, padding: 18 }}>
        {items.map(it => <ItemCard key={it.id} it={it} />)}
        {items.length === 0 && <p style={{ color: '#889' }}>Archive is empty.</p>}
      </div>
    </>
  );
}
