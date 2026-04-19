'use client';
import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') || 'midnight';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);
  return null;
}
