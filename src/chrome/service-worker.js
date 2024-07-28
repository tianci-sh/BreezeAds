console.log("Background service worker is running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('receive')
    console.log(sender.tab.id)

    if (request.command === "skipAd") {
        chrome.debugger.attach({tabId: sender.tab.id}, "1.3", () => {
            console.log('start click left')
            chrome.debugger.sendCommand({
                tabId: sender.tab.id
            }, "Input.dispatchMouseEvent", {
                type: "mousePressed",
                x: request.x,
                y: request.y,
                button: "left",
                clickCount: 1
            }, () => {
                console.log('start released left')

                chrome.debugger.sendCommand({
                    tabId: sender.tab.id
                }, "Input.dispatchMouseEvent", {
                    type: "mouseReleased",
                    x: request.x,
                    y: request.y,
                    button: "left",
                    clickCount: 1
                }, () => {
                    chrome.debugger.detach({tabId: sender.tab.id});
                });
            });
        });
    }
});
