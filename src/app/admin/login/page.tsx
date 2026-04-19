/**
 * 后台登录页
 * 设计参考：admin_Version4.html 的 login-page 部分
 * 布局：左右两栏 — 左侧品牌介绍 + 渐变 mesh 背景，右侧登录表单
 * 右上角：主题切换器 + 语言切换器
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ThemeSwitcher from '../_components/ThemeSwitcher';
import LanguageSwitcher from '../_components/LanguageSwitcher';

// i18n 文字
const i18n: Record<string, Record<string, string>> = {
  title:       { zh: 'BRAND CMS', en: 'BRAND CMS', ja: 'BRAND CMS', ko: 'BRAND CMS' },
  subtitle:    { zh: '后台管理系统', en: 'Admin Dashboard', ja: '管理システム', ko: '관리 대시보드' },
  email:       { zh: '邮箱', en: 'Email', ja: 'メール', ko: '이메일' },
  password:    { zh: '密码', en: 'Password', ja: 'パスワード', ko: '비밀번호' },
  login:       { zh: '登录', en: 'Sign In', ja: 'ログイン', ko: '로그인' },
  loading:     { zh: '登录中…', en: 'Signing in…', ja: 'ログイン中…', ko: '로그인 중…' },
  error:       { zh: '登录失败：', en: 'Login failed: ', ja: 'ログイン失敗：', ko: '로그인 실패: ' },
  hint:        { zh: '首次使用？', en: 'First time?', ja: '初めてですか？', ko: '처음 사용?' },
  hintDetail:  { zh: '请到 Supabase 控制台创建超管账号，并在 profiles 表将 role 设为 superadmin。', en: 'Create an admin account in Supabase console, then set role to superadmin in the profiles table.', ja: 'Supabase コンソールで管理者アカウントを作成し、profiles テーブルで role を superadmin に設定してください。', ko: 'Supabase 콘솔에서 관리자 계정을 생성하고 profiles 테이블에서 role을 superadmin으로 설정하세요.' },
  brandSlogan: { zh: '专为品牌官网而生的\n现代化内容管理系统', en: 'Modern CMS built for\nbrand websites', ja: 'ブランドウェブサイトのための\nモダンなCMS', ko: '브랜드 웹사이트를 위한\n현대적인 CMS' },
};

function t(key: string, lang: string): string {
  return i18n[key]?.[lang] ?? i18n[key]?.['zh'] ?? key;
}

const features = [
  { icon: '🎨', zh: '6 套精美主题', en: '6 Beautiful Themes', ja: '6つの美しいテーマ', ko: '6가지 아름다운 테마' },
  { icon: '🌐', zh: '4 种 UI 语言', en: '4 UI Languages', ja: '4つのUI言語', ko: '4가지 UI 언어' },
  { icon: '⚡', zh: '实时数据同步', en: 'Real-time Sync', ja: 'リアルタイム同期', ko: '실시간 동기화' },
  { icon: '🔒', zh: '企业级安全认证', en: 'Enterprise Auth', ja: 'エンタープライズ認証', ko: '기업급 인증' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState('zh');

  const router = useRouter();
  const supabase = createClient();

  // 监听语言切换事件
  useEffect(() => {
    function handleLangChange(e: Event) {
      setLang((e as CustomEvent<string>).detail);
    }
    window.addEventListener('admin-lang-change', handleLangChange);
    // 从 localStorage 恢复语言
    const saved = localStorage.getItem('admin-lang') ?? 'zh';
    setLang(saved);
    return () => window.removeEventListener('admin-lang-change', handleLangChange);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(t('error', lang) + error.message);
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
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--bg, #000)',
        overflow: 'hidden',
      }}
    >
      {/* ==================== 右上角浮动工具栏 ==================== */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 200,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      {/* ==================== 左侧：品牌介绍 + 渐变 mesh 背景 ==================== */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 56px',
          overflow: 'hidden',
          background: 'var(--bg-secondary, #0a0a0f)',
        }}
      >
        {/* 渐变 mesh 背景装饰 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--gradient-mesh)',
            pointerEvents: 'none',
          }}
        />

        {/* 品牌 Logo */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'var(--gradient-main, linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '26px',
            fontWeight: 800,
            boxShadow: 'var(--shadow-inset), 0 8px 24px var(--primary-glow)',
            marginBottom: '40px',
            flexShrink: 0,
          }}
        >
          B
        </div>

        {/* 品牌名称 + 口号 */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            margin: '0 0 16px',
            background: 'var(--gradient-main, linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          BRAND CMS
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary, #86868B)',
            margin: '0 0 48px',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {t('brandSlogan', lang)}
        </p>

        {/* 特性列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map((f) => (
            <div key={f.icon} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-card, rgba(28,28,32,0.8))',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text, #F5F5F7)', fontWeight: 500 }}>
                {f[lang as keyof typeof f] ?? f.zh}
              </span>
            </div>
          ))}
        </div>

        {/* 底部装饰圆圈 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'var(--primary-glow, rgba(10,132,255,0.08))',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ==================== 右侧：登录表单 ==================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 56px',
          background: 'var(--bg, #000)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* 标题区 */}
          <div style={{ marginBottom: '36px' }}>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 800,
                margin: '0 0 8px',
                color: 'var(--text, #F5F5F7)',
              }}
            >
              {t('login', lang)}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #86868B)', margin: 0 }}>
              {t('subtitle', lang)}
            </p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #86868B)',
                  marginBottom: '6px',
                }}
              >
                {t('email', lang)}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'var(--bg-card-solid, #1c1c20)',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  borderRadius: 'var(--radius-sm, 10px)',
                  color: 'var(--text, #F5F5F7)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #86868B)',
                  marginBottom: '6px',
                }}
              >
                {t('password', lang)}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'var(--bg-card-solid, #1c1c20)',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  borderRadius: 'var(--radius-sm, 10px)',
                  color: 'var(--text, #F5F5F7)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,69,58,0.1)',
                  border: '1px solid rgba(255,69,58,0.3)',
                  borderRadius: 'var(--radius-sm, 10px)',
                  color: '#FF453A',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: 'var(--radius-sm, 10px)' }}
            >
              {loading ? t('loading', lang) : t('login', lang)}
            </button>
          </form>

          {/* 提示信息 */}
          <div
            style={{
              marginTop: '24px',
              padding: '14px',
              background: 'rgba(10,132,255,0.06)',
              border: '1px solid var(--border, rgba(10,132,255,0.15))',
              borderRadius: 'var(--radius-sm, 10px)',
              fontSize: '11px',
              color: 'var(--text-secondary, #86868B)',
              lineHeight: 1.7,
            }}
          >
            💡 <strong style={{ color: 'var(--primary, #0A84FF)' }}>{t('hint', lang)}</strong>
            <br />
            {t('hintDetail', lang)}
          </div>
        </div>
      </div>
    </div>
  );
}