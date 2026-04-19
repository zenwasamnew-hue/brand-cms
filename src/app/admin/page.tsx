'use client';

import Link from 'next/link';
import { useLang } from './_components/UiLangProvider';
import { mockKpi, mockMessages } from '@/lib/mock';

const kpiConfig = [
  { icon: '💬', key: 'msgTotal' as const,  href: '/admin/messages', color: '#0A84FF' },
  { icon: '🔔', key: 'msgUnread' as const, href: '/admin/messages', color: '#FF9F0A' },
  { icon: '📄', key: 'pageTotal' as const, href: '/admin/editor',   color: '#30D158' },
  { icon: '🖼️', key: 'fileTotal' as const, href: '/admin/files',    color: '#5E5CE6' },
];

function getGreeting(t: ReturnType<typeof useLang>['t']): string {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return t.dashboard.greeting_morning;
  if (hour >= 12 && hour < 18) return t.dashboard.greeting_afternoon;
  if (hour >= 18 && hour < 23) return t.dashboard.greeting_evening;
  return t.dashboard.greeting_night;
}

export default function DashboardPage() {
  const { t } = useLang();

  const kpiLabels = {
    msgTotal: t.dashboard.kpi_messages,
    msgUnread: t.dashboard.kpi_unread,
    pageTotal: t.dashboard.kpi_pages,
    fileTotal: t.dashboard.kpi_files,
  };

  const quickActions = [
    { icon: '✏️', label: t.nav.editor,   href: '/admin/editor',   bgColor: 'rgba(10,132,255,0.10)',  borderColor: 'rgba(10,132,255,0.19)' },
    { icon: '📤', label: t.nav.files,    href: '/admin/files',    bgColor: 'rgba(48,209,88,0.10)',   borderColor: 'rgba(48,209,88,0.19)'  },
    { icon: '🌐', label: t.nav.i18n,     href: '/admin/i18n',     bgColor: 'rgba(94,92,230,0.10)',   borderColor: 'rgba(94,92,230,0.19)'  },
    { icon: '⚙️', label: t.nav.settings, href: '/admin/settings', bgColor: 'rgba(255,159,10,0.10)',  borderColor: 'rgba(255,159,10,0.19)' },
  ];

  return (
    <div style={{ padding: '28px', paddingBottom: '40px' }}>
      {/* Welcome banner */}
      <div className="theme-card" style={{ background: 'linear-gradient(135deg,rgba(10,132,255,0.15) 0%,rgba(94,92,230,0.15) 100%)', padding: '24px 28px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {getGreeting(t)}，Admin 👋
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          {mockKpi.msgUnread > 0 ? `🔔 ${mockKpi.msgUnread} ${t.dashboard.kpi_unread}` : `✨ ${t.dashboard.running_well}`}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {kpiConfig.map((kpi) => (
          <Link key={kpi.key} href={kpi.href} className="theme-card" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{kpi.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: kpi.color, marginBottom: '4px', lineHeight: 1 }}>{mockKpi[kpi.key]}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{kpiLabels[kpi.key]}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="theme-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {t.dashboard.quick_actions}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 8px', borderRadius: '12px', background: a.bgColor, border: `1px solid ${a.borderColor}`, textDecoration: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ fontSize: '22px' }}>{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div className="theme-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.dashboard.recent_messages}</h3>
          <Link href="/admin/messages" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>{t.dashboard.view_all}</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mockMessages.slice(0, 5).map((msg) => (
            <div key={msg.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{msg.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{msg.email}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.content}</p>
              </div>
              {msg.status === 'unread' && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
