# BRAND CMS - 品牌官网内容管理系统

<a href="https://vercel.com/new/clone?repository-url=https://github.com/zenwasamnew-hue/brand-cms"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>

> 基于 Next.js 14 + TypeScript + Tailwind CSS 的现代化品牌 CMS，无需 Supabase 即可部署（演示模式）

## 📦 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Next.js | 14 | App Router + Server Components |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | TailwindCSS | 3.x | 原子化 CSS |
| 后端 | Supabase | - | PostgreSQL + Auth + Storage |
| 部署 | Vercel | - | 海外节点 |

## 🚀 本地启动（2 分钟）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器打开 http://localhost:3000
#    → 自动跳转到 /login，任意邮箱 + 任意密码即可登录（演示模式）
```

## ☁️ 一键部署到 Vercel

点击顶部 **Deploy with Vercel** 按钮，或手动操作：

1. 进入 https://vercel.com/new
2. Import `zenwasamnew-hue/brand-cms`
3. 无需配置任何环境变量
4. 点击 **Deploy**，约 1 分钟后获得 `*.vercel.app` 域名

> 演示模式下无需 Supabase，任意邮箱 + 任意密码登录。

## 🔑 演示账号

**任意邮箱 + 任意密码** 均可登录（前端 mock，无真实鉴权）。

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
---