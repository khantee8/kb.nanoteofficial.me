import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/session';
import { NavBar } from '@/components/NavBar';
import { BriefReader } from '@/components/BriefReader';
import { getItem } from '@/lib/items';

export const dynamic = 'force-dynamic';

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const it = await getItem(id);
  if (!it) notFound();
  return <><NavBar /><BriefReader it={it} /></>;
}
