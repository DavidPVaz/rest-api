/**
 * @file Knex migrations
 * {@link http://knexjs.org/}
 */
const { Actions } = require('enums');

exports.up = async function (knex) {
    await knex.schema.createTable('users', table => {
        table.increments().primary();
        table.string('name').notNullable();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.boolean('active').defaultTo(false);
        table.timestamps();
        table.unique(['username', 'email']);
    });

    await knex.schema.createTable('roles', function (table) {
        table.increments().primary();
        table.string('name').unique();
        table.string('description');
        table.timestamps();
    });
    await knex.schema.createTable('resources', function (table) {
        table.increments().primary();
        table.string('name');
        table.string('description', 2048);
        table.timestamps();
    });
    await knex.schema.createTable('permissions', function (table) {
        table.increments().primary();
        table.enu('action', Object.values(Actions));
        table.string('description', 2048);
        table.integer('resource_id').unsigned().references('id').inTable('resources');
        table.timestamps();
    });
    await knex.schema.createTable('users_roles', function (table) {
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('role_id').unsigned().references('id').inTable('roles');
        table.primary(['user_id', 'role_id']);
    });
    await knex.schema.createTable('roles_permissions', function (table) {
        table.integer('role_id').unsigned().references('id').inTable('roles');
        table.integer('permission_id').unsigned().references('id').inTable('permissions');
        table.primary(['role_id', 'permission_id']);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('roles_permissions');
    await knex.schema.dropTableIfExists('users_roles');
    await knex.schema.dropTableIfExists('permissions');
    await knex.schema.dropTableIfExists('resources');
    await knex.schema.dropTableIfExists('roles');
    await knex.schema.dropTableIfExists('users');
};
