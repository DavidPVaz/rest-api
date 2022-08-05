/**
 * @module DB-Schema
 */
const internals = {};
/**
 * Selecting only tables with incremental id
 * @param {Object} knex - The knex instance.
 */
internals.getTablesWithIncrementalIdAsPrimaryKey = async knex => {
    const { rows: queryResult } = await knex.raw(
        "SELECT table_name FROM information_schema.constraint_column_usage WHERE information_schema.constraint_column_usage.column_name='id' AND information_schema.constraint_column_usage.table_name <> 'knex_migrations';"
    );

    return [...new Set(queryResult.map(({ table_name }) => table_name))];
};

/**
 * Fix PostgreSQL next `id` attribution in tables.
 * @param {Object} knex - The knex instance.
 */
internals.setNextInDbSequence = async function (knex) {
    const tables = await internals.getTablesWithIncrementalIdAsPrimaryKey(knex);

    return Promise.all(
        tables.map(name =>
            knex.raw(
                `select setval('${name}_id_seq', coalesce(max(id), 0) + 1, false) from ${name};`
            )
        )
    );
};
/**
 * IIFE to execute knex `migrations` and `seeds`.
 */
(async function () {
    const { config, deactivateMappers } = require('knexfile')(process.env.NODE_ENV);
    const Knex = require('knex');
    let knex;

    // dropping and creating database
    try {
        config.connection.database = process.env.DB_DEFAULT_MAINTENANCE;
        knex = Knex(config);

        await knex.raw(`DROP DATABASE ${process.env.DB_NAME}`);
        await knex.raw(`CREATE DATABASE ${process.env.DB_NAME}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        knex.destroy();
    }

    config.connection.database = process.env.DB_NAME;
    knex = Knex(config);
    deactivateMappers();

    // execute migrations and seeding
    try {
        await knex.transaction(async tx => {
            await tx.migrate.latest();
            await tx.seed.run();
            await internals.setNextInDbSequence(tx);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        knex.destroy();
    }
})();
