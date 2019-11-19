exports.up = function(knex) {
  return knex.schema.createTable("likes", table => {
    table.increments();
    table
      .integer("joke_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("jokes")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .integer("liker_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("likes");
};
