import { setupNavbar } from '../auth.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', function() {
  const paymentForm = document.getElementById('paymentForm');
  const successMessage = document.getElementById('successMessage');
  
  // Setup navbar immediately so buttons work
  setupNavbar();
  
  // Load order data from localStorage
  const orderData = JSON.parse(localStorage.getItem('nexora_pending_order'));
  
  // Fallback: get cart from localStorage if pendingOrder doesn't exist
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Validation: redirect if no order data and no cart
  if (!orderData && (!cart || cart.length === 0)) {
    window.location.href = 'checkout.html';
    return;
  }

  // Populate order summary from stored data
  populateOrderSummary(orderData);

  // Handle form submission
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Validate inputs
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all payment fields');
      return;
    }

    // Validate card number (basic - at least 13 digits)
    if (!/^\d{13,19}$/.test(cardNumber)) {
      alert('Invalid card number. Please enter a valid card number');
      return;
    }

    // Validate expiry format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert('Invalid expiry date. Please use MM/YY format');
      return;
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      alert('Invalid CVV. Please enter a 3-digit CVV');
      return;
    }

    // Show processing state
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Simulate payment processing with 2-second delay
    setTimeout(async () => {
      try {
        // Create order in database via API (optional - allow guest checkout)
        const token = store.getToken();
        console.log('Token:', token);
        
        const orderPayload = {
          items: orderData.items || [],
          total: orderData.total || 0,
          shipping: orderData.shipping || 0,
          status: 'completed'
        };

        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Add auth header only if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(orderPayload)
        });

        console.log('API Response Status:', response.status);
        if (response.ok) {
          const createdOrder = await response.json();
          console.log('Order created:', createdOrder);
          localStorage.setItem('nexora_order_id', createdOrder.id || ('ORD-' + Date.now()));
        } else {
          console.warn('Order creation failed, using fallback ID');
          localStorage.setItem('nexora_order_id', 'ORD-' + Date.now());
        }

        // Show success message
        if (successMessage) {
          successMessage.style.display = 'block';
        }
        localStorage.setItem('nexora_order_date', new Date().toLocaleDateString());

        // Clear cart after successful order
        localStorage.removeItem('nexora_cart');
        localStorage.removeItem('nexora_pending_order');

        console.log('Redirecting to confirmation.html');
        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
          window.location.href = 'confirmation.html';
        }, 2000);
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Order created but there was an issue saving it. Please check your orders.');
        setTimeout(() => {
          window.location.href = 'confirmation.html';
        }, 2000);
      }
    }, 2000);
  });

  // Populate order summary on the page
  function populateOrderSummary(data) {
    const summaryItems = document.getElementById('summaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');

    // Clear existing items
    summaryItems.innerHTML = '';

    // Use orderData if available, otherwise use cart
    const items = (data && data.items) ? data.items : cart;
    
    // Add cart items to summary
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;';
        itemDiv.innerHTML = `
          <div style="font-size: 14px; color: #666666;">
            <div style="font-weight: 500; color: #000000;">${item.name}</div>
            <div style="font-size: 12px; opacity: 0.7;">Qty: ${item.quantity}</div>
          </div>
          <div style="font-weight: 600; color: #000000;">${item.price * item.quantity} MAD</div>
        `;
        summaryItems.appendChild(itemDiv);
      });
    }

    // Update totals
    summarySubtotal.textContent = `${(data?.subtotal || 0)} MAD`;
    summaryShipping.textContent = `${(data?.shipping || 0)} MAD`;
    summaryTotal.textContent = `${(data?.total || 0)} MAD`;
  }
});
