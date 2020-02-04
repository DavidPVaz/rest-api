/**
 * @module AuthenticationService
 */
import jsonWebToken from 'jsonwebtoken';
import userService from './user';
import { validatePassword } from '../../utils/hash';
import Config from '../../config';
/**
 * Generates a `signed` Json Web Token.
 *
 * @param {number}  id       - Id number to use in the signature.
 * @param {string}  username - Username to use in the signature.
 * @param {boolean} admin    - Admin property to use in the signature.
 *
 * @return {string} A Json Web Token.
 */
function sign(id, username) {
    const key = Buffer.from(Config.secret, 'base64');
    return jsonWebToken.sign({ id, username }, key, { expiresIn: '1h' });
}
/**
 * Authenticates an existing user.
 *
 * @param {string} username - Username to validate.
 * @param {string} password - Password to validate.
 *
 * @return {string} An authentication token (JWT).
 *
 * @throw Will throw an Error if any of the passed arguments is not valid.
 */
async function authenticate(username, password) {
    try {
        const user = await userService.get('username', username);

        const isValid = await validatePassword(password, user.password);

        if (!user || !isValid) {
            throw Error();
        }

        return sign(user.id, user.username);
    } catch (error) {
        throw Error('Invalid credentials.');
    }
}

export default {
    authenticate
};
