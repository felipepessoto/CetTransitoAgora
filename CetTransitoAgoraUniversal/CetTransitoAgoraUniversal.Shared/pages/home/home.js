(function () {
    "use strict";

    var app = WinJS.Application;
    var home = {};

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            element.querySelector("#cmdRefresh").addEventListener("click", home.doClickRefresh, false);
            $("a").click(home.linkClickEventHandler);
            home.doClickRefresh();
            setTimeout(home.doClickRefresh, 60000);
        }
    });

    home.doClickRefresh = function () {
        $('#carregando').show();

        app.atualizarDados().done(function() {
            home.mostrarDados();
        });
    };

    home.mostrarDados = function() {

        var totalKmPerc = app.kmInfo.total.km + " km " + "(" + app.kmInfo.total.percentual + "%)";

        var totalTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.total.imagem + "' />";
        var norteTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.norte.imagem + "' />";
        var lesteTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.leste.imagem + "' />";
        var centroTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.centro.imagem + "' />";
        var oesteTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.oeste.imagem + "' />";
        var sulTendenciaImg = "<img class='icon-trend' src='" + app.kmInfo.sul.imagem + "' />";

        var now = new Date();

        var hora = "CET: " + app.kmInfo.ultimaAtualizacao + " / Conexão: " +now.getHours() + "h" +now.getMinutes() + "m";

        $('#hora').html(hora);
        $('#total').html(totalKmPerc + totalTendenciaImg);
        $('#norte').html(app.kmInfo.norte.km + " km " + norteTendenciaImg);
        $('#leste').html(app.kmInfo.leste.km + " km " +lesteTendenciaImg);
        $('#centro').html(app.kmInfo.centro.km + " km " +centroTendenciaImg);
        $('#oeste').html(app.kmInfo.oeste.km + " km " + oesteTendenciaImg);
        $('#sul').html(app.kmInfo.sul.km + " km " + sulTendenciaImg);

        $('#carregando').hide();
        $('#conteudo').show();
    }

    home.linkClickEventHandler = function (eventInfo) {
        eventInfo.preventDefault();
        var regiao = $(this).data("regiao");
        WinJS.Navigation.navigate($(this).prop("href"), { nome: regiao });
    }
})();
