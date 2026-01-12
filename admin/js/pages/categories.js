// Categories Page JS
let editingCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadCategories();
  
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    editingCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').style.display = 'flex';
  });
});

async function loadCategories() {
  try {
    const categories = await api.getCategories();
    
    const tbody = document.getElementById('categoriesTableBody');
    if (categories.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No categories found</td></tr>';
      return;
    }
    
    tbody.innerHTML = categories.map(category => `
      <tr>
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>${category.description || 'N/A'}</td>
        <td>${category.productCount || 0}</td>
        <td><span class="badge badge-success">Active</span></td>
        <td>
          <button onclick="editCategory(${category.id})" class="btn btn-sm btn-secondary">Edit</button>
          <button onclick="deleteCategory(${category.id})" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
    document.getElementById('categoriesTableBody').innerHTML = 
      '<tr><td colspan="6" style="text-align: center; color: red;">Error loading categories</td></tr>';
  }
}

async function editCategory(categoryId) {
  try {
    const categories = await api.getCategories();
    const category = categories.find(c => c.id === categoryId);
    
    if (category) {
      editingCategoryId = categoryId;
      document.getElementById('categoryModalTitle').textContent = 'Edit Category';
      document.getElementById('categoryName').value = category.name || '';
      document.getElementById('categoryDescription').value = category.description || '';
      document.getElementById('categoryModal').style.display = 'flex';
    }
  } catch (error) {
    console.error('Error editing category:', error);
    alert('Error loading category');
  }
}

async function handleCategorySubmit(event) {
  event.preventDefault();
  
  const categoryData = {
    name: document.getElementById('categoryName').value,
    description: document.getElementById('categoryDescription').value
  };
  
  try {
    const adminAPI = new AdminAPI();
    if (editingCategoryId) {
      await adminAPI.updateCategory(editingCategoryId, categoryData);
      alert('Category updated successfully');
    } else {
      await adminAPI.createCategory(categoryData);
      alert('Category created successfully');
    }
    closeCategoryModal();
    loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    alert('Error saving category');
  }
}

async function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      const adminAPI = new AdminAPI();
      await adminAPI.deleteCategory(categoryId);
      alert('Category deleted successfully');
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  }
}

function closeCategoryModal() {
  document.getElementById('categoryModal').style.display = 'none';
  document.getElementById('categoryForm').reset();
  editingCategoryId = null;
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('categoryModal');
  if (e.target === modal) {
    closeCategoryModal();
  }
});
