'use strict';

const methods = {
  accountInformation: require('./methods/account-information'),
  createEvent: require('./methods/create-event'),
  createNotificationChannel: require('./methods/create-notification-channel'),
  deleteEvent: require('./methods/delete-event'),
  deleteNotificationChannel: require('./methods/delete-notification-channel'),
  freeBusy: require('./methods/free-busy'),
  listCalendars: require('./methods/list-calendars'),
  listNotificationChannels: require('./methods/list-notification-channels'),
  profileInformation: require('./methods/profile-information'),
  readEvents: require('./methods/read-events'),
  refreshAccessToken: require('./methods/refresh-access-token'),
  requestAccessToken: require('./methods/request-access-token'),
  revokeAuthorization: require('./methods/revoke-authorization')
};

module.exports = methods;

