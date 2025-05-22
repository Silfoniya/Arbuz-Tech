document.addEventListener('DOMContentLoaded', () => {
  const cartList = document.getElementById('cart-list'); // Список товаров
  const cartTotal = document.getElementById('cart-total'); // Итоговая сумма

  // Получаем корзину из localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Если корзина пуста
  if (cart.length === 0) {
    cartList.innerHTML = '<p>Корзина пуста</p>';
    cartTotal.textContent = '0';
    return;
  }

  // Отображаем товары в корзине
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;

    // Создаем отдельный блок для каждого товара
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
      <span>${item.title}</span>
      <span>${item.price} ₽ x ${item.quantity}</span>
      <button class="remove-btn" data-id="${item.id}">Удалить</button>
    `;
    cartList.appendChild(productDiv);
  });

  // Обновляем итоговую сумму
  cartTotal.textContent = total;

  // Удаление товара из корзины
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;

      // Удаляем товар из корзины
      const updatedCart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Перезагружаем корзину
      location.reload();
    });
  });
});