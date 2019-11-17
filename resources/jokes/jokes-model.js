const db = require("../../database/dbConfig");

const convertPublicIntsToBooleans = jokes => {
  if (Array.isArray(jokes)) {
    jokes.forEach(joke => {
      return {
        ...joke,
        public: joke.public === 0 ? false : true
      };
    });
  } else {
    jokes.public = jokes.public === 0 ? false : true;
  }
  return jokes;
};

const findUserJokes = async userId => {
  const jokes = await db("jokes").where({ user_id: userId });
  return convertPublicIntsToBooleans(jokes);
};

const findJokes = async userId => {
  const jokes = await db("jokes")
    .where({ user_id: userId })
    .orWhere({ public: 1 });
  return convertPublicIntsToBooleans(jokes);
};

const findJokeById = async (userId, jokeId, options = { filter: {} }) => {
  const [joke] = await db("jokes").where({
    user_id: userId,
    id: jokeId,
    ...options.filter
  });
  return convertPublicIntsToBooleans(joke);
};

const addJoke = async (userId, joke) => {
  const [id] = await db("jokes").insert({ ...joke, user_id: userId });

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
  findJokes,
  findJokeById,
  addJoke,
  updateJoke,
  deleteJoke
};

//
