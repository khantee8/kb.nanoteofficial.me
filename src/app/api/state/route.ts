import { NextRequest, NextResponse } from 'next/server';
import { setState } from '@/lib/state';
import { hasSession } from '@/lib/session';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  if (!(await hasSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const { itemId, field, value } = await req.json();
  if (!['pinned','archived','saved','read'].includes(field)) return NextResponse.json({ ok: false }, { status: 400 });
  const state = await setState(itemId, field, !!value);
  return NextResponse.json({ ok: true, state });
}
