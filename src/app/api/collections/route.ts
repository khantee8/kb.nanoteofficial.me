import { NextRequest, NextResponse } from 'next/server';
import { listCollections, createCollection, addToCollection, removeFromCollection, deleteCollection } from '@/lib/collections';
import { hasSession } from '@/lib/session';
export const dynamic = 'force-dynamic';
async function gate() { return hasSession(); }

export async function GET() {
  if (!(await gate())) return NextResponse.json({ collections: [] }, { status: 401 });
  return NextResponse.json({ collections: await listCollections() });
}
export async function POST(req: NextRequest) {
  if (!(await gate())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json();
  if (b.action === 'add') { await addToCollection(b.collectionId, b.itemId); return NextResponse.json({ ok: true }); }
  if (b.action === 'remove') { await removeFromCollection(b.collectionId, b.itemId); return NextResponse.json({ ok: true }); }
  const c = await createCollection(b.name, b.color, b.icon, b.description);
  return NextResponse.json({ collection: c });
}
export async function DELETE(req: NextRequest) {
  if (!(await gate())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = req.nextUrl.searchParams.get('id'); if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await deleteCollection(id); return NextResponse.json({ ok: true });
}
