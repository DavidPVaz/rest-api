/**
 * @module AuthenticationController
 */
const Boom = require('@hapi/boom');
const AuthenticationService = require('modules/authorization/service/authentication');
/**
 * API handler for user `login`.
 * @param {Object} request         - Request object.
 * @param {Object} request.payload - Payload property of the request, renamed to user.
 * @param {Object} h               - Response toolkit.
 * @return {*} A HTTPS `response` to the client with a `200` status code and a valid token in the headers, or a `401`
 * with the error message.
 */
exports.login = async function ({ payload: user }, h) {
    const token = await AuthenticationService.authenticate(user);
    return h.response().header('Server-Authorization', token);
};
