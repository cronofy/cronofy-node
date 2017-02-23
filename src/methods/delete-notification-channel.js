'use strict';

import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function deleteNotificationChannel (options, callback) {
  const settings = {
    method: 'DELETE',
    path: options.urls.api + `/v1/channels/${options.channel_id}`,
    headers: {
      Authorization: 'Bearer ' + options.access_token
    }
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default deleteNotificationChannel;
