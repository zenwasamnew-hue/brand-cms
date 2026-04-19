# BRAND CMS

A full-stack brand website CMS built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zenwasamnew-hue/brand-cms)

---

## Features

- 🎨 **6 Themes** – Midnight, Silver, Space Gray, Matrix, Sunset, Aurora
- 🌐 **i18n** – zh / en / ja / ko
- 📝 **Content Editor** – JSON-based per-module, per-language editing
- 🧩 **Module Management** – Toggle and reorder frontend sections
- 💬 **Messages** – Contact form with inbox, status management, and replies
- 📁 **File Manager** – Upload to Supabase Storage, copy public URLs
- ⚙️ **Site Settings** – SEO, contact info, ICP
- 🔐 **Auth** – Supabase Auth with protected admin routes

---

## Quick Start (Local)

```bash
git clone https://github.com/zenwasamnew-hue/brand-cms.git
cd brand-cms
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) – you'll see the frontend.  
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...   # Keep secret – server-side only
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/20260419_init.sql
   ```
3. Go to **Storage** → create a public bucket named **`files`**
4. Go to **Authentication → Users → Add user** to create your admin account
5. Copy the project URL and anon key into `.env.local`

---

## Deploy to Vercel

1. Click the **Deploy** button above  
2. Set the environment variables in Vercel's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Done ✅

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Frontend (public site)
│   ├── login/page.tsx        # Login page
│   ├── admin/
│   │   ├── layout.tsx        # Sidebar layout
│   │   ├── page.tsx          # Dashboard
│   │   ├── editor/           # Content editor
│   │   ├── modules/          # Module manager
│   │   ├── messages/         # Inbox
│   │   ├── files/            # File manager
│   │   ├── i18n/             # Translations
│   │   ├── theme/            # Theme switcher
│   │   └── settings/         # Site settings
│   └── globals.css           # Global styles + 6 theme vars
├── lib/
│   └── supabase/
│       ├── client.ts         # Browser client
│       └── server.ts         # Server client
└── middleware.ts             # Auth protection
supabase/
└── migrations/
    └── 20260419_init.sql     # Full schema + seed data
```
