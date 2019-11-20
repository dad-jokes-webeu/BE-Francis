const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig");
const { deleteUser, updateUser } = require("../models/user-model");

/**
 * @swagger
 * /me:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns the identity of the currently-logged in user
 *    description: Returns the identity of the currently-logged in user
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Information about the logged-in user
 *        schema:
 *          $ref: '#/definitions/UserExpanded'
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
    const user = await db("users")
      .leftJoin("avatars", "avatars.user_id", "users.id")
      .select(
        "users.id",
        "users.username",
        "users.email",
        "avatars.url as avatar_url"
      )
      .where("users.id", userId)
      .first();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /me:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Edit the current user's information
 *    description: Edit the current user's information (`username`, `email`, and/or
 *             `password`)
 *    tags: [Users]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: updates
 *        description: Info to update for an existing user
 *        schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: returns the user with their updated information
 *        schema:
 *          $ref: '#/definitions/User'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if
 *                     any of `email`, `username` or `password` are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */

router.put("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  const updates = req.body;
  if (Object.entries(updates).length === 0 && updates.constructor === Object) {
    return res.status(400).json({
      error:
        "Invalid request body! Must provide at least one of the " +
        "following: `email`, `username`, and/or `password`"
    });
  }
  if (updates.password) {
    const hash = bcrypt.hashSync(updates.password, 10);
    updates.password = hash;
  }
  try {
    const user = await updateUser(userId, updates);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /me:
 *  delete:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Permanently delete the user from the database
 *    description: Permanently delete the user from the database
 *    tags: [Users]
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

router.delete("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    await deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
