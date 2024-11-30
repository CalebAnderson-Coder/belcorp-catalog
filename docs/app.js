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
        filename: 'Cy Zone C01.pdf',
        image: 'assets/cyzone.jpg',
        url: 'pdfs/Cy Zone C01.pdf'
    },
    {
        id: 2,
        name: 'Catálogo Ésika',
        filename: 'ESika C01.pdf',
        image: 'assets/esika.jpg',
        url: 'pdfs/ESika C01.pdf'
    },
    {
        id: 3,
        name: 'Catálogo L\'Bel',
        filename: 'LBel C01.pdf',
        image: 'assets/lbel.jpg',
        url: 'pdfs/LBel C01.pdf'
    }
];

// Cargar los catálogos
function loadCatalogs() {
    const catalogList = document.getElementById('catalogList');
    catalogList.innerHTML = '';
    
    catalogs.forEach(catalog => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card catalog-card" onclick="openPDF('${catalog.url}', '${catalog.name}')">
                <img src="${catalog.image}" class="catalog-image" alt="${catalog.name}">
                <div class="catalog-overlay">
                    <h5 class="card-title">${catalog.name}</h5>
                    <p class="card-text">Click para ver el catálogo</p>
                </div>
            </div>
        `;
        catalogList.appendChild(col);
    });
}

// Abrir PDF en el visor
async function openPDF(url, title) {
    const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
    modal.show();
    
    document.querySelector('.modal-title').textContent = title;
    
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        currentPDF = await loadingTask.promise;
        currentPage = 1;
        currentZoom = 1.0;
        
        renderPage(1);
        updatePageInfo();
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error al cargar el catálogo. Por favor, intenta de nuevo.');
    }
}

// Renderizar página del PDF
async function renderPage(pageNumber) {
    try {
        const page = await currentPDF.getPage(pageNumber);
        const viewport = page.getViewport({ scale: currentZoom });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.innerHTML = '';
        canvas.className = 'pdf-page';
        pdfViewer.appendChild(canvas);
        
        updatePageInfo();
        
    } catch (error) {
        console.error('Error rendering page:', error);
        alert('Error al mostrar la página. Por favor, intenta de nuevo.');
    }
}

// Actualizar información de página
function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${currentPDF.numPages}`;
    document.getElementById('zoomInfo').textContent = `${Math.round(currentZoom * 100)}%`;
}

// Navegación de páginas
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
}

function nextPage() {
    if (currentPage < currentPDF.numPages) {
        currentPage++;
        renderPage(currentPage);
    }
}

// Control de zoom
function changeZoom(delta) {
    const newZoom = currentZoom + delta;
    if (newZoom >= 0.5 && newZoom <= 3.0) {
        currentZoom = newZoom;
        renderPage(currentPage);
    }
}

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
