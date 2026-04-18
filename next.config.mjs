/**
 * Next.js 配置文件
 * 文档：https://nextjs.org/docs/app/api-reference/next-config-js
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // 允许加载来自 Supabase Storage 的图片
        hostname: '**.supabase.co',
      },
    ],
  },
  // 严格模式：开发时检测潜在问题
  reactStrictMode: true,
};

export default nextConfig;
