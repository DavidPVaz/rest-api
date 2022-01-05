/**
 * @module ResourceService
 */
const Repository = require('plugins/repository');

/**
 * `Fetch` a single resource from the database.
 * @param {Object} value - the value to query for.
 * @return {Promise<Resource>} The queried resource.
 */
exports.findOne = function (value) {
    return Repository.Resource.findOne(value);
};
