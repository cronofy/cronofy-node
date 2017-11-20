# cronofy-node [![Build Status](https://travis-ci.org/cronofy/cronofy-node.svg?branch=master)](https://travis-ci.org/cronofy/cronofy-node)

A simple wrapper for the [Cronofy API](https://www.cronofy.com/developers/api/).

## Basic Usage

The APIs should be one to one with the all of the current methods in [Cronofy's documentation](https://www.cronofy.com/developers/api/). The general pattern is that each method takes an options object and an optional callback. If a callback is not passed in as the second argument the function will act as a promise.

#### Usage Example

```node
var Cronofy = require('cronofy');

var cronofyClient = new Cronofy({
  client_id: 'armzr1h5NPQST93XTFL9iIULXxfdDlmV',
  client_secret: 'aPPwd-ASDFAsdfasdfasdfsadfasdfASDFSADF_asdfasdfasdf',
  access_token: 'aLUj9bRInSj1n08pHPAo5ru0OOppDaCO',
  refresh_token: '5hdSBZHgjA4xcQAelyAYWDfezZv0-9yP'
});

var options = {
  code: 'asdkfj213sdf',
  redirect_uri: 'https://www.yoursite.com/calendar_redirect_page'
};

cronofyClient.requestAccessToken(options)
  .then(function(response){
    console.log(response);
  });

// Alternatively as a callback
cronofyClient.requestAccessToken(options, function(err, response){
  if(err) throw err;
  console.log(response);
})
```

### Parameters Note

The cronofy client object can be initialized with client and token details. These details will be automatically added to each call that they are needed for, but these values can be replaced by any specified in the method's `options` object.

## Functions available

### accountInformation([callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with an object containing the account information.

#### Response Example

```json
{
  "account": {
    "account_id": "acc_567236000909002",
    "email": "janed@company.com",
    "name": "Jane Doe",
    "default_tzid": "Europe/London"
  }
}
```

### createEvent(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **calendar_id** - required - the id of the calendar that the event will be created one.
 - **event_id** - required - An id for the event you want to create.
 - **summary** - required - The name or title of the event.
 - **description** - required - The Description or notes for the event.
 - **tzid** - The Timezone id of the event.
 - **start** - required -The Start time of the event as an ISO string.
 - **end** - required - The end time of the event as an ISO string.
 - **location** - An object containing a single key of 'description', whos value is a string of the event location.

### deleteEvent(options,[, callback])

Returns an empty string/promise for an empty string on success.

#### Options Object

 - **calendar_id** - required - the id of the calendar that the event will be deleted from.
 - **event_id** - required - An id for the event you want to delete.

### freeBusy(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with a list of free/busy information across all calendars.

#### Options Object

 - **from** - required - the state date/time as an ISO string.
 - **to** - required - the end date/time as an ISO string.

### listCalendars([callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of calendars for the user.

### profileInformation([callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with an array of the user's calendar profiles.

### readEvents(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an array of the user's events accross all calendars.

#### Options Object

- **from** - required - the start date as an ISO string.
- **to** - required - the end date as an ISO string.
- **tzid** - the timezone id for the query.
- **next_page** - url for the next page. This will still apply other options to the request.

### refreshAccessToken(options[, callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with the new refresh and access token information.

### requestAccessToken(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing an access and refresh token for you to use with future requests.

#### Options Object

 - **code** - required - The short-lived, single-use code issued to you when the user authorized your access to their account as part of an Authorization Request.
 - **redirect_uri** - required - The same HTTP or HTTPS URI you passed when requesting the user's authorization.

### revokeAuthorization([callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

### deleteExternalEvent(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **calendar_id** - required - the id of the calendar that the event will be deleted from.
 - **event_uid** - required - An id for the external event you want to delete.

### elevatedPermissions(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing a permissions URL with a token

#### Options Object

 - **permissions** - required - An array of objects with a calendar_id and permission_level
 - **redirect_uri** - required - Url to redirect the user to in order to grant or reject requested access

### authorizeWithServiceAccount(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **email** - required - The email of the user to be authorized
 - **scope** - required - The scopes to authorize for the user
 - **callback_url** - required - The URL to return to after the authorization

## Push Notification Methods

### createNotificationChannel(options,[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object with the new channel details.

#### Options Object

- **callback_url** - required - The HTTP or HTTPS URL you wish to receive push notifications. Must not be longer than 128 characters and should be HTTPS.

### deleteNotificationChannel(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

- **channel_id** - The id of the channel you wish to close.

### listNotificationChannels([callback])

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of notification channels.

### addToCalendar(options[, callback])

Takes options object and an optional callback, either returning a promise for, or caling the provided callback with a URL to redirect the user towards

#### Options Object

- **client_id** - required - The client ID.
- **client_secret** - required - The client secret.
- **oauth** - required - The OAuth information for the end-user to connect their calendar.
  - **redirect_uri** - required - The URL to send the end-user to after completing the Add To Calendar flow.
  - **scope** - required - The scope to request from the end-user during the oauth flow.
- **event** - required - The event to create in the user's calendar.
  - **event_id** - required - The event's ID.
  - **summary** - required - The event's summary.
  - **start** - required - The event's start date.
  - **end** - required - The event's end date.
  - **description** - required - The event's description.
  - **location** - optional - The event's location.
  - **url** - optional - The event's URL.
  - **reminders** - optional - The event's reminders.
  - **transparency** - optional - The event's transparency.
