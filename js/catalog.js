document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = './login.html';
        return;
    }

    // Referencias a elementos del DOM
    const productsGrid = document.querySelector('.products-grid');
    const cartButton = document.querySelector('.cart-button');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartButton = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const brandButtons = document.querySelectorAll('.brand-button');
    const searchInput = document.querySelector('.search-bar input');
    const priceRange = document.querySelector('.price-range input[type="range"]');
    const categoryCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
    const checkoutButton = document.querySelector('.checkout-button');

    // Estado de la aplicación
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentFilters = {
        brand: 'all',
        category: [],
        priceRange: 1000000,
        searchTerm: ''
    };

    // Cargar productos
    async function loadProducts() {
        productsGrid.innerHTML = '<p class="loading">Cargando productos...</p>';
        try {
            // Usar productos locales en lugar de cargarlos desde GitHub
            products = [
                {
                    "id": "LB001",
                    "brand": "L'BEL",
                    "name": "Crema Hidratante Aqua Complex",
                    "category": "cuidado-facial",
                    "description": "Crema hidratante de uso diario con tecnología Aqua Complex.",
                    "price": 120000,
                    "originalPrice": 150000,
                    "image": "https://i.imgur.com/ZkBHxss.jpg",
                    "stock": 50
                },
                {
                    "id": "ES001",
                    "brand": "Ésika",
                    "name": "Labial Mate Hidratante",
                    "category": "maquillaje",
                    "description": "Labial de larga duración con acabado mate.",
                    "price": 45000,
                    "originalPrice": 55000,
                    "image": "https://i.imgur.com/1XvJFbF.jpg",
                    "stock": 100
                },
                {
                    "id": "CZ001",
                    "brand": "Cyzone",
                    "name": "Máscara de Pestañas Volume",
                    "category": "maquillaje",
                    "description": "Máscara que multiplica el volumen de las pestañas.",
                    "price": 35000,
                    "originalPrice": 42000,
                    "image": "https://i.imgur.com/QX7QaDf.jpg",
                    "stock": 75
                },
                {
                    "id": "LB002",
                    "brand": "L'BEL",
                    "name": "Perfume Magnifique",
                    "category": "fragancias",
                    "description": "Fragancia floral amaderada.",
                    "price": 180000,
                    "originalPrice": 220000,
                    "image": "https://i.imgur.com/8tQ3mN5.jpg",
                    "stock": 30
                },
                {
                    "id": "ES002",
                    "brand": "Ésika",
                    "name": "Base Líquida HD",
                    "category": "maquillaje",
                    "description": "Base de alta cobertura con tecnología HD.",
                    "price": 65000,
                    "originalPrice": 80000,
                    "image": "https://i.imgur.com/KZ1AhYd.jpg",
                    "stock": 85
                },
                {
                    "id": "CZ002",
                    "brand": "Cyzone",
                    "name": "Esmalte Larga Duración",
                    "category": "unas",
                    "description": "Esmalte de uñas con fórmula de larga duración.",
                    "price": 25000,
                    "originalPrice": 30000,
                    "image": "https://i.imgur.com/VxBDvmB.jpg",
                    "stock": 120
                }
            ];
            renderProducts();
            updateCart();
        } catch (error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p class="error-message">Error al cargar los productos. Por favor, intenta más tarde.</p>';
        }
    }

    // Renderizar productos
    function renderProducts() {
        const filteredProducts = filterProducts();
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-results">No se encontraron productos que coincidan con tu búsqueda.</p>';
            return;
        }

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://raw.githubusercontent.com/CalebAnderson-Coder/belcorp-catalog/gh-pages/images/product-placeholder.svg'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-price">
                        <span class="original-price">$${(product.originalPrice || product.price).toLocaleString()}</span>
                        <span class="discount-price">$${product.price.toLocaleString()}</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Filtrar productos
    function filterProducts() {
        return products.filter(product => {
            const matchBrand = currentFilters.brand === 'all' || product.brand.toLowerCase() === currentFilters.brand.toLowerCase();
            const matchCategory = currentFilters.category.length === 0 || 
                                currentFilters.category.includes(product.category);
            const matchPrice = product.price <= currentFilters.priceRange;
            const matchSearch = product.name.toLowerCase().includes(currentFilters.searchTerm.toLowerCase()) ||
                              product.description.toLowerCase().includes(currentFilters.searchTerm.toLowerCase());
            
            return matchBrand && matchCategory && matchPrice && matchSearch;
        });
    }

    // Funciones del carrito
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
        showCartNotification('Producto agregado al carrito');
    }

    window.updateQuantity = function(productId, change) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        updateCart();
    }

    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        showCartNotification('Producto eliminado del carrito');
    }

    function updateCart() {
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

        // Actualizar items del carrito
        cartItems.innerHTML = cart.length === 0 
            ? '<p class="empty-cart">Tu carrito está vacío</p>'
            : cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://raw.githubusercontent.com/CalebAnderson-Coder/belcorp-catalog/gh-pages/images/product-placeholder.svg'">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toLocaleString()}</div>
                        <div class="item-quantity">
                            <button onclick="updateQuantity('${item.id}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

        // Actualizar totales
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        document.querySelector('.subtotal .amount').textContent = `$${subtotal.toLocaleString()}`;
        document.querySelector('.total .amount').textContent = `$${subtotal.toLocaleString()}`;

        // Actualizar estado del botón de checkout
        checkoutButton.disabled = cart.length === 0;
    }

    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    // Event Listeners
    cartButton.addEventListener('click', () => {
        cartModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Cerrar carrito al hacer clic fuera
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    brandButtons.forEach(button => {
        button.addEventListener('click', () => {
            brandButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilters.brand = button.dataset.brand;
            renderProducts();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentFilters.searchTerm = e.target.value;
        renderProducts();
    });

    priceRange.addEventListener('input', (e) => {
        currentFilters.priceRange = parseInt(e.target.value);
        renderProducts();
    });

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            currentFilters.category = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            renderProducts();
        });
    });

    // Inicializar
    loadProducts();
});
