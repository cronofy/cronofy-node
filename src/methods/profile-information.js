'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function profileInformation (options, callback) {
  const settings = {
    method: 'GET',
    path: options.urls.api + '/v1/profiles',
    headers: {
      Authorization: 'Bearer ' + options.access_token
    }
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default profileInformation;
