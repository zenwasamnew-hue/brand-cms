<a href="https://vercel.com/new/clone?repository-url=https://github.com/zenwasamnew-hue/brand-cms"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>

# BRAND CMS

品牌官网内容管理系统，基于 Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase 构建。

## 功能特性

- 🎨 **6 套主题** — Midnight / Silver / Space Gray / Matrix / Sunset / Aurora
- 🌐 **4 种界面语言** — 中文 / English / 日本語 / 한국어
- 📝 **内容编辑器** — Markdown 编辑 + 多端预览
- 📁 **文件管理** — 拖拽上传、网格/列表视图、右键菜单
- 💬 **留言管理** — 状态筛选、详情查看
- 🧩 **模块管理** — 一键启用/禁用页面模块
- ⚙️ **系统设置** — 站点配置与功能开关

## 本地启动

```bash
npm install && npm run dev
# 或
pnpm install && pnpm dev
```

访问 [http://localhost:3000/admin](http://localhost:3000/admin)

## 环境变量

创建 `.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 首次使用

在 Supabase Dashboard → Authentication → Users → Add user 创建账号，然后将 `profiles` 表中的 `role` 改为 `superadmin`。