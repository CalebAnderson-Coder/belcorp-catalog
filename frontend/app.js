// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// Variables globales
let currentPDF = null;
let currentPage = 1;
let currentZoom = 1.0;
let cart = [];

// Catálogos disponibles
const catalogs = [
    {
        id: 1,
        name: 'Catálogo Cyzone',
        filename: 'cyzonec1.pdf',
        image: './assets/cyzone.jpeg',
        url: './pdfs/cyzonec1.pdf'
    },
    {
        id: 2,
        name: 'Catálogo Ésika',
        filename: 'ESIKA 1C.pdf',
        image: './assets/esika.jpeg',
        url: './pdfs/ESIKA 1C.pdf'
    },
    {
        id: 3,
        name: 'Catálogo L\'BEL',
        filename: 'lbelc1.pdf',
        image: './assets/lbel.jpeg',
        url: './pdfs/lbelc1.pdf'
    }
];

// Cargar los catálogos
function loadCatalogs() {
    const catalogList = document.getElementById('catalogList');
    catalogList.innerHTML = '';
    
    catalogs.forEach(catalog => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        const card = document.createElement('div');
        card.className = 'card catalog-card';
        card.addEventListener('click', () => openPDF(catalog.url, catalog.name));
        
        card.innerHTML = `
            <img src="${catalog.image}" class="catalog-image" alt="${catalog.name}">
            <div class="card-body">
                <h5 class="card-title">${catalog.name}</h5>
                <button class="btn btn-primary">Ver Catálogo</button>
            </div>
        `;
        
        col.appendChild(card);
        catalogList.appendChild(col);
    });
}

// Función para abrir PDF
async function openPDF(url, title) {
    try {
        const loadingIndicator = document.getElementById('loading');
        loadingIndicator.style.display = 'block';
        
        const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
        modal.show();
        
        document.querySelector('.modal-title').textContent = title;
        
        const loadingTask = pdfjsLib.getDocument(url);
        currentPDF = await loadingTask.promise;
        
        currentPage = 1;
        await renderPage(currentPage);
        updatePageInfo();
        
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error al cargar el PDF:', error);
        alert('Error al cargar el catálogo. Por favor, intente nuevamente.');
    }
}

// Renderizar página del PDF
async function renderPage(pageNumber) {
    try {
        const page = await currentPDF.getPage(pageNumber);
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        
        const viewport = page.getViewport({ scale: currentZoom });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
    } catch (error) {
        console.error('Error al renderizar la página:', error);
    }
}

// Actualizar información de página
function updatePageInfo() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = currentPDF.numPages;
}

// Navegación entre páginas
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updatePageInfo();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < currentPDF.numPages) {
        currentPage++;
        renderPage(currentPage);
        updatePageInfo();
    }
});

// Funciones del carrito
function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h6>${item.name}</h6>
                <small>Precio: $${item.price.toFixed(2)}</small>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                    🗑️
                </button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, item.quantity + delta);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartModal();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartModal();
}

function toggleCart() {
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
}

function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Gracias por tu compra!\nTotal: $${total.toFixed(2)}`);
    
    cart = [];
    updateCartCount();
    updateCartModal();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    modal.hide();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', loadCatalogs);
