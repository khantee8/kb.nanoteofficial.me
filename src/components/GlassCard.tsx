export function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass" style={{ padding: 16, ...style }}>{children}</div>;
}
