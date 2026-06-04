import { requireSession } from '@/lib/session';
import { NavBar } from '@/components/NavBar';
import { FilterBar } from '@/components/FilterBar';
import { ItemCard } from '@/components/ItemCard';
import { listItems } from '@/lib/items';

export const dynamic = 'force-dynamic';

export default async function LibraryPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireSession();
  const sp = await searchParams;
  const items = await listItems({
    dept: sp.dept, category: sp.category, q: sp.q,
    sort: (sp.sort as 'recent' | 'oldest') ?? 'recent', limit: 60,
  });
  return (
    <>
      <NavBar /><FilterBar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12, padding: '4px 18px 24px' }}>
        {items.map(it => <ItemCard key={it.id} it={it} />)}
        {items.length === 0 && <p style={{ color: '#889' }}>No matching briefs.</p>}
      </div>
    </>
  );
}
