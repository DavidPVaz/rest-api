/** 
 * @file Knex migrations
 * 
 * {@link http://knexjs.org/} 
 */
exports.up = async function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments().primary();
        table.string('username').unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.timestamps();
    });
};

exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('users');
};
