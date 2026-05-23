/* Minimal service worker for Brynier.
   - Cache app shell + icons.
   - Network-first for documents (fallback to offline page).
   - Cache-first for static assets.
*/

const CACHE_VERSION = 'brynier-shell-v1';
const SHELL_ASSETS = [  '/offline.html',
  '/manifest.webmanifest',
  '/pwa-192.png',
  '/pwa-512.png',
  '/pwa-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(SHELL_ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    self.clients.claim();
  })());
});

function isSameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function shouldHandle(request) {
  if (request.method !== 'GET') return false;
  if (!isSameOrigin(request)) return false;

  const url = new URL(request.url);

  // Don’t cache Supabase REST/auth endpoints or any API endpoints.
  if (url.pathname.startsWith('/rest/')) return false;
  if (url.pathname.startsWith('/auth/')) return false;

  return true;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (!shouldHandle(req)) return;

  const dest = req.destination;
  const isDoc = dest === 'document' || (dest === '' && req.mode === 'navigate');

  if (isDoc) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_VERSION);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(CACHE_VERSION);
        return (await cache.match(req)) || (await cache.match('/offline.html'));
      }
    })());
    return;
  }

  // Static assets: cache-first.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch {
      return cached;
    }
  })());
});