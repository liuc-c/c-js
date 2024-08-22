(function () {
    'use strict';

    var connections = [];
    chrome.runtime.onConnect.addListener(function (port) {
        var listener = function (message) {
            // Store a reference to tabId of the devtools page and send a message to activate Clarity
            if (message.action === "init") {
                connections[message.tabId] = port;
                chrome.tabs.sendMessage(message.tabId, { action: "activate" });
                return;
            }
            else if (message.action === "warn") {
                chrome.tabs.sendMessage(message.tabId, { action: "warn", message: message.message });
                return;
            }
        };
        // Listen to messages sent from the devtools page
        port.onMessage.addListener(listener);
        port.onDisconnect.addListener(function () {
            port.onMessage.removeListener(listener);
            var tabs = Object.keys(connections);
            for (var _i = 0, tabs_1 = tabs; _i < tabs_1.length; _i++) {
                var tab = tabs_1[_i];
                if (connections[tab] === port) {
                    delete connections[tab];
                    break;
                }
            }
        });
    });
    // Receive message from content script and relay it to the devtools page
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        switch (message.action) {
            case "activate":
                if (sender.tab) {
                    var tabId = sender.tab.id;
                    var success = tabId in connections;
                    var icon = success ? "icon-activated.png" : "icon.png";
                    var title = success ? "Microsoft Clarity Developer Tools" : "Microsoft Clarity: Open developer tools to activate";
                    chrome.browserAction.setIcon({ path: icon, tabId: tabId });
                    chrome.browserAction.setTitle({ title: title, tabId: tabId });
                    sendResponse({ success: success });
                }
                break;
            case "payload":
                if (sender.tab) {
                    var tabId = sender.tab.id;
                    var success = tabId in connections;
                    if (success) {
                        connections[tabId].postMessage(message);
                    }
                    sendResponse({ success: success });
                }
                break;
        }
    });

})();
