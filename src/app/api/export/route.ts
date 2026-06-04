import { NextRequest, NextResponse } from 'next/server';
import { listItems } from '@/lib/items';
import { toMarkdown, toJson, toPrintableHtml } from '@/lib/export';
import { hasSession } from '@/lib/session';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await hasSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  const fmt = sp.get('format') ?? 'md';
  const items = await listItems({ collection: sp.get('collection') ?? undefined, limit: 200 });
  if (fmt === 'json') return new NextResponse(toJson(items), { headers: { 'content-type': 'application/json', 'content-disposition': 'attachment; filename="nanote-library.json"' } });
  if (fmt === 'pdf') return new NextResponse(toPrintableHtml(items), { headers: { 'content-type': 'text/html; charset=utf-8' } });
  return new NextResponse(toMarkdown(items), { headers: { 'content-type': 'text/markdown; charset=utf-8', 'content-disposition': 'attachment; filename="nanote-library.md"' } });
}
