/**
 * @module AuthPlugin
 */
const HapiJWT = require('hapi-auth-jwt2');
const UserService = require('modules/authorization/services/user');

const internals = {};

internals.validate = async function ({ id }, request) {
    try {
        const user = await UserService.findById(id);

        const credentials = {
            id: user.id,
            username: user.username
        };

        request.logger.debug({ id }, 'jwt valid');
        return { isValid: true, credentials };
    } catch (error) {
        request.logger.debug({ id, error }, 'jwt invalid');
        return { isValid: false };
    }
};

/**
 * Plugin registration function
 * @async
 * @param {Hapi.Server} server the hapi server
 */
const register = async function (server) {
    await server.register(HapiJWT);

    const key = Buffer.from(process.env.JWT_SECRET, 'base64');
    const strategy = 'superAuthStrategy';

    server.auth.strategy(strategy, 'jwt', {
        key,
        validate: internals.validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default(strategy);
    server.logger.child({ plugin: exports.plugin.name }).debug('plugin');
};

exports.plugin = {
    name: 'authentication',
    register
};
