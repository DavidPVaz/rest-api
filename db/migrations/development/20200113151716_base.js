/**
 * @file Knex migrations
 * {@link http://knexjs.org/}
 */
exports.up = async function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments().primary();
        table.string('name').notNullable();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.boolean('active').defaultTo(false);
        table.timestamps();
        table.unique(['username', 'email']);
    });
};

exports.down = async function (knex) {
    return knex.schema.dropTableIfExists('users');
};
