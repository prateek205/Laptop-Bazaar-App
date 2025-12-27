// Laptop Bazaar App - Main JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Gaming Beast Pro",
        category: "gaming",
        price: 1499.99,
        image: "img/laptop-img/lenovo-laptop.png",
        description: "High-performance gaming laptop with RTX 4080, 32GB RAM, and 1TB SSD."
    },
    {
        id: 2,
        name: "Business Elite X1",
        category: "business",
        price: 1299.99,
        image: "img/laptop-img/apple-laptop.png",
        description: "Secure business laptop with fingerprint reader, 16GB RAM, and 512GB SSD."
    },
    {
        id: 3,
        name: "UltraBook Air",
        category: "ultrabook",
        price: 1199.99,
        image: "img/laptop-img/dell-laptop.png",
        description: "Lightweight ultrabook with 14-inch display, 16GB RAM, and 512GB SSD."
    },
    {
        id: 4,
        name: "Budget Mate 3000",
        category: "budget",
        price: 499.99,
        image: "img/laptop-img/hp-laptop.png",
        description: "Affordable laptop for everyday tasks with 8GB RAM and 256GB SSD."
    },
    {
        id: 5,
        name: "Gaming Titan X",
        category: "gaming",
        price: 1999.99,
        image: "img/laptop-img/lenovo-laptop.png",
        description: "Extreme gaming laptop with RTX 4090, 64GB RAM, and 2TB SSD."
    },
    {
        id: 6,
        name: "Business Pro 360",
        category: "business",
        price: 1599.99,
        image: "img/laptop-img/hp-laptop.png",
        description: "Convertible business laptop with touchscreen and 4G LTE connectivity."
    },
    {
        id: 7,
        name: "UltraBook Pro",
        category: "ultrabook",
        price: 1399.99,
        image: "img/laptop-img/dell-laptop.png",
        description: "Professional ultrabook with 4K display and 10-hour battery life."
    },
    {
        id: 8,
        name: "EduBook 100",
        category: "budget",
        price: 399.99,
        image: "img/laptop-img/lenovo-laptop.png",
        description: "Budget-friendly laptop for students with 8GB RAM and 128GB SSD."
    }
];

// Cart state
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM elements
const productGrid = document.getElementById('productGrid');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCountElement = document.querySelector('.cart-count');
const totalPriceElement = document.querySelector('.total-price');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const contactForm = document.getElementById('contactForm');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const categoryCards = document.querySelectorAll('.category-card');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    updateCartUI();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Cart toggle
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    // Category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
            
            // Filter products
            filterProducts(category);
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Clear cart
    clearCartBtn.addEventListener('click', clearCart);
    
    // Checkout
    checkoutBtn.addEventListener('click', openCheckoutModal);
    closeModal.addEventListener('click', closeCheckoutModal);
    
    // Form submissions
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
}

// Render products to the grid
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
    
    // Open cart on mobile
    if (window.innerWidth < 768) {
        toggleCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Item removed from cart');
}

// Update cart quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // Remove if quantity is 0 or less
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        updateCartUI();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    showNotification('Cart cleared');
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    
    // Update cart total
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Update cart items
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart item buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Toggle cart visibility
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Open checkout modal
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some products first!');
        return;
    }
    
    // Update checkout items
    checkoutItems.innerHTML = '';
    let checkoutTotalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        checkoutTotalPrice += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        
        checkoutItems.appendChild(itemElement);
    });
    
    checkoutTotal.textContent = `$${checkoutTotalPrice.toFixed(2)}`;
    
    // Show modal
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close checkout modal
function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Place order
function placeOrder() {
    alert(`Order placed successfully! Total: $${cartTotal.toFixed(2)}\nThank you for shopping with Laptop Bazaar!`);
    
    // Clear cart and close modals
    clearCart();
    closeCheckoutModal();
    toggleCart();
    
    // Reset form
    checkoutForm.reset();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: var(--shadow);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        filterProducts('all');
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') !== 'all') {
                btn.classList.remove('active');
            }
        });
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
    
    // Update filter buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            nav.classList.remove('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});