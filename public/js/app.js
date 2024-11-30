// Constants
let EXCHANGE_RATE = 3100; // Default rate
const MARKUP = 1.40;
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/COP';

// State
let products = [];
let filteredProducts = [];
let currentCategory = 'all';
let searchQuery = '';

// Update exchange rate from API
async function updateExchangeRate() {
    try {
        const response = await fetch(EXCHANGE_API_URL);
        const data = await response.json();
        EXCHANGE_RATE = 1 / data.rates.USD;
        console.log('Exchange rate updated:', EXCHANGE_RATE);
        // Re-render products with new rate
        renderProducts();
    } catch (error) {
        console.error('Error updating exchange rate:', error);
    }
}

// Convert COP to USD
function convertToUSD(copPrice) {
    return ((copPrice / EXCHANGE_RATE) * MARKUP).toFixed(2);
}

// Format number as currency
function formatCurrency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Render products
function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    filteredProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-4';

        const card = document.createElement('div');
        card.className = 'card h-100';
        
        const usdPrice = convertToUSD(product.price);
        
        card.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <div class="price-tag mb-2">
                    COP $${formatCurrency(product.price)}
                </div>
                <div class="price-tag mb-3">
                    USD $${usdPrice}
                </div>
                <button class="btn btn-add-cart mt-auto" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        
        col.appendChild(card);
        productsContainer.appendChild(col);
    });
}

// Filter products by category
function filterProducts() {
    filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    renderProducts();
}

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('js/products.json');
        products = await response.json();
        filteredProducts = products;
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadProducts();
    updateExchangeRate();
    
    // Update exchange rate every hour
    setInterval(updateExchangeRate, 3600000);
    
    // Category filter
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (link.id === 'showAll') {
                currentCategory = 'all';
            } else {
                currentCategory = link.getAttribute('data-category');
            }
            filterProducts();
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterProducts();
    });
});
