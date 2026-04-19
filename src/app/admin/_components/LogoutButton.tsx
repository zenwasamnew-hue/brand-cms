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
      // hover:bg-[rgba(255,69,58,0.15)]：悬浮时红色背景，给用户退出的视觉反馈
      className="flex items-center justify-center rounded-[10px] border-none bg-transparent text-lg transition-colors duration-200 hover:bg-[rgba(255,69,58,0.15)]"
      style={{
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      🚪
    </button>
  );
}
