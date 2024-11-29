const CACHE_NAME = 'belcorp-catalog-v1';
const DYNAMIC_CACHE = 'belcorp-dynamic-v1';

// Archivos a cachear
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/cart.js',
    '/js/products.json',
    '/config.js',
    '/manifest.json',
    '/images/logo.png',
    '/images/banner.jpg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Imágenes de productos a cachear
const PRODUCT_IMAGES = [
    '/images/products/lbel/aqua-complex.jpg',
    '/images/products/esika/labial-mate.jpg',
    '/images/products/cyzone/mascara-volume.jpg',
    '/images/products/lbel/magnifique.jpg',
    '/images/products/esika/base-hd.jpg',
    '/images/products/cyzone/esmalte.jpg',
    '/images/products/lbel/serum-chronos.jpg',
    '/images/products/esika/crema-corporal.jpg'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cacheando archivos estáticos');
                return cache.addAll([...STATIC_ASSETS, ...PRODUCT_IMAGES]);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
                        console.log('Eliminando caché antiguo:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Estrategia de caché: Network First, fallback to Cache
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la respuesta es válida, la guardamos en caché
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, intentamos obtener desde caché
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // Si no está en caché y es una imagen, devolvemos una imagen por defecto
                        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                            return caches.match('/images/products/default.jpg');
                        }
                        // Para otros recursos, mostramos un error
                        return new Response('No hay conexión a Internet', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background Sync para pedidos offline
self.addEventListener('sync', event => {
    if (event.tag === 'sync-orders') {
        event.waitUntil(
            // Aquí iría la lógica para sincronizar pedidos pendientes
            syncOrders()
        );
    }
});

// Push Notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver catálogo',
                icon: '/images/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/images/icons/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Belcorp Digital Catalog', options)
    );
});

// Manejo de notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Función para sincronizar pedidos
async function syncOrders() {
    try {
        const orders = await getOrdersFromIndexedDB();
        for (const order of orders) {
            await sendOrderToServer(order);
            await removeOrderFromIndexedDB(order.id);
        }
    } catch (error) {
        console.error('Error sincronizando pedidos:', error);
    }
}

// Función auxiliar para manejar errores de caché
function handleCacheError(error) {
    console.error('Error en caché:', error);
    return new Response('Error al acceder al caché', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
    });
}
