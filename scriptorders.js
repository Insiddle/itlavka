document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
        alert('Пожалуйста, авторизуйтесь');
        window.location.href = 'index.html';
        return;
    }

    const ordersList = document.getElementById('orders-list');

    async function loadOrders() {
        try {
            const response = await fetch('http://localhost/itlavka/api/orders.php', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                ordersList.innerHTML = '';
                if (result.data.length === 0) {
                    ordersList.innerHTML = '<p>У вас нет заказов</p>';
                    return;
                }
                result.data.forEach(order => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'cart-item';
                    orderItem.innerHTML = `
                        <div class="cart-item-details">
                            <h3>Заказ #${order.order_id}</h3>
                            <p>Дата: ${new Date(order.order_date).toLocaleDateString()}</p>
                            <p>Сумма: ${order.total_amount} ₽</p>
                            <p>Статус: ${order.status}</p>
                        </div>
                    `;
                    ordersList.appendChild(orderItem);
                });
            } else {
                ordersList.innerHTML = '<p>Ошибка загрузки заказов</p>';
            }
        } catch (error) {
            console.error('Load orders error:', error);
            ordersList.innerHTML = '<p>Ошибка загрузки заказов</p>';
        }
    }

    await loadOrders();
});

async function checkSession() {
    try {
        const response = await fetch('http://localhost/itlavka/api/check_session.php', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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

document.addEventListener('DOMContentLoaded', () => {
    const logoimg = document.querySelector('.logoimg');

    logoimg.addEventListener('click', (event) => {
        event.preventDefault();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    });
});