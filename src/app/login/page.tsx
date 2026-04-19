'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const router   = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError('登录失败：' + authError.message); setLoading(false); return; }
    } catch (err) {
      // Supabase not configured – allow any login in demo mode
      if (!(err instanceof Error && err.message === 'Supabase not configured')) {
        setError('登录出错，请重试');
        setLoading(false);
        return;
      }
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0a0f' }}>
      {/* Left brand panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a0a20 0%, #050015 100%)',
        }}
      >
        {/* animated mesh blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,132,255,0.25) 0%, transparent 70%)', top: '-100px', left: '-100px', animation: 'pulse 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,92,230,0.2) 0%, transparent 70%)', bottom: '-80px', right: '-80px', animation: 'pulse 8s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,90,242,0.15) 0%, transparent 70%)', top: '40%', left: '40%', animation: 'pulse 7s ease-in-out infinite 2s' }} />
        </div>
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(10px,-10px)} }`}</style>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '36px', fontWeight: 800, boxShadow: '0 20px 60px rgba(10,132,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)', marginBottom: '24px' }}>B</div>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em' }}>BRAND CMS</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 40px' }}>品牌内容管理系统</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {['主题管理', '多语言', '文件系统', '实时预览'].map((f) => (
              <span key={f} style={{ padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0a0a0f' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#F5F5F7', margin: '0 0 8px' }}>欢迎回来</h2>
            <p style={{ fontSize: '14px', color: '#86868B', margin: 0 }}>登录以继续管理您的品牌内容</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>邮箱地址</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F5F5F7', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>密码</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F5F5F7', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.3)', borderRadius: '10px', color: '#FF453A', fontSize: '12px', marginBottom: '16px' }}>{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '10px' }}>
              {loading ? '登录中…' : '登录'}
            </button>
          </form>
          <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.2)', borderRadius: '10px', fontSize: '11px', color: '#86868B', lineHeight: 1.7 }}>
            💡 <strong style={{ color: '#64D2FF' }}>首次使用？</strong><br />
            Supabase Dashboard → Authentication → Users → Add user，然后将 role 设为 superadmin。
          </div>
        </div>
      </div>
    </div>
  );
}