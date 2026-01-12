import { store } from '../store.js';
import { ui } from '../ui.js';
import { setupNavbar, updateCartCount } from '../auth.js';

let currentSlide = 0;
const slides = [
  {
    label: 'High-end Earphones',
    title: 'Premium Audio Products',
    cta: 'Discover Collection'
  },
  {
    label: 'Gaming Excellence',
    title: 'Immersive Sound Experience',
    cta: 'Shop Gaming Gear'
  },
  {
    label: 'Audio Innovation',
    title: 'Next Generation Tech',
    cta: 'Explore Collection'
  }
];

function initSlider() {
  const sliderContainer = document.getElementById('sliderContainer');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (!sliderContainer || !prevBtn || !nextBtn) return;

  // Render dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });

  prevBtn.onclick = () => previousSlide();
  nextBtn.onclick = () => nextSlide();

  // Auto-rotate
  setInterval(autoRotate, 6000);
  sliderContainer.addEventListener('mouseenter', pauseSlider);
  sliderContainer.addEventListener('mouseleave', resumeSlider);

  updateSlider();
}

function updateSlider() {
  const sliderContainer = document.getElementById('sliderContainer');
  if (!sliderContainer) return;

  const slides = sliderContainer.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.style.opacity = index === currentSlide ? '1' : '0';
    slide.style.zIndex = index === currentSlide ? '1' : '0';
  });

  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
}

function previousSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

let autoRotateInterval;

function autoRotate() {
  nextSlide();
}

function pauseSlider() {
  clearInterval(autoRotateInterval);
}

function resumeSlider() {
  autoRotateInterval = setInterval(autoRotate, 6000);
}

function initCategories() {
  const categoriesContainer = document.getElementById('categoriesGrid');
  if (!categoriesContainer) return;

  const categories = [
    { name: 'Headphones', icon: 'headphones' },
    { name: 'Earbuds', icon: 'earbuds' },
    { name: 'Speakers', icon: 'speakers' },
    { name: 'Gaming', icon: 'gaming' },
    { name: 'Accessories', icon: 'accessories' }
  ];

  // Clear existing content
  categoriesContainer.innerHTML = '';

  categories.forEach(cat => {
    const card = ui.createCategoryCard(cat.name, cat.icon);
    categoriesContainer.appendChild(card);
  });
}

async function fetchAndRenderProducts() {
  try {
    const response = await fetch('http://localhost:4000/api/products?limit=8');
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();
    const products = data.products || data;
    
    const container = document.getElementById('bestSellersGrid');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
      const card = ui.createProductCard(product);
      card.onclick = () => {
        window.location.href = `product.html?id=${product.id}`;
      };
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    const container = document.getElementById('bestSellersGrid');
    if (container) {
      container.innerHTML = '<p style="color: red;">Error loading products</p>';
    }
  }
}

function addToCart(productId, productName, productPrice, imageUrl) {
  const product = {
    id: productId,
    name: productName,
    price: productPrice,
    quantity: 1,
    image_url: imageUrl
  };
  
  store.addToCart(product);
  updateCartCount();
  ui.showMessage(`${productName} added to cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  initSlider();
  fetchAndRenderProducts();
});