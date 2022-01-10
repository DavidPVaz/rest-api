/**
 * @module Endpoints
 * @file This module maps HTTPS request method and API enpoints to its configuration object.
 * The objects have the following structure:
 *
 * @property {string} method - The HTTPS request method.
 * @property {string} path - The path to the endpoint.
 * @property {Object} config - Configuration object for this route.
 */
const { Login, User, Role } = require('modules/authorization/routes');

module.exports = [
    { method: 'POST', path: '/login', config: Login.login },
    { method: 'GET', path: '/user', config: User.list },
    { method: 'GET', path: '/user/{id}', config: User.get },
    { method: 'POST', path: '/user', config: User.create },
    { method: 'PUT', path: '/user/{id}', config: User.update },
    { method: 'DELETE', path: '/user/{id}', config: User.remove },
    { method: 'GET', path: '/role', config: Role.list },
    { method: 'GET', path: '/role/{id}', config: Role.get },
    { method: 'PUT', path: '/role/{id}', config: Role.update },
    { method: 'PUT', path: '/role/{id}/permissions', config: Role.updatePermissions },
    { method: 'DELETE', path: '/role/{id}', config: Role.remove }
];
