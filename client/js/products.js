import { productAPI, cartAPI, wishlistAPI } from './api.js';
import { getAuthToken } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = getAuthToken();
  const productList = document.getElementById('product-list');
  const categoryFilter = document.getElementById('category-filter');
  
  // Load products
  const products = await productAPI.getProducts();
  
  // Render products
  products.data.forEach(product => {
    const productCard = `
      <div class="product-card">
        <img src="${product.images[0]?.url || 'placeholder.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        <button class="add-to-wishlist" data-id="${product.id}">❤️</button>
      </div>
    `;
    productList.innerHTML += productCard;
  });

  // Add event listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (!token) return window.location.href = '/login.html';
      try {
        await cartAPI.addToCart(e.target.dataset.id, 1, token);
        alert('Added to cart!');
      } catch (error) {
        alert(error.message);
      }
    });
  });

  // Category filter
  categoryFilter?.addEventListener('change', async (e) => {
    const products = await productAPI.getProducts(`?category=${e.target.value}`);
    productList.innerHTML = '';
    // Re-render filtered products...
  });
});