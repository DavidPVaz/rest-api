/**
 * The authorization controller
 * @module
 */
const AuthorizationService = require('modules/authorization/services/authorization');
const APIError = require('errors/api-error');

/**
 * Authorizes user to perform action on resource
 * @param {string} resource resource to authorize
 * @param {string} action action to authorize
 * @returns {function} the route pre handler
 */
exports.authorize = function (resource, action) {
    return async function (request, h) {
        const username = request.auth.credentials.username;

        const authorized = await AuthorizationService.canUser(username, action, resource);

        if (!authorized) {
            request.logger.debug({ action, resource, username }, 'authorization forbidden');
            throw APIError.AUTH_UNAUTHORIZED();
        }

        request.logger.debug({ action, resource, username }, 'authorization succeeded');
        return h.continue;
    };
};
