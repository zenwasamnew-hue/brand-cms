# BRAND CMS - 品牌官网内容管理系统

> 基于 Next.js 14 + Supabase + TypeScript 的现代化 CMS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzenwasamnew-hue%2Fbrand-cms&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20URL%20and%20anon%20key%20from%20Project%20Settings%20%3E%20API&project-name=brand-cms&repository-name=brand-cms)

## 📦 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Next.js | 14 | App Router + Server Components |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | TailwindCSS | 3.x | 原子化 CSS |
| 后端 | Supabase | - | PostgreSQL + Auth + Storage |
| 部署 | Vercel | - | 海外节点 |

## 🚀 本地启动（5 分钟）

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量模板
cp .env.local.example .env.local

# 3. 填写 .env.local 中的 Supabase 配置（见下方）

# 4. 启动开发服务器
npm run dev

# 5. 浏览器打开 http://localhost:3000
```

## 🔑 环境变量配置

打开 `.env.local`，填入你的 Supabase 项目信息：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...你的anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...你的service-role-key（机密）
```

获取位置：Supabase 控制台 → Project Settings → API

## 📁 项目结构

```
brand-cms/
├── src/
│   ├── app/                  # Next.js App Router 路由
│   │   ├── admin/            # 后台管理系统
│   │   ├── (site)/           # 前台官网（待添加）
│   │   ├── layout.tsx        # 根布局
│   │   └── globals.css       # 全局样式
│   └── lib/
│       ├── supabase/         # Supabase 客户端封装
│       └── types.ts          # 数据库类型定义
├── public/                   # 静态资源
├── docs/                     # 文档
└── middleware.ts             # 鉴权中间件
```

## 👥 默认账号

首次部署后，需在 Supabase Auth 后台手动创建第一个超管账号：

1. Supabase 控制台 → Authentication → Users → Add user
2. 输入邮箱 + 密码
3. 进入 Table Editor → profiles，把对应用户的 role 改为 `superadmin`

## 📚 给团队的文档

- 项目接管手册：`docs/HANDOFF.md`
- 数据库 Schema：见 SQL 脚本与 `src/lib/types.ts`

## 📜 License

私有项目，未经授权禁止复制。

## 🚀 部署到 Vercel

### 一键部署（推荐）

点击上方 **Deploy with Vercel** 按钮，按提示填写环境变量即可。

### 手动部署步骤

1. 注册 / 登录 [vercel.com](https://vercel.com)
2. 点击 **New Project** → 选择 `brand-cms` 仓库 → **Import**
3. 在 **Environment Variables** 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL` → 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → 你的 anon key
   - `NEXT_PUBLIC_SITE_URL` → 部署后的 `https://xxx.vercel.app`（可先填占位符）
4. 点击 **Deploy**，等待约 1 分钟
5. 部署成功后访问 `https://你的域名.vercel.app/admin/login`

> 💡 域名还没买没关系，Vercel 会分配免费的 `*.vercel.app` 子域名，展示用完全够用。

---