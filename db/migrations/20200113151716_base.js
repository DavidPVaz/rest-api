exports.up = async function(knex) {
    return knex.schema.createTable('user', table => {
        table.increments().primary();
        table.string('username').unique().notNullable();
        table.string('password');
        table.string('email').unique();
        table.boolean('is_admin').notNullable().defaultTo(false);
        table.timestamps();
    });
};

exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('user');
};
