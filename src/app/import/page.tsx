import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { GlassCard } from '@/components/GlassCard';
import { SyncPanel } from '@/components/SyncPanel';
import { recentSyncs } from '@/lib/syncLog';
export const dynamic = 'force-dynamic';

export default async function ImportPage() {
  await requireSession();
  const logs = await recentSyncs();
  return (
    <>
      <AppChrome />
      <div style={{ padding: 18, display: 'grid', gap: 14, maxWidth: 760 }}>
        <GlassCard><h3 style={{ marginTop: 0 }}>Import & Export</h3><SyncPanel /></GlassCard>
        <GlassCard>
          <h4 style={{ marginTop: 0 }}>Recent syncs</h4>
          {logs.map(l => (
            <div key={l.id} style={{ display: 'flex', gap: 10, fontSize: 13, padding: '4px 0', color: l.status === 'error' ? '#ff8080' : '#cbd5ff' }}>
              <span>{new Date(l.startedAt).toLocaleString()}</span>
              <span style={{ marginLeft: 'auto' }}>{l.status} · {l.upsertedCount} upserted</span>
            </div>
          ))}
          {logs.length === 0 && <p style={{ color: '#889' }}>No syncs yet.</p>}
        </GlassCard>
      </div>
    </>
  );
}
