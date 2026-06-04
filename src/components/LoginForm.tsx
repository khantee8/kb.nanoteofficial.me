'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user, password }),
    });
    setBusy(false);
    if (res.ok) router.push('/dashboard');
    else setError('Invalid username or password');
  }
  return (
    <form onSubmit={submit} className="glass" style={{ padding: 28, width: 340, display: 'grid', gap: 12 }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>NaNote Library</h1>
      <input placeholder="Username" value={user} onChange={e => setUser(e.target.value)} autoFocus />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p style={{ color: '#ff8080', margin: 0, fontSize: 13 }}>{error}</p>}
      <button disabled={busy} type="submit">{busy ? '…' : 'Sign in'}</button>
    </form>
  );
}
