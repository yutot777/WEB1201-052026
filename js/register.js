document.addEventListener('DOMContentLoaded', () => {

    // --- Tab Switching ---
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const registerSection = document.getElementById('register-section');
    const loginSection = document.getElementById('login-section');
    const profileSection = document.getElementById('profile-section');

    tabRegisterBtn.addEventListener('click', () => {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
    });

    tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
    });

    // --- Multi-Step Registration Logic ---
    let currentStep = 1;

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    const node1 = document.getElementById('node-1');
    const node2 = document.getElementById('node-2');
    const node3 = document.getElementById('node-3');
    const progressBar = document.getElementById('progress-bar');

    // Navigation Buttons
    document.getElementById('next-1').addEventListener('click', () => {
        if (validateStep1()) {
            goToStep(2);
        }
    });

    document.getElementById('prev-2').addEventListener('click', () => goToStep(1));

    document.getElementById('next-2').addEventListener('click', () => {
        if (validateStep2()) {
            goToStep(3);
        }
    });

    document.getElementById('prev-3').addEventListener('click', () => goToStep(2));

    function goToStep(step) {
        currentStep = step;

        step1.classList.toggle('active-step', step === 1);
        step2.classList.toggle('active-step', step === 2);
        step3.classList.toggle('active-step', step === 3);

        node1.classList.toggle('active', step >= 1);
        node2.classList.toggle('active', step >= 2);
        node3.classList.toggle('active', step >= 3);

        if (step === 1) progressBar.style.width = '33%';
        if (step === 2) progressBar.style.width = '66%';
        if (step === 3) progressBar.style.width = '100%';
    }

    // Helpers to access stored users list
    function getUsersList() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    function saveUsersList(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // --- Validation Functions ---
    function validateStep1() {
        let valid = true;
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        document.getElementById('err-username').textContent = '';
        document.getElementById('err-email').textContent = '';
        document.getElementById('err-password').textContent = '';

        const users = getUsersList();

        if (username.length < 3) {
            document.getElementById('err-username').textContent = 'Username must be at least 3 characters.';
            valid = false;
        } else if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            document.getElementById('err-username').textContent = 'This username is already registered.';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('err-email').textContent = 'Please enter a valid email address.';
            valid = false;
        } else if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            document.getElementById('err-email').textContent = 'This email is already registered.';
            valid = false;
        }

        if (password.length < 6) {
            document.getElementById('err-password').textContent = 'Password must be at least 6 characters.';
            valid = false;
        }

        return valid;
    }

    function validateStep2() {
        let valid = true;
        const fullname = document.getElementById('reg-fullname').value.trim();
        const dob = document.getElementById('reg-dob').value;

        document.getElementById('err-fullname').textContent = '';
        document.getElementById('err-dob').textContent = '';

        if (fullname.length < 2) {
            document.getElementById('err-fullname').textContent = 'Please enter your full name.';
            valid = false;
        }

        if (!dob) {
            document.getElementById('err-dob').textContent = 'Please select your date of birth.';
            valid = false;
        }

        return valid;
    }

    function validateStep3() {
        let valid = true;
        const genre = document.getElementById('reg-genre').value;
        const terms = document.getElementById('reg-terms').checked;

        document.getElementById('err-genre').textContent = '';
        document.getElementById('err-terms').textContent = '';

        if (!genre) {
            document.getElementById('err-genre').textContent = 'Please select a favorite genre.';
            valid = false;
        }

        if (!terms) {
            document.getElementById('err-terms').textContent = 'You must agree to the terms.';
            valid = false;
        }

        return valid;
    }

    // --- Submit Registration ---
    document.getElementById('multi-step-form').addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateStep3()) {
            const newUser = {
                username: document.getElementById('reg-username').value.trim(),
                email: document.getElementById('reg-email').value.trim(),
                password: document.getElementById('reg-password').value.trim(),
                fullname: document.getElementById('reg-fullname').value.trim(),
                dob: document.getElementById('reg-dob').value,
                genre: document.getElementById('reg-genre').value
            };

            // 1. Add new user to stored registered accounts list
            const users = getUsersList();
            users.push(newUser);
            saveUsersList(users);

            // 2. Set current active session
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            alert('Registration Successful!');
            checkLoginSession();
        }
    });

    // --- Login Form Logic ---
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const loginInput = document.getElementById('login-username').value.trim();
        const loginPass = document.getElementById('login-password').value.trim();

        document.getElementById('err-login-user').textContent = '';
        document.getElementById('err-login-pass').textContent = '';

        if (!loginInput) {
            document.getElementById('err-login-user').textContent = 'Please enter username or email.';
            return;
        }
        if (!loginPass) {
            document.getElementById('err-login-pass').textContent = 'Please enter password.';
            return;
        }

        // Fetch accounts array
        const users = getUsersList();

        // Find user matching username or email
        const matchedUser = users.find(u => 
            u.username.toLowerCase() === loginInput.toLowerCase() || 
            u.email.toLowerCase() === loginInput.toLowerCase()
        );

        if (!matchedUser) {
            document.getElementById('err-login-user').textContent = 'No account found with this username/email.';
            return;
        }

        if (matchedUser.password !== loginPass) {
            document.getElementById('err-login-pass').textContent = 'Incorrect password.';
            return;
        }

        // Login successful
        localStorage.setItem('currentUser', JSON.stringify(matchedUser));
        alert('Login Successful!');
        checkLoginSession();
    });

    // --- Check Active Session ---
    function checkLoginSession() {
        const storedUser = localStorage.getItem('currentUser');

        if (storedUser) {
            const user = JSON.parse(storedUser);

            registerSection.classList.add('hidden');
            loginSection.classList.add('hidden');
            profileSection.classList.remove('hidden');

            const authTabs = document.querySelector('.auth-tabs');
            if (authTabs) authTabs.style.display = 'none';

            document.getElementById('prof-username').textContent = user.username;
            document.getElementById('prof-email').textContent = user.email;
            document.getElementById('prof-fullname').textContent = user.fullname || user.username;
            document.getElementById('prof-genre').textContent = user.genre || 'Not specified';

            const navLoginBtn = document.getElementById('nav-login-button');
            if (navLoginBtn) {
                navLoginBtn.textContent = `PROFILE (${user.username})`;
            }
        }
    }

    // --- Logout Action ---
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        location.reload();
    });

    // Run session check on page load
    checkLoginSession();
});
