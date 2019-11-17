/**
 * References:
 *  - https://swagger.io/docs/specification/2-0/describing-responses/
 *  - https://swagger.io/docs/specification/using-ref/
 *  - https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/
 *
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The user ID.
 *      username:
 *        type: string
 *        description: The username of the user.
 *      email:
 *        type: string
 *        description: The email associated with this user. Used for logging in.
 *      password:
 *        type: string
 *        description: The hashed password associated with this user.
 *      jwt:
 *        type: string
 *        description: The current valid JSON Web Token (JWT) to be used in
 *                     the `Authorization` header when making other requests.
 *
 *  UserExpanded:
 *    allOf:
 *      - $ref: '#/definitions/User'
 *      - type: object
 *        properties:
 *          jokes:
 *            type: array
 *            description: The jokes that this user created.
 *            items:
 *              $ref: '#/definitions/Joke'
 *
 *
 *  Joke:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The joke ID.
 *      user_id:
 *        type: integer
 *        description: The user ID that this joke belongs to.
 *      setup:
 *        type: string
 *        description: The set up of the joke.
 *      punchline:
 *        type: string
 *        description: The punchline of the joke.
 *      public:
 *        type: boolean
 *        description: The privacy of the joke
 *
 *

 *  Avatar:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        description: The avatar ID.
 *      url:
 *        type: string
 *        description: The url of the avatar.
 *      user_id:
 *        type: integer
 *        description: The user ID that this avatar belongs to.
 */
