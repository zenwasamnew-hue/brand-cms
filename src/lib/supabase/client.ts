/**
 * Supabase 浏览器端客户端
 * 用途：在客户端组件 ('use client') 中调用 Supabase
 * 特点：使用 anon key，受 RLS 策略保护
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
