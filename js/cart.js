// Cart state
let cart = [];
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('belcorpCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('belcorpCart', JSON.stringify(cart));
    updateCartUI();
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    renderCartModal();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.priceCOP,
            priceUSD: product.priceUSD,
            image: product.image,
            quantity: 1
        });
    }

    // Guardar en localStorage
    saveCart();
    showCartNotification();
}

// Remove from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        renderCartModal();
    }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1);
        saveCart();
        renderCartModal();
    }
}

// Render cart modal
function renderCartModal() {
    const modalBody = document.querySelector('#cartModal .modal-body');
    if (!modalBody) return;

    if (cart.length === 0) {
        modalBody.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
        return;
    }

    let totalCOP = 0;
    let totalUSD = 0;

    const cartHTML = cart.map(item => {
        const itemTotalCOP = item.price * item.quantity;
        const itemTotalUSD = item.priceUSD * item.quantity;
        totalCOP += itemTotalCOP;
        totalUSD += itemTotalUSD;

        return `
            <div class="cart-item mb-3">
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid">
                    </div>
                    <div class="col-5">
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">
                            COP $${item.price.toLocaleString()} / USD $${item.priceUSD.toFixed(2)}
                        </small>
                    </div>
                    <div class="col-2">
                        <input type="number" class="form-control form-control-sm" 
                            value="${item.quantity}" min="1" 
                            onchange="updateQuantity(${item.id}, this.value)">
                    </div>
                    <div class="col-2">
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    modalBody.innerHTML = `
        ${cartHTML}
        <div class="cart-total mt-3 pt-3 border-top">
            <div class="row">
                <div class="col-6">
                    <strong>Total COP:</strong>
                </div>
                <div class="col-6 text-end">
                    $${totalCOP.toLocaleString()}
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <strong>Total USD:</strong>
                </div>
                <div class="col-6 text-end">
                    $${totalUSD.toFixed(2)}
                </div>
            </div>
        </div>
    `;
}

// Show cart notification
function showCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
}

// Share cart
function shareCart() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let message = '🛍️ Mi pedido Belcorp:\n\n';
    let totalCOP = 0;
    let totalUSD = 0;

    cart.forEach(item => {
        const itemTotalCOP = item.price * item.quantity;
        const itemTotalUSD = item.priceUSD * item.quantity;
        totalCOP += itemTotalCOP;
        totalUSD += itemTotalUSD;

        message += `${item.quantity}x ${item.name}\n`;
        message += `COP $${item.price.toLocaleString()} c/u\n`;
        message += `USD $${item.priceUSD.toFixed(2)} c/u\n\n`;
    });

    message += `\nTotal COP: $${totalCOP.toLocaleString()}`;
    message += `\nTotal USD: $${totalUSD.toFixed(2)}`;

    // Codificar el mensaje para WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Cart button
    document.getElementById('cartButton').addEventListener('click', () => {
        renderCartModal();
        cartModal.show();
    });
    
    // WhatsApp share
    document.getElementById('shareCart').addEventListener('click', shareCart);
});
