(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    function nextSlide() {
        showSlide(current + 1);
    }

    function resetTimer() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(nextSlide, 5200);
        }
    }

    var nextButton = document.querySelector('[data-hero-next]');
    var prevButton = document.querySelector('[data-hero-prev]');

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            nextSlide();
            resetTimer();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            showSlide(current - 1);
            resetTimer();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            resetTimer();
        });
    });

    resetTimer();

    var filterInput = document.querySelector('[data-filter-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    function applyFilter() {
        if (!filterInput) {
            return;
        }
        var keyword = filterInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
            var text = card.getAttribute('data-search') || card.textContent.toLowerCase();
            card.style.display = text.indexOf(keyword) === -1 ? 'none' : '';
        });
    }

    if (filterInput) {
        if (filterInput.hasAttribute('data-url-query')) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                filterInput.value = q;
            }
        }
        filterInput.addEventListener('input', applyFilter);
        applyFilter();
    }
})();
