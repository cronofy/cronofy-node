'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';
import rest from '../lib/rest-client';

function revokeAuthorization (options, callback) {
  const settings = {
    method: 'POST',
    path: 'https://api.cronofy.com/oauth/token/revoke',
    entity: options
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default revokeAuthorization;
