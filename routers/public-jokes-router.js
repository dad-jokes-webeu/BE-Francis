const router = require("express").Router();
const db = require("../database/dbConfig");

/**
 * @swagger
 * /jokes/public:
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
    const jokes = await db("jokes")
      .join("users", "users.id", "jokes.user_id")
      .leftJoin("avatars", "avatars.user_id", "jokes.user_id")
      .leftJoin("likes", "likes.joke_id", "jokes.id")
      .count("likes.joke_id as likes", "jokes.id")
      .groupBy("jokes.id")
      .select(
        "jokes.id",
        "jokes.setup",
        "jokes.punchline",
        "jokes.private",
        "users.username as user_username",
        "avatars.url as user_avatar"
      )
      .where({ private: 0 });

    const page = req.query.page ? parseInt(req.query.page) : 1;

    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;
    const results = {};

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
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
