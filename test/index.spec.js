var _ = require('lodash');
var expect = require('chai').expect;
var nock = require('nock');
var zlib = require('zlib');
var Cronofy = require('../src/index');

var api = new Cronofy({
  client_id: 'armzr1h5NPQST93XTFL9iIULXxfdDlmV',
  client_secret: 'aPPwd-ASDFAsdfasdfasdfsadfasdfASDFSADF_asdfasdfasdf',
  access_token: 'aLUj9bRInSj1n08pHPAo5ru0OOppDaCO',
  refresh_token: '5hdSBZHgjA4xcQAelyAYWDfezZv0-9yP'
});

describe('Get Account Information', function () {
  it('returns account information', function (done) {
    var accountResponse = { 'sub': 'acc_5700a00eb0ccd07000000000', 'cronofy.type': 'account' };
    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/account')
      .reply(200, accountResponse);

    api.accountInformation(function (_, result) {
      expect(result).to.deep.equal(accountResponse);
      done();
    });
  });

  it('returns context unauthorized request error', function (done) {
    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/account')
      .reply(401, {
        'WWW-Authenticate': 'Example Authentication Error'
      });

    api.accountInformation(function (err, _) {
      expect(err.error.url).to.equal('https://api.cronofy.com/v1/account');
      expect(err.message).to.equal('{"WWW-Authenticate":"Example Authentication Error"}');
      expect(err.error.entity['WWW-Authenticate']).to.equal('Example Authentication Error');
      expect(err.statusCode).to.equal(401);
      done();
    });
  });

  it('returns userinfo', function (done) {
    var accountResponse = {
      'sub': 'acc_5700a00eb0ccd07000000000',
      'email': 'janed@company.com',
      'name': 'Jane Doe',
      'zoneinfo': 'Europe/London',
      'cronofy.type': 'account',
      'cronofy.data': {
        'authorization': {
          'scope': 'read_write'
        },
        'profiles': [
          {
            'provider_name': 'google',
            'profile_id': 'pro_n23kjnwrw2',
            'profile_name': 'example@cronofy.com'
          }
        ]
      }
    };
    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/userinfo')
      .reply(200, accountResponse);

    api.userInfo(function (_, result) {
      expect(result).to.deep.equal(accountResponse);
      done();
    });
  });
});

describe('accept encoding', function () {
  it('can receive a compressed post', function (done) {
    var smartInviteRequest = {
      'recipient': {
        'email': 'cronofy@example.com'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London'
      },
      'organizer': {
        'name': 'Smart invite application'
      }
    };

    var smartInviteResponse = {
      'recipient': {
        'email': 'cronofy@example.com',
        'status': 'pending'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London',
        'location': {
          'description': 'Board room'
        }
      },
      'attachments': {
        'icalendar': 'BEGIN:VCALENDAR\nVERSION:2.0...'
      }
    };

    var buf = JSON.stringify(smartInviteResponse);
    var compressedResponse = zlib.gzipSync(buf);

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.client_secret,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
      }
    })
      .post('/v1/smart_invites', smartInviteRequest)
      .reply(200, compressedResponse, { 'Content-Encoding': 'gzip' });

    api.createSmartInvite(_.cloneDeep(smartInviteRequest), function (_, result) {
      expect(JSON.stringify(result)).to.equal(JSON.stringify(smartInviteResponse));
      done();
    });
  });
});

describe('token refresh', function () {
  it('returns new token information', function (done) {
    var refreshToken = '12312312nakjsdnasd';

    var refreshResponse = {
      token_type: 'bearer',
      access_token: '090jsadkasdkjnasda',
      expires_in: 3600,
      refresh_token: '894576984569kasbdkasbd',
      scope: 'create_event'
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .post('/oauth/token', {
        client_id: api.config.client_id,
        client_secret: api.config.client_secret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .reply(200, refreshResponse);

    api.refreshAccessToken({ refresh_token: refreshToken }, function (_, result) {
      expect(result).to.deep.equal(refreshResponse);
      done();
    });
  });

  it('returns context for unrecognized token', function (done) {
    var refreshToken = '12312312nakjsdnasd';

    nock('https://api.cronofy.com', {
      reqheaders: {
        'content-type': 'application/json'
      }
    })
      .post('/oauth/token', {
        client_id: api.config.client_id,
        client_secret: api.config.client_secret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
      .reply(400, { error: 'invalid_grant' });

    api.refreshAccessToken({ refresh_token: refreshToken }, function (err, _) {
      expect(err.error.url).to.equal('https://api.cronofy.com/oauth/token');
      expect(err.error.entity).to.deep.equal({ 'error': 'invalid_grant' });
      done();
    });
  });
});

describe('query parameters encoding', function () {
  it('returns read events information', function (done) {
    var readEventsResponse = {
      'pages': {
        'current': 1,
        'total': 2,
        'next_page': 'https://api.cronofy.com/v1/events/pages/08a07b034306679e'
      },
      'events': [
        {
          'calendar_id': 'cal_U9uuErStTG@EAAAB_IsAsykA2DBTWqQTf-f0kJw',
          'event_uid': 'evt_external_54008b1a4a41730f8d5c6037',
          'summary': 'Company Retreat',
          'description': '',
          'start': '2014-09-06',
          'end': '2014-09-08',
          'deleted': false,
          'created': '2014-09-01T08:00:01Z',
          'updated': '2014-09-01T09:24:16Z',
          'location': {
            'description': 'Beach'
          },
          'participation_status': 'needs_action',
          'attendees': [
            {
              'email': 'example@cronofy.com',
              'display_name': 'Example Person',
              'status': 'needs_action'
            }
          ],
          'organizer': {
            'email': 'example@cronofy.com',
            'display_name': 'Example Person'
          },
          'transparency': 'opaque',
          'status': 'confirmed',
          'categories': [],
          'recurring': false,
          'options': {
            'delete': true,
            'update': true,
            'change_participation_status': true
          }
        }
      ]
    };

    var args = {
      calendar_ids: ['acc_123'],
      include_deleted: true,
      tzid: 'Etc/UTC'
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/events?calendar_ids%5B%5D=acc_123&include_deleted=true&tzid=Etc%2FUTC')
      .reply(200, readEventsResponse);

    api.readEvents(_.cloneDeep(args), function (_, result) {
      expect(result).to.deep.equal(readEventsResponse);
      done();
    });
  });
});

describe('Smart Invites', function () {
  it('can create an invite', function (done) {
    var smartInviteRequest = {
      'recipient': {
        'email': 'cronofy@example.com'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London'
      }
    };

    var smartInviteResponse = {
      'recipient': {
        'email': 'cronofy@example.com',
        'status': 'pending'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London',
        'location': {
          'description': 'Board room'
        }
      },
      'attachments': {
        'icalendar': 'BEGIN:VCALENDAR\nVERSION:2.0...'
      }
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.client_secret,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/smart_invites', smartInviteRequest)
      .reply(200, smartInviteResponse);

    api.createSmartInvite(_.cloneDeep(smartInviteRequest), function (_, result) {
      expect(result).to.deep.equal(smartInviteResponse);
      done();
    });
  });

  it('can cancel an invite', function (done) {
    var smartInviteRequest = {
      'method': 'cancel',
      'recipient': {
        'email': 'cronofy@example.com'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite'
    };

    var smartInviteResponse = {
      'method': 'cancel',
      'recipient': {
        'email': 'cronofy@example.com',
        'status': 'pending'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London',
        'location': {
          'description': 'Board room'
        }
      },
      'attachments': {
        'icalendar': 'BEGIN:VCALENDAR\nVERSION:2.0...'
      }
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.client_secret,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/smart_invites', smartInviteRequest)
      .reply(200, smartInviteResponse);

    var args = {
      'recipient': {
        'email': 'cronofy@example.com'
      },
      'smart_invite_id': 'your-unique-identifier-for-invite'
    };

    api.cancelSmartInvite(_.cloneDeep(args), function (_, result) {
      expect(result).to.deep.equal(smartInviteResponse);
      done();
    });
  });

  it('returns smart invite', function (done) {
    var smartInviteResponse = {
      'recipient': {
        'email': 'cronofy@example.com',
        'status': 'pending'
      },
      'replies': [
        {
          'email': 'person1@example.com',
          'status': 'accepted'
        },
        {
          'email': 'person2@example.com',
          'status': 'declined'
        }
      ],
      'smart_invite_id': 'your-unique-identifier-for-invite',
      'callback_url': 'https://example.yourapp.com/cronofy/smart_invite/notifications',
      'event': {
        'summary': 'Board meeting',
        'description': 'Discuss plans for the next quarter.',
        'start': '2017-10-05T09:30:00Z',
        'end': '2017-10-05T10:00:00Z',
        'tzid': 'Europe/London',
        'location': {
          'description': 'Board room'
        }
      }
    };

    var email = 'example@cronofy.com';
    var inviteId = 'example-invite-id';

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.client_secret,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/smart_invites')
      .query({ 'smart_invite_id': inviteId, 'recipient_email': email })
      .reply(200, smartInviteResponse);

    api.getSmartInvite({ 'smart_invite_id': inviteId, 'recipient_email': email }, function (_, result) {
      expect(result).to.deep.equal(smartInviteResponse);
      done();
    });
  });
});

describe('Availability Rules', function () {
  it('can upsert a rule', function (done) {
    var availabilityRuleRequest = {
      'availability_rule_id': 'default',
      'tzid': 'America/Chicago',
      'calendar_ids': [
        'cal_n23kjnwrw2_jsdfjksn234'
      ],
      'weekly_periods': [
        {
          'day': 'monday',
          'start_time': '09:30',
          'end_time': '12:30'
        },
        {
          'day': 'wednesday',
          'start_time': '09:30',
          'end_time': '12:30'
        }
      ]
    };

    var availabilityRuleResponse = {
      'availability_rule_id': 'default',
      'tzid': 'America/Chicago',
      'calendar_ids': [
        'cal_n23kjnwrw2_jsdfjksn234'
      ],
      'weekly_periods': [
        {
          'day': 'monday',
          'start_time': '09:30',
          'end_time': '12:30'
        },
        {
          'day': 'wednesday',
          'start_time': '09:30',
          'end_time': '12:30'
        }
      ]
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/availability_rules', availabilityRuleRequest)
      .reply(200, availabilityRuleResponse);

    api.upsertAvailabilityRule(_.cloneDeep(availabilityRuleRequest), function (_, result) {
      expect(result).to.deep.equal(availabilityRuleResponse);
      done();
    });
  });

  it('can read a rule', function (done) {
    var availabilityRuleId = 'default';
    var availabilityRuleResponse = {
      'availability_rule_id': availabilityRuleId,
      'tzid': 'America/Chicago',
      'calendar_ids': [
        'cal_n23kjnwrw2_jsdfjksn234'
      ],
      'weekly_periods': [
        {
          'day': 'monday',
          'start_time': '09:30',
          'end_time': '12:30'
        },
        {
          'day': 'wednesday',
          'start_time': '09:30',
          'end_time': '12:30'
        }
      ]
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/availability_rules/' + availabilityRuleId)
      .reply(200, availabilityRuleResponse);

    api.readAvailabilityRule({ 'availability_rule_id': availabilityRuleId }, function (_, result) {
      expect(result).to.deep.equal(availabilityRuleResponse);
      done();
    });
    nock.isDone();
  });

  it('can delete a rule', function (done) {
    var availabilityRuleId = 'default';

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .delete('/v1/availability_rules', { 'availability_rule_id': availabilityRuleId })
      .reply(202);

    api.deleteAvailabilityRule({ 'availability_rule_id': availabilityRuleId }, function (_, result) {
      done();
    });
    nock.isDone();
  });

  it('can list rules', function (done) {
    var availabilityRulesResponse = [
      {
        'availability_rule_id': 'default',
        'tzid': 'America/Chicago',
        'calendar_ids': [
          'cal_n23kjnwrw2_jsdfjksn234'
        ],
        'weekly_periods': [
          {
            'day': 'monday',
            'start_time': '09:30',
            'end_time': '12:30'
          },
          {
            'day': 'wednesday',
            'start_time': '09:30',
            'end_time': '12:30'
          }
        ]
      },
      {
        'availability_rule_id': 'special',
        'tzid': 'America/New_York',
        'calendar_ids': [
          'cal_n23kjnwrw2_jsdfjksn234'
        ],
        'weekly_periods': [
          {
            'day': 'monday',
            'start_time': '09:30',
            'end_time': '12:30'
          },
          {
            'day': 'tuesday',
            'start_time': '09:30',
            'end_time': '12:30'
          }
        ]
      }
    ];

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/availability_rules')
      .reply(200, availabilityRulesResponse);

    api.listAvailabilityRules(function (_, result) {
      expect(result).to.deep.equal(availabilityRulesResponse);
      done();
    });
  });
});

describe('Business connect', function () {
  it('lists accessible calendars', function (done) {
    var calendarsResponse = {
      'accessible_calendars': [
        {
          'calendar_type': 'resource',
          'email': 'board-room-london@example.com',
          'name': 'Board room (London)'
        },
        {
          'calendar_type': 'unknown',
          'email': 'jane.doe@example.com',
          'name': 'Jane Doe'
        },
        {
          'calendar_type': 'unknown',
          'email': 'alpha.team@example.com',
          'name': 'Alpha Team'
        }
      ]
    };
    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .get('/v1/accessible_calendars')
      .reply(200, calendarsResponse);

    api.listAccessibleCalendars(function (_, result) {
      expect(result).to.deep.equal(calendarsResponse);
      done();
    });
  });

  it('delegates authorizations', function (done) {
    var delegatedAuthorizationsRequest = {
      'profile_id': '{PROFILE_ID}',
      'email': '{EMAIL_OF_ACCOUNT_TO_ACCESS}',
      'callback_url': '{CALLBACK_URL}',
      'scope': '{SCOPES}',
      'state': '{STATE}'
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/delegated_authorizations', delegatedAuthorizationsRequest)
      .reply(202);

    api.listAccessibleCalendars(_.cloneDeep(delegatedAuthorizationsRequest), function (_, result) {
      done();
    });
    nock.isDone();
  });
});

describe('Real-Time Scheduling', function () {
  it('creates an RTS link', function (done) {
    var RTSRequest = {
      'oauth': {
        'redirect_uri': 'REDIRECT_URI'
      },
      'event': {
        'tzid': 'TZID'
      },
      'availability': 'AVAILABILITY'
    };

    var RTSResponse = {
      'real_time_scheduling': {
        'real_time_scheduling_id': 'sch_4353945880944395',
        'url': '{REAL_TIME_SCHEDULING_URL}'
      }
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.client_secret,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/real_time_scheduling', RTSRequest)
      .reply(200, RTSResponse);

    api.realTimeScheduling(_.cloneDeep(RTSRequest), function (_, result) {
      expect(result).to.deep.equal(RTSResponse);
      done();
    });
  });
});

describe('Batch', function () {
  it('batches requests', function (done) {
    var bacthRequest = {
      'batch': [
        {
          'method': 'DELETE',
          'relative_url': '/v1/calendars/cal_123_abc/events',
          'data': {
            'event_id': '456'
          }
        },
        {
          'method': 'POST',
          'relative_url': '/v1/calendars/cal_123_abc/events',
          'data': {
            'event_id': 'qTtZdczOccgaPncGJaCiLg',
            'description': 'Discuss plans for the next quarter.',
            'start': '2014-08-05T15:30:00Z',
            'end': '2014-08-05T17:00:00Z',
            'location': {
              'description': 'Board room'
            }
          }
        }
      ]
    };

    var batchResponse = {
      'batch': [
        { 'status': 202 },
        {
          'status': 422,
          'data': {
            'errors': {
              'summary': [
                { 'key': 'errors.required', 'description': 'summary must be specified' }
              ]
            }
          }
        }
      ]
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/batch', bacthRequest)
      .reply(207, batchResponse);

    api.batch(_.cloneDeep(bacthRequest), function (_, result) {
      expect(result).to.deep.equal(batchResponse);
      done();
    });
  });
});

describe('Data Center config property name normalization', function () {
  it('allows data_center', function () {
    var api = new Cronofy({
      data_center: 'de'
    });

    expect(api.urls.api).to.eq('https://api-de.cronofy.com');
  });

  it('allows dataCenter', function () {
    var api = new Cronofy({
      dataCenter: 'de'
    });

    expect(api.urls.api).to.eq('https://api-de.cronofy.com');
  });

  it('prefers data_center', function () {
    var api = new Cronofy({
      data_center: 'de',
      dataCenter: 'uk'
    });

    expect(api.urls.api).to.eq('https://api-de.cronofy.com');
  });

  it('uses US by default', function () {
    var api = new Cronofy({});

    expect(api.urls.api).to.eq('https://api.cronofy.com');
  });
});

describe('HMAC validation', function () {
  it('verifies the correct HMAC', () => {
    const result = api.hmacValid({ hmac: '0g6bhIumRlRffctPXuASSl3u6AXOxnYRw+hiTp7IvTg=', body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(true);
  });

  it('rejects the wrong HMAC', () => {
    const result = api.hmacValid({ hmac: 'something-else', body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(false);
  });

  it('verifies the correct HMAC when one of the multiple HMACs splitted by "," match', () => {
    const result = api.hmacValid({ hmac: 'something-else,0g6bhIumRlRffctPXuASSl3u6AXOxnYRw+hiTp7IvTg=,38ArsN7+J/O8joGsgirVEdV16a/+eb+5QgHGIiuv4hk=', body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(true);
  });

  it('rejects when multiple HMACs splitted by "," dont match', () => {
    const result = api.hmacValid({ hmac: 'something-else,38ArsN7+J/O8joGsgirVEdV16a/+eb+5QgHGIiuv4hk=', body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(false);
  });

  it('rejects if HMAC is null', () => {
    const result = api.hmacValid({ hmac: null, body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(false);
  });

  it('rejects if HMAC is empty', () => {
    const result = api.hmacValid({ hmac: '', body: '{"example":"well-known"}' });
    expect(result).to.deep.equal(false);
  });
});
