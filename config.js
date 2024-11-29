// Configuración global del catálogo
const CONFIG = {
    // API Configuration
    api: {
        baseUrl: 'https://api.belcorp.com/v1',
        timeout: 5000,
        retries: 3
    },

    // Pricing Configuration
    pricing: {
        exchangeRate: 3100, // COP to USD
        markup: 0.4, // 40% markup
        roundTo: 2 // decimal places
    },

    // Image Configuration
    images: {
        baseUrl: 'https://images.belcorp.com',
        defaultImage: '/images/products/default.jpg',
        sizes: {
            thumbnail: '150x150',
            medium: '300x300',
            large: '600x600'
        }
    },

    // Cart Configuration
    cart: {
        maxItems: 50,
        minQuantity: 1,
        maxQuantity: 10,
        saveToLocal: true,
        expiryDays: 7
    },

    // Categories
    categories: [
        {
            id: 'maquillaje',
            name: 'Maquillaje',
            icon: 'fa-magic'
        },
        {
            id: 'fragancias',
            name: 'Fragancias',
            icon: 'fa-spray-can'
        },
        {
            id: 'cuidado-facial',
            name: 'Cuidado Facial',
            icon: 'fa-face-smile'
        },
        {
            id: 'cuidado-corporal',
            name: 'Cuidado Corporal',
            icon: 'fa-pump-soap'
        },
        {
            id: 'unas',
            name: 'Uñas',
            icon: 'fa-hand-sparkles'
        }
    ],

    // UI Configuration
    ui: {
        theme: {
            primaryColor: '#e75480',
            secondaryColor: '#ff69b4',
            accentColor: '#ff1493'
        },
        animation: {
            duration: 300,
            easing: 'ease'
        },
        toast: {
            duration: 3000,
            position: 'top-right'
        }
    },

    // Cache Configuration
    cache: {
        version: '1.0.0',
        products: {
            maxAge: 3600, // 1 hour
            maxItems: 1000
        },
        images: {
            maxAge: 86400, // 24 hours
            maxSize: 50 * 1024 * 1024 // 50MB
        }
    },

    // Brands
    brands: [
        {
            id: 'esika',
            name: 'Ésika',
            logo: '/images/brands/esika.png'
        },
        {
            id: 'lbel',
            name: "L'Bel",
            logo: '/images/brands/lbel.png'
        },
        {
            id: 'cyzone',
            name: 'Cyzone',
            logo: '/images/brands/cyzone.png'
        }
    ],

    // PWA Configuration
    pwa: {
        name: 'Belcorp Digital Catalog',
        shortName: 'Belcorp',
        description: 'Catálogo digital para consultoras de Belcorp',
        backgroundColor: '#ffffff',
        themeColor: '#e75480',
        display: 'standalone',
        scope: '/',
        startUrl: '/',
        icons: [
            {
                src: '/images/icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png'
            },
            {
                src: '/images/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    }
};
