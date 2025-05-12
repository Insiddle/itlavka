const productImageMap = {
    '1': 'img/klava3.jpg',
    '2': 'img/klava2.jpg',
    '3': 'img/klava1.jpg',
    '4': 'img/mouse1.jpg',
    '5': 'img/mouse2.jpg',
    '6': 'img/mouse3.jpg',
    '7': 'img/headphones1.jpg',
    '8': 'img/headphones2.jpg',
    '9': 'img/headphones3.jpg',
    '10': 'img/mic1.jpg',
    '11': 'img/mic2.jpg',
    '12': 'img/mic3.jpg',
    '13': 'img/monitor1.jpg',
    '14': 'img/monitor2.jpg',
    '15': 'img/monitor3.jpg',
    '16': 'img/controller1.jpg',
    '17': 'img/controller2.jpg',
    '18': 'img/controller3.jpg',
    '19': 'img/webcam1.jpg',
    '20': 'img/webcam2.jpg',
    '21': 'img/webcam3.jpg',
    '22': 'img/accessory1.jpg',
    '23': 'img/accessory2.jpg',
    '24': 'img/accessory3.jpg'
};

async function checkSession() {
    try {
        const response = await fetch('http://itlavka.free.nf/api/check_session.php', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success && result.isAuthenticated;
        
    } catch (error) {
        console.error('Session check failed:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
        alert('Пожалуйста, авторизуйтесь');
        window.location.href = 'index.html';
        return;
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutButton = document.querySelector('.checkout-button');

    async function loadCart() {
        try {
            const response = await fetch('http://itlavka.free.nf/api/cart.php', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                cartItemsContainer.innerHTML = '';
                let total = 0;
                
                result.data.forEach(item => {
                    const price = item.price * item.quantity;
                    total += price;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.dataset.cartId = item.cart_id;
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${productImageMap[item.product_id] || 'img/default-product.jpg'}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>Цена: <span class="price">${item.price} ₽</span></p>
                            <p>Количество: <input type="number" value="${item.quantity}" min="1" class="quantity"></p>
                        </div>
                        <button class="remove-item">Удалить</button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                totalPriceElement.textContent = `${total.toFixed(2)} ₽`;
            } else {
                cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
                totalPriceElement.textContent = '0 ₽';
            }
        } catch (error) {
            console.error('Load cart error:', error);
            cartItemsContainer.innerHTML = '<p>Ошибка загрузки корзины</p>';
        }
    }
    

    cartItemsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            const cartId = cartItem.dataset.cartId;
            try {
                const response = await fetch('http://itlavka.free.nf/api/cart.php', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart_id: cartId })
                });
                const result = await response.json();
                if (result.success) {
                    await loadCart();
                } else {
                    alert(result.error || 'Ошибка удаления товара');
                }
            } catch (error) {
                console.error('Remove from cart error:', error);
                alert('Ошибка удаления товара');
            }
        }
    });

    cartItemsContainer.addEventListener('change', async (e) => {
        if (e.target.classList.contains('quantity')) {
            const cartItem = e.target.closest('.cart-item');
            const cartId = cartItem.dataset.cartId;
            const quantity = parseInt(e.target.value);
            if (quantity < 1) {
                e.target.value = 1;
                return;
            }
            try {
                const response = await fetch('http://itlavka.free.nf/api/cart.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart_id: cartId, quantity })
                });
                const result = await response.json();
                if (result.success) {
                    await loadCart();
                } else {
                    alert(result.error || 'Ошибка обновления количества');
                }
            } catch (error) {
                console.error('Update quantity error:', error);
                alert('Ошибка обновления количества');
            }
        }
    });

    checkoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://itlavka.free.nf/api/orders.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (result.success) {
                alert('Заказ оформлен!');
                await loadCart();
            } else {
                alert(result.error || 'Ошибка оформления заказа');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Ошибка оформления заказа');
        }
    });

    await loadCart();
});

document.addEventListener('DOMContentLoaded', () => {
    const logoimg = document.querySelector('.logoimg');

    logoimg.addEventListener('click', (event) => {
        event.preventDefault();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    });
});

const userInfo = document.getElementById('user-info');

userInfo.addEventListener('click', (event) => {
    event.stopPropagation();
    userInfo.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const orders = document.querySelector('.orders')

    if (btnorder) {
        btnorder.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'orders.html';
        });
    }

    if (orders) {
        orders.addEventListener('click', () => {
            window.location.href = 'orders.html';
        });
    }
});