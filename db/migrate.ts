import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) { console.error('POSTGRES_URL (or DATABASE_URL) not set'); process.exit(1); }
const sql = neon(url);
const ddl = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

// Split on semicolons, but not those inside $$-dollar-quoted bodies (the search
// trigger function) or inside -- line comments (one comment contains a ';').
function splitStatements(src: string): string[] {
  const out: string[] = [];
  let buf = '';
  let inDollar = false;
  let i = 0;
  while (i < src.length) {
    if (!inDollar && src[i] === '-' && src[i + 1] === '-') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? src.length : nl;
      buf += src.slice(i, end);
      i = end;
      continue;
    }
    if (src[i] === '$' && src[i + 1] === '$') { inDollar = !inDollar; buf += '$$'; i += 2; continue; }
    if (src[i] === ';' && !inDollar) { if (buf.trim()) out.push(buf.trim()); buf = ''; i++; continue; }
    buf += src[i]; i++;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

const statements = splitStatements(ddl);
for (const stmt of statements) { await sql(stmt); }
console.log(`applied ${statements.length} statements`);
