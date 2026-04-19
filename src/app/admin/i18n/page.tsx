'use client';

import { useState } from 'react';
import { mockTranslations, type MockTranslation } from '@/lib/mock';

type LangKey = 'zh' | 'en' | 'ja' | 'ko';
const langs: LangKey[] = ['zh', 'en', 'ja', 'ko'];
const langLabels: Record<LangKey, string> = { zh: '中文', en: 'English', ja: '日本語', ko: '한국어' };

export default function I18nPage() {
  const [translations, setTranslations] = useState<MockTranslation[]>(mockTranslations);
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const filtered = translations.filter((t) =>
    t.key.toLowerCase().includes(search.toLowerCase()) ||
    Object.values(t).some((v) => typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase()))
  );

  function handleEdit(key: string, lang: LangKey, value: string) {
    setTranslations((prev) => prev.map((t) => t.key === key ? { ...t, [lang]: value } : t));
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Search */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 搜索翻译键或内容..."
          style={{ flex: 1, padding: '9px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
        />
        <button style={{ padding: '9px 16px', borderRadius: '10px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>+ 新增</button>
      </div>

      {/* Table */}
      <div className="theme-card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr) 80px', gap: '0', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
          {['Key', ...langs.map((l) => langLabels[l]), '操作'].map((h) => (
            <div key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {filtered.map((row) => (
          <div key={row.key} style={{ display: 'grid', gridTemplateColumns: '200px repeat(4, 1fr) 80px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{row.key}</div>
            {langs.map((l) => (
              <div key={l} style={{ padding: '6px 14px', display: 'flex', alignItems: 'center' }}>
                {editingKey === `${row.key}-${l}` ? (
                  <input
                    autoFocus
                    value={row[l]}
                    onChange={(e) => handleEdit(row.key, l, e.target.value)}
                    onBlur={() => setEditingKey(null)}
                    style={{ width: '100%', padding: '4px 8px', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--accent)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' }}
                  />
                ) : (
                  <span
                    style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'text' }}
                    onDoubleClick={() => setEditingKey(`${row.key}-${l}`)}
                  >{row[l]}</span>
                )}
              </div>
            ))}
            <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center' }}>
              <button onClick={() => setEditingKey(`${row.key}-zh`)} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)', color: 'var(--accent)', cursor: 'pointer' }}>编辑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
