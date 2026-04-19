'use client';

import { useState } from 'react';
import { useLang } from '../_components/UiLangProvider';

type Device = 'desktop' | 'tablet' | 'mobile';
type ContentLang = 'zh' | 'en' | 'ja' | 'ko';

const modules = [
  { id: 'home',      label: '首页横幅',  icon: '🏠' },
  { id: 'portfolio', label: '作品展示',  icon: '🎨' },
  { id: 'about',     label: '关于我们',  icon: '👥' },
  { id: 'services',  label: '服务介绍',  icon: '⚡' },
  { id: 'contact',   label: '联系我们',  icon: '📬' },
];

const defaultContent: Record<string, Record<ContentLang, string>> = {
  home: {
    zh: '# 品牌故事，由设计诉说\n\n专注于打造令人难忘的视觉体验，让每个品牌都焕发独特光芒。\n\n**核心优势**\n- 专业品牌策划\n- 视觉识别系统\n- 多媒体内容制作',
    en: '# Brand Stories, Told Through Design\n\nFocused on creating memorable visual experiences that make every brand shine.\n\n**Core Strengths**\n- Professional brand strategy\n- Visual identity systems\n- Multimedia content production',
    ja: '# デザインで語るブランドストーリー\n\n忘れられないビジュアル体験の創造に特化しています。\n\n**コアバリュー**\n- プロフェッショナルなブランド戦略\n- ビジュアルアイデンティティシステム',
    ko: '# 디자인으로 전하는 브랜드 이야기\n\n잊을 수 없는 시각적 경험을 만드는 데 집중합니다.\n\n**핵심 강점**\n- 전문 브랜드 전략\n- 비주얼 아이덴티티 시스템',
  },
  portfolio: { zh: '# 精选作品\n\n展示我们最引以为豪的品牌设计项目。', en: '# Featured Work\n\nOur finest brand design projects.', ja: '# 厳選作品', ko: '# 선별된 작품' },
  about: { zh: '# 关于我们\n\n一支充满热情的创意团队。', en: '# About Us\n\nA passionate creative team.', ja: '# 私たちについて', ko: '# 우리에 대해' },
  services: { zh: '# 服务项目\n\n全方位品牌服务解决方案。', en: '# Services\n\nFull-spectrum brand services.', ja: '# サービス', ko: '# 서비스' },
  contact: { zh: '# 联系我们\n\n期待与您合作。', en: '# Contact Us\n\nLooking forward to collaborating.', ja: '# お問い合わせ', ko: '# 연락처' },
};

const deviceWidths: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

export default function EditorPage() {
  const { t } = useLang();
  const [activeModule, setActiveModule] = useState('home');
  const [contentLang, setContentLang] = useState<ContentLang>('zh');
  const [device, setDevice] = useState<Device>('desktop');
  const [contents, setContents] = useState(defaultContent);
  const [saved, setSaved] = useState(false);

  const currentContent = contents[activeModule]?.[contentLang] ?? '';

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function renderPreview(md: string) {
    return md
      .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:800;margin:0 0 12px">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:700;margin:16px 0 8px">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li style="margin:4px 0;padding-left:8px">$1</li>')
      .replace(/\n\n/g, '<br/><br/>');
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 53px)', overflow: 'hidden' }}>
      {/* Left panel: modules */}
      <div style={{ width: '200px', borderRight: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 12px 8px', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>模块</div>
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
              background: activeModule === m.id ? 'rgba(10,132,255,0.12)' : 'transparent',
              border: 'none', borderLeft: activeModule === m.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeModule === m.id ? 'var(--accent)' : 'var(--text-primary)', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeModule === m.id ? 600 : 400, textAlign: 'left', width: '100%',
            }}
          >
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {/* Center: editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)' }}>
          {/* Device toggle */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['desktop','tablet','mobile'] as Device[]).map((d) => (
              <button key={d} onClick={() => setDevice(d)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: device === d ? 'var(--accent)' : 'transparent', color: device === d ? '#fff' : 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer' }}>
                {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📲'}
              </button>
            ))}
          </div>
          {/* Content lang */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
            {(['zh','en','ja','ko'] as ContentLang[]).map((l) => (
              <button key={l} onClick={() => setContentLang(l)} style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: contentLang === l ? 'var(--accent)' : 'transparent', color: contentLang === l ? '#fff' : 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleSave} style={{ padding: '5px 14px', borderRadius: '8px', background: saved ? '#30D158' : 'var(--accent)', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}>
            {saved ? '✓ 已保存' : t.common.save}
          </button>
        </div>
        <textarea
          value={currentContent}
          onChange={(e) => setContents((prev) => ({ ...prev, [activeModule]: { ...prev[activeModule], [contentLang]: e.target.value } }))}
          style={{ flex: 1, padding: '20px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: 'none', outline: 'none', resize: 'none', fontSize: '14px', fontFamily: 'monospace', lineHeight: 1.7 }}
          placeholder="在此输入 Markdown 内容..."
        />
      </div>

      {/* Right: preview */}
      <div style={{ width: '420px', borderLeft: '1px solid var(--border)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          预览 · {device} · {deviceWidths[device]}
        </div>
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <div
            style={{ width: deviceWidths[device], maxWidth: '100%', background: '#fff', borderRadius: '12px', padding: '24px', color: '#1d1d1f', fontSize: '15px', lineHeight: 1.8, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', transition: 'width 0.3s' }}
            dangerouslySetInnerHTML={{ __html: renderPreview(currentContent) }}
          />
        </div>
      </div>
    </div>
  );
}
