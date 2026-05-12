const CACHE = 'skychef-v1';
const FILES = [
  './sky_chef.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/sprites/chef/Chef_W1.png',
  './assets/sprites/chef/Chef_A1.png',
  './assets/sprites/chef/Chef_B1.png',
  './assets/sprites/chef/Chef_B_Icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp.ok) { let clone = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
      return resp;
    }).catch(() => cached || new Response('Offline')))
  );
});
