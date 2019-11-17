const db = require("../database/dbConfig");
const { findUserJokes } = require("./jokes-model");

async function add(user) {
  const ids = await db("users").insert(user, "id");
  return findById(ids[0]);
}

async function findById(userId) {
  const user = await db("users")
    .select("id", "email", "username")
    .where({ id: userId })
    .first();
  const jokes = await findUserJokes(userId);
  return { ...user, jokes };
}

async function updateUser(id, updates) {
  await db("users")
    .where({ id: id })
    .update(updates);
  const user = await findById(id);
  return user;
}

async function deleteUser(id) {
  await db("users")
    .where({ id: id })
    .delete();
}

module.exports = {
  add,
  findById,
  deleteUser,
  updateUser
};
