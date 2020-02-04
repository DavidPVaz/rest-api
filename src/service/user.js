/**
 * @module UserService
 */
import { transaction } from 'objection';
import userDao from '../dao/user';
import { generateHash } from '../../utils/hash';
/**
 * Checks if the provided `username` or `email` already exist.
 *
 * @param {Object} user - User data to verify.
 *
 * @throw Will throw an Error if any match is found in the database.
 */
async function checkForExistingValues(user, id = 0) {
    const { username, email } = user;

    const result =
        username || email
            ? await userDao
                  .getModel()
                  .query()
                  .whereNot('id', id)
                  .where(builder =>
                      builder
                          .skipUndefined()
                          .where('username', username)
                          .orWhere('email', email)
                  )
            : [];

    if (result.length > 0) {
        const field = result[0].username === username ? 'username' : 'email';
        const message = `That ${field} already exists`;
        throw Error(message);
    }
}
/**
 * Checks if the provided `id` refers to an existing user.
 *
 * @param {number} id - Id number to verify.
 *
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
async function checkIfUserExists(id) {
    const user = await userDao.findById(id);

    if (!user) {
        throw Error(`User ${id} was not found`);
    }
}
/**
 * `Fetch` all users from the database.
 *
 * @return {Promise<Object[]>} An array with all the users.
 *
 * @throw Will throw an Error if there are no users in the database.
 */
function list() {
    return userDao.list();
}
/**
 * `Fetch` a single user from the database.
 *
 * @param {string}         field - The column name in the users table.
 * @param {(string|number} value - Value associated with that column.
 *
 * @return {Promise<Object>} The queried user.
 *
 * @throw Will throw an Error if an user with the provided value is not found in the database.
 */
function get(field, value) {
    return userDao.findBy(field, value);
}
/**
 * `Creates` a new user in the database.
 *
 * @param {Object} user - User data to persist.
 *
 * @return {Promise<Object>} The created user.
 *
 * @throw Will throw an Error if the provided `username` or `email` values of the user data already exists in the database.
 */
function create(user) {
    return transaction(userDao.getModel(), async txUser => {
        await checkForExistingValues(user);
        const { password } = user;
        user.password = await generateHash(password);
        return userDao.create(txUser, user);
    });
}
/**
 * `Updates` an existing user in the database.
 *
 * @param {number} id          - Id number of the user.
 * @param {Object} updatedUser - Updated user data.
 *
 * @return {Promise<number>} The number of updated rows.
 *
 * @throw Will throw an Error if an user with the provided `id` is not found in the database, or if the provided `username`
 * or `email` values already exist.
 */
function edit(id, updatedUser) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        await checkForExistingValues(updatedUser, id);
        return userDao.edit(txUser, id, updatedUser);
    });
}
/**
 *`Deletes` an existing user from the database.
 *
 * @param {number} id - Id number of the user.
 *
 * @return {Promise<number>} The number of deleted rows.
 *
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
function remove(id) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        return userDao.delete(txUser, id);
    });
}

export default {
    list,
    get,
    create,
    edit,
    remove
};
