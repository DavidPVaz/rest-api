const Hapi = require('@hapi/hapi');

/**
 * Initializes a server.
 * @async
 * @param {string[]} models the domain models.
 * @returns server the initialized server.
 */
exports.init = () => Hapi.server();

/**
 * Destroys a server.
 * @async
 * @param {Object} server the server to destroy.
 */
exports.destroy = async function (server) {
    await server.stop();
};
