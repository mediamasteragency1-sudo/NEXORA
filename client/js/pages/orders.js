// Orders Page Module
import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

async function loadOrders() {
  const authCheck = document.getElementById('authCheck');
  const ordersContent = document.getElementById('ordersContent');
  const ordersList = document.getElementById('ordersList');
  
  if (!store.isAuthenticated()) {
    authCheck.classList.remove('hidden');
    ordersContent.classList.add('hidden');
    return;
  }
  
  authCheck.classList.add('hidden');
  ordersContent.classList.remove('hidden');
  
  try {
    const orders = await api.getOrders(store.getToken());
    
    if (orders.length === 0) {
      ordersList.innerHTML = '<p style="text-align: center; padding: 40px;">No orders yet</p>';
      return;
    }
    
    ordersList.innerHTML = orders.map(order => ui.renderOrderCard(order)).join('');
  } catch (error) {
    console.error('Failed to load orders:', error);
    ui.showMessage(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  loadOrders();
});
