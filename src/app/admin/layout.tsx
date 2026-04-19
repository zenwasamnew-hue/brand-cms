import { createClient } from '@/lib/supabase/server';
import AppProviders from './_components/AppProviders';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';

// Force dynamic rendering – this layout calls Supabase on every request
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let displayName = '管理员';

  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, role')
        .eq('id', user.id)
        .single();

      if (profile?.display_name) {
        displayName = profile.display_name;
      } else if (user.email) {
        displayName = user.email.split('@')[0];
      }
    }
  } catch (err) {
    // Only swallow the expected "Supabase not configured" error; re-throw others
    if (!(err instanceof Error && err.message === 'Supabase not configured')) {
      console.error('AdminLayout: unexpected Supabase error', err);
    }
  }

  // Show admin shell if authenticated OR if Supabase is not configured (demo mode)
  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const isAuthenticated = !!user || !supabaseConfigured;

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <AppProviders>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          background: 'var(--bg-base)',
          overflow: 'hidden',
        }}
      >
        <Sidebar avatarLetter={avatarLetter} displayName={displayName} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </AppProviders>
  );
}
