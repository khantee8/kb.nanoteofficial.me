import Link from 'next/link';
import { deptColor, deptLabel, categoryLabel } from '@/lib/format';
import type { Item } from '@/lib/types';

export function ItemCard({ it }: { it: Item }) {
  return (
    <Link href={`/library/${it.id}`} className="glass" style={{ padding: 14, textDecoration: 'none', color: 'var(--ink)', display: 'block' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: '#aab' }}>
        <span style={{ width: 7, height: 7, borderRadius: 9, background: deptColor(it.dept) }} />
        {deptLabel(it.dept)} · {categoryLabel(it.category)}
        <span style={{ marginLeft: 'auto' }}>{it.sourceDate}</span>
      </div>
      <div style={{ fontWeight: 600, marginTop: 6 }}>{it.highlight || it.summary.slice(0, 80)}</div>
      <p style={{ color: '#bcc', fontSize: 13, margin: '6px 0 0' }}>{it.summary.slice(0, 140)}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
        {(it.tags ?? []).slice(0, 5).map(t => <span key={t} style={{ fontSize: 11, color: '#a9b' }}>#{t}</span>)}
      </div>
    </Link>
  );
}
