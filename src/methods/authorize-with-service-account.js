'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function authorizeWithServiceAccount (config, options, callback) {
  const settings = {
    method: 'POST',
    path: config.urls.api + `/v1/service_account_authorizations/`,
    headers: {
      Authorization: 'Bearer ' + config.access_token
    },
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default authorizeWithServiceAccount;
