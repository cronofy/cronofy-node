'use strict';

import accountInformation from './methods/account-information';
import authorizeWithServiceAccount from './methods/authorize-with-service-account';
import availability from './methods/availability.js';
import createEvent from './methods/create-event';
import createNotificationChannel from './methods/create-notification-channel';
import deleteEvent from './methods/delete-event';
import deleteExternalEvent from './methods/delete-external-event';
import deleteNotificationChannel from './methods/delete-notification-channel';
import elevatedPermissions from './methods/elevated-permissions';
import freeBusy from './methods/free-busy';
import listCalendars from './methods/list-calendars';
import listNotificationChannels from './methods/list-notification-channels';
import profileInformation from './methods/profile-information';
import readEvents from './methods/read-events';
import refreshAccessToken from './methods/refresh-access-token';
import requestAccessToken from './methods/request-access-token';
import revokeAuthorization from './methods/revoke-authorization';

const methods = {
  accountInformation,
  authorizeWithServiceAccount,
  availability,
  createEvent,
  createNotificationChannel,
  deleteEvent,
  deleteExternalEvent,
  deleteNotificationChannel,
  elevatedPermissions,
  freeBusy,
  listCalendars,
  listNotificationChannels,
  profileInformation,
  readEvents,
  refreshAccessToken,
  requestAccessToken,
  revokeAuthorization
};

var urls = function (dataCenter) {
  if (dataCenter) {
    return {
      api: 'https://api-' + dataCenter + '.cronofy.com'
    };
  }

  return {
    api: 'https://api.cronofy.com'
  };
};

var cronofy = function () {
  var _cronofy = {};
  var _urls = urls();

  _cronofy.setDataCenter = function (dataCenter) {
    _urls = urls(dataCenter);
  };

  var setupMethod = function (methodName) {
    _cronofy[methodName] = function (options, callback) {
      options.urls = _urls;

      return methods[methodName](options, callback);
    };
  };

  for (var method in methods) {
    setupMethod(method);
  }

  return _cronofy;
};

export default cronofy;
