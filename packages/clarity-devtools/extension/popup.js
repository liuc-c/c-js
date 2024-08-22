(function () {
    'use strict';

    (function () {
        // Initialize configuration
        var state = { showText: true, leanMode: false };
        var showText = document.getElementById("showText");
        var leanMode = document.getElementById("leanMode");
        // Read from default storage
        chrome.storage.sync.get({ clarity: state }, function (items) {
            state = items.clarity;
            redraw(state);
        });
        // Listen for changes
        showText.addEventListener("click", toggle);
        leanMode.addEventListener("click", toggle);
        function toggle(cb) {
            // Update state
            switch (cb.target.id) {
                case "showText":
                    state.showText = !state.showText;
                    break;
                case "leanMode":
                    state.leanMode = !state.leanMode;
                    break;
            }
            // Update storage
            chrome.storage.sync.set({ clarity: state }, function () {
                redraw(state);
            });
        }
        function redraw(update) {
            showText.checked = update.showText;
            leanMode.checked = update.leanMode;
        }
    })();

})();
