exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments();
      table
        .string("username", 128)
        .notNullable()
        .unique();
      table.string("password", 128).notNullable();
      table.string("name", 128);
    })
    .createTable("jokes", table => {
      table.increments();
      table.string("setup", 500).notNullable();
      table.string("punchline", 500).notNullable();
      table
        .boolean("public")
        .notNullable()
        .defaultTo(0);
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("jokes").dropTableIfExists("users");
};