/**
 * 后台主布局（Server Component）
 * 功能：
 *   - 左侧 72px 固定侧栏（AdminSidebar 客户端组件，含 SVG 图标 + tooltip + 主题感知）
 *   - 右侧主内容区：overflow-y: auto，高度 100vh
 * 设计风格：6 套主题 CSS 变量系统 + 玻璃拟态
 * 特别说明：
 *   登录页面（/admin/login）时 Supabase 返回 user=null，
 *   此时布局直接透传 children，不渲染侧栏，保持登录页样式不变。
 */
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './_components/AdminSidebar';
import LogoutButton from './_components/LogoutButton';
import ThemeInitializer from './_components/ThemeInitializer';
import ThemeSwitcher from './_components/ThemeSwitcher';
import LanguageSwitcher from './_components/LanguageSwitcher';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 从 Supabase 获取当前登录用户信息
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * 未登录时直接透传子内容，不渲染侧栏。
   * 结合中间件逻辑：未登录用户访问 /admin/* 会被重定向到 /admin/login，
   * 因此此处 user === null 等价于当前渲染的是登录页。
   */
  if (!user) {
    return (
      <>
        <ThemeInitializer />
        {children}
      </>
    );
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

  // 查询未读留言数，用于侧栏徽章
  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg, #000)',
      }}
    >
      <ThemeInitializer />

      {/* ==================== 左侧固定侧栏（72px 宽）==================== */}
      <AdminSidebar
        displayName={displayName}
        unreadMessages={unreadMessages ?? 0}
      />

      {/* ==================== 主内容区 ==================== */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 顶部工具栏：主题切换 + 语言切换 + 退出登录（右对齐） */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px 16px',
            gap: '8px',
            borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))',
            background: 'var(--sidebar-bg, rgba(18,18,22,0.7))',
            backdropFilter: 'blur(20px)',
            flexShrink: 0,
          }}
        >
          <LanguageSwitcher />
          <ThemeSwitcher />
          <LogoutButton />
        </div>

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--bg-secondary, #0a0a0f)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
