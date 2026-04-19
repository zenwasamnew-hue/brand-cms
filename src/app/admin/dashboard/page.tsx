'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitcher from '../_components/ThemeSwitcher';
import LangSwitcher from '../_components/LangSwitcher';
import { UI_I18N, type Lang } from '@/lib/i18n';

function getGreeting(lang: Lang): string {
  const h = new Date().getHours();
  const d = UI_I18N[lang];
  if (h >= 5 && h < 12) return d.greeting_morning;
  if (h >= 12 && h < 18) return d.greeting_afternoon;
  if (h >= 18 && h < 23) return d.greeting_evening;
  return d.greeting_night;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80; const h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const KPI_DATA = [
  { key: 'totalMessages', value: 128, delta: '+12%', icon: '💬', color: '#0A84FF', spark: [40,55,48,62,70,65,80,88,75,95,100,128] },
  { key: 'unreadMessages', value: 7, delta: '-3', icon: '🔔', color: '#FF9F0A', spark: [12,10,8,15,7,9,11,8,6,10,8,7] },
  { key: 'totalPages', value: 24, delta: '+2', icon: '📄', color: '#30D158', spark: [18,18,19,20,20,21,21,22,22,23,24,24] },
  { key: 'totalFiles', value: 312, delta: '+18', icon: '🖼️', color: '#5E5CE6', spark: [220,240,255,270,280,290,295,300,305,308,310,312] },
];

export default function DashboardPage() {
  const [lang, setLang] = useState<Lang>('zh');
  const [online, setOnline] = useState(42);

  useEffect(() => {
    const saved = (localStorage.getItem('admin-lang') || 'zh') as Lang;
    setLang(saved);
    const handler = () => {
      const l = (localStorage.getItem('admin-lang') || 'zh') as Lang;
      setLang(l);
    };
    window.addEventListener('admin-lang-change', handler);

    const timer = setInterval(() => {
      setOnline(prev => Math.max(10, prev + Math.round((Math.random() - 0.5) * 8)));
    }, 3000);

    return () => {
      window.removeEventListener('admin-lang-change', handler);
      clearInterval(timer);
    };
  }, []);

  const dict = UI_I18N[lang];
  const greeting = getGreeting(lang);

  const quickActions = [
    { icon: '✏️', label: dict.editContent, href: '/admin/editor', bg: 'rgba(10,132,255,0.1)', border: 'rgba(10,132,255,0.2)' },
    { icon: '📤', label: dict.uploadFile, href: '/admin/files', bg: 'rgba(48,209,88,0.1)', border: 'rgba(48,209,88,0.2)' },
    { icon: '🌐', label: dict.i18nMgmt, href: '/admin/i18n', bg: 'rgba(94,92,230,0.1)', border: 'rgba(94,92,230,0.2)' },
    { icon: '⚙️', label: dict.systemSettings, href: '/admin/settings', bg: 'rgba(255,159,10,0.1)', border: 'rgba(255,159,10,0.2)' },
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Topbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg-topbar)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)', flex: 1 }}>
          {dict.dashboard}
        </h1>
        <span style={{
          background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.3)',
          color: 'var(--color-success)', fontSize: '10px', fontWeight: 700,
          padding: '2px 8px', borderRadius: 'var(--radius-full)',
        }}>● {dict.live}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          👁 {online} {dict.online}
        </span>
        <LangSwitcher />
        <ThemeSwitcher />
      </div>

      <div style={{ padding: '24px' }}>
        {/* Welcome banner */}
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(10,132,255,0.15) 0%, rgba(94,92,230,0.15) 100%)',
          border: '1px solid rgba(10,132,255,0.2)',
          padding: '24px 28px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px' }}>
              {greeting}，Admin 👋
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
              ✨ 品牌官网运营状态良好，一切正常
            </p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: dict.online, value: online, color: 'var(--color-success)' },
              { label: dict.unreadMessages, value: 7, color: 'var(--color-warning)' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {KPI_DATA.map(kpi => (
            <div key={kpi.key} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px' }}>{kpi.icon}</span>
                <span style={{ fontSize: '11px', color: kpi.delta.startsWith('+') ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                  {kpi.delta}
                </span>
              </div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: kpi.color, marginBottom: '2px', lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {dict[kpi.key as keyof typeof dict]}
              </div>
              <Sparkline data={kpi.spark} color={kpi.color} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {dict.quickActions}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {quickActions.map(a => (
              <Link key={a.href} href={a.href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '16px 8px', borderRadius: 'var(--radius-md)',
                background: a.bg, border: `1px solid ${a.border}`,
                textDecoration: 'none', color: 'var(--text-primary)',
                fontSize: '12px', fontWeight: 600, transition: 'transform 0.2s',
              }}>
                <span style={{ fontSize: '22px' }}>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Latest messages */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {dict.latestMessages}
            </h3>
            <Link href="/admin/messages" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>
              {dict.viewAll} →
            </Link>
          </div>
          {[
            { name: 'Alice Chen', email: 'alice@example.com', msg: '产品设计非常棒，期待合作机会！', unread: true },
            { name: 'Bob Wang', email: 'bob@example.com', msg: '请问有没有定制化服务？', unread: true },
            { name: 'Carol Li', email: 'carol@example.com', msg: '网站加载速度很快，体验很好', unread: false },
          ].map(m => (
            <div key={m.email} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
              marginBottom: '6px',
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--gradient-main)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0,
              }}>{m.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{m.name}</div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.msg}</p>
              </div>
              {m.unread && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, boxShadow: 'var(--shadow-glow)' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
