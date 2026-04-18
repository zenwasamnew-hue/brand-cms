/**
 * 后台仪表盘首页（Server Component）
 * 功能：
 *   1. 顶部 sticky header（标题 + 实时徽章）
 *   2. 欢迎横幅（根据时段显示问候语 + 未读留言/草稿数量）
 *   3. 4 个 KPI 统计卡片（可点击跳转对应模块）
 *   4. 快捷操作面板（4 个彩色按钮）
 *   5. 最新 5 条留言（含未读指示圆点）
 * 数据：所有数据通过 Promise.all 并行从 Supabase 实时查询
 */
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

/**
 * 根据当前服务器小时返回中文问候语
 * 凌晨 0-4 点：夜深了 | 早上 5-11 点：上午好 | 下午 12-17 点：下午好 | 晚上 18-22 点：晚上好
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return '上午好';
  if (hour >= 12 && hour < 18) return '下午好';
  if (hour >= 18 && hour < 23) return '晚上好';
  return '夜深了';
}

// KPI 卡片配置：图标、标签、数据 key、跳转链接、主题色
const kpiConfig = [
  { icon: '💬', label: '总留言数', key: 'msgTotal',  href: '/admin/messages', color: '#0A84FF' },
  { icon: '🔔', label: '未读留言', key: 'msgUnread', href: '/admin/messages', color: '#FF9F0A' },
  { icon: '📄', label: '总页面数', key: 'pageTotal', href: '/admin/editor',   color: '#30D158' },
  { icon: '🖼️', label: '文件总数', key: 'fileTotal', href: '/admin/files',    color: '#5E5CE6' },
];

// 快捷操作按钮配置：图标、标签、跳转链接、主题色
const quickActions = [
  { icon: '✏️', label: '编辑内容', href: '/admin/editor',   color: '#0A84FF' },
  { icon: '📤', label: '上传文件', href: '/admin/files',    color: '#30D158' },
  { icon: '🌐', label: '翻译管理', href: '/admin/i18n',     color: '#5E5CE6' },
  { icon: '⚙️', label: '系统设置', href: '/admin/settings', color: '#FF9F0A' },
];

// 最新留言的精简类型（仅查询展示所需字段）
type MessagePreview = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const greeting = getGreeting();

  /**
   * 并行查询所有数据，减少总等待时间。
   * count 查询使用 { count: 'exact', head: true }：
   *   - head: true 表示只发 HEAD 请求，不返回行数据，节省带宽
   *   - count: 'exact' 表示精确计数（非估算）
   */
  const [
    { count: msgTotal },
    { count: msgUnread },
    { count: pageTotal },
    { count: draftTotal },
    { count: fileTotal },
    { data: rawMessages },
  ] = await Promise.all([
    // 1. 留言总数
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    // 2. 未读留言数
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    // 3. 页面总数
    supabase.from('pages').select('*', { count: 'exact', head: true }),
    // 4. 草稿（未发布）页面数，用于欢迎横幅副标题
    supabase.from('pages').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    // 5. 文件总数
    supabase.from('files').select('*', { count: 'exact', head: true }),
    // 6. 最新 5 条留言（按创建时间倒序）
    supabase
      .from('messages')
      .select('id, name, email, content, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // 将查询结果合并为 KPI 数据映射（null 值回退为 0）
  const kpiData: Record<string, number> = {
    msgTotal:  msgTotal  ?? 0,
    msgUnread: msgUnread ?? 0,
    pageTotal: pageTotal ?? 0,
    fileTotal: fileTotal ?? 0,
  };

  // 类型转换：Supabase 返回的 any 数据转为精简留言类型
  const latestMessages = (rawMessages ?? []) as MessagePreview[];

  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* ==================== 顶部 sticky header ==================== */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>📊</span>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#F5F5F7' }}>
          仪表盘
        </h1>
        {/* 实时绿色徽章：表示数据来自实时查询 */}
        <span
          style={{
            background: 'rgba(48,209,88,0.15)',
            border: '1px solid rgba(48,209,88,0.3)',
            color: '#30D158',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '100px',
            letterSpacing: '0.05em',
          }}
        >
          实时
        </span>
      </div>

      <div style={{ padding: '32px' }}>

        {/* ==================== 欢迎横幅卡片 ==================== */}
        <div
          className="glass-card"
          style={{
            // 渐变背景叠加在玻璃拟态基础上
            background: 'linear-gradient(135deg,rgba(10,132,255,0.2) 0%,rgba(94,92,230,0.2) 100%)',
            border: '1px solid rgba(10,132,255,0.25)',
            padding: '28px 32px',
            marginBottom: '24px',
          }}
        >
          {/* 渐变色大标题 */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 800,
              margin: '0 0 10px',
              background: 'linear-gradient(90deg,#64D2FF 0%,#0A84FF 50%,#5E5CE6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {greeting}，Admin 👋
          </h2>

          {/* 副标题：动态显示未读留言数 + 草稿数 */}
          <p style={{ fontSize: '14px', color: '#86868B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {msgUnread != null && msgUnread > 0 && (
              <span style={{ color: '#FF9F0A' }}>🔔 有 {msgUnread} 条未读留言</span>
            )}
            {msgUnread != null && msgUnread > 0 && draftTotal != null && draftTotal > 0 && (
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            )}
            {draftTotal != null && draftTotal > 0 && (
              <span style={{ color: '#64D2FF' }}>📝 {draftTotal} 篇草稿待发布</span>
            )}
            {(msgUnread == null || msgUnread === 0) && (draftTotal == null || draftTotal === 0) && (
              <span>✨ 一切都在正常运行中</span>
            )}
          </p>
        </div>

        {/* ==================== KPI 统计卡片（4 列 grid）==================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {kpiConfig.map((kpi) => (
            // 每个 KPI 卡片是可点击的 Link，跳转到对应管理模块
            <Link
              key={kpi.key}
              href={kpi.href}
              className="glass-card"
              style={{
                padding: '20px',
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* 模块图标 */}
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{kpi.icon}</div>
              {/* 数字：使用模块主题色 */}
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: kpi.color,
                  marginBottom: '4px',
                  lineHeight: 1,
                }}
              >
                {kpiData[kpi.key]}
              </div>
              {/* 标签 */}
              <div style={{ fontSize: '12px', color: '#86868B' }}>{kpi.label}</div>
            </Link>
          ))}
        </div>

        {/* ==================== 快捷操作面板 ==================== */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#86868B',
              margin: '0 0 16px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            快捷操作
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 8px',
                  borderRadius: '12px',
                  // 用模块色调的超低不透明度渐变背景，形成彩色区分
                  background: `linear-gradient(135deg,${action.color}1a,${action.color}0d)`,
                  border: `1px solid ${action.color}30`,
                  textDecoration: 'none',
                  color: '#F5F5F7',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'transform 0.2s ease',
                }}
              >
                <span style={{ fontSize: '22px' }}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ==================== 最新留言列表 ==================== */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* 列表标题行 + "查看全部"链接 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#86868B',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              最新留言
            </h3>
            <Link
              href="/admin/messages"
              style={{ fontSize: '12px', color: '#0A84FF', textDecoration: 'none' }}
            >
              查看全部 →
            </Link>
          </div>

          {/* 无留言时显示空状态提示 */}
          {latestMessages.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: '#86868B',
                fontSize: '14px',
              }}
            >
              📥 暂无留言
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {latestMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* 发信人头像：渐变圆形，显示姓名首字母 */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#0A84FF,#5E5CE6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {msg.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  {/* 留言信息区域 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 姓名 + 邮箱 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '3px',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#F5F5F7' }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#86868B' }}>{msg.email}</span>
                    </div>
                    {/* 留言内容（单行截断，超出显示省略号） */}
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#86868B',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {msg.content}
                    </p>
                  </div>

                  {/* 未读状态指示圆点（仅未读留言显示蓝色光晕圆点） */}
                  {msg.status === 'unread' && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#0A84FF',
                        flexShrink: 0,
                        boxShadow: '0 0 6px rgba(10,132,255,0.6)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
