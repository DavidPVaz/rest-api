/**
 * @module HTTP-Action-Map
 */

const { Actions } = require('enums');

const internals = {};

// match /api/<resource>/3
internals.resourceExpression = new RegExp('(?<=/api/).*?(?=/)');

internals.methods = {
    get: Actions.READ,
    post: Actions.CREATE,
    put: Actions.UPDATE,
    delete: Actions.DELETE
};

/**
 * Gets the action over resource from http method.
 * @param  {string} method the http method.
 * @return {string} The resource action
 */
exports.getByHttpMethod = function (method) {
    return internals.methods[method];
};

/**
 * Get target resource from request path.
 * @param {string} path - Request path.
 * @returns {string} The target resource
 */
exports.getResource = function (path) {
    const [resource] = path.match(internals.resourceExpression);
    return resource;
};
