(function () {
  function closestScope(element) {
    return element.closest('[data-filter-scope]');
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupNavigation() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    let active = 0;
    let timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function reset(index) {
      if (timer) {
        window.clearInterval(timer);
      }
      show(index);
      start();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        reset(index);
      });
    });

    show(0);
    start();
  }

  function matchYear(cardYear, rule) {
    const year = Number(cardYear || 0);
    if (rule === 'all') {
      return true;
    }
    if (rule === 'new') {
      return year >= 2020;
    }
    if (rule === 'twenty') {
      return year >= 2010 && year <= 2019;
    }
    if (rule === 'zero') {
      return year >= 2000 && year <= 2009;
    }
    if (rule === 'classic') {
      return year < 2000;
    }
    return true;
  }

  function filterCards(scope) {
    if (!scope) {
      return;
    }
    const queryInput = scope.querySelector('[data-search-input]');
    const cards = Array.from(scope.querySelectorAll('[data-search-card]'));
    const empty = scope.querySelector('[data-empty-state]');
    const query = normalize(queryInput ? queryInput.value : '');
    const yearRule = scope.getAttribute('data-active-year') || 'all';
    let visibleCount = 0;

    cards.forEach(function (card) {
      const text = normalize(card.getAttribute('data-search-text'));
      const year = card.getAttribute('data-year');
      const matchesText = !query || text.indexOf(query) !== -1;
      const matchesYear = matchYear(year, yearRule);
      const visible = matchesText && matchesYear;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.style.display = visibleCount ? 'none' : 'block';
    }
  }

  function setupFilters() {
    const scopes = Array.from(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      const input = scope.querySelector('[data-search-input]');
      if (input) {
        input.addEventListener('input', function () {
          filterCards(scope);
        });
      }
      const yearButtons = Array.from(scope.querySelectorAll('[data-year-filter]'));
      yearButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          scope.setAttribute('data-active-year', button.getAttribute('data-year-filter') || 'all');
          yearButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          filterCards(scope);
        });
      });
      filterCards(scope);
    });
  }

  function setupVideoPlayer(streamUrl) {
    const video = document.getElementById('movie-player');
    const overlay = document.getElementById('player-overlay');
    const button = document.getElementById('player-button');
    if (!video || !streamUrl) {
      return;
    }

    let prepared = false;

    function prepare() {
      if (prepared) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      prepared = true;
    }

    function startPlayback() {
      prepare();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        startPlayback();
      });
    }
    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }

  window.setupVideoPlayer = setupVideoPlayer;

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHeroSlider();
    setupFilters();
  });
})();
