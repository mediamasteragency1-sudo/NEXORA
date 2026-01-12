// Product Detail Page Module
import { api } from '../api.js';
import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

let currentProduct = null;

async function loadProduct() {
  try {
    const url = new URL(window.location);
    const productId = url.searchParams.get('id');
    
    if (!productId) {
      window.location.href = 'catalog.html';
      return;
    }
    
    const product = await api.getProductById(productId);
    currentProduct = product;
    const container = document.getElementById('productContent');
    container.innerHTML = ui.renderProductDetail(product);
    
    // Setup quantity controls
    const qtyInput = document.getElementById('qtyInput');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addBtn = document.getElementById('addToCartBtn');
    
    decreaseBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      if (current > 1) qtyInput.value = current - 1;
    });
    
    increaseBtn.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      if (current < product.stock) qtyInput.value = current + 1;
    });
    
    addBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value);
      for (let i = 0; i < qty; i++) {
        store.addToCart(product);
      }
      updateCartCount();
      ui.showMessage(`${product.name} added to cart!`, 'success');
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 500);
    });

    // Setup tabs functionality
    setupTabs();

    // Load recommendations
    await loadRecommendations(product);
  } catch (error) {
    console.error('Failed to load product:', error);
    ui.showMessage(error.message, 'error');
  }
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const content = document.getElementById(tabName);
      if (content) content.classList.add('active');
    });
  });
}

async function loadRecommendations(product) {
  try {
    // Fetch all products
    const response = await fetch('http://localhost:4000/api/products');
    const data = await response.json();
    const allProducts = data.products || [];

    // Filter recommendations: same category, exclude current product
    let recommendations = allProducts.filter(p => 
      p.category === product.category && p.id !== product.id
    );

    // If we have less than 4 recommendations, add products from other categories
    if (recommendations.length < 4) {
      const otherProducts = allProducts.filter(p => 
        p.category !== product.category && p.id !== product.id
      );
      recommendations = [...recommendations, ...otherProducts].slice(0, 4);
    } else {
      recommendations = recommendations.slice(0, 4);
    }

    // Render recommendations
    const recommendationsSection = document.getElementById('recommendationsSection');
    if (recommendations.length > 0) {
      recommendationsSection.innerHTML = ui.renderRecommendations(recommendations);
    }
  } catch (error) {
    console.error('Failed to load recommendations:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  loadProduct();
});
