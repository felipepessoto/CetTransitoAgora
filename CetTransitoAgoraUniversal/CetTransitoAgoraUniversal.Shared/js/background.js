// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

//
// A JavaScript background task runs a specified JavaScript file.
//
(function() {
    "use strict";

    var notifications = Windows.UI.Notifications;
    try {
        importScripts("//Microsoft.Phone.WinJS.2.1/js/base.js");
    } catch (e) {
        importScripts("//Microsoft.WinJS.2.0/js/base.js");
    }
    
    var updateBadge = function (totalKm) {

        //Obtem Template
        var template = notifications.TileTemplateType.tileSquare150x150Block;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

        //Configura Texto
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(totalKm.toString()));

        //Obtem Template
        var wideTemplate = notifications.TileTemplateType.tileWide310x150BlockAndText02;
        var wideTileXml = notifications.TileUpdateManager.getTemplateContent(wideTemplate);

        //Configura Texto
        var wideTileTextAttributes = wideTileXml.getElementsByTagName("text");
        wideTileTextAttributes[0].appendChild(wideTileXml.createTextNode(totalKm.toString()));
        if (!WinJS.Utilities.isPhone) {
            wideTileTextAttributes[1].appendChild(wideTileXml.createTextNode(totalKm.toString()));
        }
        //wideTileTextAttributes[2].appendChild(wideTileXml.createTextNode("CET"));

        //Configura Imagem
        //var wideTileImageAttributes = wideTileXml.getElementsByTagName("image");
        //wideTileImageAttributes[0].setAttribute("src", "ms-appx:///images/Wide310x150Logo.png");
        //wideTileImageAttributes[0].setAttribute("alt", "logo");

        var node = tileXml.importNode(wideTileXml.getElementsByTagName("binding").item(0), true);
        tileXml.getElementsByTagName("visual").item(0).appendChild(node);

        // Create the notification from the XML.
        var tileNotification = new notifications.TileNotification(tileXml);
        var seconds = 600;
        tileNotification.expirationTime = new Date(new Date().getTime() + seconds * 1000);
        // Send the notification to the calling app's tile.
        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);




        var badgeType = notifications.BadgeTemplateType.badgeNumber;
        var badgeXml = notifications.BadgeUpdateManager.getTemplateContent(badgeType);

        var badgeAttributes = badgeXml.getElementsByTagName("badge");
        badgeAttributes[0].setAttribute("value", totalKm);

        var badgeNotification = new notifications.BadgeNotification(badgeXml);
        notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().update(badgeNotification);
    };
    
    WinJS.xhr({
        url: "http://cetsp1.cetsp.com.br/monitransmapa/agora/",
        responseType: "text"
    }).done(
           function completed(result) {
               if (result.status === 200) {
                   var inicio = result.responseText.substring(result.responseText.indexOf("class=\"lentidao\"><b>") + 20);
                   var totalKm = inicio.substring(0, inicio.indexOf("<"));
                   updateBadge(totalKm);
               }
           });
})();

