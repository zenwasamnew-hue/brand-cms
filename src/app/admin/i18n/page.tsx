'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Translation = { id:string; namespace:string; key:string; zh:string|null; en:string|null; ja:string|null; ko:string|null };

export default function I18nPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string|null>(null);
  const [editData, setEditData] = useState<Partial<Translation>>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('translations').select('*').order('namespace').order('key').then(({ data }) => {
      if (data) setTranslations(data);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = translations.filter(t =>
    t.key.toLowerCase().includes(search.toLowerCase()) ||
    (t.zh||'').includes(search) ||
    (t.en||'').toLowerCase().includes(search.toLowerCase())
  );

  async function saveRow(t: Translation) {
    setSaving(true);
    await supabase.from('translations').update(editData).eq('id', t.id);
    setTranslations(prev => prev.map(x => x.id === t.id ? { ...x, ...editData } : x));
    setEditing(null);
    setSaving(false);
  }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>🌐</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>多语言管理</h1>
        <input type="search" placeholder="搜索翻译键..." value={search} onChange={e=>setSearch(e.target.value)} style={{ marginLeft:'auto', padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'100px', color:'#F5F5F7', fontSize:'13px', outline:'none', width:'200px' }} />
      </div>
      <div style={{ padding:'32px' }}>
        <div className="glass-card" style={{ padding:'0', overflow:'hidden' }}>
          {loading ? <div style={{ padding:'40px', textAlign:'center', color:'#86868B' }}>加载中...</div> : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(255,255,255,0.03)' }}>
                  {['命名空间','键','中文','英文','日文','韩文','操作'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#86868B', borderBottom:'1px solid rgba(255,255,255,0.06)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'10px 16px', fontSize:'12px', color:'#86868B' }}>{t.namespace}</td>
                    <td style={{ padding:'10px 16px', fontSize:'12px', fontWeight:600, color:'#F5F5F7' }}>{t.key}</td>
                    {(['zh','en','ja','ko'] as const).map(lang => (
                      <td key={lang} style={{ padding:'10px 16px', fontSize:'12px', color:'#F5F5F7', maxWidth:'150px' }}>
                        {editing===t.id ? (
                          <input value={(editData[lang]??t[lang])??''} onChange={e=>setEditData(prev=>({...prev,[lang]:e.target.value}))} style={{ width:'100%', padding:'4px 8px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'6px', color:'#F5F5F7', fontSize:'12px', outline:'none' }} />
                        ) : (
                          <span style={{ overflow:'hidden', textOverflow:'ellipsis', display:'block', whiteSpace:'nowrap' }}>{t[lang]||<span style={{ color:'#48484a' }}>-</span>}</span>
                        )}
                      </td>
                    ))}
                    <td style={{ padding:'10px 16px', whiteSpace:'nowrap' }}>
                      {editing===t.id ? (
                        <div style={{ display:'flex', gap:'6px' }}>
                          <button onClick={() => saveRow(t)} disabled={saving} style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background:'rgba(48,209,88,0.15)', color:'#30D158' }}>{saving?'...':'保存'}</button>
                          <button onClick={() => setEditing(null)} style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', background:'rgba(255,255,255,0.06)', color:'#86868B' }}>取消</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditing(t.id); setEditData({ zh:t.zh, en:t.en, ja:t.ja, ko:t.ko }); }} style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background:'rgba(10,132,255,0.1)', color:'#0A84FF' }}>编辑</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
