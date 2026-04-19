/**
 * 后台主布局（Server Component）
 * 功能：
 *   - 左侧 72px 固定侧栏：品牌 Logo + 8 个导航图标（含 tooltip）+ 用户头像 + 退出按钮
 *   - 右侧主内容区：overflow-y: auto，高度 100vh
 * 设计风格：玻璃拟态深色主题（参考 globals.css 与 tailwind.config.ts）
 * 特别说明：
 *   登录页面（/admin/login）时 Supabase 返回 user=null，
 *   此时布局直接透传 children，不渲染侧栏，保持登录页的居中卡片样式不变。
 */
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './_components/LogoutButton';

// 后台导航菜单配置（顺序与设计稿一致）
const navItems = [
  { href: '/admin',          icon: '📊', label: '仪表盘'  },
  { href: '/admin/modules',  icon: '🧩', label: '模块管理' },
  { href: '/admin/editor',   icon: '✏️', label: '内容编辑' },
  { href: '/admin/i18n',     icon: '🌐', label: '多语言'  },
  { href: '/admin/theme',    icon: '🎨', label: '主题'    },
  { href: '/admin/messages', icon: '💬', label: '留言管理' },
  { href: '/admin/files',    icon: '📁', label: '文件管理' },
  { href: '/admin/settings', icon: '⚙️', label: '系统设置' },
];

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
    // 优先使用 profiles 表中的显示名称
    displayName = profile.display_name;
  } else if (user.email) {
    // 回退：使用邮箱前缀作为显示名称
    displayName = user.email.split('@')[0];
  }

  // 取显示名称的第一个字符（大写）作为头像字母
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', overflow: 'hidden' }}>

      {/* ==================== 左侧固定侧栏（72px 宽）==================== */}
      <aside
        style={{
          width: '72px',
          height: '100vh',
          // 玻璃拟态背景：半透明深色 + 模糊效果
          background: 'rgba(28,28,32,0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          flexShrink: 0,
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* ---- 品牌 Logo：40×40，圆角 11px，渐变背景，白色字母 "B" ---- */}
        <Link
          href="/admin"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 800,
            textDecoration: 'none',
            // 内阴影增加玻璃质感，外阴影给蓝色光晕
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15),0 4px 12px rgba(10,132,255,0.35)',
            marginBottom: '24px',
            flexShrink: 0,
          }}
        >
          B
        </Link>

        {/* ---- 导航图标列表：8 个 44×44 的图标按钮，悬浮时右侧弹出 tooltip ---- */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => (
            // group 类：配合 group-hover 实现纯 CSS tooltip 显示/隐藏
            <div key={item.href} className="group" style={{ position: 'relative' }}>
              <Link
                href={item.href}
                // hover:bg-white/[0.08]：悬浮时轻微高亮背景
                className="hover:bg-white/[0.08] transition-colors duration-200"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none',
                }}
              >
                {item.icon}
              </Link>

              {/* Tooltip：默认透明，悬浮父容器时淡入显示（group-hover:opacity-100） */}
              <span
                className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#1c1c20] px-3 py-1.5 text-xs font-medium text-[#F5F5F7] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                style={{ zIndex: 999 }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        {/* ---- 侧栏底部：用户头像 + 退出登录按钮 ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {/* 用户头像：36×36 圆形，渐变背景，显示名字首字母 */}
          <div
            title={displayName}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#5E5CE6 0%,#0A84FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
              flexShrink: 0,
            }}
          >
            {avatarLetter}
          </div>

          {/* 退出登录客户端组件：点击弹窗确认后调用 signOut */}
          <LogoutButton />
        </div>
      </aside>

      {/* ==================== 主内容区 ==================== */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          height: '100vh',
          // 微妙的辐射渐变背景，增加视觉层次感
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
