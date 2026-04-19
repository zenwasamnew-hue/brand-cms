export type MockMessage = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
};

export type MockFile = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  url: string;
  created_at: string;
};

export type MockModule = {
  id: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  icon: string;
};

export type MockTranslation = {
  key: string;
  zh: string;
  en: string;
  ja: string;
  ko: string;
};

export const mockMessages: MockMessage[] = [
  { id: '1', name: '张三', email: 'zhang@example.com', content: '你好，我想了解你们的品牌服务，请联系我。', status: 'unread', created_at: '2024-01-15T09:23:00Z' },
  { id: '2', name: 'Alice Wang', email: 'alice@example.com', content: 'I would love to collaborate on a design project.', status: 'unread', created_at: '2024-01-14T14:05:00Z' },
  { id: '3', name: '李四', email: 'li@example.com', content: '请问你们有没有企业定制套餐？', status: 'read', created_at: '2024-01-13T10:30:00Z' },
  { id: '4', name: 'Bob Chen', email: 'bob@example.com', content: 'Great portfolio! Would love to work together.', status: 'replied', created_at: '2024-01-12T16:45:00Z' },
  { id: '5', name: '王五', email: 'wang@example.com', content: '想询问一下品牌设计的价格和周期。', status: 'read', created_at: '2024-01-11T11:20:00Z' },
  { id: '6', name: 'Carol Liu', email: 'carol@example.com', content: 'Your work is amazing. Can we schedule a call?', status: 'unread', created_at: '2024-01-10T08:55:00Z' },
];

export const mockFiles: MockFile[] = [
  { id: '1', name: 'hero-banner.jpg', type: 'image', size: 2048000, url: 'https://picsum.photos/seed/1/800/600', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', name: 'logo-white.png', type: 'image', size: 512000, url: 'https://picsum.photos/seed/2/400/400', created_at: '2024-01-14T09:30:00Z' },
  { id: '3', name: 'brand-guide.pdf', type: 'document', size: 5120000, url: '#', created_at: '2024-01-13T14:00:00Z' },
  { id: '4', name: 'portfolio-video.mp4', type: 'video', size: 52428800, url: '#', created_at: '2024-01-12T16:00:00Z' },
  { id: '5', name: 'team-photo.jpg', type: 'image', size: 3145728, url: 'https://picsum.photos/seed/5/800/600', created_at: '2024-01-11T11:00:00Z' },
  { id: '6', name: 'case-study-01.jpg', type: 'image', size: 1536000, url: 'https://picsum.photos/seed/6/800/600', created_at: '2024-01-10T10:00:00Z' },
  { id: '7', name: 'icons-pack.zip', type: 'other', size: 10240000, url: '#', created_at: '2024-01-09T09:00:00Z' },
  { id: '8', name: 'about-bg.jpg', type: 'image', size: 2097152, url: 'https://picsum.photos/seed/8/800/600', created_at: '2024-01-08T08:00:00Z' },
];

export const mockModules: MockModule[] = [
  { id: '1', name: '首页', slug: 'home', description: '网站首页横幅与介绍区块', enabled: true, icon: '🏠' },
  { id: '2', name: '作品集', slug: 'portfolio', description: '品牌设计案例展示', enabled: true, icon: '🎨' },
  { id: '3', name: '关于我们', slug: 'about', description: '团队介绍与公司故事', enabled: true, icon: '👥' },
  { id: '4', name: '服务', slug: 'services', description: '品牌服务项目与定价', enabled: false, icon: '⚡' },
  { id: '5', name: '博客', slug: 'blog', description: '行业见解与案例分享', enabled: false, icon: '📝' },
  { id: '6', name: '联系', slug: 'contact', description: '联系方式与留言表单', enabled: true, icon: '📬' },
];

export const mockTranslations: MockTranslation[] = [
  { key: 'nav.home', zh: '首页', en: 'Home', ja: 'ホーム', ko: '홈' },
  { key: 'nav.portfolio', zh: '作品集', en: 'Portfolio', ja: 'ポートフォリオ', ko: '포트폴리오' },
  { key: 'nav.about', zh: '关于', en: 'About', ja: 'について', ko: '소개' },
  { key: 'nav.contact', zh: '联系', en: 'Contact', ja: 'お問い合わせ', ko: '연락' },
  { key: 'hero.title', zh: '品牌故事，由设计诉说', en: 'Brand Stories, Told Through Design', ja: 'デザインで語るブランドストーリー', ko: '디자인으로 전하는 브랜드 이야기' },
  { key: 'hero.subtitle', zh: '专注品牌视觉设计', en: 'Focused on Brand Visual Design', ja: 'ブランドビジュアルデザインに特化', ko: '브랜드 비주얼 디자인에 집중' },
  { key: 'cta.contact', zh: '联系我们', en: 'Contact Us', ja: 'お問い合わせ', ko: '문의하기' },
  { key: 'footer.rights', zh: '版权所有', en: 'All rights reserved', ja: '全著作権所有', ko: '모든 권리 보유' },
];

export const mockKpi = {
  msgTotal: 6,
  msgUnread: 3,
  pageTotal: 6,
  fileTotal: 8,
  draftTotal: 2,
};
