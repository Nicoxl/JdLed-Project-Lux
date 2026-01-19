// sw.js
const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';

// 1. Installazione: Scarica e salva la pagina offline nella cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL);
    })
  );
});

// 2. Fetch: Intercetta le richieste di rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
        // Se la rete fallisce (offline), restituisci la pagina salvata
        return caches.match(OFFLINE_URL);
    })
  );
});