# TechStore - store and cart

A modern, responsive web application for an electronics e-commerce store featuring a comprehensive shopping cart system, user authentication, and purchase validation. Built with HTML, CSS, JavaScript, and Express.js.

## Features

### Store Page
- **Product Display**: Beautiful product cards with images, descriptions, and prices
- **Pagination**: 9 products per page with navigation controls (18 total products)
- **Add to Cart**: One-click product addition with success confirmation
- **Real-time Cart Count**: Live updates of items in cart
- **Responsive Design**: Works seamlessly on all device sizes

### Shopping Cart
- **Cart Management**: View all added products with quantities and subtotals
- **Quantity Controls**: Increase/decrease product quantities with +/- buttons
- **Remove Items**: Delete items with trash icon or confirmation when quantity reaches zero
- **Total Calculation**: Automatic calculation of cart total
- **Checkout Process**: Complete purchase with success confirmation
- **Authentication Requirements**: Login required for purchases $500.00 or more

### User Authentication
- **Login System**: Simple email/password authentication
- **Session Management**: Secure session tokens for authenticated users
- **Test Account**: Pre-configured test user (test@test.com / test123)
- **Purchase Validation**: Automatic authentication checks for high-value orders

## Requirements Implementation

- ✅ R01 - Adding a product to the cart: Users can add products with initial quantity of 1
- ✅ R02 - Removing a product from the cart: Trash icon removal with confirmation dialog
- ✅ R03 - Change product quantity: +/- buttons for quantity adjustment
- ✅ R04 - Shopping cart display: Complete cart information with subtotals and total
- ✅ R05 - Product pagination: 9 products per page, 2 pages total (18 products)
- ✅ R06 - Purchase validation: Authentication required for purchases >= $500.00

## Project Highlights: Challenges & Achievements

This project served as a comprehensive endeavor to demonstrate proficiency in Quality Assurance and test automation, addressing several key challenges:

*   **Leveraging Generative AI for Project Foundation:** The initial phase involved utilizing Generative AI to define project requisites and facilitate the application's foundational build, streamlining the setup process and ensuring alignment with modern development practices.

*   **Strategic Test Planning & Case Design:** A robust test strategy was meticulously planned, encompassing various testing types. Detailed test cases were designed and documented in the project's Wiki, ensuring comprehensive coverage of functionalities and user journeys.
    *    Wiki: [Test Plans and Test Cases](https://github.com/andressa-m-ferreira/store-portfolio-QA/wiki/Test-plan-and-test-cases)

*   **Efficient Test Execution & Defect Reporting:** Tests were systematically executed, and any identified defects were thoroughly reported, contributing to the overall stability and quality of the application.

*   **Front-end Test Automation with Cypress:** Critical front-end functionalities were automated using Cypress, ensuring rapid and reliable regression testing for the user interface and user experience. This automation significantly reduced manual testing effort and accelerated feedback cycles.

*   **Performance Test Automation with K6:** To assess the application's resilience and responsiveness under load, performance tests were automated using K6. This included scripting scenarios for key API endpoints and user flows, providing insights into the system's behavior under various load conditions.

These efforts collectively ensured a high-quality application and demonstrated a full lifecycle approach to software quality, from requirements definition to advanced test automation.


## Project Structure


```
store/
├── package.json          # Node.js dependencies and scripts
├── server.js            # Express.js server and API endpoints
├── swagger.json         # OpenAPI 3.0 specification
├── public/              # Static files served to client
│   ├── index.html       # Store page with pagination
│   ├── cart.html        # Shopping cart page with auth
│   ├── styles.css       # Main stylesheet
│   ├── script.js        # Store page functionality
│   └── cart.js          # Cart page functionality
├── cypress/             # End-to-end tests with Cypress
│   ├── e2e/             # Cypress test files
│   ├── fixtures/        # Test data for Cypress
│   └── support/         # Support files for Cypress
└── K6-tests/            # Performance tests with K6
    ├── get_products.js  # K6 script for product endpoint
    └── login_and_add_to_cart.js # K6 script for login and add to cart
└── README.md            # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Clone or download the project**
   ```bash
   cd store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - **Store**: Navigate to `http://localhost:3000`
   - **Cart**: Navigate to `http://localhost:3000/cart`
   - **API Documentation**: Navigate to `http://localhost:3000/api-docs`

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## API Documentation

The project includes comprehensive API documentation powered by Swagger UI:

- **Interactive API Docs**: Visit `http://localhost:3000/api-docs` to see the full API documentation
- **Test Endpoints**: Use the Swagger UI to test all API endpoints directly from your browser
- **Request/Response Examples**: View sample data and formats
- **Error Handling**: See all possible error responses and status codes
- **Authentication**: Test login/logout and protected endpoints

## API Endpoints

### Pages
- `GET /` - Store homepage with pagination
- `GET /cart` - Shopping cart page with authentication

### Products
- `GET /api/products?page=1` - Get paginated products (9 per page)

### Shopping Cart
- `GET /api/cart` - Get current cart contents
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update product quantity
- `DELETE /api/cart/remove` - Remove product from cart
- `POST /api/cart/checkout` - Complete purchase (auth required for >= $500)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify session token

## New Features in Detail

### Product Pagination
- **18 Total Products**: Expanded from 6 to 18 electronics products
- **9 Products Per Page**: Clean, organized product display
- **Navigation Controls**: Previous/Next buttons with page indicators
- **Smooth Scrolling**: Automatic scroll to top when changing pages

### User Authentication System
- **Simple Login**: Email/password authentication
- **Test Account**: Ready-to-use test@test.com / test123
- **Session Management**: Secure session tokens
- **Login Button**: Integrated in navigation with user status display
- **Logout Functionality**: Secure session termination

### Purchase Validation
- **Threshold Check**: Authentication required for purchases >= $500.00
- **User Experience**: Clear messaging about authentication requirements
- **Seamless Flow**: Low-value purchases work without login
- **Auth Integration**: Login prompts for high-value orders

### Enhanced User Interface
- **Login Modal**: Clean, responsive login form
- **Authentication Notices**: Visual indicators for required actions
- **Status Display**: Login button shows current user status
- **Responsive Design**: All new elements work on mobile and desktop

## Features in Detail

### Product Management
- 18 sample electronics products with realistic images
- Product cards with hover effects and smooth animations
- Responsive grid layout that adapts to screen size
- Pagination controls for easy navigation

### Shopping Cart System
- Persistent cart state during session
- Quantity validation and confirmation dialogs
- Real-time price calculations
- Empty cart state with call-to-action
- Authentication requirements for high-value purchases

### User Experience
- Smooth animations and transitions
- Modal dialogs for confirmations and login
- Responsive design for mobile and desktop
- Intuitive navigation between store and cart
- Clear authentication requirements and prompts

### Security & Validation
- Input validation on all API endpoints
- Error handling for failed requests
- Safe quantity updates with bounds checking
- Session-based authentication system
- Purchase amount validation

## Future Enhancements

- User registration and account management
- Persistent cart storage (database)
- Payment gateway integration
- Product search and filtering
- Order history and tracking
- Admin panel for product management
- Password recovery system
- User profile management



## Contributing

This is a portfolio project, but suggestions and improvements are welcome!

---

**Note**: This is a demonstration project for portfolio purposes. The shopping cart data and user sessions are stored in memory and will reset when the server restarts.

## Test Account

**Email**: test@test.com  
**Password**: test123

Use this account to test the authentication features and high-value purchase validation.


