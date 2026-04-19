'use client';

import { useState } from 'react';
import { mockModules, type MockModule } from '@/lib/mock';

export default function ModulesPage() {
  const [modules, setModules] = useState<MockModule[]>(mockModules);

  function toggle(id: string) {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));
  }

  return (
    <div style={{ padding: '28px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
        管理网站各功能模块的启用状态。禁用的模块将在前台隐藏。
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {modules.map((m) => (
          <div key={m.id} className="theme-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '28px', width: '48px', height: '48px', borderRadius: '12px', background: m.enabled ? 'rgba(10,132,255,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{m.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.description}</div>
            </div>
            {/* Toggle */}
            <button
              onClick={() => toggle(m.id)}
              style={{
                width: '44px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative',
                background: m.enabled ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                transition: 'background 0.3s', flexShrink: 0,
              }}
            >
              <span style={{ position: 'absolute', top: '3px', left: m.enabled ? '21px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
