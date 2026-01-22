const CACHE_NAME = 'offline-cache-v3'; // Incrementa sempre la versione quando modifichi i file

// Lista file da salvare subito. 
// IMPORTANTE: Devi includere la root ('/') e index.html, altrimenti
// se vai offline sulla home, il sito non sa cosa caricare!
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/contacts.html',  // Utile cachare anche le altre pagine principali
    '/offline.html',
    '/css/style.css',
    '/js/main.js',    // Cacha anche i JS fondamentali
    '/js/menu.js'     // Cacha anche i JS fondamentali
];

// 1. INSTALLAZIONE
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installazione...');
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching files');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// 2. ATTIVAZIONE
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Attivazione...');
    event.waitUntil(
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

// 3. FETCH (Migliorato)
self.addEventListener('fetch', (event) => {
    // Ignora le richieste che non sono GET (es. form POST) o estensioni Chrome/Brave
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            // Se la rete risponde bene, restituisci la risposta
            return response;
        })
        .catch(() => {
            // SE LA RETE FALLISCE (OFFLINE):
            console.log('[Service Worker] Fetch fallito, provo la cache per:', event.request.url);
            
            return caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Se non è in cache e stiamo navigando (è una pagina HTML), dai la offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                
                // Altrimenti (es. immagini mancanti), non ritornare nulla o un placeholder
                return null; 
            });
        })
    );
});