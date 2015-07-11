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

            regiao.nome = options.nome;
            regiao.tileId = regiao.nome + "Tile";

            $("#content").html(options.html);
            $(".pagetitle").text("Região " + regiao.nome);

            document.getElementById("appBar").disabled = false;

            element.querySelector("#cmdPin").addEventListener("click", regiao.appbarButtonClicked, false);
            regiao.setAppbarButton();
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });

    regiao.setAppbarButton = function () {
        var commandButton = document.querySelector("#cmdPin").winControl;

        if (Windows.UI.StartScreen.SecondaryTile.exists(regiao.tileId)) {
            commandButton.label = "Unpin from Start";
            commandButton.tooltip = "Unpin";
            commandButton.icon = "unpin";
        } else {
            commandButton.label = "Pin to Start";
            commandButton.tooltip = "Pin";
            commandButton.icon = "pin";
        }

        document.getElementById("appBar").winControl.sticky = false;
    }

    regiao.appbarButtonClicked = function () {
        document.getElementById("appBar").winControl.sticky = true;

        if (WinJS.UI.AppBarIcon.unpin === document.getElementById("cmdPin").winControl.icon) {
            regiao.unpinByElementAsync(document.getElementById("cmdPin"), regiao.tileId).done(function (isDeleted) {
                if (isDeleted) {
                    WinJS.log && WinJS.log("Secondary tile was successfully unpinned.", "sample", "status");
                    regiao.setAppbarButton();
                } else {
                    WinJS.log && WinJS.log("Secondary tile was not unpinned.", "sample", "error");
                    regiao.setAppbarButton();
                }
            });
        } else {
            regiao.pinByElementAsync(document.getElementById("cmdPin"), regiao.tileId, "App bar pinned secondary tile", "A secondary tile that was pinned by the user from the app bar").done(function (isCreated) {
                if (isCreated) {
                    WinJS.log && WinJS.log("Secondary tile was successfully pinned.", "sample", "status");
                    regiao.setAppbarButton();
                } else {
                    WinJS.log && WinJS.log("Secondary tile was not pinned.", "sample", "error");
                    regiao.setAppbarButton();
                }
            });
        }
    }

    regiao.pinByElementAsync = function (element, newTileID, newTileDisplayName) {

        var square150x150Logo = new Windows.Foundation.Uri("ms-appx:///Images/square150x150Tile-sdk.png");
        var square30x30Logo = new Windows.Foundation.Uri("ms-appx:///Images/square30x30Tile-sdk.png");

        var currentTime = new Date();
        var TileActivationArguments = newTileID + " was pinned at=" + currentTime;

        var tile = new Windows.UI.StartScreen.SecondaryTile(newTileID,
                                                            newTileDisplayName,
                                                            TileActivationArguments,
                                                            square150x150Logo,
                                                            Windows.UI.StartScreen.TileSize.square150x150);

        tile.visualElements.foregroundText = Windows.UI.StartScreen.ForegroundText.light;
        tile.visualElements.square30x30Logo = square30x30Logo;
        tile.visualElements.showNameOnSquare150x150Logo = true;

        var selectionRect = element.getBoundingClientRect();

        return new WinJS.Promise(function (complete, error, progress) {
            tile.requestCreateForSelectionAsync({ x: selectionRect.left, y: selectionRect.top, width: selectionRect.width, height: selectionRect.height }, Windows.UI.Popups.Placement.above).done(function (isCreated) {
                if (isCreated) {
                    complete(true);
                } else {
                    complete(false);
                }
            });
        });
    }

    regiao.unpinByElementAsync = function (element, unwantedTileID) {

        var selectionRect = element.getBoundingClientRect();
        var buttonCoordinates = { x: selectionRect.left, y: selectionRect.top, width: selectionRect.width, height: selectionRect.height };
        var placement = Windows.UI.Popups.Placement.above;

        var tileToDelete = new Windows.UI.StartScreen.SecondaryTile(unwantedTileID);

        return new WinJS.Promise(function (complete, error, progress) {
            tileToDelete.requestDeleteForSelectionAsync(buttonCoordinates, placement).done(function (isDeleted) {
                if (isDeleted) {
                    complete(true);
                } else {
                    complete(false);
                }
            });
        });
    }

})();
