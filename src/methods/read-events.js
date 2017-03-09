'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function readEvents (config, options, callback) {
  const settings = {
    method: 'GET',
    path: options.next_page || config.urls.api + '/v1/events',
    headers: {
      Authorization: 'Bearer ' + config.access_token
    },
    params: _.omit(options, 'next_page')
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default readEvents;
