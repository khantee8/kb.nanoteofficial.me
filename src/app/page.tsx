import Link from 'next/link';
import { hasSession } from '@/lib/session';

export default async function Landing() {
  const authed = await hasSession();
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
      <div style={{ maxWidth: 640 }}>
        <div style={{ letterSpacing: 2, color: 'var(--violet)', fontSize: 12 }}>NANOTE</div>
        <h1 style={{ fontSize: 'clamp(2rem,6vw,3.4rem)', margin: '.4rem 0' }}>The NaNote Library</h1>
        <p style={{ color: '#cbd5ff', fontSize: 18, lineHeight: 1.6 }}>
          One knowledge base for your AI company&apos;s daily briefs — market intel, threats, research,
          content, and ops — with an executive dashboard up front.
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link className="glass" style={{ padding: '10px 22px', textDecoration: 'none', color: '#fff' }}
            href={authed ? '/dashboard' : '/login'}>{authed ? 'Open dashboard →' : 'Sign in →'}</Link>
        </div>
      </div>
    </main>
  );
}
