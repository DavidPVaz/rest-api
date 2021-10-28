const KnexConfig = require('knexfile');
const { Model } = require('objection');
const { getTableSeeds } = require('db/seeds/development');

/**
 * Initializes a database connection.
 * @async
 * @returns the initialized database connection.
 */
exports.init = async function () {
    const { knex, activateMappers, deactivateMappers } = KnexConfig('testing');
    deactivateMappers();
    await knex.migrate.latest();
    activateMappers();
    Model.knex(knex);

    return knex;
};

/**
 * Destroys a database connection.
 * @async
 * @param {Object} knex the database connection.
 */
exports.destroy = async function (knex) {
    await knex.destroy();
};

/**
 * Truncates the tables of a database.
 * @async
 * @param {Object} knex the database connection.
 */
exports.truncate = async function (knex) {
    // Would be simpler to simply rollback knex migration after each test, dropping all tables.
    // However, some migrations are not successfully dropping foreign key constrained columns.

    // A different approach will provide a better performance, despite being more complex:
    // 1) Disable all FOREIGN KEY constraint checks.
    // 2) Truncate all populated tables created in our migrations.
    // 3) Enable all FOREIGN KEY constraint checks.
    await knex.raw('PRAGMA foreign_keys = OFF');
    await knex.raw('ANALYZE'); // https://sqlite.org/lang_analyze.html

    const tables = await knex.raw(`
                    SELECT DISTINCT tbl_name AS name
                    FROM sqlite_master AS master
                    JOIN sqlite_stat1 AS stat ON master.tbl_name = stat.tbl
                    WHERE master.type = 'table' AND master.tbl_name NOT LIKE 'knex_%'
                `);

    await Promise.all(tables.map(({ name }) => knex(name).truncate()));

    await knex.raw('PRAGMA foreign_keys = ON');
};

/**
 * Populates the tables of a database.
 * @async
 * @param {Object} knex the database connection.
 * @param {string[]} seeds the tables to seed.
 */
exports.populate = async function (knex, seeds) {
    await knex.raw('PRAGMA foreign_keys = OFF');

    for (const table of seeds) {
        const insertSeeds = getTableSeeds(table);
        await knex(table).insert(insertSeeds);
    }

    await knex.raw('PRAGMA foreign_keys = ON');
};
