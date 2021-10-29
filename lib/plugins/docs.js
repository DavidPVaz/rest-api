/**
 * @module DocumentationPlugin
 * Works as a wrapper around Swagger
 */
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Swagger = require('hapi-swagger');
const Package = require('package.json');
const Config = require('config');

const internals = {};
/**
 * Options configuration for Swagger
 */
internals.options = {
    host: `${Config.api.host}:${Config.api.port}`,
    jsonPath: '/api-spec.json',
    info: {
        title: 'Api Documentation',
        version: Package.version
    },
    grouping: 'tags',
    definitionPrefix: 'useLabel',
    sortEndpoints: 'method',
    documentationPath: '/docs'
};
/**
 * Mapping routes to documentation tag category
 */
internals.documentationTags = () =>
    Config.documentationTags.map(tagConfig => ({
        tags: tagConfig.tags,
        routes: require(tagConfig.routesPath)
    }));
/**
 * Applying swagger tags automatically, instead of manually inserting tags on each route
 */
internals.applyDocumentationTags = function () {
    const documentationTags = internals.documentationTags();

    documentationTags.forEach(config =>
        Object.values(config.routes).forEach(route =>
            Object.values(route).forEach(endpoint => (endpoint.tags = config.tags))
        )
    );
};

/**
 * Plugin registration function
 * @async
 * @param {Hapi.Server} server the hapi server
 */
const register = async function (server) {
    if (Config.environment === 'production') {
        return;
    }

    await server.register([
        Inert,
        Vision,
        {
            plugin: Swagger,
            options: internals.options
        }
    ]);

    internals.applyDocumentationTags();
    server.logger.child({ plugin: exports.plugin.name }).debug('plugin');
};

exports.plugin = {
    name: 'docs',
    pkg: Package,
    register
};
