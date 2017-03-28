'use strict';

import _ from 'lodash';
import rest from './lib/rest-client';

/*
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
};*/

var cronofy = function(config){
  this.accountInformation = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/account', details.options, details.callback);
  }

  this.authorizeWithServiceAccount = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpPost('/v1/service_account_authorizations', details.options, details.callback);
  }

  var urls = {
    api: 'http://local' + (config.dataCenter ? '-' + config.dataCenter : '') + '.cronofy.com'
  };

  var httpGet = function(path, options, callback, optionsToOmit){
    var settings = {
      method: 'GET',
      path: urls.api + path,
      headers: {
        Authorization: 'Bearer ' + options.access_token
      },
    };

    rest(settings).then(function(result){
      callback(result['entity']);
    });
  }

  var httpPost = function(path, options, callback, optionsToOmit){
    var settings = {
      method: 'POST',
      path: urls.api + path,
      headers: {
        Authorization: 'Bearer ' + options.access_token,
        'Content-Type': 'application/json'
      },
      entity: _.omit(options, optionsToOmit || ['access_token'])
    };

    rest(settings).then(function(result){
      if(result['entity']) {
        callback(result['entity']);
      } else {
        callback();
      }
    }, function(){
      console.log("Error", arguments[0]['status']['code'], arguments[0]['entity']);
    });
  }

  var parseArguments = function(args, configDefaults){
    var parsed = {
      options: args.length == 2 ? args[0] : {},
      callback: args.length == 2 ? args[1] : args[0]
    };

    for(var i = 0; i < configDefaults.length; i++){
      var key = configDefaults[i];

      parsed.options[key] = parsed.options[key] || config[key];
    }

    return parsed;
  }
}

export default cronofy;
