// Auth Module (Shared for login/register)
import { api } from './api.js';
import { store } from './store.js';
import { ui } from './ui.js';

function setupAuthPage() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    ui.showMessage('Please fill in all fields', 'error');
    return;
  }
  
  try {
    const result = await api.login(email, password);
    if (result.token && result.user) {
      store.setAuth(result.token, result.user);
      ui.showMessage('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    } else {
      ui.showMessage('Login failed: Invalid response', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    ui.showMessage(error.message || 'Login failed. Please check your email and password.', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!name || !email || !password) {
    ui.showMessage('Please fill in all fields', 'error');
    return;
  }
  
  if (password.length < 6) {
    ui.showMessage('Password must be at least 6 characters', 'error');
    return;
  }
  
  try {
    const result = await api.register(name, email, password);
    if (result.token && result.user) {
      store.setAuth(result.token, result.user);
      ui.showMessage('Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    } else {
      ui.showMessage('Registration failed: Invalid response', 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    ui.showMessage(error.message || 'Registration failed. Please try again.', 'error');
  }
}

// Shared navbar functionality
function setupNavbar() {
  const searchBtn = document.getElementById('searchBtn');
  const accountBtn = document.getElementById('accountBtn');
  const cartBtn = document.getElementById('cartBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const modalClose = document.querySelector('.modal-close');

  // Search modal
  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.remove('hidden');
      searchInput?.focus();
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        searchModal.classList.add('hidden');
      });
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.add('hidden');
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
          searchResults.innerHTML = '';
          return;
        }

        try {
          const { products } = await api.getProducts({ search: query, limit: 5 });
          searchResults.innerHTML = products.map(p => `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
              <strong>${p.name}</strong>
              <p style="font-size: 12px; color: var(--text-secondary);">${p.category} - ${p.price} MAD</p>
            </div>
          `).join('');
        } catch (error) {
          console.error('Search failed:', error);
        }
      });
    }
  }

  // Account button
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      const isAuth = store.isAuthenticated();
      if (isAuth) {
        const user = store.getUser();
        const choice = confirm(`Logged in as: ${user.name}\n\nClick OK to logout`);
        if (choice) {
          store.logout();
          window.location.href = 'login.html';
        }
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  // Cart button
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Update cart count
  updateCartCount();
}

function updateCartCount() {
  const count = store.getCartCount();
  ui.updateCartCount(count);
}

// Setup category cards
function setupCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      window.location.href = `catalog.html?category=${encodeURIComponent(category)}`;
    });
  });
}

// Setup banner buttons
function setupBannerButtons() {
  const bannerBtns = document.querySelectorAll('.banner-btn');
  bannerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'catalog.html';
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setupAuthPage();
  setupNavbar();
  setupCategoryCards();
  setupBannerButtons();
});

// Export for use in other modules
export { updateCartCount, setupNavbar };
