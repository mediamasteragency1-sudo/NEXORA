const API_BASE = 'http://localhost:4000/api';

class AdminAPI {
  // Helper method
  async request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    
    return response;
  }
  
  // Stats
  async getStatsOverview() {
    const response = await this.request('/stats/overview');
    return response.json();
  }
  
  async getSalesStats(from, to) {
    const response = await this.request(`/stats/sales?from=${from}&to=${to}`);
    return response.json();
  }
  
  // Products
  async getProducts() {
    const response = await this.request('/products');
    const data = await response.json();
    return data.products || [];
  }
  
  async getProductById(id) {
    const response = await this.request(`/products/${id}`);
    return response.json();
  }
  
  async createProduct(data) {
    const response = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async updateProduct(id, data) {
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async deleteProduct(id) {
    const response = await this.request(`/products/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
  
  // Orders
  async getOrders() {
    const response = await this.request('/orders');
    const data = await response.json();
    return data.orders || [];
  }
  
  async getOrderById(id) {
    const response = await this.request(`/orders/${id}`);
    return response.json();
  }
  
  async updateOrderStatus(id, status) {
    const response = await this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return response.json();
  }
  
  // Categories
  async getCategories() {
    const response = await this.request('/categories');
    const data = await response.json();
    return data.categories || [];
  }
  
  async createCategory(data) {
    const response = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async updateCategory(id, data) {
    const response = await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async deleteCategory(id) {
    const response = await this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
  
  // Customers
  async getCustomers() {
    const response = await this.request('/customers');
    const data = await response.json();
    return data.customers || [];
  }
  
  async getCustomerById(id) {
    const response = await this.request(`/customers/${id}`);
    return response.json();
  }
  
  // Invoices
  async getInvoices() {
    const response = await this.request('/invoices');
    return response.json();
  }
  
  async getInvoiceById(id) {
    const response = await this.request(`/invoices/${id}`);
    return response.json();
  }
  
  async createInvoice(data) {
    const response = await this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

const api = new AdminAPI();
