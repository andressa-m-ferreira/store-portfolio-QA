// Cart page functionality
class Cart {
    constructor() {
        this.cart = [];
        this.itemToRemove = null;
        this.userSession = null;
        this.init();
    }

    async init() {
        this.loadCartFromStorage();
        this.loadUserSessionFromStorage();
        await this.syncCartWithServer();
        await this.verifyUserSession();
        this.renderCart();
        this.setupEventListeners();
        this.updateLoginButton();
    }

    loadCartFromStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                this.cart = JSON.parse(storedCart);
            } catch (error) {
                console.error('Error parsing stored cart:', error);
                this.cart = [];
            }
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadUserSessionFromStorage() {
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
            try {
                this.userSession = JSON.parse(storedSession);
            } catch (error) {
                console.error('Error parsing stored user session:', error);
                this.userSession = null;
            }
        }
    }

    saveUserSession() {
        try {
            localStorage.setItem('userSession', JSON.stringify(this.userSession));
            console.log('User session saved:', this.userSession);
        } catch (error) {
            console.error('Error saving user session:', error);
        }
    }

    clearUserSession() {
        try {
            localStorage.removeItem('userSession');
            console.log('User session cleared');
        } catch (error) {
            console.error('Error clearing user session:', error);
        }
    }

    async syncCartWithServer() {
        try {
            const response = await fetch('/api/cart');
            const serverCart = await response.json();
            
            // Merge server cart with local cart, prioritizing server data
            if (serverCart.length > 0) {
                this.cart = serverCart;
                this.saveCartToStorage();
            }
        } catch (error) {
            console.error('Error syncing cart with server:', error);
        }
    }

    async verifyUserSession() {
        if (this.userSession) {
            try {
                console.log('Verifying user session:', this.userSession);
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${this.userSession.token}`
                    }
                });

                if (!response.ok) {
                    console.log('Session verification failed, clearing session');
                    this.userSession = null;
                    this.clearUserSession();
                } else {
                    console.log('Session verified successfully');
                }
            } catch (error) {
                console.error('Error verifying user session:', error);
                this.userSession = null;
                this.clearUserSession();
            }
        } else {
            console.log('No user session to verify');
        }
    }

    renderCart() {
        const cartContent = document.getElementById('cartContent');
        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="/" class="btn btn-primary">Go to Store</a>
                </div>
            `;
            return;
        }

        const cartItemsHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)} per unit</div>
                    <div class="cart-item-subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="cart.showRemoveConfirmation(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        cartContent.innerHTML = `
            <div class="cart-items">
                ${cartItemsHTML}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span class="cart-total-label">Total:</span>
                    <span class="cart-total-amount">$${totalPrice.toFixed(2)}</span>
                </div>
                ${totalPrice >= 500.00 && !this.userSession ? 
                    '<div class="auth-notice"><i class="fas fa-info-circle"></i> Login required for purchases $500.00 or more</div>' : 
                    ''
                }
                <button class="checkout-btn" onclick="cart.completePurchase()">
                    <i class="fas fa-credit-card"></i> Complete Purchase
                </button>
            </div>
        `;
    }

    async updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.showRemoveConfirmation(productId);
            return;
        }

        try {
            const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity: newQuantity })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cart = result.cart;
                this.saveCartToStorage();
                this.renderCart();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    }

    async removeItem(productId) {
        try {
            const response = await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cart = result.cart;
                this.saveCartToStorage();
                this.renderCart();
                this.hideRemoveModal();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    showRemoveConfirmation(productId) {
        this.itemToRemove = productId;
        const modal = document.getElementById('removeModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideRemoveModal() {
        const modal = document.getElementById('removeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.itemToRemove = null;
    }

    async completePurchase() {
        const totalAmount = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Check if authentication is required
        if (totalAmount >= 500.00 && !this.userSession) {
            this.showAuthRequiredModal();
            return;
        }

        try {
            const response = await fetch('/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    sessionToken: this.userSession ? this.userSession.token : null 
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cart = [];
                this.saveCartToStorage();
                this.showCheckoutSuccess(result);
            } else if (result.requiresAuth) {
                this.showAuthRequiredModal();
            }
        } catch (error) {
            console.error('Error completing purchase:', error);
        }
    }

    showCheckoutSuccess(result) {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            const message = modal.querySelector('p');
            if (result.authenticated) {
                message.textContent = `Thank you for your purchase! Total: $${result.totalAmount.toFixed(2)} (Authenticated user)`;
            } else {
                message.textContent = `Thank you for your purchase! Total: $${result.totalAmount.toFixed(2)}`;
            }
            modal.style.display = 'block';
        }
    }

    showAuthRequiredModal() {
        const modal = document.getElementById('authRequiredModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideAuthRequiredModal() {
        const modal = document.getElementById('authRequiredModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Authentication methods
    async login(email, password) {
        // Clear any previous error messages
        this.clearLoginErrors();
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            
            if (result.success) {
                this.userSession = {
                    token: result.sessionToken,
                    user: result.user
                };
                this.saveUserSession();
                this.updateLoginButton();
                this.hideLoginModal();
                this.hideAuthRequiredModal();
                this.renderCart(); // Re-render to update auth notice
                this.showMessage('Login successful! You can now complete your purchase.', 'success');
            } else {
                this.showLoginError(result.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.showLoginError('Login failed. Please try again.');
        }
    }

    async logout() {
        if (!this.userSession) return;

        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionToken: this.userSession.token })
            });

            this.userSession = null;
            this.clearUserSession();
            this.updateLoginButton();
            this.renderCart(); // Re-render to update auth notice
            this.showMessage('Logout successful!', 'success');
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if server logout fails, clear local session
            this.userSession = null;
            this.clearUserSession();
            this.updateLoginButton();
            this.renderCart();
        }
    }

    updateLoginButton() {
        const loginBtn = document.getElementById('loginBtn');
        const loginText = document.getElementById('loginText');
        
        if (this.userSession) {
            loginBtn.classList.add('logged-in');
            loginText.textContent = this.userSession.user.email;
            loginBtn.onclick = () => this.logout();
        } else {
            loginBtn.classList.remove('logged-in');
            loginText.textContent = 'Login';
            loginBtn.onclick = () => this.showLoginModal();
        }
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            this.clearLoginErrors();
            modal.style.display = 'block';
        }
    }

    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            this.clearLoginErrors();
            modal.style.display = 'none';
        }
    }

    showLoginError(message) {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.textContent = message;
            loginError.classList.add('show');
        }
    }

    clearLoginErrors() {
        // Clear error messages
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const loginError = document.getElementById('loginError');
        
        if (emailError) emailError.classList.remove('show');
        if (passwordError) passwordError.classList.remove('show');
        if (loginError) loginError.classList.remove('show');
        
        // Remove error styling from inputs
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) emailInput.classList.remove('error');
        if (passwordInput) passwordInput.classList.remove('error');
    }

    showMessage(message, type = 'info') {
        // Simple message display - you can enhance this with a proper toast system
        alert(message);
    }

    setupEventListeners() {
        // Remove confirmation modal
        const cancelRemoveBtn = document.getElementById('cancelRemove');
        if (cancelRemoveBtn) {
            cancelRemoveBtn.addEventListener('click', () => {
                this.hideRemoveModal();
            });
        }

        const confirmRemoveBtn = document.getElementById('confirmRemove');
        if (confirmRemoveBtn) {
            confirmRemoveBtn.addEventListener('click', () => {
                if (this.itemToRemove) {
                    this.removeItem(this.itemToRemove);
                }
            });
        }

        // Authentication required modal
        const loginForPurchaseBtn = document.getElementById('loginForPurchase');
        if (loginForPurchaseBtn) {
            loginForPurchaseBtn.addEventListener('click', () => {
                this.hideAuthRequiredModal();
                this.showLoginModal();
            });
        }

        const cancelAuthBtn = document.getElementById('cancelAuth');
        if (cancelAuthBtn) {
            cancelAuthBtn.addEventListener('click', () => {
                this.hideAuthRequiredModal();
            });
        }

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                this.login(email, password);
            });
        }

        // Cancel login button
        const cancelLoginBtn = document.getElementById('cancelLogin');
        if (cancelLoginBtn) {
            cancelLoginBtn.addEventListener('click', () => {
                this.hideLoginModal();
            });
        }

        // Login button click
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (this.userSession) {
                    this.logout();
                } else {
                    this.showLoginModal();
                }
            });
        }

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            const removeModal = document.getElementById('removeModal');
            const checkoutModal = document.getElementById('checkoutModal');
            const authRequiredModal = document.getElementById('authRequiredModal');
            const loginModal = document.getElementById('loginModal');
            
            if (e.target === removeModal) {
                this.hideRemoveModal();
            }
            
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
            }

            if (e.target === authRequiredModal) {
                this.hideAuthRequiredModal();
            }

            if (e.target === loginModal) {
                this.hideLoginModal();
            }
        });
    }
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});
