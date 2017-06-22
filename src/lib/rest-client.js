'use strict';

var rest = require('rest');
var defaultRequest = require('rest/interceptor/defaultRequest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');

var client = rest
  .wrap(defaultRequest, { headers: { 'User-Agent': 'Cronofy Node' } })
  .wrap(mime, { mime: 'application/json' })
  .wrap(errorCode);

module.exports = client;
