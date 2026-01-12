# NEXORA API Quick Reference

## 🔑 Authentication

### Login (Get Token)
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": { "username": "admin", "role": "admin" }
}
```

### Logout
```
POST /api/admin/logout
Response: { "message": "Logged out successfully" }
```

---

## 📊 Stats (Admin Only - Requires Token)

### Get Overview
```
GET /api/stats/overview
Authorization: Bearer {token}

Response:
{
  "totalRevenue": 5000,
  "totalOrders": 25,
  "totalCustomers": 18,
  "totalProducts": 45,
  "topProducts": [
    { "id": 1, "name": "Product A", "quantity": 10 },
    ...
  ],
  "ordersByStatus": {
    "completed": 20,
    "pending": 4,
    "cancelled": 1
  }
}
```

### Get Sales Stats
```
GET /api/stats/sales?from=2024-01-01&to=2024-12-31
Authorization: Bearer {token}

Response:
{
  "dailySales": [
    { "date": "2024-01-01", "amount": 150.00 },
    { "date": "2024-01-02", "amount": 200.00 },
    ...
  ],
  "salesByCategory": [
    { "category": "Electronics", "amount": 5000 },
    { "category": "Books", "amount": 1500 },
    ...
  ]
}
```

---

## 📦 Products (Public GET, Admin POST/PUT/DELETE)

### List All Products
```
GET /api/products

Response:
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "Electronics",
      "image_url": "/assets/images/laptop.jpg",
      "stock": 10,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    },
    ...
  ]
}
```

### Get Product by ID
```
GET /api/products/:id

Response:
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  ...
}
```

### Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "category": "Electronics",
  "image_url": "/assets/images/product.jpg",
  "stock": 20
}

Response: (created product with ID)
```

### Update Product (Admin Only)
```
PUT /api/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 59.99,
  "stock": 15
}

Response: (updated product)
```

### Delete Product (Admin Only)
```
DELETE /api/products/:id
Authorization: Bearer {token}

Response:
{
  "message": "Product deleted",
  "product": { ... }
}
```

---

## 🏷️ Categories (Similar CRUD Pattern)

```
GET /api/categories
POST /api/categories (admin only)
PUT /api/categories/:id (admin only)
DELETE /api/categories/:id (admin only)
```

---

## 👥 Customers (Similar CRUD Pattern)

```
GET /api/customers
POST /api/customers (admin only)
PUT /api/customers/:id (admin only)
DELETE /api/customers/:id (admin only)
```

---

## 📋 Orders (Client + Admin)

### List Orders
```
GET /api/orders

Response:
{
  "orders": [
    {
      "id": 101,
      "customer_email": "user@example.com",
      "items": [
        { "id": 1, "name": "Product", "price": 99.99, "quantity": 2 }
      ],
      "subtotal": 199.98,
      "shipping": 10,
      "total": 209.98,
      "status": "completed",
      "created_at": "2024-01-01T10:00:00Z"
    },
    ...
  ]
}
```

### Create Order (Client)
```
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token} (optional)

{
  "items": [
    { "id": 1, "name": "Product", "price": 99.99, "quantity": 2 }
  ],
  "subtotal": 199.98,
  "shipping": 10,
  "total": 209.98,
  "status": "completed"
}

Response:
{
  "id": 101,
  "created_at": "2024-01-01T10:00:00Z",
  ...
}
```

### Update Order Status (Admin Only)
```
PUT /api/orders/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "shipped"
}

Response: (updated order)
```

### Delete Order (Admin Only)
```
DELETE /api/orders/:id
Authorization: Bearer {token}
```

---

## 🧾 Invoices (Similar CRUD Pattern)

```
GET /api/invoices
POST /api/invoices (admin only - generate from order)
PUT /api/invoices/:id (admin only)
DELETE /api/invoices/:id (admin only)
```

---

## 🏥 Health Check

```
GET /api/health

Response:
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```
{
  "error": "No token provided"
}
or
{
  "error": "Invalid token"
}
```

### 404 Not Found
```
{
  "error": "Product not found"
}
```

### 400 Bad Request
```
{
  "error": "Name and price required"
}
```

### 500 Internal Server Error
```
{
  "error": "Failed to create product"
}
```

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Get Stats
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/stats/overview
```

### Create Product
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "category": "Electronics",
    "stock": 10
  }'
```

### List Products
```bash
curl http://localhost:4000/api/products
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are stored as floats (e.g., 99.99)
- Status values for orders: 'pending', 'completed', 'cancelled', 'shipped'
- Token expires in 24 hours
- Admin username/password: `admin`/`admin`
- CORS enabled for: http://localhost:3000, http://localhost:3001

---

Last Updated: 2024
