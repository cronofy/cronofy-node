var _ = require('lodash');
var expect = require('chai').expect;
var nock = require('nock');
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
