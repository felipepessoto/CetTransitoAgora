// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    app.ultimaAtualizacao = null;
    app.kmInfo = {
        total: {
            percentual: null,
            km: null,
            imagem: null
        },
        norte: {
            km: null,
            imagem: null
        },
        leste: {
            km: null,
            imagem: null
        },
        centro: {
            km: null,
            imagem: null
        },
        oeste: {
            km: null,
            imagem: null
        },
        sul: {
            km: null,
            imagem: null
        }
    }

    WinJS.Application.onsettings = function (e) {
        e.detail.applicationcommands = { "privacyPolicy": { title: "Privacy Policy", href: "/privacy.html" } };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application has been reactivated from suspension. Restore application state here.
            }

            var tileArguments = args.detail.arguments;

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {

                if (tileArguments !== '') {
                    var keyValue = tileArguments.split(":");
                    if (keyValue[0] === "regiao") {
                        return app.atualizarDados().done(function () {
                            return nav.navigate("/pages/regiao/regiao.html", { nome: keyValue[1] });
                        });
                    }
                }
                return nav.navigate(nav.location || Application.navigator.home, nav.state);

            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
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

    app.atualizarDados = function () {

        var promise = $.get('http://cetsp1.cetsp.com.br/monitransmapa/agora/').done(function (data) {
            var conteudo = $('<output>').append($.parseHTML(data));

            app.kmInfo.ultimaAtualizacao = conteudo.find('#hora').text();

            app.kmInfo.total.km = conteudo.find('#lentidao').text().split(" km")[0];
            app.kmInfo.total.imagem = app.getTrendImage(conteudo.find('#tendencia > img').attr('src'));

            app.kmInfo.norte.km = conteudo.find('#NorteLentidao').text().split(" km")[0];
            app.kmInfo.norte.imagem = app.getTrendImage(conteudo.find('#NorteTendencia > img').attr('src'));

            app.kmInfo.leste.km = conteudo.find('#LesteLentidao').text().split(" km")[0];
            app.kmInfo.leste.imagem = app.getTrendImage(conteudo.find('#LesteTendencia > img').attr('src'));

            app.kmInfo.centro.km = conteudo.find('#CentroLentidao').text().split(" km")[0];
            app.kmInfo.centro.imagem = app.getTrendImage(conteudo.find('#CentroTendencia > img').attr('src'));

            app.kmInfo.oeste.km = conteudo.find('#OesteLentidao').text().split(" km")[0];
            app.kmInfo.oeste.imagem = app.getTrendImage(conteudo.find('#OesteTendencia > img').attr('src'));

            app.kmInfo.sul.km = conteudo.find('#SulLentidao').text().split(" km")[0];
            app.kmInfo.sul.imagem = app.getTrendImage(conteudo.find('#SulTendencia > img').attr('src'));

            app.kmInfo.total.percentual = conteudo.find('#percentualLentidao').text();

            TilesNotificationUpdater.updateBadge(app.kmInfo.total.km);
            TilesNotificationUpdater.updateSecondary("norte", app.kmInfo.norte.km);
            TilesNotificationUpdater.updateSecondary("leste", app.kmInfo.leste.km);
            TilesNotificationUpdater.updateSecondary("centro", app.kmInfo.centro.km);
            TilesNotificationUpdater.updateSecondary("oeste", app.kmInfo.oeste.km);
            TilesNotificationUpdater.updateSecondary("sul", app.kmInfo.sul.km);
        });

        return promise;
    };

    app.getTrendImage = function (cetImage) {
        cetImage = cetImage.toLowerCase();
        if (cetImage === "img\\estavel.gif")
            return "/images/estavel.gif";
        if (cetImage === "img\\alta.gif")
            return "/images/alta.gif";
        if (cetImage === "img\\baixa.gif")
            return "/images/baixa.gif";

        return null;
    };

    app.start();

    app.autoUpdateBadge();
})();

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}