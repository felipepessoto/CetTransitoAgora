// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var notifications = Windows.UI.Notifications;
    var regiao = {};

    WinJS.UI.Pages.define("/pages/regiao/regiao.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            element.querySelector("#cmdPin").addEventListener("click", regiao.doClickPin, false);
            $("#content").html(options.html);
            $(".pagetitle").text("Região " + options.nome);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });

    regiao.doClickPin = function () {

    };
})();
