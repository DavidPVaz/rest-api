/**
 * @module ResourceService
 */
const Repository = require('plugins/repository');
//const { transaction } = require('objection');
//const Authentication = require('utils/auth');
//const APIError = require('errors/api-error');

//const internals = {};

/**
 * `Fetch` a single resource from the database.
 * @param {Object} value - the value to query for.
 * @return {Promise<Resource>} The queried resource.
 */
exports.findOne = function (value) {
    return Repository.Resource.findOne(value);
};
