# node-cronofy
wrapper for the cronofy api

## Basic Usage
The api's should be one to one with the all of the current methods in Cronofy's documentation. The general pattern is that each method takes an options object and an optional callback. If a callback is not passed in as the second argument the function will act as a promise.

## Functions available

### accountInformation(options[, callback])
### createEvent(options[, callback])
### createNotificationChannel(options,[, callback])
### deleteEvent(options,[, callback])
### deleteNotificationChannel(options[, callback])
### freeBusy(options[, callback])
### listCalendars(options[, callback])
### listNotificationChannels(options[, callback])
### profileInformation(options[, callback])
### readEvents(options[, callback])
### refreshAccessToken(options[, callback])
### requestAccessToken(options[, callback])
Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing an access and refresh token for you to use with future requests.
#### Options Object
 - **client_id** - required -The client_id issued to you by Cronofy to authenticate your OAuth Client. Authenticates you as a trusted client along with your client_secret.
 - **client_secret** - required - The client_secret issued to you by Cronofy to authenticate your OAuth Client. Authenticates you as a trusted client along with your client_id.
 - **grant_type** - required - Must always be authorization_code.
 - **code** - required - The short-lived, single-use code issued to you when the user authorized your access to their account as part of an Authorization Request.
 - **redirect_uri** - required - The same HTTP or HTTPS URI you passed when requesting the user's authorization.

#### Example Usage
```
var cronofy = require('cronofy');

var options = {
  client_id: 'armzr1h5NPQST93XTFL9iIULXxfdDlmV',
  client_secret: 'aPPwd-ASDFAsdfasdfasdfsadfasdfASDFSADF_asdfasdfasdf",
  grant_type: 'authorization_code',
  code: 'asdkfj213sdf',
  redirect_uri: 'https://www.yoursite.com/calendar_redirect_page'
};

cronofy.requestAccessToken(options)
  .then(function(response){
    console.log(response);
  });

// Alternatively takes a callback
cronofy.requestAccessToken(options, function(err, response){
  if(err) throw err;
  console.log(response);
})
```
### revokeAuthorization(options[, callback])
