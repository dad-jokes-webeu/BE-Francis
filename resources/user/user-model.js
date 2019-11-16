const db = require("../../database/dbConfig");

async function add(user) {
  const ids = await db("users").insert(user, "id");
  return findById(ids[0]);
}

function findById(id) {
  return db("users")
    .select("id", "username", "name")
    .where({ id })
    .first();
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
