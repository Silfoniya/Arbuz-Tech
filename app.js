document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
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

    // Инициализация ползунков
    function initSliders() {
        rangeMin.value = 0;
        rangeMax.value = 10000;
        minPrice.value = '';
        maxPrice.value = '';
        updateProgress();
    }

    function updateProgress() {
        const minVal = parseInt(rangeMin.value);
        const maxVal = parseInt(rangeMax.value);
        
        progress.style.left = (minVal / rangeMin.max) * 100 + '%';
        progress.style.right = 100 - (maxVal / rangeMax.max) * 100 + '%';
    }

    // Обработчики для ползунков
    rangeMin.addEventListener('input', function() {
        if (parseInt(rangeMax.value) - parseInt(rangeMin.value) < priceGap) {
            rangeMin.value = parseInt(rangeMax.value) - priceGap;
        }
        minPrice.value = rangeMin.value === '0' ? '' : rangeMin.value;
        updateProgress();
    });
    
    rangeMax.addEventListener('input', function() {
        if (parseInt(rangeMax.value) - parseInt(rangeMin.value) < priceGap) {
            rangeMax.value = parseInt(rangeMin.value) + priceGap;
        }
        maxPrice.value = rangeMax.value === '10000' ? '' : rangeMax.value;
        updateProgress();
    });

    // Обработчики для полей ввода
    minPrice.addEventListener('input', function() {
        let minVal = minPrice.value === '' ? 0 : parseInt(minPrice.value);
        const maxVal = maxPrice.value === '' ? 10000 : parseInt(maxPrice.value);
        
        if (isNaN(minVal)) minVal = 0;
        if (minVal < 0) minVal = 0;
        if (minVal > 10000) minVal = 10000;
        if (maxVal - minVal < priceGap) minVal = maxVal - priceGap;
        
        rangeMin.value = minVal;
        minPrice.value = minVal === 0 ? '' : minVal;
        updateProgress();
    });
    
    maxPrice.addEventListener('input', function() {
        const minVal = minPrice.value === '' ? 0 : parseInt(minPrice.value);
        let maxVal = maxPrice.value === '' ? 10000 : parseInt(maxPrice.value);
        
        if (isNaN(maxVal)) maxVal = 10000;
        if (maxVal < 0) maxVal = 0;
        if (maxVal > 10000) maxVal = 10000;
        if (maxVal - minVal < priceGap) maxVal = minVal + priceGap;
        
        rangeMax.value = maxVal;
        maxPrice.value = maxVal === 10000 ? '' : maxVal;
        updateProgress();
    });

    // Проверка активных фильтров
    function hasActiveFilters() {
        if (minPrice.value !== '' || maxPrice.value !== '') return true;
        if (document.querySelectorAll('input[name="category"]:checked').length > 0) return true;
        if (document.querySelectorAll('input[name="rating"]:checked').length > 0) return true;
        if (document.querySelectorAll('input[name="delivery"]:checked').length > 0) return true;
        return false;
    }

    // Применение фильтров
    applyBtn.addEventListener('click', function () {
  if (!hasActiveFilters()) {
    if (filtersApplied) {
      errorMessage.textContent = 'Фильтры не выбраны';
      errorMessage.style.display = 'block';
    }
    return;
  }

  errorMessage.style.display = 'none';
  filtersApplied = true;

  const minPriceValue = minPrice.value === '' ? 0 : parseInt(minPrice.value);
  const maxPriceValue = maxPrice.value === '' ? 10000 : parseInt(maxPrice.value);

  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
  const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(el => parseInt(el.value));
  const selectedDeliveries = Array.from(document.querySelectorAll('input[name="delivery"]:checked')).map(el => el.value);

  document.querySelectorAll('.product-card').forEach(card => {
    const price = parseInt(card.dataset.price);
    const category = card.dataset.category;
    const delivery = card.dataset.delivery.split(' ');

    let rating = 0;
    const ratingElement = card.querySelector('.product-rating');
    if (ratingElement) {
      const match = ratingElement.textContent.match(/\((\d+(?:\.\d+)?)\)/);
      if (match) {
        rating = Math.floor(parseFloat(match[1]));
      }
    }

    const priceMatch = price >= minPriceValue && price <= maxPriceValue;
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(r => rating >= r);
    const deliveryMatch = selectedDeliveries.length === 0 || selectedDeliveries.some(d => delivery.includes(d));

    card.style.display = (priceMatch && categoryMatch && ratingMatch && deliveryMatch) ? 'block' : 'none';
  });
});


    // Сброс фильтров
    resetBtn.addEventListener('click', function() {
        initSliders();
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'block';
        });
        errorMessage.style.display = 'none';
        filtersApplied = false;
    });

    // Инициализация
    initSliders();
});

document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      const productId = productCard.dataset.id;
      const productTitle = productCard.dataset.title;
      const productPrice = parseFloat(productCard.dataset.price);

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingProduct = cart.find(item => item.id === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({
          id: productId,
          title: productTitle,
          price: productPrice,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      showNotification('Товар добавлен в корзину!');
    });
  });

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('cart-notification');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }
});
