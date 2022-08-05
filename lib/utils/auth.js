/**
 * @module Auth-Hash
 */
const Crypto = require('crypto');
const JsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const internals = {};

// Randomly create a safe secret for usage in the server
internals.secret = function () {
    const secret = Crypto.randomBytes(256).toString('base64');
    console.log('Randomly generated secret for usage in JWT_SECRET environment variable:\n');
    console.log(`JWT_SECRET=${secret}`);
};

// Obtain a JWT auth token for test purposes
internals.token = function (id, expiresIn) {
    console.log(
        `JWT authentication token for test user with id ${id}, ${
            expiresIn ? `expiring in ${expiresIn}` : 'with no expiration'
        } is:\n`
    );
    console.log(exports.getToken(Number.parseInt(id), expiresIn));
};

// Obtain an hashed password for test purposes
internals.hash = async function (password) {
    console.log('Hashed password:\n');
    console.log(await exports.generateHash(password));
};

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
exports.validatePassword = (providedPassword, userPassword) =>
    bcrypt.compare(providedPassword, userPassword);

/**
 * Generates a `signed` Json Web Token.
 * @param {number}  id - Id number to use in the signature.
 * @param {string}  [expiresIn] - Token life time.
 * @return {string} A Json Web Token.
 */
exports.getToken = function (id, expiresIn) {
    const key = Buffer.from(process.env.JWT_SECRET, 'base64');
    const options = expiresIn ? { expiresIn } : {};
    return JsonWebToken.sign({ id }, key, options);
};

const commands = {
    token: () => internals.token(process.argv[3], process.argv[4]),
    secret: internals.secret,
    hash: () => internals.hash(process.argv[3])
};

if (commands[process.argv[2]]) {
    commands[process.argv[2]]();
}
