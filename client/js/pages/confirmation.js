document.addEventListener('DOMContentLoaded', function() {
  // Get order data from localStorage
  const orderId = localStorage.getItem('nexora_order_id') || 'ORD-' + Date.now();
  const orderDate = localStorage.getItem('nexora_order_date') || new Date().toLocaleDateString();
  const orderData = JSON.parse(localStorage.getItem('nexora_pending_order'));

  // Display order ID and date
  const orderIdElement = document.getElementById('orderId');
  const orderDateElement = document.getElementById('orderDate');
  const orderTotalElement = document.getElementById('orderTotal');

  if (orderIdElement) {
    orderIdElement.textContent = orderId;
  }

  if (orderDateElement) {
    orderDateElement.textContent = orderDate;
  }

  if (orderTotalElement && orderData) {
    orderTotalElement.textContent = `${(orderData.total || 0)} MAD`;
  }

  // Clear localStorage after displaying confirmation
  // This prevents the order from being reused if user goes back
  localStorage.removeItem('nexora_pending_order');
  localStorage.removeItem('nexora_order_id');
  localStorage.removeItem('nexora_order_date');
});
