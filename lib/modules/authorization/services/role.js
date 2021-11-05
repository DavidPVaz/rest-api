/**
 * @module RoleService
 */
const Repository = require('plugins/repository');
//const { transaction } = require('objection');
//const Authentication = require('utils/auth');
//const APIError = require('errors/api-error');

/**
 * `Fetch` a single role from the database.
 * @param {Object} value - the value to query for.
 * @return {Promise<Role>} The queried role.
 */
exports.findOne = function (value) {
    return Repository.Role.findOne(value);
};
