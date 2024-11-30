const CACHE_NAME = 'belcorp-catalog-v1';
const urlsToCache = [
  '/belcorp-catalog/',
  '/belcorp-catalog/index.html',
  '/belcorp-catalog/app.js',
  '/belcorp-catalog/manifest.json',
  '/belcorp-catalog/images/icons/icon-144x144.png',
  '/belcorp-catalog/assets/logo.png',
  '/belcorp-catalog/assets/cyzone.jpeg',
  '/belcorp-catalog/assets/esika.jpeg',
  '/belcorp-catalog/assets/lbel.jpeg',
  '/belcorp-catalog/pdfs/ESIKA 1C.pdf',
  '/belcorp-catalog/pdfs/cyzonec1.pdf',
  '/belcorp-catalog/pdfs/lbelc1.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
