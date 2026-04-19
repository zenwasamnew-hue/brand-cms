/**
 * 动态模块占位页（Server Component）
 * 路由：/admin/[module]（如 /admin/modules、/admin/editor、/admin/files 等）
 * 功能：
 *   - 根据 URL 参数 module 自动映射并显示对应的中文模块名称
 *   - 显示"建设中"提示，告知用户该模块将在后续阶段交付
 *   - 提供返回仪表盘的导航按钮
 * 说明：此文件作为各功能模块的临时占位，后续将被实际模块页面替换
 */
import Link from 'next/link';

// 模块路径名到中文名称的映射表
const MODULE_NAMES: Record<string, string> = {
  modules:  '模块管理',
  editor:   '内容编辑',
  i18n:     '多语言管理',
  theme:    '主题配置',
  messages: '留言管理',
  files:    '文件管理',
  settings: '系统设置',
};

// 模块图标映射（与侧栏导航一致）
const MODULE_ICONS: Record<string, string> = {
  modules:  '🧩',
  editor:   '✏️',
  i18n:     '🌐',
  theme:    '🎨',
  messages: '💬',
  files:    '📁',
  settings: '⚙️',
};

type Props = {
  params: { module: string };
};

export default function ModulePage({ params }: Props) {
  // 从映射表中获取中文名称，未知模块显示路径名（转大写首字母）
  const moduleName = MODULE_NAMES[params.module]
    ?? params.module.charAt(0).toUpperCase() + params.module.slice(1);

  // 获取对应图标，未知模块使用默认图标
  const moduleIcon = MODULE_ICONS[params.module] ?? '📦';

  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* ---- 顶部 sticky header ---- */}
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
        <span style={{ fontSize: '20px' }}>{moduleIcon}</span>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#F5F5F7' }}>
          {moduleName}
        </h1>
      </div>

      {/* ---- 主体内容：居中的"建设中"卡片 ---- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 57px)',
          padding: '32px',
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          {/* 建设中大图标 */}
          <div style={{ fontSize: '64px', marginBottom: '24px', lineHeight: 1 }}>🚧</div>

          {/* 模块名称标题 */}
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              margin: '0 0 12px',
              color: '#F5F5F7',
            }}
          >
            {moduleName}
          </h2>

          {/* 说明文字 */}
          <p
            style={{
              fontSize: '14px',
              color: '#86868B',
              lineHeight: 1.7,
              margin: '0 0 32px',
            }}
          >
            该模块正在按计划构建中，将在 24 小时挑战的后续阶段逐个交付。
            当前可返回仪表盘查看整体进度。
          </p>

          {/* 返回仪表盘按钮（使用全局 .btn-primary 样式） */}
          <Link href="/admin" className="btn-primary" style={{ display: 'inline-block' }}>
            ← 返回仪表盘
          </Link>
        </div>
      </div>

    </div>
  );
}
