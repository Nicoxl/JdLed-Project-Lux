const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';

// 1. INSTALLAZIONE: Scarica la pagina offline
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installazione in corso...');
  // Forza l'attivazione immediata del nuovo SW
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching della pagina offline');
      return cache.add(OFFLINE_URL);
    }).catch(err => console.error('[Service Worker] Errore caching offline:', err))
  );
});

// 2. ATTIVAZIONE: Prendi il controllo subito
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Attivato e pronto!');
  // Prende il controllo di tutte le pagine aperte immediatamente
  event.waitUntil(clients.claim());
});

// 3. FETCH: Intercetta le richieste
self.addEventListener('fetch', (event) => {
  // Interveniamo solo se è una richiesta di navigazione (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
            console.log('[Service Worker] Rete fallita. Servo pagina Offline.');
            return caches.match(OFFLINE_URL);
        })
    );
  }
});