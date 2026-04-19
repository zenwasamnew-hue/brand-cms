/**
 * 后台主布局（Server Component）
 * 功能：
 *   - 左侧 72px 固定侧栏：引用 <AdminSidebar /> 客户端组件
 *   - 右侧主内容区：overflow-y: auto，高度 100vh
 * 特别说明：
 *   登录页面（/admin/login）时 Supabase 返回 user=null，
 *   此时布局直接透传 children，不渲染侧栏，保持登录页样式不变。
 */
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './_components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未登录时透传子内容（登录页不渲染侧栏）
  if (!user) {
    return <>{children}</>;
  }

  // 获取用户档案，用于侧栏底部头像显示
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

  // 获取未读留言数，用于侧栏 Messages 红点
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', overflow: 'hidden' }}>

      {/* ── 左侧 72px 图标侧栏 ── */}
      <AdminSidebar
        displayName={displayName}
        unreadMessages={unreadMessages ?? 0}
      />

      {/* ── 右侧主内容区 ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          height: '100vh',
          background:
            'radial-gradient(at 10% 20%,rgba(10,132,255,0.06),transparent 40%),' +
            'radial-gradient(at 90% 80%,rgba(94,92,230,0.06),transparent 40%),' +
            '#000',
        }}
      >
        {children}
      </main>
    </div>
  );
}
