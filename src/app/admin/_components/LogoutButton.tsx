'use client';

export default function LogoutButton() {
  function handleLogout() {
    document.cookie = 'admin-auth=; path=/; max-age=0';
    window.location.href = '/login';
  }
  return (
    <button onClick={handleLogout} style={{
      width: '32px', height: '32px', borderRadius: '8px',
      background: 'transparent', border: '1px solid var(--border)',
      color: 'var(--text-secondary)', fontSize: '14px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>↩</button>
  );
}
