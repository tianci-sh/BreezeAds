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

const observer = new MutationObserver(callback);

const config = {
    attributes: true,
    attributeFilter: ['class']
};

observer.observe(videoContainer, config);


function byeAd() {

    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    if (videoPlayer) {
        videoPlayer.muted = true;
        videoPlayer.currentTime = videoPlayer.duration - 0.1;
        videoPlayer.paused && videoPlayer.play()
    }

    // CLICK ON THE SKIP AD BTN
    document.querySelector(".ytp-ad-skip-button")?.click();
    document.querySelector(".ytp-ad-skip-button-modern")?.click();
}