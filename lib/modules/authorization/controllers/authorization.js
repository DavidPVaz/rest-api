/**
 * The authorization controller
 * @module
 */
const AuthorizationService = require('modules/authorization/services/authorization');
const APIError = require('errors/api-error');
const Parser = require('utils/http-parser');

/**
 * Authorizes user to perform action on resource
 * @returns {function} the route pre handler
 */
exports.authorize = function () {
    return async function (request, h) {
        const action = Parser.getByHttpMethod(request.method);
        const resource = Parser.getResource(request.path);
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
