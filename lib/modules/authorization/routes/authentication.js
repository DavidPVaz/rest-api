/**
 * @module AuthRoutes
 * @file Defines authentication route configuration object.
 */
const AuthenticationController = require('modules/authorization/controller/authentication');
const { loginValidation } = require('utils/validation');

exports.login = {
    auth: false,
    handler: AuthenticationController.login,
    validate: {
        payload: loginValidation()
    }
};
