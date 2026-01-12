# NEXORA Admin Backoffice - Setup Guide

## ✅ Quick Start

### 1. Install Dependencies
```bash
cd server
npm install express cors jsonwebtoken
npm install
```

### 2. Start Backend
```bash
cd server
node server.js
```
✓ Server should run on `http://localhost:4000`

### 3. Access Admin Dashboard
Open browser to: `http://localhost:3001` or `http://localhost:3000/admin/index.html`

**Demo Credentials:**
- Username: `admin`
- Password: `admin`

---

## 📁 File Structure Created

```
/server
├── server.js (Express main - PORT 4000)
├── db/
│   ├── data.json (auto-created)
│   └── db.service.js (read/write safe)
├── middleware/
│   └── authAdmin.js (JWT verification)
└── routes/
    ├── admin.auth.js (login endpoint)
    ├── products.js (CRUD example)
    ├── stats.js (KPI endpoints)
    ├── categories.js (create as needed)
    ├── customers.js (create as needed)
    ├── orders.js (create as needed)
    └── invoices.js (create as needed)

/admin
├── index.html (login page)
├── dashboard.html (main dashboard)
├── products.html (CRUD products)
├── categories.html (CRUD categories)
├── customers.html (customers list)
├── orders.html (orders list)
├── invoices.html (invoices list)
├── css/
│   └── admin.css (all styles)
└── js/
    ├── auth.js (token management)
    ├── api.js (API client)
    ├── store.js (state management)
    └── pages/
        ├── dashboard.js (charts & KPIs)
        ├── products.js (create as needed)
        ├── orders.js (create as needed)
        └── etc.
```

---

## 🔐 Authentication Flow

1. **User submits login** → `POST /api/admin/login`
2. **Backend returns JWT token** (24h expiry)
3. **Token stored in localStorage** as `admin_token`
4. **All requests include** `Authorization: Bearer {token}`
5. **Middleware authAdmin** verifies token on protected routes

---

## 🛣️ Available Routes

### Auth
- `POST /api/admin/login` → Login (public)
- `POST /api/admin/logout` → Logout (public)

### Products (CRUD)
- `GET /api/products` → List all (public - for client)
- `GET /api/products/:id` → Get one (public)
- `POST /api/products` → Create (admin only)
- `PUT /api/products/:id` → Update (admin only)
- `DELETE /api/products/:id` → Delete (admin only)

### Stats (Admin Only)
- `GET /api/stats/overview` → KPI cards
- `GET /api/stats/sales?from=&to=` → Chart data

---

## 📊 Dashboard Features

### KPI Cards (auto-calculated)
- Total Revenue
- Total Orders
- Total Customers
- Total Products

### Charts (Chart.js)
1. Orders by Status (Doughnut)
2. Top 5 Products (Bar)
3. Daily Sales (Line)
4. Sales by Category (Pie)

---

## ⚙️ Extending the System

### To Add New CRUD Route (e.g., Categories)

**1. Create `/server/routes/categories.js`:**
```javascript
const express = require('express');
const { authAdmin } = require('../middleware/authAdmin');
const db = require('../db/db.service');

const router = express.Router();

// GET all categories (public)
router.get('/', (req, res) => {
  const data = db.readDB();
  res.json({ categories: data.categories });
});

// POST create category (admin)
router.post('/', authAdmin, (req, res) => {
  const { name, description } = req.body;
  const data = db.readDB();
  
  const newCategory = {
    id: Math.max(...data.categories.map(c => c.id || 0), 0) + 1,
    name,
    description: description || '',
    created_at: new Date().toISOString()
  };
  
  data.categories.push(newCategory);
  db.writeDB(data);
  res.status(201).json(newCategory);
});

// PUT, DELETE similar...

module.exports = router;
```

**2. Register in `server.js`:**
```javascript
const categoriesRoutes = require('./routes/categories');
app.use('/api/categories', categoriesRoutes);
```

---

## 🧪 Test API Endpoints

### Login
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Create Product
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "category": "Electronics",
    "stock": 10
  }'
```

### Get Stats
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/api/stats/overview
```

---

## 🐛 Troubleshooting

**"Cannot find module 'express'"**
→ Run `npm install express cors jsonwebtoken` in `/server`

**"CORS error from http://localhost:3000"**
→ Check CORS config in server.js includes correct origins

**"Token invalid" or "Unauthorized"**
→ Check localStorage has `admin_token` key
→ Token might be expired (24h lifespan)

**"data.json not created"**
→ Run `node server.js` once, it auto-creates the file

---

## 📝 Next Steps

1. ✅ Start server: `node server.js`
2. ✅ Open admin: `http://localhost:3000/admin/index.html`
3. ✅ Login with: `admin / admin`
4. ✅ See dashboard with KPIs & charts
5. Create `/routes/orders.js`, `/routes/categories.js`, etc.
6. Create corresponding admin pages (products.html, orders.html, etc.)
7. Link to client checkout: orders created via `POST /api/orders` (client already does this)

---

## 🔗 Client-Admin Integration

**Current Status:**
- ✅ Client can create orders: `POST http://localhost:4000/api/orders`
- ✅ Admin can view orders: `GET /api/stats/overview`
- ⏳ Admin can modify order status: (create `PUT /api/orders/:id`)

---

Last Updated: 2024
