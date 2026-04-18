import type { Config } from 'tailwindcss';

/**
 * TailwindCSS 配置
 * 颜色变量与原型设计稿（admin-dashboard_FINAL.html）保持一致
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色（来自原型设计稿）
        primary: '#0A84FF',
        accent: '#5E5CE6',
        neon: '#64D2FF',
        success: '#30D158',
        warning: '#FF9F0A',
        danger: '#FF453A',
        purple: '#BF5AF2',
        // 暗色主题背景与文字
        'bg-primary': '#000000',
        'bg-card': 'rgba(28,28,32,0.6)',
        'bg-card-solid': '#1c1c20',
        'bg-hover': 'rgba(255,255,255,0.04)',
        'text-primary': '#F5F5F7',
        'text-secondary': '#86868B',
        'border-soft': 'rgba(255,255,255,0.08)',
        'border-strong': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        display: ['"SF Pro Display"', '-apple-system', 'Inter', 'sans-serif'],
        text: ['"SF Pro Text"', '-apple-system', 'Inter', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg,#0A84FF 0%,#5E5CE6 100%)',
        'gradient-text': 'linear-gradient(90deg,#64D2FF 0%,#0A84FF 50%,#5E5CE6 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
