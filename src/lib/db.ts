import { neon } from '@neondatabase/serverless';

// Throws at call time (not import) if unconfigured, so builds don't need the DB.
// Accepts POSTGRES_URL (Vercel Postgres) or DATABASE_URL (Neon integration).
export function getSql() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('POSTGRES_URL (or DATABASE_URL) is not set');
  return neon(url);
}
export type Sql = ReturnType<typeof getSql>;
