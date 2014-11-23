// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var notifications = Windows.UI.Notifications;

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = { "privacyPolicy": { title: "Privacy Policy", href: "/privacy.html" } };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll().then(app.afterProcessAll));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.afterProcessAll = function () {
        app.autoUpdateBadge();
        app.atualizarDados();
    };

    app.atualizarDados = function () {
        $.get('http://cetsp1.cetsp.com.br/monitransmapa/agora/').done(function (data) {
            var conteudo = $('<output>').append($.parseHTML(data));
            var totalKm = conteudo.find('#lentidao').text();
            var totalPerc = conteudo.find('#percentualLentidao').text();
            var totalKmPerc = totalKm + " km " + "(" + totalPerc + "%)";

            var totalTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#tendencia > img').attr('src')) + "' />";

            var norteKm = conteudo.find('#NorteLentidao').text();
            var norteTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#NorteTendencia > img').attr('src')) + "' />";

            var lesteKm = conteudo.find('#LesteLentidao').text();
            var lesteTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#LesteTendencia > img').attr('src')) + "' />";

            var centroKm = conteudo.find('#CentroLentidao').text();
            var centroTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#CentroTendencia > img').attr('src')) + "' />";

            var oesteKm = conteudo.find('#OesteLentidao').text();
            var oesteTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#OesteTendencia > img').attr('src')) + "' />";

            var sulKm = conteudo.find('#SulLentidao').text();
            var sulTendenciaImg = "<img class='icon-trend' src='/images/" + app.getTrendImage(conteudo.find('#SulTendencia > img').attr('src')) + "' />";

            var now = new Date();

            var hora = "CET: " + conteudo.find('#hora').text() + " / Conexão: " + now.getHours() + "h" + now.getMinutes() + "m";

            $('#hora').html(hora);
            $('#total').html(totalKmPerc + totalTendenciaImg);
            $('#norte').html(norteKm + norteTendenciaImg);
            $('#leste').html(lesteKm + lesteTendenciaImg);
            $('#centro').html(centroKm + centroTendenciaImg);
            $('#oeste').html(oesteKm + oesteTendenciaImg);
            $('#sul').html(sulKm + sulTendenciaImg);

            app.updateBadge(totalKm);

            $('#carregando').hide();
            $('#conteudo').show();
        });

        setTimeout(app.atualizarDados, 60000);
    };

    app.getTrendImage = function (cetImage) {
        cetImage = cetImage.toLowerCase();
        if (cetImage == "img\\estavel.gif")
            return "estavel.gif";
        if (cetImage == "img\\alta.gif")
            return "alta.gif";
        if (cetImage == "img\\baixa.gif")
            return "baixa.gif";

        return null;
    };

    app.updateBadge = function (totalKm) {
        
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

    app.autoUpdateBadge = function () {
        
        var waitIntervalMinutes = 15;

        var hourlyTrigger = new Windows.ApplicationModel.Background.TimeTrigger(waitIntervalMinutes, false);
        var userCondition = new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.internetAvailable);
        Windows.ApplicationModel.Background.BackgroundExecutionManager.requestAccessAsync();
        
        var entryPoint = "js\\background.js";
        var taskName = "CetBackGround";

        var task = app.RegisterBackgroundTask(entryPoint, taskName, hourlyTrigger, userCondition);

        
        //var taskTrigger = new Windows.ApplicationModel.Background.MaintenanceTrigger(waitIntervalMinutes, false);
        //var condition = new Windows.ApplicationModel.Background.SystemCondition(Windows.ApplicationModel.Background.SystemConditionType.InternetAvailable);

        //var task = app.RegisterBackgroundTask("/Scripts/background.js", "CetBackGround", taskTrigger, condition);
    };

    app.RegisterBackgroundTask = function (taskEntryPoint, taskName, trigger, condition) {
        //
        // Check for existing registrations of this background task.
        //

        var taskRegistered = false;

        var background = Windows.ApplicationModel.Background;
        var iter = background.BackgroundTaskRegistration.allTasks.first();
        var hascur = iter.hasCurrent;

        while (hascur) {
            var cur = iter.current.value;

            if (cur.name === taskName) {
                taskRegistered = true;
                break;
            }
            hascur = iter.moveNext();
        }

        //
        // If the task is already registered, return the registration object.
        //
        if (taskRegistered == true) {
            return iter.current;
        }

        //
        // Register the background task.
        //
        var builder = new background.BackgroundTaskBuilder();

        builder.name = taskName;
        builder.taskEntryPoint = taskEntryPoint;
        //builder.isNetworkRequested = true;
        builder.setTrigger(trigger);

        if (condition != null) {

            builder.addCondition(condition);
        }

        var task = builder.register();

        return task;
    };

    app.start();
})();
