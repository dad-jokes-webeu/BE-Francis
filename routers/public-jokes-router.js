const router = require("express").Router();
const cron = require("node-cron");
const db = require("../database/dbConfig");
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
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/", async (req, res) => {
  try {
    const jokes = await getPublicJokes();
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * 6;
    const endIndex = page * 6;
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
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/popular", async (req, res) => {
  try {
    const jokes = (await getPublicJokes()).sort(function(a, b) {
      return b.likes - a.likes;
    });
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const startIndex = (page - 1) * 6;
    const endIndex = page * 6;
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

let jokeOfTheHour;
let initJokeOfTheHour;
cron.schedule("*/59 * * * *", async () => {
  const publicJokesArray = await getPublicJokes();
  jokeOfTheHour = randomizer(publicJokesArray)();
});

/**
 * @swagger
 * /jokes/public/thehour:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns the joke of the hour
 *    description: Returns the joke of the hour
 *    tags: [Jokes]
 *    responses:
 *      200:
 *        description: returns the joke of the hour
 *        schema:
 *          type: array
 *          description: The joke of the hour
 *          items:
 *            $ref: '#/definitions/Joke'
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/thehour", async (req, res) => {
  try {
    if (jokeOfTheHour) {
      res.status(200).json(jokeOfTheHour);
    } else {
      if (initJokeOfTheHour) res.status(200).json(initJokeOfTheHour);
      else {
        // eslint-disable-next-line require-atomic-updates
        initJokeOfTheHour = randomizer(await getPublicJokes())();
        res.status(200).json(initJokeOfTheHour);
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const joke = await db("jokes")
      .join("users", "users.id", "jokes.user_id")
      .leftJoin("avatars", "avatars.user_id", "jokes.user_id")
      .leftJoin("likes", "likes.joke_id", "jokes.id")
      .count("likes.joke_id as likes", "jokes.id")
      .groupBy(
        "jokes.id",
        "jokes.setup",
        "jokes.punchline",
        "jokes.private",
        "users.username",
        "avatars.url"
      )
      .select(
        "jokes.id",
        "jokes.setup",
        "jokes.punchline",
        "jokes.private",
        "users.username as user_username",
        "avatars.url as user_avatar"
      )
      .where({ private: 0, "jokes.id": id });

    if (!joke) {
      return res.status(400).json({
        error: "No joke found with the given id"
      });
    }
    res.status(200).json(joke);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
