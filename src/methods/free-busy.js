'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function freeBusy (config, options, callback) {
  const settings = {
    method: 'GET',
    path: config.urls.api + '/v1/free_busy',
    headers: {
      Authorization: 'Bearer ' + config.access_token
    },
    params: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default freeBusy;
