# REST API JSON Documentation

## Current

This backend server now has API documentation generated thanks to Swagger. Go
to https://home-chore-tracker.unubo.app/api-docs to view the docs.

## Legacy

This document outlines the expected JSON object response for the `GET` requests
for each of the API resource types (i.e. `User`, `Family`, `Child`, and `Chore`).

> **Note:** all API requests expect an `Authorization` header containing the JWT
> token for the currently logged-in user (as defined by `GET /api/users/me`).

```js
/**
 * GET /api/users/me
 *
 * @returns {<User>}
 */
{
  id;
  name;
  email;
  avatar_url: 'url'
  jokes: [
    {
      id,
      setup,
      punchline,
      user_id
    },
    {
      id,
      setup,
      punchline,
      user_id
    }
  ];
}

/**
 * GET /api/jokes
 *
 * @returns {Array.<Joke>}
 */
[
  {
    id,
    setup,
    punchline,
    user_id,
    public
  },
  {
    id,
    setup,
    punchline,
    user_id,
    public
  }
];

/**
 * GET /api/jokes/:id
 *
 * @returns {<Joke>}
 */
{
  id, setup, punchline, user_id, public;
}

/**
 * GET /api/jokes/:id
 *
 * @returns {<Avatars>}
 */

{
  id, url, user_id;
}

```
