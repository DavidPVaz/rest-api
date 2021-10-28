/**
 * @module ResourceService
 */
const ResourceDao = require('dao/resource');
//const { transaction } = require('objection');
//const Authentication = require('utils/auth');
//const APIError = require('errors/api-error');

//const internals = {};

/**
 * `Fetch` a single resource from the database.
 * @param {Object|string|number} values - the values to query for.
 * @return {Promise<Resource>} The queried resource.
 */
exports.findOne = function (...values) {
    return ResourceDao.findOne(...values);
};
