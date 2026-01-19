// Aggiorniamo la versione della cache per forzare il browser a riscaricare tutto
const CACHE_NAME = 'offline-cache-v2'; 

// Lista di TUTTI i file necessari per la pagina offline
const FILES_TO_CACHE = [
    '/offline.html',
    '/css/style-offline.css',
    '/css/style.css' // Includiamo anche questo perché è linkato nell'head
];

// 1. INSTALLAZIONE: Scarica HTML + CSS
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installazione e download file...');
  self.skipWaiting(); // Forza l'attivazione immediata
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Qui usiamo addAll per scaricare tutta la lista sopra
      return cache.addAll(FILES_TO_CACHE);
    }).catch(err => console.error('[Service Worker] Errore download file:', err))
  );
});

// 2. ATTIVAZIONE: Pulizia vecchie cache
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Attivato e pronto!');
  event.waitUntil(
    // Cancella le cache vecchie (es. v1) per non occupare spazio inutile
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Rimozione vecchia cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. FETCH: Gestione intelligente delle richieste
self.addEventListener('fetch', (event) => {
  // Strategia "Network First, poi Cache"
  event.respondWith(
    fetch(event.request).catch(() => {
        // Se la rete fallisce (siamo offline)...
        return caches.match(event.request).then((response) => {
            // A. Se il file richiesto (es. il CSS) è nella cache, restituiscilo
            if (response) {
                return response;
            }
            // B. Se la richiesta era per una pagina web (HTML), restituisci la pagina offline
            if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        });
    })
  );
});