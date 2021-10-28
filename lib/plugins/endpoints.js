/**
 * @module EndpointsPlugin
 */
const endpoints = require('routes');

/**
 * Plugin registration function
 * @param {Hapi.Server} server the hapi server
 */
const register = function (server) {
    server.route(endpoints);
};

module.exports = {
    name: 'enpoints',
    register
};
