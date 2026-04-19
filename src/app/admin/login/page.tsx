/**
 * 后台登录页
 * 设计参考：admin_Version4.html — 左右双栏布局
 *   左栏：品牌介绍 + 特性列表（渐变背景）
 *   右栏：登录表单（玻璃拟态）
 *   右上角：主题切换器悬浮按钮
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const THEMES = [
  { key: 'midnight',   label: 'Midnight',   color: '#0A84FF' },
  { key: 'silver',     label: 'Silver',     color: '#8e8e93' },
  { key: 'space-gray', label: 'Space Gray', color: '#636366' },
  { key: 'matrix',     label: 'Matrix',     color: '#00ff41' },
  { key: 'sunset',     label: 'Sunset',     color: '#FF6B35' },
  { key: 'aurora',     label: 'Aurora',     color: '#00C897' },
];

const BRAND_FEATURES = [
  { icon: '⚡', title: '实时数据', desc: '数据变化即时同步，无需刷新' },
  { icon: '🎨', title: '多主题', desc: '6 套精心设计的视觉主题' },
  { icon: '🌐', title: '多语言', desc: '支持中/英/日/韩四语言切换' },
  { icon: '🔒', title: '安全可靠', desc: 'Supabase RLS 行级权限保护' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThemes, setShowThemes] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('登录失败：' + error.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  function applyTheme(key: string) {
    document.documentElement.setAttribute('data-theme', key);
    localStorage.setItem('admin-theme', key);
    setShowThemes(false);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg-base, #000)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰光晕 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(at 20% 30%,rgba(10,132,255,0.12),transparent 50%),radial-gradient(at 80% 70%,rgba(94,92,230,0.12),transparent 50%)',
      }} />

      {/* ── 右上角主题切换器 ── */}
      <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 200 }}>
        <button
          onClick={() => setShowThemes(!showThemes)}
          title="切换主题"
          style={{
            width: '40px', height: '40px', borderRadius: '11px',
            background: 'rgba(28,28,32,0.85)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.6)',
            fontSize: '18px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >🎨</button>
        {showThemes && (
          <div style={{
            position: 'absolute', top: '48px', right: 0,
            background: 'rgba(28,28,32,0.95)', backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: '14px',
            padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px',
            minWidth: '160px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => applyTheme(t.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '8px', border: 'none',
                  background: 'transparent', color: '#F5F5F7', fontSize: '13px',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <span style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: t.color, flexShrink: 0, display: 'block',
                }} />
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 左栏：品牌介绍 ── */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          background: 'linear-gradient(135deg,rgba(10,132,255,0.15) 0%,rgba(94,92,230,0.15) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          minWidth: 0,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '28px', fontWeight: 800,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15),0 8px 32px rgba(10,132,255,0.4)',
            marginBottom: '24px',
          }}>B</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 12px',
            background: 'linear-gradient(90deg,#64D2FF 0%,#0A84FF 50%,#5E5CE6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>BRAND CMS</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
            现代化品牌官网内容管理系统<br />让内容运营简单高效
          </p>
        </div>

        {/* 特性列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {BRAND_FEATURES.map((f) => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F5F5F7', marginBottom: '3px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 右栏：登录表单 ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 48px',
        }}
      >
        {/* 移动端不单独显示 Logo（左栏中已有） */}
        <div style={{ display: 'none' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '24px', fontWeight: 800,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1),0 8px 24px rgba(10,132,255,0.4)',
            marginBottom: '16px',
          }}>B</div>
        </div>

        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 8px', color: '#F5F5F7' }}>欢迎回来</h2>
          <p style={{ fontSize: '13px', color: '#86868B', margin: '0 0 32px' }}>请登录后台管理系统</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>邮箱</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(28,28,32,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                  color: '#F5F5F7', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(10,132,255,0.6)'; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>密码</label>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(28,28,32,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                  color: '#F5F5F7', fontSize: '14px', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(10,132,255,0.6)'; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.3)',
                borderRadius: '10px', color: '#FF453A', fontSize: '12px', marginBottom: '16px',
              }}>{error}</div>
            )}
            <button
              type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '12px' }}
            >
              {loading ? '登录中…' : '登 录'}
            </button>
          </form>

          <div style={{
            marginTop: '24px', padding: '14px',
            background: 'rgba(10,132,255,0.06)', border: '1px solid rgba(10,132,255,0.15)',
            borderRadius: '10px', fontSize: '11px', color: '#86868B', lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: '#64D2FF' }}>首次使用？</strong><br />
            Supabase 控制台 → Authentication → Users → Add user，<br />
            然后在 profiles 表将 role 设为 <code>superadmin</code>。
          </div>
        </div>
      </div>
    </div>
  );
}