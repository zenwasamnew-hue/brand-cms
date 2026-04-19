'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const THEMES = [
  { id:'midnight', label:'Midnight', color:'#0A84FF', bg:'#000000' },
  { id:'silver',   label:'Silver',   color:'#0071e3', bg:'#f5f5f7' },
  { id:'space-gray',label:'Space Gray',color:'#636366',bg:'#1c1c1e' },
  { id:'matrix',   label:'Matrix',   color:'#00ff41', bg:'#000000' },
  { id:'sunset',   label:'Sunset',   color:'#ff6b35', bg:'#0d0005' },
  { id:'aurora',   label:'Aurora',   color:'#64d2ff', bg:'#000a1a' },
];

export default function ThemePage() {
  const [current, setCurrent] = useState('midnight');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme') || 'midnight';
    setCurrent(stored);
    document.documentElement.setAttribute('data-theme', stored);
    supabase.from('site_settings').select('value').eq('key','theme').single().then(({data}) => {
      if (data?.value) {
        const v = typeof data.value === 'string' ? data.value : String(data.value).replace(/"/g,'');
        setCurrent(v);
        localStorage.setItem('admin-theme', v);
        document.documentElement.setAttribute('data-theme', v);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function selectTheme(id: string) {
    setCurrent(id);
    localStorage.setItem('admin-theme', id);
    document.documentElement.setAttribute('data-theme', id);
    setSaving(true);
    setSaved(false);
    await supabase.from('site_settings').upsert({ key:'theme', value: JSON.stringify(id) }, { onConflict:'key' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>🎨</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>主题配置</h1>
        {saving && <span style={{ fontSize:'12px', color:'#86868B' }}>保存中...</span>}
        {saved && <span style={{ fontSize:'12px', color:'#30D158' }}>✓ 已保存</span>}
      </div>
      <div style={{ padding:'32px' }}>
        <div className="glass-card" style={{ padding:'32px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:700, color:'#F5F5F7', marginBottom:'8px' }}>选择主题</h2>
          <p style={{ fontSize:'13px', color:'#86868B', marginBottom:'28px' }}>选择后立即应用并保存到云端，前台访客也会看到相同主题。</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', maxWidth:'600px' }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}
              >
                <div style={{ padding:'20px', borderRadius:'16px', border:`2px solid ${current===t.id ? t.color : 'rgba(255,255,255,0.08)'}`, background: current===t.id ? `${t.color}15` : 'rgba(28,28,32,0.6)', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:`${t.bg}`, border:`3px solid ${t.color}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: current===t.id ? `0 0 20px ${t.color}60` : 'none' }}>
                    <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:t.color }} />
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:600, color: current===t.id ? t.color : '#F5F5F7' }}>{t.label}</span>
                  {current===t.id && <span style={{ fontSize:'10px', color:t.color, fontWeight:700 }}>当前</span>}
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop:'32px', padding:'20px', background:'rgba(10,132,255,0.08)', border:'1px solid rgba(10,132,255,0.15)', borderRadius:'12px' }}>
            <p style={{ fontSize:'12px', color:'#86868B', margin:0 }}>
              💡 主题会保存到 <strong style={{ color:'#64D2FF' }}>site_settings</strong> 表，前台访问时自动读取。访客也可在前台右侧的主题切换器中自行选择（仅本地保存）。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
