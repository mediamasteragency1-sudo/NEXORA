// Login Page JavaScript
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

function updateCartBadge() {
  updateCartCount();
}

function setupEventListeners() {
  // Search
  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('searchModal').style.display = 'flex';
    document.getElementById('searchInput').focus();
  });

  document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('searchModal').style.display = 'none';
    }
  });

  document.getElementById('searchModal').addEventListener('click', (e) => {
    if (e.target.id === 'searchModal') {
      document.getElementById('searchModal').style.display = 'none';
    }
  });

  // Account button
  document.getElementById('accountBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  // Cart button
  document.getElementById('cartBtn').addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('mobile-active');
  });

  // Login Form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        store.setAuth(data.token, data.user);
        ui.showMessage('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } else {
        ui.showMessage(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      ui.showMessage('An error occurred during login', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  updateCartBadge();
  setupEventListeners();
});
