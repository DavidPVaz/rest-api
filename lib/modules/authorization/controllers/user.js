/**
 * @module UserController
 */
const UserService = require('modules/authorization/services/user');
const Mailer = require('utils/mail');

/**
 * API handler to `fetch` the list of users.
 * @returns {Response} the response object
 */
exports.list = function () {
    return UserService.list();
};

/**
 * API handler to `fetch` a single user.
 * @param {Object} request - Request object.
 * @returns {Response} the response object
 */
exports.get = function ({ params: { id } }) {
    return UserService.findById(Number.parseInt(id));
};

/**
 * API handler to `create` an user.
 * @async
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.create = async function ({ payload: user }, h) {
    const { id, username } = await UserService.create(user);
    Mailer.reportUserCreated({ username, email: process.env.SMTP_FAKE_MAIL }); // fake email for testing purposes.
    return h.response().created(`/api/user/${id}`);
};

/**
 * API handler to `update` an user.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.update = async function ({ params: { id }, payload: user }, h) {
    await UserService.update(Number.parseInt(id), user);
    return h.response();
};

/**
 * API handler to `delete` an user.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.remove = async function ({ params: { id } }, h) {
    await UserService.remove(Number.parseInt(id));
    return h.response();
};

/**
 * API handler to `upsert` a user's roles.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.upsertRoles = async function ({ params: { id }, payload: roleIds }, h) {
    await UserService.upsertRoles(Number.parseInt(id), roleIds);
    return h.response();
};
