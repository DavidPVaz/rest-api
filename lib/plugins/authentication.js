/**
 * @module AuthPlugin
 */
const HapiJWT = require('hapi-auth-jwt2');
const UserService = require('modules/authorization/service/user');
const Config = require('config');

const validate = async function ({ id }) {
    try {
        await UserService.findById(id);
        return { isValid: true };
    } catch (error) {
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

    const key = Buffer.from(Config.secret, 'base64');
    const strategy = 'superAuthStrategy';

    server.auth.strategy(strategy, 'jwt', {
        key,
        validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default(strategy);
};

module.exports = {
    name: 'authentication',
    register
};
