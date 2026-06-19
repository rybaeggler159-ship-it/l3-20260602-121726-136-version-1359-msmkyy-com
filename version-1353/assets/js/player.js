(function () {
  const shell = document.querySelector(".player-shell");
  const video = document.querySelector(".js-video");
  const cover = document.querySelector(".js-player-cover");
  const config = document.getElementById("player-config");

  if (!shell || !video || !cover || !config) {
    return;
  }

  let loaded = false;
  let hls = null;

  function getUrl() {
    try {
      const data = JSON.parse(config.textContent || "{}");
      return data.src || "";
    } catch (error) {
      return "";
    }
  }

  function attach() {
    if (loaded) {
      return;
    }

    const url = getUrl();

    if (!url) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    loaded = true;
  }

  function play() {
    attach();
    shell.classList.add("is-playing");
    const promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  cover.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (!loaded) {
      play();
      return;
    }

    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", function () {
    shell.classList.add("is-playing");
  });

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
})();
