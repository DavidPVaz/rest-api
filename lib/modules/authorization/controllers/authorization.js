/**
 * The authorization controller
 * @module
 */
const AuthorizationService = require('modules/authorization/services/authorization');
const APIError = require('errors/api-error');

const internals = {};
internals.resourceExpression = new RegExp('(?<=/api/).*?(?=/)');

/**
 * Automatically parse target resource from request path.
 * @param {string} path - Request path.
 * @returns {string} the target resource
 */
internals.getResource = function (path) {
    const [resource] = path.match(internals.resourceExpression);
    return resource;
};

/**
 * Authorizes user to perform action on resource
 * @param {string} action action to authorize
 * @returns {function} the route pre handler
 */
exports.authorize = function (action) {
    return async function (request, h) {
        const resource = internals.getResource(request.path);
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
