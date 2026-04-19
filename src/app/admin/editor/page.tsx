'use client';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../_components/ThemeSwitcher';
import LangSwitcher from '../_components/LangSwitcher';
import { UI_I18N, type Lang } from '@/lib/i18n';
import Link from 'next/link';

const MODULES = [
  { id: 'hero', label: { zh: '首页横幅', en: 'Hero', ja: 'ヒーロー', ko: '히어로' } },
  { id: 'services', label: { zh: '服务介绍', en: 'Services', ja: 'サービス', ko: '서비스' } },
  { id: 'about', label: { zh: '关于我们', en: 'About', ja: '会社概要', ko: '소개' } },
  { id: 'stats', label: { zh: '数据统计', en: 'Stats', ja: '統計', ko: '통계' } },
  { id: 'partners', label: { zh: '合作伙伴', en: 'Partners', ja: 'パートナー', ko: '파트너' } },
  { id: 'contact', label: { zh: '联系我们', en: 'Contact', ja: 'お問い合わせ', ko: '연락처' } },
  { id: 'footer', label: { zh: '页脚', en: 'Footer', ja: 'フッター', ko: '푸터' } },
];

const CONTENT_LANGS: { id: string; label: string }[] = [
  { id: 'zh', label: '中文' },
  { id: 'en', label: 'English' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
];

const DEVICE_TABS = [
  { id: 'desktop', label: '🖥', width: '100%' },
  { id: 'tablet', label: '📱', width: '768px' },
  { id: 'mobile', label: '📲', width: '375px' },
];

type ModuleData = {
  hero: { heading: string; subheading: string; cta: string; ctaSecondary: string; badge: string };
  services: { heading: string; items: { icon: string; title: string; desc: string }[] };
  about: { heading: string; body: string; image: string };
  stats: { items: { value: string; label: string }[] };
  partners: { heading: string; items: string[] };
  contact: { heading: string; email: string; phone: string };
  footer: { copyright: string; links: string[] };
};

const DEFAULT_DATA: ModuleData = {
  hero: { heading: '创建令人惊叹的品牌', subheading: '一站式品牌内容管理系统，让您的品牌故事触达每一个用户', cta: '开始使用', ctaSecondary: '了解更多', badge: '🚀 全新升级' },
  services: { heading: '我们的服务', items: [
    { icon: '🎨', title: '品牌设计', desc: '专业的品牌视觉识别系统设计' },
    { icon: '🌐', title: '网站开发', desc: '现代化响应式网站开发与优化' },
    { icon: '📊', title: '数据分析', desc: '全面的数据追踪与用户行为分析' },
  ]},
  about: { heading: '关于我们', body: '我们是一家专注于品牌建设的创意团队，致力于帮助企业打造独特的品牌形象。', image: '' },
  stats: { items: [
    { value: '500+', label: '服务客户' },
    { value: '98%', label: '客户满意度' },
    { value: '50+', label: '团队成员' },
    { value: '10年', label: '行业经验' },
  ]},
  partners: { heading: '合作伙伴', items: ['Apple', 'Google', 'Microsoft', 'Meta', 'Amazon', 'Tesla'] },
  contact: { heading: '联系我们', email: 'hello@brand.com', phone: '+86 138 0000 0000' },
  footer: { copyright: '© 2024 Brand. All rights reserved.', links: ['隐私政策', '服务条款', 'Cookie 设置'] },
};

function HeroPreview({ data }: { data: ModuleData['hero'] }) {
  return (
    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(10,132,255,0.1) 0%, transparent 100%)' }}>
      <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '100px', background: 'rgba(10,132,255,0.15)', border: '1px solid rgba(10,132,255,0.3)', fontSize: '13px', color: '#64D2FF', marginBottom: '20px' }}>
        {data.badge}
      </div>
      <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px', background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{data.heading}</h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 28px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>{data.subheading}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>{data.cta}</button>
        <button className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>{data.ctaSecondary}</button>
      </div>
    </div>
  );
}

function ServicesPreview({ data }: { data: ModuleData['services'] }) {
  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 24px', textAlign: 'center', color: 'var(--text-primary)' }}>{data.heading}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {data.items.map((item, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{item.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericPreview({ module, data }: { module: string; data: ModuleData }) {
  if (module === 'hero') return <HeroPreview data={data.hero} />;
  if (module === 'services') return <ServicesPreview data={data.services} />;
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {module === 'about' ? '🏢' : module === 'stats' ? '📊' : module === 'partners' ? '🤝' : module === 'contact' ? '📬' : '📄'}
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
        {MODULES.find(m => m.id === module)?.label.zh}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>预览区域</p>
    </div>
  );
}

export default function EditorPage() {
  const [lang, setLang] = useState<Lang>('zh');
  const [contentLang, setContentLang] = useState('zh');
  const [activeModule, setActiveModule] = useState('hero');
  const [device, setDevice] = useState('desktop');
  const [data, setData] = useState<ModuleData>(DEFAULT_DATA);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('admin-lang') || 'zh') as Lang;
    setLang(savedLang);
    const handler = () => {
      setLang((localStorage.getItem('admin-lang') || 'zh') as Lang);
    };
    window.addEventListener('admin-lang-change', handler);

    const savedData = localStorage.getItem('editor-draft');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch {
        localStorage.removeItem('editor-draft');
      }
    }
    return () => window.removeEventListener('admin-lang-change', handler);
  }, []);

  function handleSave() {
    localStorage.setItem('editor-draft', JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    localStorage.removeItem('editor-draft');
    setData(DEFAULT_DATA);
  }

  const dict = UI_I18N[lang];
  const deviceConfig = DEVICE_TABS.find(d => d.id === device)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Topbar */}
      <div style={{
        height: '56px', display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-topbar)', backdropFilter: 'blur(20px)', flexShrink: 0, zIndex: 50,
      }}>
        <Link href="/admin/dashboard" style={{
          width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px',
        }}>←</Link>

        <select
          value={activeModule}
          onChange={e => setActiveModule(e.target.value)}
          className="admin-input admin-select"
          style={{ width: '160px', padding: '6px 32px 6px 12px', height: '34px' }}
        >
          {MODULES.map(m => <option key={m.id} value={m.id}>{m.label[lang as keyof typeof m.label]}</option>)}
        </select>

        <select
          value={contentLang}
          onChange={e => setContentLang(e.target.value)}
          className="admin-input admin-select"
          style={{ width: '100px', padding: '6px 32px 6px 12px', height: '34px' }}
        >
          {CONTENT_LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>

        <span style={{
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
          background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.3)',
          color: 'var(--color-success)', fontSize: '11px', fontWeight: 600,
        }}>● 草稿</span>

        <div style={{ flex: 1 }} />

        <button onClick={handleReset} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>{dict.reset}</button>
        <button onClick={handleSave} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
          {saved ? '✓ 已保存' : dict.save}
        </button>
        <LangSwitcher />
        <ThemeSwitcher />
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Editor panel */}
        <div style={{
          width: '460px', flexShrink: 0, borderRight: '1px solid var(--border)',
          background: 'var(--bg-sidebar)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', gap: '2px', padding: '12px 16px 0',
            borderBottom: '1px solid var(--border)', overflowX: 'auto',
          }}>
            {MODULES.map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)} style={{
                padding: '7px 12px', borderRadius: '8px 8px 0 0', border: 'none',
                background: activeModule === m.id ? 'var(--bg-card)' : 'transparent',
                color: activeModule === m.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '12px', fontWeight: activeModule === m.id ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: activeModule === m.id ? '2px solid var(--primary)' : '2px solid transparent',
              }}>
                {m.label[lang as keyof typeof m.label]}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
            {activeModule === 'hero' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { field: 'badge', label: '徽标文案' },
                  { field: 'heading', label: '主标题' },
                  { field: 'cta', label: '主按钮文案' },
                  { field: 'ctaSecondary', label: '次要按钮文案' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</label>
                    <input className="admin-input" value={data.hero[field as keyof typeof data.hero] as string}
                      onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, [field]: e.target.value } }))} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>副标题</label>
                  <textarea className="admin-input" value={data.hero.subheading}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, subheading: e.target.value } }))} />
                </div>
              </div>
            )}

            {activeModule === 'services' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>版块标题</label>
                  <input className="admin-input" value={data.services.heading}
                    onChange={e => setData(prev => ({ ...prev, services: { ...prev.services, heading: e.target.value } }))} />
                </div>
                {data.services.items.map((item, i) => (
                  <div key={i} className="glass-card" style={{ padding: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>服务项 {i + 1}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(['icon', 'title', 'desc'] as const).map(f => (
                        <input key={f} className="admin-input" value={item[f]} placeholder={f}
                          onChange={e => {
                            const items = [...data.services.items]; items[i] = { ...items[i], [f]: e.target.value };
                            setData(prev => ({ ...prev, services: { ...prev.services, items } }));
                          }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeModule === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>标题</label>
                  <input className="admin-input" value={data.about.heading}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, heading: e.target.value } }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>正文内容</label>
                  <textarea className="admin-input" style={{ minHeight: '120px' }} value={data.about.body}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, body: e.target.value } }))} />
                </div>
              </div>
            )}

            {activeModule === 'stats' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.stats.items.map((item, i) => (
                  <div key={i} className="glass-card" style={{ padding: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>统计项 {i + 1}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="admin-input" value={item.value} placeholder="数值"
                        onChange={e => { const items = [...data.stats.items]; items[i] = { ...items[i], value: e.target.value }; setData(prev => ({ ...prev, stats: { ...prev.stats, items } })); }} />
                      <input className="admin-input" value={item.label} placeholder="标签"
                        onChange={e => { const items = [...data.stats.items]; items[i] = { ...items[i], label: e.target.value }; setData(prev => ({ ...prev, stats: { ...prev.stats, items } })); }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeModule === 'partners' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>标题</label>
                  <input className="admin-input" value={data.partners.heading}
                    onChange={e => setData(prev => ({ ...prev, partners: { ...prev.partners, heading: e.target.value } }))} />
                </div>
                {data.partners.items.map((item, i) => (
                  <input key={i} className="admin-input" value={item} placeholder={`合作伙伴 ${i + 1}`}
                    onChange={e => { const items = [...data.partners.items]; items[i] = e.target.value; setData(prev => ({ ...prev, partners: { ...prev.partners, items } })); }} />
                ))}
              </div>
            )}

            {activeModule === 'contact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { field: 'heading', label: '标题', type: 'text' },
                  { field: 'email', label: '邮箱', type: 'email' },
                  { field: 'phone', label: '电话', type: 'text' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</label>
                    <input type={type} className="admin-input" value={data.contact[field as keyof typeof data.contact]}
                      onChange={e => setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: e.target.value } }))} />
                  </div>
                ))}
              </div>
            )}

            {activeModule === 'footer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>版权信息</label>
                  <input className="admin-input" value={data.footer.copyright}
                    onChange={e => setData(prev => ({ ...prev, footer: { ...prev.footer, copyright: e.target.value } }))} />
                </div>
                {data.footer.links.map((link, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase' }}>链接 {i + 1}</label>
                    <input className="admin-input" value={link}
                      onChange={e => { const links = [...data.footer.links]; links[i] = e.target.value; setData(prev => ({ ...prev, footer: { ...prev.footer, links } })); }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', gap: '6px', alignItems: 'center',
          }}>
            {DEVICE_TABS.map(d => (
              <button key={d.id} onClick={() => setDevice(d.id)} style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: device === d.id ? 'var(--gradient-main)' : 'var(--bg-card)',
                color: device === d.id ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px', cursor: 'pointer',
                boxShadow: device === d.id ? 'var(--shadow-glow)' : 'none',
              }}>{d.label} {d.id}</button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {deviceConfig.width} · {lang === 'zh' ? '实时预览' : 'Live Preview'}
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: deviceConfig.width,
              maxWidth: '100%',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              background: 'var(--bg-base)',
              minHeight: '400px',
            }}>
              <GenericPreview module={activeModule} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
