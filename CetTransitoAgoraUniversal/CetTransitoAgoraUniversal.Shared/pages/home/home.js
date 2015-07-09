(function () {
    "use strict";

    var notifications = Windows.UI.Notifications;
    var home = {};

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            home.atualizarDados();
            element.querySelector("#cmdRefresh").addEventListener("click", home.doClickRefresh, false);
            $("a").click(home.linkClickEventHandler);
        }
    });

    home.doClickRefresh = function () {
        home.atualizarDados();
    };

    home.linkClickEventHandler = function (eventInfo) {
        eventInfo.preventDefault();
        var regiao = $(this).data("regiao");
        WinJS.Navigation.navigate($(this).prop("href"), { nome: regiao, html: $('#' + regiao).html() });
    }

    home.atualizarDados = function () {

        $('#carregando').show();

        $.get('http://cetsp1.cetsp.com.br/monitransmapa/agora/').done(function (data) {
            var conteudo = $('<output>').append($.parseHTML(data));
            var totalKm = conteudo.find('#lentidao').text();
            var totalPerc = conteudo.find('#percentualLentidao').text();
            var totalKmPerc = totalKm + " km " + "(" + totalPerc + "%)";

            var totalTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#tendencia > img').attr('src')) + "' />";

            var norteKm = conteudo.find('#NorteLentidao').text();
            var norteTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#NorteTendencia > img').attr('src')) + "' />";

            var lesteKm = conteudo.find('#LesteLentidao').text();
            var lesteTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#LesteTendencia > img').attr('src')) + "' />";

            var centroKm = conteudo.find('#CentroLentidao').text();
            var centroTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#CentroTendencia > img').attr('src')) + "' />";

            var oesteKm = conteudo.find('#OesteLentidao').text();
            var oesteTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#OesteTendencia > img').attr('src')) + "' />";

            var sulKm = conteudo.find('#SulLentidao').text();
            var sulTendenciaImg = "<img class='icon-trend' src='/images/" + home.getTrendImage(conteudo.find('#SulTendencia > img').attr('src')) + "' />";

            var now = new Date();

            var hora = "CET: " + conteudo.find('#hora').text() + " / Conexão: " + now.getHours() + "h" + now.getMinutes() + "m";

            $('#hora').html(hora);
            $('#total').html(totalKmPerc + totalTendenciaImg);
            $('#norte').html(norteKm + norteTendenciaImg);
            $('#leste').html(lesteKm + lesteTendenciaImg);
            $('#centro').html(centroKm + centroTendenciaImg);
            $('#oeste').html(oesteKm + oesteTendenciaImg);
            $('#sul').html(sulKm + sulTendenciaImg);

            home.updateBadge(totalKm);

            $('#carregando').hide();
            $('#conteudo').show();
        });

        setTimeout(home.atualizarDados, 60000);
    };

    home.getTrendImage = function (cetImage) {
        cetImage = cetImage.toLowerCase();
        if (cetImage == "img\\estavel.gif")
            return "estavel.gif";
        if (cetImage == "img\\alta.gif")
            return "alta.gif";
        if (cetImage == "img\\baixa.gif")
            return "baixa.gif";

        return null;
    };

    home.updateBadge = function (totalKm) {

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
})();
