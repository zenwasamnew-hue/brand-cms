'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UI_I18N, type Lang } from '@/lib/i18n';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: '◈', tipKey: 'dashboard' as const },
  { href: '/admin/modules',   icon: '⬡', tipKey: 'modules'   as const },
  { href: '/admin/editor',    icon: '✎', tipKey: 'editor'    as const },
  { href: '/admin/i18n',      icon: '⊕', tipKey: 'i18n'      as const },
  { href: '/admin/theme',     icon: '◑', tipKey: 'theme'     as const },
  { href: '/admin/messages',  icon: '⊡', tipKey: 'messages'  as const, badge: true },
  { href: '/admin/files',     icon: '⊟', tipKey: 'files'     as const },
  { href: '/admin/settings',  icon: '◎', tipKey: 'settings'  as const },
];

interface Props {
  displayName?: string;
  unreadMessages?: number;
}

export default function AdminSidebar({ displayName = 'Admin', unreadMessages = 0 }: Props) {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const saved = (localStorage.getItem('admin-lang') || 'zh') as Lang;
    setLang(saved);
    const handler = () => {
      const l = (localStorage.getItem('admin-lang') || 'zh') as Lang;
      setLang(l);
    };
    window.addEventListener('admin-lang-change', handler);
    return () => window.removeEventListener('admin-lang-change', handler);
  }, []);

  const dict = UI_I18N[lang];
  const avatarLetter = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    document.cookie = 'admin-auth=; path=/; max-age=0';
    window.location.href = '/login';
  }

  return (
    <aside style={{
      width: '72px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      backdropFilter: 'blur(40px) saturate(180%)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      flexShrink: 0,
      position: 'relative',
      zIndex: 100,
    }}>
      <Link href="/admin/dashboard" style={{
        width: '40px', height: '40px', borderRadius: '11px',
        background: 'var(--gradient-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '18px', fontWeight: 800,
        textDecoration: 'none',
        boxShadow: 'var(--shadow-inset), var(--shadow-glow)',
        marginBottom: '24px', flexShrink: 0,
      }}>B</Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <div key={item.href} className="nav-item" data-tip={dict[item.tipKey]} style={{ position: 'relative' }}>
              <Link href={item.href} style={{
                width: '44px', height: '44px', borderRadius: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', textDecoration: 'none', position: 'relative',
                background: isActive ? 'var(--gradient-main)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s var(--easing)',
              }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {item.icon}
                {item.badge && unreadMessages > 0 && (
                  <span style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#FF453A', boxShadow: '0 0 6px rgba(255,69,58,0.6)',
                  }} />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div className="nav-item" data-tip={displayName} style={{ position: 'relative' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '13px', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--shadow-inset)',
          }}>{avatarLetter}</div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-item"
          data-tip={dict.logout}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >↩</button>
      </div>
    </aside>
  );
}
