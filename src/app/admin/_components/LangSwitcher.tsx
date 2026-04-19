'use client';
import { useState, useEffect } from 'react';
import { type Lang } from '@/lib/i18n';

const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'en', label: 'EN', flag: '🇺🇸' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'ko', label: '한국어', flag: '🇰🇷' },
];

export default function LangSwitcher() {
  const [current, setCurrent] = useState<Lang>('zh');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('admin-lang') || 'zh') as Lang;
    setCurrent(saved);
  }, []);

  function applyLang(id: Lang) {
    setCurrent(id);
    localStorage.setItem('admin-lang', id);
    window.dispatchEvent(new Event('admin-lang-change'));
    setOpen(false);
  }

  const cur = LANGS.find(l => l.id === current) || LANGS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '6px 10px', borderRadius: 'var(--radius-full)',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
      }}>
        {cur.flag} {cur.label} <span style={{ color: 'var(--text-secondary)' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000,
          background: 'var(--bg-sidebar)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '6px', minWidth: '120px',
          backdropFilter: 'blur(40px)', boxShadow: 'var(--shadow-lg)',
        }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => applyLang(l.id)} style={{
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
              padding: '7px 10px', borderRadius: '8px', border: 'none',
              background: current === l.id ? 'var(--border)' : 'transparent',
              color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer',
              fontWeight: current === l.id ? 600 : 400,
            }}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
