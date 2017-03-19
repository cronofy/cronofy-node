'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function freeBusy (options, callback) {
  const settings = {
    method: 'GET',
    path: options.next_page || options.urls.api + '/v1/free_busy',
    headers: {
      Authorization: 'Bearer ' + options.access_token
    },
    params: _.omit(options, 'access_token', 'next_page')
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default freeBusy;
