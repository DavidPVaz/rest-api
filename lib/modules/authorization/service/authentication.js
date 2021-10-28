/**
 * @module AuthenticationService
 */
const JsonWebToken = require('jsonwebtoken');
const UserService = require('modules/authorization/service/user');
const { validatePassword } = require('utils/auth');
const Config = require('config');

const internals = {};
/**
 * Generates a `signed` Json Web Token.
 * @param {number}  id - Id number to use in the signature.
 * @param {string}  username - Username to use in the signature.
 * @return {string} A Json Web Token.
 */
internals.sign = function (id, username) {
    const key = Buffer.from(Config.secret, 'base64');
    return JsonWebToken.sign({ id, username }, key, { expiresIn: '1h' });
};
/**
 * Authenticates an existing user.
 * @async
 * @param {Object} user - user to validate.
 * @return {string} An authentication token (JWT).
 * @throw Will throw an Error if any of the passed arguments is not valid.
 */
exports.authenticate = async function ({ username, password }) {
    try {
        const user = await UserService.findOne('username', username);
        const isValid = await validatePassword(password, user.password);

        if (!isValid) {
            throw Error();
        }

        return internals.sign(user.id, user.username);
    } catch (error) {
        throw Error('Invalid credentials.');
    }
};
