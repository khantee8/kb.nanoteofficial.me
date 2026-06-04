import { NextRequest, NextResponse } from 'next/server';
import { listItems, type ItemsQuery } from '@/lib/items';
import { hasSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!(await hasSession())) return NextResponse.json({ items: [] }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  const opt: ItemsQuery = {
    dept: sp.get('dept') ?? undefined, category: sp.get('category') ?? undefined,
    tag: sp.get('tag') ?? undefined, collection: sp.get('collection') ?? undefined,
    q: sp.get('q') ?? undefined,
    archived: sp.get('archived') === 'true', pinned: sp.get('pinned') === 'true',
    saved: sp.get('saved') === 'true',
    sort: (sp.get('sort') as 'recent' | 'oldest') ?? 'recent',
    limit: Number(sp.get('limit')) || undefined,
  };
  const items = await listItems(opt);
  return NextResponse.json({ items, count: items.length });
}
