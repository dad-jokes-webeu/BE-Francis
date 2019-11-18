exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("jokes")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("jokes").insert([
        {
          setup: "How do you check if a webpage is HTML5?",
          punchline: "Try it out on Internet Explorer",
          user_id: 1,
          private: 0
        },
        {
          setup: "What do you call an eagle who can play the piano?",
          punchline: "Talonted!",
          user_id: 1,
          private: 0
        }
      ]);
    });
};
