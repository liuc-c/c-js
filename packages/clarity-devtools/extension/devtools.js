(function () {
    'use strict';

    chrome.devtools.panels.create("Clarity", null, "panel.html");
    chrome.devtools.panels.elements.createSidebarPane("Clarity", function (sidebar) {
        function updateClarityInfo() {
            var code = "(" + inspect.toString() + ")()";
            var inspectedWindow = chrome.devtools.inspectedWindow;
            inspectedWindow.eval(code, function (result) {
                sidebar.setObject(result);
            });
        }
        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateClarityInfo);
        sidebar.onShown.addListener(updateClarityInfo);
        updateClarityInfo();
    });
    function inspect() {
        var clarity = window["clarity" /* Data.Constant.Clarity */];
        var tag = $0 ? $0.tagName : "*NA*";
        var value = $0 && "h" in clarity ? clarity.h("get", $0) : null;
        var id = value ? value.id : null;
        var output = { id: id, tag: tag, value: value };
        return output;
    }

})();
