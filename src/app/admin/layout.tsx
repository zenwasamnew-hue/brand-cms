import { createClient } from '@/lib/supabase/server';
import AppProviders from './_components/AppProviders';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  let displayName = '管理员';
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
