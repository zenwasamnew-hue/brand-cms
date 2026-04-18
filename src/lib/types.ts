/**
 * 数据库类型定义
 * 对应数据库 8 张表的 TypeScript 类型
 * 维护：当 SQL schema 变更时同步更新此文件
 */

// 用户角色枚举
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'viewer';

// 支持的语言
export type Language = 'zh' | 'en' | 'ja' | 'ko';

// 多语言文本（如 {zh:"首页", en:"Home"}）
export type LocalizedText = Partial<Record<Language, string>>;

// 用户档案
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  language: Language;
  created_at: string;
  updated_at: string;
}

// 页面/内容
export interface Page {
  id: string;
  slug: string;
  title: LocalizedText;
  content: Record<string, unknown>;
  meta: Record<string, unknown>;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

// 留言
export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  content: string;
  source_lang: Language;
  source_page: string | null;
  source_country: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: 'unread' | 'read' | 'replied' | 'archived' | 'spam';
  is_starred: boolean;
  reply_content: string | null;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
}

// 文件
export interface FileItem {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string | null;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  folder: string;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// 翻译
export interface Translation {
  id: string;
  namespace: string;
  key: string;
  zh: string | null;
  en: string | null;
  ja: string | null;
  ko: string | null;
  description: string | null;
  updated_at: string;
}

// 站点设置
export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

// 模块定义
export interface Module {
  id: string;
  code: string;
  name: LocalizedText;
  category: string;
  icon: string | null;
  schema: Record<string, unknown>;
  default_data: Record<string, unknown>;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
}

// 访问事件
export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_path: string | null;
  visitor_id: string | null;
  session_id: string | null;
  country: string | null;
  device_type: string | null;
  browser: string | null;
  referrer: string | null;
  duration_seconds: number | null;
  meta: Record<string, unknown>;
  created_at: string;
}