let products = [
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
    { name: 'НАИМЕНОВАНИЕ', price: 12345, quantity: 1 },
  ];

  let discount = 0;
  let promoUsed = false;

  function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = '';
    products.forEach((product, index) => {
      list.innerHTML += 
        <div class="product">
          <span>${product.name}</span>
          <span>${product.price}₽</span>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
            <span>${product.quantity}</span>
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeProduct(${index})">Удалить</button>
        </div>
      ;
    });
    updateTotal();
  }

  function changeQty(index, delta) {
    products[index].quantity += delta;
    if (products[index].quantity < 1) {
      products[index].quantity = 1;
    }
    updateTotal();
    renderProducts();
  }

  function removeProduct(index) {
    products.splice(index, 1);
    updateTotal();
    renderProducts();
  }

function updateTotal() {
    const totalRaw = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = promoUsed ? Math.floor(totalRaw * 0.2) : 0;
    discount = totalDiscount;
    document.getElementById('total').innerText = (totalRaw - discount) + '₽';
    document.getElementById('discount').innerText = discount + '₽';
  }

  function applyPromo() {
    const input = document.getElementById('promoInput').value.trim();
    if (input === 'ARB2025' && !promoUsed) {
      promoUsed = true;
      updateTotal();
      alert('Промокод применён!');
    } else if (promoUsed) {
      alert('Промокод уже использован.');
    } else {
      alert('Неверный промокод.');
    }
  }

  function checkout() {
    const totalFinal = products.reduce((sum, p) => sum + p.price * p.quantity, 0) - discount;
    alert('Переход к оплате. Итоговая сумма: ' + totalFinal + '₽');
  }

  renderProducts();