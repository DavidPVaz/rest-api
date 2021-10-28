/**
 * @module UserController
 */
const Boom = require('@hapi/boom');
const UserService = require('modules/authorization/service/user');
const Mailer = require('utils/mail');
/**
 * API handler to `fetch` the list of users.
 * @return {*} A HTTPS `response` to the client with a `200` status code and the list of users, or a `404`
 * with the error message.
 */
exports.list = function () {
    return UserService.list();
};
/**
 * API handler to `fetch` a single user.
 * @param {Object} request - Request object.
 * @return {*} A HTTPS `response` to the client with a `200` status code and the user, or a `404`
 * with the error message.
 */
exports.get = function ({ params }) {
    const { id } = params;
    return UserService.get('id', id);
};
/**
 * API handler to `create` an user.
 * @async
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @return {*} A HTTPS `response` to the client with a `201` status code and the `path` to the new resource,
 * or a `409` with the error message.
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
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `404` / `409` with the error message,
 * depending on the failure cause.
 */
exports.edit = async function ({ params, payload: user }, h) {
    const { id } = params;
    await UserService.edit(id, user);
    return h.response();
};
/**
 * API handler to `delete` an user.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `404` with the error message.
 */
exports.remove = async function ({ params }, h) {
    const { id } = params;
    await UserService.remove(id);
    return h.response();
};
