# NEXORA API - Documentation Complète

## 🚀 Démarrage Rapide

### 1. Installer les dépendances
```bash
cd server
npm install
```

### 2. Lancer le serveur
```bash
npm start
# Serveur écoute sur http://localhost:4000
```

### 3. Tester l'API
```bash
curl http://localhost:4000/api/health
```

---

## 📚 Endpoints Disponibles

### 🔐 Authentication (PUBLIC)
**POST** `/api/auth/admin/login`
- Credentials: `username: admin`, `password: admin`
- Returns: JWT token
- Usage: `Authorization: Bearer <token>`

```json
{
  "username": "admin",
  "password": "admin"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

---

### 📦 Products (PUBLIC GET, ADMIN CRUD)

**GET** `/api/products`
- Get all products (paginated)
- Query params: `?limit=10`
- Response: `{ products: [], total: 5 }`

**GET** `/api/products/:id`
- Get single product
- Response: Product object

**POST** `/api/products` *(ADMIN)*
- Create product
- Body: `{ name, price, stock, categoryId, image, active }`
- Requires: Bearer token

**PUT** `/api/products/:id` *(ADMIN)*
- Update product
- Body: partial update object

**DELETE** `/api/products/:id` *(ADMIN)*
- Delete product

---

### 🏷️ Categories (PUBLIC GET, ADMIN CRUD)

**GET** `/api/categories`
- Get all categories
- Response: `{ categories: [], total: 3 }`

**GET** `/api/categories/:id`

**POST** `/api/categories` *(ADMIN)*
- Body: `{ name, description }`

**PUT** `/api/categories/:id` *(ADMIN)*

**DELETE** `/api/categories/:id` *(ADMIN)*

---

### 👥 Customers (PUBLIC CREATE, ADMIN READ)

**GET** `/api/customers` *(ADMIN)*

**GET** `/api/customers/:id` *(ADMIN)*

**POST** `/api/customers` *(PUBLIC)*
- Register customer
- Body: `{ fullName, email, phone }`

**PUT** `/api/customers/:id` *(ADMIN)*

**DELETE** `/api/customers/:id` *(ADMIN)*

---

### 📋 Orders (PUBLIC READ/CREATE, ADMIN CRUD)

**GET** `/api/orders`
- Get all orders (admin) or filter by customer
- Query: `?customerId=1` (get orders for specific customer)

**GET** `/api/orders/:id`

**POST** `/api/orders` *(PUBLIC)*
- Create order from checkout
- Body:
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "name": "Product Name",
      "price": 199.99,
      "quantity": 1
    }
  ],
  "total": 199.99
}
```

**PUT** `/api/orders/:id` *(ADMIN)*
- Update order status
- Body: `{ status: "pending|completed|cancelled", shipping: "..." }`

**DELETE** `/api/orders/:id` *(ADMIN)*

---

### 🧾 Invoices (ADMIN ONLY)

**GET** `/api/invoices`

**GET** `/api/invoices/:id`

**POST** `/api/invoices`
- Body: `{ orderId, customerId, total, items, status }`

**PUT** `/api/invoices/:id`

**DELETE** `/api/invoices/:id`

---

### 📊 Statistics (PUBLIC)

**GET** `/api/stats/overview`
- Returns: `{ totalRevenue, totalOrders, totalCustomers, totalProducts, ordersByStatus, topProducts, dailySales, salesByCategory }`

**GET** `/api/stats/orders-by-status`
- Returns: `{ completed, pending, cancelled }`

**GET** `/api/stats/top-products`
- Returns: Top 5 best-selling products

**GET** `/api/stats/daily-sales`
- Returns: Sales by day

**GET** `/api/stats/sales-by-category`
- Returns: Sales by category

---

## 🗄️ Structure de Données

### Product
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 199.99,
  "stock": 50,
  "categoryId": 1,
  "image": "filename.png",
  "active": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Category
```json
{
  "id": 1,
  "name": "Category Name",
  "description": "Description",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Customer
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Order
```json
{
  "id": 1,
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "name": "Product Name",
      "price": 199.99,
      "quantity": 1
    }
  ],
  "total": 199.99,
  "status": "pending|completed|cancelled",
  "shipping": "pending|shipped|delivered",
  "createdAt": "2024-01-10T00:00:00Z"
}
```

---

## 🔒 Authentification Admin

### 1. Login
```bash
curl -X POST http://localhost:4000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### 2. Utiliser le token
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:4000/api/products
```

### 3. Token valide 24h
Le token JWT expire après 24 heures.

---

## 📝 Fichiers Principaux

- `server.js` - Serveur Express principal
- `db/data.json` - Base de données JSON
- `services/db.service.js` - Service d'accès à la base de données
- `middleware/authAdmin.js` - Middleware d'authentification
- `routes/` - Tous les endpoints API

---

## 🎯 Cas d'Usage

### Cas 1: Client achète un produit
1. `GET /api/products` - Afficher les produits
2. `POST /api/orders` - Créer la commande
3. Order sauvegardée automatiquement

### Cas 2: Admin gère les produits
1. `POST /api/auth/admin/login` - Se connecter
2. `POST /api/products` - Créer avec token
3. `PUT /api/products/:id` - Mettre à jour
4. `DELETE /api/products/:id` - Supprimer

### Cas 3: Dashboard stats
1. `GET /api/stats/overview` - Vue d'ensemble
2. `GET /api/stats/top-products` - Meilleurs produits
3. `GET /api/stats/daily-sales` - Ventes quotidiennes

---

## ✅ Tests Rapides

```bash
# Health check
curl http://localhost:4000/api/health

# Get all products
curl http://localhost:4000/api/products

# Get stats
curl http://localhost:4000/api/stats/overview

# Login admin
curl -X POST http://localhost:4000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Create order
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "items": [{"productId": 1, "name": "Product", "price": 199.99, "quantity": 1}],
    "total": 199.99
  }'
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifier: `npm install`
- Vérifier le port 4000 n'est pas utilisé
- Logs: vérifier la console

### Token invalide
- Vérifier format: `Authorization: Bearer <token>`
- Token expiré après 24h: se re-connecter

### 404 Not Found
- Vérifier l'URL exacte
- Vérifier la méthode (GET/POST/PUT/DELETE)

---

## 📦 Dépendances
- `express` - Framework web
- `cors` - Cross-origin requests
- `jsonwebtoken` - Authentication JWT

