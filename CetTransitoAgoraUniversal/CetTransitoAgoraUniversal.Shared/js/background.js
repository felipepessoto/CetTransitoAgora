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
    importScripts("/WinJS/js/base.js");
    importScripts("/js/TilesNotificationUpdater.js");

    var encontrarKms = function(retorno, regiao) {
        var searchString = '<div id="' + regiao;

        var inicioDiv = retorno.indexOf(searchString);
        var inicioTexto = retorno.indexOf(">", inicioDiv) + 1;
        var fimTexto = retorno.indexOf(" km", inicioTexto);

        return retorno.substring(inicioTexto, fimTexto);
    }

    WinJS.xhr({
        url: "http://cetsp1.cetsp.com.br/monitransmapa/agora/",
        responseType: "text"
    }).done(
           function completed(result) {
               if (result.status === 200) {
                   var inicio = result.responseText.substring(result.responseText.indexOf("class=\"lentidao\"><b>") + 20);
                   var totalKm = inicio.substring(0, inicio.indexOf("<"));
                   TilesNotificationUpdater.updateBadge(totalKm);
                   
                   TilesNotificationUpdater.updateSecondary("norte", encontrarKms(result.responseText, "NorteLentidao"));
                   TilesNotificationUpdater.updateSecondary("leste", encontrarKms(result.responseText, "LesteLentidao"));
                   TilesNotificationUpdater.updateSecondary("centro", encontrarKms(result.responseText, "CentroLentidao"));
                   TilesNotificationUpdater.updateSecondary("oeste", encontrarKms(result.responseText, "OesteLentidao"));
                   TilesNotificationUpdater.updateSecondary("sul", encontrarKms(result.responseText, "SulLentidao"));
               }
               close();
           });
})();

