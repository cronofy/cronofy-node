'use strict';

import rest from 'rest';
import defaultRequest from 'rest/interceptor/defaultRequest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

const client = rest
  .wrap(defaultRequest, { headers: { 'User-Agent': 'Cronofy Node' } })
  .wrap(mime, { mime: 'application/json' })
  .wrap(errorCode);

export default client;
