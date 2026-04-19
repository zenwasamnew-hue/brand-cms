/**
 * 后台侧边栏（Client Component）
 * 72px 窄版图标侧边栏，包含：
 * - 顶部品牌 Logo
 * - 8 个导航图标（SVG）+ hover tooltip + active 状态渐变
 * - 底部用户头像
 * 参考：admin-dashboard_Version2.html 的 .sidebar 实现
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// i18n 多语言 tooltip 文字
const TIPS: Record<string, Record<string, string>> = {
  dashboard: { zh: '仪表盘', en: 'Dashboard', ja: 'ダッシュボード', ko: '대시보드' },
  modules:   { zh: '模块管理', en: 'Modules', ja: 'モジュール', ko: '모듈' },
  editor:    { zh: '内容编辑', en: 'Editor', ja: 'エディタ', ko: '에디터' },
  i18n:      { zh: '多语言', en: 'i18n', ja: '多言語', ko: '다국어' },
  theme:     { zh: '主题', en: 'Theme', ja: 'テーマ', ko: '테마' },
  messages:  { zh: '留言', en: 'Messages', ja: 'メッセージ', ko: '메시지' },
  files:     { zh: '文件', en: 'Files', ja: 'ファイル', ko: '파일' },
  settings:  { zh: '设置', en: 'Settings', ja: '設定', ko: '설정' },
};

const navItems = [
  {
    href: '/admin',
    tipKey: 'dashboard',
    exact: true,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/admin/modules',
    tipKey: 'modules',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    href: '/admin/editor',
    tipKey: 'editor',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    href: '/admin/i18n',
    tipKey: 'i18n',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    href: '/admin/theme',
    tipKey: 'theme',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    href: '/admin/messages',
    tipKey: 'messages',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/admin/files',
    tipKey: 'files',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/admin/settings',
    tipKey: 'settings',
    exact: false,
    badge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

type Props = {
  displayName: string;
  unreadMessages?: number;
};

export default function AdminSidebar({ displayName, unreadMessages = 0 }: Props) {
  const pathname = usePathname();
  const [lang, setLang] = useState('zh');
  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem('admin-lang') ?? 'zh';
    setLang(saved);

    function handleLangChange(e: Event) {
      setLang((e as CustomEvent<string>).detail);
    }
    window.addEventListener('admin-lang-change', handleLangChange);
    return () => window.removeEventListener('admin-lang-change', handleLangChange);
  }, []);

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function getTip(tipKey: string): string {
    return TIPS[tipKey]?.[lang] ?? TIPS[tipKey]?.['zh'] ?? tipKey;
  }

  return (
    <aside
      style={{
        width: '72px',
        height: '100vh',
        background: 'var(--sidebar-bg, rgba(18,18,22,0.92))',
        backdropFilter: 'blur(40px) saturate(180%)',
        borderRight: '1px solid var(--border, rgba(255,255,255,0.08))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 10px',
        gap: '6px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* ---- 品牌 Logo ---- */}
      <Link
        href="/admin"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '11px',
          background: 'var(--gradient-main, linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: 'var(--shadow-inset, inset 0 1px 0 rgba(255,255,255,0.15)), 0 4px 12px var(--primary-glow, rgba(10,132,255,0.35))',
          marginBottom: '18px',
          flexShrink: 0,
        }}
      >
        B
      </Link>

      {/* ---- 导航图标列表 ---- */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, width: '100%', alignItems: 'center' }}>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const tip = getTip(item.tipKey);
          const hasBadge = item.tipKey === 'messages' && unreadMessages > 0;

          return (
            <div
              key={item.href}
              className="group"
              data-tip-key={item.tipKey}
              style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Link
                href={item.href}
                aria-label={tip}
                className={active ? 'nav-icon-active' : ''}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: active ? '#fff' : 'var(--text-secondary, #86868B)',
                  transition: 'all 0.2s var(--easing, ease)',
                  background: active
                    ? 'var(--gradient-main, linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%))'
                    : 'transparent',
                  boxShadow: active ? '0 4px 12px var(--primary-glow, rgba(10,132,255,0.35))' : 'none',
                  position: 'relative',
                }}
              >
                {item.icon}

                {/* 未读消息徽章 */}
                {hasBadge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary, #0A84FF)',
                      boxShadow: '0 0 6px var(--primary-glow, rgba(10,132,255,0.6))',
                    }}
                  />
                )}
              </Link>

              {/* hover tooltip */}
              <span
                className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                style={{
                  zIndex: 999,
                  background: 'var(--bg-card-solid, #1c1c20)',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  color: 'var(--text, #F5F5F7)',
                }}
              >
                {tip}
              </span>
            </div>
          );
        })}
      </nav>

      {/* ---- 底部用户头像 ---- */}
      <div
        className="group"
        style={{ position: 'relative', marginTop: '8px' }}
      >
        <div
          title={displayName}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--gradient-main, linear-gradient(135deg,#5E5CE6 0%,#0A84FF 100%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: 'var(--shadow-inset, inset 0 1px 0 rgba(255,255,255,0.15))',
            cursor: 'default',
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </div>

        {/* 用户名 tooltip */}
        <span
          className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
          style={{
            zIndex: 999,
            background: 'var(--bg-card-solid, #1c1c20)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            color: 'var(--text, #F5F5F7)',
          }}
        >
          {displayName}
        </span>
      </div>
    </aside>
  );
}
