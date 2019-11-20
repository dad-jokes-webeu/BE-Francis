const db = require("../database/dbConfig");

const convertPrivateIntsToBooleans = jokes => {
  if (Array.isArray(jokes)) {
    jokes.forEach(joke => {
      return {
        ...joke,
        private: joke.private === 0 || false ? false : true
      };
    });
    return jokes;
  }
};

/**
 * @param {Integer} userId id of the currently-authenticated user
 */

const findUserJokes = async userId => {
  const jokes = await db("jokes")
    .join("users", "users.id", "jokes.user_id")
    .leftJoin("avatars", "avatars.user_id", "jokes.user_id")
    .leftJoin("likes", "likes.joke_id", "jokes.id")
    .count("likes.joke_id as likes", "jokes.id")
    .groupBy("jokes.id", "jokes.setup", "jokes.punchline", "jokes.private","users.username")
    .select(
      "jokes.id",
      "jokes.setup",
      "jokes.punchline",
      "jokes.private",
      "users.username as author"
    )
    .where({ "jokes.user_id": userId });

  return convertPrivateIntsToBooleans(jokes);
};

/**
 *
 * @param {Integer} userId id of the currently-authenticated user
 * @param {Integer} jokeId id of the joke to look for and return if found
 * @param {Object} options
 * @param {Object} options.filter object containing key-value pairs mapping to
 *                                a predicate to be used in a SQL `WHERE` clause
 */

const findJokeById = async (userId, jokeId, options = { filter: {} }) => {
  const [joke] = await db("jokes")
    .join("users", "users.id", "jokes.user_id")
    .leftJoin("likes", "likes.joke_id", "jokes.id")
    .count("likes.joke_id as likes", "jokes.id")
    .groupBy("jokes.id", "jokes.setup", "jokes.punchline", "jokes.private","users.username")
    .select(
      "jokes.id",
      "jokes.setup",
      "jokes.punchline",
      "jokes.private",
      "users.username as author"
    )
    .where({
      "jokes.user_id": userId,
      "jokes.id": jokeId,
      ...options.filter
    });
  return joke;
};

const addJoke = async (userId, joke) => {
  const [id] = await db("jokes").insert({ ...joke, user_id: userId }, "id");

  return findJokeById(userId, id);
};

const addLike = async (userId, jokeId) => {
  const [id] = await db("likes").insert(
    { joke_id: jokeId, liker_id: userId },
    "id"
  );
  return id;
};

const getLikes = async () => {
  const likes = await db("likes")
    .join("users", "users.id", "likes.liker_id")
    .select(
      "likes.id",
      "liker_id",
      "joke_id",
      "users.username as liker_username"
    );
  return likes;
};

const getLikesForAJoke = async jokeId => {
  const likes = await db("likes")
    .join("users", "users.id", "likes.liker_id")
    .select(
      "likes.id",
      "liker_id",
      "joke_id",
      "users.username as liker_username"
    )
    .where({ joke_id: jokeId });
  return likes;
};

const removeLike = async (userId, jokeId) => {
  await db("likes")
    .where({ liker_id: userId, joke_id: jokeId })
    .delete();
};

const updateJoke = async (userId, jokeId, updates) => {
  await db("jokes")
    .where({ user_id: userId, id: jokeId })
    .update(updates);
  return findJokeById(userId, jokeId);
};

const deleteJoke = async (userId, jokeId) => {
  await db("jokes")
    .where({ id: jokeId, user_id: userId })
    .delete();
};

module.exports = {
  findUserJokes,
  findJokeById,
  addJoke,
  updateJoke,
  deleteJoke,
  addLike,
  getLikes,
  getLikesForAJoke,
  removeLike
};
