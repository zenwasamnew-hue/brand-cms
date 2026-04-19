'use client';
import { useState, useEffect } from 'react';

const THEMES = [
  { id: 'midnight', label: 'Midnight', color: '#0A84FF' },
  { id: 'silver', label: 'Silver', color: '#007AFF' },
  { id: 'space-gray', label: 'Space Gray', color: '#636366' },
  { id: 'matrix', label: 'Matrix', color: '#00FF41' },
  { id: 'sunset', label: 'Sunset', color: '#FF6B35' },
  { id: 'aurora', label: 'Aurora', color: '#BF5AF2' },
];

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState('midnight');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') || 'midnight';
    setCurrent(saved);
  }, []);

  function applyTheme(id: string) {
    setCurrent(id);
    localStorage.setItem('admin-theme', id);
    document.documentElement.setAttribute('data-theme', id);
    setOpen(false);
  }

  const currentTheme = THEMES.find(t => t.id === current) || THEMES[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: currentTheme.color, flexShrink: 0, display: 'inline-block' }} />
        {currentTheme.label}
        <span style={{ color: 'var(--text-secondary)' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000,
          background: 'var(--bg-sidebar)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '6px', minWidth: '140px',
          backdropFilter: 'blur(40px)', boxShadow: 'var(--shadow-lg)',
        }}>
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                padding: '7px 10px', borderRadius: '8px', border: 'none',
                background: current === theme.id ? 'var(--border)' : 'transparent',
                color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer',
                fontWeight: current === theme.id ? 600 : 400,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: theme.color, flexShrink: 0, display: 'inline-block' }} />
              {theme.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
