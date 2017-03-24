'use strict';

import _ from 'lodash';
import nodefn from 'when/node';
import { reach } from 'origami';

import rest from '../lib/rest-client';

function addToCalendar (options, callback) {
  const settings = {
    method: 'POST',
    path: options.urls.api + `/v1/add_to_calendar/`,
    headers: {
    },
    entity: _.omit(options)
  };
  const result = rest(settings).fold(reach, 'entity');

  return nodefn.bindCallback(result, callback);
}

export default addToCalendar;
