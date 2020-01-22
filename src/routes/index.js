/** 
 * @module Endpoints
 * 
 * @file This module defines configuration objects to map HTTPS request method and API enpoints to its configuration object. 
 * 
 * The objects have the following structure:
 * 
 * @property {string} method  - The HTTPS request method.
 * @property {string} path    - The path to the endpoint.
 * @property {Object} config  - Configuration object for this route.
 */
import authentication from './authentication';
import user from './user';

export default [
    { method: 'POST', path: '/api/login', config: authentication.login },
    { method: 'GET', path: '/api/user', config: user.list },
    { method: 'GET', path: '/api/user/{id}', config: user.get },
    { method: 'POST', path: '/api/user', config: user.create },
    { method: 'PUT', path: '/api/user/{id}', config: user.edit },
    { method: 'DELETE', path: '/api/user/{id}', config: user.remove } 
];
