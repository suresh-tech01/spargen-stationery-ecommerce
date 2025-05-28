const addToCart = async (productId) => {
  const token = localStorage.getItem('authToken');
  if (!token) return redirectToLogin();

  try {
    await fetch(`http://localhost:5000/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    updateCartUI();
  } catch (error) {
    showCartError(error);
  }
};