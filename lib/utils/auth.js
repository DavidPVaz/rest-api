/**
 * @module Hash-Util
 */
const bcrypt = require('bcrypt');
/**
 * Generates an hashed password.
 * @async
 * @param {string} password - The password to hash.
 * @return {Promise<string>} A Promise to be either resolved with the hashed password or rejected with an Error.
 */
exports.generateHash = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
/**
 * Validates a password against the hashed one.
 * @param {string} providedPassword - Password to validate.
 * @param {string} userPassword - Hashed password to compare.
 * @return {Promise<boolean>} A Promise to be either resolved with the result of the comparison or rejected with an Error.
 */
exports.validatePassword = function (providedPassword, userPassword) {
    return bcrypt.compare(providedPassword, userPassword);
};
