(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-overlay');
        var source = video ? video.querySelector('source') : null;
        var stream = source ? source.getAttribute('src') : '';
        var ready = false;
        var hls = null;

        function playVideo() {
            if (!video || !stream) {
                return;
            }

            if (button) {
                button.classList.add('is-hidden');
            }

            if (!ready) {
                ready = true;
                if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL')) {
                    video.src = stream;
                    video.load();
                    video.play();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                    });
                    return;
                }

                video.src = stream;
                video.load();
            }

            video.play();
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
