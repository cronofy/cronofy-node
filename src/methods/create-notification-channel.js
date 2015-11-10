'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function createNotificationChannel (options, callback) {
  const settings = {
    method: 'POST',
    path: 'https://api.cronofy.com/v1/channels',
    headers: {
      Authorization: 'Bearer ' + options.access_token
    },
    params: _.omit(options, 'access_token')
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default createNotificationChannel;
