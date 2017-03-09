'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';
import rest from '../lib/rest-client';

function refreshAccessToken (config, options, callback) {
  options = options || {};

  options.grant_type = options.grant_type || 'refresh_token';

  options.refresh_token = options.refresh_token || config.refresh_token;

  options.client_id = options.client_id || config.client_id;
  options.client_secret = options.client_secret || config.client_secret;

  const settings = {
    method: 'POST',
    path: config.urls.api + '/oauth/token',
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default refreshAccessToken;
