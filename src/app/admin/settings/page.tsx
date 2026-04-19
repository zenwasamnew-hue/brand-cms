'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Settings = { site_name:string; seo_title:string; seo_description:string; contact_email:string; contact_phone:string; contact_address:string; icp:string };

const DEFAULT: Settings = { site_name:'BRAND', seo_title:'', seo_description:'', contact_email:'', contact_phone:'', contact_address:'', icp:'' };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (data) {
        const map: Record<string,string> = {};
        data.forEach(row => {
          const v = row.value;
          map[row.key] = typeof v === 'string' ? v.replace(/^"|"$/g,'') : String(v).replace(/^"|"$/g,'');
        });
        setSettings(prev => ({ ...prev, ...map }));
      }
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    const entries = Object.entries(settings);
    await Promise.all(entries.map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value: JSON.stringify(value) }, { onConflict:'key' })
    ));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Field = ({ label, k, type='text', placeholder='' }: { label:string; k:keyof Settings; type?:string; placeholder?:string }) => (
    <div style={{ marginBottom:'20px' }}>
      <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'#86868B', marginBottom:'6px' }}>{label}</label>
      {type==='textarea' ? (
        <textarea value={settings[k]} onChange={e => setSettings(prev=>({...prev,[k]:e.target.value}))} rows={3} placeholder={placeholder} style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', color:'#F5F5F7', fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
      ) : (
        <input type={type} value={settings[k]} onChange={e => setSettings(prev=>({...prev,[k]:e.target.value}))} placeholder={placeholder} style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', color:'#F5F5F7', fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
      )}
    </div>
  );

  if (loading) return <div style={{ padding:'40px', textAlign:'center', color:'#86868B' }}>加载中...</div>;

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>⚙️</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>系统设置</h1>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px' }}>
          {saved && <span style={{ fontSize:'12px', color:'#30D158' }}>✓ 已保存</span>}
          <button onClick={save} disabled={saving} className="btn-primary" style={{ padding:'8px 20px' }}>{saving?'保存中...':'保存设置'}</button>
        </div>
      </div>
      <div style={{ padding:'32px', maxWidth:'640px' }}>
        <div className="glass-card" style={{ padding:'28px', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'14px', fontWeight:700, color:'#F5F5F7', marginBottom:'20px' }}>基本信息</h2>
          <Field label="站点名称" k="site_name" placeholder="BRAND" />
          <Field label="SEO 标题" k="seo_title" placeholder="BRAND - 专业品牌解决方案" />
          <Field label="SEO 描述" k="seo_description" type="textarea" placeholder="为企业打造专业品牌形象..." />
        </div>
        <div className="glass-card" style={{ padding:'28px' }}>
          <h2 style={{ fontSize:'14px', fontWeight:700, color:'#F5F5F7', marginBottom:'20px' }}>联系信息</h2>
          <Field label="联系邮箱" k="contact_email" type="email" placeholder="contact@brand.com" />
          <Field label="联系电话" k="contact_phone" placeholder="+86 400-000-0000" />
          <Field label="公司地址" k="contact_address" placeholder="上海市静安区" />
          <Field label="ICP 备案号" k="icp" placeholder="沪ICP备XXXXXXXX号" />
        </div>
      </div>
    </div>
  );
}
