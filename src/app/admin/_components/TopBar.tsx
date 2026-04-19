'use client';

import { usePathname } from 'next/navigation';
import { useLang } from './UiLangProvider';
import { useTheme, themes } from './ThemeProvider';
import type { Lang } from '@/lib/i18n';

const langs: { value: Lang; label: string }[] = [
  { value: 'zh', label: '中' },
  { value: 'en', label: 'EN' },
  { value: 'ja', label: 'JP' },
  { value: 'ko', label: 'KR' },
];

export default function TopBar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();

  function getTitle(): string {
    if (pathname === '/admin') return t.nav.dashboard;
    if (pathname.startsWith('/admin/modules')) return t.nav.modules;
    if (pathname.startsWith('/admin/editor')) return t.nav.editor;
    if (pathname.startsWith('/admin/i18n')) return t.nav.i18n;
    if (pathname.startsWith('/admin/theme')) return t.nav.theme;
    if (pathname.startsWith('/admin/messages')) return t.nav.messages;
    if (pathname.startsWith('/admin/files')) return t.nav.files;
    if (pathname.startsWith('/admin/settings')) return t.nav.settings;
    return 'Admin';
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <h1 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', flex: 1 }}>
        {getTitle()}
      </h1>

      {/* Theme swatches */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {themes.map((th) => (
          <button
            key={th.value}
            title={th.label}
            onClick={() => setTheme(th.value)}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: th.swatch,
              border: theme === th.value ? '2px solid var(--text-primary)' : '2px solid transparent',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        ))}
      </div>

      {/* Lang switcher */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {langs.map((l) => (
          <button
            key={l.value}
            onClick={() => setLang(l.value)}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              border: lang === l.value ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: lang === l.value ? 'var(--accent)' : 'transparent',
              color: lang === l.value ? '#fff' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
