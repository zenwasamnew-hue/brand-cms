'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './UiLangProvider';
import LogoutButton from './LogoutButton';

type SidebarProps = {
  avatarLetter: string;
  displayName: string;
};

export default function Sidebar({ avatarLetter, displayName }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLang();

  const navItems = [
    { href: '/admin',          icon: '📊', label: t.nav.dashboard },
    { href: '/admin/modules',  icon: '🧩', label: t.nav.modules  },
    { href: '/admin/editor',   icon: '✏️', label: t.nav.editor   },
    { href: '/admin/i18n',     icon: '🌐', label: t.nav.i18n     },
    { href: '/admin/theme',    icon: '🎨', label: t.nav.theme    },
    { href: '/admin/messages', icon: '💬', label: t.nav.messages },
    { href: '/admin/files',    icon: '📁', label: t.nav.files    },
    { href: '/admin/settings', icon: '⚙️', label: t.nav.settings },
  ];

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        width: '72px',
        height: '100vh',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(40px) saturate(180%)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        href="/admin"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '11px',
          background: 'var(--gradient-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 800,
          textDecoration: 'none',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)',
          marginBottom: '24px',
          flexShrink: 0,
        }}
      >
        B
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <div key={item.href} className="nav-item-wrap">
              <Link
                href={item.href}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  textDecoration: 'none',
                  background: active ? 'var(--gradient-main)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                className={active ? '' : 'nav-link-hover'}
              >
                {item.icon}
              </Link>
              <span className="nav-tooltip">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom: avatar + logout */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          title={displayName}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--gradient-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
