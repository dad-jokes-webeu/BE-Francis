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
    const jokes = await db("jokes").where({ private: 0 });
    res.status(200).json(jokes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
