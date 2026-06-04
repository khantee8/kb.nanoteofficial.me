'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Item } from '@/lib/types';

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter(); const [q, setQ] = useState(''); const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    if (!open || !q.trim()) { setItems([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/items?q=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) setItems((await res.json()).items);
    }, 180);
    return () => clearTimeout(t);
  }, [q, open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'grid', placeItems: 'start center', paddingTop: '12vh', zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} className="glass" style={{ width: 'min(620px,92vw)', padding: 14 }}>
        <input autoFocus placeholder="Search the library…" value={q} onChange={e => setQ(e.target.value)} style={{ width: '100%' }} />
        <div style={{ marginTop: 10, display: 'grid', gap: 4 }}>
          {items.map(it => (
            <button key={it.id} onClick={() => { onClose(); router.push(`/library/${it.id}`); }}
              style={{ textAlign: 'left', fontSize: 13, padding: 8 }}>
              {it.highlight || it.summary.slice(0, 70)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
