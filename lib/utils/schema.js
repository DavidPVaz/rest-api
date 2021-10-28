/**
 * @module DB-Util
 */
/**
 * Fix PostgreSQL next `id` attribution in tables.
 * @param {Object} knex - The knex instance.
 */
const setNextInDbSequence = async function (knex) {
    const tables = await knex('pg_tables').select('tablename').where('schemaname', 'public');

    return Promise.all(
        tables
            .filter(value => !value.tablename.startsWith('knex_'))
            .filter(value => !value.tablename.includes('_'))
            .map(value =>
                knex.raw(
                    `select setval('${value.tablename}_id_seq', coalesce(max(id), 0) + 1, false) from ${value.tablename};`
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
    const knex = Knex(config);
    deactivateMappers();

    try {
        await knex.transaction(async tx => {
            await tx.migrate.latest();
            await tx.seed.run();
            await setNextInDbSequence(tx);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        knex.destroy();
    }
})();
