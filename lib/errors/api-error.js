/**
 * @module APIErrors
 */
const Errors = require('./errors.json');
const Boom = require('@hapi/boom');

const internals = {};

internals.boomFromStr = error => message =>
    Boom.badImplementation(message || error, { timestamp: Date.now() });

internals.boomFromObj = error => message =>
    new Boom.Boom(message || error.message, {
        statusCode: error.statusCode,
        data: { timestamp: Date.now() }
    });

internals.init = function () {
    for (let error in Errors) {
        let errorObj = Errors[error];
        let isString = typeof errorObj === 'string';

        // create new errors by invoking error property: throw APIError.RESOURCE_NOT_FOUND()
        exports[error] = isString
            ? internals.boomFromStr(errorObj)
            : internals.boomFromObj(errorObj);

        exports[error].isAPIError = true;
    }
};

internals.init();

/**
 * Allows for compact one liner assertions with APIErrors
 * eg:
 *      APIError.assert(condition(s), APIError.RESOURCE_FETCH)
 *      APIError.assert(condition(s), APIError.RESOURCE_FETCH(message))
 * @param {boolean} condition the condition to assert
 * @param {(function|Error)} apiError the error to throw
 */
exports.assert = function (condition, apiError) {
    if (condition) {
        return;
    }

    throw apiError.isAPIError ? apiError() : apiError;
};
