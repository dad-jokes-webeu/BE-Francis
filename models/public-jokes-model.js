const db = require("../database/dbConfig");

const getPublicJokes = async () => {
  const jokes = await db("jokes")
    .join("users", "users.id", "jokes.user_id")
    .leftJoin("avatars", "avatars.user_id", "jokes.user_id")
    .leftJoin("likes", "likes.joke_id", "jokes.id")
    .count("likes.joke_id as likes", "jokes.id")
    .groupBy("likes")
    .select(
      "jokes.id",
      "jokes.setup",
      "jokes.punchline",
      "jokes.private",
      "users.username as user_username",
      "avatars.url as user_avatar"
    )
    .where({ private: 0 });

  return jokes;
};

const paginateJokes = (jokes, results, page, endIndex, startIndex) => {
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
  return results;
};

module.exports = { getPublicJokes, paginateJokes };
