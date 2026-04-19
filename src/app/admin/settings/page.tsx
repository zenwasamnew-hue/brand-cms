'use client';

import { useState } from 'react';

type Settings = {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  language: string;
  timezone: string;
  enableComments: boolean;
  maintenanceMode: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'BRAND CMS',
    siteUrl: 'https://example.com',
    adminEmail: 'admin@example.com',
    language: 'zh',
    timezone: 'Asia/Shanghai',
    enableComments: true,
    maintenanceMode: false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggle(key: 'enableComments' | 'maintenanceMode') {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' };

  return (
    <div style={{ padding: '28px', maxWidth: '640px' }}>
      <form onSubmit={handleSave}>
        <section className="theme-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>基本设置</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={labelStyle}>站点名称</label>
              <input style={inputStyle} value={settings.siteName} onChange={(e) => setSettings((p) => ({ ...p, siteName: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>站点 URL</label>
              <input style={inputStyle} value={settings.siteUrl} onChange={(e) => setSettings((p) => ({ ...p, siteUrl: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>管理员邮箱</label>
              <input style={inputStyle} type="email" value={settings.adminEmail} onChange={(e) => setSettings((p) => ({ ...p, adminEmail: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>默认语言</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={settings.language} onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>时区</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={settings.timezone} onChange={(e) => setSettings((p) => ({ ...p, timezone: e.target.value }))}>
                  <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="theme-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>功能开关</h3>
          {[
            { key: 'enableComments' as const, label: '启用留言功能', desc: '允许访客在网站提交联系留言' },
            { key: 'maintenanceMode' as const, label: '维护模式', desc: '开启后前台将显示维护中页面' },
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => toggle(item.key)}
                style={{
                  width: '44px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', position: 'relative',
                  background: settings[item.key] ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s', flexShrink: 0,
                }}
              >
                <span style={{ position: 'absolute', top: '3px', left: settings[item.key] ? '21px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </button>
            </div>
          ))}
        </section>

        <button type="submit" style={{ padding: '11px 28px', borderRadius: '10px', background: saved ? '#30D158' : 'var(--accent)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}>
          {saved ? '✓ 已保存' : '保存设置'}
        </button>
      </form>
    </div>
  );
}
