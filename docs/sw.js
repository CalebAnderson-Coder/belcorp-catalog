const CACHE_NAME = 'belcorp-catalog-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './assets/logo.svg',
  './assets/cyzone.svg',
  './assets/esika.svg',
  './assets/lbel.svg',
  './pdfs/Cy Zone C01.pdf',
  './pdfs/ESika C01.pdf',
  './pdfs/LBel C01.pdf',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
