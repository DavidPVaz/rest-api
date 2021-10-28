/**
 * @module Config
 */
const crypto = require('crypto');
const fs = require('fs');

exports.prefixes = {
    api: '/api'
};

exports.debug = process.env.DEBUG || false;
exports.environment = process.env.NODE_ENV || 'development';
/**
 * `Secret` used to generate Json Web Token.
 */
exports.secret = crypto.randomBytes(256).toString('base64');

/**
 * Server API props
 */
exports.api = {
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 8000,
    cors: {
        origin: ['*'],
        maxAge: 3600
    },
    tls: {
        key: fs.readFileSync('config/tls/server.key'),
        cert: fs.readFileSync('config/tls/server.crt')
    }
};
/**
 * Hapi Swagger tag settings
 */
exports.documentationTags = [
    {
        tags: ['api', 'Authorization'],
        routesPath: 'modules/authorization/routes'
    }
];
