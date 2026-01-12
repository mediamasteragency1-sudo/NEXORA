// Store/State Management Module
export const store = {
  // Cart management
  getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity
      });
    }

    this.setCart(cart);
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.id !== productId);
    this.setCart(filtered);
    return filtered;
  },

  updateCartItemQty(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.setCart(cart);
    }
    return cart;
  },

  clearCart() {
    localStorage.removeItem('cart');
    return [];
  },

  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Auth management
  getAuth() {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  },

  setAuth(token, user) {
    localStorage.setItem('auth', JSON.stringify({ token, user }));
  },

  getToken() {
    const auth = this.getAuth();
    return auth?.token || null;
  },

  getUser() {
    const auth = this.getAuth();
    return auth?.user || null;
  },

  logout() {
    localStorage.removeItem('auth');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
};
