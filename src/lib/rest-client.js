'use strict';

import rest from 'rest';
import errorCode from 'rest/interceptor/errorCode';

const restClient = rest.wrap(errorCode);

export default restClient;
