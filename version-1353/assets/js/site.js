(function () {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
    const prev = carousel.querySelector(".hero-prev");
    const next = carousel.querySelector(".hero-next");
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    start();
  }

  const panel = document.querySelector("[data-filter-panel]");
  const list = document.querySelector("[data-filter-list]");

  if (panel && list) {
    const keyword = panel.querySelector(".js-filter-keyword");
    const year = panel.querySelector(".js-filter-year");
    const region = panel.querySelector(".js-filter-region");
    const cards = Array.from(list.querySelectorAll("[data-title]"));
    const empty = document.querySelector(".empty-state");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
      const q = normalize(keyword ? keyword.value : "");
      const y = normalize(year ? year.value : "");
      const r = normalize(region ? region.value : "");
      let shown = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.genre,
          card.dataset.category,
          card.dataset.region,
          card.dataset.year
        ].join(" "));
        const okKeyword = !q || haystack.indexOf(q) !== -1;
        const okYear = !y || normalize(card.dataset.year) === y;
        const okRegion = !r || normalize(card.dataset.region) === r;
        const visible = okKeyword && okYear && okRegion;
        card.hidden = !visible;
        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    [keyword, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });
  }
})();
