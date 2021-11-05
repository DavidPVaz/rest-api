const Hapi = require('@hapi/hapi');
const Logger = require('test/fixtures/logger-plugin');
const Repository = require('plugins/repository');

/**
 * Initializes a server.
 * @param {Array<string>} models the domain models.
 * @returns server the initialized server.
 */
exports.init = models => {
    const server = Hapi.server();
    const defaultPlugins = [Logger, { plugin: Repository, options: { models } }];

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
