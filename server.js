const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample electronics products data (18 products total)
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
        id: 2,
        name: "Smartphone",
        description: "Latest smartphone with advanced camera and long battery life",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop"
    },
    {
        id: 3,
        name: "Laptop",
        description: "Powerful laptop for work and gaming",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop"
    },
    {
        id: 4,
        name: "Smart Watch",
        description: "Fitness tracking and notifications on your wrist",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"
    },
    {
        id: 5,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse for comfortable computing",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop"
    },
    {
        id: 6,
        name: "USB-C Cable",
        description: "Fast charging and data transfer cable",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=200&fit=crop"
    },
    {
        id: 7,
        name: "Gaming Keyboard",
        description: "Mechanical RGB gaming keyboard with customizable keys",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=200&fit=crop"
    },
    {
        id: 8,
        name: "Webcam HD",
        description: "High-definition webcam for video calls and streaming",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300&h=200&fit=crop"
    },
    {
        id: 9,
        name: "External SSD",
        description: "1TB external solid state drive for fast data transfer",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=200&fit=crop"
    },
    {
        id: 10,
        name: "Wireless Earbuds",
        description: "True wireless earbuds with active noise cancellation",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=200&fit=crop"
    },
    {
        id: 11,
        name: "Tablet",
        description: "10-inch tablet perfect for entertainment and productivity",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop"
    },
    {
        id: 12,
        name: "Bluetooth Speaker",
        description: "Portable waterproof Bluetooth speaker with deep bass",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop"
    },
    {
        id: 13,
        name: "Monitor 4K",
        description: "27-inch 4K Ultra HD monitor for professional work",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop"
    },
    {
        id: 14,
        name: "Gaming Headset",
        description: "7.1 surround sound gaming headset with microphone",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
        id: 15,
        name: "Wireless Charger",
        description: "Fast wireless charging pad for smartphones",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop"
    },
    {
        id: 16,
        name: "Action Camera",
        description: "4K action camera for adventure and sports recording",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop"
    },
    {
        id: 17,
        name: "Smart Speaker",
        description: "Voice-controlled smart speaker with premium sound",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&h=200&fit=crop"
    },
    {
        id: 18,
        name: "Gaming Mouse",
        description: "High-precision gaming mouse with adjustable DPI",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop"
    }
];

// Shopping cart storage (in memory for demo)
let cart = [];

// User authentication (in memory for demo)
const validUsers = [
    {
        email: "test@test.com",
        password: "test123"
    }
];

// Session management (in memory for demo)
let activeSessions = {};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// API Routes
app.get('/api/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / limit);
    
    res.json({
        products: paginatedProducts,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalProducts: products.length,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart/add', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    res.json({ success: true, cart });
});

app.put('/api/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    const item = cart.find(item => item.id === productId);
    
    if (!item) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        item.quantity = quantity;
    }
    
    res.json({ success: true, cart });
});

app.delete('/api/cart/remove', (req, res) => {
    const { productId } = req.body;
    cart = cart.filter(item => item.id !== productId);
    res.json({ success: true, cart });
});

// User authentication endpoints
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate simple session token
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    activeSessions[sessionToken] = { email: user.email, loginTime: new Date() };
    
    res.json({ 
        success: true, 
        message: 'Login successful',
        sessionToken: sessionToken,
        user: { email: user.email }
    });
});

app.post('/api/auth/logout', (req, res) => {
    const { sessionToken } = req.body;
    
    if (sessionToken && activeSessions[sessionToken]) {
        // Clear the user's cart when they logout (demo behavior)
        cart = [];
        delete activeSessions[sessionToken];
        res.json({ success: true, message: 'Logout successful' });
    } else {
        res.status(400).json({ error: 'Invalid session token' });
    }
});

app.get('/api/auth/verify', (req, res) => {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken || !activeSessions[sessionToken]) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    res.json({ 
        success: true, 
        user: { email: activeSessions[sessionToken].email }
    });
});

app.post('/api/cart/checkout', (req, res) => {
    const { sessionToken } = req.body;
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Check if purchase amount requires authentication
    if (totalAmount >= 500.00) {
        if (!sessionToken || !activeSessions[sessionToken]) {
            return res.status(401).json({ 
                error: 'Authentication required for purchases $500.00 or more',
                requiresAuth: true,
                totalAmount: totalAmount
            });
        }
    }
    
    // Process purchase
    cart = []; // Clear cart after successful checkout
    res.json({ 
        success: true, 
        message: 'Purchase completed successfully!',
        totalAmount: totalAmount,
        authenticated: sessionToken && activeSessions[sessionToken] ? true : false
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
