import { authAPI } from './api.js';

// Store token in localStorage
function setAuthToken(token) {
  localStorage.setItem('token', token);
}

function getAuthToken() {
  return localStorage.getItem('token');
}

function clearAuth() {
  localStorage.removeItem('token');
}

// Handle login form submission
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const { token, user } = await authAPI.login({ email, password });
    setAuthToken(token);
    window.location.href = '/products.html';
  } catch (error) {
    alert(error.message);
  }
});

// Handle registration
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const { token, user } = await authAPI.register({ name, email, password });
    setAuthToken(token);
    window.location.href = '/products.html';
  } catch (error) {
    alert(error.message);
  }
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  clearAuth();
  window.location.href = '/login.html';
});