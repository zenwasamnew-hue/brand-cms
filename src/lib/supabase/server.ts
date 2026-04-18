/**
 * Supabase 服务端客户端
 * 用途：在 Server Components / Route Handlers / Server Actions 中调用
 * 特点：自动处理 Cookie，可识别已登录用户
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 在 Server Component 中调用 set 会抛错，可忽略（中间件会处理）
          }
        },
      },
    }
  );
}

/**
 * 创建管理员客户端（service_role）
 * 警告：此客户端绕过所有 RLS，仅在确认安全的服务端代码中使用
 */
import { createClient as createSbClient } from '@supabase/supabase-js';
export function createAdminClient() {
  return createSbClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
