# node-test-api

## Get a profile
GET /profile/{id}

## Add a profile
POST /profile/{profileGroup}
```json
{
  "username": "jdoe",
  "password": "1234"
}
```

## Get next profile
GET /profile/{profileGroup}/next

## Get all profiles
GET /profile/{profileGroup}/all

## Release a profile
POST /profile/{id}/release

## Update profile group defaults
POST /profile/{profileGroup}/defaults

```json
{
  "flagForGroup": true
}
```

## Get profile group defaults
GET /profile/{profileGroup}/defaults

## Release all profiles in profile group
POST /profile/{profileGroup}/releaseAll

## Release all profiles in group
POST /profile/session/{sessionId}/releaseAll

## Get all profiles in a session
GET /profile/session/{sessionId}

## Delete a profile
DELETE /profile/{id}
