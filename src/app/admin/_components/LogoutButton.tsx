/**
 * 退出登录按钮（客户端组件）
 * 功能：点击弹出确认对话框，确认后调用 Supabase signOut 并跳转至登录页
 * 使用位置：后台主布局（admin/layout.tsx）的侧栏底部
 */
'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  // 使用浏览器端 Supabase 客户端处理退出
  const supabase = createClient();

  async function handleLogout() {
    // 弹出确认对话框，防止误操作
    if (!confirm('确定退出登录吗？')) return;

    // 调用 Supabase 退出登录接口，清除 session
    await supabase.auth.signOut();

    // 跳转至登录页，并刷新路由缓存
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      title="退出登录"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        // 使用 CSS transition 实现悬浮效果（纯 inline style 无法使用 :hover，改用 onMouseEnter/Leave）
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        // 悬浮时显示红色背景，给用户视觉反馈
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,69,58,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      🚪
    </button>
  );
}
