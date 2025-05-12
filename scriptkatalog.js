const categoryData = {
    keyboards: ['Игровые', 'Механические', 'Беспроводные'],
    mouse: ['Игровые', 'Офисные', 'Беспроводные'],
    headphones: ['Накладные', 'Вкладные', 'Беспроводные'],
    microphones: ['Компьютерные', 'Студийные', 'Беспроводные'],
    monitors: ['Игровые', 'IPS', 'VA'],
    controllers: ['PlayStation', 'Xbox', 'Nintendo'],
    webcams: ['HD', 'Full HD', '4K'],
    accessories: ['Коврики', 'Подставки', 'Аксессуары'],
};

// Получаем элементы DOM
const menuItems = document.querySelectorAll('.menu-item');
const contents = document.querySelectorAll('.content-container');
const categoryButtonsContainer = document.querySelector('.category-buttons');

// Переменная для хранения текущей активной категории
let currentActiveCategory = null;

function activateMenuItem(targetId) {
    menuItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`[data-target="${targetId}"]`);
    if (activeItem) activeItem.classList.add('active');

    contents.forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById(targetId);
    if (targetContent) targetContent.classList.add('active');

    categoryButtonsContainer.innerHTML = '';
    currentActiveCategory = null;

    if (categoryData[targetId] && categoryData[targetId].length > 0) {
        categoryButtonsContainer.style.display = 'flex';
        categoryButtonsContainer.style.visibility = 'visible'; 
        
        // Создаем кнопку "Все" с иконкой стрелки
        const allButton = document.createElement('button');
        allButton.className = 'category-button all-button active';
        allButton.innerHTML = '&larr;'; // Используем символ стрелки влево
        allButton.title = 'Показать все товары'; // Добавляем подсказку
        allButton.addEventListener('click', () => {
            showAllProducts(targetId);
            setActiveButton(allButton);
            currentActiveCategory = null;
        });
        categoryButtonsContainer.appendChild(allButton);

        // Остальные кнопки категорий
        categoryData[targetId].forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;

            button.addEventListener('click', () => {
                if (currentActiveCategory === category) {
                    showAllProducts(targetId);
                    setActiveButton(allButton);
                    currentActiveCategory = null;
                } else {
                    filterProductsByCategory(targetId, category);
                    setActiveButton(button);
                    currentActiveCategory = category;
                }
            });

            categoryButtonsContainer.appendChild(button);
        });
    } else {
        categoryButtonsContainer.style.display = 'none';
    }
}

function filterProductsByCategory(contentId, category) {
    const contentContainer = document.getElementById(contentId);
    if (!contentContainer) return;

    const productType = contentId; // 'keyboards', 'mouse' и т.д.
    const productItems = contentContainer.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const itemCategory = item.dataset.category || '';
        const itemType = item.dataset.productType || '';
        
        if (itemCategory.includes(category) && itemType === productType) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Функция показа всех товаров
function showAllProducts(contentId) {
    const contentContainer = document.getElementById(contentId);
    if (!contentContainer) return;

    const productItems = contentContainer.querySelectorAll('.product-item');
    productItems.forEach(item => {
        item.style.display = 'flex';
    });
}

// Функция установки активной кнопки
function setActiveButton(button) {
    document.querySelectorAll('.category-button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

// Добавляем обработчики клика на пункты меню
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        activateMenuItem(targetId);
    });
});

// Активируем первый пункт меню при загрузке страницы
if (menuItems.length > 0) {
    const firstMenuItem = menuItems[0];
    const targetId = firstMenuItem.getAttribute('data-target');
    activateMenuItem(targetId);
}

activateMenuItem('keyboards');

const userInfo = document.getElementById('user-info');

userInfo.addEventListener('click', (event) => {
    event.stopPropagation();
    userInfo.classList.toggle('active');
});

document.addEventListener('click', () => {
    userInfo.classList.remove('active');
});


const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const modalReg = document.getElementById('registrationModal');
const modalLog = document.getElementById('loginModal');
const closeBtnReg = document.querySelector('.close-registration');
const closeBtnLog = document.querySelector('.close-login');

registerButton.addEventListener('click', () => {
    modalReg.style.display = 'block';
    modalLog.style.display = 'none';
});

if (loginButton) {
    loginButton.addEventListener('click', () => {
        modalLog.style.display = 'block';
        modalReg.style.display = 'none';
    });
}

closeBtnReg.addEventListener('click', () => {
    modalReg.style.display = 'none';
});

closeBtnLog.addEventListener('click', () => {
    modalLog.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modalReg) {
        modalReg.style.display = 'none';
    }
    if (event.target === modalLog) {
        modalLog.style.display = 'none';
    }
});

const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    registrationModal.style.display = 'none';
    loginModal.style.display = 'block';
});

showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'none';
    registrationModal.style.display = 'block';
});


function clearForm() {
    document.getElementById('first_name').value = '';
    document.getElementById('last_name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('phone_number').value = '';
    document.getElementById('city').value = '';
    document.getElementById('street').value = '';
    document.getElementById('house_number').value = '';
    document.getElementById('appartament_number').value = '';
    document.getElementById('postal_code').value = '';
}

document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone_number: document.getElementById('phone_number').value,
        address: {
            city: document.getElementById('city').value,
            street: document.getElementById('street').value,
            house_number: document.getElementById('house_number').value,
            appartment_number: document.getElementById('appartment_number').value,
            postal_code: document.getElementById('postal_code').value
        }
    };

    try {
        const response = await fetch('http://itlavka.free.nf/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при регистрации');
        }

        const result = await response.json();
        alert(result.message || 'Регистрация успешна!');
        modalReg.style.display = 'none';
    } catch (error) {
        alert('Произошла ошибка. Попробуйте позже.');
    }
});

document.getElementById('phone_number').addEventListener('keypress', function (event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
});

function formatPhone(input) {
    let numbers = input.value.replace(/\D/g, '');
    
    if (!numbers.startsWith('7') && numbers.length > 0) {
        numbers = '7' + numbers;
    }
    
    let formatted = '+7';
    if (numbers.length > 1) {
        formatted += ' (' + numbers.substring(1, 4);
    }
    if (numbers.length > 4) {
        formatted += ') ' + numbers.substring(4, 7);
    }
    if (numbers.length > 7) {
        formatted += '-' + numbers.substring(7, 9);
    }
    if (numbers.length > 9) {
        formatted += '-' + numbers.substring(9, 11);
    }
    
    input.value = formatted;
}

document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Изменено
    const registerButton = document.getElementById('registerButton');
    const userInfo = document.getElementById('user-info');
    if (isAuthenticated) {
        registerButton.style.display = 'none';
        userInfo.style.visibility = 'visible';
    } else {
        registerButton.style.display = 'block';
        userInfo.style.visibility = 'hidden';
    }
});


const API_BASE_URL = 'http://itlavka.free.nf/api';

// Обработчик отправки формы входа
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Формируем данные для отправки
    const formDataLogin = {
        email: document.getElementById('login_email').value,
        password: document.getElementById('login_password').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataLogin)
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Сервер вернул невалидный JSON: ' + responseText);
        }

        if (!response.ok) {
            throw new Error(result.message || 'Неверный email или пароль');
        }

        // Успешная авторизация
        localStorage.setItem('isAuthenticated', 'true');
        alert(result.message || 'Авторизация успешна!');
        document.getElementById('loginModal').style.display = 'none';
        updateUIAfterLogin();
    } catch (error) {
        console.error('Login error:', error.message);
        alert(error.message || 'Произошла ошибка. Попробуйте позже.');
    }
});

// Функция для обновления интерфейса после авторизации
function updateUIAfterLogin() {
    const registerButton = document.getElementById('registerButton');
    const userInfo = document.getElementById('user-info');

    if (registerButton && userInfo) {
        registerButton.style.display = 'none'; // Скрываем кнопку регистрации
        userInfo.style.visibility = 'visible'; // Показываем блок user-info
    }
}

// Обработчик выхода
const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', async () => {
    try {
        await fetch('http://itlavka.free.nf/api/logout.php', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
    localStorage.removeItem('isAuthenticated');
    const registerButton = document.getElementById('registerButton');
    const userInfo = document.getElementById('user-info');
    if (registerButton && userInfo) {
        registerButton.style.display = 'block';
        userInfo.style.display = 'none';
    }
    window.location.href = 'index.html';
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

const profile = document.getElementById('profile');

profile.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

const cart = document.getElementById('cart')

cart.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

const orders = document.getElementById('orders')

orders.addEventListener('click', () => {
    window.location.href = 'orders.html';
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar .icon-search');
    const searchBar = document.querySelector('.search-bar');
    const allProducts = document.querySelectorAll('.product-item');

    if (!searchInput || !searchBar) {
        console.error('Ошибка: .search-bar или .search-bar input не найдены');
        return;
    }
 
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results-dropdown';
    searchBar.appendChild(searchResultsContainer);

    function searchProducts() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm.length < 1) {
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.style.display = 'none';
            return;
        }

        let foundProducts = [];
        
        allProducts.forEach(product => {
            const productText = product.querySelector('.product-text');
            const productName = productText ? productText.textContent.toLowerCase() : '';
            const productCategory = product.getAttribute('data-category')?.toLowerCase() || '';
            const productType = product.getAttribute('data-product-type')?.toLowerCase() || '';
            
            if (productType === 'software') return;

            if (productName.includes(searchTerm) || 
                productCategory.includes(searchTerm) || 
                productType.includes(searchTerm)) {
                foundProducts.push({
                    name: productText.textContent,
                    category: productCategory,
                    type: productType,
                    element: product
                });
            }
        });

        displaySearchResults(foundProducts, searchTerm);
    }

    function displaySearchResults(products, searchTerm) {
        searchResultsContainer.innerHTML = '';
        
        if (products.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = `По запросу "${searchTerm}" ничего не найдено`;
            searchResultsContainer.appendChild(noResults);
            searchResultsContainer.style.display = 'block';
            return;
        }

        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.className = 'search-result-item';
            listItem.innerHTML = `
                <span>${product.name}</span>
                <small>(${product.category})</small>
            `;
            listItem.addEventListener('click', () => {
                activateMenuItem(product.type);

                showAllProducts(product.type);

                document.querySelectorAll('.product-item').forEach(item => {
                    item.classList.remove('highlighted');
                });
                product.element.classList.add('highlighted');
                setTimeout(() => {
                    product.element.classList.remove('highlighted');
                }, 1000);

                searchResultsContainer.style.display = 'none';
                searchInput.value = '';
            });
            resultsList.appendChild(listItem);
        });

        searchResultsContainer.appendChild(resultsList);
        searchResultsContainer.style.display = 'block';
    }

    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', searchProducts);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    if (searchIcon) {
        searchIcon.addEventListener('click', searchProducts);
    } else {
        console.warn('Иконка поиска не найдена');
    }
});
    
document.addEventListener('DOMContentLoaded', () => {
    const brandName = localStorage.getItem('highlightBrand');

    if (brandName) {
        setTimeout(() => {
            const allProducts = document.querySelectorAll('.product-item');
            let firstMatchingProduct = null;
            let firstCategory = null;

            allProducts.forEach(product => {
                const productText = product.querySelector('.product-text');
                if (productText && productText.textContent.includes(brandName)) {
                    if (!firstMatchingProduct) {
                        firstMatchingProduct = product;
                        firstCategory = product.getAttribute('data-product-type');
                    }
                }
            });

            if (firstMatchingProduct && firstCategory) {
                activateMenuItem(firstCategory);

                firstMatchingProduct.classList.add('highlighted');
                setTimeout(() => {
                    firstMatchingProduct.classList.remove('highlighted');
                }, 1000);
            } else {
                alert(`Товары бренда "${brandName}" не найдены.`);
            }

            localStorage.removeItem('highlightBrand');
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const showDiscountProducts = localStorage.getItem('showDiscountProducts');

    if (showDiscountProducts === 'true') {
        setTimeout(() => {
            const allProducts = document.querySelectorAll('.product-item');
            let hasDiscountProducts = false;

            allProducts.forEach(product => {
                const oldPrice = product.querySelector('.old-price');
                if (oldPrice) {
                    hasDiscountProducts = true;
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });

            if (!hasDiscountProducts) {
                alert('Акционные товары не найдены.');
            }

            localStorage.removeItem('showDiscountProducts');
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const productName = localStorage.getItem('highlightProduct');

    if (productName) {
        setTimeout(() => {
            const allProducts = document.querySelectorAll('.product-item');
            let hasMatchingProducts = false;

            allProducts.forEach(product => {
                const productText = product.querySelector('.product-text');
                if (productText && productText.textContent.includes(productName)) {
                    hasMatchingProducts = true;

                    const productType = product.getAttribute('data-product-type');
                    const productCategory = product.getAttribute('data-category');

                    activateMenuItem(productType, productCategory);

                    product.classList.add('highlighted');
                    setTimeout(() => {
                        product.classList.remove('highlighted');
                    }, 1000);
                }
            });

            if (!hasMatchingProducts) {
                alert(`Товар "${productName}" не найден.`);
            }

            localStorage.removeItem('highlightProduct');
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(button.dataset.productId);
        });
    });
});
 
async function checkSession() {
    try {
        const response = await fetch('http://itlavka.free.nf/api/check_session.php', {
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
        
        if (result.success && result.isAuthenticated) {
            localStorage.setItem('isAuthenticated', 'true');
            return true;
        } else {
            localStorage.removeItem('isAuthenticated');
            return false;
        }
        
    } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('isAuthenticated');
        return false;
    }
}

async function addToCart(productId) {
    try {
        const isAuth = await checkSession();
        
        if (!isAuth) {
            alert('Для добавления товаров в корзину необходимо авторизоваться');
            document.getElementById('loginModal').style.display = 'block';
            localStorage.setItem('pendingCartItem', productId);
            return;
        }

        const productItem = document.querySelector(`.product-button[data-product-id="${productId}"]`).closest('.product-item');
        const productName = productItem.querySelector('.product-text').textContent;
        
        const response = await fetch('http://itlavka.free.nf/api/cart.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Товар "${productName}" добавлен в корзину!`);
        } else {
            alert('Ошибка: ' + (result.error || 'Не удалось добавить товар'));
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Ошибка соединения с сервером');
    }
}