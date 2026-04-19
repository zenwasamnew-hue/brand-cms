/**
 * 主题切换器（Client Component）
 * 支持 6 套主题：midnight / silver / space-gray / matrix / sunset / aurora
 * 主题持久化到 localStorage('admin-theme')，应用到 document.documentElement
 */
'use client';

import { useEffect, useState } from 'react';

const THEMES = [
  { id: 'midnight',   label: '🌑 Midnight' },
  { id: 'silver',     label: '🪙 Silver'    },
  { id: 'space-gray', label: '🌫️ Space Gray' },
  { id: 'matrix',     label: '💚 Matrix'    },
  { id: 'sunset',     label: '🌅 Sunset'    },
  { id: 'aurora',     label: '🌌 Aurora'    },
];

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState('midnight');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') ?? 'midnight';
    setCurrent(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function applyTheme(id: string) {
    setCurrent(id);
    setOpen(false);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('admin-theme', id);
  }

  const currentLabel = THEMES.find((t) => t.id === current)?.label ?? '🌑 Midnight';

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="theme-switcher-btn"
        onClick={() => setOpen((v) => !v)}
        title="切换主题"
      >
        {currentLabel}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: '160px',
            background: 'var(--bg-card-solid, #1c1c20)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTheme(t.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: current === t.id ? 'var(--gradient-main)' : 'transparent',
                color: current === t.id ? '#fff' : 'var(--text)',
                fontSize: '12px',
                fontWeight: current === t.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* 点击外部关闭 */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
