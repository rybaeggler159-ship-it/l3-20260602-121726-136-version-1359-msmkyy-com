(function() {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var nextButton = hero.querySelector('[data-hero-next]');
        var prevButton = hero.querySelector('[data-hero-prev]');
        var dotsWrap = hero.querySelector('[data-hero-dots]');
        var index = 0;
        var timer = null;

        function render() {
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            if (dotsWrap) {
                Array.prototype.slice.call(dotsWrap.children).forEach(function(dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            }
        }

        function go(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            render();
        }

        if (dotsWrap) {
            slides.forEach(function(_, i) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', '切换推荐影片 ' + (i + 1));
                dot.addEventListener('click', function() {
                    go(i);
                    restart();
                });
                dotsWrap.appendChild(dot);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', function() {
                go(index + 1);
                restart();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', function() {
                go(index - 1);
                restart();
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                go(index + 1);
            }, 5000);
        }

        render();
        restart();
    }

    var panels = document.querySelectorAll('[data-filter-panel]');
    panels.forEach(function(panel) {
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-year-filter]');
        var type = panel.querySelector('[data-type-filter]');
        var list = document.querySelector('[data-filter-list]');
        var count = document.querySelector('[data-result-count]');
        var params = new URLSearchParams(window.location.search);

        if (input && params.get('q')) {
            input.value = params.get('q');
        }

        function applyFilter() {
            if (!list) {
                return;
            }
            var query = input ? input.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var typeValue = type ? type.value : '';
            var visible = 0;
            Array.prototype.slice.call(list.querySelectorAll('.movie-card')).forEach(function(card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var cardType = card.getAttribute('data-type') || '';
                var match = true;
                if (query && text.indexOf(query) === -1) {
                    match = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    match = false;
                }
                if (typeValue && cardType !== typeValue) {
                    match = false;
                }
                card.classList.toggle('hidden-by-filter', !match);
                if (match) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = visible + ' 部影片';
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }
        if (year) {
            year.addEventListener('change', applyFilter);
        }
        if (type) {
            type.addEventListener('change', applyFilter);
        }
        applyFilter();
    });
}());
