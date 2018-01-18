var expect = require('chai').expect;
var nock = require('nock');
var Cronofy = require('../src/index');

var api = new Cronofy({
  client_id: 'armzr1h5NPQST93XTFL9iIULXxfdDlmV',
  client_secret: 'aPPwd-ASDFAsdfasdfasdfsadfasdfASDFSADF_asdfasdfasdf',
  access_token: 'aLUj9bRInSj1n08pHPAo5ru0OOppDaCO',
  refresh_token: '5hdSBZHgjA4xcQAelyAYWDfezZv0-9yP'
});

describe('obtaining application calendar tokens', function () {
  it('returns new token information', function (done) {
    var applicationCalendarId = '12312312nakjsdnasd';

    var response = {
      'access_token': '0000-8iQY7N8CkeO_000000000',
      'token_type': 'bearer',
      'expires_in': 1800,
      'refresh_token': '0000000000000000-zHFvHoMDWYOS',
      'scope': 'read_write',
      'application_calendar_id': 'apc_5a5f2cbee0cf2442bb000008',
      'linking_profile': {
        'provider_name': 'cronofy',
        'profile_id': 'pro_5a5f2cbee0cf2442bb000001'
      }
    };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Content-Type': 'application/json'
      }
    })
      .post('/v1/application_calendars', {
        client_id: api.config.client_id,
        client_secret: api.config.client_secret,
        application_calendar_id: applicationCalendarId
      })
      .reply(200, response);

    api.applicationCalendar({ application_calendar_id: applicationCalendarId }, function (_, result) {
      expect(result).to.deep.equal(response);
      done();
    });
  });
});
