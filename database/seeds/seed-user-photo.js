exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("avatars")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("avatars").insert([
        { url: "https://i.ibb.co/Jj9N2WY/logo512.png", user_id: 1 }
      ]);
    });
};
