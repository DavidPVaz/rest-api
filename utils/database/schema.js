import { knex } from '../../db/knex';
/**
 * Fix PostgreSQL next `id` attribution in tables.
 *
 * @param {Object} knex - The knex instance.
 */
async function setNextInDbSequence(knex) {

    const tables = await knex('pg_tables').select('tablename').where('schemaname', 'public');

    await Promise.all(
        tables
            .filter(value => !value.tablename.startsWith('knex_'))
            .map(value => knex.raw(
                `select setval('${value.tablename}_id_seq', coalesce(max(id), 0) + 1, false) from ${value.tablename};`
            ))
    );
}
/** 
 * IIFE to execute knex `migrations` and `seeds`. 
 */
(async function() {

    try {
        await knex.migrate.latest();
        await knex.seed.run();
        await setNextInDbSequence(knex);
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
})();
