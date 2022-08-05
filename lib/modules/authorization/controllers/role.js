/**
 * @module RoleController
 */
const RoleService = require('modules/authorization/services/role');

/**
 * API handler to `fetch` the list of roles.
 * @returns {Response} the response object
 */
exports.list = function () {
    return RoleService.list();
};

/**
 * API handler to `fetch` a single role.
 * @param {Object} request - Request object.
 * @returns {Response} the response object
 */
exports.get = function ({ params: { id } }) {
    return RoleService.findById(Number.parseInt(id));
};

/**
 * API handler to `create` a role.
 * @async
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.create = async function ({ payload: role }, h) {
    const { id } = await RoleService.create(role);
    return h.response().created(`/api/role/${id}`);
};

/**
 * API handler to `update` a role.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.update = async function ({ params: { id }, payload: role }, h) {
    await RoleService.update(Number.parseInt(id), role);
    return h.response();
};

/**
 * API handler to `delete` a role.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.remove = async function ({ params: { id } }, h) {
    await RoleService.remove(Number.parseInt(id));
    return h.response();
};

/**
 * API handler to `upsert` a role's permissions.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.upsertPermissions = async function ({ params: { id }, payload: { permissions } }, h) {
    await RoleService.upsertPermissions(Number.parseInt(id), permissions);
    return h.response();
};
