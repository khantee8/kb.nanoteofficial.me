import { NextRequest, NextResponse } from 'next/server';
import { listTags, renameTag } from '@/lib/tags';
import { hasSession } from '@/lib/session';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await hasSession())) return NextResponse.json({ tags: [] }, { status: 401 });
  return NextResponse.json({ tags: await listTags() });
}
export async function PATCH(req: NextRequest) {
  if (!(await hasSession())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id, label } = await req.json(); await renameTag(id, label);
  return NextResponse.json({ ok: true });
}
