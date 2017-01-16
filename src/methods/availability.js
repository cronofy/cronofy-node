'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function availability (options, callback) {
  const settings = {
    method: 'GET',
    path: 'https://api.cronofy.com/v1/availability',
    headers: {
      Authorization: 'Bearer ' + options.access_token
    },
    params: _.omit(options, 'access_token')
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default availability;
