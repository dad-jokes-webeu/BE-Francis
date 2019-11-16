const db = require("../database/dbConfig");
const { findById } = require("../resources/users/users-model");

async function add(user) {
  const ids = await db("users").insert(user, "id");
  return findById(ids[0]);
}

module.exports = add;
