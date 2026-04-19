-- Enable RLS helper
create extension if not exists "uuid-ossp";

-- 1. site_settings
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;
create policy "Anyone can read site_settings" on site_settings for select using (true);
create policy "Authenticated can write site_settings" on site_settings for all using (auth.role() = 'authenticated');

-- 2. modules
create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  enabled boolean default true,
  sort_order int default 0,
  updated_at timestamptz default now()
);
alter table modules enable row level security;
create policy "Anyone can read modules" on modules for select using (true);
create policy "Authenticated can write modules" on modules for all using (auth.role() = 'authenticated');

-- 3. module_contents
create table if not exists module_contents (
  id uuid primary key default gen_random_uuid(),
  module_key text not null references modules(key) on delete cascade,
  lang text not null check (lang in ('zh','en','ja','ko')),
  content jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique(module_key, lang)
);
alter table module_contents enable row level security;
create policy "Anyone can read module_contents" on module_contents for select using (true);
create policy "Authenticated can write module_contents" on module_contents for all using (auth.role() = 'authenticated');

-- 4. messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  status text default 'unread' check (status in ('unread','read','replied','archived')),
  reply text,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "Anyone can submit messages" on messages for insert with check (true);
create policy "Authenticated can read messages" on messages for select using (auth.role() = 'authenticated');
create policy "Authenticated can update messages" on messages for update using (auth.role() = 'authenticated');
create policy "Authenticated can delete messages" on messages for delete using (auth.role() = 'authenticated');

-- 5. files
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text not null,
  url text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_at timestamptz default now()
);
alter table files enable row level security;
create policy "Anyone can read files" on files for select using (true);
create policy "Authenticated can write files" on files for all using (auth.role() = 'authenticated');

-- 6. translations
create table if not exists translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  key text not null,
  zh text,
  en text,
  ja text,
  ko text,
  unique(namespace, key)
);
alter table translations enable row level security;
create policy "Anyone can read translations" on translations for select using (true);
create policy "Authenticated can write translations" on translations for all using (auth.role() = 'authenticated');

-- Storage bucket (note: Supabase Dashboard may need manual creation of bucket named 'files')

-- ============ SEED DATA ============

-- site_settings defaults
insert into site_settings (key, value) values
('site_name', '"BRAND"'),
('logo_url', '""'),
('theme', '"midnight"'),
('default_lang', '"zh"'),
('seo_title', '"BRAND - 专业品牌解决方案"'),
('seo_description', '"为企业打造专业品牌形象，提供全方位品牌管理与内容发布服务"'),
('contact_email', '"contact@brand.com"'),
('contact_phone', '"+86 400-000-0000"'),
('contact_address', '"上海市静安区"'),
('icp', '""')
on conflict (key) do nothing;

-- modules seed
insert into modules (key, label, enabled, sort_order) values
('hero', 'Hero 主图', true, 1),
('services', '服务', true, 2),
('about', '关于我们', true, 3),
('stats', '数据统计', true, 4),
('partners', '合作伙伴', true, 5),
('contact', '联系我们', true, 6),
('links', '外部链接', true, 7),
('downloads', '下载资源', true, 8),
('footer', '页脚', true, 9)
on conflict (key) do nothing;

-- module_contents (Chinese defaults)
insert into module_contents (module_key, lang, content) values
('hero','zh','{"pill":"新一代品牌管理","title":"打造卓越<br>品牌形象","subtitle":"为您的企业提供专业品牌管理与内容发布平台","cta_primary":"立即开始","cta_secondary":"了解更多"}'),
('hero','en','{"pill":"Next-gen Brand Management","title":"Build Outstanding<br>Brand Identity","subtitle":"Professional brand management and content publishing platform for your business","cta_primary":"Get Started","cta_secondary":"Learn More"}'),
('hero','ja','{"pill":"次世代ブランド管理","title":"卓越したブランドを<br>構築する","subtitle":"ビジネスのためのプロフェッショナルなブランド管理プラットフォーム","cta_primary":"始める","cta_secondary":"詳細を見る"}'),
('hero','ko','{"pill":"차세대 브랜드 관리","title":"탁월한 브랜드를<br>구축하세요","subtitle":"비즈니스를 위한 전문 브랜드 관리 및 콘텐츠 게시 플랫폼","cta_primary":"시작하기","cta_secondary":"더 알아보기"}'),
('services','zh','{"title":"我们的服务","items":[{"icon":"🎨","title":"品牌设计","desc":"专业视觉识别系统设计"},{"icon":"📱","title":"数字营销","desc":"全渠道数字营销策略"},{"icon":"📊","title":"数据分析","desc":"深度用户行为分析"},{"icon":"🌐","title":"官网建设","desc":"高转化率官网开发"},{"icon":"📝","title":"内容策略","desc":"专业内容规划与创作"},{"icon":"🤝","title":"品牌咨询","desc":"一对一品牌诊断咨询"}]}'),
('services','en','{"title":"Our Services","items":[{"icon":"🎨","title":"Brand Design","desc":"Professional visual identity systems"},{"icon":"📱","title":"Digital Marketing","desc":"Omnichannel digital marketing strategy"},{"icon":"📊","title":"Data Analytics","desc":"In-depth user behavior analysis"},{"icon":"🌐","title":"Website Development","desc":"High-conversion website development"},{"icon":"📝","title":"Content Strategy","desc":"Professional content planning"},{"icon":"🤝","title":"Brand Consulting","desc":"One-on-one brand consulting"}]}'),
('services','ja','{"title":"私たちのサービス","items":[{"icon":"🎨","title":"ブランドデザイン","desc":"プロフェッショナルなVI設計"},{"icon":"📱","title":"デジタルマーケティング","desc":"オムニチャネル戦略"},{"icon":"📊","title":"データ分析","desc":"詳細なユーザー行動分析"},{"icon":"🌐","title":"ウェブサイト開発","desc":"高コンバージョンサイト"},{"icon":"📝","title":"コンテンツ戦略","desc":"プロのコンテンツ企画"},{"icon":"🤝","title":"ブランドコンサルティング","desc":"1対1のコンサル"}]}'),
('services','ko','{"title":"우리의 서비스","items":[{"icon":"🎨","title":"브랜드 디자인","desc":"전문 시각 아이덴티티 설계"},{"icon":"📱","title":"디지털 마케팅","desc":"옴니채널 디지털 마케팅"},{"icon":"📊","title":"데이터 분석","desc":"심층 사용자 행동 분석"},{"icon":"🌐","title":"웹사이트 개발","desc":"고전환율 웹사이트"},{"icon":"📝","title":"콘텐츠 전략","desc":"전문 콘텐츠 기획"},{"icon":"🤝","title":"브랜드 컨설팅","desc":"1:1 브랜드 컨설팅"}]}'),
('about','zh','{"title":"关于我们","subtitle":"我们是一支充满激情的专业团队","desc":"自2018年成立以来，我们已为超过500家企业提供专业品牌服务，覆盖互联网、金融、消费品等多个行业。","features":["专业团队","客户为先","持续创新","品质保证"]}'),
('about','en','{"title":"About Us","subtitle":"A passionate professional team","desc":"Since 2018, we have served over 500 enterprises across internet, finance, and consumer goods industries.","features":["Expert Team","Client First","Continuous Innovation","Quality Assurance"]}'),
('about','ja','{"title":"私たちについて","subtitle":"情熱あふれるプロのチーム","desc":"2018年の創設以来、500社以上の企業に専門的なブランドサービスを提供しています。","features":["専門チーム","顧客優先","継続的革新","品質保証"]}'),
('about','ko','{"title":"우리에 대해","subtitle":"열정적인 전문 팀","desc":"2018년 설립 이래 500개 이상의 기업에 전문 브랜드 서비스를 제공해 왔습니다.","features":["전문 팀","고객 우선","지속적 혁신","품질 보증"]}'),
('stats','zh','{"items":[{"num":500,"suffix":"+","label":"服务客户"},{"num":98,"suffix":"%","label":"客户满意度"},{"num":6,"suffix":"年","label":"行业经验"},{"num":50,"suffix":"+","label":"专业团队"}]}'),
('stats','en','{"items":[{"num":500,"suffix":"+","label":"Clients"},{"num":98,"suffix":"%","label":"Satisfaction"},{"num":6,"suffix":"yr","label":"Experience"},{"num":50,"suffix":"+","label":"Team Members"}]}'),
('stats','ja','{"items":[{"num":500,"suffix":"+","label":"顧客"},{"num":98,"suffix":"%","label":"満足度"},{"num":6,"suffix":"年","label":"経験"},{"num":50,"suffix":"+","label":"チーム"}]}'),
('stats','ko','{"items":[{"num":500,"suffix":"+","label":"고객"},{"num":98,"suffix":"%","label":"만족도"},{"num":6,"suffix":"년","label":"경험"},{"num":50,"suffix":"+","label":"팀 멤버"}]}'),
('partners','zh','{"title":"合作伙伴","items":[{"name":"Partner A"},{"name":"Partner B"},{"name":"Partner C"},{"name":"Partner D"},{"name":"Partner E"},{"name":"Partner F"}]}'),
('partners','en','{"title":"Partners","items":[{"name":"Partner A"},{"name":"Partner B"},{"name":"Partner C"},{"name":"Partner D"},{"name":"Partner E"},{"name":"Partner F"}]}'),
('partners','ja','{"title":"パートナー","items":[{"name":"Partner A"},{"name":"Partner B"},{"name":"Partner C"},{"name":"Partner D"},{"name":"Partner E"},{"name":"Partner F"}]}'),
('partners','ko','{"title":"파트너","items":[{"name":"Partner A"},{"name":"Partner B"},{"name":"Partner C"},{"name":"Partner D"},{"name":"Partner E"},{"name":"Partner F"}]}'),
('contact','zh','{"title":"联系我们","subtitle":"让我们开始一段合作","email":"contact@brand.com","phone":"+86 400-000-0000","address":"上海市静安区","form_name":"姓名","form_email":"邮箱","form_subject":"主题","form_body":"留言内容","form_submit":"发送留言"}'),
('contact','en','{"title":"Contact Us","subtitle":"Let us start a collaboration","email":"contact@brand.com","phone":"+86 400-000-0000","address":"Shanghai, China","form_name":"Name","form_email":"Email","form_subject":"Subject","form_body":"Message","form_submit":"Send Message"}'),
('contact','ja','{"title":"お問い合わせ","subtitle":"コラボレーションを始めましょう","email":"contact@brand.com","phone":"+86 400-000-0000","address":"上海市静安区","form_name":"お名前","form_email":"メール","form_subject":"件名","form_body":"メッセージ","form_submit":"送信"}'),
('contact','ko','{"title":"연락하기","subtitle":"협력을 시작해 봅시다","email":"contact@brand.com","phone":"+86 400-000-0000","address":"상하이, 중국","form_name":"이름","form_email":"이메일","form_subject":"제목","form_body":"메시지","form_submit":"메시지 보내기"}'),
('links','zh','{"title":"找到我们","items":[{"icon":"🐦","name":"Twitter","url":"#"},{"icon":"💼","name":"LinkedIn","url":"#"},{"icon":"📘","name":"微信公众号","url":"#"},{"icon":"🎵","name":"抖音","url":"#"}]}'),
('links','en','{"title":"Find Us","items":[{"icon":"🐦","name":"Twitter","url":"#"},{"icon":"💼","name":"LinkedIn","url":"#"},{"icon":"📘","name":"WeChat","url":"#"},{"icon":"🎵","name":"TikTok","url":"#"}]}'),
('links','ja','{"title":"見つけてください","items":[{"icon":"🐦","name":"Twitter","url":"#"},{"icon":"💼","name":"LinkedIn","url":"#"},{"icon":"📘","name":"WeChat","url":"#"},{"icon":"🎵","name":"TikTok","url":"#"}]}'),
('links','ko','{"title":"찾아보세요","items":[{"icon":"🐦","name":"Twitter","url":"#"},{"icon":"💼","name":"LinkedIn","url":"#"},{"icon":"📘","name":"WeChat","url":"#"},{"icon":"🎵","name":"TikTok","url":"#"}]}'),
('downloads','zh','{"title":"下载资源","items":[{"icon":"📄","name":"品牌手册","desc":"完整品牌视觉指南","size":"2.4 MB","url":"#"},{"icon":"📊","name":"媒体资料包","desc":"高清 Logo 及品牌素材","size":"8.1 MB","url":"#"},{"icon":"📋","name":"产品介绍","desc":"产品功能详细说明","size":"1.2 MB","url":"#"}]}'),
('downloads','en','{"title":"Downloads","items":[{"icon":"📄","name":"Brand Guide","desc":"Complete brand visual guide","size":"2.4 MB","url":"#"},{"icon":"📊","name":"Media Kit","desc":"High-res logo and brand assets","size":"8.1 MB","url":"#"},{"icon":"📋","name":"Product Brief","desc":"Detailed product documentation","size":"1.2 MB","url":"#"}]}'),
('downloads','ja','{"title":"ダウンロード","items":[{"icon":"📄","name":"ブランドガイド","desc":"完全なブランドビジュアルガイド","size":"2.4 MB","url":"#"},{"icon":"📊","name":"メディアキット","desc":"高解像度ロゴとブランド素材","size":"8.1 MB","url":"#"},{"icon":"📋","name":"製品概要","desc":"詳細な製品ドキュメント","size":"1.2 MB","url":"#"}]}'),
('downloads','ko','{"title":"다운로드","items":[{"icon":"📄","name":"브랜드 가이드","desc":"완전한 브랜드 비주얼 가이드","size":"2.4 MB","url":"#"},{"icon":"📊","name":"미디어 킷","desc":"고해상도 로고 및 브랜드 에셋","size":"8.1 MB","url":"#"},{"icon":"📋","name":"제품 소개서","desc":"상세 제품 문서","size":"1.2 MB","url":"#"}]}'),
('footer','zh','{"brand":"BRAND","tagline":"专业品牌管理平台","cols":[{"title":"服务","links":[{"label":"品牌设计","href":"#services"},{"label":"数字营销","href":"#services"},{"label":"数据分析","href":"#services"}]},{"title":"公司","links":[{"label":"关于我们","href":"#about"},{"label":"合作伙伴","href":"#partners"},{"label":"联系我们","href":"#contact"}]},{"title":"资源","links":[{"label":"下载中心","href":"#downloads"},{"label":"新闻资讯","href":"#"},{"label":"帮助中心","href":"#"}]}],"copyright":"© 2024 BRAND. 保留所有权利。"}'),
('footer','en','{"brand":"BRAND","tagline":"Professional Brand Management Platform","cols":[{"title":"Services","links":[{"label":"Brand Design","href":"#services"},{"label":"Digital Marketing","href":"#services"},{"label":"Data Analytics","href":"#services"}]},{"title":"Company","links":[{"label":"About","href":"#about"},{"label":"Partners","href":"#partners"},{"label":"Contact","href":"#contact"}]},{"title":"Resources","links":[{"label":"Downloads","href":"#downloads"},{"label":"News","href":"#"},{"label":"Help","href":"#"}]}],"copyright":"© 2024 BRAND. All rights reserved."}'),
('footer','ja','{"brand":"BRAND","tagline":"プロフェッショナルブランド管理プラットフォーム","cols":[{"title":"サービス","links":[{"label":"ブランドデザイン","href":"#services"},{"label":"デジタルマーケティング","href":"#services"},{"label":"データ分析","href":"#services"}]},{"title":"会社","links":[{"label":"私たちについて","href":"#about"},{"label":"パートナー","href":"#partners"},{"label":"お問い合わせ","href":"#contact"}]},{"title":"リソース","links":[{"label":"ダウンロード","href":"#downloads"},{"label":"ニュース","href":"#"},{"label":"ヘルプ","href":"#"}]}],"copyright":"© 2024 BRAND. 全著作権所有。"}'),
('footer','ko','{"brand":"BRAND","tagline":"전문 브랜드 관리 플랫폼","cols":[{"title":"서비스","links":[{"label":"브랜드 디자인","href":"#services"},{"label":"디지털 마케팅","href":"#services"},{"label":"데이터 분석","href":"#services"}]},{"title":"회사","links":[{"label":"소개","href":"#about"},{"label":"파트너","href":"#partners"},{"label":"연락처","href":"#contact"}]},{"title":"리소스","links":[{"label":"다운로드","href":"#downloads"},{"label":"뉴스","href":"#"},{"label":"도움말","href":"#"}]}],"copyright":"© 2024 BRAND. All rights reserved."}')
on conflict (module_key, lang) do nothing;

-- translations seed
insert into translations (namespace, key, zh, en, ja, ko) values
('frontend','nav.home','首页','Home','ホーム','홈'),
('frontend','nav.services','服务','Services','サービス','서비스'),
('frontend','nav.about','关于','About','について','소개'),
('frontend','nav.contact','联系','Contact','連絡','연락'),
('frontend','cta','立即体验','Get Started','今すぐ','시작하기'),
('frontend','theme.label','主题','Theme','テーマ','테마'),
('admin','sidebar.dashboard','仪表盘','Dashboard','ダッシュボード','대시보드'),
('admin','sidebar.modules','模块管理','Modules','モジュール','모듈'),
('admin','sidebar.editor','内容编辑','Editor','エディター','에디터'),
('admin','sidebar.i18n','多语言','Translations','翻訳','번역'),
('admin','sidebar.theme','主题','Theme','テーマ','테마'),
('admin','sidebar.messages','留言','Messages','メッセージ','메시지'),
('admin','sidebar.files','文件','Files','ファイル','파일'),
('admin','sidebar.settings','设置','Settings','設定','설정')
on conflict (namespace, key) do nothing;
