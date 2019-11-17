# BE-Francis - REST API JSON Documentation 🦇

## Current

Made with NodeJS, Express, a warm heart ❤️ and a stomach full of pasta 🍝 .

Go to https://dadjokes-api.herokuapp.com/api-docs/ to view the docs for the backend server.

## Legacy

This document outlines the expected JSON object response for the `GET` requests
for each of the API resource types.

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
  avatar_url: "url";
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
