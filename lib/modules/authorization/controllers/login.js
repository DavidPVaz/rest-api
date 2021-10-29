/**
 * @module AuthenticationController
 */
const UserService = require('modules/authorization/services/user');

/**
 * API handler for user `login`.
 * @param {Object} request - Request object.
 * @param {Object} h - Response toolkit.
 * @returns {Response} the response object
 */
exports.login = async function ({ payload: user }, h) {
    try {
        const token = await UserService.authenticate(user);
        return h.response().header('Server-Authorization', token);
    } catch (error) {
        return error;
    }
};
