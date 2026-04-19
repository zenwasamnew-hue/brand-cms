import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from './_components/AdminSidebar';
import ThemeInitializer from './_components/ThemeInitializer';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const isAuth = cookieStore.get('admin-auth')?.value === 'true';

  if (!isAuth) {
    redirect('/login');
  }

  return (
    <>
      <ThemeInitializer />
      <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
        <AdminSidebar displayName="Admin" unreadMessages={3} />
        <main style={{ flex: 1, overflowY: 'auto', height: '100vh' }}>
          {children}
        </main>
      </div>
    </>
  );
}

