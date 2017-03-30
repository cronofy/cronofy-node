'use strict';

import _ from 'lodash';
import rest from './lib/rest-client';

var tap = function(func){
  return function(value){
    func.apply(null, arguments);
    return value;
  }
}

var cronofy = function(config){
  if(!this || this.constructor !== cronofy){
    console.log("Cronofy must be called as a constructor");
    return;
  }

  this.config = config;

  this.accountInformation = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet('/v1/account', details.options, details.callback);
  }

  this.authorizeWithServiceAccount = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpPost('/v1/service_account_authorizations', details.options, details.callback);
  }

  this.availability = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpPost('/v1/availability', details.options, details.callback);
  }

  this.createEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpPost('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.createNotificationChannel = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpPost('/v1/channels', details.options, details.callback);
  }

  this.deleteEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.deleteExternalEvent = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
  }

  this.deleteNotificationChannel = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpDelete('/v1/channels/' + details.options.channel_id, details.options, details.callback, ['access_token', 'channel_id']);
  }

  this.elevatedPermissions = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpPost('/v1/permissions', details.options, details.callback);
  }

  this.freeBusy = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet(details.options.next_page || '/v1/free_busy', details.options, details.callback);
  }

  this.listCalendars = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet('/v1/calendars', details.options, details.callback);
  }

  this.listNotificationChannels = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet('/v1/channels', details.options, details.callback);
  }

  this.profileInformation = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet('/v1/profiles', details.options, details.callback);
  }

  this.readEvents = function(){
    var details = parseArguments(arguments, ["access_token"]);

    return httpGet(details.options.next_page || '/v1/events', details.options, details.callback);
  }

  this.refreshAccessToken = function(){
    var details = parseArguments(arguments, ["client_id", "client_secret", "refresh_token"]);

    details.options.grant_type = "refresh_token";

    return httpPost('/oauth/token', details.options).then(tap(function(token){
      config.access_token = token.access_token;
      config.refresh_token = token.refresh_token;


      if(details.callback){
        details.callback(null, token);
      }
    }), details.callback);
  }

  this.requestAccessToken = function(){
    var details = parseArguments(arguments, ["client_id", "client_secret", "refresh_token"]);

    details.options.grant_type = "authorization_code";

    return httpPost('/oauth/token', details.options).then(tap(function(token){
      config.access_token = token.access_token;
      config.refresh_token = token.refresh_token;

      if(details.callback){
        details.callback(null, token);
      }
    }), details.callback);
  }

  this.revokeAuthorization = function(){
    var details = parseArguments(arguments, ["client_id", "client_secret", "refresh_token"]);

    return httpPost('/oauth/token/revoke', details.options).then(tap(function(){
      delete config.access_token;
      delete config.refresh_token;

      if(details.callback){
        details.callback();
      }
    }), details.callback);
  }

  var urls = {
    api: 'http://local' + (config.dataCenter ? '-' + config.dataCenter : '') + '.cronofy.com'
  };

  var httpGet = function(path, options, callback, optionsToOmit){
    return httpCall('GET', path, options, callback, optionsToOmit);
  }

  var httpPost = function(path, options, callback, optionsToOmit){
    return httpCall('POST', path, options, callback, optionsToOmit);
  }

  var httpDelete = function(path, options, callback, optionsToOmit){
    return httpCall('DELETE', path, options, callback, optionsToOmit);
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

    return new Promise(function(resolve, reject){
      rest(settings).then(function(result){
        if(callback){
          callback(null, result['entity']);
        } else {
          resolve(result['entity']);
        }
      }, function(err){
        var error = new Error(JSON.stringify(err.entity));
        error.statusCode = err.status.code;

        if(callback){
          callback(error);
        } else {
          reject(error);
        }
      });
    });
  }

  var parseArguments = function(args, configDefaults){
    var parsed = {options: {}, callback: null};

    if(args.length == 2){
      parsed.options = args[0];
      parsed.callback = args[1];
    } else {
      switch(typeof args[0]){
        case "object":
          parsed.options = args[0];
          break;
        case "function":
          parsed.callback = args[0];
          break;
      }
    }

    for(var i = 0; i < configDefaults.length; i++){
      var key = configDefaults[i];

      parsed.options[key] = parsed.options[key] || config[key];
    }

    return parsed;
  }
}

export default cronofy;
