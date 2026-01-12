// Orders Page JS
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadOrders();
  
  document.getElementById('statusFilter').addEventListener('change', loadOrders);
});

async function loadOrders() {
  try {
    const orders = await api.getOrders();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredOrders = orders;
    if (statusFilter) {
      filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    const tbody = document.getElementById('ordersTableBody');
    if (filteredOrders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No orders found</td></tr>';
      return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.customerEmail || 'Guest'}</td>
        <td>DH ${(order.total || 0).toFixed(2)}</td>
        <td><span class="badge badge-${getStatusClass(order.status)}">${order.status || 'pending'}</span></td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          <button onclick="viewOrder(${order.id})" class="btn btn-sm btn-secondary">View</button>
          <button onclick="updateOrderStatus(${order.id})" class="btn btn-sm btn-primary">Update</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
    document.getElementById('ordersTableBody').innerHTML = 
      '<tr><td colspan="6" style="text-align: center; color: red;">Error loading orders</td></tr>';
  }
}

function getStatusClass(status) {
  const classes = {
    'pending': 'warning',
    'processing': 'info',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return classes[status] || 'secondary';
}

async function viewOrder(orderId) {
  try {
    const adminAPI = new AdminAPI();
    const orders = await adminAPI.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      const details = `
        <div style="padding: 20px;">
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerEmail || 'Guest'}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> DH ${(order.total || 0).toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <h4>Items:</h4>
          <ul>
            ${(order.items || []).map(item => `
              <li>${item.name} x ${item.quantity} = DH ${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
          </ul>
        </div>
      `;
      document.getElementById('orderDetails').innerHTML = details;
      document.getElementById('orderModal').style.display = 'flex';
    }
  } catch (error) {
    console.error('Error viewing order:', error);
    alert('Error loading order');
  }
}

async function updateOrderStatus(orderId) {
  const newStatus = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
  if (newStatus) {
    try {
      const adminAPI = new AdminAPI();
      await adminAPI.updateOrderStatus(orderId, newStatus);
      alert('Order status updated');
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  }
}

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (e.target === modal) {
    closeOrderModal();
  }
});
