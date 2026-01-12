// API Service Module - NEXORA Client
const API_BASE_URL = 'http://localhost:4000/api';

export const api = {
  // ===== PRODUCTS (PUBLIC) =====
  async getProducts(limit = null) {
    try {
      const url = limit ? `${API_BASE_URL}/products?limit=${limit}` : `${API_BASE_URL}/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // ===== CATEGORIES (PUBLIC) =====
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // ===== AUTH (PUBLIC) =====
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed: Invalid credentials');
      return res.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async register(name, email, password) {
    try {
      // First, create a customer account
      const customerRes = await this.createCustomer(name, email, '');
      if (!customerRes || !customerRes.id) {
        console.error('Customer creation response:', customerRes);
        throw new Error('Failed to create account: invalid response');
      }
      
      // Return the customer data to be stored as token in localStorage
      // The JWT will be validated on the server side when needed
      const token = btoa(JSON.stringify({ id: customerRes.id, email: customerRes.email, role: 'customer' }));
      
      return {
        token: token,
        user: {
          id: customerRes.id,
          name: customerRes.name,
          email: customerRes.email,
          role: 'customer'
        }
      };
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // ===== CUSTOMERS (PUBLIC - self register) =====
  async createCustomer(name, email, phone = '') {
    try {
      console.log('Creating customer:', { name, email, phone });
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      
      const data = await res.json();
      console.log('Customer creation response:', data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // ===== ORDERS (PUBLIC - from checkout) =====
  async createOrder(customerId, items, total) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items, total })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create order');
      }
      return res.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrdersByCustomer(customerId) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders?customerId=${customerId}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async getOrderById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // ===== STATS (PUBLIC) =====
  async getStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/stats/overview`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },

  // ===== ADMIN METHODS (PROTECTED) =====
  // Products
  async getProductsAdmin(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/products?limit=1000`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createProductAdmin(productData, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProductAdmin(id, productData, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProductAdmin(id, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return res.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Orders
  async getOrdersAdmin(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderAdmin(id, orderData, token) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to update order');
      return res.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async updateOrderStatusAdmin(id, status, token) {
    return this.updateOrderAdmin(id, { status }, token);
  }
};

