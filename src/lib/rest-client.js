'use strict';

import rest from 'rest';
import mime from 'rest/interceptor/mime';
import errorCode from 'rest/interceptor/errorCode';

const client = rest
  .wrap(mime, { mime: 'application/x-www-form-urlencoded' })
  .wrap(errorCode);

export default client;
