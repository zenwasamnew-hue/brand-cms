/**
 * 根布局组件
 * 作用：定义整个应用的 HTML 结构、字体、全局样式
 * 注意：这个组件包裹所有页面（admin、site 等）
 */
import type { Metadata } from 'next';
import './globals.css';

// 页面元数据（SEO 用）
export const metadata: Metadata = {
  title: 'BRAND CMS',
  description: '品牌官网内容管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-theme="midnight">
      <body>{children}</body>
    </html>
  );
}
