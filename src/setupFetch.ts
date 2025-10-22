const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = `${BASE}${input}`;
  } else if (input instanceof URL && input.pathname.startsWith('/api/')) {
    input = new URL(`${BASE}${input.pathname}${input.search}${input.hash}`);
  }
  return originalFetch(input as any, init);
};
