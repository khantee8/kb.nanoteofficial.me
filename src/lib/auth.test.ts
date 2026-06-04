import { describe, it, expect, beforeEach } from 'vitest';
import { checkCredentials, createSessionToken, verifySession } from './auth';

beforeEach(() => {
  process.env.KB_ADMIN_USER = 'admin';
  process.env.KB_ADMIN_PASSWORD = 'secret';
});

describe('auth', () => {
  it('accepts correct credentials, rejects wrong', () => {
    expect(checkCredentials('admin', 'secret')).toBe(true);
    expect(checkCredentials('admin', 'nope')).toBe(false);
    expect(checkCredentials('root', 'secret')).toBe(false);
  });
  it('mints a token that verifies', () => {
    const now = 1_000_000;
    const tok = createSessionToken(now)!;
    expect(verifySession(tok, now + 1000)).toBe(true);
  });
  it('rejects expired or tampered tokens', () => {
    const now = 1_000_000;
    const tok = createSessionToken(now)!;
    expect(verifySession(tok, now + 13 * 3600 * 1000)).toBe(false); // > 12h
    expect(verifySession(tok.replace(/.$/, '0'), now + 1000)).toBe(false);
    expect(verifySession(undefined, now)).toBe(false);
  });
  it('fails closed when unconfigured', () => {
    delete process.env.KB_ADMIN_PASSWORD;
    expect(createSessionToken()).toBe(null);
    expect(checkCredentials('admin', 'secret')).toBe(false);
  });
});
