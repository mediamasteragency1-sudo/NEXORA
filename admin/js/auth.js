// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem('admin_token');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (!token && currentPage !== 'index.html') {
    window.location.href = 'index.html';
    return false;
  }
  
  if (token && currentPage === 'index.html') {
    window.location.href = 'dashboard.html';
  }
  
  return true;
}

// Logout
function logout() {
  localStorage.removeItem('admin_token');
  window.location.href = 'index.html';
}

// Get token
function getToken() {
  return localStorage.getItem('admin_token');
}

// Setup logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  checkAuth();
});
