/**
 * @module UserService
 */
const Config = require('config');
const UserDao = require('dao/user');
const { transaction } = require('objection');
const Authentication = require('utils/auth');
const APIError = require('errors/api-error');

const internals = {};

/**
 * Add eager fetching for roles
 * @param {boolean} withRoles - whether or not to include roles
 * @param {Objection.QueryBuilder} query - the query builder
 * @return {Objection.QueryBuilder} the query builder
 */
internals.withRoles = (withRoles, query) => (withRoles ? query.withGraphFetched('roles') : query);

/**
 * Checks if the provided `username` or `email` already exist.
 * @async
 * @param {Object} user - User data to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if any match is found in the database.
 */
internals.checkForEqualValues = async function ({ username, email, id }, txModel) {
    const result =
        username || email
            ? await txModel
                  .query()
                  .whereNot({ id })
                  .where(builder => builder.skipUndefined().where({ username }).orWhere({ email }))
            : [];

    if (result.length > 0) {
        const field = result[0].username === username ? 'username' : 'email';
        const message = `That ${field} already exists`;
        throw APIError.RESOURCE_DUPLICATE(message);
    }
};
/**
 * Checks if the provided `id` refers to an existing user.
 * @async
 * @param {number} id - Id number to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
internals.checkIfUserExists = async function (id, txModel) {
    const user = await txModel.findById(id);
    APIError.assert(user, APIError.RESOURCE_NOT_FOUND);
};

/**
 * Authenticates an existing user.
 * @async
 * @param {Object} user - user to validate.
 * @return {string} An authentication token (JWT).
 */
exports.authenticate = async function ({ username, password }) {
    const user = await UserDao.findOne({ username });
    APIError.assert(user, APIError.AUTH_INVALID_CREDENTIALS);
    const isValid = await Authentication.validatePassword(password, user.password);
    APIError.assert(isValid, APIError.AUTH_INVALID_CREDENTIALS);

    return Authentication.getToken(user.id, Config.authentication.renewIn);
};

/**
 * `Fetch` all users from the database.
 * @return {Promise<User[]>} An array with all the users.
 */
exports.list = function () {
    return UserDao.findAll();
};

/**
 * `Fetch` a single user from the database.
 * @param {number} id - user id
 * @return {Promise<User>} The queried user.
 */
exports.findById = function (id) {
    return UserDao.findById(id);
};

/**
 * `Fetch` a single user from the database.
 * @param {Object} [criteria] - criteria object
 * @param {Object|string|number} values - the values to query for.
 * @return {Promise<User>} The queried user.
 */
exports.findOne = function (criteria = {}, ...values) {
    const query = UserDao.findOne(...values);
    internals.withRoles(criteria.withRoles, query);
    return query;
};

/**
 * `Creates` a new user in the database.
 * @param {Object} user - User data to persist.
 * @return {Promise<Object>} The created user.
 */
exports.create = function (user) {
    return transaction(UserDao.getModel(), async txUser => {
        await internals.checkForEqualValues(user, txUser);
        const { password } = user;
        user.password = await Authentication.generateHash(password);
        return txUser.create(user);
    });
};

/**
 * `Updates` an existing user in the database.
 * @param {number} id - id of the user.
 * @param {Object} updatedUser - Updated user data.
 * @return {Promise<number>} The number of updated rows.
 */
exports.edit = function (id, updatedUser) {
    return transaction(UserDao.getModel(), async txUser => {
        await internals.checkIfUserExists(id, txUser);
        await internals.checkForEqualValues({ id, ...updatedUser }, txUser);
        return txUser.edit(id, updatedUser);
    });
};

/**
 *`Deletes` an existing user from the database.
 * @param {number} id - Id number of the user.
 * @return {Promise<number>} The number of deleted rows.
 */
exports.remove = function (id) {
    return transaction(UserDao.getModel(), async txUser => {
        await internals.checkIfUserExists(id, txUser);
        return txUser.delete(id);
    });
};
