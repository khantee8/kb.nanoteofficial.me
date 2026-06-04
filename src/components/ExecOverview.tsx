import Link from 'next/link';
import { GlassCard } from './GlassCard';
import { KpiTile } from './KpiTile';
import { Donut } from './charts/Donut';
import { deptColor, deptLabel, categoryLabel } from '@/lib/format';
import type { DashboardData } from '@/lib/dashboard';

export function ExecOverview({ d }: { d: DashboardData }) {
  return (
    <div style={{ padding: '16px 18px', display: 'grid', gap: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--violet)' }}>EXECUTIVE OVERVIEW</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        <KpiTile label="Total briefs" value={d.total} />
        <KpiTile label="This week" value={`+${d.thisWeek}`} color="var(--mint)" />
        <KpiTile label="Open flags" value={d.openFlags} color="var(--amber)" />
        <KpiTile label="Pinned" value={d.pinned} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <GlassCard>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>Recent briefs</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {d.recent.map(it => (
              <Link key={it.id} href={`/library/${it.id}`} style={{ display: 'flex', gap: 8, alignItems: 'center', textDecoration: 'none', color: 'var(--ink)', fontSize: 13 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9, background: deptColor(it.dept) }} />
                <span>{deptLabel(it.dept)} · {categoryLabel(it.category)} — {it.highlight || it.summary.slice(0, 60)}</span>
                <span style={{ marginLeft: 'auto', color: '#889', fontSize: 11 }}>{it.sourceDate}</span>
              </Link>
            ))}
            {d.recent.length === 0 && <p style={{ color: '#889' }}>No briefs yet — run a sync from Import/Export.</p>}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>By category</h3>
          <Donut a={{ kind: 'donut', title: '', series: d.byCategory.map(c => ({ label: categoryLabel(c.label), value: c.value })) }} />
        </GlassCard>
      </div>
    </div>
  );
}
