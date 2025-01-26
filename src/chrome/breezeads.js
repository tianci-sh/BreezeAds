const INTERVAL = 100;
let executeByeAdTime = false;
let byAdInterval;

setTimeout(findVideoAndInject, 10)
setTimeout(findErrorScreenAndInject, 10)

function findVideoAndInject() {
    const videoContainer = document.getElementById("movie_player");

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if ((target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting'))) {
                    if (Date.now() - executeByeAdTime > 100) {
                        executeByeAdTime = Date.now();

                        // Darken the ads in the video a bit.
                        target.style.filter = `brightness(0.5)`
                        if (!byAdInterval) {
                            byAdInterval = setInterval(() => byeAd(), INTERVAL)
                        }
                    }
                } else {
                    // After ads end
                    target.style.filter = `brightness(1)`

                    if(byAdInterval){
                        clearInterval(byAdInterval)
                        setVideoPlayerToOriginState()
                        byAdInterval = null;
                    }
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
        print('Inject Video Container')
    } else {
        print('Video Container Not Found')
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
        print('Observing Error Screen');
    } else {
        print('Error Screen Not Found');
        setTimeout(findErrorScreenAndInject, 100);
    }
}

function byeAd() {
    // Service worker lifetime is only 30 seconds to 5 minutes.
    chrome.runtime.sendMessage({command: "wakeup"});

    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    if (videoPlayer) {
        videoPlayer.muted = true;
        print(`duration => ${videoPlayer.duration}`)
        // videoPlayer.currentTime = videoPlayer.duration - 1;
        if (isFinite(videoPlayer.duration)) {
            if (videoPlayer.duration <= 15) {
                videoPlayer.playbackRate = 3;
            } else if (videoPlayer.duration <= 60) {
                videoPlayer.playbackRate = 4;
            } else {
                videoPlayer.playbackRate = 16;
            }
        }
    }
    clickSkipButton(videoPlayer)
}

function setVideoPlayerToOriginState() {
    chrome.runtime.sendMessage({command: "wakeup"});

    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    if (videoPlayer) {
        videoPlayer.muted = false;

        //get rate from session storage
        const rawData = sessionStorage.getItem("yt-player-playback-rate") || '{"data":1}';
        const parsed = JSON.parse(rawData);
        videoPlayer.playbackRate = Number(parsed.data) || 1;
    }
}

function clickSkipButton(videoPlayer) {
    Array.from(document.querySelectorAll('button')).filter(button =>
        button.id.includes('skip-button')
    ).forEach((button) => {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        print(`Button: ${button.id}, X: ${x}, Y: ${y}`);

        if (x && y && x > 0 && y > 0) {
            chrome.runtime.sendMessage({command: "skipAd", x, y});
        }
    });
}

function print(message) {
    console.log(`[ BreezeAds ] ${message}`)
}