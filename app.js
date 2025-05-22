const items = [
    {
        id: 1,
        name: "Иркутский холодильник",
        price: 13500,
        quantity: 11,
        rating: 0,
        producer: "нн подвал",
        img: "assets/fridge.jpg",
        category: "бытовая техника",
        delivery: "Сегодня Бесплатная"
    },
    {
        id: 2,
        name: "Смартфон VIVO",
        price: 9800,
        quantity: 42,
        rating: 2,
        producer: "VIVO",
        img: "assets/phone.jpg",
        category: "девайсы",
        delivery: "Бесплатная"
    },
    {
        id: 3,
        name: "Смартфон POCO C4",
        price: 32999,
        quantity: 8,
        rating: 4,
        producer: "POCO",
        img: "assets/phone.jpg",
        category: "девайсы",
        delivery: "Самовывоз"
    },
    {
        id: 4,
        name: "Смартфон Xiaomi E12 Pro Mini Plus",
        price: 11100,
        quantity: 5,
        rating: 5,
        producer: "Xiaomi",
        img: "assets/phone.jpg",
        category: "девайсы",
        delivery: "Сегодня"
    },
    {
        id: 5,
        name: "Процессор Intel Core i5",
        price: 12000,
        quantity: 21,
        rating: 5,
        producer: "Intel",
        img: "assets/CPU.jpg",
        category: "комплектующие",
        delivery: "Бесплатная Самовывоз"
    },
    {
        id: 6,
        name: "Процессор Ryzen 7",
        price: 13500,
        quantity: 54,
        rating: 5,
        producer: "AMD",
        img: "assets/CPU.jpg",
        category: "комплектующие",
        delivery: "Сегодня Бесплатная"
    },
    {
        id: 7,
        name: "Видеокарта NVidia RTX 4060 Ti",
        price: 53999,
        quantity: 2,
        rating: 5,
        producer: "NVidia",
        img: "assets/graphics_card.png",
        category: "комплектующие",
        delivery: "Сегодня"
    },
    {
        id: 8,
        name: "Видеокарта Radeon RX 8600",
        price: 53999,
        quantity: 1,
        rating: 5,
        producer: "Radeon",
        img: "assets/graphics_card.png",
        category: "комплектующие",
        delivery: "Бесплатная"
    },
    {
        id: 9,
        name: "Видеокарта Radeon RX 7600",
        price: 36000,
        quantity: 0,
        rating: 5,
        producer: "Radeon",
        img: "assets/graphics_card.png",
        category: "комплектующие",
        delivery: "Самовывоз"
    },
    {
        id: 10,
        name: "утюг",
        price: 9999,
        quantity: 100,
        rating: 5,
        producer: "нету они сами у нас заспавнились",
        img: "assets/Iron.webp",
        category: "бытовая техника",
        delivery: "Сегодня Бесплатная Самовывоз"
    },
    {
        id: 11,
        name: "сборка ПК - 'дешевая'",
        price: 49999,
        quantity: 3,
        rating: 5,
        producer: "МЫ",
        img: "assets/custom_pc.png",
        category: "готовые сборки",
        delivery: "Бесплатная"
    },
    {
        id: 12,
        name: "сборка ПК - 'подороже'",
        price: 499999,
        quantity: 1,
        rating: 5,
        producer: "МЫ",
        img: "assets/custom_pc.png",
        category: "готовые сборки",
        delivery: "Сегодня"
    },
    {
        id: 13,
        name: "Электросамовар",
        price: 5999,
        quantity: 9,
        rating: 5,
        producer: "Наши программисты",
        img: "assets/appliances.png",
        category: "бытовая техника",
        delivery: "Бесплатная Самовывоз"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Preload placeholder image to prevent flash
    const placeholderImg = new Image();
    placeholderImg.src = 'assets/placeholder.png';

    // Elements
    const rangeMin = document.getElementById('range-min');
    const rangeMax = document.getElementById('range-max');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const progress = document.querySelector('.progress');
    const applyBtn = document.querySelector('.apply-filters');
    const resetBtn = document.querySelector('.reset-filters');
    const errorMessage = document.querySelector('.error-message');
    const priceGap = 1000;
    let filtersApplied = false;

    // Cart management
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to save cart to localStorage:', e);
        }
    }

    // Add item to cart
    function addToCart(itemId) {
        const item = items.find(i => i.id === itemId);
        if (!item || item.quantity <= 0) {
            if (errorMessage) {
                errorMessage.textContent = 'Товар отсутствует на складе';
                errorMessage.style.display = 'block';
                setTimeout(() => errorMessage.style.display = 'none', 3000);
            }
            return;
        }
        const cartItem = cart.find(i => i.id === itemId);
        if (cartItem) {
            if (cartItem.quantity < item.quantity) cartItem.quantity += 1;
        } else {
            cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1, img: item.img });
        }
        console.log('Cart after adding item:', cart); // Debug log
        saveCart();
        renderCart();
    }

    // Update item quantity
    function updateQuantity(itemId, newQuantity) {
        const item = items.find(i => i.id === itemId);
        const cartItem = cart.find(i => i.id === itemId);
        if (!cartItem || !item) return;

        if (newQuantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        } else if (newQuantity <= item.quantity) {
            cartItem.quantity = newQuantity;
        } else {
            if (errorMessage) {
                errorMessage.textContent = 'Превышен доступный запас';
                errorMessage.style.display = 'block';
                setTimeout(() => errorMessage.style.display = 'none', 3000);
            }
            return;
        }
        saveCart();
        renderCart();
    }

    // Remove item from cart
    function removeFromCart(itemId) {
        cart = cart.filter(i => i.id !== itemId);
        saveCart();
        renderCart();
    }

    // Calculate totals
    function calculateTotals() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = 0;
        return { total, discount };
    }

    // Render cart
    function renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';
        cart.forEach(item => {
            console.log('Rendering item with image:', item.img); // Debug log
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img || 'assets/placeholder.png'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="qty-control">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}">Удалить</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.id);
                const cartItem = cart.find(i => i.id === itemId);
                if (cartItem) {
                    updateQuantity(itemId, cartItem.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.id);
                const cartItem = cart.find(i => i.id === itemId);
                if (cartItem) {
                    updateQuantity(itemId, cartItem.quantity + 1);
                }
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.dataset.id);
                removeFromCart(itemId);
            });
        });

        const { total, discount } = calculateTotals();
        const totalEl = document.querySelector('.checkout-total');
        const discountEl = document.querySelector('.checkout-discount');
        if (totalEl) totalEl.textContent = `Итог: ${total}₽`;
        if (discountEl) discountEl.textContent = `Скидка: ${discount}₽`;
    }

    // Initialize products page
    function initProductsPage() {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
                applyFilters();
            } else {
                console.warn(`Category filter "${category}" not found`);
            }
        }

        items.forEach(item => {
            if (item.quantity <= 0) return;
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = item.id;
            productCard.dataset.price = item.price;
            productCard.dataset.category = item.category;
            productCard.dataset.delivery = item.delivery;
            productCard.innerHTML = `
                <img src="${item.img || 'assets/placeholder.png'}" alt="${item.name}" class="product-image">
                <div class="product-info">
                    <div class="product-title">${item.name}</div>
                    <div class="product-price">${item.price} ₽</div>
                    <div class="product-rating">★★★★★ (${item.rating})</div>
                    <div class="product-delivery">${item.delivery}</div>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        productsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                const itemId = parseInt(card.dataset.id);
                addToCart(itemId);
            }
        });
    }

    // Handle redirects
    function handleRedirects() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-redirect]');
            if (target) {
                const redirectUrl = target.dataset.redirect;
                const category = target.dataset.category;
                if (redirectUrl && redirectUrl.trim().length > 0) {
                    if (category) {
                        window.location.href = `${redirectUrl}?category=${encodeURIComponent(category)}`;
                    } else {
                        window.location.href = redirectUrl;
                    }
                } else {
                    console.error('Invalid redirect URL:', redirectUrl);
                }
            }
        });
    }

    // Initialize sliders
    function initSliders() {
        if (rangeMin && rangeMax && minPrice && maxPrice && progress) {
            rangeMin.value = 0;
            rangeMax.value = 100000;
            minPrice.value = '';
            maxPrice.value = '';
            updateProgress();
        }
    }

    function updateProgress() {
        if (progress && rangeMin && rangeMax) {
            const minVal = parseInt(rangeMin.value);
            const maxVal = parseInt(rangeMax.value);
            progress.style.left = (minVal / rangeMin.max) * 100 + '%';
            progress.style.right = 100 - (maxVal / rangeMax.max) * 100 + '%';
        }
    }

    // Apply filters
    function applyFilters() {
        if (!hasActiveFilters()) {
            if (filtersApplied && errorMessage) {
                errorMessage.textContent = 'Фильтры не выбраны';
                errorMessage.style.display = 'block';
            }
            return;
        }
        
        if (errorMessage) errorMessage.style.display = 'none';
        filtersApplied = true;
        
        const minPriceValue = minPrice ? (minPrice.value === '' ? 0 : parseInt(minPrice.value)) : 0;
        const maxPriceValue = maxPrice ? (maxPrice.value === '' ? 100000 : parseInt(maxPrice.value)) : 100000;
        
        const selectedCategories = Array.from(
            document.querySelectorAll('input[name="category"]:checked') || []
        ).map(el => el.value);
        
        const selectedRatings = Array.from(
            document.querySelectorAll('input[name="rating"]:checked') || []
        ).map(el => parseInt(el.value));
        
        const selectedDeliveries = Array.from(
            document.querySelectorAll('input[name="delivery"]:checked') || []
        ).map(el => el.value);
        
        document.querySelectorAll('.product-card').forEach(card => {
            const price = parseInt(card.dataset.price);
            const category = card.dataset.category;
            const rating = parseInt(card.querySelector('.product-rating').textContent.match(/\(([0-9]+)\)/)[1]);
            const delivery = card.dataset.delivery.split(' ');
            
            const priceMatch = price >= minPriceValue && price <= maxPriceValue;
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(r => rating >= r);
            const deliveryMatch = selectedDeliveries.length === 0 || selectedDeliveries.some(d => delivery.includes(d));
            
            card.style.display = (priceMatch && categoryMatch && ratingMatch && deliveryMatch) ? 'block' : 'none';
        });
    }

    // Check active filters
    function hasActiveFilters() {
        // Check price inputs
        if (minPrice && maxPrice) {
            if (minPrice.value !== '' || maxPrice.value !== '') {
                return true;
            }
        }
        // Check checkbox selections
        const categoryChecked = document.querySelectorAll('input[name="category"]:checked')?.length > 0;
        const ratingChecked = document.querySelectorAll('input[name="rating"]:checked')?.length > 0;
        const deliveryChecked = document.querySelectorAll('input[name="delivery"]:checked')?.length > 0;
        return categoryChecked || ratingChecked || deliveryChecked;
    }

    // Event listeners
    if (rangeMin) rangeMin.addEventListener('input', function() {
        if (parseInt(rangeMax.value) - parseInt(rangeMin.value) < priceGap) {
            rangeMin.value = parseInt(rangeMax.value) - priceGap;
        }
        if (minPrice) minPrice.value = rangeMin.value === '0' ? '' : rangeMin.value;
        updateProgress();
    });

    if (rangeMax) rangeMax.addEventListener('input', function() {
        if (parseInt(rangeMax.value) - parseInt(rangeMin.value) < priceGap) {
            rangeMax.value = parseInt(rangeMin.value) + priceGap;
        }
        if (maxPrice) maxPrice.value = rangeMax.value === '100000' ? '' : rangeMax.value;
        updateProgress();
    });

    if (minPrice) minPrice.addEventListener('input', function() {
        let minVal = minPrice.value === '' ? 0 : parseInt(minPrice.value);
        const maxVal = maxPrice ? (maxPrice.value === '' ? 100000 : parseInt(maxPrice.value)) : 100000;
        if (isNaN(minVal)) minVal = 0;
        if (minVal < 0) minVal = 0;
        if (minVal > 100000) minVal = 100000;
        if (maxVal - minVal < priceGap) minVal = maxVal - priceGap;
        if (rangeMin) rangeMin.value = minVal;
        minPrice.value = minVal === 0 ? '' : minVal;
        updateProgress();
    });

    if (maxPrice) maxPrice.addEventListener('input', function() {
        const minVal = minPrice ? (minPrice.value === '' ? 0 : parseInt(minPrice.value)) : 0;
        let maxVal = maxPrice.value === '' ? 100000 : parseInt(maxPrice.value);
        if (isNaN(maxVal)) maxVal = 100000;
        if (maxVal < 0) maxVal = 0;
        if (maxVal > 100000) maxVal = 100000;
        if (maxVal - minVal < priceGap) maxVal = minVal + priceGap;
        if (rangeMax) rangeMax.value = maxVal;
        maxPrice.value = maxVal === 100000 ? '' : maxVal;
        updateProgress();
    });

    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', function() {
        initSliders();
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        document.querySelectorAll('.product-card').forEach(card => card.style.display = 'block');
        if (errorMessage) errorMessage.style.display = 'none';
        filtersApplied = false;
    });

    // Initialize based on page
    initSliders();
    if (document.querySelector('.products')) initProductsPage();
    renderCart();
    handleRedirects();
});