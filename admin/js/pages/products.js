// Products Page JS
let editingProductId = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadProducts();
  
  document.getElementById('addProductBtn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').style.display = 'flex';
  });
});

async function loadProducts() {
  try {
    const products = await api.getProducts();
    
    const tbody = document.getElementById('productsTableBody');
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No products found</td></tr>';
      return;
    }
    
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category || 'N/A'}</td>
        <td>DH ${(product.price || 0).toFixed(2)}</td>
        <td>${product.stock || 0}</td>
        <td><span class="badge badge-success">Active</span></td>
        <td>
          <button onclick="editProduct(${product.id})" class="btn btn-sm btn-secondary">Edit</button>
          <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsTableBody').innerHTML = 
      '<tr><td colspan="7" style="text-align: center; color: red;">Error loading products</td></tr>';
  }
}

async function editProduct(productId) {
  try {
    const products = await api.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      editingProductId = productId;
      document.getElementById('modalTitle').textContent = 'Edit Product';
      document.getElementById('productName').value = product.name || '';
      document.getElementById('productCategory').value = product.category || '';
      document.getElementById('productPrice').value = product.price || '';
      document.getElementById('productStock').value = product.stock || '';
      document.getElementById('productDescription').value = product.description || '';
      document.getElementById('productModal').style.display = 'flex';
    }
  } catch (error) {
    console.error('Error editing product:', error);
    alert('Error loading product');
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();
  
  const productData = {
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    description: document.getElementById('productDescription').value
  };
  
  try {
    if (editingProductId) {
      await api.updateProduct(editingProductId, productData);
      alert('Product updated successfully');
    } else {
      await api.createProduct(productData);
      alert('Product created successfully');
    }
    closeProductModal();
    loadProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error saving product');
  }
}

async function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await api.deleteProduct(productId);
      alert('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  }
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
  document.getElementById('productForm').reset();
  editingProductId = null;
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('productModal');
  if (e.target === modal) {
    closeProductModal();
  }
});
