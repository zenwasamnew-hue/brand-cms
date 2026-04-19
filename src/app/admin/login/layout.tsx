/**
 * 登录页专属布局
 * 作用：pass-through 透传，避免 /admin/login 继承后台主布局（侧栏）
 * 原理：Next.js App Router 中 layout 是层叠的，admin/layout.tsx 会包裹所有 admin/* 路由。
 *       但由于 admin/layout.tsx 内部会判断登录状态——未登录时不渲染侧栏，
 *       此文件仅作为语义占位，确保登录页结构清晰独立。
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
