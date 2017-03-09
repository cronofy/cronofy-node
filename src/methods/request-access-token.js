'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';
import rest from '../lib/rest-client';

function requestAccessToken (config, options, callback) {
  options.refresh_token = config.refreshToken;
  
  options.client_id = config.clientId;
  options.client_secret = config.clientSecret;

  const settings = {
    method: 'POST',
    path: config.urls.api + '/oauth/token',
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default requestAccessToken;
