import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.POSTGRES_URL;
if (!url) { console.error('POSTGRES_URL not set'); process.exit(1); }
const sql = neon(url);
const ddl = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

const statements = ddl.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
for (const stmt of statements) { await sql(stmt); }
console.log(`applied ${statements.length} statements`);
