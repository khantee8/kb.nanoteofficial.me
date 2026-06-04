# kb.nanoteofficial.me — NaNote Library

A login-gated **knowledge base + executive dashboard** over the AI company's daily briefs.
It pulls published briefs from `company.nanoteofficial.me/api/kb`, caches them in Neon Postgres,
and presents a glass dashboard, a filterable library, a Notion-style reader, collections, tags,
archive, full-text + ⌘K search, and Markdown/JSON/PDF export.

**Live:** https://kb.nanoteofficial.me · **Version:** 0.1.0

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4
- Neon Postgres (`@neondatabase/serverless`) — free tier
- Vitest (pure-logic unit tests)
- Vercel Hobby (auto-deploy from `main`), one daily Vercel Cron

## How it works (pull → cache → read)

```
company.nanoteofficial.me/api/kb   (published briefs, our own service)
        │  GET ?limit=200   (daily cron + manual Sync button)
        ▼
   runSync()  →  upsert into Neon `item` rows (kind='company_brief')
        ▼
   UI reads Postgres only — never the company API per request
```

There are **no LLM/Anthropic calls** anywhere — all intelligence already happened upstream in the
company agents; the Library only *displays* their output.

## Unified `item` model

Company briefs and (future v0.2) personal notes are both **`item`** rows with a `kind`
discriminator (`'company_brief' | 'note'`), so collections, tags, search, state, and archive work
for both from day one. See `db/schema.sql` and `src/lib/types.ts`.

## Local development

```bash
npm install
cp .env.example .env.local      # fill in the values below
npm run dev                     # http://localhost:3000

npm run test                    # vitest (pure logic: auth, sync mapper, items where, tags, export)
npx tsc --noEmit
npm run lint
npm run build
```

### Apply the schema to a Neon database

```bash
POSTGRES_URL='postgres://…?sslmode=require' npm run db:migrate
# -> applied N statements   (idempotent: CREATE … IF NOT EXISTS + search trigger)
```

## Environment variables

| Var | Purpose |
|---|---|
| `KB_ADMIN_USER` | Login username |
| `KB_ADMIN_PASSWORD` | Login password **and** the HMAC session-cookie secret (fails closed if unset) |
| `COMPANY_KB_URL` | Source feed (default `https://company.nanoteofficial.me/api/kb`) |
| `POSTGRES_URL` | Neon connection string |
| `SYNC_SECRET` | Bearer for manual `POST /api/sync` (the in-app button uses the session instead) |
| `CRON_SECRET` | Bearer Vercel Cron sends to `GET /api/sync` |

## Cost — $0 (free-tier guarantee)

| Item | Plan | Cost |
|---|---|---|
| Hosting / functions | Vercel Hobby | $0 |
| Cron | 1 daily (Hobby max; sub-daily needs Pro) | $0 |
| Database | Neon free tier (~0.5 GB; our data is a few MB) | $0 |
| Domain | `kb` CNAME on `nanoteofficial.me` | $0 |
| AI / LLM | **None** — zero token spend | $0 |

Guardrails: no LLM at runtime, no sub-daily cron, cache-and-read (UI hits Postgres not the company
API), bounded `limit=200` upsert-only sync. Any future recurring cost is a separate, explicit decision.

## Routes

- `/` landing · `/login`
- `/dashboard` exec overview (KPIs, recent, by-category donut)
- `/library` browse + filters · `/library/[id]` reader
- `/collections` + `/collections/[slug]` · `/tags` + `/tags/[slug]` · `/archive`
- `/import` sync + export
- API: `/api/auth/{login,logout}`, `/api/sync`, `/api/items[/:id]`, `/api/collections`, `/api/state`, `/api/tags`, `/api/export`
