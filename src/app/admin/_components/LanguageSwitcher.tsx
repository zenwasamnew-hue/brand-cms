/**
 * 语言切换器（Client Component）
 * 支持 zh / en / ja / ko 四种 UI 语言
 * 语言持久化到 localStorage('admin-lang')
 */
'use client';

import { useEffect, useState } from 'react';

export const LANGS = [
  { id: 'zh', label: '🇨🇳 中文' },
  { id: 'en', label: '🇺🇸 English' },
  { id: 'ja', label: '🇯🇵 日本語' },
  { id: 'ko', label: '🇰🇷 한국어' },
];

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState('zh');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-lang') ?? 'zh';
    setCurrent(saved);
  }, []);

  function applyLang(id: string) {
    setCurrent(id);
    setOpen(false);
    localStorage.setItem('admin-lang', id);
    // dispatch 自定义事件，让其他组件可以监听语言变化
    window.dispatchEvent(new CustomEvent('admin-lang-change', { detail: id }));
  }

  const currentLabel = LANGS.find((l) => l.id === current)?.label ?? '🇨🇳 中文';

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="lang-switcher-btn"
        onClick={() => setOpen((v) => !v)}
        title="切换语言"
      >
        {currentLabel}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '140px',
            background: 'var(--bg-card-solid, #1c1c20)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => applyLang(l.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: current === l.id ? 'var(--gradient-main)' : 'transparent',
                color: current === l.id ? '#fff' : 'var(--text)',
                fontSize: '12px',
                fontWeight: current === l.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
