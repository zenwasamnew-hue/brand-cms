'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeInitializer from '@/app/admin/_components/ThemeInitializer';
import ThemeSwitcher from '@/app/admin/_components/ThemeSwitcher';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password'); return; }
    setLoading(true);
    setTimeout(() => {
      document.cookie = 'admin-auth=true; path=/; max-age=86400';
      router.push('/admin/dashboard');
    }, 600);
  }

  return (
    <>
      <ThemeInitializer />
      <div style={{
        minHeight: '100vh', display: 'flex',
        background: 'var(--bg-base)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--gradient-mesh)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'fixed', top: '16px', right: '20px', zIndex: 100,
          display: 'flex', gap: '8px',
        }}>
          <ThemeSwitcher />
        </div>

        {/* Left panel */}
        <div style={{
          flex: '0 0 45%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px',
          borderRight: '1px solid var(--border)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '24px', fontWeight: 800,
            boxShadow: 'var(--shadow-inset), var(--shadow-glow)',
            marginBottom: '32px',
          }}>B</div>

          <h1 style={{
            fontSize: '40px', fontWeight: 800, margin: '0 0 12px',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Brand CMS</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', margin: '0 0 48px' }}>
            一站式品牌内容管理系统
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '🎨', title: '6 套精美主题', desc: 'Midnight / Silver / Space Gray / Matrix / Sunset / Aurora' },
              { icon: '🌐', title: '4 语言界面', desc: '中文 / English / 日本語 / 한국어' },
              { icon: '✏️', title: '可视化编辑器', desc: '实时预览 · 7 个内容模块 · 响应式' },
              { icon: '📊', title: '数据仪表盘', desc: 'KPI 统计 · 流量分析 · 系统监控' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Login form */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px',
        }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              欢迎回来 👋
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
              登录您的管理员账号
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>邮箱</label>
                <input type="email" className="admin-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>密码</label>
                <input type="password" className="admin-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="输入密码" />
              </div>
              {error && <div style={{ padding: '10px 14px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.3)', borderRadius: '10px', color: 'var(--color-error)', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}>
                {loading ? '登录中…' : '登录'}
              </button>
            </form>

            <div style={{ marginTop: '20px', padding: '12px 14px', background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.2)', borderRadius: '10px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              💡 <strong style={{ color: 'var(--text-accent)' }}>演示模式</strong> — 任意邮箱 + 任意密码即可登录
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
