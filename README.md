# NEXORA - Premium Tech E-Commerce Platform

A full-stack e-commerce application for premium tech products featuring a modern dark UI, complete user authentication, shopping cart, checkout, orders management, and an admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A modern web browser

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Initialize the database and seed data:**
   ```bash
   npm run seed
   ```
   This will create the SQLite database and populate it with:
   - 18 premium tech products (headphones, earbuds, speakers, gaming, accessories, smart home)
   - 2 test user accounts (admin and regular user)

3. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:4000`

### Frontend Setup

1. **Open the client:**
   - Navigate to the `client` folder
   - Use Live Server (VS Code extension) or any local HTTP server
   - Open `index.html` in your browser

2. **Or use Python's built-in server:**
   ```bash
   cd client
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📊 Test Accounts

### Admin Account (Full Access)
- **Email:** admin@nexora.com
- **Password:** Admin123!
- **Access:** Admin dashboard with KPIs, order management, product CRUD, analytics

### Regular User Account
- **Email:** user@nexora.com
- **Password:** User123!
- **Access:** Browse products, add to cart, checkout, view orders

### Create New Account
Register with any email and password to create your own user account.

## 📁 Project Structure

```
NEXORA/
├── client/                    # Frontend (HTML/CSS/Vanilla JS)
│   ├── index.html            # Home page with hero slider
│   ├── catalog.html          # Product catalog with filters
│   ├── product.html          # Product detail page
│   ├── cart.html             # Shopping cart
│   ├── checkout.html         # Order checkout
│   ├── orders.html           # User orders history
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── admin.html            # Admin dashboard
│   ├── css/
│   │   └── styles.css        # Complete styling (dark theme)
│   └── js/
│       ├── api.js            # API service
│       ├── store.js          # State management
│       ├── ui.js             # UI utilities
│       ├── auth.js           # Auth & navbar logic
│       └── pages/
│           ├── home.js       # Home page logic
│           ├── catalog.js    # Catalog & filtering
│           ├── product.js    # Product detail logic
│           ├── cart.js       # Cart management
│           ├── checkout.js   # Order placement
│           ├── orders.js     # Orders display
│           └── admin.js      # Admin dashboard
├── server/                    # Backend (Node.js + Express)
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   ├── nexora.db             # SQLite database (auto-created)
│   └── src/
│       ├── app.js            # Express app & routes setup
│       ├── db.js             # Database initialization & schema
│       ├── seed.js           # Database seeding script
│       ├── middleware/
│       │   └── auth.js       # JWT authentication
│       ├── routes/
│       │   ├── auth.routes.js      # Auth endpoints
│       │   ├── products.routes.js  # Products endpoints
│       │   └── orders.routes.js    # Orders endpoints
│       └── controllers/
│           ├── auth.controller.js      # Auth logic
│           ├── products.controller.js  # Products logic
│           └── orders.controller.js    # Orders logic
└── README.md                 # This file
```

## 🎨 UI/UX Features

### Design Highlights
- **Dark Premium Theme:** Modern dark background with gradient accents
- **Smooth Animations:** Fade-in effects, hover states, smooth transitions
- **Responsive Design:** Fully responsive on desktop (4 cols), tablet (2-3 cols), mobile (1 col)
- **Sticky Navigation:** Header stays visible while scrolling
- **Hero Slider:** Auto-rotating slides with manual navigation bullets

### Pages

1. **Home Page (`index.html`)**
   - Promo bar
   - Sticky navbar with search, account, cart icons
   - Auto-rotating hero slider (3 slides)
   - 6 category cards
   - 3 promotional banner cards
   - Best sellers grid (8 products)

2. **Catalog Page (`catalog.html`)**
   - Advanced filters: search, category, price range, sort
   - 8 products per page with pagination
   - Quick add-to-cart from grid
   - Live filter updates

3. **Product Detail Page (`product.html`)**
   - Product gallery
   - Price, rating, stock status
   - Quantity selector
   - Add to cart with redirect to cart

4. **Shopping Cart (`cart.html`)**
   - List all items with images
   - Quantity +/- controls
   - Remove items
   - Coupon code support (NEXORA10 = 10% off)
   - Live price updates
   - Checkout button

5. **Checkout (`checkout.html`)**
   - Shipping form (name, phone, city, address)
   - Dynamic shipping fees by city:
     - Casablanca: 30 MAD
     - Rabat: 35 MAD
     - Marrakech: 40 MAD
     - Other: 45 MAD
   - Order summary with discount display
   - Order creation and success confirmation

6. **Orders Page (`orders.html`)**
   - List all user's orders
   - Order details (ID, status, date, total)
   - Item breakdown per order

7. **Login/Register (`login.html`, `register.html`)**
   - Email/password authentication
   - JWT token storage
   - Links between pages
   - Test account info displayed on login

8. **Admin Dashboard (`admin.html`)**
   - **KPIs:** Total revenue, month revenue, total orders, avg order value
   - **Orders Tab:** Recent orders with status selector (PATCH updates)
   - **Products Tab:** CRUD operations for products
   - **Analytics Tab:**
     - Order status breakdown
     - Top 5 products by quantity sold
     - Orders per day chart (last 7 days)

## 🔧 Backend API

### Base URL: `http://localhost:4000/api`

### Authentication Endpoints

**POST /auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```
Response: `{ token, user }`

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
Response: `{ token, user }`

**GET /auth/me**
- Headers: `Authorization: Bearer {token}`
- Response: `{ id, name, email, role }`

### Products Endpoints

**GET /api/products**
- Query params: `search`, `category`, `min`, `max`, `sort`, `page`, `limit`
- Sort options: `newest`, `price_asc`, `price_desc`, `a_z`
- Response: `{ products, total, page, pages }`

**GET /api/products/:id**
- Response: Product object

**POST /api/products** (ADMIN only)
```json
{
  "name": "Product Name",
  "price": 299,
  "category": "Headphones",
  "stock": 50,
  "description": "...",
  "image_url": "https://...",
  "rating": 4.5,
  "is_featured": 1
}
```

**PUT /api/products/:id** (ADMIN only)
- Same payload as POST

**DELETE /api/products/:id** (ADMIN only)
- Response: `{ message, id }`

### Orders Endpoints

**POST /api/orders** (USER, requires auth)
```json
{
  "items": [
    { "productId": 1, "qty": 2 },
    { "productId": 3, "qty": 1 }
  ],
  "shipping": {
    "name": "John Doe",
    "phone": "+212600000000",
    "city": "Casablanca",
    "address": "123 Main St"
  }
}
```
Response: `{ order, items, shippingFee }`

**GET /api/orders** (requires auth)
- USER: Returns only their orders
- ADMIN: Returns all orders
- Response: Array of orders with items

**GET /api/orders/:id** (requires auth)
- Response: Order with full details

**PATCH /api/orders/:id/status** (ADMIN only)
```json
{
  "status": "SHIPPED"
}
```
Valid statuses: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

## 🗄️ Database Schema

### Users Table
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
email (TEXT UNIQUE)
password_hash (TEXT)
role (TEXT) -- 'USER' or 'ADMIN'
created_at (DATETIME)
```

### Products Table
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
price (REAL)
category (TEXT)
stock (INTEGER)
description (TEXT)
image_url (TEXT)
rating (REAL)
is_featured (INTEGER)
created_at (DATETIME)
```

### Orders Table
```sql
id (INTEGER PRIMARY KEY)
user_id (INTEGER FOREIGN KEY)
status (TEXT) -- PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
total (REAL)
city (TEXT)
address (TEXT)
phone (TEXT)
customer_name (TEXT)
created_at (DATETIME)
```

### Order Items Table
```sql
id (INTEGER PRIMARY KEY)
order_id (INTEGER FOREIGN KEY)
product_id (INTEGER FOREIGN KEY)
name_snapshot (TEXT)
price_snapshot (REAL)
qty (INTEGER)
```

## 💳 Coupon System

### Available Coupons
- **NEXORA10**: 10% discount on entire order

Apply coupon on cart page before checkout.

## 🔐 Security Features

- **JWT Authentication:** Secure token-based auth
- **Password Hashing:** bcryptjs for secure password storage
- **Role-Based Access:** Admin vs User permissions
- **CORS Enabled:** Cross-origin requests allowed
- **Environment Variables:** Sensitive config in .env

## 📦 Core Dependencies

### Backend
- `express` - Web framework
- `better-sqlite3` - SQLite database
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `nodemon` - Dev server auto-reload

### Frontend
- Vanilla JavaScript (ES Modules)
- No build tools required
- Works with any HTTP server

## 🚀 Deployment

### Frontend
- Deploy to: Vercel, Netlify, GitHub Pages, or any static host
- Update `API_BASE_URL` in `js/api.js` to production API

### Backend
- Deploy to: Heroku, Railway, Render, DigitalOcean, or any Node.js host
- Update `.env` for production:
  - Change `JWT_SECRET` to a secure random string
  - Update database path if needed
  - Set `NODE_ENV=production`

## 📝 Notes

- Database is auto-created on first `npm run seed`
- All 18 products have realistic placeholder images from Unsplash
- Admin panel includes sample canvas chart for orders visualization
- Cart persists in localStorage
- Responsive design works on all modern browsers

## 🎯 Features Implemented

✅ Full product catalog with advanced filtering  
✅ Shopping cart with localStorage persistence  
✅ Checkout with shipping fees  
✅ User registration and login with JWT  
✅ Order history and tracking  
✅ Admin dashboard with KPIs and analytics  
✅ Product management (CRUD)  
✅ Order status management  
✅ Coupon/discount system  
✅ Responsive design (mobile, tablet, desktop)  
✅ Dark premium UI theme  
✅ Real-time cart count updates  
✅ Product search and filtering  
✅ Pagination  

## 📞 Support

For issues or questions, check:
1. Browser console for error messages
2. Network tab to verify API calls
3. Server logs for backend errors
4. Database file exists at `server/nexora.db`

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using Node.js + Express + SQLite + Vanilla JS**
