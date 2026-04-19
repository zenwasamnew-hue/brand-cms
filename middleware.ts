/**
 * Next.js 中间件
 * 作用：在每个请求到达页面前执行，用于检查登录状态
 * 文档：https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Inject pathname into request headers so Server Components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // If Supabase is not configured, skip auth checks (dev/demo mode)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 创建响应对象（后续会根据情况修改）
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // 创建 Supabase 客户端（绑定到当前请求的 cookie）
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 获取当前登录用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 规则 1：访问 /admin/* 但未登录 → 跳转到登录页
  if (pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 规则 2：已登录用户访问登录页 → 自动跳转到仪表盘
  if (pathname === '/login' && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return response;
}

// 配置：哪些路径会触发中间件
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
