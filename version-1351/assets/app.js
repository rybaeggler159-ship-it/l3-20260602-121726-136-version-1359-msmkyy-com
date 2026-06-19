(function() {
    var navButton = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');
    if (navButton && navMenu) {
        navButton.addEventListener('click', function() {
            navMenu.classList.toggle('open');
            navButton.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var show = function(index) {
            current = index;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === index);
            });
        };
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function() {
                show((current + 1) % slides.length);
            }, 5600);
        }
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterYear = document.querySelector('[data-filter-year]');
    var filterType = document.querySelector('[data-filter-type]');
    var filterScope = document.querySelector('[data-filter-scope]');
    var filterEmpty = document.querySelector('[data-filter-empty]');
    if (filterScope) {
        var cards = Array.prototype.slice.call(filterScope.querySelectorAll('[data-card]'));
        var applyFilter = function() {
            var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
            var year = filterYear ? filterYear.value : '';
            var type = filterType ? filterType.value : '';
            var visible = 0;
            cards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-type') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                var ok = true;
                if (q && text.indexOf(q) === -1) {
                    ok = false;
                }
                if (year && (card.getAttribute('data-year') || '') !== year) {
                    ok = false;
                }
                if (type && (card.getAttribute('data-type') || '').indexOf(type) === -1) {
                    ok = false;
                }
                card.classList.toggle('hidden-card', !ok);
                if (ok) {
                    visible += 1;
                }
            });
            if (filterEmpty) {
                filterEmpty.classList.toggle('show', visible === 0);
            }
        };
        [filterInput, filterYear, filterType].forEach(function(el) {
            if (el) {
                el.addEventListener('input', applyFilter);
                el.addEventListener('change', applyFilter);
            }
        });
    }
})();

function initPlayer(videoId, overlayId, sourceUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !overlay || !sourceUrl) {
        return;
    }
    var attached = false;
    var bind = function() {
        if (attached) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
        } else {
            video.src = sourceUrl;
        }
        video.setAttribute('controls', 'controls');
        attached = true;
    };
    var start = function() {
        bind();
        overlay.classList.add('hidden');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function() {});
        }
    };
    overlay.addEventListener('click', start);
    video.addEventListener('click', function() {
        if (video.paused) {
            start();
        }
    });
}
