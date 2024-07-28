let executeByeAdTime = false;

setTimeout(findVideoAndInject, 10)
setTimeout(findErrorScreenAndInject, 10)

function findVideoAndInject() {
    const videoContainer = document.getElementById("movie_player");

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if ((target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting')) && (Date.now() - executeByeAdTime > 100)) {
                    executeByeAdTime = Date.now();
                    byeAd();
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
        setTimeout(findVideoAndInject, 100)
    }
}

function findErrorScreenAndInject() {
    const errorScreen = document.getElementById('error-screen');

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                location.reload();
            }
        }
    };

    if (errorScreen) {
        const errorObserver = new MutationObserver(callback);
        const errorConfig = {
            childList: true
        };

        errorObserver.observe(errorScreen, errorConfig);
        console.log('Observing Error Screen');
    } else {
        console.log('Error Screen Not Found');
        setTimeout(findErrorScreenAndInject, 100);
    }
}

function byeAd() {
    console.log('run')
    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    if (videoPlayer) {
        videoPlayer.muted = true;

        if (isFinite(videoPlayer.duration)) {
            if (videoPlayer.duration <= 60) {
                videoPlayer.playbackRate = 4;
            } else {
                videoPlayer.playbackRate = 16;
            }
        }
    }

    clickSkipButton();
}

function clickSkipButton() {
    Array.from(document.querySelectorAll('button')).filter(button =>
        button.id.includes('skip-button')
    ).forEach((button) => {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        console.log(`Button: ${button.id}, X: ${x}, Y: ${y}`);

        if (x && y && x > 0 && y > 0) {
            chrome.runtime.sendMessage({command: "skipAd", x, y});
        }
    });
}