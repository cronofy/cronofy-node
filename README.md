A simple wrapper for the [Cronofy API](https://www.cronofy.com/developers/api/).

# Basic Usage

The APIs should be one to one with the all of the current methods in [Cronofy's documentation](https://www.cronofy.com/developers/api/). The general pattern is that each method takes an options object and an optional callback. If a callback is not passed in as the second argument the function will act as a promise.

#### Usage Example

```node
var Cronofy = require('cronofy');

var cronofyClient = new Cronofy({
  client_id: 'armzr1h5NPQST93XTFL9iIULXxfdDlmV',
  client_secret: 'aPPwd-ASDFAsdfasdfasdfsadfasdfASDFSADF_asdfasdfasdf',
  access_token: 'aLUj9bRInSj1n08pHPAo5ru0OOppDaCO',
  refresh_token: '5hdSBZHgjA4xcQAelyAYWDfezZv0-9yP',
  data_center: 'de'
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

`data_center` is the two-letter designation for the data center you want to operate against - for example `de` for Germany, or `au` for Australia. When omitted, this defaults to the US data center. You can find this value on your app's dashboard under `SDK identifier`.

# Functions available

### requestAccessToken(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing an access and refresh token for you to use with future requests.

### refreshAccessToken(options, callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with the new refresh and access token information.

#### Options Object

 - **code** - required - The short-lived, single-use code issued to you when the user authorized your access to their account as part of an Authorization Request.
 - **redirect_uri** - required - The same HTTP or HTTPS URI you passed when requesting the user's authorization.

### revokeAuthorization(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

### elevatedPermissions(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object containing a permissions URL with a token

#### Options Object

 - **permissions** - required - An array of objects with a calendar_id and permission_level
 - **redirect_uri** - required - Url to redirect the user to in order to grant or reject requested access

### authorizeWithServiceAccount(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **email** - required - The email of the user to be authorized
 - **scope** - required - The scopes to authorize for the user
 - **callback_url** - required - The URL to return to after the authorization


## Account functions
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

### profileInformation(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with an array of the user's calendar profiles.

## Events functions

### createEvent(options, callback)

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

### readEvents(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an array of the user's events accross all calendars.

#### Options Object

- **from** - required - the start date as an ISO string.
- **to** - required - the end date as an ISO string.
- **tzid** - the timezone id for the query.
- **next_page** - url for the next page. This will still apply other options to the request.

### deleteEvent(options, callback)

Returns an empty string/promise for an empty string on success.

#### Options Object

 - **calendar_id** - required - the id of the calendar that the event will be deleted from.
 - **event_id** - required - An id for the event you want to delete.

### bulkDeleteEvents(options, callback)

Returns an empty string/promise for an empty string on success.

#### Options Object

 - **calendar_ids** - optional - An Array of calendar ids to delete events from.
 - **delete_all** - optional - A Boolean value indicating if all events should be deleted.

### freeBusy(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with a list of free/busy information across all calendars.

#### Options Object

 - **from** - required - the state date/time as an ISO string.
 - **to** - required - the end date/time as an ISO string.

### updateExternalEvent(options, callback)

Allows the editing of external events on accounts which have granted [Extended Permissions](https://docs.cronofy.com/developers/api/authorization/extended-permissions/)

See full details in the [Update External Event documentation](https://docs.cronofy.com/developers/api/events/edit-external-events/).

### deleteExternalEvent(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

 - **calendar_id** - required - the id of the calendar that the event will be deleted from.
 - **event_uid** - required - An id for the external event you want to delete.

## Calendar functions

### listCalendars(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of calendars for the user.

## Push Notification functions

### createNotificationChannel(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object with the new channel details.
See full details in the [Create Notification Channel documentation](https://docs.cronofy.com/developers/api/push-notifications/create-channel/)

#### Options Object

- **callback_url** - required - The HTTP or HTTPS URL you wish to receive push notifications. 

### deleteNotificationChannel(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an empty object in the success case.

#### Options Object

- **channel_id** - The id of the channel you wish to close.

### listNotificationChannels(callback)

Takes an optional callback, either returning a promise for, or calling the provided callback with a list of notification channels.

## Managed Availability functions

### listAvailabilityRules(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full response details in the [List Availability Rules documentation](https://docs.cronofy.com/developers/api/scheduling/availability-rules/list-availability-rules/)

### upsertAvailabilityRule(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See the full options in the [Upsert Availability Rule documentation](https://docs.cronofy.com/developers/api/scheduling/availability-rules/upsert-availability-rule/)

#### Options Object

- **availability_rule_id** - The ID of the rule you wish to update (or create).
- **tzid** - The timezone ID of the rule. A `String` representing a known time zone identifier from the IANA Time Zone Database.
- **calendar_ids** - optional - An `Array` specifying the calendars that should impact the user’s availability. When provided at least one calendar must be specified.
- **weekly_periods** - required - An `Array` of [weekly recurring periods](https://docs.cronofy.com/developers/api/scheduling/availability-rules/upsert-availability-rule/#weekly_periods) for the availability rule.

### readAvailabilityRule(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full response details in the [List Availability Rules documentation](https://docs.cronofy.com/developers/api/scheduling/availability-rules/list-availability-rules/)

#### Options Object

- **availability_rule_id** - required - The `String` that uniquely identifies the availability rule. The first request made for an availability_rule_id will create an available period for the account and subsequent requests will update its details. More info can be found in the [Read Availability Rule documentation](https://docs.cronofy.com/developers/api/scheduling/availability-rules/read-availability-rule/)

### deleteAvailabilityRule(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full details in the [Delete Availability Rule documentation](https://docs.cronofy.com/developers/api/scheduling/availability-rules/delete-availability-rule/)

#### Options Object

- **availability_rule_id** - required - The `String` that uniquely identifies the availability rule.

### upsertAvailablePeriod(options, callback)

Creates or updates an Available Period for the authenticated account. Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full details in the [Create or Update Available Periods documentation](https://docs.cronofy.com/developers/api/scheduling/available-periods/upsert/)
### listAvailablePeriods(options, callback)

Lists Available Periods for the authenticated account. Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full details in the [Read Available Periods documentation](https://docs.cronofy.com/developers/api/scheduling/available-periods/read/)

### deleteAvailablePeriods(options, callback)

Deletes a single Available Period for the authenticated account, or deletes _all_ Available Periods for the authenticated account.
#### Options Object

Provide either:
- **available_period_id** - The `String` that uniquely identifies the Available Period to delete.

, or:

- **delete_all** - set to `true` to bulk delete all Available Periods for the account.

## Real-Time Scheduling functions

### realTimeScheduling(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full details in the [Real-Time Scheduling documentation](https://docs.cronofy.com/developers/api/scheduling/real-time-scheduling/)

#### Options Object

- **oauth.redirect_uri** - required - The HTTP or HTTPS URI you wish the user to be redirected to after their Real-Time Scheduling journey.
- **event** - required - An object with the details of the event you wish to push into the user’s selected calendar. Details of what parameters this object can hold can be found in the create or update event documentation.
- **event.tzid** - required - The timezone to render the event with. The start and end parameters should be omited.
- **availability** - required - An object with the details of the availability query used to determine the available time periods for the user to choose for the event’s date and time. Details of what parameters this object can hold can be found in the [Availability](https://docs.cronofy.com/developers/api/scheduling/availability/) documentation.
- **target_calendars** - optional - An array of Cronofy IDs and calendar ids into which the final event will be inserted.
- **formatting.hour_format** - optional - A `String` of either `h` (12-hour format) or `H` (24-hour format). If omitted then the hour format to use will be determined by Cronofy.
- **callback_url** - optional - A URL to call when the full event details are known.
- **redirect_urls.completed_url** - optional - A URL to redirect the user to when the user has completed the process and chosen a slot. A query string parameter of `token` will be added to this URL. The `token` can be used to retrieve the [current status](https://docs.cronofy.com/developers/api/scheduling/real-time-scheduling/status/) of a Real Time Scheduling link.
- **availability.start_interval** - optional - A `Duration` describing the frequency that a sequence can start on. [More details in the documentation](https://docs.cronofy.com/developers/api/scheduling/real-time-scheduling/#availability.start_interval).
- **minimum_notice** - optional - A `Duration`. No slots starting before the period described after the current time will be displayed to the user when they select slots.

### addToCalendar(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with a URL to redirect the user towards

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

## Batch Request functions

### batch(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

See full details in the [Batch documentation](https://docs.cronofy.com/developers/api/batch/).

#### Options Object

- **batch** - required - An array of up to 50 requests that form part of the batch.
- **batch.method** - required - A `String` for the HTTP method of the individual request. Maps directly from its main documentation.
- **batch.relative_url** - required - A `String` for the relative URL (sometimes referred to as the path and query string) of the individual request. Maps directly from its main documentation.
- **batch.data** - required - An object containing the body parameters of the request. Maps directly from its main documentation. Note that this is an object, not a JSON-encoded string.

## Bookable Event functions

### createBookableEvent(options, callback)

Takes options object and an optional callback, either returning a promise or calling the provided callback with the body of the response (or error, if applicable).

#### Options Object

 - **bookable_event_id** - required - the id of the bookable event that the event will be created.
 - **start** - required - The start time for the event in UTC.
 - **end** - required - The end time for the event in UTC.
 - **status** - required - The status of the event, either `"confirmed"` or `"cancelled"`.
 - **registration.capacity** - required - The maximum number of attendees that can register for the event.

See full details in the [Create Bookable Event documentation](https://docs.cronofy.com/developers/api/scheduling/bookable-events/create/).

### readBookableEvent(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object representing the bookable event.

#### Options Object

 - **bookable_event_id** - required - the id of the bookable event.

See full details in the [Read Bookable Event documentation](https://docs.cronofy.com/developers/api/scheduling/bookable-events/read/).

### upsertRegistrationBookableEvent(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object representing the bookable event.

#### Options Object

 - **bookable_event_id** - required - the id of the bookable event that the registration will be created/updated against.
 - **registration_id** - required - the id of the registration that will be created/updated.
 - **status** - required - the status of the registration, must be one of `"pending"`, `"accepted"`, `"tentative"`, `"declined"`, `"removed"`.
 - **metadata** - optional - additional data saved against the registration, up to 10 key-value pairs.

See full details in the [Create or Update Registration documentation](https://docs.cronofy.com/developers/api/scheduling/bookable-events/registrations/upsert/).

### deleteRegistrationBookableEvent(options, callback)

Takes options object and an optional callback, either returning a promise for, or calling the provided callback with an object representing the bookable event.

#### Options Object

 - **bookable_event_id** - required - the id of the bookable event that the registration will be removed against.
 - **registration_id** - required - the id of the registration that will be removed.

See full details in the [Delete Registration documentation](https://docs.cronofy.com/developers/api/scheduling/bookable-events/registrations/delete/).

## A feature I want is not in the SDK, how do I get it?

We add features to this SDK as they are requested, to focus on developing the Cronofy API.

If you're comfortable contributing support for an endpoint or attribute, then we love to receive pull requests!
Please create a PR mentioning the feature/API endpoint you’ve added and we’ll review it as soon as we can.

If you would like to request a feature is added by our team then please let us know by getting in touch via [support@cronofy.com](mailto:support@cronofy.com).
