/**
 * 后台登录页
 * 设计参考：admin_Version4.html
 * 功能：邮箱+密码登录、错误提示、黑色玻璃拟态 UI
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // 提交登录表单
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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(at 20% 30%,rgba(10,132,255,0.15),transparent 50%),radial-gradient(at 80% 70%,rgba(94,92,230,0.15),transparent 50%),#000',
        padding: '20px',
      }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 800,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1),0 8px 24px rgba(10,132,255,0.4)',
              marginBottom: '16px',
            }}
          >B</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>BRAND CMS</h1>
          <p style={{ fontSize: '13px', color: '#86868B' }}>后台管理系统</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>邮箱</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" style={{ width: '100%', padding: '11px 14px', background: '#1c1c20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F5F5F7', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#86868B', marginBottom: '6px' }}>密码</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码" style={{ width: '100%', padding: '11px 14px', background: '#1c1c20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F5F5F7', fontSize: '14px', outline: 'none' }} />
          </div>
          {error && (<div style={{ padding: '10px 14px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.3)', borderRadius: '10px', color: '#FF453A', fontSize: '12px', marginBottom: '16px' }}>{error}</div>)}
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>{loading ? '登录中…' : '登录'}</button>
        </form>

        <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(10,132,255,0.08)', border: '1px solid rgba(10,132,255,0.2)', borderRadius: '10px', fontSize: '11px', color: '#86868B', lineHeight: 1.6 }}>
          💡 <strong style={{ color: '#64D2FF' }}>首次使用？</strong><br />
          请到 Supabase 控制台 → Authentication → Users → Add user 创建超管账号，然后在 Table Editor → profiles 将其 role 改为 superadmin。
        </div>
      </div>
    </div>
  );
}