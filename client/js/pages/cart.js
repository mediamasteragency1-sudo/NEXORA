// Cart Page JavaScript
import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

function renderCart() {
  const cart = store.getCart();
  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('emptyState');
  const cartSummary = document.getElementById('cartSummary');

  if (cart.length === 0) {
    emptyState.style.display = 'block';
    container.style.display = 'none';
    cartSummary.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  container.style.display = 'block';
  cartSummary.style.display = 'block';

  container.innerHTML = cart.map(item => ui.renderCartItem(item, cart)).join('');

  // Setup quantity controls
  document.querySelectorAll('[data-action="increase"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity += 1;
        store.setCart(cart);
        renderCart();
        updateCartCount();
        updateTotals();
      }
    });
  });

  document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        store.setCart(cart);
        renderCart();
        updateCartCount();
        updateTotals();
      }
    });
  });

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const filtered = cart.filter(i => i.id !== id);
      store.setCart(filtered);
      renderCart();
      updateCartCount();
      updateTotals();
    });
  });

  updateTotals();
}

function updateTotals() {
  const cart = store.getCart();
  const cartTotal = store.getCartTotal();
  const subtotal = document.getElementById('subtotal');
  const discount = document.getElementById('discount');
  const discountItem = document.getElementById('discountItem');
  const total = document.getElementById('total');

  const coupon = localStorage.getItem('appliedCoupon');

  subtotal.textContent = `${cartTotal} MAD`;

  if (coupon === 'NEXORA10') {
    const discountAmount = Math.floor(cartTotal * 0.1);
    discount.textContent = `-${discountAmount} MAD`;
    discountItem.style.display = 'flex';
    total.textContent = `${cartTotal - discountAmount} MAD`;
  } else {
    discountItem.style.display = 'none';
    total.textContent = `${cartTotal} MAD`;
  }
}

function setupCoupon() {
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');

  const savedCoupon = localStorage.getItem('appliedCoupon');
  if (savedCoupon) {
    couponInput.value = savedCoupon;
  }

  applyCouponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();

    if (code === 'NEXORA10') {
      localStorage.setItem('appliedCoupon', code);
      updateTotals();
      ui.showMessage('Coupon applied! 10% discount', 'success');
    } else if (code === '') {
      localStorage.removeItem('appliedCoupon');
      updateTotals();
      ui.showMessage('Coupon removed', 'success');
    } else {
      ui.showMessage('Invalid coupon code', 'error');
    }
  });
}

function setupCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');

  checkoutBtn.addEventListener('click', () => {
    if (store.isAuthenticated()) {
      window.location.href = 'checkout.html';
    } else {
      ui.showMessage('Please login to checkout', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  renderCart();
  setupCoupon();
  setupCheckout();
});
