'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Module = { id:string; key:string; label:string };

const LANGS = [
  { id:'zh', label:'中文' },
  { id:'en', label:'English' },
  { id:'ja', label:'日本語' },
  { id:'ko', label:'한국어' },
];

export default function EditorPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLang, setSelectedLang] = useState('zh');
  const [content, setContent] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('modules').select('id,key,label').order('sort_order').then(({data}) => {
      if (data) {
        setModules(data);
        if (data.length > 0) setSelectedModule(data[0].key);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedModule) return;
    setLoading(true);
    supabase.from('module_contents').select('content').eq('module_key', selectedModule).eq('lang', selectedLang).single().then(({data}) => {
      setContent(data ? JSON.stringify(data.content, null, 2) : '{}');
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModule, selectedLang]);

  async function saveContent() {
    setSaving(true);
    setSaved(false);
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(content); } catch { alert('JSON 格式错误，请检查'); setSaving(false); return; }
    await supabase.from('module_contents').upsert({ module_key: selectedModule, lang: selectedLang, content: parsed }, { onConflict:'module_key,lang' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  let preview: Record<string, unknown> = {};
  try { preview = JSON.parse(content); } catch { /* ignore */ }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        <span style={{ fontSize:'20px' }}>✏️</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>内容编辑</h1>
        <div style={{ display:'flex', gap:'8px', marginLeft:'16px' }}>
          <select value={selectedModule} onChange={e=>setSelectedModule(e.target.value)} style={{ padding:'6px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'8px', color:'#F5F5F7', fontSize:'13px', outline:'none' }}>
            {modules.map(m => <option key={m.key} value={m.key} style={{ background:'#1c1c20' }}>{m.label}</option>)}
          </select>
          <select value={selectedLang} onChange={e=>setSelectedLang(e.target.value)} style={{ padding:'6px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'8px', color:'#F5F5F7', fontSize:'13px', outline:'none' }}>
            {LANGS.map(l => <option key={l.id} value={l.id} style={{ background:'#1c1c20' }}>{l.label}</option>)}
          </select>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px' }}>
          {saved && <span style={{ fontSize:'12px', color:'#30D158' }}>✓ 已保存</span>}
          <button onClick={saveContent} disabled={saving} className="btn-primary" style={{ padding:'8px 20px' }}>{saving?'保存中...':'保存'}</button>
        </div>
      </div>
      <div style={{ padding:'32px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
        <div className="glass-card" style={{ padding:'20px' }}>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#86868B', marginBottom:'12px' }}>JSON 编辑器</div>
          {loading ? <div style={{ padding:'40px', textAlign:'center', color:'#86868B' }}>加载中...</div> : (
            <textarea value={content} onChange={e=>setContent(e.target.value)} style={{ width:'100%', minHeight:'400px', padding:'14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', color:'#30D158', fontSize:'13px', fontFamily:'monospace', resize:'vertical', boxSizing:'border-box', outline:'none' }} />
          )}
        </div>
        <div className="glass-card" style={{ padding:'20px', overflow:'auto' }}>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#86868B', marginBottom:'12px' }}>预览</div>
          <pre style={{ fontSize:'12px', color:'#86868B', overflow:'auto', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
