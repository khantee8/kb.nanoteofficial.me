import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'kb_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_S = Math.floor(SESSION_TTL_MS / 1000);

function secret(): string | null { return process.env.KB_ADMIN_PASSWORD ?? null; }
function user(): string | null { return process.env.KB_ADMIN_USER ?? null; }

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
export function checkCredentials(u: string, p: string): boolean {
  const uu = user(), pp = secret();
  if (!uu || !pp) return false;
  const okUser = safeEqual(u, uu), okPass = safeEqual(p, pp);
  return okUser && okPass;
}
function sign(exp: number, s: string): string {
  return createHmac('sha256', s).update(String(exp)).digest('hex');
}
export function createSessionToken(now = Date.now()): string | null {
  const s = secret(); if (!s) return null;
  const exp = now + SESSION_TTL_MS;
  return `${exp}.${sign(exp, s)}`;
}
export function verifySession(token: string | undefined | null, now = Date.now()): boolean {
  if (!token) return false;
  const s = secret(); if (!s) return false;
  const dot = token.indexOf('.'); if (dot <= 0) return false;
  const exp = Number(token.slice(0, dot));
  if (!Number.isFinite(exp) || exp < now) return false;
  return safeEqual(token.slice(dot + 1), sign(exp, s));
}
