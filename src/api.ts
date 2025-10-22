const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function api(path: string, init?: RequestInit) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return fetch(`${API_BASE}${p}`, init);
}
