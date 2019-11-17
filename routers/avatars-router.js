const router = require("express").Router();
const db = require("../database/dbConfig");
const multer = require("multer");
const { updateAvatar, findAvatarById } = require("../models/avatars-model");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "demo",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

/**
 * @swagger
 * /avatars/me:
 *  get:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Returns a single avatar that belongs to the logged-in user
 *    description: Returns a single avatar that belongs to the logged-in user
 *    tags: [Avatars]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: integer
 *        description: ID belonging to the avatar to retrieve
 *    responses:
 *      200:
 *        description: returns an object of the matching avatar for the given ID
 *        schema:
 *          $ref: '#/definitions/Avatar'
 *      400:
 *        description: returned if `Authorization` header is missing
 *      401:
 *        description: returned when JWT is either expired or malformed, OR if
 *                     no joke belonging to the current user could be found with
 *                     the given ID
 *      500:
 *        description: returned in the event of a server error
 */

router.get("/", async (req, res) => {
  const { decodedJwt } = req;
  const userId = decodedJwt.subject;
  try {
    const [avatar] = await db("avatars").where({ user_id: userId });
    res.status(200).json(avatar);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});



/**
 * @swagger
 * /avatars/me:
 *  post:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Creates a new avatar belonging to the logged-in user
 *    description: Creates a new avatar belonging to the logged-in user
 *    tags: [Avatars]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: avatar
 *        description: The avatar to create
 *        schema:
 *          type: object
 *          required:
 *            - id
 *            - url
 *            - user_id
 *          properties:
 *            id:
 *              type: integer
 *            user_id:
 *              type: integer
 *            url:
 *              type: string
 *    responses:
 *      201:
 *        description: returns the newly-created avatar
 *        schema:
 *          $ref: '#/definitions/Avatar'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if the
 *                     required properties are missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */


router.post("/", parser.single("image"), async (req, res) => {
  const url = req.file.url;
  const { decodedJwt } = req;
  const user_id = decodedJwt.subject;
  try {
    const [url_id] = await db("avatars").insert({ url, user_id });
    const stored_url = findAvatarById(url_id);
    return res.status(201).json(stored_url);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * @swagger
 * /avatars/me/{id}:
 *  put:
 *    security:
 *      - JWTKeyHeader: []
 *    summary: Change the current avatar
 *    description: Change the current avatar
 *    tags: [Avatars]
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: updates
 *        description: Info to update an existing avatar
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            url:
 *              type: string
 *            user_id:
 *              type: integer
 *    responses:
 *      200:
 *        description: returns the avatar with the updated information
 *        schema:
 *          $ref: '#/definitions/Avatar'
 *      400:
 *        description: returned if `Authorization` header is missing, OR if
 *                     any of `url`is missing
 *      401:
 *        description: returned when JWT is either expired or malformed
 *      500:
 *        description: returned in the event of a server error
 */


router.put("/:id", parser.single("image"), async (req, res) => {
  const url = req.file.url;
  const { id } = req.params;
  if (!url) res.status(400).json({ message: `invalid request` });
  try {
    const avatar = await updateAvatar(id, url);
    res.status(200).json(avatar);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
