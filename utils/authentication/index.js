/** 
 * @module Authentication-Util 
 */
import jsonWebToken from 'jsonwebtoken';
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
function sign(id, username, admin) {
    return jsonWebToken.sign({ id, username, admin }, Config.secret, { expiresIn: '30m' });
}
/**
 * Verifies if the Json Web Token signature is `valid`.
 *
 * @param {string} token - The Json Web Token to verify.
 * 
 * @return {*} The decoded token or an Error if the signature is invalid.
 */
function compare(token) {
    return jsonWebToken.verify(token, Config.secret);
}

export { sign, compare };
