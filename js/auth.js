let isLoginMode = true;

const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const submitBtn = document.getElementById('auth-submit-btn');
const toggleBtn = document.getElementById('auth-toggle-btn');
const usernameInput = document.getElementById('auth-username');
const passwordInput = document.getElementById('auth-password');
const errorText = document.getElementById('auth-error');

toggleBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? "Tizimga kirish" : "Ro'yxatdan o'tish";
    submitBtn.textContent = isLoginMode ? "Kirish" : "Ro'yxatdan o'tish";
    toggleBtn.textContent = isLoginMode ? "Yangimisiz? Ro'yxatdan o'tish" : "Akkauntingiz bormi? Kirish";
    errorText.classList.add('hidden');
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorText.classList.add('hidden');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    submitBtn.textContent = "Kutib turing...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, isLogin: isLoginMode })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        localStorage.setItem('zakovatUser', JSON.stringify(data.user));
        window.currentUser = data.user;
        checkAuthState();
        
        window.showToast(data.message);
        window.navigate('quizzes');
        usernameInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        errorText.textContent = error.message;
        errorText.classList.remove('hidden');
    } finally {
        submitBtn.textContent = isLoginMode ? "Kirish" : "Ro'yxatdan o'tish";
        submitBtn.disabled = false;
    }
});

function checkAuthState() {
    const savedUser = localStorage.getItem('zakovatUser');
    const loginBtn = document.getElementById('nav-auth-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const adminBtn = document.getElementById('nav-admin-btn');

    if (savedUser) {
        window.currentUser = JSON.parse(savedUser);
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        if (window.currentUser.role === 'admin') adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');
    } else {
        window.currentUser = null;
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        adminBtn.classList.add('hidden');
    }
}

document.getElementById('nav-logout-btn').addEventListener('click', () => {
    localStorage.removeItem('zakovatUser');
    checkAuthState();
    window.showToast("Tizimdan chiqdingiz");
    window.navigate('home');
});

document.addEventListener('DOMContentLoaded', checkAuthState);