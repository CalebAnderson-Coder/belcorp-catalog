// Configuración global
const config = {
    apiUrl: 'https://api.somosbelcorp.com',
    exchangeRate: 3100, // Tasa de cambio USD a COP
    markup: 1.40 // Margen de ganancia (40%)
};

// Estado de la aplicación
let state = {
    products: [],
    cart: [],
    currentCategory: 'all',
    loading: false,
    error: null
};

// Cargar productos desde el JSON
async function loadProducts() {
    try {
        state.loading = true;
        const response = await fetch('js/products.json');
        const data = await response.json();
        state.products = data.map(product => ({
            ...product,
            priceUSD: parseFloat(product.price),
            priceCOP: Math.round(parseFloat(product.price) * config.exchangeRate * config.markup)
        }));
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        state.error = 'Error al cargar los productos';
    } finally {
        state.loading = false;
    }
}

// Renderizar productos
function renderProducts() {
    const container = document.getElementById('productos-destacados');
    if (!container) return;

    const filteredProducts = state.currentCategory === 'all' 
        ? state.products 
        : state.products.filter(p => p.category === state.currentCategory);

    container.innerHTML = filteredProducts.map(product => `
        <div class="col-6 col-md-3">
            <div class="producto-card">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h4>${product.name}</h4>
                <p class="marca">${product.brand}</p>
                <p class="precio">COP $${product.priceCOP.toLocaleString()}</p>
                <p class="precio-usd">USD $${product.priceUSD.toFixed(2)}</p>
                <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrar por categoría
function filterByCategory(category) {
    state.currentCategory = category;
    renderProducts();
    
    // Actualizar UI de categorías
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
            link.classList.add('active');
        }
    });
}

// Búsqueda de productos
function searchProducts(query) {
    if (!query) {
        renderProducts();
        return;
    }

    const searchResults = state.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    const container = document.getElementById('productos-destacados');
    if (!container) return;

    container.innerHTML = searchResults.length ? searchResults.map(product => `
        <div class="col-6 col-md-3">
            <div class="producto-card">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h4>${product.name}</h4>
                <p class="marca">${product.brand}</p>
                <p class="precio">COP $${product.priceCOP.toLocaleString()}</p>
                <p class="precio-usd">USD $${product.priceUSD.toFixed(2)}</p>
                <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        </div>
    `).join('') : '<div class="col-12 text-center">No se encontraron productos</div>';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }

    // Categorías
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterByCategory(e.target.dataset.category);
        });
    });

    // Cargar carrito guardado
    const savedCart = localStorage.getItem('belcorpCart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
        updateCartUI();
    }
});

// Actualizar UI del carrito
function updateCartUI() {
    const cartCounter = document.getElementById('carrito-contador');
    if (cartCounter) {
        cartCounter.textContent = state.cart.reduce((total, item) => total + item.quantity, 0);
    }
}
