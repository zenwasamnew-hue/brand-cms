'use client';

import { useTheme, themes } from '../_components/ThemeProvider';

const themeDescriptions: Record<string, string> = {
  midnight: '深邃午夜 — 深蓝黑色，冷静专业',
  silver: '银色光晕 — 明亮灰白，简洁现代',
  'space-gray': '太空灰 — 深灰调性，沉稳内敛',
  matrix: '黑客矩阵 — 绿色终端，极客风格',
  sunset: '日落暖橙 — 橙红渐变，充满活力',
  aurora: '极光紫蓝 — 紫色神秘，科技未来',
};

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ padding: '28px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '28px' }}>
        选择后台管理界面的视觉主题。主题偏好会保存在浏览器本地存储中。
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {themes.map((th) => {
          const isActive = theme === th.value;
          return (
            <button
              key={th.value}
              onClick={() => setTheme(th.value)}
              style={{
                padding: '20px', borderRadius: '16px', border: `2px solid ${isActive ? th.swatch : 'var(--border)'}`,
                background: isActive ? `${th.swatch}18` : 'var(--bg-card)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: th.swatch, flexShrink: 0, boxShadow: `0 4px 12px ${th.swatch}66` }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{th.label}</div>
                  {isActive && <span style={{ fontSize: '10px', background: th.swatch, color: '#fff', padding: '1px 8px', borderRadius: '100px', fontWeight: 600 }}>当前</span>}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {themeDescriptions[th.value]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
