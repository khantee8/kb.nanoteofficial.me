export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh',
      background: 'radial-gradient(130% 120% at 0% 0%, #1e1b4b, #0b1020 55%)' }}>
      {children}
    </div>
  );
}
