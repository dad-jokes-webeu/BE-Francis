exports.up = function(knex) {
  return knex.schema.createTable("avatars", table => {
    table.increments();
    table
      .string("url", 158)
      .notNullable()
      .unique();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .unique()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("avatars");
};
