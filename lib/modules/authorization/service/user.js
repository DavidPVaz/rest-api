/**
 * @module UserService
 */
const UserDao = require('dao/user');
const { transaction } = require('objection');
const { generateHash } = require('utils/auth');

const internals = {};
/**
 * Checks if the provided `username` or `email` already exist.
 * @async
 * @param {Object} user - User data to verify.
 * @throw Will throw an Error if any match is found in the database.
 */
internals.checkForExistingValues = async function ({ username, email }, id) {
    const result =
        username || email
            ? await UserDao.getModel()
                  .query()
                  .whereNot('id', id)
                  .where(builder => builder.skipUndefined().where({ username }).orWhere({ email }))
            : [];

    if (result.length > 0) {
        const field = result[0].username === username ? 'username' : 'email';
        const message = `That ${field} already exists`;
        throw Error(message);
    }
};
/**
 * Checks if the provided `id` refers to an existing user.
 * @async
 * @param {number} id - Id number to verify.
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
internals.checkIfUserExists = async function (id) {
    const user = await UserDao.findById(id);

    if (!user) {
        throw Error('not found');
    }
};

/**
 * `Fetch` all users from the database.
 * @return {Promise<User[]>} An array with all the users.
 */
exports.list = function () {
    return UserDao.list();
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
 * @param {string} field - The column name in the users table.
 * @param {(string|number} value - Value associated with that column.
 * @return {Promise<User>} The queried user.
 */
exports.findOne = function (field, value) {
    return UserDao.findOne(field, value);
};
/**
 * `Creates` a new user in the database.
 * @param {Object} user - User data to persist.
 * @return {Promise<Object>} The created user.
 */
exports.create = function (user) {
    return transaction(UserDao.getModel(), async txUser => {
        await internals.checkForExistingValues(user);
        const { password } = user;
        user.password = await generateHash(password);
        return UserDao.create(txUser, user);
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
        await internals.checkIfUserExists(id);
        await internals.checkForExistingValues(updatedUser, id);
        return UserDao.edit(txUser, id, updatedUser);
    });
};
/**
 *`Deletes` an existing user from the database.
 * @param {number} id - Id number of the user.
 * @return {Promise<number>} The number of deleted rows.
 */
exports.remove = function (id) {
    return transaction(UserDao.getModel(), async txUser => {
        await internals.checkIfUserExists(id);
        return UserDao.delete(txUser, id);
    });
};
