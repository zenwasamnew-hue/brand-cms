'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Module = { id: string; key: string; label: string; enabled: boolean; sort_order: number };

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string|null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('modules').select('*').order('sort_order').then(({data}) => {
      if (data) setModules(data);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleModule(mod: Module) {
    setSaving(mod.id);
    const newEnabled = !mod.enabled;
    await supabase.from('modules').update({ enabled: newEnabled }).eq('id', mod.id);
    setModules(prev => prev.map(m => m.id === mod.id ? { ...m, enabled: newEnabled } : m));
    setSaving(null);
  }

  async function moveUp(idx: number) {
    if (idx === 0) return;
    const newMods = [...modules];
    [newMods[idx-1], newMods[idx]] = [newMods[idx], newMods[idx-1]];
    const updated = newMods.map((m, i) => ({ ...m, sort_order: i + 1 }));
    setModules(updated);
    await Promise.all(updated.map(m => supabase.from('modules').update({ sort_order: m.sort_order }).eq('id', m.id)));
  }

  async function moveDown(idx: number) {
    if (idx === modules.length - 1) return;
    const newMods = [...modules];
    [newMods[idx], newMods[idx+1]] = [newMods[idx+1], newMods[idx]];
    const updated = newMods.map((m, i) => ({ ...m, sort_order: i + 1 }));
    setModules(updated);
    await Promise.all(updated.map(m => supabase.from('modules').update({ sort_order: m.sort_order }).eq('id', m.id)));
  }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>🧩</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>模块管理</h1>
      </div>
      <div style={{ padding:'32px' }}>
        <div className="glass-card" style={{ padding:'24px' }}>
          <p style={{ fontSize:'13px', color:'#86868B', marginBottom:'20px' }}>管理前台各模块的显示状态和排列顺序。</p>
          {loading ? (
            <div style={{ textAlign:'center', padding:'40px', color:'#86868B' }}>加载中...</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {modules.map((mod, idx) => (
                <div key={mod.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'16px', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                    <button onClick={() => moveUp(idx)} disabled={idx===0} style={{ background:'none', border:'none', cursor:idx===0?'default':'pointer', color:idx===0?'#3a3a3c':'#86868B', fontSize:'12px', padding:'2px 4px' }}>▲</button>
                    <button onClick={() => moveDown(idx)} disabled={idx===modules.length-1} style={{ background:'none', border:'none', cursor:idx===modules.length-1?'default':'pointer', color:idx===modules.length-1?'#3a3a3c':'#86868B', fontSize:'12px', padding:'2px 4px' }}>▼</button>
                  </div>
                  <span style={{ fontSize:'13px', color:'#86868B', minWidth:'24px' }}>{idx+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'14px', fontWeight:600, color:'#F5F5F7' }}>{mod.label}</div>
                    <div style={{ fontSize:'11px', color:'#86868B' }}>{mod.key}</div>
                  </div>
                  <button
                    onClick={() => toggleModule(mod)}
                    disabled={saving===mod.id}
                    style={{ padding:'6px 16px', borderRadius:'100px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background: mod.enabled ? 'rgba(48,209,88,0.15)' : 'rgba(255,255,255,0.06)', color: mod.enabled ? '#30D158' : '#86868B', transition:'all 0.2s' }}
                  >
                    {saving===mod.id ? '...' : mod.enabled ? '已启用' : '已禁用'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
