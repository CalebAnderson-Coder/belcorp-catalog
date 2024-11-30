const CACHE_NAME = 'belcorp-catalog-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Recursos estáticos que siempre queremos en caché
const STATIC_RESOURCES = [
  '/belcorp-catalog/',
  '/belcorp-catalog/index.html',
  '/belcorp-catalog/app.js',
  '/belcorp-catalog/manifest.json',
  '/belcorp-catalog/images/icons/icon-144x144.png',
  '/belcorp-catalog/assets/logo.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
];

// Recursos que pueden cambiar con más frecuencia
const DYNAMIC_RESOURCES = [
  '/belcorp-catalog/assets/cyzone.jpeg',
  '/belcorp-catalog/assets/esika.jpeg',
  '/belcorp-catalog/assets/lbel.jpeg'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('Caching static resources');
          return cache.addAll(STATIC_RESOURCES);
        }),
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          console.log('Caching dynamic resources');
          return cache.addAll(DYNAMIC_RESOURCES);
        })
    ])
  );
  self.skipWaiting();
});

// Limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia de cache: Cache First, then Network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Si es un PDF, usar Network First
  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para otros recursos, usar Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Si está en caché, lo servimos desde ahí
          return response;
        }

        // Si no está en caché, lo buscamos en la red
        return fetch(event.request)
          .then(networkResponse => {
            // Guardamos una copia en el caché dinámico
            return caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      })
  );
});
