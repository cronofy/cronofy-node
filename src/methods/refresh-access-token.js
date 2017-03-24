'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';
import rest from '../lib/rest-client';

function refreshAccessToken (config, callback) {
  options = {
    grant_type: 'refresh_token',
    refresh_token: config.refresh_token,
    client_id: config.client_id,
    client_secret: config.client_secret
  };

  const settings = {
    method: 'POST',
    path: config.urls.api + '/oauth/token',
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default refreshAccessToken;
