import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySession } from './auth';

/** True if the request carries a valid session cookie. */
export async function hasSession(): Promise<boolean> {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}
/** For gated pages: redirect to /login when unauthenticated. */
export async function requireSession(): Promise<void> {
  if (!(await hasSession())) redirect('/login');
}
