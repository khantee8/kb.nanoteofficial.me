'use client';
import { useState } from 'react';
import type { ItemState } from '@/lib/types';

export function StateActions({ itemId, initial }: { itemId: string; initial: ItemState }) {
  const [s, setS] = useState(initial);
  async function toggle(field: keyof ItemState) {
    const res = await fetch('/api/state', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ itemId, field, value: !s[field] }) });
    if (res.ok) setS((await res.json()).state);
  }
  const btn = (field: keyof ItemState, on: string, off: string) =>
    <button onClick={() => toggle(field)} style={{ fontSize: 12, opacity: s[field] ? 1 : .6 }}>{s[field] ? on : off}</button>;
  return <div style={{ display: 'flex', gap: 8 }}>{btn('pinned', '★ Pinned', '☆ Pin')}{btn('saved', '✓ Saved', '+ Save')}{btn('archived', '🗀 Archived', 'Archive')}</div>;
}
