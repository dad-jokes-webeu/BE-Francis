const db = require("../database/dbConfig");

const convertPrivateIntsToBooleans = jokes => {
  if (Array.isArray(jokes)) {
    jokes.forEach(joke => {
      return {
        ...joke,
        private: joke.private === 0 ? false : true
      };
    });
    return jokes;
  } else {
    jokes.private = jokes.private === 0 ? false : true;
    return jokes;
  }
};

/**
 * @param {Integer} userId id of the currently-authenticated user
 */

const findUserJokes = async userId => {
  const jokes = await db("jokes").where({ user_id: userId });
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
  const [joke] = await db("jokes").where({
    user_id: userId,
    id: jokeId,
    ...options.filter
  });
  return convertPrivateIntsToBooleans(joke);
};

const addJoke = async (userId, joke) => {
  const [id] = await db("jokes").insert({ ...joke, user_id: userId }, "id");

  return findJokeById(userId, id);
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
  deleteJoke
};
