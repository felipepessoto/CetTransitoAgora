// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=392286
(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    

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

            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
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

    app.afterProcessAll = function () {
        app.autoUpdateBadge();
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
