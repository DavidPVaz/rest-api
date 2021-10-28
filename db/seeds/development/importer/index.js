const FsPromises = require('fs').promises;
const Path = require('path');
const { parseCsv } = require('utils/csv');
const {
    needsInterpolation,
    isTransformationAvailable,
    performTransformation
} = require('../transforms');

const internals = {};

internals.MAX_SEEDS_SIZE = 500;
internals.seedSearchFolder = Path.join(__dirname, '../csv-data');
internals.isBoolean = value => value === 'true' || value === 'false';
internals.parseBoolean = value => value === 'true';
internals.parseNumbers = value => {
    if (isNaN(value)) {
        return value;
    }
    if (value === '') {
        return null;
    }

    return value.includes('.') ? Number.parseFloat(value, 10) : Number.parseInt(value, 10);
};
internals.removeTablesWithNoData = seeds =>
    seeds.filter(tableData => {
        const [seedData] = Object.values(tableData);
        return seedData.length > 0;
    });
internals.deleteEmptyFields = seeds =>
    seeds.forEach(tableSeed =>
        Object.keys(tableSeed).forEach(table =>
            tableSeed[table].forEach(tableEntry =>
                Object.keys(tableEntry).forEach(fieldAttribute => {
                    const attribute = tableEntry[fieldAttribute];
                    if (attribute === null) {
                        delete tableEntry[fieldAttribute];
                    }
                })
            )
        )
    );

// These options will be applied to the csv parser.
// Documentation: https://www.npmjs.com/package/csv-parser
internals.csvOptions = {
    mapValues: ({ value }) => {
        if (needsInterpolation(value) && isTransformationAvailable(value)) {
            return performTransformation(value);
        }

        return internals.isBoolean(value)
            ? internals.parseBoolean(value)
            : internals.parseNumbers(value);
    }
};

/**
 * Retrieves the name of the files where seeds csv data is located
 * @async
 * @param {Array<String> | []} [requestedTables] an array with database table name(s)
 * @returns {Array<string>} the name of the files
 */
internals.getSeedsFileName = async requestedTables => {
    const allTables = (await FsPromises.readdir(internals.seedSearchFolder))
        .map(file => Path.parse(file).name)
        .sort();

    return requestedTables.length === 0
        ? allTables
        : allTables.filter(
              fileName =>
                  !!requestedTables.find(
                      tableName => fileName.slice(fileName.indexOf('.') + 1) === tableName
                  )
          );
};

/**
 * Parse seeds csv data
 * @param {Array<String>} targetFiles an array with the name of csv data files
 * @returns {Promise<Array<Object>>} the parsed database seeds
 */
internals.parseCsvData = targetFiles =>
    Promise.all(
        targetFiles.map(async file => {
            const table = file.slice(file.indexOf('.') + 1);
            const dataFilePath = `${internals.seedSearchFolder}/${file}.csv`;
            const parsedData = await parseCsv(dataFilePath, internals.csvOptions);

            return { [table]: parsedData };
        })
    );

/**
 * Retrieves database seeds per table
 * @async
 * @param {String} [requestedTables] optional database table name(s) to retrieve specific table's seeds
 * @returns {Array<Object>} an objects array, each containing its table name with corresponding seed data
 */
exports.getTableSeeds = async function (...requestedTables) {
    const targetFiles = await internals.getSeedsFileName(requestedTables);
    let seeds = await internals.parseCsvData(targetFiles);
    seeds = internals.removeTablesWithNoData(seeds);
    internals.deleteEmptyFields(seeds);

    return seeds;
};

// USED BY KNEX
exports.seed = async function (knex) {
    await knex.transaction(async tx => {
        const seeds = await exports.getTableSeeds();

        return Promise.all(
            seeds.reduce(
                (queries, tableData) => [
                    ...queries,
                    ...Object.entries(tableData).map(([tableName, insertSeeds]) =>
                        insertSeeds.length > internals.MAX_SEEDS_SIZE
                            ? tx.batchInsert(tableName, insertSeeds, internals.MAX_SEEDS_SIZE)
                            : tx(tableName).insert(insertSeeds)
                    )
                ],
                []
            )
        );
    });
};
