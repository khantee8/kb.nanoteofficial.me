import { notFound } from 'next/navigation';
import { requireSession } from '@/lib/session';
import { AppChrome } from '@/components/AppChrome';
import { BriefReader } from '@/components/BriefReader';
import { getItem } from '@/lib/items';

export const dynamic = 'force-dynamic';

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;
  const it = await getItem(id);
  if (!it) notFound();
  return <><AppChrome /><BriefReader it={it} /></>;
}
