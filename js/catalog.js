// Configuración y variables globales
const API_CONFIG = {
    baseUrl: 'https://catalogodigital.somosbelcorp.com',
    country: 'CO',
    consultantId: 'OTkwNzQ5NzcyNg=='
};

// Estado de la aplicación
let products = [];
let filteredProducts = [];
let cart = [];
let selectedBrand = 'all';
let priceRange = 250000;
let selectedCategories = new Set();

// Elementos del DOM
const productsGrid = document.querySelector('.products-grid');
const searchInput = document.querySelector('.search-bar input');
const brandButtons = document.querySelectorAll('.brand-button');
const cartModal = document.querySelector('.cart-modal');
const cartButton = document.querySelector('.cart-button');
const closeCartButton = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const checkoutButton = document.querySelector('.checkout-button');
const priceRangeInput = document.querySelector('.price-range');
const categoryCheckboxes = document.querySelectorAll('.categories input[type="checkbox"]');

// Funciones de utilidad
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Funciones de la API
async function fetchProducts() {
    try {
        showLoading();
        
        // Construir la URL con los parámetros necesarios
        const url = `${API_CONFIG.baseUrl}/${API_CONFIG.country}/products?consultant=${API_CONFIG.consultantId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Incluir cookies para mantener la sesión
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        products = data.products;
        filteredProducts = [...products];
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('No pudimos cargar los productos. Por favor intenta de nuevo más tarde.');
    } finally {
        hideLoading();
    }
}

async function authenticate() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consultantId: API_CONFIG.consultantId,
                country: API_CONFIG.country
            })
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

// Funciones de renderizado
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='./images/product-placeholder.svg'">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ${product.originalPrice > product.price ? `
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                        <span class="discount">-${calculateDiscount(product.originalPrice, product.price)}%</span>
                    ` : ''}
                    <span class="discount-price">${formatPrice(product.price)}</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        checkoutButton.disabled = true;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <div class="item-brand">${product.brand}</div>
                    <div class="item-name">${product.name}</div>
                    <div class="item-price">${formatPrice(product.price)}</div>
                    <div class="item-quantity">
                        <button onclick="updateCartItem(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItem(${product.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    updateCartSummary();
    checkoutButton.disabled = false;
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + (product.price * item.quantity);
    }, 0);

    document.querySelector('.subtotal .amount').textContent = formatPrice(subtotal);
    document.querySelector('.total .amount').textContent = formatPrice(subtotal);
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Funciones de filtrado
function filterProducts() {
    filteredProducts = products.filter(product => {
        const matchesBrand = selectedBrand === 'all' || product.brand.toLowerCase() === selectedBrand.toLowerCase();
        const matchesPrice = product.price <= priceRange;
        const matchesSearch = product.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesCategories = selectedCategories.size === 0 || 
                                [...selectedCategories].some(category => 
                                    product.categories.includes(category));

        return matchesBrand && matchesPrice && matchesSearch && matchesCategories;
    });

    renderProducts();
}

// Funciones del carrito
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    renderCart();
    showNotification('Producto agregado al carrito');
}

function updateCartItem(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Funciones de UI
function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await authenticate();
    fetchProducts();

    searchInput.addEventListener('input', filterProducts);

    brandButtons.forEach(button => {
        button.addEventListener('click', () => {
            brandButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedBrand = button.dataset.brand;
            filterProducts();
        });
    });

    priceRangeInput.addEventListener('input', (e) => {
        priceRange = parseInt(e.target.value);
        document.querySelector('.price-labels span:last-child').textContent = 
            formatPrice(priceRange);
        filterProducts();
    });

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedCategories.add(checkbox.value);
            } else {
                selectedCategories.delete(checkbox.value);
            }
            filterProducts();
        });
    });

    cartButton.addEventListener('click', () => {
        cartModal.classList.add('open');
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });

    checkoutButton.addEventListener('click', () => {
        // Implementar proceso de checkout
        alert('Función de checkout en desarrollo');
    });
});
