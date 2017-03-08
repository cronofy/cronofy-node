'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function elevatedPermissions (options, callback) {
  const settings = {
    method: 'POST',
    path: options.urls.api + '/v1/permissions',
    headers: {
      Authorization: 'Bearer ' + options.access_token,
      'Content-Type': 'application/json'
    },
    entity: _.omit(options, ['access_token'])
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default elevatedPermissions;
