export function KpiTile({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="glass" style={{ padding: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: 1, color: '#aab' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color ?? 'var(--ink)' }}>{value}</div>
    </div>
  );
}
