// Cart state
let cart = [];
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showToast('Producto agregado al carrito');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Calculate totals
function calculateTotals() {
    const totalCOP = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalUSD = convertToUSD(totalCOP);
    
    document.getElementById('cartTotalCOP').textContent = formatCurrency(totalCOP);
    document.getElementById('cartTotalUSD').textContent = totalUSD;
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item d-flex align-items-center justify-content-between p-3';
        
        itemDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="ms-3">
                    <h6 class="mb-0">${item.name}</h6>
                    <small class="text-muted">
                        COP $${formatCurrency(item.price)} / USD $${convertToUSD(item.price)}
                    </small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <div class="quantity-control me-3">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(itemDiv);
    });
    
    calculateTotals();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">Notificación</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Share order via WhatsApp
function shareWhatsApp() {
    let message = "🛍️ *Nuevo Pedido Belcorp*\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Cantidad: ${item.quantity}\n`;
        message += `  Precio: COP $${formatCurrency(item.price)} / USD $${convertToUSD(item.price)}\n\n`;
    });
    
    const totalCOP = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalUSD = convertToUSD(totalCOP);
    
    message += `\n💰 *Total:*\n`;
    message += `COP $${formatCurrency(totalCOP)}\n`;
    message += `USD $${totalUSD}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`);
}

// Export to Excel
function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    const data = cart.map(item => ({
        'Producto': item.name,
        'Cantidad': item.quantity,
        'Precio COP': item.price,
        'Precio USD': convertToUSD(item.price),
        'Total COP': item.price * item.quantity,
        'Total USD': convertToUSD(item.price * item.quantity)
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Pedido");
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Pedido_Belcorp_${date}.xlsx`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Cart button
    document.getElementById('cartButton').addEventListener('click', () => {
        renderCart();
        cartModal.show();
    });
    
    // WhatsApp share
    document.getElementById('shareWhatsApp').addEventListener('click', shareWhatsApp);
    
    // Excel export
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
});
