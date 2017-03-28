'use strict';

import _ from 'lodash';
import rest from './lib/rest-client';

/*
import freeBusy from './methods/free-busy';
import listCalendars from './methods/list-calendars';
import listNotificationChannels from './methods/list-notification-channels';
import profileInformation from './methods/profile-information';
import readEvents from './methods/read-events';
import refreshAccessToken from './methods/refresh-access-token';
import requestAccessToken from './methods/request-access-token';
import revokeAuthorization from './methods/revoke-authorization';

const methods = {
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

  this.availability = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpPost('/v1/availability', details.options, details.callback);
  }

  this.createEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpPost('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.createNotificationChannel = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpPost('/v1/channels', details.options, details.callback);
  }

  this.deleteEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.deleteExternalEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.deleteNotificationChannel = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpDelete('/v1/channels/' + details.options.channel_id, details.options, details.callback, ['access_token', 'channel_id']);
  }

  this.elevatedPermissions = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpPost('/v1/permissions', details.options, details.callback);
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

    httpCall(settings, callback);
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

    httpCall(settings, callback);
  }

  var httpDelete = function(path, options, callback, optionsToOmit){
    var settings = {
      method: 'DELETE',
      path: urls.api + path,
      headers: {
        Authorization: 'Bearer ' + options.access_token,
        'Content-Type': 'application/json'
      },
      entity: _.omit(options, optionsToOmit || ['access_token'])
    };

    httpCall(settings, callback);
  }

  var httpCall = function(settings, callback){
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
