# 🚀 NEXORA - E-Commerce Platform Complete Setup

## ✅ What's Installed

- **Backend API** (Express.js) - Port 4000
- **Frontend Server** (Static files) - Port 3000
- **Admin Interface** - http://localhost:3000/admin/
- **E-commerce Site** - http://localhost:3000/

---

## 🎯 Quick Start

### Option 1: Automatic Start (Windows)
```bash
# Double-click: start.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend API:**
```bash
cd server
npm install
npm start
# Server running on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd frontend-server
npm install
node server.js
# Server running on http://localhost:3000
```

---

## 📍 Main URLs

| Page | URL |
|------|-----|
| **Site** | http://localhost:3000 |
| **Admin Dashboard** | http://localhost:3000/admin/ |
| **Catalog** | http://localhost:3000/catalog.html |
| **Cart** | http://localhost:3000/cart.html |
| **Checkout** | http://localhost:3000/checkout.html |
| **API Health** | http://localhost:4000/api/health |

---

## 🔐 Admin Login

**Credentials:**
- Username: `admin`
- Password: `admin`

**Token expires:** 24 hours

---

## 🔄 Data Flow

### 1. Customer Purchases Product
```
[Site] → GET /api/products
         → Display Catalog
         → Add to Cart (localStorage)
         → Checkout
         → POST /api/orders
         → Create Customer + Order in DB
         → Success ✓
```

### 2. Admin Manages Products
```
[Admin] → POST /api/auth/admin/login
        → Get JWT Token
        → POST /api/products (with token)
        → Create Product in DB
        → Success ✓
```

### 3. Admin Views Dashboard
```
[Admin Dashboard] → GET /api/stats/overview
                 → Get KPIs, Charts
                 → Display Real-time Stats
                 → Success ✓
```

---

## 📊 API Endpoints

### Public (No Auth Required)
```
GET  /api/products              # Get all products
GET  /api/categories            # Get all categories
POST /api/customers             # Register customer
POST /api/orders                # Create order
GET  /api/stats/overview        # Get stats
```

### Admin Protected (JWT Required)
```
POST   /api/auth/admin/login    # Login & get token
POST   /api/products            # Create product
PUT    /api/products/:id        # Update product
DELETE /api/products/:id        # Delete product
PUT    /api/orders/:id          # Update order status
# ... and more CRUD operations
```

---

## 🗄️ Database

**Location:** `/server/db/data.json`

**Includes:**
- 5 Products (Headphones, Earbuds, Speakers)
- 3 Categories
- 1 Sample Customer
- 1 Sample Order
- Real-time statistics

**Changes are auto-saved** when you:
- Create a product
- Create an order
- Update status
- etc.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js + Express.js |
| **Frontend** | HTML5 + CSS3 + JavaScript |
| **Database** | JSON (data.json) |
| **Auth** | JWT (jsonwebtoken) |
| **API** | REST (fetch) |

---

## 📦 Project Structure

```
NEXORA/
├── server/                    # Backend API
│   ├── server.js              # Express app
│   ├── routes/                # API routes
│   ├── services/db.service.js # Database logic
│   ├── middleware/auth.js     # JWT auth
│   └── db/data.json           # Database file
│
├── frontend-server/           # Frontend server
│   └── server.js              # Static file server
│
├── client/                    # E-commerce site
│   ├── index.html
│   ├── catalog.html
│   ├── cart.html
│   ├── checkout.html
│   └── js/
│       ├── api.js             # API client (UPDATED)
│       ├── pages/checkout.js  # Checkout logic (UPDATED)
│       └── ...
│
├── admin/                     # Admin panel
│   ├── index.html             # Login page
│   ├── dashboard.html         # Dashboard
│   ├── products.html
│   ├── orders.html
│   ├── categories.html
│   └── js/
│       ├── api.js             # API client (configured)
│       └── auth.js            # Auth logic
│
└── API_DOCUMENTATION.md       # Complete API docs

```

---

## ✨ Features Implemented

### Client Site
- ✅ Display products from API
- ✅ Manage shopping cart (localStorage)
- ✅ Create orders at checkout
- ✅ Automatic customer registration
- ✅ Responsive design

### Admin Panel
- ✅ Login with JWT token
- ✅ View real-time dashboard stats
- ✅ CRUD Products
- ✅ CRUD Categories
- ✅ CRUD Customers
- ✅ CRUD Orders
- ✅ Update order status
- ✅ Charts (Chart.js)
- ✅ Black sidebar + white navbar

### API
- ✅ RESTful endpoints
- ✅ JWT authentication
- ✅ Error handling
- ✅ CORS enabled
- ✅ JSON persistence

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Check dependencies
cd server
npm install

# Try again
npm start
```

### API returns 404
- Verify backend is running on 4000
- Check URL is correct
- Look at API_DOCUMENTATION.md

### Admin login fails
- Verify credentials: admin / admin
- Check backend is running
- Check browser console for errors

### Products not showing on site
- Verify API is running
- Check browser network tab
- Check /api/products returns data

---

## 📋 Next Steps

1. **Test the site**: Add products to cart, checkout
2. **Test admin**: Login, create/edit products
3. **Monitor API**: Check /api/stats/overview
4. **Customize**: Edit products, categories, styling

---

## 📚 Full Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

---

## 🎉 Happy Selling!

NEXORA is now ready for use. Start both servers and begin using the platform!

```bash
npm start        # Backend
node server.js   # Frontend
```

---

**Created:** January 11, 2026  
**Version:** 1.0.0  
**Author:** NEXORA Team
