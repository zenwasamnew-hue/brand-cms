'use client';

import { useState } from 'react';
import { mockMessages, type MockMessage } from '@/lib/mock';

const statusColors: Record<MockMessage['status'], string> = {
  unread: '#0A84FF',
  read: '#86868B',
  replied: '#30D158',
};
const statusLabels: Record<MockMessage['status'], string> = {
  unread: '未读',
  read: '已读',
  replied: '已回复',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<MockMessage[]>(mockMessages);
  const [selected, setSelected] = useState<MockMessage | null>(null);
  const [filter, setFilter] = useState<'all' | MockMessage['status']>('all');

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  function markRead(id: string) {
    setMessages((prev) => prev.map((m) => m.id === id && m.status === 'unread' ? { ...m, status: 'read' } : m));
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 53px)' }}>
      {/* List panel */}
      <div style={{ width: '360px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Filter tabs */}
        <div style={{ padding: '14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '6px' }}>
          {(['all','unread','read','replied'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
              {f === 'all' ? '全部' : statusLabels[f]}
            </button>
          ))}
        </div>
        {/* Message list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((m) => (
            <div
              key={m.id}
              onClick={() => { setSelected(m); markRead(m.id); }}
              style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected?.id === m.id ? 'rgba(10,132,255,0.08)' : m.status === 'unread' ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.15s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: m.status === 'unread' ? 700 : 500, color: 'var(--text-primary)' }}>{m.name}</span>
                    <span style={{ fontSize: '10px', color: statusColors[m.status], background: `${statusColors[m.status]}20`, padding: '2px 6px', borderRadius: '100px', fontWeight: 600 }}>{statusLabels[m.status]}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selected ? (
          <>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700 }}>{selected.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{selected.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selected.email}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button onClick={() => setMessages((p) => p.map((m) => m.id === selected.id ? { ...m, status: 'replied' } : m))} style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>✉️ 回复</button>
                  <button onClick={() => { setMessages((p) => p.filter((m) => m.id !== selected.id)); setSelected(null); }} style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', color: '#FF453A', fontSize: '12px', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div className="theme-card" style={{ padding: '20px', marginBottom: '16px' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.8, margin: 0 }}>{selected.content}</p>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {new Date(selected.created_at).toLocaleString()}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            📧 选择一条留言查看详情
          </div>
        )}
      </div>
    </div>
  );
}
