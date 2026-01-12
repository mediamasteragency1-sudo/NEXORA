// Checkout Page Module
import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

const SHIPPING_FEES = {
  'Casablanca': 30,
  'Rabat': 35,
  'Marrakech': 40,
  'Other': 45
};

function renderCheckout() {
  const cart = store.getCart();
  const coupon = localStorage.getItem('appliedCoupon');
  
  // Summary items
  const summaryItems = document.getElementById('summaryItems');
  summaryItems.innerHTML = cart.map(item => `
    <div class="summary-item-line">
      <span>${item.name} x${item.quantity}</span>
      <span>${item.price * item.quantity} MAD</span>
    </div>
  `).join('');
  
  // Calculate totals
  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  const cart = store.getCart();
  const city = document.getElementById('city').value;
  
  const subtotal = store.getCartTotal();
  let total = subtotal;
  
  const shippingFee = SHIPPING_FEES[city] || 45;
  total += shippingFee;
  
  const coupon = localStorage.getItem('appliedCoupon');
  let discountAmount = 0;
  if (coupon === 'NEXORA10') {
    discountAmount = subtotal * 0.1;
    total -= discountAmount;
  }
  
  document.getElementById('summarySubtotal').textContent = `${subtotal} MAD`;
  document.getElementById('summaryShipping').textContent = `${shippingFee} MAD`;
  document.getElementById('summaryTotal').textContent = `${total} MAD`;
  
  const summaryDiscount = document.getElementById('summaryDiscount');
  if (coupon === 'NEXORA10') {
    summaryDiscount.style.display = 'flex';
    document.getElementById('summaryDiscountAmount').textContent = `-${discountAmount} MAD`;
  } else {
    summaryDiscount.style.display = 'none';
  }
}

function setupForm() {
  const form = document.getElementById('checkoutForm');
  const citySelect = document.getElementById('city');
  
  // Allow both authenticated and guest users to checkout
  const user = store.getUser();
  if (user && user.name) {
    document.getElementById('name').value = user.name;
  }
  
  citySelect.addEventListener('change', updateCheckoutTotals);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cart = store.getCart();
    if (cart.length === 0) {
      ui.showMessage('Cart is empty', 'error');
      return;
    }
    
    const fullName = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email')?.value || `guest-${Date.now()}@nexora.local`;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    const shippingFee = SHIPPING_FEES[city] || 45;
    const subtotal = store.getCartTotal();
    
    const coupon = localStorage.getItem('appliedCoupon');
    let discountAmount = 0;
    let total = subtotal + shippingFee;
    
    if (coupon === 'NEXORA10') {
      discountAmount = subtotal * 0.1;
      total -= discountAmount;
    }
    
    try {
      ui.showMessage('Creating order...', 'info');
      
      // Step 1: Create customer
      const customer = await api.createCustomer(fullName, email, phone);
      const customerId = customer.id;
      
      // Step 2: Prepare order items
      const items = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Step 3: Create order via API
      const order = await api.createOrder(customerId, items, total);
      
      // Save order data for payment page
      const orderData = {
        id: order.id,
        customerId: customerId,
        name: fullName,
        phone: phone,
        email: email,
        city: city,
        address: address,
        items: cart,
        subtotal: subtotal,
        shipping: shippingFee,
        discount: discountAmount,
        total: total
      };
      
      localStorage.setItem('nexora_pending_order', JSON.stringify(orderData));
      
      ui.showMessage('Order created! Redirecting to payment...', 'success');
      setTimeout(() => {
        window.location.href = 'payment.html';
      }, 1500);
      
    } catch (error) {
      console.error('Checkout error:', error);
      ui.showMessage(`Error: ${error.message}`, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  renderCheckout();
  setupForm();
});
