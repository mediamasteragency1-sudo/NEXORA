// About Page JavaScript

// Update cart badge count
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems > 0 ? totalItems : '0';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Account button
  const accountBtn = document.getElementById('accountBtn');
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('auth_token');
      window.location.href = isLoggedIn ? 'account.html' : 'login.html';
    });
  }

  // Cart button
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });
  }

  // Search button
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      alert('Search functionality coming soon!');
    });
  }
}
