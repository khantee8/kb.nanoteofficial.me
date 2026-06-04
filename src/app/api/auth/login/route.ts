import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_S } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { user, password } = await req.json().catch(() => ({ user: '', password: '' }));
  if (!checkCredentials(String(user ?? ''), String(password ?? ''))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const token = createSessionToken();
  if (!token) return NextResponse.json({ ok: false }, { status: 500 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE_S,
  });
  return res;
}
