/**
 * @module Server
 */
const Boom = require('@hapi/boom');
const Glue = require('@hapi/glue');
const Config = require('config');
const Plugins = require('plugins');
const qs = require('qs');
/**
 * Manifest object with server configurations
 */
const manifest = {
    server: {
        query: {
            parser: query => qs.parse(query)
        },
        host: Config.api.host,
        port: Config.api.port,
        tls: Config.api.tls,
        routes: {
            validate: {
                failAction: async (request, h, err) => {
                    if (Config.debug) {
                        throw err;
                    } else {
                        throw Boom.badRequest('Invalid request payload input');
                    }
                }
            },
            cors: Config.api.cors
        }
    },
    register: { plugins: Plugins }
};
/**
 * Graceful server shutdown
 */
const registerNodeSignals = function (hapi) {
    const nodeSignals = ['exit', 'SIGINT'];

    nodeSignals.forEach(function (signal) {
        process.on(signal, function () {
            hapi.stop().then(function (err) {
                console.log('Hapi server stopped');
                process.exit(err ? 1 : 0);
            });
        });
    });
};

module.exports = {
    build: () => Glue.compose(manifest),
    registerNodeSignals
};
