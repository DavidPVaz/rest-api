const Knex = require('knex');
const KnexConfig = require('knexfile');
const { Model } = require('objection');
const { getTableSeeds } = require('db/seeds/development/importer');

/**
 * Initializes a database connection.
 * @async
 * @returns the initialized database connection.
 */
exports.init = async function () {
    const { config, activateMappers, deactivateMappers } = KnexConfig('testing');
    const knex = Knex(config);
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
 * @param {string[]} tables the table seeds to use.
 */
exports.populate = async function (knex, tables) {
    await knex.raw('PRAGMA foreign_keys = OFF');

    const seeds = await getTableSeeds(...tables);

    await Promise.all(
        seeds.reduce(
            (queries, tableData) => [
                ...queries,
                ...Object.entries(tableData).map(([table, insertSeeds]) =>
                    knex(table).insert(insertSeeds)
                )
            ],
            []
        )
    );

    await knex.raw('PRAGMA foreign_keys = ON');
};
