/**
 * AdminSidebar — 72px 窄图标侧边栏（客户端组件）
 * 设计参考：admin-dashboard_Version2.html
 *
 * 功能：
 *   - 72px 固定宽度，flex 列布局，居中对齐
 *   - 顶部品牌 Logo：40×40，圆角 11px，渐变背景，字母 "B"
 *   - 导航项：44×44，圆角 11px，19×19 SVG 图标，hover 显示右侧 tooltip
 *   - Messages 项支持右上角红点 badge
 *   - 激活状态：渐变背景 + 白色图标 + 阴影
 *   - 底部 user-mini：36px 圆形头像
 *   - 底部退出登录按钮
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/* ──────────────────────────────────────────────
   SVG 图标集（19 × 19，与原型一致）
────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="11.5" y="1.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="1.5" y="11.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" fill="currentColor" />
  </svg>
);

const ModulesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M9.5 1.5L17 5.75V13.25L9.5 17.5L2 13.25V5.75L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9.5 1.5V9.5M17 5.75L9.5 9.5M2 5.75L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const EditorIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M13.5 2.5L16.5 5.5L6.5 15.5L2.5 16.5L3.5 12.5L13.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11.5 4.5L14.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const I18nIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <circle cx="9.5" cy="9.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.5 2C9.5 2 7 5.5 7 9.5C7 13.5 9.5 17 9.5 17" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.5 2C9.5 2 12 5.5 12 9.5C12 13.5 9.5 17 9.5 17" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 9.5H17" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ThemeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <circle cx="9.5" cy="9.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.5 2V9.5L14.8 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9.5" cy="9.5" r="2.5" fill="currentColor" />
  </svg>
);

const MessagesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M2 3.5C2 2.67 2.67 2 3.5 2H15.5C16.33 2 17 2.67 17 3.5V12.5C17 13.33 16.33 14 15.5 14H6L2 17V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 7H13M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FilesIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M2 4.5C2 3.67 2.67 3 3.5 3H7.5L9.5 5.5H15.5C16.33 5.5 17 6.17 17 7V15C17 15.83 16.33 16.5 15.5 16.5H3.5C2.67 16.5 2 15.83 2 15V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <circle cx="9.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.5 2V4M9.5 15V17M2 9.5H4M15 9.5H17M3.93 3.93L5.34 5.34M13.66 13.66L15.07 15.07M15.07 3.93L13.66 5.34M5.34 13.66L3.93 15.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10.5 11L14 8L10.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ──────────────────────────────────────────────
   导航菜单配置（与原型完全一致）
────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key: 'dashboard', href: '/admin',          Icon: DashboardIcon, tip: 'Dashboard'  },
  { key: 'modules',   href: '/admin/modules',  Icon: ModulesIcon,   tip: 'Modules'    },
  { key: 'editor',    href: '/admin/editor',   Icon: EditorIcon,    tip: 'Editor'     },
  { key: 'i18n',      href: '/admin/i18n',     Icon: I18nIcon,      tip: 'i18n'       },
  { key: 'theme',     href: '/admin/theme',    Icon: ThemeIcon,     tip: 'Theme'      },
  { key: 'messages',  href: '/admin/messages', Icon: MessagesIcon,  tip: 'Messages'   },
  { key: 'files',     href: '/admin/files',    Icon: FilesIcon,     tip: 'Files'      },
  { key: 'settings',  href: '/admin/settings', Icon: SettingsIcon,  tip: 'Settings'   },
];

/* ──────────────────────────────────────────────
   Props 类型
────────────────────────────────────────────── */
interface AdminSidebarProps {
  displayName: string;
  unreadMessages?: number;
}

/* ──────────────────────────────────────────────
   路由激活判断
────────────────────────────────────────────── */
function isActive(href: string, pathname: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

/* ──────────────────────────────────────────────
   主组件
────────────────────────────────────────────── */
export default function AdminSidebar({ displayName, unreadMessages = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : 'A';

  async function handleLogout() {
    if (!confirm('确定退出登录吗？')) return;
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      {/* ── 全局 tooltip 样式 ── */}
      <style>{`
        .sidebar-nav-item { position: relative; }
        .sidebar-nav-item::after {
          content: attr(data-tip);
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          background: #1c1c20;
          border: 1px solid rgba(255,255,255,0.10);
          color: #F5F5F7;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease;
          z-index: 9999;
        }
        .sidebar-nav-item:hover::after { opacity: 1; }
        .sidebar-nav-item.active::after { opacity: 0; }
      `}</style>

      <aside
        style={{
          width: '72px',
          height: '100vh',
          background: 'rgba(28,28,32,0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 10px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 100,
        }}
      >
        {/* ── 品牌 Logo ── */}
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
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15),0 4px 12px rgba(10,132,255,0.35)',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          B
        </Link>

        {/* ── 导航菜单 ── */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, alignItems: 'center' }}>
          {NAV_ITEMS.map(({ key, href, Icon, tip }) => {
            const active = isActive(href, pathname);
            return (
              <div
                key={key}
                className={`sidebar-nav-item${active ? ' active' : ''}`}
                data-tip={tip}
                style={{ position: 'relative' }}
              >
                <Link
                  href={href}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    background: active
                      ? 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)'
                      : 'transparent',
                    boxShadow: active
                      ? '0 4px 12px rgba(10,132,255,0.40),inset 0 1px 0 rgba(255,255,255,0.15)'
                      : 'none',
                    transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)';
                    }
                  }}
                >
                  <Icon />
                </Link>

                {/* Messages badge */}
                {key === 'messages' && unreadMessages > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#FF453A',
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      boxShadow: '0 0 6px rgba(255,69,58,0.6)',
                    }}
                  >
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── 底部：头像 + 退出 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          {/* user-mini 头像 */}
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
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
              flexShrink: 0,
              cursor: 'default',
            }}
          >
            {avatarLetter}
          </div>

          {/* 退出登录 */}
          <button
            onClick={handleLogout}
            title="退出登录"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,69,58,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = '#FF453A';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)';
            }}
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  );
}
