/**
 * @module Endpoints
 * @file This module maps HTTPS request method and API enpoints to its configuration object.
 * The objects have the following structure:
 *
 * @property {string} method - The HTTPS request method.
 * @property {string} path - The path to the endpoint.
 * @property {Object} config - Configuration object for this route.
 */
const { Authentication } = require('modules/authorization/routes');
const { User } = require('modules/authorization/routes');

module.exports = [
    { method: 'POST', path: '/api/login', config: Authentication.login },
    { method: 'GET', path: '/api/user', config: User.list },
    { method: 'GET', path: '/api/user/{id}', config: User.get },
    { method: 'POST', path: '/api/user', config: User.create },
    { method: 'PUT', path: '/api/user/{id}', config: User.edit },
    { method: 'DELETE', path: '/api/user/{id}', config: User.remove }
];
