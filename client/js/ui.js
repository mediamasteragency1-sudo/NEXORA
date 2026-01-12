// UI Utilities Module
export const ui = {
  // Category card creation for home page
  createCategoryCard(categoryName, iconType) {
    const icons = {
      'headphones': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g1)"/><circle cx="100" cy="100" r="90" fill="none" stroke="#000" stroke-width="2"/><path d="M 50 80 Q 100 40 150 80" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="130" r="25" fill="none" stroke="#000" stroke-width="2"/><circle cx="150" cy="130" r="25" fill="none" stroke="#000" stroke-width="2"/><circle cx="50" cy="130" r="12" fill="#000"/><circle cx="150" cy="130" r="12" fill="#000"/></svg>',
      'earbuds': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g2)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><circle cx="70" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="70" cy="100" r="10" fill="#000"/><circle cx="130" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="130" cy="100" r="10" fill="#000"/><path d="M 65 75 Q 60 50 65 30" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M 135 75 Q 140 50 135 30" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
      'speakers': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g3)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><rect x="70" y="60" width="60" height="80" fill="none" stroke="#000" stroke-width="2" rx="4"/><circle cx="100" cy="100" r="20" fill="none" stroke="#000" stroke-width="2"/><circle cx="100" cy="100" r="10" fill="#000"/><rect x="75" y="145" width="50" height="8" fill="#000" rx="2"/></svg>',
      'gaming': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g4)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><rect x="55" y="50" width="90" height="100" fill="none" stroke="#000" stroke-width="2" rx="6"/><circle cx="75" cy="130" r="8" fill="#000"/><circle cx="125" cy="90" r="8" fill="#000"/><circle cx="125" cy="110" r="8" fill="#000"/></svg>',
      'accessories': '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/></linearGradient></defs><rect width="200" height="200" fill="url(#g5)"/><circle cx="100" cy="100" r="85" fill="none" stroke="#000" stroke-width="2"/><circle cx="100" cy="80" r="15" fill="none" stroke="#000" stroke-width="2"/><path d="M 100 95 L 100 140" stroke="#000" stroke-width="2"/><line x1="85" y1="110" x2="60" y2="135" stroke="#000" stroke-width="2"/><line x1="115" y1="110" x2="140" y2="135" stroke="#000" stroke-width="2"/></svg>'
    };

    const card = document.createElement('div');
    card.className = 'category-card';
    card.style.cursor = 'pointer';
    const icon = icons[iconType] || icons['accessories'];
    card.innerHTML = `
      <div class="category-icon">${icon}</div>
      <div class="category-name">${categoryName}</div>
    `;
    card.onclick = () => {
      window.location.href = `catalog.html?category=${encodeURIComponent(categoryName)}`;
    };
    return card;
  },

  // Product card creation for home page
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    const badge = Math.random() > 0.7 ? '<span class="product-badge">Sale</span>' : '';
    const stars = '⭐'.repeat(Math.floor(product.rating || 4));
    const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
    const imagePath = imageUrl.includes('http') ? imageUrl : `./assets/images/${imageUrl}`;
    card.innerHTML = `
      <div class="product-image">
        <img src="${imagePath}" alt="${product.name}">
        ${badge}
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">${stars} <span>(${product.rating})</span></div>
        <div class="product-footer">
          <span class="product-price">${product.price} MAD</span>
          <button class="product-action" data-id="${product.id}">Add</button>
        </div>
      </div>
    `;
    return card;
  },

  // Product rendering
  renderProductCard(product, isBestSeller = false) {
    const badge = isBestSeller ? '<span class="product-badge">New</span>' : 
                  (Math.random() > 0.7 ? '<span class="product-badge">Sale</span>' : '');
    
    const stars = '⭐'.repeat(Math.floor(product.rating || 4));
    const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
    const imagePath = imageUrl.includes('http') ? imageUrl : `./assets/images/${imageUrl}`;
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${imagePath}" alt="${product.name}">
          ${badge}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">${stars} <span>(${product.rating})</span></div>
          <div class="product-footer">
            <span class="product-price">${product.price} DH</span>
            <button class="product-action" data-id="${product.id}">Add</button>
          </div>
        </div>
      </div>
    `;
  },

  renderProductDetail(product) {
    const stars = '⭐'.repeat(Math.floor(product.rating || 4));
    const stockClass = product.stock === 0 ? 'out-of-stock' : 
                       product.stock < 10 ? 'low-stock' : 'in-stock';
    const stockText = product.stock === 0 ? 'Out of Stock' : 
                      product.stock < 10 ? `Only ${product.stock} left` : 'In Stock';

    // Generate specifications based on category
    const specs = {
      'Headphones': [
        { label: 'Type', value: 'Over-ear Wireless' },
        { label: 'Driver Size', value: '40mm' },
        { label: 'Frequency Response', value: '20Hz - 20kHz' },
        { label: 'Battery Life', value: '30+ hours' },
        { label: 'Noise Cancellation', value: 'Active (ANC)' },
        { label: 'Bluetooth', value: '5.2' }
      ],
      'Earbuds': [
        { label: 'Type', value: 'True Wireless' },
        { label: 'Driver Size', value: '10mm' },
        { label: 'Battery Life', value: '8 hours + 24h case' },
        { label: 'Noise Cancellation', value: 'Active (ANC)' },
        { label: 'Water Resistance', value: 'IPX4' },
        { label: 'Bluetooth', value: '5.2' }
      ],
      'Speakers': [
        { label: 'Type', value: 'Bluetooth Speaker' },
        { label: 'Power Output', value: '50W RMS' },
        { label: 'Frequency Response', value: '50Hz - 20kHz' },
        { label: 'Battery Life', value: '15+ hours' },
        { label: 'Water Resistance', value: 'IPX7' },
        { label: 'Connectivity', value: 'Bluetooth 5.2 / 3.5mm' }
      ],
      'Gaming': [
        { label: 'Connection', value: '2.4GHz Wireless' },
        { label: 'DPI', value: '800 - 16000 DPI' },
        { label: 'Response Time', value: '1ms' },
        { label: 'Buttons', value: 'Programmable' },
        { label: 'Material', value: 'Premium Aluminum' },
        { label: 'RGB Lighting', value: 'Yes' }
      ],
      'Accessories': [
        { label: 'Output Power', value: '65W' },
        { label: 'Input', value: 'AC 100-240V' },
        { label: 'Charging Time', value: '< 30 minutes' },
        { label: 'Compatibility', value: 'Universal USB-C/USB-A' },
        { label: 'Safety Features', value: 'Multiple protection' },
        { label: 'Warranty', value: '2 years' }
      ]
    };

    const productSpecs = specs[product.category] || specs['Accessories'];

    const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/500';
    const imagePath = imageUrl.includes('http') ? imageUrl : `./assets/images/${imageUrl}`;

    return `
      <div class="product-wrapper">
        <div class="product-container">
          <div class="product-gallery">
            <img src="${imagePath}" alt="${product.name}">
          </div>
          <div class="product-details">
            <h1>${product.name}</h1>
            <div class="product-meta">
              <div class="product-rating-large">${stars} <span>${product.rating}</span></div>
            </div>
            <div class="product-price-large">${product.price} MAD</div>
            <div class="stock-status ${stockClass}">${stockText}</div>
            <p class="product-description">${product.description || 'Premium quality product with excellent performance.'}</p>
            
            <div class="product-qty">
              <button class="qty-btn" id="decreaseQty">−</button>
              <input type="number" id="qtyInput" class="qty-input" value="1" min="1" max="${product.stock}">
              <button class="qty-btn" id="increaseQty">+</button>
            </div>
            
            <button class="add-to-cart-btn" id="addToCartBtn" ${product.stock === 0 ? 'disabled' : ''}>
              Add to Cart
            </button>

            <div class="product-benefits">
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Premium Quality</span>
              </div>
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>2 Year Warranty</span>
              </div>
              <div class="benefit-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div class="product-details-section">
          <div class="details-tabs">
            <button class="tab-btn active" data-tab="specifications">Specifications</button>
            <button class="tab-btn" data-tab="features">Features</button>
            <button class="tab-btn" data-tab="shipping">Shipping & Returns</button>
          </div>

          <div class="tab-content active" id="specifications">
            <h3>Technical Specifications</h3>
            <div class="specs-grid">
              ${productSpecs.map(spec => `
                <div class="spec-item">
                  <div class="spec-label">${spec.label}</div>
                  <div class="spec-value">${spec.value}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="tab-content" id="features">
            <h3>Key Features</h3>
            <ul class="features-list">
              <li>Premium materials for durability and comfort</li>
              <li>Advanced technology for superior performance</li>
              <li>User-friendly interface and controls</li>
              <li>Compatible with all modern devices</li>
              <li>Professional-grade quality and reliability</li>
              <li>Extended warranty and customer support</li>
            </ul>
          </div>

          <div class="tab-content" id="shipping">
            <h3>Shipping & Returns</h3>
            <div class="shipping-info">
              <div class="info-block">
                <h4>Free Shipping</h4>
                <p>Free standard shipping on all orders within Morocco. Express shipping available at checkout.</p>
              </div>
              <div class="info-block">
                <h4>30-Day Returns</h4>
                <p>Not satisfied? Return your item within 30 days for a full refund. No questions asked.</p>
              </div>
              <div class="info-block">
                <h4>2-Year Warranty</h4>
                <p>All NEXORA products come with a comprehensive 2-year warranty covering manufacturing defects.</p>
              </div>
              <div class="info-block">
                <h4>Customer Support</h4>
                <p>24/7 customer support available via email, phone, and live chat for any questions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderCartItem(item, cart) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image_url || item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">${item.price} MAD</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="decrease">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
          <button class="remove-btn cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
        <div class="cart-item-total">
          ${(item.price * item.quantity)} DH
        </div>
      </div>
    `;
  },

  renderOrderCard(order) {
    const statusClass = `status-${order.status.toLowerCase()}`;
    const itemsList = order.items.map(item => 
      `<div class="order-item"><span>${item.name_snapshot} x${item.qty}</span><span>${item.price_snapshot * item.qty} DH</span></div>`
    ).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div class="order-id">Order #${order.id}</div>
          <span class="order-status ${statusClass}">${order.status}</span>
          <span>${new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div class="order-items">
          ${itemsList}
        </div>
        <div class="order-total">
          <span>${order.customer_name} • ${order.city}</span>
          <span><strong>${order.total} DH</strong></span>
        </div>
      </div>
    `;
  },

  renderRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
      return '';
    }

    const cards = recommendations.map(product => {
      const imageUrl = product.image_url || product.image || 'https://via.placeholder.com/300';
      const imagePath = imageUrl.includes('http') ? imageUrl : `./assets/images/${imageUrl}`;
      return `
      <div class="recommendation-card" onclick="window.location.href='product.html?id=${product.id}'">
        <img src="${imagePath}" alt="${product.name}" class="rec-image">
        <div class="rec-content">
          <div class="rec-name">${product.name}</div>
          <div class="rec-rating">⭐ ${product.rating || '4.5'}</div>
          <div class="rec-price">${product.price} DH</div>
        </div>
      </div>
    `;
    }).join('');

    return `
      <div class="recommendations-wrapper">
        <h2 class="recommendations-title">You May Like</h2>
        <div class="recommendations-grid">
          ${cards}
        </div>
      </div>
    `;
  },

  renderPagination(currentPage, totalPages, onPageClick) {
    let html = '';
    
    if (currentPage > 1) {
      html += `<button onclick="this.parentElement.querySelectorAll('button')[1].click()">&laquo; Prev</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
      const active = i === currentPage ? 'active' : '';
      html += `<button class="${active}" data-page="${i}">${i}</button>`;
    }
    
    if (currentPage < totalPages) {
      html += `<button data-page="${currentPage + 1}">Next &raquo;</button>`;
    }
    
    return html;
  },

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 9999;
      animation: slideUp 0.3s ease;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  },

  updateCartCount(count) {
    const cartBadgeEl = document.getElementById('cartBadge');
    if (cartBadgeEl) {
      cartBadgeEl.textContent = count;
      cartBadgeEl.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  formatPrice(price) {
    return `${price.toFixed(2)} DH`;
  }
};
