/**
 * @module HTTP-Action-Map
 */

const { Actions } = require('enums');

const internals = {};

// match /api/<resource>/......
internals.withParamsResourceExpression = new RegExp('(?<=/api/).*?(?=/)');
//match /api/<resource>
internals.withoutParamsResourceExpression = new RegExp('(?<=/api/).*');

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
    const withParams = path.match(internals.withParamsResourceExpression);

    if (withParams) {
        const [resource] = withParams;
        return resource;
    }

    const withoutParams = path.match(internals.withoutParamsResourceExpression);
    const [resource] = withoutParams;
    return resource;
};
