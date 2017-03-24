# cronofy-node

A simple wrapper for the [Cronofy API](https://www.cronofy.com/developers/api/).

## Basic Usage

The APIs should be one to one with the all of the current methods in [Cronofy's documentation](https://www.cronofy.com/developers/api/). The general pattern is that each method takes an options object and an optional callback. If a callback is not passed in as the second argument the function will act as a promise.

#### Usage Example

```node
var cronofy = require('cronofy')({
  client_id: clientId, 
  client_secret: clientSecret, 
  access_token: accessToken, 
  refresh_token: refreshToken,
  data_center: 'de' // If not present will default to main Cronofy endpoints
});

var options = {
  grant_type: 'authorization_code',
  code: 'asdkfj213sdf',
  redirect_uri: 'https://www.yoursite.com/calendar_redirect_page'
};

cronofy.requestAccessToken(options)
  .then(function(response){
    console.log(response);
  });

// Alternatively as a callback
cronofy.requestAccessToken(options, function(err, response){
  if(err) throw err;
  console.log(response);
})
```

## Functions available

### accountInformation(callback)

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

### listCalendars(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of calendars for the user.

### profileInformation(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with an array of the user's calendar profiles.

### readEvents(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an array of the user's events accross all calendars.

#### Options Object

- **from** - required - the start date as an ISO string.
- **to** - required - the end date as an ISO string.
- **tzid** - the timezone id for the query.
- **next_page** - url for the next page. This will still apply other options to the request.

### refreshAccessToken(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with the new refresh and access token information.

### requestAccessToken(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing an access and refresh token for you to use with future requests.

#### Options Object

 - **code** - required - The short-lived, single-use code issued to you when the user authorized your access to their account as part of an Authorization Request.
 - **redirect_uri** - required - The same HTTP or HTTPS URI you passed when requesting the user's authorization.

### revokeAuthorization(options[, callback])

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **token** - required - either a refresh_token or access_token for the user you need to revoke.

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

### listNotificationChannels(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of notification channels.
