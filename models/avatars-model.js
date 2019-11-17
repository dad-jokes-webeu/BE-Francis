const db = require("../database/dbConfig");

async function findAvatarById(id) {
  const avatar = await db("avatars")
    .select("url as avatar_url", "user_id")
    .where({ id: id })
    .first();
  return avatar;
}

async function updateAvatar(id, update) {
  await db("avatars")
    .where({ id: id })
    .update({ url: update });
  const user = await findAvatarById(id);
  return user;
}

module.exports = {
  findAvatarById,
  updateAvatar
};
