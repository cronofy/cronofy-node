'use strict';

var _ = require('lodash');
var rest = require('./lib/rest-client');

var tap = function (func) {
  return function (value) {
    func.apply(null, arguments);
    return value;
  };
};

var cronofy = function (config) {
  if (!this || this.constructor !== cronofy) {
    throw new Error('Cronofy must be called as a constructor');
  }

  this.config = config;

  this.urls = {
    api: 'https://api' + (config.dataCenter ? '-' + config.dataCenter : '') + '.cronofy.com'
  };
};

cronofy.prototype._httpCall = function (method, path, options, callback, optionsToOmit) {
  var settings = {
    method: method,
    path: path,
    headers: {
      Authorization: 'Bearer ' + (options.access_token || options.bearer_token),
      'Content-Type': 'application/json'
    }
  };
  settings[method === 'GET' ? 'params' : 'entity'] = _.omit(options, optionsToOmit || ['access_token']);

  return new Promise(function (resolve, reject) {
    rest(settings).then(function (result) {
      if (callback) {
        callback(null, result['entity']);
      } else {
        resolve(result['entity']);
      }
    }, function (err) {
      var error = new Error(JSON.stringify(err.entity));

      error.error = err;

      if (err.status) {
        error.statusCode = err.status.code;
      }

      if (callback) {
        callback(error);
      } else {
        reject(error);
      }
    });
  });
};

cronofy.prototype._parseArguments = function (args, configDefaults) {
  var parsed = {options: {}, callback: null};

  if (args.length === 2) {
    parsed.options = args[0];
    parsed.callback = args[1];
  } else {
    switch (typeof args[0]) {
      case 'object':
        parsed.options = args[0];
        break;
      case 'function':
        parsed.callback = args[0];
        break;
    }
  }

  for (var i = 0; i < configDefaults.length; i++) {
    var key = configDefaults[i];

    parsed.options[key] = parsed.options[key] || this.config[key];
  }

  return parsed;
};

cronofy.prototype._httpGet = function (path, options, callback, optionsToOmit) {
  return this._httpCall('GET', this.urls.api + path, options, callback, optionsToOmit);
};

cronofy.prototype._httpPost = function (path, options, callback, optionsToOmit) {
  return this._httpCall('POST', this.urls.api + path, options, callback, optionsToOmit);
};

cronofy.prototype._httpDelete = function (path, options, callback, optionsToOmit) {
  return this._httpCall('DELETE', this.urls.api + path, options, callback, optionsToOmit);
};

cronofy.prototype.accountInformation = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpGet('/v1/account', details.options, details.callback);
};

cronofy.prototype.addToCalendar = function () {
  var details = this._parseArguments(arguments, ['client_id', 'client_secret']);

  return this._httpPost('/v1/add_to_calendar', details.options, details.callback);
};

cronofy.prototype.realTimeScheduling = function () {
  var details = this._parseArguments(arguments, ['client_id', 'client_secret']);

  return this._httpPost('/v1/real_time_scheduling', details.options, details.callback);
};

cronofy.prototype.authorizeWithServiceAccount = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/service_account_authorizations', details.options, details.callback);
};

cronofy.prototype.availability = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/availability', details.options, details.callback);
};

cronofy.prototype.createEvent = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
};

cronofy.prototype.createNotificationChannel = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/channels', details.options, details.callback);
};

cronofy.prototype.deleteEvent = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
};

cronofy.prototype.deleteExternalEvent = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpDelete('/v1/calendars/' + details.options.calendar_id + '/events', details.options, details.callback, ['access_token', 'calendar_id']);
};

cronofy.prototype.deleteNotificationChannel = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpDelete('/v1/channels/' + details.options.channel_id, details.options, details.callback, ['access_token', 'channel_id']);
};

cronofy.prototype.elevatedPermissions = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/permissions', details.options, details.callback);
};

cronofy.prototype.freeBusy = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpGet(details.options.next_page || '/v1/free_busy', details.options, details.callback);
};

cronofy.prototype.listCalendars = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpGet('/v1/calendars', details.options, details.callback);
};

cronofy.prototype.createCalendar = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/calendars', details.options, details.callback);
};

cronofy.prototype.listNotificationChannels = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpGet('/v1/channels', details.options, details.callback);
};

cronofy.prototype.profileInformation = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpGet('/v1/profiles', details.options, details.callback);
};

cronofy.prototype.readEvents = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  if (details.options.next_page) {
    return this._httpCall('GET', details.options.next_page, details.options, details.callback, ['access_token', 'next_page']);
  }

  return this._httpGet('/v1/events', details.options, details.callback);
};

cronofy.prototype.revokeProfileAuthorization = function () {
  var details = this._parseArguments(arguments, ['access_token']);

  return this._httpPost('/v1/profiles/' + details.options.profile_id + '/revoke', details.options, details.callback);
};

cronofy.prototype.refreshAccessToken = function () {
  var that = this;
  var details = this._parseArguments(arguments, ['client_id', 'client_secret', 'refresh_token']);

  details.options.grant_type = 'refresh_token';

  return this._httpPost('/oauth/token', details.options).then(tap(function (token) {
    that.config.access_token = token.access_token;
    that.config.refresh_token = token.refresh_token;

    if (details.callback) {
      details.callback(null, token);
    }
  }), details.callback);
};

cronofy.prototype.requestAccessToken = function () {
  var that = this;
  var details = this._parseArguments(arguments, ['client_id', 'client_secret', 'refresh_token']);

  details.options.grant_type = 'authorization_code';

  return this._httpPost('/oauth/token', details.options).then(tap(function (token) {
    that.config.access_token = token.access_token;
    that.config.refresh_token = token.refresh_token;

    if (details.callback) {
      details.callback(null, token);
    }
  }), details.callback);
};

cronofy.prototype.revokeAuthorization = function () {
  var that = this;
  var details = this._parseArguments(arguments, ['client_id', 'client_secret', 'refresh_token']);

  return this._httpPost('/oauth/token/revoke', details.options).then(tap(function () {
    delete that.config.access_token;
    delete that.config.refresh_token;

    if (details.callback) {
      details.callback();
    }
  }), details.callback);
};

cronofy.prototype.getSmartInvite = function () {
  var details = this._parseArguments(arguments, ['smart_invite_id', 'recipient_email', 'client_secret']);

  details.options.bearer_token = details.options.client_secret;

  return this._httpGet('/v1/smart_invites', details.options, details.callback, ['client_secret', 'access_token', 'bearer_token']);
};

cronofy.prototype.createSmartInvite = function () {
  var details = this._parseArguments(arguments, ['client_secret']);

  details.options.bearer_token = details.options.client_secret;

  return this._httpPost('/v1/smart_invites', details.options, details.callback, ['access_token', 'client_secret', 'bearer_token']);
};

cronofy.prototype.cancelSmartInvite = function () {
  var details = this._parseArguments(arguments, ['client_secret']);

  details.options.bearer_token = details.options.client_secret;
  details.options.method = 'cancel';

  return this._httpPost('/v1/smart_invites', details.options, details.callback, ['access_token', 'client_secret', 'bearer_token']);
};

module.exports = cronofy;
