(function () {
    'use strict';

    function config () {
        return {
            drop: [],
            mask: [],
            unmask: [],
            regions: [
                [1 /* Region.Header */, "header"],
                [2 /* Region.Footer */, "footer"],
                [3 /* Region.Navigation */, "nav"]
            ],
            fraud: true,
            checksum: [],
        };
    }

    chrome.runtime.onMessage.addListener(function (message) {
        if (message.action === "activate") {
            activate();
        }
        else if (message.action === "warn") {
            console.warn(message.message);
        }
    });
    chrome.runtime.sendMessage({ action: "activate" }, function (response) {
        if (response && response.success) {
            activate();
        }
    });
    function activate() {
        setup(chrome.extension.getURL('clarity.js'));
    }
    function setup(url) {
        // Execute script in the webpage context
        var script = document.createElement("script");
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        document.body.appendChild(script);
        window.addEventListener("message", function (event) {
            if (event.source === window && event.data.action) {
                switch (event.data.action) {
                    case "wireup":
                        chrome.storage.sync.get({ clarity: { showText: true, leanMode: false } }, function (items) {
                            var c = config();
                            var script = document.createElement("script");
                            script.innerText = wireup({
                                regions: c.regions,
                                fraud: c.fraud,
                                mask: c.mask,
                                unmask: c.unmask,
                                drop: c.drop,
                                showText: items.clarity.showText,
                                leanMode: items.clarity.leanMode
                            });
                            document.body.appendChild(script);
                        });
                        break;
                    case "upload":
                        upload(event.data.payload);
                        break;
                }
            }
        });
    }
    function wireup(settings) {
        var code = (function () {
            window["clarity"]("start", {
                delay: 500,
                lean: "$__leanMode__$",
                regions: "$__regions__$",
                fraud: "$__fraud__$",
                drop: "$__drop__$",
                mask: "$__mask__$",
                unmask: "$__unmask__$",
                content: "$__showText__$",
                upload: function (data) { window.postMessage({ action: "upload", payload: data }, "*"); },
                projectId: "devtools"
            });
        }).toString();
        Object.keys(settings).forEach(function (s) { return code = code.replace("\"$__".concat(s, "__$\""), JSON.stringify(settings[s])); });
        return "(".concat(code, ")();");
    }
    function upload(data) {
        chrome.runtime.sendMessage({ action: "payload", payload: data }, function (response) {
            if (!(response && response.success)) {
                console.warn("Payload failure, dev tools likely not open.");
            }
        });
    }

})();
