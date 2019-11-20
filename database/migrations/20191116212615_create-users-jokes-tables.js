exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments();
      table
        .string("email", 128)
        .notNullable()
        .unique();
      table
        .string("username", 128)
        .notNullable()
        .unique();
      table.string("password", 128).notNullable();
      table.string("jwt", 512);
    })
    .createTable("jokes", table => {
      table.increments();
      table.string("setup", 500).notNullable();
      table.string("punchline", 500).notNullable();
      table
        .boolean("private")
        .notNullable()
        .defaultTo(1);
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("jokes").dropTableIfExists("users");
};
