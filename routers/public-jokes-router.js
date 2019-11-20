const router = require("express").Router();
const {
  getPublicJokes,
  paginateJokes
} = require("../models/public-jokes-model");

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
 * /jokes/public/popular:
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

module.exports = router;
