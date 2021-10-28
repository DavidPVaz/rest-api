/**
 * @module RoleService
 */
const RoleDao = require('dao/role');
//const { transaction } = require('objection');
//const Authentication = require('utils/auth');
//const APIError = require('errors/api-error');

/**
 * `Fetch` a single role from the database.
 * @param {Object|string|number} values - the values to query for.
 * @return {Promise<Role>} The queried role.
 */
exports.findOne = function (...values) {
    return RoleDao.findOne(...values);
};
