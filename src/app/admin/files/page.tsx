'use client';

import { useState, useRef, useCallback } from 'react';
import { mockFiles, type MockFile } from '@/lib/mock';

type ViewMode = 'grid' | 'list';

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function getFileIcon(type: MockFile['type']): string {
  return { image: '🖼️', video: '🎬', document: '📄', other: '📦' }[type];
}

export default function FilesPage() {
  const [files, setFiles] = useState<MockFile[]>(mockFiles);
  const [view, setView] = useState<ViewMode>('grid');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<{ name: string; progress: number }[]>([]);
  const [lightbox, setLightbox] = useState<MockFile | null>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; file: MockFile } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((fileList: FileList) => {
    const newUploads = Array.from(fileList).map((f) => ({ name: f.name, progress: 0 }));
    setUploading((prev) => [...prev, ...newUploads]);
    newUploads.forEach((u, idx) => {
      const interval = setInterval(() => {
        setUploading((prev) => {
          const updated = prev.map((item) => item.name === u.name ? { ...item, progress: Math.min(item.progress + Math.random() * 25, 100) } : item);
          if (updated[prev.findIndex((i) => i.name === u.name)]?.progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploading((p) => p.filter((i) => i.name !== u.name));
              setFiles((p) => [...p, { id: String(Date.now() + idx), name: u.name, type: 'other', size: 0, url: '#', created_at: new Date().toISOString() }]);
            }, 500);
          }
          return updated;
        });
      }, 200);
    });
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files.length) simulateUpload(e.dataTransfer.files);
  }

  function handleDelete(id: string) {
    setFiles((p) => p.filter((f) => f.id !== id));
    setCtxMenu(null);
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 53px)', overflow: 'auto' }} onClick={() => setCtxMenu(null)}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{files.length} 个文件</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('grid')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: view === 'grid' ? 'var(--accent)' : 'transparent', color: view === 'grid' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>⊞ 网格</button>
          <button onClick={() => setView('list')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: view === 'list' ? 'var(--accent)' : 'transparent', color: view === 'list' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>≡ 列表</button>
          <button onClick={() => inputRef.current?.click()} style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>+ 上传</button>
          <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => e.target.files && simulateUpload(e.target.files)} />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{ border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '12px', padding: '28px', textAlign: 'center', marginBottom: '20px', transition: 'border-color 0.2s', background: dragging ? 'rgba(10,132,255,0.05)' : 'transparent', cursor: 'pointer' }}
        onClick={() => inputRef.current?.click()}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📂</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>拖拽文件到此处，或点击上传</p>
      </div>

      {/* Upload queue */}
      {uploading.length > 0 && (
        <div className="theme-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>上传队列</div>
          {uploading.map((u) => (
            <div key={u.name} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{u.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--accent)' }}>{Math.round(u.progress)}%</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${u.progress}%`, background: 'var(--gradient-main)', transition: 'width 0.2s', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File grid/list */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
          {files.map((f) => (
            <div key={f.id} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, file: f }); }} onClick={() => f.type === 'image' && setLightbox(f)} style={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden', cursor: f.type === 'image' ? 'pointer' : 'default' }}>
              {f.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt={f.name} style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', background: 'rgba(255,255,255,0.03)' }}>{getFileIcon(f.type)}</div>
              )}
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{formatSize(f.size)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="theme-card" style={{ overflow: 'hidden' }}>
          {files.map((f, i) => (
            <div key={f.id} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, file: f }); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: i < files.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '20px' }}>{getFileIcon(f.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{formatSize(f.size)} · {new Date(f.created_at).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleDelete(f.id)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', color: '#FF453A', fontSize: '11px', cursor: 'pointer' }}>删除</button>
            </div>
          ))}
        </div>
      )}

      {/* Context menu */}
      {ctxMenu && (
        <div style={{ position: 'fixed', top: ctxMenu.y, left: ctxMenu.x, zIndex: 9999, background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', minWidth: '140px' }}>
          {[
            { label: '📋 复制链接', action: () => { navigator.clipboard.writeText(ctxMenu.file.url); setCtxMenu(null); } },
            { label: '⬇️ 下载', action: () => setCtxMenu(null) },
            { label: '🗑️ 删除', action: () => handleDelete(ctxMenu.file.id) },
          ].map((item) => (
            <button key={item.label} onClick={item.action} style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', color: item.label.includes('删除') ? '#FF453A' : 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: '6px' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >{item.label}</button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.url} alt={lightbox.name} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }} />
        </div>
      )}
    </div>
  );
}
