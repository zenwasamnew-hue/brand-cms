'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type Message = { id:string; name:string; email:string; subject:string|null; body:string; status:string; reply:string|null; created_at:string };

const STATUS_LABELS: Record<string,string> = { unread:'未读', read:'已读', replied:'已回复', archived:'已归档' };
const STATUS_COLORS: Record<string,string> = { unread:'#0A84FF', read:'#86868B', replied:'#30D158', archived:'#636366' };

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message|null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const supabase = createClient();

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('messages').select('*').order('created_at', { ascending:false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    if (data) setMessages(data);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function markStatus(id: string, status: string) {
    await supabase.from('messages').update({ status }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
  }

  async function sendReply(msg: Message) {
    await supabase.from('messages').update({ reply: replyText, status:'replied' }).eq('id', msg.id);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, reply:replyText, status:'replied' } : m));
    setSelected(prev => prev ? { ...prev, reply:replyText, status:'replied' } : prev);
    setReplyText('');
  }

  async function deleteMsg(id: string) {
    if (!confirm('确定删除此留言？')) return;
    await supabase.from('messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>💬</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>留言管理</h1>
      </div>
      <div style={{ padding:'32px', display:'grid', gridTemplateColumns:selected?'1fr 1fr':'1fr', gap:'20px' }}>
        {/* List */}
        <div className="glass-card" style={{ padding:'20px' }}>
          <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
            {['all','unread','read','replied','archived'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:'4px 12px', borderRadius:'100px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600, background: filter===f ? '#0A84FF' : 'rgba(255,255,255,0.06)', color: filter===f ? '#fff' : '#86868B' }}>
                {f==='all'?'全部':STATUS_LABELS[f]}
              </button>
            ))}
          </div>
          {loading ? <div style={{ textAlign:'center', padding:'40px', color:'#86868B' }}>加载中...</div> : messages.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'#86868B' }}>📥 暂无留言</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {messages.map(msg => (
                <div key={msg.id} onClick={() => { setSelected(msg); setReplyText(msg.reply||''); if(msg.status==='unread') markStatus(msg.id,'read'); }} style={{ padding:'14px', borderRadius:'12px', background: selected?.id===msg.id ? 'rgba(10,132,255,0.1)' : 'rgba(255,255,255,0.03)', border:`1px solid ${selected?.id===msg.id?'rgba(10,132,255,0.3)':'rgba(255,255,255,0.06)'}`, cursor:'pointer' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                    {msg.status==='unread'&&<div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#0A84FF', flexShrink:0 }} />}
                    <span style={{ fontSize:'13px', fontWeight:600, color:'#F5F5F7', flex:1 }}>{msg.name}</span>
                    <span style={{ fontSize:'10px', fontWeight:700, color:STATUS_COLORS[msg.status]||'#86868B' }}>{STATUS_LABELS[msg.status]||msg.status}</span>
                  </div>
                  <div style={{ fontSize:'12px', color:'#86868B', marginBottom:'3px' }}>{msg.email}</div>
                  <div style={{ fontSize:'12px', color:'#86868B', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.subject||msg.body}</div>
                  <div style={{ fontSize:'10px', color:'#48484a', marginTop:'4px' }}>{new Date(msg.created_at).toLocaleString('zh-CN')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="glass-card" style={{ padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
              <div>
                <h2 style={{ fontSize:'16px', fontWeight:700, color:'#F5F5F7', margin:'0 0 4px' }}>{selected.name}</h2>
                <div style={{ fontSize:'12px', color:'#86868B' }}>{selected.email}</div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                {['read','replied','archived'].map(s => (
                  <button key={s} onClick={() => markStatus(selected.id,s)} style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background:selected.status===s?(STATUS_COLORS[s]||'#0A84FF')+'30':'rgba(255,255,255,0.06)', color:selected.status===s?(STATUS_COLORS[s]||'#0A84FF'):'#86868B' }}>{STATUS_LABELS[s]}</button>
                ))}
                <button onClick={() => deleteMsg(selected.id)} style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background:'rgba(255,69,58,0.1)', color:'#FF453A' }}>删除</button>
              </div>
            </div>
            {selected.subject && <div style={{ fontSize:'13px', fontWeight:600, color:'#F5F5F7', marginBottom:'8px' }}>主题：{selected.subject}</div>}
            <div style={{ padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', fontSize:'14px', color:'#F5F5F7', lineHeight:1.7, marginBottom:'20px', whiteSpace:'pre-wrap' }}>{selected.body}</div>
            <div>
              <label style={{ display:'block', fontSize:'12px', fontWeight:600, color:'#86868B', marginBottom:'8px' }}>回复</label>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} rows={4} style={{ width:'100%', padding:'12px', background:'#1c1c20', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', color:'#F5F5F7', fontSize:'13px', resize:'vertical', boxSizing:'border-box' }} placeholder="输入回复内容..." />
              <button onClick={() => sendReply(selected)} disabled={!replyText.trim()} className="btn-primary" style={{ marginTop:'10px', padding:'10px 24px' }}>发送回复</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
