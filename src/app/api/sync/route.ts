import { NextRequest, NextResponse } from 'next/server';
import { runSync } from '@/lib/sync';
import { hasSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

function authorized(req: NextRequest, secret: string | undefined): boolean {
  if (!secret) return false;
  const h = req.headers.get('authorization');
  return h === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  const ok = authorized(req, process.env.SYNC_SECRET) || (await hasSession());
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  const log = await runSync();
  return NextResponse.json({ ok: log.status === 'ok', log });
}

// Vercel Cron calls GET with the CRON_SECRET bearer.
export async function GET(req: NextRequest) {
  if (!authorized(req, process.env.CRON_SECRET)) return NextResponse.json({ ok: false }, { status: 401 });
  const log = await runSync();
  return NextResponse.json({ ok: log.status === 'ok', log });
}
