'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function elevatedPermissions (config, options, callback) {
  const settings = {
    method: 'POST',
    path: config.urls.api + '/v1/permissions',
    headers: {
      Authorization: 'Bearer ' + config.access_token,
      'Content-Type': 'application/json'
    },
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default elevatedPermissions;
