'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function listNotificationChannel (config, options, callback) {
  const settings = {
    method: 'GET',
    path: config.urls.api + '/v1/channels',
    headers: {
      Authorization: 'Bearer ' + config.access_token
    }
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default listNotificationChannel;
