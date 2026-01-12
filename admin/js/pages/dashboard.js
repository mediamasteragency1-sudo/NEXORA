let charts = {};

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboard();
});

async function loadDashboard() {
  try {
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Add KPI cards
    const kpiTemplate = document.getElementById('kpiTemplate');
    const kpiClone = kpiTemplate.content.cloneNode(true);
    dashboardContent.appendChild(kpiClone);
    
    // Add charts
    const chartsTemplate = document.getElementById('chartsTemplate');
    const chartsClone = chartsTemplate.content.cloneNode(true);
    dashboardContent.appendChild(chartsClone);
    
    // Load data
    await initDashboard();
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

async function initDashboard() {
  try {
    // Fetch data from API
    const productsRes = await fetch(`${API_BASE}/products`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const productsData = await productsRes.json();
    const products = productsData.products || [];

    const ordersRes = await fetch(`${API_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const ordersData = await ordersRes.json();
    const orders = ordersData.orders || [];

    // Calculate stats
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map(o => o.customer_id)).size;

    // Update KPI cards
    document.getElementById('totalRevenue').textContent = `DH ${totalRevenue.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalProducts').textContent = totalProducts;

    // Prepare chart data
    const ordersByStatus = {
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length
    };

    const topProducts = products
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 5)
      .map(p => ({ name: p.name, quantity: p.stock || 0 }));

    const dailySales = getDailySalesData(orders);
    const salesByCategory = getSalesByCategoryData(products);

    // Initialize charts
    initOrderStatusChart(ordersByStatus);
    initTopProductsChart(topProducts);
    initDailySalesChart(dailySales);
    initCategoryChart(salesByCategory);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    document.getElementById('dashboardContent').innerHTML = '<p style="color: red;">Error loading dashboard</p>';
  }
}

function getDailySalesData(orders) {
  const last7Days = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString();
    last7Days[dateStr] = 0;
  }

  orders.forEach(o => {
    if (o.created_at) {
      const date = new Date(o.created_at).toLocaleDateString();
      if (date in last7Days) {
        last7Days[date] += o.total || 0;
      }
    }
  });

  return {
    labels: Object.keys(last7Days),
    data: Object.values(last7Days)
  };
}

function getSalesByCategoryData(products) {
  const categories = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    categories[cat] = (categories[cat] || 0) + (p.stock || 0);
  });

  return {
    labels: Object.keys(categories),
    data: Object.values(categories)
  };
}

function initOrderStatusChart(data) {
  const ctx = document.getElementById('orderStatusChart');
  if (!ctx) return;
  
  if (charts.orderStatus) charts.orderStatus.destroy();
  
  charts.orderStatus = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending', 'Cancelled'],
      datasets: [{
        data: [data.completed || 0, data.pending || 0, data.cancelled || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function initTopProductsChart(data) {
  const ctx = document.getElementById('topProductsChart');
  if (!ctx) return;
  
  if (charts.topProducts) charts.topProducts.destroy();
  
  const labels = data.map(p => p.name);
  const quantities = data.map(p => p.quantity);
  
  charts.topProducts = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Stock',
        data: quantities,
        backgroundColor: '#667eea'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } }
    }
  });
}

function initDailySalesChart(data) {
  const ctx = document.getElementById('dailySalesChart');
  if (!ctx) return;
  
  if (charts.dailySales) charts.dailySales.destroy();
  
  charts.dailySales = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Daily Sales',
        data: data.data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: true } }
    }
  });
}

function initCategoryChart(data) {
  const ctx = document.getElementById('categoryChart');
  if (!ctx) return;
  
  if (charts.category) charts.category.destroy();
  
  charts.category = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.data,
        backgroundColor: ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}
