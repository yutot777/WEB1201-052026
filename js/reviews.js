document.addEventListener('DOMContentLoaded', () => {

    const reviewUserDisplay = document.getElementById('review-user-display');
    const loginWarning = document.getElementById('login-warning');
    const navLoginBtn = document.getElementById('nav-login-button');
    const stars = document.querySelectorAll('.star');
    const reviewText = document.getElementById('review-text');
    const charCounter = document.getElementById('char-counter');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    let selectedRating = 0;
    let currentUsername = 'Guest';

    // Default mock reviews to display initially
    const initialReviews = [
        {
            username: 'Vimesh',
            rating: 5,
            text: 'Awesome catalogue! Love the Artcore selection.',
            date: '2026-08-01'
        },
        {
            username: 'Ding Tze Jian(DJ Tomato)',
            rating: 5,
            text: 'This is the peak!',
            date: '2026-08-03'
        }
    ];

    // 1. Check logged in user state
    function checkUserSession() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            currentUsername = user.username;
            reviewUserDisplay.value = currentUsername;
            loginWarning.classList.add('hidden');

            if (navLoginBtn) {
                navLoginBtn.textContent = `PROFILE (${user.username})`;
            }
        } else {
            currentUsername = 'Guest';
            reviewUserDisplay.value = 'Guest';
            loginWarning.classList.remove('hidden');
        }
    }

    // 2. Interactive Star Rating System
    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.getAttribute('data-value'));
            highlightStars(val, 'hovered');
        });

        star.addEventListener('mouseout', () => {
            clearStars('hovered');
        });

        // Click selection
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-value'));
            highlightStars(selectedRating, 'selected');
            document.getElementById('err-rating').textContent = '';
        });
    });

    function highlightStars(rating, className) {
        stars.forEach(star => {
            const val = parseInt(star.getAttribute('data-value'));
            if (val <= rating) {
                star.classList.add(className);
            } else if (className === 'hovered') {
                star.classList.remove(className);
            } else if (className === 'selected') {
                star.classList.remove('selected');
            }
        });
    }

    function clearStars(className) {
        stars.forEach(star => star.classList.remove(className));
    }

    // 3. Real-time Character Counter
    reviewText.addEventListener('input', () => {
        const count = reviewText.value.length;
        charCounter.textContent = `${count} / 300`;
        document.getElementById('err-text').textContent = '';
    });

    // 4. Fetch stored reviews or initialize default ones
    function getStoredReviews() {
        const saved = localStorage.getItem('appReviews');
        if (saved) {
            return JSON.parse(saved);
        } else {
            localStorage.setItem('appReviews', JSON.stringify(initialReviews));
            return initialReviews;
        }
    }

    // Render reviews on page
    function renderReviews() {
        const reviews = getStoredReviews();
        reviewsList.innerHTML = '';

        reviews.forEach(review => {
            const card = document.createElement('article');
            card.className = 'review-card';

            const starString = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

            card.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${escapeHTML(review.username)}</span>
                    <span class="review-stars">${starString}</span>
                </div>
                <div class="review-body">${escapeHTML(review.text)}</div>
                <div class="review-date">Posted on ${review.date}</div>
            `;

            reviewsList.appendChild(card);
        });
    }

    // Sanitize user inputs against HTML injection
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // 5. Submit Form Handler
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        document.getElementById('err-rating').textContent = '';
        document.getElementById('err-text').textContent = '';

        if (selectedRating === 0) {
            document.getElementById('err-rating').textContent = 'Please select a star rating.';
            valid = false;
        }

        const textValue = reviewText.value.trim();
        if (textValue.length < 5) {
            document.getElementById('err-text').textContent = 'Please write at least 5 characters.';
            valid = false;
        }

        if (valid) {
            const today = new Date().toISOString().split('T')[0];

            const newReview = {
                username: currentUsername,
                rating: selectedRating,
                text: textValue,
                date: today
            };

            // Save to localStorage array
            const reviews = getStoredReviews();
            reviews.unshift(newReview); // Add newest first
            localStorage.setItem('appReviews', JSON.stringify(reviews));

            // Reset form UI
            reviewText.value = '';
            charCounter.textContent = '0 / 300';
            selectedRating = 0;
            clearStars('selected');

            // Refresh reviews feed
            renderReviews();
        }
    });

    // Run setup on load
    checkUserSession();
    renderReviews();
});
