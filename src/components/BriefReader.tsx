import { Markdown } from './Markdown';
import { ArtifactRenderer } from './charts/ArtifactRenderer';
import { StateActions } from './StateActions';
import { GlassCard } from './GlassCard';
import { deptLabel, categoryLabel, deptColor } from '@/lib/format';
import type { Item } from '@/lib/types';
import { EMPTY_STATE } from '@/lib/types';

export function BriefReader({ it }: { it: Item }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 20, padding: '18px 22px', maxWidth: 1100, margin: '0 auto' }}>
      <article>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#aab', fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: 9, background: deptColor(it.dept) }} />
          {deptLabel(it.dept)} · {categoryLabel(it.category)} · {it.sourceDate}
        </div>
        <h1 style={{ fontSize: 26, margin: '8px 0' }}>{it.highlight || it.summary.slice(0, 80)}</h1>
        <p style={{ color: '#cbd5ff', fontSize: 16 }}>{it.summary}</p>
        {it.artifacts.length > 0 && (
          <div style={{ display: 'grid', gap: 14, margin: '18px 0' }}>
            {it.artifacts.map((a, i) => <GlassCard key={i}><ArtifactRenderer artifact={a} /></GlassCard>)}
          </div>
        )}
        <div style={{ marginTop: 18 }}><Markdown text={it.bodyMd} /></div>
      </article>
      <aside style={{ position: 'sticky', top: 70, alignSelf: 'start', display: 'grid', gap: 12 }}>
        <GlassCard><StateActions itemId={it.id} initial={it.state ?? EMPTY_STATE} /></GlassCard>
        {it.flags.length > 0 && <GlassCard><h4 style={{ margin: '0 0 6px' }}>Flags</h4>{it.flags.map((f, i) => <div key={i} style={{ fontSize: 13, color: 'var(--amber)' }}>⚑ {f}</div>)}</GlassCard>}
        {(it.tags ?? []).length > 0 && <GlassCard><h4 style={{ margin: '0 0 6px' }}>Tags</h4><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{it.tags!.map(t => <span key={t} style={{ fontSize: 12, color: '#a9b' }}>#{t}</span>)}</div></GlassCard>}
      </aside>
    </div>
  );
}
