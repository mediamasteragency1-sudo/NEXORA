// Admin Dashboard Module
import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

let editingProductId = null;

async function checkAdmin() {
  const authCheck = document.getElementById('authCheck');
  const adminContent = document.getElementById('adminContent');
  
  if (!store.isAuthenticated() || !store.isAdmin()) {
    authCheck.classList.remove('hidden');
    adminContent.classList.add('hidden');
    return;
  }
  
  authCheck.classList.add('hidden');
  adminContent.classList.remove('hidden');
  
  // Setup tabs
  setupTabs();
  loadDashboard();
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabName = btn.dataset.tab;
      document.getElementById(tabName + 'Tab').classList.add('active');
      
      if (tabName === 'products') {
        loadProducts();
      } else if (tabName === 'analytics') {
        loadAnalytics();
      }
    });
  });
}

async function loadDashboard() {
  try {
    const token = store.getToken();
    const ordersResponse = await api.getOrdersAdmin(token);
    const orders = ordersResponse.orders || [];
    const productsResponse = await api.getProductsAdmin(token);
    const products = productsResponse.products || [];
    
    // KPIs
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthOrders = deliveredOrders.filter(o => new Date(o.created_at) >= monthStart);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('kpiTotalRevenue').textContent = `${totalRevenue.toFixed(0)} MAD`;
    document.getElementById('kpiMonthRevenue').textContent = `${monthRevenue.toFixed(0)} MAD`;
    document.getElementById('kpiTotalOrders').textContent = orders.length;
    document.getElementById('kpiAvgOrderValue').textContent = `${(totalRevenue / (deliveredOrders.length || 1)).toFixed(0)} MAD`;
    
    // Orders table
    loadOrders(orders);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    ui.showMessage(error.message, 'error');
  }
}

async function loadOrders(orders) {
  const tbody = document.getElementById('ordersTableBody');
  
  tbody.innerHTML = orders.slice(0, 10).map(order => `
    <tr>
      <td>#${order.id}</td>
      <td>${order.customer_name}</td>
      <td>${order.total} MAD</td>
      <td>
        <select class="status-select" data-id="${order.id}">
          <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
          <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
          <option value="SHIPPED" ${order.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
          <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
          <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
        </select>
      </td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>
        <button class="action-btn" onclick="alert('Items: ${order.items.map(i => i.name_snapshot).join(', ')}')" >View</button>
      </td>
    </tr>
  `).join('');
  
  // Status select handlers
  tbody.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      try {
        await api.updateOrderStatusAdmin(select.dataset.id, select.value, store.getToken());
        ui.showMessage('Order status updated', 'success');
      } catch (error) {
        ui.showMessage(error.message, 'error');
      }
    });
  });
}

async function loadProducts() {
  try {
    const token = store.getToken();
    const response = await api.getProductsAdmin(token);
    const products = response.products || [];
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products found</td></tr>';
      return;
    }
    
    tbody.innerHTML = products.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price} MAD</td>
        <td>${p.stock}</td>
        <td>${p.category}</td>
        <td>
          <button class="action-btn" data-id="${p.id}" onclick="editProduct(${p.id})">Edit</button>
          <button class="action-btn delete-btn" data-id="${p.id}" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Failed to load products:', error);
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Error loading products</td></tr>`;
    ui.showMessage('Error loading products: ' + error.message, 'error');
  }
}

async function loadAnalytics() {
  try {
    const token = store.getToken();
    const ordersResponse = await api.getOrdersAdmin(token);
    const orders = ordersResponse.orders || [];
    const productsResponse = await api.getProductsAdmin(token);
    const products = productsResponse.products || [];
    
    // Status breakdown
    const statusBreakdown = document.getElementById('statusBreakdown');
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    statusBreakdown.innerHTML = statuses.map(status => {
      const count = orders.filter(o => o.status === status).length;
      return `
        <div class="status-item">
          <span>${status}</span>
          <strong>${count}</strong>
        </div>
      `;
    }).join('');
    
    // Top products
    const topProducts = document.getElementById('topProducts');
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.name_snapshot] = (productSales[item.name_snapshot] || 0) + item.qty;
      });
    });
    
    const topFive = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    topProducts.innerHTML = topFive.map(([name, qty]) => `
      <div class="product-row">
        <span>${name}</span>
        <strong>${qty} sold</strong>
      </div>
    `).join('');
    
    // Orders per day chart
    drawOrdersChart(orders);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

function drawOrdersChart(orders) {
  const canvas = document.getElementById('ordersChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const now = new Date();
  const last7Days = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    last7Days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  
  const counts = last7Days.map(day => {
    return orders.filter(o => 
      new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day
    ).length;
  });
  
  // Simple bar chart
  const maxCount = Math.max(...counts, 1);
  const padding = 40;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  const barWidth = width / last7Days.length * 0.8;
  const barGap = width / last7Days.length * 0.2;
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid lines
  ctx.strokeStyle = '#2d2d44';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }
  
  // Bars
  ctx.fillStyle = '#667eea';
  counts.forEach((count, i) => {
    const x = padding + (width / last7Days.length) * i + barGap / 2;
    const barHeight = (count / maxCount) * height;
    ctx.fillRect(x, padding + height - barHeight, barWidth, barHeight);
  });
  
  // Labels
  ctx.fillStyle = '#b0b0c0';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  last7Days.forEach((day, i) => {
    const x = padding + (width / last7Days.length) * i + width / last7Days.length / 2;
    ctx.fillText(day, x, canvas.height - 15);
  });
}

// Global functions
window.editProduct = async function(id) {
  try {
    const product = await api.getProductById(id);
    editingProductId = id;
    
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productImageUrl').value = product.image_url || '';
    document.getElementById('productRating').value = product.rating || 0;
    document.getElementById('productFeatured').checked = product.is_featured;
    
    document.getElementById('productModal').classList.remove('hidden');
  } catch (error) {
    ui.showMessage(error.message, 'error');
  }
};

window.deleteProduct = async function(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    await api.deleteProductAdmin(id, store.getToken());
    ui.showMessage('Product deleted', 'success');
    loadProducts();
  } catch (error) {
    ui.showMessage(error.message, 'error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  checkAdmin();
  
  // Product modal
  const addBtn = document.getElementById('addProductBtn');
  const productModal = document.getElementById('productModal');
  const modalClose = productModal?.querySelector('.modal-close');
  const productForm = document.getElementById('productForm');
  
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      editingProductId = null;
      document.getElementById('productModalTitle').textContent = 'Add Product';
      document.getElementById('productForm').reset();
      productModal.classList.remove('hidden');
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      productModal.classList.add('hidden');
    });
  }
  
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const product = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image_url: document.getElementById('productImageUrl').value,
        rating: parseFloat(document.getElementById('productRating').value) || 0,
        is_featured: document.getElementById('productFeatured').checked ? 1 : 0
      };
      
      try {
        if (editingProductId) {
          await api.updateProductAdmin(editingProductId, product, store.getToken());
          ui.showMessage('Product updated', 'success');
        } else {
          await api.createProductAdmin(product, store.getToken());
          ui.showMessage('Product created', 'success');
        }
        productModal.classList.add('hidden');
        loadProducts();
      } catch (error) {
        ui.showMessage(error.message, 'error');
      }
    });
  }
});
