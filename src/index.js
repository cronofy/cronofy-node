'use strict';

import _ from 'lodash';
import rest from './lib/rest-client';

/*
import requestAccessToken from './methods/request-access-token';
import revokeAuthorization from './methods/revoke-authorization';

const methods = {
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

  this.freeBusy = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/free_busy', details.options, details.callback);
  }

  this.listCalendars = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/calendars', details.options, details.callback);
  }

  this.listNotificationChannels = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/channels', details.options, details.callback);
  }

  this.profileInformation = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/profiles', details.options, details.callback);
  }

  this.readEvents = function(){
    var details = parseArguments(arguments, ["access_token"]);

    httpGet('/v1/events', details.options, details.callback);
  }

  this.refreshAccessToken = function(){
    var details = parseArguments(arguments, ["client_id", "client_secret", "refresh_token"]);

    details.options.grant_type = "refresh_token";

    httpPost('/oauth/token', details.options, function(token){
      config.access_token = token.access_token;
      config.refresh_token = token.refresh_token;

      details.callback(token);
    });
  }

  var urls = {
    api: 'http://local' + (config.dataCenter ? '-' + config.dataCenter : '') + '.cronofy.com'
  };

  var httpGet = function(path, options, callback, optionsToOmit){
    httpCall('GET', path, options, callback, optionsToOmit);
  }

  var httpPost = function(path, options, callback, optionsToOmit){
    httpCall('POST', path, options, callback, optionsToOmit);
  }

  var httpDelete = function(path, options, callback, optionsToOmit){
    httpCall('DELETE', path, options, callback, optionsToOmit);
  }

  var httpCall = function(method, path, options, callback, optionsToOmit){
    var settings = {
      method: method,
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
