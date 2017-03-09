'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function deleteExternalEvent (config, options, callback) {
  const settings = {
    method: 'DELETE',
    path: config.urls.api + `/v1/calendars/${options.calendar_id}/events`,
    headers: {
      Authorization: 'Bearer ' + config.access_token
    },
    entity: _.omit(options, ['calendar_id'])
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default deleteExternalEvent;
