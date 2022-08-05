/**
 * @module Endpoints
 * @file This module maps HTTPS request method and API enpoints to its configuration object.
 * The objects have the following structure:
 *
 * @property {string} method - The HTTPS request method.
 * @property {string} path - The path to the endpoint.
 * @property {Object} config - Configuration object for this route.
 */
const { Login, User, Role, Permission } = require('modules/authorization/routes');

const Authorization = [
    { method: 'POST', path: '/login', config: Login.login },

    { method: 'GET', path: '/user', config: User.list },
    { method: 'GET', path: '/user/{id}', config: User.get },
    { method: 'POST', path: '/user', config: User.create },
    { method: 'PUT', path: '/user/{id}', config: User.update },
    { method: 'PUT', path: '/user/{id}/roles', config: User.upsertRoles },
    { method: 'DELETE', path: '/user/{id}', config: User.remove },

    { method: 'GET', path: '/role', config: Role.list },
    { method: 'GET', path: '/role/{id}', config: Role.get },
    { method: 'POST', path: '/role', config: Role.create },
    { method: 'PUT', path: '/role/{id}', config: Role.update },
    { method: 'PUT', path: '/role/{id}/permissions', config: Role.upsertPermissions },
    { method: 'DELETE', path: '/role/{id}', config: Role.remove },

    { method: 'GET', path: '/permission', config: Permission.list },
    { method: 'GET', path: '/permission/{id}', config: Permission.get },
    { method: 'POST', path: '/permission', config: Permission.create },
    { method: 'DELETE', path: '/permission/{id}', config: Permission.remove }
];

module.exports = [...Authorization];
