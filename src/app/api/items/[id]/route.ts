import { NextRequest, NextResponse } from 'next/server';
import { getItem } from '@/lib/items';
import { hasSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await hasSession())) return NextResponse.json({ item: null }, { status: 401 });
  const { id } = await ctx.params;
  const item = await getItem(id);
  if (!item) return NextResponse.json({ item: null }, { status: 404 });
  return NextResponse.json({ item });
}
