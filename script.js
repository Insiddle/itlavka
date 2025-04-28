const registerButton = document.getElementById('registerButton');
const modalReg = document.getElementById('registrationModal');
const modalLog = document.getElementById('loginModal');
const closeBtnReg = document.querySelector('.close-registration');
const closeBtnLog = document.querySelector('.close-login');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const successMessage = document.querySelector('.successMessage');
const btnenter = document.getElementById('btnenter');

btnenter.addEventListener('click', function(e) {
    e.preventDefault();
    loginModal.style.display = 'block';
});


registerButton.addEventListener('click', () => {
    modalReg.style.display = 'block';
    modalLog.style.display = 'none';
});

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
        const response = await fetch('http://localhost/project123/api/register.php', {
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
        loginModal.style.display = 'block';
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка. Попробуйте позже.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    const prevArrow = document.querySelector('.arrow.prev');
    const nextArrow = document.querySelector('.arrow.next');
    let currentSlide = 0;

    if (slides.length === 0 || dots.length === 0) {
        console.error("Слайды или точки не найдены в DOM.");
    } else {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function autoSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        showSlide(currentSlide);

        setInterval(autoSlide, 10000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        prevArrow.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextArrow.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }
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

const API_BASE_URL = 'http://localhost/project123/api';

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

function updateUIAfterLogin() {
    const registerButton = document.getElementById('registerButton');
    const userInfo = document.getElementById('user-info');

    if (registerButton && userInfo) {
        registerButton.style.display = 'none';
        userInfo.style.visibility = 'visible';
    }
}

const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', async () => {
    try {
        await fetch('http://localhost/project123/api/logout.php', {
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

const userInfo = document.getElementById('user-info');

userInfo.addEventListener('click', (event) => {
    event.stopPropagation();
    userInfo.classList.toggle('active');
});

document.addEventListener('click', () => {
    userInfo.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const katalogCard = document.getElementById('katalog-tovarov');

    if (katalogCard) {
        katalogCard.addEventListener('click', () => {
            window.location.href = 'katalog.html';
        });
    }
});

const profile = document.getElementById('profile');

profile.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

const cart = document.getElementById('cart')

cart.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const subscriptionForm = document.getElementById('subscriptionForm');
    const subscriptionMessage = document.getElementById('subscriptionMessage');

    if (subscriptionForm && subscriptionMessage) {
        subscriptionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                await emailjs.send('service_azvtiai', 'template_mihs04l', {
                    user_name: document.getElementById('name').value,
                    user_email: document.getElementById('subscremail').value,
                });

                showMessage('Вы успешно подписались на рассылку!', false);
                subscriptionForm.reset();
            } catch (error) {
                showMessage('Ошибка при отправке письма.', true);
            }
        });
    }

    function showMessage(message, isError = false) {
        subscriptionMessage.textContent = message;
        subscriptionMessage.classList.toggle('error', isError);
        subscriptionMessage.style.display = 'block';

        setTimeout(() => {
            subscriptionMessage.style.display = 'none';
        }, 5000);
    }
});

async function checkSession() {
    try {
        const response = await fetch('http://localhost/project123/api/check_session.php', {
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

document.addEventListener('DOMContentLoaded', () => {
    const bannerImages = document.querySelectorAll('.banner-slide img');

    bannerImages.forEach(banner => {
        banner.addEventListener('click', () => {
            const productName = banner.id;
            if (productName) {
                localStorage.setItem('highlightProduct', productName);
                window.location.href = 'katalog.html';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const brandLogos = document.querySelectorAll('.brands img');

    brandLogos.forEach(logo => {
        logo.addEventListener('click', () => {
            const brandName = logo.alt;
            if (brandName) {
                localStorage.setItem('highlightBrand', brandName);
                window.location.href = 'katalog.html';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const akciiCard = document.getElementById('akcii');

    akciiCard.addEventListener('click', () => {
        localStorage.setItem('showDiscountProducts', 'true');
        window.location.href = 'katalog.html';
    });
});