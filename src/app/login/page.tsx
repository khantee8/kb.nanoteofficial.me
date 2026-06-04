import { LoginForm } from '@/components/LoginForm';
import { hasSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  if (await hasSession()) redirect('/dashboard');
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><LoginForm /></main>;
}
