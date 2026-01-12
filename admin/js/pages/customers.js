// Customers Page JS
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadCustomers();
  
  document.getElementById('searchCustomer').addEventListener('input', loadCustomers);
});

async function loadCustomers() {
  try {
    const customers = await api.getCustomers();
    const searchTerm = document.getElementById('searchCustomer').value.toLowerCase();
    
    let filteredCustomers = customers;
    if (searchTerm) {
      filteredCustomers = customers.filter(c => 
        (c.name && c.name.toLowerCase().includes(searchTerm)) ||
        (c.email && c.email.toLowerCase().includes(searchTerm))
      );
    }
    
    const tbody = document.getElementById('customersTableBody');
    if (filteredCustomers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No customers found</td></tr>';
      return;
    }
    
    tbody.innerHTML = filteredCustomers.map(customer => `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.name || 'N/A'}</td>
        <td>${customer.email || 'N/A'}</td>
        <td>${customer.phone || 'N/A'}</td>
        <td>${customer.orderCount || 0}</td>
        <td>DH ${(customer.totalSpent || 0).toFixed(2)}</td>
        <td>${customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : 'N/A'}</td>
        <td>
          <button onclick="viewCustomer(${customer.id})" class="btn btn-sm btn-secondary">View</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading customers:', error);
    document.getElementById('customersTableBody').innerHTML = 
      '<tr><td colspan="8" style="text-align: center; color: red;">Error loading customers</td></tr>';
  }
}

async function viewCustomer(customerId) {
  try {
    const adminAPI = new AdminAPI();
    const customers = await adminAPI.getCustomers();
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
      const details = `
        <div>
          <p><strong>Name:</strong> ${customer.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${customer.phone || 'N/A'}</p>
          <p><strong>Total Orders:</strong> ${customer.orderCount || 0}</p>
          <p><strong>Total Spent:</strong> DH ${(customer.totalSpent || 0).toFixed(2)}</p>
          <p><strong>Join Date:</strong> ${customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      `;
      document.getElementById('customerDetails').innerHTML = details;
      document.getElementById('customerModal').style.display = 'flex';
    }
  } catch (error) {
    console.error('Error viewing customer:', error);
    alert('Error loading customer');
  }
}

function closeCustomerModal() {
  document.getElementById('customerModal').style.display = 'none';
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('customerModal');
  if (e.target === modal) {
    closeCustomerModal();
  }
});
