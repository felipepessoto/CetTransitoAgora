(function () {
    "use strict";

    WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {
            // Use element.querySelector() instead of document.getElementById() to ensure that the correct default.html page is targeted:
            element.querySelector("#cmdRefresh").addEventListener("click", doClickRefresh, false);
        }
    });

    function doClickRefresh() {
        WinJS.Application.atualizarDados();
    };
})();