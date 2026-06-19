(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-mobile-menu-button]");
    var panel = document.querySelector("[data-mobile-menu]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
      });
    });
    show(0);
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var typeSelect = scope.querySelector("[data-type-filter]");
      var categorySelect = scope.querySelector("[data-category-filter]");
      var yearSelect = scope.querySelector("[data-year-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var count = scope.querySelector("[data-result-count]");

      function apply() {
        var query = normalize(input ? input.value : "");
        var type = normalize(typeSelect ? typeSelect.value : "");
        var category = normalize(categorySelect ? categorySelect.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-region") + " " + card.textContent);
          var match = true;
          if (query && haystack.indexOf(query) === -1) {
            match = false;
          }
          if (type && normalize(card.getAttribute("data-type")) !== type) {
            match = false;
          }
          if (category && normalize(card.getAttribute("data-category")) !== category) {
            match = false;
          }
          if (year && normalize(card.getAttribute("data-year")) !== year) {
            match = false;
          }
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = "当前显示 " + visible + " 部 / 共 " + cards.length + " 部";
        }
      }

      [input, typeSelect, categorySelect, yearSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function initPlayer() {
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-player-start]");
    if (!video || !button) {
      return;
    }
    var source = video.getAttribute("data-src");
    var attached = false;

    function start() {
      if (!source) {
        return;
      }
      button.classList.add("is-hidden");
      if (!attached) {
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.play().catch(function () {});
        } else {
          video.src = source;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
    }

    button.addEventListener("click", start);
    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
