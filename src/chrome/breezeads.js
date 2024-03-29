window.onload = () => {
    setTimeout(findAndInject, 100)
}

function findAndInject() {
    const videoContainer = document.getElementById("movie_player");

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting')) {
                    byeAd()
                }
            }
        }
    };

    if (videoContainer) {
        const observer = new MutationObserver(callback);

        const config = {
            attributes: true,
            attributeFilter: ['class']
        };

        observer.observe(videoContainer, config);
        console.log('Inject Video Container')
    } else {
        console.log('Video Container Not Found')
        setTimeout(findAndInject, 100)
    }
}

function byeAd() {
    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    if (videoPlayer) {
        videoPlayer.muted = true;

        if (isFinite(videoPlayer.duration)) {
            videoPlayer.currentTime = videoPlayer.duration - 0.1;
            videoPlayer.paused && videoPlayer.play()
        }
    }

    // CLICK ON THE SKIP AD BTN
    document.querySelector(".ytp-ad-skip-button")?.click();
    document.querySelector(".ytp-ad-skip-button-modern")?.click();
}