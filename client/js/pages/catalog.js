import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

let allProducts = [];
let filteredProducts = [];
let minPrice = 0;
let maxPrice = Infinity;
let sortBy = 'newest';

// Fetch all products from API
async function fetchAllProducts() {
  try {
    const response = await fetch('http://localhost:4000/api/products');
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const data = await response.json();
    
    // Handle both direct array and object with products property
    allProducts = Array.isArray(data) ? data : (data.products || []);
    
    if (allProducts.length === 0) {
      console.warn('No products returned from API');
    }
    
    applyFilters();
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMsg = `Error loading products: ${error.message}`;
    document.getElementById('bestSellersGrid').innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">${errorMsg}</p>`;
  }
}

// Apply all filters and sort
function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    const price = product.price || 0;
    const matchesPrice = price >= minPrice && price <= maxPrice;
    return matchesPrice;
  });

  // Apply sorting
  sortProducts();
  renderProducts();
  updateProductCount();
}

// Sort products
function sortProducts() {
  switch(sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'popular':
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
  }
}

// Render products grid
function renderProducts() {
  const grid = document.getElementById('bestSellersGrid');
  const emptyState = document.getElementById('emptyState');

  if (filteredProducts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  grid.innerHTML = '';

  // Product icons by category
  const productIcons = {
    'Headphones': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g1)"/><circle cx="100" cy="100" r="90" fill="none" stroke="#000" stroke-width="2"/><path d="M 50 80 Q 100 40 150 80" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="130" r="25" fill="none" stroke="#000" stroke-width="2"/><circle cx="150" cy="130" r="25" fill="none" stroke="#000" stroke-width="2"/><circle cx="50" cy="130" r="12" fill="#000"/><circle cx="150" cy="130" r="12" fill="#000"/></svg>',
    'Earbuds': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g2)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><circle cx="70" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="70" cy="100" r="10" fill="#000"/><circle cx="130" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="130" cy="100" r="10" fill="#000"/><path d="M 65 75 Q 60 50 65 30" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M 135 75 Q 140 50 135 30" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    'Speakers': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g3)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><rect x="70" y="60" width="60" height="80" fill="none" stroke="#000" stroke-width="2" rx="4"/><circle cx="100" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="100" cy="100" r="10" fill="#000"/><rect x="75" y="145" width="50" height="8" fill="#000" rx="2"/></svg>',
    'Gaming': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g4)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><rect x="55" y="50" width="90" height="100" fill="none" stroke="#000" stroke-width="2" rx="6"/><circle cx="75" cy="130" r="8" fill="#000"/><circle cx="125" cy="90" r="8" fill="#000"/><circle cx="125" cy="110" r="8" fill="#000"/></svg>',
    'Accessories': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g5)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><circle cx="100" cy="80" r="15" fill="none" stroke="#000" stroke-width="2"/><path d="M 100 95 L 100 140" stroke="#000" stroke-width="2"/><line x1="85" y1="110" x2="60" y2="135" stroke="#000" stroke-width="2"/><line x1="115" y1="110" x2="140" y2="135" stroke="#000" stroke-width="2"/></svg>'
  };

  filteredProducts.forEach(product => {
    const rating = product.rating || 4;
    const starsHTML = Array.from({ length: 5 }).map((_, i) => 
      `<div class="star ${i < rating ? 'filled' : 'empty'}">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 19.91 24.2 12 18.54 4.09 24.2 6.23 16.01 0 10.35 8.91 10.26"></polygon>
        </svg>
      </div>`
    ).join('');

    const category = product.category || 'Accessories';
    const icon = productIcons[category] || productIcons['Accessories'];
    const imageUrl = product.image_url || product.image || '';
    const imagePath = imageUrl && !imageUrl.includes('http') ? `./assets/images/${imageUrl}` : imageUrl;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="product-image">
        ${imagePath ? `<img src="${imagePath}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;">` : icon}
      </div>
      <div class="product-info">
        <div class="product-category">${category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <div class="stars">${starsHTML}</div>
          <span style="color: var(--text-muted); font-size: 13px;">${rating}.0</span>
        </div>
        <div class="product-price">${product.price || 0} MAD</div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id}, '${product.name}', ${product.price || 0}, '${imagePath || ''}')">  
          Add to Cart
        </button>
      </div>
    `;
    card.onclick = (e) => {
      if (e.target.closest('.add-to-cart-btn')) return;
      window.location.href = `product.html?id=${product.id}`;
    };
    grid.appendChild(card);
  });
}

// Update product count
function updateProductCount() {
  document.getElementById('productCount').textContent = filteredProducts.length;
}

// Add to cart
function addToCart(id, name, price, imageUrl) {
  const product = { id, name, price, image_url: imageUrl };
  store.addToCart(product);
  updateCartCount();
  ui.showMessage(`${name} added to cart!`, 'success');
}

// Make function globally accessible
window.addToCart = addToCart;

// Update cart badge
function updateCartBadge() {
  updateCartCount();
}

// Setup event listeners
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

  // Price filters
  document.getElementById('minPrice').addEventListener('change', (e) => {
    minPrice = parseInt(e.target.value) || 0;
    applyFilters();
  });

  document.getElementById('maxPrice').addEventListener('change', (e) => {
    maxPrice = parseInt(e.target.value) || Infinity;
    applyFilters();
  });

  // Sort
  document.getElementById('sortBy').addEventListener('change', (e) => {
    sortBy = e.target.value;
    applyFilters();
  });

  // Clear filters
  document.getElementById('clearFilters').addEventListener('click', () => {
    selectedCategory = '';
    minPrice = 0;
    maxPrice = Infinity;
    sortBy = 'newest';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortBy').value = 'newest';
    applyFilters();
  });
}

// Get URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category') || '',
    view: params.get('view') || ''
  };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupEventListeners();
  updateCartBadge();
  
  // Fetch and display all products
  fetchAllProducts();
});
