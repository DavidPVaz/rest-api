/**
 * @module LoggerPlugin
 * Wraps the pino logger
 */
const Pino = require('pino');
const HapiPino = require('hapi-pino');
const Package = require('package.json');
const Config = require('config');

const internals = {};

internals.environment = Config.environment !== 'development' && Config.environment !== 'testing';
internals.logLevel = Config.debug ? 'debug' : 'info';

internals.options = {
    level: internals.logLevel,
    prettyPrint: !internals.environment,
    forceColor: !internals.environment
};

/**
 * Plugin registration function
 * @async
 * @param {Hapi.Server} server the hapi server
 */
const register = async function (server) {
    const options = {
        ...internals.options,
        name: server.settings.app.name
    };

    await server.register({ plugin: HapiPino, options });
    internals.pino = server.logger;

    server.events.on('route', event => {
        server.logger.child({ method: event.method, path: event.path }).debug('route');
    });

    server.logger.child({ plugin: exports.plugin.name }).debug('plugin');
};

/**
 * Gets a logger instance
 * @returns {Logger} the logger instance
 */
exports.getLogger = () => internals.pino || Pino(internals.options);

exports.plugin = {
    name: 'logger',
    pkg: Package,
    register
};
