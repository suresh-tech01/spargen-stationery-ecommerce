// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.createElement('button');

// Create close button for mobile menu
mobileMenuClose.innerHTML = '<i class="fas fa-times"></i>';
mobileMenuClose.classList.add('mobile-menu-close');
mobileMenu.appendChild(mobileMenuClose);

// Theme Toggle Functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}


// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

// Mobile Menu Functionality
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});






// Get product ID from URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load product data based on ID
function loadProductData(productId) {
    // In a real app, you would fetch this from your backend API
    // For now, we'll use mock data
    const products = {
        1: {
            id: 1,
            name: "Premium Fountain Pen",
            price: 29.99,
            description: "This premium fountain pen features a smooth stainless steel nib for effortless writing...",
            // ... all other product properties
        },
        2: {
            id: 2,
            name: "Leather Notebook",
            price: 24.99,
            // ... etc
        }
    };
    
    return products[productId] || null;
}

// Display product on page
function displayProduct(product) {
    if (!product) {
        // Handle product not found
        document.querySelector('.product-detail-container').innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="products.html" class="btn">Browse Products</a>
            </div>
        `;
        return;
    }
    
    // Update the page with product data
    document.querySelector('.product-info h1').textContent = product.name;
    document.querySelector('.current-price').textContent = `$${product.price.toFixed(2)}`;
    // Continue updating all other product fields...
}

// On product page load
if (document.querySelector('.product-detail')) {
    const productId = getProductIdFromUrl();
    const product = loadProductData(productId);
    displayProduct(product);
}








// Product Tabs Functionality
function initProductTabs() {
    const tabLinks = document.querySelectorAll('.tabs-nav a');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target tab pane ID
            const targetId = this.getAttribute('href');
            const targetPane = document.querySelector(targetId);
            
            // Remove active class from all tabs and panes
            tabLinks.forEach(tab => tab.parentNode.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.parentNode.classList.add('active');
            targetPane.classList.add('active');
        });
    });
}

// Initialize tabs when on product page
if (document.querySelector('.product-tabs')) {
    initProductTabs();
}






// Wishlist specific functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Remove item from wishlist
            const removeBtns = document.querySelectorAll('.remove-btn');
            removeBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('.wishlist-table-row');
                    row.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        row.remove();
                        checkEmptyWishlist();
                    }, 300);
                });
            });
            
            // Clear wishlist button
            const clearWishlistBtn = document.getElementById('clear-wishlist');
            if (clearWishlistBtn) {
                clearWishlistBtn.addEventListener('click', function() {
                    const rows = document.querySelectorAll('.wishlist-table-row');
                    rows.forEach(row => {
                        row.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    });
                    setTimeout(checkEmptyWishlist, 350);
                });
            }
            
            // Add to cart from wishlist
            const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (!this.disabled) {
                        // In a real app, this would add to cart via API
                        this.textContent = 'Added!';
                        this.style.backgroundColor = 'var(--success-color)';
                        setTimeout(() => {
                            this.textContent = 'Add to Cart';
                            this.style.backgroundColor = '';
                        }, 1500);
                    }
                });
            });
            
            // Check if wishlist is empty
            function checkEmptyWishlist() {
                const wishlistRows = document.querySelectorAll('.wishlist-table-row');
                const emptyWishlist = document.querySelector('.empty-wishlist');
                const wishlistItems = document.querySelector('.wishlist-items');
                
                if (wishlistRows.length === 0) {
                    wishlistItems.style.display = 'none';
                    emptyWishlist.style.display = 'block';
                } else {
                    wishlistItems.style.display = 'block';
                    emptyWishlist.style.display = 'none';
                }
            }
            
            // Initialize check
            checkEmptyWishlist();
        });







// Checkout step navigation
document.addEventListener('DOMContentLoaded', function () {
  const steps = document.querySelectorAll('.checkout-step');
  const nextBtns = document.querySelectorAll('.next-step');
  const prevBtns = document.querySelectorAll('.prev-step');
  const editBtns = document.querySelectorAll('.edit-btn');

  function showStep(stepIndex) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === stepIndex);
    });
  }

  nextBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i === 0) fillReviewSection(); // go to payment
      if (i === 1) fillReviewSection(); // go to review
      showStep(i + 1);
    });
  });

  prevBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      showStep(i);
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step')) - 1;
      showStep(step);
    });
  });

  // Place order simulation
  const placeOrderBtn = document.querySelector('.place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const agree = document.getElementById('terms').checked;
      if (!agree) {
        alert('Please accept the terms and conditions to proceed.');
        return;
      }
      alert('Processing your payment...');
      setTimeout(() => {
        alert('🎉 Payment Successful! Thank you for your order.');
        window.location.href = 'thank-you.html'; // or index.html
      }, 1500);
    });
  }

  // Fill review info from forms
  function fillReviewSection() {
    const shippingReview = document.getElementById('shipping-review');
    const paymentReview = document.getElementById('payment-review');
    
    if (shippingReview) {
      const first = document.getElementById('first-name')?.value || '';
      const last = document.getElementById('last-name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const address = document.getElementById('address')?.value || '';
      const city = document.getElementById('city')?.value || '';
      const state = document.getElementById('state')?.value || '';
      const zip = document.getElementById('zip')?.value || '';
      const country = document.getElementById('country')?.value || '';
      
      shippingReview.innerHTML = `
        <p><strong>Name:</strong> ${first} ${last}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${state} ${zip}, ${country}</p>
      `;
    }

    if (paymentReview) {
      const method = document.querySelector('input[name=\"payment\"]:checked')?.value || 'Not selected';
      paymentReview.innerHTML = `<p><strong>Method:</strong> ${method}</p>`;
    }
  }

  // Default to step 1
  showStep(0);
});
