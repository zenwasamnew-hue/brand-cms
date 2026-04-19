'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

type FileItem = { id:string; name:string; path:string; url:string; mime_type:string|null; size_bytes:number|null; uploaded_at:string };

function formatSize(bytes: number|null) {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from('files').select('*').order('uploaded_at', { ascending:false });
    if (data) setFiles(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from('files').upload(path, file);
    if (upErr) { alert('上传失败：' + upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('files').getPublicUrl(path);
    await supabase.from('files').insert({ name:file.name, path, url:urlData.publicUrl, mime_type:file.type, size_bytes:file.size });
    await load();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function deleteFile(f: FileItem) {
    if (!confirm('确定删除？')) return;
    await supabase.storage.from('files').remove([f.path]);
    await supabase.from('files').delete().eq('id', f.id);
    setFiles(prev => prev.filter(x => x.id !== f.id));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ paddingBottom:'40px' }}>
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 32px', display:'flex', alignItems:'center', gap:'12px' }}>
        <span style={{ fontSize:'20px' }}>📁</span>
        <h1 style={{ fontSize:'18px', fontWeight:700, margin:0, color:'#F5F5F7' }}>文件管理</h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
          {uploading && <span style={{ fontSize:'12px', color:'#86868B' }}>上传中...</span>}
          <label className="btn-primary" style={{ padding:'8px 16px', cursor:'pointer', fontSize:'13px' }}>
            📤 上传文件
            <input ref={fileRef} type="file" onChange={handleUpload} style={{ display:'none' }} />
          </label>
        </div>
      </div>
      <div style={{ padding:'32px' }}>
        {loading ? <div style={{ textAlign:'center', padding:'60px', color:'#86868B' }}>加载中...</div> : files.length === 0 ? (
          <div className="glass-card" style={{ padding:'60px', textAlign:'center', color:'#86868B' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>📂</div>
            <p>暂无文件，点击右上角上传</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'16px' }}>
            {files.map(f => {
              const isImage = f.mime_type?.startsWith('image/');
              return (
                <div key={f.id} className="glass-card" style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
                  <div style={{ width:'100%', height:'120px', borderRadius:'10px', background:'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    {isImage ? <img src={f.url} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px' }} /> : <span style={{ fontSize:'40px' }}>📄</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'#F5F5F7', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                    <div style={{ fontSize:'11px', color:'#86868B' }}>{formatSize(f.size_bytes)}</div>
                  </div>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button onClick={() => copyUrl(f.url)} style={{ flex:1, padding:'6px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, background:'rgba(10,132,255,0.1)', color: copied===f.url ? '#30D158' : '#0A84FF' }}>
                      {copied===f.url ? '已复制' : '复制链接'}
                    </button>
                    <button onClick={() => deleteFile(f)} style={{ padding:'6px 10px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'11px', background:'rgba(255,69,58,0.1)', color:'#FF453A' }}>删除</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
