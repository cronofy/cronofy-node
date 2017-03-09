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

var cronofy = function (clientId, clientSecret, accessToken, refreshToken) {
  var _cronofy = {};
  var _config = {
    urls: urls(),

    client_id: clientId,
    client_secret: clientSecret,

    access_token: accessToken,
    refresh_token: refreshToken,
  };

  _cronofy.setDataCenter = function (dataCenter) {
    _config.urls = urls(dataCenter);
  };

  var setupMethod = function (methodName) {
    if(methodName == "requestAccessToken" || methodName == "refreshAccessToken"){
      _cronofy[methodName] = function (options, callback) {
        return methods[methodName](_config, options, callback).then(function(response){
          _config.access_token = response.access_token;
          _config.refresh_token = response.refresh_token;

          return response;
        });
      }
    } else {
      _cronofy[methodName] = function (options, callback) {
        return methods[methodName](_config, options, callback);
      };
    }
  };

  for (var method in methods) {
    setupMethod(method);
  }

  return _cronofy;
};

export default cronofy;
