/**
 * 主题初始化器（Client Component）
 * 在页面加载时从 localStorage 读取已保存的主题并应用到 <html>
 * 放在根布局中，确保每次刷新都能恢复主题
 */
'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') ?? 'midnight';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return null;
}
