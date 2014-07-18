// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

//
// A JavaScript background task runs a specified JavaScript file.
//
(function () {
    "use strict";

    var notifications = Windows.UI.Notifications;
    
    var updateBadge = function (totalKm) {
        var badgeType = notifications.BadgeTemplateType.badgeNumber;
        var badgeXml = notifications.BadgeUpdateManager.getTemplateContent(badgeType);

        var badgeAttributes = badgeXml.getElementsByTagName("badge");
        badgeAttributes[0].setAttribute("value", totalKm);

        var badgeNotification = new notifications.BadgeNotification(badgeXml);
        notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().update(badgeNotification);
        
        close();
    };
    updateBadge(80);
})();

