const Hapi = require('@hapi/hapi');
const Logger = require('test/fixtures/logger-plugin');

/**
 * Initializes a server.
 * @async
 * @returns server the initialized server.
 */
exports.init = () => {
    const server = Hapi.server();
    const defaultPlugins = [Logger];

    defaultPlugins.forEach(plugin => server.register(plugin));
    return server;
};

/**
 * Destroys a server.
 * @async
 * @param {Object} server the server to destroy.
 */
exports.destroy = async function (server) {
    await server.stop();
};
