'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SyncPanel() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  async function sync() {
    setBusy(true); setMsg('');
    const res = await fetch('/api/sync', { method: 'POST' });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? `Synced: ${j.log?.upsertedCount ?? 0} items` : 'Sync failed');
    router.refresh();
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button onClick={sync} disabled={busy}>{busy ? 'Syncing…' : '⟳ Sync from company KB'}</button>
      {msg && <span style={{ fontSize: 13, color: '#9fb' }}>{msg}</span>}
      <div style={{ display: 'flex', gap: 10 }}>
        <a href="/api/export?format=md" className="glass" style={{ padding: '6px 12px', textDecoration: 'none', color: 'var(--ink)' }}>Export Markdown</a>
        <a href="/api/export?format=json" className="glass" style={{ padding: '6px 12px', textDecoration: 'none', color: 'var(--ink)' }}>Export JSON</a>
        <a href="/api/export?format=pdf" target="_blank" className="glass" style={{ padding: '6px 12px', textDecoration: 'none', color: 'var(--ink)' }}>Export PDF (print)</a>
      </div>
    </div>
  );
}
