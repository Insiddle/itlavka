document.addEventListener('DOMContentLoaded', async () => {
    const authMessage = document.getElementById('authMessage');
    const profileContent = document.getElementById('profileContent');

    const isAuthenticated = await checkSession();
    if (!isAuthenticated) {
        authMessage.style.display = 'block';
        profileContent.style.display = 'none';
        return;
    }

    authMessage.style.display = 'none';
    profileContent.style.display = 'block';

    try {
        const response = await fetch('http://itlavka.free.nf/api/get_profile.php', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Ошибка загрузки профиля');
        }

        const userData = await response.json();

        document.getElementById('first_name').value = userData.data.first_name || '';
        document.getElementById('last_name').value = userData.data.last_name || '';
        document.getElementById('email').value = userData.data.email || '';
        document.getElementById('phone_number').value = userData.data.phone_number || '';

        if (userData.data.address) {
            document.getElementById('city').value = userData.data.address.city || '';
            document.getElementById('street').value = userData.data.address.street || '';
            document.getElementById('house_number').value = userData.data.address.house_number || '';
            document.getElementById('appartment_number').value = userData.data.address.appartment_number || '';
            document.getElementById('postal_code').value = userData.data.address.postal_code || '';
        }
    } catch (error) {
        console.error('Profile error:', error);
        alert(error.message || 'Ошибка загрузки профиля');
        authMessage.style.display = 'block';
        profileContent.style.display = 'none';
    }

    document.getElementById('profileForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
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
            const response = await fetch('http://itlavka.free.nf/api/update_profile.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Ошибка обновления профиля');
            }

            const result = await response.json();
            alert(result.message || 'Профиль успешно обновлен');
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.message || 'Ошибка обновления профиля');
        }
    });
});

    const logoimg = document.querySelector('.logoimg');
    if (logoimg) {
        logoimg.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
    });
};

async function checkSession() {
    try {
        const response = await fetch('http://itlavka.free.nf/api/check_session.php', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
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