'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  ['/dashboard', 'Dashboard'], ['/library', 'Library'],
  ['/collections', 'Collections'], ['/tags', 'Tags'], ['/archive', 'Archive'],
] as const;

export function NavBar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const path = usePathname(); const router = useRouter();
  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); }
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px',
      borderBottom: '1px solid var(--glass-line)', position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(8px)', background: 'rgba(11,16,32,.6)' }}>
      <Link href="/dashboard" style={{ fontWeight: 800, color: 'var(--violet)', textDecoration: 'none' }}>◆ NaNote Library</Link>
      <div style={{ display: 'flex', gap: 13 }}>
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} style={{ textDecoration: 'none',
            color: path.startsWith(href) ? '#fff' : '#cbd5ff',
            borderBottom: path.startsWith(href) ? '2px solid var(--violet)' : '2px solid transparent', paddingBottom: 3 }}>{label}</Link>
        ))}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onOpenSearch} title="Search (⌘K)" style={{ fontSize: 12 }}>⌕ Search</button>
        <Link href="/import" style={{ color: '#cbd5ff', textDecoration: 'none', fontSize: 13 }}>Import/Export</Link>
        <button onClick={logout} style={{ fontSize: 12 }}>Sign out</button>
      </div>
    </nav>
  );
}
