/**
 * @module PermissionController
 */
const PermissionService = require('modules/authorization/services/permission');

/**
 * API handler to `fetch` the list of permissions.
 * @returns {Response} the response object
 */
exports.list = function () {
    return PermissionService.list();
};

/**
 * API handler to `fetch` a single permission.
 * @param {Object} request - Request object.
 * @returns {Response} the response object
 */
exports.get = function ({ params }) {
    const { id } = params;
    return PermissionService.findById(Number.parseInt(id));
};

/**
 * API handler to `create` a permission.
 * @async
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.create = async function ({ payload: permission }, h) {
    const { id } = await PermissionService.create(permission);
    return h.response().created(`/api/permission/${id}`);
};

/**
 * API handler to `delete` a permission.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.remove = async function ({ params }, h) {
    const { id } = params;
    await PermissionService.remove(Number.parseInt(id));
    return h.response();
};
