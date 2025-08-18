// Store page functionality
class Store {
    constructor() {
        this.products = [];
        this.cart = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.userSession = null;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadCartFromStorage();
        await this.syncCartWithServer();
        this.renderProducts();
        this.updateCartCount();
        this.renderPagination();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    async loadProducts(page = 1) {
        try {
            const response = await fetch(`/api/products?page=${page}`);
            const data = await response.json();
            this.products = data.products;
            this.currentPage = data.pagination.currentPage;
            this.totalPages = data.pagination.totalPages;
        } catch (error) {
            console.error('Error loading products:', error);
        }
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

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="store.changePage(${this.currentPage - 1})">Previous</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" disabled>Previous</button>`;
        }

        // Page info
        paginationHTML += `<span class="pagination-info">Page ${this.currentPage} of ${this.totalPages}</span>`;

        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="store.changePage(${this.currentPage + 1})">Next</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" disabled>Next</button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    async changePage(page) {
        await this.loadProducts(page);
        this.renderProducts();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async addToCart(productId) {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: parseInt(productId) })
            });

            const result = await response.json();
            
            if (result.success) {
                this.cart = result.cart;
                this.saveCartToStorage();
                this.updateCartCount();
                this.showSuccessModal();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'block';
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
                this.showMessage('Login successful!', 'success');
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
            this.showMessage('Logout successful!', 'success');
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if server logout fails, clear local session
            this.userSession = null;
            this.clearUserSession();
            this.updateLoginButton();
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

    async checkAuthStatus() {
        // Check if there's a stored session
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
            try {
                const session = JSON.parse(storedSession);
                console.log('Found stored session:', session);
                
                // Verify the session with the server
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${session.token}`
                    }
                });

                if (response.ok) {
                    this.userSession = session;
                    this.updateLoginButton();
                    console.log('Session verified successfully');
                } else {
                    console.log('Session verification failed, clearing session');
                    this.userSession = null;
                    this.clearUserSession();
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                this.userSession = null;
                this.clearUserSession();
            }
        } else {
            console.log('No stored session found');
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
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.dataset.productId;
                this.addToCart(productId);
            }
        });

        // Modal close buttons
        const closeBtns = document.querySelectorAll('.close');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

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
    }
}

// Initialize store when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.store = new Store();
});
