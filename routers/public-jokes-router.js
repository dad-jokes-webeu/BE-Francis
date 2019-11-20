const router = require("express").Router();
const cron = require("node-cron");
const randomizer = require("unique-random-array");
const {
  getPublicJokes,
  paginateJokes
} = require("../models/public-jokes-model");

/**
 * @swagger
 * /public/jokes:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all jokes that have been created by users and listed as public
 *    description: Returns all jokes that have been created by users and listed as public
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns an array of public jokes if multiple
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
  try {
    const jokes = await getPublicJokes();
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;
    const results = {};

    const paginated_results = paginateJokes(
      jokes,
      results,
      page,
      endIndex,
      startIndex
    );
    res.status(200).json(paginated_results);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /public/jokes/popular:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns all jokes that have been created by users and listed as public in order of decreasing popularity
 *    description: Returns all jokes that have been created by users and listed as public
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns an array of public jokes if multiple
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

router.get("/popular", async (req, res) => {
  try {
    const jokes = (await getPublicJokes()).sort(function(a, b) {
      return b.likes - a.likes;
    });
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;
    const results = {};

    const paginated_results = paginateJokes(
      jokes,
      results,
      page,
      endIndex,
      startIndex
    );
    res.status(200).json(paginated_results);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

let jokeOfTheDay;
let initJokeOfTheDay;
cron.schedule("* * * * *", async () => {
  const publicJokesArray = await getPublicJokes();
  jokeOfTheDay = randomizer(publicJokesArray)();
});



/**
 * @swagger
 * /jokes/public/theday:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns the joke of the day
 *    description: Returns the joke of the day
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns the joke of the day
 *        schema:
 *          type: array
 *          description: The joke of the day
 *          items:
 *            $ref: '#/definitions/Joke'
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/theday", async (req, res) => {
  try {
    if (jokeOfTheDay) {
      res.status(200).json(jokeOfTheDay);
    } else {
      if (initJokeOfTheDay) res.status(200).json(initJokeOfTheDay);
      else {
        initJokeOfTheDay = randomizer(await getPublicJokes())();
        res.status(200).json(initJokeOfTheDay);
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
