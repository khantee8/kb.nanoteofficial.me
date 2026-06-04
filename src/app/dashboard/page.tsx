import { requireSession } from '@/lib/session';
import { NavBar } from '@/components/NavBar';
import { ExecOverview } from '@/components/ExecOverview';
import { getDashboard } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await requireSession();
  const d = await getDashboard();
  return <><NavBar /><ExecOverview d={d} /></>;
}
