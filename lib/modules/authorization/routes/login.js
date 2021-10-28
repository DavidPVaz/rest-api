/**
 * @module AuthRoutes
 * @file Defines authentication route configuration object.
 */
const validator = require('modules/authorization/validators/login');
const LoginController = require('modules/authorization/controllers/login');

exports.login = {
    description: 'Authenticate user credentials',
    auth: false,
    handler: LoginController.login,
    validate: {
        payload: validator.validateCredentials()
    }
};
