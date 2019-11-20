const router = require("express").Router();
const {
  findUserJokes,
  findJokeById,
  addJoke,
  updateJoke,
  deleteJoke,
  addLike,
  getLikes,
  getLikesForAJoke,
  removeLike
} = require("../models/jokes-model");

/**
 * @swagger
 * /me/jokes:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all jokes that belong to the logged-in user
 *    description: Returns all jokes that belong to the logged-in user
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns an array of jokes for the given user
 *        schema:
 *          type: array
 *          description: The jokes that belong to the authenticated user.
 *          items:
 *            $ref: '#/definitions/Joke'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const jokes = await findUserJokes(userId);

    const page = req.query.page ? parseInt(req.query.page) : 1;

    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;
    const results = {};

    if (jokes) {
      if (endIndex < jokes.length) {
        results.next = page + 1;
      }
      if (startIndex > 0) {
        results.previous = page - 1;
      }

      if (!jokes[endIndex]) {
        results.warning = "last page";
      }

      results.results = jokes.slice(startIndex, endIndex);
      res.status(200).json(results);
    } else res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /me/jokes/{id}:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns a single joke that belongs to the logged-in user
 *    description: Returns a single joke that belongs to the logged-in user
 *    tags: [Jokes]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the joke to retrieve
 *    responses:
 *      200:
 *        description: returns an object of the matching joke for the given ID
 *        schema:
 *          $ref: '#/definitions/Joke'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no joke belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const joke = await findJokeById(userId, id);
    if (!joke) {
      return res.status(400).json({
        error: "No joke found with the given id"
      });
    }
    joke.private = joke.private === 1 ? true : false;
    res.status(200).json(joke);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /me/jokes:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new joke belonging to the logged-in user
 *    description: Creates a new joke belonging to the logged-in user
 *    tags: [Jokes]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: joke
 *        description: The joke to create
 *        schema:
 *          type: object
 *          required:
 *            - setup
 *            - punchline
 *          properties:
 *            id:
 *              type: integer
 *            setup:
 *              type: string
 *            punchline:
 *              type: string
 *            user_id:
 *              type: integer
 *            private:
 *              type: boolean
 *    responses:
 *      201:
 *        description: returns the newly-created joke
 *        schema:
 *          $ref: '#/definitions/Joke'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required properties are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.post("/", async (req, res) => {
  const { setup, punchline } = req.body;
  const joke = req.body;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    if (!setup || !punchline) {
      res.status(400).json({ error: "Setup and punchline are required!" });
    } else {
      const newJoke = await addJoke(userId, joke);
      newJoke.private = newJoke.private === 1 ? true : false;
      res.status(201).json(newJoke);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /me/jokes/{id}:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the given joke's information
 *    description: Edit the given joke's information
 *    tags: [Jokes]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the joke to update
 *      - in: body
 *        name: updates
 *        description: The joke information to update
 *        schema:
 *          type: object
 *          required:
 *            - setup
 *            - punchline
 *          properties:
 *            setup:
 *              type: string
 *            punchline:
 *              type: string
 *            user_id:
 *              type: integer
 *            private:
 *              type: boolean
 *    responses:
 *      200:
 *        description: returns the updated joke
 *        schema:
 *          $ref: '#/definitions/Joke'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if none
 *                     of the joke properties were supplied
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  const updates = req.body;
  if (Object.entries(updates).length === 0 && updates.constructor === Object) {
    return res
      .status(400)
      .json({ error: "Invalid request, req body cannot be empty" });
  }
  try {
    const updated = await updateJoke(userId, id, updates);

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /me/jokes/{id}:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the given joke
 *    description: Permanently delete the given joke
 *    tags: [Jokes]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the joke to delete
 *    responses:
 *      204:
 *        description: returns nothing if successful
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    await deleteJoke(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /me/jokes/{id}/likes:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new joke belonging to the logged-in user
 *    description: Creates a new joke belonging to the logged-in user
 *    tags: [Jokes]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: joke
 *        description: The joke to create
 *        schema:
 *          type: object
 *          required:
 *            - setup
 *            - punchline
 *          properties:
 *            id:
 *              type: integer
 *            joke_id:
 *              type: integer
 *            liker_id
 *              type: integer
 *    responses:
 *      201:
 *        description: returns the newly-created joke
 *        schema:
 *          $ref: '#/definitions/Joke'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required properties are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.post("/:id/likes", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const likeId = await addLike(userId, id);
    res.status(201).json({ id: likeId, joke_id: id, liker_id: userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * @swagger
 * /me/jokes/likes:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all the like objects in the database
 *    description: Returns all the like objects in the database
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns an array of objecrs of all likes in the database
 *        schema:
 *          $ref: '#/definitions/Like'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no joke belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */


router.get("/likes", async (req, res) => {
  try {
    const allLikes = await getLikes();
    res.status.json(allLikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /me/jokes/{id}/likes:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all the like objects for a given joke
 *    description: Returns all the like objects for a given joke
 *    tags: [Jokes]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the joke to retrieve likes
 *    responses:
 *      200:
 *        description: returns an array of objecrs of likes belonging to a joke
 *        schema:
 *          $ref: '#/definitions/Like'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no joke belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/:id/likes", async (req, res) => {
  const { id } = req.params;
  try {
    const likes = await getLikesForAJoke(id);
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /me/jokes/{id}/likes:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the like by a given user for a given joke
 *    description: Permanently delete the given like
 *    tags: [Jokes]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the joke with a like to delete
 *    responses:
 *      204:
 *        description: returns nothing if successful
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.delete("/:id/likes", async (req, res) => {
  const { id } = req.params;
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    await removeLike(userId, id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
