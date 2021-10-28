/**
 * @module EndpointsPlugin
 */
/**
 * Plugin registration function
 * @param {Hapi.Server} server the hapi server
 */
const register = function (server) {
    const endpoints = require('routes');
    server.route(endpoints);
    server.logger.child({ plugin: exports.plugin.name }).debug('started');
};

exports.plugin = {
    name: 'endpoints',
    register
};
