'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import LangSwitcher from './LangSwitcher';
import { UI_I18N, type Lang } from '@/lib/i18n';

const MODULE_CONFIG: Record<string, { icon: string; color: string }> = {
  modules:  { icon: '⬡', color: '#0A84FF' },
  i18n:     { icon: '⊕', color: '#30D158' },
  theme:    { icon: '◑', color: '#BF5AF2' },
  messages: { icon: '⊡', color: '#FF9F0A' },
  files:    { icon: '⊟', color: '#5E5CE6' },
  settings: { icon: '◎', color: '#FF453A' },
};

interface Props { module: keyof typeof MODULE_CONFIG; }

export default function PlaceholderPage({ module }: Props) {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const saved = (localStorage.getItem('admin-lang') || 'zh') as Lang;
    setLang(saved);
    const handler = () => setLang((localStorage.getItem('admin-lang') || 'zh') as Lang);
    window.addEventListener('admin-lang-change', handler);
    return () => window.removeEventListener('admin-lang-change', handler);
  }, []);

  const dict = UI_I18N[lang];
  const config = MODULE_CONFIG[module];
  const name = dict[module as keyof typeof dict] as string;

  return (
    <div>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-topbar)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', flex: 1 }}>{name}</h1>
        <LangSwitcher />
        <ThemeSwitcher />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)', padding: '32px' }}>
        <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>{config.icon}</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px', color: 'var(--text-primary)' }}>{name}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 28px' }}>
            {dict.comingSoon}
          </p>
          <Link href="/admin/dashboard" className="btn-primary" style={{ display: 'inline-block' }}>
            ← {dict.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
