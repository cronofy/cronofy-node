var expect = require('chai').expect;
var nock = require('nock');
var Cronofy = require('../src/index');

var api = new Cronofy({
  access_token: 'aLUj9bRInSj1n08pHPAo5ru0OOppDaCO'
});

describe('bulk delete from calendar', function () {
  it('deletes from the calendar', function (done) {
    var response = { 'foo': 'bar' };
    var calendarIds = [ 'cal_123', 'cal_456' ];

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .delete('/v1/events', {
        calendar_ids: calendarIds
      })
      .reply(200, response);

    api.bulkDeleteEvents({ calendar_ids: calendarIds }, function (_, result) {
      expect(result).to.deep.equal(response);
      done();
    });
  });
});

describe('bulk delete from all', function () {
  it('deletes from the calendar', function (done) {
    var response = { 'foo': 'bar' };

    nock('https://api.cronofy.com', {
      reqheaders: {
        'Authorization': 'Bearer ' + api.config.access_token,
        'Content-Type': 'application/json'
      }
    })
      .delete('/v1/events', {
        delete_all: true
      })
      .reply(200, response);

    api.bulkDeleteEvents({ delete_all: true }, function (_, result) {
      expect(result).to.deep.equal(response);
      done();
    });
  });
});
