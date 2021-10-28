const Fs = require('fs');
const csv = require('csv-parser');
/**
 * Parse a specific csv file
 * @param {String} dataFilePath path to csv file
 * @param {Object} csvOptions optional csv parser options object
 * @returns {Promise<Array<Object>>} the parsed data
 */
exports.parseCsv = (dataFilePath, csvOptions = {}) =>
    new Promise((resolve, reject) => {
        let parsedData = [];

        Fs.createReadStream(dataFilePath)
            .pipe(csv(csvOptions))
            .on('data', data => (parsedData = [...parsedData, data]))
            .on('end', () => resolve(parsedData))
            .on('error', error => reject(error));
    });
