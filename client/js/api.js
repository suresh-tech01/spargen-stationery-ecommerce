const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (userData) => fetchAPI('/auth/register', 'POST', userData),
  login: (credentials) => fetchAPI('/auth/login', 'POST', credentials),
  getMe: (token) => fetchAPI('/auth/me', 'GET', null, token),
};

// Product API
export const productAPI = {
  getProducts: (query = '') => fetchAPI(`/products${query}`),
  getProduct: (id) => fetchAPI(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: (token) => fetchAPI('/cart', 'GET', null, token),
  addToCart: (productId, quantity, token) => 
    fetchAPI('/cart', 'POST', { productId, quantity }, token),
  removeFromCart: (itemId, token) => 
    fetchAPI(`/cart/${itemId}`, 'DELETE', null, token),
  clearCart: (token) => fetchAPI('/cart', 'DELETE', null, token),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: (token) => fetchAPI('/wishlist', 'GET', null, token),
  addToWishlist: (productId, token) => 
    fetchAPI('/wishlist', 'POST', { productId }, token),
  removeFromWishlist: (itemId, token) => 
    fetchAPI(`/wishlist/${itemId}`, 'DELETE', null, token),
};

// Enhanced error handling
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason.message.includes('401')) {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
});