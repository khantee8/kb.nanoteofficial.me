# CLAUDE.md — kb.nanoteofficial.me (NaNote Library)

Guidance for Claude Code when working in this repo. See `README.md` for the user-facing overview.

## What this is

A login-gated reader + executive dashboard over the company KB. It **pulls** published briefs from
`company.nanoteofficial.me/api/kb`, **caches** them in Neon Postgres, and the UI **reads Postgres
only**. Architected so v0.2 personal notes/Obsidian drop into the same `item` table.

**Hard constraints (do not break):**
- **No LLM / Anthropic calls** anywhere. The Library only displays upstream output. No `ANTHROPIC_API_KEY`.
- **No `dangerouslySetInnerHTML`.** Use the safe `src/components/Markdown.tsx` (ported, self-contained).
- **$0 cost.** Vercel Hobby + Neon free tier + 1 daily cron (sub-daily needs Pro). Keep it that way.
- Each project under `/project/src/` is its own `khantee8/` git repo — commit here, not from `/project`.

## Commands

```bash
npm run dev        # http://localhost:3000
npm run build
npm run lint       # eslint flat config (eslint.config.mjs)
npm test           # vitest — pure logic only (no DB)
npx tsc --noEmit
POSTGRES_URL=… npm run db:migrate   # apply db/schema.sql (idempotent)
```

## Architecture

- **Domain types** (`src/lib/`): `kbEntry.ts` (the company `/api/kb` contract), `artifacts.ts`
  (chart `Artifact` union + `normalizeTags`, ported from company), `types.ts` (`Item`, `ItemState`,
  `Collection`, `Tag`, `SyncLog`, `EMPTY_STATE`), `format.ts` (dept/category labels + colors).
- **Data layer** (`src/lib/`): `db.ts` (neon client; `getSql()` throws at call time, not import, so
  builds don't need a DB), `sync.ts` (`mapEntryToItem` pure + `runSync`), `items.ts`
  (`buildItemsWhere` pure + `listItems`/`getItem`), `collections.ts`, `state.ts`, `tags.ts`,
  `dashboard.ts`, `syncLog.ts`, `export.ts`.
- **Auth**: `auth.ts` (HMAC session cookie `kb_session`, secret = `KB_ADMIN_PASSWORD`, 12h TTL, fails
  closed) + `session.ts` (`hasSession`/`requireSession` via `cookies()`). No middleware — server pages
  gate with `requireSession()`, API routes re-check `hasSession()`.
- **API** (`src/app/api/`): `auth/{login,logout}`, `sync` (POST=SYNC_SECRET|session, GET=CRON_SECRET),
  `items[/:id]`, `collections`, `state`, `tags`, `export`. All gated.
- **UI** (`src/app/`, `src/components/`): glass design system (`AppBackground`, `GlassCard`,
  `KpiTile`, `NavBar`, `AppChrome` = NavBar + ⌘K `CommandSearch`), ported zero-dep SVG `charts/*` +
  `ArtifactRenderer`, Notion-style `BriefReader` + `StateActions`, `FilterBar`, `ItemCard`, `SyncPanel`.

## DB / neon gotchas

- `@neondatabase/serverless` v0.10.x has **no `sql.query()` method**. For raw (non-template) SQL use
  the call form `sql(text, params)`. Tagged-template `` sql`…` `` is fine for static-shape queries.
- Rows come back as `Record<string, any>`; the `no-explicit-any` lint rule is scoped **off** for the
  DB-access lib files in `eslint.config.mjs` (and only those).
- `item.search` (tsvector) is maintained by a `BEFORE INSERT OR UPDATE` trigger (`db/schema.sql`).
  Sync never deletes — archive instead. `item_state` rows are created lazily on first pin/save/archive.

## Sync model

`runSync()` writes a `sync_log` row, fetches `COMPANY_KB_URL?limit=200`, upserts each `KbEntry` →
`item` (`ON CONFLICT (external_id) DO UPDATE`), seeds `tag`/`item_tag` (`source='company'`), then
finalizes the log. Daily Vercel Cron (`vercel.json`, `0 16 * * *`) hits `GET /api/sync`; the
`/import` page has a manual Sync button (session-gated).

## Env vars

`KB_ADMIN_USER`, `KB_ADMIN_PASSWORD`, `COMPANY_KB_URL`, `POSTGRES_URL`, `SYNC_SECRET`, `CRON_SECRET`.
See `.env.example`.
