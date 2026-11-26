/* Service worker Stickology & Juragan Warnet: halaman selalu ambil versi terbaru (cadangan offline), gambar di-cache. */
const C = 'stk-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then((res) => {
        if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put('/', cp)); }
        return res;
      }).catch(() => caches.match('/').then((m) => m || new Response('Lagi offline. Sambungkan internet lalu buka lagi.', { headers: { 'content-type': 'text/plain; charset=utf-8' } })))
    );
    return;
  }
  if (/\.(png|jpg|webmanifest)$/.test(u.pathname)) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => {
      if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); }
      return res;
    })));
  }
});
