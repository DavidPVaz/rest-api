/**  
 * @module UserService 
 */
import { transaction } from 'objection';
import userDao from '../dao/user';
/**
 * Checks if the provided `username` or `email` already exist.
 * 
 * @param {Object} user - User data to verify.
 * 
 * @throw Will throw an Error if any match is found in the database.
 */
async function checkForExistingValues(user) {

    const { username, email } = user;

    let existsWithUsername;
    let existsWithEmail;

    try {
        existsWithUsername = await userDao.findBy('username', username);
        existsWithEmail = await userDao.findBy('email', email);
    } catch (error) {
        console.error(error.message);
    }

    if (existsWithUsername) {
        throw Error('That username already exists.');
    }

    if (existsWithEmail) {
        throw Error('That email already exists.');
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

    let user;

    try {
        user = await userDao.findById(id);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${id} was not found`);
    }
}
/**
 * `Fetch` all users from the database.
 *
 * @return {Object[]} An array with all the users.
 * 
 * @throw Will throw an Error if there are no users in the database.
 */
async function list() {

    let list;

    try {
        list = await userDao.list();
    } catch (error) {
        console.error(error.message);
    }

    if (list.length === 0) {
        throw Error('No users to list.');
    }

    return list;
}
/**
 * `Fetch` a single user from the database.
 *
 * @param {string}                  field - The column name in the users table.
 * @param {(string|number|boolean)} value - Value associated with that column.
 * 
 * @return {Object} The queried user.
 * 
 * @throw Will throw an Error if an user with the provided value is not found in the database.
 */
async function get(field, value) {

    let user;

    try {
        user = await userDao.findBy(field, value);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${value} was not found`);
    }

    return user;
}
/**
 * `Creates` a new user in the database.
 *
 * @param {Object} user - User data to persist.
 * 
 * @return {Promise<Object>} A Promise to be either resolved with the inserted user or rejected with an Error.
 * 
 * @throw Will throw an Error if the provided `username` or `email` values of the user data already exists in the database. 
 */
function create(user) {
    return transaction(userDao.getModel(), async txUser => {
        await checkForExistingValues(user);
        return userDao.create(txUser, user);
    });
}
/**
 * `Updates` an existing user in the database.
 *
 * @param {number} id          - Id number of the user.
 * @param {Object} updatedUser - Updated user data.
 * 
 * @return {Promise<number>} A Promise to be either resolved with the number of updated users or rejected with an Error.
 * 
 * @throw Will throw an Error if an user with the provided `id` is not found in the database, or if the provided `username` 
 * or `email` values already exist.
 */
function edit(id, updatedUser) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        await checkForExistingValues(updatedUser);
        return userDao.edit(txUser, id, updatedUser);
    });
}
/**
 *`Deletes` an existing user from the database.
 *
 * @param {number} id - Id number of the user.
 * 
 * @return {Promise<number>} A Promise to be either resolved with the number of deleted users or rejected with an Error.
 * 
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
function deleteUser(id) {
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
    deleteUser
};
