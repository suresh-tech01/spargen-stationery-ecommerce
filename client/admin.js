// DOM Elements
const addProductBtn = document.getElementById('add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const productForm = document.getElementById('product-form');
const imageUpload = document.getElementById('product-images');
const imagePreview = document.getElementById('image-preview');

// Open Add Product Modal
addProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('active');
});

// Close Modal
modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        addProductModal.classList.remove('active');
    });
});

// Close modal when clicking outside
addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
        addProductModal.classList.remove('active');
    }
});

// Handle image upload preview
imageUpload.addEventListener('change', () => {
    // Clear existing previews (except template)
    document.querySelectorAll('.preview-item:not(.template)').forEach(item => item.remove());
    
    // Create preview for each selected file
    Array.from(imageUpload.files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const previewItem = imagePreview.querySelector('.preview-item.template').cloneNode(true);
            previewItem.classList.remove('template');
            previewItem.querySelector('img').src = e.target.result;
            
            // Add remove button functionality
            const removeBtn = previewItem.querySelector('.remove-image');
            removeBtn.addEventListener('click', () => {
                previewItem.remove();
            });
            
            imagePreview.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    });
});

// Handle form submission
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    const formData = {
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        category: document.getElementById('product-category').value,
        stock: document.getElementById('product-stock').value,
        description: document.getElementById('product-description').value,
        status: document.getElementById('product-status').checked ? 'active' : 'inactive',
        images: Array.from(imageUpload.files)
    };
    
    console.log('Form submitted:', formData);
    
    // Show success message
    alert('Product added successfully!');
    
    // Reset form and close modal
    productForm.reset();
    imagePreview.querySelectorAll('.preview-item:not(.template)').forEach(item => item.remove());
    addProductModal.classList.remove('active');
});

// Tab functionality for admin navigation
const adminNavLinks = document.querySelectorAll('.admin-nav li a');
adminNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        adminNavLinks.forEach(l => l.parentNode.classList.remove('active'));
        
        // Add active class to clicked link
        link.parentNode.classList.add('active');
        
        // Here you would typically load the appropriate content
        const sectionId = link.getAttribute('href').substring(1);
        console.log(`Loading section: ${sectionId}`);
    });
});


// Add this to your existing script.js file

// Skip to content link functionality
document.addEventListener('DOMContentLoaded', () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
    
    // Handle focus for skip link
    skipLink.addEventListener('focus', () => {
        skipLink.style.left = '0';
    });
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Product gallery functionality for product detail page
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                mainImage.src = thumb.src.replace('100x100', '600x600');
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
    
    // Quantity selector functionality
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('input');
        
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
        });
    });
    
    // Checkout steps functionality
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const editBtns = document.querySelectorAll('.edit-btn');
    
    if (checkoutSteps.length > 0) {
        // Show first step by default
        checkoutSteps[0].classList.add('active');
        
        // Next step functionality
        nextStepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.checkout-step');
                const nextStepId = currentStep.id.replace(/\d+/, match => parseInt(match) + 1);
                const nextStep = document.getElementById(nextStepId);
                
                if (nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    
                    // Update review sections
                    if (nextStepId === 'step-3') {
                        updateOrderReview();
                    }
                }
            });
        });
        
        // Previous step functionality
        prevStepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = btn.closest('.checkout-step');
                const prevStepId = currentStep.id.replace(/\d+/, match => parseInt(match) - 1);
                const prevStep = document.getElementById(prevStepId);
                
                if (prevStep) {
                    currentStep.classList.remove('active');
                    prevStep.classList.add('active');
                }
            });
        });
        
        // Edit step functionality
        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const stepToEdit = btn.dataset.step;
                const stepElement = document.getElementById(`step-${stepToEdit}`);
                
                if (stepElement) {
                    document.querySelector('.checkout-step.active').classList.remove('active');
                    stepElement.classList.add('active');
                }
            });
        });
    }
    
    // Update order review function
    function updateOrderReview() {
        // Get shipping info from form
        const shippingForm = document.getElementById('shipping-form');
        if (shippingForm) {
            const shippingReview = document.getElementById('shipping-review');
            shippingReview.innerHTML = `
                <p>${shippingForm.querySelector('#first-name').value} ${shippingForm.querySelector('#last-name').value}</p>
                <p>${shippingForm.querySelector('#email').value}</p>
                <p>${shippingForm.querySelector('#phone').value}</p>
                <p>${shippingForm.querySelector('#address').value}</p>
                <p>${shippingForm.querySelector('#city').value}, ${shippingForm.querySelector('#state').value} ${shippingForm.querySelector('#zip').value}</p>
                <p>${shippingForm.querySelector('#country').value}</p>
            `;
        }
        
        // Get payment info from form
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            const paymentReview = document.getElementById('payment-review');
            const selectedPayment = paymentForm.querySelector('input[name="payment"]:checked').value;
            
            if (selectedPayment === 'credit-card') {
                const cardNumber = paymentForm.querySelector('#card-number').value;
                paymentReview.innerHTML = `
                    <p>Credit Card ending in ${cardNumber.slice(-4)}</p>
                    <p>Expires ${paymentForm.querySelector('#card-expiry').value}</p>
                `;
            } else {
                paymentReview.innerHTML = `<p>${selectedPayment.charAt(0).toUpperCase() + selectedPayment.slice(1)}</p>`;
            }
        }
    }
    
    // Voice search functionality (2025 feature)
    if ('webkitSpeechRecognition' in window) {
        const voiceSearchBtn = document.createElement('button');
        voiceSearchBtn.className = 'icon-btn voice-search-btn';
        voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceSearchBtn.title = 'Voice Search';
        
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.appendChild(voiceSearchBtn);
            
            voiceSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                startVoiceSearch();
            });
        }
        
        function startVoiceSearch() {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                voiceSearchBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceSearchBtn.style.color = 'var(--danger-color)';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const searchInput = searchForm.querySelector('input[type="search"]');
                if (searchInput) {
                    searchInput.value = transcript;
                    searchForm.submit();
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Voice recognition error', event.error);
            };
            
            recognition.onend = () => {
                voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceSearchBtn.style.color = '';
            };
            
            recognition.start();
        }
    }
});