'use client';

export function login(): void {
  document.cookie = 'admin-auth=true; path=/; max-age=86400';
}

export function logout(): void {
  document.cookie = 'admin-auth=; path=/; max-age=0';
}
