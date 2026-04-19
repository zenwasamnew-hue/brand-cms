'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    if (!confirm('确定退出登录吗？')) return;

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured – just redirect
    }

    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      title="退出登录"
      className="flex items-center justify-center rounded-[10px] border-none bg-transparent text-lg transition-colors duration-200 hover:bg-[rgba(255,69,58,0.15)]"
      style={{ width: '36px', height: '36px', cursor: 'pointer', flexShrink: 0 }}
    >
      🚪
    </button>
  );
}
