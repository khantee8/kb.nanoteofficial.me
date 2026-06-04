'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_DEPTS, ALL_CATEGORIES, deptLabel, categoryLabel } from '@/lib/format';

export function FilterBar() {
  const router = useRouter(); const sp = useSearchParams();
  function set(key: string, val: string) {
    const next = new URLSearchParams(sp.toString());
    if (val) next.set(key, val); else next.delete(key);
    router.push(`/library?${next.toString()}`);
  }
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 18px', flexWrap: 'wrap' }}>
      <input defaultValue={sp.get('q') ?? ''} placeholder="Search…" onKeyDown={e => { if (e.key === 'Enter') set('q', (e.target as HTMLInputElement).value); }} />
      <select value={sp.get('dept') ?? ''} onChange={e => set('dept', e.target.value)}>
        <option value="">All depts</option>
        {ALL_DEPTS.map(d => <option key={d} value={d}>{deptLabel(d)}</option>)}
      </select>
      <select value={sp.get('category') ?? ''} onChange={e => set('category', e.target.value)}>
        <option value="">All categories</option>
        {ALL_CATEGORIES.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
      </select>
      <select value={sp.get('sort') ?? 'recent'} onChange={e => set('sort', e.target.value)}>
        <option value="recent">Newest</option><option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
